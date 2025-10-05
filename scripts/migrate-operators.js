// filepath: scripts/migrate-operators.js
// ✅ KOMPLETNA MIGRACIJA - Prenosi SVE podatke iz operateri.json u PostgreSQL
// ✅ BEZ GUBITKA PODATAKA - Mapira se svako polje

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function migrateOperators() {
  console.log('📦 Migrating operators from operateri.json...\n');

  try {
    // Učitaj JSON podatke
    const jsonPath = path.join(__dirname, '..', 'operateri.json');
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonData);
    
    if (!data.operateri || !Array.isArray(data.operateri)) {
      throw new Error('operateri.json nema validnu strukturu: očekuje se { operateri: [...] }');
    }

    const operators = data.operateri;
    console.log(`📊 Pronađeno ${operators.length} operatera za migraciju\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const op of operators) {
      try {
        // Provjeri da li operater već postoji
        const existing = await prisma.operator.findUnique({
          where: { legalName: op.naziv }
        });

        if (existing) {
          console.log(`   ⏭️  Skipping ${op.naziv} (već postoji)`);
          skipped++;
          continue;
        }

        // MAPIRANJE SVA POLJA IZ operateri.json → PostgreSQL
        const operatorData = {
          // ===== OSNOVNI PODACI =====
          legalName: op.naziv,
          commercialName: op.komercijalni_naziv || null,
          status: op.status || 'aktivan',
          description: op.opis || null,
          notes: op.napomena || null,
          
          // ===== KATEGORIJA I TIPOVI =====
          category: op.kategorija || null,
          operatorTypes: op.tipovi || null,  // Array → JSONB
          
          // ===== KONTAKT INFORMACIJE =====
          // Kompletan "kontakt" objekat → JSONB
          contactInfo: op.kontakt || null,
          // Struktura: { adresa, telefon, email, web, customer_service, drustvene_mreze }
          
          // ===== TEHNIČKI KONTAKTI =====
          // Array "tehnicki_kontakti" → JSONB
          technicalContacts: op.tehnicki_kontakti || null,
          // Struktura: [{ ime, pozicija, email, telefon, tip_kontakta }]
          
          // ===== DETALJNE USLUGE =====
          // "detaljne_usluge" objekat → JSONB
          services: op.detaljne_usluge || null,
          // Struktura: { mobilne: [], fiksne: [], internet: [], tv: [], cloud_poslovne: [], dodatne: [] }
          
          // ===== DETALJNE TEHNOLOGIJE =====
          // "detaljne_tehnologije" objekat → JSONB
          technologies: op.detaljne_tehnologije || null,
          // Struktura: { mobilne: [], fiksne: [], mrezne: [] }
          
          // ===== ZAKONSKE OBAVEZE (KRITIČNO) =====
          // "zakonske_obaveze" objekat → JSONB
          legalObligations: op.zakonske_obaveze || null,
          // Struktura: { 
          //   zakonito_presretanje, 
          //   implementacija, 
          //   kontakt_osoba, 
          //   email_kontakt, 
          //   telefon_kontakt,
          //   posleduje_misljenje_zuo,
          //   pristup_obracunskim_podacima,
          //   napomene
          // }
          
          // ===== DODATNE INFORMACIJE =====
          lastUpdated: op.datum_azuriranja || null,
          contactPerson: op.kontakt_osoba || null,
          
          // ===== LEGACY POLJA (za backward compatibility) =====
          // Ekstrakcija iz kontakt objekta za brzi pristup
          contactEmail: op.kontakt?.email || null,
          contactPhone: op.kontakt?.telefon || null,
          apiBaseUrl: op.api_base_url || null,  // Ako postoji u JSON
          
          // ===== SYSTEM POLJA =====
          isActive: op.status === 'aktivan'
        };

        // Kreiraj operatera
        const createdOperator = await prisma.operator.create({
          data: operatorData
        });

        console.log(`   ✅ Migrated: ${createdOperator.legalName} (ID: ${createdOperator.id})`);
        migrated++;

        // ===== CAPABILITIES - Ekstraktuj usluge i dodaj u capability tabelu =====
        const capabilities = new Set();
        
        if (op.detaljne_usluge) {
          // Dodaj sve usluge kao capabilities
          const serviceGroups = [
            'mobilne', 'fiksne', 'internet', 'tv', 'cloud_poslovne', 'dodatne'
          ];
          
          for (const group of serviceGroups) {
            if (op.detaljne_usluge[group] && Array.isArray(op.detaljne_usluge[group])) {
              op.detaljne_usluge[group].forEach(service => capabilities.add(service));
            }
          }
        }
        
        if (op.detaljne_tehnologije) {
          // Dodaj i ključne tehnologije kao capabilities
          const techGroups = ['mobilne', 'fiksne', 'mrezne'];
          
          for (const group of techGroups) {
            if (op.detaljne_tehnologije[group] && Array.isArray(op.detaljne_tehnologije[group])) {
              // Dodaj samo flagship tehnologije (5G, FTTH, itd.)
              const flagshipTechs = [
                'tech_5g_nr', 'tech_5g_ready', 'tech_4g', 'tech_ftth_fttb', 
                'tech_voip_fixed', 'tech_ipv6', 'tech_mpls'
              ];
              
              op.detaljne_tehnologije[group].forEach(tech => {
                if (flagshipTechs.includes(tech)) {
                  capabilities.add(tech);
                }
              });
            }
          }
        }
        
        // Dodaj capabilities u bazu
        for (const capability of capabilities) {
          try {
            await prisma.operatorCapability.create({
              data: {
                operatorId: createdOperator.id,
                capability: capability
              }
            });
          } catch (capError) {
            // Ignoriši duplicate errore
            if (!capError.code === 'P2002') {
              console.error(`      ⚠️  Capability error: ${capError.message}`);
            }
          }
        }
        
        if (capabilities.size > 0) {
          console.log(`      📋 Added ${capabilities.size} capabilities`);
        }

        // ===== AUDIT LOG ENTRY =====
        await prisma.auditLog.create({
          data: {
            action: 'OPERATOR_CREATE',
            actionDisplay: 'Operator migrated from JSON',
            status: 'SUCCESS',
            targetType: 'OPERATOR',
            targetId: createdOperator.id,
            targetDisplay: createdOperator.legalName,
            metadata: {
              source: 'operateri.json',
              migration_date: new Date().toISOString(),
              json_id: op.id,
              has_legal_obligations: !!op.zakonske_obaveze,
              has_technical_contacts: !!op.tehnicki_kontakti && op.tehnicki_kontakti.length > 0,
              services_count: capabilities.size
            }
          }
        });

      } catch (error) {
        console.error(`   ❌ Error migrating ${op.naziv}:`, error.message);
        errors++;
      }
    }

    // ===== SUMMARY =====
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${migrated} operators`);
    console.log(`⏭️  Skipped (already exist): ${skipped} operators`);
    console.log(`❌ Errors: ${errors} operators`);
    console.log(`📦 Total processed: ${operators.length} operators`);
    console.log('='.repeat(60) + '\n');

    // ===== VERIFICATION =====
    console.log('🔍 Verifying migration...\n');
    
    const totalInDB = await prisma.operator.count();
    const activeInDB = await prisma.operator.count({ where: { isActive: true } });
    const withLegalObligations = await prisma.operator.count({
      where: { 
        legalObligations: { not: null } 
      }
    });
    
    console.log(`   Total operators in DB: ${totalInDB}`);
    console.log(`   Active operators: ${activeInDB}`);
    console.log(`   With legal obligations: ${withLegalObligations}`);
    
    // Provjeri nekoliko operatera
    const sampleOperators = await prisma.operator.findMany({
      take: 3,
      include: {
        capabilities: true
      }
    });
    
    console.log('\n📋 Sample operators:');
    for (const op of sampleOperators) {
      console.log(`\n   ${op.legalName} (${op.commercialName || 'N/A'})`);
      console.log(`      Status: ${op.status}`);
      console.log(`      Category: ${op.category || 'N/A'}`);
      console.log(`      Types: ${op.operatorTypes ? JSON.stringify(op.operatorTypes) : 'N/A'}`);
      console.log(`      Capabilities: ${op.capabilities.length}`);
      console.log(`      Has contact info: ${op.contactInfo ? 'Yes' : 'No'}`);
      console.log(`      Has technical contacts: ${op.technicalContacts ? 'Yes' : 'No'}`);
      console.log(`      Has services: ${op.services ? 'Yes' : 'No'}`);
      console.log(`      Has technologies: ${op.technologies ? 'Yes' : 'No'}`);
      console.log(`      Has legal obligations: ${op.legalObligations ? 'Yes ⚠️ KRITIČNO' : 'No'}`);
    }

    console.log('\n✅ Migration completed successfully!\n');
    
    // ===== POST-MIGRATION STEPS =====
    console.log('📝 Next steps:');
    console.log('   1. Kreiraj GIN indekse: psql -U atlas_user -d atlas_db -f scripts/create-gin-indexes.sql');
    console.log('   2. Dodaj CHECK constraints: psql -U atlas_user -d atlas_db -f scripts/add-check-constraints.sql');
    console.log('   3. Testiraj JSON pretragu:');
    console.log('      SELECT legal_name FROM operator WHERE services @> \'{"mobilne": ["5g"]}\'::jsonb;');
    console.log('   4. Testiraj legal obligations pretragu:');
    console.log('      SELECT legal_name FROM operator WHERE legal_obligations @> \'{"zakonito_presretanje": "Da"}\'::jsonb;');
    console.log('   5. Ažuriraj aplikativni kod da koristi nove fieldove (legalName, commercialName, itd.)');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Pokreni migraciju
if (require.main === module) {
  migrateOperators()
    .then(() => {
      console.log('🎉 Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateOperators };
