# 📝 Changelog

Sve značajne promjene u ATLAS projektu bit će dokumentovane ovdje.

Format zasnovan na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
i projekat prati [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.0] - 2025-10-05

### 🎉 Major Release - Full Authentication & Authorization System

### ✨ Added
- **Authentication System**
  - JWT token-based authentication
  - Secure login/logout functionality
  - Session management sa auto-expiration
  - Password hashing sa bcryptjs (10 rounds)
  - Remember me functionality
  
- **Authorization System**
  - Role-based access control (RBAC)
  - 3 nivoa korisnika: SUPERADMIN, ADMIN, KORISNIK
  - Multi-agencijska podrška
  - Granularni permissions po roli
  
- **User Management**
  - Full CRUD operacije za korisnike
  - Dodjeljivanje rola i agencija
  - Aktivacija/deaktivacija naloga
  - Profile management
  - Password change functionality
  
- **Dashboard**
  - Real-time statistike
  - Role-based quick actions
  - Nedavne aktivnosti (za ADMIN+)
  - Personalizovani prikaz podataka
  
- **System Logs**
  - Kompletno praćenje aktivnosti
  - Filtriranje po korisniku, akciji, periodu, statusu
  - Export u CSV format
  - Role-based log access
  - Deduplikacija log entries
  
- **Audit Logging**
  - Automatsko logovanje svih akcija
  - Timestamp, user, IP address tracking
  - Immutable log files
  - Enhanced logger sa kategorijama
  
- **Postavke**
  - Profil management
  - Agencije CRUD (SUPERADMIN)
  - Sigurnosne postavke
  - Sistem konfiguracija
  
- **Shared Header**
  - Uniformni navigacioni header
  - User menu sa dropdown
  - Breadcrumbs
  - Notifications badge (u planu)
  
- **Standard Catalog**
  - JSON Schema validacija
  - 31 operater sa kompletnim podacima
  - Unified data structure
  - Validation scripts

### 🔒 Security
- Rate limiting (5 req/15min za login, 100 req/15min za API)
- CORS konfiguracija
- Input validation (client & server)
- SQL injection zaštita
- XSS zaštita
- Secure headers

### 🎨 UI/UX Improvements
- Modern, clean design
- CSS variables za consistent theming
- Responsive design (mobile-first)
- Improved accessibility (ARIA labels)
- Keyboard shortcuts
- Loading states
- Error messages
- Success notifications

### 📚 Documentation
- Kompletno ažuriran README.md
- QUICK_START.md vodič
- CONTRIBUTING.md guidelines
- docs/Pomoć.md korisnički vodič
- docs/korisnici_aplikacije.md role documentation
- docs/SYSTEM_LOGS_README.md technical docs
- API dokumentacija

### 🔧 Technical
- Express.js backend
- File-based JSON storage
- JWT authentication
- bcryptjs password hashing
- Modular server architecture
- Error handling middleware
- Request logging

### 📦 Dependencies Added
- express: ^4.18.2
- jsonwebtoken: ^9.0.2
- bcryptjs: ^3.0.2
- cors: ^2.8.5
- express-rate-limit: ^8.1.0

---

## [2.2.0] - 2025-09-15

### ✨ Added
- Bulk import tool za brzo dodavanje operatera
- Migration framework za ažuriranje strukture podataka
- Expandable details sa kategorisanim uslugama
- 28 telekom operatera

### 🎨 Changed
- Poboljšan UI operater tabele
- Optimizovana pretraga
- Bolja organizacija podataka

### 🐛 Fixed
- Duplicate entries u bazi
- Search highlighting issues
- Mobile responsiveness

---

## [2.1.0] - 2025-08-01

### ✨ Added
- Napredna pretraga sa highlighting
- Keyboard shortcuts (Ctrl+F, Ctrl+N, Esc)
- Export funkcionalnost
- Offline mode sa LocalStorage

### 🎨 Changed
- Improved UX
- Faster load times
- Better error handling

---

## [2.0.0] - 2025-07-01

### 🎉 Major Redesign

### ✨ Added
- Novi responsive dizajn
- Proširena struktura podataka
- Tehnologije polje (2G, 3G, 4G, 5G)
- Pravne obaveze
- Kontakt informacije

### 🔧 Changed
- Refactored codebase
- Optimizovana performansa
- Poboljšana struktura podataka

---

## [1.5.0] - 2025-06-01

### ✨ Added
- 15 novih operatera
- Filter opcije
- Sort funkcionalnost

### 🐛 Fixed
- Memory leaks u search-u
- CSS bugs na mobile-u

---

## [1.0.0] - 2025-05-01

### 🎉 Initial Release

### ✨ Features
- Basic CRUD operatera
- Search funkcionalnost
- LocalStorage persistence
- 13 operatera
- Responsive design

---

## [Unreleased]

### 🔄 In Progress
- 2FA (Two-Factor Authentication)
- Email notifikacije
- Advanced analytics dashboard
- Operator comparison tool
- API rate limiting improvements

### 📋 Planned
- Mobile aplikacija (React Native)
- Real-time collaboration
- Advanced reporting
- Integration sa eksternim API-jima
- Automated backups
- Docker containerization
- CI/CD pipeline

---

## Versioning Schema

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, značajne nove funkcionalnosti
- **MINOR**: Nove funkcionalnosti, backwards compatible
- **PATCH**: Bug fixes, mali improvements

---

## Commit Types

- **feat**: Nova funkcionalnost
- **fix**: Bug fix
- **docs**: Dokumentacija
- **style**: Formatting
- **refactor**: Code refactoring
- **test**: Testovi
- **chore**: Maintenance

---

## Contributors

- [@flashboy-max](https://github.com/flashboy-max) - Lead Developer
- ATLAS Project Team

---

## Links

- [GitHub Repository](https://github.com/flashboy-max/ATLAS_Operateri)
- [Issues](https://github.com/flashboy-max/ATLAS_Operateri/issues)
- [Discussions](https://github.com/flashboy-max/ATLAS_Operateri/discussions)

---

<div align="center">

**Stay updated!** ⭐ Star the repo to get notifications

</div>
