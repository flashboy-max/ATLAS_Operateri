// ================================================
// ENHANCED LOGGER - Change Tracking & Session Management
// ================================================

import fs from 'fs';
import path from 'path';

/**
 * Enhanced Logger sa detaljnim change tracking-om
 * Implementira Fazu 1 iz SYSTEM_LOGS_ANALIZA_I_PLAN.md
 */
class EnhancedLogger {
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

    static logsDir = null;

    static initialize(logsDir) {
        this.logsDir = logsDir;
        
        // Ensure logs directory exists
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    /**
     * Basic log method - same as before
     */
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

        this._writeLog(logEntry);
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
    }

    /**
     * Enhanced log with change tracking
     * Koristi se za UPDATE operacije
     */
    static logWithChanges(type, message, userId, options = {}) {
        const {
            changes = {},
            changedFields = [],
            performedBy = userId,
            targetUserId = null,
            targetUserName = null,
            reason = null,
            additionalMetadata = {}
        } = options;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type,
            message,
            userId: performedBy,
            targetUserId,
            targetUserName,
            changes,
            changedFields,
            reason,
            metadata: {
                ...additionalMetadata,
                ip: additionalMetadata.ip || 'unknown',
                userAgent: additionalMetadata.userAgent || 'unknown'
            },
            ip: additionalMetadata.ip || 'unknown',
            userAgent: additionalMetadata.userAgent || 'unknown'
        };

        this._writeLog(logEntry);
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`, {
            changes: Object.keys(changes).length,
            fields: changedFields
        });
    }

    /**
     * Login event sa detaljnim tracking-om
     */
    static logLogin(userId, username, sessionId, metadata = {}) {
        const {
            ip,
            userAgent,
            previousLogin = null,
            failedAttemptsBefore = 0,
            deviceInfo = {},
            loginMethod = 'password'
        } = metadata;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: 'login',
            message: `User logged in successfully: ${username}`,
            userId,
            username,
            sessionId,
            loginDetails: {
                previousLogin,
                failedAttemptsBefore,
                loginMethod,
                deviceInfo: {
                    browser: deviceInfo.browser || 'Unknown',
                    os: deviceInfo.os || 'Unknown',
                    device: deviceInfo.device || 'Unknown'
                }
            },
            metadata: { ip, userAgent },
            ip,
            userAgent
        };

        this._writeLog(logEntry);
        console.log(`[${timestamp}] LOGIN: ${username}`, {
            ip,
            device: deviceInfo.device,
            failedAttemptsBefore
        });
    }

    /**
     * Logout event sa session tracking-om
     */
    static logLogout(userId, username, sessionId, sessionData = {}) {
        const {
            ip,
            userAgent,
            sessionDuration = null,
            pagesVisited = 0,
            actionsPerformed = 0,
            lastActivity = null
        } = sessionData;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: 'logout',
            message: `User logged out: ${username}`,
            userId,
            username,
            sessionId,
            sessionStats: {
                duration: sessionDuration,
                pagesVisited,
                actionsPerformed,
                lastActivity
            },
            metadata: { ip, userAgent },
            ip,
            userAgent
        };

        this._writeLog(logEntry);
        console.log(`[${timestamp}] LOGOUT: ${username}`, {
            duration: sessionDuration,
            actions: actionsPerformed
        });
    }

    /**
     * Security event sa detaljima
     */
    static logSecurityEvent(eventType, details = {}) {
        const {
            username = null,
            userId = null,
            ip,
            userAgent,
            attemptNumber = null,
            remainingAttempts = null,
            suspiciousActivity = false,
            reason = null
        } = details;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type: 'security',
            securityEvent: eventType,
            message: `Security event: ${eventType}`,
            userId,
            username,
            securityDetails: {
                attemptNumber,
                remainingAttempts,
                suspiciousActivity,
                reason
            },
            metadata: { ip, userAgent },
            ip,
            userAgent
        };

        this._writeLog(logEntry);
        console.log(`[${timestamp}] SECURITY: ${eventType}`, {
            username,
            suspicious: suspiciousActivity
        });
    }

    /**
     * Update Profile sa change tracking-om
     */
    static logProfileUpdate(userId, username, changes, metadata = {}) {
        const changedFields = Object.keys(changes);
        const message = `Profile updated by ${username}: ${changedFields.join(', ')}`;

        this.logWithChanges('update_profile', message, userId, {
            changes,
            changedFields,
            performedBy: userId,
            additionalMetadata: metadata
        });
    }

    /**
     * Update User (Admin) sa change tracking-om
     */
    static logUserUpdate(targetUserId, targetUsername, performedBy, performerUsername, changes, reason = null, metadata = {}) {
        const changedFields = Object.keys(changes);
        const message = `User ${targetUsername} updated by ${performerUsername}: ${changedFields.join(', ')}`;

        this.logWithChanges('update_user', message, performedBy, {
            changes,
            changedFields,
            performedBy,
            targetUserId,
            targetUserName: targetUsername,
            reason,
            additionalMetadata: metadata
        });
    }

    /**
     * Update Operator sa change tracking-om
     */
    static logOperatorUpdate(operatorId, operatorName, performedBy, username, changes, metadata = {}) {
        const changedFields = Object.keys(changes);
        const message = `Operator ${operatorName} updated by ${username}: ${changedFields.join(', ')}`;

        this.logWithChanges('update_operator', message, performedBy, {
            changes,
            changedFields,
            performedBy,
            targetUserId: operatorId,
            targetUserName: operatorName,
            additionalMetadata: metadata
        });
    }

    /**
     * Get logs with filtering
     */
    static async getLogs(filters = {}) {
        const {
            startDate = null,
            endDate = null,
            type = null,
            userId = null,
            targetUserId = null
        } = filters;

        try {
            const logs = [];
            const files = fs.readdirSync(this.logsDir).filter(f => f.endsWith('.json'));
            
            for (const file of files) {
                const filePath = path.join(this.logsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const fileLogs = content ? JSON.parse(content) : [];
                logs.push(...fileLogs);
            }

            let filteredLogs = logs;

            if (startDate) {
                filteredLogs = filteredLogs.filter(log => 
                    new Date(log.timestamp) >= new Date(startDate)
                );
            }
            if (endDate) {
                filteredLogs = filteredLogs.filter(log => 
                    new Date(log.timestamp) <= new Date(endDate)
                );
            }
            if (type) {
                filteredLogs = filteredLogs.filter(log => log.type === type);
            }
            if (userId) {
                filteredLogs = filteredLogs.filter(log => log.userId === userId);
            }
            if (targetUserId) {
                filteredLogs = filteredLogs.filter(log => log.targetUserId === targetUserId);
            }

            return filteredLogs.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
        } catch (error) {
            console.error('Error reading logs:', error);
            return [];
        }
    }

    /**
     * Get change history for specific user
     */
    static async getUserChangeHistory(userId, limit = 50) {
        const logs = await this.getLogs({ targetUserId: userId });
        
        return logs
            .filter(log => log.changes && Object.keys(log.changes).length > 0)
            .slice(0, limit);
    }

    /**
     * Get login history for user
     */
    static async getUserLoginHistory(userId, limit = 20) {
        const logs = await this.getLogs({ userId, type: 'login' });
        return logs.slice(0, limit);
    }

    /**
     * Private method to write log to file
     */
    static _writeLog(logEntry) {
        const dateStr = new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logsDir, `${dateStr}.json`);
        
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
    }
}

/**
 * Session Manager za tracking aktivnih sesija
 */
class SessionManager {
    static sessions = new Map();

    static create(userId, sessionData) {
        const sessionId = this._generateSessionId();
        const session = {
            id: sessionId,
            userId,
            loginTime: new Date(),
            lastActivity: new Date(),
            pagesVisited: 0,
            actionsPerformed: 0,
            ...sessionData
        };

        this.sessions.set(sessionId, session);
        return sessionId;
    }

    static update(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (session) {
            Object.assign(session, updates);
            session.lastActivity = new Date();
        }
    }

    static incrementPageVisit(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.pagesVisited++;
            session.lastActivity = new Date();
        }
    }

    static incrementAction(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.actionsPerformed++;
            session.lastActivity = new Date();
        }
    }

    static end(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            const logoutTime = new Date();
            const duration = this._calculateDuration(session.loginTime, logoutTime);
            
            const sessionData = {
                sessionDuration: duration,
                pagesVisited: session.pagesVisited,
                actionsPerformed: session.actionsPerformed,
                lastActivity: session.lastActivity.toISOString()
            };

            this.sessions.delete(sessionId);
            return sessionData;
        }
        return null;
    }

    static get(sessionId) {
        return this.sessions.get(sessionId);
    }

    static _generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    static _calculateDuration(startTime, endTime) {
        const diffMs = endTime - startTime;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

/**
 * Device Info Parser
 */
class DeviceParser {
    static parse(userAgent) {
        return {
            browser: this._getBrowser(userAgent),
            os: this._getOS(userAgent),
            device: this._getDevice(userAgent)
        };
    }

    static _getBrowser(ua) {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('MSIE') || ua.includes('Trident')) return 'Internet Explorer';
        return 'Unknown';
    }

    static _getOS(ua) {
        if (ua.includes('Windows NT 10.0')) return 'Windows 10';
        if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
        if (ua.includes('Windows NT 6.2')) return 'Windows 8';
        if (ua.includes('Windows NT 6.1')) return 'Windows 7';
        if (ua.includes('Mac OS X')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
    }

    static _getDevice(ua) {
        if (ua.includes('Mobile')) return 'Mobile';
        if (ua.includes('Tablet')) return 'Tablet';
        return 'Desktop';
    }
}

export { EnhancedLogger, SessionManager, DeviceParser };
