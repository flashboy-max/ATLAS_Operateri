# 🎯 ATLAS APLIKACIJA - KOMPLETAN PLAN REORGANIZACIJE

## 📋 PREGLED PROJEKTА

**Datum kreiranja:** 31. jul 2025.  
**Verzija plana:** 1.0  
**Status:** Priprema za implementaciju

---

## 🎯 CILJEVI REORGANIZACIJE

### ❌ **ŠTA UKLANJAMO:**
1. ~~**"ATLAS Status" kolona**~~ - nepotrebna za korisnike
2. ~~**"Prioritet" kolona**~~ - interno korišćena samo
3. ~~**"Visok Prioritet" statistika**~~ - sa dashboard-a

### ✅ **ŠTA DODAJEMO:**
1. **"Kategorija" kolona** - 🏢 Dominantni, 📱 MVNO, 🌐 ISP, 💼 B2B
2. **Sekcija "Tehnično Osoblje"** - Osoba 1, Osoba 2 sa kontaktima
3. **Tooltip funkcionalnost** - objašnjenja za usluge i tehnologije
4. **Poboljšano formatiranje** - čišći prikaz svih kolona

---

## 📊 TRANSFORMACIJA TABELE

### **STARO STANJE:**
```
| NAZIV | KATEGORIJA | TIP | STATUS | ATLAS STATUS | PRIORITET | KOMPLETNOST | KONTAKT | AKCIJE |
```

### **NOVO STANJE:**
```
| NAZIV           | KATEGORIJA    | TIP           | STATUS  | KOMPLETNOST | KONTAKT           | AKCIJE |
|-----------------|---------------|---------------|---------|-------------|-------------------|--------|
| BH Telecom      | 🏢 Dominantni | Dominantni... | aktivan | [====] 100% | +387 33 000 900  | 👁️✏️🗑️ |
| Zona.ba         | 📱 MVNO       | MVNO...       | aktivan | [===] 95%   | +387 55 420 100  | 👁️✏️🗑️ |
```

---

## 🔧 IMPLEMENTACIJSKI PLAN - KORAK PO KORAK

### **FAZA 1: HTML MODIFIKACIJE** (`index.html`)

#### **1.1 Ukloni "Visok Prioritet" Statistiku**
- Lokacija: Linija ~97-105 u `index.html`
- Akcija: Obriši celu `<div class="stat-card">` sekciju sa "Visok Prioritet"

#### **1.2 Ažuriraj Tabelu Header**
- Lokacija: Linija ~112-122 u `index.html`
- Akcija: Zameni postojeći `<thead>` sa novim header-om (7 kolona)

### **FAZA 2: JAVASCRIPT MODIFIKACIJE** (`app.js`)

#### **2.1 Ažuriraj updateStatistics() Funkciju**
- Lokacija: Linija ~326-336 u `app.js`
- Akcija: Ukloni `highPriority` logiku

#### **2.2 Dodaj Helper Funkcije**
- Lokacija: Dodaj na kraj `app.js`
- Funkcije: `getCategoryClass()`, `getCategoryDisplay()`, `formatPhone()`

#### **2.3 Ažuriraj renderOperators() Funkciju**
- Lokacija: Linija ~255-324 u `app.js`
- Akcija: Zameni sa novom strukturom (7 kolona umesto 9)

#### **2.4 Ažuriraj generateOperatorDetails() Funkciju**
- Lokacija: Linija ~640-769 u `app.js`
- Akcija: Dodaj tehnično osoblje sekciju

### **FAZA 3: CSS MODIFIKACIJE** (`styles.css`)

#### **3.1 Dodaj Stilove za Nove Komponente**
- Dodaj na kraj `styles.css`
- Stilovi za: kategorija badge-ovi, tehnično osoblje kartice, tooltip funkcionalnost

---

## 💻 **DETALJNI KOD SNIPPETS**

### **📝 HTML IZMENE**

```html
<!-- UKLONI OVU SEKCIJU IZ index.html: -->
<!-- 
<div class="stat-card">
    <div class="stat-icon priority">
        <i class="fas fa-star"></i>
    </div>
    <div class="stat-info">
        <h3 id="highPriorityOperators">0</h3>
        <p>Visok Prioritet</p>
    </div>
</div>
-->

<!-- ZAMENI TABELU HEADER SA: -->
<thead>
    <tr>
        <th>NAZIV</th>
        <th>KATEGORIJA</th>
        <th>TIP</th>
        <th>STATUS</th>
        <th>KOMPLETNOST</th>
        <th>KONTAKT</th>
        <th>AKCIJE</th>
    </tr>
</thead>
```

### **⚙️ JAVASCRIPT IZMENE**

```javascript
// 1. AŽURIRAJ updateStatistics() - UKLONI LINIJU:
// const highPriority = this.operators.filter(op => op.prioritet === 'visok').length;
// this.elements.highPriorityOperators.textContent = highPriority;

// 2. DODAJ HELPER FUNKCIJE:
getCategoryClass(operator) {
    const kategorije = {
        'dominantni': ['BH Telecom', 'HT Eronet', 'm:tel', 'Telekom Srpske'],
        'mvno': ['ONE', 'Zona', 'haloo', 'Novotel', 'Logosoft'],
        'isp': ['ADRIA NET', 'Telemach', 'Miss.Net', 'TX TV', 'VKT-Net'],
        'b2b': ['AKTON', 'LANACO', 'PROINTER ITSS']
    };
    
    for (const [category, operators] of Object.entries(kategorije)) {
        if (operators.some(op => 
            operator.komercijalni_naziv?.includes(op) || 
            operator.naziv.includes(op)
        )) {
            return category;
        }
    }
    return 'ostali';
}

getCategoryDisplay(operator) {
    const categoryMap = {
        'dominantni': '🏢 Dominantni',
        'mvno': '📱 MVNO', 
        'isp': '🌐 ISP',
        'b2b': '💼 B2B',
        'ostali': '🔹 Ostali'
    };
    return categoryMap[this.getCategoryClass(operator)] || '🔹 Ostali';
}

formatPhone(phone) {
    if (phone && phone.startsWith('+387')) {
        return phone.replace('+387', '+387 ').replace(/(\d{2})(\d{3})(\d{3,4})$/, '$1 $2 $3');
    }
    return phone || '';
}

// 3. DODAJ FUNKCIJU ZA TEHNIČNO OSOBLJE:
generateTechStaffSection(operator) {
    const techStaff = this.getTechStaffData(operator);
    
    if (!techStaff) {
        return `
        <div class="details-section tech-staff-section" style="grid-column: 1 / -1;">
            <h4><i class="fas fa-users-cog"></i> Tehnično Osoblje za Agencije</h4>
            <div class="tech-staff-notice">
                <i class="fas fa-info-circle"></i>
                <span>Podaci o tehničkom osoblju se ažuriraju...</span>
            </div>
        </div>`;
    }
    
    return `
    <div class="details-section tech-staff-section" style="grid-column: 1 / -1;">
        <h4><i class="fas fa-users-cog"></i> Tehnično Osoblje za Agencije</h4>
        <div class="tech-staff-grid">
            ${techStaff.osoba_1 ? `
            <div class="tech-person-card">
                <div class="person-header">
                    <i class="fas fa-user-tie"></i>
                    <span class="person-title">OSOBA 1</span>
                </div>
                <div class="person-info">
                    <div class="person-name">${techStaff.osoba_1.ime}</div>
                    <div class="person-position">${techStaff.osoba_1.pozicija}</div>
                    <div class="person-contact">
                        <a href="mailto:${techStaff.osoba_1.email}" class="contact-link">
                            <i class="fas fa-envelope"></i> ${techStaff.osoba_1.email}
                        </a>
                    </div>
                    <div class="person-contact">
                        <a href="tel:${techStaff.osoba_1.telefon}" class="contact-link">
                            <i class="fas fa-phone"></i> ${techStaff.osoba_1.telefon}
                        </a>
                    </div>
                </div>
            </div>` : ''}
            
            ${techStaff.osoba_2 ? `
            <div class="tech-person-card">
                <div class="person-header">
                    <i class="fas fa-user-tie"></i>
                    <span class="person-title">OSOBA 2</span>
                </div>
                <div class="person-info">
                    <div class="person-name">${techStaff.osoba_2.ime}</div>
                    <div class="person-position">${techStaff.osoba_2.pozicija}</div>
                    <div class="person-contact">
                        <a href="mailto:${techStaff.osoba_2.email}" class="contact-link">
                            <i class="fas fa-envelope"></i> ${techStaff.osoba_2.email}
                        </a>
                    </div>
                    <div class="person-contact">
                        <a href="tel:${techStaff.osoba_2.telefon}" class="contact-link">
                            <i class="fas fa-phone"></i> ${techStaff.osoba_2.telefon}
                        </a>
                    </div>
                </div>
            </div>` : ''}
        </div>
    </div>`;
}

// 4. BAZA TEHNIČKOG OSOBLJA:
getTechStaffData(operator) {
    const techStaffDB = {
        'bh telecom': {
            osoba_1: {
                ime: 'Nedim Fazlibegović',
                pozicija: 'Šef službe za ZPT i saradnju sa sudovima',
                email: 'nedim.fazlibegovic@bhtelecom.ba',
                telefon: '+387 61 616 034'
            },
            osoba_2: {
                ime: 'Muhamed Ništović',
                pozicija: 'Stručni saradnik za mreže u Službi za ZPT',
                email: 'muhamed.nistovic@bhtelecom.ba',
                telefon: '+387 61 137 616'
            }
        },
        'm:tel': {
            osoba_1: {
                ime: 'Zoran Sopka',
                pozicija: 'Šef Službe za bezbjednost',
                email: 'zoran.sopka@mtel.ba',
                telefon: '+387 66 915 505'
            },
            osoba_2: {
                ime: 'Slaven Ćosić',
                pozicija: 'Šef Službe za ISP - Funkcija eksploatacije',
                email: 'slaven.cosic@mtel.ba',
                telefon: '+387 65 901 873'
            }
        }
    };
    
    const operatorKey = (operator.komercijalni_naziv || operator.naziv).toLowerCase();
    return techStaffDB[operatorKey] || null;
}
```

### **🎨 CSS IZMENE**

```css
/* DODAJ NA KRAJ styles.css */

/* =========================== */
/* NOVA TABELA ORGANIZACIJA     */
/* =========================== */

/* Kolona širine */
.naziv-cell { width: 25%; position: relative; }
.kategorija-cell { width: 15%; }
.tip-cell { width: 15%; }
.status-cell { width: 10%; }
.kompletnost-cell { width: 15%; }
.kontakt-cell { width: 15%; }
.akcije-cell { width: 5%; }

/* Naziv formatting */
.operator-name strong {
    color: #1e293b;
    font-size: 14px;
}

.commercial-name {
    color: #64748b;
    font-size: 12px;
}

/* =========================== */
/* KATEGORIJA BADGE STILOVI     */
/* =========================== */

.category-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    display: inline-block;
    min-width: 80px;
}

.category-dominantni { 
    background: #dbeafe; 
    color: #1d4ed8; 
}

.category-mvno { 
    background: #fce7f3; 
    color: #be185d; 
}

.category-isp { 
    background: #dcfce7; 
    color: #16a34a; 
}

.category-b2b { 
    background: #fef3c7; 
    color: #d97706; 
}

.category-ostali { 
    background: #f1f5f9; 
    color: #64748b; 
}

/* =========================== */
/* PROGRESS I CONTACT STILOVI   */
/* =========================== */

.progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.progress-text {
    font-size: 11px;
    color: #64748b;
    min-width: 35px;
}

.contact-info {
    font-size: 11px;
    line-height: 1.4;
}

.contact-item {
    margin-bottom: 2px;
    color: #64748b;
}

.contact-item i {
    width: 12px;
    margin-right: 4px;
}

/* =========================== */
/* TEHNIČNO OSOBLJE SEKCIJA     */
/* =========================== */

.tech-staff-section {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 2px solid #3b82f6;
}

.tech-staff-section h4 {
    color: #1e40af;
    border-bottom-color: #3b82f6;
}

.tech-staff-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 16px;
}

.tech-person-card {
    background: white;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
    transition: transform 0.2s ease;
}

.tech-person-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.person-header {
    background: #3b82f6;
    color: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 12px;
}

.person-info {
    padding: 16px;
}

.person-name {
    font-size: 16px;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 4px;
}

.person-position {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 12px;
    line-height: 1.4;
}

.person-contact {
    margin-bottom: 8px;
}

.contact-link {
    color: #3b82f6;
    text-decoration: none;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s ease;
}

.contact-link:hover {
    color: #1d4ed8;
}

.tech-staff-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #fef3c7;
    border: 1px solid #fcd34d;
    border-radius: 6px;
    color: #92400e;
    font-size: 13px;
}

/* =========================== */
/* TOOLTIP FUNKCIONALNOST       */
/* =========================== */

[data-tooltip] {
    position: relative;
    cursor: help;
}

[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    margin-bottom: 5px;
}

[data-tooltip]:hover::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1f2937;
    z-index: 1000;
}

/* Service i Tech tagovi sa tooltip */
.service-tag[data-tooltip]:hover,
.tech-tag[data-tooltip]:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* =========================== */
/* RESPONSIVE ADJUSTMENTS       */
/* =========================== */

@media (max-width: 1200px) {
    .kontakt-cell {
        display: none;
    }
    
    .naziv-cell { width: 30%; }
    .kategorija-cell { width: 20%; }
    .tip-cell { width: 20%; }
    .kompletnost-cell { width: 20%; }
    .akcije-cell { width: 10%; }
}

@media (max-width: 768px) {
    .kategorija-cell,
    .tip-cell {
        display: none;
    }
    
    .naziv-cell { width: 50%; }
    .status-cell { width: 20%; }
    .kompletnost-cell { width: 20%; }
    .akcije-cell { width: 10%; }
    
    .tech-staff-grid {
        grid-template-columns: 1fr;
    }
    
    .tech-person-card {
        margin-bottom: 12px;
    }
}
```

---

## 🗂️ TOOLTIP DEFINICIJE

### **USLUGE OPERATERA:**
```javascript
const serviceTooltips = {
    'mobile_prepaid': 'Mobilna telefonija na dopunu - plaćanje unapred',
    'mobile_postpaid': 'Mobilna telefonija sa ugovornom obavezom i mesečnim račun',
    'mobile_esim': 'Ugrađena digitalna SIM kartica - nema fizičku karticu',
    'mobile_roaming': 'Korišćenje mobilnih usluga u inostranstvu',
    'mobile_mnp': 'Prebacivanje broja između različitih operatera',
    'fixed_pstn': 'Klasična fiksna telefonska linija (PSTN)',
    'fixed_voip': 'Fiksna telefonija preko internet protokola',
    'internet_ftth': 'Internet preko optičkih vlakana direktno do kuće',
    'internet_cable': 'Internet preko kablovski TV infrastrukture',
    'iptv': 'Televizija preko internet protokola'
};
```

### **TEHNIČKE MOGUĆNOSTI:**
```javascript
const techTooltips = {
    'tech_2g': 'GSM druga generacija mobilne mreže',
    'tech_3g': 'UMTS treća generacija mobilne mreže',
    'tech_4g': 'LTE četvrta generacija mobilne mreže',
    'tech_5g_ready': 'Mreža spremna za 5G tehnologiju',
    'tech_ftth_fttb': 'Optička vlakna do kuće/zgrade',
    'tech_volte': 'Glas preko LTE mreže',
    'tech_vowifi': 'Glas preko Wi-Fi mreže',
    'tech_mpls': 'Multiprotocol Label Switching'
};
```

---

## ⚡ **REDOSLED IMPLEMENTACIJE**

### **PRIORITET 1 - KRITIČNI DELOVI:**
1. ✅ **HTML tabela header** - brza izmena, veliki vizuelni efekat
2. ✅ **Uklanjanje "Visok Prioritet"** - čišći dashboard  
3. ✅ **Kategorija kolona** - važna za organizaciju

### **PRIORITET 2 - FUNKCIONALNOST:**
4. ✅ **Tehnično osoblje sekcija** - glavna nova funkcionalnost
5. ✅ **Poboljšano formatiranje** - telefon, progress bar, kontakt

### **PRIORITET 3 - POLISH:**
6. ✅ **Tooltip funkcionalnost** - korisna ali ne kritična
7. ✅ **CSS stilizovanje** - finalno polish
8. ✅ **Responsive optimizacije** - mobilni prikaz

---

## 🧪 **TESTIRANJE**

### **Pre Implementacije:**
- [ ] Napravi backup postojećih fajlova
- [ ] Testiraj postojeću funkcionalnost

### **Tokom Implementacije:**
- [ ] Testiraj svaku fazu posebno
- [ ] Proveri responsive behavior
- [ ] Testiraj sa različitim brojem operatera

### **Nakon Implementacije:**
- [ ] Testiraj sve kolone tabele
- [ ] Testiraj expandable details
- [ ] Testiraj tehnično osoblje sekciju
- [ ] Testiraj tooltip funkcionalnost
- [ ] Testiraj na mobilnim uređajima

---

## 📈 **OČEKIVANI RISULTATI**

### **KORISNOST:**
- ✅ Jasniji prikaz operatera sa kategorijama
- ✅ Lakši pristup kontakt informacijama za tehničko osoblje
- ✅ Čišći dashboard bez nepotrebnih informacija
- ✅ Bolji responsive experience

### **VIZUELNA POBOLJŠANJA:**
- ✅ Moderna kategorija badge-ovi sa emoji ikonama
- ✅ Elegantne kartice za tehnično osoblje
- ✅ Tooltips sa objašnjenjima tehničkih termina
- ✅ Bolje formatiranje telefona i kontakt podataka

---

**Status:** ✅ Plan spreman za implementaciju  
**Sledeći korak:** Počni sa Fazom 1 - HTML izmene