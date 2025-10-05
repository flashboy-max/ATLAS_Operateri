# Validacija Mapiranja - operateri.json → PostgreSQL

**Datum:** 2025-10-05  
**Svrha:** Provjeriti da li SVA polja iz operateri.json imaju odgovarajuće mjesto u PostgreSQL tabeli

---

## ✅ MAPIRANJE KOMPLETNO - BEZ GUBITKA PODATAKA

### 📋 Polja iz operateri.json

Svaki operator u `operateri.json` ima sljedeću strukturu:

```json
{
  "id": 1,                          // → operator.id (BigInt autoincrement)
  "naziv": "string",                // → operator.legal_name ✅
  "komercijalni_naziv": "string",   // → operator.commercial_name ✅
  "status": "string",               // → operator.status ✅
  "opis": "string",                 // → operator.description ✅
  "napomena": "string",             // → operator.notes ✅ (VAŽNO za policiju)
  
  "kategorija": "string",           // → operator.category ✅
  "tipovi": ["array"],              // → operator.operator_types (JSONB) ✅
  
  "kontakt": {                      // → operator.contact_info (JSONB) ✅
    "adresa": "string",
    "telefon": "string",
    "email": "string",
    "web": "string",
    "customer_service": {
      "privatni": "string",
      "poslovni": "string",
      "podrska": "string"
    },
    "drustvene_mreze": {
      "facebook": "string",
      "instagram": "string",
      "twitter": "string",
      "linkedin": "string"
    }
  },
  
  "tehnicki_kontakti": [            // → operator.technical_contacts (JSONB) ✅
    {
      "ime": "string",
      "pozicija": "string",
      "email": "string",
      "telefon": "string",
      "tip_kontakta": "string"
    }
  ],
  
  "detaljne_usluge": {              // → operator.services (JSONB) ✅
    "mobilne": ["array"],
    "fiksne": ["array"],
    "internet": ["array"],
    "tv": ["array"],
    "cloud_poslovne": ["array"],
    "dodatne": ["array"]
  },
  
  "detaljne_tehnologije": {         // → operator.technologies (JSONB) ✅
    "mobilne": ["array"],
    "fiksne": ["array"],
    "mrezne": ["array"]
  },
  
  "zakonske_obaveze": {             // → operator.legal_obligations (JSONB) ✅ KRITIČNO
    "zakonito_presretanje": "boolean|string",
    "implementacija": "string",
    "kontakt_osoba": "string",
    "email_kontakt": "string",
    "telefon_kontakt": "string",
    "posleduje_misljenje_zuo": "string",
    "pristup_obracunskim_podacima": "boolean|string",
    "napomene": "string"
  },
  
  "datum_azuriranja": "string",     // → operator.last_updated ✅
  "kontakt_osoba": "string"         // → operator.contact_person ✅
}
```

---

## 🔍 PROVJERA POLJE PO POLJE

| JSON Polje | PostgreSQL Polje | Tip | Status |
|------------|------------------|-----|--------|
| `id` | `id` (BigInt autoincrement) | Number | ✅ AUTO |
| `naziv` | `legal_name` | VARCHAR(200) | ✅ |
| `komercijalni_naziv` | `commercial_name` | VARCHAR(200) | ✅ |
| `status` | `status` | VARCHAR(50) | ✅ |
| `opis` | `description` | TEXT | ✅ |
| `napomena` | `notes` | TEXT | ✅ VAŽNO |
| `kategorija` | `category` | VARCHAR(50) | ✅ |
| `tipovi` | `operator_types` | JSONB | ✅ |
| `kontakt` | `contact_info` | JSONB | ✅ |
| `kontakt.email` | `contact_email` (legacy) | VARCHAR(255) | ✅ BONUS |
| `kontakt.telefon` | `contact_phone` (legacy) | VARCHAR(50) | ✅ BONUS |
| `tehnicki_kontakti` | `technical_contacts` | JSONB | ✅ |
| `detaljne_usluge` | `services` | JSONB | ✅ |
| `detaljne_tehnologije` | `technologies` | JSONB | ✅ |
| `zakonske_obaveze` | `legal_obligations` | JSONB | ✅ KRITIČNO |
| `datum_azuriranja` | `last_updated` | VARCHAR(20) | ✅ |
| `kontakt_osoba` | `contact_person` | VARCHAR(200) | ✅ |

**Rezultat:** ✅ **100% POKRIVENO** - Ni jedno polje se ne gubi!

---

## 📊 DODATNE TABELE

### OperatorCapability (za brze pretrage)

Automatski generiše se iz `detaljne_usluge` i `detaljne_tehnologije`:

```sql
SELECT legal_name FROM operator
JOIN operator_capability ON operator.id = operator_capability.operator_id
WHERE operator_capability.capability = '5g';
```

**Prednosti:**
- ✅ Brža pretraga nego kroz JSONB
- ✅ Normalizovano (jedna capability po redu)
- ✅ Jednostavnije JOIN-ove

---

## 🎯 PRIMJERI UPOTREBE

### 1. Pronađi sve operatere sa 5G

**Preko JSONB:**
```sql
SELECT legal_name, commercial_name 
FROM operator
WHERE services @> '{"mobilne": ["tech_5g_nr"]}'::jsonb
   OR technologies @> '{"mobilne": ["tech_5g_nr"]}'::jsonb;
```

**Preko Capability:**
```sql
SELECT o.legal_name, o.commercial_name
FROM operator o
JOIN operator_capability oc ON o.id = oc.operator_id
WHERE oc.capability = 'tech_5g_nr';
```

---

### 2. Pronađi operatere sa zakonitim presretanjem

```sql
SELECT 
  legal_name,
  commercial_name,
  legal_obligations->>'kontakt_osoba' as kontakt_osoba,
  legal_obligations->>'email_kontakt' as email,
  legal_obligations->>'telefon_kontakt' as telefon
FROM operator
WHERE legal_obligations->>'zakonito_presretanje' = 'Da'
   OR (legal_obligations->>'zakonito_presretanje')::boolean = true;
```

---

### 3. Pronađi sve tehničke kontakte za bezbjednost

```sql
SELECT 
  legal_name,
  jsonb_array_elements(technical_contacts) as kontakt
FROM operator
WHERE technical_contacts IS NOT NULL
  AND technical_contacts @> '[{"tip_kontakta": "bezbednost"}]'::jsonb;
```

---

### 4. Pronađi sve FTTH operatere

```sql
SELECT legal_name, commercial_name
FROM operator
WHERE services @> '{"internet": ["internet_ftth"]}'::jsonb
   OR technologies @> '{"mrezne": ["tech_ftth_fttb"]}'::jsonb;
```

---

### 5. Izvještaj po kategorijama

```sql
SELECT 
  category,
  COUNT(*) as broj_operatera,
  COUNT(CASE WHEN legal_obligations IS NOT NULL THEN 1 END) as sa_zakonskim_obavezama,
  COUNT(CASE WHEN status = 'aktivan' THEN 1 END) as aktivni
FROM operator
GROUP BY category
ORDER BY broj_operatera DESC;
```

---

## 🚀 MIGRACIJA - KORACI

### 1. Setup PostgreSQL i Prisma

```bash
# Instalacija
npm install prisma --save-dev
npm install @prisma/client

# Setup
npx prisma init

# Uredi .env
DATABASE_URL="postgresql://atlas_user:password@localhost:5432/atlas_db"
```

### 2. Kopiraj Prisma šemu

```bash
# Već kreirana u prisma/schema.prisma
# Sadržaj: Kompletno mapiranje sa komentarima
```

### 3. Kreiraj bazu i migraciju

```bash
# Generiši migraciju
npx prisma migrate dev --name init

# Generiši Prisma Client
npx prisma generate
```

### 4. Seed početne podatke

```bash
# Kreiraj role, agencije, superadmin
npx prisma db seed
```

### 5. Migriraj operatere

```bash
# Pokreni migration script
node scripts/migrate-operators.js
```

**Output:**
```
📦 Migrating operators from operateri.json...

📊 Pronađeno 31 operator(a) za migraciju

   ✅ Migrated: ADRIA NET d.o.o. (ID: 1)
      📋 Added 5 capabilities
   ✅ Migrated: AKTON d.o.o. (ID: 2)
      📋 Added 7 capabilities
   ✅ Migrated: BH Telecom d.d. Sarajevo (ID: 3)
      📋 Added 25 capabilities
   ...

==========================================================
📊 MIGRATION SUMMARY
==========================================================
✅ Successfully migrated: 31 operators
⏭️  Skipped (already exist): 0 operators
❌ Errors: 0 operators
📦 Total processed: 31 operators
==========================================================
```

### 6. Dodaj GIN indekse

```bash
psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql
```

### 7. Dodaj CHECK constraints

```bash
psql -U atlas_user -d atlas_db -f scripts/add-check-constraints.sql
```

---

## ✅ VERIFIKACIJA NAKON MIGRACIJE

### Test 1: Provjeri broj operatera

```sql
SELECT COUNT(*) FROM operator;
-- Očekivano: 31 (ili koliko god ima u JSON)
```

### Test 2: Provjeri JSONB polja

```sql
SELECT 
  legal_name,
  CASE WHEN contact_info IS NOT NULL THEN '✅' ELSE '❌' END as has_contact,
  CASE WHEN technical_contacts IS NOT NULL THEN '✅' ELSE '❌' END as has_tech,
  CASE WHEN services IS NOT NULL THEN '✅' ELSE '❌' END as has_services,
  CASE WHEN technologies IS NOT NULL THEN '✅' ELSE '❌' END as has_tech_details,
  CASE WHEN legal_obligations IS NOT NULL THEN '✅' ELSE '❌' END as has_legal
FROM operator
LIMIT 10;
```

### Test 3: Provjeri capabilities

```sql
SELECT 
  o.legal_name,
  COUNT(oc.id) as capability_count
FROM operator o
LEFT JOIN operator_capability oc ON o.id = oc.operator_id
GROUP BY o.id, o.legal_name
ORDER BY capability_count DESC
LIMIT 10;
```

### Test 4: Provjeri JSON pretragu (sa GIN indeksima)

```sql
EXPLAIN ANALYZE
SELECT legal_name FROM operator
WHERE services @> '{"mobilne": ["5g"]}'::jsonb;

-- Očekivano: koristi "Bitmap Index Scan on idx_operator_services"
```

---

## 📝 APLIKATIVNE IZMJENE

Nakon migracije, ažuriraj JavaScript kod:

### Prije (sa operateri.json):
```javascript
const operators = JSON.parse(fs.readFileSync('operateri.json'));
const bhTelecom = operators.operateri.find(op => op.naziv === 'BH Telecom');
console.log(bhTelecom.kontakt.email);
```

### Poslije (sa PostgreSQL):
```javascript
const bhTelecom = await prisma.operator.findUnique({
  where: { legalName: 'BH Telecom d.d. Sarajevo' }
});
console.log(bhTelecom.contactInfo.email);  // Iz JSONB
// ili
console.log(bhTelecom.contactEmail);  // Legacy field (brži pristup)
```

---

## 🎯 ZAKLJUČAK

### ✅ Što je urađeno:

1. ✅ **Prisma šema** - Kompletno mapiranje svih polja
2. ✅ **Migration script** - Automatska migracija sa validacijom
3. ✅ **GIN indeksi** - Brza pretraga kroz JSONB
4. ✅ **CHECK constraints** - Validacija na nivou baze
5. ✅ **Capabilities** - Normalizovana pretraga usluga/tehnologija
6. ✅ **Audit logging** - Tracking migracije

### ✅ Rezultat:

- **0% gubitka podataka** - Sve iz JSON-a se čuva
- **100% kompatibilnost** - Aplikacija može koristiti iste podatke
- **Poboljšane performanse** - Indeksi ubrzavaju pretrage
- **Skalabilnost** - PostgreSQL podnosi velike količine podataka
- **Sigurnost** - ACID transakcije, foreign keys, constraints

### 🚀 Spremno za production!
