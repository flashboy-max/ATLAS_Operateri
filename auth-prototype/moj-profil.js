// Moj Profil JavaScript
class MojProfil {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check authentication
        if (!auth.checkAuth()) {
            return;
        }

        this.currentUser = auth.getCurrentUser();
        this.loadProfileData();
        this.setupEventListeners();
    }

    loadProfileData() {
        if (!this.currentUser) return;

        // Update header
        document.getElementById('headerUserName').textContent = this.currentUser.ime_prezime;
        document.getElementById('dropdownUserName').textContent = this.currentUser.ime_prezime;
        document.getElementById('dropdownUserEmail').textContent = this.currentUser.email;
        document.getElementById('dropdownAgency').textContent = this.currentUser.agencija;

        // Update profile info
        document.getElementById('profileName').textContent = this.currentUser.ime_prezime;
        document.getElementById('profileRole').textContent = this.getRoleDisplay(this.currentUser.role);

        // Split name into first and last name
        const nameParts = this.currentUser.ime_prezime.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        document.getElementById('firstName').value = firstName;
        document.getElementById('lastName').value = lastName;
        document.getElementById('email').value = this.currentUser.email;
        document.getElementById('agency').value = this.currentUser.agencija;

        // Set avatar background
        const avatar = document.querySelector('.profile-avatar-large');
        if (avatar) {
            avatar.style.background = this.getAvatarColor(this.currentUser.ime_prezime);
        }
    }

    getRoleDisplay(role) {
        const roleMap = {
            'SUPERADMIN': 'Super Administrator',
            'ADMIN': 'Administrator',
            'KORISNIK': 'Korisnik'
        };
        return roleMap[role] || role;
    }

    getAvatarColor(name) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                auth.logout();
            });
        }

        // User dropdown toggle
        const userInfoBtn = document.getElementById('userInfoBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userInfoBtn && userDropdown) {
            userInfoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!userInfoBtn.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MojProfil();
});
