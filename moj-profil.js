// ================================================
// MOJ PROFIL JS - Kompletna implementacija
// ================================================

class MojProfil {
    constructor() {
        this.currentUser = null;
        this.isEditing = false;
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

        console.log('📄 Moj profil učitan za:', this.currentUser);
    }

    loadProfileData() {
        if (!this.currentUser) return;

        const { ime, prezime, username, email, agencija_naziv, role, kreiran, poslednja_aktivnost } = this.currentUser;

        // Osnovne informacije - koristi postojeće ID-jeve iz HTML-a
        this.setTextContent('profileName', `${ime} ${prezime}`);
        this.setTextContent('profileRole', this.getRoleDisplay(role));
        
        // Input polja (disabled za sada)
        this.setInputValue('firstName', ime);
        this.setInputValue('lastName', prezime);
        this.setInputValue('email', email);
        this.setInputValue('agency', agencija_naziv || 'ATLAS sistem');
    }

    setupEventListeners() {
        // Za sada placeholder - funkcionalnost će biti dodana kasnije
        console.log('📋 Event listeneri postavljeni za Moj profil');
    }

    toggleEditMode() {
        this.isEditing = !this.isEditing;
        
        const viewSection = document.getElementById('profileViewSection');
        const editSection = document.getElementById('profileEditSection');
        
        if (viewSection) viewSection.style.display = this.isEditing ? 'none' : 'block';
        if (editSection) editSection.style.display = this.isEditing ? 'block' : 'none';
    }

    async saveProfile() {
        const updatedData = {
            ime: document.getElementById('editIme')?.value,
            prezime: document.getElementById('editPrezime')?.value,
            email: document.getElementById('editEmail')?.value
        };
        
        if (!updatedData.ime || !updatedData.prezime) {
            this.showNotification('Ime i prezime su obavezni!', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthSystem.getToken()}`
                },
                body: JSON.stringify(updatedData)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.currentUser = { ...this.currentUser, ...updatedData };
                this.loadProfileData();
                this.toggleEditMode();
                this.showNotification('Profil uspješno ažuriran!', 'success');
                
                // Ažuriraj header
                await SharedHeader.init(this.currentUser);
            } else {
                throw new Error('Greška pri ažuriranju profila');
            }
        } catch (error) {
            console.error('Greška pri čuvanju profila:', error);
            this.showNotification('Greška pri čuvanju profila', 'error');
        }
    }

    cancelEdit() {
        this.loadProfileData();
        this.toggleEditMode();
    }

    showChangePasswordModal() {
        // TODO: Implementirati modal za promjenu lozinke
        alert('Funkcionalnost promjene lozinke će biti dostupna uskoro.');
    }

    updateRoleBadge(role) {
        const roleBadge = document.getElementById('profileRoleBadge');
        if (!roleBadge) return;
        
        const roleClasses = {
            'SUPERADMIN': 'badge-superadmin',
            'ADMIN': 'badge-admin',
            'KORISNIK': 'badge-korisnik'
        };
        
        roleBadge.className = `role-badge ${roleClasses[role] || ''}`;
        roleBadge.textContent = this.getRoleDisplay(role);
    }

    setTextContent(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value || 'N/A';
    }

    setInputValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.value = value || '';
    }

    showNotification(message, type = 'info') {
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

    formatDate(dateStr) {
        if (!dateStr) return 'Nepoznato';
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Danas';
        if (diffDays === 1) return 'Juče';
        if (diffDays < 7) return `Prije ${diffDays} dana`;
        
        return date.toLocaleDateString('bs-BA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MojProfil();
});