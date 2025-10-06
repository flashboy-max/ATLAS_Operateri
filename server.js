// ==========================================
// ATLAS Server - Load Environment Variables FIRST
// ==========================================
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { PrismaClient } from '@prisma/client';
import { mapJsonToPrisma, mapPrismaToJson, mapPrismaToBasicInfo } from './scripts/helpers/operator-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// ==========================================
// Environment Variables (from .env)
// ==========================================
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'FALLBACK_DEV_SECRET_CHANGE_IN_PRODUCTION';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'FALLBACK_REFRESH_SECRET_CHANGE_IN_PRODUCTION';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🚀 ATLAS Server starting in ${NODE_ENV} mode on port ${PORT}`);
const TOKEN_EXPIRY = process.env.AUTH_JWT_EXPIRES_IN || '24h';

const operatorsDir = path.join(__dirname, 'operators');
const authDataPath = path.join(__dirname, 'data', 'auth-users.json');
const logsDir = path.join(__dirname, 'data', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Logger utility
class Logger {
    static logTypes = {
        LOGIN: 'login',
        LOGOUT: 'logout',
        CREATE_USER: 'create_user',
        UPDATE_USER: 'update_user',
        DELETE_USER: 'delete_user',
        UPDATE_PROFILE: 'update_profile',
        CHANGE_PASSWORD: 'change_password',
        CREATE_OPERATOR: 'create_operator',
        UPDATE_OPERATOR: 'update_operator',
        DELETE_OPERATOR: 'delete_operator',
        ERROR: 'error',
        SECURITY: 'security',
        SYSTEM: 'system'
    };

    static actionDisplayMap = {
        LOGIN: 'Prijava korisnika',
        LOGOUT: 'Odjava korisnika',
        CREATE_USER: 'Kreiranje korisnika',
        UPDATE_USER: 'Azuriranje korisnika',
        DELETE_USER: 'Brisanje korisnika',
        UPDATE_PROFILE: 'Azuriranje profila',
        CHANGE_PASSWORD: 'Promjena lozinke',
        CREATE_OPERATOR: 'Dodavanje operatera',
        UPDATE_OPERATOR: 'Azuriranje operatera',
        DELETE_OPERATOR: 'Brisanje operatera',
        REQUEST: 'HTTP zahtjev',
        SECURITY: 'Sigurnosni dogadjaj',
        SYSTEM: 'Sistemski dogadjaj'
    };

    static generateLogId() {
        return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    static formatTimestamp(date = new Date()) {
        const pad = (value) => String(value).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return {
            display: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            iso: date.toISOString()
        };
    }

    static getActionDisplay(action, message) {
        return this.actionDisplayMap[action] || message || 'Sistemski dogadjaj';
    }

    static buildLogEntry(type, message, userId = null, metadata = {}) {
        const time = this.formatTimestamp(new Date());
        const meta = { ...(metadata || {}) };

        const rawAction = (meta.action || type || 'system').toString();
        delete meta.action;
        const action = rawAction.toUpperCase();

        const actionDisplay = meta.action_display || this.getActionDisplay(action, message);
        delete meta.action_display;

        const status = (meta.status || (type === this.logTypes.ERROR || meta.success === false ? 'FAILED' : 'SUCCESS')).toString().toUpperCase();
        delete meta.status;

        const resolvedUserName = meta.user_name || meta.username || meta.userName ||
            (meta.first_name && meta.last_name ? `${meta.first_name} ${meta.last_name}` :
            (meta.user && meta.user.ime && meta.user.prezime ? `${meta.user.ime} ${meta.user.prezime}` :
            (userId ? `Korisnik #${userId}` : 'Sistem')));
        delete meta.user_name;
        delete meta.username;
        delete meta.userName;

        const resolvedUserRole = meta.user_role || meta.role || (meta.user && meta.user.role) || (userId ? 'KORISNIK' : 'SYSTEM');
        delete meta.user_role;
        delete meta.role;

        const target = meta.target || meta.target_name || message;
        delete meta.target;
        delete meta.target_name;

        const ipAddress = meta.ip || meta.ip_address || 'unknown';
        delete meta.ip;
        delete meta.ip_address;

        const userAgent = meta.userAgent || meta.user_agent || 'unknown';
        delete meta.userAgent;
        delete meta.user_agent;

        return {
            id: this.generateLogId(),
            timestamp: time.display,
            timestamp_iso: time.iso,
            type,
            category: (type || 'system').toString().toUpperCase(),
            action,
            action_display: actionDisplay,
            status,
            message,
            userId: userId,
            user_id: userId,
            user_name: resolvedUserName,
            user_role: resolvedUserRole,
            target,
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: meta
        };
    }

    static log(type, message, userId = null, metadata = {}) {
        const logEntry = this.buildLogEntry(type, message, userId, metadata);
        this.writeLog(logEntry);
        console.log(`[${logEntry.timestamp_iso}] ${logEntry.action}: ${message}`, metadata);
    }

    static writeLog(entry) {
        const dateStr = entry.timestamp.split(' ')[0];
        const logFile = path.join(logsDir, `${dateStr}.json`);

        try {
            let logs = [];
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                logs = content ? JSON.parse(content) : [];
            }

            logs.push(entry);
            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to write log:', error);
        }
    }

    static normalizeEntry(entry) {
        if (!entry) return null;
        if (entry.timestamp && entry.timestamp_iso) {
            return entry;
        }

        const cloned = { ...entry };
        const timestampSource = cloned.timestamp || cloned.time || new Date().toISOString();
        const timestampIso = /T/.test(timestampSource)
            ? (timestampSource.endsWith('Z') ? timestampSource : `${timestampSource}Z`)
            : new Date(timestampSource).toISOString();
        const timestampDisplay = timestampIso.replace('T', ' ').slice(0, 19);

        const type = cloned.type || cloned.action || 'system';
        const action = (cloned.action || type).toString().toUpperCase();

        return {
            id: cloned.id || this.generateLogId(),
            timestamp: timestampDisplay,
            timestamp_iso: timestampIso,
            type,
            category: (type || 'system').toString().toUpperCase(),
            action,
            action_display: cloned.action_display || cloned.message || this.getActionDisplay(action, cloned.message),
            status: (cloned.status || (type === this.logTypes.ERROR ? 'FAILED' : 'SUCCESS')).toString().toUpperCase(),
            message: cloned.message || '',
            userId: cloned.userId ?? cloned.user_id ?? null,
            user_id: cloned.userId ?? cloned.user_id ?? null,
            user_name: cloned.user_name || cloned.metadata?.user_name || cloned.metadata?.username || 'Sistem',
            user_role: cloned.user_role || cloned.metadata?.role || 'SYSTEM',
            target: cloned.target || cloned.metadata?.target || cloned.message || '',
            ip_address: cloned.ip_address || cloned.ip || cloned.metadata?.ip || 'unknown',
            user_agent: cloned.user_agent || cloned.userAgent || cloned.metadata?.userAgent || 'unknown',
            metadata: cloned.metadata || {}
        };
    }

    static async getLogs(startDate = null, endDate = null, type = null, userId = null) {
        try {
            const entries = [];
            const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.json'));

            for (const file of files) {
                const filePath = path.join(logsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const fileLogs = content ? JSON.parse(content) : [];
                for (const entry of fileLogs) {
                    const normalized = this.normalizeEntry(entry);
                    if (normalized) {
                        entries.push(normalized);
                    }
                }
            }

            let filtered = entries;

            if (startDate) {
                filtered = filtered.filter(log => new Date(log.timestamp_iso) >= new Date(startDate));
            }
            if (endDate) {
                filtered = filtered.filter(log => new Date(log.timestamp_iso) <= new Date(endDate));
            }
            if (type) {
                filtered = filtered.filter(log => log.type === type || log.category === type.toString().toUpperCase());
            }
            if (userId) {
                filtered = filtered.filter(log => String(log.user_id) === String(userId));
            }

            return filtered.sort((a, b) => new Date(b.timestamp_iso) - new Date(a.timestamp_iso));
        } catch (error) {
            console.error('Failed to read logs:', error);
            return [];
        }
    }
}

// ==========================================
// Security & Rate Limiting Middleware
// ==========================================

// Cookie Parser (required for CSRF and session management)
app.use(cookieParser());

// Rate Limiting Configuration
const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX) || 10, // 10 attempts per window
    message: {
        error: 'Previše pokušaja prijave. Pokušajte ponovo za 15 minuta.',
        retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for successful requests with valid tokens
        return req.authUser && req.method !== 'POST';
    }
});

// General API Rate Limiting
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 min
    max: parseInt(process.env.API_RATE_LIMIT_MAX) || 100, // 100 requests per minute
    message: {
        error: 'Previše API zahtjeva. Pokušajte ponovo za minutu.',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// CSRF Protection (will be enabled after implementing HttpOnly cookies)
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

console.log('✅ Security middleware configured (Rate limiting, Cookie parser)');

// ==========================================
// CORS & Body Parser Middleware
// ==========================================

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Request logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;

        Logger.log(Logger.logTypes.SYSTEM, `${req.method} ${req.path} - ${res.statusCode}`,
            req.authUser?.id, {
                action: res.statusCode >= 400 ? 'REQUEST_ERROR' : 'REQUEST',
                action_display: `${req.method} ${req.path}`,
                status: res.statusCode >= 400 ? 'FAILED' : 'SUCCESS',
                user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}` : 'Sistem',
                user_role: req.authUser?.role || 'SYSTEM',
                target: req.originalUrl || req.path,
                method: req.method,
                path: req.path,
                status_code: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip || req.connection?.remoteAddress,
                userAgent: req.get('User-Agent')
            }
        );
    });
    
    next();
});

function ensureOperatorsDir() {
    if (!fs.existsSync(operatorsDir)) {
        fs.mkdirSync(operatorsDir, { recursive: true });
    }
}

function readAuthData() {
    if (!fs.existsSync(authDataPath)) {
        throw new Error('Auth data store not found at ' + authDataPath);
    }
    const raw = fs.readFileSync(authDataPath, 'utf8');
    return JSON.parse(raw);
}

function writeAuthData(data) {
    fs.writeFileSync(authDataPath, JSON.stringify(data, null, 2), 'utf8');
}

function sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
}

function generateToken(user) {
    return jwt.sign({
        sub: user.id,
        role: user.role,
        agencija: user.agencija
    }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token missing' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const data = readAuthData();
        const userId = payload.sub || payload.userId; // Support both formats
        const user = data.users.find(u => u.id === userId && u.aktivan);

        if (!user) {
            return res.status(401).json({ error: 'Session expired or user disabled' });
        }

        req.authUser = sanitizeUser(user);
        req.authUser.role = user.role;
        req.authUser.tokenPayload = payload;
        
        // Handle limited token (for MFA setup)
        if (payload.mfa_setup_required) {
            req.authUser.mfa_setup_required = true;
            req.authUser.permissions = payload.permissions || [];
        }
        
        req.authRawUser = user;
        req.authData = data;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function requireRoles(...roles) {
    return (req, res, next) => {
        console.log('🔐 requireRoles check:', {
            requiredRoles: roles,
            userRole: req.authUser?.role,
            userId: req.authUser?.id,
            username: req.authUser?.username,
            path: req.path,
            mfa_setup_required: req.authUser?.mfa_setup_required,
            permissions: req.authUser?.permissions
        });

        // If user has limited token, only allow specific endpoints
        if (req.authUser.mfa_setup_required && req.authUser.permissions?.includes('mfa_setup_only')) {
            // Allow access to MFA setup and basic profile endpoints
            const allowedPaths = [
                '/api/auth/mfa/setup',
                '/api/auth/mfa/verify', 
                '/api/auth/session',
                '/api/auth/logout'
            ];
            
            const currentPath = req.path || req.url;
            if (!allowedPaths.includes(currentPath)) {
                return res.status(403).json({ 
                    error: 'Morate postaviti MFA da biste pristupili ovoj funkciji.',
                    mfa_setup_required: true 
                });
            }
        }
        
        if (!roles.includes(req.authUser.role)) {
            console.log('❌ Access denied: role not in allowed roles');
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        
        console.log('✅ Access granted');
        next();
    };
}

ensureOperatorsDir();

// ----------------------------
// Auth routes
// ----------------------------
app.post('/api/auth/login', loginLimiter, (req, res) => {
    try {
        const { username, password, mfa_token } = req.body || {};

        if (!username || !password) {
            Logger.log(Logger.logTypes.SECURITY, 'Login attempt with missing credentials', null, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            return res.status(400).json({ error: 'Missing username or password' });
        }

        const data = readAuthData();
        const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user || !user.aktivan) {
            Logger.log(Logger.logTypes.SECURITY, `Failed login attempt for username: ${username}`, null, {
                username,
                reason: !user ? 'user_not_found' : 'user_deactivated',
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            return res.status(401).json({ error: 'Neispravni kredencijali ili deaktiviran nalog' });
        }

        const passwordOk = bcrypt.compareSync(password, user.password_hash);
        if (!passwordOk) {
            Logger.log(Logger.logTypes.SECURITY, `Failed login attempt - wrong password for user: ${username}`, user.id, {
                username,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            return res.status(401).json({ error: 'Neispravni kredencijali' });
        }

        // MFA Check - Required for SUPERADMIN and ADMIN, optional for KORISNIK
        const mfaRequired = user.role === 'SUPERADMIN' || user.role === 'ADMIN';
        
        // 🔧 Check if MFA is explicitly disabled (mfa_enabled: false)
        if (user.mfa_enabled === false && mfaRequired) {
            // Admin has explicitly disabled MFA - this is allowed, give full access
            Logger.log(Logger.logTypes.SECURITY, `Admin login with MFA disabled: ${username}`, user.id, {
                username,
                role: user.role,
                ip: req.ip
            });
            
            // Continue with normal login (skip MFA checks)
        } else if (user.mfa_enabled || mfaRequired) {
            // Check if admin doesn't have MFA setup - allow limited login for setup
            if (mfaRequired && !user.mfa_secret && user.mfa_enabled !== false) {
                Logger.log(Logger.logTypes.SECURITY, `Admin login without MFA setup - creating limited token for user: ${username}`, user.id, {
                    username,
                    role: user.role,
                    ip: req.ip
                });
                
                const limitedToken = jwt.sign({ 
                    sub: user.id, 
                    username: user.username, 
                    role: user.role,
                    mfa_setup_required: true,
                    permissions: ['mfa_setup_only'] // Very limited permissions
                }, JWT_SECRET, { expiresIn: '1h' }); // Short expiry
                
                user.poslednje_logovanje = new Date().toISOString();
                writeAuthData(data);
                
                return res.status(200).json({ 
                    success: true,
                    token: limitedToken,
                    user: {
                        id: user.id,
                        username: user.username,
                        ime: user.ime,
                        prezime: user.prezime,
                        role: user.role,
                        agencija: user.agencija,
                        agencija_naziv: user.agencija_naziv,
                        mfa_setup_required: true
                    },
                    message: 'Privremeno ulogovanje. Morate postaviti MFA da biste pristupili svim funkcijama.'
                });
            }
            
            if (!mfa_token) {
                Logger.log(Logger.logTypes.SECURITY, `Login attempt without MFA token for user: ${username}`, user.id, {
                    username,
                    role: user.role,
                    mfa_required: mfaRequired,
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                });
                return res.status(200).json({ 
                    mfa_required: true,
                    message: mfaRequired ? 
                        'MFA je obavezan za administratore. Unesite 6-cifreni kod iz aplikacije.' :
                        'MFA je omogućen za ovaj nalog. Unesite 6-cifreni kod.'
                });
            }

            // Verify MFA token
            if (!user.mfa_secret) {
                Logger.log(Logger.logTypes.SECURITY, `MFA token provided but no secret stored for user: ${username}`, user.id, {
                    username,
                    ip: req.ip
                });
                return res.status(403).json({ 
                    error: 'MFA setup je obavezan.',
                    mfa_setup_required: true,
                    message: 'Molimo vas da postavite MFA prije sljedeće prijave.'
                });
            }

            const mfaValid = speakeasy.totp.verify({
                secret: user.mfa_secret,
                encoding: 'base32',
                token: mfa_token,
                window: 2 // ±60 seconds tolerance
            });

            if (!mfaValid) {
                Logger.log(Logger.logTypes.SECURITY, `Failed MFA verification for user: ${username}`, user.id, {
                    username,
                    role: user.role,
                    token_provided: mfa_token.substring(0, 2) + '****',
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                });
                return res.status(401).json({ error: 'Neispravan MFA kod. Provjerite aplikaciju i pokušajte ponovo.' });
            }

            Logger.log(Logger.logTypes.SECURITY, `Successful MFA verification for user: ${username}`, user.id, {
                username,
                role: user.role,
                ip: req.ip
            });
        }

        // Force MFA setup for SUPERADMIN and ADMIN if not enabled
        // 🔧 Only block if mfa_enabled is not explicitly false (undefined or null means not set up yet)
        if (mfaRequired && !user.mfa_enabled && user.mfa_enabled !== false) {
            Logger.log(Logger.logTypes.SECURITY, `Admin user without MFA attempted login: ${username}`, user.id, {
                username,
                role: user.role,
                ip: req.ip
            });
            return res.status(403).json({ 
                error: 'MFA setup je obavezan za administratore.',
                mfa_setup_required: true,
                message: 'Molimo vas da postavite MFA prije sljedeće prijave.'
            });
        }

        user.poslednje_logovanje = new Date().toISOString();
        writeAuthData({ ...data, users: data.users });

        Logger.log(Logger.logTypes.LOGIN, `User logged in successfully: ${username}`, user.id, {
            username,
            role: user.role,
            mfa_used: !!mfa_token,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        const token = generateToken(user);
        return res.json({
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, `Login error: ${error.message}`, null, {
            error: error.stack,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
    Logger.log(Logger.logTypes.LOGOUT, `User logged out: ${req.authUser.username}`, req.authUser.id, {
        username: req.authUser.username,
        role: req.authUser.role,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    return res.json({ success: true });
});

app.get('/api/auth/session', authenticateToken, (req, res) => {
    return res.json({ user: req.authUser });
});

app.get('/api/auth/users', authenticateToken, requireRoles('SUPERADMIN', 'ADMIN'), (req, res) => {
    try {
        const { authUser, authData } = req;
        let users = authData.users;

        if (authUser.role === 'ADMIN') {
            users = users.filter(u => u.created_by === authUser.id || u.id === authUser.id);
        }

        return res.json(users.map(sanitizeUser));
    } catch (error) {
        console.error('List users error:', error);
        return res.status(500).json({ error: 'Failed to load users' });
    }
});

app.post('/api/auth/users', authenticateToken, requireRoles('SUPERADMIN', 'ADMIN'), (req, res) => {
    try {
        const { authUser, authData } = req;
        const { ime, prezime, email, role, agencija, aktivan = true, password } = req.body || {};

        if (!ime || !prezime || !email || !password) {
            return res.status(400).json({ error: 'Nedostaju obavezna polja (ime, prezime, email, password)' });
        }

        const username = (req.body.username || '').trim();
        if (!username) {
            return res.status(400).json({ error: 'Nedostaje korisnicko ime' });
        }

        if (authData.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return res.status(409).json({ error: 'Korisnicko ime vec postoji' });
        }

        let resolvedRole = role;
        let resolvedAgency = agencija;
        let resolvedAgencyName = req.body.agencija_naziv || '';

        if (authUser.role === 'ADMIN') {
            resolvedRole = 'KORISNIK';
            resolvedAgency = authUser.agencija;
            resolvedAgencyName = authUser.agencija_naziv;
        } else if (!['SUPERADMIN', 'ADMIN', 'KORISNIK'].includes(resolvedRole)) {
            return res.status(400).json({ error: 'Nepoznata rola' });
        }

        if (resolvedRole !== 'SUPERADMIN' && !resolvedAgency) {
            return res.status(400).json({ error: 'Agencija je obavezna za ovu rolu' });
        }

        const newId = authData.nextId || (Math.max(...authData.users.map(u => u.id)) + 1);
        const password_hash = bcrypt.hashSync(password, 10);

        const newUser = {
            id: newId,
            username,
            password_hash,
            role: resolvedRole,
            ime,
            prezime,
            email,
            agencija: resolvedAgency || null,
            agencija_naziv: resolvedAgencyName || '',
            aktivan: !!aktivan,
            kreiran: new Date().toISOString(),
            poslednje_logovanje: null,
            created_by: authUser.id
        };

        const nextId = newId + 1;
        const updatedData = {
            ...authData,
            nextId,
            users: [...authData.users, newUser]
        };
        writeAuthData(updatedData);

        return res.status(201).json({ user: sanitizeUser(newUser) });
    } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Kreiranje korisnika nije uspjelo' });
    }
});

app.put('/api/auth/users/:id', authenticateToken, requireRoles('SUPERADMIN', 'ADMIN'), (req, res) => {
    try {
        const userId = Number.parseInt(req.params.id, 10);
        const { authUser, authData } = req;
        const index = authData.users.findIndex(u => u.id === userId);

        if (index === -1) {
            return res.status(404).json({ error: 'Korisnik nije pronaden' });
        }

        const targetUser = authData.users[index];

        if (authUser.role === 'ADMIN') {
            const canManage = targetUser.created_by === authUser.id || targetUser.id === authUser.id;
            if (!canManage) {
                return res.status(403).json({ error: 'Nemate pravo uredjivanja ovog korisnika' });
            }
        }

        const updates = {};
        const editableFields = ['ime', 'prezime', 'email', 'aktivan'];

        if (authUser.role === 'SUPERADMIN') {
            editableFields.push('role', 'agencija', 'agencija_naziv');
        }

        for (const field of editableFields) {
            if (field in req.body) {
                updates[field] = req.body[field];
            }
        }

        if (authUser.role === 'ADMIN') {
            if ('role' in updates) delete updates.role;
            if ('agencija' in updates) delete updates.agencija;
            if ('agencija_naziv' in updates) delete updates.agencija_naziv;
            if (targetUser.role === 'SUPERADMIN') {
                return res.status(403).json({ error: 'Nemate pravo uredjivanja ovog korisnika' });
            }
        }

        if (req.body.password) {
            updates.password_hash = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = {
            ...targetUser,
            ...updates
        };

        const updatedData = {
            ...authData,
            users: authData.users.map(u => (u.id === userId ? updatedUser : u))
        };

        writeAuthData(updatedData);

        return res.json({ user: sanitizeUser(updatedUser) });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ error: 'Azuriranje korisnika nije uspjelo' });
    }
});

app.delete('/api/auth/users/:id', authenticateToken, requireRoles('SUPERADMIN'), (req, res) => {
    try {
        const userId = Number.parseInt(req.params.id, 10);
        const { authData, authUser } = req;

        if (userId === authUser.id) {
            return res.status(400).json({ error: 'Ne mozete obrisati vlastiti nalog' });
        }

        if (!authData.users.some(u => u.id === userId)) {
            return res.status(404).json({ error: 'Korisnik nije pronaden' });
        }

        const updatedData = {
            ...authData,
            users: authData.users.filter(u => u.id !== userId)
        };

        writeAuthData(updatedData);
        return res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ error: 'Brisanje korisnika nije uspjelo' });
    }
});

// Update profile endpoint
app.put('/api/auth/update-profile', authenticateToken, (req, res) => {
    try {
        const { authUser, authData } = req;
        const { ime, prezime, email } = req.body;

        // Validation
        if (!ime || !prezime) {
            return res.status(400).json({ error: 'Ime i prezime su obavezni' });
        }

        if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ error: 'Neispravna email adresa' });
        }

        // Find user and update
        const userIndex = authData.users.findIndex(u => u.id === authUser.id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Korisnik nije pronaden' });
        }

        // Update user data
        authData.users[userIndex] = {
            ...authData.users[userIndex],
            ime: ime.trim(),
            prezime: prezime.trim(),
            email: email ? email.trim() : authData.users[userIndex].email,
            azuriran: new Date().toISOString()
        };

        // Save to file
        writeAuthData(authData);

        // Return updated user data
        return res.json({ 
            success: true, 
            user: sanitizeUser(authData.users[userIndex])
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ error: 'Ažuriranje profila nije uspjelo' });
    }
});

// Change password endpoint
app.put('/api/auth/change-password', authenticateToken, (req, res) => {
    try {
        const { authUser, authData } = req;
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Trenutna i nova lozinka su obavezne' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Nova lozinka mora imati najmanje 8 karaktera' });
        }

        // Find user
        const userIndex = authData.users.findIndex(u => u.id === authUser.id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Korisnik nije pronaden' });
        }

        const user = authData.users[userIndex];

        // Verify current password
        if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
            return res.status(400).json({ error: 'Trenutna lozinka nije ispravna' });
        }

        // Hash new password
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        // Update password
        authData.users[userIndex] = {
            ...user,
            password_hash: hashedNewPassword,
            azuriran: new Date().toISOString()
        };

        // Save to file
        writeAuthData(authData);

        return res.json({ success: true });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Promena lozinke nije uspjela' });
    }
});

// Frontend error logging endpoint
app.post('/api/system/log-error', authenticateToken, (req, res) => {
    try {
        const { authUser } = req;
        const { message, stack, url, userAgent, context } = req.body;

        Logger.log(Logger.logTypes.ERROR, `Frontend error: ${message}`, authUser.id, {
            stack,
            url,
            userAgent,
            context,
            ip: req.ip,
            source: 'frontend'
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Error logging frontend error:', error);
        return res.status(500).json({ error: 'Failed to log error' });
    }
});

// ==========================================
// AGENCIES API
// ==========================================

// Get all agencies (for dropdowns)
app.get('/api/agencies', authenticateToken, async (req, res) => {
    try {
        const agencies = await prisma.agency.findMany({
            orderBy: { code: 'asc' }
        });

        // Category mapping
        const AGENCY_CATEGORIES = {
            'SIPA': 'Državni nivo',
            'GP_BIH': 'Državni nivo',
            'MSB_BIH': 'Državni nivo',
            'MUP_BIH': 'Državni nivo',
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
            'MUP_K10': 'Kantonalni MUP-ovi u Federaciji BiH'
        };

        // Transform to frontend format
        const agenciesData = agencies.map(a => ({
            id: a.code,
            naziv: a.name,
            tip: AGENCY_CATEGORIES[a.code] || 'Ostalo'
        }));

        res.json(agenciesData);
    } catch (error) {
        console.error('Get agencies error:', error);
        res.status(500).json({ error: 'Failed to load agencies' });
    }
});

// System logs endpoint
app.get('/api/system/logs', authenticateToken, requireRoles('SUPERADMIN', 'ADMIN'), async (req, res) => {
    try {
        const { authUser } = req;
        const { startDate, endDate, type, userId, page = 1, limit = 50 } = req.query;

        let logs = await Logger.getLogs(startDate, endDate, type, userId);

        // For ADMIN, filter logs to only show logs related to their agency users
        if (authUser.role === 'ADMIN') {
            const { authData } = req;
            const agencyUserIds = authData.users
                .filter(u => u.agencija === authUser.agencija)
                .map(u => u.id);
            
            logs = logs.filter(log => 
                log.userId === authUser.id || 
                agencyUserIds.includes(log.userId) ||
                log.type === Logger.logTypes.SYSTEM
            );
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedLogs = logs.slice(startIndex, endIndex);

        Logger.log(Logger.logTypes.SYSTEM, `Logs accessed by ${authUser.username}`, authUser.id, {
            filters: { startDate, endDate, type, userId },
            resultCount: paginatedLogs.length,
            ip: req.ip
        });

        return res.json({
            logs: paginatedLogs,
            total: logs.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(logs.length / limit)
        });
    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, `Error accessing logs: ${error.message}`, req.authUser?.id, {
            error: error.stack,
            ip: req.ip
        });
        console.error('Logs error:', error);
        return res.status(500).json({ error: 'Failed to retrieve logs' });
    }
});

// Audit log endpoint - Prihvata log entry sa frontenda
app.post('/api/audit/log', authenticateToken, async (req, res) => {
    try {
        const { authUser } = req;
        const logData = req.body;

        // Validacija
        if (!logData.action || !logData.action_display) {
            return res.status(400).json({ error: 'Invalid log data' });
        }

        // Osiguraj da user_id odgovara autentifikovanom korisniku
        logData.userId = authUser.id;
        logData.user_id = authUser.id;
        logData.user_name = `${authUser.ime} ${authUser.prezime}`;
        logData.user_role = authUser.role;
        logData.ip_address = req.ip || 'unknown';
        logData.user_agent = req.headers['user-agent'] || 'unknown';

        // Zapisi u log fajl
        Logger.log(
            logData.action,
            logData.action_display,
            authUser.id,
            {
                action: logData.action,
                action_display: logData.action_display,
                status: logData.status || 'SUCCESS',
                target: logData.target,
                target_id: logData.target_id,
                session_id: logData.session_id,
                metadata: logData.metadata || {},
                user_agency: authUser.agencija_naziv
            }
        );

        return res.json({ 
            success: true, 
            message: 'Log recorded',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Audit log error:', error);
        Logger.log(Logger.logTypes.ERROR, `Failed to record audit log: ${error.message}`, req.authUser?.id, {
            error: error.stack,
            ip: req.ip
        });
        return res.status(500).json({ error: 'Failed to record audit log' });
    }
});

// ----------------------------
// Operator routes (existing)
// ----------------------------
ensureOperatorsDir();

app.post('/api/save-operator', authenticateToken, requireRoles('SUPERADMIN'), async (req, res) => {
    try {
        const { operatorId, operatorData } = req.body;
        const actor = req.authUser;

        if (!operatorId || !operatorData) {
            Logger.log(Logger.logTypes.ERROR, 'Save operator failed: payload missing', actor?.id, {
                action: 'CREATE_OPERATOR',
                action_display: 'Sacuvaj operatera - nedostaju podaci',
                status: 'FAILED',
                user_name: actor ? `${actor.ime} ${actor.prezime}`.trim() : 'Sistem',
                user_role: actor?.role || 'SYSTEM',
                target: 'POST /api/save-operator',
                ip: req.ip
            });
            return res.status(400).json({ error: 'Missing operatorId or operatorData' });
        }

        if (!operatorData.naziv || !operatorData.id) {
            Logger.log(Logger.logTypes.ERROR, 'Save operator failed: invalid structure', actor?.id, {
                action: 'CREATE_OPERATOR',
                action_display: 'Sacuvaj operatera - nevalidna struktura',
                status: 'FAILED',
                user_name: actor ? `${actor.ime} ${actor.prezime}`.trim() : 'Sistem',
                user_role: actor?.role || 'SYSTEM',
                target: `Operator payload (ID: ${operatorId})`,
                ip: req.ip
            });
            return res.status(400).json({ error: 'Invalid operator data structure' });
        }

        if (operatorData.id !== operatorId) {
            return res.status(400).json({ error: 'Operator ID mismatch' });
        }

        // Check if operator exists in PostgreSQL
        const existingOperator = await prisma.operator.findUnique({
            where: { id: BigInt(operatorId) }
        });

        // Map JSON data to Prisma format
        const prismaData = mapJsonToPrisma(operatorData);

        // UPSERT to PostgreSQL
        const savedOperator = await prisma.operator.upsert({
            where: { id: BigInt(operatorId) },
            update: prismaData,
            create: { ...prismaData, createdAt: new Date() }
        });

        // Backward compatibility: also save to JSON file
        const filePath = path.join(operatorsDir, `${operatorId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(operatorData, null, 2), 'utf8');

        if (actor) {
            const actionCode = existingOperator ? 'UPDATE_OPERATOR' : 'CREATE_OPERATOR';
            Logger.log(
                existingOperator ? Logger.logTypes.UPDATE_OPERATOR : Logger.logTypes.CREATE_OPERATOR,
                `${existingOperator ? 'Operator updated' : 'Operator created'}: ${operatorData.naziv}`,
                actor.id,
                {
                    action: actionCode,
                    action_display: existingOperator ? 'Azuriranje operatera' : 'Dodavanje operatera',
                    status: 'SUCCESS',
                    user_name: `${actor.ime} ${actor.prezime}`.trim(),
                    user_role: actor.role,
                    target: `${operatorData.naziv} (ID: ${operatorData.id})`,
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                }
            );
        }

        res.json({ success: true, message: 'Operator saved successfully', created: !existingOperator });
    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, `Error saving operator: ${error.message}`, req.authUser?.id, {
            action: 'CREATE_OPERATOR',
            action_display: 'Greska pri cuvanju operatera',
            status: 'FAILED',
            user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}`.trim() : 'Sistem',
            user_role: req.authUser?.role || 'SYSTEM',
            error: error.stack,
            ip: req.ip
        });
        console.error('Error saving operator:', error);
        res.status(500).json({ error: 'Failed to save operator' });
    }
});

app.get('/api/operator/:id', authenticateToken, async (req, res) => {
    try {
        const operatorId = req.params.id;

        // Try to load from PostgreSQL first
        const operator = await prisma.operator.findUnique({
            where: { id: BigInt(operatorId) }
        });

        if (operator) {
            // Convert Prisma format to JSON format for frontend
            const jsonFormat = mapPrismaToJson(operator);
            return res.json(jsonFormat);
        }

        // Fallback to JSON file (backward compatibility)
        const filePath = path.join(operatorsDir, `${operatorId}.json`);
        if (fs.existsSync(filePath)) {
            const operatorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return res.json(operatorData);
        }

        return res.status(404).json({ error: 'Operator not found' });
    } catch (error) {
        console.error('Error loading operator:', error);
        res.status(500).json({ error: 'Failed to load operator' });
    }
});

app.get('/api/operators', authenticateToken, async (req, res) => {
    try {
        // Get query parameters for filtering/search
        const { search, status, type } = req.query;

        // Build where clause
        const whereClause = {};
        
        if (status) {
            whereClause.status = status;
        }

        if (search) {
            whereClause.OR = [
                { legalName: { contains: search, mode: 'insensitive' } },
                { commercialName: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Query PostgreSQL
        const operators = await prisma.operator.findMany({
            where: whereClause,
            orderBy: { legalName: 'asc' }
        });

        // Convert to basic info format (light response)
        const basicInfoList = operators.map(op => mapPrismaToBasicInfo(op));

        res.json(basicInfoList);
    } catch (error) {
        console.error('Error listing operators:', error);
        
        // Fallback to JSON files if database fails
        try {
            const files = fs.readdirSync(operatorsDir).filter(file => file.endsWith('.json'));
            const operators = files.map(file => {
                const filePath = path.join(operatorsDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return {
                    id: data.id,
                    naziv: data.naziv,
                    file: file
                };
            });
            res.json(operators);
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            res.status(500).json({ error: 'Failed to list operators' });
        }
    }
});

app.delete('/api/operator/:id', authenticateToken, requireRoles('SUPERADMIN'), async (req, res) => {
    try {
        const operatorId = req.params.id;
        const actor = req.authUser;

        // Check if operator exists in PostgreSQL
        const operator = await prisma.operator.findUnique({
            where: { id: BigInt(operatorId) }
        });

        if (!operator) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        // Delete from PostgreSQL
        await prisma.operator.delete({
            where: { id: BigInt(operatorId) }
        });

        // Also delete JSON file (backward compatibility)
        const filePath = path.join(operatorsDir, `${operatorId}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        if (actor) {
            Logger.log(Logger.logTypes.DELETE_OPERATOR, `Operator deleted: ${operator.legalName}`, actor.id, {
                action: 'DELETE_OPERATOR',
                action_display: 'Brisanje operatera',
                status: 'SUCCESS',
                user_name: `${actor.ime} ${actor.prezime}`.trim(),
                user_role: actor.role,
                target: `${operator.legalName} (ID: ${operatorId})`,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
        }

        res.json({
            success: true,
            message: `Operator "${operator.legalName}" successfully deleted`,
            deletedOperator: {
                id: Number(operator.id),
                naziv: operator.legalName
            }
        });
    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, `Error deleting operator: ${error.message}`, req.authUser?.id, {
            action: 'DELETE_OPERATOR',
            action_display: 'Greska pri brisanju operatera',
            status: 'FAILED',
            user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}`.trim() : 'Sistem',
            user_role: req.authUser?.role || 'SYSTEM',
            error: error.stack,
            ip: req.ip
        });
        console.error('Error deleting operator:', error);
        res.status(500).json({ error: 'Failed to delete operator' });
    }
});

// ==========================================
// MFA (Multi-Factor Authentication) Endpoints
// ==========================================

import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Debug endpoint to check token format
app.get('/api/debug/token', authenticateToken, (req, res) => {
    return res.json({
        payload: req.authUser.tokenPayload,
        user: req.authUser,
        mfa_setup_required: req.authUser.mfa_setup_required,
        permissions: req.authUser.permissions
    });
});

// Clear localStorage helper
app.get('/api/debug/clear-session', (req, res) => {
    res.send(`
        <script>
            localStorage.clear();
            sessionStorage.clear();
            alert('Session cleared! Redirecting to login...');
            window.location.href = '/login.html';
        </script>
    `);
});

// Generate MFA setup (QR code)
app.post('/api/auth/mfa/setup', authenticateToken, async (req, res) => {
    try {
        
        const user = req.authUser;
        
        // Check if user is using limited token for MFA setup
        const hasLimitedToken = user.mfa_setup_required && user.permissions?.includes('mfa_setup_only');
        
        // Don't regenerate if already has MFA (unless using limited token)
        if (user.mfa_enabled && !hasLimitedToken) {
            return res.status(400).json({ 
                error: 'MFA je već omogućen za ovaj nalog. Onemogući prvo da postaviš novi.' 
            });
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `ATLAS (${user.username})`,
            issuer: 'ATLAS System',
            length: 32
        });

        // Store temporary secret (not permanent until verified)
        user.mfa_temp_secret = secret.base32;
        
        // Also store in raw user data and save to file
        req.authRawUser.mfa_temp_secret = secret.base32;
        writeAuthData(req.authData);

        // Generate QR code
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

        Logger.log(Logger.logTypes.SECURITY, 'MFA setup initiated', user.id, {
            action: 'MFA_SETUP_START',
            action_display: 'MFA setup započet',
            status: 'SUCCESS',
            user_name: `${user.ime} ${user.prezime}`,
            user_role: user.role,
            target: 'MFA System',
            ip_address: req.ip,
            metadata: {
                username: user.username,
                issuer: 'ATLAS System'
            }
        });

        res.json({
            qrCode: qrCodeUrl,
            secret: secret.base32, // For manual entry
            backupCodes: generateBackupCodes() // 10 backup codes
        });

    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, 'MFA setup failed', req.authUser?.id, {
            action: 'MFA_SETUP_ERROR',
            action_display: 'Greška pri MFA setup-u',
            status: 'FAILED',
            user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}` : 'Unknown',
            user_role: req.authUser?.role || 'SYSTEM',
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { error: error.message }
        });
        console.error('MFA setup error:', error);
        res.status(500).json({ error: 'Greška pri generisanju MFA setup-a' });
    }
});

// Verify and enable MFA
app.post('/api/auth/mfa/verify', authenticateToken, async (req, res) => {
    try {
        const { token } = req.body;
        const user = req.authUser;
        const rawUser = req.authRawUser;

        if (!rawUser || !rawUser.mfa_temp_secret) {
            return res.status(400).json({ error: 'MFA setup nije pokrenuo. Započni setup ponovo.' });
        }

        // Verify TOTP token
        const verified = speakeasy.totp.verify({
            secret: rawUser.mfa_temp_secret,
            encoding: 'base32',
            token: token,
            window: 2 // Allow ±60 seconds tolerance
        });

        if (!verified) {
            Logger.log(Logger.logTypes.SECURITY, 'MFA verification failed', user.id, {
                action: 'MFA_VERIFY_FAILED',
                action_display: 'MFA verifikacija neuspješna',
                status: 'FAILED',
                user_name: `${user.ime} ${user.prezime}`,
                user_role: user.role,
                target: 'MFA System',
                ip_address: req.ip,
                metadata: { 
                    username: user.username,
                    token_provided: token.substring(0, 2) + '****' // Partial token for audit
                }
            });
            return res.status(400).json({ error: 'Neispravan MFA kod. Pokušaj ponovo.' });
        }

        // Enable MFA permanently
        rawUser.mfa_enabled = true;
        rawUser.mfa_secret = rawUser.mfa_temp_secret;
        delete rawUser.mfa_temp_secret;

        // Update auth data
        writeAuthData(req.authData);

        Logger.log(Logger.logTypes.SECURITY, 'MFA enabled successfully', user.id, {
            action: 'MFA_ENABLED',
            action_display: 'MFA uspješno omogućen',
            status: 'SUCCESS',
            user_name: `${user.ime} ${user.prezime}`,
            user_role: user.role,
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { username: user.username }
        });

        res.json({ 
            message: 'MFA je uspješno omogućen!',
            mfa_enabled: true
        });

    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, 'MFA verification error', req.authUser?.id, {
            action: 'MFA_VERIFY_ERROR',
            action_display: 'Greška pri MFA verifikaciji',
            status: 'FAILED',
            user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}` : 'Unknown',
            user_role: req.authUser?.role || 'SYSTEM',
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { error: error.message }
        });
        console.error('MFA verification error:', error);
        res.status(500).json({ error: 'Greška pri verifikaciji MFA koda' });
    }
});

// Disable MFA
app.post('/api/auth/mfa/disable', authenticateToken, async (req, res) => {
    try {
        console.log('🔓 [MFA DISABLE] Request received');
        
        const { password, mfa_token } = req.body;
        const sessionUser = req.authUser; // Sanitized user from token

        console.log('   User ID:', sessionUser.id);
        console.log('   Username:', sessionUser.username);

        // 🔧 Load RAW user with password hash from authData
        const authDataForMfa = readAuthData();
        const rawUser = authDataForMfa.korisnici?.find(u => u.id === sessionUser.id) || 
                        authDataForMfa.users?.find(u => u.id === sessionUser.id);

        if (!rawUser) {
            console.log('❌ User not found in auth data');
            return res.status(404).json({ error: 'Korisnik nije pronađen.' });
        }

        console.log('   MFA Enabled:', rawUser.mfa_enabled);
        console.log('   Password provided:', !!password, 'length:', password?.length);
        console.log('   Password hash present:', !!rawUser.password_hash);
        console.log('   MFA token provided:', !!mfa_token, 'value:', mfa_token);
        console.log('   MFA secret present:', !!rawUser.mfa_secret);

        if (!rawUser.mfa_enabled) {
            console.log('❌ MFA not enabled for this user');
            return res.status(400).json({ error: 'MFA nije omogućen za ovaj nalog.' });
        }

        // Verify current password
        console.log('🔑 Verifying password...');
        const passwordValid = await bcrypt.compare(password, rawUser.password_hash);
        console.log('   Password valid:', passwordValid);
        
        if (!passwordValid) {
            console.log('❌ Invalid password');
            return res.status(400).json({ error: 'Neispravna lozinka.' });
        }

        // Verify MFA token
        console.log('🔐 Verifying MFA token...');
        console.log('   Secret:', rawUser.mfa_secret?.substring(0, 10) + '...');
        console.log('   Token:', mfa_token);
        
        const mfaValid = speakeasy.totp.verify({
            secret: rawUser.mfa_secret,
            encoding: 'base32',
            token: mfa_token,
            window: 2
        });
        console.log('   MFA valid:', mfaValid);

        if (!mfaValid) {
            console.log('❌ Invalid MFA token');
            return res.status(400).json({ error: 'Neispravan MFA kod.' });
        }

        // 🔧 Update PostgreSQL database using Prisma (instead of JSON)
        console.log('💾 Updating database...');
        console.log('   Prisma user model: User');
        console.log('   Where: { id:', rawUser.id, '}');
        
        await prisma.user.update({
            where: { id: rawUser.id },
            data: {
                mfaEnabled: false,
                mfaSecret: null
            }
        });
        console.log('   ✅ Database updated');

        // Also update JSON for backward compatibility (temporary)
        console.log('📝 Updating JSON file...');
        const authData = readAuthData();
        console.log('   Total users in JSON:', authData.korisnici?.length || authData.users?.length);
        
        const userIndex = authData.korisnici?.findIndex(u => u.id === rawUser.id) ?? 
                          authData.users?.findIndex(u => u.id === rawUser.id) ?? -1;
        
        console.log('   User index:', userIndex);
        
        if (userIndex !== -1) {
            const users = authData.korisnici || authData.users;
            users[userIndex].mfa_enabled = false;
            delete users[userIndex].mfa_secret;
            delete users[userIndex].mfa_backup_codes;
            writeAuthData(authData);
            console.log('   ✅ JSON file updated');
        } else {
            console.log('   ⚠️ User not found in JSON');
        }

        console.log('✅ [MFA DISABLE] Success!');

        Logger.log(Logger.logTypes.SECURITY, 'MFA disabled', rawUser.id, {
            action: 'MFA_DISABLED',
            action_display: 'MFA onemogućen',
            status: 'SUCCESS',
            user_name: `${rawUser.ime} ${rawUser.prezime}`,
            user_role: rawUser.role,
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { username: rawUser.username }
        });

        res.json({ 
            message: 'MFA je uspješno onemogućen.',
            mfa_enabled: false
        });

    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, 'MFA disable error', req.authUser?.id, {
            action: 'MFA_DISABLE_ERROR',
            action_display: 'Greška pri onemogućavanju MFA',
            status: 'FAILED',
            user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}` : 'Unknown',
            user_role: req.authUser?.role || 'SYSTEM',
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { error: error.message }
        });
        console.error('MFA disable error:', error);
        res.status(500).json({ error: 'Greška pri onemogućavanju MFA' });
    }
});

// Superadmin reset MFA for user
app.post('/api/auth/mfa/reset/:userId', authenticateToken, requireRoles('SUPERADMIN'), async (req, res) => {
    try {
        const { userId } = req.params;
        const admin = req.authUser;
        
        if (!admin || admin.role !== 'SUPERADMIN') {
            return res.status(403).json({ error: 'Samo superadmin može resetovati MFA' });
        }

        const authData = readAuthData();
        const targetUser = authData.users.find(u => u.id === parseInt(userId));
        
        if (!targetUser) {
            return res.status(404).json({ error: 'Korisnik nije pronađen' });
        }

        // Allow reset for all users, not just those with MFA enabled
        const hadMfa = targetUser.mfa_enabled;

        // Reset MFA for target user (remove all MFA-related fields)
        targetUser.mfa_enabled = false;
        delete targetUser.mfa_secret;
        delete targetUser.mfa_temp_secret;

        // Save changes
        writeAuthData(authData);

        // Log the action
        Logger.log(Logger.logTypes.SECURITY, 'MFA reset by superadmin', admin.id, {
            action: 'MFA_RESET_BY_ADMIN',
            action_display: 'MFA resetovan od strane superadmin-a',
            status: 'SUCCESS',
            user_name: `${admin.ime} ${admin.prezime}`,
            user_role: admin.role,
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { 
                target_user: targetUser.username,
                target_user_name: `${targetUser.ime} ${targetUser.prezime}`,
                had_mfa_before: hadMfa,
                reason: 'Superadmin MFA reset'
            }
        });

        const message = hadMfa 
            ? `MFA je uspješno resetovan za korisnika ${targetUser.username}. Korisnik će morati ponovo da podesi MFA.`
            : `MFA postavke su resetovane za korisnika ${targetUser.username}. Korisnik može da podesi MFA od početka.`;

        res.json({ 
            success: true,
            message: message,
            user: {
                id: targetUser.id,
                username: targetUser.username,
                ime: targetUser.ime,
                prezime: targetUser.prezime,
                mfa_enabled: false,
                had_mfa_before: hadMfa
            }
        });

    } catch (error) {
        Logger.log(Logger.logTypes.ERROR, 'MFA reset error', req.authUser?.id, {
            action: 'MFA_RESET_ERROR',
            action_display: 'Greška pri resetovanju MFA',
            status: 'FAILED',
            user_name: req.authUser ? `${req.authUser.ime} ${req.authUser.prezime}` : 'Unknown',
            user_role: req.authUser?.role || 'SYSTEM',
            target: 'MFA System',
            ip_address: req.ip,
            metadata: { error: error.message, target_user_id: req.params.userId }
        });
        console.error('MFA reset error:', error);
        res.status(500).json({ error: 'Greška pri resetovanju MFA' });
    }
});

// Generate backup codes helper
function generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        // Generate 8-digit backup codes
        codes.push(Math.random().toString().slice(2, 10));
    }
    return codes;
}

export { app };

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`ATLAS Backend Server running on http://localhost:${PORT}`);
        console.log(`Frontend available at http://localhost:${PORT}`);
    });
}
































