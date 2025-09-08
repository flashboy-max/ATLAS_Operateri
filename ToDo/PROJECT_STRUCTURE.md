# ATLAS HTML - Struktura Projekta

## Pregled

ATLAS HTML je potpuno **samostalna web aplikacija** za upravljanje bazom podataka telekomunikacionih operatera u Bosni i Hercegovini. Ovaj projekat je nezavisan od glavnog ATLAS backend sistema i koristi samo frontend tehnologije.

---

## Kompleta Struktura Projekta

```
ATLAS html/
│
├── 📄 index.html                    # Glavna aplikacija (osnovna verzija)
├── 📄 index_enhanced.html           # Poboljšana verzija aplikacije
├── 📄 app.js                        # Core JavaScript funkcionalnost
├── 📄 app_enhanced.js               # Proširene funkcionalnosti
├── 📄 styles.css                    # Glavni stylesheet
├── 📄 operateri.json                # Baza podataka operatera
├── 📄 start-atlas-html.bat          # Launch script za Windows
├── 📄 PROJECT_STRUCTURE.md          # Ovaj dokument
│
└── 📁 ToDo/                         # Projektna dokumentacija
    ├── 📄 README.md                 # Pregled projekta i planova
    │
    ├── 📁 planovi/                  # Razvojni planovi
    │   └── 📄 poboljsanja_plan.md   # Detaljni plan poboljšanja
    │
    ├── 📁 implementacija/           # Praćenje implementacije
    │   └── 📄 progress_tracking.md  # Progress tracking i status
    │
    ├── 📁 testovi/                  # Test planovi i rezultati
    │   └── 📄 test_plan.md          # Sveobuhvatan test plan
    │
    ├── 📁 backup/                   # Rezervne kopije
    │   └── 📄 operateri_backup.json # Backup podataka operatera
    │
    ├── 📁 dokumentacija/            # Tehnička dokumentacija
    │   └── 📄 tehnicka_dokumentacija.md # Detaljni tehniči opis
    │
    └── 📁 Pojedinacni_operateri/    # 🔥 REFERENCE MATERIJAL
        ├── 📄 BH Telecom d.d. Sarajevo.md
        ├── 📄 Telekom Srpske a.d. Banja Luka (m-tel).md
        ├── 📄 JP Hrvatske telekomunikacije d.d. Mostar (HT Eronet).md
        ├── 📄 ONE.Vip d.o.o.md
        ├── 📄 Haloo d.o.o. Sarajevo (MVNO).md
        ├── 📄 LANACO d.o.o.md
        ├── 📄 AKTON d.o.o. Sarajevo.md
        ├── 📄 Telemach d.o.o. Sarajevo.md
        ├── 📄 ADRIA NET Sarajevo.md
        └── ... (30+ detaljnih profila operatera)
```

---

## Komponente Aplikacije

### 🎯 Glavne Datoteke

| Datoteka | Opis | Status |
|----------|------|--------|
| `index.html` | Osnovna verzija aplikacije sa osnovnim funkcionalnostima | ✅ Aktivan |
| `index_enhanced.html` | Poboljšana verzija sa dodatnim features | ✅ Development |
| `app.js` | Core JavaScript - CRUD, search, osnovne funkcionalnosti | ✅ Stabilan |
| `app_enhanced.js` | Prošireni JS - kategorije, expand details, optimization | 🚧 U razvoju |
| `styles.css` | Responzivni CSS3 styling za sve komponente | ✅ Stabilan |
| `operateri.json` | JSON baza sa podacima telekom operatera | ✅ Aktivan |

### 🚀 Pokretanje

| Metod | Opis | Preporučeno |
|-------|------|-------------|
| **start-atlas-html.bat** | Jedan-klik pokretanje sa auto browser launch | ✅ DA |
| **Direktno otvaranje** | Dupli-klik na index.html | ✅ Jednostavno |
| **Lokalni server** | Python -m http.server ili Node.js | ✅ Development |

---

## 📊 Funkcionalnosti

### ✅ Implementirano
- **CRUD operacije** - Dodavanje, uređivanje, brisanje operatera
- **Search & filtriranje** - Pretraga po nazivu i osnovne filtere
- **Responzivni dizajn** - Prilagođava se različitim ekranima
- **LocalStorage persistence** - Čuva stanje aplikacije
- **JSON data management** - Učitava i čuva podatke u JSON formatu
- **Modal forms** - Za dodavanje i uređivanje
- **Data validation** - Osnovne validacije input podataka

### 🚧 U razvoju
- **Data Enhancement** 🔥 - Integracija 30+ profila iz Pojedinacni_operateri/
- **Kategorizacija operatera** - 4 glavne kategorije (Dominantni, MVNO, Regionalni ISP, Lokalni ISP)
- **Expandable details** - Detaljni prikaz na klik
- **Performance optimizacije** - Za 50+ operatera
- **Enhanced search** - Autocomplete i advanced filteri

### 📋 Planirano
- **Paginacija sistema** - 20 elemenata po stranici
- **Export/Import** - JSON/CSV funkcionalnosti
- **Dark theme** - Light/Dark mode toggle
- **Accessibility** - ARIA labels i keyboard navigation
- **PWA features** - Offline support

---

## 🎯 Autonomnost Projekta

### Nezavisnost od ATLAS Backend-a
- ✅ **Nema backend zavisnosti** - Radi potpuno samostalno
- ✅ **Lokalni data storage** - JSON + LocalStorage
- ✅ **Frontend-only tehnologije** - HTML, CSS, JavaScript
- ✅ **Cross-platform kompatibilnost** - Radi na svim OS
- ✅ **Nema instalacije** - Direktno pokretanje

### Vlastiti Development Lifecycle
- ✅ **Nezavisan codebase** - Odvojen od glavnog ATLAS-a
- ✅ **Vlastita dokumentacija** - Kompletna u ToDo/ folderu
- ✅ **Nezavisan testing** - Vlastiti test planovi
- ✅ **Vlastiti release ciklus** - Nezavisan od backend verzija

---

## 🔧 Development Setup

### Zahtevi
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **OS**: Windows, macOS, Linux (bilo koji sa modernim browserom)
- **Dodatni software**: Opciono Python za lokalni server

### Quick Start
1. **Kloniraj/Download** ATLAS html folder
2. **Dupli-klik** na `start-atlas-html.bat` ili
3. **Otvori** `index.html` direktno u browseru

### Development Mode
```bash
# U ATLAS html folderu
python -m http.server 8000
# ili
npx http-server -p 8000
```

---

## 📈 Roadmap

### Faza 1 - Core Enhancements (W1)
- [x] Projektna reorganizacija
- [ ] Kategorizacija operatera
- [ ] Expandable row details
- [ ] Basic performance optimizacije

### Faza 2 - UI/UX Improvements (W2)
- [ ] Advanced search sa autocomplete
- [ ] Paginacija sistema
- [ ] Dark theme support
- [ ] Mobile UX poboljšanja

### Faza 3 - Advanced Features (W3)
- [ ] Export/Import funkcionalnosti
- [ ] Advanced filtriranje
- [ ] Data validation enhancements
- [ ] Accessibility compliance

### Faza 4 - Production Ready (W4)
- [ ] Performance testing i optimizacije
- [ ] Cross-browser testing
- [ ] Documentation finalization
- [ ] Deployment preparation

---

## 🤝 Održavanje

### Development Team
- **Lead Developer**: Odgovoran za core funkcionalnosti
- **UI/UX Developer**: Dizajn i user experience
- **QA Tester**: Testiranje i quality assurance
- **Documentation**: Održavanje dokumentacije

### Update Process
1. **Feature development** u developent branch
2. **Testing** prema test_plan.md
3. **Documentation update** u ToDo/ folderu
4. **Release** sa changelog u README.md

---

## 📞 Support

### Dokumentacija
- **README.md** - Osnovne informacije i status
- **tehnicka_dokumentacija.md** - Detaljni tehniči opis
- **poboljsanja_plan.md** - Planovi razvoja
- **test_plan.md** - Testiranje i QA

### Issue Tracking
- **Known issues** - Dokumentovano u test_plan.md
- **Feature requests** - Dodaj u poboljsanja_plan.md
- **Bug reports** - Dokumentuj u progress_tracking.md

---

**Projekat verzija**: 1.0  
**Datum kreiranja**: 31. jul 2025  
**Poslednji update**: 31. jul 2025  
**Status**: Aktivno razvoj 🚧