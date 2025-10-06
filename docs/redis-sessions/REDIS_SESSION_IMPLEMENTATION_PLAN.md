# Redis Session Management - Implementation Plan & Specification

**Date:** October 6, 2025  
**Phase:** Phase 1 Day 4  
**Status:** Ready for Implementation

---

## 🎯 Objectives

Replace in-memory JWT sessions with Redis-backed persistent sessions featuring:
- ✅ Persistent sessions (survive server restart)
- ✅ Multi-device support (multiple concurrent sessions per user)
- ✅ Session activity tracking (lastActivity timestamp)
- ✅ Refresh token rotation (enhanced security)
- ✅ Centralized session management (logout from all devices)
- ✅ Session metadata (IP, User-Agent, Device name)

---

## 📊 Current State Analysis

### Current Authentication Flow (JWT Only)

```
Login → bcrypt.compareSync(password) → jwt.sign({id, role, agencija}, JWT_SECRET, {expiresIn: '24h'})
                                    ↓
                                  Return: { token, user }
                                    ↓
Frontend stores: localStorage.setItem('token', token)
                                    ↓
All requests: headers['authorization'] = 'Bearer ' + token
                                    ↓
authenticateToken: jwt.verify(token, JWT_SECRET) → req.authUser = decoded
```

**Problems:**
- ❌ Sessions lost on server restart
- ❌ No way to invalidate tokens (logout is client-side only)
- ❌ Can't logout from all devices
- ❌ No session activity tracking
- ❌ 24h token lifetime (too long for security, too short for UX)

---

## 🔄 New Authentication Flow (Redis Sessions)

### 1. Login Flow

```
POST /api/auth/login
    ↓
bcrypt.compareSync(password) ✅
    ↓
sessionManager.createSession(userId, userData, deviceInfo)
    ↓
Redis: HSET session:{uuid} userId username role ip userAgent deviceName createdAt lastActivity
       SADD user:{userId}:sessions {sessionId}
       SET refresh:{randomToken} {sessionId} EX 604800 (7 days)
    ↓
Generate accessToken: jwt.sign({id, username, role, sessionId}, JWT_SECRET, {expiresIn: '15m'})
    ↓
Return: { accessToken, refreshToken, expiresIn: 900, user }
    ↓
Frontend stores: 
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)  // HttpOnly cookie later
```

**Data Structure:**
```javascript
// Redis Key: session:c562419a-82cc-4922-b336-4c09853d6d7c
{
    userId: "1",
    username: "admin",
    role: "SUPERADMIN",
    full_name: "Aleksandar Jovičić",
    email: "admin@atlas.gov.ba",
    agencija: "null",
    agencija_naziv: "Sistem administrator",
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0...",
    deviceName: "Chrome on Windows",
    createdAt: "2025-10-06T15:12:25.000Z",
    lastActivity: "2025-10-06T15:45:12.000Z"
}

// Redis Key: user:1:sessions
SET ["c562419a-...", "97f0a201-...", "a1b2c3d4-..."]

// Redis Key: refresh:1336e37688c965a9...
"c562419a-82cc-4922-b336-4c09853d6d7c"
```

### 2. Authenticated Request Flow

```
GET /api/operators (with Authorization: Bearer {accessToken})
    ↓
authenticateToken middleware:
    ↓
jwt.verify(accessToken, JWT_SECRET) → { id, username, role, sessionId }
    ↓
sessionManager.getSession(sessionId) → Redis: HGETALL session:{sessionId}
    ↓
If session exists:
    sessionManager.updateSession(sessionId) → Redis: HSET lastActivity + EXPIRE 604800
    req.authUser = sessionData
    next()
Else:
    return 401 { error: 'Session expired' }
```

### 3. Token Refresh Flow

```
POST /api/auth/refresh
Body: { refreshToken }
    ↓
sessionManager.verifyRefreshToken(refreshToken) → Redis: GET refresh:{token}
    ↓
If valid sessionId:
    sessionManager.getSession(sessionId) → session exists?
        ↓
    Delete old refresh token: Redis: DEL refresh:{oldToken}
        ↓
    Generate new tokens:
        newAccessToken = jwt.sign({...}, JWT_SECRET, {expiresIn: '15m'})
        newRefreshToken = sessionManager.rotateRefreshToken(sessionId)
        ↓
    Return: { accessToken, refreshToken, expiresIn: 900 }
Else:
    return 401 { error: 'Invalid refresh token' }
```

### 4. Logout Flow

```
POST /api/auth/logout
    ↓
sessionManager.deleteSession(sessionId)
    ↓
Redis: DEL session:{sessionId}
       SREM user:{userId}:sessions {sessionId}
       (refresh token expires naturally or scan & delete)
    ↓
Return: { success: true }
```

### 5. Logout All Devices Flow

```
POST /api/auth/logout-all
    ↓
sessionManager.deleteAllUserSessions(userId)
    ↓
Redis: SMEMBERS user:{userId}:sessions → [sessionId1, sessionId2, ...]
       For each: DEL session:{sessionId}
       DEL user:{userId}:sessions
    ↓
Return: { success: true, deletedCount }
```

---

## 🛠️ Implementation Steps

### STEP 5: Modify POST /api/auth/login ⏱️ 20 min

**File:** `server.js` (lines ~540-680)

**Changes:**
1. Import Redis modules at top:
   ```javascript
   import redis from './scripts/helpers/redis-client.cjs';
   import sessionManager from './scripts/helpers/session-manager.cjs';
   ```

2. After password verification, replace JWT generation:
   ```javascript
   // OLD:
   const token = generateToken(user);
   return res.json({ token, user: sanitizeAuthUser(user, true) });
   
   // NEW:
   const deviceInfo = {
       ip: req.ip || req.connection?.remoteAddress || 'unknown',
       userAgent: req.get('User-Agent') || 'unknown',
       deviceName: getDeviceName(req.get('User-Agent'))
   };
   
   const { sessionId, refreshToken } = await sessionManager.createSession(
       Number(user.id),
       {
           username: user.username,
           role: user.role,
           full_name: `${user.firstName} ${user.lastName}`,
           email: user.email,
           agencija: user.agency?.code || null,
           agencija_naziv: user.agencyName || null
       },
       deviceInfo
   );
   
   const accessToken = jwt.sign(
       {
           id: Number(user.id),
           username: user.username,
           role: user.role,
           sessionId
       },
       JWT_SECRET,
       { expiresIn: '15m' }
   );
   
   return res.json({
       accessToken,
       refreshToken,
       expiresIn: 900,
       user: sanitizeAuthUser(user, true)
   });
   ```

3. Add helper function for device name extraction:
   ```javascript
   function getDeviceName(userAgent) {
       if (!userAgent) return 'Unknown Device';
       
       if (userAgent.includes('Mobile')) return 'Mobile Browser';
       if (userAgent.includes('iPhone')) return 'iPhone';
       if (userAgent.includes('iPad')) return 'iPad';
       if (userAgent.includes('Android')) return 'Android Device';
       if (userAgent.includes('Windows')) return 'Windows Desktop';
       if (userAgent.includes('Mac OS')) return 'Mac Desktop';
       if (userAgent.includes('Linux')) return 'Linux Desktop';
       
       return 'Web Browser';
   }
   ```

**Testing:**
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "1336e37688c965a9b4c5d2e8f1a3b7c9...",
  "expiresIn": 900,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "SUPERADMIN",
    ...
  }
}

# Verify in Redis:
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" KEYS "session:*"
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" HGETALL "session:{sessionId}"
```

---

### STEP 6: Modify authenticateToken Middleware ⏱️ 15 min

**File:** `server.js` (lines ~465-510)

**Changes:**
```javascript
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        
        // NEW: Check Redis session
        const sessionId = payload.sessionId;
        if (!sessionId) {
            // Legacy token without sessionId (for backward compatibility during migration)
            console.warn('⚠️  Legacy token without sessionId detected');
            // Fall back to old behavior (read from JSON file)
            const data = readAuthData();
            const userId = payload.sub || payload.userId;
            const user = data.users.find(u => u.id === userId && u.aktivan);
            
            if (!user) {
                return res.status(401).json({ error: 'Session expired or user disabled' });
            }
            
            req.authUser = sanitizeUser(user);
            req.authUser.role = user.role;
            req.authUser.tokenPayload = payload;
            req.authRawUser = user;
            req.authData = data;
            return next();
        }
        
        // Get session from Redis
        const sessionData = await sessionManager.getSession(sessionId);
        if (!sessionData) {
            return res.status(401).json({ 
                error: 'Session expired',
                session_expired: true 
            });
        }
        
        // Update session activity
        await sessionManager.updateSession(sessionId);
        
        // Set req.authUser from session data
        req.authUser = {
            id: sessionData.userId,
            username: sessionData.username,
            role: sessionData.role,
            full_name: sessionData.full_name,
            email: sessionData.email,
            agencija: sessionData.agencija === 'null' ? null : sessionData.agencija,
            agencija_naziv: sessionData.agencija_naziv,
            sessionId: sessionId,
            ip: sessionData.ip,
            deviceName: sessionData.deviceName
        };
        
        req.authUser.tokenPayload = payload;
        
        // For backward compatibility with existing code
        req.authRawUser = req.authUser;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Access token expired',
                token_expired: true 
            });
        }
        
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
```

**Testing:**
```bash
# Test authenticated request
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:3000/api/auth/session \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Expected: Session data with updated lastActivity
# Verify in Redis:
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" HGET "session:{sessionId}" lastActivity
# Should show recent timestamp
```

---

### STEP 7: Implement POST /api/auth/refresh ⏱️ 15 min

**File:** `server.js` (add after login endpoint)

**Code:**
```javascript
app.post('/api/auth/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }
        
        // Verify refresh token and get session ID
        const sessionId = await sessionManager.verifyRefreshToken(refreshToken);
        if (!sessionId) {
            Logger.log(Logger.logTypes.SECURITY, 'Invalid refresh token attempt', null, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        
        // Get session data
        const sessionData = await sessionManager.getSession(sessionId);
        if (!sessionData) {
            // Session expired or deleted
            await sessionManager.deleteRefreshToken(refreshToken);
            return res.status(401).json({ error: 'Session expired' });
        }
        
        // Delete old refresh token (one-time use)
        await sessionManager.deleteRefreshToken(refreshToken);
        
        // Generate new tokens
        const newAccessToken = jwt.sign(
            {
                id: sessionData.userId,
                username: sessionData.username,
                role: sessionData.role,
                sessionId
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
        
        const newRefreshToken = await sessionManager.rotateRefreshToken(sessionId);
        
        // Update session activity
        await sessionManager.updateSession(sessionId);
        
        Logger.log(Logger.logTypes.SYSTEM, `Token refreshed for user: ${sessionData.username}`, sessionData.userId, {
            username: sessionData.username,
            sessionId,
            ip: req.ip
        });
        
        return res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 900
        });
        
    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, `Token refresh error: ${error.message}`, null, {
            error: error.stack,
            ip: req.ip
        });
        console.error('Token refresh error:', error);
        return res.status(500).json({ error: 'Token refresh failed' });
    }
});
```

**Testing:**
```bash
# Test refresh
REFRESH_TOKEN="1336e37688c965a9b4c5d2e8f1a3b7c9..."
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"

# Expected: New accessToken + refreshToken
# Old refresh token should be deleted from Redis
```

---

### STEP 8: Session Management Endpoints ⏱️ 20 min

**File:** `server.js` (add after session endpoint)

**Code:**
```javascript
// GET /api/auth/sessions - List all user sessions
app.get('/api/auth/sessions', authenticateToken, async (req, res) => {
    try {
        const userId = req.authUser.id;
        const currentSessionId = req.authUser.sessionId;
        
        const sessions = await sessionManager.getUserSessions(userId);
        
        // Mark current session
        const sessionsWithCurrent = sessions.map(s => ({
            ...s,
            isCurrent: s.sessionId === currentSessionId
        }));
        
        return res.json({ sessions: sessionsWithCurrent });
        
    } catch (error) {
        console.error('Get sessions error:', error);
        return res.status(500).json({ error: 'Failed to load sessions' });
    }
});

// DELETE /api/auth/sessions/:sessionId - Delete specific session
app.delete('/api/auth/sessions/:sessionId', authenticateToken, async (req, res) => {
    try {
        const userId = req.authUser.id;
        const targetSessionId = req.params.sessionId;
        const currentSessionId = req.authUser.sessionId;
        
        // Verify session belongs to user
        const sessionData = await sessionManager.getSession(targetSessionId);
        if (!sessionData || sessionData.userId !== userId) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        // Don't allow deleting current session (use logout instead)
        if (targetSessionId === currentSessionId) {
            return res.status(400).json({ 
                error: 'Cannot delete current session. Use logout instead.' 
            });
        }
        
        await sessionManager.deleteSession(targetSessionId);
        
        Logger.log(Logger.logTypes.SECURITY, `Session deleted: ${targetSessionId}`, userId, {
            username: req.authUser.username,
            targetSessionId,
            deviceName: sessionData.deviceName
        });
        
        return res.json({ success: true });
        
    } catch (error) {
        console.error('Delete session error:', error);
        return res.status(500).json({ error: 'Failed to delete session' });
    }
});

// POST /api/auth/logout-all - Logout from all devices
app.post('/api/auth/logout-all', authenticateToken, async (req, res) => {
    try {
        const userId = req.authUser.id;
        
        const deletedCount = await sessionManager.deleteAllUserSessions(userId);
        
        Logger.log(Logger.logTypes.LOGOUT, `User logged out from all devices: ${req.authUser.username}`, userId, {
            username: req.authUser.username,
            deletedCount,
            ip: req.ip
        });
        
        return res.json({ 
            success: true, 
            deletedCount,
            message: `Odjavljeno sa ${deletedCount} uređaja` 
        });
        
    } catch (error) {
        console.error('Logout all error:', error);
        return res.status(500).json({ error: 'Failed to logout from all devices' });
    }
});
```

**Testing:**
```bash
# List sessions
curl -X GET http://localhost:3000/api/auth/sessions \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Delete specific session
curl -X DELETE http://localhost:3000/api/auth/sessions/{sessionId} \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Logout from all devices
curl -X POST http://localhost:3000/api/auth/logout-all \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

### STEP 9: Modify POST /api/auth/logout ⏱️ 10 min

**File:** `server.js` (lines ~690-720)

**Changes:**
```javascript
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        const sessionId = req.authUser.sessionId;
        
        if (sessionId) {
            // Redis session - delete it
            await sessionManager.deleteSession(sessionId);
        }
        
        Logger.log(Logger.logTypes.LOGOUT, `User logged out: ${req.authUser.username}`, req.authUser.id, {
            username: req.authUser.username,
            role: req.authUser.role,
            sessionId,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        return res.json({ success: true });
        
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Logout failed' });
    }
});
```

**Testing:**
```bash
# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Verify session deleted in Redis
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" EXISTS "session:{sessionId}"
# Should return 0 (not found)
```

---

### STEP 10: Frontend Changes (auth.js) ⏱️ 30 min

**File:** `auth.js`

**Changes:**

1. **Update token storage:**
```javascript
// OLD:
localStorage.setItem('token', response.token);

// NEW:
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('tokenExpiry', Date.now() + response.expiresIn * 1000);
```

2. **Add token refresh interceptor:**
```javascript
// Add before login form submission
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token');
    }
    
    const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
        // Refresh failed - need to re-login
        localStorage.clear();
        window.location.href = '/login.html';
        throw new Error('Session expired');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('tokenExpiry', Date.now() + data.expiresIn * 1000);
    
    return data.accessToken;
}

// Auto-refresh before expiry
function setupTokenRefresh() {
    setInterval(async () => {
        const expiry = parseInt(localStorage.getItem('tokenExpiry'));
        const now = Date.now();
        
        // Refresh 1 minute before expiry
        if (expiry && now >= expiry - 60000) {
            try {
                await refreshAccessToken();
                console.log('✅ Token refreshed automatically');
            } catch (error) {
                console.error('❌ Auto-refresh failed:', error);
            }
        }
    }, 30000); // Check every 30 seconds
}

// Call on page load
setupTokenRefresh();
```

3. **Update fetch requests to use accessToken:**
```javascript
// OLD:
headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
}

// NEW:
async function fetchWithAuth(url, options = {}) {
    let token = localStorage.getItem('accessToken');
    const expiry = parseInt(localStorage.getItem('tokenExpiry'));
    
    // Check if token expired
    if (expiry && Date.now() >= expiry) {
        token = await refreshAccessToken();
    }
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
    
    // If 401, try refresh once
    if (response.status === 401) {
        try {
            token = await refreshAccessToken();
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            window.location.href = '/login.html';
            throw error;
        }
    }
    
    return response;
}
```

4. **Update logout:**
```javascript
async function logout() {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Logout request failed:', error);
        }
    }
    
    localStorage.clear();
    window.location.href = '/login.html';
}
```

---

## 🧪 Complete Testing Plan

### 1. Unit Tests (Already Passed ✅)
```bash
node test-redis-session.cjs
```

### 2. Integration Tests

#### Test 1: Login & Session Creation
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  > login_response.json

# Extract tokens
ACCESS_TOKEN=$(cat login_response.json | jq -r '.accessToken')
REFRESH_TOKEN=$(cat login_response.json | jq -r '.refreshToken')

# Verify session in Redis
SESSION_ID=$(echo $ACCESS_TOKEN | cut -d'.' -f2 | base64 -d | jq -r '.sessionId')
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" HGETALL "session:$SESSION_ID"
```

#### Test 2: Authenticated Requests
```bash
# Test session endpoint
curl -X GET http://localhost:3000/api/auth/session \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Test operators endpoint
curl -X GET http://localhost:3000/api/operators \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

#### Test 3: Token Refresh
```bash
# Wait 16 minutes or manually expire token
# Then refresh
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

#### Test 4: Multi-Device Sessions
```bash
# Login from "device 1"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0) Chrome/120.0" \
  -d '{"username":"admin","password":"admin123"}' \
  > device1.json

# Login from "device 2"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile" \
  -d '{"username":"admin","password":"admin123"}' \
  > device2.json

# List sessions
ACCESS_TOKEN_1=$(cat device1.json | jq -r '.accessToken')
curl -X GET http://localhost:3000/api/auth/sessions \
  -H "Authorization: Bearer $ACCESS_TOKEN_1"

# Should show 2 sessions
```

#### Test 5: Session Deletion
```bash
# Delete specific session
SESSION_ID_2=$(cat device2.json | jq -r '.accessToken' | cut -d'.' -f2 | base64 -d | jq -r '.sessionId')
curl -X DELETE "http://localhost:3000/api/auth/sessions/$SESSION_ID_2" \
  -H "Authorization: Bearer $ACCESS_TOKEN_1"

# Verify device2 token no longer works
ACCESS_TOKEN_2=$(cat device2.json | jq -r '.accessToken')
curl -X GET http://localhost:3000/api/auth/session \
  -H "Authorization: Bearer $ACCESS_TOKEN_2"
# Should return 401
```

#### Test 6: Logout All Devices
```bash
curl -X POST http://localhost:3000/api/auth/logout-all \
  -H "Authorization: Bearer $ACCESS_TOKEN_1"

# All sessions should be deleted
docker exec -it atlas-redis redis-cli -a "atlas_redis_2024" KEYS "session:*"
# Should return empty
```

#### Test 7: Server Restart Persistence
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  > before_restart.json

ACCESS_TOKEN=$(cat before_restart.json | jq -r '.accessToken')

# Restart server
# CTRL+C in terminal
# node server.js

# Test token still works
curl -X GET http://localhost:3000/api/auth/session \
  -H "Authorization: Bearer $ACCESS_TOKEN"
# Should return user data ✅
```

---

## ✅ Success Criteria

- [x] Redis container running and healthy
- [x] Redis client connects successfully
- [x] Session manager all functions tested
- [ ] Login returns accessToken + refreshToken
- [ ] AccessToken expires in 15 minutes
- [ ] RefreshToken valid for 7 days
- [ ] authenticateToken checks Redis session
- [ ] Token refresh works (old refresh token deleted)
- [ ] Multiple sessions per user supported
- [ ] Session list shows all user devices
- [ ] Delete specific session works
- [ ] Logout all devices works
- [ ] Sessions persist after server restart
- [ ] Frontend auto-refresh works
- [ ] All existing features still work (CRUD, filtering, etc.)

---

## 🔄 Rollback Plan

If issues occur:
```bash
# Stop server
# Restore backup
cd "c:\Users\ROG_LAP\Desktop\Projekat\ATLAS html"
Copy-Item "backup/2025-10-06_pre_redis_sessions/server.js" server.js -Force

# Restart server
node server.js
```

---

## 📝 Notes

- Access token lifetime: 15 minutes (short for security)
- Refresh token lifetime: 7 days (user-friendly UX)
- Session TTL: 7 days (auto-extends on activity)
- Redis persistence: appendonly mode (survives container restart)
- Backward compatibility: Old JWT tokens still work temporarily
- Device detection: Based on User-Agent string
- IP tracking: For security audit logs

---

**Ready for implementation! 🚀**
