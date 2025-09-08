# ATLAS HTML Poboljšanja - Detaljni Plan Implementacije

## 1. Kategorizacija Operatera (PRIORITET: VISOK)

### Tri glavne kategorije:
- **Dominantni operateri**: BH Telecom, m:tel, HT Eronet
- **Mobilni/MVNO operateri**: ONE, haloo, Zona.ba
- **Regionalni ISP operateri**: Telemach, ADRIA NET, Miss.Net, itd.

### Implementacija:
- Dodati category polje u operateri.json podatke
- Kreirati vizuelnu kategorizaciju u tabeli
- Dodati category badges sa color coding
- Poboljšati filtriranje po kategorijama
- Implementirati sortiranje po kategorijama

## 2. Expandable Details (PRIORITET: VISOK)

### Funkcionalnost:
- Klik na red operatera otvara detaljni prikaz
- Prikazuje sve dostupne informacije
- Usluge i tehnologije u strukturiranom prikazu
- Kontakt informacije
- Status historie

### Implementacija:
- Dodati collapse/expand funkcionalnost u app.js
- Kreirati detaljni template za expanded view
- Implementirati smooth CSS animacije za UX
- Dodati toggle ikone (+ / -)
- Optimizovati performanse za veliki broj operatera

## 3. Optimizacija za 50+ Operatera (PRIORITET: VISOK)

### Paginacija:
- 20 operatera po stranici kao default
- Numerisane stranice sa navigation
- Prev/Next navigacija
- "Show all" opcija za manje datasets

### Lazy Loading:
- Virtuelna lista za velike datasets
- Optimizovano renderovanje DOM elemenata
- Progressive loading na scroll

### Performance:
- Debounced search (300ms delay)
- Cached search results u localStorage
- Optimized DOM updates (DocumentFragment)
- Efficient event delegation

## 4. Poboljšane Funkcionalnosti

### Enhanced Search:
- Search kroz sve polja operatera
- Autocomplete suggestions na osnovu postojećih podataka
- Recent searches u localStorage
- Advanced filters (po kategoriji, statusu, usluzi)
- Real-time search rezultati

### UI/UX Poboljšanja:
- Smooth animations za sve interakcije
- Loading states sa spinners
- Comprehensive error handling
- Fully responsive design za sve uređaje
- Dark/Light theme toggle
- Accessibility improvements (ARIA labels)

## 5. Launch Script (PRIORITET: SREDNJI)

### Funkcionalnost:
- Jedan klik za pokretanje (.bat ili .cmd skript)
- Auto-open browser na localhost ili file://
- Optional local server za testing
- Development vs Production mode

### Implementacija:
- Kreirati start-atlas-html.bat
- Python simple server opcija
- Browser detection i auto-launch
- Error handling za različite OS

## 6. Export/Import Funkcionalnosti (NOVO)

### Export:
- JSON export svih operatera
- CSV export za spreadsheet kompatibilnost
- Backup kompletnih podataka
- Selective export (po kategoriji/filteru)

### Import:
- JSON import sa validacijom
- CSV import sa mapiranjem kolona
- Backup restore funkcionalnost
- Merge vs Replace opcije

## 7. Advanced Data Management (NOVO)

### LocalStorage Optimizacija:
- Kompresija podataka
- Verzioning sistema
- Auto-backup na promjene
- Data integrity checks

### Validacija:
- Real-time validacija input polja
- Required field enforcement
- Format validation (telefoni, email, web)
- Duplicate detection

## 8. Reporting i Analytics (BUDUĆNOST)

### Reports:
- Operator count po kategorijama
- Service coverage analysis
- Technology adoption overview
- Market share visualization

### Charts:
- Pie charts za kategorije
- Bar charts za usluge
- Timeline za dodavanja operatera
- Interactive dashboards

## Timeline Implementacije

### Faza 1 (Nedelja 1):
- Kategorizacija operatera
- Basic expandable details
- Performance optimizacije

### Faza 2 (Nedelja 2):
- Paginacija sistema
- Enhanced search
- UI/UX poboljšanja

### Faza 3 (Nedelja 3):
- Launch script
- Export/Import funkcionalnosti
- Advanced validacija

### Faza 4 (Budućnost):
- Reporting dashboard
- Advanced analytics
- Additional integrations

## 9. Data Enhancement sa Pojedinačni Operateri (NOVO - PRIORITET: VISOK)

### Resurs Za Ažuriranje:
- **Folder**: `Pojedinacni_operateri/` - 30+ detaljnih profila operatera
- **Sadržaj**: Kompletni podaci za svaki operator (licenze, usluge, kontakt info)
- **Korišćenje**: Reference za ažuriranje i proširavanje operateri.json

### Implementacija:
- **Phase 1**: Review postojećih profila u `Pojedinacni_operateri/`
- **Phase 2**: Ekstraktovanje ključnih podataka iz MD fajlova
- **Phase 3**: Ažuriranje `operateri.json` sa novim podacima
- **Phase 4**: Dodavanje novih operatera koji nisu u JSON-u

### Kategorije Operatera (prema profilima):
1. **Dominantni**: BH Telecom, m:tel (Telekom Srpske), HT Eronet
2. **MVNO**: ONE.Vip, haloo, Novotel (Zona.ba)
3. **Regionalni ISP**: Telemach, ADRIA NET, Miss.Net, LANACO, itd.
4. **Lokalni ISP**: GiNet, Global Internet, Telrad Net, VKT-Net, itd.

### Prioritetni Operateri Za Dodavanje:
- LANACO d.o.o. (veliki ISP)
- AKTON d.o.o. (značajan ISP)
- PROINTER ITSS d.o.o.
- Supernova (Blicnet d.o.o.)
- TX TV d.o.o. Tuzla
- Wirac.Net Pale

## Tehnički Zahtjevi

### Browser Kompatibilnost:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Ciljevi:
- <100ms search response time
- <2s initial load time
- <50MB memory usage
- 60fps animacije

### Code Quality:
- ESLint standardno formatiranje
- Inline dokumentacija
- Error handling best practices
- Modular kod struktura