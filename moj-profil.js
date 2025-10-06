// ================================================
// MOJ PROFIL JS - Kompletna implementacija
// ================================================

class MojProfil {
    constructor() {
        this.currentUser = null;
        this.isEditing = false;
        this.init();
    }

    async init() {
        try {
            this.currentUser = await AuthSystem.requireAuth();
        } catch (error) {
            window.location.href = 'login.html';
            return;
        }

        await SharedHeader.init(this.currentUser);
        this.loadProfileData();
        this.setupEventListeners();

        console.log('📄 Moj profil učitan za:', this.currentUser);
    }

    loadProfileData() {
        if (!this.currentUser) return;

        const { ime, prezime, username, email, agencija_naziv, role, kreiran, poslednja_aktivnost } = this.currentUser;

        // Osnovne informacije - koristi postojeće ID-jeve iz HTML-a
        this.setTextContent('profileName', `${ime} ${prezime}`);
        this.setTextContent('profileRole', this.getRoleDisplay(role));
        
        // Input polja (disabled za sada)
        this.setInputValue('firstName', ime);
        this.setInputValue('lastName', prezime);
        this.setInputValue('email', email);
        this.setInputValue('agency', agencija_naziv || 'ATLAS sistem');
    }

    setupEventListeners() {
        console.log('🔧 Postavljam event listenere...');
        
        // Edit profile button
        const editBtn = document.getElementById('editProfileBtn');
        console.log('editBtn:', editBtn);
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                console.log('🔧 Klik na Uredi profil dugme!');
                e.preventDefault();
                this.toggleEditMode();
            });
        } else {
            console.error('❌ editProfileBtn element nije pronađen!');
        }
        
        // Save profile button
        const saveBtn = document.getElementById('saveProfileBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProfile());
        }
        
        // Cancel edit button
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }
        
        // Change password button
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.showChangePasswordModal());
        }
        
        // Change password modal
        this.setupPasswordModal();
    }

    toggleEditMode() {
        console.log('🔄 toggleEditMode pozvan, trenutno isEditing:', this.isEditing);
        this.isEditing = !this.isEditing;
        
        const editBtn = document.getElementById('editProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        
        console.log('Elements found:', { editBtn, saveBtn, cancelBtn, firstName, lastName, email });
        
        if (this.isEditing) {
            console.log('✏️ Ulazim u edit mode');
            // Switch to edit mode
            if (editBtn) editBtn.style.display = 'none';
            if (saveBtn) saveBtn.style.display = 'inline-block';
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
            
            if (firstName) firstName.disabled = false;
            if (lastName) lastName.disabled = false;
            if (email) email.disabled = false;
        } else {
            console.log('👁️ Ulazim u view mode');
            // Switch to view mode
            if (editBtn) editBtn.style.display = 'inline-block';
            if (saveBtn) saveBtn.style.display = 'none';
            if (cancelBtn) cancelBtn.style.display = 'none';
            
            if (firstName) firstName.disabled = true;
            if (lastName) lastName.disabled = true;
            if (email) email.disabled = true;
        }
    }

    async saveProfile() {
        console.log('💾 Čuvam profil...');
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const email = document.getElementById('email')?.value;
        
        if (!firstName || !lastName) {
            this.showNotification('Ime i prezime su obavezni!', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthSystem.getToken()}`
                },
                body: JSON.stringify({
                    ime: firstName,
                    prezime: lastName,
                    email: email
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                this.currentUser = updatedUser;
                this.loadProfileData();
                this.toggleEditMode();
                this.showNotification('Profil je uspešno ažuriran!', 'success');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Greška pri ažuriranju profila', 'error');
        }
    }

    cancelEdit() {
        console.log('❌ Otkazujem edit...');
        this.loadProfileData(); // Reload original data
        this.toggleEditMode();
    }

    showChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear form
            const form = document.getElementById('changePasswordForm');
            if (form) form.reset();
        }
    }

    setupPasswordModal() {
        // Close modal button
        const closeBtn = document.getElementById('closePasswordModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideChangePasswordModal();
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelPasswordBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideChangePasswordModal();
            });
        }

        // Modal overlay click
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            const overlay = modal.querySelector('.modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.hideChangePasswordModal();
                });
            }
        }
        
        // Password toggle buttons
        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // Change password form
        const form = document.getElementById('changePasswordForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }
    }

    async changePassword() {
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Sva polja su obavezna!', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Nova lozinka i potvrda se ne poklapaju!', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            this.showNotification('Nova lozinka mora imati najmanje 8 karaktera!', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthSystem.getToken()}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                this.hideChangePasswordModal();
                this.showNotification('Lozinka je uspešno promenjena!', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.message || 'Greška pri promeni lozinke', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showNotification('Greška pri promeni lozinke', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Helper methods
    setTextContent(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || '';
        }
    }

    getRoleDisplay(role) {
        const roleMap = {
            'SUPERADMIN': 'Super Administrator',
            'ADMIN': 'Administrator',
            'KORISNIK': 'Korisnik'
        };
        return roleMap[role] || role;
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        return new Date(dateString).toLocaleDateString('bs-BA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ================================================
// MFA (Multi-Factor Authentication) Handler
// ================================================

class MfaHandler {
    constructor() {
        this.currentSecret = null;
        this.backupCodes = [];
        this.setupEventListeners();
        this.loadMfaStatus();
    }

    setupEventListeners() {
        // Enable MFA button
        const enableBtn = document.getElementById('enableMfaBtn');
        if (enableBtn) {
            enableBtn.addEventListener('click', () => this.startMfaSetup());
        }

        // Disable MFA button
        const disableBtn = document.getElementById('disableMfaBtn');
        if (disableBtn) {
            disableBtn.addEventListener('click', () => this.showDisableMfaModal());
        }

        // MFA Setup Modal
        this.setupMfaSetupModal();
        this.setupMfaDisableModal();
    }

    async loadMfaStatus() {
        try {
            const user = AuthSystem.getCurrentUser();
            const isMfaRequired = user.role === 'SUPERADMIN' || user.role === 'ADMIN';
            
            // Show/hide MFA required badge
            const mfaRequiredBadge = document.getElementById('mfaRequiredBadge');
            if (mfaRequiredBadge) {
                mfaRequiredBadge.style.display = isMfaRequired ? 'inline-block' : 'none';
            }

            // Update MFA status display
            const mfaEnabled = user.mfa_enabled || false;
            this.updateMfaStatusDisplay(mfaEnabled);

        } catch (error) {
            console.error('Error loading MFA status:', error);
        }
    }

    updateMfaStatusDisplay(enabled) {
        const enabledDiv = document.getElementById('mfaEnabled');
        const disabledDiv = document.getElementById('mfaDisabled');

        if (enabled) {
            if (enabledDiv) enabledDiv.style.display = 'flex';
            if (disabledDiv) disabledDiv.style.display = 'none';
        } else {
            if (enabledDiv) enabledDiv.style.display = 'none';
            if (disabledDiv) disabledDiv.style.display = 'flex';
        }
    }

    async startMfaSetup() {
        try {
            // Use AuthSystem.getToken() instead of localStorage directly
            const token = AuthSystem.getToken();
            console.log('🔍 MFA Setup Debug:', {
                token: token ? token.substring(0, 50) + '...' : null,
                tokenType: typeof token,
                tokenLength: token ? token.length : 0,
                hasAuthSystem: typeof AuthSystem !== 'undefined',
                authSystemToken: typeof AuthSystem !== 'undefined' ? AuthSystem.getToken() : 'N/A'
            });
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await fetch('/api/auth/mfa/setup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'MFA setup failed');
            }

            // Store setup data
            this.currentSecret = data.secret;
            this.backupCodes = data.backupCodes || [];

            // Display QR code
            this.displayQrCode(data.qrCode);
            this.displayManualSecret(data.secret);
            this.displayBackupCodes(data.backupCodes);

            // Show setup modal
            this.showMfaSetupModal();

        } catch (error) {
            console.error('MFA setup error:', error);
            this.showNotification('Greška pri pokretanju MFA setup-a: ' + error.message, 'error');
        }
    }

    displayQrCode(qrCodeDataUrl) {
        const qrDisplay = document.getElementById('qrCodeDisplay');
        if (qrDisplay) {
            qrDisplay.innerHTML = `<img src="${qrCodeDataUrl}" alt="MFA QR Code" />`;
        }
    }

    displayManualSecret(secret) {
        const manualSecret = document.getElementById('manualSecret');
        if (manualSecret) {
            manualSecret.value = secret;
        }

        // Copy button functionality
        const copyBtn = document.getElementById('copySecretBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(secret).then(() => {
                    this.showNotification('Kod je kopiran u clipboard!', 'success');
                }).catch(() => {
                    this.showNotification('Greška pri kopiranju koda', 'error');
                });
            });
        }
    }

    displayBackupCodes(codes) {
        const backupCodesContainer = document.getElementById('backupCodes');
        if (backupCodesContainer && codes) {
            backupCodesContainer.innerHTML = codes.map(code => 
                `<div class="backup-code">${code}</div>`
            ).join('');
        }
    }

    setupMfaSetupModal() {
        const modal = document.getElementById('mfaSetupModal');
        const closeBtn = document.getElementById('closeMfaSetupModal');
        const cancelBtn = document.getElementById('cancelMfaSetupBtn');
        const nextBtn = document.getElementById('nextMfaStepBtn');
        const completeBtn = document.getElementById('completeMfaSetupBtn');

        // Close modal
        [closeBtn, cancelBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.hideMfaSetupModal());
            }
        });

        // Next step
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showMfaVerificationStep());
        }

        // Complete setup
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.completeMfaSetup());
        }

        // Modal overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideMfaSetupModal();
                }
            });
        }
    }

    showMfaSetupModal() {
        const modal = document.getElementById('mfaSetupModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideMfaSetupModal() {
        const modal = document.getElementById('mfaSetupModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset modal state
            document.getElementById('mfaSetupStep1').style.display = 'block';
            document.getElementById('mfaSetupStep2').style.display = 'none';
            document.getElementById('nextMfaStepBtn').style.display = 'inline-block';
            document.getElementById('completeMfaSetupBtn').style.display = 'none';
        }
    }

    showMfaVerificationStep() {
        document.getElementById('mfaSetupStep1').style.display = 'none';
        document.getElementById('mfaSetupStep2').style.display = 'block';
        document.getElementById('nextMfaStepBtn').style.display = 'none';
        document.getElementById('completeMfaSetupBtn').style.display = 'inline-block';
    }

    async completeMfaSetup() {
        try {
            const codeInput = document.getElementById('mfaVerificationCode');
            const code = codeInput.value.trim();

            if (!code || code.length !== 6) {
                this.showNotification('Molimo unesite 6-cifreni kod', 'error');
                return;
            }

            const token = AuthSystem.getToken();
            const response = await fetch('/api/auth/mfa/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: code })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'MFA verification failed');
            }

            // Success
            this.showNotification('MFA je uspješno omogućen!', 'success');
            this.hideMfaSetupModal();
            this.updateMfaStatusDisplay(true);

            // Update user data
            const user = AuthSystem.getCurrentUser();
            user.mfa_enabled = true;
            localStorage.setItem('user_data', JSON.stringify(user));

        } catch (error) {
            console.error('MFA verification error:', error);
            this.showNotification('Greška pri verifikaciji: ' + error.message, 'error');
        }
    }

    setupMfaDisableModal() {
        const modal = document.getElementById('mfaDisableModal');
        const closeBtn = document.getElementById('closeMfaDisableModal');
        const cancelBtn = document.getElementById('cancelMfaDisableBtn');
        const form = document.getElementById('mfaDisableForm');

        // Close modal
        [closeBtn, cancelBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.hideMfaDisableModal());
            }
        });

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.disableMfa();
            });
        }

        // Modal overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideMfaDisableModal();
                }
            });
        }
    }

    showDisableMfaModal() {
        const modal = document.getElementById('mfaDisableModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideMfaDisableModal() {
        const modal = document.getElementById('mfaDisableModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            const form = document.getElementById('mfaDisableForm');
            if (form) form.reset();
        }
    }

    async disableMfa() {
        try {
            const password = document.getElementById('disablePassword').value;
            const mfaCode = document.getElementById('disableMfaCode').value;

            console.log('🔓 Attempting MFA disable...');
            console.log('   Password length:', password?.length);
            console.log('   MFA code:', mfaCode);

            if (!password || !mfaCode) {
                this.showNotification('Molimo popunite sva polja', 'error');
                return;
            }

            const token = AuthSystem.getToken();
            console.log('   Token present:', !!token);

            const requestBody = {
                password: password,
                mfa_token: mfaCode
            };
            console.log('   Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch('/api/auth/mfa/disable', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('   Response status:', response.status, response.statusText);

            const data = await response.json();
            console.log('   Response data:', data);

            if (!response.ok) {
                console.error('❌ MFA disable failed:', data);
                throw new Error(data.error || 'MFA disable failed');
            }

            // Success
            this.showNotification('MFA je uspješno onemogućen', 'success');
            this.hideMfaDisableModal();
            this.updateMfaStatusDisplay(false);

            // Update user data
            const user = AuthSystem.getCurrentUser();
            user.mfa_enabled = false;
            localStorage.setItem('user_data', JSON.stringify(user));

        } catch (error) {
            console.error('MFA disable error:', error);
            this.showNotification('Greška pri onemogućavanju MFA: ' + error.message, 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Reuse existing notification system
        if (window.NotificationSystem) {
            window.NotificationSystem.show(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM je spreman, inicijalizujem MojProfil...');
    new MojProfil();
    
    // Initialize MFA handler
    new MfaHandler();
});