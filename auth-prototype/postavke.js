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
            // Provjeri autentikaciju
            if (!AuthSystem.requireAuth()) {
                return;
            }

            this.currentUser = AuthSystem.getCurrentUser();
            
            // Initialize SharedHeader
            await this.initializeSharedHeader();
            
            // Setup UI
            this.loadPostavkeData();
            this.setupEventListeners();
            
            console.log('✅ Postavke učitane za:', this.currentUser);
        } catch (error) {
            console.error('❌ Greška pri inicijalizaciji Postavke:', error);
            window.location.href = 'login.html';
        }
    }

    async initializeSharedHeader() {
        if (typeof SharedHeader !== 'undefined') {
            // Mount shared header
            SharedHeader.mount();
            
            // Render user info
            SharedHeader.renderHeaderUser(this.currentUser);
            
            console.log('✅ SharedHeader inicijalizovan u Postavke');
        } else {
            console.warn('⚠️ SharedHeader nije dostupan');
        }
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