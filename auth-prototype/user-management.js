// ================================================
// USER MANAGEMENT JS
// ================================================


class UserManagement {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.filteredUsers = [];
        this.editingUserId = null;
        this.userToDelete = null;
        this.init();
    }

    init() {
        // Provjeri autentikaciju
        if (!AuthSystem.requireAuth()) {
            return;
        }

        this.currentUser = AuthSystem.getCurrentUser();
        
        // Provjeri da li korisnik ima pristup
        if (!this.hasAccess()) {
            alert('Nemate pristup ovoj stranici!');
            window.location.href = 'dashboard.html';
            return;
        }

        // Load users
        this.loadUsers();
        
        // Setup UI
        this.setupUserMenu();
        this.setupStats();
        this.populateAgencyDropdowns();
        this.renderUsersTable();
        this.setupEventListeners();
    }

    hasAccess() {
        // Samo SUPERADMIN i ADMIN mogu pristupiti
        return this.currentUser.role === 'SUPERADMIN' || this.currentUser.role === 'ADMIN';
    }

    loadUsers() {
        // Load from mock data
        this.users = [...MOCK_USERS];
        
        // Ako je ADMIN, filtriraj samo korisnike njegove agencije
        if (this.currentUser.role === 'ADMIN') {
            this.users = this.users.filter(u => 
                u.agencija === this.currentUser.agencija || u.role === 'SUPERADMIN'
            );
        }
        
        this.filteredUsers = [...this.users];
    }

    setupUserMenu() {
        const { ime, prezime, role, agencija_naziv, email } = this.currentUser;
        
        document.querySelector('.user-name').textContent = `${ime} ${prezime}`;
        document.querySelector('.user-role').textContent = this.getRoleDisplay(role);
        document.getElementById('dropdownUserName').textContent = `${ime} ${prezime}`;
        document.getElementById('dropdownUserEmail').textContent = email;
        document.getElementById('dropdownAgency').textContent = agencija_naziv;
        
        // Update page subtitle
        if (role === 'SUPERADMIN') {
            document.getElementById('pageSubtitle').textContent = 
                'Upravljaj svim korisnicima sistema i agencijama';
        } else {
            document.getElementById('pageSubtitle').textContent = 
                `Upravljaj korisnicima agencije: ${agencija_naziv}`;
        }
    }

    setupStats() {
        const total = this.users.length;
        const active = this.users.filter(u => u.aktivan).length;
        const admins = this.users.filter(u => u.role === 'ADMIN' || u.role === 'SUPERADMIN').length;
        const agencies = new Set(this.users.filter(u => u.agencija).map(u => u.agencija)).size;
        
        document.getElementById('totalUsers').textContent = total;
        document.getElementById('activeUsers').textContent = active;
        document.getElementById('adminUsers').textContent = admins;
        document.getElementById('agenciesCount').textContent = agencies;
    }

    populateAgencyDropdowns() {
        const filterAgency = document.getElementById('filterAgency');
        const formAgency = document.getElementById('agencija');
        
        // Group agencies by type
        const groupedAgencies = {
            'državni': [],
            'entitetski': [],
            'brčko': [],
            'kantonalni': []
        };
        
        AGENCIJE.forEach(agency => {
            groupedAgencies[agency.tip].push(agency);
        });
        
        // Create optgroups for BOTH dropdowns separately (prevents duplication)
        ['državni', 'entitetski', 'brčko', 'kantonalni'].forEach(tip => {
            if (groupedAgencies[tip].length > 0) {
                // Create filter dropdown optgroup
                const filterOptgroup = document.createElement('optgroup');
                if (tip === 'državni') {
                    filterOptgroup.label = 'Državni nivo';
                } else if (tip === 'entitetski') {
                    filterOptgroup.label = 'Entitetski nivo';
                } else if (tip === 'brčko') {
                    filterOptgroup.label = 'Policija Brčko distrikta';
                } else {
                    filterOptgroup.label = 'Kantonalni MUP-ovi u Federaciji BiH';
                }
                
                // Create form dropdown optgroup
                const formOptgroup = document.createElement('optgroup');
                formOptgroup.label = filterOptgroup.label;
                
                // Add options to BOTH optgroups
                groupedAgencies[tip].forEach(agency => {
                    const filterOption = document.createElement('option');
                    filterOption.value = agency.id;
                    filterOption.textContent = agency.naziv;
                    filterOptgroup.appendChild(filterOption);
                    
                    const formOption = document.createElement('option');
                    formOption.value = agency.id;
                    formOption.textContent = agency.naziv;
                    formOptgroup.appendChild(formOption);
                });
                
                // Append to respective dropdowns
                filterAgency.appendChild(filterOptgroup);
                if (formAgency) {
                    formAgency.appendChild(formOptgroup);
                }
            }
        });
    }

    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        
        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                        Nema korisnika koji odgovaraju filterima
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.filteredUsers.map(user => this.renderUserRow(user)).join('');
    }

    renderUserRow(user) {
        const initials = `${user.ime[0]}${user.prezime[0]}`.toUpperCase();
        const lastLogin = user.poslednje_logovanje ? 
            new Date(user.poslednje_logovanje).toLocaleString('bs-BA') : 'Nikad';
        
        const canEdit = this.canEditUser(user);
        const canDelete = this.canDeleteUser(user);
        
        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar-small">${initials}</div>
                        <div class="user-info-cell">
                            <span class="user-name-cell">${user.ime} ${user.prezime}</span>
                            <span class="user-username-cell">@${user.username}</span>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role.toLowerCase()}">${this.getRoleDisplay(user.role)}</span>
                </td>
                <td>
                    <small>${user.agencija_naziv}</small>
                </td>
                <td>
                    <span class="status-badge ${user.aktivan ? 'active' : 'inactive'}">
                        <i class="fas fa-circle"></i>
                        ${user.aktivan ? 'Aktivan' : 'Neaktivan'}
                    </span>
                </td>
                <td>
                    <small>${lastLogin}</small>
                </td>
                <td>
                    <div class="action-buttons">
                        ${canEdit ? `
                            <button class="action-btn-small edit" onclick="userManagement.openEditModal(${user.id})" title="Uredi">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        ${canDelete ? `
                            <button class="action-btn-small delete" onclick="userManagement.openDeleteModal(${user.id})" title="Obriši">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    canEditUser(user) {
        if (this.currentUser.role === 'SUPERADMIN') return true;
        if (this.currentUser.role === 'ADMIN') {
            // ADMIN može da edituje samo korisnike svoje agencije (osim SUPERADMIN-a)
            return user.agencija === this.currentUser.agencija && user.role !== 'SUPERADMIN';
        }
        return false;
    }

    canDeleteUser(user) {
        if (this.currentUser.id === user.id) return false; // Ne može da obriše sebe
        if (this.currentUser.role === 'SUPERADMIN') return true;
        if (this.currentUser.role === 'ADMIN') {
            // ADMIN može da obriše samo KORISNIK-e svoje agencije
            return user.agencija === this.currentUser.agencija && user.role === 'KORISNIK';
        }
        return false;
    }

    setupEventListeners() {
        // User menu toggle
        const userMenu = document.querySelector('.user-menu');
        userMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            userMenu.classList.remove('active');
        });

        // Dropdown items
        document.getElementById('myProfileBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            userMenu.classList.remove('active');
            alert('Moj profil - U razvoju\n\nOvdje će biti stranica za uređivanje vašeg profila.');
        });

        document.getElementById('settingsBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            userMenu.classList.remove('active');
            alert('Postavke - U razvoju\n\nOvdje će biti postavke aplikacije.');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Add user button
        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.openAddModal();
        });

        // Filters
        document.getElementById('searchUsers').addEventListener('input', (e) => {
            this.applyFilters();
        });

        document.getElementById('filterRole').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('filterAgency').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('filterStatus').addEventListener('change', () => {
            this.applyFilters();
        });

        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modalOverlay').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submit
        document.getElementById('userForm').addEventListener('submit', (e) => {
            this.handleSubmit(e);
        });

        // Role change handler
        document.getElementById('role').addEventListener('change', (e) => {
            this.handleRoleChange(e.target.value);
        });

        // Password toggle
        document.getElementById('togglePasswordForm').addEventListener('click', () => {
            const input = document.getElementById('password');
            const icon = document.querySelector('#togglePasswordForm i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });

        // Delete modal
        document.getElementById('closeDeleteModal').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('deleteModalOverlay').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
        const roleFilter = document.getElementById('filterRole').value;
        const agencyFilter = document.getElementById('filterAgency').value;
        const statusFilter = document.getElementById('filterStatus').value;
        
        this.filteredUsers = this.users.filter(user => {
            // Search filter
            const matchesSearch = !searchTerm || 
                user.ime.toLowerCase().includes(searchTerm) ||
                user.prezime.toLowerCase().includes(searchTerm) ||
                user.username.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm);
            
            // Role filter
            const matchesRole = !roleFilter || user.role === roleFilter;
            
            // Agency filter
            const matchesAgency = !agencyFilter || user.agencija === agencyFilter;
            
            // Status filter
            const matchesStatus = !statusFilter || user.aktivan.toString() === statusFilter;
            
            return matchesSearch && matchesRole && matchesAgency && matchesStatus;
        });
        
        this.renderUsersTable();
    }

    openAddModal() {
        this.editingUserId = null;
        document.getElementById('modalTitle').textContent = 'Dodaj novog korisnika';
        document.getElementById('submitBtnText').textContent = 'Sačuvaj korisnika';
        
        // Reset form
        document.getElementById('userForm').reset();
        document.getElementById('aktivan').checked = true;
        
        // Show password fields
        document.getElementById('passwordGroup').style.display = 'block';
        document.getElementById('confirmPasswordGroup').style.display = 'block';
        document.getElementById('password').required = true;
        document.getElementById('confirmPassword').required = true;
        
        // Limit roles for ADMIN
        this.setupRoleOptions();
        
        document.getElementById('userModal').classList.add('active');
    }

    openEditModal(userId) {
        this.editingUserId = userId;
        const user = this.users.find(u => u.id === userId);
        
        if (!user) return;
        
        document.getElementById('modalTitle').textContent = 'Uredi korisnika';
        document.getElementById('submitBtnText').textContent = 'Sačuvaj izmjene';
        
        // Fill form
        document.getElementById('ime').value = user.ime;
        document.getElementById('prezime').value = user.prezime;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        document.getElementById('agencija').value = user.agencija || '';
        document.getElementById('aktivan').checked = user.aktivan;
        
        // Hide password fields
        document.getElementById('passwordGroup').style.display = 'none';
        document.getElementById('confirmPasswordGroup').style.display = 'none';
        document.getElementById('password').required = false;
        document.getElementById('confirmPassword').required = false;
        
        this.handleRoleChange(user.role);
        this.setupRoleOptions();
        
        document.getElementById('userModal').classList.add('active');
    }

    setupRoleOptions() {
        const roleSelect = document.getElementById('role');
        const options = roleSelect.querySelectorAll('option');
        
        if (this.currentUser.role === 'ADMIN') {
            // ADMIN ne može kreirati SUPERADMIN-a
            options.forEach(opt => {
                if (opt.value === 'SUPERADMIN') {
                    opt.disabled = true;
                    opt.style.display = 'none';
                }
            });
        }
    }

    handleRoleChange(role) {
        const agencyGroup = document.getElementById('agencyGroup');
        const agencySelect = document.getElementById('agencija');
        const roleHint = document.getElementById('roleHint');
        
        if (role === 'SUPERADMIN') {
            agencyGroup.style.display = 'none';
            agencySelect.required = false;
            roleHint.textContent = '⚠️ Puna kontrola nad sistemom - može upravljati svim korisnicima i agencijama';
        } else if (role === 'ADMIN') {
            agencyGroup.style.display = 'block';
            agencySelect.required = true;
            roleHint.textContent = '👤 Može upravljati korisnicima svoje agencije i dodavati operatere';
        } else if (role === 'KORISNIK') {
            agencyGroup.style.display = 'block';
            agencySelect.required = true;
            roleHint.textContent = '👁️ Samo READ-ONLY pristup podacima operatera';
        } else {
            agencyGroup.style.display = 'none';
            agencySelect.required = false;
            roleHint.textContent = '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            ime: formData.get('ime'),
            prezime: formData.get('prezime'),
            username: formData.get('username'),
            email: formData.get('email'),
            role: formData.get('role'),
            agencija: formData.get('agencija') || null,
            aktivan: formData.get('aktivan') === 'on'
        };
        
        // Validation
        const validation = this.validateUserData(userData, !this.editingUserId);
        if (!validation.valid) {
            this.showFormAlert(validation.message, 'error');
            return;
        }
        
        if (this.editingUserId) {
            this.updateUser(userData);
        } else {
            userData.password = formData.get('password');
            this.createUser(userData);
        }
    }

    validateUserData(data, isNew) {
        // Basic validation
        if (!data.ime || !data.prezime || !data.username || !data.email || !data.role) {
            return { valid: false, message: 'Sva obavezna polja moraju biti popunjena' };
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { valid: false, message: 'Neispravna email adresa' };
        }
        
        // Username uniqueness (osim pri edit-u trenutnog korisnika)
        const usernameExists = this.users.find(u => 
            u.username === data.username && 
            (!this.editingUserId || u.id !== this.editingUserId)
        );
        if (usernameExists) {
            return { valid: false, message: 'Korisničko ime već postoji' };
        }
        
        // Agency validation
        if (data.role !== 'SUPERADMIN' && !data.agencija) {
            return { valid: false, message: 'Morate izabrati agenciju za ovu rolu' };
        }
        
        // Password validation (samo za nove korisnike)
        if (isNew) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password.length < 8) {
                return { valid: false, message: 'Lozinka mora imati minimum 8 karaktera' };
            }
            
            if (!/[A-Z]/.test(password)) {
                return { valid: false, message: 'Lozinka mora sadržavati bar jedno veliko slovo' };
            }
            
            if (!/[0-9]/.test(password)) {
                return { valid: false, message: 'Lozinka mora sadržavati bar jedan broj' };
            }
            
            if (password !== confirmPassword) {
                return { valid: false, message: 'Lozinke se ne poklapaju' };
            }
        }
        
        return { valid: true };
    }

    createUser(userData) {
        // Generate new ID
        const newId = Math.max(...this.users.map(u => u.id)) + 1;
        
        const agencija = AGENCIJE.find(a => a.id === userData.agencija);
        
        const newUser = {
            id: newId,
            ...userData,
            agencija_naziv: agencija ? agencija.naziv : 'Sistem administrator',
            kreiran: new Date().toISOString().split('T')[0],
            poslednje_logovanje: null
        };
        
        this.users.push(newUser);
        MOCK_USERS.push(newUser);
        
        this.showFormAlert('Korisnik uspješno kreiran!', 'success');
        
        setTimeout(() => {
            this.closeModal();
            this.applyFilters();
            this.setupStats();
        }, 1500);
    }

    updateUser(userData) {
        const userIndex = this.users.findIndex(u => u.id === this.editingUserId);
        if (userIndex === -1) return;
        
        const agencija = AGENCIJE.find(a => a.id === userData.agencija);
        
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...userData,
            agencija_naziv: agencija ? agencija.naziv : 'Sistem administrator'
        };
        
        // Update in MOCK_USERS too
        const mockIndex = MOCK_USERS.findIndex(u => u.id === this.editingUserId);
        if (mockIndex !== -1) {
            MOCK_USERS[mockIndex] = this.users[userIndex];
        }
        
        this.showFormAlert('Korisnik uspješno ažuriran!', 'success');
        
        setTimeout(() => {
            this.closeModal();
            this.applyFilters();
            this.setupStats();
        }, 1500);
    }

    openDeleteModal(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.userToDelete = user;
        
        document.getElementById('deleteUserName').textContent = `${user.ime} ${user.prezime}`;
        document.getElementById('deleteUserEmail').textContent = user.email;
        
        document.getElementById('deleteModal').classList.add('active');
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
        this.userToDelete = null;
    }

    confirmDelete() {
        if (!this.userToDelete) return;
        
        // Remove from arrays
        this.users = this.users.filter(u => u.id !== this.userToDelete.id);
        const mockIndex = MOCK_USERS.findIndex(u => u.id === this.userToDelete.id);
        if (mockIndex !== -1) {
            MOCK_USERS.splice(mockIndex, 1);
        }
        
        this.closeDeleteModal();
        this.applyFilters();
        this.setupStats();
        
        // Show notification
        alert(`Korisnik ${this.userToDelete.ime} ${this.userToDelete.prezime} uspješno obrisan!`);
    }

    closeModal() {
        document.getElementById('userModal').classList.remove('active');
        document.getElementById('formAlert').style.display = 'none';
        this.editingUserId = null;
    }

    showFormAlert(message, type) {
        const alert = document.getElementById('formAlert');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'flex';
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
const userManagement = new UserManagement();

// Event listeners for delete modal
document.getElementById('closeDeleteModal').addEventListener('click', () => {
    userManagement.closeDeleteModal();
});

document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    userManagement.closeDeleteModal();
});

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    userManagement.confirmDelete();
});

document.getElementById('deleteModalOverlay').addEventListener('click', () => {
    userManagement.closeDeleteModal();
});
