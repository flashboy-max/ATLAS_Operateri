# 🎯 QUICK ACTION PLAN - Pre refaktorisanja endpoint-a

**Date**: October 6, 2025  
**Cilj**: Zaštititi ručne izmjene u bazi prije prebacivanja na PostgreSQL endpoint-e

---

## ✅ ŠTA TREBA URADITI (10-15 minuta)

### 1. Ažurirati `operators/18.json` (M&H Company)

**Trenutno u JSON-u**:
```json
"komercijalni_naziv": "",           // ❌ PRAZAN
"opis": "",                          // ❌ PRAZAN
"telefon": "-"                       // ❌ INVALID
```

**Treba biti** (kao u PostgreSQL):
```json
"komercijalni_naziv": "M&H Company",                           // ✅
"opis": "Internet provajder - FTTH i Fixed Wireless usluge",  // ✅
"telefon": "[potrebno dopuniti]"                               // ✅
```

---

### 2. Ažurirati `operators/24.json` (Supernova)

**Trenutno u JSON-u**:
```json
"komercijalni_naziv": "",     // ❌ PRAZAN
"opis": "",                    // ❌ PRAZAN
"detaljne_usluge": {
  "internet": []               // ❌ PRAZAN (zato je operator_types bio NULL!)
}
```

**Treba biti** (kao u PostgreSQL):
```json
"komercijalni_naziv": "Supernova",                        // ✅
"opis": "Telekomunikacioni operater (Blicnet grupa)",    // ✅
"detaljne_usluge": {
  "internet": ["internet_ftth"]                           // ✅ Dodati bar 1 uslugu
}
```

---

### 3. Napraviti SQL Backup

```bash
# Backup operator tabele
docker exec atlas-postgres pg_dump -U atlas_user -d atlas_db -t operator --data-only --inserts > backup/operator_data_2025-10-06.sql
```

**Zašto**:
- ✅ Brz restore ako nešto pođe po zlu
- ✅ Sigurnosna kopija svih ručnih izmjena

---

### 4. Dodati DATA_FREEZE flag u migration script

**Na početak `migrate-operators.js` (poslije imports)**:
```javascript
// ==================== DATA FREEZE PROTECTION ====================
// Prevents accidental overwrites of manual database changes
const DATA_FREEZE = process.env.DATA_FREEZE === 'true';

if (DATA_FREEZE) {
    console.log('⚠️  DATA FREEZE MODE ACTIVE');
    console.log('❌ Migration blocked to preserve manual changes');
    console.log('💡 Remove DATA_FREEZE env var to run migration');
    process.exit(0);
}
// ================================================================
```

---

## 🤔 PITANJE: Da li da uradim sve ovo automatski?

### Opcija 1: **JA URADIM** (automatski, 2 minute)

**Šta ću uraditi**:
1. ✅ Ažurirati `operators/18.json` sa našim izmjenama
2. ✅ Ažurirati `operators/24.json` sa našim izmjenama
3. ✅ Napraviti SQL backup
4. ✅ Dodati DATA_FREEZE flag u migration script

**Rezultat**: Spremno za endpoint refaktorisanje za 2 minute ✅

---

### Opcija 2: **TI RUČNO** (kontrola, 10-15 minuta)

**Šta ti radiš**:
1. Otvoriš `operators/18.json` i ažuriraš 3 polja
2. Otvoriš `operators/24.json` i ažuriraš 3 polja
3. Pokreneš backup komandu
4. Ja ti dam kod za DATA_FREEZE flag

**Rezultat**: Puna kontrola nad izmjenama ✅

---

## 💡 MOJA PREPORUKA: **Opcija 1 (Automatski)**

**Razlog**:
- Samo 2 fajla, 6 linija koda
- Imam tačne vrijednosti iz PostgreSQL-a
- Brže ćemo preći na endpoint refaktorisanje
- Možeš reviewati izmjene prije commit-a

---

## ❓ TVOJA ODLUKA:

**1️⃣ = JA URADIM (automatski, 2 min)**  
**2️⃣ = TI RUČNO (kontrola, 15 min)**

---

**Nakon ovoga nastavljamo sa**:
- ✅ Refaktorisanje `/api/save-operator` (CREATE/UPDATE operatera → PostgreSQL)
- ✅ Refaktorisanje `/api/operator/:id` (READ operator → PostgreSQL)
- ✅ Refaktorisanje `/api/operators` (LIST operatera → PostgreSQL)

**Šta kažeš? 1 ili 2?** 🚀
