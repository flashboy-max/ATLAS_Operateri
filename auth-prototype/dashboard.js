// ================================================
// DASHBOARD.JS - Dashboard logika sa role-based UI
// ================================================

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.init().catch(error => {
            console.error('Dashboard init failed:', error);
            alert('Nije moguce ucitati dashboard. Provjerite konzolu za detalje.');
        });
    }

    async init() {
        if (!AuthSystem.requireAuth()) {
            return;
        }

        this.currentUser = AuthSystem.getCurrentUser();

        if (!this.currentUser) {
            try {
                const session = await AuthSystem.fetchSession();
                if (session?.user) {
                    this.currentUser = session.user;
                    AuthSystem.persistSession(session.user, AuthSystem.getToken(), AuthSystem.wasRemembered());
                }
            } catch (error) {
                console.warn('Neuspjesno osvjezavanje sesije, koristim lokalne podatke:', error);
                this.currentUser = this.currentUser || AuthSystem.getCurrentUser();
            }
        }

        if (!this.currentUser) {
            console.error('Dashboard: korisnik nije autentificiran, prekidam.');
            AuthSystem.clearSession();
            window.location.href = 'login.html';
            return;
        }

        console.log('Dashboard ucitan za:', this.currentUser);

        this.setupUserMenu();
        this.setupWelcomeSection();
        this.setupStats();
        this.setupActions();
        this.setupActivity();
        this.setupEventListeners();
    }

    setupWelcomeSection() {
        const titleElement = document.getElementById('welcomeTitle');
        const subtitleElement = document.getElementById('welcomeSubtitle');

        if (!titleElement || !subtitleElement || !this.currentUser) {
            return;
        }

        const hour = new Date().getHours();
        let greeting = 'Dobro jutro';
        if (hour >= 12 && hour < 18) greeting = 'Dobar dan';
        if (hour >= 18) greeting = 'Dobro vece';

        titleElement.textContent = `${greeting}, ${this.currentUser.ime}!`;
        subtitleElement.textContent = this.getWelcomeMessage(this.currentUser.role);
    }

    getWelcomeMessage(role) {
        const messages = {
            'SUPERADMIN': 'Potpuna kontrola nad sistemom je spremna.',
            'ADMIN': 'Pregled aktivnosti i upravljanje korisnicima agencije.',
            'KORISNIK': 'Brz pristup operaterima i tvojim aktivnostima.'
        };
        return messages[role] || 'Dobrodosli nazad u ATLAS.';
    }

    setupUserMenu() {
        if (typeof SharedHeader === "undefined") {
            console.warn('SharedHeader nije dostupan na dashboard stranici.');
            return;
        }

        try {
            SharedHeader.mount();
            SharedHeader.renderHeaderUser(this.currentUser);
        } catch (error) {
            console.error('Greska pri inicijalizaciji SharedHeadera na dashboardu:', error);
        }
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
        if (typeof SharedHeader === "undefined") {
            return;
        }

        SharedHeader.onAction('add-operator', () => {
            window.location.href = "../index.html#add-operator";
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


}

// Initialize dashboard and make it globally accessible
let dashboard;
window.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
    window.dashboard = dashboard; // Make it globally accessible for onclick handlers
});
