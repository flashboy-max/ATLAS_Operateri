# ATLAS Katalog Refaktorisanje Plan V2.0

**Datum:** 2025-09-09  
**Verzija:** 2.0 (Revidovana)  
**Status:** Planirana implementacija  

## 📋 **Pregled Izmena**

### **Ključne Ispravke na osnovu feedback-a:**

1. **Normalizacija jezika i statusa** - Kanonski engleski ključevi sa Bosanskim display nazivima
2. **Konzistentna imena svojstava** - Jedinstvena šema za `domain` vs `kategorija` vs `tip`
3. **Jače ID i matching** - Dodati `aliases` i `match_regex` za fuzzy mapiranje
4. **Schema-data usklađenost** - Enum vrednosti usklađene sa postojećim operatorima
5. **Unazad kompatibilnost** - Wrapper funkcije tokom rollout-a
6. **Realniji ciljevi** - 80% auto-match umesto 100%

---

## 🎯 **CILJEVI**

### **Primarne:**
- ✅ Izdvojiti katalog iz `app.js` (2800+ linija → optimizovano)
- ✅ Kanonski JSON source-of-truth sa auto-generisanim JS modulom
- ✅ JSON Schema validacija i CI integracija
- ✅ Fuzzy matching i mapping predlozi
- ✅ 80%+ automatsko mapiranje postojećih operatera

### **Sekundarne:**
- 🔄 Admin UI za ručno odobravanje mapiranja
- 🔄 Kontinuirana validacija novih operatera
- 🔄 Reportovanje i analytics

---

## 📊 **ANALIZA POSTOJEĆEG STANJA**

### **Trenutna struktura:**
```
operateri.json → [operater].detaljne_usluge → { kategorija, naziv, opis, status }
operateri.json → [operater].detaljne_tehnologije → { tip, naziv, opis, kapacitet }
app.js → getStandardServicesAndTechnologies() → hardkodovani array
```

### **Problemi:**
- 🔴 Hardkodovan katalog u app.js (40+ usluga, 25+ tehnologija)
- 🔴 Nekonsistentni statusi: "aktivna"/"aktivan"/"active"
- 🔴 Mešovita imena kategorija: "mobilni"/"mobilne"/"mobile"
- 🔴 Nema fuzzy matching za mapiranje
- 🔴 Nema validacije protiv centralnog kataloga

---

## 🏗️ **ARHITEKTURA**

### **Novi sistem:**
```
standard_catalog.json (Source of Truth)
    ↓ [generator]
standard_catalog.js (ES Module)
    ↓ [import]
app.js → catalogUtils → UI Components
    ↓ [validation]
operateri.json → mapping reports → human review
```

### **Ključne komponente:**
1. **`standard_catalog.json`** - Kanonski katalog (human-editable)
2. **`standard_catalog.schema.json`** - JSON Schema validacija
3. **`scripts/generate-catalog.js`** - Generator JS modula
4. **`scripts/analyze-operators.js`** - Mapping analyzer
5. **`catalogUtils`** - Runtime utilities za fuzzy matching

---

## 📋 **FAZE IMPLEMENTACIJE**

## **FAZA 1: Kanonski Katalog** ⏱️ 2-3h

### **1.1 Kreiranje `standard_catalog.json`**

**Struktura podataka:**
```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-09-09",
    "language": "bs",
    "canonical_status_values": ["active", "planned", "deprecated"],
    "canonical_categories": ["mobile", "fixed", "internet", "tv", "cloud", "iot", "security"],
    "sources": ["BH Telecom", "m:tel", "HT Eronet", "ITU", "GSMA"]
  },
  "services": [
    {
      "id": "mobile_prepaid",
      "domain": "mobile", 
      "naziv": "Mobilni Prepaid",
      "naziv_en": "Mobile Prepaid",
      "short_label": "Prepaid",
      "opis": "Mobilne usluge na prepaid osnovu",
      "status": "active",
      "aliases": ["prepaid", "mobilni_prepaid", "pre-paid"],
      "match_regex": "prepaid|pre.?paid",
      "tags": ["mobile", "prepaid", "basic"],
      "metadata": {
        "billing_type": "prepaid",
        "min_recharge": "5 KM",
        "introduced": "2.0"
      }
    }
  ],
  "technologies": [
    {
      "id": "lte_4g",
      "domain": "access",
      "tip": "wireless",
      "naziv": "4G/LTE",
      "naziv_en": "Long Term Evolution",
      "short_label": "4G",
      "opis": "Četvrta generacija mobilnih mreža",
      "status": "active",
      "aliases": ["4g", "lte", "4g_lte", "lte_4g"],
      "match_regex": "4g|lte",
      "tags": ["mobile", "wireless", "4g"],
      "metadata": {
        "generation": 4,
        "typical_capacity": "150 Mbps",
        "maturity": "production",
        "standard": "3GPP",
        "introduced": "2.0"
      }
    }
  ]
}
```

**Proširene kategorije na osnovu industrije:**
- **Mobile/VAS:** RCS, USSD, IVR, SMS A2P, Mobile Money, MVNO
- **IoT/M2M:** NB-IoT, LTE-M, LoRaWAN, IoT platforms
- **Core/OSS-BSS:** PCRF, OCS, Diameter, SBC, vIMS
- **Network/Cloud:** vEPC, 5GC, NFV, SDN, Network Slicing
- **Access/Fixed:** GPON, XGS-PON, FWA, DOCSIS 3.1
- **Transport:** DWDM, OTN, microwave, RAN sharing
- **Security:** DDoS mitigation, WAF, IPsec VPN, SIM fraud detection
- **TV/Media:** DRM, CAS, HbbTV, VOD, CDN
- **Enterprise:** SIP trunking, Hosted PBX, SD-WAN managed

### **1.2 JSON Schema (`standard_catalog.schema.json`)**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["metadata", "services", "technologies"],
  "properties": {
    "metadata": {
      "type": "object",
      "required": ["version", "last_updated"],
      "properties": {
        "version": {"type": "string", "pattern": "^\\d+\\.\\d+$"},
        "canonical_status_values": {
          "type": "array",
          "items": {"enum": ["active", "planned", "deprecated"]}
        }
      }
    },
    "services": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "domain", "naziv", "status"],
        "properties": {
          "id": {"type": "string", "pattern": "^[a-z0-9_]+$"},
          "domain": {"enum": ["mobile", "fixed", "internet", "tv", "cloud", "iot", "security"]},
          "status": {"enum": ["active", "planned", "deprecated"]},
          "aliases": {"type": "array", "items": {"type": "string"}},
          "match_regex": {"type": "string"}
        }
      }
    },
    "technologies": {
      "type": "array", 
      "items": {
        "type": "object",
        "required": ["id", "domain", "tip", "naziv", "status"],
        "properties": {
          "id": {"type": "string", "pattern": "^[a-z0-9_]+$"},
          "domain": {"enum": ["access", "core", "transport", "cloud", "security"]},
          "tip": {"enum": ["wireless", "fixed", "optical", "ip", "security"]},
          "status": {"enum": ["active", "planned", "deprecated"]}
        }
      }
    }
  }
}
```

---

## **FAZA 2: Generator i Validator** ⏱️ 1-2h

### **2.1 Generator (`scripts/generate-catalog.js`)**
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const catalogPath = 'standard_catalog.json';
const schemaPath = 'standard_catalog.schema.json';
const outputPath = 'generated/standard_catalog.js';

// Load and validate
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv();
const validate = ajv.compile(schema);

if (!validate(catalog)) {
  console.error('❌ Catalog validation failed:', validate.errors);
  process.exit(1);
}

// Auto-calculate totals
catalog.metadata.total_services = catalog.services.length;
catalog.metadata.total_technologies = catalog.technologies.length;
catalog.metadata.generated_at = new Date().toISOString();

// Generate ES module
const jsContent = `/**
 * ATLAS Standard Catalog - AUTO-GENERATED
 * Generated: ${catalog.metadata.generated_at}
 * Version: ${catalog.metadata.version}
 * 
 * ⚠️  WARNING: DO NOT EDIT THIS FILE DIRECTLY
 * Edit standard_catalog.json and run: npm run generate-catalog
 */

export const standardCatalog = ${JSON.stringify(catalog, null, 2)};

// Legacy compatibility wrapper
export function getStandardServicesAndTechnologies() {
  return {
    standardServices: standardCatalog.services,
    standardTechnologies: standardCatalog.technologies
  };
}

// Utility functions
export const catalogUtils = {
  getServiceById: (id) => standardCatalog.services.find(s => s.id === id),
  getTechnologyById: (id) => standardCatalog.technologies.find(t => t.id === id),
  getServicesByDomain: (domain) => standardCatalog.services.filter(s => s.domain === domain),
  getTechnologiesByDomain: (domain) => standardCatalog.technologies.filter(t => t.domain === domain),
  
  // Fuzzy matching
  fuzzyMatchService: (query) => {
    const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    return standardCatalog.services.filter(s => {
      // Exact ID match
      if (s.id === normalized) return true;
      
      // Alias match
      if (s.aliases && s.aliases.some(alias => alias.toLowerCase() === normalized)) return true;
      
      // Regex match
      if (s.match_regex) {
        const regex = new RegExp(s.match_regex, 'i');
        if (regex.test(query)) return true;
      }
      
      // Token overlap
      const serviceTokens = s.naziv.toLowerCase().split(/\\s+/);
      const queryTokens = query.toLowerCase().split(/\\s+/);
      const overlap = serviceTokens.filter(t => queryTokens.includes(t));
      return overlap.length >= Math.min(serviceTokens.length, queryTokens.length) * 0.5;
    });
  },
  
  fuzzyMatchTechnology: (query) => {
    // Similar logic for technologies
    const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    return standardCatalog.technologies.filter(t => {
      if (t.id === normalized) return true;
      if (t.aliases && t.aliases.some(alias => alias.toLowerCase() === normalized)) return true;
      if (t.match_regex) {
        const regex = new RegExp(t.match_regex, 'i');
        if (regex.test(query)) return true;
      }
      return false;
    });
  },
  
  // Localization helpers
  getDisplayStatus: (status) => {
    const statusMap = {
      'active': 'Aktivna',
      'planned': 'Planirana', 
      'deprecated': 'Ukinuta'
    };
    return statusMap[status] || status;
  },
  
  getDisplayDomain: (domain) => {
    const domainMap = {
      'mobile': 'Mobilni',
      'fixed': 'Fiksni',
      'internet': 'Internet',
      'tv': 'Televizija',
      'cloud': 'Cloud',
      'iot': 'IoT',
      'security': 'Bezbednost'
    };
    return domainMap[domain] || domain;
  }
};
`;

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, jsContent);
console.log(`✅ Generated: ${outputPath}`);
console.log(`📊 Services: ${catalog.metadata.total_services}`);
console.log(`🔧 Technologies: ${catalog.metadata.total_technologies}`);
```

### **2.2 Package.json scripts**
```json
{
  "scripts": {
    "generate-catalog": "node scripts/generate-catalog.js",
    "validate-catalog": "ajv validate -s standard_catalog.schema.json -d standard_catalog.json",
    "analyze-operators": "node scripts/analyze-operators.js",
    "test-catalog": "npm run validate-catalog && npm run generate-catalog && npm test"
  },
  "devDependencies": {
    "ajv": "^8.12.0",
    "ajv-cli": "^5.0.0"
  }
}
```

---

## **FAZA 3: Operator Analyzer** ⏱️ 2-3h

### **3.1 Analyzer Script (`scripts/analyze-operators.js`)**
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load data
const operatori = JSON.parse(fs.readFileSync('operateri.json', 'utf8'));
const catalog = JSON.parse(fs.readFileSync('standard_catalog.json', 'utf8'));

const results = {
  operators: [],
  summary: {
    total_operators: 0,
    total_operator_services: 0,
    total_operator_technologies: 0,
    matched_services: 0,
    matched_technologies: 0,
    missing_services: [],
    missing_technologies: []
  },
  mapping_proposals: []
};

function fuzzyMatchService(query) {
  const scores = [];
  
  catalog.services.forEach(service => {
    let score = 0;
    
    // Exact ID match
    if (service.id === query.toLowerCase().replace(/[^a-z0-9]/g, '_')) {
      score = 100;
    }
    // Exact naziv match
    else if (service.naziv.toLowerCase() === query.toLowerCase()) {
      score = 95;
    }
    // Alias match
    else if (service.aliases && service.aliases.some(alias => 
      alias.toLowerCase() === query.toLowerCase())) {
      score = 90;
    }
    // Regex match
    else if (service.match_regex) {
      const regex = new RegExp(service.match_regex, 'i');
      if (regex.test(query)) {
        score = 80;
      }
    }
    // Token overlap
    else {
      const serviceTokens = service.naziv.toLowerCase().split(/\s+/);
      const queryTokens = query.toLowerCase().split(/\s+/);
      const overlap = serviceTokens.filter(t => queryTokens.includes(t));
      const overlapRatio = overlap.length / Math.max(serviceTokens.length, queryTokens.length);
      if (overlapRatio > 0.3) {
        score = Math.floor(overlapRatio * 70);
      }
    }
    
    if (score > 0) {
      scores.push({ service, score, confidence: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low' });
    }
  });
  
  return scores.sort((a, b) => b.score - a.score);
}

function fuzzyMatchTechnology(query) {
  // Similar logic for technologies
  const scores = [];
  
  catalog.technologies.forEach(tech => {
    let score = 0;
    
    if (tech.id === query.toLowerCase().replace(/[^a-z0-9]/g, '_')) {
      score = 100;
    } else if (tech.naziv.toLowerCase() === query.toLowerCase()) {
      score = 95;
    } else if (tech.aliases && tech.aliases.some(alias => 
      alias.toLowerCase() === query.toLowerCase())) {
      score = 90;
    } else if (tech.match_regex) {
      const regex = new RegExp(tech.match_regex, 'i');
      if (regex.test(query)) {
        score = 80;
      }
    }
    
    if (score > 0) {
      scores.push({ technology: tech, score, confidence: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low' });
    }
  });
  
  return scores.sort((a, b) => b.score - a.score);
}

// Analyze each operator
operatori.operateri.forEach(operator => {
  const operatorResult = {
    id: operator.id,
    naziv: operator.naziv,
    services: {
      total: 0,
      matched: [],
      missing: [],
      suggestions: []
    },
    technologies: {
      total: 0,
      matched: [],
      missing: [],
      suggestions: []
    }
  };
  
  // Analyze services
  if (operator.detaljne_usluge) {
    Object.values(operator.detaljne_usluge).forEach(categoryServices => {
      if (Array.isArray(categoryServices)) {
        categoryServices.forEach(service => {
          operatorResult.services.total++;
          results.summary.total_operator_services++;
          
          const matches = fuzzyMatchService(service.naziv);
          if (matches.length > 0 && matches[0].score >= 80) {
            operatorResult.services.matched.push({
              operator_service: service,
              catalog_match: matches[0].service,
              score: matches[0].score,
              confidence: matches[0].confidence
            });
            results.summary.matched_services++;
          } else {
            operatorResult.services.missing.push(service);
            if (matches.length > 0) {
              operatorResult.services.suggestions.push({
                operator_service: service,
                suggestions: matches.slice(0, 3)
              });
            }
          }
        });
      }
    });
  }
  
  // Analyze technologies
  if (operator.detaljne_tehnologije) {
    Object.values(operator.detaljne_tehnologije).forEach(categoryTechs => {
      if (Array.isArray(categoryTechs)) {
        categoryTechs.forEach(tech => {
          operatorResult.technologies.total++;
          results.summary.total_operator_technologies++;
          
          const matches = fuzzyMatchTechnology(tech.naziv);
          if (matches.length > 0 && matches[0].score >= 80) {
            operatorResult.technologies.matched.push({
              operator_technology: tech,
              catalog_match: matches[0].technology,
              score: matches[0].score,
              confidence: matches[0].confidence
            });
            results.summary.matched_technologies++;
          } else {
            operatorResult.technologies.missing.push(tech);
            if (matches.length > 0) {
              operatorResult.technologies.suggestions.push({
                operator_technology: tech,
                suggestions: matches.slice(0, 3)
              });
            }
          }
        });
      }
    });
  }
  
  results.operators.push(operatorResult);
});

results.summary.total_operators = results.operators.length;

// Collect all missing items
results.operators.forEach(op => {
  op.services.missing.forEach(service => {
    if (!results.summary.missing_services.find(s => s.naziv === service.naziv)) {
      results.summary.missing_services.push(service);
    }
  });
  
  op.technologies.missing.forEach(tech => {
    if (!results.summary.missing_technologies.find(t => t.naziv === tech.naziv)) {
      results.summary.missing_technologies.push(tech);
    }
  });
});

// Generate reports
const reportDir = 'reports';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir);
}

// JSON report
fs.writeFileSync(
  path.join(reportDir, 'mapping-analysis.json'),
  JSON.stringify(results, null, 2)
);

// Markdown report
const markdownReport = `# ATLAS Operator Mapping Analysis

**Generated:** ${new Date().toISOString()}  
**Catalog Version:** ${catalog.metadata.version}

## 📊 Summary

- **Total Operators:** ${results.summary.total_operators}
- **Total Operator Services:** ${results.summary.total_operator_services}
- **Total Operator Technologies:** ${results.summary.total_operator_technologies}
- **Matched Services:** ${results.summary.matched_services} (${Math.round(results.summary.matched_services/results.summary.total_operator_services*100)}%)
- **Matched Technologies:** ${results.summary.matched_technologies} (${Math.round(results.summary.matched_technologies/results.summary.total_operator_technologies*100)}%)

## ❌ Missing from Catalog

### Services (${results.summary.missing_services.length})
${results.summary.missing_services.map(s => `- ${s.naziv} (${s.kategorija})`).join('\n')}

### Technologies (${results.summary.missing_technologies.length})
${results.summary.missing_technologies.map(t => `- ${t.naziv} (${t.tip})`).join('\n')}

## 🔄 Per-Operator Results

${results.operators.map(op => `
### ${op.naziv}
- **Services:** ${op.services.matched.length}/${op.services.total} matched
- **Technologies:** ${op.technologies.matched.length}/${op.technologies.total} matched
- **Missing Services:** ${op.services.missing.length}
- **Missing Technologies:** ${op.technologies.missing.length}
`).join('\n')}
`;

fs.writeFileSync(
  path.join(reportDir, 'mapping-status.md'),
  markdownReport
);

// CSV for missing items
const csvContent = [
  'Type,Name,Category,Operator,Count',
  ...results.summary.missing_services.map(s => `Service,"${s.naziv}","${s.kategorija}","Multiple",1`),
  ...results.summary.missing_technologies.map(t => `Technology,"${t.naziv}","${t.tip}","Multiple",1`)
].join('\n');

fs.writeFileSync(
  path.join(reportDir, 'missing-items.csv'),
  csvContent
);

console.log('📊 Analysis Complete!');
console.log(`📄 Reports saved to: ${reportDir}/`);
console.log(`✅ Services matched: ${results.summary.matched_services}/${results.summary.total_operator_services} (${Math.round(results.summary.matched_services/results.summary.total_operator_services*100)}%)`);
console.log(`✅ Technologies matched: ${results.summary.matched_technologies}/${results.summary.total_operator_technologies} (${Math.round(results.summary.matched_technologies/results.summary.total_operator_technologies*100)}%)`);
console.log(`❌ Missing services: ${results.summary.missing_services.length}`);
console.log(`❌ Missing technologies: ${results.summary.missing_technologies.length}`);
```

---

## **FAZA 4: App.js Integration** ⏱️ 1h

### **4.1 Ažuriranje app.js**
```javascript
// Na vrhu fajla
import { standardCatalog, catalogUtils, getStandardServicesAndTechnologies } from './generated/standard_catalog.js';

class ATLASApp {
    constructor() {
        // ... postojeći kod ...
        this.standardCatalog = standardCatalog;
        this.catalogUtils = catalogUtils;
    }
    
    // BACKWARD COMPATIBILITY - zadrži postojeću funkciju kao wrapper
    getStandardServicesAndTechnologies() {
        return getStandardServicesAndTechnologies();
    }
    
    // Nova funkcija sa lokalizovanim display nazivima
    getLocalizedCatalog() {
        return {
            services: this.standardCatalog.services.map(service => ({
                ...service,
                display_kategorija: this.catalogUtils.getDisplayDomain(service.domain),
                display_status: this.catalogUtils.getDisplayStatus(service.status)
            })),
            technologies: this.standardCatalog.technologies.map(tech => ({
                ...tech,
                display_tip: this.catalogUtils.getDisplayDomain(tech.domain),
                display_status: this.catalogUtils.getDisplayStatus(tech.status)
            }))
        };
    }
    
    // Ažuriraj addServiceField da koristi novi katalog
    addServiceField(usluga = null) {
        const container = this.elements.servicesContainer;
        const index = container.children.length;
        
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-form';
        
        // Koristi novi lokalizovani katalog
        const localizedCatalog = this.getLocalizedCatalog();
        const catalogServices = localizedCatalog.services;
        
        // Grupiši po domenu
        const servicesByDomain = {};
        catalogServices.forEach(service => {
            if (!servicesByDomain[service.domain]) {
                servicesByDomain[service.domain] = [];
            }
            servicesByDomain[service.domain].push(service);
        });
        
        // HTML template sa novim podacima...
        serviceDiv.innerHTML = `
            <div class="service-header">
                <h5>Usluga ${index + 1}</h5>
                <button type="button" class="btn btn-outline-danger btn-sm remove-service">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            ${!usluga ? `
            <div class="existing-options" style="margin-bottom: 15px;">
                <label style="font-weight: bold; margin-bottom: 12px; display: block;">📋 Standardni katalog usluga v${this.standardCatalog.metadata.version}:</label>
                <div class="services-catalog" style="max-height: 300px; overflow-y: auto;">
                    ${Object.keys(servicesByDomain).map(domain => `
                        <div class="service-domain-group">
                            <h6>${this.catalogUtils.getDisplayDomain(domain)}</h6>
                            <div class="domain-services-grid">
                                ${servicesByDomain[domain].map(service => `
                                    <div class="catalog-service-item" 
                                         data-id="${service.id}"
                                         data-domain="${service.domain}" 
                                         data-naziv="${service.naziv}" 
                                         data-opis="${service.opis}" 
                                         data-status="${service.status}">
                                        <div class="service-name">${service.naziv}</div>
                                        <div class="service-description">${service.opis}</div>
                                        <div class="service-meta">${service.display_status}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- manual entry form ostaje isti -->
        `;
        
        // Event listeners za catalog items
        const catalogItems = serviceDiv.querySelectorAll('.catalog-service-item');
        catalogItems.forEach(item => {
            item.addEventListener('click', () => {
                const serviceId = item.getAttribute('data-id');
                const catalogService = this.catalogUtils.getServiceById(serviceId);
                
                if (catalogService) {
                    // Popuni polja
                    serviceDiv.querySelector(`[name="service_${index}_kategorija"]`).value = catalogService.domain;
                    serviceDiv.querySelector(`[name="service_${index}_naziv"]`).value = catalogService.naziv;
                    serviceDiv.querySelector(`[name="service_${index}_opis"]`).value = catalogService.opis;
                    serviceDiv.querySelector(`[name="service_${index}_status"]`).value = catalogService.status;
                    
                    // Sakrij katalog
                    const existingOptions = serviceDiv.querySelector('.existing-options');
                    const manualEntry = serviceDiv.querySelector('.manual-entry');
                    if (existingOptions) existingOptions.style.display = 'none';
                    if (manualEntry) manualEntry.style.display = 'block';
                    
                    // Dodaj metadata za tracking
                    serviceDiv.setAttribute('data-catalog-id', catalogService.id);
                    serviceDiv.setAttribute('data-mapping-confidence', 'manual');
                }
            });
        });
        
        // ... ostali event listeners ...
    }
    
    // Slična izmena za addTechnologyField...
}
```

### **4.2 HTML izmena**
```html
<!-- U index.html -->
<script type="module" src="app.js"></script>
```

---

## **FAZA 5: Testing & Validation** ⏱️ 1h

### **5.1 Unit testovi**
```javascript
// tests/catalog.test.js
import { standardCatalog, catalogUtils } from '../generated/standard_catalog.js';

describe('Standard Catalog', () => {
  test('should have unique IDs', () => {
    const serviceIds = standardCatalog.services.map(s => s.id);
    const techIds = standardCatalog.technologies.map(t => t.id);
    const allIds = [...serviceIds, ...techIds];
    
    expect(new Set(allIds).size).toBe(allIds.length);
  });
  
  test('should have valid statuses', () => {
    const validStatuses = ['active', 'planned', 'deprecated'];
    
    standardCatalog.services.forEach(service => {
      expect(validStatuses).toContain(service.status);
    });
    
    standardCatalog.technologies.forEach(tech => {
      expect(validStatuses).toContain(tech.status);
    });
  });
  
  test('fuzzy matching should work', () => {
    const matches = catalogUtils.fuzzyMatchService('mobilni prepaid');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].score).toBeGreaterThanOrEqual(80);
  });
});
```

### **5.2 CI/CD (.github/workflows/catalog.yml)**
```yaml
name: Catalog Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run validate-catalog
      - run: npm run generate-catalog
      - run: npm run analyze-operators
      - run: npm test
      
      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: mapping-reports
          path: reports/
```

---

## **FAZA 6: Mapping & Review** ⏱️ 2-3h

### **6.1 Početni mapping**
```bash
# Generiši inicijalni katalog
npm run generate-catalog

# Analiziraj postojeće operatere
npm run analyze-operators

# Proveravaj rezultate
cat reports/mapping-status.md
```

### **6.2 Iterativno proširivanje**
1. Pregledaj `reports/missing-items.csv`
2. Dodaj missing items u `standard_catalog.json`
3. Regeneriši katalog
4. Ponovi analizu
5. Cilj: 80%+ match rate

### **6.3 Manual review tool (simple)**
```html
<!-- tools/review.html -->
<!DOCTYPE html>
<html>
<head>
    <title>ATLAS Mapping Review</title>
    <style>
        .missing-item { background: #fef2f2; padding: 10px; margin: 5px; border-left: 4px solid #dc2626; }
        .suggested-match { background: #f0fdf4; padding: 5px; margin: 2px; border-left: 2px solid #16a34a; }
        .confidence-high { border-left-color: #16a34a; }
        .confidence-medium { border-left-color: #eab308; }
        .confidence-low { border-left-color: #dc2626; }
    </style>
</head>
<body>
    <h1>ATLAS Mapping Review</h1>
    <div id="review-container"></div>
    
    <script type="module">
        import mappingData from '../reports/mapping-analysis.json' assert { type: 'json' };
        
        const container = document.getElementById('review-container');
        
        mappingData.operators.forEach(op => {
            const opDiv = document.createElement('div');
            opDiv.innerHTML = `
                <h2>${op.naziv}</h2>
                <h3>Missing Services (${op.services.missing.length})</h3>
                ${op.services.missing.map(service => `
                    <div class="missing-item">
                        <strong>${service.naziv}</strong> (${service.kategorija})
                        <br><small>${service.opis}</small>
                        <br><button onclick="addToCatalog('service', '${service.naziv}', '${service.kategorija}')">Add to Catalog</button>
                    </div>
                `).join('')}
                
                <h3>Service Suggestions</h3>
                ${op.services.suggestions.map(suggestion => `
                    <div class="missing-item">
                        <strong>Operator:</strong> ${suggestion.operator_service.naziv}
                        <br><strong>Suggestions:</strong>
                        ${suggestion.suggestions.map(s => `
                            <div class="suggested-match confidence-${s.confidence}">
                                ${s.service.naziv} (${s.score}% match)
                                <button onclick="acceptMapping('${suggestion.operator_service.naziv}', '${s.service.id}')">Accept</button>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            `;
            container.appendChild(opDiv);
        });
        
        window.addToCatalog = (type, naziv, kategorija) => {
            // Generate new catalog entry and show JSON
            const id = naziv.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const newEntry = {
                id,
                domain: kategorija === 'mobilni' ? 'mobile' : kategorija,
                naziv,
                opis: `TODO: Add description for ${naziv}`,
                status: 'active',
                aliases: [],
                tags: [kategorija]
            };
            
            alert(`Add this to standard_catalog.json:\n\n${JSON.stringify(newEntry, null, 2)}`);
        };
        
        window.acceptMapping = (operatorName, catalogId) => {
            console.log(`Accept mapping: ${operatorName} -> ${catalogId}`);
            // TODO: Store accepted mappings
        };
    </script>
</body>
</html>
```

---

## **FAZA 7: Rollout** ⏱️ 1h

### **7.1 Deployment checklist**
- [ ] Katalog validiran protiv schema
- [ ] Generator radi bez greška
- [ ] Minimum 80% mapping rate postignut
- [ ] Unit testovi prolaze
- [ ] App.js ažuriran i testiran
- [ ] Backward compatibility potvrđena

### **7.2 Monitoring**
```javascript
// Dodaj u app.js za tracking
class ATLASApp {
    trackCatalogUsage(action, catalogId, confidence) {
        // Log za analitiku
        console.log(`📊 Catalog Usage: ${action} ${catalogId} (${confidence})`);
        
        // Opciono slanje na analytics endpoint
        if (this.config.analytics_enabled) {
            fetch('/api/analytics/catalog-usage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    action,
                    catalog_id: catalogId,
                    confidence,
                    user_agent: navigator.userAgent
                })
            });
        }
    }
}
```

---

## 📊 **SUCCESS METRICS**

### **Kvantitativni:**
- ✅ **80%+ automatski match rate** za postojeće operatere
- ✅ **<50ms response time** za fuzzy matching
- ✅ **100% schema compliance** za katalog
- ✅ **Zero regression** u postojećoj funkcionalnosti

### **Kvalitativni:**
- ✅ **Čitljiviji kod** - app.js redukovano sa 2800+ linija
- ✅ **Lakše održavanje** - JSON katalog umesto hardkodovanih nizova
- ✅ **Bolju konzistentnost** - standardizovani nazivi i statusi
- ✅ **Proširivost** - lako dodavanje novih usluga/tehnologija

---

## 🚀 **SLEDEĆI KORACI**

### **Kratkoročno (1-2 nedelje):**
1. Implementacija Faza 1-4
2. Testiranje i debugging
3. Review i odobravanje

### **Srednjoročno (1-2 meseca):**
4. **Admin UI** za katalog management
5. **Bulk import** operatera iz CSV/Excel
6. **API endpoints** za katalog queries
7. **Advanced analytics** i reporting

### **Dugoročno (3-6 meseci):**
8. **Machine learning** za auto-kategorization
9. **Integration** sa telekom standardima (ITU, GSMA)
10. **Multi-language** podrška
11. **Mobile app** za field data collection

---

**📝 Plan odobren za implementaciju:** ✅  
**🚀 Početak implementacije:** Faza 1  
**⏰ Estimated completion:** 8-12 radnih sati
