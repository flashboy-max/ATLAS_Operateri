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

    static log(type, message, userId = null, metadata = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type,
            message,
            userId,
            metadata,
            ip: metadata.ip || 'unknown',
            userAgent: metadata.userAgent || 'unknown'
        };

        // Write to daily log file
        const dateStr = new Date().toISOString().split('T')[0];
        const logFile = path.join(logsDir, `${dateStr}.json`);
        
        try {
            let logs = [];
            if (fs.existsSync(logFile)) {
                const content = fs.readFileSync(logFile, 'utf8');
                logs = content ? JSON.parse(content) : [];
            }
            
            logs.push(logEntry);
            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
        } catch (error) {
            console.error('Failed to write log:', error);
        }

        // Also log to console for development
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`, metadata);
    }

    static async getLogs(startDate = null, endDate = null, type = null, userId = null) {
        try {
            const logs = [];
            const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                const filePath = path.join(logsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const fileLogs = content ? JSON.parse(content) : [];
                logs.push(...fileLogs);
            }

            let filteredLogs = logs;

            if (startDate) {
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate));
            }
            if (endDate) {
                filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate));
            }
            if (type) {
                filteredLogs = filteredLogs.filter(log => log.type === type);
            }
            if (userId) {
                filteredLogs = filteredLogs.filter(log => log.userId === userId);
            }

            return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
        const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
        
        Logger.log(Logger.logTypes.SYSTEM, `${req.method} ${req.path} - ${res.statusCode}`, 
            req.authUser?.id, {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip || req.connection.remoteAddress,
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
        if (!bcrypt.compareSync(currentPassword, user.lozinka)) {
            return res.status(400).json({ error: 'Trenutna lozinka nije ispravna' });
        }

        // Hash new password
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

        // Update password
        authData.users[userIndex] = {
            ...user,
            lozinka: hashedNewPassword,
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

app.post('/api/save-operator', (req, res) => {
    try {
        const { operatorId, operatorData } = req.body;

        if (!operatorId || !operatorData) {
            return res.status(400).json({ error: 'Missing operatorId or operatorData' });
        }

        if (!operatorData.naziv || !operatorData.id) {
            return res.status(400).json({ error: 'Invalid operator data structure' });
        }

        if (operatorData.id !== operatorId) {
            return res.status(400).json({ error: 'Operator ID mismatch' });
        }

        const filePath = path.join(operatorsDir, `${operatorId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(operatorData, null, 2), 'utf8');

        res.json({ success: true, message: 'Operator saved successfully' });
    } catch (error) {
        console.error('Error saving operator:', error);
        res.status(500).json({ error: 'Failed to save operator' });
    }
});

app.get('/api/operator/:id', (req, res) => {
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

app.get('/api/operators', (req, res) => {
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

app.delete('/api/operator/:id', (req, res) => {
    try {
        const operatorId = req.params.id;
        const filePath = path.join(operatorsDir, `${operatorId}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        const operatorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        fs.unlinkSync(filePath);

        console.log(`• Operator deleted: ${operatorData.naziv} (ID: ${operatorId})`);
        res.json({
            success: true,
            message: `Operator "${operatorData.naziv}" successfully deleted`,
            deletedOperator: {
                id: operatorData.id,
                naziv: operatorData.naziv
            }
        });
    } catch (error) {
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
