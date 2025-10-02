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
