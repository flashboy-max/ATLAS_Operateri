/**
 * 🛠️ OPERATOR HELPER FUNCTIONS
 * ==============================
 * Helper functions za mapiranje operatera između JSON formata i PostgreSQL/Prisma modela
 * 
 * @author GitHub Copilot
 * @date 2025-10-06
 */

/**
 * Mapira JSON format operatera u Prisma model format
 * @param {Object} jsonData - Operator data u JSON formatu (iz forme ili fajla)
 * @returns {Object} - Operator data u Prisma formatu
 */
export function mapJsonToPrisma(jsonData) {
    return {
        id: BigInt(jsonData.id),
        legalName: jsonData.naziv,
        commercialName: jsonData.komercijalni_naziv || null,
        status: jsonData.status || 'aktivan',
        description: jsonData.opis || null,
        notes: jsonData.napomena || null,
        category: jsonData.kategorija || null,
        
        // Tipovi operatera - izvlačimo iz detaljnih usluga
        operatorTypes: extractOperatorTypes(jsonData),
        
        // JSON polja - direktno mapiranje
        contactInfo: jsonData.kontakt || null,
        technicalContacts: jsonData.tehnicki_kontakti || null,
        services: jsonData.detaljne_usluge || null,
        technologies: jsonData.detaljne_tehnologije || null,
        legalObligations: normalizeLegalObligations(jsonData.zakonske_obaveze),
        
        // Metadata
        lastUpdated: jsonData.datum_azuriranja || null,
        contactPerson: jsonData.kontakt_osoba || null,
        
        // System fields
        isActive: (jsonData.status || 'aktivan') === 'aktivan',
        updatedAt: new Date()
    };
}

/**
 * Mapira Prisma model format u JSON format (za frontend/backward compatibility)
 * @param {Object} prismaData - Operator data iz Prisma
 * @returns {Object} - Operator data u JSON formatu
 */
export function mapPrismaToJson(prismaData) {
    return {
        id: Number(prismaData.id),
        naziv: prismaData.legalName,
        komercijalni_naziv: prismaData.commercialName || '',
        status: prismaData.status,
        opis: prismaData.description || '',
        napomena: prismaData.notes || '',
        
        // JSON polja
        kontakt: prismaData.contactInfo || {},
        tehnicki_kontakti: prismaData.technicalContacts || [],
        detaljne_usluge: prismaData.services || {},
        detaljne_tehnologije: prismaData.technologies || {},
        zakonske_obaveze: prismaData.legalObligations || {},
        
        // Metadata
        datum_azuriranja: prismaData.lastUpdated || new Date().toISOString().split('T')[0],
        kontakt_osoba: prismaData.contactPerson || '',
        
        // Legacy fields za backward compatibility
        kategorija: prismaData.category || 'alternativni',
        tipovi: Array.isArray(prismaData.operatorTypes) ? prismaData.operatorTypes : []
    };
}

/**
 * Izvlači tipove operatera iz detaljnih usluga
 * @param {Object} jsonData - JSON data sa detaljnim uslugama
 * @returns {Array|null} - Array tipova ili null
 */
function extractOperatorTypes(jsonData) {
    const types = [];
    
    if (!jsonData.detaljne_usluge) return null;
    
    const services = jsonData.detaljne_usluge;
    
    if (services.mobilne && services.mobilne.length > 0) types.push('mobilni');
    if (services.fiksne && services.fiksne.length > 0) types.push('fiksni');
    if (services.internet && services.internet.length > 0) types.push('isp');
    if (services.tv && services.tv.length > 0) types.push('kablovski');
    if (services.cloud_poslovne && services.cloud_poslovne.length > 0) types.push('enterprise');
    
    return types.length > 0 ? types : null;
}

/**
 * Normalizuje boolean vrijednosti u zakonskim obavezama
 * @param {Object} obligations - Zakonske obaveze
 * @returns {Object|null} - Normalizovane zakonske obaveze
 */
function normalizeLegalObligations(obligations) {
    if (!obligations) return null;
    
    return {
        ...obligations,
        zakonito_presretanje: normalizeBoolean(obligations.zakonito_presretanje),
        pristup_obracunskim_podacima: normalizeBoolean(obligations.pristup_obracunskim_podacima)
    };
}

/**
 * Normalizuje boolean vrijednosti iz različitih formata
 * @param {any} value - Vrijednost koja treba biti boolean
 * @returns {boolean} - Normalizovana boolean vrijednost
 */
function normalizeBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'da' || lower === 'yes') return true;
        if (lower === 'ne' || lower === 'no') return false;
    }
    return false;
}

/**
 * Kreira basic operator info za listing (samo važni podaci)
 * @param {Object} prismaData - Full operator data iz Prisma
 * @returns {Object} - Basic operator info
 */
export function mapPrismaToBasicInfo(prismaData) {
    return {
        id: Number(prismaData.id),
        naziv: prismaData.legalName,
        komercijalni_naziv: prismaData.commercialName || prismaData.legalName,
        status: prismaData.status,
        tipovi: Array.isArray(prismaData.operatorTypes) ? prismaData.operatorTypes : [],
        file: `${prismaData.id}.json` // Za backward compatibility
    };
}
