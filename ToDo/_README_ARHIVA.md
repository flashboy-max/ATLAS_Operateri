# 📦 ATLAS - Arhiva i backup materijala

**Datum kreiranja:** 01.10.2025  
**Razlog:** Čišćenje root foldera prije implementacije authentication sistema

---

## 📂 Struktura arhive

### `stari_planovi/` - Dokumentacija razvojnih faza
Sadrži sve planske MD fajlove iz ranijih faza razvoja ATLAS aplikacije:

- `APP_JS_REFACTORING_ANALYSIS.md` - Analiza refaktoringa app.js
- `ATLAS_DEVELOPMENT_PLAN_V2.md` - Razvojni plan verzija 2
- `ATLAS_STANDARDIZACIJA_PLAN.md` - Plan standardizacije
- `ATLAS_UI_UX_IMPROVEMENT_PLAN.md` - Plan UI/UX poboljšanja
- `BULK_IMPORT_FINAL_REPORT.md` - Izvještaj bulk import-a
- `CATALOG_REFACTORING_PLAN.md` (+ V1.5, V2) - Planovi refaktoringa kataloga
- `FINALNO_CISCENJE_IZVESTAJ.md` - Izvještaj finalnog čišćenja
- `stanje0110.md` - Status snapshot

**Napomena:** Ovi planovi su uspješno implementirani i ATLAS je sada u stabilnoj verziji.

---

### `backup_scripts/` - Pomoćne skripte i alati
Sadrži skripte korištene za migracije, import i alate:

#### Migracije:
- `migrate_operators_folder.cjs` - Migracija operatera u folder strukturu
- `migrate_to_new_structure.cjs` - Migracija na novu strukturu
- `migration-script.js` - Opšta migracija
- `fix-misljenje-typo.cjs` - **Poslijednja korištena** - Ispravljanje typo-a "posleduje" → "posjeduje"

#### Bulk Import:
- `bulk_import_script.py` - Python skripta za bulk import
- `bulk_import_tool.html` - HTML alat za bulk import
- `migration_tool.html` - HTML alat za migraciju

#### Referentni materijali:
- `help-modal-new-content.html` - HTML sadržaj novog help modal-a (za referencu)

**Napomena:** Sve skripte su uspješno izvršene. Čuvaju se za slučaj da zatreba ponovna migracija ili rollback.

---

### `backup_files/` - Stari backup fajlovi
Sadrži backup fajlove koji više nisu aktivno korišteni:

#### JavaScript backups:
- `app_broken_backup.js` - Backupломљене verzije app.js
- `app_working_backup.js` - Backup radne verzije app.js
- `styles_old_backup.css` - Stari backup stilova

#### JSON backups:
- `operateri_backup.json` - Opšti backup operatera
- `operateri_backup_1759324556949.json` - Timestamped backup
- `operateri_backup_migration.json` - Backup iz migracije

#### Dokumentacija:
- `README_old.md` - Stara verzija README fajla

**Napomena:** Svi backup fajlovi su arhivirani nakon uspješne implementacije novih verzija.

---

## 🔄 Backup historija

### Najnoviji backup:
📁 `../backup/2025-10-01_22-13-16_pre_auth_implementation/`

**Razlog:** Backup prije implementacije authentication/authorization sistema  
**Sadržaj:** Kompletna aplikacija (index.html, app.js, server.js, styles.css, operators/, operateri.json, standard_catalog.json)

---

## 🏗️ Trenutno aktivni fajlovi u root-u

**Core aplikacija:**
- ✅ `index.html` - Glavni UI
- ✅ `app.js` - Glavna JavaScript logika
- ✅ `server.js` - Node.js/Express backend
- ✅ `styles.css` - CSS stilovi
- ✅ `operateri.json` - Glavni JSON operateri (single file)

**Katalog i schema:**
- ✅ `standard_catalog.json` - Standardni katalog usluga/tehnologija
- ✅ `standard_catalog.schema.json` - JSON Schema validacija

**Dokumentacija i planovi:**
- ✅ `README.md` - Glavna dokumentacija projekta
- ✅ `korisnici_aplikacije.md` - ⭐ NOVI - Plan authentication/authorization sistema (v2.1)

**Folderi:**
- ✅ `operators/` - Individual JSON fajlovi za svakog operatera (ID-based)
- ✅ `scripts/` - Build skripte (generate-catalog.js, validate-catalog.js)
- ✅ `generated/` - Generisani fajlovi
- ✅ `backup/` - Backup folderi sa datumima
- ✅ `ToDo/` - Arhiva i TODO lista

**Konfiguracija:**
- ✅ `package.json` - NPM dependencies
- ✅ `start-atlas-html.bat` - Windows start skripta
- ✅ `.gitignore`

---

## 📝 Sledeći koraci

### Implementacija authentication sistema:
1. Kreirati `auth/` folder sa login.html i auth middleware
2. Kreirati `users/` folder sa korisnici.json i agencije.json
3. Kreirati `audit/` folder sa audit_log.json
4. Ažurirati server.js sa JWT autentikacijom
5. Ažurirati app.js sa role-based UI prilagođavanjem

**Referenca:** Kompletna specifikacija u `korisnici_aplikacije.md`

---

## ⚠️ Napomene

- **NE BRISATI** ovu arhivu - sve je arhivirano sa razlogom i može zatrebati
- Za vraćanje na prethodnu verziju koristiti backup folder
- Za ponovno pokretanje migracijskih skripta, koristiti iz `backup_scripts/`
- Sve MD planove čuvati za historiju projekta i buduće refaktoringe

---

*Arhivirano: 01.10.2025 u 22:13*  
*Projekat: ATLAS - Telekomunikacioni operateri BiH*  
*Branch: live-local*  
*Commit: a165692 - "✅ Auth plan update + typo fix + help modal improvements"*
