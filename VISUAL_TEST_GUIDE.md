# 🎨 VISUAL TEST GUIDE - Šta očekivati kada testiraš
**URL:** http://localhost:8000  
**Branch:** feature/notification-manager

---

## 🖼️ VIZUELNI ELEMENTI - Prije vs. Poslije

### 1. TAGOVI (Usluge i Tehnologije)

#### PRIJE:
```
┌─────────────────────┐
│ Internet 100/20     │  ← Flat, crno-bijel, nema hover
└─────────────────────┘
```

#### POSLIJE:
```
┌─────────────────────────┐
│ 🌐 Internet 100/20      │  ← Plavi gradijent
└─────────────────────────┘
       ↑
   Hover: Podiže se + senka
   Tooltip: "Optički internet..."
   
┌─────────────────────────┐
│ 📡 FTTH                 │  ← Zeleni gradijent
└─────────────────────────┘
       ↑
   Hover: Podiže se + senka
   Tooltip: "Fiber To The Home..."
```

**Šta provjeriti:**
- ✅ Tag ima gradijent (plava za usluge, zelena za tehnologije)
- ✅ Hover: Tag se podiže za 2px (`translateY(-2px)`)
- ✅ Hover: Senka se pojačava
- ✅ Hover: Tooltip se pojavljuje iznad taga
- ✅ Tooltip: Ima strelicu ka dole
- ✅ Tooltip: Fade-in animacija
- ✅ Miš makneš: Tooltip nestaje (fade-out)

---

### 2. MODAL - DODAVANJE OPERATERA

#### Layout strukture:
```
┌─────────────────────────────────────────────────────────┐
│  [×]  Dodaj operatera                                    │  ← Header
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Osnovni podaci:                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ Naziv operatera     │  │ Komercijalni naziv  │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                           │
│  Usluge:                                                 │
│  ┌───────────────────────────────────────────────┐      │
│  │ 🔵 Dodaj Uslugu                               │      │  ← Dugme
│  └───────────────────────────────────────────────┘      │
│                                                           │
│  Tehnologije:                                            │
│  ┌───────────────────────────────────────────────┐      │
│  │ 🟢 Dodaj Tehnologiju                          │      │  ← Dugme
│  └───────────────────────────────────────────────┘      │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                         [Otkaži] [Sačuvaj]              │  ← Footer
└─────────────────────────────────────────────────────────┘
```

**Šta provjeriti:**
- ✅ Dugme "Dodaj Uslugu" je vidljivo i plavo
- ✅ Dugme "Dodaj Tehnologiju" je vidljivo i zeleno
- ✅ Hover: Dugmad se podižu
- ✅ Hover: Senka se pojačava
- ✅ Klik: Otvara novu sekciju

---

### 3. MODAL - EDIT MODE (Izmjena operatera)

#### Usluge sekcija u edit modu:
```
┌─────────────────────────────────────────────────────────┐
│  Usluge:                                                 │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │ 📋 Trenutno dodane usluge (5)                  │     │  ← Postojeće
│  │                                                 │     │
│  │  [Internet 100/20] [×]  [VoIP] [×]             │     │
│  │  [IPTV] [×]  [Mobilna] [×]  [Cloud] [×]        │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │ ➕ Dodaj nove usluge (12 dostupno)             │     │  ← Katalog
│  │                                                 │     │
│  │  Mobilni servisi:                              │     │
│  │  ┌─────────────────┐  ┌─────────────────┐    │     │
│  │  │ 5G              │  │ eSIM            │    │     │
│  │  │ Najnovija gen.. │  │ Elektronska SIM │    │     │
│  │  │   [+ Dodaj]     │  │   [+ Dodaj]     │    │     │
│  │  └─────────────────┘  └─────────────────┘    │     │
│  │                                                 │     │
│  │  Internet usluge:                              │     │
│  │  ┌─────────────────┐  ┌─────────────────┐    │     │
│  │  │ FTTH 1Gbps      │  │ xDSL 100/20     │    │     │
│  │  │ Optički inte... │  │ Bakarni inter...│    │     │
│  │  │   [+ Dodaj]     │  │   [+ Dodaj]     │    │     │
│  │  └─────────────────┘  └─────────────────┘    │     │
│  │                                                 │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

**Šta provjeriti:**

#### A) Sekcija "Trenutno dodane usluge":
- ✅ Pozadina: Svetlo plava (#f0f9ff)
- ✅ Border: Plavi (#0ea5e9)
- ✅ Ikonica: ✅ zelena check mark
- ✅ Broj usluga prikazan: "(N)"
- ✅ Tagovi imaju [×] dugme za brisanje
- ✅ Hover preko taga: Tooltip se pojavljuje
- ✅ Klik na [×]: Tag nestaje, broj se smanjuje

#### B) Sekcija "Dodaj nove usluge":
- ✅ Pozadina: Svetlo žuta (#fefce8)
- ✅ Border: Narandžasti (#f59e0b)
- ✅ Ikonica: ➕ narandžasta plus
- ✅ Broj dostupnih prikazan: "(M dostupno)"
- ✅ Organizovano po kategorijama (Mobilni, Internet, TV...)
- ✅ Svaka kartica ima naziv, opis i "[+ Dodaj]" dugme

#### C) Kartice u katalogu:
- ✅ Pozadina: Bijela
- ✅ Border: Narandžasti (#d97706)
- ✅ Hover: Kartica se podiže (`translateY(-2px)`)
- ✅ Hover: Senka se pojačava
- ✅ Hover: Border postaje svetliji
- ✅ Dugme "[+ Dodaj]": Narandžasta pozadina (#f59e0b)
- ✅ Dugme hover: Tamnija pozadina (#d97706)
- ✅ Dugme hover: Scale animacija (`scale(1.05)`)

#### D) Klik na "[+ Dodaj]":
- ✅ Usluga se dodaje u "Trenutno dodane"
- ✅ Usluga nestaje iz kataloga
- ✅ Broj "(N)" se povećava
- ✅ Broj "(M dostupno)" se smanjuje
- ✅ Katalog se automatski filtrira

#### E) Ista logika za TEHNOLOGIJE:
- ✅ Sekcija "Trenutno dodane tehnologije"
- ✅ Sekcija "Dodaj nove tehnologije"
- ✅ Pozadina: Svetlo zelena (#f0fdf4) umjesto plave
- ✅ Border: Zeleni (#10b981)
- ✅ Kategorije: Pristupna mreža, Core, Bežične, Optičke, Transport

---

### 4. FOCUS STANJA (Input polja)

#### PRIJE:
```
┌─────────────────────────┐
│ Naziv operatera         │  ← Obični border
└─────────────────────────┘
```

#### POSLIJE (kada klikneš u polje):
```
┌─────────────────────────┐
│ Naziv operatera         │  ← Plavi border + glow
└─────────────────────────┘
      ↑
  Plavi prsten oko polja
  Senka: 0 0 0 3px rgba(59, 130, 246, 0.1)
```

**Šta provjeriti:**
- ✅ Klik u input: Border se menja u plavu (#3b82f6)
- ✅ Klik u input: Plavi prsten se pojavljuje
- ✅ Klik u input: Senka (glow efekat) vidljiva
- ✅ Tab navigacija: Focus se pravilno pomjera
- ✅ Animacija: Glatka tranzicija

---

### 5. HOVER EFEKTI - DUGMAD

#### A) Glavna dugmad (Dodaj Operatera, Sačuvaj):
```
PRIJE:        POSLIJE (hover):
┌───────────┐  ┌───────────┐
│ Sačuvaj   │  │ Sačuvaj   │  ← Podiže se za 1px
└───────────┘  └───────────┘  ← Senka pojačana
```

**Šta provjeriti:**
- ✅ Hover: Dugme se podiže (`translateY(-1px)`)
- ✅ Hover: Senka se pojačava (0 4px 8px rgba(0,0,0,0.15))
- ✅ Klik: Dugme se vraća na 0 (`translateY(0)`)
- ✅ Animacija: Glatka (transition: all 0.2s ease)

#### B) Mini dugmad u katalogu ([+ Dodaj]):
```
PRIJE:        POSLIJE (hover):
[+ Dodaj]     [+ DODAJ]  ← Tamnija boja + scale
```

**Šta provjeriti:**
- ✅ Hover: Pozadina #d97706 (tamnija)
- ✅ Hover: Scale 1.05 (malo veće)
- ✅ Hover: Kursor pointer
- ✅ Klik: Usluga/tehnologija se dodaje

---

### 6. SCROLLBAR (u katalogu)

#### PRIJE (default):
```
│██████████│  ← Debeli, ružan
│          │
│          │
```

#### POSLIJE (custom):
```
│░░░█░░░░░│  ← Tanak, moderan
│░░░█░░░░░│
│░░░█░░░░░│
```

**Šta provjeriti:**
- ✅ Širina: 8px (tanak)
- ✅ Track pozadina: #f1f5f9 (svetlo siva)
- ✅ Thumb boja: #cbd5e1 (siva)
- ✅ Thumb hover: #94a3b8 (tamnija)
- ✅ Border radius: 4px (zaobljeni uglovi)

---

### 7. TOOLTIP ANIMACIJA

#### Sekvenca:
```
1. Hover počinje:
   ┌─────────┐
   │ Tag     │
   └─────────┘

2. Nakon 10ms:
   ┌─────────────────────┐
   │ Detaljan opis...   │  ← Opacity 0 → 1
   └─────────▼──────────┘
   ┌─────────┐
   │ Tag     │
   └─────────┘

3. Hover završava:
   ┌─────────┐
   │ Tag     │  ← Tooltip fade-out
   └─────────┘
```

**Šta provjeriti:**
- ✅ Tooltip ima klasu `.custom-tooltip`
- ✅ Position: absolute
- ✅ Z-index: 10000 (iznad svega)
- ✅ Pozadina: Gradijent (#1e293b → #334155)
- ✅ Boja teksta: Bijela
- ✅ Padding: 8px 12px
- ✅ Border radius: 6px
- ✅ Max width: 300px
- ✅ Senka: 0 4px 12px rgba(0,0,0,0.25)
- ✅ Strelica: 6px, ka dole, boja #1e293b
- ✅ Animacija: opacity 0.2s ease
- ✅ Hover: Tooltip se pojavljuje
- ✅ Makneš miš: Tooltip nestaje

---

### 8. ERROR STANJA (Validacija)

#### Neispravno polje:
```
┌─────────────────────────┐
│ test@                   │  ← Crveni border (#ef4444)
└─────────────────────────┘
  ↓
  Email adresa nije ispravna  ← Crveni tekst
```

**Šta provjeriti:**
- ✅ Border boja: #ef4444 (crvena)
- ✅ Pozadina: #fef2f2 (svetlo crvena)
- ✅ Error poruka ispod polja
- ✅ Error poruka boja: #ef4444
- ✅ Error poruka veličina: 12px
- ✅ Error poruka weight: 500

---

## 🎯 QUICK TEST CHECKLIST

### Osnovno (5 min):
1. ⏳ Otvori http://localhost:8000
2. ⏳ Proveri da se aplikacija učitava
3. ⏳ Hover preko taga → tooltip se pojavljuje?
4. ⏳ Klikni "Dodaj Operatera" → modal se otvara?
5. ⏳ Klikni "Dodaj Uslugu" → sekcija se otvara?
6. ⏳ Klikni "Dodaj Tehnologiju" → sekcija se otvara?
7. ⏳ Otvori Console (F12) → ima grešaka?

### Detaljan test (30 min):
Prati `TESTING_CHECKLIST.md`

---

## 🐛 ŠTA AKO NEŠTO NE RADI?

### Tooltip se ne pojavljuje:
1. Otvori Console (F12)
2. Kucaj: `document.querySelectorAll('.service-tag').length`
3. Ako je 0: Tagovi nisu renderovani
4. Ako je >0: Proveri da li `.custom-tooltip` klasa postoji u CSS
5. Proveri da li event listener za `mouseenter` postoji

### Dugme "Dodaj Uslugu" ne radi:
1. Otvori Console (F12)
2. Klikni dugme
3. Proveri da li se ispisuje "🔵 Dodavanje nove usluge..."
4. Ako nema: Event listener nije postavljen
5. Proveri liniju ~576 u `app.js`

### Hover efekti ne rade:
1. Otvori DevTools (F12) → Elements tab
2. Selektuj element (tag, dugme...)
3. Proveri Styles panel
4. Proveri da li postoji `:hover` pravilo
5. Proveri da li je `transition` postavljen

### Console ima greške:
1. Pročitaj grešku pažljivo
2. Klikni na link do fajla/linije
3. Proveri sintaksu
4. Ako je import greška: Proveri path
5. Ako je undefined: Proveri da li element postoji u DOM-u

---

## 📞 PODRŠKA

Ako ništa ne radi, javi detalje:
1. Koja je greška u Console-u?
2. Koji test scenario ne prolazi?
3. Screenshot problema
4. Browser verzija

---

**Srećno sa testiranjem! 🚀**
