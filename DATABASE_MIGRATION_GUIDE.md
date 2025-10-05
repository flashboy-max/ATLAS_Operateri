# 🔄 Database Migration - Quick Reference

## Šta je promijenjeno?

### ✅ PRIJE (Staro)
- Operator model sa samo osnovnim poljima (name, description, email, phone)
- **GUBILO SE 70% podataka** iz operateri.json

### ✅ POSLIJE (Novo)
- Operator model sa **SVIM poljima** iz operateri.json
- **0% gubitka podataka** - sve se čuva u JSONB poljima

---

## 📋 Nova Prisma šema

**Lokacija:** `prisma/schema.prisma`

**Ključne izmjene:**

```prisma
model Operator {
  // Osnovno
  legalName            String   // "naziv"
  commercialName       String?  // "komercijalni_naziv"
  status               String   // "status"
  description          String?  // "opis"
  notes                String?  // "napomena" ⚠️ VAŽNO ZA POLICIJU
  category             String?  // "kategorija"
  
  // JSONB polja (kompleksne strukture)
  operatorTypes        Json?    // "tipovi"
  contactInfo          Json?    // "kontakt" (adresa, web, customer_service, drustvene_mreze)
  technicalContacts    Json?    // "tehnicki_kontakti" (array)
  services             Json?    // "detaljne_usluge" (mobilne, fiksne, internet, tv, cloud, dodatne)
  technologies         Json?    // "detaljne_tehnologije" (mobilne, fiksne, mrezne)
  legalObligations     Json?    // "zakonske_obaveze" ⚠️ KRITIČNO ZA POLICIJU
  
  // Dodatno
  lastUpdated          String?  // "datum_azuriranja"
  contactPerson        String?  // "kontakt_osoba"
  
  // Legacy (backward compatibility)
  contactEmail         String?
  contactPhone         String?
  apiBaseUrl           String?
}
```

---

## 🚀 Kako pokrenuti migraciju?

### 1. Setup baze podataka

```bash
# PostgreSQL već instaliran? Provjeri:
psql --version

# Ako nije, instaliraj:
# Ubuntu/Debian: sudo apt install postgresql-15
# Windows: https://www.postgresql.org/download/windows/
```

### 2. Kreiraj bazu

```bash
sudo -u postgres psql
CREATE DATABASE atlas_db;
CREATE USER atlas_user WITH ENCRYPTED PASSWORD 'tvoja_jaka_sifra';
GRANT ALL PRIVILEGES ON DATABASE atlas_db TO atlas_user;
\q
```

### 3. Uredi .env

```bash
# Kreiraj .env fajl u root-u projekta
echo 'DATABASE_URL="postgresql://atlas_user:tvoja_jaka_sifra@localhost:5432/atlas_db"' > .env
```

### 4. Instaliraj Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 5. Primijeni migraciju

```bash
# Generiši migraciju
npx prisma migrate dev --name init

# Generiši Prisma Client
npx prisma generate
```

### 6. Seed početne podatke

```bash
# Kreiraj role i superadmin
npx prisma db seed
```

### 7. Migriraj operatere iz JSON

```bash
# Pokreni migration script
node scripts/migrate-operators.js
```

**Očekivani output:**
```
📦 Migrating operators from operateri.json...
📊 Pronađeno 31 operatera za migraciju

   ✅ Migrated: ADRIA NET d.o.o. (ID: 1)
   ✅ Migrated: BH Telecom d.d. Sarajevo (ID: 2)
   ...

==========================================================
✅ Successfully migrated: 31 operators
⏭️  Skipped (already exist): 0 operators
❌ Errors: 0 operators
==========================================================
```

### 8. Dodaj GIN indekse (za brze pretrage)

```bash
psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql
```

### 9. Dodaj CHECK constraints (za validaciju)

```bash
psql -U atlas_user -d atlas_db -f scripts/add-check-constraints.sql
```

---

## 🔍 Testiranje nakon migracije

### Test 1: Provjeri operatere

```bash
psql -U atlas_user -d atlas_db
SELECT COUNT(*) FROM operator;
```

### Test 2: Provjeri JSONB podatke

```sql
SELECT 
  legal_name,
  contact_info->>'email' as email,
  legal_obligations->>'zakonito_presretanje' as zakonito_presretanje
FROM operator
LIMIT 5;
```

### Test 3: Testiraj JSON pretragu

```sql
-- Pronađi operatere sa 5G
SELECT legal_name, commercial_name FROM operator
WHERE services @> '{"mobilne": ["mobile_5g"]}'::jsonb;

-- Pronađi operatere sa zakonitim presretanjem
SELECT legal_name FROM operator
WHERE legal_obligations @> '{"zakonito_presretanje": "Da"}'::jsonb;
```

---

## 📚 Dodatna dokumentacija

- **Kompletna analiza:** `SQL_SCHEMA_ANALYSIS.md`
- **Validacija mapiranja:** `MIGRATION_VALIDATION.md`
- **Status i plan:** `ATLAS_OPERATERI_STATUS_I_PLAN.md`
- **Prisma šema:** `prisma/schema.prisma`
- **Migration script:** `scripts/migrate-operators.js`
- **GIN indeksi:** `scripts/create-gin-indexes.sql`
- **CHECK constraints:** `scripts/add-check-constraints.sql`

---

## ⚠️ Šta uraditi ako nešto pođe po zlu?

### Problem: Migration failed

```bash
# Resetuj bazu
npx prisma migrate reset

# Ponovi korake 5-9
```

### Problem: Data se ne prikazuje

```bash
# Provjeri migraciju
node scripts/migrate-operators.js

# Provjeri logove
psql -U atlas_user -d atlas_db -c "SELECT * FROM audit_log WHERE action = 'OPERATOR_CREATE';"
```

### Problem: Slow queries

```bash
# Provjeri da li su GIN indeksi kreirani
psql -U atlas_user -d atlas_db -c "\d operator"

# Ako nisu, ponovo ih kreiraj
psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql
```

---

## 🎯 Rezultat

- ✅ **0% gubitka podataka** - Sve iz operateri.json se čuva
- ✅ **100% kompatibilnost** - Aplikacija može koristiti iste podatke
- ✅ **Brže pretrage** - GIN indeksi ubrzavaju JSONB queries
- ✅ **Skalabilnost** - PostgreSQL podnosi milijarde redova
- ✅ **Sigurnost** - ACID transakcije, constraints, audit trail

**Spremno za production! 🚀**
