
# ATLAS Operateri — Trenutni opis i plan razvoja

**Projekat:** ATLAS (Advanced Telecommunication Legal Access System) — modul *Operateri* i osnovna autentikacija  
**Namjena:** Centralizovani, siguran i zakonski usklađen pristup *informacijama o telekom operaterima* za policijske agencije u BiH  
**Verzija dokumenta:** 1.0 (2025‑10‑05)

---

## 1) Sažetak (šta postoji danas i šta slijedi)

- **Danas:** Implementiran front‑end (Operateri katalog + login prototip), jasne uloge (SuperAdmin, Admin agencije, Operativni korisnik), početni UX obrasci i struktura podataka za operatere.
- **Slijedi (MVP):** Uvođenje **centralizovane baze** (korisnici, uloge, agencije, operateri, audit log), **RBAC egzekucija** na serveru, **audit log** (login, create/update/delete korisnika i operatera), te Admin GUI za korisnike, operatere i pregled logova.
- **Kasnije (Faza 2+):** Formulari za pretrage ka operaterima (CDR, IP/NAT, IPDR, lokacija) uz obavezno polje **Pravni osnov**, izvještaji, nadzor i analitika.

---

## 2) Trenutno stanje (2025‑10‑05)

### 2.1 Funkcionalnosti
- **Operateri (katalog):** prikaz, pretraga, detalji (usluge/tehnologije), struktura podataka spremna za import u DB.
- **Login (prototip):** obrasci, validacije, predispozicija za ulogu i “remember me” (za produkciju treba server‑side sesija/JWT, MFA itd.).
- **UI/UX:** responzivan dizajn, zajednički header, pomoć/FAQ koncept, pripremljeni stilovi za Admin stranice.

### 2.2 Ograničenja
- Nema **centralne baze** (podatke o operaterima trenutno drži front‑end/JSON).
- **RBAC** nije sproveden na **serveru** (trenutno je UI‑orijentisan).
- **Audit log** ne postoji kao *append‑only* evidencija u DB‑u.
- Nema *legal basis* (pravni osnov) entiteta i veza prema radnjama (za MVP admin radnje uglavnom bez osnova, ali za pretrage će biti obavezno).

---

## 3) Sigurnost i RBAC — najbolje prakse (MVP)

- **RBAC uloge:** `SUPERADMIN` (centralno), `ADMIN` (po agenciji), `KORISNIK` (operativni).  
  - Enforce RBAC **na serveru** (middleware/guard) nad svakoj ruti/akciji.
- **Autentikacija:** lozinke hashovane **Argon2id** (ili scrypt) + jedinstveni salt;  
  **MFA** (TOTP/OTP) *obavezno* za administratore; **rate‑limit** + progresivna kašnjenja.
- **Sesije/JWT:** kratki TTL, rotacija, opoziv (server‑side denylist); `HttpOnly`/`SameSite` kolačići kad su cookie‑based sesije.
- **Zaštita aplikacije:** CSRF (za cookie sesije), **CSP** i sigurni headeri, **TLS 1.3**; audit i alarmi na višestruke neuspješne prijave.
- **Mrežni pristup:** po mogućnosti **whitelist** (agencijski IP/VPN), izolovana admin zona.

---

## 4) Audit log (MVP obim koji tražiš)

**Šta logovati od starta:**
- **LOGIN_SUCCESS / LOGIN_FAILURE** (username, vrijeme, IP, user‑agent, razlog/ishod).
- **USER_CREATE / USER_UPDATE / USER_DELETE** (ko je uradio, nad kim, šta se promijenilo — maskirati osjetljiva polja).
- **OPERATOR_CREATE / OPERATOR_UPDATE / OPERATOR_DELETE** (ko, šta).

**Principi:**
- *Append‑only* (nema UPDATE/DELETE nad log zapisima).
- Standardna polja: ko, kada, odakle (IP/UA), šta (akcija i meta), ishod (SUCCESS/DENIED/ERROR), opcioni **legal_basis_id** (kasnije obavezno za pretrage).
- Indeksi za pregled po vremenu, akteru, akciji i meta entitetu.
- Periodični *hash snapshot* (dnevni) i/ili WORM skladište radi nepromjenjivosti.

---

## 5) Centralizovana baza — predložena minimalna šema (PostgreSQL)

> Napomena: centralna baza je za **konfiguracije i evidenciju** (korisnici, uloge, agencije, operateri, logovi, pravni osnov). **Nema** replikacije zadržanih/obračunskih podataka operatera — to ostaje kod operatera.

```sql
-- Agencije (tenant izolacija)
CREATE TABLE agency (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL UNIQUE,
  code       VARCHAR(50)  NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Uloge
CREATE TABLE role (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- Korisnici
CREATE TABLE app_user (
  id           BIGSERIAL PRIMARY KEY,
  agency_id    BIGINT REFERENCES agency(id),
  username     VARCHAR(150) NOT NULL UNIQUE,
  pass_hash    TEXT NOT NULL,                  -- Argon2id
  email        VARCHAR(255),
  full_name    VARCHAR(255),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mapiranje korisnik↔uloga
CREATE TABLE user_role (
  user_id BIGINT REFERENCES app_user(id) ON DELETE CASCADE,
  role_id BIGINT REFERENCES role(id)     ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Operater
CREATE TABLE operator (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL UNIQUE,
  description   TEXT,
  api_base_url  TEXT,
  contact_email VARCHAR(255),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sposobnosti operatera (CDR, IPDR, NAT, LOCATION…)
CREATE TABLE operator_capability (
  id          BIGSERIAL PRIMARY KEY,
  operator_id BIGINT REFERENCES operator(id) ON DELETE CASCADE,
  capability  VARCHAR(100) NOT NULL,
  UNIQUE (operator_id, capability)
);

-- Endpointi operatera (verzionisani)
CREATE TABLE operator_endpoint (
  id          BIGSERIAL PRIMARY KEY,
  operator_id BIGINT REFERENCES operator(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,    -- npr. NAT_LOOKUP
  method      VARCHAR(10)  NOT NULL,    -- GET/POST
  path        TEXT NOT NULL,            -- /api/v1/nat/lookup
  version     VARCHAR(20)  NOT NULL,    -- v1, v2…
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (operator_id, name, version)
);

-- Pravni osnov
CREATE TABLE legal_basis (
  id           BIGSERIAL PRIMARY KEY,
  reference_no VARCHAR(200) NOT NULL,   -- broj akta
  issuer       VARCHAR(200),
  issued_at    DATE,
  description  TEXT
);

-- Audit akcije za MVP
CREATE TYPE audit_action AS ENUM (
  'LOGIN_SUCCESS','LOGIN_FAILURE',
  'USER_CREATE','USER_UPDATE','USER_DELETE',
  'OPERATOR_CREATE','OPERATOR_UPDATE','OPERATOR_DELETE'
);

-- Audit log (append-only)
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_user_id   BIGINT REFERENCES app_user(id),
  actor_agency_id BIGINT REFERENCES agency(id),
  action          audit_action NOT NULL,
  target_type     VARCHAR(50),          -- 'USER','OPERATOR'
  target_id       BIGINT,
  legal_basis_id  BIGINT REFERENCES legal_basis(id),
  ip_address      INET,
  user_agent      TEXT,
  details         JSONB,                -- { "before": {...}, "after": {...} }
  outcome         VARCHAR(20) NOT NULL  -- 'SUCCESS','DENIED','ERROR'
);

-- Indeksi
CREATE INDEX ON audit_log (occurred_at DESC);
CREATE INDEX ON audit_log (actor_user_id, occurred_at DESC);
CREATE INDEX ON audit_log (action, occurred_at DESC);
CREATE INDEX ON audit_log (target_type, target_id, occurred_at DESC);
```

---

## 6) Plan migracije (korak‑po‑korak)

1. **Inicijalne migracije (Alembic/Prisma/Flyway):** kreiraj tabele iz poglavlja 5.  
2. **Seed osnovnih podataka:** tri uloge; jedna centralna agencija; jedan SuperAdmin.  
3. **Import operatera:** parsiraj postojeći `operateri.json` → `operator` + `operator_capability`.  
4. **Auth & RBAC:** poveži login na `app_user`, uvedi MFA za admine, implementiraj RBAC middleware/guard.  
5. **Audit middleware:** zakači na login i CRUD rute (`user*`, `operator*`) i piši u `audit_log`.  
6. **Admin GUI:** stranice za korisnike, operatere i pregled logova (filteri, paginacija, export CSV).  
7. **Pravni osnov (osnova MVP):** entitet postoji; za admin radnje opciono, za buduće pretrage obavezno.  
8. **Sigurnosni sloj:** TLS, sigurni headeri, rate‑limit, IP/VPN whitelist za admin.  
9. **Backup & Retention:** dnevne kopije DB‑a; retention politike za `audit_log`; dnevni hash‑snapshot dump logova.  
10. **QA/Test:** unit + integration testovi; “seed” test agencije/korisnika; smoke test skripte.

---

## 7) Roadmap (poslije MVP‑a)

- **Faza 2:** forme za pretrage (CDR, IP/NAT, IPDR, lokacija) s obaveznim *Pravnim osnovom* i automatskim auditom svake radnje.  
- **Faza 3:** dashboardi za agencijske admine (aktivnosti korisnika, mjesečni audit izvještaji, health konekcija prema operaterima).  
- **Faza 4:** monitoring latencija i retry strategije, health‑checks ka operaterima, alarmi.  
- **Faza 5:** analitika i vizualizacije (graf veza, geo‑prikazi), napredna kontrola pristupa (attributive ABAC), revizorski exporti.

---

## 8) Check‑lista za kvalitet i sigurnost (MVP)

- [ ] Argon2id hash + MFA za admine  
- [ ] RBAC guard na svakoj ruti/akciji  
- [ ] Audit log: login + CRUD (user/operator)  
- [ ] TLS 1.3, sigurni headeri, rate‑limit, IP/VPN whitelist  
- [ ] Admin GUI: Users / Operators / Logs  
- [ ] Dnevni backup + hash‑snapshot logova  
- [ ] Testovi (unit + integration) + seed podaci

---

**Kontakt / napomena:** Ovaj dokument je “živ”. Kako MVP bude implementiran, ažuriraće se sa verzijama šeme, migracijama i operativnim procedurama (RBAC matrice, SOP‑ovi i planovi revizije).
