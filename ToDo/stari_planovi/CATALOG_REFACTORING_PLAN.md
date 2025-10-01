# ATLAS Standardni Katalog - Refaktorisanje Plan

## 📋 PREGLED PROJEKTA

**Cilj**: Izdvojiti standardni katalog usluga i tehnologija iz `app.js` u zaseban, strukturiran i skalabilan sistem.

**Trenutno stanje**: 
- Standardni katalog je hardkodovan u `app.js` (40+ usluga, 25+ tehnologija)
- Nema validacije postojećih operatera protiv kataloga
- Nema mogućnost proširivanja kataloga bez menjanja koda

**Ciljno stanje**:
- JSON-based standardni katalog sa JSON Schema validacijom
- Automatska validacija operatera protiv kataloga
- Fuzzy matching i preporuke za mapiranje
- Verzioniranje i changelog sistema

---

## 🏗️ FAZE IMPLEMENTACIJE

### **FAZA 1: Kreiranje Kanonskog Kataloga** 
*Estimat: 2-3 sata*

#### 1.1 Analiza Postojećih Podataka
- [x] Ekstraktovati sve usluge iz `operateri.json` (već urađeno)
- [ ] Analizirati markdown fajlove operatera u `ToDo/Pojedinacni_operateri/`
- [ ] Kreirati mapiranje postojećih podataka

#### 1.2 Kreiranje `standard_catalog.json`
```json
{
  "metadata": {
    "version": "2.0.0",
    "last_updated": "2025-09-09",
    "description": "ATLAS Standardni Katalog Telekomunikacionih Usluga i Tehnologija",
    "sources": ["BH Telecom", "m:tel", "HT Eronet", "GSMA", "ITU"],
    "total_services": 0,
    "total_technologies": 0
  },
  "services": [
    {
      "id": "mobile_prepaid",
      "naziv": "Mobilni Prepaid",
      "naziv_en": "Mobile Prepaid Service",
      "short_code": "MOB_PRE",
      "kategorija": "mobilni",
      "opis": "Mobilne usluge na prepaid osnovu",
      "status": "active",
      "domain": "mobile",
      "tags": ["mobilni", "prepaid", "osnovne_usluge"],
      "metadata": {
        "billing_type": "prepaid",
        "min_recharge": "5 KM",
        "source": "industry_standard",
        "added_version": "1.0.0"
      }
    }
  ],
  "technologies": [
    {
      "id": "lte_4g",
      "naziv": "4G/LTE",
      "naziv_en": "Long Term Evolution",
      "short_code": "LTE",
      "tip": "bezicna",
      "domain": "access",
      "opis": "Četvrta generacija mobilnih mreža",
      "status": "active",
      "typical_capacity": "150 Mbps",
      "maturity": "production",
      "tags": ["4g", "lte", "mobile", "broadband"],
      "metadata": {
        "release": "3GPP Rel-8",
        "frequency_bands": ["800MHz", "900MHz", "1800MHz", "2600MHz"],
        "deployment_type": "macro",
        "source": "industry_standard",
        "added_version": "1.0.0"
      }
    }
  ]
}
```

#### 1.3 Kreiranje JSON Schema
```json
// standard_catalog.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["metadata", "services", "technologies"],
  "properties": {
    "metadata": {
      "type": "object",
      "required": ["version", "last_updated"],
      "properties": {
        "version": {"type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$"},
        "last_updated": {"type": "string", "format": "date"}
      }
    },
    "services": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "naziv", "kategorija", "status"],
        "properties": {
          "id": {"type": "string", "pattern": "^[a-z0-9_]+$"},
          "naziv": {"type": "string"},
          "kategorija": {"enum": ["mobilni", "telefon", "internet", "televizija", "cloud", "iot", "bezbednost", "ostalo"]},
          "status": {"enum": ["active", "planned", "deprecated"]}
        }
      }
    }
  }
}
```

### **FAZA 2: Generator i Build Sistem**
*Estimat: 1-2 sata*

#### 2.1 Kreiranje Generator Skripta
```javascript
// scripts/generate-catalog.js
const fs = require('fs');
const path = require('path');

// Load JSON catalog
const catalog = JSON.parse(fs.readFileSync('standard_catalog.json', 'utf8'));

// Update totals
catalog.metadata.total_services = catalog.services.length;
catalog.metadata.total_technologies = catalog.technologies.length;

// Generate ES module
const moduleContent = `/**
 * ATLAS Standardni Katalog - Auto-generisan iz standard_catalog.json
 * Version: ${catalog.metadata.version}
 * Last Updated: ${catalog.metadata.last_updated}
 * 
 * ⚠️  NE EDITUJ OVAJ FAJL DIREKTNO!
 * ⚠️  Edituj standard_catalog.json i pokreni: npm run generate-catalog
 */

export const standardCatalog = ${JSON.stringify(catalog, null, 2)};

export const catalogUtils = {
  // Helper functions here
};
`;

fs.writeFileSync('standard_catalog.js', moduleContent);
console.log('✅ Generated standard_catalog.js');
```

#### 2.2 Package.json Scripts
```json
{
  "scripts": {
    "generate-catalog": "node scripts/generate-catalog.js",
    "validate-catalog": "node scripts/validate-catalog.js",
    "analyze-operators": "node scripts/analyze-operators.js"
  }
}
```

### **FAZA 3: Validacija i Analiza**
*Estimat: 2-3 sata*

#### 3.1 Kreiranje Validacionog Sistema
```javascript
// scripts/validate-catalog.js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('standard_catalog.schema.json', 'utf8'));
const catalog = JSON.parse(fs.readFileSync('standard_catalog.json', 'utf8'));

const validate = ajv.compile(schema);
const valid = validate(catalog);

if (!valid) {
  console.error('❌ Catalog validation failed:', validate.errors);
  process.exit(1);
} else {
  console.log('✅ Catalog is valid');
}
```

#### 3.2 Operator Analiza Script
```javascript
// scripts/analyze-operators.js
// Analizira operateri.json i pronalazi missing services/technologies
```

### **FAZA 4: Integracija sa App.js**
*Estimat: 1-2 sata*

#### 4.1 Ažuriranje HTML-a
```html
<!-- index.html -->
<script type="module" src="app.js"></script>
```

#### 4.2 Refaktorisanje app.js
- Import novog modula
- Zamena postojeće `getStandardServicesAndTechnologies()` funkcije
- Dodavanje validacije u `init()` metodu

### **FAZA 5: Mapiranje Postojećih Operatera**
*Estimat: 3-4 sata*

#### 5.1 Automatska Analiza
- Pokretanje analyze-operators.js
- Identifikacija missing items
- Generisanje mapping reporta

#### 5.2 Ručno Mapiranje
- Pregled svih operatera iz `operateri.json`
- Pregled markdown fajlova iz `ToDo/Pojedinacni_operateri/`
- Dodavanje missing items u katalog

### **FAZA 6: Proširivanje Kataloga**
*Estimat: 4-5 sati*

#### 6.1 Dodavanje Industrijkih Standarda
Dodati sve usluge/tehnologije iz komentara:

**Mobile/VAS Services:**
- RCS (Rich Communication Services)
- USSD, IVR/IVR-as-a-service
- SMS A2P / short codes, SMS firewall
- Mobile Financial Services (MFS)
- MVNO services, Wholesale APN
- SIM lifecycle, M2M/IoT SIM management

**IoT/M2M:**
- NB-IoT, LTE-M (eMTC), LoRaWAN
- IoT platforms, device management

**Core/OSS-BSS:**
- PCRF/OCS, Rating & Billing engines
- Diameter, SIP, SBC
- vIMS, cloud-native IMS

**Network Virtualization:**
- vEPC, 5GC, NFV, SDN, MANO
- Kubernetes-based network functions

**Transport/Backhaul:**
- DWDM, OTN, microwave/mmWave
- Network slicing, RAN sharing

**Security:**
- DDoS mitigation, WAF, IPsec VPNs
- SIM fraud detection, SMS firewall

#### 6.2 Dodavanje Metadata
- Capacity specifications
- Frequency bands
- Standard compliance (3GPP, ITU, GSMA)
- Deployment models

### **FAZA 7: UI Poboljšanja**
*Estimat: 2-3 sata*

#### 7.1 Catalog Browser UI
- Stranica za pregled kataloga
- Filter po kategorijama/tipovima
- Search funkcionalnost

#### 7.2 Mapping Status UI
- Prikaz coverage po operateru
- Missing items reports
- Approval workflow za suggestions

---

## 📊 STRUKTURA FAJLOVA (FINALNA)

```
ATLAS html/
├── standard_catalog.json          # Glavni katalog (human-editable)
├── standard_catalog.schema.json   # JSON Schema za validaciju
├── standard_catalog.js            # Auto-generisan ES modul
├── scripts/
│   ├── generate-catalog.js        # Generator
│   ├── validate-catalog.js        # Validacija
│   └── analyze-operators.js       # Operator analiza
├── reports/
│   ├── mapping-status.md          # Mapping status report
│   └── missing-items.csv          # Missing items po operateru
├── app.js                         # Ažuriran (kraći)
├── index.html                     # Ažuriran (type="module")
└── operateri.json                 # Postojeći operateri
```

---

## 🎯 SUCCESS KRITERIJUMI

**Po završetku refaktorisanja:**

1. ✅ `app.js` smanjen za 500+ linija koda
2. ✅ Standardni katalog pokriva 100+ usluga i 50+ tehnologija
3. ✅ Svi postojeći operateri validni protiv kataloga (100% match)
4. ✅ JSON Schema validacija implementirana
5. ✅ Automatski build/validation sistem
6. ✅ Mapping report generisan za sve operatere
7. ✅ Backup compatibility - postojeći kod radi bez promena

---

## 🚀 POKRETANJE

```bash
# Faza 1-2: Setup
npm init -y
npm install ajv ajv-formats

# Faza 3: Validacija
npm run validate-catalog

# Faza 4: Generisanje
npm run generate-catalog

# Faza 5: Analiza
npm run analyze-operators
```

---

## 📝 NOTES

- Sve promene su backwards compatible
- JSON kao source of truth omogućava external tooling
- Schema validacija sprečava greške
- Generator sistem omogućava CI/CD integraciju
- Fuzzy matching može biti dodato kasnije kao FAZA 8
