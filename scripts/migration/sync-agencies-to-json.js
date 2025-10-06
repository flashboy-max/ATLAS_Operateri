// Sync agencies from PostgreSQL back to JSON
// Ensures both database and JSON have the same agencies

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Category mapping for agencies
const AGENCY_CATEGORIES = {
    'SIPA': 'Državni nivo',
    'GP_BIH': 'Državni nivo',
    'MSB_BIH': 'Državni nivo',
    'FUP': 'Entitetski nivo',
    'MUP_RS': 'Entitetski nivo',
    'PBD_BIH': 'Policija Brčko distrikta',
    'MUP_USK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_PK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_TK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_ZDK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_BPK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_SBK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_KS': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_HNK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_ZHK': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_K10': 'Kantonalni MUP-ovi u Federaciji BiH',
    'MUP_BIH': 'Državni nivo'
};

async function syncAgenciesToJson() {
    console.log('📤 Syncing agencies from PostgreSQL to JSON...\n');

    try {
        // Get all agencies from database
        const agencies = await prisma.agency.findMany({
            orderBy: { code: 'asc' }
        });

        console.log(`Found ${agencies.length} agencies in PostgreSQL`);

        // Group by category
        const grouped = {};
        agencies.forEach(a => {
            const category = AGENCY_CATEGORIES[a.code] || 'Ostalo';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push({
                code: a.code,
                name: a.name
            });
        });

        // Create JSON structure
        const jsonStructure = {
            agencies: agencies.map(a => ({
                code: a.code,
                name: a.name,
                category: AGENCY_CATEGORIES[a.code] || 'Ostalo'
            })),
            groupedByCategory: grouped
        };

        // Write to JSON file
        const jsonPath = path.join(__dirname, '../../data/agencies.json');
        await fs.writeFile(jsonPath, JSON.stringify(jsonStructure, null, 2));

        console.log('\n✅ Agencies synced to JSON!');
        console.log(`   File: data/agencies.json`);
        console.log(`   Total: ${agencies.length} agencies`);

        // Display grouped agencies
        console.log('\n📋 Agencies by category:');
        Object.entries(grouped).forEach(([category, agencyList]) => {
            console.log(`\n  ${category}:`);
            agencyList.forEach(a => {
                console.log(`    • ${a.code}: ${a.name}`);
            });
        });

        console.log('\n💡 JSON file ready for frontend to use');

    } catch (error) {
        console.error('❌ Sync failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

syncAgenciesToJson()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
