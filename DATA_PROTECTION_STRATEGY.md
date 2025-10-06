# 🛡️ DATA PROTECTION STRATEGY - Phase 1 Migration

**Date**: October 6, 2025  
**Critical Issue**: Manual database changes must NOT be lost during future migrations  

---

## ⚠️ PROBLEM: Ručne promjene u bazi

### Šta smo ručno promijenili u PostgreSQL:

1. ✅ **Operator ID 24 (Supernova)**:
   - `operator_types = '["isp"]'` (bilo `NULL`)
   - `commercial_name = 'Supernova'` (bilo `""`)
   - `description = 'Telekomunikacioni operater (Blicnet grupa)'` (bilo `NULL`)

2. ✅ **Operator ID 18 (M&H Company)**:
   - `commercial_name = 'M&H Company'` (bilo `""`)
   - `description = 'Internet provajder - FTTH i Fixed Wireless usluge'` (bilo `NULL`)

3. ✅ **Svi operateri (31)**:
   - `contact_email` ekstraktovan iz `contact_info->>'email'`
   - `contact_phone` ekstraktovan iz `contact_info->>'telefon'`

4. ✅ **Operateri bez contact_person (4)**:
   - Postavljeno na `'N/A'` (IDs: 18, 21, 24, 27)

5. ✅ **Neaktivni operateri (7)**:
   - `is_active = false` (bilo `true` za sve)

---

## 🚨 RIZIK: Buduća migracija će PREBRISATI ručne izmjene!

Ako ponovo pokrenemo `migrate-operators.js`:
- ❌ **UPSERT** strategija će učitati podatke iz **JSON fajlova**
- ❌ Supernova će opet imati `operator_types = NULL` (jer JSON ima prazne arrays)
- ❌ M&H Company će imati `commercial_name = ""` (jer JSON ima prazno polje)
- ❌ Telefoni će biti `"-"` umjesto `"[potrebno dopuniti]"` (jer JSON ima `"-"`)

---

## ✅ RJEŠENJE: Tri koraka za zaštitu podataka

### Korak 1: **Ažurirati JSON fajlove sa našim izmjenama**

Pre nego što pređemo na PostgreSQL endpoint-e, moramo **sinhronizovati JSON ← PostgreSQL**:

```javascript
// Novi script: scripts/migration/sync-json-from-postgres.js
// Čita PostgreSQL i ažurira JSON fajlove sa našim ručnim izmjenama
```

**Ovo osigurava**:
- ✅ JSON fajlovi su "izvor istine" tokom tranzicionog perioda
- ✅ Backup podataka u JSON formatu
- ✅ Buduća migracija neće prebrisati ručne izmjene

---

### Korak 2: **Napraviti SQL dump baze (safety backup)**

```bash
# Backup operator tabele pre endpoint refaktorisanja
docker exec atlas-postgres pg_dump -U atlas_user -d atlas_db -t operator --inserts > backup/operator_table_backup_2025-10-06.sql
```

**Ovo osigurava**:
- ✅ Puna SQL kopija trenutnog stanja
- ✅ Brz restore ako nešto pođe po zlu
- ✅ Version control friendly format (--inserts)

---

### Korak 3: **Dodati "data freeze" zastavicu u migration script**

```javascript
// U migrate-operators.js dodati check:
const DATA_FREEZE = process.env.DATA_FREEZE === 'true';

if (DATA_FREEZE) {
    console.log('⚠️  DATA FREEZE MODE - Skipping migration to preserve manual changes');
    process.exit(0);
}
```

**Ovo osigurava**:
- ✅ Slučajno pokretanje neće prebrisati podatke
- ✅ Eksplicitna kontrola nad migracijom

---

## 📋 AKCIONI PLAN (Pre refaktorisanja endpoint-a)

### Prioritet 1: Ažurirati JSON fajlove

**Potrebno ažurirati**:

#### 1. `operators/24.json` (Supernova)
```json
{
  "id": 24,
  "naziv": "Supernova (Blicnet d.o.o. Banja Luka)",
  "komercijalni_naziv": "Supernova",  // ← ADD THIS
  "status": "aktivan",
  "opis": "Telekomunikacioni operater (Blicnet grupa)",  // ← ADD THIS
  "napomena": "",
  "detaljne_usluge": {
    "internet": ["internet_ftth"]  // ← ADD AT LEAST ONE SERVICE
  }
}
```

#### 2. `operators/18.json` (M&H Company)
```json
{
  "id": 18,
  "naziv": "M&H Company d.o.o",
  "komercijalni_naziv": "M&H Company",  // ← ADD THIS
  "opis": "Internet provajder - FTTH i Fixed Wireless usluge",  // ← ADD THIS
  "kontakt": {
    "telefon": "[potrebno dopuniti]"  // ← CHANGE FROM "-"
  }
}
```

#### 3. Telefoni u svim JSON fajlovima gdje je "-"
- Promijeniti `"telefon": "-"` → `"telefon": "[potrebno dopuniti]"`

---

### Prioritet 2: Kreirati SQL backup

```bash
# Full operator table backup
docker exec atlas-postgres pg_dump -U atlas_user -d atlas_db -t operator --inserts -f /tmp/operator_backup.sql

# Copy to local
docker cp atlas-postgres:/tmp/operator_backup.sql ./backup/operator_table_2025-10-06.sql
```

---

### Prioritet 3: Dodati DATA_FREEZE u migration script

**Dodati na početak `migrate-operators.js`**:
```javascript
// ==================== DATA FREEZE PROTECTION ====================
// Ako postoje ručne izmjene u bazi, postaviti DATA_FREEZE=true
const DATA_FREEZE = process.env.DATA_FREEZE === 'true';

if (DATA_FREEZE) {
    console.log('⚠️  DATA FREEZE MODE ACTIVE');
    console.log('Migration skipped to preserve manual database changes.');
    console.log('To run migration, remove DATA_FREEZE environment variable.');
    process.exit(0);
}
```

---

## 🎯 PREPORUKA: AUTOMATSKI SYNC SCRIPT

Umjesto ručnog ažuriranja JSON-a, napraviti script:

```javascript
// scripts/migration/sync-json-from-postgres.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function syncJsonFromPostgres() {
    const prisma = new PrismaClient();
    const operators = await prisma.operator.findMany();
    
    for (const op of operators) {
        const jsonPath = path.join(__dirname, '../../operators', `${op.id}.json`);
        
        // Čitaj postojeći JSON
        const existingJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Ažuriraj samo ručno promijenjene kolone
        if (op.commercialName && !existingJson.komercijalni_naziv) {
            existingJson.komercijalni_naziv = op.commercialName;
        }
        if (op.description && !existingJson.opis) {
            existingJson.opis = op.description;
        }
        if (op.contactPerson === 'N/A' && !existingJson.kontakt_osoba) {
            existingJson.kontakt_osoba = 'N/A';
        }
        
        // Zapiši nazad
        fs.writeFileSync(jsonPath, JSON.stringify(existingJson, null, 2));
        console.log(`✅ Synced operator ${op.id}: ${op.commercialName}`);
    }
}
```

---

## 🚀 FINALNI WORKFLOW

### Opcija A: **Minimalni pristup** (brz, ali manuelan)

1. ✅ Ručno ažurirati 2 JSON fajla (18.json, 24.json)
2. ✅ Napraviti SQL backup
3. ✅ Dodati DATA_FREEZE flag u migration script
4. ✅ **Nastaviti sa endpoint refaktorisanjem**

**Vrijeme**: ~15 minuta  
**Rizik**: Nizak (backup postoji)

---

### Opcija B: **Puni pristup** (siguran, automatizovan)

1. ✅ Kreirati `sync-json-from-postgres.js` script
2. ✅ Pokrenuti sync (ažurira sve JSON-e automatski)
3. ✅ Napraviti SQL backup
4. ✅ Dodati DATA_FREEZE flag
5. ✅ Commit JSON promjene u Git
6. ✅ **Nastaviti sa endpoint refaktorisanjem**

**Vrijeme**: ~30 minuta  
**Rizik**: Minimalan (automatski sync + backup + Git history)

---

## 💡 MOJA PREPORUKA: Opcija A (brz pristup)

**Razlog**:
- Samo 2 operatera imaju ručne izmjene koje nisu u JSON-u (Supernova, M&H Company)
- Ostale izmjene (`contact_email`, `contact_phone`, `contact_person`) su **ekstraktovane** iz JSON-a, ne ručno unešene
- `is_active` se automatski derivira iz `status` (već dodato u migration script)

**Plan**:
1. Ažurirati `operators/18.json` i `operators/24.json` (2 fajla)
2. SQL backup (1 komanda)
3. Dodati DATA_FREEZE (10 linija koda)
4. **Nastaviti sa endpoint-om** ✅

---

## ❓ PITANJE ZA TEBE:

**Koji pristup želiš?**

**A) Brzi pristup** - ručno 2 JSON fajla + backup + DATA_FREEZE (15 min)  
**B) Sigurni pristup** - automatski sync script + backup + Git commit (30 min)

Nakon toga nastavljamo sa refaktorisanjem endpoint-a (`/api/save-operator`, `/api/operator/:id`, `/api/operators`).

---

**Šta kažeš? A ili B?** 🤔
