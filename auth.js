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
            
            console.log('🔍 Login result:', result); // DEBUG
            
            // Check if MFA is required
            if (result.mfa_required) {
                console.log('🔐 MFA required, showing prompt...'); // DEBUG
                this.showMfaPrompt(username, password, rememberMe, result.message);
                return;
            }
            
            this.currentUser = result.user;
            this.showAlert(`Dobrodošli, ${result.user.full_name || result.user.username || 'Korisnik'}!`, 'success');

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

    showMfaPrompt(username, password, rememberMe, message) {
        console.log('🔧 Showing MFA prompt, looking for container...'); // DEBUG
        
        // Hide login form and show MFA form
        const loginContainer = document.querySelector('.login-right');
        if (!loginContainer) {
            console.error('❌ .login-right not found!');
            return;
        }
        
        console.log('✅ Found .login-right, replacing content...'); // DEBUG
        
        loginContainer.innerHTML = `
            <div class="login-box">
                <div class="login-header">
                    <h2><i class="fas fa-shield-alt"></i> Sigurnosni kod</h2>
                    <p>Unesite 6-cifreni kod iz vaše authenticator aplikacije</p>
                    ${message ? `<div class="alert alert-info">${message}</div>` : ''}
                </div>
                <form id="mfaForm" class="login-form">
                    <div class="form-group">
                        <label for="mfaCode">
                            <i class="fas fa-mobile-alt"></i>
                            6-cifreni MFA kod
                        </label>
                        <input type="text" 
                               id="mfaCode" 
                               name="mfaCode" 
                               placeholder="123456" 
                               maxlength="6" 
                               pattern="[0-9]{6}" 
                               class="form-control mfa-input" 
                               required 
                               autofocus>
                    </div>
                    <div class="mfa-actions">
                        <button type="submit" id="mfaLoginBtn" class="btn btn-primary btn-lg">
                            <i class="fas fa-sign-in-alt me-2"></i> Prijavi se
                        </button>
                        <button type="button" id="backToLoginBtn" class="btn btn-outline-secondary btn-lg">
                            <i class="fas fa-arrow-left me-2"></i> Nazad na prijavu
                        </button>
                    </div>
                </form>
            </div>
        `;

        console.log('✅ MFA form injected, setting up events...'); // DEBUG

        // Add MFA-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .mfa-input {
                text-align: center !important;
                font-size: 1.5rem !important;
                font-family: 'Courier New', monospace !important;
                letter-spacing: 4px !important;
                font-weight: bold !important;
                padding: 1rem !important;
                border: 2px solid #007bff !important;
                border-radius: 8px !important;
                background: #f8f9fa !important;
            }
            .mfa-input:focus {
                border-color: #0056b3 !important;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                background: white !important;
            }
            .mfa-actions {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            .mfa-actions .btn {
                padding: 0.75rem 2rem !important;
                font-weight: 600 !important;
                border-radius: 8px !important;
                transition: all 0.3s ease !important;
            }
            .mfa-actions .btn-primary {
                background: linear-gradient(135deg, #007bff, #0056b3) !important;
                border: none !important;
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3) !important;
            }
            .mfa-actions .btn-primary:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4) !important;
            }
            .mfa-actions .btn-outline-secondary {
                border: 2px solid #6c757d !important;
                color: #6c757d !important;
                background: transparent !important;
            }
            .mfa-actions .btn-outline-secondary:hover {
                background: #6c757d !important;
                color: white !important;
                transform: translateY(-2px) !important;
            }
            .me-2 {
                margin-right: 0.5rem !important;
            }
            .alert {
                padding: 0.75rem 1rem;
                margin-bottom: 1rem;
                border: 1px solid transparent;
                border-radius: 0.375rem;
            }
            .alert-info {
                color: #055160;
                background-color: #d1ecf1;
                border-color: #b6d4da;
            }
        `;
        document.head.appendChild(style);

        // Setup MFA form listeners
        this.setupMfaForm(username, password, rememberMe);
    }

    setupMfaForm(username, password, rememberMe) {
        const mfaForm = document.getElementById('mfaForm');
        const backBtn = document.getElementById('backToLoginBtn');
        const mfaInput = document.getElementById('mfaCode');

        // Auto-format MFA input (numbers only)
        mfaInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        // MFA form submission
        mfaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mfaCode = document.getElementById('mfaCode').value.trim();
            
            if (mfaCode.length !== 6) {
                this.showAlert('Molimo unesite 6-cifreni kod', 'error');
                return;
            }

            await this.handleMfaLogin(username, password, mfaCode, rememberMe);
        });

        // Back to login
        backBtn.addEventListener('click', () => {
            window.location.reload(); // Simplest way to reset
        });
    }

    async handleMfaLogin(username, password, mfaCode, rememberMe) {
        if (this.isLoading) return;
        this.isLoading = true;

        const submitBtn = document.getElementById('mfaLoginBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifikujem...';
            submitBtn.disabled = true;
        }

        try {
            // Call login with MFA token
            const result = await AuthSystem.login(username, password, rememberMe, mfaCode);
            
            if (result.mfa_required) {
                this.showAlert('Neispravan MFA kod. Pokušajte ponovo.', 'error');
                document.getElementById('mfaCode').value = '';
                document.getElementById('mfaCode').focus();
                return;
            }

            this.currentUser = result.user;
            this.showAlert(`Dobrodošli, ${result.user.full_name || result.user.username || 'Korisnik'}!`, 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);

        } catch (error) {
            console.error('MFA login failed:', error);
            
            // Check if MFA setup is required
            if (error.message.includes('MFA setup je obavezan')) {
                this.showAlert('MFA setup je potreban za administratore. Prijavite se sa korisnicima koji nisu admini da postavite MFA.', 'warning');
                // Redirect back to login
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
                return;
            }
            
            const message = error?.message || 'Neispravan MFA kod';
            this.showAlert(message, 'error');
            document.getElementById('mfaCode').value = '';
            document.getElementById('mfaCode').focus();
        } finally {
            this.isLoading = false;
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Prijavi se';
                submitBtn.disabled = false;
            }
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
            accessToken: 'atlas_auth_access_token',
            refreshToken: 'atlas_auth_refresh_token', // DEPRECATED: Now in httpOnly cookie
            tokenExpiry: 'atlas_auth_token_expiry',
            user: 'atlas_user',
            persistence: 'atlas_auth_storage',
            // Legacy support
            token: 'atlas_auth_token'
        };
    }

    static getToken() {
        const storageStrategy = localStorage.getItem(this.storageKeys.persistence) || 'session';
        const storage = storageStrategy === 'local' ? localStorage : sessionStorage;
        
        // Try new access token first
        const accessToken = storage.getItem(this.storageKeys.accessToken);
        if (accessToken) {
            return accessToken;
        }
        
        // Fall back to legacy token for backward compatibility
        return storage.getItem(this.storageKeys.token) || '';
    }

    static getRefreshToken() {
        // DEPRECATED: refreshToken is now stored in httpOnly cookie
        // This method is kept for backward compatibility only
        console.warn('⚠️ getRefreshToken() is deprecated - refreshToken is now in httpOnly cookie');
        return '';
    }

    static getTokenExpiry() {
        const storageStrategy = localStorage.getItem(this.storageKeys.persistence) || 'session';
        const storage = storageStrategy === 'local' ? localStorage : sessionStorage;
        const expiry = storage.getItem(this.storageKeys.tokenExpiry);
        return expiry ? parseInt(expiry) : null;
    }

    static isTokenNearExpiry(bufferMinutes = 1) {
        const expiry = this.getTokenExpiry();
        if (!expiry) return false;
        return Date.now() >= (expiry - bufferMinutes * 60 * 1000);
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

    static persistSession(user, tokens, rememberMe) {
        const primaryStorage = rememberMe ? localStorage : sessionStorage;
        const secondaryStorage = rememberMe ? sessionStorage : localStorage;

        // Enhance user object to ensure compatibility between Redis sessions and legacy format
        const enhancedUser = { ...user };
        
        // If we have full_name but not ime/prezime (Redis session format), parse it
        if (enhancedUser.full_name && (!enhancedUser.ime || !enhancedUser.prezime)) {
            const fullNameParts = enhancedUser.full_name.trim().split(' ');
            if (fullNameParts.length >= 2) {
                enhancedUser.ime = fullNameParts[0];
                enhancedUser.prezime = fullNameParts.slice(1).join(' ');
            } else if (fullNameParts.length === 1) {
                enhancedUser.ime = fullNameParts[0];
                enhancedUser.prezime = '';
            }
        }
        
        // If we have ime/prezime but not full_name (legacy format), create it
        if (!enhancedUser.full_name && enhancedUser.ime && enhancedUser.prezime) {
            enhancedUser.full_name = `${enhancedUser.ime} ${enhancedUser.prezime}`.trim();
        }

        // Handle both new token format and legacy format
        if (tokens && typeof tokens === 'object' && tokens.accessToken) {
            // New Redis session format (refreshToken is in httpOnly cookie)
            primaryStorage.setItem(this.storageKeys.accessToken, tokens.accessToken);
            primaryStorage.setItem(this.storageKeys.tokenExpiry, Date.now() + tokens.expiresIn * 1000);
            
            // Clear legacy tokens
            primaryStorage.removeItem(this.storageKeys.token);
            primaryStorage.removeItem(this.storageKeys.refreshToken); // No longer stored in localStorage
            secondaryStorage.removeItem(this.storageKeys.token);
            secondaryStorage.removeItem(this.storageKeys.refreshToken);
        } else {
            // Legacy format (single token) - for backward compatibility
            const token = tokens.token || tokens;
            primaryStorage.setItem(this.storageKeys.token, token);
            
            // Clear new format if exists
            primaryStorage.removeItem(this.storageKeys.accessToken);
            primaryStorage.removeItem(this.storageKeys.refreshToken);
            primaryStorage.removeItem(this.storageKeys.tokenExpiry);
        }

        primaryStorage.setItem(this.storageKeys.user, JSON.stringify(enhancedUser));
        localStorage.setItem(this.storageKeys.persistence, rememberMe ? 'local' : 'session');

        // Clean up from secondary storage
        secondaryStorage.removeItem(this.storageKeys.accessToken);
        secondaryStorage.removeItem(this.storageKeys.refreshToken);
        secondaryStorage.removeItem(this.storageKeys.tokenExpiry);
        secondaryStorage.removeItem(this.storageKeys.user);
    }

    static clearSession() {
        [localStorage, sessionStorage].forEach(storage => {
            storage.removeItem(this.storageKeys.accessToken);
            storage.removeItem(this.storageKeys.refreshToken);
            storage.removeItem(this.storageKeys.tokenExpiry);
            storage.removeItem(this.storageKeys.token); // Legacy
            storage.removeItem(this.storageKeys.user);
        });
        localStorage.removeItem(this.storageKeys.persistence);
    }

    static async refreshAccessToken() {
        console.log('🔄 Refreshing access token...');

        // refreshToken is now in httpOnly cookie, no need to send it in body
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include httpOnly cookies
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('❌ Token refresh failed:', error);
            
            // Clear session and redirect to login
            this.clearSession();
            window.location.href = '/login.html';
            throw new Error(error.error || 'Token refresh failed');
        }

        const data = await response.json();
        console.log('✅ Token refreshed successfully');

        // Update accessToken in storage (refreshToken is in httpOnly cookie now)
        const rememberMe = this.wasRemembered();
        const user = this.getStoredUser();
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.storageKeys.accessToken, data.accessToken);
        storage.setItem(this.storageKeys.tokenExpiry, Date.now() + data.expiresIn * 1000);

        return data.accessToken;
    }

    // Authenticated fetch wrapper with auto-refresh
    static async fetchWithAuth(url, options = {}) {
        let token = this.getToken();
        
        // Check if token is near expiry and refresh if needed
        if (this.isTokenNearExpiry()) {
            try {
                token = await this.refreshAccessToken();
            } catch (error) {
                console.error('Auto-refresh failed:', error);
                throw error;
            }
        }

        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Include httpOnly cookies
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        });

        // If we get 401, try to refresh token once
        if (response.status === 401) {
            try {
                console.log('🔄 Received 401, attempting token refresh...');
                token = await this.refreshAccessToken();
                
                // Retry the original request with new token
                return fetch(url, {
                    ...options,
                    credentials: 'include', // Include httpOnly cookies
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Token refresh on 401 failed:', error);
                throw error;
            }
        }

        return response;
    }

    static async login(username, password, rememberMe = false, mfaToken = null) {
        const requestBody = { username, password };
        
        // Add MFA token if provided
        if (mfaToken) {
            requestBody.mfa_token = mfaToken;
        }

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include httpOnly cookies
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Neuspjesna prijava');
        }

        const data = await response.json();
        
        console.log('🔍 Raw server response:', data); // DEBUG
        
        // Check if MFA is required
        if (data.mfa_required) {
            console.log('🔐 Server says MFA required'); // DEBUG
            // Return special response for MFA required
            return {
                mfa_required: true,
                message: data.message || 'MFA kod je potreban'
            };
        }
        
        // Support both new Redis session format and legacy format
        console.log('🔍 Checking token format:', {
            hasAccessToken: !!data.accessToken,
            hasRefreshToken: !!data.refreshToken,
            hasUser: !!data.user,
            hasToken: !!data.token,
            dataKeys: Object.keys(data)
        });
        
        if (data.accessToken && data.user) {
            // New Redis session format (refreshToken is in httpOnly cookie now)
            console.log('✅ Using new Redis session format');
            this.persistSession(data.user, {
                accessToken: data.accessToken,
                expiresIn: data.expiresIn
            }, rememberMe);
            
            // Check if user needs MFA setup
            if (data.user.mfa_setup_required) {
                console.log('⚠️ User needs MFA setup - limited access'); // DEBUG
                // Show notification about limited access
                if (data.message) {
                    console.log('🚨 MFA Setup Required:', data.message); // Simple console notification for now
                }
            }

            // 🔍 AUDIT LOG: Uspješna prijava
            if (typeof AuditLogger !== 'undefined') {
                await AuditLogger.logLogin(username).catch(err => 
                    console.warn('Audit log failed:', err)
                );
            }
            
            return { user: data.user, accessToken: data.accessToken };
        } else if (data.token && data.user) {
            // Legacy format
            console.log('⚠️ Using legacy token format');
            this.persistSession(data.user, data.token, rememberMe);
            
            // Check if user needs MFA setup
            if (data.user.mfa_setup_required) {
                console.log('⚠️ User needs MFA setup - limited access'); // DEBUG
                // Show notification about limited access
                if (data.message) {
                    console.log('🚨 MFA Setup Required:', data.message); // Simple console notification for now
                }
            }

            // 🔍 AUDIT LOG: Uspješna prijava
            if (typeof AuditLogger !== 'undefined') {
                await AuditLogger.logLogin(username).catch(err => 
                    console.warn('Audit log failed:', err)
                );
            }
            
            return { user: data.user, token: data.token };
        } else {
            console.error('❌ Invalid server response format:', data);
            throw new Error('Nevalidan odgovor servera');
        }
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
                    credentials: 'include', // Include httpOnly cookies for refresh token
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
            credentials: 'include', // Include httpOnly cookies
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

// Auto-refresh timer for Redis sessions
let refreshTimer = null;

function setupTokenRefresh() {
    // Clear existing timer
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }

    refreshTimer = setInterval(async () => {
        // Check if user is logged in and token is near expiry
        const accessToken = AuthSystem.getToken();
        
        // Note: refreshToken is now in httpOnly cookie, not in localStorage
        if (accessToken && AuthSystem.isTokenNearExpiry()) {
            try {
                console.log('🔄 Auto-refreshing token (near expiry)...');
                await AuthSystem.refreshAccessToken();
                console.log('✅ Token auto-refreshed successfully');
            } catch (error) {
                console.error('❌ Auto-refresh failed:', error);
                // User will be redirected to login by refreshAccessToken function
            }
        }
    }, 30000); // Check every 30 seconds
}

// Start auto-refresh when page loads if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = AuthSystem.getToken();
    if (token) {
        setupTokenRefresh();
    }
});

// Also start when user logs in
const originalLogin = AuthSystem.login;
AuthSystem.login = async function(...args) {
    const result = await originalLogin.apply(this, args);
    if (result && !result.mfa_required) {
        setupTokenRefresh();
    }
    return result;
};

// Stop when user logs out
const originalLogout = AuthSystem.logout;
AuthSystem.logout = async function(...args) {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
    return originalLogout.apply(this, args);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem };
}
