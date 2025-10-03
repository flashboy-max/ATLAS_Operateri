// ================================================
// DASHBOARD.JS - Dashboard logika sa role-based UI
// ================================================

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Provjeri autentikaciju
        if (!AuthSystem.requireAuth()) {
            return;
        }

        // Učitaj trenutnog korisnika
        this.currentUser = AuthSystem.getCurrentUser();
        
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        console.log('👤 Dashboard učitan za:', this.currentUser);

        // Setup UI
        this.setupUserMenu();
        this.setupStats();
        this.setupActions();
        this.setupActivity();
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
            AuthSystem.logout();
        });
    }

    setupStats() {
        const stats = this.getStatsForRole(this.currentUser.role);
        const statsSection = document.getElementById('statsSection');
        
        statsSection.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="stat-icon ${stat.color}">
                    <i class="${stat.icon}"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            </div>
        `).join('');
    }

    getStatsForRole(role) {
        const baseStats = [
            {
                icon: 'fas fa-building',
                label: 'Ukupno operatera',
                value: '31',
                color: 'primary'
            },
            {
                icon: 'fas fa-check-circle',
                label: 'Aktivni operateri',
                value: '24',
                color: 'success'
            },
            {
                icon: 'fas fa-exclamation-circle',
                label: 'Neaktivni operateri',
                value: '7',
                color: 'warning'
            }
        ];

        if (role === 'SUPERADMIN') {
            return [
                ...baseStats,
                {
                    icon: 'fas fa-users',
                    label: 'Ukupno korisnika',
                    value: '47',
                    color: 'info'
                }
            ];
        }

        if (role === 'ADMIN') {
            return [
                ...baseStats,
                {
                    icon: 'fas fa-user-shield',
                    label: 'Korisnici agencije',
                    value: '12',
                    color: 'info'
                }
            ];
        }

        return baseStats;
    }

    setupActions() {
        const actions = this.getActionsForRole(this.currentUser.role);
        const actionsGrid = document.getElementById('actionsGrid');
        
        actionsGrid.innerHTML = actions.map(action => `
            <div class="action-card" onclick="dashboard.handleAction('${action.id}')">
                <div class="action-icon">
                    <i class="${action.icon}"></i>
                </div>
                <div class="action-title">${action.title}</div>
                <div class="action-description">${action.description}</div>
            </div>
        `).join('');
    }

    getActionsForRole(role) {
        // Zajednička kartica za sve - pristup glavnoj ATLAS aplikaciji
        const operatorsCard = {
            id: 'operators-main',
            icon: 'fas fa-building',
            title: 'Operateri',
            description: 'Pregled, pretraga i upravljanje telekom operaterima'
        };

        if (role === 'SUPERADMIN') {
            return [
                {
                    id: 'manage-users',
                    icon: 'fas fa-users-cog',
                    title: 'Upravljanje korisnicima',
                    description: 'Dodaj, uredi ili obriši korisnike sistema'
                },
                {
                    id: 'manage-agencies',
                    icon: 'fas fa-building',
                    title: 'Upravljanje agencijama',
                    description: 'Postavke policijskih agencija'
                },
                operatorsCard,
                {
                    id: 'system-logs',
                    icon: 'fas fa-clipboard-list',
                    title: 'Sistemski logovi',
                    description: 'Pregled svih aktivnosti u sistemu'
                }
            ];
        }

        if (role === 'ADMIN') {
            return [
                {
                    id: 'manage-agency-users',
                    icon: 'fas fa-user-plus',
                    title: 'Korisnici agencije',
                    description: 'Upravljaj korisnicima tvoje agencije'
                },
                operatorsCard
            ];
        }

        // KORISNIK role
        return [
            operatorsCard
        ];
    }

    setupActivity() {
        const { role } = this.currentUser;
        
        // Aktivnosti se prikazuju samo za ADMIN i SUPERADMIN
        if (role === 'KORISNIK') {
            document.getElementById('activitySection').style.display = 'none';
            return;
        }

        document.getElementById('activitySection').style.display = 'block';
        
        const activities = this.getRecentActivities(5);
        const activityList = document.getElementById('activityList');
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.iconClass}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    getRecentActivities(limit = 5) {
        // Load from SYSTEM_LOGS if available
        if (typeof SYSTEM_LOGS === 'undefined') {
            return this.getMockActivities();
        }

        let filteredLogs = [...SYSTEM_LOGS];

        // 🔒 ROLE-BASED FILTERING
        if (this.currentUser.role === 'KORISNIK') {
            // KORISNIK vidi SAMO svoje aktivnosti
            const currentUserName = `${this.currentUser.ime} ${this.currentUser.prezime}`;
            filteredLogs = SYSTEM_LOGS.filter(log => log.user_name === currentUserName);
        } else if (this.currentUser.role === 'ADMIN') {
            // ADMIN vidi samo aktivnosti korisnika svoje agencije (bez SUPERADMIN-a)
            const currentAgency = this.currentUser.agencija;
            
            // Filtriraj logove - prikaži samo one od korisnika iste agencije, ali ne SUPERADMIN-a
            filteredLogs = SYSTEM_LOGS.filter(log => {
                // Pronađi korisnika koji je napravio log
                const logUser = MOCK_USERS.find(u => 
                    `${u.ime} ${u.prezime}` === log.user_name
                );
                
                // Prikaži log samo ako je korisnik iz iste agencije I NIJE SUPERADMIN
                return logUser && 
                       logUser.agencija === currentAgency && 
                       logUser.role !== 'SUPERADMIN';
            });
        }
        // SUPERADMIN vidi sve logove (bez filtera)

        const recentLogs = filteredLogs.slice(0, limit);
        
        return recentLogs.map(log => {
            const icon = this.getActivityIcon(log.action);
            return {
                icon: icon.icon,
                iconClass: icon.class,
                text: `${log.user_name}: ${log.target}`,
                time: this.getTimeAgo(log.timestamp)
            };
        });
    }

    getActivityIcon(action) {
        const icons = {
            'LOGIN': { icon: 'fas fa-sign-in-alt', class: 'icon-success' },
            'LOGOUT': { icon: 'fas fa-sign-out-alt', class: 'icon-muted' },
            'CREATE_USER': { icon: 'fas fa-user-plus', class: 'icon-primary' },
            'UPDATE_USER': { icon: 'fas fa-user-edit', class: 'icon-warning' },
            'DELETE_USER': { icon: 'fas fa-user-minus', class: 'icon-danger' },
            'CREATE_OPERATOR': { icon: 'fas fa-plus-circle', class: 'icon-primary' },
            'UPDATE_OPERATOR': { icon: 'fas fa-edit', class: 'icon-warning' },
            'DELETE_OPERATOR': { icon: 'fas fa-trash-alt', class: 'icon-danger' },
            'SEARCH': { icon: 'fas fa-search', class: 'icon-info' },
            'EXPORT': { icon: 'fas fa-file-export', class: 'icon-success' }
        };
        return icons[action] || { icon: 'fas fa-info-circle', class: '' };
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const logTime = new Date(timestamp);
        const diff = Math.floor((now - logTime) / 1000); // seconds

        if (diff < 60) return 'Upravo sada';
        if (diff < 3600) return `Prije ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `Prije ${Math.floor(diff / 3600)} sati`;
        if (diff < 172800) return 'Juče';
        return `Prije ${Math.floor(diff / 86400)} dana`;
    }

    getMockActivities(role) {
        const baseActivities = [
            {
                icon: 'fas fa-plus',
                text: 'Novi operator "Lanaco d.o.o." dodan u sistem',
                time: 'Prije 2 sata'
            },
            {
                icon: 'fas fa-edit',
                text: 'Operator "BH Telecom" ažuriran',
                time: 'Prije 5 sati'
            },
            {
                icon: 'fas fa-eye',
                text: 'Izvještaj operatera pregledan',
                time: 'Juče u 14:30'
            }
        ];

        if (role === 'SUPERADMIN') {
            return [
                {
                    icon: 'fas fa-user-plus',
                    text: 'Novi korisnik "Amira Amirić" kreiran (MUP KS)',
                    time: 'Prije 30 minuta'
                },
                ...baseActivities,
                {
                    icon: 'fas fa-trash',
                    text: 'Operator "Test Operator" obrisan',
                    time: '2 dana prije'
                }
            ];
        }

        return baseActivities;
    }

    setupEventListeners() {
        // User menu toggle
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        
        if (!userMenu || !userDropdown) {
            console.error('User menu or dropdown not found!');
            return;
        }
        
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            console.log('Dropdown toggled, active:', userDropdown.classList.contains('active'));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('active');
        });

        // Dropdown items - linkovi sada rade normalno
        // Samo zatvaramo dropdown, bez preventDefault() da bi linkovi radili
        document.querySelectorAll('.user-dropdown .dropdown-item:not(#logoutBtn)').forEach(item => {
            item.addEventListener('click', () => {
                userDropdown.classList.remove('active');
                // Dozvoli da link radi normalno (navigacija na href)
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    handleAction(actionId) {
        console.log('Action clicked:', actionId);
        
        // Navigate to appropriate pages
        switch(actionId) {
            case 'manage-users':
            case 'manage-agency-users':
                window.location.href = 'user-management.html';
                break;
            case 'manage-agencies':
                alert('Upravljanje agencijama - U razvoju');
                break;
            case 'operators-main':
                // Vodi na glavnu ATLAS aplikaciju (index.html u root folderu)
                window.location.href = '../index.html';
                break;
            case 'system-logs':
                window.location.href = 'system-logs.html';
                break;
            default:
                alert(`Action: ${actionId}\n\nOvo je prototip. U pravoj aplikaciji bi ovo otvorilo odgovarajući modul.`);
        }
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

// Initialize dashboard and make it globally accessible
let dashboard;
window.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
    window.dashboard = dashboard; // Make it globally accessible for onclick handlers
});
