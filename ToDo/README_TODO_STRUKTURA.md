# 📦 ToDo Folder - Arhiva razvojnih fajlova

## 📋 Svrha ovog foldera

Ovaj folder sadrži sve pomoćne fajlove, stare verzije, backup-e, migracije i planove koji **nisu neophodni za rad aplikacije**, ali se čuvaju kao referenca i dokumentacija razvojnog procesa.

---

## 📂 Struktura foldera

### 🔧 **Migracije i skripte**
Fajlovi koji su korišćeni za migraciju podataka i transformacije tokom razvoja.

- `migrate_operators_folder.cjs` - Skripta za migraciju operatera u folder strukturu
- `migrate_to_new_structure.cjs` - Skripta za prelazak na novu strukturu
- `migration-script.js` - Dodatna migracija skripta
- `bulk_import_script.py` - Python skripta za bulk import operatera
- `bulk_import_tool.html` - Web alat za bulk import
- `migration_tool.html` - Alat za migraciju podataka
- `fix-misljenje-typo.cjs` - Skripta za popravljanje typo u JSON fajlovima (posleduje → posjeduje)

### 📝 **Planovi i dokumentacija**
Razvojni planovi, analize i izveštaji koji dokumentuju evoluciju projekta.

- `APP_JS_REFACTORING_ANALYSIS.md` - Analiza refaktoringa app.js
- `ATLAS_DEVELOPMENT_PLAN_V2.md` - Plan razvoja verzija 2
- `ATLAS_STANDARDIZACIJA_PLAN.md` - Plan standardizacije
- `ATLAS_UI_UX_IMPROVEMENT_PLAN.md` - Plan poboljšanja UI/UX
- `BULK_IMPORT_FINAL_REPORT.md` - Finalni izveštaj bulk import-a
- `CATALOG_REFACTORING_PLAN_V1.5.md` - Plan refaktoringa kataloga v1.5
- `CATALOG_REFACTORING_PLAN_V2.md` - Plan refaktoringa kataloga v2
- `CATALOG_REFACTORING_PLAN.md` - Originalni plan refaktoringa kataloga
- `FINALNO_CISCENJE_IZVESTAJ.md` - Izveštaj finalnog čišćenja
- `stanje0110.md` - Status snapshot iz 01.10.2025

### 💾 **Backup fajlovi**
Stare verzije fajlova čuvane za hitne slučajeve.

- `app_broken_backup.js` - Backup pokvarene verzije app.js
- `app_working_backup.js` - Backup radne verzije app.js
- `styles_old_backup.css` - Stara verzija stilova
- `README_old.md` - Stara verzija README fajla
- `operateri_backup_1759324556949.json` - Timestamped backup operatera
- `operateri_backup_migration.json` - Backup pre migracije
- `operateri_backup.json` - Opšti backup operatera

### 🎨 **UI reference**
HTML fajlovi sa template-ima i reference dizajnom.

- `help-modal-new-content.html` - Template novog help modala

---

## ⚠️ VAŽNO

### Fajlovi koji su ostali u root-u (aktivni):

- `index.html` - Glavni UI
- `app.js` - Glavna aplikaciona logika
- `server.js` - Backend server
- `styles.css` - Aktivni stilovi
- `package.json` - Dependencies
- `README.md` - Glavna dokumentacija
- `korisnici_aplikacije.md` - **NOVI PLAN** - Autentikacija i autorizacija (PRIORITET)
- `operateri.json` - Glavni fajl operatera
- `standard_catalog.json` - Standardni katalog
- `standard_catalog.schema.json` - JSON schema
- `start-atlas-html.bat` - Start skripta
- `favicon.ico` - Ikonica

### Folderi u root-u:

- `backup/` - Sistemski backup-i (automatski kreirani)
- `generated/` - Generisani fajlovi
- `operators/` - JSON fajlovi pojedinačnih operatera
- `scripts/` - Aktivne skripte (generate-catalog.js, validate-catalog.js)
- `server/` - Server komponente
- `ToDo/` - **Ovaj folder** - Arhiva i reference

---

## 🔍 Kako koristiti ovaj folder?

### Kada trebate stare fajlove:
1. **Backup verzije koda**: Pogledajte `app_working_backup.js` ili `app_broken_backup.js`
2. **Stare stilove**: Pogledajte `styles_old_backup.css`
3. **Migracija podataka**: Koristite skripte iz sekcije "Migracije"
4. **Razumevanje odluka**: Čitajte planove i analize

### Kada dodajete nove fajlove u ToDo:
- Ažurirajte ovaj README sa opisom
- Grupisajte po kategorijama (Migracije, Planovi, Backup, UI reference)
- Dodajte datum kada je fajl premešten

---

## 📅 Istorija ažuriranja

### 01.10.2025 - Veliko čišćenje root foldera
**Autor:** GitHub Copilot + User  
**Razlog:** Organizacija projekta pre implementacije autentikacije

**Premešteno u ToDo:**
- 3 backup JS fajla
- 1 backup CSS fajl
- 1 stari README
- 3 migracija skripte
- 2 bulk import fajla + 1 tool
- 1 fix skripta (završena)
- 1 help modal HTML (referenca)
- 3 backup operateri JSON-a
- 10 MD fajlova (planovi i izveštaji)

**Rezultat:** Čist root folder sa samo aktivnim fajlovima + novi plan autentikacije

---

## 🎯 Sledeći koraci

Prema planu `korisnici_aplikacije.md` (koji je OSTAO u root-u jer je AKTIVAN):

### Faza 1: Osnovna autentikacija ✅ (PRIORITET 1)
- [ ] Kreirati login stranicu
- [ ] Implementirati JWT autentikaciju
- [ ] Zaštititi API endpoint-e

### Faza 2: Role-based access control (PRIORITET 2)
- [ ] 3 role: SUPERADMIN, ADMIN, KORISNIK
- [ ] Permisije po roli

### Faza 3: User management (PRIORITET 3)
- [ ] 15 policijskih agencija
- [ ] CRUD za korisnike

---

*Datum kreiranja: 01.10.2025*  
*Verzija: 1.0*  
*Održava: ATLAS Development Team*
