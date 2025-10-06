// Update agencies in PostgreSQL database
// Adds all BiH police agencies according to the official structure

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AGENCIES = [
    // Državni nivo
    {
        code: 'SIPA',
        name: 'Državna agencija za istrage i zaštitu (SIPA)',
        category: 'Državni nivo'
    },
    {
        code: 'GP_BIH',
        name: 'Granična policija BiH (GP BiH)',
        category: 'Državni nivo'
    },
    {
        code: 'MSB_BIH',
        name: 'Ministarstvo bezbjednosti BiH (MSB BiH)',
        category: 'Državni nivo'
    },
    
    // Entitetski nivo
    {
        code: 'FUP',
        name: 'Federalna uprava policije (FUP)',
        category: 'Entitetski nivo'
    },
    {
        code: 'MUP_RS',
        name: 'MUP Republike Srpske (MUP RS)',
        category: 'Entitetski nivo'
    },
    
    // Policija Brčko distrikta
    {
        code: 'PBD_BIH',
        name: 'Policija Brčko distrikta BiH (PBD BiH)',
        category: 'Policija Brčko distrikta'
    },
    
    // Kantonalni MUP-ovi u Federaciji BiH
    {
        code: 'MUP_USK',
        name: 'MUP Unsko-sanskog kantona (MUP USK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_PK',
        name: 'MUP Posavskog kantona (MUP PK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_TK',
        name: 'MUP Tuzlanskog kantona (MUP TK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_ZDK',
        name: 'MUP Zeničko-dobojskog kantona (MUP ZDK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_BPK',
        name: 'MUP Bosansko-podrinjskog kantona Goražde (MUP BPK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_SBK',
        name: 'MUP Srednjobosanskog kantona (MUP SBK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_KS',
        name: 'MUP Kantona Sarajevo (MUP KS)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_HNK',
        name: 'MUP Hercegovačko-neretvanskog kantona (MUP HNK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_ZHK',
        name: 'MUP Zapadnohercegovačkog kantona (MUP ZHK)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    },
    {
        code: 'MUP_K10',
        name: 'MUP Kantona 10 – Livno (MUP K10)',
        category: 'Kantonalni MUP-ovi u Federaciji BiH'
    }
];

async function updateAgencies() {
    console.log('🏢 Updating agencies in PostgreSQL...\n');

    try {
        // First, show existing agencies
        const existing = await prisma.agency.findMany({
            orderBy: { code: 'asc' }
        });
        
        console.log(`📊 Current agencies in database: ${existing.length}`);
        if (existing.length > 0) {
            console.log('Existing:');
            existing.forEach(a => console.log(`  - ${a.code}: ${a.name}`));
            console.log('');
        }

        // Upsert all agencies
        console.log(`🔄 Inserting/Updating ${AGENCIES.length} agencies...\n`);
        
        for (const agency of AGENCIES) {
            const result = await prisma.agency.upsert({
                where: { code: agency.code },
                update: {
                    name: agency.name
                },
                create: {
                    code: agency.code,
                    name: agency.name
                }
            });
            
            console.log(`  ✅ ${result.code}: ${result.name}`);
        }

        // Show final count
        const final = await prisma.agency.findMany({
            orderBy: { code: 'asc' }
        });
        
        console.log(`\n📊 Total agencies in database: ${final.count || final.length}`);
        
        // Group by category for display
        console.log('\n📋 Agencies by category:');
        
        const byCategory = {
            'Državni nivo': [],
            'Entitetski nivo': [],
            'Policija Brčko distrikta': [],
            'Kantonalni MUP-ovi u Federaciji BiH': []
        };
        
        AGENCIES.forEach(a => {
            byCategory[a.category].push(a);
        });
        
        Object.entries(byCategory).forEach(([category, agencies]) => {
            console.log(`\n  ${category}:`);
            agencies.forEach(a => {
                console.log(`    • ${a.code} - ${a.name}`);
            });
        });

        console.log('\n✅ Agencies updated successfully!');
        console.log('\n💡 Next: Update user-management.js to load agencies from database');

    } catch (error) {
        console.error('❌ Update failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

updateAgencies()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
