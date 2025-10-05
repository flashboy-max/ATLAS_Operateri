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


---

## 🔄 **AKTUELNI STATUS - AUTH PROTOTYPE IMPLEMENTIRAN**

### ✅ **Šta smo pripremili (Oktobar 2025):**

#### **Kompletan auth-prototype sistem:**
- **6 HTML stranica** sa potpunom funkcionalnošću
- **5 CSS fajlova** sa standardizovanim dizajnom (common.css sa CSS varijablama)
- **7 JavaScript fajlova** sa svom logikom
- **Role-based access control** (SUPERADMIN, ADMIN, KORISNIK)
- **Mock autentikacija** sa JWT simulacijom
- **Kompletnan CRUD** za korisnike
- **System logs** sa filtriranjem i paginacijom
- **Responsive dizajn** za sve uređaje

#### **Implementirane stranice:**
1. `login.html` - Login stranica sa test nalozima
2. `dashboard.html` - Dashboard sa statistikama i brzim akcijama
3. `user-management.html` - Upravljanje korisnicima (CRUD operacije)
4. `system-logs.html` - Sistemski logovi sa filterima i exportom
5. `moj-profil.html` - Korisnički profil (read-only)
6. `postavke.html` - Postavke sistema (placeholder)

#### **Ključne komponente:**
- **common.css** - Centralizovani stilovi sa CSS varijablama
- **mock-data.js** - Test podaci (4 korisnika, 15 agencija, 20 logova)
- **auth.js** - Mock JWT autentikacija i session management
- **Role-based UI** - Različit prikaz za svaku rolu

---

## 🚀 **PLAN INTEGRACIJE SA GLAVNOM APLIKACIJOM**

### **FAZA 1: Backend Integracija (Prioritet 1)**

#### **API Endpoints za kreiranje:**
```javascript
// Autentikacija
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

// Korisnici
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

// Agencije
GET /api/agencies

// Logovi
GET  /api/logs
POST /api/logs
```

#### **Baza podataka - Tablice:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('SUPERADMIN', 'ADMIN', 'KORISNIK')),
    agencija_id INTEGER REFERENCES agencije(id),
    ime VARCHAR(100) NOT NULL,
    prezime VARCHAR(100) NOT NULL,
    telefon VARCHAR(20),
    aktivan BOOLEAN DEFAULT true,
    kreiran_od INTEGER REFERENCES users(id),
    kreiran_datum TIMESTAMP DEFAULT NOW(),
    poslednji_login TIMESTAMP
);

CREATE TABLE agencije (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(200) NOT NULL,
    skracenica VARCHAR(20) UNIQUE NOT NULL,
    tip VARCHAR(20) NOT NULL,
    adresa TEXT,
    telefon VARCHAR(20),
    email VARCHAR(100),
    aktivan BOOLEAN DEFAULT true
);

CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    korisnik_id INTEGER REFERENCES users(id),
    akcija VARCHAR(50) NOT NULL,
    tip VARCHAR(30) NOT NULL,
    target TEXT,
    detalji JSONB,
    ip_adresa INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'SUCCESS'
);
```

---

## ⚠️ **IZAZOVI KOD MIGRACIJE - PREPORUKE**

### **1. Fajl Konflikti i Optimizacija:**

#### **Problem:** Isti nazivi fajlova (.css, .js, .html)
**Rešenje:** Prefiks strategija
```
ATLAS html/
├── index.html (glavna aplikacija)
├── styles.css (glavni stilovi)
├── app.js (glavna aplikacija)
│
├── auth-prototype/ (zaseban modul)
│   ├── auth-login.html
│   ├── auth-dashboard.html
│   ├── auth-user-management.html
│   ├── auth-system-logs.html
│   ├── auth-moj-profil.html
│   ├── auth-postavke.html
│   ├── auth-styles.css
│   ├── auth-common.css
│   ├── auth-script.js
│   └── auth-mock-data.js
```

#### **CSS Optimizacija - Izbegavanje konflikata:**
```css
/* Glavni styles.css - postojeći stilovi */
.operator-table { /* postojeći stilovi */ }
.search-form { /* postojeći stilovi */ }

/* auth-styles.css - novi stilovi sa prefiksom */
.auth-container { /* novi stilovi */ }
.auth-dashboard { /* novi stilovi */ }
.auth-user-table { /* novi stilovi */ }
.auth-form-control { /* novi stilovi */ }
```

### **2. Modularna Integracija:**

#### **HTML Integracija - Include metoda:**
```html
<!-- Glavni index.html -->
<header>
  <div id="main-header">
    <!-- Postojeći header -->
  </div>
  
  <!-- Auth header (dinamički) -->
  <div id="auth-header" style="display: none;">
    <!-- Učitava se samo za autentifikovane korisnike -->
  </div>
</header>

<main>
  <!-- Postojeći sadržaj -->
  <div id="operators-section">
    <!-- Glavna aplikacija -->
  </div>
  
  <!-- Auth sekcije (dinamičke) -->
  <div id="auth-dashboard" style="display: none;">
    <!-- Učitava se kao modul -->
  </div>
</main>

<!-- Script integracija -->
<script src="app.js"></script>
<script src="auth-prototype/auth-script.js"></script>
```

#### **JavaScript Modularna Struktura:**
```javascript
// app.js (glavna aplikacija)
const ATLAS = {
  operators: { /* postojeći kod */ },
  search: { /* postojeći kod */ },
  
  // Auth integracija
  auth: {
    init: function() {
      if (this.isAuthenticated()) {
        this.loadAuthModule();
      }
    },
    
    loadAuthModule: function() {
      // Učitaj auth-prototype modul
      return import('./auth-prototype/auth-module.js');
    },
    
    isAuthenticated: function() {
      return localStorage.getItem('atlas_auth_token') !== null;
    }
  }
};

// Inicijalizacija
document.addEventListener('DOMContentLoaded', () => {
  ATLAS.auth.init();
  ATLAS.operators.init();
});
```

### **3. CSS Konflikti - Rešenja:**

#### **CSS Scope sa prefiksima:**
```css
/* auth-common.css */
:root {
  --auth-primary-color: #4169E1;
  --auth-success-color: #22C55E;
  --auth-spacing-sm: 1rem;
}

.auth-dashboard {
  /* Scoped stilovi za dashboard */
}

.auth-user-management {
  /* Scoped stilovi za user management */
}

/* Izbegavanje konflikata sa postojećim klasama */
.auth-table {
  /* Umesto .table koji možda postoji */
}

.auth-btn-primary {
  /* Umesto .btn-primary */
}
```

#### **Dynamic CSS Loading:**
```javascript
// Dinamičko učitavanje CSS-a
function loadAuthStyles() {
  if (!document.getElementById('auth-styles')) {
    const link = document.createElement('link');
    link.id = 'auth-styles';
    link.rel = 'stylesheet';
    link.href = 'auth-prototype/auth-styles.css';
    document.head.appendChild(link);
  }
}
```

### **4. Baza Podataka - Integracija:**

#### **Separate Database Schema:**
```sql
-- Postojeće tablice (operateri)
CREATE TABLE operators (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(200) NOT NULL,
    -- postojeće kolone
);

-- Nove auth tablice (zasebno)
CREATE TABLE auth_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    agencija_id INTEGER REFERENCES auth_agencije(id),
    -- ostale kolone
);

CREATE TABLE auth_agencije (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(200) NOT NULL,
    skracenica VARCHAR(20) UNIQUE NOT NULL,
    -- ostale kolone
);

CREATE TABLE auth_system_logs (
    id SERIAL PRIMARY KEY,
    korisnik_id INTEGER REFERENCES auth_users(id),
    akcija VARCHAR(50) NOT NULL,
    -- ostale kolone
);
```

---

## 🔧 **TEHNIČKE PREPORUKE**

### **1. Lazy Loading za Auth Module:**
```javascript
// Učitaj auth module samo kad je potreban
const authModule = {
  load: async function() {
    if (!this.loaded) {
      const module = await import('./auth-prototype/auth-module.js');
      this.instance = new module.AuthSystem();
      this.loaded = true;
    }
    return this.instance;
  }
};
```

### **2. Event Bus za Komunikaciju:**
```javascript
// Komunikacija između glavne aplikacije i auth modula
const eventBus = new EventTarget();

// Glavna aplikacija sluša auth događaje
eventBus.addEventListener('userLoggedIn', (e) => {
  // Ažuriraj UI
});

// Auth module emituje događaje
eventBus.dispatchEvent(new CustomEvent('userLoggedIn', {
  detail: { user: currentUser }
}));
```

### **3. API Service Layer:**
```javascript
// Centralizovani API service
class AtlasApiService {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('atlas_auth_token');
  }

  // Postojeći API pozivi
  async getOperators() {
    return this.request('/operators');
  }

  // Novi auth API pozivi
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getUsers() {
    return this.request('/users');
  }
}
```

---

## 🎯 **PREDVIĐENI PROBLEMI I REŠENJA**

### **Problem 1: CSS Konflikti**
- **Simptomi:** Stilovi se preklapaju, neispravan prikaz
- **Rešenje:** CSS prefiksi, scoped stilovi, modularni CSS

### **Problem 2: JavaScript Konflikti**
- **Simptomi:** Funkcije se preklapaju, globalne varijable
- **Rešenje:** Module pattern, namespace-ovi, event bus

### **Problem 3: Rute i Navigacija**
- **Simptomi:** Konflikt ruta, neispravna navigacija
- **Rešenje:** Client-side routing, hash rute, dinamički content

### **Problem 4: Session Management**
- **Simptomi:** Više sesija, konflikt tokena
- **Rešenje:** Centralizovani session manager, cookie naming

### **Problem 5: Backend API Konflikti**
- **Simptomi:** Endpoint konflikti, verzioniranje API-ja
- **Rešenje:** API verzioniranje (/api/v1/auth), namespace-ovi

---

## 🔧 **TROUBLESHOOTING - Rešenja za uobičajene probleme**

### **Problem 1: CSS se ne učitava pravilno**
**Simptomi:** Stilovi se ne primjenjuju, izgled je neispravan

**Rešenja:**
```javascript
// Provjeri da li se CSS učitao
console.log(document.styleSheets);

// Ručno učitaj CSS ako je potrebno
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'auth-prototype/auth-styles.css';
document.head.appendChild(link);
```

**Provjera:** Otvori Developer Tools → Network tab → vidi da li se CSS fajlovi učitavaju

### **Problem 2: API pozivi ne rade**
**Simptomi:** Login ne radi, greška "Network Error"

**Rešenja:**
```javascript
// Provjeri API endpoint
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('API Error:', err));
```

**Provjera:** Otvori Developer Tools → Console → Network tab → provjeri HTTP status kodove

### **Problem 3: Sesija se ne čuva**
**Simptomi:** Nakon refresh-a korisnik je odjavljen

**Rešenja:**
```javascript
// Provjeri localStorage
console.log('Token:', localStorage.getItem('atlas_auth_token'));
console.log('User:', localStorage.getItem('atlas_user'));

// Ručno postavi test sesiju
localStorage.setItem('atlas_auth_token', 'test-token');
localStorage.setItem('atlas_user', JSON.stringify({
  id: 1,
  username: 'test',
  role: 'ADMIN',
  ime: 'Test',
  prezime: 'User'
}));
```

**Provjera:** Otvori Developer Tools → Application → Local Storage

### **Problem 4: Role-based pristup ne radi**
**Simptomi:** Korisnik vidi funkcionalnosti koje ne bi trebao

**Rešenja:**
```javascript
// Provjeri trenutnog korisnika
const user = JSON.parse(localStorage.getItem('atlas_user'));
console.log('Current user:', user);
console.log('User role:', user.role);

// Testiraj role-based funkcije
console.log('Can edit users:', user.role === 'SUPERADMIN' || user.role === 'ADMIN');
console.log('Can view logs:', user.role === 'SUPERADMIN' || user.role === 'ADMIN');
```

**Provjera:** Otvori Developer Tools → Console → testiraj role-based logiku

### **Problem 5: JavaScript greške**
**Simptomi:** "Uncaught ReferenceError" ili "TypeError"

**Rešenja:**
```javascript
// Provjeri da li su svi fajlovi učitani
console.log('AuthSystem loaded:', typeof AuthSystem);
console.log('Mock data loaded:', typeof MOCK_USERS);

// Provjeri redoslijed učitavanja script-ova
// Treba biti: mock-data.js → auth.js → dashboard.js
```

### **Problem 6: Database konekcija**
**Simptomi:** "Connection refused" ili "Table doesn't exist"

**Rešenja:**
```sql
-- Provjeri konekciju
SELECT NOW();

-- Kreiraj auth tablice ako nedostaju
CREATE TABLE IF NOT EXISTS auth_users (...);
CREATE TABLE IF NOT EXISTS auth_agencije (...);
CREATE TABLE IF NOT EXISTS auth_system_logs (...);
```

---

## 📋 **MIGRATION CHECKLIST - Korak po korak**

### **FAZA 1: Priprema (Prije migracije)**
- [ ] **Backup postojeće aplikacije** - Kreiraj puni backup svih fajlova
- [ ] **Database backup** - Export postojeće baze podataka
- [ ] **Test environment** - Pripremi staging/test server
- [ ] **Performance baseline** - Mjeri trenutne performanse aplikacije
- [ ] **Code review** - Pregledaj auth-prototype kod sa timom

### **FAZA 2: Backend Setup**
- [ ] **Kreiraj auth tablice** - Pokreni SQL skriptu za auth_users, auth_agencije, auth_system_logs
- [ ] **Dodaj API endpoint-e** - Implementiraj /api/auth/*, /api/users/*, /api/logs/*
- [ ] **JWT konfiguracija** - Postavi JWT secret i expiration
- [ ] **Password hashing** - Implementiraj bcrypt za lozinke
- [ ] **Rate limiting** - Dodaj express-rate-limit za login endpoint
- [ ] **CORS setup** - Konfiguriši Cross-Origin Resource Sharing

### **FAZA 3: Frontend Integration**
- [ ] **CSS prefiksi** - Dodaj `.auth-` prefikse na sve auth stilove
- [ ] **JavaScript namespace** - Kreiraj `ATLAS.auth` namespace
- [ ] **HTML integracija** - Dodaj auth header u index.html
- [ ] **Event bus** - Implementiraj komunikaciju između modula
- [ ] **Lazy loading** - Dodaj dinamičko učitavanje auth modula

### **FAZA 4: Testing & Validation**
- [ ] **Testiraj login/logout** - Provjeri autentikaciju sa svim rolama
- [ ] **Testiraj role-based pristup** - SUPERADMIN, ADMIN, KORISNIK funkcionalnosti
- [ ] **Testiraj user management** - CRUD operacije za korisnike
- [ ] **Testiraj system logs** - Filtriranje, paginacija, export
- [ ] **Performance test** - Usporedi performanse prije/poslije migracije
- [ ] **Security audit** - Provjeri za ranjivosti (XSS, CSRF, SQL injection)

### **FAZA 5: Deployment & Monitoring**
- [ ] **Staging deployment** - Deploy na test server
- [ ] **User acceptance testing** - Testiranje sa krajnjim korisnicima
- [ ] **Production deployment** - Postepeni rollout
- [ ] **Monitoring setup** - Dodaj logging i error tracking
- [ ] **Documentation update** - Ažuriraj korisničku dokumentaciju
- [ ] **Training** - Obuči korisnike za nove funkcionalnosti

### **FAZA 6: Post-Migration**
- [ ] **Rollback plan** - Pripremi plan za vraćanje ako nešto pođe po zlu
- [ ] **Data migration** - Migriraj postojeće korisnike u auth sistem
- [ ] **Feature flags** - Koristi feature flags za postepeno uvođenje
- [ ] **Support monitoring** - Prati support tikete prvih nedjelja
- [ ] **Performance monitoring** - Kontinuirano praćenje performansi

---

## 🚀 **SLEDEĆI KORACI**

### **Prioritet 1 (Odmah):**
1. **Kreiraj backend API** za autentikaciju
2. **Implementiraj bazu podataka** sa auth tablicama
3. **Dodaj CSS prefikse** za izbegavanje konflikata
4. **Testiraj modularno učitavanje** auth komponenti

### **Prioritet 2 (Sljedeće):**
1. **Integriši auth header** u glavnu aplikaciju
2. **Implementiraj role-based pristup** za operatere
3. **Dodaj audit logging** za operater akcije
4. **Optimiziraj performanse** i cache

### **Prioritet 3 (Kasnije):**
1. **Security hardening** (bcrypt, rate limiting)
2. **Advanced features** (2FA, SSO)
3. **Monitoring i analytics**
4. **Mobile optimization**

---

## 📝 **ZAKLJUČAK**

Auth-prototype sistem je **100% spreman za integraciju** sa glavnom ATLAS aplikacijom. Ključni uspjeh će zavisiti od:

1. **Pažljive planiranja migracije** - izbegavanje konflikata
2. **Modularne arhitekture** - zasebno održavanje
3. **Postepene integracije** - testiranje po fazama
4. **Performance optimizacije** - brzo učitavanje
5. **Security fokusa** - zaštita podataka

Sistem je dizajniran da bude **neinvazivan** i da se može integrisati bez poremećaja postojeće funkcionalnosti.

---

*Verzija: 3.0*  
*Datum: 02.10.2025*  
*Autor: ATLAS Development Team*  
*Ažurirano: Dodat aktuelni status auth-prototype sistema, plan integracije, izazovi migracije i tehničke preporuke*
