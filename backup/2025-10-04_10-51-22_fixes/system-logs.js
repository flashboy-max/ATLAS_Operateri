// ================================================
// SYSTEM LOGS JS
// ================================================

class SystemLogs {
    constructor() {
        this.currentUser = null;
        this.allLogs = [];
        this.filteredLogs = [];
        this.currentTab = 'all';
        this.currentPage = 1;
        this.logsPerPage = 15;
        this.isLoading = false;

        this.init().catch(error => {
            console.error('SystemLogs init failed:', error);
            AuthSystem.logout();
        });
    }

    async init() {
        try {
            this.currentUser = await AuthSystem.requireAuth();
        } catch (error) {
            return;
        }

        if (this.currentUser.role === 'KORISNIK') {
            this.currentTab = 'my';
            this.hideAllActivitiesTab();
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (tabParam === 'my') {
                this.currentTab = 'my';
            }
        }

        await SharedHeader.init(this.currentUser);
        this.updatePageHeading();

        await this.loadLogs(); // Wait for logs to load before rendering
        this.setupStats();
        this.setupEventListeners();

        if (this.currentTab === 'my') {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.tab === 'my') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            this.updateUserFilterVisibility();
        }

        this.renderLogsTable();
    }

    hideAllActivitiesTab() {
        // Sakrij "Sve aktivnosti" tab za KORISNIK
        const allActivitiesTab = document.querySelector('.tab-btn[data-tab="all"]');
        if (allActivitiesTab) {
            allActivitiesTab.style.display = 'none';
        }
        
        // Promijeni naslov stranice
        document.querySelector('.page-title').innerHTML = `
            <i class="fas fa-user-check"></i>
            Moje aktivnosti
        `;
        document.getElementById('pageSubtitle').textContent = 'Pregled Vaših aktivnosti u sistemu';
    }

    normalizeLog(entry) {
        if (!entry) return null;
        const raw = { ...entry };

        let timestampIso = raw.timestamp_iso || raw.timestamp || null;
        if (timestampIso && typeof timestampIso === 'string' && !timestampIso.includes('T')) {
            timestampIso = `${timestampIso.replace(' ', 'T')}Z`;
        }
        if (!timestampIso) {
            timestampIso = new Date().toISOString();
        }
        const displayTimestamp = timestampIso.replace('T', ' ').replace('Z', '').slice(0, 19);

        const action = (raw.action || raw.category || raw.type || 'SYSTEM').toString().toUpperCase();
        const status = (raw.status || (raw.type === 'error' ? 'FAILED' : 'SUCCESS')).toString().toUpperCase();
        const userName = raw.user_name || raw.username || 'Nepoznat korisnik';
        const userRole = raw.user_role || raw.role || 'SYSTEM';
        const target = raw.target || raw.message || '';
        const ipAddress = raw.ip_address || raw.ip || 'unknown';

        return {
            ...raw,
            timestamp: displayTimestamp,
            timestamp_iso: timestampIso,
            action,
            action_display: raw.action_display || raw.message || action,
            status,
            user_name: userName,
            user_role: userRole,
            target,
            ip_address: ipAddress,
            userId: raw.userId ?? raw.user_id ?? null,
            user_id: raw.userId ?? raw.user_id ?? null,
            message: raw.message || '',
            metadata: raw.metadata || {}
        };
    }

    async loadLogs() {
        this.isLoading = true;
        
        try {
            const token = (typeof AuthSystem !== 'undefined' && typeof AuthSystem.getToken === 'function')
                ? AuthSystem.getToken()
                : null;
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await fetch('/api/system/logs?limit=100', {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                console.log('📊 API Response:', data);
                
                // Check different possible response structures
                let rawLogs = [];
                if (Array.isArray(data?.logs)) {
                    rawLogs = data.logs;
                } else if (Array.isArray(data)) {
                    rawLogs = data;
                } else {
                    console.warn('Unexpected API response structure:', data);
                }
                
                console.log('📊 Raw logs count:', rawLogs.length);
                this.allLogs = rawLogs.map(log => this.normalizeLog(log)).filter(Boolean);
                this.filteredLogs = [...this.allLogs];
                this.totalLogs = data.total ?? this.allLogs.length;
                console.log('📊 Processed logs count:', this.allLogs.length);
            } else {
                console.warn('API responded with error:', response.status);
                throw new Error('Failed to load logs');
            }
        } catch (error) {
            console.error('Error loading logs:', error);
            if (typeof ErrorTracker !== 'undefined') {
                ErrorTracker.logError(error, { context: 'loadLogs' });
            }
            
            // Fallback to mock data
            this.loadMockLogs();
        } finally {
            this.isLoading = false;
        }
    }

    loadMockLogs() {
        // Fallback to mock data if API fails
        let logs = [...SYSTEM_LOGS].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        // 🔒 ROLE-BASED FILTERING for mock data
        if (this.currentUser.role === 'KORISNIK') {
            const currentUserName = `${this.currentUser.ime} ${this.currentUser.prezime}`;
            logs = logs.filter(log => log.user_name === currentUserName);
        } else if (this.currentUser.role === 'ADMIN') {
            const currentAgency = this.currentUser.agencija;
            
            logs = logs.filter(log => {
                const logUser = MOCK_USERS.find(u => 
                    `${u.ime} ${u.prezime}` === log.user_name
                );
                
                return logUser && 
                       logUser.agencija === currentAgency && 
                       logUser.role !== 'SUPERADMIN';
            });
        }
        
        this.allLogs = logs.map(log => this.normalizeLog(log)).filter(Boolean);
        this.filteredLogs = [...this.allLogs];
        this.totalLogs = this.allLogs.length;
    }

    updatePageHeading() {
        if (!this.currentUser) {
            return;
        }

        const { role, agencija_naziv } = this.currentUser;
        const pageTitle = document.querySelector('.page-title');
        const pageSubtitle = document.getElementById('pageSubtitle');

        if (role === 'KORISNIK') {
            return;
        }

        if (role === 'ADMIN') {
            if (pageTitle) {
                pageTitle.innerHTML = `
                    <i class="fas fa-clipboard-list"></i>
                    Sistemski logovi agencije
                `;
            }
            if (pageSubtitle) {
                const agencyLabel = agencija_naziv ? ` ${agencija_naziv}` : '';
                pageSubtitle.textContent = `Pregled aktivnosti korisnika agencije${agencyLabel}`.trim();
            }
        } else {
            if (pageTitle) {
                pageTitle.innerHTML = `
                    <i class="fas fa-clipboard-list"></i>
                    Sistemski logovi
                `;
            }
            if (pageSubtitle) {
                pageSubtitle.textContent = 'Pregled svih aktivnosti u sistemu';
            }
        }
    }

    setupStats() {
        const total = this.allLogs.length;
        const success = this.allLogs.filter(l => l.status === 'SUCCESS').length;
        const failed = this.allLogs.filter(l => l.status === 'FAILED').length;
        
        // Today's logs
        const today = new Date().toISOString().split('T')[0];
        const todayLogs = this.allLogs.filter(l => l.timestamp.startsWith(today)).length;
        
        document.getElementById('totalLogs').textContent = total;
        document.getElementById('successLogs').textContent = success;
        document.getElementById('failedLogs').textContent = failed;
        document.getElementById('todayLogs').textContent = todayLogs;
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.tab;
                this.currentPage = 1;
                this.updateUserFilterVisibility();
                this.applyFilters();
            });
        });

        // Filters
        document.getElementById('searchLogs').addEventListener('input', () => this.applyFilters());
        document.getElementById('filterUser').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterAction').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterPeriod').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterStatus').addEventListener('change', () => this.applyFilters());

        // Export button
        document.getElementById('exportLogsBtn').addEventListener('click', () => this.exportLogs());

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));

        // User dropdown
        const userMenu = document.querySelector('.user-menu');
        // Populate user filter
        this.populateUserFilter();
        this.updateUserFilterVisibility();
    }

    populateUserFilter() {
        const filterUser = document.getElementById('filterUser');
        const uniqueUsers = [...new Set(this.allLogs.map(l => l.user_name))];
        
        uniqueUsers.sort().forEach(userName => {
            const option = document.createElement('option');
            option.value = userName;
            option.textContent = userName;
            filterUser.appendChild(option);
        });
    }

    updateUserFilterVisibility() {
        const filterUserGroup = document.getElementById('filterUser').closest('.filter-group');
        const myActivitiesBanner = document.getElementById('myActivitiesBanner');
        const pageSubtitle = document.getElementById('pageSubtitle');
        
        if (this.currentTab === 'my') {
            // Sakrij filter korisnika kada gledaš samo svoje aktivnosti
            filterUserGroup.style.display = 'none';
            document.getElementById('filterUser').value = ''; // Reset filter
            
            // Prikaži banner sa info o trenutnom korisniku
            myActivitiesBanner.style.display = 'flex';
            document.getElementById('currentUserName').textContent = 
                `${this.currentUser.ime} ${this.currentUser.prezime}`;
            
            // Promijeni subtitle
            pageSubtitle.textContent = 'Pregled Vaših aktivnosti u sistemu';
        } else {
            // Prikaži filter kada gledaš sve aktivnosti
            filterUserGroup.style.display = 'flex';
            myActivitiesBanner.style.display = 'none';
            pageSubtitle.textContent = 'Pregled svih aktivnosti u sistemu';
        }
    }

    applyFilters() {
        let logs = [...this.allLogs];

        // Tab filter (All vs My)
        if (this.currentTab === 'my') {
            logs = logs.filter(l => l.user_name === `${this.currentUser.ime} ${this.currentUser.prezime}`);
        }

        // Search filter
        const search = document.getElementById('searchLogs').value.toLowerCase();
        if (search) {
            logs = logs.filter(l => 
                l.user_name.toLowerCase().includes(search) ||
                l.action_display.toLowerCase().includes(search) ||
                l.target.toLowerCase().includes(search) ||
                l.ip_address.includes(search)
            );
        }

        // User filter
        const filterUser = document.getElementById('filterUser').value;
        if (filterUser) {
            logs = logs.filter(l => l.user_name === filterUser);
        }

        // Action filter
        const filterAction = document.getElementById('filterAction').value;
        if (filterAction) {
            logs = logs.filter(l => l.action === filterAction);
        }

        // Period filter
        const filterPeriod = document.getElementById('filterPeriod').value;
        if (filterPeriod !== 'all') {
            logs = logs.filter(l => this.matchesPeriod(l.timestamp, filterPeriod));
        }

        // Status filter
        const filterStatus = document.getElementById('filterStatus').value;
        if (filterStatus) {
            logs = logs.filter(l => l.status === filterStatus);
        }

        this.filteredLogs = logs;
        this.currentPage = 1;
        this.renderLogsTable();
    }

    matchesPeriod(timestamp, period) {
        const logDate = new Date(timestamp);
        const now = new Date();
        
        switch(period) {
            case 'today':
                return logDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return logDate >= weekAgo;
            case 'month':
                return logDate.getMonth() === now.getMonth() && 
                       logDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    }

    renderLogsTable() {
        const tbody = document.getElementById('logsTableBody');
        
        // Calculate pagination
        const start = (this.currentPage - 1) * this.logsPerPage;
        const end = start + this.logsPerPage;
        const logsToShow = this.filteredLogs.slice(start, end);

        if (logsToShow.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: var(--spacing-xl); color: var(--text-muted);">
                        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: var(--spacing-md); opacity: 0.3;"></i>
                        <p>Nema logova za prikaz</p>
                    </td>
                </tr>
            `;
            this.updatePagination();
            return;
        }

        tbody.innerHTML = logsToShow.map(log => this.createLogRow(log)).join('');
        this.updatePagination();
    }

    createLogRow(log) {
        const [date, time] = log.timestamp.split(' ');
        const actionIcon = this.getActionIcon(log.action);
        const statusClass = log.status === 'SUCCESS' ? 'success' : 'failed';
        const initials = log.user_name.split(' ').map(n => n[0]).join('');

        return `
            <tr>
                <td>
                    <div class="log-time">
                        <span class="log-date">${this.formatDate(date)}</span>
                        <span class="log-hour">${time}</span>
                    </div>
                </td>
                <td>
                    <div class="log-user">
                        <div class="log-user-avatar">${initials}</div>
                        <div class="log-user-info">
                            <span class="log-user-name">${log.user_name}</span>
                            <span class="log-user-role">${this.getRoleDisplay(log.user_role)}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="log-action">
                        <div class="action-icon ${actionIcon.class}">
                            <i class="${actionIcon.icon}"></i>
                        </div>
                        <div class="action-text">
                            <span class="action-type">${log.action_display}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="log-target">${log.target}</div>
                </td>
                <td>
                    <span class="log-ip">${log.ip_address}</span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <i class="fas ${log.status === 'SUCCESS' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                        ${log.status === 'SUCCESS' ? 'Uspješno' : 'Greška'}
                    </span>
                </td>
            </tr>
        `;
    }

    getActionIcon(action) {
        const icons = {
            'LOGIN': { icon: 'fas fa-sign-in-alt', class: 'login' },
            'LOGOUT': { icon: 'fas fa-sign-out-alt', class: 'logout' },
            'CREATE_USER': { icon: 'fas fa-user-plus', class: 'create' },
            'UPDATE_USER': { icon: 'fas fa-user-edit', class: 'update' },
            'DELETE_USER': { icon: 'fas fa-user-minus', class: 'delete' },
            'CREATE_OPERATOR': { icon: 'fas fa-plus-circle', class: 'create' },
            'UPDATE_OPERATOR': { icon: 'fas fa-edit', class: 'update' },
            'DELETE_OPERATOR': { icon: 'fas fa-trash-alt', class: 'delete' },
            'SEARCH': { icon: 'fas fa-search', class: 'search' },
            'EXPORT': { icon: 'fas fa-file-export', class: 'export' }
        };
        return icons[action] || { icon: 'fas fa-info-circle', class: 'info' };
    }

    formatDate(dateStr) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
        const [year, month, day] = dateStr.split('-');
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredLogs.length / this.logsPerPage);
        
        // Update buttons
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Update page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        pageNumbers.innerHTML = '';
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.appendChild(this.createPageButton(i));
            }
        } else {
            // Show first, last, and pages around current
            pageNumbers.appendChild(this.createPageButton(1));
            
            if (this.currentPage > 3) {
                pageNumbers.innerHTML += '<span style="padding: 0 8px;">...</span>';
            }
            
            for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(totalPages - 1, this.currentPage + 1); i++) {
                pageNumbers.appendChild(this.createPageButton(i));
            }
            
            if (this.currentPage < totalPages - 2) {
                pageNumbers.innerHTML += '<span style="padding: 0 8px;">...</span>';
            }
            
            pageNumbers.appendChild(this.createPageButton(totalPages));
        }
    }

    createPageButton(pageNum) {
        const btn = document.createElement('div');
        btn.className = 'page-num';
        if (pageNum === this.currentPage) {
            btn.classList.add('active');
        }
        btn.textContent = pageNum;
        btn.addEventListener('click', () => {
            this.currentPage = pageNum;
            this.renderLogsTable();
        });
        return btn;
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredLogs.length / this.logsPerPage);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderLogsTable();
        }
    }

    exportLogs() {
        // Simple CSV export
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        alert('Logovi uspješno eksportovani!');
    }

    generateCSV() {
        const headers = ['Vrijeme', 'Korisnik', 'Rola', 'Akcija', 'Cilj', 'IP Adresa', 'Status'];
        const rows = this.filteredLogs.map(log => [
            log.timestamp,
            log.user_name,
            log.user_role,
            log.action_display,
            log.target,
            log.ip_address,
            log.status
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        return csvContent;
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
let systemLogs;
window.addEventListener('DOMContentLoaded', () => {
    systemLogs = new SystemLogs();
    window.systemLogs = systemLogs;
});
