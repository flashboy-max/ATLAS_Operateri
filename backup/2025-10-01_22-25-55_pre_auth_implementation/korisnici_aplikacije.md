# 🔐 ATLAS - Sistem autentikacije i autorizacije

## 📋 Pregled sistema

ATLAS aplikacija koristi **role-based access control (RBAC)** sistem sa tri nivoa pristupa i obaveznom autentikacijom za sve korisnike.

---

## 👥 Korisničke role i privilegije

### 🔴 **SUPERADMIN** (Najviši nivo pristupa)

**Ključne karakteristike:**
- Potpuna kontrola nad aplikacijom i svim korisnicima
- Jedini koji može kreirati/brisati SUPERADMIN i ADMIN naloge
- Pristup svim audit logovima i aktivnostima

**Privilegije:**

#### Upravljanje korisnicima
- ✅ Kreiranje novih korisnika (sve role: SUPERADMIN, ADMIN, KORISNIK)
- ✅ Kreiranje korisnika **za bilo koju policijsku agenciju** (bira agenciju sa dropdown-a)
- ✅ Izmena korisničkih podataka (svi korisnici - SUPERADMIN, ADMIN, KORISNIK)
- ✅ Brisanje korisnika (svi korisnici)
- ✅ Resetovanje lozinki (svi korisnici)
- ✅ Aktivacija/deaktivacija naloga (svi korisnici)
- ✅ Pregled liste svih korisnika sa filterima po roli i agenciji
- ✅ Pregled detalja svakog korisnika (last login, broj aktivnosti, agencija, itd.)

#### Upravljanje operaterima
- ✅ Dodavanje novih operatera
- ✅ Izmena postojećih operatera
- ✅ Brisanje operatera
- ✅ Pregled svih operatera (sve funkcionalnosti pregleda)
- ✅ Uvoz/izvoz podataka (JSON import/export)
- ✅ Bulk operacije nad operaterima

#### Audit i izveštaji
- ✅ Pristup kompletnom audit logu (sve aktivnosti svih korisnika)
- ✅ Filtriranje audit loga po: korisnik, datum, tip akcije, operator
- ✅ Izvoz audit izveštaja (PDF, CSV, JSON)
- ✅ Pregled login statistike (broj logovanja, poslednji pristup, neuspeli pokušaji)
- ✅ Dashboard sa statistikama: broj korisnika po roli, aktivni korisnici, broj izmena operatera

#### Sistemske postavke
- ✅ Konfiguracija sistema (timeout sesije, sigurnosne politike)
- ✅ Backup i restore baze podataka
- ✅ Pregled sistemskih logova

---

### 🟠 **ADMIN** (Srednji nivo pristupa)

**Ključne karakteristike:**
- Upravljanje korisnicima koje je samo on kreirao (ne može upravljati SUPERADMIN-ima niti drugim admin-ima)
- Samo pregled operatera (read-only)
- Pristup audit logu samo za svoje kreiranje korisnika

**Privilegije:**

#### Upravljanje korisnicima
- ✅ Kreiranje novih korisnika (samo rola: KORISNIK)
- ✅ Novi korisnici **automatski pripadaju istoj agenciji** kao i ADMIN
- ✅ Izmena **samo svojih korisnika** (koje je on kreirao)
- ✅ Resetovanje lozinki za svoje korisnike
- ✅ Aktivacija/deaktivacija svojih korisnika
- ❌ **NE MOŽE** brisati korisnike (ni svoje ni tuđe)
- ❌ **NE MOŽE** kreirati/menjati SUPERADMIN i ADMIN naloge
- ❌ **NE MOŽE** menjati korisnika koje su kreirali drugi ADMIN-i ili SUPERADMIN
- ✅ Pregled liste **samo korisnika koje je kreirao**

#### Upravljanje operaterima
- ✅ Dodavanje novih operatera
- ✅ Izmena postojećih operatera
- ✅ Brisanje operatera
- ✅ Pregled svih operatera (sve funkcionalnosti pregleda)
- ✅ Uvoz/izvoz podataka (JSON import/export)

#### Audit i izveštaji
- ✅ Pristup audit logu **samo za korisnike koje je kreirao**
- ✅ Pregled aktivnosti svojih korisnika (šta su radili, kada)
- ✅ Login statistika za svoje korisnike
- ❌ **NE MOŽE** videti aktivnosti drugih ADMIN-a ili SUPERADMIN-a niti njoovih korisnika
- ❌ **NE MOŽE** videti kompletnu sistemsku statistiku

#### Sistemske postavke
- ❌ Nema pristup sistemskim postavkama

---

### 🟢 **KORISNIK** (Osnovni nivo pristupa)

**Ključne karakteristike:**
- Samo pregled operatera (read-only)
- Može menjati svoju lozinku
- Nema pristup korisničkom upravljanju

**Privilegije:**

#### Upravljanje korisnicima
- ❌ **NE MOŽE** kreirati nove korisnike
- ❌ **NE MOŽE** menjati podatke drugih korisnika
- ✅ Može menjati **svoju lozinku** (obavezno kroz profil)
  - *Validacija lozinke:*
    - *Minimalna dužina: 8 karaktera*
    - *Mora sadržati: veliko slovo, malo slovo, broj, specijalan karakter*
- ✅ Pregled svog profila (username, email, last login, datum kreiranja)

#### Upravljanje operaterima
- ✅ Pregled svih operatera (tabela, detalji)
- ✅ Pretraga i filtriranje operatera
- ✅ Izvoz liste operatera (samo pregled, samo izvoz readonly podataka)
- ❌ **NE MOŽE** dodavati nove operatere
- ❌ **NE MOŽE** menjati postojeće operatere
- ❌ **NE MOŽE** brisati operatere
- ❌ **NE MOŽE** uvoziti podatke (JSON import blokiran)

#### Audit i izveštaji
- ✅ Pregled **svoje aktivnosti** (šta je pregledao, kada se logovao)
- ❌ **NE MOŽE** videti aktivnosti drugih korisnika
- ❌ **NE MŮŽE** videti audit log

#### Sistemske postavke
- ❌ Nema pristup sistemskim postavkama

---

## 🔐 Autentikacija - Login sistem

### Login stranica (Obavezna za sve)

**Dizajn i funkcionalnost:**
```
┌─────────────────────────────────────────┐
│                                         │
│         🛰️ ATLAS                        │
│   Telekomunikacioni operateri BiH       │
│                                         │
│   ┌───────────────────────────────┐    │
│   │ 👤 Korisničko ime             │    │
│   └───────────────────────────────┘    │
│                                         │
│   ┌───────────────────────────────┐    │
│   │ 🔒 Lozinka              [👁️]  │    │
│   └───────────────────────────────┘    │
│                                         │
│   [ ✓ Zapamti me ]                     │
│                                         │
│   ┌───────────────────────────────┐    │
│   │      🔓 PRIJAVI SE            │    │
│   └───────────────────────────────┘    │
│                                         │
│   Zaboravili ste lozinku?              │
│                                         │
└─────────────────────────────────────────┘
```

**Funkcionalnosti:**
- Obavezni kredencijali: korisničko ime + lozinka
- "Zapamti me" opcija (7 dana sesije)
- "Zaboravili ste lozinku?" link (slanje reset linka na email)
- Zaštita od brute-force napada (3 neuspela pokušaja = 5 min pauza)
- Session timeout: 30 minuta neaktivnosti

**Sigurnost:**
- Lozinke se čuvaju kao bcrypt hash (nikad plain text)
- JWT token za sesiju (HttpOnly cookie)
- HTTPS obavezan u produkciji
- Rate limiting na login endpoint (max 5 pokušaja/minut)

---

## 🚪 Protok autentikacije

### 1. Pristup aplikaciji (prvi put ili logout)
```
Korisnik → Login stranica → Unos kredencijala → Validacija → Welcome Message → Dashboard
```

**Welcome Message (Prikazuje se 3 sekunde nakon uspešnog logovanja):**

**KORISNIK Welcome Message:**
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│                   ✅ Uspešno ste se prijavili             │
│                                                           │
│            Dobrodošli, Amina Softić                       │
│                                                           │
│          🏛️ MUP Kantona Sarajevo (MUP KS)                 │
│          👨‍💼 Administrator: Emir Husić (admin_mup_ks)     │
│          📧 emir.husic@mup.ks.gov.ba                      │
│          ☎️  +387 61 555 111                               │
│                                                           │
│          Učitavanje podataka...                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**ADMIN Welcome Message:**
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│                   ✅ Uspešno ste se prijavili             │
│                                                           │
│            Dobrodošli, Emir Husić                         │
│                                                           │
│          🏛️ MUP Kantona Sarajevo (MUP KS)                 │
│          👨‍💼 Upravljate sa 3 korisnika                   │
│                                                           │
│          Učitavanje podataka...                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**SUPERADMIN Welcome Message:**
```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│                   ✅ Uspešno ste se prijavili             │
│                                                           │
│            Dobrodošli, SUPERADMIN                         │
│                                                           │
│          Učitavanje sistema...                            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Sadržaj poruke zavisi od role:**
- **SUPERADMIN**: Samo ime + "Učitavanje sistema..."
- **ADMIN**: Ime + Agencija (sa skraćenicom) + Broj korisnika koje upravlja
- **KORISNIK**: Ime + Agencija (sa skraćenicom) + Info o ADMIN-u (ime, username, email, telefon)

### 2. Već ulogovan korisnik
```
Korisnik → Provera JWT tokena → Validacija sesije → Dashboard
```

### 3. Neautorizovan pristup
```
Korisnik pokušava direktan link → Provera JWT → Nema tokena → Redirekcija na Login
```

### 4. Token istekao
```
Korisnik u aplikaciji → Token expired → Auto logout → Login stranica sa porukom
```

---

## 📱 UI/UX prema roli korisnika

### Header navigacija prema roli

#### SUPERADMIN Header
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🛰️ ATLAS | Operateri BiH                    [👤 superadmin (SUPERADMIN) ▼]│
└──────────────────────────────────────────────────────────────────────────┘
```

#### ADMIN Header
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🛰️ ATLAS | Operateri BiH              [👤 Emir Husić (MUP KS) ▼]         │
└──────────────────────────────────────────────────────────────────────────┘
```

#### KORISNIK Header
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🛰️ ATLAS | Operateri BiH           [👤 Amina Softić (MUP KS) ▼]          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Format prikaza:**
- **SUPERADMIN**: `Ime Korisnika (SUPERADMIN)`
- **ADMIN/KORISNIK**: `Ime Prezime (Skraćenica Agencije)`

**Dropdown meni (klik na ime korisnika):**
- **Profil** (sve role) - Prikazuje agenciju, admin kontakt, itd.
- **Korisnici** (samo SUPERADMIN i ADMIN)
- **Audit log** (samo SUPERADMIN, ADMIN vidi svoje korisnike)
- **Postavke** (samo SUPERADMIN)
- **Odjavi se** (sve role)

---

### Dashboard prema roli

#### SUPERADMIN Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Dashboard                                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [📈 Statistika]  [👥 Korisnici]  [🛰️ Operateri]  [📋 Audit]│
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ 👥 Korisnici│  │ 🛰️ Operateri│  │ 🔒 Pristup  │     │
│  │     15      │  │     31      │  │  534 logs   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  [+ Dodaj korisnika]  [+ Dodaj operatera]  [📥 Backup]  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### ADMIN Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Dashboard                                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [👥 Moji korisnici]  [🛰️ Operateri]  [📋 Moj Audit]     │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │ 👥 Korisnici│  │ 🛰️ Operateri│                       │
│  │      5      │  │     31      │                       │
│  └─────────────┘  └─────────────┘                       │
│                                                          │
│  [+ Dodaj korisnika]  [+ Dodaj operatera]               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### KORISNIK Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Dashboard                                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [🛰️ Operateri]  [👤 Moj profil]                         │
│                                                          │
│  ┌─────────────┐                                         │
│  │ 🛰️ Operateri│                                         │
│  │     31      │                                         │
│  └─────────────┘                                         │
│                                                          │
│  [🔍 Pretraži operatere]                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### Forme za kreiranje korisnika

#### Forma za SUPERADMIN (sa izborom agencije i svih rola)

```
┌──────────────────────────────────────────────────────────────┐
│ ➕ Dodaj novog korisnika (SUPERADMIN)                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ 📝 OSNOVNI PODACI                                            │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Ime i prezime: *     [_________________________]       │  │
│ │ Korisničko ime: *    [_________________________]       │  │
│ │ Email: *             [_________________________]       │  │
│ │ Telefon:             [_________________________]       │  │
│ │ Početna lozinka: *   [_________________________] [👁️]  │  │
│ │                                                         │  │
│ │ ℹ️ Validacija lozinke:                                  │  │
│ │    • Minimalna dužina: 8 karaktera                     │  │
│ │    • Mora sadržati: veliko slovo, malo slovo, broj,    │  │
│ │      specijalan karakter                               │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ 🏛️ POLICIJSKA AGENCIJA *                                     │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Izaberite agenciju: [▼ Izaberi agenciju .............]│  │
│ │                                                         │  │
│ │ • SIPA                                                 │  │
│ │ • GP BiH                                               │  │
│ │ • FUP                                                  │  │
│ │ • MUP RS                                               │  │
│ │ • PBD BiH                                              │  │
│ │ • MUP KS                                               │  │
│ │ • MUP TK                                               │  │
│ │ • MUP ZDK                                              │  │
│ │ • MUP USK                                              │  │
│ │ • MUP HNK                                              │  │
│ │ • MUP SBK                                              │  │
│ │ • MUP ZHK                                              │  │
│ │ • MUP BPK                                              │  │
│ │ • MUP PK                                               │  │
│ │ • MUP K10                                              │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ 👤 ROLA *                                                     │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Tip korisnika:                                         │  │
│ │  ( ) SUPERADMIN - Potpuna kontrola sistema            │  │
│ │  ( ) ADMIN   - Upravlja korisnicima svoje agencije    │  │
│ │  (•) KORISNIK - Samo pregled operatera (read-only)    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ 📧 OBAVJEŠTENJE                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [✓] Pošalji email sa pristupnim podacima              │  │
│ │     (Username i privremena lozinka)                    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│         [Otkaži]              [Sačuvaj korisnika]            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Privilegije SUPERADMIN-a pri kreiranju:**
- ✅ Može kreirati **sve role**: SUPERADMIN, ADMIN, KORISNIK
- ✅ Može **birati bilo koju policijsku agenciju** sa dropdown liste
- ✅ Može kreirati korisnike **za sve agencije** (ne samo svoju)
- ✅ Može **zamijeniti ili kreirati novog ADMIN-a** za bilo koju agenciju

---

#### Forma za ADMIN (bez izbora agencije, samo KORISNIK rola)

```
┌──────────────────────────────────────────────────────────────┐
│ ➕ Dodaj novog korisnika (ADMIN)                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ 📝 OSNOVNI PODACI                                            │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Ime i prezime: *     [_________________________]       │  │
│ │ Korisničko ime: *    [_________________________]       │  │
│ │ Email: *             [_________________________]       │  │
│ │ Telefon:             [_________________________]       │  │
│ │ Početna lozinka: *   [_________________________] [👁️]  │  │
│ │                                                         │  │
│ │ ℹ️ Validacija lozinke:                                  │  │
│ │    • Minimalna dužina: 8 karaktera                     │  │
│ │    • Mora sadržati: veliko slovo, malo slovo, broj,    │  │
│ │      specijalan karakter                               │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ 🏛️ POLICIJSKA AGENCIJA                                       │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Agencija: MUP Kantona Sarajevo (MUP KS)               │  │
│ │ ⓘ Novi korisnik automatski pripada vašoj agenciji     │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ 👤 ROLA                                                       │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Tip korisnika: KORISNIK (Read-only)                   │  │
│ │ ⓘ Možete kreirati samo KORISNIK nalog                 │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│ 📧 OBAVJEŠTENJE                                               │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [✓] Pošalji email sa pristupnim podacima              │  │
│ │     (Username i privremena lozinka)                    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                               │
│         [Otkaži]              [Sačuvaj korisnika]            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Ograničenja ADMIN-a pri kreiranju:**
- ⚠️ **NE MOŽE** birati agenciju - automatski se dodeljuje njegova agencija
- ⚠️ **NE MOŽE** birati rolu - uvek kreira samo **KORISNIK** nalog
- ⚠️ **NE MOŽE** kreirati ADMIN ili SUPERADMIN naloge
- ✅ Svi korisnici koje kreira **automatski pripadaju njegovoj agenciji**

---

### Izmena postojećih korisnika - Pravila pristupa

#### SUPERADMIN može menjati:
- ✅ **Sve SUPERADMIN-e** (sve podatke: ime, email, telefon, agenciju, rolu)
- ✅ **Sve ADMIN-e** (sve podatke: ime, email, telefon, agenciju, rolu)
- ✅ **Sve KORISNIKE** (sve podatke: ime, email, telefon, agenciju, rolu)
- ✅ Može **promeniti agenciju** bilo kom korisniku (prebaciti ga u drugu agenciju)
- ✅ Može **promeniti rolu** bilo kom korisniku (unaprediti/degradirati)
- ✅ Može **resetovati lozinku** bilo kom korisniku
- ✅ Može **aktivirati/deaktivirati** bilo koji nalog

#### ADMIN može menjati:
- ✅ **Samo KORISNIKE koje je on kreirao** (samo svoje korisnike)
- ✅ Može menjati: ime, email, telefon, lozinku
- ❌ **NE MOŽE** menjati agenciju korisnika (uvek ostaje njegova agencija)
- ❌ **NE MOŽE** menjati rolu korisnika (uvek ostaje KORISNIK)
- ❌ **NE MOŽE** menjati SUPERADMIN-e
- ❌ **NE MOŽE** menjati druge ADMIN-e
- ❌ **NE MOŽE** menjati KORISNIKE koje su kreirali drugi ADMIN-i ili SUPERADMIN
- ✅ Može **resetovati lozinku** svojim korisnicima
- ✅ Može **aktivirati/deaktivirati** svoje korisnike

#### KORISNIK može menjati:
- ✅ **Samo svoju lozinku** (kroz profil)
- ❌ **NE MOŽE** menjati svoje ime, email, telefon (mora tražiti ADMIN-a)
- ❌ **NE MOŽE** menjati svoju agenciju
- ❌ **NE MOŽE** menjati svoju rolu
- ❌ **NE MOŽE** menjati druge korisnike

**UI implementacija:**
- U listi korisnika, prikazati dugme "Izmeni" samo za one korisnike koje trenutni korisnik **ima pravo da menja**
- ADMIN vidi "Izmeni" samo pored svojih kreiranog korisnika
- SUPERADMIN vidi "Izmeni" pored svih korisnika

---

### Profil stranica - Prikaz informacija o agenciji

#### ADMIN Profil
```
┌───────────────────────────────────────────────────────────────────┐
│ 👤 Moj profil                                                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│ 📝 OSNOVNI PODACI                                                 │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Ime i prezime:      Emir Husić                              │  │
│ │ Korisničko ime:     admin_mup_ks                            │  │
│ │ Email:              emir.husic@mup.ks.gov.ba                │  │
│ │ Telefon:            +387 61 555 111                         │  │
│ │ Rola:               ADMIN                                   │  │
│ │ Status:             ✅ Aktivan                              │  │
│ │ Član od:            01.03.2025                              │  │
│ │ Poslednja prijava:  01.10.2025 u 09:15                     │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ 🏛️ POLICIJSKA AGENCIJA                                            │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Naziv agencije:     MUP Kantona Sarajevo                    │  │
│ │ Skraćenica:         MUP KS                                  │  │
│ │ Tip:                Kantonalni                              │  │
│ │ Adresa:             -                                       │  │
│ │ Telefon:            -                                       │  │
│ │ Email:              atlas@mup.ks.gov.ba                     │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ 👥 MOJI KORISNICI                                                 │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Kreirano korisnika:  4                                      │  │
│ │ Aktivni:             4                                      │  │
│ │ Neaktivni:           0                                      │  │
│ │                                                              │  │
│ │ [Pregled svih mojih korisnika]                              │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ 🔒 SIGURNOST                                                       │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ [🔑 Promeni lozinku]                                         │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

#### KORISNIK Profil
```
┌───────────────────────────────────────────────────────────────────┐
│ 👤 Moj profil                                                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│ 📝 OSNOVNI PODACI                                                 │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Ime i prezime:      Amina Softić                            │  │
│ │ Korisničko ime:     korisnik_amina_ks                       │  │
│ │ Email:              amina.softic@mup.ks.gov.ba              │  │
│ │ Telefon:            +387 61 222 333                         │  │
│ │ Rola:               KORISNIK                                │  │
│ │ Status:             ✅ Aktivan                              │  │
│ │ Član od:            05.04.2025                              │  │
│ │ Poslednja prijava:  01.10.2025 u 10:00                     │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ 🏛️ POLICIJSKA AGENCIJA                                            │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Naziv agencije:     MUP Kantona Sarajevo                    │  │
│ │ Skraćenica:         MUP KS                                  │  │
│ │ Tip:                Kantonalni                              │  │
│ │ Adresa:             -                                       │  │
│ │ Telefon:            -                                       │  │
│ │ Email:              atlas@mup.ks.gov.ba                     │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ 👨‍💼 KONTAKT - ADMINISTRATOR NALOGA                                │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ ⚠️ Za pitanja vezana za pristup, promenu podataka ili       │  │
│ │    tehničke probleme, kontaktirajte svog administratora:    │  │
│ │                                                              │  │
│ │ 👤 Ime i prezime:   Emir Husić                              │  │
│ │ 💼 Username:        admin_mup_ks                            │  │
│ │ 📧 Email:           emir.husic@mup.ks.gov.ba                │  │
│ │ ☎️  Telefon:         +387 61 555 111                         │  │
│ │                                                              │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ 🔒 SIGURNOST                                                       │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ [🔑 Promeni lozinku]                                         │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

**Ključne razlike:**
- **ADMIN** vidi statistiku svojih korisnika + link ka njima
- **KORISNIK** vidi **kontakt svog ADMIN-a** sa opcijom direktnog slanja email-a
- Obe role vide informacije o svojoj policijskoj agenciji

---

## � Policijske agencije (Organizaciona struktura)

### Koncept

Svaki **ADMIN** i **KORISNIK** pripada specifičnoj policijskoj agenciji. Kada se loguju, vide:
- 🏛️ **Naziv svoje agencije**
- 👤 **Username svog ADMIN-a** (osoba zadužena za njihove naloge)
- 📧 **Email kontakt ADMIN-a**
- ☎️ **Telefon kontakt ADMIN-a**

Ovo omogućava korisnicima da znaju kome se obratiti u slučaju problema sa pristupom ili potrebe za izmenom podataka.

### Struktura agencija (agencije.json)

```json
{
  "agencije": [
    {
      "id": 1,
      "naziv": "Agencija za istrage i zaštitu Bosne i Hercegovine",
      "skracenica": "SIPA",
      "tip": "državni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@sipa.gov.ba",
      "aktivan": true
    },
    {
      "id": 2,
      "naziv": "Granična policija Bosne i Hercegovine",
      "skracenica": "GP BiH",
      "tip": "državni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@gpbih.gov.ba",
      "aktivan": true
    },
    {
      "id": 3,
      "naziv": "Federalna uprava policije",
      "skracenica": "FUP",
      "tip": "entitetski",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@fup.gov.ba",
      "aktivan": true
    },
    {
      "id": 4,
      "naziv": "Ministarstvo unutrašnjih poslova Republike Srpske",
      "skracenica": "MUP RS",
      "tip": "entitetski",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@muprs.org",
      "aktivan": true
    },
    {
      "id": 5,
      "naziv": "Policija Brčko distrikta BiH",
      "skracenica": "PBD BiH",
      "tip": "distriktski",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@brcko.gov.ba",
      "aktivan": true
    },
    {
      "id": 6,
      "naziv": "Ministarstvo unutrašnjih poslova Kantona Sarajevo",
      "skracenica": "MUP KS",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.ks.gov.ba",
      "aktivan": true
    },
    {
      "id": 7,
      "naziv": "Ministarstvo unutrašnjih poslova Tuzlanskog kantona",
      "skracenica": "MUP TK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.tk.gov.ba",
      "aktivan": true
    },
    {
      "id": 8,
      "naziv": "Ministarstvo unutrašnjih poslova Zeničko-dobojskog kantona",
      "skracenica": "MUP ZDK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.zdk.gov.ba",
      "aktivan": true
    },
    {
      "id": 9,
      "naziv": "Ministarstvo unutrašnjih poslova Unsko-sanskog kantona",
      "skracenica": "MUP USK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.usk.gov.ba",
      "aktivan": true
    },
    {
      "id": 10,
      "naziv": "Ministarstvo unutrašnjih poslova Hercegovačko-neretvanskog kantona",
      "skracenica": "MUP HNK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.hnk.gov.ba",
      "aktivan": true
    },
    {
      "id": 11,
      "naziv": "Ministarstvo unutrašnjih poslova Srednjobosanskog kantona",
      "skracenica": "MUP SBK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.sbk.gov.ba",
      "aktivan": true
    },
    {
      "id": 12,
      "naziv": "Ministarstvo unutrašnjih poslova Zapadnohercegovačkog kantona",
      "skracenica": "MUP ZHK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.zhk.gov.ba",
      "aktivan": true
    },
    {
      "id": 13,
      "naziv": "Ministarstvo unutrašnjih poslova Bosansko-podrinjskog kantona Goražde",
      "skracenica": "MUP BPK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.bpk.gov.ba",
      "aktivan": true
    },
    {
      "id": 14,
      "naziv": "Ministarstvo unutrašnjih poslova Posavskog kantona",
      "skracenica": "MUP PK",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.pk.gov.ba",
      "aktivan": true
    },
    {
      "id": 15,
      "naziv": "Ministarstvo unutrašnjih poslova Kantona 10",
      "skracenica": "MUP K10",
      "tip": "kantonalni",
      "glavni_admin_id": null,
      "adresa": "",
      "telefon": "",
      "email": "atlas@mup.k10.gov.ba",
      "aktivan": true
    }
  ]
}
```

**Tipovi agencija:**
- `državni` - Državne institucije (SIPA, GP BiH)
- `entitetski` - Entitetski nivo (FUP, MUP RS)
- `distriktski` - Brčko Distrikt (PBD BiH)
- `kantonalni` - Kantonalni MUP-ovi (10 kantona u FBiH)

**Napomena:** `glavni_admin_id` je `null` jer će svaka agencija moći imati više ADMIN-ova, a ne samo jednog glavnog.

---

## �🗂️ Struktura korisničkih podataka

### JSON struktura (korisnici.json)
```json
{
  "korisnici": [
    {
      "id": 1,
      "username": "superadmin",
      "email": "admin@atlas.ba",
      "password_hash": "$2b$10$...", 
      "rola": "SUPERADMIN",
      "agencija_id": null,
      "kreiran_od": null,
      "kreiran_datum": "2025-01-15T10:00:00Z",
      "poslednji_login": "2025-10-01T14:30:00Z",
      "aktivan": true,
      "kreirao_korisnika": [2, 3, 5, 8, 11],
      "broj_logovanja": 156,
      "neuspeli_pokusaji": 0
    },
    {
      "id": 2,
      "username": "admin_sipa",
      "ime_prezime": "Marko Marković",
      "email": "marko.markovic@sipa.gov.ba",
      "telefon": "+387 61 123 456",
      "password_hash": "$2b$10$...",
      "rola": "ADMIN",
      "agencija_id": 1,
      "kreiran_od": 1,
      "kreiran_datum": "2025-02-20T09:00:00Z",
      "poslednji_login": "2025-09-30T16:45:00Z",
      "aktivan": true,
      "kreirao_korisnika": [3, 4],
      "broj_logovanja": 89,
      "neuspeli_pokusaji": 0
    },
    {
      "id": 3,
      "username": "korisnik_ana_sipa",
      "ime_prezime": "Ana Anić",
      "email": "ana.anic@sipa.gov.ba",
      "telefon": "+387 61 234 567",
      "password_hash": "$2b$10$...",
      "rola": "KORISNIK",
      "agencija_id": 1,
      "kreiran_od": 2,
      "kreiran_datum": "2025-03-10T11:30:00Z",
      "poslednji_login": "2025-10-01T08:15:00Z",
      "aktivan": true,
      "kreirao_korisnika": [],
      "broj_logovanja": 45,
      "neuspeli_pokusaji": 0
    },
    {
      "id": 4,
      "username": "admin_mup_ks",
      "ime_prezime": "Emir Husić",
      "email": "emir.husic@mup.ks.gov.ba",
      "telefon": "+387 61 555 111",
      "password_hash": "$2b$10$...",
      "rola": "ADMIN",
      "agencija_id": 6,
      "kreiran_od": 1,
      "kreiran_datum": "2025-03-01T10:00:00Z",
      "poslednji_login": "2025-10-01T09:15:00Z",
      "aktivan": true,
      "kreirao_korisnika": [6, 7, 8],
      "broj_logovanja": 72,
      "neuspeli_pokusaji": 0
    },
    {
      "id": 5,
      "username": "admin_mup_rs",
      "ime_prezime": "Petar Petrović",
      "email": "petar.petrovic@muprs.org",
      "telefon": "+387 65 987 654",
      "password_hash": "$2b$10$...",
      "rola": "ADMIN",
      "agencija_id": 4,
      "kreiran_od": 1,
      "kreiran_datum": "2025-02-25T10:00:00Z",
      "poslednji_login": "2025-09-29T17:20:00Z",
      "aktivan": true,
      "kreirao_korisnika": [9, 10, 12],
      "broj_logovanja": 67,
      "neuspeli_pokusaji": 0
    },
    {
      "id": 6,
      "username": "korisnik_amina_ks",
      "ime_prezime": "Amina Softić",
      "email": "amina.softic@mup.ks.gov.ba",
      "telefon": "+387 61 222 333",
      "password_hash": "$2b$10$...",
      "rola": "KORISNIK",
      "agencija_id": 6,
      "kreiran_od": 4,
      "kreiran_datum": "2025-04-05T14:20:00Z",
      "poslednji_login": "2025-10-01T10:00:00Z",
      "aktivan": true,
      "kreirao_korisnika": [],
      "broj_logovanja": 38,
      "neuspeli_pokusaji": 0
    },
    {
      "id": 9,
      "username": "korisnik_nikola_bl",
      "ime_prezime": "Nikola Nikolić",
      "email": "nikola.nikolic@muprs.org",
      "telefon": "+387 65 111 222",
      "password_hash": "$2b$10$...",
      "rola": "KORISNIK",
      "agencija_id": 4,
      "kreiran_od": 5,
      "kreiran_datum": "2025-04-15T12:00:00Z",
      "poslednji_login": "2025-10-01T09:30:00Z",
      "aktivan": true,
      "kreirao_korisnika": [],
      "broj_logovanja": 32,
      "neuspeli_pokusaji": 0
    }
  ]
}
```

**Nova polja u korisničkoj strukturi:**
- `agencija_id` - ID agencije kojoj korisnik pripada (SUPERADMIN ima `null`)
- `ime_prezime` - Puno ime i prezime korisnika (za prikaz u profilu i kontakt info)
- `telefon` - Kontakt telefon (posebno važno za ADMIN-e)

---

## 📋 Audit log struktura

### JSON struktura (audit_log.json)
```json
{
  "audit_logs": [
    {
      "id": 1,
      "korisnik_id": 1,
      "korisnik_username": "superadmin",
      "akcija": "LOGIN",
      "tip": "AUTH",
      "detalji": "Uspešna prijava",
      "timestamp": "2025-10-01T14:30:00Z",
      "ip_adresa": "192.168.1.100",
      "user_agent": "Mozilla/5.0..."
    },
    {
      "id": 2,
      "korisnik_id": 1,
      "korisnik_username": "superadmin",
      "akcija": "CREATE_OPERATOR",
      "tip": "OPERATOR",
      "detalji": "Dodao operatera: Telemach BiH",
      "operator_id": 32,
      "timestamp": "2025-10-01T14:35:00Z",
      "ip_adresa": "192.168.1.100"
    },
    {
      "id": 3,
      "korisnik_id": 2,
      "korisnik_username": "admin_marko",
      "akcija": "CREATE_USER",
      "tip": "USER_MANAGEMENT",
      "detalji": "Kreirao korisnika: korisnik_petar",
      "novi_korisnik_id": 10,
      "timestamp": "2025-10-01T15:00:00Z",
      "ip_adresa": "192.168.1.105"
    },
    {
      "id": 4,
      "korisnik_id": 3,
      "korisnik_username": "korisnik_ana",
      "akcija": "VIEW_OPERATOR",
      "tip": "OPERATOR",
      "detalji": "Pregledao operatera: m:tel",
      "operator_id": 2,
      "timestamp": "2025-10-01T15:10:00Z",
      "ip_adresa": "192.168.1.110"
    }
  ]
}
```

### Tipovi akcija u audit logu

#### Autentikacija (AUTH)
- `LOGIN` - Uspešna prijava
- `LOGOUT` - Odjava korisnika
- `LOGIN_FAILED` - Neuspeli pokušaj prijave
- `PASSWORD_RESET` - Reset lozinke
- `PASSWORD_CHANGE` - Promena lozinke

#### Upravljanje korisnicima (USER_MANAGEMENT)
- `CREATE_USER` - Kreiranje novog korisnika
- `UPDATE_USER` - Izmena korisnika
- `DELETE_USER` - Brisanje korisnika
- `ACTIVATE_USER` - Aktivacija naloga
- `DEACTIVATE_USER` - Deaktivacija naloga

#### Upravljanje operaterima (OPERATOR)
- `CREATE_OPERATOR` - Dodavanje operatera
- `UPDATE_OPERATOR` - Izmena operatera
- `DELETE_OPERATOR` - Brisanje operatera
- `VIEW_OPERATOR` - Pregled operatera (samo za detaljni pregled)
- `EXPORT_OPERATORS` - Izvoz podataka
- `IMPORT_OPERATORS` - Uvoz podataka

#### Sistemske akcije (SYSTEM)
- `BACKUP_DATABASE` - Kreiranje backup-a
- `RESTORE_DATABASE` - Vraćanje backup-a
- `CHANGE_SETTINGS` - Promena sistemskih postavki

---

## 🛡️ Sigurnosne mere

### Lozinke
- Minimalna dužina: 8 karaktera
- Mora sadržati: veliko slovo, malo slovo, broj, specijalan karakter
- Bcrypt hashing (cost factor 10)
- Obavezna promena lozinke svakih 180 dana (opciono za SUPERADMIN)
- Ne dozvoljavati poslednje 3 lozinke

### Sesije
- JWT token sa expiration
- Sesija traje 30 minuta bez aktivnosti
- "Zapamti me" produžava na 7 dana
- Invalidacija tokena na logout
- Refresh token za produženje sesije

### Zaštita od napada
- Rate limiting na login (5 pokušaja/minut)
- Brute-force zaštita (3 neuspela = 5 min lock)
- CSRF protection (tokens)
- XSS prevention (sanitizacija inputa)
- SQL injection prevention (parametrizovani upiti, iako koristimo JSON)

### Dodatne mere
- HTTPS obavezan u produkciji
- Content Security Policy (CSP) headeri
- HttpOnly cookies za JWT
- Secure flag na cookies
- Log svih neuspelih pokušaja prijave

---

## 📁 Fajl struktura (Nova)

```
ATLAS html/
│
├── auth/
│   ├── login.html              # Login stranica
│   ├── login.css               # Stilovi za login
│   ├── login.js                # Login logika
│   └── auth-middleware.js      # Middleware za proveru autentikacije
│
├── users/
│   ├── korisnici.json          # Baza korisnika
│   ├── agencije.json           # Baza policijskih agencija (NOVO)
│   ├── user-manager.js         # CRUD operacije nad korisnicima
│   └── user-roles.js           # Definicije rola i permisija
│
├── audit/
│   ├── audit_log.json          # Audit log fajl
│   ├── audit-logger.js         # Logika za logovanje akcija
│   └── audit-viewer.html       # UI za pregled audit loga
│
├── config/
│   └── security-config.js      # Sigurnosne konfiguracije
│
├── operators/                  # Postojeći fajlovi operatera
├── server.js                   # Backend server (proširiti za auth)
├── app.js                      # Frontend app (dodati auth proveru)
└── index.html                  # Glavni UI (zaštićen autentikacijom)
```

---

## 🚀 Implementacioni plan (Faze)

### **Faza 1: Osnovna autentikacija** (Prioritet 1)
- [ ] Kreirati login stranicu (`auth/login.html`)
- [ ] Implementirati JWT autentikaciju na backendu
- [ ] Dodati middleware za proveru tokena
- [ ] Zaštititi sve API endpoint-e
- [ ] Redirekcija na login ako nije autentifikovan
- [ ] Testirati sa hard-coded korisnicima (3 test korisnika)

### **Faza 2: Role-based access control** (Prioritet 2)
- [ ] Definisati role i permisije (`user-roles.js`)
- [ ] Implementirati proveru permisija na backendu
- [ ] UI prilagođavanje prema roli (sakrivanje/prikazivanje dugmadi)
- [ ] Blokiranje akcija prema roli (frontend + backend)
- [ ] Testirati sa sve 3 role

### **Faza 3: Upravljanje korisnicima i agencijama** (Prioritet 3)
- [ ] Kreirati `korisnici.json` strukturu (sa poljima `agencija_id`, `ime_prezime`, `telefon`)
- [ ] Kreirati `agencije.json` strukturu (policijske agencije)
- [ ] UI za SUPERADMIN: pregled svih korisnika i agencija
- [ ] UI za SUPERADMIN: kreiranje/izmena/brisanje korisnika i agencija
- [ ] UI za ADMIN: kreiranje/izmena svojih korisnika (dodaje `agencija_id`)
- [ ] UI za ADMIN: Profil stranica sa prikazom agencije i svojih korisnika
- [ ] UI za KORISNIK: Profil stranica sa prikazom agencije i kontakt ADMIN-a
- [ ] Welcome message nakon logovanja (sa info o agenciji i admin kontaktu)
- [ ] Backend API za user management i agency management

### **Faza 4: Audit log** (Prioritet 4)
- [ ] Kreirati `audit_log.json` strukturu
- [ ] Implementirati audit-logger.js (logovanje svih akcija)
- [ ] UI za SUPERADMIN: pregled kompletnog audit loga
- [ ] UI za ADMIN: pregled aktivnosti svojih korisnika
- [ ] UI za KORISNIK: pregled svoje aktivnosti
- [ ] Filtriranje i pretraga audit loga

### **Faza 5: Sigurnosne mere** (Prioritet 5)
- [ ] Implementirati bcrypt hashing
- [ ] Rate limiting na login endpoint
- [ ] Brute-force zaštita
- [ ] "Zaboravili ste lozinku?" funkcionalnost (email reset link)
- [ ] HTTPS setup za produkciju
- [ ] Session timeout i auto logout

### **Faza 6: Poliranje i testiranje** (Prioritet 6)
- [ ] Testiranje svih scenarija (login, permissions, audit)
- [ ] UX poboljšanja (loading states, error messages)
- [ ] Dokumentacija za korisnike
- [ ] Performance optimizacije
- [ ] Security audit

---

## 🎯 Početna podešavanja (Prvi put)

### Default SUPERADMIN nalog
```
Username: superadmin
Password: Atlas2025!
Email: admin@atlas.ba
```

**Prva prijava:**
1. Ulogujte se sa default kredencijalima
2. Sistem će tražiti obaveznu promenu lozinke
3. Kreirajte sigurnu lozinku
4. Dodajte dodatne ADMIN ili KORISNIK naloge po potrebi

---

## 📝 Napomene za razvoj

### Backend (server.js)
- Dodati `express-session` ili JWT library (npr. `jsonwebtoken`)
- Instalirati `bcrypt` za hashing lozinki
- Dodati middleware funkcije za auth i role check
- Zaštititi sve postojeće API rute

### Frontend (app.js)
- Provera tokena pri svakom učitavanju stranice
- Redirekcija na login ako nema tokena
- Axios interceptori za dodavanje JWT u headere
- UI prilagođavanje prema roli (dinamičko prikazivanje elemenata)

### Sigurnost
- **NIKAD** ne čuvati lozinke u plain text
- **NIKAD** ne slati lozinke preko HTTP (samo HTTPS u produkciji)
- **UVEK** validirati input na backendu (ne samo frontend)
- **UVEK** logirati kritične akcije (login, delete, role change)

---

## ✅ Zaključak

Ovaj sistem autentikacije i autorizacije obezbeđuje:
- ✅ Zaštitu pristupa aplikaciji (obavezna prijava)
- ✅ Hierarhiju korisnika sa različitim privilegijama (SUPERADMIN → ADMIN → KORISNIK)
- ✅ Praćenje svih akcija kroz audit log
- ✅ Sigurnost podataka i kontrolu pristupa
- ✅ **Organizaciju po policijskim agencijama** (14 agencija u BiH)
- ✅ **Transparentnost kontakta** - Svaki korisnik zna ko je njegov ADMIN i kako ga kontaktirati
- ✅ **Jasnu hijerarhiju odgovornosti** - ADMIN upravlja korisnicima svoje agencije
- ✅ Skalabilnost za buduće funkcionalnosti

---

### 🎯 Benefiti sistema policijskih agencija

#### **Za KORISNIKE:**
- ✅ Znaju kojoj agenciji pripadaju (prikazano u headeru i profilu)
- ✅ Imaju direktan kontakt svog ADMIN-a (ime, email, telefon)
- ✅ Vide info o ADMIN-u odmah nakon prijave (Welcome message)
- ✅ Mogu brzo dobiti pomoć u slučaju problema sa pristupom
- ✅ Jasno razumeju svoju organizacionu pripadnost

#### **Za ADMIN-e:**
- ✅ Upravljaju **samo korisnicima svoje agencije**
- ✅ Lako prate aktivnosti svojih korisnika kroz audit log
- ✅ **Ne mogu menjati korisnike drugih agencija** - jasna separacija odgovornosti
- ✅ Mogu organizovati korisnike prema kantonima/odeljenjima
- ✅ Imaju statistiku samo za svoje korisnike
- ✅ **Ne mogu kreirati ADMIN-e** - jedino SUPERADMIN može
- ✅ Automatski dodeljuju svoju agenciju novim korisnicima

#### **Za SUPERADMIN-a:**
- ✅ Pregled **svih agencija i korisnika** u sistemu
- ✅ Može **kreirati korisnike za bilo koju agenciju** (dropdown izbor)
- ✅ Može **kreirati ADMIN-e za sve agencije**
- ✅ Može **menjati agenciju korisnika** (prebaciti ga u drugu agenciju)
- ✅ Može **menjati rolu bilo kom korisniku** (unaprediti/degradirati)
- ✅ Distribucija odgovornosti na ADMIN-e pojedinačnih agencija
- ✅ Centralizovana kontrola uz decentralizovano upravljanje

---

### 🏛️ Policijske agencije u sistemu (15 agencija)

**Državni nivo (2):**
1. SIPA - Agencija za istrage i zaštitu BiH
2. GP BiH - Granična policija BiH

**Entitetski nivo (2):**
3. FUP - Federalna uprava policije
4. MUP RS - Ministarstvo unutrašnjih poslova Republike Srpske

**Distriktski nivo (1):**
5. PBD BiH - Policija Brčko distrikta BiH

**Kantonalni nivo (10 kantona):**
6. MUP KS - Kanton Sarajevo
7. MUP TK - Tuzlanski kanton
8. MUP ZDK - Zeničko-dobojski kanton
9. MUP USK - Unsko-sanski kanton
10. MUP HNK - Hercegovačko-neretvanski kanton
11. MUP SBK - Srednjobosanski kanton
12. MUP ZHK - Zapadnohercegovački kanton
13. MUP BPK - Bosansko-podrinjski kanton Goražde
14. MUP PK - Posavski kanton
15. MUP K10 - Kanton 10

---

### 📋 Ključne izmene u sistemu

**Kreiranje korisnika:**
- **SUPERADMIN forma**: Bira agenciju sa dropdown liste (svih 15), bira rolu (SUPERADMIN/ADMIN/KORISNIK)
- **ADMIN forma**: Agencija automatski dodeljena (njegova agencija), rola uvek KORISNIK

**Izmena korisnika:**
- **SUPERADMIN**: Može menjati sve korisnike (sve podatke, agenciju, rolu)
- **ADMIN**: Može menjati samo svoje korisnike (ime, email, telefon, lozinka - NE agenciju, NE rolu)

**UI prilagođavanje:**
- Header prikazuje agenciju pored imena (npr. "Emir Husić (MUP KS)")
- Welcome message prikazuje info o agenciji i ADMIN kontaktu
- Profil stranica prikazuje detalje agencije i kontakt ADMIN-a

---

### 🚀 Sledeći koraci

1. ✅ **Pregled i odobrenje ovog plana**
2. Kreiranje `agencije.json` fajla sa svim 15 agencija
3. Početak implementacije - **Faza 1** (Login stranica i JWT)
4. Implementacija - **Faza 2** (Role-based access control)
5. Implementacija - **Faza 3** (User management sa agencijama)
6. Iterativno dodavanje funkcionalnosti po fazama

---

*Verzija: 2.1*  
*Datum: 01.10.2025*  
*Autor: ATLAS Development Team*  
*Ažurirano: Dodato svih 15 policijskih agencija BiH, ažurirane forme sa validacijom lozinke, ispravljeni tipovi agencija

