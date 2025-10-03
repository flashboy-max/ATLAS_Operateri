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
        // Edit profile button
        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.toggleEditMode());
        }
        
        // Save profile button
        const saveBtn = document.getElementById('saveProfileBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProfile());
        }
        
        // Cancel edit button
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }
        
        // Change password button
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.showChangePasswordModal());
        }
        
        // Change password modal
        this.setupPasswordModal();
    }

    toggleEditMode() {
        this.isEditing = !this.isEditing;
        
        const editBtn = document.getElementById('editProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        
        if (this.isEditing) {
            // Switch to edit mode
            if (editBtn) editBtn.style.display = 'none';
            if (saveBtn) saveBtn.style.display = 'inline-block';
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
            
            if (firstName) firstName.disabled = false;
            if (lastName) lastName.disabled = false;
            if (email) email.disabled = false;
        } else {
            // Switch to view mode
            if (editBtn) editBtn.style.display = 'inline-block';
            if (saveBtn) saveBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'none';
            
            if (firstName) firstName.disabled = true;
            if (lastName) lastName.disabled = true;
            if (email) email.disabled = true;
        }
    }

    async saveProfile() {
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const email = document.getElementById('email')?.value;
        
        if (!firstName || !lastName) {
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
                body: JSON.stringify({
                    ime: firstName,
                    prezime: lastName,
                    email: email
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.currentUser = { ...this.currentUser, ...result.user };
                this.loadProfileData();
                this.toggleEditMode();
                this.showNotification('Profil uspješno ažuriran!', 'success');
                
                // Update SharedHeader with new data
                await SharedHeader.init(this.currentUser);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Greška pri ažuriranju profila');
            }
        } catch (error) {
            console.error('Greška pri čuvanju profila:', error);
            this.showNotification(error.message || 'Greška pri čuvanju profila', 'error');
        }
    }

    cancelEdit() {
        this.loadProfileData();
        this.toggleEditMode();
    }

    showChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear form
            const form = document.getElementById('changePasswordForm');
            if (form) form.reset();
        }
    }

    setupPasswordModal() {
        // Close modal buttons
        const closeBtn = document.getElementById('closePasswordModal');
        const cancelBtn = document.getElementById('cancelPasswordBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideChangePasswordModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideChangePasswordModal());
        }
        
        // Modal overlay click
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.hideChangePasswordModal();
                }
            });
        }
        
        // Password toggle buttons
        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // Change password form
        const form = document.getElementById('changePasswordForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }
    }

    async changePassword() {
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Sva polja su obavezna!', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Nova lozinka i potvrda se ne poklapaju!', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showNotification('Nova lozinka mora imati najmanje 8 karaktera!', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthSystem.getToken()}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            });
            
            if (response.ok) {
                this.hideChangePasswordModal();
                this.showNotification('Lozinka uspješno promijenjena!', 'success');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Greška pri promjeni lozinke');
            }
        } catch (error) {
            console.error('Greška pri promjeni lozinke:', error);
            this.showNotification(error.message || 'Greška pri promjeni lozinke', 'error');
        }
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