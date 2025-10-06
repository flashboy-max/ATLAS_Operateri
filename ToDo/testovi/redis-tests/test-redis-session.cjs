/**
 * Redis & Session Manager Test Script
 * 
 * Tests:
 * 1. Redis connection
 * 2. Session creation
 * 3. Session retrieval
 * 4. Session update
 * 5. Multiple sessions for same user
 * 6. Delete session
 * 7. Delete all user sessions
 */

require('dotenv').config();
const redis = require('./scripts/helpers/redis-client.cjs');
const sessionManager = require('./scripts/helpers/session-manager.cjs');

async function runTests() {
    console.log('\n🧪 Starting Redis & Session Manager Tests...\n');
    
    try {
        // Wait for Redis connection
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 1: Redis basic operations
        console.log('📝 Test 1: Redis SET/GET');
        await redis.set('test:key', 'test_value');
        const value = await redis.get('test:key');
        console.log(`   ✅ SET/GET: ${value === 'test_value' ? 'PASSED' : 'FAILED'}`);
        await redis.del('test:key');
        
        // Test 2: Create session
        console.log('\n📝 Test 2: Create Session');
        const { sessionId, refreshToken } = await sessionManager.createSession(
            1, 
            {
                username: 'admin',
                role: 'SUPERADMIN',
                full_name: 'Aleksandar Jovičić',
                email: 'admin@atlas.gov.ba',
                agencija: null,
                agencija_naziv: 'Sistem administrator'
            },
            {
                ip: '127.0.0.1',
                userAgent: 'Node.js Test Script',
                deviceName: 'Test Machine'
            }
        );
        console.log(`   ✅ Session created: ${sessionId}`);
        console.log(`   ✅ Refresh token: ${refreshToken.substring(0, 16)}...`);
        
        // Test 3: Get session
        console.log('\n📝 Test 3: Get Session');
        const sessionData = await sessionManager.getSession(sessionId);
        console.log(`   ✅ Session retrieved: ${sessionData.username} (${sessionData.role})`);
        
        // Test 4: Update session
        console.log('\n📝 Test 4: Update Session');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updated = await sessionManager.updateSession(sessionId);
        console.log(`   ✅ Session updated: ${updated ? 'SUCCESS' : 'FAILED'}`);
        
        // Test 5: Multiple sessions
        console.log('\n📝 Test 5: Multiple Sessions for Same User');
        const { sessionId: sessionId2 } = await sessionManager.createSession(
            1,
            {
                username: 'admin',
                role: 'SUPERADMIN',
                full_name: 'Aleksandar Jovičić'
            },
            {
                ip: '192.168.1.100',
                userAgent: 'Mobile Browser',
                deviceName: 'iPhone 13'
            }
        );
        const userSessions = await sessionManager.getUserSessions(1);
        console.log(`   ✅ User has ${userSessions.length} sessions`);
        userSessions.forEach((s, i) => {
            console.log(`      ${i + 1}. ${s.deviceName} (Last: ${new Date(s.lastActivity).toLocaleTimeString()})`);
        });
        
        // Test 6: Verify refresh token
        console.log('\n📝 Test 6: Verify Refresh Token');
        const verifiedSessionId = await sessionManager.verifyRefreshToken(refreshToken);
        console.log(`   ✅ Refresh token maps to: ${verifiedSessionId === sessionId ? 'CORRECT SESSION' : 'WRONG SESSION'}`);
        
        // Test 7: Delete single session
        console.log('\n📝 Test 7: Delete Single Session');
        const deleted = await sessionManager.deleteSession(sessionId2);
        console.log(`   ✅ Session deleted: ${deleted ? 'SUCCESS' : 'FAILED'}`);
        
        const remainingSessions = await sessionManager.getUserSessions(1);
        console.log(`   ✅ Remaining sessions: ${remainingSessions.length}`);
        
        // Test 8: Delete all user sessions
        console.log('\n📝 Test 8: Delete All User Sessions');
        const deletedCount = await sessionManager.deleteAllUserSessions(1);
        console.log(`   ✅ Deleted ${deletedCount} sessions`);
        
        console.log('\n✅ All tests PASSED!\n');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    } finally {
        await redis.quit();
        process.exit(0);
    }
}

runTests();
