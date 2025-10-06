/**
 * Redis Client Module (ES Module version)
 * 
 * Purpose:
 * - Centralized Redis connection management
 * - Automatic reconnection with exponential backoff
 * - Health monitoring and logging
 * - Graceful shutdown handling
 */

import Redis from 'ioredis';

// Redis configuration from environment
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB) || 0,
    
    // Connection settings
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    
    // Retry strategy with exponential backoff
    retryStrategy(times) {
        if (times > 10) {
            console.error('❌ Redis: Maximum retry attempts reached');
            return null;
        }
        const delay = Math.min(times * 50, 2000);
        console.log(`🔄 Redis: Retry attempt ${times}, waiting ${delay}ms`);
        return delay;
    },
    
    // Reconnect on error
    reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
};

// Create Redis client instance
const redis = new Redis(redisConfig);

// Event: Connection successful
redis.on('connect', () => {
    console.log('🔗 Redis: Connecting...');
});

// Event: Ready to accept commands
redis.on('ready', () => {
    console.log('✅ Redis: Connected and ready');
    console.log(`📍 Redis: ${redisConfig.host}:${redisConfig.port} DB ${redisConfig.db}`);
});

// Event: Connection error
redis.on('error', (error) => {
    console.error('❌ Redis error:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('💡 Tip: Make sure Redis container is running (docker-compose up -d redis)');
    }
});

// Event: Connection closed
redis.on('close', () => {
    console.log('🔌 Redis: Connection closed');
});

// Event: Reconnecting
redis.on('reconnecting', (delay) => {
    console.log(`🔄 Redis: Reconnecting in ${delay}ms...`);
});

// Event: Connection ended
redis.on('end', () => {
    console.log('🛑 Redis: Connection ended');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Closing Redis connection...');
    await redis.quit();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️  Closing Redis connection...');
    await redis.quit();
    process.exit(0);
});

// Export the client
export default redis;
