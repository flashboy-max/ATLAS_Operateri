// ================================================
// POSTAVKE JS - Kompletna implementacija
// ================================================

class PostavkeManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            this.currentUser = await AuthSystem.requireAuth();
        } catch (error) {
            window.location.href = 'login.html';
            return;
        }

        await SharedHeader.init(this.currentUser);
        this.loadUserPreferences();
        this.setupEventListeners();

        console.log('⚙️ Postavke učitane za:', this.currentUser);
    }

    loadUserPreferences() {
        // Placeholder - UI elementi će biti dodani kasnije
        console.log('⚙️ Postavke učitane za korisnika:', this.currentUser.username);
    }

    setupEventListeners() {
        // Placeholder - event listeneri će biti dodani kasnije
        console.log('📋 Event listeneri postavljeni za Postavke');
    }

    getPreferences() {
        const defaultPreferences = {
            notifications: {
                email: true,
                browser: false,
                activity: true
            },
            appearance: {
                theme: 'light',
                language: 'bs'
            },
            privacy: {
                profileVisible: true,
                trackActivity: true
            }
        };
        
        const saved = localStorage.getItem(`postavke_${this.currentUser.id}`);
        return saved ? JSON.parse(saved) : defaultPreferences;
    }

    async saveSettings() {
        const preferences = {
            notifications: {
                email: document.getElementById('emailNotifications')?.checked || false,
                browser: document.getElementById('browserNotifications')?.checked || false,
                activity: document.getElementById('activityNotifications')?.checked || false
            },
            appearance: {
                theme: document.getElementById('themeSelect')?.value || 'light',
                language: document.getElementById('languageSelect')?.value || 'bs'
            },
            privacy: {
                profileVisible: document.getElementById('profileVisibility')?.checked || false,
                trackActivity: document.getElementById('activityTracking')?.checked || false
            }
        };
        
        try {
            localStorage.setItem(`postavke_${this.currentUser.id}`, JSON.stringify(preferences));
            this.showNotification('Postavke uspješno sačuvane!', 'success');
        } catch (error) {
            console.error('Greška pri čuvanju postavki:', error);
            this.showNotification('Greška pri čuvanju postavki', 'error');
        }
    }

    resetSettings() {
        if (confirm('Da li ste sigurni da želite resetovati sve postavke na podrazumijevane vrijednosti?')) {
            localStorage.removeItem(`postavke_${this.currentUser.id}`);
            this.loadUserPreferences();
            this.showNotification('Postavke resetovane na podrazumijevane vrijednosti', 'info');
        }
    }

    showChangePasswordModal() {
        // TODO: Implementirati modal za promjenu lozinke
        alert('Funkcionalnost promjene lozinke će biti dostupna uskoro.');
    }

    showNotification(message, type = 'info') {
        // Kreiranje notification elementa
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getRoleDisplay(role) {
        const roles = {
            'SUPERADMIN': 'Super Administrator',
            'ADMIN': 'Administrator',
            'KORISNIK': 'Korisnik'
        };
        return roles[role] || role;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PostavkeManager();
});