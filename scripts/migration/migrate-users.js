// User Migration Script - JSON to PostgreSQL
// Migrates auth-users.json to PostgreSQL database
// Preserves all data including MFA settings

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Role mapping: našu JSON strukturu → Prisma schema
const ROLE_MAPPING = {
    'SUPERADMIN': 'SUPERADMIN',
    'ADMIN': 'ADMIN',
    'KORISNIK': 'USER'  // Mapiramo na standardniji naziv
};

// Agency mapping (BiH agencije)
const AGENCIES = {
    'MUP_KS': {
        name: 'Ministarstvo unutrašnjih poslova Kantona Sarajevo',
        code: 'MUP_KS'
    },
    'MUP_BIH': {
        name: 'Ministarstvo sigurnosti BiH',
        code: 'MUP_BIH'
    },
    'SIPA': {
        name: 'Državna agencija za istrage i zaštitu',
        code: 'SIPA'
    }
};

async function loadJsonUsers() {
    console.log('📖 Reading auth-users.json...');
    const jsonPath = path.join(__dirname, '../../data/auth-users.json');
    const data = await fs.readFile(jsonPath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.users;
}

async function createRoles() {
    console.log('🔑 Creating roles...');
    
    const roles = [
        { name: 'SUPERADMIN', description: 'Sistem administrator sa punim pristupom' },
        { name: 'ADMIN', description: 'Administrator agencije' },
        { name: 'USER', description: 'Standardni korisnik agencije' }
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role
        });
    }
    
    console.log('✅ Roles created');
}

async function createAgencies() {
    console.log('🏢 Creating agencies...');
    
    for (const [code, info] of Object.entries(AGENCIES)) {
        await prisma.agency.upsert({
            where: { code: code },
            update: {},
            create: {
                name: info.name,
                code: info.code
            }
        });
    }
    
    console.log('✅ Agencies created');
}

async function migrateUsers(jsonUsers) {
    console.log(`👥 Migrating ${jsonUsers.length} users...`);
    
    const stats = {
        success: 0,
        skipped: 0,
        errors: []
    };

    // Get role and agency IDs for mapping
    const roles = await prisma.role.findMany();
    const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));
    
    const agencies = await prisma.agency.findMany();
    const agencyMap = Object.fromEntries(agencies.map(a => [a.code, a.id]));

    for (const jsonUser of jsonUsers) {
        try {
            console.log(`  Processing: ${jsonUser.username}`);

            // Map role
            const roleName = ROLE_MAPPING[jsonUser.role] || jsonUser.role;
            const roleId = roleMap[roleName];
            
            if (!roleId) {
                throw new Error(`Role not found: ${roleName}`);
            }

            // Map agency (if exists)
            const agencyId = jsonUser.agencija ? agencyMap[jsonUser.agencija] : null;

            // Create user
            const user = await prisma.user.upsert({
                where: { username: jsonUser.username },
                update: {
                    passHash: jsonUser.password_hash,
                    email: jsonUser.email,
                    fullName: `${jsonUser.ime} ${jsonUser.prezime}`,
                    isActive: jsonUser.aktivan,
                    mfaEnabled: jsonUser.mfa_enabled || false,
                    mfaSecret: jsonUser.mfa_secret || null,
                    lastLogin: jsonUser.poslednje_logovanje ? new Date(jsonUser.poslednje_logovanje) : null,
                    agencyId: agencyId
                },
                create: {
                    username: jsonUser.username,
                    passHash: jsonUser.password_hash,
                    email: jsonUser.email,
                    fullName: `${jsonUser.ime} ${jsonUser.prezime}`,
                    isActive: jsonUser.aktivan,
                    mfaEnabled: jsonUser.mfa_enabled || false,
                    mfaSecret: jsonUser.mfa_secret || null,
                    lastLogin: jsonUser.poslednje_logovanje ? new Date(jsonUser.poslednje_logovanje) : null,
                    agencyId: agencyId
                }
            });

            // Assign role
            await prisma.userRole.upsert({
                where: {
                    userId_roleId: {
                        userId: user.id,
                        roleId: roleId
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    roleId: roleId
                }
            });

            console.log(`  ✅ Migrated: ${jsonUser.username} (ID: ${user.id})`);
            stats.success++;

        } catch (error) {
            console.error(`  ❌ Error migrating ${jsonUser.username}:`, error.message);
            stats.errors.push({
                username: jsonUser.username,
                error: error.message
            });
        }
    }

    return stats;
}

async function verifyMigration(jsonUsers) {
    console.log('\n🔍 Verifying migration...');
    
    const dbUserCount = await prisma.user.count();
    const jsonUserCount = jsonUsers.length;
    
    console.log(`  JSON users: ${jsonUserCount}`);
    console.log(`  DB users: ${dbUserCount}`);
    
    if (dbUserCount !== jsonUserCount) {
        console.warn(`  ⚠️  User count mismatch!`);
    } else {
        console.log(`  ✅ User count matches`);
    }

    // Check MFA users
    const mfaUsers = await prisma.user.count({ where: { mfaEnabled: true } });
    const jsonMfaUsers = jsonUsers.filter(u => u.mfa_enabled).length;
    
    console.log(`  JSON MFA users: ${jsonMfaUsers}`);
    console.log(`  DB MFA users: ${mfaUsers}`);
    
    if (mfaUsers !== jsonMfaUsers) {
        console.warn(`  ⚠️  MFA user count mismatch!`);
    } else {
        console.log(`  ✅ MFA user count matches`);
    }

    // List all users
    console.log('\n👥 Migrated users:');
    const users = await prisma.user.findMany({
        include: {
            roles: {
                include: {
                    role: true
                }
            },
            agency: true
        },
        orderBy: { id: 'asc' }
    });

    for (const user of users) {
        const roleName = user.roles[0]?.role.name || 'NO_ROLE';
        const mfaStatus = user.mfaEnabled ? '🔐 MFA' : '  ';
        console.log(`  ${mfaStatus} ${user.username.padEnd(20)} | ${roleName.padEnd(12)} | ${user.fullName}`);
    }
}

async function main() {
    console.log('🚀 Starting user migration from JSON to PostgreSQL\n');

    try {
        // 1. Load JSON data
        const jsonUsers = await loadJsonUsers();
        console.log(`Found ${jsonUsers.length} users in JSON\n`);

        // 2. Create roles
        await createRoles();

        // 3. Create agencies
        await createAgencies();

        // 4. Migrate users
        const stats = await migrateUsers(jsonUsers);

        // 5. Verify migration
        await verifyMigration(jsonUsers);

        // 6. Print summary
        console.log('\n📊 Migration Summary:');
        console.log(`  ✅ Successful: ${stats.success}`);
        console.log(`  ⏭️  Skipped: ${stats.skipped}`);
        console.log(`  ❌ Errors: ${stats.errors.length}`);

        if (stats.errors.length > 0) {
            console.log('\n❌ Errors:');
            stats.errors.forEach(e => {
                console.log(`  - ${e.username}: ${e.error}`);
            });
        }

        console.log('\n✅ User migration completed!');

    } catch (error) {
        console.error('💥 Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
