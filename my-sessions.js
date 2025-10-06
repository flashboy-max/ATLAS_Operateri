// ================================================
// MY SESSIONS - Upravljanje Aktivnim Sesijama
// ================================================

class SessionManager {
    constructor() {
        this.sessions = [];
        this.autoRefreshInterval = null;
        this.init();
    }

    async init() {
        // Check authentication
        try {
            await AuthSystem.requireAuth();
        } catch (error) {
            console.error('Authentication required:', error);
            return;
        }

        // Setup event listeners
        this.setupEventListeners();

        // Load sessions
        await this.loadSessions();

        // Setup auto-refresh (every 30 seconds)
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        // Logout All button
        const logoutAllBtn = document.getElementById('logoutAllBtn');
        if (logoutAllBtn) {
            logoutAllBtn.addEventListener('click', () => this.confirmLogoutAll());
        }

        // Confirmation dialog
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');

        if (confirmYes) {
            confirmYes.addEventListener('click', () => this.handleConfirmYes());
        }

        if (confirmNo) {
            confirmNo.addEventListener('click', () => this.hideConfirmDialog());
        }
    }

    async loadSessions() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const sessionsList = document.getElementById('sessionsList');
        const emptyState = document.getElementById('emptyState');
        const errorMessage = document.getElementById('errorMessage');

        try {
            // Show loading
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (sessionsList) sessionsList.innerHTML = '';
            if (emptyState) emptyState.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';

            // Fetch sessions from API
            const response = await AuthSystem.fetchWithAuth('/api/auth/sessions');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.sessions = data.sessions || [];

            // Hide loading
            if (loadingSpinner) loadingSpinner.style.display = 'none';

            // Display sessions
            if (this.sessions.length === 0) {
                if (emptyState) emptyState.style.display = 'block';
            } else {
                this.displaySessions();
            }

        } catch (error) {
            console.error('Failed to load sessions:', error);

            // Hide loading
            if (loadingSpinner) loadingSpinner.style.display = 'none';

            // Show error
            if (errorMessage) {
                errorMessage.textContent = `Greška pri učitavanju sesija: ${error.message}`;
                errorMessage.style.display = 'block';
            }
        }
    }

    displaySessions() {
        const sessionsList = document.getElementById('sessionsList');
        if (!sessionsList) return;

        sessionsList.innerHTML = '';

        // Sort: current session first, then by lastActivity
        const sortedSessions = [...this.sessions].sort((a, b) => {
            if (a.isCurrent) return -1;
            if (b.isCurrent) return 1;
            return new Date(b.lastActivity) - new Date(a.lastActivity);
        });

        sortedSessions.forEach(session => {
            const card = this.createSessionCard(session);
            sessionsList.appendChild(card);
        });
    }

    createSessionCard(session) {
        const card = document.createElement('div');
        card.className = `session-card ${session.isCurrent ? 'current' : ''}`;
        card.dataset.sessionId = session.sessionId;

        const deviceIcon = this.getDeviceIcon(session.userAgent, session.deviceName);
        const deviceType = this.getDeviceType(session.userAgent);

        card.innerHTML = `
            ${session.isCurrent ? '<div class="current-badge">TRENUTNA</div>' : ''}
            
            <div class="device-info">
                <div class="device-icon">
                    <i class="${deviceIcon}"></i>
                </div>
                <div class="device-name">
                    <h3>${this.escapeHtml(session.deviceName)}</h3>
                    <div class="device-type">${deviceType}</div>
                </div>
            </div>

            <div class="session-details">
                <div class="detail-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <strong>IP Adresa:</strong>
                    <span>${this.escapeHtml(session.ip)}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-clock"></i>
                    <strong>Posljednja Aktivnost:</strong>
                    <span>${this.formatTimestamp(session.lastActivity)}</span>
                </div>
                <div class="detail-row">
                    <i class="fas fa-calendar-alt"></i>
                    <strong>Kreirana:</strong>
                    <span>${this.formatTimestamp(session.createdAt)}</span>
                </div>
            </div>

            ${!session.isCurrent ? `
                <div class="session-actions">
                    <button class="btn-logout-session" data-session-id="${session.sessionId}">
                        <i class="fas fa-sign-out-alt"></i>
                        Odjavi Ovaj Uređaj
                    </button>
                </div>
            ` : ''}
        `;

        // Add event listener for logout button
        if (!session.isCurrent) {
            const logoutBtn = card.querySelector('.btn-logout-session');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.confirmLogoutSession(session.sessionId, session.deviceName);
                });
            }
        }

        return card;
    }

    getDeviceIcon(userAgent, deviceName) {
        const ua = (userAgent || '').toLowerCase();
        const name = (deviceName || '').toLowerCase();

        // Mobile devices
        if (ua.includes('mobile') || ua.includes('android') || name.includes('mobile')) {
            return 'fas fa-mobile-alt';
        }
        if (ua.includes('iphone')) {
            return 'fab fa-apple';
        }
        if (ua.includes('ipad') || ua.includes('tablet')) {
            return 'fas fa-tablet-alt';
        }

        // Desktop browsers
        if (ua.includes('chrome') || name.includes('chrome')) {
            return 'fab fa-chrome';
        }
        if (ua.includes('firefox') || name.includes('firefox')) {
            return 'fab fa-firefox';
        }
        if (ua.includes('safari') || name.includes('safari')) {
            return 'fab fa-safari';
        }
        if (ua.includes('edge') || name.includes('edge')) {
            return 'fab fa-edge';
        }

        // Default desktop
        return 'fas fa-desktop';
    }

    getDeviceType(userAgent) {
        const ua = (userAgent || '').toLowerCase();

        if (ua.includes('mobile')) return 'Mobilni Uređaj';
        if (ua.includes('iphone')) return 'iPhone';
        if (ua.includes('ipad')) return 'iPad';
        if (ua.includes('android')) return 'Android';
        if (ua.includes('tablet')) return 'Tablet';
        if (ua.includes('windows')) return 'Windows Desktop';
        if (ua.includes('mac os')) return 'Mac Desktop';
        if (ua.includes('linux')) return 'Linux Desktop';

        return 'Desktop Kompjuter';
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        // Relative time for recent activity
        if (diffMins < 1) {
            return 'Upravo sada';
        } else if (diffMins < 60) {
            return `Prije ${diffMins} ${diffMins === 1 ? 'minut' : 'minuta'}`;
        } else if (diffHours < 24) {
            return `Prije ${diffHours} ${diffHours === 1 ? 'sat' : 'sata'}`;
        } else if (diffDays < 7) {
            return `Prije ${diffDays} ${diffDays === 1 ? 'dan' : 'dana'}`;
        }

        // Absolute time for older activity
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return date.toLocaleDateString('sr-Latn-BA', options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    confirmLogoutSession(sessionId, deviceName) {
        this.pendingAction = {
            type: 'logout-session',
            sessionId: sessionId,
            deviceName: deviceName
        };

        const confirmMessage = document.getElementById('confirmMessage');
        if (confirmMessage) {
            confirmMessage.textContent = `Da li ste sigurni da želite odjaviti sesiju "${deviceName}"? Ovo će odmah prekinuti pristup sa tog uređaja.`;
        }

        this.showConfirmDialog();
    }

    confirmLogoutAll() {
        this.pendingAction = {
            type: 'logout-all'
        };

        const confirmMessage = document.getElementById('confirmMessage');
        if (confirmMessage) {
            confirmMessage.textContent = `Da li ste sigurni da želite odjaviti SVE sesije? Bićete odjavljeni sa SVIH uređaja uključujući trenutni.`;
        }

        this.showConfirmDialog();
    }

    showConfirmDialog() {
        const dialog = document.getElementById('confirmDialog');
        if (dialog) {
            dialog.style.display = 'flex';
        }
    }

    hideConfirmDialog() {
        const dialog = document.getElementById('confirmDialog');
        if (dialog) {
            dialog.style.display = 'none';
        }
        this.pendingAction = null;
    }

    async handleConfirmYes() {
        if (!this.pendingAction) {
            this.hideConfirmDialog();
            return;
        }

        if (this.pendingAction.type === 'logout-session') {
            await this.logoutSession(this.pendingAction.sessionId);
        } else if (this.pendingAction.type === 'logout-all') {
            await this.logoutAll();
        }

        this.hideConfirmDialog();
    }

    async logoutSession(sessionId) {
        try {
            const response = await AuthSystem.fetchWithAuth(`/api/auth/sessions/${sessionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Show success message
            this.showNotification('Sesija uspješno odjavljena', 'success');

            // Reload sessions
            await this.loadSessions();

        } catch (error) {
            console.error('Failed to logout session:', error);
            this.showNotification(`Greška pri odjavi sesije: ${error.message}`, 'error');
        }
    }

    async logoutAll() {
        try {
            const response = await AuthSystem.fetchWithAuth('/api/auth/logout-all', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Show success message
            this.showNotification(`Odjavljeno sa ${data.deletedCount} uređaja`, 'success');

            // Stop auto-refresh
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
            }

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            console.error('Failed to logout all:', error);
            this.showNotification(`Greška pri odjavi: ${error.message}`, 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${this.escapeHtml(message)}</span>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Add styles if not exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    font-weight: 600;
                }
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-success {
                    background: #28a745;
                    color: white;
                }
                .notification-error {
                    background: #dc3545;
                    color: white;
                }
                .notification i {
                    font-size: 1.25rem;
                }
            `;
            document.head.appendChild(style);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    setupAutoRefresh() {
        // Refresh sessions every 30 seconds
        this.autoRefreshInterval = setInterval(() => {
            this.loadSessions();
        }, 30000);
    }

    destroy() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
    }
}

// Initialize Session Manager
const sessionManager = new SessionManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    sessionManager.destroy();
});
