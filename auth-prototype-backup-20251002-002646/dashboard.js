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
        this.setupWelcomeSection();
        this.setupStats();
        this.setupActions();
        this.setupActivity();
        this.setupEventListeners();
    }

    setupUserMenu() {
        const { ime, prezime, role, agencija_naziv, email } = this.currentUser;
        
        // Header user info
        document.querySelector('.user-name').textContent = `${ime} ${prezime}`;
        document.querySelector('.user-role').textContent = this.getRoleDisplay(role);
        
        // Dropdown info
        document.getElementById('dropdownUserName').textContent = `${ime} ${prezime}`;
        document.getElementById('dropdownUserEmail').textContent = email;
        document.getElementById('dropdownAgency').textContent = agencija_naziv;
    }

    setupWelcomeSection() {
        const { ime, role } = this.currentUser;
        const time = new Date().getHours();
        let greeting = 'Dobro jutro';
        
        if (time >= 12 && time < 18) greeting = 'Dobar dan';
        if (time >= 18) greeting = 'Dobro veče';
        
        document.getElementById('welcomeTitle').textContent = 
            `${greeting}, ${ime}!`;
        
        document.getElementById('welcomeSubtitle').textContent = 
            this.getWelcomeMessage(role);
    }

    getWelcomeMessage(role) {
        const messages = {
            'SUPERADMIN': 'Potpuna kontrola nad sistemom na raspolaganju',
            'ADMIN': 'Upravljanje korisnicima i operaterima vaše agencije',
            'KORISNIK': 'Pregled operatera i statistike vaše agencije'
        };
        return messages[role] || 'Dobrodošli u ATLAS sistem';
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
        const commonActions = [
            {
                id: 'view-operators',
                icon: 'fas fa-list',
                title: 'Pregled operatera',
                description: 'Pogledaj listu svih telekom operatera'
            },
            {
                id: 'search-operators',
                icon: 'fas fa-search',
                title: 'Pretraži operatere',
                description: 'Napredna pretraga po kriterijumima'
            }
        ];

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
                {
                    id: 'add-operator',
                    icon: 'fas fa-plus-circle',
                    title: 'Dodaj operatera',
                    description: 'Registruj novog telekom operatera'
                },
                ...commonActions,
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
                {
                    id: 'add-operator',
                    icon: 'fas fa-plus-circle',
                    title: 'Dodaj operatera',
                    description: 'Registruj novog telekom operatera'
                },
                ...commonActions,
                {
                    id: 'agency-reports',
                    icon: 'fas fa-chart-bar',
                    title: 'Izvještaji',
                    description: 'Generiši izvještaje za agenciju'
                }
            ];
        }

        // KORISNIK role
        return [
            ...commonActions,
            {
                id: 'export-data',
                icon: 'fas fa-download',
                title: 'Izvoz podataka',
                description: 'Preuzmi podatke o operaterima'
            },
            {
                id: 'my-activity',
                icon: 'fas fa-history',
                title: 'Moje aktivnosti',
                description: 'Pregled tvojih nedavnih akcija'
            }
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
        
        const activities = this.getMockActivities(role);
        const activityList = document.getElementById('activityList');
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
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
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userMenu.classList.remove('active');
        });

        // Dropdown items - close on click
        document.querySelectorAll('.user-dropdown .dropdown-item:not(#logoutBtn)').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                userMenu.classList.remove('active');
                
                const text = item.querySelector('span').textContent;
                if (text === 'Moj profil') {
                    alert('Moj profil - U razvoju\n\nOvdje će biti stranica za uređivanje vašeg profila.');
                } else if (text === 'Postavke') {
                    alert('Postavke - U razvoju\n\nOvdje će biti postavke aplikacije.');
                }
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
                window.location.href = 'user-management.html';
                break;
            case 'manage-agencies':
                alert('Upravljanje agencijama - U razvoju');
                break;
            case 'add-operator':
                alert('Dodavanje operatera - Vodi na glavni ATLAS sistem');
                break;
            case 'view-operators':
                alert('Pregled operatera - Vodi na glavni ATLAS sistem');
                break;
            case 'search-operators':
                alert('Pretraga operatera - Vodi na glavni ATLAS sistem');
                break;
            case 'system-logs':
                alert('Sistem logovi - U razvoju');
                break;
            case 'my-activity':
                alert('Moja aktivnost - U razvoju');
                break;
            case 'export-data':
                alert('Eksport podataka - U razvoju');
                break;
            case 'reports':
                alert('Izvještaji - U razvoju');
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

// Initialize dashboard
const dashboard = new Dashboard();
