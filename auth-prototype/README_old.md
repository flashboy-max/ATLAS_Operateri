# 🔐 ATLAS Auth Prototype

Prototip sistema autentikacije i autorizacije za ATLAS aplikaciju.

## 📁 Struktura

```
auth-prototype/
├── login.html          # Login stranica
├── dashboard.html      # Dashboard (nakon logovanja)
├── auth.css           # Stilovi za autentikaciju
├── dashboard.css      # Stilovi za dashboard
├── auth.js            # Logika autentikacije
├── dashboard.js       # Logika dashboard-a
├── mock-data.js       # Test podaci
└── README.md          # Ova datoteka
```

## 🚀 Kako pokrenuti

### Opcija 1: Live Server (preporučeno)
1. Otvori folder u VS Code
2. Desni klik na `login.html` → "Open with Live Server"
3. Otvara se: `http://127.0.0.1:5500/auth-prototype/login.html`

### Opcija 2: Direktno otvaranje
1. Dupli klik na `login.html`
2. Otvara se u browseru

## 👥 Test nalozi

Klikni na bilo koji test nalog u login formi da se automatski popuni!

| Korisničko ime | Lozinka | Rola | Agencija |
|---|---|---|---|
| `admin` | `admin123` | **SUPERADMIN** | System Admin |
| `admin_ks` | `admin123` | **ADMIN** | MUP Kantona Sarajevo |
| `korisnik_ks` | `korisnik123` | **KORISNIK** | MUP Kantona Sarajevo |
| `admin_una` | `admin123` | **ADMIN** | MUP Unsko-sanskog kantona |

## 🎨 Dizajn features

### Login stranica:
- ✅ Minimalistički dizajn inspirisan ATLAS UI-em
- ✅ Dva-panelni layout (branding + forma)
- ✅ Gradient pozadina
- ✅ Toggle password visibility
- ✅ "Zapamti me" funkcionalnost
- ✅ Klik na test nalog popunjava formu
- ✅ Real-time validacija
- ✅ Success/error alert poruke

### Dashboard:
- ✅ **Role-based UI** - različit izgled za svaku rolu
- ✅ Sticky header sa user dropdown menu-om
- ✅ Welcome sekcija sa personaliziranim pozdravom
- ✅ Stats kartiče (broj operatera, korisnika, itd.)
- ✅ Brze akcije (različite za svaku rolu)
- ✅ Nedavne aktivnosti (samo ADMIN i SUPERADMIN)
- ✅ Responsive dizajn

## 🔒 Role-Based Access Control (RBAC)

### 🔴 SUPERADMIN
**Dashboard stats:**
- Ukupno operatera: 31
- Aktivni: 24
- Neaktivni: 7
- **Ukupno korisnika: 47**

**Brze akcije:**
1. Upravljanje korisnicima (SVI korisnici sistema)
2. Upravljanje agencijama
3. Dodaj operatera
4. Pregled operatera
5. Pretraži operatere
6. **Sistemski logovi** (audit trail)

---

### 🔵 ADMIN
**Dashboard stats:**
- Ukupno operatera: 31
- Aktivni: 24
- Neaktivni: 7
- **Korisnici agencije: 12** (samo svoje agencije)

**Brze akcije:**
1. Korisnici agencije (samo SVOJE agencije)
2. Dodaj operatera
3. Pregled operatera
4. Pretraži operatere
5. Izvještaji

---

### 🟢 KORISNIK
**Dashboard stats:**
- Ukupno operatera: 31
- Aktivni: 24
- Neaktivni: 7

**Brze akcije:**
1. Pregled operatera (READ-ONLY)
2. Pretraži operatere
3. Izvoz podataka
4. Moje aktivnosti

---

## 🧪 Kako testirati

### 1. Login flow
```
1. Otvori login.html
2. Klikni na "SUPERADMIN" test nalog
3. Klikni "Prijavi se"
4. ✅ Redirect na dashboard.html
5. Vidi SUPERADMIN dashboard sa 6 akcija
```

### 2. Different roles
```
1. Logout (dropdown → Odjavi se)
2. Login kao "admin_ks" (ADMIN)
3. Vidi drugačiji dashboard (5 akcija, bez sistem logova)
4. Logout
5. Login kao "korisnik_ks" (KORISNIK)
6. Vidi READ-ONLY dashboard (4 akcije, bez nedavnih aktivnosti)
```

### 3. Remember Me
```
1. Login sa ✅ "Zapamti me"
2. Zatvori browser
3. Otvori ponovo dashboard.html
4. ✅ Još uvijek si logovan (localStorage)
```

### 4. Session bez Remember Me
```
1. Login BEZ ✅ "Zapamti me"
2. Zatvori TAB (ne browser)
3. Otvori ponovo dashboard.html
4. ❌ Redirect na login (sessionStorage)
```

## 🔧 Tehničke detalje

### Autentikacija
- **Mock JWT token** generisan sa `btoa()` (base64)
- Token se čuva u `localStorage` (Remember Me) ili `sessionStorage`
- `AuthSystem.requireAuth()` provjera na dashboard.html

### Storage
```javascript
// LocalStorage (Remember Me ✅)
localStorage.setItem('atlas_auth_token', token);
localStorage.setItem('atlas_user', JSON.stringify(user));

// SessionStorage (bez Remember Me)
sessionStorage.setItem('atlas_auth_token', token);
sessionStorage.setItem('atlas_user', JSON.stringify(user));
```

### Role-based rendering
```javascript
// dashboard.js
getActionsForRole(role) {
    if (role === 'SUPERADMIN') {
        return superadminActions;
    }
    if (role === 'ADMIN') {
        return adminActions;
    }
    return korisnikActions;
}
```

## 📱 Responsive dizajn

- **Desktop**: Dvopanelni layout
- **Tablet (< 968px)**: Jedan panel (skriva branding)
- **Mobile (< 480px)**: Optimiziran za mali ekran

## 🎯 Sledeći koraci (za integraciju)

### Faza 1: Backend integracija
- [ ] Zamijeniti mock podatke sa pravom bazom
- [ ] Implementirati pravi JWT token (server-side)
- [ ] Password hashing (bcrypt)
- [ ] API endpoints za auth (`/api/login`, `/api/logout`, `/api/refresh`)

### Faza 2: Security
- [ ] HTTPS obavezan
- [ ] CSRF protection
- [ ] Rate limiting (brute-force zaštita)
- [ ] Secure cookies (httpOnly, sameSite)

### Faza 3: User Management
- [ ] Forme za dodavanje/edit korisnika
- [ ] Password reset flow
- [ ] Email verifikacija
- [ ] 2FA (optional)

### Faza 4: Modularizacija
- [ ] Odvojiti module u `users/`, `operators/`, `reports/`
- [ ] Lazy loading modula
- [ ] Webpack/Vite build process

## 📝 Napomene

⚠️ **OVO JE PROTOTIP!**
- Mock podaci (nema prave baze)
- Client-side validacija (nema backend)
- Plain-text lozinke u mock-data.js (u produkciji NIKAD!)
- Nema prawih security mjera

✅ **Svrha prototipa:**
- Testiranje UI/UX dizajna
- Prikaz role-based funkcionalnosti
- Template za pravu implementaciju

---

**Kreirao:** GitHub Copilot + Tvoje specifikacije  
**Datum:** 01.10.2025  
**Verzija:** 1.0 (Prototype)
