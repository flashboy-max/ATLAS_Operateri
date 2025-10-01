/**
 * Script za standardizaciju zakonskih obaveza u svim operator JSON fajlovima
 * 
 * Ovaj script konvertuje različite formate u standardan format:
 * - "Da" string → true boolean
 * - "Ne" string → false boolean
 * - "N/A" string → undefined (briše se)
 * - { implementirano: "Da" } objekat → true boolean + dodaje podatke
 */

const fs = require('fs');
const path = require('path');

// Glavni direktorijum sa operatorima
const operatorsDir = path.join(__dirname, '..', 'operators');

/**
 * Konvertuje string vrednost u boolean
 */
function convertStringToBoolean(value) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'da' || normalized === 'yes' || normalized === 'true') {
            return true;
        }
        if (normalized === 'ne' || normalized === 'no' || normalized === 'false') {
            return false;
        }
        if (normalized === 'n/a' || normalized === 'nepoznato' || normalized === 'unknown') {
            return undefined; // Briše se kasnije
        }
    }
    return undefined;
}

/**
 * Standardizuje zakonske_obaveze objekat
 */
function standardizeLegalObligations(zo) {
    if (!zo || typeof zo !== 'object') {
        return null;
    }

    const standardized = {};

    // === Zakonito presretanje ===
    if (zo.zakonito_presretanje !== undefined) {
        if (typeof zo.zakonito_presretanje === 'object') {
            // Format kao u operator 4, 22, 23, itd.
            const nested = zo.zakonito_presretanje;
            
            // Ekstraktuj boolean iz nested objekta
            if (nested.implementirano !== undefined) {
                standardized.zakonito_presretanje = convertStringToBoolean(nested.implementirano);
            }
            
            // Ekstraktuj dodatne podatke
            if (nested.nacin_implementacije && nested.nacin_implementacije !== '[potrebno dopuniti]') {
                standardized.implementacija = nested.nacin_implementacije;
            }
            if (nested.kontakt_osoba && nested.kontakt_osoba !== '[potrebno dopuniti]') {
                standardized.kontakt_osoba = nested.kontakt_osoba;
            }
            if (nested.email && nested.email !== '[potrebno dopuniti]') {
                standardized.email_kontakt = nested.email;
            }
            if (nested.telefon && nested.telefon !== '[potrebno dopuniti]') {
                standardized.telefon_kontakt = nested.telefon;
            }
            if (nested.misljenje_zuo && nested.misljenje_zuo !== '[potrebno dopuniti]') {
                standardized.posleduje_misljenje_zuo = nested.misljenje_zuo;
            }
        } else {
            // String ili boolean format
            const converted = convertStringToBoolean(zo.zakonito_presretanje);
            if (converted !== undefined) {
                standardized.zakonito_presretanje = converted;
            }
        }
    }

    // === Pristup obračunskim podacima ===
    if (zo.pristup_obracunskim_podacima !== undefined) {
        if (typeof zo.pristup_obracunskim_podacima === 'object' && zo.pristup_obracunskim_podacima !== null) {
            const nested = zo.pristup_obracunskim_podacima;
            if (nested.omogucen !== undefined) {
                standardized.pristup_obracunskim_podacima = convertStringToBoolean(nested.omogucen);
            }
        } else {
            const converted = convertStringToBoolean(zo.pristup_obracunskim_podacima);
            if (converted !== undefined) {
                standardized.pristup_obracunskim_podacima = converted;
            }
        }
    }

    // === Ostala polja (zadržavaju se ako postoje) ===
    
    // Implementacija
    if (zo.implementacija && zo.implementacija !== '[potrebno dopuniti]') {
        standardized.implementacija = zo.implementacija;
    }

    // Kontakt osoba
    if (zo.kontakt_osoba && zo.kontakt_osoba !== '[potrebno dopuniti]') {
        standardized.kontakt_osoba = zo.kontakt_osoba;
    }

    // Email kontakt
    if (zo.email_kontakt && zo.email_kontakt !== '[potrebno dopuniti]') {
        standardized.email_kontakt = zo.email_kontakt;
    }

    // Telefon kontakt
    if (zo.telefon_kontakt && zo.telefon_kontakt !== '[potrebno dopuniti]') {
        standardized.telefon_kontakt = zo.telefon_kontakt;
    }

    // Poslovođuje mišljenje ZUO
    if (zo.posleduje_misljenje_zuo && zo.posleduje_misljenje_zuo !== '[potrebno dopuniti]') {
        standardized.posleduje_misljenje_zuo = zo.posleduje_misljenje_zuo;
    }

    // Napomene
    if (zo.napomene && zo.napomene !== '[potrebno dopuniti]') {
        standardized.napomene = zo.napomene;
    }

    // Dozvola za rad (stara polja - opciono)
    if (zo.dozvola_za_rad) {
        standardized.dozvola_za_rad = zo.dozvola_za_rad;
    }
    if (zo.datum_izdavanja) {
        standardized.datum_izdavanja = zo.datum_izdavanja;
    }
    if (zo.vazenje_dozvole) {
        standardized.vazenje_dozvole = zo.vazenje_dozvole;
    }
    if (zo.status_dozvole) {
        standardized.status_dozvole = zo.status_dozvole;
    }

    // Vrati null ako nema ničega standardizovanog
    return Object.keys(standardized).length > 0 ? standardized : null;
}

/**
 * Procesira jedan operator fajl
 */
function processOperatorFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const operator = JSON.parse(content);

        // Proveri da li operator ima zakonske_obaveze
        if (!operator.zakonske_obaveze) {
            console.log(`⏭️  ${path.basename(filePath)}: Nema zakonske_obaveze, preskačem`);
            return { skipped: true };
        }

        // Sačuvaj originalnu strukturu
        const originalZO = JSON.stringify(operator.zakonske_obaveze, null, 2);

        // Standardizuj zakonske obaveze
        const standardized = standardizeLegalObligations(operator.zakonske_obaveze);

        if (standardized) {
            operator.zakonske_obaveze = standardized;

            // Proveri da li se nešto promenilo
            const newZO = JSON.stringify(operator.zakonske_obaveze, null, 2);
            if (originalZO !== newZO) {
                // Sačuvaj ažurirani fajl
                fs.writeFileSync(filePath, JSON.stringify(operator, null, 2), 'utf8');
                console.log(`✅ ${path.basename(filePath)}: Standardizovano`);
                return { updated: true, original: originalZO, new: newZO };
            } else {
                console.log(`✔️  ${path.basename(filePath)}: Već standardizovano`);
                return { alreadyStandard: true };
            }
        } else {
            // Ukloni prazne zakonske_obaveze
            delete operator.zakonske_obaveze;
            fs.writeFileSync(filePath, JSON.stringify(operator, null, 2), 'utf8');
            console.log(`🗑️  ${path.basename(filePath)}: Uklonjene prazne zakonske_obaveze`);
            return { removed: true };
        }

    } catch (error) {
        console.error(`❌ ${path.basename(filePath)}: Greška - ${error.message}`);
        return { error: true, message: error.message };
    }
}

/**
 * Glavni proces
 */
function main() {
    console.log('🚀 Pokrećem standardizaciju zakonskih obaveza...\n');

    // Učitaj sve operator fajlove
    const files = fs.readdirSync(operatorsDir)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(operatorsDir, f));

    console.log(`📁 Pronađeno ${files.length} operator fajlova\n`);

    // Statistika
    const stats = {
        total: files.length,
        updated: 0,
        alreadyStandard: 0,
        skipped: 0,
        removed: 0,
        errors: 0
    };

    // Procesiraj svaki fajl
    files.forEach(filePath => {
        const result = processOperatorFile(filePath);
        
        if (result.updated) stats.updated++;
        if (result.alreadyStandard) stats.alreadyStandard++;
        if (result.skipped) stats.skipped++;
        if (result.removed) stats.removed++;
        if (result.error) stats.errors++;
    });

    // Prikaži statistiku
    console.log('\n' + '='.repeat(60));
    console.log('📊 STATISTIKA STANDARDIZACIJE');
    console.log('='.repeat(60));
    console.log(`Ukupno fajlova:          ${stats.total}`);
    console.log(`✅ Ažurirano:            ${stats.updated}`);
    console.log(`✔️  Već standardizovano: ${stats.alreadyStandard}`);
    console.log(`⏭️  Preskočeno:          ${stats.skipped}`);
    console.log(`🗑️  Uklonjeno:           ${stats.removed}`);
    console.log(`❌ Greške:               ${stats.errors}`);
    console.log('='.repeat(60));

    if (stats.errors === 0) {
        console.log('\n✨ Standardizacija uspešno završena!');
    } else {
        console.log('\n⚠️  Standardizacija završena sa greškama.');
    }
}

// Pokreni main proces
main();
