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
        try {
            this.currentUser = await AuthSystem.requireAuth();
        } catch (error) {
            console.error('Dashboard: korisnik nije autentificiran, prekidam.', error);
            return;
        }

        await SharedHeader.init(this.currentUser);
        this.setupEventListeners();
        this.setupWelcomeSection();
        this.setupStats();
        this.setupActions();
        await this.setupActivity();
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




    async setupStats() {
        const stats = await this.getStatsForRole(this.currentUser.role);
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

    async getStatsForRole(role) {
        // Fetch dynamic stats from API
        const operatorsCount = await this.fetchOperatorsCount();
        const usersCount = await this.fetchUsersCount();
        
        const baseStats = [
            {
                icon: 'fas fa-building',
                label: 'Ukupno operatera',
                value: operatorsCount.total,
                color: 'primary'
            },
            {
                icon: 'fas fa-check-circle',
                label: 'Aktivni operateri',
                value: operatorsCount.active,
                color: 'success'
            },
            {
                icon: 'fas fa-exclamation-circle',
                label: 'Neaktivni operateri',
                value: operatorsCount.inactive,
                color: 'warning'
            }
        ];

        if (role === 'SUPERADMIN') {
            return [
                ...baseStats,
                {
                    icon: 'fas fa-users',
                    label: 'Ukupno korisnika',
                    value: usersCount.total,
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
                    value: usersCount.agency,
                    color: 'info'
                }
            ];
        }

        return baseStats;
    }

    async fetchOperatorsCount() {
        try {
            // TODO: Replace with actual API call when available
            return {
                total: 31,
                active: 24,
                inactive: 7
            };
        } catch (error) {
            console.warn('Failed to fetch operators count:', error);
            return { total: 31, active: 24, inactive: 7 };
        }
    }

    async fetchUsersCount() {
        try {
            const response = await fetch('/api/auth/users', {
                headers: {
                    'Authorization': `Bearer ${AuthSystem.getToken()}`
                }
            });

            if (response.ok) {
                const users = await response.json();
                const total = users.length;
                
                // For ADMIN, count is already filtered by backend
                // For SUPERADMIN, this represents all users
                return {
                    total: total,
                    agency: total  // For ADMIN this is the same since backend filters
                };
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.warn('Failed to fetch users count:', error);
            // Fallback values
            return {
                total: this.currentUser.role === 'SUPERADMIN' ? 47 : 12,
                agency: 12
            };
        }
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

    async setupActivity() {
        const { role } = this.currentUser;
        
        // Aktivnosti se prikazuju samo za ADMIN i SUPERADMIN
        if (role === 'KORISNIK') {
            document.getElementById('activitySection').style.display = 'none';
            return;
        }

        document.getElementById('activitySection').style.display = 'block';
        
        // Show loading indicator
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '<div class="loading-indicator">📊 Učitavanje aktivnosti...</div>';
        
        try {
            const activities = await this.getRecentActivities(5);
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
        } catch (error) {
            console.error('Error loading activities:', error);
            activityList.innerHTML = '<div class="error-indicator">❌ Greška pri učitavanju aktivnosti</div>';
        }
    }

    async getRecentActivities(limit = 5) {
        try {
            const token = (typeof AuthSystem !== 'undefined' && typeof AuthSystem.getToken === 'function')
                ? AuthSystem.getToken()
                : null;
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch('/api/system/logs', {
                method: 'GET',
                headers
            });

            if (response.ok) {
                const data = await response.json();
                const rawLogs = Array.isArray(data?.logs) ? data.logs : (Array.isArray(data) ? data : []);

                const recentLogs = rawLogs
                    .sort((a, b) => {
                        const dateB = new Date(b.timestamp_iso || b.timestamp || 0);
                        const dateA = new Date(a.timestamp_iso || a.timestamp || 0);
                        return dateB - dateA;
                    })
                    .slice(0, limit);

                return recentLogs.map(log => {
                    const actionCode = (log.action || log.category || log.type || 'SYSTEM').toString().toUpperCase();
                    const icon = this.getActivityIcon(actionCode);
                    const actor = log.user_name || log.username || 'Nepoznat korisnik';
                    
                    // 🔍 Unificiraj action_display - ukloni tehničke detalje
                    let actionText = log.action_display || log.message || actionCode;
                    if (actionText.includes('/api/') || actionText.includes('GET ') || actionText.includes('POST ')) {
                        actionText = this.unifyActionDisplay(actionText, actionCode);
                    }
                    
                    // 🔍 Unificiraj target - ukloni tehničke linkove
                    let target = log.target || '';
                    if (target.includes('/api/') || target.includes('GET ') || target.includes('POST ')) {
                        target = this.unifyApiTarget(target, actionCode);
                    }
                    
                    const targetText = target ? ` — ${target}` : '';

                    return {
                        icon: icon.icon,
                        iconClass: icon.class,
                        text: `${actor}: ${actionText}${targetText}`,
                        time: this.getTimeAgo(log.timestamp_iso || log.timestamp)
                    };
                });
            } else {
                console.warn('Failed to fetch activities from API, using mock data');
                return this.getMockActivities(limit);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            return this.getMockActivities(limit);
        }
    }

    /**
     * Unificiraj tehnički API target u čitljiv format
     */
    unifyApiTarget(target, action) {
        // Ukloni HTTP metode i query parametre
        target = target.replace(/^(GET|POST|PUT|DELETE|PATCH)\s+/i, '');
        target = target.replace(/\?.*$/, ''); // Ukloni ?v=123456
        
        // Mapiranje API endpointa u čitljive nazive
        const apiMappings = {
            '/api/auth/session': 'Sesija',
            '/api/auth/login': 'Prijava',
            '/api/auth/logout': 'Odjava',
            '/api/auth/users': 'Korisnici',
            '/api/system/logs': 'Sistemski logovi',
            '/api/operator': 'Operateri',
            '/api/save-operator': 'Čuvanje operatera',
        };

        // Provjeri direktno mapiranje
        for (const [endpoint, label] of Object.entries(apiMappings)) {
            if (target.includes(endpoint)) {
                return label;
            }
        }

        // Ako je /api/operator/123, izvuci ID
        const operatorMatch = target.match(/\/api\/operator\/(\d+)/);
        if (operatorMatch) {
            return `Operater #${operatorMatch[1]}`;
        }

        // Fallback - ukloni /api/ prefix
        if (target.startsWith('/api/')) {
            target = target.replace('/api/', '').replace(/\//g, ' › ');
        }

        // Ako je još uvijek URL, prikaži kao "Sistemski dogadjaj"
        if (target.startsWith('/') || target.startsWith('http')) {
            return 'Sistemski dogadjaj';
        }

        return target;
    }

    /**
     * Unificiraj action display u čitljiv format
     */
    unifyActionDisplay(actionDisplay, action) {
        // Ako već ima format "Korisnik X kreirao...", ostavi ga
        if (actionDisplay.includes('kreirao') || 
            actionDisplay.includes('ažurirao') || 
            actionDisplay.includes('obrisao') ||
            actionDisplay.includes('prijavio') ||
            actionDisplay.includes('odjavio')) {
            return actionDisplay;
        }

        // Ukloni HTTP metode i query parametre
        actionDisplay = actionDisplay.replace(/^(GET|POST|PUT|DELETE|PATCH)\s+/i, '');
        actionDisplay = actionDisplay.replace(/\?.*$/, '');

        // Mapiranje API poziva u čitljive akcije
        const actionMappings = {
            '/api/auth/session': 'Provjera sesije',
            '/api/auth/login': 'Prijava u sistem',
            '/api/auth/logout': 'Odjava iz sistema',
            '/api/auth/users': 'Pregled korisnika',
            '/api/system/logs': 'Pregled logova',
            '/api/operator': 'Rad sa operaterima',
            '/api/save-operator': 'Čuvanje operatera',
            '/.well-known': 'Browser DevTools',
        };

        // Provjeri direktno mapiranje
        for (const [endpoint, label] of Object.entries(actionMappings)) {
            if (actionDisplay.includes(endpoint)) {
                return label;
            }
        }

        // Ako je /api/operator/123, to je pregled operatera
        if (actionDisplay.match(/\/api\/operator\/\d+/)) {
            return 'Pregled operatera';
        }

        // Fallback na action type
        const actionLabels = {
            'LOGIN': 'Prijava',
            'LOGOUT': 'Odjava',
            'REQUEST': 'HTTP zahtjev',
            'SYSTEM': 'Sistemski dogadjaj',
            'SECURITY': 'Sigurnosni dogadjaj',
        };

        return actionLabels[action] || 'Sistemski dogadjaj';
    }

    getActivityIcon(action) {
        const icons = {
            'LOGIN': { icon: 'fas fa-sign-in-alt', class: 'icon-success' },
            'LOGOUT': { icon: 'fas fa-sign-out-alt', class: 'icon-muted' },
            'CREATE_USER': { icon: 'fas fa-user-plus', class: 'icon-primary' },
            'UPDATE_USER': { icon: 'fas fa-user-edit', class: 'icon-warning' },
            'DELETE_USER': { icon: 'fas fa-user-minus', class: 'icon-danger' },
            'CREATE_OPERATOR': { icon: 'fas fa-plus-circle', class: 'icon-primary' },
            'OPERATOR_CREATE': { icon: 'fas fa-plus-circle', class: 'icon-primary' },
            'UPDATE_OPERATOR': { icon: 'fas fa-edit', class: 'icon-warning' },
            'OPERATOR_UPDATE': { icon: 'fas fa-edit', class: 'icon-warning' },
            'DELETE_OPERATOR': { icon: 'fas fa-trash-alt', class: 'icon-danger' },
            'OPERATOR_DELETE': { icon: 'fas fa-trash-alt', class: 'icon-danger' },
            'SEARCH': { icon: 'fas fa-search', class: 'icon-info' },
            'EXPORT': { icon: 'fas fa-file-export', class: 'icon-success' },
            'REQUEST': { icon: 'fas fa-globe', class: '' },
            'SYSTEM': { icon: 'fas fa-cog', class: '' },
            'SECURITY': { icon: 'fas fa-shield-alt', class: 'icon-danger' }
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
        if (typeof SharedHeader === 'undefined') {
            window.addEventListener('atlas-shared-header-ready', () => this.setupEventListeners(), { once: true });
            return;
        }

        SharedHeader.onAction('add-operator', () => {
            window.location.href = 'index.html#add-operator';
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
            case 'operators-main':
                // Vodi na glavnu ATLAS aplikaciju (index.html u root folderu)
                window.location.href = 'index.html';
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
