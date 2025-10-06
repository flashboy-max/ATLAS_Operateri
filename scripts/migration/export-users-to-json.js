// Export users from PostgreSQL back to JSON (temporary fix)
// This ensures the app continues working while we migrate server.js

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function exportUsersToJson() {
    console.log('📤 Exporting users from PostgreSQL to JSON...\n');

    try {
        // Fetch all users from PostgreSQL
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

        console.log(`Found ${users.length} users in PostgreSQL`);

        // Transform to old JSON format for backward compatibility
        const jsonFormat = {
            nextId: users.length + 1,
            users: users.map(u => {
                const [ime, ...prezimeArray] = (u.fullName || '').split(' ');
                const prezime = prezimeArray.join(' ');
                
                return {
                    id: Number(u.id),
                    username: u.username,
                    password_hash: u.passHash,
                    role: u.roles[0]?.role.name || 'USER',
                    ime: ime || u.username,
                    prezime: prezime || '',
                    email: u.email || `${u.username}@atlas.ba`,
                    agencija: u.agency?.code || null,
                    agencija_naziv: u.agency?.name || 'Sistem administrator',
                    aktivan: u.isActive,
                    kreiran: u.createdAt.toISOString().split('T')[0],
                    poslednje_logovanje: u.lastLogin?.toISOString() || null,
                    created_by: null,
                    azuriran: u.updatedAt?.toISOString() || null,
                    mfa_enabled: u.mfaEnabled,
                    mfa_secret: u.mfaSecret || undefined
                };
            }).filter(u => u !== null)
        };

        // Backup existing file first
        const jsonPath = path.join(__dirname, '../../data/auth-users.json');
        const backupPath = path.join(__dirname, '../../data/auth-users.backup.json');
        
        try {
            const existingData = await fs.readFile(jsonPath, 'utf-8');
            await fs.writeFile(backupPath, existingData);
            console.log('✅ Backup created: auth-users.backup.json');
        } catch (e) {
            console.log('⚠️  No existing file to backup');
        }

        // Write new data
        await fs.writeFile(jsonPath, JSON.stringify(jsonFormat, null, 2));
        
        console.log('\n✅ Users exported successfully!');
        console.log(`   File: data/auth-users.json`);
        console.log(`   Users: ${jsonFormat.users.length}`);
        
        // Show exported users
        console.log('\n👥 Exported users:');
        jsonFormat.users.forEach(u => {
            const mfa = u.mfa_enabled ? '🔐' : '  ';
            console.log(`  ${mfa} ${u.username.padEnd(20)} ${u.role.padEnd(12)} ${u.ime} ${u.prezime}`);
        });

        console.log('\n💡 Server.js će sada moći da pročita korisnike iz JSON-a');
        console.log('   Day 3: Migriraćemo server.js da koristi Prisma direktno\n');

    } catch (error) {
        console.error('❌ Export failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

exportUsersToJson()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
