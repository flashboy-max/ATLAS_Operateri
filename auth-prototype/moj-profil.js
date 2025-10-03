// ================================================
// MOJ PROFIL JS - Modernized with SharedHeader
// ================================================

class MojProfil {
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
            this.loadProfileData();
            this.setupEventListeners();
            
            console.log('✅ Moj profil učitan za:', this.currentUser);
        } catch (error) {
            console.error('❌ Greška pri inicijalizaciji Moj profil:', error);
            window.location.href = 'login.html';
        }
    }

    async initializeSharedHeader() {
        if (typeof SharedHeader !== 'undefined') {
            // Mount shared header
            SharedHeader.mount();
            
            // Render user info
            SharedHeader.renderHeaderUser(this.currentUser);
            
            console.log('✅ SharedHeader inicijalizovan u Moj profil');
        } else {
            console.warn('⚠️ SharedHeader nije dostupan');
        }
    }

    loadProfileData() {
        if (!this.currentUser) return;

        const { ime, prezime, email, agencija_naziv, role, kreiran } = this.currentUser;

        // Prikaz osnovnih informacija
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAgency = document.getElementById('profileAgency');
        const profileRole = document.getElementById('profileRole');
        const profileCreated = document.getElementById('profileCreated');

        if (profileName) profileName.textContent = `${ime} ${prezime}`;
        if (profileEmail) profileEmail.textContent = email || 'Nije postavljeno';
        if (profileAgency) profileAgency.textContent = agencija_naziv || 'ATLAS sistem';
        if (profileRole) profileRole.textContent = this.getRoleDisplay(role);
        if (profileCreated) profileCreated.textContent = this.formatDate(kreiran);
    }

    setupEventListeners() {
        // Placeholder za buduće funkcionalnosti
        console.log('📋 Event listeneri postavljeni za Moj profil');
    }

    getRoleDisplay(role) {
        const roles = {
            'SUPERADMIN': 'Super Administrator',
            'ADMIN': 'Administrator',
            'KORISNIK': 'Korisnik'
        };
        return roles[role] || role;
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Nepoznato';
        const date = new Date(dateStr);
        return date.toLocaleDateString('bs-BA');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MojProfil();
});