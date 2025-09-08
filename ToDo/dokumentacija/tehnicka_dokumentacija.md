# ATLAS HTML - Tehnička Dokumentacija

## Pregled Aplikacije

ATLAS HTML je potpuno samostalna web aplikacija za upravljanje bazom podataka telekomunikacionih operatera u Bosni i Hercegovini. Aplikacija koristi samo frontend tehnologije i može da radi bez backend servera.

---

## Arhitektura Sistema

### Frontend Stack
- **HTML5** - Semantička struktura aplikacije
- **CSS3** - Styling sa Flexbox/Grid layoutom
- **Vanilla JavaScript (ES6+)** - Aplikacijska logika
- **JSON** - Data storage format
- **LocalStorage API** - Perzistentno čuvanje stanja

### Struktura Datoteka
```
ATLAS html/
├── index.html              # Osnovna verzija aplikacije
├── index_enhanced.html     # Poboljšana verzija
├── app.js                  # Core JavaScript functionality
├── app_enhanced.js         # Enhanced features
├── styles.css              # Main stylesheet
├── operateri.json          # Data file - operateri
├── ToDo/                   # Project planning & documentation
│   ├── README.md           # Project overview
│   ├── planovi/            # Development plans
│   ├── implementacija/     # Implementation tracking
│   ├── testovi/            # Test plans and results
│   ├── backup/             # Data backups
│   └── dokumentacija/      # Technical documentation
```

---

## Data Model

### Operator Object Structure
```javascript
{
  "id": Number,                    // Unique identifier
  "naziv": String,                 // Operator name
  "tip_operatera": String,         // Type: "Dominantni", "MVNO", "Regionalni ISP"
  "kategorija": String,            // Category classification
  "status": String,                // "Aktivan", "Neaktivan", "Suspendovan"
  "licence": String,               // License type
  "website": String,               // Official website URL
  "email": String,                 // Contact email
  "telefon": String,               // Contact phone
  "adresa": String,                // Physical address
  "usluge": Array[String],         // Services offered
  "tehnologije": Array[String],    // Technologies used
  "pokrivenos": String,            // Coverage area
  "godina_osnivanja": String,      // Year established
  "broj_korisnika": String,        // Number of users
  "trzisni_udio": String          // Market share percentage
}
```

### Categories
1. **Dominantni operateri**: BH Telecom, m:tel, HT Eronet
2. **MVNO operateri**: ONE, haloo, Zona.ba
3. **Regionalni ISP**: Telemach, ADRIA NET, Miss.Net, itd.

---

## Core Functionality

### 1. Data Management (app.js)

#### Load Data
```javascript
async function loadOperatori() {
    // Loads data from operateri.json
    // Falls back to localStorage if JSON unavailable
    // Handles parsing errors gracefully
}
```

#### Save Data
```javascript
function saveOperatori(data) {
    // Saves to localStorage immediately
    // Attempts to update JSON file
    // Maintains data consistency
}
```

#### CRUD Operations
```javascript
function addOperator(operatorData) { }    // Create
function getOperators() { }               // Read
function updateOperator(id, data) { }     // Update
function deleteOperator(id) { }           // Delete
```

### 2. Search & Filtering

#### Basic Search
```javascript
function searchOperatori(searchTerm) {
    // Searches through: naziv, tip_operatera, usluge
    // Case-insensitive matching
    // Real-time filtering
}
```

#### Category Filtering
```javascript
function filterByCategory(category) {
    // Filters by kategorija field
    // Updates display in real-time
    // Maintains search state
}
```

#### Advanced Filtering
```javascript
function applyFilters(filters) {
    // Multi-field filtering
    // Combines search + category + status
    // Maintains filter state in localStorage
}
```

### 3. UI Components

#### Modal Management
```javascript
function showAddModal() { }       // Show add operator modal
function showEditModal(id) { }    // Show edit operator modal
function hideModal() { }          // Close any open modal
```

#### Table Management
```javascript
function renderOperatoriTable(data) { }   // Render main table
function updateTableRow(id, data) { }     // Update specific row
function sortTable(column, direction) { }  // Sort functionality
```

#### Form Handling
```javascript
function validateForm(formData) { }       // Input validation
function submitForm(action, data) { }     // Form submission
function resetForm() { }                  // Clear form fields
```

---

## Performance Optimizations

### 1. DOM Optimization
- **DocumentFragment** for batch DOM updates
- **Event delegation** instead of individual listeners
- **Virtual scrolling** za velike datasets (planirano)

### 2. Search Optimization
- **Debounced search** (300ms delay) - planirano
- **Cached results** u localStorage
- **Indexed search** za brže pretrage - planirano

### 3. Memory Management
- **Event listener cleanup** na destroy
- **Data structure optimization**
- **Garbage collection** awareness

---

## Browser Compatibility

### Supported Browsers
- **Chrome 90+** ✅ (Primary target)
- **Firefox 88+** ✅ 
- **Safari 14+** ✅
- **Edge 90+** ✅

### Required Features
- ES6+ support (let/const, arrow functions, async/await)
- LocalStorage API
- Fetch API (ili XMLHttpRequest fallback)
- CSS3 Flexbox/Grid support

---

## Security Considerations

### Data Protection
- **Client-side validation** svih input podataka
- **XSS prevention** kroz proper escaping
- **Data sanitization** pre čuvanja

### Privacy
- **Lokalno čuvanje** - nema slanje podataka na server
- **No external dependencies** - nema tracking
- **User consent** za localStorage usage

---

## Error Handling

### JavaScript Errors
```javascript
try {
    // Risky operation
} catch (error) {
    console.error('Error:', error);
    showUserMessage('Došlo je do greške. Molimo pokušajte ponovo.');
}
```

### Data Validation Errors
```javascript
function validateOperator(data) {
    const errors = [];
    if (!data.naziv) errors.push('Naziv je obavezan');
    if (!data.tip_operatera) errors.push('Tip operatera je obavezan');
    return errors;
}
```

### Network Errors
```javascript
async function loadData() {
    try {
        const response = await fetch('operateri.json');
        if (!response.ok) throw new Error('Failed to load data');
        return await response.json();
    } catch (error) {
        // Fallback to localStorage
        return getFromLocalStorage();
    }
}
```

---

## Development Guidelines

### Code Style
- **ES6+** features where supported
- **Consistent naming** (camelCase za functions, snake_case za data)
- **Meaningful variable names**
- **Function documentation** sa JSDoc

### File Organization
- **Separation of concerns** - HTML/CSS/JS odvojeno
- **Modular functions** - jedna funkcija = jedna odgovornost
- **Configuration objects** za settings

### Testing Strategy
- **Manual testing** u različitim browserima
- **Data validation testing**
- **Performance testing** sa velikim datasets
- **Regression testing** posle promena

---

## Deployment

### Requirements
- **Web server** (optional) - aplikacija radi i sa file:// protokolom
- **Modern browser** sa JavaScript enabled
- **Operateri.json** file u istom direktorijum

### Launch Options
1. **Direct file opening** - otvoriti index.html u browseru
2. **Local server** - Python SimpleHTTPServer ili Node.js server
3. **Web hosting** - upload svih fajlova na web server

### Configuration
- **No build process** required
- **No dependencies** to install
- **Works offline** after initial load

---

## Future Enhancements

### Planned Features
- **Paginacija** za velike datasets
- **Advanced search** sa autocomplete
- **Export/Import** funkcionalnosti
- **Dark theme** support
- **Offline sync** capabilities

### Performance Improvements
- **Lazy loading** za velike tabele
- **Web Workers** za heavy operations
- **Service Worker** za caching
- **Database migration** to IndexedDB

### UI/UX Enhancements
- **Drag & drop** sorting
- **Keyboard shortcuts**
- **Accessibility** improvements
- **Mobile-first** responsive design

---

**Verzija dokumentacije**: 1.0  
**Poslednji update**: 31. jul 2025  
**Autor**: Development Team