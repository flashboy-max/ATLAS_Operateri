const fs = require('fs');
const path = require('path');

// Load current data
const dataPath = path.join(__dirname, 'operateri.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('🚀 Pokrećem migraciju na novu strukturu...');
console.log(`📊 Ukupno operatera: ${data.operateri.length}\n`);

// Backup original file
const backupPath = path.join(__dirname, `operateri_backup_${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
console.log(`✅ Backup kreiran: ${backupPath}\n`);

// Dominantni operateri - tačna imena
const DOMINANTNI = ['BH Telecom', 'Telekom Srpske', 'HT-Eronet'];

// Tipovi mapiranja bazirno na stare tipove
function determineKategorija(operator) {
    const naziv = operator.naziv || '';
    const tip = operator.tip || '';
    
    // Proveri da li je dominantni po nazivu
    if (DOMINANTNI.some(dom => naziv.includes(dom))) {
        return 'dominantni';
    }
    
    // Svi ostali su alternativni
    return 'alternativni';
}

function determineTipovi(operator) {
    const tip = (operator.tip || '').toLowerCase();
    const tipovi = [];
    
    // Mobilni operater
    if (tip.includes('mobilni operater') || tip.includes('mobile')) {
        tipovi.push('mobilni');
    }
    
    // MVNO
    if (tip.includes('mvno')) {
        tipovi.push('mvno');
    }
    
    // ISP
    if (tip.includes('isp') || tip.includes('internet servis provajder') || 
        tip.includes('internet') || tip.includes('širokopojasni')) {
        tipovi.push('isp');
    }
    
    // Kablovski
    if (tip.includes('kablovski') || tip.includes('iptv') || tip.includes('tv')) {
        tipovi.push('kablovski');
    }
    
    // Enterprise/B2B
    if (tip.includes('enterprise') || tip.includes('b2b') || 
        tip.includes('poslovni') || tip.includes('sistemska integracija') ||
        tip.includes('it provajder')) {
        tipovi.push('enterprise');
    }
    
    // Ako nema nijedan tip ili je nepoznat, dodaj ostali
    if (tipovi.length === 0) {
        tipovi.push('ostali');
    }
    
    return [...new Set(tipovi)]; // Remove duplicates
}

// Migrate each operator
let migratedCount = 0;
data.operateri = data.operateri.map(operator => {
    const kategorija = determineKategorija(operator);
    const tipovi = determineTipovi(operator);
    
    console.log(`📝 ${operator.naziv}:`);
    console.log(`   Stari tip: "${operator.tip}"`);
    console.log(`   Nova kategorija: ${kategorija}`);
    console.log(`   Novi tipovi: [${tipovi.join(', ')}]`);
    console.log('');
    
    // Remove old fields
    const cleaned = { ...operator };
    delete cleaned.tip;
    delete cleaned.atlas_status;
    delete cleaned.prioritet;
    delete cleaned.kompletnost;
    
    // Add new fields
    cleaned.kategorija = kategorija;
    cleaned.tipovi = tipovi;
    
    // Standardize kontakt structure - flatten if needed
    if (cleaned.kontakt) {
        if (!cleaned.kontakt.adresa && cleaned.adresa) {
            cleaned.kontakt.adresa = cleaned.adresa;
            delete cleaned.adresa;
        }
        if (!cleaned.kontakt.telefon && cleaned.telefon) {
            cleaned.kontakt.telefon = cleaned.telefon;
            delete cleaned.telefon;
        }
        if (!cleaned.kontakt.email && cleaned.email) {
            cleaned.kontakt.email = cleaned.email;
            delete cleaned.email;
        }
        if (!cleaned.kontakt.web && cleaned.web) {
            cleaned.kontakt.web = cleaned.web;
            delete cleaned.web;
        }
    }
    
    migratedCount++;
    return cleaned;
});

// Save migrated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('\n✅ Migracija završena!');
console.log(`📊 Migrirano operatera: ${migratedCount}`);
console.log(`📁 Novi fajl: ${dataPath}`);
console.log(`🔙 Backup: ${backupPath}`);
