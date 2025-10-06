# 🔧 ATLAS Database Tools - Quick Guide
## Kako koristiti Prisma Studio i PostgreSQL

---

## 1️⃣ PRISMA STUDIO (Vizuelni pregled baze)

### Pokretanje:
```powershell
# Otvori novi terminal i pokreni:
npx prisma studio
```

**Šta će se desiti:**
- Otvoriće se na: http://localhost:5555
- Automatski će otvoriti browser
- Videćeš sve tabele sa podacima

### Funkcije Prisma Studio:
- ✅ **Pregledaj** sve podatke u tabelama
- ✅ **Edituj** zapise direktno u GUI-u
- ✅ **Dodaj** nove zapise
- ✅ **Obriši** zapise
- ✅ **Filtriraj** i pretraži podatke
- ✅ **Vidi relacije** između tabela

### Korisni prikazi:
1. **app_user** - Svi korisnici sa MFA statusom
2. **role** - Definisane role
3. **agency** - Agencije (MUP_KS, itd.)
4. **user_role** - Ko ima koju rolu
5. **audit_log** - Svi security eventi

---

## 2️⃣ POSTGRESQL DATABASE (Direktan pristup)

### Metoda 1: Docker exec (Brzo)
```powershell
# Otvori psql shell:
docker exec -it atlas-postgres psql -U atlas_user -d atlas_db
```

**Korisne SQL komande:**
```sql
-- Lista tabela
\dt

-- Detalji o tabeli
\d app_user

-- Broj korisnika
SELECT COUNT(*) FROM app_user;

-- Korisnici sa MFA
SELECT username, "fullName", "mfaEnabled" FROM app_user;

-- Audit log (zadnjih 10)
SELECT "occurredAt", action, "actionDisplay", status 
FROM audit_log 
ORDER BY "occurredAt" DESC 
LIMIT 10;

-- Izlaz
\q
```

### Metoda 2: Prisma Client u Node.js
```javascript
// Kreiraj test-query.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Dohvati sve korisnike
const users = await prisma.user.findMany({
    include: {
        roles: { include: { role: true } },
        agency: true
    }
});

console.log(users);
await prisma.$disconnect();
```

---

## 3️⃣ DOCKER CONTAINER MANAGEMENT

### Provjeri status:
```powershell
docker ps | Select-String atlas-postgres
```

### Zaustavi/Pokreni:
```powershell
# Zaustavi
docker stop atlas-postgres

# Pokreni
docker start atlas-postgres

# Restart
docker restart atlas-postgres
```

### Vidi logove:
```powershell
# Svi logovi
docker logs atlas-postgres

# Prati live
docker logs -f atlas-postgres
```

### Backup baze:
```powershell
# Kreiraj backup
docker exec atlas-postgres pg_dump -U atlas_user atlas_db > backup_$(Get-Date -Format "yyyy-MM-dd").sql

# Restore backup
docker exec -i atlas-postgres psql -U atlas_user atlas_db < backup_2025-10-06.sql
```

---

## 4️⃣ PRAKTIČNI PRIMJERI

### Provjeri trenutne korisnike:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT id, username, CASE WHEN \"mfaEnabled\" THEN '🔐 MFA' ELSE '   ' END as mfa, \"fullName\" FROM app_user;"
```

### Provjeri zadnje logove:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT \"occurredAt\", action, status FROM audit_log ORDER BY \"occurredAt\" DESC LIMIT 5;"
```

### Provjeri rol-agency relacije:
```powershell
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT u.username, r.name as role, a.name as agency FROM app_user u JOIN user_role ur ON u.id = ur.user_id JOIN role r ON ur.role_id = r.id LEFT JOIN agency a ON u.agency_id = a.id;"
```

---

## 5️⃣ QUICK START COMMANDS

### Sve u jednom:
```powershell
# 1. Provjeri da li je Docker running
docker ps | Select-String atlas-postgres

# 2. Ako nije, pokreni
docker start atlas-postgres

# 3. Testiraj konekciju
node scripts/migration/test-connection.js

# 4. Otvori Prisma Studio
npx prisma studio

# 5. Ili direktno u psql
docker exec -it atlas-postgres psql -U atlas_user -d atlas_db
```

---

## 🔍 TROUBLESHOOTING

### Problem: "Cannot connect to database"
```powershell
# Provjeri Docker
docker ps

# Ako nema atlas-postgres, pokreni ga
docker start atlas-postgres

# Sačekaj 3 sekunde
Start-Sleep -Seconds 3

# Testiraj
docker exec atlas-postgres psql -U atlas_user -d atlas_db -c "SELECT 1;"
```

### Problem: "Port 5432 already in use"
```powershell
# Provjeri šta koristi port
netstat -ano | findstr :5432

# Zaustavi postojeći PostgreSQL
Stop-Service postgresql*

# Ili koristi drugi port za Docker
docker run -p 5433:5432 ...
```

### Problem: "Prisma Studio won't open"
```powershell
# Zatvori postojeće Prisma Studio procese
Get-Process -Name "prisma" -ErrorAction SilentlyContinue | Stop-Process

# Pokreni ponovo
npx prisma studio
```

---

## 📊 MONITORING DASHBOARD

### Kreiraj quick-status.ps1:
```powershell
Write-Host "`n📊 ATLAS DATABASE STATUS`n" -ForegroundColor Cyan

# Docker Status
Write-Host "🐳 Docker Container:" -ForegroundColor Yellow
docker ps --filter name=atlas-postgres --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Database Stats
Write-Host "`n📈 Database Statistics:" -ForegroundColor Yellow
docker exec atlas-postgres psql -U atlas_user -d atlas_db -t -c "
    SELECT 
        'Users: ' || COUNT(*) FROM app_user
    UNION ALL
    SELECT 
        'MFA Enabled: ' || COUNT(*) FROM app_user WHERE \"mfaEnabled\" = true
    UNION ALL
    SELECT 
        'Audit Logs: ' || COUNT(*) FROM audit_log
"

Write-Host "`n✅ Status check complete!`n" -ForegroundColor Green
```

**Pokreni:** `.\quick-status.ps1`

---

*Quick reference guide for ATLAS database tools*
