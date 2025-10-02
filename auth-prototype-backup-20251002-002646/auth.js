// ================================================
// AUTH.JS - Autentikacija logika za prototip
// ================================================

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Provjeri da li je korisnik već logovan (Remember Me)
        this.checkExistingSession();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Test account click-to-fill
        this.setupTestAccountsFill();
    }

    setupTestAccountsFill() {
        const testAccounts = document.querySelectorAll('.test-account');
        testAccounts.forEach(account => {
            account.style.cursor = 'pointer';
            account.addEventListener('click', (e) => {
                const code = e.currentTarget.querySelector('code').textContent;
                const [username, password] = code.split(' / ');
                
                document.getElementById('username').value = username;
                document.getElementById('password').value = password;
                
                // Visual feedback
                e.currentTarget.style.background = '#E0F2FE';
                setTimeout(() => {
                    e.currentTarget.style.background = 'white';
                }, 300);
            });
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validacija
        if (!username || !password) {
            this.showAlert('Molimo unesite korisničko ime i lozinku', 'error');
            return;
        }

        // Mock autentikacija
        const user = getMockUser(username, password);
        
        if (user) {
            this.loginSuccess(user, rememberMe);
        } else {
            this.loginFailed();
        }
    }

    loginSuccess(user, rememberMe) {
        console.log('✅ Login uspješan:', user);
        
        this.currentUser = user;
        
        // Update last login
        user.poslednje_logovanje = new Date().toISOString();
        
        // Generate mock JWT token
        const token = this.generateMockToken(user);
        
        // Save to localStorage/sessionStorage
        if (rememberMe) {
            localStorage.setItem('atlas_auth_token', token);
            localStorage.setItem('atlas_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('atlas_auth_token', token);
            sessionStorage.setItem('atlas_user', JSON.stringify(user));
        }
        
        // Show success message
        this.showAlert(`Dobrodošli, ${user.ime} ${user.prezime}!`, 'success');
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    loginFailed() {
        console.log('❌ Login neuspješan');
        this.showAlert('Pogrešno korisničko ime ili lozinka', 'error');
        
        // Clear password field
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }

    generateMockToken(user) {
        // Mock JWT token (base64 enkodiran JSON)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: user.id,
            username: user.username,
            role: user.role,
            agencija: user.agencija,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
        }));
        const signature = btoa('mock-signature-' + Date.now());
        
        return `${header}.${payload}.${signature}`;
    }

    checkExistingSession() {
        const token = localStorage.getItem('atlas_auth_token') || 
                     sessionStorage.getItem('atlas_auth_token');
        const user = localStorage.getItem('atlas_user') || 
                    sessionStorage.getItem('atlas_user');
        
        if (token && user) {
            try {
                this.currentUser = JSON.parse(user);
                console.log('✅ Postojeća sesija pronađena:', this.currentUser);
                
                // Optional: Redirect to dashboard if already logged in
                // window.location.href = 'dashboard.html';
            } catch (e) {
                console.error('Greška pri parsiranju korisnika:', e);
                this.logout();
            }
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('atlas_auth_token');
        localStorage.removeItem('atlas_user');
        sessionStorage.removeItem('atlas_auth_token');
        sessionStorage.removeItem('atlas_user');
        console.log('🚪 Logout izvršen');
    }

    showAlert(message, type = 'error') {
        const alertDiv = document.getElementById('alertMessage');
        if (!alertDiv) return;
        
        alertDiv.textContent = message;
        alertDiv.className = `alert ${type}`;
        alertDiv.style.display = 'flex';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    }

    // Helper funkcija za provjeru autorizacije (za dashboard)
    static isAuthenticated() {
        const token = localStorage.getItem('atlas_auth_token') || 
                     sessionStorage.getItem('atlas_auth_token');
        return !!token;
    }

    static getCurrentUser() {
        const user = localStorage.getItem('atlas_user') || 
                    sessionStorage.getItem('atlas_user');
        return user ? JSON.parse(user) : null;
    }

    static requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem };
}
