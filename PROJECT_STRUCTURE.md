# 🏗️ ATLAS Project Structure - Visual Overview

```
ATLAS_Operateri/
│
├── 📚 DOCUMENTATION (Root Level)
│   ├── README.md                    ⭐ Main documentation (3000+ words)
│   ├── QUICK_START.md               ⚡ Quick setup guide
│   ├── CONTRIBUTING.md              🤝 Developer guidelines
│   ├── CHANGELOG.md                 📝 Version history
│   ├── LICENSE                      📄 MIT License
│   ├── GITHUB_UPDATE_SUMMARY.md     📊 This update summary
│   └── GIT_COMMIT_INSTRUCTIONS.md   🚀 How to commit
│
├── 🌐 WEB PAGES (Frontend)
│   ├── index.html                   # Main operators view
│   ├── login.html                   # Authentication
│   ├── dashboard.html               # User dashboard
│   ├── user-management.html         # User CRUD (ADMIN+)
│   ├── system-logs.html             # Activity logs
│   ├── postavke.html                # Settings
│   ├── moj-profil.html              # User profile
│   ├── shared-header.html           # Shared navigation
│   └── user-menu-template.html      # User dropdown menu
│
├── 🎨 STYLESHEETS (CSS)
│   ├── styles.css                   # Main app styles
│   ├── common.css                   # Shared styles
│   ├── auth.css                     # Login styles
│   ├── dashboard.css                # Dashboard styles
│   ├── user-management.css          # User management styles
│   ├── system-logs.css              # Logs styles
│   ├── postavke.css                 # Settings styles
│   ├── moj-profil.css               # Profile styles
│   └── shared-header.css            # Header styles
│
├── 💻 JAVASCRIPT (Client-side)
│   ├── app.js                       # Main app logic
│   ├── auth.js                      # Authentication system
│   ├── dashboard.js                 # Dashboard logic
│   ├── user-management.js           # User CRUD logic
│   ├── system-logs.js               # Logs display logic
│   ├── postavke.js                  # Settings logic
│   ├── moj-profil.js                # Profile logic
│   ├── shared-header.js             # Header component
│   ├── audit-logger.js              # Audit logging utility
│   ├── enhanced-logger.js           # Enhanced logging
│   └── mock-data.js                 # Mock/test data
│
├── 🗄️ DATA STORAGE
│   ├── operateri.json               # Legacy operators DB
│   ├── standard_catalog.json        # ⭐ Active catalog (31 operators)
│   ├── standard_catalog.schema.json # JSON Schema validation
│   │
│   ├── 📁 data/
│   │   ├── auth-users.json          # User database
│   │   └── logs/                    # Log files
│   │       ├── .gitkeep
│   │       └── *.log                # Daily logs
│   │
│   └── 📁 operators/                # Individual operator JSON
│       ├── 1.json
│       ├── 2.json
│       └── ...31.json
│
├── 🔧 SERVER (Backend)
│   ├── server.js                    # ⭐ Express server entry
│   │
│   └── 📁 server/                   # Server modules
│       ├── auth.js                  # Auth endpoints
│       ├── operators.js             # Operator endpoints
│       ├── logs.js                  # Log endpoints
│       └── users.js                 # User endpoints
│
├── 📜 SCRIPTS (Build & Validation)
│   ├── generate-catalog.js          # Generate standard catalog
│   ├── validate-catalog.js          # Validate catalog
│   └── standardize-legal-obligations.cjs
│
├── 📚 DOCS (User Documentation)
│   ├── README.md                    # Docs index
│   ├── Pomoć.md                     # User guide (Bosnian)
│   ├── korisnici_aplikacije.md      # Roles & permissions
│   ├── SYSTEM_LOGS_README.md        # System logs docs
│   │
│   └── 📁 auth-prototype/           # Auth implementation docs
│       └── *.md
│
├── 🗂️ TODO (Development)
│   ├── README.md                    # ToDo structure
│   │
│   ├── 📁 reports/                  # ⭐ Implementation reports
│   │   ├── README.md
│   │   ├── AUDIT_LOGGING_IMPLEMENTATION_REPORT.md
│   │   ├── DASHBOARD_*.md
│   │   ├── SYSTEM_LOGS_*.md
│   │   └── ...18 total reports
│   │
│   ├── 📁 dokumentacija/            # Development docs
│   ├── 📁 planovi/                  # Planning docs
│   ├── 📁 implementacija/           # Implementation tracking
│   └── 📁 testovi/                  # Test plans
│
├── 💾 BACKUP (Archived Files)
│   ├── .gitkeep
│   ├── moj-profil-backup.js
│   └── 📁 [timestamped backups]/
│
├── 🏗️ GENERATED (Build Output)
│   └── standard_catalog.js          # Generated catalog
│
├── ⚙️ CONFIGURATION
│   ├── package.json                 # NPM config (v3.0.0)
│   ├── package-lock.json            # Dependency lock
│   ├── .gitignore                   # Git ignore rules
│   ├── start-atlas-html.bat         # Windows launcher
│   └── favicon.ico                  # App icon
│
└── 🚫 IGNORED (Not in Git)
    ├── node_modules/                # NPM packages
    ├── data/logs/*.log              # Log files
    ├── .env                         # Environment vars
    └── *.tmp                        # Temp files
```

---

## 📊 Statistics

### 📄 Documentation Files
- **5 new major docs**: README, QUICK_START, CONTRIBUTING, CHANGELOG, LICENSE
- **3 instruction docs**: GITHUB_UPDATE_SUMMARY, GIT_COMMIT_INSTRUCTIONS, PROJECT_STRUCTURE
- **Total**: 8 new documentation files

### 🗂️ Organization
- **docs/** folder: 4 files (user documentation)
- **ToDo/reports/** folder: 18 files (development reports)
- **backup/** folder: Archived files

### 💻 Code Files
- **9 HTML pages** (frontend views)
- **10 CSS files** (styles)
- **11 JS files** (client logic)
- **4 server modules** (backend)
- **3 build scripts**

### 🗄️ Data Files
- **31 operators** in standard_catalog.json
- **31 individual** operator JSON files
- **1 user database** (auth-users.json)
- **1 schema file** for validation

---

## 🎯 Key Features by Module

### 🔐 Authentication (auth.js)
```javascript
✅ JWT token-based auth
✅ Password hashing (bcrypt)
✅ Session management
✅ Role-based access (SUPERADMIN, ADMIN, KORISNIK)
✅ Remember me
✅ Auto-logout on token expiry
```

### 📊 Dashboard (dashboard.html/js)
```javascript
✅ Real-time statistics
✅ Role-based quick actions
✅ Recent activities (ADMIN+)
✅ Personalized cards
✅ Direct navigation links
```

### 👥 User Management (user-management.html/js)
```javascript
✅ Full CRUD operations
✅ Role assignment
✅ Agency assignment
✅ Activate/Deactivate users
✅ Password management
✅ Multi-agency support
```

### 📋 System Logs (system-logs.html/js)
```javascript
✅ Activity tracking
✅ Advanced filtering (user, action, period, status)
✅ Export to CSV
✅ Role-based access
✅ Deduplication
✅ Real-time updates
```

### 📱 Operators (index.html/app.js)
```javascript
✅ 31 telecom operators
✅ Advanced search
✅ Expandable details
✅ CRUD operations (SUPERADMIN)
✅ Export functionality
✅ Standard catalog
```

---

## 🔄 Data Flow

```
User Login
    ↓
[login.html] → auth.js → server/auth.js → JWT Token
    ↓
Session Storage
    ↓
[dashboard.html] → Load stats → Display personalized view
    ↓
User Actions
    ↓
[Any Page] → Action → audit-logger.js → data/logs/
    ↓
System Logs
    ↓
[system-logs.html] → Display filtered logs → Export CSV
```

---

## 🗺️ Navigation Flow

```
Login Page
    ↓
Dashboard ──────────────┬─────────────┬──────────────┬────────────┐
    │                   │             │              │            │
    ↓                   ↓             ↓              ↓            ↓
Operateri      User Management   System Logs    Postavke    Moj Profil
(index.html)   (ADMIN+)          (All roles)    (All)       (All)
    │
    ├── Search
    ├── Filter
    ├── View Details
    └── CRUD (SUPERADMIN only)
```

---

## 🔒 Permission Matrix

| Feature | SUPERADMIN | ADMIN | KORISNIK |
|---------|------------|-------|----------|
| View Operators | ✅ | ✅ | ✅ |
| Edit Operators | ✅ | ❌ | ❌ |
| User Management | ✅ (all) | ✅ (agency) | ❌ |
| System Logs | ✅ (all) | ✅ (agency) | ✅ (own) |
| Settings | ✅ (all) | ✅ (limited) | ✅ (profile) |
| Agencies | ✅ | ❌ | ❌ |

---

## 📦 Dependencies

### Production
```json
{
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "express-rate-limit": "^8.1.0"
}
```

### Development
```json
{
  "ajv": "^8.12.0"
}
```

---

## 🎨 Design System

### Colors
```css
--primary-color: #2563eb
--success-color: #10b981
--warning-color: #f59e0b
--danger-color: #ef4444
--text-primary: #1f2937
--text-muted: #6b7280
--bg-primary: #ffffff
--bg-secondary: #f9fafb
```

### Spacing
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
```

### Typography
```css
Font: Inter (Google Fonts)
H1: 2.5rem / 600
H2: 2rem / 600
H3: 1.5rem / 600
Body: 1rem / 400
```

---

## 🚀 Performance

### Load Times
- Initial page load: ~500ms
- Authentication: ~200ms
- Data fetch: ~100ms
- Search: Real-time (debounced)

### Optimization
- ✅ CSS variables for theming
- ✅ Debounced search
- ✅ Lazy loading (expandable details)
- ✅ Minimal dependencies
- ✅ File-based storage (no DB overhead)

---

## 🔮 Future Enhancements

### Planned Features
- 🔄 2FA (Two-Factor Authentication)
- 📧 Email notifications
- 📊 Advanced analytics
- 🔍 Operator comparison tool
- 📱 Mobile app (React Native)
- 🐳 Docker containerization
- 🔄 CI/CD pipeline

### Under Consideration
- 🌐 Multi-language support
- 📈 Real-time collaboration
- 🔗 External API integrations
- 💾 Database migration (MongoDB/PostgreSQL)
- 📊 Advanced reporting

---

<div align="center">

**ATLAS v3.0.0 - Comprehensive Project Structure**

Made with ❤️ by ATLAS Project Team

**⭐ Star the repo • 🔀 Fork it • 🐛 Report issues**

</div>
