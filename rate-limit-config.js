// ==========================================
// Rate Limit Configuration
// ==========================================
// Per-user and global rate limiting

import rateLimit from 'express-rate-limit';

// ==========================================
// 1. Global Rate Limiter
// ==========================================
// Applies to all requests
// Limit: 10000 requests per 15 minutes per IP (VERY generous for testing/development)
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuta
    max: 10000, // 10000 zahtjeva (za testiranje)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Previše zahtjeva. Pokušajte ponovo kasnije.',
        retryAfter: 900 // 15 minuta u sekundama
    }
});

// ==========================================
// 2. Login Rate Limiter (Per-User)
// ==========================================
// Protects against brute-force attacks
// Limit: 5 login attempts per 15 minutes per username
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuta
    max: 5, // 5 pokušaja
    skipSuccessfulRequests: true, // Reset counter on successful login
    keyGenerator: (req) => {
        // Use username from body if present, otherwise IP
        const username = req.body?.korisnickoIme;
        return username ? `login:${username}` : `ip:${req.ip}`;
    },
    handler: (req, res) => {
        const username = req.body?.korisnickoIme || 'Unknown';
        console.log(`⚠️ Login rate limit exceeded for user: ${username} from IP: ${req.ip}`);
        res.status(429).json({
            error: 'Previše pokušaja prijave. Pokušajte ponovo za 15 minuta.',
            retryAfter: 900
        });
    }
});

// ==========================================
// 3. API Rate Limiter (Per-User)
// ==========================================
// Protects API endpoints from abuse
// Limit: 1000 requests per minute per authenticated user (VERY generous for testing)
export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuta
    max: 1000, // 1000 zahtjeva po minuti (za testiranje)
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Previše API zahtjeva. Sačekajte malo.',
        retryAfter: 60
    },
    skip: (req) => {
        // Skip rate limiting for certain routes if needed
        return req.path === '/api/auth/csrf-token';
    }
});

// ==========================================
// 4. Logout Rate Limiter (Per-User)
// ==========================================
// Prevents logout spam
// Limit: 10 logout requests per minute per user
export const logoutLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuta
    max: 10, // 10 zahtjeva
    message: {
        error: 'Previše logout zahtjeva. Sačekajte malo.',
        retryAfter: 60
    }
});

// ==========================================
// 5. Session Management Rate Limiter
// ==========================================
// Prevents abuse of session management endpoints
// Limit: 20 requests per minute per user
export const sessionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuta
    max: 20, // 20 zahtjeva
    message: {
        error: 'Previše zahtjeva za upravljanje sesijama. Sačekajte malo.',
        retryAfter: 60
    }
});

console.log('✅ Rate limiting configuration loaded (Memory Store)');
console.log('   - Global: 100 req / 15min per IP');
console.log('   - Login: 5 attempts / 15min per username');
console.log('   - API: 60 req / 1min');
console.log('   - Logout: 10 req / 1min');
console.log('   - Session: 20 req / 1min');
