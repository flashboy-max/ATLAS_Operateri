# ATLAS Telekomunikacioni Operateri BiH - Razvojni Plan V2.0

**Datum:** 2025-09-09  
**Status:** Aktivno planiranje  
**Verzija:** 2.0  

---

## 📋 **TRENUTNO STANJE**

### ✅ **Implementirano (V1.5):**
- [x] Standardni katalog usluga i tehnologija (27 usluga, 23 tehnologije)
- [x] Enhanced generator sa regex validation i caching
- [x] Validator sa cross-reference i statistikama  
- [x] ES modules integracija
- [x] LocalStorage persistencija
- [x] Export/Import funkcionalnost
- [x] Sync status bar sa upozorenjem
- [x] Fuzzy matching za usluge i tehnologije
- [x] Visual editor za operatere sa dual-section layout

### ⚠️ **Trenutni problemi:**
- [ ] **app.js je postao ogroman** (4000+ linija koda)
- [ ] **Podaci se čuvaju samo u LocalStorage** (ne u operateri.json)
- [ ] **Nema modularnu strukturu** - sve u jednom fajlu
- [ ] **Teško za održavanje** i dalje proširivanje
- [ ] **Nema backend server** za trajno čuvanje

---

## 🎯 **PLAN RAZVOJA V2.0**

### **FAZA 1: Modularizacija i refactoring (PRIORITET 1)**

#### 1.1 **Refactor app.js u modularne komponente**
```
src/
├── components/
│   ├── OperatorCard.js          # Prikaz operator kartice
│   ├── OperatorEditor.js        # Form za uređivanje operatera  
│   ├── ServiceManager.js        # Upravljanje uslugama
│   ├── TechnologyManager.js     # Upravljanje tehnologijama
│   ├── SearchFilter.js          # Pretraga i filtriranje
│   ├── StatsManager.js          # Statistike i dashboard
│   └── NotificationManager.js   # Notifikacije i alerts
├── services/
│   ├── DataService.js           # CRUD operacije za operatere
│   ├── CatalogService.js        # Katalog usluga/tehnologija  
│   ├── StorageService.js        # LocalStorage management
│   ├── ServerService.js         # Backend komunikacija
│   └── ValidationService.js     # Validacija podataka
├── utils/
│   ├── helpers.js               # Utility funkcije
│   ├── constants.js             # Konstante i mapping
│   ├── formatters.js            # Formatiranje podataka
│   └── fuzzyMatcher.js          # Fuzzy matching algoritmi
└── app.js                       # Glavni entry point (slim)
```

#### 1.2 **Kreiranje modularne arhitekture**
- **Component-based dizajn** - svaki deo aplikacije u zasebnom modulu
- **Service layer** - odvojena logika za podatke od UI
- **Event-driven komunikacija** između komponenti
- **Dependency injection** pattern za lakše testiranje

### **FAZA 2: Backend server implementacija (PRIORITET 2)**

#### 2.1 **Node.js Express server**
```
server/
├── server.js                    # Main server file
├── routes/
│   ├── operators.js             # /api/operators endpoints
│   ├── catalog.js               # /api/catalog endpoints  
│   └── health.js                # /api/health endpoint
├── middleware/
│   ├── cors.js                  # CORS configuration
│   ├── validation.js            # Request validation
│   └── errorHandler.js          # Error handling
├── services/
│   ├── fileService.js           # JSON file operations
│   ├── backupService.js         # Automatic backups
│   └── migrationService.js      # Data migrations
└── package.json                 # Dependencies
```

#### 2.2 **API endpoints**
- `POST /api/operators` - Čuvanje operatera u operateri.json
- `GET /api/operators` - Učitavanje operatera
- `PUT /api/operators/:id` - Ažuriranje específíc operatera
- `DELETE /api/operators/:id` - Brisanje operatera
- `POST /api/backup` - Kreiranje backup-a
- `GET /api/health` - Server status check

#### 2.3 **Real-time sync**
- **WebSocket konekcije** za real-time updates
- **Conflict resolution** za simultano editing
- **Auto-save** funkcionalnost
- **Offline support** sa sync quando dođe online

### **FAZA 3: Enhanced UI/UX (PRIORITET 3)**

#### 3.1 **Poboljšanja u editoru**
- **Drag & drop** za reordering usluga/tehnologija
- **Bulk editing** - uređivanje više operatera istovremeno
- **Template sistem** - predefinisani setovi usluga za tipove operatera
- **Copy/paste** funkcionalnost između operatera
- **History/Undo** sistem za promene

#### 3.2 **Advanced search & filtering**
- **Elasticsearch integration** za brzu pretragu
- **Faceted search** - kombinovanje više filtara
- **Saved searches** - čuvanje često korišćenih pretragí
- **Export filtered results** - izvoz samo filtriranih podataka

#### 3.3 **Dashboard & analytics**
- **Interactive charts** sa Chart.js ili D3.js
- **Trend analysis** - praćenje promena kroz vreme
- **Comparison tools** - poređenje operatera
- **Custom reports** - generiranje izvještaja

### **FAZA 4: Dodatne funkcionalnosti (PRIORITET 4)**

#### 4.1 **Import/Export enhancements**
- **Excel import/export** - direktno from/to Excel fajlova
- **CSV support** - za spreadsheet integration
- **API export** - JSON/XML formati za vanjske sisteme
- **Scheduled exports** - automatski izvozi

#### 4.2 **Collaboration features**
- **Multi-user support** - više korisnika istovremeno
- **User permissions** - read/write/admin nivoi
- **Change tracking** - ko je šta menjao i kada
- **Comments system** - komentarisanje na operatorima

#### 4.3 **Integration capabilities**
- **REST API** za externe sisteme  
- **Webhook support** - notifikacije o promenama
- **LDAP authentication** - enterprise login
- **Audit logging** - detaljno logovanje aktivnosti

---

## 🏗️ **IMPLEMENTACIJSKI PRISTUP**

### **Step-by-step implementacija:**

#### **KORAK 1: Priprema structure (Tjedan 1)**
1. Kreiranje folder strukture
2. Setup build sistem (Webpack/Vite)
3. ESLint/Prettier configuration
4. Git branching strategy

#### **KORAK 2: Refactor app.js (Tjedan 2-3)**
1. Ekstraktovanje komponenti jednu po jednu
2. Kreiranje service layer-a
3. Testiranje svake komponente postupno
4. Održavanje backward compatibility

#### **KORAK 3: Backend setup (Tjedan 4)**
1. Express server implementation
2. API endpoints kreiranje
3. Testing sa Postman/Jest
4. Frontend integration

#### **KORAK 4: Testing & deployment (Tjedan 5)**
1. End-to-end testing
2. Performance optimization
3. Docker containerization
4. Production deployment guide

---

## 📊 **PLAN MODULARIZACIJE APP.JS**

### **Trenutna analiza app.js (4000+ linija):**

```javascript
// Trenutna struktura:
class ATLASApp {
    // 1. Constructor & initialization (100 lines)
    // 2. Data loading & storage (300 lines)  
    // 3. UI rendering (500 lines)
    // 4. Event handlers (400 lines)
    // 5. CRUD operations (600 lines)
    // 6. Form management (800 lines)
    // 7. Search & filtering (300 lines)
    // 8. Import/export (400 lines)
    // 9. Notifications (200 lines)
    // 10. Utilities (400 lines)
}
```

### **Ciljana modularna struktura:**

#### **Core App (app.js) - 200 linija**
```javascript
// Slim main application class
import { OperatorManager } from './src/services/OperatorManager.js';
import { UIManager } from './src/services/UIManager.js';
import { EventBus } from './src/utils/EventBus.js';

class ATLASApp {
    constructor() {
        this.eventBus = new EventBus();
        this.operatorManager = new OperatorManager(this.eventBus);
        this.uiManager = new UIManager(this.eventBus);
    }
    
    async init() {
        await this.operatorManager.loadData();
        this.uiManager.render();
        this.setupEventListeners();
    }
}
```

#### **Komponente (src/components/) - ~200 linija svaka**
- **OperatorCard.js** - Prikaz operator kartice
- **OperatorEditor.js** - Form za editing
- **ServiceEditor.js** - Upravljanje uslugama  
- **TechnologyEditor.js** - Upravljanje tehnologijama
- **SearchFilter.js** - Pretraga i filteri

#### **Servisi (src/services/) - ~300 linija svaki**
- **DataService.js** - CRUD operations
- **StorageService.js** - LocalStorage + Server
- **CatalogService.js** - Standard catalog
- **ValidationService.js** - Data validation

#### **Utilities (src/utils/) - ~100 linija svaki**
- **constants.js** - Konstante
- **helpers.js** - Helper funkcije
- **formatters.js** - Data formatting
- **eventBus.js** - Event communication

---

## 🎯 **PRIORITIZACIJA**

### **HITNO (sledeća 2 sedmica):**
1. **Backend server** - rešavanje čuvanja podataka
2. **Refactor app.js** - modularna struktura
3. **Testing postojećih funkcionalnosti**

### **KRATKOROČNO (1-2 meseci):**
4. Enhanced UI/UX improvements
5. Advanced search capabilities  
6. Performance optimizations

### **DUGOROČNO (3+ meseci):**
7. Collaboration features
8. External integrations
9. Mobile responsive design

---

## 🔧 **TEHNIČKI REQUIREMENTS**

### **Development tools:**
- **Node.js 18+** - Backend server
- **Express.js** - Web framework
- **Webpack/Vite** - Module bundler
- **Jest** - Testing framework
- **ESLint + Prettier** - Code quality

### **Browser support:**
- **Chrome 90+** (primary)
- **Firefox 88+** 
- **Safari 14+**
- **Edge 90+**

### **Performance targets:**
- **Initial load:** < 3 seconds
- **Search response:** < 500ms
- **Save operation:** < 1 second
- **Bundle size:** < 500KB gzipped

---

## 📝 **DOCUMENTATION PLAN**

### **Technical docs:**
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Component documentation (JSDoc)
- [ ] Architecture overview
- [ ] Development setup guide

### **User docs:**
- [ ] User manual sa screenshots
- [ ] Video tutorials
- [ ] FAQ section
- [ ] Troubleshooting guide

---

## 🚀 **NEXT STEPS**

### **Immedijatno za implementaciju:**
1. **Kreirati folder strukturu** za module
2. **Setup package.json** sa build scripts
3. **Početi refactor** sa najmanjim komponentama
4. **Implementirati backend server** za čuvanje podataka

### **Prvi modul za ekstraktovanje:**
Preporučujem da počnemo sa **NotificationManager.js** jer je:
- ✅ Samostalan i nezavisan
- ✅ Jasno definisane funkcionalnosti
- ✅ Lako za testiranje
- ✅ Neće pokvariti existing funkcionalnost

---

## 💡 **KLJUČNE PREDNOSTI OVOG PLANA**

### **Arhitekturni pristup:**
- ✅ **Jasna modularna struktura** sa detaljnim folder organizacijom
- ✅ **Step-by-step implementacija** sa realističnim vremenskim okvirima
- ✅ **Prioritizacija zadataka** (PRIORITET 1, 2, 3, 4) - odlična organizacija
- ✅ **Tehnički requirements** sa specifikacijama (Node.js 18+, performance targets)
- ✅ **Documentation plan** - često zanemeren ali ključan deo

### **Plan modularizacije app.js je posebno dobar jer:**
- ✅ **Daje konkretne brojke** linija koda po komponenti
- ✅ **Pokriva event-driven arhitekturu** sa EventBus-om  
- ✅ **Uključuje backward compatibility** strategiju
- ✅ **Ima testiranje** svake komponente

---

## 🌳 **GIT BRANCHING STRATEGY**

### **GitFlow Workflow:**
```
main → develop → feature/ime-feature
```

#### **Branch tipovi:**
- **main** - production ready code
- **develop** - integration branch za nova features
- **feature/formatters** - ekstraktovanje formatters.js
- **feature/notification-manager** - NotificationManager komponenta
- **feature/backend-server** - Express server implementacija
- **hotfix/** - hitne popravke za production

#### **Workflow:**
1. `git checkout develop`
2. `git checkout -b feature/ime-feature`
3. Implementacija + testiranje
4. `git checkout develop && git merge feature/ime-feature`
5. Testing na develop branch
6. `git checkout main && git merge develop`

---

## 🗓️ **KONKRETNI SLEDEĆI KORACI**

### **DANAS (Dan 1):**
- [x] ✅ Kreiran detaljni plan razvoja
- [x] ✅ Analiza app.js strukture (4071 linija)
- [x] ✅ Folder struktura kreirana
- [ ] 🔄 **Backup i GitHub push**
- [ ] 📦 **Ekstraktuj formatters.js i constants.js**

### **SUTRA (Dan 2):**
- [ ] 🎯 **NotificationManager** komponenta
- [ ] 💾 **StorageService** refactoring
- [ ] 🧪 **Testiranje** oba modula

### **OVE SEDMICE (Dani 3-7):**
- [ ] 🖥️ **Backend server setup** (Express.js)
- [ ] 🔌 **API endpoints** implementacija
- [ ] 🔄 **Real-time sync** sa operateri.json
- [ ] 📊 **Performance testing**

### **SLEDEĆE SEDMICE (Dani 8-14):**
- [ ] 🔍 **SearchFilter** komponenta  
- [ ] 🃏 **OperatorCard** komponenta
- [ ] 🎨 **UI/UX** poboljšanja
- [ ] 📚 **Dokumentacija** ažuriranje

---

## 🎯 **IMPLEMENTACIJSKA STRATEGIJA**

### **Preporučeni pristup:**
1. **Započeti sa formatters.js** - najmanja promena, bez rizika
2. **Backend server je ključan** za trajno čuvanje podataka  
3. **Postepeno refactoring** - jedan modul po danu
4. **Kontinuirano testiranje** - ne lomiti postojeću funkcionalnost

### **Risk mitigation:**
- **Backup pre svake promene**
- **Feature branch za svaki modul**
- **Testiranje pre merge-a**
- **Rollback plan za svaki korak**

**Da li želiš da počnemo implementaciju odmah?** 🎯
