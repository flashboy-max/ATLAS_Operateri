# 🏛️ ATLA## 📋 Sadržaj

- [Pregled](#-pregled)
- [Ključne funkcionalnosti](#-ključne-funkcionalnosti)
- [Quick Start](#-quick-start) ⚡
- [Instalacija](#-instalacija)
- [Pokretanje aplikacije](#-pokretanje-aplikacije)
- [Struktura projekta](#-struktura-projekta)
- [Funkcionalnosti](#-funkcionalnosti)
- [Tehnologije](#-tehnologije)
- [Sigurnost](#-sigurnost)
- [Browser podrška](#-browser-podrška)
- [Dokumentacija](#-dokumentacija)
- [Contribuiranje](#-contribuiranje)
- [Licenca](#-licenca)ani Telekomunikacioni Listing Agencijski Sistem

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/flashboy-max/ATLAS_Operateri)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

**Napredna web aplikacija za upravljanje bazom podataka telekomunikacionih operatera u Bosni i Hercegovini, dizajnirana za potrebe policijskih agencija.**

---

## � Sadržaj

- [Pregled](#-pregled)
- [Ključne funkcionalnosti](#-ključne-funkcionalnosti)
- [Screenshotovi](#-screenshotovi)
- [Instalacija](#-instalacija)
- [Pokretanje aplikacije](#-pokretanje-aplikacije)
- [Struktura projekta](#-struktura-projekta)
- [Funkcionalnosti](#-funkcionalnosti)
- [Tehnologije](#-tehnologije)
- [Sigurnost](#-sigurnost)
- [Browser podrška](#-browser-podrška)
- [Dokumentacija](#-dokumentacija)
- [Contribuiranje](#-contribuiranje)
- [Licenca](#-licenca)

---

## 🎯 Pregled

ATLAS je moderna, **full-stack** web aplikacija za upravljanje operaterima u telekomunikacionom sektoru BiH. Sistem omogućava kreiranje, pregled, editovanje i brisanje operatera, uz napredne funkcije autentifikacije, autorizacije i audit logovanja.

### Šta ATLAS radi?

- 📊 **Centralizovana baza podataka** - 31 telekomunikacioni operater sa detaljnim informacijama
- 👥 **Multi-role pristup** - SUPERADMIN, ADMIN, KORISNIK sa različitim nivoom pristupa
- 🔐 **Sigurnosni sistem** - JWT autentifikacija, role-based access control (RBAC)
- 📝 **Audit logging** - Kompletno praćenje svih aktivnosti u sistemu
- 🎨 **Moderni UI/UX** - Intuitivni interfejs sa responsive dizajnom
- 🏢 **Multi-agencijski** - Podrška za različite policijske agencije

---

## ✨ Ključne funkcionalnosti

### 🔐 Autentifikacija i autorizacija
- **JWT token-based** autentifikacija
- **3 nivoa pristupa**: SUPERADMIN, ADMIN, KORISNIK
- **Session management** sa automatskim logout-om
- **Password hashing** sa bcrypt
- **Rate limiting** za zaštitu od brute-force napada

### � Upravljanje korisnicima
- Kreiranje/editovanje/brisanje korisnika
- Dodjeljivanje agencija i rola
- Aktivacija/deaktivacija naloga
- Pregled profila i promjena lozinke

### 📊 Operateri
- **31 operater** sa kompletnim podacima
- Expandable details sa kategorisanim uslugama
- Napredna pretraga i filtriranje
- Export u različitim formatima
- Standard catalog sa JSON Schema validacijom

### � Dashboard
- Real-time statistike
- Brze akcije prema roli korisnika
- Pregled nedavnih aktivnosti
- Personalizovani prikaz podataka

### 📋 System logs
- Kompletno praćenje aktivnosti
- Filtriranje po korisniku, akciji, periodu
- Export logova u CSV format
- Role-based log access

### ⚙️ Postavke
- Personalizacija profila
- Sigurnosne postavke
- Upravljanje agencijama (SUPERADMIN)
- Sistem konfiguracija

---

## ⚡ Quick Start

**Za nestrpljive:**

```bash
git clone https://github.com/flashboy-max/ATLAS_Operateri.git
cd ATLAS_Operateri
npm install
npm run server
# Open http://localhost:3000
# Login: super.admin / super123
```

📖 **Detaljnije**: [QUICK_START.md](QUICK_START.md)

---

## 🖼️ Screenshotovi

```
┌─────────────────────────────────────┐
│  🔐 Login Page                      │
│  Modern authentication interface    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📊 Dashboard                       │
│  Statistics & quick actions         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📱 Operators List                  │
│  Advanced search & filtering        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  👥 User Management                 │
│  Full CRUD operations               │
└─────────────────────────────────────┘
```

---

## 🚀 Instalacija

### Preduvjeti

- **Node.js** v14.0.0 ili noviji
- **npm** v6.0.0 ili noviji
- **Git**

### Clone repository

```bash
git clone https://github.com/flashboy-max/ATLAS_Operateri.git
cd ATLAS_Operateri
```

### Instalacija dependencies

```bash
npm install
```

### Inicijalizacija podataka

```bash
# Kreiraj potrebne foldere
mkdir -p data/logs
mkdir -p backup

# Generiši standardni katalog
npm run generate-catalog

# Validiraj katalog
npm run validate-catalog
```

---

## 🎮 Pokretanje aplikacije

### Development mode

```bash
npm run server
```

Aplikacija će biti dostupna na: **http://localhost:3000**

### Default kredencijali

**SUPERADMIN**
- Username: `super.admin`
- Password: ``

**ADMIN**
- Username: `admin.user`
- Password: ``

**KORISNIK**
- Username: `test.korisnik`
- Password: ``

> ⚠️ **VAŽNO**: Promijenite default lozinke nakon prvog logovanja!
5. Open Pull Request (PR)

---

## 📁 Struktura projekta

```
ATLAS_Operateri/
│
├── 📄 index.html                    # Glavni prikaz operatera
├── 🔐 login.html                    # Login stranica
├── 📊 dashboard.html                # Dashboard
├── 👥 user-management.html          # Upravljanje korisnicima
├── 📋 system-logs.html              # Sistemski logovi
├── ⚙️ postavke.html                 # Postavke
├── 👤 moj-profil.html               # Korisnički profil
│
├── 🎨 CSS/
│   ├── common.css                   # Zajednički stilovi
│   ├── auth.css                     # Autentifikacija stilovi
│   ├── dashboard.css                # Dashboard stilovi
│   ├── user-management.css          # User management stilovi
│   ├── system-logs.css              # System logs stilovi
│   └── ...
│
├── 💻 JavaScript/
│   ├── app.js                       # Glavna aplikacija logika
│   ├── auth.js                      # Autentifikacija sistem
│   ├── dashboard.js                 # Dashboard logika
│   ├── user-management.js           # User management
│   ├── system-logs.js               # System logs
│   ├── audit-logger.js              # Audit logging
│   ├── enhanced-logger.js           # Enhanced logging
│   └── shared-header.js             # Dijeljeni header
│
├── 🗄️ Data/
│   ├── operateri.json               # Baza operatera (legacy)
│   ├── standard_catalog.json        # Standard catalog (aktivno)
│   ├── data/
│   │   ├── auth-users.json          # Korisnici
│   │   └── logs/                    # Log fajlovi
│   └── operators/                   # Pojedinačni JSON operateri
│
├── 🔧 Server/
│   ├── server.js                    # Express server
│   └── server/                      # Server moduli
│       ├── auth.js                  # Auth endpoints
│       ├── operators.js             # Operator endpoints
│       ├── logs.js                  # Log endpoints
│       └── users.js                 # User endpoints
│
├── 📜 Scripts/
│   ├── generate-catalog.js          # Generisanje kataloga
│   ├── validate-catalog.js          # Validacija kataloga
│   └── standardize-legal-obligations.cjs
│
├── 📚 Docs/
│   ├── Pomoć.md                     # Korisnički vodič
│   ├── korisnici_aplikacije.md      # Role i permissions
│   └── auth-prototype/              # Auth dokumentacija
│
├── 🗂️ ToDo/
│   ├── dokumentacija/               # Development dokumentacija
│   ├── planovi/                     # Planovi razvoja
│   └── implementacija/              # Implementation tracking
│
├── 💾 Backup/
│   └── [timestamped backups]        # Automatski backup-i
│
├── 📦 package.json                  # NPM dependencies
├── 📖 README.md                     # Ova datoteka
└── 🔐 .gitignore                    # Git ignore rules
```

---

## 🎨 Funkcionalnosti

### 1. **Autentifikacija**
- Login/Logout funkcionalnost
- Session persistence
- Automatski redirect na login za neautentifikovane korisnike
- Remember me opcija

### 2. **Dashboard**
- **Stats Cards**: 
  - Ukupno operatera
  - Ukupno korisnika (ADMIN+)
  - Aktivnih sesija
  - Današnje aktivnosti
- **Quick Actions**: Role-based brze akcije
- **Recent Activity**: Prikaz nedavnih aktivnosti (ADMIN+)

### 3. **Operateri (index.html)**
- Prikaz svih 31 operatera
- Napredna pretraga (naziv, vrsta, licence)
- Expandable details:
  - Usluge (glasovne, SMS, podatkovne, druge)
  - Tehnologije (2G, 3G, 4G, 5G, Fixed)
  - Pravne obaveze
  - Kontakt informacije
- CRUD operacije (za SUPERADMIN)
- Export podataka

### 4. **User Management**
- **SUPERADMIN**: Full access, sve agencije
- **ADMIN**: Samo korisnici svoje agencije
- **KORISNIK**: Pregled svog profila
- Kreiranje/editovanje/brisanje
- Aktivacija/deaktivacija
- Dodjeljivanje rola i agencija

### 5. **System Logs**
- Kompletno praćenje:
  - Login/Logout događaji
  - CRUD operacije
  - Promjene podataka
  - Greške i upozorenja
- Filtriranje:
  - Po korisniku
  - Po akciji
  - Po periodu (danas, ova sedmica, ovaj mjesec)
  - Po statusu (SUCCESS/FAILED)
- Export u CSV format
- Role-based access:
  - **SUPERADMIN**: Sve aktivnosti
  - **ADMIN**: Aktivnosti svoje agencije
  - **KORISNIK**: Samo svoje aktivnosti

### 6. **Postavke**
- **Profil**: Promjena imena, email, lozinke
- **Agencije** (SUPERADMIN): CRUD operacije
- **Sigurnost**: 2FA (u planu), session timeout
- **Notifikacije**: Email/Push opcije (u planu)

### 7. **Moj Profil**
- Pregled ličnih podataka
- Promjena lozinke
- Historija aktivnosti
- Session management

---

## 🔧 Tehnologije

### Frontend
- **HTML5** - Semantički markup
- **CSS3** - Modern styling sa CSS variables
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Font Awesome 6** - Ikone
- **Google Fonts (Inter)** - Tipografija

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT (jsonwebtoken)** - Autentifikacija
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting

### Data
- **JSON** - Data storage
- **JSON Schema** - Data validation
- **File System** - Local storage

### Dev Tools
- **npm** - Package manager
- **Git** - Version control
- **VS Code** - Recommended IDE

---

## 🔒 Sigurnost

### Implementirane mjere

1. **Autentifikacija**
   - JWT tokens sa expiration
   - Secure password hashing (bcrypt, 10 rounds)
   - Session management

2. **Autorizacija**
   - Role-based access control (RBAC)
   - Endpoint protection
   - Resource-level permissions

3. **Rate Limiting**
   - Login endpoint: 5 requests / 15 min
   - API endpoints: 100 requests / 15 min

4. **Audit Logging**
   - Sve aktivnosti se loguju
   - Timestamp, user, action, IP
   - Immutable log files

5. **Input Validation**
   - Client-side validation
   - Server-side sanitization
   - JSON Schema validation

6. **CORS**
   - Configured CORS policy
   - Origin whitelist

### Best Practices

- ✅ Nikad ne commituj `.env` fajlove
- ✅ Promijeni default kredencijale
- ✅ Koristi HTTPS u produkciji
- ✅ Redovno ažuriraj dependencies
- ✅ Review audit logs redovno

---

## 🌐 Browser podrška

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full support |
| Firefox | 88+     | ✅ Full support |
| Safari  | 14+     | ✅ Full support |
| Edge    | 90+     | ✅ Full support |
| Opera   | 76+     | ✅ Full support |

---

## 📚 Dokumentacija

Detaljnija dokumentacija se nalazi u `docs/` folderu:

- **[Pomoć.md](Pomoć.md)** - Korisnički vodič
- **[korisnici_aplikacije.md](korisnici_aplikacije.md)** - Role i permissions

### API Dokumentacija

#### Auth Endpoints
```
POST   /api/auth/login      - Login
POST   /api/auth/logout     - Logout
GET    /api/auth/session    - Check session
GET    /api/auth/users      - List users (ADMIN+)
POST   /api/auth/users      - Create user (ADMIN+)
PUT    /api/auth/users/:id  - Update user (ADMIN+)
DELETE /api/auth/users/:id  - Delete user (ADMIN+)
```

#### Operator Endpoints
```
GET    /api/operators       - List operators
GET    /api/operators/:id   - Get operator
POST   /api/operators       - Create operator (SUPERADMIN)
PUT    /api/operators/:id   - Update operator (SUPERADMIN)
DELETE /api/operators/:id   - Delete operator (SUPERADMIN)
```

#### Log Endpoints
```
GET    /api/system/logs     - Get logs (role-filtered)
POST   /api/system/logs     - Create log entry
```

---

## 🤝 Contribuiranje

Contribuiranje je dobrodošlo! Slijedi ove korake:

1. **Fork** repository
2. **Create** feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** promjene
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** na branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** Pull Request

### Development Guidelines

- Koristi semantičke commit poruke
- Prati postojeći code style
- Testiraj sve nove funkcionalnosti
- Ažuriraj dokumentaciju
- Dodaj komentare za kompleksnu logiku

### Coding Standards

```javascript
// ✅ GOOD
function getUserById(userId) {
    if (!userId) {
        throw new Error('User ID is required');
    }
    return users.find(u => u.id === userId);
}

// ❌ BAD
function getUser(id) {
    return users.find(u => u.id === id);
}
```

---

## 🐛 Bug Reporting

Pronašli ste bug? Kreirajte [issue](https://github.com/flashboy-max/ATLAS_Operateri/issues) sa:

- Opisom problema
- Koracima za reprodukciju
- Očekivanim rezultatom
- Stvarnim rezultatom
- Screenshots (ako je primjenjivo)
- Browser i verzija

---

## 📝 Changelog

### v3.0.0 (Trenutna verzija - Oktobar 2025)
- ✅ Full authentication system (JWT, bcrypt)
- ✅ Role-based access control (SUPERADMIN, ADMIN, KORISNIK)
- ✅ Audit logging sa kompletnim praćenjem
- ✅ User management sa multi-agencijskom podrškom
- ✅ System logs sa naprednim filterima
- ✅ Dashboard sa real-time statistikama
- ✅ Postavke i profil management
- ✅ Standard catalog sa JSON Schema validacijom
- ✅ 31 operater sa kompletnim podacima

### v2.2 (Legacy)
- ✅ Bulk import tool
- ✅ Migration framework
- ✅ Expandable details
- ✅ 28 operatera

### v1.0 (Initial)
- ✅ Basic CRUD operatera
- ✅ Search funkcionalnost
- ✅ LocalStorage

---

## 📄 Licenca

Ovaj projekt je licenciran pod **MIT** licencom - pogledaj [LICENSE](LICENSE) fajl za detalje.

---

## 👨‍💻 Autor

**ATLAS Project Team**

- GitHub: [@flashboy-max](https://github.com/flashboy-max)
- Repository: [ATLAS_Operateri](https://github.com/flashboy-max/ATLAS_Operateri)

---

## 🙏 Acknowledgments

- Font Awesome za ikone
- Google Fonts za Inter font family
- Express.js zajednicu
- Node.js zajednicu

---

## 📞 Kontakt

Za pitanja, sugestije ili podršku:

- 🐛 Issues: [GitHub Issues](https://github.com/flashboy-max/ATLAS_Operateri/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/flashboy-max/ATLAS_Operateri/discussions)

---

## 🚦 Status projekta

```
 ████████████████████████ 100% Complete

 ✅ Core functionality
 ✅ Authentication & Authorization
 ✅ User Management
 ✅ Audit Logging
 ✅ System Logs
 ✅ Dashboard
 ✅ Settings
 🔄 2FA Implementation (In Progress)
 📋 Mobile App (Planned)
```

---

<div align="center">

**⭐ Star ovaj repo ako ti se sviđa! ⭐**

Made with ❤️ for Bosnia and Herzegovina police agencies

</div>

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
