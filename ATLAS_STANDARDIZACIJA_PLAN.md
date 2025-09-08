# ATLAS STANDARDIZACIJA PODATAKA - MASTER PLAN

**Datum kreiranja:** 8. septembar 2025.  
**Verzija:** 1.0  
**Status:** U pripremi  

---

## 🎯 CILJ PROJEKTA

Standardizacija svih 28 operatera u ATLAS bazi podataka prema ujednačenoj JSON strukturi, počevši od dominantnih operatera kao prioritet.

## 📊 TRENUTNO STANJE

### ✅ KOMPLETNO STANDARDIZOVANI OPERATERI (3/28):
1. **BH Telecom d.d. Sarajevo** - ✅ Perfektna struktura sa socijalnim mrežama
2. **Telekom Srpske a.d. Banja Luka (m:tel)** - ✅ Kompletno ažuriran sa .md fajlom
3. **JP Hrvatske telekomunikacije d.d. Mostar (HT Eronet)** - ✅ Tek ažuriran

### 🚧 POTREBNA STANDARDIZACIJA (25/28):
- **Dominantni operateri:** 1 preostao (ONE.Vip)
- **Regionalni ISP:** ~15 operatera
- **MVNO/Hibridni:** ~5 operatera
- **Ostali:** ~4 operatera

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
