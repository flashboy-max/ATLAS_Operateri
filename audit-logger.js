/**
 * 🔍 ATLAS Audit Logger - Basic Implementation
 * 
 * Prikuplja i formatira audit logove u čitljivom formatu
 * Verzija: 1.0 - Basic (foundation za kasnije proširenje)
 */

class AuditLogger {
    /**
     * Loguje korisničku akciju
     * @param {string} action - Tip akcije (LOGIN, LOGOUT, CREATE, UPDATE, DELETE, VIEW)
     * @param {object} details - Detalji akcije
     */
    static async log(action, details = {}) {
        const user = AuthSystem.getCurrentUser();
        if (!user) {
            console.warn('AuditLogger: No user found');
            return;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            user_id: user.id,
            user_name: `${user.ime} ${user.prezime}`,
            user_role: user.role,
            user_agency: user.agencija_naziv || null,
            action: action,
            action_display: this.formatActionDisplay(action, details),
            target: details.target || null,
            target_id: details.targetId || null,
            status: details.status || 'SUCCESS',
            ip_address: details.ip || 'unknown',
            session_id: this.getSessionId(),
            metadata: details.metadata || {}
        };

        // Pošalji na server
        try {
            await this.sendToServer(logEntry);
        } catch (error) {
            console.error('Failed to log audit entry:', error);
        }

        return logEntry;
    }

    /**
     * Formatira akciju u čitljiv tekst
     */
    static formatActionDisplay(action, details) {
        const user = AuthSystem.getCurrentUser();
        const userName = `${user.ime} ${user.prezime}`;

        switch (action) {
            // ====== AUTENTIFIKACIJA ======
            case 'LOGIN':
                return `${userName} se prijavio u sistem`;
            
            case 'LOGOUT':
                return `${userName} se odjavio iz sistema`;
            
            case 'LOGIN_FAILED':
                return `Neuspješan pokušaj prijave (${details.username || 'unknown'})`;

            // ====== OPERATERI ======
            case 'OPERATOR_CREATE':
                return `${userName} kreirao operatera "${details.operatorName}"`;
            
            case 'OPERATOR_UPDATE':
                return `${userName} ažurirao operatera "${details.operatorName}"`;
            
            case 'OPERATOR_DELETE':
                return `${userName} obrisao operatera "${details.operatorName}"`;
            
            case 'OPERATOR_VIEW':
                return `${userName} pregledao operatera "${details.operatorName}"`;

            // ====== KORISNICI ======
            case 'USER_CREATE':
                return `${userName} kreirao korisnika "${details.targetUserName}"`;
            
            case 'USER_UPDATE':
                return `${userName} ažurirao korisnika "${details.targetUserName}"`;
            
            case 'USER_DELETE':
                return `${userName} obrisao korisnika "${details.targetUserName}"`;
            
            case 'USER_VIEW':
                return `${userName} pregledao korisnika "${details.targetUserName}"`;

            // ====== PROFIL ======
            case 'PROFILE_UPDATE':
                return `${userName} ažurirao svoj profil`;
            
            case 'PASSWORD_CHANGE':
                return `${userName} promijenio lozinku`;

            // ====== PRETRAGA ======
            case 'SEARCH':
                return `${userName} pretraživao: "${details.query}"`;
            
            case 'FILTER':
                return `${userName} filtrirao rezultate`;

            // ====== IZVJEŠTAJI ======
            case 'REPORT_VIEW':
                return `${userName} pregledao izvještaj "${details.reportType}"`;
            
            case 'EXPORT':
                return `${userName} eksportovao podatke (${details.format || 'JSON'})`;

            // ====== SYSTEM ======
            case 'SETTINGS_UPDATE':
                return `${userName} ažurirao sistemska podešavanja`;
            
            case 'ERROR':
                return `Greška: ${details.errorMessage || 'Unknown error'}`;

            default:
                return `${userName} izvršio akciju: ${action}`;
        }
    }

    /**
     * Pošalji log entry na server
     */
    static async sendToServer(logEntry) {
        const token = AuthSystem.getToken();
        if (!token) return;

        const response = await fetch('/api/audit/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(logEntry)
        });

        if (!response.ok) {
            throw new Error(`Audit log failed: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Dobavi session ID (kreiraj ako ne postoji)
     */
    static getSessionId() {
        let sessionId = sessionStorage.getItem('atlas_session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('atlas_session_id', sessionId);
        }
        return sessionId;
    }

    // ====== HELPER METHODS ======

    /**
     * Login event
     */
    static async logLogin(username) {
        return this.log('LOGIN', {
            target: username,
            metadata: { loginTime: new Date().toISOString() }
        });
    }

    /**
     * Logout event
     */
    static async logLogout() {
        return this.log('LOGOUT', {
            metadata: { logoutTime: new Date().toISOString() }
        });
    }

    /**
     * Operator CRUD
     */
    static async logOperatorAction(action, operatorData) {
        const actionType = `OPERATOR_${action.toUpperCase()}`;
        return this.log(actionType, {
            target: operatorData.nazivOperatora || operatorData.id,
            targetId: operatorData.id,
            operatorName: operatorData.nazivOperatora,
            metadata: {
                operatorId: operatorData.id,
                country: operatorData.drzava,
                type: operatorData.tipOperatora
            }
        });
    }

    /**
     * User CRUD
     */
    static async logUserAction(action, userData) {
        const actionType = `USER_${action.toUpperCase()}`;
        return this.log(actionType, {
            target: userData.username || userData.id,
            targetId: userData.id,
            targetUserName: `${userData.ime} ${userData.prezime}`,
            metadata: {
                userId: userData.id,
                role: userData.role,
                agency: userData.agencija_naziv
            }
        });
    }

    /**
     * Profile update
     */
    static async logProfileUpdate(changes) {
        return this.log('PROFILE_UPDATE', {
            metadata: { changes }
        });
    }

    /**
     * Search
     */
    static async logSearch(query, resultsCount) {
        return this.log('SEARCH', {
            query: query,
            metadata: { resultsCount }
        });
    }

    /**
     * Export
     */
    static async logExport(format, itemCount) {
        return this.log('EXPORT', {
            format: format,
            metadata: { itemCount }
        });
    }

    /**
     * Error
     */
    static async logError(errorMessage, context = {}) {
        return this.log('ERROR', {
            status: 'FAILED',
            errorMessage: errorMessage,
            metadata: context
        });
    }
}

// Export za korištenje
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuditLogger;
}
