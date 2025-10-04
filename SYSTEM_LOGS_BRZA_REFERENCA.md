# 🗂️ ATLAS System Logs - Brza Referenca

## 📊 Trenutno Stanje (http://localhost:3001/system-logs.html)

### ✅ Šta SE čuva:
- Timestamp (datum i vrijeme)
- Tip aktivnosti (login, logout, create_user, itd.)
- Poruka
- User ID
- IP adresa
- User Agent
- Osnovni metadata

### ❌ Šta NE čuva (ali TREBA):
- Old/New vrijednosti kod izmjena
- Session duration
- Failed login attempts before success
- Device/Browser info (parsed)
- Broj stranica posjećenih u sesiji
- Broj akcija izvršenih u sesiji
- Detalji o tome ŠTA je tačno promijenjeno

---

## 📁 Storage Lokacije

```
ATLAS html/
└── data/
    └── logs/
        ├── active/              (NOVO - Faza 2)
        │   ├── 2025-10-03.json
        │   ├── 2025-10-04.json
        │   └── ... (zadnjih 30 dana)
        │
        ├── archive/             (NOVO - Faza 2)
        │   ├── monthly/
        │   │   ├── 2025-09.json
        │   │   ├── 2025-08.json
        │   │   └── ...
        │   │
        │   └── yearly/
        │       ├── 2024.zip
        │       ├── 2023.zip
        │       └── ...
        │
        └── 2025-10-03.json      (TRENUTNO)
```

---

## 🔄 Lifecycle Logova (Plan)

```
┌─────────────────────────────────────────────────────────────┐
│                  LOG ENTRY KREIRAN                          │
│                  data/logs/active/2025-10-04.json           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                     [ČEKA 30 DANA]
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            AUTO-ROTATION (svaku noć u 00:01)                │
│       Dnevni logovi stariji od 30 dana → Mjesečni arhiv    │
│                  data/logs/archive/monthly/                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                    [ČEKA 12 MJESECI]
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│       AUTO-ROTATION (1. januara svake godine u 00:01)       │
│   Mjesečni logovi stariji od 12 mj → Godišnji ZIP arhiv    │
│                  data/logs/archive/yearly/                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                     [ČUVA SE 5 GODINA]
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              BRISANJE ili COLD STORAGE                      │
│                  (nakon 5 godina)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Storage Projekcija

| Tip | Period | Est. Veličina | Pristup |
|-----|--------|---------------|---------|
| **Aktivni** | 0-30 dana | 30-60 MB | Instant |
| **Mjesečni** | 31-365 dana | 50 MB/mj × 12 = 600 MB | Spor |
| **Godišnji** | 365+ dana | 60-100 MB/god (ZIP) | Veoma spor |
| **TOTAL (3 god)** | - | ~960 MB | - |

---

## 🎯 Prioriteti Implementacije

### ✅ PRIORITET 1 - Odmah (Ova sedmica)
- [x] Kreiran `enhanced-logger.js`
- [ ] Integrisati Enhanced Logger u `server.js`
- [ ] Dodati session tracking
- [ ] Implementirati change tracking za UPDATE operacije
- [ ] Testirati sa svim endpoint-ima

### 🔧 PRIORITET 2 - Uskoro (Narednih 2 sedmice)
- [ ] Kreirati direktorijsku strukturu (active/archive)
- [ ] Implementirati auto-rotation job (daily → monthly)
- [ ] Dodati UI za pregled arhiva
- [ ] Device fingerprinting

### 📦 PRIORITET 3 - Kasnije (Narednih mjesec)
- [ ] Implementirati yearly rotation (monthly → yearly ZIP)
- [ ] GeoIP lokacija tracking
- [ ] Export funkcionalnost
- [ ] Dashboard sa statistikama

---

## 🔍 Primjeri Log Entry-ja

### LOGIN (Enhanced)
```json
{
  "timestamp": "2025-10-04T10:30:00.000Z",
  "type": "login",
  "message": "User logged in successfully: admin",
  "userId": 1,
  "username": "admin",
  "sessionId": "sess_1728042600000_abc123",
  "loginDetails": {
    "previousLogin": "2025-10-03T15:20:00.000Z",
    "failedAttemptsBefore": 0,
    "loginMethod": "password",
    "deviceInfo": {
      "browser": "Chrome",
      "os": "Windows 10",
      "device": "Desktop"
    }
  },
  "metadata": { "ip": "192.168.1.100", "userAgent": "..." },
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

### UPDATE_PROFILE (Enhanced)
```json
{
  "timestamp": "2025-10-04T11:30:00.000Z",
  "type": "update_profile",
  "message": "Profile updated by admin: email",
  "userId": 1,
  "changes": {
    "email": {
      "old": "admin@atlas.ba",
      "new": "admir@atlas.ba"
    }
  },
  "changedFields": ["email"],
  "metadata": { "ip": "192.168.1.100", "userAgent": "..." }
}
```

### LOGOUT (Enhanced)
```json
{
  "timestamp": "2025-10-04T12:45:00.000Z",
  "type": "logout",
  "message": "User logged out: admin",
  "userId": 1,
  "username": "admin",
  "sessionId": "sess_1728042600000_abc123",
  "sessionStats": {
    "duration": "02:15:00",
    "pagesVisited": 15,
    "actionsPerformed": 8,
    "lastActivity": "2025-10-04T12:44:30.000Z"
  },
  "metadata": { "ip": "192.168.1.100", "userAgent": "..." }
}
```

---

## 🔐 Role-Based Log Access

| Role | Access |
|------|--------|
| **SUPERADMIN** | Svi logovi bez ograničenja |
| **ADMIN** | Logovi svoje agencije (bez SUPERADMIN aktivnosti) |
| **KORISNIK** | Samo vlastite aktivnosti |

---

## 📝 Fajlovi za Pregled

1. **SYSTEM_LOGS_ANALIZA_I_PLAN.md** - Kompletna analiza i strategija
2. **enhanced-logger.js** - Nova Logger implementacija
3. **ENHANCED_LOGGER_PRIMJERI.md** - Konkretni primjeri upotrebe
4. **SYSTEM_LOGS_BRZA_REFERENCA.md** - Ovaj fajl

---

## 🚀 Quick Start

```javascript
// 1. Import
import { EnhancedLogger, SessionManager, DeviceParser } from './enhanced-logger.js';

// 2. Initialize
EnhancedLogger.initialize(path.join(__dirname, 'data', 'logs'));

// 3. Use it
EnhancedLogger.logLogin(userId, username, sessionId, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  previousLogin: user.poslednje_logovanje,
  failedAttemptsBefore: 0,
  deviceInfo: DeviceParser.parse(req.headers['user-agent']),
  loginMethod: 'password'
});
```

---

## ❓ FAQ

**Q: Zašto hibridni pristup?**
A: Balansira performanse (brzi logovi) sa storage efficiency (kompresija starih logova).

**Q: Koliko prostora zauzima?**
A: ~1 GB godišnje za 50 aktivnih korisnika (prihvatljivo).

**Q: Šta ako trebam log od prije godinu dana?**
A: Dostupan u mjesečnom arhivu, učitavanje sporije ali moguće.

**Q: Šta ako trebam log od prije 3 godine?**
A: Download ZIP arhiva, raspakuj lokalno, analiziraj.

**Q: Automatsko brisanje?**
A: Nakon 5 godina (zakonska obaveza), ali može se konfigurirati.

---

## 📞 Kontakt

Za pitanja oko implementacije: admin@atlas.ba

---

**Verzija:** 1.0  
**Datum:** 4. Oktobar 2025  
**Status:** 📝 Plan - Implementacija u toku
