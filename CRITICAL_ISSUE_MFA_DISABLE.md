# 🚨 KRITIČAN PROBLEM IDENTIFIKOVAN

## Problem:
- ✅ Korisnici su migrirani u PostgreSQL
- ❌ Server.js još uvijek koristi JSON fajlove
- ❌ MFA disable ne radi jer ne može pronaći korisnika u JSON-u

## Trenutno Stanje:
```
PostgreSQL:  4 korisnika ✅
JSON File:   0 korisnika ❌ (ili stari podaci)
Server.js:   Koristi JSON   ❌
```

## Rješenje - 2 opcije:

### OPCIJA 1: PRIVREMENI FIX (5 min)
Povratak korisnika u JSON dok ne završimo server.js integraciju

### OPCIJA 2: KOMPLETNA INTEGRACIJA (2-3 sata)
Ažuriranje server.js da koristi Prisma umjesto JSON

---

## 🔄 OPCIJA 1: BRZI PRIVREMENI FIX

### Korak 1: Export korisnika iz PostgreSQL nazad u JSON

```javascript
// scripts/migration/export-users-to-json.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

async function exportUsersToJson() {
    const users = await prisma.user.findMany({
        include: {
            roles: { include: { role: true } },
            agency: true
        }
    });

    // Transform to old JSON format
    const jsonFormat = {
        nextId: users.length + 1,
        users: users.map(u => ({
            id: Number(u.id),
            username: u.username,
            password_hash: u.passHash,
            role: u.roles[0]?.role.name || 'USER',
            ime: u.fullName?.split(' ')[0] || '',
            prezime: u.fullName?.split(' ').slice(1).join(' ') || '',
            email: u.email,
            agencija: u.agency?.code || null,
            agencija_naziv: u.agency?.name || null,
            aktivan: u.isActive,
            kreiran: u.createdAt.toISOString().split('T')[0],
            poslednje_logovanje: u.lastLogin?.toISOString() || null,
            created_by: null,
            mfa_enabled: u.mfaEnabled,
            mfa_secret: u.mfaSecret
        }))
    };

    const jsonPath = path.join(__dirname, '../../data/auth-users.json');
    await fs.writeFile(jsonPath, JSON.stringify(jsonFormat, null, 2));
    
    console.log('✅ Users exported to JSON');
}

exportUsersToJson()
    .then(() => prisma.$disconnect())
    .catch(console.error);
```

---

## 🚀 OPCIJA 2: KOMPLETNA INTEGRACIJA (PREPORUČENO)

Ažuriranje server.js da koristi Prisma - DAY 3 zadatak

### Promjene potrebne:

1. **Import Prisma**
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

2. **Zamjena readAuthData() i writeAuthData()**
```javascript
// STARO:
const data = readAuthData();
const user = data.users.find(u => u.username === username);

// NOVO:
const user = await prisma.user.findUnique({
    where: { username },
    include: { roles: { include: { role: true } } }
});
```

3. **Ažuriranje svih auth endpointa**

---

## 💡 PREPORUKA

**Za sada koristi OPCIJU 1** da aplikacija nastavi da radi, a sutra nastavimo sa Day 2 & Day 3 zadacima:

1. Day 2: Migrate operators & logs
2. Day 3: **Update server.js to use Prisma**
3. Day 4: Redis & sessions
4. Day 5: Testing & optimization

---

*Problem identification report - 2025-10-06*
