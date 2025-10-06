// Test PostgreSQL Connection via Prisma
// Quick test to verify database connectivity

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    console.log('🔌 Testing PostgreSQL connection...\n');

    try {
        // Test basic connection
        await prisma.$connect();
        console.log('✅ Connected to PostgreSQL successfully!');

        // Test query
        const result = await prisma.$queryRaw`SELECT version();`;
        console.log('\n📊 PostgreSQL Version:');
        console.log(result[0].version);

        // Check if tables exist
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `;

        console.log(`\n📋 Tables in database (${tables.length}):`);
        tables.forEach(t => console.log(`  - ${t.table_name}`));

        // Check user count (if users table exists)
        try {
            const userCount = await prisma.user.count();
            console.log(`\n👥 Users in database: ${userCount}`);
        } catch (e) {
            console.log('\n⚠️  Users table not yet populated or schema not migrated');
        }

        console.log('\n✅ Connection test passed!');

    } catch (error) {
        console.error('\n❌ Connection test failed!');
        console.error('Error:', error.message);
        
        if (error.message.includes('connect')) {
            console.error('\n💡 Troubleshooting tips:');
            console.error('  1. Check if PostgreSQL is running: Get-Service postgresql*');
            console.error('  2. Verify DATABASE_URL in .env file');
            console.error('  3. Ensure database and user exist');
            console.error('  4. Check firewall settings');
        }
        
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

testConnection()
    .catch((error) => {
        process.exit(1);
    });
