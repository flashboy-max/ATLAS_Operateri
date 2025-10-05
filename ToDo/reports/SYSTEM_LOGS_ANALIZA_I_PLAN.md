# 📊 ATLAS System Logs - Analiza i Plan Poboljšanja

## 📍 Trenutno Stanje Sistema Logova

### Šta se trenutno čuva u logovima

Logovi se čuvaju na **http://localhost:3001/system-logs.html** i sadrže sljedeće podatke:

#### 1. Osnovni podaci svakog log unosa:
```json
{
  "timestamp": "2025-10-03T22:38:44.532Z",
  "type": "system",
  "message": "GET /api/auth/session - 304",
  "userId": 1,
  "metadata": {
    "method": "GET",
    "path": "/api/auth/session",
    "statusCode": 304,
    "duration": "2ms",
    "ip": "::1",
    "userAgent": "Mozilla/5.0 ..."
  },
  "ip": "::1",
  "userAgent": "Mozilla/5.0 ..."
}
```

#### 2. Tipovi aktivnosti koji se loguju:
- ✅ `LOGIN` - Prijava korisnika
- ✅ `LOGOUT` - Odjava korisnika
- ✅ `CREATE_USER` - Kreiranje novog korisnika
- ✅ `UPDATE_USER` - Ažuriranje korisnika
- ✅ `DELETE_USER` - Brisanje korisnika
- ✅ `UPDATE_PROFILE` - Ažuriranje profila
- ✅ `CHANGE_PASSWORD` - Promjena lozinke
- ✅ `CREATE_OPERATOR` - Kreiranje operatera
- ✅ `UPDATE_OPERATOR` - Ažuriranje operatera
- ✅ `DELETE_OPERATOR` - Brisanje operatera
- ✅ `ERROR` - Greške u sistemu
- ✅ `SECURITY` - Sigurnosni eventi
- ✅ `SYSTEM` - Sistemske aktivnosti

### Gdje se čuvaju logovi

**Lokacija:** `data/logs/`

**Format:** Dnevni JSON fajlovi
- `2025-10-03.json`
- `2025-10-04.json`
- itd.

**Struktura direktorija:**
```
ATLAS html/
└── data/
    └── logs/
        ├── 2025-10-03.json
        ├── 2025-10-04.json
        └── ...
```

---

## ❌ ŠTA NEDOSTAJE - Detalji koji se NE čuvaju trenutno

### 1. Login/Logout Detalji

**Šta nedostaje:**
```javascript
// NEDOSTAJE:
{
  "type": "LOGIN",
  "userId": 1,
  "sessionId": "sess_abc123",
  "loginDuration": null,  // Trajanje sesije
  "previousLogin": "2025-10-02T10:30:00Z",  // Prethodni login
  "failedAttemptsBefore": 0,  // Broj neuspjelih pokušaja prije uspješnog logina
  "deviceInfo": {
    "browser": "Chrome 140",
    "os": "Windows 10",
    "device": "Desktop"
  },
  "location": {
    "country": "BiH",
    "city": "Sarajevo",
    "timezone": "Europe/Sarajevo"
  }
}
```

### 2. Update Profile Detalji

**Šta nedostaje:**
```javascript
// NEDOSTAJE:
{
  "type": "UPDATE_PROFILE",
  "userId": 1,
  "changes": {
    "ime": {
      "old": "Admir",
      "new": "Admir"
    },
    "prezime": {
      "old": "Admirović",
      "new": "Admirović"
    },
    "email": {
      "old": "admin@atlas.ba",
      "new": "admir@atlas.ba"
    }
  },
  "changedFields": ["email"],  // Koja polja su promijenjena
  "changedBy": 1,  // Ko je izvršio izmjenu
  "reason": null  // Opcionalni razlog izmjene
}
```

### 3. Update User (Admin) Detalji

**Šta nedostaje:**
```javascript
// NEDOSTAJE:
{
  "type": "UPDATE_USER",
  "userId": 5,  // Korisnik koji je izmijenjen
  "performedBy": 1,  // Admin koji je izvršio izmjenu
  "changes": {
    "role": {
      "old": "KORISNIK",
      "new": "ADMIN"
    },
    "agencija": {
      "old": "BH Telecom",
      "new": "Mtel"
    },
    "status": {
      "old": "active",
      "new": "suspended"
    }
  },
  "reason": "Promjena agencije na zahtjev korisnika"
}
```

### 4. Operator CRUD Detalji

**Šta nedostaje:**
```javascript
// NEDOSTAJE:
{
  "type": "UPDATE_OPERATOR",
  "operatorId": 12,
  "operatorName": "BH Telecom",
  "performedBy": 1,
  "changes": {
    "services": {
      "old": ["Fiksna telefonija", "Internet"],
      "new": ["Fiksna telefonija", "Internet", "IPTV"]
    },
    "kontakt_email": {
      "old": "info@bhtelecom.ba",
      "new": "info@bhtel.ba"
    }
  },
  "changedFields": ["services", "kontakt_email"]
}
```

### 5. Session Management

**Šta nedostaje:**
```javascript
// NEDOSTAJE:
{
  "type": "LOGOUT",
  "userId": 1,
  "sessionId": "sess_abc123",
  "sessionDuration": "02:35:12",  // Trajanje sesije
  "pagesVisited": 15,  // Broj posjećenih stranica
  "actionsPerformed": 8,  // Broj izvršenih akcija
  "lastActivity": "2025-10-03T15:35:00Z"
}
```

### 6. Security Events

**Šta nedostaje:**
```javascript
// NEDOSTAJE - Više detalja:
{
  "type": "SECURITY",
  "event": "FAILED_LOGIN_ATTEMPT",
  "username": "admin",
  "attemptNumber": 3,
  "remainingAttempts": 2,
  "lockoutTime": null,  // Vrijeme do lock-out-a
  "suspiciousActivity": true,
  "reason": "Wrong password"
}
```

---

## 🎯 PREDLOŽENI PLAN - Hibridni Pristup sa Rotacijom

### Strategija Čuvanja Logova

#### 📅 **Nivo 1: Aktivni Logovi (0-30 dana)**
```
data/logs/active/
├── 2025-10-03.json
├── 2025-10-04.json
├── ...
└── 2025-11-03.json
```
- **Format:** Dnevni JSON fajlovi
- **Pristup:** Instant - direktno čitanje
- **UI prikaz:** Zadnjih 30 dana vidljivo u system-logs.html
- **Veličina:** ~1-5MB po danu (zavisi od aktivnosti)

#### 📦 **Nivo 2: Mjesečni Arhivi (31-365 dana)**
```
data/logs/archive/monthly/
├── 2025-09.json
├── 2025-08.json
└── ...
```
- **Format:** Konsolidovani mjesečni JSON fajlovi
- **Pristup:** Spor - potrebno parsiranje većeg fajla
- **UI prikaz:** Dostupno preko "Arhiva" sekcije
- **Veličina:** ~30-150MB po mjesecu
- **Automatska rotacija:** Svake noći u 00:01h, logovi stariji od 30 dana se konsoliduju

#### 🗜️ **Nivo 3: Godišnji Arhivi (365+ dana)**
```
data/logs/archive/yearly/
├── 2024.zip
├── 2023.zip
└── ...
```
- **Format:** GZIP kompresovani fajlovi
- **Pristup:** Veoma spor - potrebno raspakivanje
- **UI prikaz:** Download opcija za analizu
- **Veličina:** ~100-500MB po godini (kompresovano 10-20x)
- **Automatska rotacija:** Jednom godišnje, 1. januara u 00:01h

### Prednosti Hibridnog Pristupa

✅ **Brz pristup** najsvježijim logovima (zadnjih 30 dana)
✅ **Efikasna upotreba prostora** - stari logovi kompresovani
✅ **Regulatorni compliance** - logovi čuvani godinama za audit
✅ **Skalabilnost** - sistem raste kontrolisano
✅ **Performance** - UI ne učitava cijelu godinu odjednom

---

## 📊 Procjena Veličine Logova

### Prosječni Scenario (50 korisnika)

| Period | Aktivnost | Veličina | Kumulativno |
|--------|-----------|----------|-------------|
| **1 dan** | ~500 logova | 1-2 MB | 2 MB |
| **30 dana** | ~15,000 logova | 30-60 MB | 60 MB |
| **1 mjesec arhiva** | ~15,000 logova | 50 MB | 50 MB |
| **12 mjeseci arhiva** | ~180,000 logova | 600 MB | 600 MB |
| **1 godina ZIP** | ~180,000 logova | 60-100 MB | 100 MB |

**Ukupno nakon 2 godine:**
- Aktivni logovi (30 dana): ~60 MB
- Mjesečni arhivi (12 mjeseci): ~600 MB
- Godišnji arhivi (1 godina): ~100 MB
- **TOTAL: ~760 MB** (kontrolisano)

---

## 🛠️ Implementacija - Faze

### **Faza 1: Poboljšanje Postojećeg Sistema**

#### 1.1 Dodati detaljne change tracking
```javascript
// server.js - Enhanced logging
Logger.logWithChanges(type, message, userId, {
  changes: {
    field: { old: oldValue, new: newValue }
  },
  changedFields: ['field1', 'field2'],
  performedBy: adminUserId,
  reason: 'Opcionalni razlog'
});
```

#### 1.2 Session tracking
```javascript
// auth.js - Track sessions
sessionManager.create(userId, {
  loginTime: new Date(),
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  deviceInfo: parseUserAgent(req)
});

sessionManager.end(sessionId, {
  logoutTime: new Date(),
  duration: calculateDuration(),
  pagesVisited: session.pageCount,
  actionsPerformed: session.actionCount
});
```

#### 1.3 Login/Logout detaljni tracking
```javascript
// Trenutni login log
Logger.log('LOGIN', `User logged in: ${username}`, userId, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  // DODATI:
  sessionId: newSession.id,
  previousLogin: user.poslednje_logovanje,
  failedAttemptsBefore: user.failed_login_attempts,
  deviceInfo: {
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    device: deviceInfo.device
  },
  loginMethod: 'password' // ili 'remember-me', '2fa', itd.
});
```

---

### **Faza 2: Implementacija Rotacionog Sistema**

#### 2.1 Kreirati direktorijsku strukturu
```javascript
// log-manager.js
const logDirs = {
  active: path.join(logsDir, 'active'),
  monthlyArchive: path.join(logsDir, 'archive', 'monthly'),
  yearlyArchive: path.join(logsDir, 'archive', 'yearly')
};

// Kreirati direktorije ako ne postoje
Object.values(logDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
```

#### 2.2 Implementirati Rotation Job
```javascript
// log-rotation.js
import cron from 'node-cron';
import archiver from 'archiver';

class LogRotation {
  // Rotacija dnevnih logova u mjesečne (svaku noć)
  static async rotateDailyToMonthly() {
    // Pokreni svake noći u 00:01
    cron.schedule('1 0 * * *', async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Nađi sve logove starije od 30 dana
      const oldLogs = findLogsOlderThan(thirtyDaysAgo);
      
      // Grupiši po mjesecima
      const monthlyGroups = groupByMonth(oldLogs);
      
      // Konsoliduj svaki mjesec
      for (const [month, logs] of Object.entries(monthlyGroups)) {
        await consolidateToMonthly(month, logs);
      }
      
      console.log('✅ Daily to monthly rotation complete');
    });
  }
  
  // Rotacija mjesečnih logova u godišnje (1. januara)
  static async rotateMonthlyToYearly() {
    // Pokreni 1. januara u 00:01
    cron.schedule('1 0 1 1 *', async () => {
      const lastYear = new Date().getFullYear() - 1;
      
      // Nađi sve mjesečne arhive iz prošle godine
      const monthlyLogs = findMonthlyLogsForYear(lastYear);
      
      // Kompresuj u ZIP
      await compressToYearly(lastYear, monthlyLogs);
      
      console.log(`✅ Monthly to yearly rotation complete for ${lastYear}`);
    });
  }
}
```

#### 2.3 Kompresija funkcija
```javascript
// compression-utils.js
import zlib from 'zlib';

class CompressionUtils {
  static async compressToGzip(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const gzip = zlib.createGzip();
      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);
      
      input.pipe(gzip).pipe(output);
      output.on('finish', resolve);
      output.on('error', reject);
    });
  }
  
  static async decompressGzip(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const gunzip = zlib.createGunzip();
      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);
      
      input.pipe(gunzip).pipe(output);
      output.on('finish', resolve);
      output.on('error', reject);
    });
  }
}
```

---

### **Faza 3: UI Poboljšanja**

#### 3.1 Dodati filtre za arhive
```html
<!-- system-logs.html -->
<div class="archive-section">
  <h3>📦 Arhivirani Logovi</h3>
  
  <div class="archive-filters">
    <select id="archiveType">
      <option value="active">Aktivni (zadnjih 30 dana)</option>
      <option value="monthly">Mjesečni arhivi</option>
      <option value="yearly">Godišnji arhivi</option>
    </select>
    
    <select id="archivePeriod">
      <!-- Dinamički popunjeno -->
    </select>
    
    <button onclick="loadArchive()">Učitaj Arhiv</button>
    <button onclick="downloadArchive()">Download</button>
  </div>
</div>
```

#### 3.2 Change History View
```html
<!-- Za prikaz izmjena -->
<div class="change-details">
  <h4>Detalji izmjene</h4>
  <table>
    <thead>
      <tr>
        <th>Polje</th>
        <th>Stara Vrijednost</th>
        <th>Nova Vrijednost</th>
      </tr>
    </thead>
    <tbody id="changeHistory">
      <!-- Dinamički popunjeno -->
    </tbody>
  </table>
</div>
```

---

## 📋 Checklist za Implementaciju

### Prioritet 1 - Odmah (Kritično)
- [ ] Dodati session tracking sa trajanjem
- [ ] Implementirati detailed change tracking za UPDATE operacije
- [ ] Dodati old/new value comparison
- [ ] Logovanje failed login attempts sa detaljima

### Prioritet 2 - Uskoro (Važno)
- [ ] Kreirati direktorijsku strukturu za rotaciju
- [ ] Implementirati auto-rotation job (daily → monthly)
- [ ] Dodati UI za pregled starih arhiva
- [ ] Device/Browser fingerprinting

### Prioritet 3 - Kasnije (Nice to Have)
- [ ] Implementirati yearly rotation
- [ ] GeoIP lokacija tracking
- [ ] Export funkcionalnost za analizu
- [ ] Dashboard sa statistikama logova
- [ ] Email notifikacije za sumnjive aktivnosti

---

## 🔒 Sigurnosne Preporuke

1. **Enkripcija osjetljivih podataka u logovima**
   - Email adrese hashirati u logovima
   - Password promjene ne logirati vrijednosti, samo event

2. **Access Control**
   - SUPERADMIN: Puni pristup svim logovima
   - ADMIN: Pristup samo logovima svoje agencije
   - KORISNIK: Pristup samo svojim aktivnostima

3. **Retention Policy**
   - Aktivni logovi: 30 dana
   - Mjesečni arhivi: 12 mjeseci
   - Godišnji arhivi: 5 godina (zakonska obaveza)
   - Nakon 5 godina: Brisanje ili move to cold storage

4. **Backup**
   - Dnevni backup logova na eksterni storage
   - Yearly arhive upload na cloud (S3, Azure Blob)

---

## 💡 Zaključak

**Hibridni pristup sa rotacijom je OPTIMALAN jer:**

✅ Balansira performanse i storage
✅ Omogućava brz pristup svježim podacima
✅ Zadovoljava compliance zahtjeve
✅ Automatizovan - "set it and forget it"
✅ Skalabilan - može rasti sa sistemom

**Preporučeni Timeline:**
- **Nedelja 1:** Poboljšan logging sa change tracking
- **Nedelja 2:** Kreirana rotaciona struktura
- **Nedelja 3:** Implementirana auto-rotacija
- **Nedelja 4:** UI za arhive i testiranje

**Storage Projekcija za 3 godine:**
- Godina 1: ~760 MB
- Godina 2: ~860 MB (1 yearly archive + current)
- Godina 3: ~960 MB (2 yearly archives + current)

**Održavanje:** ~1 GB godišnje je prihvatljivo za enterprise sistem! 🎯
