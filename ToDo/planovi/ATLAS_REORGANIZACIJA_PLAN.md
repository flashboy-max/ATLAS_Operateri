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
|-------|------------|-----|--------|-------------|-----------|-------------|---------|--------|
```

### **NOVO STANJE:**
```
| NAZIV           | KATEGORIJA    | TIP           | STATUS  | KOMPLETNOST | KONTAKT           | AKCIJE |
|-----------------|---------------|---------------|---------|-------------|-------------------|--------|
| BH Telecom      | 🏢 Dominantni | Dominantni... | aktivan | [====] 100% | +387 33 000 900  | 👁️✏️🗑️ |
| Zona.ba         | 📱 MVNO       | MVNO...       | aktivan | [===] 95%   | +387 55 420 100  | 👁️✏️🗑️ |
| ADRIA NET       | 🌐 ISP        | ISP...        | aktivan | [===] 95%   | +387 36 348 641  | 👁️✏️🗑️ |
| AKTON           | 💼 B2B        | B2B...        | aktivan | [===] 95%   | +387 33 296 622  | 👁️✏️🗑️ |
```

---

## 📊 TRANSFORMACIJA DASHBOARD-A

### **STARO STANJE:**
```
📊 12 Ukupno    ✅ 12 Aktivni    ❌ 0 Neaktivni    ⭐ 8 Visok Prioritet
```

### **NOVO STANJE:**
```
📊 12 Ukupno    ✅ 12 Aktivni    ❌ 0 Neaktivni
```

---

## 🗂️ NOVA JSON STRUKTURA PODATAKA

### **TRENUTNA STRUKTURA:**
```json
{
  "id": 1,
  "naziv": "BH Telecom d.d. Sarajevo",
  "komercijalni_naziv": "BH Telecom",
  "tip": "Dominantni operater",
  "status": "aktivan",
  "kontakt_osoba": "Nedim Fazlibegović - Šef službe za ZPT..."
}
```

### **NOVA PROŠIRENA STRUKTURA:**
```json
{
  "id": 1,
  "naziv": "BH Telecom d.d. Sarajevo",
  "komercijalni_naziv": "BH Telecom",
  "tip": "Dominantni operater",
  "status": "aktivan",
  
  // NOVO: Osnovni kontakt
  "kontakt_osnovni": {
    "telefon": "+387 33 000 900",
    "email": "info@bhtelecom.ba",
    "adresa": "Obala Kulina bana 8, 71000 Sarajevo",
    "web": "https://www.bhtelecom.ba"
  },
  
  // NOVO: Tehnično osoblje za agencije
  "tehnicko_osoblje": {
    "osoba_1": {
      "ime": "Nedim Fazlibegović",
      "pozicija": "Šef službe za ZPT i saradnju sa sudovima",
      "email": "nedim.fazlibegovic@bhtelecom.ba",
      "telefon": "+387 61 616 034"
    },
    "osoba_2": {
      "ime": "Muhamed Ništović",
      "pozicija": "Stručni saradnik za mreže u Službi za ZPT",
      "email": "muhamed.nistovic@bhtelecom.ba", 
      "telefon": "+387 61 137 616"
    }
  },
  
  // Postojeći podaci...
  "usluge": ["mobile_prepaid", "mobile_postpaid", "internet_ftth"],
  "tehnologije": ["tech_2g", "tech_3g", "tech_4g", "tech_ftth_fttb"]
}
```

---

## 🎨 NOVI OPERATOR DETAILS LAYOUT

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 📋 OSNOVNE INFORMACIJE               │ 📞 KONTAKT INFORMACIJE                           │
│ • Naziv: BH Telecom d.d. Sarajevo    │ • Adresa: Obala Kulina bana 8, 71000 Sarajevo   │
│ • Komercijalni: BH Telecom           │ • Telefon: +387 33 000 900                      │
│ • Tip: Dominantni operater           │ • Email: info@bhtelecom.ba                       │
│ • Status: Aktivan                    │ • Web: https://www.bhtelecom.ba                  │
│ • Kompletnost: [████████████] 100%   │                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ 👥 TEHNIČNO OSOBLJE ZA AGENCIJE                                                         │
│ ┌─────────────────────────────────────┐ ┌─────────────────────────────────────────────┐ │
│ │ 👤 OSOBA 1                          │ │ 👤 OSOBA 2                                  │ │
│ │ ┌─ Nedim Fazlibegović              │ │ ┌─ Muhamed Ništović                        │ │
│ │ │  📋 Šef službe za ZPT i saradnju  │ │ │  📋 Stručni saradnik za mreže u Službi   │ │
│ │ │     sa sudovima, tužilaštvima...  │ │ │     za ZPT i saradnju sa sudovima...     │ │
│ │ │  📧 nedim.fazlibegovic@bht...     │ │ │  📧 muhamed.nistovic@bht...               │ │
│ │ │  📞 +387 61 616 034               │ │ │  📞 +387 61 137 616                       │ │
│ │ └───────────────────────────────────│ │ └─────────────────────────────────────────  │ │
│ └─────────────────────────────────────┘ └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ 📝 OPIS ORGANIZACIJE                                                                    │
│ Najveći telekom operater u BiH sa kompletnom ponudom telekomunikacijskih usluga.       │
│ Lider na tržištu mobilne i fiksne telefonije, interneta i digitalnih usluga.           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ 🔧 USLUGE OPERATERA                              │ ⚙️ TEHNIČKE MOGUĆNOSTI            │
│ [Mobilni Prepaid] [Mobilni Postpaid] [eSIM]     │ [2G] [3G] [4G] [5G Ready]         │
│ [VoIP telefonija] [Optički internet] [IPTV]     │ [FTTH/FTTB] [VoLTE] [VoWiFi]      │
│ ⬆️ HOVER preko tagova za objašnjenja             │ ⬆️ HOVER preko tagova za objašnj. │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTACIJSKI PLAN - KORAK PO KORAK

### **FAZA 1: HTML MODIFIKACIJE** (`index.html`)

#### **1.1 Ukloni "Visok Prioritet" Statistiku**
```html
<!-- OBRIŠI OVU SEKCIJU: -->
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
```

#### **1.2 Ažuriraj Tabelu Header**
```html
<!-- STARO: -->
<!-- 
<thead>
    <tr>
        <th>Naziv</th>
        <th>Kategorija</th>
        <th>Tip</th>
        <th>Status</th>
        <th>ATLAS Status</th>
        <th>Prioritet</th>
        <th>Kompletnost</th>
        <th>Kontakt</th>
        <th>Akcije</th>
    </tr>
</thead>
-->

<!-- NOVO: -->
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

### **FAZA 2: JAVASCRIPT MODIFIKACIJE** (`app.js`)

#### **2.1 Ažuriraj updateStatistics() Funkciju**
```javascript
updateStatistics() {
    const total = this.operators.length;
    const active = this.operators.filter(op => op.status === 'aktivan').length;
    const inactive = total - active;
    // UKLANJAMO: const highPriority = this.operators.filter(op => op.prioritet === 'visok').length;
    
    this.elements.totalOperators.textContent = total;
    this.elements.activeOperators.textContent = active;
    this.elements.inactiveOperators.textContent = inactive;
    // UKLANJAMO: this.elements.highPriorityOperators.textContent = highPriority;
}
```

#### **2.2 Dodaj Helper Funkcije za Kategorije**
```javascript
// Određuje kategoriju operatera na osnovu naziva
getCategoryClass(operator) {
    const kategorije = {
        'dominantni': ['BH Telecom', 'HT Eronet', 'm:tel', 'Telekom Srpske'],
        'mvno': ['ONE', 'Zona', 'haloo', 'Novotel', 'Logosoft'],
        'isp': ['ADRIA NET', 'Telemach', 'Miss.Net', 'TX TV', 'VKT-Net', 'Telrad Net'],
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

// Vraća prikaz kategorije sa emoji
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

// Formatira telefon za lepši prikaz
formatPhone(phone) {
    if (phone && phone.startsWith('+387')) {
        return phone.replace('+387', '+387 ').replace(/(\d{2})(\d{3})(\d{3,4})$/, '$1 $2 $3');
    }
    return phone || '';
}
```

#### **2.3 Nova renderOperators() Funkcija**
```javascript
renderOperators(operatorsToRender = null) {
    const operators = operatorsToRender || this.operators;
    const tbody = this.elements.operatorsTableBody;
    
    if (operators.length === 0) {
        this.elements.noResults.style.display = 'block';
        tbody.innerHTML = '';
        return;
    }
    
    this.elements.noResults.style.display = 'none';
    
    tbody.innerHTML = operators.map(operator => `
        <tr class="fade-in operator-row" data-id="${operator.id}" onclick="app.toggleOperatorDetails(${operator.id})">
            <td class="naziv-cell">
                <div class="operator-name">
                    <strong>${operator.naziv}</strong>
                    ${operator.komercijalni_naziv ? 
                        `<br><small class="commercial-name">${operator.komercijalni_naziv}</small>` : ''}
                    <span class="expand-indicator">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </div>
            </td>
            <td class="kategorija-cell">
                <span class="category-badge category-${this.getCategoryClass(operator)}">
                    ${this.getCategoryDisplay(operator)}
                </span>
            </td>
            <td class="tip-cell">
                <span class="type-badge">${this.truncateText(operator.tip, 25)}</span>
            </td>
            <td class="status-cell">
                <span class="status-badge status-${operator.status}">${operator.status}</span>
            </td>
            <td class="kompletnost-cell">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${operator.kompletnost || 0}%"></div>
                    </div>
                    <small class="progress-text">${operator.kompletnost || 0}%</small>
                </div>
            </td>
            <td class="kontakt-cell">
                <div class="contact-info">
                    ${operator.telefon ? 
                        `<div class="contact-item">
                            <i class="fas fa-phone"></i> ${this.formatPhone(operator.telefon)}
                        </div>` : ''}
                    ${operator.email ? 
                        `<div class="contact-item">
                            <i class="fas fa-envelope"></i> ${this.truncateText(operator.email, 20)}
                        </div>` : ''}
                </div>
            </td>
            <td class="akcije-cell">
                <div class="action-buttons">
                    <button class="action-btn view" onclick="event.stopPropagation(); app.viewOperator(${operator.id})" title="Pogledaj">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="event.stopPropagation(); app.editOperator(${operator.id})" title="Uredi">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="event.stopPropagation(); app.deleteOperator(${operator.id})" title="Obriši">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
        <tr class="operator-details" id="details-${operator.id}">
            <td colspan="7">
                <div class="operator-details-content">
                    ${this.generateOperatorDetails(operator)}
                </div>
            </td>
        </tr>
    `).join('');
}
```

#### **2.4 Nova generateOperatorDetails() Funkcija**
```javascript
generateOperatorDetails(operator) {
    const services = this.formatServicesList(operator.usluge);
    const technologies = this.formatTechnologiesList(operator.tehnologije);
    const techStaff = this.generateTechStaffSection(operator);
    
    return `
        <div class="details-grid">
            <!-- Osnovne Informacije -->
            <div class="details-section">
                <h4><i class="fas fa-info-circle"></i> Osnovne Informacije</h4>
                <div class="detail-item">
                    <span class="detail-label">Naziv:</span>
                    <span class="detail-value">${operator.naziv}</span>
                </div>
                ${operator.komercijalni_naziv ? `
                <div class="detail-item">
                    <span class="detail-label">Komercijalni:</span>
                    <span class="detail-value">${operator.komercijalni_naziv}</span>
                </div>` : ''}
                <div class="detail-item">
                    <span class="detail-label">Tip:</span>
                    <span class="detail-value">${operator.tip}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge status-${operator.status}">${operator.status}</span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Kompletnost:</span>
                    <span class="detail-value">
                        <div class="progress-bar" style="width: 80px; display: inline-block;">
                            <div class="progress-fill" style="width: ${operator.kompletnost || 0}%"></div>
                        </div>
                        ${operator.kompletnost || 0}%
                    </span>
                </div>
            </div>

            <!-- Osnovni Kontakt -->
            <div class="details-section">
                <h4><i class="fas fa-address-book"></i> Kontakt Informacije</h4>
                ${operator.adresa ? `
                <div class="detail-item">
                    <span class="detail-label">Adresa:</span>
                    <span class="detail-value">${operator.adresa}</span>
                </div>` : ''}
                ${operator.telefon ? `
                <div class="detail-item">
                    <span class="detail-label">Telefon:</span>
                    <span class="detail-value">
                        <a href="tel:${operator.telefon}" class="contact-link">
                            <i class="fas fa-phone"></i> ${operator.telefon}
                        </a>
                    </span>
                </div>` : ''}
                ${operator.email ? `
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">
                        <a href="mailto:${operator.email}" class="contact-link">
                            <i class="fas fa-envelope"></i> ${operator.email}
                        </a>
                    </span>
                </div>` : ''}
                ${operator.web ? `
                <div class="detail-item">
                    <span class="detail-label">Website:</span>
                    <span class="detail-value">
                        <a href="${operator.web}" target="_blank" class="contact-link">
                            <i class="fas fa-external-link-alt"></i> ${operator.web}
                        </a>
                    </span>
                </div>` : ''}
            </div>

            <!-- NOVO: Tehnično Osoblje -->
            ${techStaff}

            <!-- Opis -->
            ${operator.opis ? `
            <div class="details-section" style="grid-column: 1 / -1;">
                <h4><i class="fas fa-file-alt"></i> Opis Organizacije</h4>
                <p style="margin: 0; line-height: 1.6;">${operator.opis}</p>
            </div>` : ''}

            <!-- Usluge sa tooltip -->
            ${services ? `
            <div class="details-section">
                <h4><i class="fas fa-concierge-bell"></i> Usluge Operatera</h4>
                <div class="service-tags">
                    ${services}
                </div>
            </div>` : ''}

            <!-- Tehnologije sa tooltip -->
            ${technologies ? `
            <div class="details-section">
                <h4><i class="fas fa-microchip"></i> Tehničke Mogućnosti</h4>
                <div class="tech-tags">
                    ${technologies}
                </div>
            </div>` : ''}
        </div>
    `;
}
```

#### **2.5 Funkcija za Tehnično Osoblje**
```javascript
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

// Privremena baza podataka tehničkog osoblja (dok ne ažuriramo JSON)
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
        },
        'ht eronet': {
            osoba_1: {
                ime: 'Slaven Zelenika',
                pozicija: 'Rukovoditelj Odjela za internu kontrolu i sigurnost',
                email: 'slaven.zelenika@hteronet.ba',
                telefon: '+387 36 395 000'
            },
            osoba_2: {
                ime: '[potrebno dopuniti]',
                pozicija: 'Tehnička podrška',
                email: '[potrebno dopuniti]',
                telefon: '[potrebno dopuniti]'
            }
        }
    };
    
    const operatorKey = (operator.komercijalni_naziv || operator.naziv).toLowerCase();
    
    // Pokušaj direktno podudaranje
    if (techStaffDB[operatorKey]) {
        return techStaffDB[operatorKey];
    }
    
    // Pokušaj parcijalno podudaranje
    for (const [key, data] of Object.entries(techStaffDB)) {
        if (operatorKey.includes(key) || key.includes(operatorKey)) {
            return data;
        }
    }
    
    return null;
}
```

#### **2.6 Tooltip Funkcionalnost za Usluge i Tehnologije**
```javascript
formatServicesList(services) {
    if (!services || !Array.isArray(services) || services.length === 0) {
        return null;
    }
    
    const serviceNames = {
        'mobile_prepaid': { 
            name: 'Mobilni Prepaid', 
            tooltip: 'Mobilna telefonija na dopunu - plaćanje unapred' 
        },
        'mobile_postpaid': { 
            name: 'Mobilni Postpaid', 
            tooltip: 'Mobilna telefonija sa ugovornom obavezom i mesečnim račun' 
        },
        'mobile_esim': { 
            name: 'eSIM', 
            tooltip: 'Ugrađena digitalna SIM kartica - nema fizičku karticu' 
        },
        'mobile_roaming': { 
            name: 'Roaming', 
            tooltip: 'Korišćenje mobilnih usluga u inostranstvu' 
        },
        'mobile_mnp': { 
            name: 'Prenos broja', 
            tooltip: 'Prebacivanje broja između različitih operatera' 
        },
        'fixed_pstn': { 
            name: 'Fiksna telefonija', 
            tooltip: 'Klasična fiksna telefonska linija (PSTN)' 
        },
        'fixed_voip': { 
            name: 'VoIP telefonija', 
            tooltip: 'Fiksna telefonija preko internet protokola' 
        },
        'internet_ftth': { 
            name: 'Optički internet', 
            tooltip: 'Internet preko optičkih vlakana direktno do kuće' 
        },
        'internet_cable': { 
            name: 'Kablovski internet', 
            tooltip: 'Internet preko kablovski TV infrastrukture' 
        },
        'internet_mobile': { 
            name: 'Mobilni internet', 
            tooltip: 'Internet preko mobilne mreže (3G/4G/5G)'