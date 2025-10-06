# 🔍 NULL VALUES ANALYSIS - PostgreSQL Operator Table

**Date**: October 6, 2025  
**Total Operators**: 31  
**Database**: `atlas_db` → `operator` table

---

## 📊 NULL Values Summary

| Kolona | NULL Count | Populated | Notes |
|--------|------------|-----------|-------|
| `category` | **31/31** | 0/31 | ⚠️ **SVI NULL** - nije u JSON, nije mapirano |
| `api_base_url` | **31/31** | 0/31 | ⚠️ **SVI NULL** - nije u JSON |
| `contact_email` | **31/31** | 0/31 | ⚠️ **SVI NULL** - email je u `contact_info` JSON-u |
| `contact_phone` | **31/31** | 0/31 | ⚠️ **SVI NULL** - telefon je u `contact_info` JSON-u |
| `description` | **2/31** | 29/31 | ✅ Većina popunjena |
| `notes` | **3/31** | 28/31 | ✅ Većina popunjena |
| `contact_person` | **4/31** | 27/31 | ✅ Većina popunjena |
| `commercial_name` | **2/31** | 29/31 | ⚠️ Prazni stringovi, ne NULL |
| `operator_types` | **1/31** | 30/31 | ⚠️ Operator 24 (Supernova) nema tipove |

---

## 🚨 KRITIČNI PROBLEMI (Moraju se riješiti)

### 1. **Operator ID 18: M&H Company** - Nepotpuni podaci

**Status**: `aktivan` ⚠️

| Problem | Vrijednost | Akcija potrebna |
|---------|-----------|-----------------|
| `commercial_name` | **PRAZAN** (`""`) | Dodati komercijalni naziv ili koristiti legal_name |
| `description` | **NULL** | Dodati opis operatera |
| `notes` | **NULL** | Opciono - može ostati NULL |
| `contact_person` | **NULL** | ⚠️ Dodati kontakt osobu |
| `operator_types` | `["isp"]` | ✅ OK |

**JSON source** (`operators/18.json`):
```json
{
  "id": 18,
  "naziv": "M&H Company d.o.o",
  "komercijalni_naziv": "",  ← PRAZAN
  "status": "aktivan",
  "opis": "",                ← PRAZAN
  "napomena": "",            ← PRAZAN
  "kontakt": {
    "adresa": " [potrebno dopuniti]",  ← PRAZAN
    "email": "info@mhcompany.ba"       ← JEDINA VALIDNA INFO
  },
  "tehnicki_kontakti": [],   ← PRAZAN
  "detaljne_usluge": {
    "internet": ["internet_ftth", "internet_fixed_wireless", ...]
  }
}
```

**Preporuka**: 
- Commercial name: `"M&H Company"` ili `"M&H"`
- Description: `"Internet provajder"`
- Contact person: `"N/A"` ili pronaći iz drugih izvora

---

### 2. **Operator ID 24: Supernova (Blicnet)** - Nepotpuni podaci

**Status**: `aktivan` ⚠️

| Problem | Vrijednost | Akcija potrebna |
|---------|-----------|-----------------|
| `commercial_name` | **PRAZAN** (`""`) | Dodati komercijalni naziv (`"Supernova"`) |
| `description` | **NULL** | Dodati opis operatera |
| `notes` | **NULL** | Opciono - može ostati NULL |
| `contact_person` | **NULL** | ⚠️ Dodati kontakt osobu |
| `operator_types` | **NULL** ⚠️ | **KRITIČNO** - nema tipova jer nema usluga u JSON-u! |

**JSON source** (`operators/24.json`):
```json
{
  "id": 24,
  "naziv": "Supernova (Blicnet d.o.o. Banja Luka)",
  "komercijalni_naziv": "",  ← PRAZAN
  "status": "aktivan",
  "opis": "",                ← PRAZAN
  "napomena": "",            ← PRAZAN
  "detaljne_usluge": {
    "mobilne": [],           ← SVE PRAZNO!
    "fiksne": [],
    "internet": [],
    "tv": [],
    "cloud_poslovne": []
  }
}
```

**Preporuka**: 
- Commercial name: `"Supernova"`
- Description: `"Telekomunikacioni operater (Blicnet grupa)"`
- Operator types: **MORA SE UNIJETI RUČNO** - JSON nema podatke!
- Contact person: `"N/A"` ili pronaći iz drugih izvora

---

### 3. **Operator ID 3: BH Telecom** - Prazan `notes`

**Status**: `aktivan` ✅

| Problem | Vrijednost | Akcija potrebna |
|---------|-----------|-----------------|
| `notes` | **PRAZAN** (`""`) | Opciono - već ima detaljan `description` |

**Preporuka**: `notes` može ostati prazan jer je `description` popunjen.

---

### 4. **Operator ID 21: Novotel** - Nema `contact_person`

**Status**: `neaktivan` ⚠️

| Problem | Vrijednost | Akcija potrebna |
|---------|-----------|-----------------|
| `contact_person` | **NULL** | Za neaktivne može biti `"N/A"` |

---

### 5. **Operator ID 27: VKT-Net** - Nema `contact_person`

**Status**: `aktivan` ⚠️

| Problem | Vrijednost | Akcija potrebna |
|---------|-----------|-----------------|
| `contact_person` | **NULL** | ⚠️ Dodati kontakt osobu |

---

## ⚠️ STRUKTURALNI PROBLEMI

### Problem 1: `category` kolona nije mapirana

**Prisma schema** ima `category String?`, ali **JSON nema ovo polje**.

**Opcije**:
1. **Ostaviti NULL** - nije kritično za funkcionalnost
2. **Koristiti `operator_types[0]`** kao glavnu kategoriju
3. **Dodati ručno** - npr. "Mobilni operator", "ISP", "Kablovski operator"

**Preporuka**: **Ostaviti NULL** ili popuniti sa `operator_types[0]` automatski.

---

### Problem 2: `contact_email` i `contact_phone` nisu migrirani

**Prisma schema** ima odvojene kolone, ali **podaci su u `contact_info` JSON-u**.

**Primjer** (BH Telecom):
```json
"contact_info": {
  "email": "info@bhtelecom.ba",
  "telefon": "+387 33 282 282",
  "customer_service": {
    "privatni": "1500",
    "poslovni": "+387 33 000 900"
  }
}
```

**Opcije**:
1. **Ekstraktovati iz JSON-a** - `contact_info->>'email'` i `contact_info->>'telefon'`
2. **Ostaviti NULL** - podaci su dostupni u `contact_info` JSON-u

**Preporuka**: **Ekstraktovati nakon migracije** pomoću SQL update:
```sql
UPDATE operator 
SET contact_email = contact_info->>'email',
    contact_phone = contact_info->>'telefon';
```

---

### Problem 3: `api_base_url` nije u JSON-u

**Nije kritično** - može biti NULL za sve operatere dok ne dobijemo API dokumentaciju.

---

## ✅ RJEŠENJA I AKCIJE

### Prioritet 1: FIX Operator 24 (Supernova) - `operator_types` je NULL

**Problem**: Nema tipova jer JSON ima prazne arrays za sve usluge.

**SQL Fix**:
```sql
UPDATE operator 
SET operator_types = '["isp"]'::jsonb,
    commercial_name = 'Supernova',
    description = 'Telekomunikacioni operater (Blicnet grupa)',
    contact_person = 'N/A'
WHERE id = 24;
```

---

### Prioritet 2: FIX Operator 18 (M&H Company) - `commercial_name` prazan

**SQL Fix**:
```sql
UPDATE operator 
SET commercial_name = 'M&H Company',
    description = 'Internet provajder - FTTH i Fixed Wireless usluge',
    contact_person = 'N/A'
WHERE id = 18;
```

---

### Prioritet 3: Ekstraktovati email i telefon iz `contact_info`

**SQL Fix**:
```sql
UPDATE operator 
SET contact_email = contact_info->>'email',
    contact_phone = contact_info->>'telefon'
WHERE contact_info IS NOT NULL;
```

---

### Prioritet 4: Dodati `category` automatski iz `operator_types[0]`

**SQL Fix**:
```sql
UPDATE operator 
SET category = CASE 
  WHEN operator_types::jsonb ? 'mobilni' THEN 'Mobilni operator'
  WHEN operator_types::jsonb ? 'fiksni' THEN 'Fiksni operator'
  WHEN operator_types::jsonb ? 'isp' THEN 'Internet provajder'
  WHEN operator_types::jsonb ? 'kablovski' THEN 'Kablovski operator'
  WHEN operator_types::jsonb ? 'enterprise' THEN 'Enterprise usluge'
  ELSE 'Telekom operator'
END
WHERE operator_types IS NOT NULL;
```

---

### Prioritet 5: Popuniti manjkajuče `contact_person`

**SQL Fix**:
```sql
-- Za operatere 18, 21, 24, 27
UPDATE operator 
SET contact_person = 'N/A'
WHERE contact_person IS NULL OR contact_person = '';
```

---

## 📋 PREPORUKA ZA PRIJE IMPLEMENTACIJE ENDPOINT-A

**MORA SE URADITI:**

1. ✅ **FIX Supernova (ID 24)** - dodati `operator_types` i `commercial_name`
2. ✅ **FIX M&H Company (ID 18)** - dodati `commercial_name` i `description`
3. ✅ **Ekstraktovati email/telefon** iz `contact_info` JSON-a
4. ⏳ **Opciono: Dodati `category`** automatski iz `operator_types`
5. ⏳ **Opciono: Popuniti `contact_person = 'N/A'`** gdje fali

---

## 🎯 KONAČNA STRATEGIJA

### MINIMALNI FIX (prije prebacivanja na PostgreSQL):

```sql
-- 1. FIX Supernova
UPDATE operator 
SET operator_types = '["isp"]'::jsonb,
    commercial_name = 'Supernova',
    description = 'Telekomunikacioni operater (Blicnet grupa)'
WHERE id = 24;

-- 2. FIX M&H Company
UPDATE operator 
SET commercial_name = 'M&H Company',
    description = 'Internet provajder - FTTH i Fixed Wireless usluge'
WHERE id = 18;

-- 3. Ekstraktovati kontakt podatke
UPDATE operator 
SET contact_email = contact_info->>'email',
    contact_phone = contact_info->>'telefon'
WHERE contact_info IS NOT NULL;

-- 4. Popuniti manjkajuče contact_person
UPDATE operator 
SET contact_person = 'N/A'
WHERE contact_person IS NULL OR contact_person = '';
```

---

## ✅ NAKON FIXA - TREBAMO IMATI:

| Kolona | NULL Count | Status |
|--------|------------|--------|
| `category` | 31/31 | ⚠️ OK - nije kritično |
| `api_base_url` | 31/31 | ⚠️ OK - nije kritično |
| `contact_email` | **0/31** | ✅ **Ekstraktovano** |
| `contact_phone` | **0/31** | ✅ **Ekstraktovano** |
| `description` | **0/31** | ✅ **Sve popunjeno** |
| `notes` | 3/31 | ✅ OK - opciono |
| `contact_person` | **0/31** | ✅ **Sve popunjeno** |
| `commercial_name` | **0/31** | ✅ **Sve popunjeno** |
| `operator_types` | **0/31** | ✅ **Sve popunjeno** |

---

**READY FOR ENDPOINT MIGRATION** ✅
