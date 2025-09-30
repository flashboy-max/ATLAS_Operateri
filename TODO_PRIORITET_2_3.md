# 📋 TODO Lista - PRIORITET 2 i 3
**Datum:** 30. septembar 2025  
**Status:** ✅ PRIORITET 1 ZAVRŠEN → Krećemo sa PRIORITET 2

---

## ✅ ŠTO JE URAĐENO (PRIORITET 1)

1. ✅ Event listeneri za dugmad "Dodaj Uslugu" i "Dodaj Tehnologiju"
2. ✅ Refaktorisana `addTechnologyField()` - pun prikaz kao kod usluga
3. ✅ Uklonjene duplirane pomoćne metode
4. ✅ CSS poboljšanja - tooltipovi, tagovi, hover efekti, focus stanja
5. ✅ Vizuelni dizajn modernizovan

---

## 🔥 PRIORITET 2 - Validacija i UX (Sledeći korak)

### 2.1 Validacija usluga i tehnologija
- [ ] **Validacija pri submit-u forme:**
  - [ ] Provera da li je barem jedna usluga dodana
  - [ ] Provera da li je barem jedna tehnologija dodana
  - [ ] Provera da svi tehnički kontakti imaju popunjena obavezna polja (ime, email)
  - [ ] Prikaz grešaka u formi ako validacija ne prođe

```javascript
// Primer implementacije:
validateServicesAndTechnologies(formData) {
    const errors = [];
    
    // Check services
    const services = this.getServicesData();
    if (services.length === 0) {
        errors.push({
            field: 'usluge',
            message: 'Morate dodati barem jednu uslugu'
        });
    }
    
    // Check technologies
    const technologies = this.getTechnologiesData();
    if (technologies.length === 0) {
        errors.push({
            field: 'tehnologije',
            message: 'Morate dodati barem jednu tehnologiju'
        });
    }
    
    return errors;
}
```

### 2.2 Vizuelni indikatori za kompletnost forme
- [ ] **Progress bar** na vrhu modala koji prikazuje % popunjenosti forme
- [ ] **Sekcije sa check markovima** - označava koje sekcije su kompletne:
  - ✅ Osnovni podaci (naziv, tip, status)
  - ✅ Kontakt informacije
  - ✅ Usluge (barem 1)
  - ✅ Tehnologije (barem 1)
  - ✅ Tehnički kontakti (barem 1)

```html
<!-- Primer progress bara -->
<div class="form-progress">
    <div class="progress-bar" style="width: 75%;">
        <span>75% kompletno</span>
    </div>
</div>

<div class="form-sections-status">
    <div class="section-status complete">
        <i class="fas fa-check-circle"></i> Osnovni podaci
    </div>
    <div class="section-status incomplete">
        <i class="fas fa-exclamation-circle"></i> Usluge
    </div>
</div>
```

### 2.3 Notifikacije i feedback
- [ ] **Real-time validacija** pri unosu:
  - Zelena check marka pored ispravno popunjenih polja
  - Crveni X pored neispravnih polja
  - Inline poruka ispod polja šta je greška
- [ ] **Toast notifikacije** pri akcijama:
  - "Usluga dodana" (success)
  - "Tehnologija dodana" (success)
  - "Popunite obavezna polja" (warning)
  - "Operater sačuvan" (success)

### 2.4 Improved tooltips za parametre
- [ ] Tooltipovi u glavnom prikazu (OperatorCard) - trenutno ne rade, treba ispraviti
- [ ] Tooltip helper funkcija koja vraća detaljan opis parametra
- [ ] Tooltip za svaki parametar u card-u (usluge, tehnologije, tehnički kontakti)

```javascript
// Primer tooltip-a u OperatorCard:
<div class="info-item" data-tooltip="Detaljan opis ove usluge">
    <i class="fas fa-globe"></i>
    <span>Internet 100/20 Mbps</span>
</div>
```

---

## 📦 PRIORITET 3 - CSS Cleanup i organizacija

### 3.1 Uklanjanje duplikata u CSS (~2970 → ~1000 linija)
- [ ] **Identifikuj duplirane blokove:**
  ```bash
  # Koristi grep/regex za pronalaženje duplikata
  Get-Content styles.css | Select-String -Pattern "\.modal" -Context 2,2
  ```
- [ ] **Konsoliduj modal stilove** (trenutno ima 10+ verzija)
- [ ] **Konsoliduj tooltip stilove** (ako ima duplikata)
- [ ] **Konsoliduj form stilove**
- [ ] **Ukloni zakomentarisane/nekorištene stilove**

### 3.2 Ekstrakcija CSS varijabli
- [ ] **Boje:**
  ```css
  :root {
      /* Brand colors */
      --brand-primary: #3b82f6;
      --brand-secondary: #10b981;
      
      /* Status colors */
      --status-success: #10b981;
      --status-warning: #f59e0b;
      --status-error: #ef4444;
      
      /* Category colors (već postoje) */
      --category-dominantni: #dbeafe;
      ...
  }
  ```
- [ ] **Spacing:**
  ```css
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  ```
- [ ] **Border radius:**
  ```css
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  ```

### 3.3 BEM metodologija (opciono)
- [ ] Razmotri primenu BEM za bolje organizovanje klasa:
  ```css
  /* Block */
  .operator-card { }
  
  /* Element */
  .operator-card__header { }
  .operator-card__title { }
  .operator-card__body { }
  
  /* Modifier */
  .operator-card--dominantni { }
  .operator-card--mobilni { }
  ```

---

## 🔧 PRIORITET 4 - Refactoring i dokumentacija

### 4.1 Konsolidacija strukture podataka
- [ ] **Dokumentovati očekivanu strukturu:**
  ```javascript
  // operateri.json struktura:
  {
      "id": 1,
      "naziv": "BH Telecom",
      "usluge": [
          {
              "kategorija": "mobile",
              "naziv": "Mobilna telefonija",
              "opis": "Postpaid i prepaid",
              "status": "aktivna"
          }
      ],
      "tehnologije": [...],
      "tehnicki_kontakti": [...]
  }
  ```
- [ ] **Validacija strukture pri učitavanju** - JSON Schema?
- [ ] **Migracija starih podataka** ako je potrebno

### 4.2 Dokumentacija
- [ ] **README.md** - kako pokrenuti projekat, struktura foldera
- [ ] **DEVELOPER_GUIDE.md** - kako dodati novu funkcionalnost
- [ ] **API_DOCUMENTATION.md** - dokumentacija ATLASApp API-ja
- [ ] **CHANGELOG.md** - verzionisanje i istorija izmjena

### 4.3 Testiranje
- [ ] **Unit testovi** (opciono, ako želiš):
  ```javascript
  // Primjer testa:
  test('validateFormData returns errors for empty name', () => {
      const formData = new FormData();
      const result = app.validateFormData(formData);
      expect(result.errors).toContain({
          field: 'naziv',
          message: 'Naziv operatera je obavezan'
      });
  });
  ```
- [ ] **Lint provjera** - ESLint za JavaScript
- [ ] **Manual testing checklist** - lista scenarija za testiranje

---

## 🎯 Predloženi redosled rada

### Faza 1: Validacija (1-2h)
1. Dodaj validaciju usluga/tehnologija u `validateFormData()`
2. Dodaj real-time validaciju pri unosu
3. Dodaj toast notifikacije za akcije
4. Testiraj sve validacije

### Faza 2: UX poboljšanja (1-2h)
5. Dodaj progress bar za kompletnost forme
6. Dodaj sekcije sa check markovima
7. Ispravi tooltipove u OperatorCard
8. Testiraj UX flow

### Faza 3: CSS Cleanup (2-3h)
9. Identifikuj i ukloni duplikate u CSS
10. Ekstrauj CSS varijable
11. Reorganizuj stilove u logičke sekcije
12. Testiraj vizuelni prikaz

### Faza 4: Dokumentacija (1h)
13. Napiši README.md
14. Napiši CHANGELOG.md
15. Dodaj komentare u kritične delove koda

---

## 📊 Estimated effort

| Prioritet | Zadaci | Procenjeno vreme | Težina |
|-----------|--------|------------------|--------|
| PRIORITET 1 | 5 zadataka | ✅ ZAVRŠENO (4h) | 🔴 Kritično |
| PRIORITET 2 | 4 sekcije | 4-6h | 🟠 Visoko |
| PRIORITET 3 | 3 sekcije | 3-4h | 🟡 Srednje |
| PRIORITET 4 | 3 sekcije | 2-3h | 🟢 Nisko |
| **UKUPNO** | **15 sekcija** | **13-17h** | |

---

## 🚀 Kako nastaviti

1. **Testiraj PRIORITET 1 izmjene** - otvori `index.html` i provjeri sve funkcionalnosti
2. **Odaberi sledeću fazu** - preporučujem PRIORITET 2 (validacija)
3. **Kreni sa implementacijom** - fokusiraj se na jednu sekciju po sekciju
4. **Testiraj nakon svake promjene** - ne čekaj kraj da testiraš
5. **Commit često** - svaka logička cjelina zaslužuje commit

---

## 💡 Preporuke

### Za PRIORITET 2:
- Počni sa validacijom usluga/tehnologija - to je najvažnije
- Progress bar i sekcije su nice-to-have, ali ne blokeri
- Real-time validacija mnogo poboljšava UX

### Za PRIORITET 3:
- CSS cleanup može biti zamoran, ali je neophodan
- Koristi Find & Replace u VS Code-u za brže uklanjanje duplikata
- CSS varijable će ti olakšati buduće izmjene

### Za PRIORITET 4:
- Dokumentacija je bitna, ali ne mora biti perfektna
- Fokusiraj se na README i CHANGELOG - to je minimum
- Testove možeš dodati kasnije ako je potrebno

---

**Sledeći korak:** Testiraj PRIORITET 1 izmjene pa odluči da li kreće odmah sa PRIORITET 2 ili želiš prvo da vidim nešto drugo! 🎯
