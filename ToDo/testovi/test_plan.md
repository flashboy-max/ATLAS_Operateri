# ATLAS HTML - Test Plan

## Pregled Testiranja

Ovaj dokument definiše sveobuhvatan plan testiranja za ATLAS HTML aplikaciju, uključujući manuelne i automatizovane testove.

---

## 1. Funkcionalni Testovi

### 1.1 CRUD Operacije

#### Test Case 1.1.1: Dodavanje Operatera
- **Cilj**: Verifikovati da se operator može uspešno dodati
- **Koraci**:
  1. Kliknuti na "Dodaj Operatera" dugme
  2. Popuniti obavezna polja (Naziv, Tip operatera)
  3. Kliknuti "Sačuvaj"
- **Očekivani rezultat**: Operator se dodaje u tabelu i čuva u JSON
- **Status**: ✅ Pass

#### Test Case 1.1.2: Uređivanje Operatera
- **Cilj**: Verifikovati da se podaci operatera mogu menjati
- **Koraci**:
  1. Kliknuti "Edit" na postojećem operateru
  2. Promeniti naziv operatera
  3. Kliknuti "Sačuvaj"
- **Očekivani rezultat**: Promene se reflektuju u tabeli i JSON-u
- **Status**: ✅ Pass

#### Test Case 1.1.3: Brisanje Operatera
- **Cilj**: Verifikovati da se operator može obrisati
- **Koraci**:
  1. Kliknuti "Delete" na operateru
  2. Potvrditi brisanje u dijalogu
- **Očekivani rezultat**: Operator se uklanja iz tabele i JSON-a
- **Status**: ✅ Pass

### 1.2 Search i Filtriranje

#### Test Case 1.2.1: Basic Search
- **Cilj**: Verifikovati pretragu po imenu operatera
- **Koraci**:
  1. Uneti deo imena operatera u search box
  2. Verifikovati filtriranje rezultata
- **Očekivani rezultat**: Prikazuju se samo matchuje operateri
- **Status**: ✅ Pass

#### Test Case 1.2.2: Advanced Filtering
- **Cilj**: Testirati filtriranje po kategorijama
- **Koraci**:
  1. Izabrati kategoriju iz dropdown-a
  2. Verifikovati filtrirane rezultate
- **Očekivani rezultat**: Prikazuju se samo operateri izabrane kategorije
- **Status**: 🚧 In Progress

### 1.3 Kategorizacija Operatera

#### Test Case 1.3.1: Category Display
- **Cilj**: Verifikovati prikaz kategorija operatera
- **Test Data**: 
  - Dominantni: BH Telecom, m:tel, HT Eronet
  - MVNO: ONE, haloo, Zona.ba
  - Regionalni ISP: Telemach, ADRIA NET
- **Status**: 🚧 Planirano

#### Test Case 1.3.2: Category Filtering
- **Cilj**: Testirati filtriranje po kategorijama
- **Status**: 🚧 Planirano

---

## 2. Performance Testovi

### 2.1 Load Performance

#### Test Case 2.1.1: Initial Load Time
- **Cilj**: Meriti vreme učitavanja aplikacije
- **Acceptance Criteria**: < 2 sekunde
- **Test Method**: Browser DevTools Performance tab
- **Status**: ⏳ Pending

#### Test Case 2.1.2: Search Performance
- **Cilj**: Testirati brzinu pretrage sa velikim brojem operatera
- **Test Data**: 50+ operatera
- **Acceptance Criteria**: < 100ms response time
- **Status**: ⏳ Pending

### 2.2 Memory Usage

#### Test Case 2.2.1: Memory Consumption
- **Cilj**: Meriti memory usage tokom korišćenja
- **Acceptance Criteria**: < 50MB
- **Status**: ⏳ Pending

---

## 3. UI/UX Testovi

### 3.1 Responsive Design

#### Test Case 3.1.1: Mobile Compatibility
- **Cilj**: Testirati aplikaciju na mobilnim uređajima
- **Test Devices**: 
  - iPhone (Safari)
  - Android (Chrome)
  - Tablet (iPad)
- **Status**: 🚧 Partial Pass

#### Test Case 3.1.2: Desktop Browsers
- **Cilj**: Cross-browser compatibility
- **Browsers**:
  - Chrome 90+: ✅ Pass
  - Firefox 88+: ⏳ Pending
  - Safari 14+: ⏳ Pending
  - Edge 90+: ⏳ Pending

### 3.2 Accessibility

#### Test Case 3.2.1: Keyboard Navigation
- **Cilj**: Testirati navigaciju preko tastature
- **Status**: ⏳ Pending

#### Test Case 3.2.2: Screen Reader Support
- **Cilj**: Testirati kompatibilnost sa screen reader-ima
- **Status**: ⏳ Pending

---

## 4. Integracija Testovi

### 4.1 Data Persistence

#### Test Case 4.1.1: LocalStorage Saving
- **Cilj**: Verifikovati čuvanje stanja u LocalStorage
- **Koraci**:
  1. Napraviti promene u aplikaciji
  2. Refresh browser
  3. Verifikovati da su promene sačuvane
- **Status**: ✅ Pass

#### Test Case 4.1.2: JSON File Updates
- **Cilj**: Verifikovati ažuriranje operateri.json datoteke
- **Status**: ✅ Pass

---

## 5. Error Handling Testovi

### 5.1 Input Validation

#### Test Case 5.1.1: Required Fields
- **Cilj**: Testirati validaciju obaveznih polja
- **Status**: ✅ Pass

#### Test Case 5.1.2: Invalid Data Formats
- **Cilj**: Testirati handleovanje neispravnih podataka
- **Status**: 🚧 Partial Pass

### 5.2 System Errors

#### Test Case 5.2.1: JSON Parse Errors
- **Cilj**: Testirati handleovanje korumpiranih JSON podataka
- **Status**: ⏳ Pending

---

## 6. Regresioni Testovi

### 6.1 Core Functionality
- **Cilj**: Verifikovati da nove promene ne kvare postojeće funkcionalnosti
- **Frequency**: Nakon svake izmene
- **Status**: 🔄 Ongoing

---

## 7. Test Environment Setup

### 7.1 Test Data
- **Location**: `../ATLAS html/operateri.json`
- **Backup**: `../ATLAS html/ToDo/backup/operateri_test.json`

### 7.2 Test Browsers
- Chrome (primary)
- Firefox
- Safari
- Edge

### 7.3 Test Devices
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

---

## 8. Bug Tracking

### 8.1 Open Issues
1. **Mobile table scrolling** - Horizontal scroll problemi
2. **Search debounce** - Search reaguje previše brzo
3. **Memory leak** - Kod continuous usage

### 8.2 Fixed Issues
1. ✅ **Duplicate entries** - Fixed validation
2. ✅ **Edit modal closing** - Fixed event handling

---

## 9. Test Reports

### 9.1 Test Summary
- **Total Test Cases**: 23
- **Passed**: 8 ✅
- **In Progress**: 6 🚧
- **Pending**: 9 ⏳

### 9.2 Coverage
- **Functional**: 70%
- **Performance**: 20%
- **UI/UX**: 40%
- **Integration**: 80%

---

## 10. Next Steps

1. **Završiti kategorizacija testove**
2. **Performance testing sa većim datasets**
3. **Cross-browser compatibility testing**
4. **Accessibility compliance testing**
5. **Automated testing setup**

---

**Održavano od**: QA Team  
**Poslednji update**: 31. jul 2025, 13:42 CET