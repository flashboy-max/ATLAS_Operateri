import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'atlas-dev-secret';
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

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
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
        const user = data.users.find(u => u.id === payload.sub && u.aktivan);

        if (!user) {
            return res.status(401).json({ error: 'Session expired or user disabled' });
        }

        req.authUser = sanitizeUser(user);
        req.authUser.role = user.role;
        req.authUser.tokenPayload = payload;
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
        if (!roles.includes(req.authUser.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}

ensureOperatorsDir();

// ----------------------------
// Auth routes
// ----------------------------
app.post('/api/auth/login', loginLimiter, (req, res) => {
    try {
        const { username, password } = req.body || {};

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

        user.poslednje_logovanje = new Date().toISOString();
        writeAuthData({ ...data, users: data.users });

        Logger.log(Logger.logTypes.LOGIN, `User logged in successfully: ${username}`, user.id, {
            username,
            role: user.role,
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

// ----------------------------
// Operator routes (existing)
// ----------------------------
ensureOperatorsDir();

app.post('/api/save-operator', authenticateToken, requireRoles('SUPERADMIN'), (req, res) => {
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

        const filePath = path.join(operatorsDir, `${operatorId}.json`);
        const existed = fs.existsSync(filePath);
        fs.writeFileSync(filePath, JSON.stringify(operatorData, null, 2), 'utf8');

        if (actor) {
            const actionCode = existed ? 'UPDATE_OPERATOR' : 'CREATE_OPERATOR';
            Logger.log(
                existed ? Logger.logTypes.UPDATE_OPERATOR : Logger.logTypes.CREATE_OPERATOR,
                `${existed ? 'Operator updated' : 'Operator created'}: ${operatorData.naziv}`,
                actor.id,
                {
                    action: actionCode,
                    action_display: existed ? 'Azuriranje operatera' : 'Dodavanje operatera',
                    status: 'SUCCESS',
                    user_name: `${actor.ime} ${actor.prezime}`.trim(),
                    user_role: actor.role,
                    target: `${operatorData.naziv} (ID: ${operatorData.id})`,
                    ip: req.ip,
                    userAgent: req.get('User-Agent')
                }
            );
        }

        res.json({ success: true, message: 'Operator saved successfully', created: !existed });
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

app.get('/api/operator/:id', authenticateToken, (req, res) => {
    try {
        const operatorId = req.params.id;
        const filePath = path.join(operatorsDir, `${operatorId}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        const operatorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(operatorData);
    } catch (error) {
        console.error('Error loading operator:', error);
        res.status(500).json({ error: 'Failed to load operator' });
    }
});

app.get('/api/operators', authenticateToken, (req, res) => {
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
    } catch (error) {
        console.error('Error listing operators:', error);
        res.status(500).json({ error: 'Failed to list operators' });
    }
});

app.delete('/api/operator/:id', authenticateToken, requireRoles('SUPERADMIN'), (req, res) => {
    try {
        const operatorId = req.params.id;
        const filePath = path.join(operatorsDir, `${operatorId}.json`);
        const actor = req.authUser;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        const operatorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        fs.unlinkSync(filePath);

        if (actor) {
            Logger.log(Logger.logTypes.DELETE_OPERATOR, `Operator deleted: ${operatorData.naziv}`, actor.id, {
                action: 'DELETE_OPERATOR',
                action_display: 'Brisanje operatera',
                status: 'SUCCESS',
                user_name: `${actor.ime} ${actor.prezime}`.trim(),
                user_role: actor.role,
                target: `${operatorData.naziv} (ID: ${operatorData.id})`,
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
        }

        res.json({
            success: true,
            message: `Operator "${operatorData.naziv}" successfully deleted`,
            deletedOperator: {
                id: operatorData.id,
                naziv: operatorData.naziv
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

export { app };

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`ATLAS Backend Server running on http://localhost:${PORT}`);
        console.log(`Frontend available at http://localhost:${PORT}`);
    });
}
































