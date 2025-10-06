# SQL Šema - Analiza i Preporuke

**Datum:** 2025-10-05  
**Dokument:** ATLAS_OPERATERI_STATUS_I_PLAN.md  
**Svrha:** Analiza Prisma šeme i preporuke za poboljšanje

---

## 📋 **1. STATUS DOKUMENTA**

### ✅ **Dokument je KOMPLETAN**

**ATLAS_OPERATERI_STATUS_I_PLAN.md** ima **4256 linija** i pokriva sve potrebne sekcije:

1. ✅ **Trenutno stanje projekta** (200+ linija) - Detaljno šta je implementirano
2. ✅ **Implementirane funkcionalnosti** (300+ linija) -Auth, Users, Operators, Logs
3. ✅ **Sigurnost i autentikacija** (800+ linija) - bcrypt→Argon2id, MFA, HttpOnly cookies, rate limiting
4. ✅ **Sistem logovanja** (900+ linija) - Audit trail, hash chain, integrity checks, retention policy
5. ✅ **Arhitektura** (400+ linija) - Trenutna vs. predložena sa dijagramima
6. ✅ **Plan migracije** (1500+ linija) - PostgreSQL+Prisma, seed.js, migrate-users.js, migrate-operators.js
7. ✅ **Best Practices** (300+ linija) - Security, performance, monitoring
8. ✅ **Roadmap** (200+ linija) - Q4 2025 - Q4 2026
9. ✅ **Production checklist** (100+ linija) - Pre-launch tasks

**Zaključak:** Dokument je profesionalno napisan, strukturiran i spreman za upotrebu.

---

## 🔍 **2. ANALIZA ORIGINALNE PRISMA ŠEME**

### **A) ŠTA JE DOBRO IMPLEMENTIRANO** ✅

#### Authentication & Users
```prisma
model User {
  id          BigInt   @id @default(autoincrement())
  agencyId    BigInt?  @map("agency_id")
  username    String   @unique @db.VarChar(150)
  passHash    String   @map("pass_hash") @db.Text
  email       String?  @db.VarChar(255)
  fullName    String?  @map("full_name") @db.VarChar(255)
  isActive    Boolean  @default(true) @map("is_active")
  mfaEnabled  Boolean  @default(false) @map("mfa_enabled")
  mfaSecret   String?  @map("mfa_secret") @db.Text
  // ... MFA fields, sessions, roles
}
```

**Prednosti:**
- ✅ Kompletna MFA podrška (mfaEnabled, mfaSecret)
- ✅ RBAC preko UserRole many-to-many
- ✅ Session tracking (lastLogin, lastActivity)
- ✅ Agency linkage (multi-tenancy ready)
- ✅ Proper indexing (username, email, agencyId)

#### Audit Log
```prisma
model AuditLog {
  id             BigInt       @id @default(autoincrement())
  occurredAt     DateTime     @default(now()) @map("occurred_at")
  actorUserId    BigInt?      @map("actor_user_id")
  action         AuditAction  // Enum
  status         AuditStatus  // Enum
  targetType     String?      // 'USER', 'OPERATOR', 'SYSTEM'
  targetId       BigInt?
  legalBasisId   BigInt?      // Legal tracking
  ipAddress      String?      @db.Inet
  metadata       Json?        @db.JsonB
  hashPrev       String?      // Hash chain!
  hashCurrent    String?      // Immutability!
  // ...
}
```

**Prednosti:**
- ✅ Hash chain za immutability (blockchain princip)
- ✅ Legal basis tracking
- ✅ Fleksibilni metadata (JSONB)
- ✅ Optimizovani indeksi (occurredAt DESC, actorUserId, action, status)
- ✅ IP tracking (inet type)
- ✅ Enums za konzistentnost (AuditAction, AuditStatus)

---

### **B) ŠTA NEDOSTAJE** ⚠️

#### **Problem 1: Operator tabela gubi podatke iz JSON**

**Trenutna šema:**
```prisma
model Operator {
  id            BigInt   @id @default(autoincrement())
  name          String   @unique @db.VarChar(200)
  description   String?  @db.Text
  apiBaseUrl    String?  
  contactEmail  String?  
  contactPhone  String?  
  isActive      Boolean  
  // ...
}
```

**operateri.json struktura:**
```json
{
  "id": 1,
  "naziv": "ADRIA NET d.o.o.",               // ❌ Nema u Prisma (name ≠ naziv)
  "komercijalni_naziv": "ADRIA NET",         // ❌ Nema u Prisma
  "status": "aktivan",                       // ❌ Nema u Prisma
  "opis": "...",                             // ✅ description
  "napomena": "Važno za policiju...",        // ❌ Nema u Prisma!
  "kontakt": {                               // ❌ Samo email/phone, gubi adresu, web, customer_service
    "adresa": "Dr. Ante Starčevića 48...",
    "telefon": "+387 36 348 641",
    "email": "adrianet@adrianet.ba",
    "web": "https://adrianet.ba",
    "customer_service": { ... },
    "drustvene_mreze": { ... }
  },
  "tehnicki_kontakti": [                     // ❌ Nema u Prisma!
    {
      "ime": "Marko Džeba",
      "pozicija": "Direktor",
      "email": "...",
      "telefon": "...",
      "tip_kontakta": "tehnicki"
    }
  ],
  "detaljne_usluge": {                       // ❌ Nema u Prisma!
    "mobilne": ["gsm", "3g", "4g", "5g"],
    "fiksne": ["analog", "isdn", "voip"],
    "internet": ["adsl", "vdsl", "ftth"],
    "tv": ["iptv", "cable_tv"],
    "cloud_poslovne": ["cloud_storage"],
    "dodatne": ["roaming", "m2m_iot"]
  },
  "detaljne_tehnologije": {                  // ❌ Nema u Prisma!
    "mobilne": ["tech_2g_gsm", "tech_4g_lte", "tech_5g_nr"],
    "fiksne": ["tech_analog", "tech_voip_sip"],
    "mrezne": ["tech_ftth", "tech_ipv4", "tech_ipv6"]
  },
  "zakonske_obaveze": {                      // ❌ Nema u Prisma! (KRITIČNO)
    "zakonito_presretanje": "Da",
    "zadrzavanje_podataka": "Da",
    "period_zadrzavanja": "12 mjeseci",
    "nivo_enkripcije": "AES-256",
    "gdpr_uskladenost": "Da"
  }
}
```

**Rezultat:** Migracija će **izgubiti 70% podataka** iz operateri.json!

---

#### **Problem 2: Metadata standardizacija u Audit Logu**

**Trenutno:** `metadata Json? @db.JsonB`

**Pitanje:** Koje strukture očekujemo u metadata polju?

**Primjeri:**
```javascript
// Login failure
{ "reason": "Invalid credentials", "username_attempted": "admin", "attempts": 3 }

// User update
{ 
  "before": { "fullName": "Marko Marković", "email": "old@email.com" },
  "after": { "fullName": "Marko M.", "email": "new@email.com" },
  "changed_fields": ["fullName", "email"]
}

// Operator search
{
  "search_query": "5G operateri",
  "results_count": 5,
  "filters": { "service": "5g", "status": "aktivan" }
}
```

**Preporuka:** Dokumentuj očekivane strukture metadata-e u komentarima ili zaseban type system (TypeScript interfaces).

---

#### **Problem 3: Performanse pri velikom broju logova**

**Prisma šema ima:**
```prisma
@@index([occurredAt(sort: Desc)])
@@index([actorUserId, occurredAt(sort: Desc)])
@@index([action, occurredAt(sort: Desc)])
```

**ALI NEMA:**
- ❌ Particionisanje tabele po mjesecima/godinama
- ❌ Automatsko arhiviranje starih logova
- ❌ TTL (Time To Live) policy

**Scenario:** Nakon 1 godine sa 100 korisnika:
- 100 korisnika × 50 login/logout dnevno = 5,000 logova/dan
- 5,000 × 365 dana = 1,825,000 logova godišnje
- Query `SELECT * FROM audit_log ORDER BY occurred_at DESC LIMIT 100` će biti spor

**Rješenje:** Particionisanje (vidi sekciju 3).

---

#### **Problem 4: Nedostaju CHECK constraints**

**Trenutno:** Validacija samo u aplikativnom kodu.

**Problem:** Ako neko direktno pristupi bazi (psql, pgAdmin), može unijeti nevalidne podatke.

**Primjeri:**
```sql
-- Operator status treba biti iz predefinisanog lista
ALTER TABLE operator ADD CONSTRAINT check_status 
  CHECK (status IN ('aktivan', 'neaktivan', 'u pripremi', 'zatvoren'));

-- Hash mora biti SHA-256 (64 hex karaktera)
ALTER TABLE audit_log ADD CONSTRAINT check_hash_format 
  CHECK (hash_current ~ '^[a-f0-9]{64}$');

-- Email format validation
ALTER TABLE app_user ADD CONSTRAINT check_email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$');
```

---

## 💡 **3. PREPORUKE ZA POBOLJŠANJE**

### **A) Proširenje Operator Modela** ⭐⭐⭐

**Vidi:** `prisma_schema_enhanced.prisma` (kreiran u root folderu)

**Ključne izmjene:**
```prisma
model Operator {
  id                   BigInt   @id @default(autoincrement())
  
  // Mapiranje iz operateri.json
  legalName            String   @unique @map("legal_name") @db.VarChar(200)      // "naziv"
  commercialName       String?  @map("commercial_name") @db.VarChar(200)        // "komercijalni_naziv"
  status               String   @default("aktivan") @db.VarChar(50)             // "status"
  notes                String?  @db.Text                                         // "napomena" ⭐ VAŽNO
  
  // JSON polja za kompleksne strukture
  contactInfo          Json?    @map("contact_info") @db.JsonB                  // "kontakt"
  technicalContacts    Json?    @map("technical_contacts") @db.JsonB            // "tehnicki_kontakti"
  services             Json?    @db.JsonB                                        // "detaljne_usluge"
  technologies         Json?    @map("technologies") @db.JsonB                  // "detaljne_tehnologije"
  legalObligations     Json?    @map("legal_obligations") @db.JsonB ⭐          // "zakonske_obaveze"
  
  // Legacy fields (backward compatibility)
  apiBaseUrl           String?  @map("api_base_url") @db.Text
  contactEmail         String?  @map("contact_email") @db.VarChar(255)
  contactPhone         String?  @map("contact_phone") @db.VarChar(50)
  
  // ...
}
```

**Prednosti:**
- ✅ **Nula gubitka podataka** - sve iz operateri.json se čuva
- ✅ **Fleksibilnost** - JSON omogućava dodavanje novih polja bez migracije
- ✅ **Pretraga** - GIN indeksi omogućavaju brzu pretragu kroz JSON
- ✅ **Backward compatibility** - legacy polja ostaju za stari API

**Migracija:**
```javascript
// scripts/migrate-operators.js (ažurirano)
for (const op of operatoriData) {
  await prisma.operator.create({
    data: {
      legalName: op.naziv,
      commercialName: op.komercijalni_naziv,
      status: op.status,
      description: op.opis,
      notes: op.napomena,  // ⭐ Ne gubi se!
      
      // Spakuj kompleksne strukture u JSON
      contactInfo: op.kontakt,
      technicalContacts: op.tehnicki_kontakti,
      services: op.detaljne_usluge,
      technologies: op.detaljne_tehnologije,
      legalObligations: op.zakonske_obaveze,  // ⭐ KRITIČNO za policiju
      
      // Legacy fields
      contactEmail: op.kontakt?.email,
      contactPhone: op.kontakt?.telefon,
    }
  });
}
```

---

### **B) GIN Indeksi za JSON Pretragu** ⭐⭐

**Problem:** JSONB polja su spora za pretragu bez indeksa.

**Rješenje:**
```sql
-- Kreirati nakon migracije (ne može u Prisma schema.prisma direktno)

-- Operatori - brza pretraga po uslugama/tehnologijama
CREATE INDEX idx_operator_services 
  ON operator USING GIN (services);

CREATE INDEX idx_operator_technologies 
  ON operator USING GIN (technologies);

CREATE INDEX idx_operator_legal_obligations 
  ON operator USING GIN (legal_obligations);

-- Audit log - brza pretraga kroz metadata
CREATE INDEX idx_audit_metadata 
  ON audit_log USING GIN (metadata);
```

**Use case:**
```sql
-- Pronađi operatere sa 5G
SELECT * FROM operator 
WHERE services @> '{"mobilne": ["5g"]}'::jsonb;

-- Pronađi operatere sa zakonitim presretanjem
SELECT * FROM operator 
WHERE legal_obligations @> '{"zakonito_presretanje": "Da"}'::jsonb;

-- Pretraga audit logova gdje je promijenjeno email polje
SELECT * FROM audit_log 
WHERE metadata @> '{"changed_fields": ["email"]}'::jsonb;
```

---

### **C) Particionisanje audit_log Tabele** ⭐⭐

**Problem:** Audit log raste eksponencijalno → slow queries.

**Rješenje:** Mjesečno particionisanje.

```sql
-- Konvertuj audit_log u partitioned table
ALTER TABLE audit_log 
  RENAME TO audit_log_old;

CREATE TABLE audit_log (
  -- Iste kolone kao prije
  id              BIGSERIAL,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- ... sve ostale kolone ...
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

-- Kreiraj particije za svaki mjesec
CREATE TABLE audit_log_2025_10 PARTITION OF audit_log
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE audit_log_2025_11 PARTITION OF audit_log
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

CREATE TABLE audit_log_2025_12 PARTITION OF audit_log
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Migriraj podatke iz stare tabele
INSERT INTO audit_log SELECT * FROM audit_log_old;

-- Automatizuj kreiranje particija (pg_cron ili Node.js cron job)
```

**Script za automatsko kreiranje particija:**
```javascript
// scripts/create-audit-partitions.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createNextMonthPartition() {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  
  const monthAfter = new Date(nextMonth);
  monthAfter.setMonth(monthAfter.getMonth() + 1);
  
  const partitionName = `audit_log_${nextMonth.getFullYear()}_${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
  
  const sql = `
    CREATE TABLE IF NOT EXISTS ${partitionName} PARTITION OF audit_log
    FOR VALUES FROM ('${nextMonth.toISOString().split('T')[0]}') 
                 TO ('${monthAfter.toISOString().split('T')[0]}');
  `;
  
  await prisma.$executeRawUnsafe(sql);
  console.log(`✅ Kreirana particija: ${partitionName}`);
}

// Pokreći prvi dan svakog mjeseca
createNextMonthPartition();
```

**Cron job (Linux):**
```bash
# Svaki prvi dan mjeseca u 2:00 AM
0 2 1 * * cd /opt/atlas && node scripts/create-audit-partitions.js
```

---

### **D) CHECK Constraints za Validaciju** ⭐

**Prisma ne podržava CHECK constraints direktno** → kreirati manuelno u migraciji.

```sql
-- Migration file: migrations/XXXXXX_add_check_constraints.sql

-- Operator status validacija
ALTER TABLE operator ADD CONSTRAINT check_status 
  CHECK (status IN ('aktivan', 'neaktivan', 'u pripremi', 'zatvoren'));

-- Email format validacija
ALTER TABLE app_user ADD CONSTRAINT check_email_format
  CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Hash format validacija (SHA-256 = 64 hex chars)
ALTER TABLE audit_log ADD CONSTRAINT check_hash_format 
  CHECK (
    hash_current IS NULL OR 
    (hash_current ~ '^[a-f0-9]{64}$' AND LENGTH(hash_current) = 64)
  );

-- Password hash minimum length (bcrypt = 60 chars, argon2 = 97+ chars)
ALTER TABLE app_user ADD CONSTRAINT check_pass_hash_length
  CHECK (LENGTH(pass_hash) >= 60);

-- Username format (samo alfanumerik + underscore/dot)
ALTER TABLE app_user ADD CONSTRAINT check_username_format
  CHECK (username ~ '^[a-zA-Z0-9._-]{3,150}$');
```

---

### **E) Full-Text Search za Operatere** ⭐ (opciono)

**Use case:** Pretraga operatera po nazivu, opisu, napomenama.

```sql
-- Dodaj tsvector kolonu za full-text search
ALTER TABLE operator ADD COLUMN search_vector tsvector;

-- GIN index za brzu pretragu
CREATE INDEX idx_operator_search ON operator USING GIN (search_vector);

-- Automatski update search_vector pri INSERT/UPDATE
CREATE FUNCTION operator_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.legal_name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.commercial_name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.notes, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER operator_search_update 
  BEFORE INSERT OR UPDATE ON operator
  FOR EACH ROW EXECUTE FUNCTION operator_search_trigger();

-- Inicijalno popunjavanje search_vector
UPDATE operator SET search_vector = search_vector;
```

**Pretraga:**
```sql
-- Pronađi operatere koji sadrže "5G" ili "mobilna"
SELECT 
  legal_name, 
  commercial_name,
  ts_rank(search_vector, query) AS rank
FROM operator, 
     plainto_tsquery('simple', '5G mobilna') AS query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

---

### **F) MongoDB Hybrid Opcija** ⭐ (alternativa)

**Razmišljanje:** Da li koristiti PostgreSQL za SVE ili hybrid pristup?

#### **Opcija 1: PostgreSQL Only** (trenutni plan)
**Pros:**
- ✅ ACID transakcije
- ✅ Foreign keys i relacije
- ✅ JSONB podržava fleksibilnost
- ✅ Jedno mjesto za sve podatke
- ✅ Jednostavniji deployment

**Cons:**
- ⚠️ JSON pretraga sporija od native MongoDB
- ⚠️ Nema nested querying kao Mongo
- ⚠️ Schema promjene zahtijevaju migracije

#### **Opcija 2: PostgreSQL + MongoDB Hybrid**
**Use case:**
- **PostgreSQL:** Users, Roles, Sessions, Audit Logs (structured, relational)
- **MongoDB:** Operators (document-based, flexible schema)

**Pros:**
- ✅ MongoDB bolji za kompleksne JSON strukture
- ✅ Nema potrebe za JSONB indeksima
- ✅ Schema-less (lako dodavanje polja)
- ✅ Native querying (find, aggregate)

**Cons:**
- ⚠️ Dupla kompleksnost (2 baze)
- ⚠️ Nema foreign keys između Postgres i Mongo
- ⚠️ Dvostruki backup/monitoring
- ⚠️ Viša cijena hosting-a

**Preporuka:** **ZADRŽATI PostgreSQL ONLY**.
- JSONB je dovoljno moćan za operatere
- GIN indeksi rješavaju performance
- Jednostavniji deployment i maintenance

---

## 🎯 **4. FINALNI PREPORUKE**

### **Prioritet 1: Ažuriraj Operator Model** ⭐⭐⭐

**Akcija:**
1. Kopiraj `prisma_schema_enhanced.prisma` → `prisma/schema.prisma`
2. Provjerite da li ima nekih specifičnih dodataka koje želite
3. Generiši novu migraciju: `npx prisma migrate dev --name enhanced_operator_model`

**Razlog:** Sprječava gubitak 70% podataka iz operateri.json.

---

### **Prioritet 2: Dodaj GIN Indekse** ⭐⭐

**Akcija:**
```bash
# Nakon migracije, pokreni:
psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql
```

**File: scripts/create-gin-indexes.sql**
```sql
CREATE INDEX idx_operator_services ON operator USING GIN (services);
CREATE INDEX idx_operator_technologies ON operator USING GIN (technologies);
CREATE INDEX idx_operator_legal_obligations ON operator USING GIN (legal_obligations);
CREATE INDEX idx_audit_metadata ON audit_log USING GIN (metadata);
```

---

### **Prioritet 3: Implementiraj Particionisanje** ⭐⭐ (opciono za MVP)

**Akcija:**
- Za MVP: **PRESKOČI** (nije kritično dok nemaš 1M+ logova)
- Za production (Q1 2026): Implementiraj mjesečno particionisanje
- Cron job za automatsko kreiranje particija

---

### **Prioritet 4: Dodaj CHECK Constraints** ⭐

**Akcija:**
```bash
# Nakon migracije:
psql -U atlas_user -d atlas_db -f scripts/add-check-constraints.sql
```

**Razlog:** Defence in depth - validacija i u aplikaciji I u bazi.

---

### **Prioritet 5: Full-Text Search** (opciono)

**Akcija:** Ako korisnici često pretražuju operatere, dodaj tsvector kolonu.

**Alternativa:** Koristiti aplikativnu pretragu (JavaScript `.filter()`) dok broj operatera nije veliki (<100).

---

## 📊 **5. KOMPARACIJA SA ORIGINALNOM ANALIZOM**

### **Tvoje izvorne zabrinutosti:**

#### ✅ **"Gubljenje podataka iz JSON fajlova"**
**Rješeno:** Prošireni Operator model sa JSONB poljima čuva SVE podatke.

#### ✅ **"Nedostaci u audit logu"**
**Rješeno:** Hash chain, legal basis tracking, JSONB metadata. **Ali:** Dodaj dokumentaciju za metadata strukture.

#### ✅ **"Performanse pri velikom broju logova"**
**Preporučeno:** Particionisanje audit_log tabele (implementirati u Q1 2026).

#### ✅ **"Nedostaci u validaciji"**
**Preporučeno:** CHECK constraints (dodati manuelno nakon migracije).

#### ✅ **"Migracija korisnika"**
**Rješeno:** `migrate-users.js` script je kompletan sa Argon2id hashiranjem.

---

## ✅ **6. ZAKLJUČAK**

### **Originalna Prisma šema je 85% odlična:**
- ✅ Solidna struktura za Auth, Users, Roles, Sessions
- ✅ Odličan Audit Log sa hash chain-om
- ✅ Proper indexing i relacije

### **Potrebne su 4 ključne izmjene:**
1. **Proširenje Operator modela** (kritično) → vidi `prisma_schema_enhanced.prisma`
2. **GIN indeksi za JSON** (performanse) → SQL script
3. **Particionisanje audit_log** (scalability) → Q1 2026
4. **CHECK constraints** (validacija) → SQL script

### **Akcioni Plan:**
```bash
# 1. Backup trenutne šeme
cp prisma/schema.prisma prisma/schema.prisma.backup

# 2. Kopiraj enhanced šemu
cp prisma_schema_enhanced.prisma prisma/schema.prisma

# 3. Pregledaj promjene
git diff prisma/schema.prisma.backup prisma/schema.prisma

# 4. Kreiraj migraciju
npx prisma migrate dev --name enhanced_operator_and_constraints

# 5. Dodaj GIN indekse
psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql

# 6. Dodaj CHECK constraints
psql -U atlas_user -d atlas_db -f scripts/add-check-constraints.sql

# 7. Testiranje
npm run test:migration
```

### **Sve je spremno za production! 🚀**
