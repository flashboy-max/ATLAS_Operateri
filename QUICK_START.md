# 🚀 ATLAS Quick Start Guide

Brzi vodič za pokretanje ATLAS aplikacije.

## ⚡ Za nestrpljive

```bash
# 1. Clone repository
git clone https://github.com/flashboy-max/ATLAS_Operateri.git
cd ATLAS_Operateri

# 2. Instaliraj dependencies
npm install

# 3. Pokreni server
npm run server

# 4. Otvori browser
# http://localhost:3000
```

**Default login kredencijali se nalaze u `data/auth-users.json`**

---

## 📋 Detaljne instrukcije

### 1️⃣ Preduslovi

Provjeri da li imaš instaliran Node.js:
```bash
node --version  # Treba biti v14+
npm --version   # Treba biti v6+
```

Ako nemaš Node.js:
- **Windows**: https://nodejs.org/en/download/
- **macOS**: `brew install node`
- **Linux**: `sudo apt install nodejs npm`

### 2️⃣ Instalacija

```bash
# Clone projekat
git clone https://github.com/flashboy-max/ATLAS_Operateri.git

# Uđi u folder
cd ATLAS_Operateri

# Instaliraj sve dependencies
npm install
```

### 3️⃣ Inicijalizacija

Kreiraj potrebne foldere (opcionalno, server to radi automatski):
```bash
mkdir -p data/logs
mkdir -p backup
```

Generiši standardni katalog:
```bash
npm run generate-catalog
```

### 4️⃣ Pokretanje

**Development mode:**
```bash
npm run server
```

Server će startovati na: **http://localhost:3000**

**Pokretanje u pozadini (Windows):**
```bash
start-atlas-html.bat
```

### 5️⃣ Prijava

Otvori browser i idi na `http://localhost:3000`

**Default korisnici:**

Default kredencijali (username i password) se nalaze u `data/auth-users.json` fajlu.

Dostupne role:
- **SUPERADMIN** - Puni pristup svim funkcijama
- **ADMIN** - Upravljanje svojom agencijom  
- **KORISNIK** - Pristup operaterima i svom profilu

> ⚠️ **VAŽNO**: Nakon prvog logovanja, promijeni lozinku u postavkama!

---

## 🎯 Prvi koraci

### Za SUPERADMIN-a:
1. ✅ Promijeni svoju lozinku
2. ✅ Kreiraj agencije (Postavke → Agencije)
3. ✅ Dodaj korisnike (User Management)
4. ✅ Pregledaj operatere (index.html)
5. ✅ Provjeri system logs

### Za ADMIN-a:
1. ✅ Promijeni svoju lozinku
2. ✅ Dodaj korisnike svoje agencije
3. ✅ Pregledaj operatere
4. ✅ Prati aktivnosti svoje agencije

### Za KORISNIK-a:
1. ✅ Promijeni svoju lozinku
2. ✅ Pregledaj operatere
3. ✅ Koristi pretragu
4. ✅ Export podataka

---

## 🔧 Troubleshooting

### Problem: Port 3000 je zauzet
```bash
# Pokreni na drugom portu
PORT=3001 npm run server

# Ili promijeni u server.js
```

### Problem: npm install ne radi
```bash
# Obriši node_modules i pokušaj ponovo
rm -rf node_modules package-lock.json
npm install
```

### Problem: Cannot find module
```bash
# Reinstaliraj dependencies
npm ci
```

### Problem: Login ne radi
1. Provjeri da li je server pokrenut
2. Provjeri `data/auth-users.json` da postoji
3. Provjeri console za greške (F12)

### Problem: Operateri se ne prikazuju
```bash
# Regeneriši catalog
npm run generate-catalog

# Validiraj podatke
npm run validate-catalog
```

---

## 📚 Sledeći koraci

### Dokumentacija
- 📖 [README.md](README.md) - Kompletna dokumentacija
- 🆘 [docs/Pomoć.md](docs/Pomoć.md) - Korisnički vodič
- 👥 [docs/korisnici_aplikacije.md](docs/korisnici_aplikacije.md) - Role i permisije
- 📋 [docs/SYSTEM_LOGS_README.md](docs/SYSTEM_LOGS_README.md) - System logs

### Development
- 🏗️ [ToDo/README.md](ToDo/README.md) - Development planovi
- 📊 [ToDo/reports/README.md](ToDo/reports/README.md) - Implementation reports

### API
```bash
# Provjeri API endpointe
GET  http://localhost:3000/api/auth/session
GET  http://localhost:3000/api/operators
GET  http://localhost:3000/api/system/logs
```

---

## 🎨 Keyboard Shortcuts

| Skraćenica | Akcija |
|------------|--------|
| `Ctrl + F` | Fokus na pretragu |
| `Ctrl + N` | Dodaj operatera (SUPERADMIN) |
| `Esc` | Zatvori modal |
| `F5` | Refresh |
| `Ctrl + Shift + I` | Dev Tools |

---

## 🔐 Sigurnost

- ✅ Promijeni default lozinke
- ✅ Koristi jake lozinke (min 8 karaktera)
- ✅ Ne share-uj kredencijale
- ✅ Redovno provjeri system logs
- ✅ Backup podataka redovno

---

## 📞 Help

Trebaš pomoć?

- 🐛 [GitHub Issues](https://github.com/flashboy-max/ATLAS_Operateri/issues)
- 💬 [GitHub Discussions](https://github.com/flashboy-max/ATLAS_Operateri/discussions)
- 📧 Email: support@atlas-project.ba

---

<div align="center">

**Sretan rad sa ATLAS-om! 🎉**

Made with ❤️ for BiH police agencies

</div>
