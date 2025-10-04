# 📝 Enhanced Logger - Primjeri Upotrebe

## Inicijalizacija

```javascript
import { EnhancedLogger, SessionManager, DeviceParser } from './enhanced-logger.js';

// Inicijalizuj logger sa direktorijom
EnhancedLogger.initialize(path.join(__dirname, 'data', 'logs'));
```

---

## 1. Login Event sa Detaljima

### Trenutno (Staro):
```javascript
Logger.log('LOGIN', `User logged in: ${username}`, user.id, {
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Poboljšano (Novo):
```javascript
// Parse device info
const deviceInfo = DeviceParser.parse(req.headers['user-agent']);

// Kreiraj session
const sessionId = SessionManager.create(user.id, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  deviceInfo
});

// Logiraj login sa detaljima
EnhancedLogger.logLogin(user.id, username, sessionId, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  previousLogin: user.poslednje_logovanje,
  failedAttemptsBefore: user.failed_login_attempts || 0,
  deviceInfo,
  loginMethod: req.body.rememberMe ? 'remember-me' : 'password'
});

// Reset failed attempts
user.failed_login_attempts = 0;
user.poslednje_logovanje = new Date().toISOString();
```

**Rezultat u logu:**
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
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  },
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

---

## 2. Logout Event sa Session Statistikama

### Trenutno (Staro):
```javascript
Logger.log('LOGOUT', `User logged out: ${username}`, user.id, {
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Poboljšano (Novo):
```javascript
// Uzmi session podatke
const sessionData = SessionManager.end(sessionId);

// Logiraj logout sa statistikama
EnhancedLogger.logLogout(user.id, username, sessionId, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  ...sessionData
});
```

**Rezultat u logu:**
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
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

---

## 3. Update Profile sa Change Tracking-om

### Trenutno (Staro):
```javascript
Logger.log('UPDATE_PROFILE', `Profile updated by ${username}`, user.id, {
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Poboljšano (Novo):
```javascript
// Načitaj stare podatke
const oldUser = users.find(u => u.id === userId);

// Primeni izmjene
const updatedUser = {
  ...oldUser,
  ime: req.body.ime,
  prezime: req.body.prezime,
  email: req.body.email
};

// Track šta je promijenjeno
const changes = {};
if (oldUser.ime !== updatedUser.ime) {
  changes.ime = { old: oldUser.ime, new: updatedUser.ime };
}
if (oldUser.prezime !== updatedUser.prezime) {
  changes.prezime = { old: oldUser.prezime, new: updatedUser.prezime };
}
if (oldUser.email !== updatedUser.email) {
  changes.email = { old: oldUser.email, new: updatedUser.email };
}

// Logiraj sa change tracking-om
EnhancedLogger.logProfileUpdate(userId, username, changes, {
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

// Increment session action
SessionManager.incrementAction(sessionId);
```

**Rezultat u logu:**
```json
{
  "timestamp": "2025-10-04T11:30:00.000Z",
  "type": "update_profile",
  "message": "Profile updated by admin: email",
  "userId": 1,
  "targetUserId": null,
  "targetUserName": null,
  "changes": {
    "email": {
      "old": "admin@atlas.ba",
      "new": "admir@atlas.ba"
    }
  },
  "changedFields": ["email"],
  "reason": null,
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

---

## 4. Update User (Admin) sa Change Tracking-om

### Trenutno (Staro):
```javascript
Logger.log('UPDATE_USER', `User ${targetUsername} updated`, adminId, {
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Poboljšano (Novo):
```javascript
// Načitaj stare podatke
const oldUser = users.find(u => u.id === targetUserId);

// Primeni izmjene
const updatedUser = {
  ...oldUser,
  role: req.body.role,
  agencija: req.body.agencija,
  status: req.body.status
};

// Track šta je promijenjeno
const changes = {};
if (oldUser.role !== updatedUser.role) {
  changes.role = { old: oldUser.role, new: updatedUser.role };
}
if (oldUser.agencija !== updatedUser.agencija) {
  changes.agencija = { old: oldUser.agencija, new: updatedUser.agencija };
}
if (oldUser.status !== updatedUser.status) {
  changes.status = { old: oldUser.status, new: updatedUser.status };
}

// Logiraj sa change tracking-om
EnhancedLogger.logUserUpdate(
  targetUserId,
  targetUsername,
  adminId,
  adminUsername,
  changes,
  req.body.reason || null,  // Opcionalni razlog
  {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }
);

// Increment session action
SessionManager.incrementAction(adminSessionId);
```

**Rezultat u logu:**
```json
{
  "timestamp": "2025-10-04T14:20:00.000Z",
  "type": "update_user",
  "message": "User marko.markovic updated by admin: role, agencija",
  "userId": 1,
  "targetUserId": 5,
  "targetUserName": "marko.markovic",
  "changes": {
    "role": {
      "old": "KORISNIK",
      "new": "ADMIN"
    },
    "agencija": {
      "old": "BH Telecom",
      "new": "Mtel"
    }
  },
  "changedFields": ["role", "agencija"],
  "reason": "Promjena agencije na zahtjev korisnika",
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

---

## 5. Security Events

### Failed Login Attempt
```javascript
EnhancedLogger.logSecurityEvent('FAILED_LOGIN_ATTEMPT', {
  username: req.body.username,
  userId: null,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  attemptNumber: user.failed_login_attempts + 1,
  remainingAttempts: 5 - (user.failed_login_attempts + 1),
  suspiciousActivity: user.failed_login_attempts >= 3,
  reason: 'Wrong password'
});

// Increment failed attempts
user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;
```

**Rezultat u logu:**
```json
{
  "timestamp": "2025-10-04T09:15:00.000Z",
  "type": "security",
  "securityEvent": "FAILED_LOGIN_ATTEMPT",
  "message": "Security event: FAILED_LOGIN_ATTEMPT",
  "userId": null,
  "username": "admin",
  "securityDetails": {
    "attemptNumber": 3,
    "remainingAttempts": 2,
    "suspiciousActivity": true,
    "reason": "Wrong password"
  },
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Account Lockout
```javascript
EnhancedLogger.logSecurityEvent('ACCOUNT_LOCKED', {
  username: user.username,
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  attemptNumber: 5,
  remainingAttempts: 0,
  suspiciousActivity: true,
  reason: 'Too many failed login attempts'
});
```

---

## 6. Update Operator sa Change Tracking-om

```javascript
// Načitaj stare podatke
const oldOperator = operators.find(o => o.id === operatorId);

// Primeni izmjene
const updatedOperator = {
  ...oldOperator,
  ...req.body
};

// Track šta je promijenjeno
const changes = {};
['naziv', 'services', 'kontakt_email', 'kontakt_telefon'].forEach(field => {
  if (JSON.stringify(oldOperator[field]) !== JSON.stringify(updatedOperator[field])) {
    changes[field] = {
      old: oldOperator[field],
      new: updatedOperator[field]
    };
  }
});

// Logiraj sa change tracking-om
EnhancedLogger.logOperatorUpdate(
  operatorId,
  oldOperator.naziv,
  userId,
  username,
  changes,
  {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  }
);
```

**Rezultat u logu:**
```json
{
  "timestamp": "2025-10-04T16:45:00.000Z",
  "type": "update_operator",
  "message": "Operator BH Telecom updated by admin: services, kontakt_email",
  "userId": 1,
  "targetUserId": 12,
  "targetUserName": "BH Telecom",
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
  "changedFields": ["services", "kontakt_email"],
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

---

## 7. Session Tracking tokom Navigacije

### Track Page Visit
```javascript
// Middleware za tracking stranica
app.use((req, res, next) => {
  const sessionId = req.session?.sessionId;
  if (sessionId && req.method === 'GET' && req.path.endsWith('.html')) {
    SessionManager.incrementPageVisit(sessionId);
  }
  next();
});
```

### Track Action
```javascript
// U API endpoint-ima
app.post('/api/operators', authMiddleware, (req, res) => {
  // ... kreiranje operatera ...
  
  // Increment action count
  SessionManager.incrementAction(req.session.sessionId);
  
  res.json(newOperator);
});
```

---

## 8. Query Logs (Reporting)

### Get Change History za Korisnika
```javascript
// API endpoint za change history
app.get('/api/users/:id/change-history', authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.id);
  const limit = parseInt(req.query.limit) || 50;
  
  const changeHistory = await EnhancedLogger.getUserChangeHistory(userId, limit);
  
  res.json(changeHistory);
});
```

### Get Login History za Korisnika
```javascript
// API endpoint za login history
app.get('/api/users/:id/login-history', authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.id);
  const limit = parseInt(req.query.limit) || 20;
  
  const loginHistory = await EnhancedLogger.getUserLoginHistory(userId, limit);
  
  res.json(loginHistory);
});
```

---

## 9. UI Display (Frontend)

### Prikaz Change History
```javascript
// system-logs.js
async function displayChangeHistory(logEntry) {
  if (!logEntry.changes) return '';
  
  let html = '<div class="change-details">';
  html += '<h4>Detalji izmjene:</h4>';
  html += '<table class="change-table">';
  html += '<thead><tr><th>Polje</th><th>Stara Vrijednost</th><th>Nova Vrijednost</th></tr></thead>';
  html += '<tbody>';
  
  for (const [field, change] of Object.entries(logEntry.changes)) {
    html += `
      <tr>
        <td><strong>${field}</strong></td>
        <td class="old-value">${JSON.stringify(change.old)}</td>
        <td class="new-value">${JSON.stringify(change.new)}</td>
      </tr>
    `;
  }
  
  html += '</tbody></table></div>';
  return html;
}
```

### Prikaz Session Stats
```javascript
function displaySessionStats(logEntry) {
  if (!logEntry.sessionStats) return '';
  
  const { duration, pagesVisited, actionsPerformed } = logEntry.sessionStats;
  
  return `
    <div class="session-stats">
      <span class="stat">⏱️ ${duration}</span>
      <span class="stat">📄 ${pagesVisited} stranica</span>
      <span class="stat">⚡ ${actionsPerformed} akcija</span>
    </div>
  `;
}
```

---

## 10. Testing

```javascript
// Test file: test-enhanced-logger.js
import { EnhancedLogger, SessionManager, DeviceParser } from './enhanced-logger.js';

// Inicijalizuj
EnhancedLogger.initialize('./test-logs');

// Test login
const sessionId = SessionManager.create(1, {
  ip: '127.0.0.1',
  userAgent: 'Mozilla/5.0...',
  deviceInfo: { browser: 'Chrome', os: 'Windows 10', device: 'Desktop' }
});

EnhancedLogger.logLogin(1, 'testuser', sessionId, {
  ip: '127.0.0.1',
  userAgent: 'Mozilla/5.0...',
  previousLogin: new Date(Date.now() - 86400000).toISOString(),
  failedAttemptsBefore: 0,
  deviceInfo: { browser: 'Chrome', os: 'Windows 10', device: 'Desktop' },
  loginMethod: 'password'
});

// Test profile update
EnhancedLogger.logProfileUpdate(1, 'testuser', {
  email: { old: 'old@test.com', new: 'new@test.com' }
}, {
  ip: '127.0.0.1',
  userAgent: 'Mozilla/5.0...'
});

// Test logout
setTimeout(() => {
  SessionManager.incrementPageVisit(sessionId);
  SessionManager.incrementAction(sessionId);
  
  const sessionData = SessionManager.end(sessionId);
  
  EnhancedLogger.logLogout(1, 'testuser', sessionId, {
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0...',
    ...sessionData
  });
}, 5000);
```

---

## Zaključak

Enhanced Logger omogućava:
- ✅ Detaljan audit trail sa old/new vrijednostima
- ✅ Session tracking sa statistikama
- ✅ Security event monitoring
- ✅ Device/Browser fingerprinting
- ✅ Kompletna istorija izmjena za svakog korisnika
- ✅ Role-based log filtering

Ovo je **Faza 1** implementacije iz `SYSTEM_LOGS_ANALIZA_I_PLAN.md`. 🎯
