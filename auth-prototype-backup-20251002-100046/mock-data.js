// ================================================
// MOCK DATA - Test podaci za prototip
// ================================================

const MOCK_USERS = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123', // U produkciji će biti hash!
        role: 'SUPERADMIN',
        ime: 'Admir',
        prezime: 'Adminović',
        email: 'admin@atlas.ba',
        agencija: null, // SUPERADMIN nema agenciju
        agencija_naziv: 'Sistem administrator',
        aktivan: true,
        kreiran: '2025-01-15',
        poslednje_logovanje: '2025-10-01 09:30:00'
    },
    {
        id: 2,
        username: 'admin_ks',
        password: 'admin123',
        role: 'ADMIN',
        ime: 'Kemal',
        prezime: 'Kemo',
        email: 'kemal.kemo@mup-ks.gov.ba',
        agencija: 'MUP_KS',
        agencija_naziv: 'Ministarstvo unutrašnjih poslova Kantona Sarajevo (MUP KS)',
        aktivan: true,
        kreiran: '2025-02-10',
        poslednje_logovanje: '2025-09-30 14:15:00'
    },
    {
        id: 3,
        username: 'korisnik_ks',
        password: 'korisnik123',
        role: 'KORISNIK',
        ime: 'Amira',
        prezime: 'Amirica',
        email: 'amira.amirica@mup-ks.gov.ba',
        agencija: 'MUP_KS',
        agencija_naziv: 'Ministarstvo unutrašnjih poslova Kantona Sarajevo (MUP KS)',
        aktivan: true,
        kreiran: '2025-03-05',
        poslednje_logovanje: '2025-09-29 11:20:00'
    },
    {
        id: 4,
        username: 'admin_una',
        password: 'admin123',
        role: 'ADMIN',
        ime: 'Nedžad',
        prezime: 'Nedžo',
        email: 'nedzad.nedzo@mup-unsko-sanski.gov.ba',
        agencija: 'MUP_UNSKO_SANSKI',
        agencija_naziv: 'Ministarstvo unutrašnjih poslova Unsko-sanskog kantona (MUP USK)',
        aktivan: true,
        kreiran: '2025-02-20',
        poslednje_logovanje: '2025-09-28 16:45:00'
    }
];

const AGENCIJE = [
    // DRŽAVNI NIVO - Agencije BiH
    { id: 'SIPA', naziv: 'Državna agencija za istrage i zaštitu (SIPA)', tip: 'državni', order: 1 },
    { id: 'GP_BIH', naziv: 'Granična policija BiH (GP BiH)', tip: 'državni', order: 2 },

    // ENTITETSKI NIVO
    { id: 'FUP', naziv: 'Federalna uprava policije (FUP)', tip: 'entitetski', order: 3 },
    { id: 'MUP_RS', naziv: 'MUP Republike Srpske (MUP RS)', tip: 'entitetski', order: 4 },
    
    // POLICIJA BRČKO DISTRIKTA
    { id: 'PBD_BIH', naziv: 'Policija Brčko distrikta BiH (PBD BiH)', tip: 'brčko', order: 5 },
    
    // KANTONALNI NIVO (Federacija BiH) - po redoslijedu kantona
    { id: 'MUP_UNSKO_SANSKI', naziv: 'MUP Unsko-sanskog kantona (MUP USK)', tip: 'kantonalni', order: 6 },
    { id: 'MUP_POSAVSKI', naziv: 'MUP Posavskog kantona (MUP PK)', tip: 'kantonalni', order: 7 },
    { id: 'MUP_TUZLANSKI', naziv: 'MUP Tuzlanskog kantona (MUP TK)', tip: 'kantonalni', order: 8 },
    { id: 'MUP_ZENICKO_DOBOJSKI', naziv: 'MUP Zeničko-dobojskog kantona (MUP ZDK)', tip: 'kantonalni', order: 9 },
    { id: 'MUP_BPK', naziv: 'MUP Bosansko-podrinjskog kantona Goražde (MUP BPK)', tip: 'kantonalni', order: 10 },
    { id: 'MUP_SREDNJE_BOSANSKI', naziv: 'MUP Srednjobosanskog kantona (MUP SBK)', tip: 'kantonalni', order: 11 },
    { id: 'MUP_KS', naziv: 'MUP Kantona Sarajevo (MUP KS)', tip: 'kantonalni', order: 12 },
    { id: 'MUP_HERCEG_NERETVA', naziv: 'MUP Hercegovačko-neretvanskog kantona (MUP HNK)', tip: 'kantonalni', order: 13 },
    { id: 'MUP_ZH', naziv: 'MUP Zapadnohercegovačkog kantona (MUP ZHK)', tip: 'kantonalni', order: 14 },
    { id: 'MUP_KANTON_10', naziv: 'MUP Kantona 10 – Livno (MUP K10)', tip: 'kantonalni', order: 15 }
];

// ================================================
// SYSTEM LOGS - Mock podaci
// ================================================
const SYSTEM_LOGS = [
    {
        id: 1,
        timestamp: '2025-10-02 10:15:30',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'CREATE_USER',
        action_display: 'Kreiranje korisnika',
        target: 'Novi korisnik: test test',
        details: { role: 'KORISNIK', agencija: 'SIPA' },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 2,
        timestamp: '2025-10-02 09:45:12',
        user_id: 1,
        user_name: 'Admir Adminović',
        user_role: 'SUPERADMIN',
        action: 'UPDATE_USER',
        action_display: 'Ažuriranje korisnika',
        target: 'Korisnik: Kemal Kemo',
        details: { changed_fields: ['email', 'role'] },
        ip_address: '192.168.1.50',
        status: 'SUCCESS'
    },
    {
        id: 3,
        timestamp: '2025-10-02 09:30:00',
        user_id: 1,
        user_name: 'Admir Adminović',
        user_role: 'SUPERADMIN',
        action: 'LOGIN',
        action_display: 'Prijava',
        target: 'Uspješna prijava',
        details: { browser: 'Chrome', os: 'Windows' },
        ip_address: '192.168.1.50',
        status: 'SUCCESS'
    },
    {
        id: 4,
        timestamp: '2025-10-01 16:20:45',
        user_id: 3,
        user_name: 'Amira Amirica',
        user_role: 'KORISNIK',
        action: 'SEARCH',
        action_display: 'Pretraga',
        target: 'Pretraga operatera: "BH Telecom"',
        details: { results: 3, query: 'BH Telecom' },
        ip_address: '192.168.1.105',
        status: 'SUCCESS'
    },
    {
        id: 5,
        timestamp: '2025-10-01 15:55:30',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'CREATE_OPERATOR',
        action_display: 'Dodavanje operatera',
        target: 'Operator: Telekom Srpske',
        details: { kategori: 'Mobilni', agencija: 'MUP_KS' },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 6,
        timestamp: '2025-10-01 15:30:18',
        user_id: 4,
        user_name: 'Nedžad Nedžo',
        user_role: 'ADMIN',
        action: 'UPDATE_OPERATOR',
        action_display: 'Uređivanje operatera',
        target: 'Operator: HT Eronet',
        details: { changed: 'kontakt_info' },
        ip_address: '192.168.1.110',
        status: 'SUCCESS'
    },
    {
        id: 7,
        timestamp: '2025-10-01 14:45:00',
        user_id: 1,
        user_name: 'Admir Adminović',
        user_role: 'SUPERADMIN',
        action: 'DELETE_USER',
        action_display: 'Brisanje korisnika',
        target: 'Korisnik: Stari test',
        details: { reason: 'Test korisnik' },
        ip_address: '192.168.1.50',
        status: 'SUCCESS'
    },
    {
        id: 8,
        timestamp: '2025-10-01 14:15:22',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'EXPORT',
        action_display: 'Eksport podataka',
        target: 'Eksport: Operateri MUP KS',
        details: { format: 'Excel', records: 45 },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 9,
        timestamp: '2025-10-01 13:50:10',
        user_id: 3,
        user_name: 'Amira Amirica',
        user_role: 'KORISNIK',
        action: 'LOGIN',
        action_display: 'Prijava',
        target: 'Uspješna prijava',
        details: { browser: 'Firefox', os: 'Windows' },
        ip_address: '192.168.1.105',
        status: 'SUCCESS'
    },
    {
        id: 10,
        timestamp: '2025-10-01 13:30:00',
        user_id: 1,
        user_name: 'Admir Adminović',
        user_role: 'SUPERADMIN',
        action: 'UPDATE_USER',
        action_display: 'Ažuriranje korisnika',
        target: 'Korisnik: Amira Amirica',
        details: { changed_fields: ['status'] },
        ip_address: '192.168.1.50',
        status: 'SUCCESS'
    },
    {
        id: 11,
        timestamp: '2025-09-30 17:45:30',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'LOGOUT',
        action_display: 'Odjava',
        target: 'Odjava iz sistema',
        details: { duration: '8h 15m' },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 12,
        timestamp: '2025-09-30 16:30:45',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'DELETE_OPERATOR',
        action_display: 'Brisanje operatera',
        target: 'Operator: Test Operator',
        details: { reason: 'Neaktivan' },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 13,
        timestamp: '2025-09-30 15:20:00',
        user_id: 4,
        user_name: 'Nedžad Nedžo',
        user_role: 'ADMIN',
        action: 'CREATE_USER',
        action_display: 'Kreiranje korisnika',
        target: 'Novi korisnik: Novi Admin',
        details: { role: 'ADMIN', agencija: 'MUP_UNSKO_SANSKI' },
        ip_address: '192.168.1.110',
        status: 'FAILED'
    },
    {
        id: 14,
        timestamp: '2025-09-30 14:55:30',
        user_id: 3,
        user_name: 'Amira Amirica',
        user_role: 'KORISNIK',
        action: 'SEARCH',
        action_display: 'Pretraga',
        target: 'Pretraga: operateri mobilni',
        details: { results: 12, query: 'mobilni' },
        ip_address: '192.168.1.105',
        status: 'SUCCESS'
    },
    {
        id: 15,
        timestamp: '2025-09-30 14:30:15',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'UPDATE_OPERATOR',
        action_display: 'Uređivanje operatera',
        target: 'Operator: M:tel',
        details: { changed: 'adresa' },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 16,
        timestamp: '2025-09-30 14:15:00',
        user_id: 2,
        user_name: 'Kemal Kemo',
        user_role: 'ADMIN',
        action: 'LOGIN',
        action_display: 'Prijava',
        target: 'Uspješna prijava',
        details: { browser: 'Chrome', os: 'Windows' },
        ip_address: '192.168.1.100',
        status: 'SUCCESS'
    },
    {
        id: 17,
        timestamp: '2025-09-29 16:45:20',
        user_id: 3,
        user_name: 'Amira Amirica',
        user_role: 'KORISNIK',
        action: 'LOGOUT',
        action_display: 'Odjava',
        target: 'Odjava iz sistema',
        details: { duration: '7h 25m' },
        ip_address: '192.168.1.105',
        status: 'SUCCESS'
    },
    {
        id: 18,
        timestamp: '2025-09-29 11:20:00',
        user_id: 3,
        user_name: 'Amira Amirica',
        user_role: 'KORISNIK',
        action: 'LOGIN',
        action_display: 'Prijava',
        target: 'Uspješna prijava',
        details: { browser: 'Firefox', os: 'Windows' },
        ip_address: '192.168.1.105',
        status: 'SUCCESS'
    },
    {
        id: 19,
        timestamp: '2025-09-29 10:30:45',
        user_id: 1,
        user_name: 'Admir Adminović',
        user_role: 'SUPERADMIN',
        action: 'CREATE_OPERATOR',
        action_display: 'Dodavanje operatera',
        target: 'Operator: BH Telecom',
        details: { kategorija: 'Fiksni', agencija: 'SIPA' },
        ip_address: '192.168.1.50',
        status: 'SUCCESS'
    },
    {
        id: 20,
        timestamp: '2025-09-29 09:15:30',
        user_id: 4,
        user_name: 'Nedžad Nedžo',
        user_role: 'ADMIN',
        action: 'LOGIN',
        action_display: 'Prijava',
        target: 'Uspješna prijava',
        details: { browser: 'Edge', os: 'Windows' },
        ip_address: '192.168.1.110',
        status: 'SUCCESS'
    }
];

// Helper funkcije
function getMockUser(username, password) {
    return MOCK_USERS.find(user => 
        user.username === username && 
        user.password === password &&
        user.aktivan
    );
}

function getAgencija(agencijaId) {
    return AGENCIJE.find(a => a.id === agencijaId);
}

// Export za module (ako koristiš)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOCK_USERS, AGENCIJE, getMockUser, getAgencija };
}
