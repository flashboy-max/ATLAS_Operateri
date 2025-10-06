/**
 * 🚀 OPERATOR MIGRATION SCRIPT
 * =============================
 * Migrira operatere iz JSON fajlova (operators/*.json) u PostgreSQL bazu.
 * 
 * Phase 1 - Day 2: Operator Migration
 * 
 * @author GitHub Copilot
 * @date 2025-10-06
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== DATA FREEZE PROTECTION ====================
// Prevents accidental overwrites of manual database changes
// Set DATA_FREEZE=true environment variable to block migration
const DATA_FREEZE = process.env.DATA_FREEZE === 'true';

if (DATA_FREEZE) {
    console.log('\n⚠️  ==================== DATA FREEZE MODE ====================');
    console.log('❌ Migration BLOCKED to preserve manual database changes');
    console.log('💡 To run migration, remove DATA_FREEZE environment variable:');
    console.log('   - Windows (PowerShell): $env:DATA_FREEZE="false"; node migrate-operators.js');
    console.log('   - Linux/Mac: DATA_FREEZE=false node migrate-operators.js');
    console.log('⚠️  =======================================================\n');
    process.exit(0);
}
// ================================================================

const prisma = new PrismaClient();

// Path to operators directory
const OPERATORS_DIR = path.join(__dirname, '../../operators');

/**
 * Normalizuje boolean vrijednosti iz JSON
 * JSON može imati: true, false, "Da", "Ne", "da", "ne"
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
 * Parsira operatera iz JSON fajla
 */
function parseOperatorFromJSON(jsonData) {
    return {
        id: BigInt(jsonData.id),
        legalName: jsonData.naziv,
        commercialName: jsonData.komercijalni_naziv || null,
        status: jsonData.status || 'aktivan',
        description: jsonData.opis || null,
        notes: jsonData.napomena || null,
        
        // Kategorija nije u JSON-u, postavljamo null
        category: null,
        
        // Tipovi operatera - izvlačimo iz detaljnih usluga
        operatorTypes: extractOperatorTypes(jsonData),
        
        // Kontakt informacije (direktno iz JSON)
        contactInfo: jsonData.kontakt || null,
        
        // Tehnički kontakti (direktno iz JSON)
        technicalContacts: jsonData.tehnicki_kontakti || null,
        
        // Detaljne usluge (direktno iz JSON)
        services: jsonData.detaljne_usluge || null,
        
        // Detaljne tehnologije (direktno iz JSON)
        technologies: jsonData.detaljne_tehnologije || null,
        
        // Zakonske obaveze (normalizujemo boolean vrijednosti)
        legalObligations: normalizeLegalObligations(jsonData.zakonske_obaveze),
        
        // Metadata
        lastUpdated: jsonData.datum_azuriranja || null,
        contactPerson: jsonData.kontakt_osoba || null,
        
        // System fields
        isActive: (jsonData.status || 'aktivan') === 'aktivan',
        createdAt: new Date(),
        updatedAt: jsonData.datum_azuriranja ? new Date(jsonData.datum_azuriranja) : new Date()
    };
}

/**
 * Izvlači tipove operatera iz detaljnih usluga
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
 * Normalizuje zakonske obaveze
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
 * Učitava sve JSON fajlove operatera
 */
async function loadOperatorsFromJSON() {
    console.log('📂 Učitavam operatere iz JSON fajlova...\n');
    
    const files = fs.readdirSync(OPERATORS_DIR)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => {
            const numA = parseInt(a.replace('.json', ''));
            const numB = parseInt(b.replace('.json', ''));
            return numA - numB;
        });
    
    console.log(`   Pronađeno: ${files.length} JSON fajlova\n`);
    
    const operators = [];
    
    for (const file of files) {
        const filePath = path.join(OPERATORS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(content);
        
        const operator = parseOperatorFromJSON(jsonData);
        operators.push(operator);
        
        console.log(`   ✓ ${file.padEnd(15)} → ${operator.legalName}`);
    }
    
    console.log(`\n✅ Učitano ${operators.length} operatera\n`);
    return operators;
}

/**
 * Migrira operatere u PostgreSQL
 */
async function migrateOperators() {
    try {
        console.log('🚀 OPERATOR MIGRATION - Phase 1 Day 2');
        console.log('=' .repeat(60));
        console.log();
        
        // 1. Učitaj operatere iz JSON-a
        const operators = await loadOperatorsFromJSON();
        
        // 2. Provjeri trenutno stanje u bazi
        console.log('🔍 Provjera postojećih operatera u bazi...\n');
        const existingCount = await prisma.operator.count();
        console.log(`   Trenutno u bazi: ${existingCount} operatera\n`);
        
        if (existingCount > 0) {
            console.log('⚠️  UPOZORENJE: Baza već sadrži operatere!\n');
            console.log('   Opcije:');
            console.log('   1. Obriši sve i migriraj (DESTRUCTIVE)');
            console.log('   2. Upsert - ažuriraj postojeće, dodaj nove (SAFE)');
            console.log('   3. Prekini migraciju\n');
            
            // Za sada koristimo UPSERT (opcija 2)
            console.log('   Izabrano: UPSERT (ažuriraj postojeće, dodaj nove)\n');
        }
        
        // 3. Migriraj operatere
        console.log('💾 Migracija operatera u PostgreSQL...\n');
        
        let created = 0;
        let updated = 0;
        let errors = 0;
        
        for (const operator of operators) {
            try {
                const existing = await prisma.operator.findUnique({
                    where: { id: operator.id }
                });
                
                if (existing) {
                    // Update
                    await prisma.operator.update({
                        where: { id: operator.id },
                        data: {
                            legalName: operator.legalName,
                            commercialName: operator.commercialName,
                            status: operator.status,
                            description: operator.description,
                            notes: operator.notes,
                            category: operator.category,
                            operatorTypes: operator.operatorTypes,
                            contactInfo: operator.contactInfo,
                            technicalContacts: operator.technicalContacts,
                            services: operator.services,
                            technologies: operator.technologies,
                            legalObligations: operator.legalObligations,
                            updatedAt: operator.updatedAt
                        }
                    });
                    updated++;
                    console.log(`   ✓ Updated: ${operator.legalName}`);
                } else {
                    // Create
                    await prisma.operator.create({
                        data: operator
                    });
                    created++;
                    console.log(`   ✓ Created: ${operator.legalName}`);
                }
            } catch (error) {
                errors++;
                console.error(`   ✗ Error: ${operator.legalName}`);
                console.error(`     ${error.message}`);
            }
        }
        
        console.log();
        console.log('=' .repeat(60));
        console.log('📊 MIGRATION SUMMARY');
        console.log('=' .repeat(60));
        console.log(`   Created:  ${created} operatera`);
        console.log(`   Updated:  ${updated} operatera`);
        console.log(`   Errors:   ${errors} greške`);
        console.log(`   Total:    ${created + updated} uspješno migrirano`);
        console.log('=' .repeat(60));
        
        // 4. Verifikacija
        console.log();
        console.log('🔍 Verifikacija migracije...\n');
        
        const finalCount = await prisma.operator.count();
        console.log(`   Ukupno operatera u bazi: ${finalCount}`);
        console.log(`   Očekivano: ${operators.length}`);
        
        if (finalCount === operators.length) {
            console.log('\n✅ MIGRACIJA USPJEŠNA! Svi operateri su migrirani.\n');
        } else {
            console.log('\n⚠️  UPOZORENJE: Broj operatera ne odgovara očekivanju!\n');
        }
        
        // 5. Prikaži primjere
        console.log('📋 Primjer prvog operatera iz baze:\n');
        const firstOperator = await prisma.operator.findFirst({
            orderBy: { id: 'asc' }
        });
        
        if (firstOperator) {
            console.log(`   ID: ${firstOperator.id}`);
            console.log(`   Legal Name: ${firstOperator.legalName}`);
            console.log(`   Commercial Name: ${firstOperator.commercialName || 'N/A'}`);
            console.log(`   Status: ${firstOperator.status}`);
            console.log(`   Types: ${firstOperator.operatorTypes || 'N/A'}`);
            console.log();
        }
        
    } catch (error) {
        console.error('\n❌ GREŠKA PRI MIGRACIJI:');
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Pokreni migraciju
migrateOperators()
    .then(() => {
        console.log('✅ Migration script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration script failed:', error);
        process.exit(1);
    });
