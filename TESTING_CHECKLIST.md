# 🧪 TESTING CHECKLIST - PRIORITET 1
**Datum:** 30. septembar 2025  
**URL:** http://localhost:8000  
**Branch:** feature/notification-manager  
**Commit:** 3b3b55c

---

## ✅ PRE-FLIGHT CHECK

- [x] ✅ Git commit uspješan
- [x] ✅ Push na GitHub uspješan
- [x] ✅ HTTP server pokrenut (port 8000)
- [x] ✅ Browser otvoren na http://localhost:8000

---

## 📋 TESTING SCENARIOS

### 1. OSNOVNI PRIKAZ (Homepage)

#### 1.1 Učitavanje aplikacije
- [ ] Aplikacija se učitava bez grešaka
- [ ] Header je prikazan sa logom i naslovom
- [ ] Statistike su prikazane (broj operatera, dominantnih, mobilnih, ISP)
- [ ] Kartice operatera su prikazane
- [ ] Filteri su vidljivi (kategorija, status, pretraga)

#### 1.2 Provera console-a
- [ ] Nema grešaka u console-u (F12 → Console tab)
- [ ] Poruke "✅ Standard catalog loaded" postoje
- [ ] Nema "404 Not Found" grešaka
- [ ] Nema sintaksnih grešaka

**Očekivani rezultat:** Aplikacija se učitava, prikazuje operatere, nema grešaka

---

### 2. TAGOVI I TOOLTIPOVI (OperatorCard)

#### 2.1 Hover preko tagova usluga
**Koraci:**
1. Pronađi operatera sa uslugama (npr. BH Telecom)
2. Hover mišem preko taga usluge (npr. "Internet 100/20")

**Proveri:**
- [ ] Tooltip se pojavljuje iznad taga
- [ ] Tooltip ima detaljan opis usluge
- [ ] Tooltip ima animaciju fade-in
- [ ] Tooltip ima strelicu ka tagu
- [ ] Tooltip nestaje kada makneš miš (fade-out)

#### 2.2 Hover preko tagova tehnologija
**Koraci:**
1. Pronađi operatera sa tehnologijama (npr. BH Telecom)
2. Hover mišem preko taga tehnologije (npr. "FTTH")

**Proveri:**
- [ ] Tooltip se pojavljuje iznad taga
- [ ] Tooltip ima detaljan opis tehnologije
- [ ] Tooltip ima animaciju fade-in
- [ ] Tooltip ima strelicu ka tagu
- [ ] Tooltip nestaje kada makneš miš (fade-out)

#### 2.3 Vizuelni efekti tagova
**Koraci:**
1. Hover preko taga usluge
2. Hover preko taga tehnologije

**Proveri:**
- [ ] Tag usluge ima plavi gradijent
- [ ] Tag tehnologije ima zeleni gradijent
- [ ] Tag se podiže pri hover-u (translateY)
- [ ] Senka se pojačava pri hover-u
- [ ] Animacija je glatka (transition)

**Očekivani rezultat:** Tooltipovi rade, tagovi imaju hover efekte

---

### 3. DODAVANJE NOVOG OPERATERA (Add Mode)

#### 3.1 Otvaranje modala
**Koraci:**
1. Klikni dugme "Dodaj Operatera" (plavo dugme u header-u)

**Proveri:**
- [ ] Modal se otvara
- [ ] Modal ima naslov "Dodaj operatera"
- [ ] Forma je prazna (sva polja su prazna)
- [ ] Dugmad "Dodaj Uslugu" i "Dodaj Tehnologiju" su vidljiva
- [ ] Dugme "Sačuvaj" je vidljivo

#### 3.2 Osnovno popunjavanje forme
**Koraci:**
1. Unesi naziv operatera (npr. "Test Operator")
2. Izaberi kategoriju (npr. "ISP")
3. Izaberi tip (npr. "Regionalni")
4. Izaberi status (npr. "Aktivni")

**Proveri:**
- [ ] Polja se popunjavaju
- [ ] Kategorija se menja dinamički
- [ ] Tip se filtrira prema kategoriji
- [ ] Nema grešaka u console-u

#### 3.3 Dodavanje usluge
**Koraci:**
1. Klikni dugme "Dodaj Uslugu"

**Proveri:**
- [ ] Nova sekcija se otvara ispod dugmeta
- [ ] Sekcija ima dropdown za kategoriju usluge
- [ ] Sekcija ima input polje za naziv usluge
- [ ] Sekcija ima input polje za opis usluge
- [ ] Sekcija ima dropdown za status
- [ ] Ima dugme za brisanje usluge (trash ikonica)

**Koraci:**
2. Popuni uslugu:
   - Kategorija: "Internet usluge"
   - Naziv: "Test Internet"
   - Opis: "Test opis"
   - Status: "Aktivna"

**Proveri:**
- [ ] Sva polja se popunjavaju
- [ ] Nema grešaka u console-u

#### 3.4 Dodavanje tehnologije
**Koraci:**
1. Klikni dugme "Dodaj Tehnologiju"

**Proveri:**
- [ ] Nova sekcija se otvara ispod dugmeta
- [ ] Sekcija ima dropdown za tip tehnologije
- [ ] Sekcija ima input polje za naziv tehnologije
- [ ] Sekcija ima input polje za opis tehnologije
- [ ] Sekcija ima input polje za kapacitet
- [ ] Ima dugme za brisanje tehnologije (trash ikonica)

**Koraci:**
2. Popuni tehnologiju:
   - Tip: "Pristupna mreža"
   - Naziv: "Test FTTH"
   - Opis: "Test optika"
   - Kapacitet: "1 Gbps"

**Proveri:**
- [ ] Sva polja se popunjavaju
- [ ] Nema grešaka u console-u

#### 3.5 Submit forme
**Koraci:**
1. Klikni dugme "Sačuvaj"

**Proveri:**
- [ ] Modal se zatvara
- [ ] Novi operater se pojavljuje na listi
- [ ] Operater ima sve upisane podatke
- [ ] Notifikacija "Operater uspješno dodat" se prikazuje
- [ ] Console nema grešaka

**Očekivani rezultat:** Novi operater je dodat sa svim podacima

---

### 4. IZMENA POSTOJEĆEG OPERATERA (Edit Mode)

#### 4.1 Otvaranje edit modala
**Koraci:**
1. Pronađi postojećeg operatera (npr. BH Telecom)
2. Klikni dugme "Uredi" (edit ikonica)

**Proveri:**
- [ ] Modal se otvara
- [ ] Modal ima naslov "Uredi operatera"
- [ ] Forma je popunjena sa postojećim podacima
- [ ] Usluge su prikazane u "Trenutno dodane usluge" sekciji
- [ ] Tehnologije su prikazane u "Trenutno dodane tehnologije" sekciji

#### 4.2 Prikaz postojećih usluga (Edit mode)
**Koraci:**
1. Scroll do sekcije "Usluge"

**Proveri:**
- [ ] Sekcija "📋 Trenutno dodane usluge (N)" je vidljiva
- [ ] Prikazane su postojeće usluge kao tagovi
- [ ] Svaki tag ima dugme za brisanje (X ikonica)
- [ ] Sekcija "➕ Dodaj nove usluge (M dostupno)" je vidljiva
- [ ] Katalog usluga je organizovan po kategorijama
- [ ] Svaka usluga u katalogu ima dugme "+ Dodaj"

#### 4.3 Hover preko tagova u edit modu
**Koraci:**
1. Hover preko taga postojeće usluge

**Proveri:**
- [ ] Tooltip se pojavljuje
- [ ] Tag ima hover efekat (podiže se)
- [ ] Senka se pojačava

#### 4.4 Brisanje postojeće usluge
**Koraci:**
1. Klikni dugme "X" pored neke usluge

**Proveri:**
- [ ] Usluga nestaje iz liste
- [ ] Broj "Trenutno dodane usluge" se smanjuje
- [ ] Usluga se pojavljuje u katalogu dostupnih
- [ ] Nema grešaka u console-u

#### 4.5 Dodavanje nove usluge iz kataloga
**Koraci:**
1. Pronađi uslugu u katalogu (npr. "VoIP")
2. Hover preko kartice usluge

**Proveri:**
- [ ] Kartica se podiže (hover efekat)
- [ ] Border se menja u narandžastu
- [ ] Senka se pojačava

**Koraci:**
3. Klikni dugme "+ Dodaj"

**Proveri:**
- [ ] Usluga se dodaje u "Trenutno dodane usluge"
- [ ] Usluga nestaje iz kataloga
- [ ] Broj "Trenutno dodane usluge" se povećava
- [ ] Broj "dostupno" u katalogu se smanjuje
- [ ] Nema grešaka u console-u

#### 4.6 Prikaz postojećih tehnologija (Edit mode)
**Koraci:**
1. Scroll do sekcije "Tehnologije"

**Proveri:**
- [ ] Sekcija "📋 Trenutno dodane tehnologije (N)" je vidljiva
- [ ] Prikazane su postojeće tehnologije kao tagovi
- [ ] Svaki tag ima dugme za brisanje (X ikonica)
- [ ] Sekcija "➕ Dodaj nove tehnologije (M dostupno)" je vidljiva
- [ ] Katalog tehnologija je organizovan po kategorijama
- [ ] Svaka tehnologija u katalogu ima dugme "+ Dodaj"

#### 4.7 Brisanje i dodavanje tehnologija
**Koraci:**
1. Obriši neku tehnologiju
2. Dodaj novu tehnologiju iz kataloga

**Proveri:**
- [ ] Brisanje funkcioniše (kao kod usluga)
- [ ] Dodavanje funkcioniše (kao kod usluga)
- [ ] Brojevi se ažuriraju
- [ ] Katalog se filtrira
- [ ] Nema grešaka u console-u

#### 4.8 Submit izmena
**Koraci:**
1. Klikni dugme "Sačuvaj"

**Proveri:**
- [ ] Modal se zatvara
- [ ] Izmene su sačuvane
- [ ] Operater prikazuje nove podatke
- [ ] Notifikacija "Operater uspješno ažuriran" se prikazuje
- [ ] Console nema grešaka

**Očekivani rezultat:** Izmene su sačuvane, usluge i tehnologije se dodaju/brišu ispravno

---

### 5. VIZUELNI ELEMENTI (Focus, Hover, Animacije)

#### 5.1 Focus stanja input polja
**Koraci:**
1. Otvori modal (dodaj ili uredi operatera)
2. Klikni u input polje (npr. "Naziv operatera")

**Proveri:**
- [ ] Plavi prsten se pojavljuje oko polja
- [ ] Border se menja u plavu boju
- [ ] Senka je vidljiva (glow efekat)
- [ ] Animacija je glatka

#### 5.2 Hover efekti dugmadi
**Koraci:**
1. Hover preko dugmeta "Dodaj Operatera"
2. Hover preko dugmeta "Sačuvaj"
3. Hover preko dugmeta "+ Dodaj" (u katalogu)

**Proveri:**
- [ ] Dugme se podiže (translateY)
- [ ] Senka se pojačava
- [ ] Animacija je glatka
- [ ] Boja se (možda) menja

#### 5.3 Hover efekti kartica u katalogu
**Koraci:**
1. Otvori edit modal
2. Scroll do kataloga usluga/tehnologija
3. Hover preko kartice

**Proveri:**
- [ ] Kartica se podiže
- [ ] Border se menja u narandžastu
- [ ] Senka se pojačava
- [ ] Dugme "+ Dodaj" menja boju pri hover-u

#### 5.4 Scrollbar u katalogu
**Koraci:**
1. Scroll u katalogu usluga/tehnologija

**Proveri:**
- [ ] Scrollbar ima custom dizajn (nije default)
- [ ] Scrollbar ima svetlu pozadinu (#f1f5f9)
- [ ] Thumb je sive boje (#cbd5e1)
- [ ] Thumb menja boju pri hover-u (#94a3b8)

**Očekivani rezultat:** Svi vizuelni efekti funkcionišu, animacije su glatke

---

### 6. VALIDACIJA FORME

#### 6.1 Submit prazne forme
**Koraci:**
1. Otvori modal "Dodaj operatera"
2. NE popuni nijedno polje
3. Klikni "Sačuvaj"

**Proveri:**
- [ ] Forma NE submituje
- [ ] Prikazuju se error poruke
- [ ] Obavezna polja su označena crvenim
- [ ] Notifikacija "Molimo ispravite greške u formi" se prikazuje

#### 6.2 Validacija email polja
**Koraci:**
1. Unesi neispravan email (npr. "test@")
2. Pokušaj submitovati

**Proveri:**
- [ ] Email polje je označeno crvenim
- [ ] Prikazuje se poruka "Email adresa nije ispravna"

#### 6.3 Validacija URL polja
**Koraci:**
1. Unesi neispravan URL (npr. "htttp://test")
2. Pokušaj submitovati

**Proveri:**
- [ ] Web polje je označeno crvenim
- [ ] Prikazuje se poruka "Web adresa nije ispravna"

**Očekivani rezultat:** Validacija funkcioniše, prikazuju se greške

---

### 7. PROVERA CONSOLE-A (F12)

#### 7.1 Nema grešaka
**Proveri:**
- [ ] Nema crvenih grešaka u console-u
- [ ] Nema 404 Not Found grešaka
- [ ] Nema "undefined" ili "null" grešaka
- [ ] Nema sintaksnih grešaka

#### 7.2 Console logovi
**Proveri:**
- [ ] "🔵 Dodavanje nove usluge..." pri kliku na "Dodaj Uslugu"
- [ ] "🔵 Dodavanje nove tehnologije..." pri kliku na "Dodaj Tehnologiju"
- [ ] "✅ Standard catalog loaded" pri učitavanju

**Očekivani rezultat:** Console je čist, samo informativni logovi

---

### 8. RESPONSIVE DIZAJN (Opciono)

#### 8.1 Mobilni prikaz
**Koraci:**
1. Promeni veličinu prozora (F12 → Toggle device toolbar)
2. Izaberi mobilni uređaj (npr. iPhone 12)

**Proveri:**
- [ ] Aplikacija se prilagođava mobilnom ekranu
- [ ] Modal se prilagođava
- [ ] Dugmad su klikabilna
- [ ] Katalog je scrollable

**Očekivani rezultat:** Aplikacija je responsive

---

## 📊 SCORING

### Obavezni testovi (MUST PASS):
- [ ] 1. Osnovni prikaz
- [ ] 2. Tagovi i tooltipovi
- [ ] 3. Dodavanje novog operatera
- [ ] 4. Izmena postojećeg operatera
- [ ] 5. Vizuelni elementi
- [ ] 7. Console bez grešaka

### Opcioni testovi:
- [ ] 6. Validacija forme (već testirana u ranijem radu)
- [ ] 8. Responsive dizajn

---

## ✅ FINALNI REZULTAT

**Status:** ⏳ U TOKU

**Prolaznost:**
- ✅ PASS: Svi obavezni testovi prolaze
- ⚠️ PARTIAL: Neki testovi ne prolaze
- ❌ FAIL: Većina testova ne prolazi

**Napomene:**
_Ovdje upiši sve što primijetiš tokom testiranja_

---

## 🐛 BUGS PRONAĐENI

### Bug #1: [Naziv buga]
- **Opis:** 
- **Koraci za reprodukciju:** 
- **Očekivano ponašanje:** 
- **Trenutno ponašanje:** 
- **Prioritet:** 🔴 Kritično / 🟠 Visoko / 🟡 Srednje / 🟢 Nisko

### Bug #2: [Naziv buga]
...

---

## 🎯 SLEDEĆI KORACI

Nakon testiranja:
1. **Ako su svi testovi PASS** → Kreni sa PRIORITET 2 (validacija, CSS cleanup)
2. **Ako ima bugova** → Popraviti bugove pa ponovo testirati
3. **Ako je sve ok** → Merge u main branch i deploy

---

**Napomena:** Testiranje je ključni deo razvoja. Ne presko, svaki scenario! 🧪
