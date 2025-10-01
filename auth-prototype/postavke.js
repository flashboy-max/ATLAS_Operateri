// Postavke JavaScript
class Postavke {
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
        this.loadUserData();
        this.setupEventListeners();
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Update header
        document.getElementById('headerUserName').textContent = this.currentUser.ime_prezime;
        document.getElementById('dropdownUserName').textContent = this.currentUser.ime_prezime;
        document.getElementById('dropdownUserEmail').textContent = this.currentUser.email;
        document.getElementById('dropdownAgency').textContent = this.currentUser.agencija;
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
    new Postavke();
});
