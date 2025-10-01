const fs = require('fs');
const path = require('path');

// Folder sa pojedinačnim operaterima
const operatorsDir = path.join(__dirname, 'operators');

// Funkcija za određivanje kategorije
function determineKategorija(naziv) {
    const nazivLower = naziv.toLowerCase();
    
    // Proveri da li naziv sadrži bilo koji od ovih stringova
    if (nazivLower.includes('bh telecom') || nazivLower.includes('bh-telecom') || nazivLower.includes('bhtelecom')) {
        return 'dominantni';
    }
    if (nazivLower.includes('telekom srpske') || nazivLower.includes('telekomsrpske')) {
        return 'dominantni';
    }
    if (nazivLower.includes('ht-eronet') || nazivLower.includes('hteronet') || nazivLower.includes('hrvatske telekomunikacije')) {
        return 'dominantni';
    }
    
    return 'alternativni';
}

// Funkcija za određivanje tipova iz starog "tip" polja
function determineTipovi(tipString, detaljneUsluge) {
    const tipovi = [];
    
    // Mapiranje iz starog "tip" string
    if (tipString) {
        const tipLower = tipString.toLowerCase();
        if (tipLower.includes('mobilni') || tipLower.includes('mobile')) {
            tipovi.push('mobilni');
        }
        if (tipLower.includes('mvno')) {
            tipovi.push('mvno');
        }
        if (tipLower.includes('isp') || tipLower.includes('internet')) {
            tipovi.push('isp');
        }
        if (tipLower.includes('kablovski') || tipLower.includes('cable') || tipLower.includes('tv')) {
            tipovi.push('kablovski');
        }
        if (tipLower.includes('enterprise') || tipLower.includes('b2b') || tipLower.includes('business')) {
            tipovi.push('enterprise');
        }
    }
    
    // Dodatna logika iz detaljne_usluge
    if (detaljneUsluge) {
        if (detaljneUsluge.mobilne && detaljneUsluge.mobilne.length > 0 && !tipovi.includes('mobilni')) {
            tipovi.push('mobilni');
        }
        if (detaljneUsluge.internet && detaljneUsluge.internet.length > 0 && !tipovi.includes('isp')) {
            tipovi.push('isp');
        }
        if (detaljneUsluge.tv && detaljneUsluge.tv.length > 0 && !tipovi.includes('kablovski')) {
            tipovi.push('kablovski');
        }
        if (detaljneUsluge.cloud_poslovne && detaljneUsluge.cloud_poslovne.length > 0 && !tipovi.includes('enterprise')) {
            tipovi.push('enterprise');
        }
    }
    
    // Default: ako nema ništa, stavi "ostali"
    if (tipovi.length === 0) {
        tipovi.push('ostali');
    }
    
    return [...new Set(tipovi)]; // Ukloni duplikate
}

// Migriraj sve fajlove u operators/ folderu
function migrateOperatorsFolder() {
    console.log('🚀 Počinje migracija operators/*.json fajlova...\n');
    
    if (!fs.existsSync(operatorsDir)) {
        console.error('❌ Folder operators/ ne postoji!');
        return;
    }
    
    const files = fs.readdirSync(operatorsDir).filter(f => f.endsWith('.json'));
    console.log(`📁 Pronađeno ${files.length} JSON fajlova\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(operatorsDir, file);
        
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // FORSIRAJ re-migraciju da popravimo kategorije
            // Dodaj nova polja
            data.kategorija = determineKategorija(data.naziv);
            data.tipovi = determineTipovi(data.tip || '', data.detaljne_usluge);
            
            // Ukloni stara polja
            delete data.tip;
            delete data.atlas_status;
            delete data.prioritet;
            delete data.kompletnost;
            
            // Sačuvaj nazad
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            
            console.log(`✅ ${file}: kategorija="${data.kategorija}", tipovi=${JSON.stringify(data.tipovi)}`);
            successCount++;
            
        } catch (error) {
            console.error(`❌ ${file}: greška - ${error.message}`);
            errorCount++;
        }
    });
    
    console.log(`\n📊 Rezultat:`);
    console.log(`   ✅ Uspešno: ${successCount}`);
    console.log(`   ❌ Greške: ${errorCount}`);
    console.log(`\n🎉 Migracija završena!`);
}

// Pokreni migraciju
migrateOperatorsFolder();
