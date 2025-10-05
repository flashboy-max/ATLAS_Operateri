// ================================================
// AUTH.JS - Integrisana autentikacija sa backend API-jem
// ================================================

// Frontend Error Tracking System
class ErrorTracker {
    static async logError(error, context = {}) {
        try {
            const errorData = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                context: context
            };

            // Log to console for development
            console.error('Error logged:', errorData);

            // Send to backend if user is authenticated
            const token = AuthSystem.getToken();
            if (token) {
                await fetch('/api/system/log-error', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(errorData)
                }).catch(err => {
                    console.warn('Failed to send error to backend:', err);
                });
            }
        } catch (err) {
            console.error('Failed to log error:', err);
        }
    }

    static setupGlobalErrorHandling() {
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', event => {
            ErrorTracker.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
                type: 'unhandled_promise_rejection',
                reason: event.reason
            });
        });

        // Catch JavaScript errors
        window.addEventListener('error', event => {
            ErrorTracker.logError(event.error || new Error(event.message), {
                type: 'javascript_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
    }
}

// Initialize global error handling
ErrorTracker.setupGlobalErrorHandling();

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.init().catch(error => {
            console.error('AuthSystem init failed:', error);
        });
    }

    async init() {
        await this.checkExistingSession();
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

        this.setupTestAccountsFill();
    }

    setupTestAccountsFill() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (!usernameInput || !passwordInput) {
            return;
        }

        const testAccounts = document.querySelectorAll('.test-account');
        if (!testAccounts || testAccounts.length === 0) {
            return;
        }

        testAccounts.forEach(account => {
            if (!account) {
                return;
            }
            account.style.cursor = 'pointer';
            account.addEventListener('click', (e) => {
                const codeElement = e.currentTarget?.querySelector('code');
                if (!codeElement) {
                    return;
                }
                const [username, password] = codeElement.textContent.split(' / ');

                usernameInput.value = username || '';
                passwordInput.value = password || '';

                if (e.currentTarget) {
                    e.currentTarget.style.background = '#E0F2FE';
                    setTimeout(() => {
                        if (e.currentTarget) {
                            e.currentTarget.style.background = 'white';
                        }
                    }, 300);
                }
            });
        });
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

        if (!passwordInput || !toggleBtn || !icon) return;

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

    async handleLogin(e) {
        e.preventDefault();

        if (this.isLoading) return;
        this.isLoading = true;

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            this.showAlert('Molimo unesite korisnicko ime i lozinku', 'error');
            this.isLoading = false;
            return;
        }

        try {
            const result = await AuthSystem.login(username, password, rememberMe);
            this.currentUser = result.user;
            this.showAlert(`Dobrodosli, ${result.user.ime} ${result.user.prezime}!`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        } catch (error) {
            console.error('Login failed:', error);
            const message = error?.message || 'Pogresno korisnicko ime ili lozinka';
            this.showAlert(message, 'error');
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        } finally {
            this.isLoading = false;
        }
    }

    async checkExistingSession() {
        const token = AuthSystem.getToken();
        if (!token) {
            AuthSystem.clearSession();
            return;
        }

        try {
            const session = await AuthSystem.fetchSession();
            if (session?.user) {
                this.currentUser = session.user;
                AuthSystem.persistSession(session.user, token, AuthSystem.wasRemembered());
                console.log('Postojeca sesija pronadena:', session.user);
            }
        } catch (error) {
            console.warn('Sesija nije validna:', error.message || error);
            AuthSystem.clearSession();
        }
    }

    showAlert(message, type = 'error') {
        const alertDiv = document.getElementById('alertMessage');
        if (!alertDiv) return;

        alertDiv.textContent = message;
        alertDiv.className = `alert ${type}`;
        alertDiv.style.display = 'flex';

        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    }

    logout(options = {}) {
        return AuthSystem.logout(options);
    }

    // --------------------------------------------
    // Static helpers for other modula
    // --------------------------------------------
    static get storageKeys() {
        return {
            token: 'atlas_auth_token',
            user: 'atlas_user',
            persistence: 'atlas_auth_storage'
        };
    }

    static getToken() {
        const storageStrategy = localStorage.getItem(this.storageKeys.persistence) || 'session';
        const storage = storageStrategy === 'local' ? localStorage : sessionStorage;
        return storage.getItem(this.storageKeys.token) || '';
    }

    static wasRemembered() {
        return (localStorage.getItem(this.storageKeys.persistence) || 'session') === 'local';
    }

    static getStoredUser() {
        try {
            const storageStrategy = localStorage.getItem(this.storageKeys.persistence) || 'session';
            const storage = storageStrategy === 'local' ? localStorage : sessionStorage;
            const raw = storage.getItem(this.storageKeys.user);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.warn('Neuspjesno citanje sacuvane sesije:', error);
            return null;
        }
    }

    static persistSession(user, token, rememberMe) {
        const primaryStorage = rememberMe ? localStorage : sessionStorage;
        const secondaryStorage = rememberMe ? sessionStorage : localStorage;

        primaryStorage.setItem(this.storageKeys.token, token);
        primaryStorage.setItem(this.storageKeys.user, JSON.stringify(user));
        localStorage.setItem(this.storageKeys.persistence, rememberMe ? 'local' : 'session');

        secondaryStorage.removeItem(this.storageKeys.token);
        secondaryStorage.removeItem(this.storageKeys.user);
    }

    static clearSession() {
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem(this.storageKeys.token);
            storage.removeItem(this.storageKeys.user);
        });
        localStorage.removeItem(this.storageKeys.persistence);
    }

    static async login(username, password, rememberMe = false) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Neuspjesna prijava');
        }

        const data = await response.json();
        if (!data.token || !data.user) {
            throw new Error('Nevalidan odgovor servera');
        }

        this.persistSession(data.user, data.token, rememberMe);

        // 🔍 AUDIT LOG: Uspješna prijava
        if (typeof AuditLogger !== 'undefined') {
            await AuditLogger.logLogin(username).catch(err => 
                console.warn('Audit log failed:', err)
            );
        }

        return { user: data.user, token: data.token };
    }

    static async fetchSession() {
        const token = this.getToken();
        if (!token) {
            throw new Error('Token ne postoji');
        }

        const response = await fetch('/api/auth/session', {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Sesija nije validna');
        }

        return response.json();
    }

    static async logout({ redirect = true } = {}) {
        const token = this.getToken();

        // 🔍 AUDIT LOG: Odjava prije clearSession
        if (typeof AuditLogger !== 'undefined') {
            await AuditLogger.logLogout().catch(err => 
                console.warn('Audit log failed:', err)
            );
        }

        this.clearSession();

        if (token) {
            try {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: this.getAuthHeaders(token)
                });
            } catch (error) {
                console.warn('Logout API poziv nije uspio:', error);
            }
        }

        if (redirect) {
            window.location.href = 'login.html';
        }
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static getCurrentUser() {
        return this.getStoredUser();
    }

    static async requireAuth({ redirect = true } = {}) {
        if (!this.isAuthenticated()) {
            if (redirect) {
                window.location.href = 'login.html';
            }
            throw new Error('Korisnik nije autentificiran');
        }

        let user = this.getStoredUser();
        if (user) {
            return user;
        }

        try {
            const session = await this.fetchSession();
            if (session?.user) {
                const token = this.getToken();
                this.persistSession(session.user, token, this.wasRemembered());
                return session.user;
            }
        } catch (error) {
            console.warn('requireAuth: fetchSession nije uspio, koristim lokalne podatke', error);
        }

        user = this.getStoredUser();
        if (user) {
            return user;
        }

        this.clearSession();
        if (redirect) {
            window.location.href = 'login.html';
        }
        throw new Error('Sesija nije dostupna');
    }

    static getAuthHeaders(explicitToken) {
        const token = explicitToken || this.getToken();
        return {
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    static async fetchWithAuth(url, options = {}) {
        const headers = {
            ...options.headers,
            ...this.getAuthHeaders()
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.clearSession();
            window.location.href = 'login.html';
            throw new Error('Sesija je istekla');
        }

        return response;
    }
}

const authSystem = new AuthSystem();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem };
}
