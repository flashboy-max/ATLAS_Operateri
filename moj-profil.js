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
            this.currentUser = await AuthSystem.requireAuth();
        } catch (error) {
            window.location.href = 'login.html';
            return;
        }

        await SharedHeader.init(this.currentUser);

        this.loadProfileData();
        this.setupEventListeners();

        console.log('📄 Moj profil ucitan za:', this.currentUser);
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