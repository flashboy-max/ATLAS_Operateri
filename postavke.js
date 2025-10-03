// ================================================
// POSTAVKE JS - Modernized with SharedHeader
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

        this.setupTabs();
        this.setupEventListeners();
        this.loadUserPreferences();

        console.log('⚙️ Postavke učitane za:', this.currentUser);
    }

    loadPostavkeData() {
        // Placeholder za buduće funkcionalnosti
        console.log('⚙️ Postavke podatci učitani');
    }

    setupEventListeners() {
        // Placeholder za buduće funkcionalnosti
        console.log('📋 Event listeneri postavljeni za Postavke');
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