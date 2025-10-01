# ATLAS STANDARDIZACIJA PODATAKA - MASTER PLAN

**Datum kreiranja:** 8. septembar 2025.  
**Verzija:** 2.1 - FAZA 4 ZAVRŠENA  
**Status:** ✅ SVE FAZE ZAVRŠENE - 100% standardizacija operatera  

---

## 🎯 CILJ PROJEKTA

**DVOSTRUKI CILJ:**
1. **Standardizacija podataka** - svih 28 operatera prema ujednačenoj JSON strukturi ✅ ZAVRŠENO
2. **Reorganizacija prikaza** - implementacija novog UI/UX sistema sa proširivim detaljima

## 📊 FINALNO STANJE - SVE FAZE ZAVRŠENE! 🏆

### ✅ FAZA 1 ZAVRŠENA - DOMINANTNI OPERATERI (4/4):
1. **BH Telecom d.d. Sarajevo** - ✅ Master template osnova
2. **Telekom Srpske a.d. Banja Luka (m:tel)** - ✅ Kompletno standardizovan
3. **JP Hrvatske telekomunikacije d.d. Mostar (HT Eronet)** - ✅ Standardizovan
4. **ONE.Vip d.o.o.** - ✅ Standardizovan

### ✅ FAZA 2 ZAVRŠENA - ISP OPERATERI (16/16): 100% 🎉
✅ **Aktivni ISP operateri (11):**
1. **LANACO d.o.o.** - enterprise B2B tehnološki partner
2. **Logosoft d.o.o. Sarajevo** - hibridni ISP+MVNO u m:tel grupi
3. **CRA TELECOM d.o.o.** - CRA licencirani operater
4. **Dasto Semtel d.o.o. Bijeljina (Zona.ba)** - regionalni operater
5. **GiNet d.o.o. Gornji Vakuf-Uskoplje** - lokalni ISP
6. **Global Internet d.o.o. Novi Travnik** - regionalni ISP
7. **AKTON d.o.o. Sarajevo** - multi-tehnološki ISP
8. **ADRIA NET Sarajevo** - regionalni ISP
9. **M&H Company d.o.o.** - grupa operatera
10. **MEDIASAT d.o.o.** - satelitski operater
11. **Miss.Net d.o.o. Bihać** - regionalni širokopojasni ISP

✅ **Arhivirani ISP operateri (5):**
12. **Elta-kabel d.o.o.** - pripojen Supernova
13. **HKB Net d.o.o.** - pripojen Telemach
14. **KATV HS d.o.o.** - pripojen Telemach
15. **PROINTER ITSS d.o.o.** - pripojen BH Telecom
16. **MEDIA SKY d.o.o.** - pripojen Logosoft/m:tel

### ✅ FAZA 3 ZAVRŠENA - MVNO I HIBRIDNI OPERATERI (5/5): 100% 🎉
1. **Novotel d.o.o. Sarajevo (MVNO)** - ✅ MVNO (ex-IZI) sa eSIM tehnologijom
2. **haloo** - ✅ MVNO Supernova operator
3. **Ortak d.o.o.** - ✅ Hibridni MVNO + ISP operater
4. **Telinea d.o.o.** - ✅ Hibridni ISP + TV operater
5. **TX TV d.o.o. Tuzla** - ✅ TV operater

### ✅ BONUS: ZAKONSKE OBAVEZE AŽURIRANE - REGULATORNI STATUS (3/3): 100% 🎉
1. **BH Telecom d.d. Sarajevo** - ✅ Zakonito presretanje i pristup podacima: "Implementirano i dostupno"
2. **HT Eronet** - ✅ Zakonito presretanje i pristup podacima: "Implementirano i dostupno"
3. **m:tel** - ✅ Zakonito presretanje i pristup podacima: "Implementirano i dostupno"

---

## 🏁 **FINALNI SKOR:**
- **FAZA 1:** 4/4 dominantna operatera ✅ (100%)
- **FAZA 2:** 16/16 ISP operatera ✅ (100%)
- **FAZA 3:** 5/5 MVNO/hibridnih operatera ✅ (100%)  
- **FAZA 4:** 3/3 preostala operatera ✅ (100%)
- **BONUS:** 3/3 zakonske obaveze ✅ (100%)

**UKUPNO: 31/31 stavki završeno (100%)** 🏆

---

## 📁 **DODATNE IMPLEMENTACIJE:**
- ✅ **start-atlas-html.bat v2.2** - Napredni launcher sa dinamičkim port detektovanjem
- ✅ **tech_ prefiks standardizacija** - Sve tehnologije standardizovane  
- ✅ **Zakonske obaveze boolean format** - true/false umesto "Da"/"Ne"
- ✅ **Kompletna struktura kontakata** - customer_service, drustvene_mreze
- ✅ **Tehnički kontakti** - Ujednačena struktura sa tip_kontakta

### ✅ FAZA 4 ZAVRŠENA - PREOSTALI OPERATERI (3/3): 100% 🎉
1. **Telemach d.o.o. Sarajevo** - ✅ United Group kablovski operater standardizovan
2. **Wirac.Net d.o.o. Gračanica** - ✅ Regionalni ISP + Novotel partner standardizovan  
3. **VKT-Net d.o.o. Bugojno** - ✅ Kablovski operater standardizovan

---

## 🏗️ REORGANIZACIJA PLANA (POST-STANDARDIZACIJA)

### KORAK 1: Ujednačavanje i čišćenje baze podataka ✅ PRILIKOM RADA

### KORAK 2: Uređenje prikaza tabele (PRIORITET 1) 🔄 SLEDEĆI
- **Smaniti tabelu sa 8 na 7 kolona** (ukloniti ATLAS Status, Prioritet)
- **Dodati Kategorija kolonu** sa emoji ikonama (🏢, 📱, 🌐)
- **Ažurirati širine kolona** u styles.css
- **Kreirati category-badge stilove** (.category-dominantni, .category-mobilni)

### KORAK 3: Prošireni detalji (PRIORITET 2) 🔄 SLEDEĆI  
- **Implementirati expandable row** umesto modala
- **toggleOperatorDetails()** funkcija za otvaranje/zatvaranje
- **generateOperatorDetails()** za dinamički HTML sadržaj
- **CSS animacije** za glatko otvaranje proširenih redova

### KORAK 4: Poboljšanje UX-a i filtriranja (PRIORITET 3) 🔄 SLEDEĆI
- **Brza dugmad za filtriranje** po kategorijama  
- **Search highlighting** sa brojačem rezultata
- **Keyboard shortcuts** (Ctrl+F, Esc)
- **Animacije za search rezultate**

---

## 🏗️ MASTER TEMPLATE STRUKTURA

### Bazirana na BH Telecom/m:tel/HT Eronet standardu:

```json
{
  "id": number,
  "naziv": "Puni službeni naziv",
  "komercijalni_naziv": "Brend naziv",
  "tip": "Standardizovan tip operatera",
  "status": "aktivan|neaktivan",
  "opis": "Detaljan opis operatera",
  "napomena": "Grupno povezivanje i specifičnosti",
  "kontakt": {
    "adresa": "Puna adresa",
    "telefon": "Glavni telefon",
    "email": "Glavni email",
    "web": "https://website.com",
    "customer_service": {
      "privatni": "123",
      "poslovni": "456",
      "info": "789"
    },
    "drustvene_mreze": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/...",
      "twitter": "https://twitter.com/...",
      "linkedin": "https://linkedin.com/..."
    }
  },
  "tehnicki_kontakti": [
    {
      "ime": "Ime Prezime",
      "pozicija": "Funkcija",
      "email": "email@domain",
      "telefon": "+387...",
      "tip_kontakta": "bezbednost|tehnicki"
    }
  ],
  "detaljne_usluge": {
    "mobilne": ["mobile_prepaid", "mobile_postpaid", "mobile_esim"],
    "fiksne": ["fixed_pstn", "fixed_isdn", "fixed_voip"],
    "internet": ["internet_ftth", "internet_adsl_vdsl", "internet_mobile"],
    "tv": ["iptv", "sat_tv", "cable_tv"],
    "cloud_poslovne": ["data_center", "cloud_hosting", "smart_city"],
    "dodatne": ["device_sales", "roaming"]
  },
  "detaljne_tehnologije": {
    "mobilne": ["tech_2g", "tech_3g", "tech_4g", "tech_5g"],
    "fiksne": ["tech_pstn", "tech_voip_fixed", "tech_ims_fixed"],
    "mrezne": ["tech_ftth_fttb", "tech_xdsl", "tech_ipv6"]
  },
  "zakonske_obaveze": {
    "zakonito_presretanje": "Da|Ne|null",
    "implementacija": "Vlastita medijacija|Preko partnera|null",
    "kontakt_osoba": "Ime",
    "email_kontakt": "email@domain",
    "telefon_kontakt": "+387...",
    "posleduje_misljenje_zuo": "Da|Ne|null",
    "pristup_obracunskim_podacima": "Da|Ne|null",
    "napomene": "Specifičnosti implementacije"
  },
  "kompletnost": 100,
  "datum_azuriranja": "2025-09-08",
  "atlas_status": "Spreman za ATLAS|U pripremi za ATLAS",
  "prioritet": "visok|srednji|nizak",
  "kontakt_osoba": "Ime - Pozicija"
}
```

---

## 📋 AKCIONI PLAN - FAZA PO FAZA

### **FAZA 1: DOMINANTNI OPERATERI (PRIORITET 1)**

#### 🎯 Operateri za standardizaciju:
1. **ONE.Vip d.o.o.** - Jedini preostali dominantni operater

#### 📝 Zadaci za ONE.Vip:
- [ ] Pronaći odgovarajući .md fajl u `ToDo/Pojedinacni_operateri/`
- [ ] Ekstraktovati socijalne mreže, customer service brojeve
- [ ] Standardizovati tehnické kontakte (ime, pozicija, email, telefon)
- [ ] Ažurirati detaljne usluge prema .md specifikaciji
- [ ] Ažurirati detaljne tehnologije sa `tech_` prefiksom
- [ ] Kompletirati zakonske obaveze sa direktnim kontaktima
- [ ] Testirati u live aplikaciji

---

### **FAZA 2: REGIONALNI ISP OPERATERI (PRIORITET 2)**

#### 🎯 Lista za standardizaciju:
1. **ADRIA NET d.o.o.**
2. **AKTON d.o.o. Sarajevo** 
3. **Dasto Semtel d.o.o. Bijeljina (Zona.ba)**
4. **Elta-kabel d.o.o.**
5. **GiNet d.o.o. Gornji Vakuf-Uskoplje**
6. **Global Internet d.o.o. Novi Travnik**
7. **HKB Net d.o.o.**
8. **KATV HS d.o.o.**
9. **LANACO d.o.o.**
10. **Logosoft d.o.o. Sarajevo**
11. **M&H Company d.o.o.**
12. **MEDIA SKY d.o.o.**
13. **MEDIASAT d.o.o.**
14. **Miss.Net d.o.o. Bihac**
15. **Ortak d.o.o.**
16. **PROINTER ITSS d.o.o.**

#### 📝 Standardni zadaci za sve ISP operatere:
- [ ] Izvući regulatory podatke iz `detaljne_usluge` sekcija
- [ ] Premestiti ih u `zakonske_obaveze` sekciju
- [ ] Standardizovati tipove operatera na "Internet servis provajder (ISP)"
- [ ] Ažurirati tehnologije sa `tech_` prefiksom
- [ ] Popuniti osnovne kontakt podatke iz .md fajlova
- [ ] Dodati customer service brojeve gdje postoje
- [ ] Validirati strukturu

---

### **FAZA 3: MVNO I HIBRIDNI OPERATERI (PRIORITET 3)**

#### 🎯 Lista za standardizaciju:
1. **Novotel d.o.o. Sarajevo (MVNO)**
2. **CRA TELECOM d.o.o.**
3. **Ostali hibridni operateri**

#### 📝 Specifični zadaci:
- [ ] Definisati MVNO strukturu usluga
- [ ] Povezati sa nadprovajderima (m:tel, BH Telecom)
- [ ] Standardizovati hibridne tehnologije
- [ ] Ažurirati roaming i interconnect podatke

---

### **FAZA 4: OSTALI OPERATERI (PRIORITET 4)**

#### 🎯 Lista preostalih operatera:
- Svi ostali koji nisu kategorisani u prethodne faze

---

## 🛠️ TEHNIČKI PLAN IMPLEMENTACIJE

### **KORAK 1: Kreiranje Standardizacionog Script-a**
```python
# Fajl: atlas_standardization_script.py
def standardize_operator(operator_data, markdown_file=None):
    # Izvući regulatory podatke iz pogrešnih sekcija
    # Standardizovati tehnologije
    # Ujednačiti tipove operatera
    # Popuniti nedostajuće sekcije
    pass
```

### **KORAK 2: Backup Strategija**
- [ ] Kreirati `operateri_backup_pre_standardization.json`
- [ ] Git commit pre svake veće promene
- [ ] Testirati na development branch-u

### **KORAK 3: Validacija**
- [ ] JSON struktura validacija
- [ ] Aplikacija testiranje
- [ ] Live deployment testiranje

---

## 📊 PROGRESS TRACKING

### **Ukupan progres:**
```
Standardizovano: 3/28 (10.7%)
Dominantni: 3/4 (75%) 
ISP: 0/16 (0%)
MVNO: 0/5 (0%)
Ostali: 0/3 (0%)
```

### **Ciljevi po fazama:**
- **Faza 1:** 4/4 dominantna (100%) - Cilj: 10. septembar
- **Faza 2:** 16/16 ISP (100%) - Cilj: 15. septembar  
- **Faza 3:** 5/5 MVNO (100%) - Cilj: 18. septembar
- **Faza 4:** 3/3 ostali (100%) - Cilj: 20. septembar

---

## 🔍 QUALITY ASSURANCE

### **Obavezne provere za svaki operater:**
- [ ] JSON validnost
- [ ] Kompletnost svih obaveznih polja
- [ ] Pravilno kategorisane usluge/tehnologije  
- [ ] Ispravne regulatory informacije
- [ ] Funkcionalne socijalne mreže linkovi
- [ ] Validni email i telefon kontakti
- [ ] Aplikacija prikazuje operatera bez grešaka

### **Finalna validacija:**
- [ ] Svi 28 operatera imaju identičnu strukturu
- [ ] Nema dupliciranih podataka
- [ ] Live aplikacija radi sa svim operaterima
- [ ] GitHub backup kompletiran

---

## 📝 NAPOMENE

1. **Prioritet:** Fokus na kvalitet umesto brzine
2. **Consistency:** Svaki operater mora imati identičnu strukturu
3. **Documentation:** Dokumentovati sve promene u git commit-ima
4. **Testing:** Testirati svaku promenu u live aplikaciji
5. **Backup:** Nikad ne brisati backup fajlove

---

**Sledeći korak:** Kreiranje standardizacionog script-a i početak rada na ONE.Vip operateru.
