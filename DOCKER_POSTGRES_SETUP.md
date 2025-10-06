# 🐳 Quick Start with Docker
## PostgreSQL Setup using Docker

**Fastest way to get started with Phase 1!**

---

## 🚀 ONE-COMMAND SETUP

```powershell
# Run PostgreSQL container
docker run --name atlas-postgres `
  -e POSTGRES_USER=atlas_user `
  -e POSTGRES_PASSWORD=Atlas2025SecurePass! `
  -e POSTGRES_DB=atlas_db `
  -p 5432:5432 `
  -v atlas-postgres-data:/var/lib/postgresql/data `
  -d postgres:16

# Verify container is running
docker ps | Select-String atlas-postgres
```

---

## ✅ VERIFY INSTALLATION

```powershell
# Check container status
docker ps

# Expected output:
# CONTAINER ID   IMAGE         STATUS         PORTS                    NAMES
# xxxxxxxxxxxx   postgres:16   Up X seconds   0.0.0.0:5432->5432/tcp   atlas-postgres

# Test connection
docker exec -it atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT version();"
```

---

## 🔧 DOCKER COMMANDS

### Start/Stop Container
```powershell
# Stop container
docker stop atlas-postgres

# Start container
docker start atlas-postgres

# Restart container
docker restart atlas-postgres
```

### View Logs
```powershell
docker logs atlas-postgres
docker logs -f atlas-postgres  # Follow logs
```

### Connect to Database
```powershell
# psql shell
docker exec -it atlas-postgres psql -U atlas_user -d atlas_db

# From inside psql:
\l          # List databases
\dt         # List tables
\du         # List users
\q          # Quit
```

### Backup & Restore
```powershell
# Backup
docker exec atlas-postgres pg_dump -U atlas_user atlas_db > backup/atlas_backup.sql

# Restore
docker exec -i atlas-postgres psql -U atlas_user atlas_db < backup/atlas_backup.sql
```

---

## 📝 UPDATE .ENV FILE

After starting the container, update `.env`:

```properties
DATABASE_URL="postgresql://atlas_user:Atlas2025SecurePass!@localhost:5432/atlas_db?schema=public"
```

---

## 🧪 NEXT STEPS

```powershell
# 1. Generate Prisma Client
npx prisma generate

# 2. Run migration
npx prisma migrate dev --name initial_setup

# 3. Test connection
node scripts/migration/test-connection.js

# 4. Migrate users
node scripts/migration/migrate-users.js

# 5. Open Prisma Studio
npx prisma studio
```

---

## 🔥 COMPLETE AUTOMATED SETUP

Run all commands in sequence:

```powershell
# Start PostgreSQL
docker run --name atlas-postgres `
  -e POSTGRES_USER=atlas_user `
  -e POSTGRES_PASSWORD=Atlas2025SecurePass! `
  -e POSTGRES_DB=atlas_db `
  -p 5432:5432 `
  -v atlas-postgres-data:/var/lib/postgresql/data `
  -d postgres:16

# Wait for PostgreSQL to be ready
Start-Sleep -Seconds 3

# Test connection
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT 'Database ready!';"

# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev --name initial_setup

# Test connection from Node.js
node scripts/migration/test-connection.js

# Migrate users
node scripts/migration/migrate-users.js

Write-Host "`n✅ Setup complete! Open Prisma Studio:" -ForegroundColor Green
Write-Host "npx prisma studio" -ForegroundColor Cyan
```

---

## 🗑️ CLEANUP (if needed)

```powershell
# Stop and remove container
docker stop atlas-postgres
docker rm atlas-postgres

# Remove volume (WARNING: deletes all data!)
docker volume rm atlas-postgres-data

# Remove image
docker rmi postgres:16
```

---

## 💡 ADVANTAGES OF DOCKER

- ✅ No system-wide PostgreSQL installation
- ✅ Easy to start/stop
- ✅ Isolated from other PostgreSQL instances
- ✅ Simple backup/restore
- ✅ Easy to recreate from scratch
- ✅ Perfect for development

---

*Quick setup guide for ATLAS Phase 1*
