# 🎯 ATLAS Implementation Plan & TODO List

**Dokument:** `ATLAS_OPERATERI_STATUS_I_PLAN.md` (v3.2)  
**Datum:** 2025-10-05  
**Status:** 🟡 **In Progress**

---

## 📋 OVERALL PHASES

- [ ] **Phase 0: Production Readiness (Security Hardening)** `PRIORITY #1`
- [ ] **Phase 1: Core Infrastructure Setup**
- [ ] **Phase 2: Data Seeding & Migration**
- [ ] **Phase 3: Backend Refactoring & Integration**
- [ ] **Phase 4: Frontend Refactoring (Security)**
- [ ] **Phase 5: Finalization, Testing & Validation**

---

## ✅ DETAILED TASK CHECKLIST

### 🔴 Phase 0: Production Readiness (Security Hardening) - BLOKIRA PRODUKCIJU

> **Cilj:** Implementirati sve OBAVEZNE preduslove za produkciju.

- [x] **1. HTTPS/TLS Setup:** ⏳ PARTIAL
  - [ ] Postaviti Caddy/Nginx kao reverse proxy.
  - [ ] Konfigurisati TLS sertifikat (Let's Encrypt).
  - [ ] Osigurati HTTP -> HTTPS redirect.
  - [ ] Dodati HSTS header u `server.js` koristeći `helmet`.

- [x] **2. Environment Variables (.env):** ✅ COMPLETED
  - [x] Kreirati `.env` fajl.
  - [x] Premjestiti `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DATABASE_URL`, `REDIS_URL` iz koda u `.env`.
  - [x] Dodati `MFA_ENCRYPTION_KEY` u `.env`.
  - [x] Osigurati da je `.env` u `.gitignore`.
  - [x] Učitati varijable koristeći `dotenv` u `server.js`.

- [x] **3. Rate Limiting:** ✅ COMPLETED
  - [x] Instalirati `express-rate-limit` i `rate-limit-redis`.
  - [x] Konfigurisati rate limiting za login (5 pokušaja / 15 min).
  - [x] Konfigurisati globalni API rate limit (100 req/min).
  - [x] Primijeniti middleware na rute u `server.js`.

- [x] **4. Multi-Factor Authentication (MFA):** ✅ COMPLETED
  - [x] Instalirati `speakeasy` i `qrcode`.
  - [x] Implementirati logiku za generisanje QR koda i TOTP secreta.
  - [x] Kreirati UI za MFA setup u `moj-profil.html` / `moj-profil.js`.
  - [x] Ažurirati login flow (`auth.js`) da traži MFA kod ako je omogućen.
  - [x] Forsirati MFA za SUPERADMIN i ADMIN uloge.

- [ ] **5. HttpOnly Cookies & CSRF:**
  - [ ] Instalirati `cookie-parser` i `csurf`.
  - [ ] U `auth.js`, zamijeniti `localStorage` sa `res.cookie()` sa `HttpOnly`, `Secure`, `SameSite=strict` flagovima.
  - [ ] Ažurirati frontend (`auth.js`, `dashboard.js`, itd.) da koristi `credentials: 'include'` u `fetch` pozivima.
  - [ ] Implementirati CSRF token protection.
  - [ ] Implementirati Redis-based token revocation na logout.

- [ ] **6. Audit Log MVP:**
  - [ ] Kreirati `add-check-constraints.sql` skriptu sa `CHECK` constraintom za 4 grupe događaja.
  - [ ] Ažurirati `audit-logger.js` da koristi Prisma client i piše u `AuditLog` tabelu.
  - [ ] Osigurati da `metadata` prati definisanu šemu (before/after/changed_fields).
  - [ ] Implementirati `NO UPDATE/DELETE` trigger na `AuditLog` tabelu.

### 🟡 Phase 1: Core Infrastructure Setup

> **Cilj:** Postaviti i konfigurisati bazu podataka, cache i ORM.

- [ ] **1. PostgreSQL Setup:** ⏳ NEXT
  - [ ] Provjeriti da li je PostgreSQL 15+ instaliran (`psql --version`).
  - [ ] Kreirati `atlas_db` bazu.
  - [ ] Kreirati `atlas_user` korisnika sa `scram-sha-256` autentikacijom.
  - [ ] Konfigurisati `pg_hba.conf` da dozvoli konekciju.

- [ ] **2. Redis Setup:** ⏳ NEXT
  - [ ] Provjeriti da li je Redis 7+ instaliran (`redis-cli --version`).
  - [ ] Konfigurisati `redis.conf` sa `requirepass` i `maxmemory` politikom.

- [x] **3. Prisma Setup:** ✅ COMPLETED
  - [x] Instalirati `prisma` i `@prisma/client`.
  - [x] Inicijalizovati Prisma (`npx prisma init`). ✅ VEĆ POSTOJAO
  - [x] Popuniti `DATABASE_URL` u `.env` fajlu.
  - [x] Kopirati `prisma/schema.prisma` sa GitHub-a. ✅ VEĆ POSTOJAO
  - [x] Generisati Prisma Client (`npx prisma generate`).
  - [ ] Pokrenuti inicijalnu migraciju (`npx prisma migrate dev --name init`). ⏳ PENDING DB SETUP

### 🔵 Phase 2: Data Seeding & Migration

> **Cilj:** Popuniti bazu sa inicijalnim podacima i migrirati postojeće JSON podatke.

- [ ] **1. Seed Script (`prisma/seed.js`):**
  - [ ] Kreirati `prisma/seed.js`.
  - [ ] Dodati logiku za `upsert` uloga (SUPERADMIN, ADMIN, KORISNIK).
  - [ ] Dodati logiku za `upsert` centralne agencije.
  - [ ] Dodati logiku za `upsert` `superadmin` korisnika sa hash-ovanom lozinkom.
  - [ ] Pokrenuti seed skriptu.

- [ ] **2. User Migration:**
  - [ ] Ažurirati `scripts/migrate-users.js` (ako postoji) ili kreirati novi.
  - [ ] Skripta čita `data/auth-users.json`.
  - [ ] Za svakog korisnika, koristi `prisma.user.upsert` da ga doda u bazu.
  - [ ] Hash-ovati lozinke koristeći `argon2`.

- [ ] **3. Operator Migration (`scripts/migrate-operators.js`):**
  - [ ] Ažurirati `scripts/migrate-operators.js`.
  - [ ] Skripta čita `operateri.json`.
  - [ ] Koristiti transakciju (`prisma.$transaction`) za svakog operatera.
  - [ ] Koristiti `prisma.operator.upsert` na osnovu `code` (natural key).
  - [ ] Normalizovati i `upsert`-ovati `capabilities`, `endpoints`, `legal_bases`.

### 🟢 Phase 3: Backend Refactoring & Integration

> **Cilj:** Zamijeniti file-system baziranu logiku sa Prisma ORM.

- [ ] **1. Auth Service (`auth.js`):**
  - [ ] Zamijeniti `fs.readFile` za `auth-users.json` sa `prisma.user.findUnique`.
  - [ ] Ažurirati registraciju da koristi `prisma.user.create`.

- [ ] **2. Operator Logic (`server.js`):**
  - [ ] Zamijeniti `fs.readFile` za `operateri.json` i `operators/*.json` sa Prisma pozivima (`prisma.operator.findMany`, `prisma.operator.findUnique`).
  - [ ] Ažurirati `search` endpoint da koristi Prisma Full-Text Search ili `contains`.

- [ ] **3. User Management (`user-management.js`):**
  - [ ] Zamijeniti svu logiku za rad sa `auth-users.json` sa Prisma pozivima.

### 🟣 Phase 4: Frontend Refactoring (Security)

> **Cilj:** Ukloniti `localStorage` i prilagoditi frontend za rad sa HttpOnly cookies.

- [ ] **1. Ukloniti `localStorage`:**
  - [ ] Proći kroz sve `.js` fajlove (`auth.js`, `dashboard.js`, `moj-profil.js`, itd.).
  - [ ] Ukloniti sve `localStorage.setItem` i `localStorage.getItem` pozive vezane za tokene i korisničke podatke.

- [ ] **2. Ažurirati `fetch` pozive:**
  - [ ] Dodati `credentials: 'include'` u `headers` svih `fetch` poziva.
  - [ ] Implementirati mehanizam za dobavljanje i slanje CSRF tokena.

- [ ] **3. Ažurirati UI logiku:**
  - [ ] UI koji zavisi od podataka iz `localStorage` (npr. prikaz imena korisnika) mora sada te podatke dobiti sa servera (npr. `/api/me` endpoint).

### ⚪ Phase 5: Finalization, Testing & Validation

> **Cilj:** Osigurati da je sistem stabilan, siguran i spreman za produkciju.

- [ ] **1. Integration Testing:**
  - [ ] Testirati kompletan login flow (sa MFA).
  - [ ] Testirati CRUD operacije za korisnike i operatere.
  - [ ] Provjeriti da li se audit logovi ispravno kreiraju.

- [ ] **2. Security (Penetration) Testing:**
  - [ ] Pokrenuti OWASP ZAP ili sličan alat.
  - [ ] Testirati na SQL Injection, XSS, CSRF.
  - [ ] Provjeriti da li rate limiting radi.
  - [ ] Pokušati zaobići MFA.

- [ ] **3. Final Validation:**
  - [ ] Proći kroz kompletnu "Checklist za Production" iz glavnog plana.
  - [ ] Potvrditi da su svi OBAVEZNI preduslovi ispunjeni.
  - [ ] Kreirati finalni build/deployment paket.
