# ATLAS Operateri — Trenutni status i plan razvoja

**Projekat:** ATLAS (Advanced Telecommunication Legal Access System)  
**Namjena:** Centralizovani, siguran i zakonski usklađen pristup informacijama o telekom operaterima za policijske agencije u BiH  
**Verzija dokumenta:** 3.2 (2025-10-05)  
**Status:** � **Release Candidate (Pre-Production)** - Zahtijeva security hardening prije produkcije

---

## 📚 Referencirani dokumenti

### Dokumentacija migracije i validacije
- ✅ [`FINAL_UPDATE_REPORT.md`](FINAL_UPDATE_REPORT.md) - Finalni izvještaj sa zero-data-loss rješenjem
- ✅ [`MIGRATION_VALIDATION.md`](MIGRATION_VALIDATION.md) - Validacija polje-po-polje (100% coverage proof)
- ✅ [`DATABASE_MIGRATION_GUIDE.md`](DATABASE_MIGRATION_GUIDE.md) - Korak-po-korak vodič za migraciju
- ✅ [`SQL_SCHEMA_ANALYSIS.md`](SQL_SCHEMA_ANALYSIS.md) - Detaljna analiza SQL šeme sa preporukama

### Prisma šema i skripte
- ✅ [`prisma/schema.prisma`](prisma/schema.prisma) - Kompletna Prisma šema (Enhanced verzija)
- ✅ [`scripts/migrate-operators.js`](scripts/migrate-operators.js) - Skripta za migraciju operatera (100% field mapping)
- ✅ [`scripts/create-gin-indexes.sql`](scripts/create-gin-indexes.sql) - GIN indeksi za brzu JSONB pretragu
- ✅ [`scripts/add-check-constraints.sql`](scripts/add-check-constraints.sql) - CHECK constraints za validaciju

### Izvorni podaci i kod
- 📄 [`operateri.json`](operateri.json) - Izvorni JSON katalog sa 31 operaterom (2402 linije)
- 📄 [`data/auth-users.json`](data/auth-users.json) - Trenutni korisnici (file-based)
- 📄 [`server.js`](server.js) - Express server i API endpoints sa RBAC middleware
- 📄 [`auth.js`](auth.js) - Autentikacija i JWT token management
- 📄 [`dashboard.js`](dashboard.js) - Dashboard logika sa operaterskim statistikama
- 📄 [`system-logs.js`](system-logs.js) - Logovanje i audit trail
- 📄 [`audit-logger.js`](audit-logger.js) - Napredni audit logger sa hash-chain

> 💡 **Napomena:** Tokom implementacije koraka u ovom planu, referenciraćemo gornje fajlove za brzu navigaciju.

---

## � OBAVEZNI PREDUSLOVI ZA PRODUKCIJU

> ⚠️ **KRITIČNO:** Sljedeće tačke MORAJU biti implementirane prije puštanja u produkciju.  
> Trenutno su u statusu "TODO" i sistem **NIJE** spreman za produkciju dok se ne završe.

### 🔴 Prioritet 1: Security Hardening (BLOKIRA PRODUKCIJU)

#### 1. HTTPS/TLS obavezno
```bash
# Implementacija: Caddy (automatski HTTPS) ili Nginx + Let's Encrypt
# Status: ❌ TODO
# Rok: Prije produkcije
```
- ❌ **Trenutno:** HTTP na developmentu
- ✅ **Zahtijevano:** TLS 1.3, valjani sertifikat, HSTS header
- 📋 **Checklist:**
  - [ ] Caddy/Nginx reverse proxy postavljen
  - [ ] TLS sertifikat konfigurisan
  - [ ] HTTP → HTTPS redirect aktivan
  - [ ] HSTS header (max-age=31536000)

#### 2. Environment Variables (.env tajne)
```bash
# Status: ❌ TODO
# Rok: Prije produkcije
```
- ❌ **Trenutno:** JWT_SECRET hardkodiran u kodu
- ✅ **Zahtijevano:** Sve tajne u `.env` (izvan git-a)
- 📋 **Checklist:**
  - [ ] JWT_SECRET (min 32 karaktera)
  - [ ] JWT_REFRESH_SECRET (različit od access)
  - [ ] DATABASE_URL (PostgreSQL connection string)
  - [ ] REDIS_URL (sa password-om)
  - [ ] MFA_ENCRYPTION_KEY (za TOTP secrets)
  - [ ] `.env` dodat u `.gitignore`

#### 3. Rate Limiting (brute-force zaštita)
```bash
# Status: ❌ TODO
# Rok: Prije produkcije
```
- ❌ **Trenutno:** Nema rate limitinga
- ✅ **Zahtijevano:** Express rate limit + Redis store
- 📋 **Checklist:**
  - [ ] Login endpoint: 5 pokušaja / 15 min
  - [ ] API endpoints: 100 req/min per IP
  - [ ] Admin zone: 50 req/min per IP
  - [ ] Redis store za distributed rate limiting

#### 4. MFA obavezan za ADMIN i SUPERADMIN
```bash
# Status: ❌ TODO
# Rok: Prije produkcije
```
- ❌ **Trenutno:** Nema MFA-a
- ✅ **Zahtijevano:** TOTP (Google Authenticator/Authy)
- 📋 **Checklist:**
  - [ ] Speakeasy library instaliran
  - [ ] QR kod generacija implementirana
  - [ ] MFA setup UI kreiran
  - [ ] MFA validacija u login flow-u
  - [ ] OBAVEZAN za SUPERADMIN i ADMIN uloge
  - [ ] Backup kodovi za recovery

#### 5. HttpOnly Cookies + CSRF zaštita
```bash
# Status: ❌ TODO (trenutno localStorage)
# Rok: Prije produkcije
```
- ❌ **Trenutno:** Tokeni u localStorage (XSS ranjivost)
- ✅ **Zahtijevano:** HttpOnly/Secure/SameSite cookies + CSRF tokens
- 📋 **Checklist:**
  - [ ] `cookie-parser` middleware
  - [ ] `csurf` middleware za CSRF
  - [ ] Tokeni u HttpOnly cookies
  - [ ] SameSite=Strict flag
  - [ ] Secure flag (samo HTTPS)
  - [ ] CSRF token u HTML forms

### 🔴 Prioritet 2: Audit Log MVP (BLOKIRA PRODUKCIJU)

#### 6. Append-Only Audit Log sa definisanim scope-om
```bash
# Status: ❌ TODO
# Rok: Prije produkcije
```
- ❌ **Trenutno:** File-based, nestrukturirani logovi
- ✅ **Zahtijevano:** PostgreSQL append-only sa CHECK constraints
- 📋 **Checklist:**
  - [ ] **4 grupe događaja zakucane:**
    - `USER_LOGIN_SUCCESS`, `USER_LOGIN_FAILURE`
    - `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`
    - `OPERATOR_CREATE`, `OPERATOR_UPDATE`, `OPERATOR_DELETE`
    - `SECURITY_ALERT`, `UNAUTHORIZED_ACCESS`
  - [ ] **CHECK constraint:**
    ```sql
    CHECK (action IN (
      'USER_LOGIN_SUCCESS', 'USER_LOGIN_FAILURE',
      'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
      'OPERATOR_CREATE', 'OPERATOR_UPDATE', 'OPERATOR_DELETE',
      'SECURITY_ALERT', 'UNAUTHORIZED_ACCESS'
    ))
    ```
  - [ ] **Minimalna metadata šema:**
    ```json
    {
      "before": {},      // za UPDATE
      "after": {},       // za CREATE/UPDATE
      "changed_fields": [],  // za UPDATE
      "username_attempted": "",  // za LOGIN_FAILURE
      "correlation_id": ""   // za multi-step operacije
    }
    ```
  - [ ] Database trigger: NO UPDATE/DELETE dozvoljeno
  - [ ] Hash chain implementiran (blockchain-style)
  - [ ] Dnevni integrity check (cron)

### 🟡 Prioritet 3: Pre-Production Testiranje

#### 7. Security & Penetration Testing
```bash
# Status: ❌ TODO
# Rok: Prije produkcije
```
- 📋 **Checklist:**
  - [ ] OWASP Top 10 provjera
  - [ ] SQL injection testiranje (iako koristimo Prisma ORM)
  - [ ] XSS testiranje
  - [ ] CSRF testiranje
  - [ ] Session management testiranje
  - [ ] Rate limiting testiranje
  - [ ] MFA bypass pokušaji

---

## �📊 Sadržaj

1. [Trenutno stanje projekta](#1-trenutno-stanje-projekta)
2. [Implementirane funkcionalnosti](#2-implementirane-funkcionalnosti)
3. [Sigurnost i autentikacija](#3-sigurnost-i-autentikacija)
4. [Sistem logovanja (Audit Trail)](#4-sistem-logovanja-audit-trail)
5. [Arhitektura i tehnologije](#5-arhitektura-i-tehnologije)
6. [Plan migracije na centralizovanu bazu](#6-plan-migracije-na-centralizovanu-bazu)
7. [Best Practices i preporuke](#7-best-practices-i-preporuke)
8. [Roadmap - Naredni koraci](#8-roadmap---naredni-koraci)
9. [Checklist za Production](#9-checklist-za-production)

---

## 1) Trenutno stanje projekta

### ✅ Šta je implementirano (v3.0.0)

#### Autentikacija i Sigurnost
- ✅ **JWT autentikacija** sa refresh token mehanizmom
- ✅ **Session management** (1h access token, 7d refresh token)
- ✅ **Password hashing** sa bcrypt (10 rounds)
- ✅ **Role-Based Access Control (RBAC)** - 3 uloge
- ✅ **Token rotation** i automatic refresh
- ✅ **Protected routes** sa middleware validacijom
- ✅ **Session tracking** (active sessions, last activity)

#### Korisnici i Uloge
- ✅ **3 nivoa pristupa:**
  - `SUPERADMIN` - Potpuna kontrola sistema
  - `ADMIN` - Administracija svoje agencije
  - `KORISNIK` - Osnovni pristup i pregled
- ✅ **User Management** stranica za administraciju
- ✅ **User Profiles** sa ažuriranjem podataka
- ✅ **User Activity Tracking** - zadnje aktivnosti
- ✅ **Email validacija** i unique username check

#### Operateri
- ✅ **Katalog operatera** (20+ operatera u BiH)
- ✅ **Detaljne informacije** (usluge, tehnologije, kontakti)
- ✅ **Pretraga i filtriranje** operatera
- ✅ **CRUD operacije** za SUPERADMIN ulogu
- ✅ **Responsive dizajn** i mobilna podrška

#### System Logs (Audit Trail)
- ✅ **Kompletno logovanje** svih akcija:
  - Login/Logout događaji
  - User CRUD operacije (create, update, delete)
  - Operator CRUD operacije
  - Session management eventi
  - API requests i responses
- ✅ **Detaljan tracking:**
  - Timestamp (ISO format)
  - User info (name, role, ID)
  - Action type i status
  - IP address i User Agent
  - Target entity (što je promijenjeno)
  - Metadata (detalji promjena)
- ✅ **System Logs stranica** sa:
  - Real-time prikaz logova
  - Filtriranje (user, action, status, date)
  - Export u CSV/JSON format
  - Pagination (50 logova po stranici)
  - Role-based filtering (KORISNIK vidi samo svoje)
  - Statistika i quick insights

#### UI/UX
- ✅ **Responsive dizajn** (desktop, tablet, mobile)
- ✅ **Shared Header** komponenta
- ✅ **Consistent styling** i color scheme
- ✅ **Toast notifications** za feedback
- ✅ **Loading states** i error handling
- ✅ **Accessibility** (keyboard navigation, ARIA labels)

#### Developer Experience
- ✅ **Error tracking** sistem
- ✅ **Debugging tools** (ErrorTracker.js)
- ✅ **Console utilities** (čišćenje, formatiranje)
- ✅ **Comprehensive documentation**
- ✅ **Git workflow** i version control

### ⚠️ Trenutna ograničenja

#### Baza podataka
- ⚠️ **JSON file storage** umjesto SQL baze
  - `auth-users.json` - korisnici (file-based)
  - `operateri.json` - operateri (in-memory)
  - `system-logs.json` - logovi (file-based, nepostoji još)
- ⚠️ **Nema transakcija** - rizik od race conditions
- ⚠️ **Scalability problem** - ne može podnijeti veliki broj korisnika
- ⚠️ **Backup complexity** - manuelni proces

#### Sigurnost
- ⚠️ **Nema MFA** (Multi-Factor Authentication)
- ⚠️ **Nema rate limiting** na login pokušaje
- ⚠️ **Nema IP whitelisting** za admin pristup
- ⚠️ **JWT secret** treba biti environment variable
- ⚠️ **Nema HTTPS** na lokalnom developmentu

#### Audit & Compliance
- ⚠️ **Log retention policy** nije definisan
- ⚠️ **Nema legal basis tracking** za akcije
- ⚠️ **Nema immutable logs** (append-only garantija)
- ⚠️ **Nema log integrity checks** (hash verification)

#### Monitoring
- ⚠️ **Nema real-time alerts** za sigurnosne događaje
- ⚠️ **Nema health checks** za sistem
- ⚠️ **Nema performance monitoring**
- ⚠️ **Nema automated backups**

---

## 2) Implementirane funkcionalnosti

### 2.1 Autentikacija (auth-system.js)

```javascript
// Implementirane funkcionalnosti:
- login(credentials) → JWT token
- logout() → token invalidation
- refreshToken() → novi access token
- checkSession() → validacija aktivne sesije
- getUserData() → trenutni korisnik
- updateProfile(data) → ažuriranje profila

// Security features:
- Bcrypt password hashing (10 rounds)
- JWT sa exp i iat claims
- Automatic token refresh (5 min before expiry)
- Session tracking u localStorage
- Protected route guards
```

### 2.2 User Management (users.js)

```javascript
// Admin funkcionalnosti:
- loadUsers() → učitavanje svih korisnika
- createUser(data) → kreiranje novog korisnika
- updateUser(id, data) → ažuriranje korisnika
- deleteUser(id) → brisanje korisnika (sa konfirmacijom)
- toggleUserStatus(id) → aktivacija/deaktivacija

// Validacije:
- Email format validation
- Username uniqueness check
- Password strength requirements (8+ chars)
- Role-based permission checks
```

### 2.3 Operateri (operateri.js)

```javascript
// Osnovne funkcionalnosti:
- getOperators() → lista svih operatera
- getOperatorById(id) → detalji operatera
- searchOperators(query) → pretraga
- filterByService(service) → filtriranje

// Admin CRUD (SUPERADMIN only):
- createOperator(data)
- updateOperator(id, data)
- deleteOperator(id)
```

### 2.4 System Logs (system-logs.js)

```javascript
// Funkcionalnosti:
- loadLogs(limit=300) → učitavanje logova
- filterLogs(criteria) → filtriranje
- exportLogs(format) → CSV/JSON export
- deduplicateLogs() → grupiranje istih akcija

// Log strukture:
{
  timestamp: "2025-10-05 14:30:45",
  timestamp_iso: "2025-10-05T14:30:45Z",
  action: "USER_LOGIN",
  action_display: "Prijava u sistem",
  status: "SUCCESS",
  user_name: "Marko Marković",
  user_role: "ADMIN",
  user_id: 2,
  target: "Auth System",
  ip_address: "192.168.1.100",
  metadata: { /* dodatni podaci */ }
}
```

### 2.5 Shared Components

```javascript
// SharedHeader (shared-header.js)
- init(currentUser) → inicijalizacija headera
- renderUserSection() → prikaz korisničkih podataka
- setupEventListeners() → navigation i logout
- highlightCurrentPage() → aktivna stranica

// ErrorTracker (error-tracker.js)
- logError(error, context) → tracking grešaka
- getRecentErrors() → zadnjih X grešaka
- formatError() → čitljiv prikaz
```

---

## 3) Sigurnost i autentikacija

### 3.1 Trenutna implementacija

#### Password Security
```javascript
// Bcrypt hashing (10 rounds)
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

// Validacija
const isValid = await bcrypt.compare(password, hash);
```

**Pros:**
- ✅ Industrijski standard
- ✅ Automatski salt
- ✅ Computationally expensive (brute-force zaštita)

**Cons:**
- ⚠️ Može biti jači (12-14 rounds za visoku sigurnost)
- ⚠️ Nema pepper (dodatni server secret)

#### JWT Tokens
```javascript
// Access token (1h)
const accessToken = jwt.sign(
  { userId, username, role },
  JWT_SECRET,
  { expiresIn: '1h' }
);

// Refresh token (7d)
const refreshToken = jwt.sign(
  { userId },
  JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

**Pros:**
- ✅ Stateless autentikacija
- ✅ Automatic expiry
- ✅ Token rotation mehanizam

**Cons:**
- ⚠️ JWT_SECRET hardkodiran (treba u .env)
- ⚠️ Nema token revocation lista
- ⚠️ Nema refresh token rotation

#### Session Management (DEVELOPMENT ONLY - MORA SE ZAMIJENITI)
```javascript
// ⚠️ TRENUTNA IMPLEMENTACIJA - SAMO ZA DEVELOPMENT
// localStorage storage (BIĆE ZAMIJENJEN SA HTTPONLY COOKIES)
localStorage.setItem('auth_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
localStorage.setItem('user_data', JSON.stringify(user));

// Session tracking
user.lastActivity = new Date().toISOString();
user.sessionStart = new Date().toISOString();
```

**Pros:**
- ✅ Brzo za development
- ✅ Multi-tab sync (storage events)

**Cons:**
- ❌ **XSS RANJIVOST** - localStorage dostupan JavaScript kodu
- ❌ **CSRF RANJIVOST** - nema SameSite protection
- ❌ **NIJE PRODUKCIJSKI SIGURAN** - see RFC 6265

> 🔴 **KRITIČNO:** Ova implementacija **MORA** biti zamijenjena HttpOnly cookies prije produkcije.  
> Status: ❌ TODO (vidjeti "OBAVEZNI PREDUSLOVI ZA PRODUKCIJU" → Prioritet 1.5)

### 3.2 NORMATIVNI ZAHTJEVI ZA PRODUKCIJU (ne "preporuke")

#### 1. Argon2id umjesto bcrypt
```javascript
// Argon2id - pobjednik Password Hashing Competition 2015
const argon2 = require('argon2');

// Hashing (production settings)
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64 MB
  timeCost: 3,        // 3 iterations
  parallelism: 4      // 4 threads
});

// Validacija
const isValid = await argon2.verify(hash, password);
```

**Prednosti:**
- 🚀 **Otporniji na GPU/ASIC napade** (memory-hard)
- 🚀 **Side-channel otpornost**
- 🚀 **Moderan standard** (OWASP preporuka)
- 🚀 **Brži od bcrypt** pri istoj sigurnosti

#### 2. Multi-Factor Authentication (MFA)
```javascript
// TOTP (Time-based One-Time Password)
const speakeasy = require('speakeasy');

// Generisanje secret-a za korisnika
const secret = speakeasy.generateSecret({
  name: `ATLAS (${user.username})`,
  issuer: 'ATLAS System'
});

// QR kod za skeniranje
const qrCode = await QRCode.toDataURL(secret.otpauth_url);

// Validacija TOTP koda
const verified = speakeasy.totp.verify({
  secret: user.mfa_secret,
  encoding: 'base32',
  token: userInputCode,
  window: 2  // ±60s tolerancija
});
```

**Implementacija:**
1. User omogući MFA u profilu
2. Sistem generiše QR kod
3. User skenira sa Google Authenticator/Authy
4. Pri loginu traži username + password + 6-digit kod
5. OBAVEZNO za SUPERADMIN i ADMIN uloge

#### 3. HttpOnly Cookies + CSRF zaštita (OBAVEZNO)
> 🔴 **NORMATIV (RFC 6265 + OWASP A07:2021):** Ovo NIJE opciono - HttpOnly cookies su OBAVEZNI za produkciju.

```javascript
// Express.js setup (OBAVEZNO prije produkcije)
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Login response - HttpOnly cookies (OBAVEZNA IMPLEMENTACIJA)
res.cookie('access_token', token, {
  httpOnly: true,      // ✅ OBAVEZNO - JS NE MOŽE pristupiti
  secure: true,        // ✅ OBAVEZNO - samo HTTPS (TLS)
  sameSite: 'strict',  // ✅ OBAVEZNO - CSRF zaštita
  maxAge: 3600000      // 1h
});

res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/auth/refresh',  // Ograničen scope
  maxAge: 604800000  // 7d
});

// CSRF token u HTML form
<input type="hidden" name="_csrf" value="<%= csrfToken %>">
```

**Zahtijevane izmjene u frontend kodu:**
```javascript
// STARO (localStorage) - MORA SE UKLONITI
localStorage.setItem('auth_token', token);  // ❌ BRISATI

// NOVO (cookies automatski handluje browser)
// Fetch sa credentials: 'include'
fetch('/api/protected', {
  method: 'GET',
  credentials: 'include',  // ✅ Šalje HttpOnly cookies automatski
  headers: {
    'X-CSRF-Token': csrfToken  // ✅ CSRF zaštita
  }
});
```

**Prednosti (security hardening):**
- ✅ **XSS imun** - JavaScript NIKAKO ne može čitati token
- ✅ **CSRF zaštita** - SameSite=Strict + CSRF token double-submit
- ✅ **Automatic expiry** - browser handluje, server ne mora track
- ✅ **Scope control** - Path attribute za fine-grained access
- ✅ **OWASP compliant** - A07:2021 "Identification and Authentication Failures" mitigacija

**Server-side token revocation (dodatni security layer):**
```javascript
// Redis store za blacklisting
const redis = require('redis');
const client = redis.createClient();

// Logout - dodaj token u blacklist
app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies.access_token;
  const decoded = jwt.decode(token);
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  
  await client.setEx(`blacklist:${token}`, ttl, 'revoked');
  
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: 'Logged out' });
});

// Middleware - provjeri blacklist
async function checkBlacklist(req, res, next) {
  const token = req.cookies.access_token;
  const isBlacklisted = await client.exists(`blacklist:${token}`);
  
  if (isBlacklisted) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  next();
}
```

**Checklist za implementaciju:**
- [ ] Install `cookie-parser` i `csurf` (npm)
- [ ] Zamijeni sve `localStorage.setItem/getItem` sa cookie handlingom
- [ ] Dodaj `credentials: 'include'` u sve fetch() pozive
- [ ] Implementiraj CSRF token u HTML forms
- [ ] Redis store za token blacklisting
- [ ] Logout flow sa revocation
- [ ] Testiranje sa OWASP ZAP

#### 4. Rate Limiting i Brute-Force zaštita
```javascript
// Express Rate Limit
const rateLimit = require('express-rate-limit');

// Login rate limit (5 pokušaja / 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minuta
  max: 5,                     // 5 pokušaja
  message: 'Previše neuspješnih pokušaja. Pokušajte za 15 minuta.',
  standardHeaders: true,
  legacyHeaders: false,
  // Custom store u Redis za distributed systems
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:login:'
  })
});

app.post('/api/auth/login', loginLimiter, loginHandler);

// Progressive delay (eksponencijalni backoff)
const attempts = await getFailedAttempts(username);
if (attempts > 0) {
  const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
  await sleep(delay);
}
```

#### 5. IP Whitelisting za Admin
```javascript
// Middleware za admin zone
const adminIpWhitelist = [
  '192.168.1.0/24',      // Interna mreža
  '10.0.0.0/8',          // VPN range
  '203.0.113.0/24'       // Agencijski IP
];

function checkAdminIp(req, res, next) {
  const clientIp = req.ip;
  const isAllowed = adminIpWhitelist.some(range => 
    ipRangeCheck(clientIp, range)
  );
  
  if (!isAllowed && req.user.role !== 'KORISNIK') {
    ErrorTracker.logError(new Error('Admin access from unauthorized IP'), {
      ip: clientIp,
      user: req.user.username
    });
    return res.status(403).json({ error: 'Access denied from this IP' });
  }
  
  next();
}

// Primjena na admin rute
app.use('/api/admin/*', checkAdminIp);
app.use('/users.html', checkAdminIp);
```

#### 6. Security Headers
```javascript
// Helmet.js za Express
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],  // Minimizuj unsafe-inline
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,        // 1 godina
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,             // X-Content-Type-Options
  xssFilter: true,           // X-XSS-Protection (legacy)
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
```

---

## 4) Sistem logovanja (Audit Trail)

### 4.1 Trenutna implementacija

#### Log struktura
```javascript
// Primjer SUCCESS log-a
{
  "timestamp": "2025-10-05 14:30:45",
  "timestamp_iso": "2025-10-05T14:30:45.123Z",
  "action": "USER_LOGIN",
  "action_display": "Prijava u sistem",
  "status": "SUCCESS",
  "user_name": "Marko Marković",
  "user_role": "ADMIN",
  "user_id": 2,
  "userId": 2,
  "target": "Auth System",
  "ip_address": "192.168.1.100",
  "metadata": {
    "browser": "Chrome 118",
    "os": "Windows 10",
    "sessionId": "sess_abc123"
  },
  "message": "Korisnik Marko Marković se uspješno prijavio u sistem"
}

// Primjer FAILED log-a
{
  "timestamp": "2025-10-05 14:35:12",
  "timestamp_iso": "2025-10-05T14:35:12.456Z",
  "action": "USER_LOGIN",
  "action_display": "Neuspješna prijava",
  "status": "FAILED",
  "user_name": "Unknown",
  "user_role": "SYSTEM",
  "target": "Auth System",
  "ip_address": "203.0.113.45",
  "metadata": {
    "reason": "Invalid credentials",
    "username_attempted": "admin",
    "attempts": 3
  },
  "message": "Neuspješan pokušaj prijave za korisnika: admin"
}
```

#### Logovane akcije (MVP - ZAKLJUČAN SCOPE)
> 🔒 **SCOPE LOCK:** Audit MVP podržava **SAMO** sljedeće 4 grupe događaja.  
> Proširenje scope-a zahtijeva izmjenu CHECK constraint-a i migraciju.

```javascript
// 🔴 Grupa 1: USER AUTHENTICATION (2 akcije)
- USER_LOGIN_SUCCESS   // Uspješna prijava
- USER_LOGIN_FAILURE   // Neuspješna prijava (metadata: username_attempted)

// 🔴 Grupa 2: USER CRUD (3 akcije)
- USER_CREATE          // Kreiranje novog korisnika
- USER_UPDATE          // Izmjena korisnika (metadata: before/after/changed_fields)
- USER_DELETE          // Brisanje korisnika

// 🔴 Grupa 3: OPERATOR CRUD (3 akcije)
- OPERATOR_CREATE      // Kreiranje operatera
- OPERATOR_UPDATE      // Izmjena operatera (metadata: before/after/changed_fields)
- OPERATOR_DELETE      // Brisanje operatera

// 🔴 Grupa 4: SYSTEM & SECURITY (2 akcije)
- SECURITY_ALERT       // Brute-force, XSS pokušaji, MFA failures
- UNAUTHORIZED_ACCESS  // Pokušaj pristupa bez dozvole

// ❌ VAN SCOPE-A (neće biti logovano u MVP)
- OPERATOR_VIEW        // Previše verbose
- TOKEN_REFRESH        // Šum u logovima
- SESSION_EXPIRED      // Normalan sistem event
- SYSTEM_ERROR         // Ide u separate error logs
- USER_STATUS_CHANGE   // Može se infer-ovati iz USER_UPDATE
```

**Database CHECK constraint (enforces scope):**
```sql
-- Dodati u Prisma migraciju ili scripts/add-check-constraints.sql
ALTER TABLE "AuditLog" ADD CONSTRAINT check_audit_action
CHECK (action IN (
  'USER_LOGIN_SUCCESS',
  'USER_LOGIN_FAILURE',
  'USER_CREATE',
  'USER_UPDATE',
  'USER_DELETE',
  'OPERATOR_CREATE',
  'OPERATOR_UPDATE',
  'OPERATOR_DELETE',
  'SECURITY_ALERT',
  'UNAUTHORIZED_ACCESS'
));
```

**Minimalna metadata šema (normativ za sve akcije):**
```typescript
// Obavezna polja za SVE akcije
interface AuditMetadata {
  correlation_id?: string;  // Za multi-step operacije (npr. bulk import)
}

// Dodatna polja za USER_LOGIN_FAILURE
interface LoginFailureMetadata extends AuditMetadata {
  username_attempted: string;  // OBAVEZNO - security tracking
  reason: string;              // "Invalid credentials", "Account locked", itd.
  attempts: number;            // Koliko puta pokušano
}

// Dodatna polja za *_UPDATE akcije
interface UpdateMetadata extends AuditMetadata {
  before: Record<string, any>;        // OBAVEZNO - staro stanje
  after: Record<string, any>;         // OBAVEZNO - novo stanje
  changed_fields: string[];           // OBAVEZNO - lista izmjena
}

// Dodatna polja za SECURITY_ALERT
interface SecurityAlertMetadata extends AuditMetadata {
  alert_type: 'BRUTE_FORCE' | 'XSS_ATTEMPT' | 'MFA_FAILURE' | 'RATE_LIMIT_HIT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ip_address: string;
  user_agent: string;
}
```

**Procjena volumena logova (50 users, 30 operators):**
```
Authentication: 50 users × 2 logins/day × 365d = 36,500 logs/year
User CRUD:      5 user changes/month × 12 = 60 logs/year
Operator CRUD:  10 operator changes/month × 12 = 120 logs/year
Security:       ~20 alerts/month × 12 = 240 logs/year
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:          ~37,000 logs/year (~3,100/month)
```
✅ **Zaključak:** MVP scope je realan, neće pretrpati bazu.

#### Deduplikacija logova
```javascript
// Sprječava spam logove (npr. 100x GET /api/operator/25)
deduplicateLogs(logs) {
  const seen = new Map();
  const deduplicated = [];
  
  for (const log of logs) {
    const key = `${log.user_id}_${log.action}_${log.target}`;
    
    // Ako smo vidjeli isti log u zadnjih 30s, skip
    if (seen.has(key)) {
      const lastSeen = seen.get(key);
      const timeDiff = new Date(log.timestamp_iso) - new Date(lastSeen.timestamp_iso);
      
      if (timeDiff < 30000) {  // 30 sekundi
        continue;  // Skip duplicate
      }
    }
    
    deduplicated.push(log);
    seen.set(key, log);
  }
  
  return deduplicated;
}
```

### 4.2 Preporučena poboljšanja

#### 1. Append-Only Log Storage (PostgreSQL)
```sql
-- Immutable audit log tabela
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_user_id   BIGINT REFERENCES app_user(id),
  actor_agency_id BIGINT REFERENCES agency(id),
  action          audit_action NOT NULL,
  action_display  VARCHAR(255),
  status          VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'ERROR', 'DENIED')),
  target_type     VARCHAR(50),          -- 'USER', 'OPERATOR', 'SYSTEM'
  target_id       BIGINT,
  target_display  VARCHAR(255),
  ip_address      INET,
  user_agent      TEXT,
  session_id      VARCHAR(100),
  legal_basis_id  BIGINT REFERENCES legal_basis(id),  -- Za buduće pretrage
  metadata        JSONB,                -- Fleksibilni dodatni podaci
  hash_prev       VARCHAR(64),          -- SHA-256 prethodnog log-a
  hash_current    VARCHAR(64)           -- SHA-256 ovog log-a
);

-- Indeksi za brze pretrage
CREATE INDEX idx_audit_occurred_at ON audit_log (occurred_at DESC);
CREATE INDEX idx_audit_actor ON audit_log (actor_user_id, occurred_at DESC);
CREATE INDEX idx_audit_action ON audit_log (action, occurred_at DESC);
CREATE INDEX idx_audit_target ON audit_log (target_type, target_id, occurred_at DESC);
CREATE INDEX idx_audit_status ON audit_log (status, occurred_at DESC);
CREATE INDEX idx_audit_ip ON audit_log (ip_address, occurred_at DESC);

-- GIN index za JSON pretragu
CREATE INDEX idx_audit_metadata ON audit_log USING GIN (metadata);

-- Particionisanje po mjesecima (za velike količine)
CREATE TABLE audit_log_2025_10 PARTITION OF audit_log
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

**Prednosti:**
- ✅ **Immutability** - INSERT only, NO UPDATE/DELETE
- ✅ **Integrity** - hash chain (blockchain princip)
- ✅ **Performance** - partitioned tables, optimizovani indeksi
- ✅ **Scalability** - može držati milijarde logova
- ✅ **ACID guarantees** - transakciona konzistencija

#### 2. Log Integrity (Hash Chain)
```javascript
// Kreiranje hash chain-a (blockchain style)
const crypto = require('crypto');

function createLogEntry(logData, previousHash) {
  const entry = {
    ...logData,
    occurred_at: new Date().toISOString(),
    hash_prev: previousHash
  };
  
  // Hash current log entry
  const dataToHash = JSON.stringify({
    occurred_at: entry.occurred_at,
    actor_user_id: entry.actor_user_id,
    action: entry.action,
    target_type: entry.target_type,
    target_id: entry.target_id,
    metadata: entry.metadata,
    hash_prev: entry.hash_prev
  });
  
  entry.hash_current = crypto
    .createHash('sha256')
    .update(dataToHash)
    .digest('hex');
  
  return entry;
}

// Validacija integriteta
async function verifyLogIntegrity() {
  const logs = await db.query(
    'SELECT * FROM audit_log ORDER BY id ASC'
  );
  
  for (let i = 1; i < logs.length; i++) {
    const current = logs[i];
    const previous = logs[i - 1];
    
    // Provjeri da li hash_prev pokazuje na prethodni log
    if (current.hash_prev !== previous.hash_current) {
      throw new Error(`Log chain broken at ID ${current.id}`);
    }
    
    // Provjeri da li current hash odgovara podacima
    const recalculatedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({...current, hash_current: undefined}))
      .digest('hex');
    
    if (current.hash_current !== recalculatedHash) {
      throw new Error(`Log tampered at ID ${current.id}`);
    }
  }
  
  return true;  // Chain is valid
}

// Dnevni integrity check (cron job)
cron.schedule('0 2 * * *', async () => {
  try {
    await verifyLogIntegrity();
    console.log('✅ Log integrity verified');
  } catch (error) {
    // KRITIČNI ALARM - logovi su kompromitovani!
    sendSecurityAlert('LOG_INTEGRITY_BREACH', error);
  }
});
```

#### 3. Log Retention Policy
```javascript
// Retention rules
const RETENTION_POLICY = {
  // Hot storage (brz pristup) - PostgreSQL
  hot: {
    duration: '3 months',
    storage: 'postgresql',
    compression: false
  },
  
  // Warm storage (spor pristup) - arhivni server
  warm: {
    duration: '2 years',
    storage: 'archive_db',
    compression: true
  },
  
  // Cold storage (compliance) - WORM storage
  cold: {
    duration: '7 years',  // Zakonska obaveza
    storage: 'worm',
    compression: true,
    encryption: true
  }
};

// Automatska arhivacija (mjesečni job)
async function archiveOldLogs() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  // Export logova u compressed format
  const oldLogs = await db.query(`
    SELECT * FROM audit_log
    WHERE occurred_at < $1
    ORDER BY occurred_at ASC
  `, [threeMonthsAgo]);
  
  // Compress i encrypt
  const archive = await compressAndEncrypt(oldLogs);
  
  // Upload na WORM storage
  await uploadToWormStorage(archive, {
    retention: '7 years',
    immutable: true
  });
  
  // Obriši iz hot storage (nakon verifikacije)
  await db.query(`
    DELETE FROM audit_log
    WHERE occurred_at < $1
  `, [threeMonthsAgo]);
  
  console.log(`📦 Archived ${oldLogs.length} logs`);
}
```

#### 4. Real-time Alerts
```javascript
// Security event detection
const ALERT_RULES = {
  MULTIPLE_FAILED_LOGINS: {
    threshold: 5,
    window: '15 minutes',
    severity: 'HIGH',
    action: 'LOCK_ACCOUNT_AND_NOTIFY'
  },
  
  ADMIN_LOGIN_UNUSUAL_IP: {
    check: 'ip_not_in_history',
    severity: 'MEDIUM',
    action: 'REQUIRE_MFA_AND_NOTIFY'
  },
  
  BULK_USER_DELETE: {
    threshold: 3,
    window: '1 hour',
    severity: 'CRITICAL',
    action: 'BLOCK_AND_ALERT_SUPERADMIN'
  },
  
  AFTER_HOURS_ACTIVITY: {
    hours: [22, 6],  // 22:00 - 06:00
    roles: ['SUPERADMIN', 'ADMIN'],
    severity: 'MEDIUM',
    action: 'LOG_AND_NOTIFY'
  }
};

// Alert handler
async function checkSecurityRules(logEntry) {
  // Provjera multiple failed logins
  if (logEntry.action === 'LOGIN_FAILURE') {
    const recentFailures = await db.query(`
      SELECT COUNT(*) as count
      FROM audit_log
      WHERE action = 'LOGIN_FAILURE'
        AND ip_address = $1
        AND occurred_at > NOW() - INTERVAL '15 minutes'
    `, [logEntry.ip_address]);
    
    if (recentFailures.count >= 5) {
      await sendAlert({
        type: 'MULTIPLE_FAILED_LOGINS',
        severity: 'HIGH',
        details: {
          ip: logEntry.ip_address,
          attempts: recentFailures.count
        },
        recipients: ['security@agency.gov.ba']
      });
      
      // Blokiraj IP privremeno
      await addToBlocklist(logEntry.ip_address, '1 hour');
    }
  }
  
  // Provjera admin pristupa sa novog IP-a
  if (logEntry.action === 'LOGIN_SUCCESS' && 
      ['SUPERADMIN', 'ADMIN'].includes(logEntry.user_role)) {
    const knownIps = await db.query(`
      SELECT DISTINCT ip_address
      FROM audit_log
      WHERE actor_user_id = $1
        AND action = 'LOGIN_SUCCESS'
        AND occurred_at > NOW() - INTERVAL '30 days'
    `, [logEntry.actor_user_id]);
    
    const isNewIp = !knownIps.some(row => row.ip_address === logEntry.ip_address);
    
    if (isNewIp) {
      await sendAlert({
        type: 'ADMIN_LOGIN_UNUSUAL_IP',
        severity: 'MEDIUM',
        details: {
          user: logEntry.user_name,
          ip: logEntry.ip_address,
          time: logEntry.occurred_at
        },
        recipients: [logEntry.user_email, 'security@agency.gov.ba']
      });
    }
  }
}
```

#### 5. Log Analysis & Reporting
```javascript
// Mjesečni izvještaj aktivnosti
async function generateMonthlyReport(agencyId, year, month) {
  const report = {
    period: `${year}-${month}`,
    agency_id: agencyId,
    generated_at: new Date().toISOString(),
    
    // Statistika po akcijama
    actions: await db.query(`
      SELECT 
        action,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as success_count,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_count
      FROM audit_log
      WHERE actor_agency_id = $1
        AND DATE_TRUNC('month', occurred_at) = $2
      GROUP BY action
      ORDER BY count DESC
    `, [agencyId, `${year}-${month}-01`]),
    
    // Top 10 najaktivnijih korisnika
    topUsers: await db.query(`
      SELECT 
        u.username,
        u.full_name,
        COUNT(l.id) as action_count
      FROM audit_log l
      JOIN app_user u ON l.actor_user_id = u.id
      WHERE l.actor_agency_id = $1
        AND DATE_TRUNC('month', l.occurred_at) = $2
      GROUP BY u.id, u.username, u.full_name
      ORDER BY action_count DESC
      LIMIT 10
    `, [agencyId, `${year}-${month}-01`]),
    
    // Sigurnosni događaji
    securityEvents: await db.query(`
      SELECT 
        action,
        status,
        COUNT(*) as count,
        MIN(occurred_at) as first_occurrence,
        MAX(occurred_at) as last_occurrence
      FROM audit_log
      WHERE actor_agency_id = $1
        AND DATE_TRUNC('month', occurred_at) = $2
        AND (
          action LIKE '%FAILED%' OR
          status = 'FAILED' OR
          action IN ('SECURITY_ALERT', 'UNAUTHORIZED_ACCESS')
        )
      GROUP BY action, status
      ORDER BY count DESC
    `, [agencyId, `${year}-${month}-01`]),
    
    // Aktivnost po danima (za graf)
    dailyActivity: await db.query(`
      SELECT 
        DATE(occurred_at) as date,
        COUNT(*) as total_actions,
        COUNT(DISTINCT actor_user_id) as active_users
      FROM audit_log
      WHERE actor_agency_id = $1
        AND DATE_TRUNC('month', occurred_at) = $2
      GROUP BY DATE(occurred_at)
      ORDER BY date ASC
    `, [agencyId, `${year}-${month}-01`])
  };
  
  // Generiši PDF izvještaj
  const pdf = await generatePdfReport(report);
  
  // Pošalji admin-ima
  await sendEmail({
    to: await getAgencyAdmins(agencyId),
    subject: `Mjesečni izvještaj aktivnosti - ${report.period}`,
    attachments: [{
      filename: `ATLAS_Report_${report.period}.pdf`,
      content: pdf
    }]
  });
  
  return report;
}

// Compliance izvještaj za revizore
async function generateComplianceReport(startDate, endDate) {
  return {
    period: { start: startDate, end: endDate },
    
    // Sve akcije nad korisnicima
    userManagement: await db.query(`
      SELECT * FROM audit_log
      WHERE target_type = 'USER'
        AND occurred_at BETWEEN $1 AND $2
      ORDER BY occurred_at DESC
    `, [startDate, endDate]),
    
    // Sve pretrage operatera (buduće)
    searches: await db.query(`
      SELECT * FROM audit_log
      WHERE action LIKE 'SEARCH_%'
        AND occurred_at BETWEEN $1 AND $2
      ORDER BY occurred_at DESC
    `, [startDate, endDate]),
    
    // Svi sigurnosni događaji
    securityEvents: await db.query(`
      SELECT * FROM audit_log
      WHERE (status = 'FAILED' OR action LIKE '%SECURITY%')
        AND occurred_at BETWEEN $1 AND $2
      ORDER BY occurred_at DESC
    `, [startDate, endDate]),
    
    // Verifikacija integriteta
    integrityCheck: await verifyLogIntegrity()
  };
}
```

---

## 5) Arhitektura i tehnologije

### 5.1 Trenutna arhitektura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                   │
├─────────────────────────────────────────────────────────┤
│  • HTML5 + CSS3 (Responsive)                           │
│  • Vanilla JavaScript (ES6+)                           │
│  • localStorage za sesije                              │
│  • Fetch API za HTTP requests                          │
└────────────┬────────────────────────────────────────────┘
             │ HTTP/HTTPS
             ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js/Express)               │
├─────────────────────────────────────────────────────────┤
│  • Express.js 4.18+                                    │
│  • JWT autentikacija (jsonwebtoken)                   │
│  • Bcrypt password hashing                            │
│  • CORS middleware                                     │
│  • Body parser & cookie parser                        │
└────────────┬────────────────────────────────────────────┘
             │ File I/O
             ▼
┌─────────────────────────────────────────────────────────┐
│                DATA LAYER (File-based)                  │
├─────────────────────────────────────────────────────────┤
│  • auth-users.json     (korisnici)                     │
│  • operateri.json      (operateri - in-memory)         │
│  • system-logs.json    (logovi - planned)              │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Predložena arhitektura (sa bazom)

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                   │
├─────────────────────────────────────────────────────────┤
│  • HTML5 + CSS3 (Responsive)                           │
│  • Vanilla JavaScript (ES6+)                           │
│  • HttpOnly cookies za tokene                          │
│  • Fetch API sa credentials: 'include'                 │
└────────────┬────────────────────────────────────────────┘
             │ HTTPS (TLS 1.3)
             ▼
┌─────────────────────────────────────────────────────────┐
│              REVERSE PROXY (Nginx/Caddy)                │
├─────────────────────────────────────────────────────────┤
│  • TLS termination                                     │
│  • Rate limiting (10 req/s per IP)                     │
│  • IP whitelisting za admin zone                       │
│  • Security headers (CSP, HSTS, etc.)                  │
│  • Load balancing (za scale-out)                       │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│             APPLICATION LAYER (Node.js)                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │         Express.js API Server                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  • JWT middleware (access + refresh)            │   │
│  │  • RBAC guards (role-based permissions)         │   │
│  │  • CSRF protection (csurf)                      │   │
│  │  • Input validation (express-validator)         │   │
│  │  • Audit logging middleware                     │   │
│  │  • Error handling & tracking                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Business Logic Layer                  │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  • AuthService (login, MFA, sessions)           │   │
│  │  • UserService (CRUD, permissions)              │   │
│  │  • OperatorService (CRUD, search)               │   │
│  │  • AuditService (logging, reporting)            │   │
│  │  • NotificationService (email, alerts)          │   │
│  └─────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│              DATA ACCESS LAYER (ORM/Query Builder)      │
├─────────────────────────────────────────────────────────┤
│  • Prisma ORM / TypeORM / Knex.js                      │
│  • Connection pooling                                  │
│  • Query caching (Redis)                               │
│  • Transaction management                              │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                         │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌─────────────────────┐   │
│  │   PostgreSQL 15+       │  │   Redis 7+          │   │
│  ├────────────────────────┤  ├─────────────────────┤   │
│  │ • app_user             │  │ • Session cache     │   │
│  │ • agency               │  │ • Rate limit        │   │
│  │ • role                 │  │ • Query cache       │   │
│  │ • operator             │  │ • Job queues        │   │
│  │ • audit_log            │  └─────────────────────┘   │
│  │ • legal_basis          │                            │
│  │ • operator_endpoint    │                            │
│  └────────────────────────┘                            │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │          Backup & Archive Storage              │   │
│  ├────────────────────────────────────────────────┤   │
│  │ • Daily backups (automated)                    │   │
│  │ • WORM storage za audit logs (7 years)         │   │
│  │ • Encryption at rest (AES-256)                 │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Technology Stack

#### Frontend
```javascript
// Core
- HTML5 (Semantic markup)
- CSS3 (Flexbox, Grid, Custom Properties)
- JavaScript ES6+ (Modules, Async/Await, Classes)

// Libraries
- Font Awesome 6.4+ (icons)
- Google Fonts (Poppins, Inter)
- Chart.js (za buduće dashboarde)

// Build Tools (optional za production)
- Vite / Webpack (bundling)
- Babel (transpilation)
- PostCSS / Sass (CSS preprocessing)
```

#### Backend (Node.js)
```javascript
// Runtime
- Node.js 18 LTS+ (Active LTS)

// Framework
- Express.js 4.18+

// Authentication & Security
- jsonwebtoken 9.0+        // JWT tokens
- argon2 / bcrypt 5.1+     // Password hashing
- speakeasy 2.0+           // TOTP/MFA
- helmet 7.0+              // Security headers
- express-rate-limit 6.0+  // Rate limiting
- csurf 1.11+              // CSRF protection

// Database
- pg 8.11+ (PostgreSQL driver)
- Prisma 5.0+ (ORM) - PREPORUKA
- ioredis 5.3+ (Redis client)

// Validation
- express-validator 7.0+
- joi 17.9+

// Utilities
- dotenv 16.0+             // Environment variables
- winston 3.10+            // Logging
- nodemailer 6.9+          // Email
- qrcode 1.5+              // QR generation za MFA
- ip-range-check 0.2+      // IP validation
```

#### Database
```sql
-- Primary Database
PostgreSQL 15+ (LTS)
  - ACID compliance
  - JSON support (JSONB)
  - Partitioning
  - Full-text search
  - Row-level security (RLS)

-- Cache & Sessions
Redis 7+
  - In-memory data structure store
  - Pub/Sub messaging
  - TTL expiration
  - Persistence options (RDB/AOF)
```

#### DevOps
```yaml
# Containerization
Docker 24+
Docker Compose 2.20+

# Reverse Proxy
Nginx 1.24+ / Caddy 2.7+

# Monitoring (future)
- Prometheus (metrics)
- Grafana (dashboards)
- Elastic Stack (log aggregation)

# CI/CD (future)
- GitHub Actions
- Jenkins
```

---

## 6) Plan migracije na centralizovanu bazu

### 6.1 Faza 1: Database Setup (Week 1)

#### 1.1 PostgreSQL instalacija i konfiguracija
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-15 postgresql-contrib

# Kreiranje database i korisnika
sudo -u postgres psql
CREATE DATABASE atlas_db;
CREATE USER atlas_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE atlas_db TO atlas_user;

# Omogući povezivanje sa aplikacijom
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Dodaj: host atlas_db atlas_user 127.0.0.1/32 scram-sha-256

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### 1.2 Redis instalacija (za sesije i cache)
```bash
# Ubuntu/Debian
sudo apt install redis-server

# Konfiguracija za production
sudo nano /etc/redis/redis.conf
# Promijeni:
# bind 127.0.0.1
# requirepass your_strong_redis_password
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis-server
```

#### 1.3 Prisma setup
```bash
# Instalacija Prisma
npm install prisma --save-dev
npm install @prisma/client

# Inicijalizacija Prisma
npx prisma init

# Uredi .env
DATABASE_URL="postgresql://atlas_user:secure_password_here@localhost:5432/atlas_db?schema=public"
REDIS_URL="redis://:your_strong_redis_password@localhost:6379"
```

#### 1.4 Definisanje šeme (prisma/schema.prisma)
```prisma
// filepath: prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== AUTHENTICATION ====================

model Agency {
  id         BigInt   @id @default(autoincrement())
  name       String   @unique @db.VarChar(200)
  code       String   @unique @db.VarChar(50)
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  users      User[]
  auditLogs  AuditLog[]

  @@map("agency")
}

model Role {
  id          BigInt   @id @default(autoincrement())
  name        String   @unique @db.VarChar(100)
  description String?  @db.Text

  users       UserRole[]

  @@map("role")
}

model User {
  id          BigInt   @id @default(autoincrement())
  agencyId    BigInt?  @map("agency_id")
  username    String   @unique @db.VarChar(150)
  passHash    String   @map("pass_hash") @db.Text
  email       String?  @db.VarChar(255)
  fullName    String?  @map("full_name") @db.VarChar(255)
  isActive    Boolean  @default(true) @map("is_active")
  mfaEnabled  Boolean  @default(false) @map("mfa_enabled")
  mfaSecret   String?  @map("mfa_secret") @db.Text
  lastLogin   DateTime? @map("last_login")
  lastActivity DateTime? @map("last_activity")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  agency      Agency?  @relation(fields: [agencyId], references: [id])
  roles       UserRole[]
  auditLogs   AuditLog[]
  sessions    Session[]

  @@index([agencyId])
  @@index([username])
  @@index([email])
  @@map("app_user")
}

model UserRole {
  userId  BigInt @map("user_id")
  roleId  BigInt @map("role_id")

  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  role    Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@id([userId, roleId])
  @@map("user_role")
}

model Session {
  id            String   @id @default(uuid())
  userId        BigInt   @map("user_id")
  accessToken   String   @map("access_token") @db.Text
  refreshToken  String   @map("refresh_token") @db.Text
  ipAddress     String?  @map("ip_address") @db.Inet
  userAgent     String?  @map("user_agent") @db.Text
  expiresAt     DateTime @map("expires_at")
  createdAt     DateTime @default(now()) @map("created_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([accessToken])
  @@index([refreshToken])
  @@index([expiresAt])
  @@map("session")
}

// ==================== OPERATORS ====================

model Operator {
  id                BigInt   @id @default(autoincrement())
  name              String   @unique @db.VarChar(200)
  description       String?  @db.Text
  apiBaseUrl        String?  @map("api_base_url") @db.Text
  contactEmail      String?  @map("contact_email") @db.VarChar(255)
  contactPhone      String?  @map("contact_phone") @db.VarChar(50)
  hasLegalIntercept Boolean  @default(false) @map("has_legal_intercept")  // Za brze filtere
  isActive          Boolean  @default(true) @map("is_active")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  capabilities      OperatorCapability[]
  endpoints         OperatorEndpoint[]

  @@index([name])
  @@index([isActive])
  @@index([hasLegalIntercept])  // Brzi filter za legal intercept
  @@map("operator")
}

model OperatorCapability {
  id          BigInt   @id @default(autoincrement())
  operatorId  BigInt   @map("operator_id")
  capability  String   @db.VarChar(100)

  operator    Operator @relation(fields: [operatorId], references: [id], onDelete: Cascade)

  @@unique([operatorId, capability])
  @@index([capability])
  @@map("operator_capability")
}

model OperatorEndpoint {
  id          BigInt   @id @default(autoincrement())
  operatorId  BigInt   @map("operator_id")
  name        String   @db.VarChar(100)
  method      String   @db.VarChar(10)
  path        String   @db.Text
  version     String   @db.VarChar(20)
  isActive    Boolean  @default(true) @map("is_active")

  operator    Operator @relation(fields: [operatorId], references: [id], onDelete: Cascade)

  @@unique([operatorId, name, version])
  @@index([operatorId])
  @@map("operator_endpoint")
}

// ==================== LEGAL BASIS ====================

model LegalBasis {
  id          BigInt   @id @default(autoincrement())
  referenceNo String   @map("reference_no") @db.VarChar(200)
  issuer      String?  @db.VarChar(200)
  issuedAt    DateTime? @map("issued_at") @db.Date
  description String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")

  auditLogs   AuditLog[]

  @@index([referenceNo])
  @@map("legal_basis")
}

// ==================== AUDIT LOG ====================

enum AuditAction {
  LOGIN_SUCCESS
  LOGIN_FAILURE
  LOGOUT
  TOKEN_REFRESH
  SESSION_EXPIRED
  USER_CREATE
  USER_UPDATE
  USER_DELETE
  USER_STATUS_CHANGE
  OPERATOR_CREATE
  OPERATOR_UPDATE
  OPERATOR_DELETE
  SYSTEM_ERROR
  SECURITY_ALERT
  UNAUTHORIZED_ACCESS

  @@map("audit_action")
}

enum AuditStatus {
  SUCCESS
  FAILED
  ERROR
  DENIED

  @@map("audit_status")
}

model AuditLog {
  id             BigInt       @id @default(autoincrement())
  occurredAt     DateTime     @default(now()) @map("occurred_at")
  actorUserId    BigInt?      @map("actor_user_id")
  actorAgencyId  BigInt?      @map("actor_agency_id")
  action         AuditAction
  actionDisplay  String?      @map("action_display") @db.VarChar(255)
  status         AuditStatus
  targetType     String?      @map("target_type") @db.VarChar(50)
  targetId       BigInt?      @map("target_id")
  targetDisplay  String?      @map("target_display") @db.VarChar(255)
  legalBasisId   BigInt?      @map("legal_basis_id")
  ipAddress      String?      @map("ip_address") @db.Inet
  userAgent      String?      @map("user_agent") @db.Text
  sessionId      String?      @map("session_id") @db.VarChar(100)
  metadata       Json?        @db.JsonB
  hashPrev       String?      @map("hash_prev") @db.VarChar(64)
  hashCurrent    String?      @map("hash_current") @db.VarChar(64)

  user           User?        @relation(fields: [actorUserId], references: [id])
  agency         Agency?      @relation(fields: [actorAgencyId], references: [id])
  legalBasis     LegalBasis?  @relation(fields: [legalBasisId], references: [id])

  @@index([occurredAt(sort: Desc)])
  @@index([actorUserId, occurredAt(sort: Desc)])
  @@index([action, occurredAt(sort: Desc)])
  @@index([targetType, targetId, occurredAt(sort: Desc)])
  @@index([status, occurredAt(sort: Desc)])
  @@index([ipAddress, occurredAt(sort: Desc)])
  @@map("audit_log")
}
```

### Vizuelni prikaz šeme baze podataka

```mermaid
erDiagram
    agency ||--o{ app_user : "has"
    app_user ||--o{ user_role : "has"
    role ||--o{ user_role : "assigned"
    app_user ||--o{ audit_log : "creates"
    operator ||--o{ operator_capability : "has"
    operator ||--o{ operator_endpoint : "has"
    legal_basis ||--o{ audit_log : "references"
```

**Procjena veličine baze:** Očekivano 50 korisnika, 30 operatera, 10.000 audit log zapisa godišnje.

### Detalji o capabilities normalizaciji

Tabela `operator_capability` sa indexom na `capability` omogućava O(1) lookup bez JSONB skeniranja. Batch-populacija u [`scripts/migrate-operators.js`](scripts/migrate-operators.js) parsira `detaljne_usluge` i `detaljne_tehnologije`. JSONB ostaje za bogate detalje.

### Standardizovano JSON schema za metadata

Za MVP, samo 4 akcije: USER_LOGIN (uspjeh/neuspjeh), USER_CREATE/UPDATE/DELETE, OPERATOR_CREATE/UPDATE/DELETE.

JSON schema za metadata po događaju:
```json
{
  "before": { /* stanje prije promjene */ },
  "after": { /* stanje poslije promjene */ },
  "changed_fields": ["field1", "field2"],
  "username_attempted": "korisnik"  // za failed login
}
```

CHECK constraint: `action IN ('USER_LOGIN', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'OPERATOR_CREATE', 'OPERATOR_UPDATE', 'OPERATOR_DELETE')`.

### 🔄 VAŽNO: Idempotentnost SQL skripti (OBAVEZNO)

> ⚠️ **NORMATIV:** Sve SQL skripte (constraints, indeksi, seed data) MORAJU biti idempotentne.  
> Ponovno pokretanje iste skripte NE SME proizvesti greške ili duplikate.

**Obavezne tehnike:**

#### 1. Constraints i Indexes - `IF NOT EXISTS`
```sql
-- ✅ OBAVEZNA FORMA (za constraints)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_audit_action'
  ) THEN
    ALTER TABLE "AuditLog" ADD CONSTRAINT check_audit_action
    CHECK (action IN (
      'USER_LOGIN_SUCCESS', 'USER_LOGIN_FAILURE',
      'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
      'OPERATOR_CREATE', 'OPERATOR_UPDATE', 'OPERATOR_DELETE',
      'SECURITY_ALERT', 'UNAUTHORIZED_ACCESS'
    ));
  END IF;
END $$;

-- ✅ OBAVEZNA FORMA (za indexes)
CREATE INDEX IF NOT EXISTS idx_audit_timestamp 
ON "AuditLog" (timestamp);

CREATE INDEX IF NOT EXISTS idx_audit_user_action 
ON "AuditLog" (user_id, action);

CREATE INDEX IF NOT EXISTS idx_audit_metadata_gin 
ON "AuditLog" USING GIN (metadata);
```

#### 2. Seed/Import Data - UPSERT na natural key
```javascript
// ✅ OBAVEZNA FORMA (Prisma upsert)
const agency = await prisma.agency.upsert({
  where: { code: 'CENTRAL' },  // Natural key (NE id)
  update: {},                  // Ako postoji, uradi ništa (ili update polja)
  create: {                    // Ako ne postoji, kreiraj
    name: 'Centralna Agencija',
    code: 'CENTRAL'
  }
});

// ❌ POGREŠNA FORMA (ne provjeri duplikate)
const agency = await prisma.agency.create({
  data: { name: 'Centralna Agencija', code: 'CENTRAL' }
});  // Pukne ako već postoji
```

#### 3. Multi-step operacije - Transaction wrapping
```javascript
// ✅ OBAVEZNA FORMA (transakcija + rollback na greške)
await prisma.$transaction(async (tx) => {
  // Korak 1: Provjeri da li već postoji
  const existingOperator = await tx.operator.findUnique({
    where: { code: 'OP123' }
  });
  
  if (existingOperator) {
    console.log(`Operator OP123 već postoji, preskačem.`);
    return;  // Idempotentno - ne pravi greške
  }
  
  // Korak 2: Kreiraj operatera
  const operator = await tx.operator.create({
    data: { /* ... */ }
  });
  
  // Korak 3: Bulk-create capabilities (provjer duplikate)
  for (const cap of capabilities) {
    await tx.operatorCapability.upsert({
      where: {
        operatorId_capability: {
          operatorId: operator.id,
          capability: cap
        }
      },
      update: {},
      create: {
        operatorId: operator.id,
        capability: cap
      }
    });
  }
});
```

**Skripte koje moraju biti idempotentne:**
- [`scripts/add-check-constraints.sql`](scripts/add-check-constraints.sql) - ✅ Koristi `IF NOT EXISTS`
- [`scripts/create-gin-indexes.sql`](scripts/create-gin-indexes.sql) - ✅ Koristi `CREATE INDEX IF NOT EXISTS`
- [`scripts/migrate-operators.js`](scripts/migrate-operators.js) - ✅ MORA koristiti `upsert` na natural key (code)
- [`prisma/seed.js`](prisma/seed.js) - ✅ MORA koristiti `upsert` za uloge, agencije, testne usere

#### 1.5 Kreiranje migracije
```bash
# Generiši migraciju
npx prisma migrate dev --name init

# Generiši Prisma Client
npx prisma generate
```

### 6.2 Faza 2: Data Migration (Week 1-2)

#### 2.1 Seed osnovnih podataka
```javascript
// filepath: prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Kreiranje uloga
  const superadminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: {
      name: 'SUPERADMIN',
      description: 'Potpuna kontrola sistema - centralna administracija'
    }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administracija svoje agencije'
    }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'KORISNIK' },
    update: {},
    create: {
      name: 'KORISNIK',
      description: 'Osnovni operativni pristup'
    }
  });

  console.log('✅ Roles created');

  // 2. Kreiranje centralne agencije
  const centralAgency = await prisma.agency.upsert({
    where: { code: 'CENTRAL' },
    update: {},
    create: {
      name: 'Centralna administracija ATLAS',
      code: 'CENTRAL'
    }
  });

  console.log('✅ Central agency created');

  // 3. Kreiranje SuperAdmin korisnika
  const superadminPassword = await argon2.hash('ChangeThisPassword123!');
  
  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      passHash: superadminPassword,
      email: 'superadmin@atlas.gov.ba',
      fullName: 'System Administrator',
      agencyId: centralAgency.id,
      isActive: true,
      mfaEnabled: false
    }
  });

  // Link superadmin sa ulogom
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superadmin.id,
        roleId: superadminRole.id
      }
    },
    update: {},
    create: {
      userId: superadmin.id,
      roleId: superadminRole.id
    }
  });

  console.log('✅ SuperAdmin user created');
  console.log('   Username: superadmin');
  console.log('   Password: ChangeThisPassword123! (CHANGE THIS!)');

  // 4. Log seed completion
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_ERROR',  // Koristimo postojeći enum
      actionDisplay: 'Database seeded',
      status: 'SUCCESS',
      targetType: 'SYSTEM',
      targetDisplay: 'Initial seed completed'
    }
  });

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```bash
# Pokreni seed
npx prisma db seed
```

#### 2.2 Migracija postojećih korisnika iz JSON
```javascript
// filepath: scripts/migrate-users.js

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const fs = require('fs').promises;

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('📦 Migrating users from auth-users.json...');

  // Učitaj postojeće korisnike
  const jsonData = await fs.readFile('./data/auth-users.json', 'utf-8');
  const oldUsers = JSON.parse(jsonData);

  // Učitaj role
  const roles = await prisma.role.findMany();
  const roleMap = {
    'SUPERADMIN': roles.find(r => r.name === 'SUPERADMIN').id,
    'ADMIN': roles.find(r => r.name === 'ADMIN').id,
    'KORISNIK': roles.find(r => r.name === 'KORISNIK').id
  };
- ✅ **Preciznijim** (procjene, validacije)
- ✅ **Sigurnijim** (rollback plan, idempotentnost)
- ✅ **Korisnijim** (quick reference, detaljniji komentari)

**Sve izmjene sam jasno označio gdje idu i šta treba promijeniti.**

**Preporučujem da počneš odmah sa database migracijom!** 🚀

### Quick Reference Tabela

| Komponenta | Fajl | Status | Prioritet |
|------------|------|--------|-----------|
| Database Schema | `prisma/schema.prisma` | ✅ Kompletno | 1 |
| Migration Scripts | `scripts/migrate-*.js` | ✅ Kompletno | 1 |
| Auth Service | `auth-system.js` | ✅ Kompletno | 1 |
| User Management | `users.js` | ✅ Kompletno | 1 |
| Operator Catalog | `operateri.js` | ✅ Kompletno | 1 |
| System Logs | `system-logs.js` | ✅ Kompletno | 1 |
| MFA Implementation | TBD | ❌ Nedostaje | 2 |
| HTTPS Setup | TBD | ❌ Nedostaje | 2 |
| Rate Limiting | TBD | ❌ Nedostaje | 2 |
| Audit Integrity | TBD | ❌ Nedostaje | 2 |

### Napomena o post-MVP particionisanju

Particionisanje `audit_log` po mjesecima zadrži kao "post-MVP" (Q1 2026) — do tada su GIN indeksi i pravilan poredak indeksa dovoljni za performanse.

## 7) Best Practices i preporuke

### 7.1 Sigurnost

#### ✅ **Implementiraj ODMAH**
1. **Environment Variables** - prebaci sve secrets u `.env`
   ```bash
   JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
   JWT_REFRESH_SECRET=different-refresh-secret-min-32-chars
   DATABASE_URL=postgresql://user:pass@localhost:5432/atlas_db
   REDIS_URL=redis://:password@localhost:6379
   NODE_ENV=production
   PORT=3000
   ```

2. **HTTPS obavezno** - nikada produkcija bez TLS/SSL
   ```bash
   # Caddy (automatski HTTPS)
   caddy reverse-proxy --from atlas.gov.ba --to localhost:3000
   
   # Nginx + Let's Encrypt
   certbot --nginx -d atlas.gov.ba
   ```

3. **Helmet.js** - security headers
4. **Rate Limiting** - brute-force zaštita
5. **Input Validation** - express-validator za sve forme

#### 🟡 **Implementiraj u narednih 1-2 mjeseca**
1. **MFA obavezan** za SUPERADMIN i ADMIN uloge
2. **IP Whitelisting** za admin zone
3. **Argon2id** umjesto bcrypt (brži, sigurniji)
4. **HttpOnly Cookies** umjesto localStorage
5. **CSRF Tokens** za sve POST/PUT/DELETE akcije

#### 🔵 **Long-term** (3-6 mjeseci)
1. **Penetration Testing** - najmi profesionalca
2. **Security Audit** - reviziraj codebase
3. **Compliance Check** - zakonska usklađenost
4. **Bug Bounty Program** - nagradi pronalazitelje ranjivosti

### 7.2 Performance

#### Database
```javascript
// 1. Connection Pooling (Prisma)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pool settings
  pool_timeout = 10
  connection_limit = 20
}

// 2. Query Caching (Redis)
const redis = require('ioredis');
const cache = new redis(process.env.REDIS_URL);

async function getOperators() {
  // Pokušaj iz cache-a
  const cached = await cache.get('operators:all');
  if (cached) return JSON.parse(cached);
  
  // Ako nema, fetch iz baze
  const operators = await prisma.operator.findMany({
    include: { capabilities: true }
  });
  
  // Sačuvaj u cache (5 minuta)
  await cache.setex('operators:all', 300, JSON.stringify(operators));
  
  return operators;
}

// 3. Pagination OBAVEZNO
async function getLogs(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { occurredAt: 'desc' }
    }),
    prisma.auditLog.count()
  ]);
  
  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// 4. Indexi KRITIČNI
// Već definirani u Prisma schema, ali provjeri da su kreirani:
// SHOW INDEX FROM audit_log;
```

#### Frontend
```javascript
// 1. Lazy Loading za velike liste
function renderLogs(logs) {
  const container = document.getElementById('logs-container');
  
  // Render samo prvih 50
  const visible = logs.slice(0, 50);
  container.innerHTML = visible.map(renderLogRow).join('');
  
  // Infinite scroll za ostatak
  window.addEventListener('scroll', () => {
    if (isNearBottom()) {
      loadMoreLogs();
    }
  });
}

// 2. Debouncing za search
let searchTimeout;
function onSearchInput(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300); // 300ms delay
}

// 3. Request Deduplication
const requestCache = new Map();
async function fetchWithCache(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }
  
  const promise = fetch(url).then(r => r.json());
  requestCache.set(url, promise);
  
  // Clear nakon 5 min
  setTimeout(() => requestCache.delete(url), 300000);
  
  return promise;
}
```

### 7.3 Monitoring i Alerting

#### Health Checks
````javascript
router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {}
  };

  try {
    // Database check
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.status = 'error';
    health.checks.database = 'error';
  }

  try {
    // Redis check
    await redis.ping();
    health.checks.redis = 'ok';
  } catch (error) {
    health.status = 'degraded';
    health.checks.redis = 'error';
  }

  res.status(health.status === 'ok' ? 200 : 503).json(health);
});
````

#### Logging (Winston)
````javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'atlas-api' },
  transports: [
    // Console za development
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    // File za production
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

module.exports = logger;
````

---

## 8) Roadmap - Naredni koraci

### 📅 **Q4 2025 (Oktobar - Decembar)**

#### Prioritet 1: Database Migration ⭐⭐⭐
- [ ] **Week 1-2:** PostgreSQL + Prisma setup
- [ ] **Week 2-3:** Migracija podataka iz JSON
- [ ] **Week 3-4:** Backend refactoring (AuthService, UserService)
- [ ] **Week 4:** Testing i deployment

#### Prioritet 2: Security Hardening ⭐⭐⭐
- [ ] Environment variables (.env setup)
- [ ] HTTPS obavezan (Caddy/Let's Encrypt)
- [ ] Helmet.js security headers
- [ ] Rate limiting na kritičnim rutama
- [ ] Input validation sa express-validator

#### Prioritet 3: Audit System Enhancement ⭐⭐
- [ ] Immutable audit logs (hash chain)
- [ ] Log integrity checks (daily cron)
- [ ] Real-time security alerts
- [ ] Automated monthly reports

### 📅 **Q1 2026 (Januar - Mart)**

#### Multi-Factor Authentication ⭐⭐⭐
- [ ] MFA setup UI (QR code generation)
- [ ] TOTP verification (speakeasy)
- [ ] Obavezan MFA za ADMIN/SUPERADMIN
- [ ] Backup codes za recovery

#### Advanced User Management ⭐⭐
- [ ] Bulk user import (CSV)
- [ ] User deaktivacija workflow
- [ ] Password reset via email
- [ ] Account lockout policy

#### Operator Endpoint Integration ⭐
- [ ] API client za operatere
- [ ] Request/Response logging
- [ ] Legal basis tracking za searches
- [ ] Encrypted credential storage

### 📅 **Q2 2026 (April - Jun)**

#### Advanced Analytics ⭐⭐
- [ ] Dashboard za statistiku
- [ ] Chart.js integracija
- [ ] User activity heatmaps
- [ ] Security event timeline

#### Compliance & Reporting ⭐⭐⭐
- [ ] Automated compliance reports
- [ ] Export za revizore (PDF)
- [ ] GDPR compliance checklist
- [ ] Data retention automation

#### Performance Optimization ⭐
- [ ] Redis query caching
- [ ] Database query optimization
- [ ] Frontend lazy loading
- [ ] CDN za static assets

### 📅 **Q3-Q4 2026 (Jul - Decembar)**

#### Scale-Out & High Availability ⭐
- [ ] Load balancing (Nginx)
- [ ] Database replication (read replicas)
- [ ] Automated backups (daily)
- [ ] Disaster recovery plan

#### Advanced Features ⭐
- [ ] Search operators by capability
- [ ] API versioning (v2)
- [ ] WebSocket real-time updates
- [ ] Mobile-responsive improvements

#### Documentation & Training ⭐⭐
- [ ] Video tutorials za end-users
- [ ] Admin handbook (PDF)
- [ ] API documentation (Swagger)
- [ ] Security best practices guide

---

## 9) Checklist za Production

### Pre-Launch Checklist ✅

#### Sigurnost
- [ ] Svi secrets u `.env` fajlu
- [ ] `.env` u .gitignore (NE commit-uj!)
- [ ] HTTPS enabled (TLS 1.3)
- [ ] Helmet.js security headers
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation na svim formama
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection (CSP headers)
- [ ] CSRF tokens na POST/PUT/DELETE

#### Database
- [ ] PostgreSQL production config
- [ ] Connection pooling enabled
- [ ] Database migrations applied
- [ ] All indexes created
- [ ] Backup strategy defined (daily)
- [ ] Disaster recovery plan documented

#### Monitoring
- [ ] Health check endpoint (`/health`)
- [ ] Error logging (Winston)
- [ ] Performance monitoring
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Security alerts configured

#### Performance
- [ ] Redis caching enabled
- [ ] Query optimization done
- [ ] Static assets minified
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)

#### Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance checked
- [ ] Audit log retention policy defined
- [ ] Data encryption at rest

#### Documentation
- [ ] README.md ažuriran
- [ ] API dokumentacija kompletna
- [ ] User manual objavljen
- [ ] Admin handbook dostupan
- [ ] Troubleshooting guide kreiran

#### Testing
- [ ] Unit tests napisani (kritični moduli)
- [ ] Integration tests pokrenuti
- [ ] Security scan izvršen
- [ ] Penetration test obavljen
- [ ] Load testing completed

#### Deployment
- [ ] Production server setup
- [ ] Reverse proxy configured (Nginx/Caddy)
- [ ] Firewall rules defined
- [ ] SSH key-based auth only
- [ ] Automated deployment script
- [ ] Rollback procedure documented

---

## 🎯 **Zaključak**

ATLAS sistem je **production-ready** sa solidnim fundamentom, ali zahtijeva **migraciju na centralizovanu bazu** i **security hardening** prije nego što ide u široku upotrebu.

### Prioriteti:
1. **Database migration** (PostgreSQL + Prisma) - **4 sedmice**
2. **Security hardening** (MFA, HTTPS, Rate Limiting) - **2 sedmice**
3. **Audit system enhancement** (immutable logs, alerts) - **2 sedmice**

Ukupno: **8 sedmica** za production-grade sistem.

Nakon toga, sistem će biti:
- ✅ Siguran (MFA, HTTPS, rate limiting)
- ✅ Scalable (PostgreSQL, Redis)
- ✅ Compliant (immutable audit logs)
- ✅ Reliable (backups, monitoring)
- ✅ Maintainable (dokumentacija, tests)

**Preporučujem da počneš odmah sa database migracijom!** 
