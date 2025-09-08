# 🏛️ ATLAS Operateri v2.2

**Automatizovani Telekomunikacioni Listing Agencijski Sistem**

Napredna web aplikacija za upravljanje bazom podataka telekomunikacionih operatera u Bosni i Hercegovini, dizajnirana za potrebe policijskih agencija.

## 🚀 Karakteristike

- ✅ **45 telekom operatera** sa kompletnim podacima
- ✅ **Expandable details** sa kategorisanim uslugama i tehnologijama  
- ✅ **Napredna pretraga** sa highlighting i keyboard shortcuts
- ✅ **Responsive design** optimizovan za desktop i mobile
- ✅ **Bulk import tool** za dodavanje novih operatera
- ✅ **Migration framework** za ažuriranje strukture podataka
- ✅ **Offline funkcionalnost** - radi bez internet konekcije
- ✅ **LocalStorage caching** sa automatskim reload sistemom

## 🛠️ Instalacija

```bash
# Clone repository
git clone https://github.com/flashboy-max/ATLAS_Operateri.git

# Navigiraj u folder
cd ATLAS_Operateri

# Pokreni lokalni server (Python)
python -m http.server 8000

# Ili Node.js
npx http-server -p 8000

# Otvori u browseru
http://localhost:8000
```

## 📊 Struktura Projekta

```
ATLAS_Operateri/
├── index.html              # Main aplikacija
├── app.js                  # JavaScript logika  
├── styles.css              # CSS stilovi
├── operateri.json          # Baza podataka (45 operatera)
├── migration_tool.html     # Alat za migraciju
├── bulk_import_tool.html   # Bulk import alat
├── bulk_import_script.py   # Python script za bulk import
└── ToDo/                   # Development dokumenti
    ├── planovi/            # Planovi razvoja
    ├── implementacija/     # Progress tracking
    ├── Pojedinacni_operateri/ # Markdown fajlovi operatera
    └── testovi/            # Test planovi
```

## 🎯 Korišćenje

### Main Aplikacija
- **URL**: `http://localhost:8000`
- **Funkcije**: Pretraga, dodavanje, editovanje operatera
- **Keyboard Shortcuts**: 
  - `Ctrl + F` - fokus na search
  - `Ctrl + N` - dodaj novog operatera
  - `Esc` - zatvori modal

### Migration Tool
- **URL**: `http://localhost:8000/migration_tool.html`
- **Funkcija**: Migracija strukture podataka između verzija

### Bulk Import Tool  
- **URL**: `http://localhost:8000/bulk_import_tool.html`
- **Funkcija**: Import operatera iz markdown fajlova

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+

## 🔧 Development

### Prioriteti razvoja:
- **PRIORITET 1**: ✅ Vizuelno poboljšanje tabele
- **PRIORITET 2**: ✅ Expandable details sistem  
- **PRIORITET 3**: ✅ Enhanced UX funkcionalnosti
- **PRIORITET 4**: 🔄 U planu
- **PRIORITET 5**: ✅ Proširena struktura podataka

### Bulk Import Process:
1. Pripremi markdown fajlove u `ToDo/Pojedinacni_operateri/`
2. Pokreni `bulk_import_script.py`
3. Verifikuj rezultate u `operateri.json`
4. Testiraj u main aplikaciji

## 👥 Contribuiranje

1. Fork repository
2. Kreiraj feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit promene (`git commit -m 'Add some AmazingFeature'`)
4. Push na branch (`git push origin feature/AmazingFeature`)
5. Otvori Pull Request

## 📄 License

MIT License - vidi LICENSE fajl za detalje.

## 📊 Statistike

- **Ukupno operatera**: 45
- **Kategorije usluga**: 15+
- **Tehnologije**: GSM, UMTS, LTE, 5G, Fiber, Cable
- **Pokrivenost**: Cela Bosna i Hercegovina

---

**Razvijeno za potrebe policijskih agencija u BiH** 🇧🇦

### 🔗 Korisni linkovi:
- [Live Demo](https://flashboy-max.github.io/ATLAS_Operateri/)
- [Issues](https://github.com/flashboy-max/ATLAS_Operateri/issues)
- [Wiki](https://github.com/flashboy-max/ATLAS_Operateri/wiki)
