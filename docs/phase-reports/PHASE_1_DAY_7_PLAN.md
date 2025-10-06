# Phase 1 Day 7: Osnovni Sigurnosni Mehanizmi - PLAN

**Datum:** 6. Oktobar 2025  
**Procjena trajanja:** ~1.5 sata  
**Status:** 📝 PLANIRANJE

---

## 🎯 Cilj

Implementirati **kritične sigurnosne mehanizme** koji su neophodni za production deployment:
1. CSRF Protection
2. Security Headers (Helmet.js)
3. Per-User Rate Limiting

**Fokus:** Stabilnost i sigurnost bez "overkill" funkcionalnosti.

---

## 📋 Task Breakdown

### Task 1: CSRF Protection (30 minuta)

**Šta je CSRF?**
Cross-Site Request Forgery - napad gdje maliciozni website šalje request u ime autentifikovanog korisnika.

**Trenutno stanje:**
- `csurf` paket je instaliran
- Middleware je **commented** u `server.js` (line 324)
- Nema CSRF tokena u frontend formama

**Implementacija:**

#### Backend (server.js)
1. **Omogućiti csurf middleware:**
   ```javascript
   // Uncomment line 324
   app.use(csrfProtection);
   ```

2. **Endpoint za dobijanje CSRF tokena:**
   ```javascript
   app.get('/api/auth/csrf-token', (req, res) => {
     res.json({ csrfToken: req.csrfToken() });
   });
   ```

3. **Zaštititi kritične endpointe:**
   - POST /api/auth/login
   - POST /api/auth/logout
   - POST /api/auth/logout-all
   - DELETE /api/auth/sessions/:id

#### Frontend
1. **Fetch CSRF token on page load** (auth.js):
   ```javascript
   async fetchCsrfToken() {
     const response = await fetch('/api/auth/csrf-token');
     const data = await response.json();
     this.csrfToken = data.csrfToken;
   }
   ```

2. **Include token u request headers:**
   ```javascript
   headers: {
     'Content-Type': 'application/json',
     'CSRF-Token': this.csrfToken
   }
   ```

**Fajlovi za modifikaciju:**
- `server.js` - Uncomment csurf, dodati endpoint
- `auth.js` - Fetch i store CSRF token
- `my-sessions.js` - Include CSRF token u logout requests

**Test:**
- Login sa i bez CSRF tokena
- Logout sa i bez CSRF tokena
- Verify 403 error bez tokena

---

### Task 2: Security Headers - Helmet.js (15 minuta)

**Šta je Helmet.js?**
Middleware koji automatski postavlja sigurnosne HTTP headers.

**Headers koje dodaje:**
- `X-Content-Type-Options: nosniff` - Sprječava MIME sniffing
- `X-Frame-Options: DENY` - Sprječava clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS zaštita
- `Strict-Transport-Security` - Forsira HTTPS
- `Content-Security-Policy` - Kontroliše resurse

**Implementacija:**

#### Install Helmet
```bash
npm install helmet
```

#### Server.js
```javascript
const helmet = require('helmet');

// Add after imports
app.use(helmet({
  contentSecurityPolicy: false, // Konfigurisaćemo zasebno ako treba
  crossOriginEmbedderPolicy: false // Za development
}));
```

**Pozicija:** Dodati odmah nakon `const app = express();`

**Test:**
- Provjeriti response headers u browser DevTools
- Verify `X-Frame-Options`, `X-Content-Type-Options` prisutni

---

### Task 3: Per-User Rate Limiting (30 minuta)

**Trenutno stanje:**
- Globalni rate limit: 100 requests / 15 minuta
- Primjenjuje se na sve korisnike zajedno
- Rate limit po IP adresi

**Problem:**
- Jedan korisnik može iscrpiti limit za sve
- Nema zaštite od brute-force napada na specifičnog korisnika

**Implementacija:**

#### Kreirati rate-limit-config.js
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('./server/redis-client');

// Globalni rate limit (postojeći)
const globalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:global:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minuta
  max: 100,
  message: 'Previše zahtjeva. Pokušajte ponovo kasnije.'
});

// Per-user login rate limit
const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:login:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 pokušaja po korisniku
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.body.korisnickoIme || req.ip,
  message: 'Previše pokušaja prijave. Pokušajte ponovo za 15 minuta.'
});

// Per-user API rate limit
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: 1 * 60 * 1000, // 1 minuta
  max: 30, // 30 zahtjeva po minuti po korisniku
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.session?.userId || req.ip;
  },
  message: 'Previše API zahtjeva. Sačekajte malo.'
});

module.exports = {
  globalLimiter,
  loginLimiter,
  apiLimiter
};
```

#### Primjena u server.js
```javascript
const { globalLimiter, loginLimiter, apiLimiter } = require('./rate-limit-config');

// Globalni rate limit
app.use(globalLimiter);

// Login specifični rate limit
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // ... postojeći login kod
});

// API rate limit za autentifikovane endpointe
app.use('/api/', apiLimiter);
```

**Fajlovi:**
- `rate-limit-config.js` (novi) - Rate limit konfiguracije
- `server.js` - Primjena rate limitera

**Test:**
- Pokušati 6 neuspješnih login-a (5 + 1 = block)
- Verify error message: "Previše pokušaja prijave"
- Pokušati 31 API request za 1 minutu
- Verify rate limit response

---

### Task 4: Testing & Validation (15 minuta)

**Test scenariji:**

#### 1. CSRF Protection Test
```powershell
# Login bez CSRF tokena (should fail)
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"korisnickoIme":"admin","lozinka":"admin123"}'

# Expected: 403 Forbidden - CSRF token invalid
```

#### 2. Security Headers Test
```powershell
# Check response headers
curl -I http://localhost:3000

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

#### 3. Rate Limiting Test
```powershell
# Test login rate limit (6 pokušaja)
for ($i=1; $i -le 6; $i++) {
  curl -X POST http://localhost:3000/api/auth/login `
    -H "Content-Type: application/json" `
    -d '{"korisnickoIme":"admin","lozinka":"wrong"}'
}

# Expected: 5 pokušaja OK, 6-ti = 429 Too Many Requests
```

**Test Script:** `test-security-features.ps1`
- Testira CSRF protection
- Testira security headers
- Testira per-user rate limiting
- Testira API rate limiting

---

## 📁 Fajlovi za Kreiranje/Modifikaciju

### Novi Fajlovi:
1. `rate-limit-config.js` - Rate limiting konfiguracija
2. `ToDo/testovi/auth-tests/test-security-features.ps1` - Test script
3. `docs/phase-reports/PHASE_1_DAY_7_COMPLETE.md` - Completion report

### Modifikovani Fajlovi:
1. `server.js`:
   - Uncomment csurf middleware (line 324)
   - Dodati helmet middleware
   - Dodati CSRF token endpoint
   - Primjeniti per-user rate limiters
   - Import rate-limit-config

2. `auth.js`:
   - Dodati fetchCsrfToken() metodu
   - Include CSRF token u sve POST/DELETE requestove
   - Store token u AuthSystem class

3. `my-sessions.js`:
   - Include CSRF token u logout requests
   - Include CSRF token u logout-all requests

4. `package.json`:
   - Dodati `helmet` dependency (ako već nije)

---

## 🔒 Sigurnosne Provjere

### CSRF Protection
- ✅ Token se generiše za svaku sesiju
- ✅ Token se validira na kritičnim endpointima
- ✅ Invalid token = 403 Forbidden
- ✅ Frontend automatski uključuje token

### Security Headers
- ✅ X-Frame-Options: DENY (anti-clickjacking)
- ✅ X-Content-Type-Options: nosniff (anti-MIME-sniffing)
- ✅ X-XSS-Protection: 1; mode=block (XSS zaštita)

### Rate Limiting
- ✅ Globalni: 100 req / 15min
- ✅ Login: 5 pokušaja / 15min po korisniku
- ✅ API: 30 req / 1min po korisniku
- ✅ Redis storage za distribuirani rate limiting

---

## 📊 Success Criteria

- [ ] CSRF protection omogućen i testiran
- [ ] Security headers prisutni u svim responses
- [ ] Per-user rate limiting funkcioniše
- [ ] Login rate limit blokira nakon 5 pokušaja
- [ ] API rate limit blokira nakon 30 req/min
- [ ] Svi testovi prolaze
- [ ] Dokumentacija kompletna
- [ ] Git commit & push

---

## 🚫 Šta NEĆEMO raditi (za Phase 2)

Ove funkcionalnosti su korisne, ali **nisu kritične** za osnovnu sigurnost:

1. **IP Geolocation** 🌍
   - Prikazivanje lokacije sesija
   - Warning za nepoznate lokacije
   - **Razlog:** Nice-to-have, nije sigurnosno kritično

2. **Email Notifications** 📧
   - Email na novi login
   - Email na sumnjive aktivnosti
   - **Razlog:** Requires email server setup, additional complexity

3. **Suspicious Login Detection** 🕵️
   - AI/ML detection neobičnog ponašanja
   - **Razlog:** Complex feature, requires data collection & analysis

4. **Advanced Session Activity Logs** 📋
   - Detaljni audit trail svake akcije
   - **Razlog:** Storage overhead, može se dodati kasnije

5. **Content Security Policy (CSP)** 📜
   - Detaljno definisanje dozvolienih resursa
   - **Razlog:** Može biti tricky sa inline scripts, zahtijeva testiranje

---

## 📝 Implementation Steps

### Step 1: Setup (5 minuta)
1. Install Helmet: `npm install helmet`
2. Kreiraj `rate-limit-config.js`
3. Kreiraj test script skeleton

### Step 2: CSRF Protection (30 minuta)
1. Uncomment csurf middleware u `server.js`
2. Dodati `/api/auth/csrf-token` endpoint
3. Modificirati `auth.js` - fetch & store token
4. Modificirati `my-sessions.js` - include token
5. Test CSRF protection

### Step 3: Security Headers (15 minuta)
1. Import helmet u `server.js`
2. Configure helmet middleware
3. Test response headers
4. Document headers u completion report

### Step 4: Per-User Rate Limiting (30 minuta)
1. Kompletan `rate-limit-config.js`
2. Apply limiters u `server.js`
3. Test login rate limit (5 pokušaja)
4. Test API rate limit (30 req/min)

### Step 5: Testing & Documentation (15 minuta)
1. Kompletan test script
2. Run all tests
3. Create completion report
4. Git commit & push

---

## 🔧 Configuration Details

### Helmet.js Configuration
```javascript
app.use(helmet({
  contentSecurityPolicy: false, // Disabled za sada
  crossOriginEmbedderPolicy: false, // Development mode
  hsts: {
    maxAge: 31536000, // 1 godina
    includeSubDomains: true,
    preload: true
  }
}));
```

### Rate Limit Configuration
```javascript
{
  global: {
    windowMs: 15 * 60 * 1000,  // 15 minuta
    max: 100                    // 100 zahtjeva
  },
  login: {
    windowMs: 15 * 60 * 1000,  // 15 minuta
    max: 5,                     // 5 pokušaja
    skipSuccessfulRequests: true // Reset na uspješan login
  },
  api: {
    windowMs: 1 * 60 * 1000,   // 1 minuta
    max: 30                     // 30 zahtjeva
  }
}
```

### CSRF Configuration
```javascript
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});
```

---

## 📈 Metrics & Monitoring

Nakon implementacije, moći ćemo da pratimo:
- **CSRF Block Rate** - Koliko pokušaja je blokirano
- **Rate Limit Triggers** - Koliko puta je rate limit aktiviran
- **Failed Login Attempts** - Pokušaji neuspješnih prijava
- **Blocked IPs** - IP adrese koje su blokirane

---

## 🎯 Next Steps (After Completion)

Nakon što završimo Phase 1 Day 7, možemo:

1. **Testing Period** (1-2 dana) - Monitor sigurnost u realnom okruženju
2. **Documentation Update** - Update README sa sigurnosnim features
3. **Phase 2 Planning** - Advanced features (geolocation, email, etc.)

---

## 📚 References

- **CSRF Protection:** https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- **Helmet.js Docs:** https://helmetjs.github.io/
- **Rate Limiting Best Practices:** https://www.nginx.com/blog/rate-limiting-nginx/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

---

## ⏱️ Time Breakdown

| Task | Estimated Time |
|------|----------------|
| Setup | 5 min |
| CSRF Protection | 30 min |
| Security Headers | 15 min |
| Per-User Rate Limiting | 30 min |
| Testing & Documentation | 15 min |
| **TOTAL** | **~1.5 sata** |

---

## 🎉 Expected Outcome

Nakon Phase 1 Day 7:
- ✅ CSRF protection aktivan na svim kritičnim endpointima
- ✅ Security headers prisutni u svim HTTP responses
- ✅ Per-user rate limiting sprječava brute-force napade
- ✅ Production-ready sigurnosni setup
- ✅ Testiran i validiran sistem

**Result:** Stabilan, siguran ATLAS sistem spreman za deployment! 🚀

---

**Kreirao:** GitHub Copilot  
**Datum:** 6. Oktobar 2025
