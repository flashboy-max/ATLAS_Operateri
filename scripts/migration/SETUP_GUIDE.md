# 🚀 PostgreSQL Setup & Migration Guide
## ATLAS Database Infrastructure Setup

**Target Database**: PostgreSQL 16+  
**ORM**: Prisma  
**Migration Date**: 2025-10-06

---

## 📋 PREREQUISITES

### 1. Install PostgreSQL (Windows)
```powershell
# Download PostgreSQL installer from:
# https://www.postgresql.org/download/windows/

# Preporučena verzija: PostgreSQL 16.x
# During installation:
# - Set password for postgres user
# - Port: 5432 (default)
# - Locale: English, United States
```

### 2. Verify Installation
```powershell
# Check PostgreSQL service is running
Get-Service -Name postgresql*

# Test connection
psql --version
```

---

## 🔧 STEP 1: Database Creation

### Create Database & User
```powershell
# Connect to PostgreSQL as postgres user
psql -U postgres

# In psql console:
```

```sql
-- Create database
CREATE DATABASE atlas_db;

-- Create user with password
CREATE USER atlas_user WITH PASSWORD 'YourSecurePassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE atlas_db TO atlas_user;

-- Connect to atlas_db
\c atlas_db

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO atlas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO atlas_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO atlas_user;

-- Exit psql
\q
```

---

## 🔑 STEP 2: Update Environment Variables

Edit `.env` file:

```properties
# Update with your actual password
DATABASE_URL="postgresql://atlas_user:YourSecurePassword123!@localhost:5432/atlas_db?schema=public"
```

---

## 🗄️ STEP 3: Run Prisma Migrations

```powershell
# Install Prisma CLI globally (if not installed)
npm install -g prisma

# Or use npx:
npx prisma --version

# Generate Prisma Client
npx prisma generate

# Create and run initial migration
npx prisma migrate dev --name initial_setup

# Verify migration
npx prisma migrate status
```

---

## 📊 STEP 4: Verify Database Schema

```powershell
# Open Prisma Studio to inspect database
npx prisma studio

# Or connect via psql
psql -U atlas_user -d atlas_db

# In psql:
\dt  # List all tables
\d app_user  # Describe user table
\d operator  # Describe operator table
```

Expected tables:
- `agency`
- `role`
- `app_user`
- `user_role`
- `session`
- `operator`
- `operator_capability`
- `operator_endpoint`
- `legal_basis`
- `audit_log`

---

## 🔄 STEP 5: Data Migration

Run migration scripts in order:

```powershell
# 1. Migrate users from auth-users.json
node scripts/migration/migrate-users.js

# 2. Migrate operators from operators/*.json
node scripts/migration/migrate-operators.js

# 3. Migrate audit logs
node scripts/migration/migrate-logs.js

# 4. Verify migration
node scripts/migration/verify-migration.js
```

---

## 🧪 STEP 6: Testing

### Test Database Connection
```javascript
// Run quick test
node scripts/migration/test-connection.js
```

### Test Queries
```powershell
# Open Prisma Studio
npx prisma studio

# Verify:
# - User count matches auth-users.json
# - Operator count matches operators/*.json
# - All MFA secrets migrated
# - Audit logs preserved
```

---

## 🔐 STEP 7: Create Indexes (Performance)

```sql
-- Connect to database
psql -U atlas_user -d atlas_db

-- Create GIN indexes for JSONB columns
CREATE INDEX idx_operator_services ON operator USING GIN (services);
CREATE INDEX idx_operator_technologies ON operator USING GIN (technologies);
CREATE INDEX idx_operator_legal_obligations ON operator USING GIN (legal_obligations);
CREATE INDEX idx_operator_contact_info ON operator USING GIN (contact_info);
CREATE INDEX idx_audit_metadata ON audit_log USING GIN (metadata);

-- Verify indexes
\di
```

---

## 📈 STEP 8: Backup Strategy

### Create Backup Script
```powershell
# Create backup
pg_dump -U atlas_user -d atlas_db -F c -b -v -f "backup/atlas_db_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').backup"

# Restore from backup (if needed)
pg_restore -U atlas_user -d atlas_db -v "backup/atlas_db_2025-10-06_10-30-00.backup"
```

---

## 🚨 TROUBLESHOOTING

### Issue: "peer authentication failed"
```bash
# Edit pg_hba.conf
# Change method from 'peer' to 'md5'
# Location: C:\Program Files\PostgreSQL\16\data\pg_hba.conf

# Restart PostgreSQL service
Restart-Service postgresql-x64-16
```

### Issue: "permission denied for schema public"
```sql
-- Grant permissions again
psql -U postgres
GRANT ALL ON SCHEMA public TO atlas_user;
```

### Issue: "could not connect to server"
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Start service if needed
Start-Service postgresql-x64-16
```

---

## ✅ SUCCESS CRITERIA

- [x] PostgreSQL installed and running
- [x] Database `atlas_db` created
- [x] User `atlas_user` configured
- [x] Prisma schema migrated successfully
- [x] All tables created
- [x] Data migrated from JSON files
- [x] Indexes created for performance
- [x] Backup strategy in place
- [x] Connection tested and working

---

## 📝 NEXT STEPS

After successful migration:

1. **Update server.js**: Replace JSON file operations with Prisma queries
2. **Implement Redis**: Session management
3. **Add HttpOnly Cookies**: Security upgrade
4. **Performance Testing**: Benchmark vs JSON
5. **Deploy to Production**: Staged rollout

---

## 🔗 REFERENCES

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Windows Installation](https://www.postgresql.org/download/windows/)

---

*Last Updated: 2025-10-06*  
*Author: ATLAS Development Team*
