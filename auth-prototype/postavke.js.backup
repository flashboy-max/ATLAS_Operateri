// ================================================
// POSTAVKE JS
// ================================================

class Postavke {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Provjeri autentikaciju
        if (!AuthSystem.requireAuth()) {
            return;
        }

        this.currentUser = AuthSystem.getCurrentUser();
        
        // Setup UI
        this.setupUserMenu();
        this.setupEventListeners();
    }

    setupUserMenu() {
        const { ime, prezime, role, agencija_naziv, email } = this.currentUser;
        
        // Header user info
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        
        if (userNameElement) {
            userNameElement.textContent = `${ime} ${prezime}`;
        }
        if (userRoleElement) {
            userRoleElement.textContent = this.getRoleDisplay(role);
        }
        
        // Generate role-based dropdown menu
        this.generateDropdownMenu(role);
    }

    generateDropdownMenu(role) {
        const dropdown = document.getElementById('userDropdown');
        
        // Header ostaje isti
        const header = `
            <div class="dropdown-header">
                <div class="dropdown-user-info">
                    <strong id="dropdownUserName">${this.currentUser.ime} ${this.currentUser.prezime}</strong>
                    <small id="dropdownUserEmail">${this.currentUser.email}</small>
                    <span class="dropdown-agency" id="dropdownAgency">${this.currentUser.agencija_naziv}</span>
                </div>
            </div>
        `;

        let menuItems = '';
        
        if (role === 'SUPERADMIN') {
            menuItems = `
                <div class="dropdown-divider"></div>
                <a href="dashboard.html" class="dropdown-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="user-management.html" class="dropdown-item">
                    <i class="fas fa-users-cog"></i>
                    <span>Upravljanje korisnicima</span>
                </a>
                <a href="system-logs.html" class="dropdown-item">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Sistemski logovi</span>
                </a>
            `;
        } else if (role === 'ADMIN') {
            menuItems = `
                <div class="dropdown-divider"></div>
                <a href="dashboard.html" class="dropdown-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="user-management.html" class="dropdown-item">
                    <i class="fas fa-users"></i>
                    <span>Upravljanje korisnicima</span>
                </a>
                <a href="system-logs.html" class="dropdown-item">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Sistemski logovi</span>
                </a>
            `;
        } else if (role === 'KORISNIK') {
            menuItems = `
                <div class="dropdown-divider"></div>
                <a href="dashboard.html" class="dropdown-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
                <a href="system-logs.html?tab=my" class="dropdown-item">
                    <i class="fas fa-user-check"></i>
                    <span>Moje aktivnosti</span>
                </a>
            `;
        }

        // Zajednički dio - profil, postavke, odjava
        const footer = `
            <div class="dropdown-divider"></div>
            <a href="moj-profil.html" class="dropdown-item">
                <i class="fas fa-user-circle"></i>
                <span>Moj profil</span>
            </a>
            <a href="postavke.html" class="dropdown-item">
                <i class="fas fa-cog"></i>
                <span>Postavke</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout-item" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Odjavi se</span>
            </a>
        `;

        dropdown.innerHTML = header + menuItems + footer;
        
        // Re-attach logout event listener
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    setupEventListeners() {
        // User menu toggle
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenu && userDropdown) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('active');
            });
        }

        // Dropdown items - linkovi sada rade normalno (already attached in generateDropdownMenu)
        const dropdownItems = document.querySelectorAll('.user-dropdown .dropdown-item:not(#logoutBtn)');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                if (userDropdown) {
                    userDropdown.classList.remove('active');
                }
            });
        });
    }

    handleLogout() {
        if (confirm('Da li ste sigurni da želite da se odjavite?')) {
            const authSystem = new AuthSystem();
            authSystem.logout();
            window.location.href = 'login.html';
        }
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

// Initialize
let postavke;
window.addEventListener('DOMContentLoaded', () => {
    postavke = new Postavke();
    window.postavke = postavke;
});
