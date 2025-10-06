# 🎯 PRISMA STUDIO & DATABASE TOOLS - KOMPLETNI VODIČ

---

## 🌐 PRISMA STUDIO (Najlakši način!)

### Pokretanje:
```powershell
npx prisma studio
```

**Automatski će se otvoriti na:** http://localhost:5555

---

## 📊 ŠTA MOŽEŠ VIDJETI U PRISMA STUDIO:

### 1. **app_user** (Korisnici)
Klikni na `app_user` tabelu i videćeš:
- ✅ Sve korisnike (admin, admin_ks, korisnik_ks, admin_una)
- ✅ MFA status (`mfaEnabled`: true/false)
- ✅ MFA secret (za MFA korisnike)
- ✅ Email, Full Name
- ✅ Last Login
- ✅ Active status

**Možeš:**
- Filtrirati (npr. samo MFA korisnici)
- Sortirati po koloni
- Editovati direktno (za testing)
- Dodati novog korisnika

### 2. **role** (Role)
- SUPERADMIN
- ADMIN
- USER

### 3. **agency** (Agencije)
- MUP_KS - Ministarstvo unutrašnjih poslova Kantona Sarajevo
- MUP_BIH - Ministarstvo sigurnosti BiH
- SIPA - Državna agencija za istrage i zaštitu

### 4. **user_role** (Ko ima koju rolu)
Veza između korisnika i rola

### 5. **audit_log** (Security logovi)
Svi eventi:
- LOGIN_SUCCESS
- LOGOUT
- USER_UPDATE
- MFA_SETUP
- SECURITY_ALERT
- itd.

---

## 🐳 DOCKER POSTGRESQL - Direktan pristup

### Metoda 1: psql Shell
```powershell
docker exec -it atlas-postgres psql -U atlas_user -d atlas_db
```

**Korisne komande u psql:**
```sql
-- Vidi sve tabele
\dt

-- Detalji o tabeli
\d app_user

-- Svi korisnici
SELECT id, username, "fullName", "mfaEnabled" FROM app_user;

-- Korisnici sa MFA
SELECT username, "fullName" FROM app_user WHERE "mfaEnabled" = true;

-- Zadnjih 10 audit logova
SELECT "occurredAt", action, status 
FROM audit_log 
ORDER BY "occurredAt" DESC 
LIMIT 10;

-- Izađi
\q
```

### Metoda 2: Brze SQL komande
```powershell
# Broj korisnika
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT COUNT(*) FROM app_user;"

# Lista korisnika
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT username, \"fullName\", CASE WHEN \"mfaEnabled\" THEN '🔐' ELSE '  ' END as mfa FROM app_user;"

# Zadnji logovi
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT * FROM audit_log ORDER BY \"occurredAt\" DESC LIMIT 5;"
```

---

## 🔧 DOCKER MANAGEMENT

### Provera statusa:
```powershell
# Da li je container running?
docker ps | Select-String atlas-postgres

# Output:
# d58ed88b9f8e   postgres:16   "docker-entrypoint.s…"   Up X hours   0.0.0.0:5432->5432/tcp   atlas-postgres
```

### Start/Stop:
```powershell
# Zaustavi
docker stop atlas-postgres

# Pokreni
docker start atlas-postgres

# Restart
docker restart atlas-postgres

# Status
docker ps --filter name=atlas-postgres
```

### Logovi:
```powershell
# Vidi sve logove
docker logs atlas-postgres

# Prati live logove
docker logs -f atlas-postgres

# Zadnjih 50 linija
docker logs --tail 50 atlas-postgres
```

---

## 💾 BACKUP & RESTORE

### Backup:
```powershell
# Kreiraj backup
docker exec atlas-postgres pg_dump -U atlas_user atlas_db > "backup/atlas_backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm').sql"

# Potvrda
Write-Host "✅ Backup created!" -ForegroundColor Green
```

### Restore:
```powershell
# Iz backup fajla
docker exec -i atlas-postgres psql -U atlas_user atlas_db < backup/atlas_backup_2025-10-06_22-00.sql
```

---

## 📈 QUICK STATUS SCRIPT

Kreiraj `check-db-status.ps1`:
```powershell
#!/usr/bin/env pwsh

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  📊 ATLAS DATABASE STATUS CHECK" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Docker Container
Write-Host "🐳 Docker Container:" -ForegroundColor Yellow
$container = docker ps --filter name=atlas-postgres --format "{{.Names}}: {{.Status}}"
if ($container) {
    Write-Host "  ✅ $container" -ForegroundColor Green
} else {
    Write-Host "  ❌ Container not running!" -ForegroundColor Red
    Write-Host "  💡 Run: docker start atlas-postgres`n" -ForegroundColor Yellow
    exit 1
}

# Database Connection
Write-Host "`n📡 Database Connection:" -ForegroundColor Yellow
$dbTest = docker exec atlas-postgres psql -U atlas_user -d atlas_db -t -c "SELECT 'Connected'" 2>&1
if ($dbTest -match "Connected") {
    Write-Host "  ✅ Database accessible" -ForegroundColor Green
} else {
    Write-Host "  ❌ Cannot connect to database" -ForegroundColor Red
}

# Statistics
Write-Host "`n📊 Database Statistics:" -ForegroundColor Yellow
$stats = docker exec atlas-postgres psql -U atlas_user -d atlas_db -t -c @"
SELECT 
    'Users: ' || COUNT(*) FROM app_user
UNION ALL
SELECT 
    'MFA Users: ' || COUNT(*) FROM app_user WHERE \"mfaEnabled\" = true
UNION ALL
SELECT 
    'Roles: ' || COUNT(*) FROM role
UNION ALL
SELECT 
    'Agencies: ' || COUNT(*) FROM agency
UNION ALL
SELECT 
    'Audit Logs: ' || COUNT(*) FROM audit_log;
"@

$stats | ForEach-Object { Write-Host "  $($_.Trim())" -ForegroundColor White }

# Prisma Studio
Write-Host "`n🌐 Prisma Studio:" -ForegroundColor Yellow
$prismaProcess = Get-Process -Name "prisma-studio" -ErrorAction SilentlyContinue
if ($prismaProcess) {
    Write-Host "  ✅ Running on http://localhost:5555" -ForegroundColor Green
} else {
    Write-Host "  ⚪ Not running" -ForegroundColor Gray
    Write-Host "  💡 Run: npx prisma studio" -ForegroundColor Yellow
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Status check complete!`n" -ForegroundColor Green
```

**Pokreni:** `.\check-db-status.ps1`

---

## 🎯 PRAKTIČNI PRIMJERI

### 1. Pronađi korisnika po username:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT * FROM app_user WHERE username = 'admin';"
```

### 2. Vidi ko ima MFA:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT username, \"fullName\", \"mfaEnabled\" FROM app_user WHERE \"mfaEnabled\" = true;"
```

### 3. Zadnjih 10 login pokušaja:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT \"occurredAt\", action, status, \"actorUserId\" FROM audit_log WHERE action IN ('LOGIN_SUCCESS', 'LOGIN_FAILURE') ORDER BY \"occurredAt\" DESC LIMIT 10;"
```

### 4. Broj korisnika po agenciji:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT a.name, COUNT(u.id) as user_count FROM agency a LEFT JOIN app_user u ON a.id = u.\"agencyId\" GROUP BY a.name;"
```

---

## 🔍 TROUBLESHOOTING

### Problem: "Cannot connect to database"
```powershell
# 1. Provjeri Docker
docker ps

# 2. Pokreni container
docker start atlas-postgres

# 3. Sačekaj 3s
Start-Sleep -Seconds 3

# 4. Test
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT 1;"
```

### Problem: "Port 5432 in use"
```powershell
# Pronađi proces
netstat -ano | findstr :5432

# Zaustavi postojeći PostgreSQL
Stop-Service postgresql*
```

### Problem: "Prisma Studio ne otvara"
```powershell
# Zatvori sve Prisma procese
Get-Process -Name "*prisma*" -ErrorAction SilentlyContinue | Stop-Process -Force

# Pokreni ponovo
npx prisma studio
```

---

## 📱 QUICK REFERENCE

| Tool | Command | Purpose |
|------|---------|---------|
| **Prisma Studio** | `npx prisma studio` | GUI za browse/edit podataka |
| **psql Shell** | `docker exec -it atlas-postgres psql -U atlas_user -d atlas_db` | SQL console |
| **Container Status** | `docker ps \| Select-String atlas` | Da li radi? |
| **Start Container** | `docker start atlas-postgres` | Pokreni bazu |
| **Stop Container** | `docker stop atlas-postgres` | Zaustavi bazu |
| **Backup** | `docker exec atlas-postgres pg_dump -U atlas_user atlas_db > backup.sql` | Sačuvaj podatke |
| **Logs** | `docker logs -f atlas-postgres` | Prati šta se dešava |

---

## 💡 NAJBOLJE PRAKSE

### Za development:
1. ✅ Drži Prisma Studio otvoren u drugom tab-u
2. ✅ Pravi backup prije velikih promjena
3. ✅ Koristi Prisma Studio za brze provjere
4. ✅ Koristi psql za kompleksne upite
5. ✅ Prati logove kad debugging

### Za production:
1. ⚠️ NE koristiti Prisma Studio
2. ⚠️ Praviti redovne backups
3. ⚠️ Monitoring upita (slow queries)
4. ⚠️ SSL konekcija obavezna
5. ⚠️ Jaki password za bazu

---

## 🎉 SAŽETAK

**3 glavna načina pristupa:**

1. **Prisma Studio** (Najlakše) 
   - `npx prisma studio` 
   - http://localhost:5555
   - GUI, klikni i vidi

2. **Docker psql** (Za SQL)
   - `docker exec -it atlas-postgres psql -U atlas_user -d atlas_db`
   - Full SQL pristup
   - Za kompleksne upite

3. **Quick Commands** (Za status)
   - `docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SQL"`
   - Brze provjere
   - Iz PowerShell-a

**Koristi šta ti najviše odgovara!**

---

*Kompletni vodič za ATLAS database tools - 2025-10-06*
