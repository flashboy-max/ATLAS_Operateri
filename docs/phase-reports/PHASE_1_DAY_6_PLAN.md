# 🔐 Phase 1 Day 6: Session Management UI

**Datum:** 6. Oktobar 2025  
**Status:** 🚧 U TOKU

---

## 🎯 Cilj

Kreirati frontend UI za upravljanje aktivnim sesijama korisnika, omogućavajući:
- Pregled svih aktivnih sesija (multi-device support)
- Logout sa specifičnog uređaja
- Logout sa svih uređaja odjednom
- Prikaz metadata (device, IP, last activity)

---

## 📋 Zadaci

### ✅ Backend (Already Complete)
- [x] GET /api/auth/sessions - List all user sessions
- [x] DELETE /api/auth/sessions/:sessionId - Delete specific session
- [x] POST /api/auth/logout-all - Logout from all devices
- [x] Session metadata (device, IP, userAgent, timestamps)

### 🚧 Frontend (To Implement)

#### 1. **my-sessions.html** - Glavna stranica
- [ ] HTML struktura
- [ ] Lista aktivnih sesija
- [ ] Current session indicator
- [ ] Device/Browser ikone
- [ ] Timestamp formatting

#### 2. **my-sessions.js** - JavaScript logika
- [ ] Fetch sessions from API
- [ ] Display sessions in UI
- [ ] Handle "Logout This Device" button
- [ ] Handle "Logout All Devices" button
- [ ] Auto-refresh session list
- [ ] Confirm dialogs

#### 3. **my-sessions.css** - Styling
- [ ] Responsive design
- [ ] Card layout za svaku sesiju
- [ ] Current session highlight
- [ ] Device ikone styling
- [ ] Button states (hover, active, disabled)

#### 4. **Integration**
- [ ] Add link in shared-header.js
- [ ] Add navigation menu item
- [ ] Auth requirement (requireAuth)

---

## 🎨 UI Design

### Session Card Layout:
```
┌─────────────────────────────────────────┐
│ 🖥️  Chrome on Windows          [CURRENT] │
│                                          │
│ 📍 IP: 192.168.1.100                    │
│ 🕐 Last Activity: 2 minutes ago         │
│ 🗓️  Created: Today at 14:30             │
│                                          │
│         [🚪 Logout This Device]         │
└─────────────────────────────────────────┘
```

### Features:
- **Current session** - Green border, "CURRENT" badge, no logout button
- **Other sessions** - White background, logout button enabled
- **Logout All** - Big red button at top, confirmation dialog

---

## 🔧 Technical Implementation

### API Endpoints (Already Implemented):

#### GET /api/auth/sessions
**Response:**
```json
{
  "sessions": [
    {
      "sessionId": "uuid",
      "userId": 1,
      "username": "admin",
      "deviceName": "Chrome on Windows",
      "ip": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-10-06T14:30:00Z",
      "lastActivity": "2025-10-06T14:32:00Z",
      "isCurrent": true
    }
  ]
}
```

#### DELETE /api/auth/sessions/:sessionId
**Response:**
```json
{
  "success": true
}
```

#### POST /api/auth/logout-all
**Response:**
```json
{
  "success": true,
  "deletedCount": 3,
  "message": "Odjavljeno sa 3 uređaja"
}
```

---

## 📝 Implementation Steps

### Step 1: Create HTML Structure (20 min)
- Page layout
- Header with title and "Logout All" button
- Container for session cards
- Loading spinner
- Empty state message

### Step 2: Create CSS Styling (15 min)
- Responsive grid layout
- Card styling
- Device icons
- Button states
- Current session highlight

### Step 3: Create JavaScript Logic (30 min)
- fetchSessions() - Get sessions from API
- displaySessions() - Render session cards
- logoutSession(sessionId) - Logout specific session
- logoutAll() - Logout from all devices
- formatTimestamp() - Format dates
- setupAutoRefresh() - Auto-refresh every 30s

### Step 4: Integration (10 min)
- Add link in shared-header.js menu
- Add auth requirement
- Test all functionality

### Step 5: Testing (15 min)
- Test with multiple sessions
- Test logout from specific device
- Test logout all
- Test auto-refresh
- Test responsive design

---

## ✅ Success Criteria

- [ ] User can view all active sessions
- [ ] Current session is clearly marked
- [ ] User can logout from specific session
- [ ] User cannot logout from current session (use main logout)
- [ ] User can logout from all devices
- [ ] Confirmation dialog before logout all
- [ ] Auto-refresh updates session list
- [ ] Device/browser icons display correctly
- [ ] Timestamps are human-readable
- [ ] Responsive design works on mobile
- [ ] Loading states work properly
- [ ] Error messages display correctly

---

## 🔐 Security Considerations

- ✅ Authentication required (authenticateToken middleware)
- ✅ User can only see their own sessions
- ✅ User cannot delete other users' sessions
- ✅ Current session cannot be deleted (use /logout instead)
- ✅ CSRF protection via sameSite cookies
- ✅ Session validation on every request

---

## 📊 Estimated Time

- **Total:** ~1.5 hours
- HTML Structure: 20 min
- CSS Styling: 15 min
- JavaScript Logic: 30 min
- Integration: 10 min
- Testing: 15 min

---

## 🚀 Next Steps (After Completion)

### Phase 1 Day 7: Security Enhancements
1. Enable CSRF Protection (csurf middleware)
2. Add Rate Limiting per User
3. Implement Security Headers (Helmet.js)
4. Add Content Security Policy (CSP)
5. Add IP geolocation for sessions
6. Add email notifications for new logins

---

**Status:** Ready to implement! 🎯
