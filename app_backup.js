// ATLAS Telekomunikacioni Operateri BiH - Aplikacija
// Version: 1.0
// Date: 2025-07-31

class ATLASApp {
    constructor() {
        this.operators = [];
        this.filteredOperators = [];
        this.currentEditId = null;
        this.storageKey = 'atlas_operators_data';
        
        // DOM Elements
        this.elements = {
            // Statistics
            totalOperators: document.getElementById('totalOperators'),
            activeOperators: document.getElementById('activeOperators'),
            inactiveOperators: document.getElementById('inactiveOperators'),
            highPriorityOperators: document.getElementById('highPriorityOperators'),
            
            // Table
            operatorsTableBody: document.getElementById('operatorsTableBody'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            noResults: document.getElementById('noResults'),
            
            // Search and Filters
            searchInput: document.getElementById('searchInput'),
            statusFilter: document.getElementById('statusFilter'),
            typeFilter: document.getElementById('typeFilter'),
            
            // Modal
            operatorModal: document.getElementById('operatorModal'),
            modalOverlay: document.getElementById('modalOverlay'),
            modalTitle: document.getElementById('modalTitle'),
            operatorForm: document.getElementById('operatorForm'),
            
            // Buttons
            addOperatorBtn: document.getElementById('addOperatorBtn'),
            closeModal: document.getElementById('closeModal'),
            cancelBtn: document.getElementById('cancelBtn'),
            saveBtn: document.getElementById('saveBtn'),
            exportDataBtn: document.getElementById('exportDataBtn'),
            importDataBtn: document.getElementById('importDataBtn'),
            fileImportInput: document.getElementById('fileImportInput'),
            
            // Help Modal
            helpBtn: document.getElementById('helpBtn'),
            helpModal: document.getElementById('helpModal'),
            closeHelpModal: document.getElementById('closeHelpModal'),
            closeHelpModalBtn: document.getElementById('closeHelpModalBtn')
        };
        
        this.init();
    }
    
    async init() {
        try {
            this.showLoading(true);
            await this.loadData();
            this.setupEventListeners();
            this.renderOperators();
            this.updateStatistics();
            this.showLoading(false);
            console.log('ATLAS aplikacija uspešno pokrenuta');
        } catch (error) {
            console.error('Greška pri pokretanju aplikacije:', error);
            this.showLoading(false);
            this.showNotification('Greška pri učitavanju podataka', 'error');
        }
    }
    
    async loadData() {
        // Pokušaj učitavanje iz LocalStorage
        const savedData = localStorage.getItem(this.storageKey);
        
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.operators = parsedData.operateri || [];
                console.log('Podaci učitani iz LocalStorage:', this.operators.length, 'operatera');
                return;
            } catch (error) {
                console.warn('Greška pri parsiranju LocalStorage podataka:', error);
            }
        }
        
        // Ako nema podataka u LocalStorage, učitaj iz JSON fajla
        try {
            const response = await fetch('./operateri.json');
            if (!response.ok) {
                throw new Error('Nije moguće učitati operateri.json');
            }
            const data = await response.json();
            this.operators = data.operateri || [];
            this.saveToLocalStorage();
            console.log('Podaci učitani iz JSON fajla:', this.operators.length, 'operatera');
        } catch (error) {
            console.error('Greška pri učitavanju JSON fajla:', error);
            // Koristiti demo podatke ako se ne može učitati fajl
            this.operators = this.getDemoData();
            this.saveToLocalStorage();
            console.log('Koriste se demo podaci');
        }
    }
    
    saveToLocalStorage() {
        try {
            const dataToSave = {
                operateri: this.operators,
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    version: '1.0'
                }
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            console.log('Podaci sačuvani u LocalStorage');
        } catch (error) {
            console.error('Greška pri čuvanju u LocalStorage:', error);
            this.showNotification('Greška pri čuvanju podataka', 'error');
        }
    }
    
    setupEventListeners() {
        // Search and Filter
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.elements.statusFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        this.elements.typeFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        // Modal Controls
        this.elements.addOperatorBtn.addEventListener('click', () => {
            this.openModal('add');
        });
        
        this.elements.closeModal.addEventListener('click', () => {
            this.closeModal();
        });
        
        this.elements.cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        this.elements.modalOverlay.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Form Submission
        this.elements.operatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
        
        // Export Data
        this.elements.exportDataBtn.addEventListener('click', () => {
            this.exportData();
        });
        
        // Import Data
        this.elements.importDataBtn.addEventListener('click', () => {
            this.elements.fileImportInput.click();
        });
        
        this.elements.fileImportInput.addEventListener('change', (e) => {
            this.handleFileImport(e);
        });
        
        // Help Modal
        this.elements.helpBtn.addEventListener('click', () => {
            this.openHelpModal();
        });
        
        this.elements.closeHelpModal.addEventListener('click', () => {
            this.closeHelpModal();
        });
        
        this.elements.closeHelpModalBtn.addEventListener('click', () => {
            this.closeHelpModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.elements.searchInput.focus();
            }
        });
    }
    
    showLoading(show) {
        this.elements.loadingIndicator.style.display = show ? 'block' : 'none';
        this.elements.operatorsTableBody.style.display = show ? 'none' : '';
    }
    
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term === '') {
            this.filteredOperators = [...this.operators];
        } else {
            this.filteredOperators = this.operators.filter(operator => {
                return (
                    operator.naziv.toLowerCase().includes(term) ||
                    (operator.komercijalni_naziv && operator.komercijalni_naziv.toLowerCase().includes(term)) ||
                    operator.tip.toLowerCase().includes(term) ||
                    operator.adresa.toLowerCase().includes(term) ||
                    operator.email.toLowerCase().includes(term) ||
                    operator.kontakt_osoba.toLowerCase().includes(term)
                );
            });
        }
        
        this.applyFilters();
    }
    
    applyFilters() {
        let filtered = this.filteredOperators.length > 0 ? [...this.filteredOperators] : [...this.operators];
        
        // Status filter
        const statusFilter = this.elements.statusFilter.value;
        if (statusFilter) {
            filtered = filtered.filter(op => op.status === statusFilter);
        }
        
        // Type filter
        const typeFilter = this.elements.typeFilter.value;
        if (typeFilter) {
            const categories = {
                'dominantni': ['BH Telecom', 'HT Eronet', 'm:tel'],
                'mobilni_mvno': ['ONE', 'Zona.ba', 'haloo', 'Novotel', 'Logosoft'],
                'regionalni_isp': ['Telemach', 'ADRIA NET', 'Miss.Net'],
                'enterprise_b2b': ['AKTON', 'LANACO']
            };
            
            if (categories[typeFilter]) {
                filtered = filtered.filter(op => 
                    categories[typeFilter].some(cat => 
                        op.komercijalni_naziv.includes(cat) || op.naziv.includes(cat)
                    )
                );
            }
        }
        
        this.renderOperators(filtered);
    }
    
    renderOperators(operatorsToRender = null) {
        const operators = operatorsToRender || this.operators;
        const tbody = this.elements.operatorsTableBody;
        
        if (operators.length === 0) {
            this.elements.noResults.style.display = 'block';
            tbody.innerHTML = '';
            return;
        }
        
        this.elements.noResults.style.display = 'none';
        
        tbody.innerHTML = operators.map(operator => `
            <tr class="fade-in operator-row" data-id="${operator.id}" onclick="app.toggleOperatorDetails(${operator.id})">
                <td>
                    <div>
                        <strong>${operator.naziv}</strong>
                        ${operator.komercijalni_naziv ? `<br><small style="color: #64748b;">${operator.komercijalni_naziv}</small>` : ''}
                        <span class="expand-indicator">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </div>
                </td>
                <td>
                    <span class="type-badge">${this.truncateText(operator.tip, 30)}</span>
                </td>
                <td>
                    <span class="status-badge status-${operator.status}">${operator.status}</span>
                </td>
                <td>
                    <span class="atlas-status ${this.getAtlasStatusClass(operator.atlas_status)}">${this.truncateText(operator.atlas_status, 20)}</span>
                </td>
                <td>
                    <span class="priority-badge priority-${operator.prioritet}">${operator.prioritet}</span>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${operator.kompletnost || 0}%"></div>
                    </div>
                    <small>${operator.kompletnost || 0}%</small>
                </td>
                <td>
                    <div style="font-size: 12px;">
                        ${operator.telefon ? `<div><i class="fas fa-phone"></i> ${operator.telefon}</div>` : ''}
                        ${operator.email ? `<div><i class="fas fa-envelope"></i> ${this.truncateText(operator.email, 20)}</div>` : ''}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="event.stopPropagation(); app.viewOperator(${operator.id})" title="Pogledaj detalje">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="event.stopPropagation(); app.editOperator(${operator.id})" title="Uredi">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); app.deleteOperator(${operator.id})" title="Obriši">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
            <tr class="operator-details" id="details-${operator.id}">
                <td colspan="8">
                    <div class="operator-details-content">
                        ${this.generateOperatorDetails(operator)}
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    updateStatistics() {
        const total = this.operators.length;
        const active = this.operators.filter(op => op.status === 'aktivan').length;
        const inactive = total - active;
        const highPriority = this.operators.filter(op => op.prioritet === 'visok').length;
        
        this.elements.totalOperators.textContent = total;
        this.elements.activeOperators.textContent = active;
        this.elements.inactiveOperators.textContent = inactive;
        this.elements.highPriorityOperators.textContent = highPriority;
    }
    
    openModal(mode, operatorId = null) {
        this.currentEditId = operatorId;
        
        if (mode === 'add') {
            this.elements.modalTitle.textContent = 'Dodaj Novog Operatera';
            this.elements.operatorForm.reset();
        } else if (mode === 'edit' && operatorId) {
            this.elements.modalTitle.textContent = 'Uredi Operatera';
            const operator = this.operators.find(op => op.id === operatorId);
            if (operator) {
                this.populateForm(operator);
            }
        }
        
        this.elements.operatorModal.classList.add('active');
        this.elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.elements.operatorModal.classList.remove('active');
        this.elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditId = null;
        this.elements.operatorForm.reset();
    }
    
    populateForm(operator) {
        const form = this.elements.operatorForm;
        form.elements.naziv.value = operator.naziv || '';
        form.elements.komercijalni_naziv.value = operator.komercijalni_naziv || '';
        form.elements.kategorija.value = operator.kategorija || '';
        form.elements.tip.value = operator.tip || '';
        form.elements.status.value = operator.status || '';
        form.elements.opis.value = operator.opis || '';
        form.elements.adresa.value = operator.adresa || '';
        form.elements.telefon.value = operator.telefon || '';
        form.elements.email.value = operator.email || '';
        form.elements.web.value = operator.web || '';
        form.elements.atlas_status.value = operator.atlas_status || '';
        form.elements.prioritet.value = operator.prioritet || '';
        form.elements.kompletnost.value = operator.kompletnost || 0;
        form.elements.kontakt_osoba.value = operator.kontakt_osoba || '';
    }
    
    handleFormSubmit() {
        const form = this.elements.operatorForm;
        const formData = new FormData(form);
        
        // Validate form data
        const validation = this.validateFormData(formData);
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        const operatorData = {
            naziv: formData.get('naziv').trim(),
            komercijalni_naziv: formData.get('komercijalni_naziv').trim(),
            kategorija: formData.get('kategorija'),
            tip: formData.get('tip'),
            status: formData.get('status'),
            opis: formData.get('opis').trim(),
            adresa: formData.get('adresa').trim(),
            telefon: formData.get('telefon').trim(),
            email: formData.get('email').trim(),
            web: formData.get('web').trim(),
            atlas_status: formData.get('atlas_status'),
            prioritet: formData.get('prioritet'),
            kompletnost: parseInt(formData.get('kompletnost')) || this.calculateCompleteness(formData),
            kontakt_osoba: formData.get('kontakt_osoba').trim(),
            datum_azuriranja: new Date().toISOString().split('T')[0]
        };
        
        if (this.currentEditId) {
            this.updateOperator(this.currentEditId, operatorData);
        } else {
            this.addOperator(operatorData);
        }
    }
    
    validateFormData(formData) {
        const errors = [];
        
        // Required fields
        const naziv = formData.get('naziv').trim();
        if (!naziv) {
            errors.push({ field: 'naziv', message: 'Naziv operatera je obavezan' });
        }
        
        const kategorija = formData.get('kategorija');
        if (!kategorija) {
            errors.push({ field: 'kategorija', message: 'Kategorija operatera je obavezna' });
        }
        
        const tip = formData.get('tip');
        if (!tip) {
            errors.push({ field: 'tip', message: 'Tip operatera je obavezan' });
        }
        
        const status = formData.get('status');
        if (!status) {
            errors.push({ field: 'status', message: 'Status operatera je obavezan' });
        }
        
        // Email validation
        const email = formData.get('email').trim();
        if (email && !this.isValidEmail(email)) {
            errors.push({ field: 'email', message: 'Email adresa nije ispravna' });
        }
        
        // URL validation
        const web = formData.get('web').trim();
        if (web && !this.isValidUrl(web)) {
            errors.push({ field: 'web', message: 'Web adresa nije ispravna' });
        }
        
        // Phone validation
        const telefon = formData.get('telefon').trim();
        if (telefon && !this.isValidPhone(telefon)) {
            errors.push({ field: 'telefon', message: 'Broj telefona nije ispravan' });
        }
        
        // Category-Type consistency check
        if (kategorija && tip && !this.isCategoryTypeConsistent(kategorija, tip)) {
            errors.push({
                field: 'tip',
                message: 'Tip operatera nije konzistentan sa izabranom kategorijom'
            });
        }
        
        // Completeness validation
        const kompletnost = parseInt(formData.get('kompletnost'));
        if (kompletnost && (kompletnost < 0 || kompletnost > 100)) {
            errors.push({ field: 'kompletnost', message: 'Kompletnost mora biti između 0 i 100%' });
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidUrl(url) {
        try {
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    isValidPhone(phone) {
        // BiH phone number patterns
        const phoneRegex = /^(\+387|387|0)(3[0-9]|6[0-9]|5[0-9]|4[0-9]|7[0-9])\s?\d{3}\s?\d{3,4}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }
    
    isCategoryTypeConsistent(kategorija, tip) {
        const categoryTypeMap = {
            'dominantni': ['Dominantni operater'],
            'mobilni_mvno': ['Mobilni operater', 'MVNO operater'],
            'regionalni_isp': ['Internet servis provajder', 'Kablovski operater'],
            'enterprise_b2b': ['B2B provajder', 'IT provajder']
        };
        
        return categoryTypeMap[kategorija] && categoryTypeMap[kategorija].includes(tip);
    }
    
    showValidationErrors(errors) {
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.remove());
        document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));
        
        // Show new errors
        errors.forEach(error => {
            const field = document.getElementById(error.field);
            if (field) {
                const formGroup = field.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                    
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'form-error';
                    errorDiv.textContent = error.message;
                    formGroup.appendChild(errorDiv);
                }
            }
        });
        
        this.showNotification('Molimo ispravite greške u formi', 'error');
    }
    
    calculateCompleteness(formData) {
        const requiredFields = ['naziv', 'tip', 'status'];
        const optionalFields = ['komercijalni_naziv', 'opis', 'adresa', 'telefon', 'email', 'web', 'kontakt_osoba'];
        
        let filledRequired = 0;
        let filledOptional = 0;
        
        requiredFields.forEach(field => {
            if (formData.get(field) && formData.get(field).trim()) {
                filledRequired++;
            }
        });
        
        optionalFields.forEach(field => {
            if (formData.get(field) && formData.get(field).trim()) {
                filledOptional++;
            }
        });
        
        // Required fields are worth 60%, optional fields 40%
        const requiredPercentage = (filledRequired / requiredFields.length) * 60;
        const optionalPercentage = (filledOptional / optionalFields.length) * 40;
        
        return Math.round(requiredPercentage + optionalPercentage);
    }
    
    addOperator(operatorData) {
        const newId = Math.max(...this.operators.map(op => op.id), 0) + 1;
        const newOperator = {
            id: newId,
            ...operatorData,
            usluge: [],
            tehnologije: []
        };
        
        this.operators.push(newOperator);
        this.saveToLocalStorage();
        this.renderOperators();
        this.updateStatistics();
        this.closeModal();
        this.showNotification('Operater je uspešno dodat!', 'success');
    }
    
    updateOperator(id, operatorData) {
        const index = this.operators.findIndex(op => op.id === id);
        if (index !== -1) {
            this.operators[index] = {
                ...this.operators[index],
                ...operatorData
            };
            this.saveToLocalStorage();
            this.renderOperators();
            this.updateStatistics();
            this.closeModal();
            this.showNotification('Operater je uspešno ažuriran!', 'success');
        }
    }
    
    editOperator(id) {
        this.openModal('edit', id);
    }
    
    viewOperator(id) {
        const operator = this.operators.find(op => op.id === id);
        if (operator) {
            this.showOperatorDetails(operator);
        }
    }
    
    toggleOperatorDetails(id) {
        const operatorRow = document.querySelector(`tr[data-id="${id}"]`);
        const detailsRow = document.getElementById(`details-${id}`);
        
        if (!operatorRow || !detailsRow) return;
        
        const isExpanded = operatorRow.classList.contains('expanded');
        
        // Zatvori sve druge expandable redove
        document.querySelectorAll('.operator-row.expanded').forEach(row => {
            if (row !== operatorRow) {
                row.classList.remove('expanded');
                const otherId = row.getAttribute('data-id');
                const otherDetails = document.getElementById(`details-${otherId}`);
                if (otherDetails) {
                    otherDetails.classList.remove('active');
                }
            }
        });
        
        // Toggle trenutni red
        if (isExpanded) {
            operatorRow.classList.remove('expanded');
            detailsRow.classList.remove('active');
        } else {
            operatorRow.classList.add('expanded');
            detailsRow.classList.add('active');
        }
    }
    
    generateOperatorDetails(operator) {
        const services = this.formatServicesList(operator.usluge);
        const technologies = this.formatTechnologiesList(operator.tehnologije);
        
        return `
            <div class="details-grid">
                <div class="details-section">
                    <h4><i class="fas fa-info-circle"></i> Osnovne Informacije</h4>
                    <div class="detail-item">
                        <span class="detail-label">Naziv:</span>
                        <span class="detail-value">${operator.naziv}</span>
                    </div>
                    ${operator.komercijalni_naziv ? `
                    <div class="detail-item">
                        <span class="detail-label">Komercijalni:</span>
                        <span class="detail-value">${operator.komercijalni_naziv}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">Tip:</span>
                        <span class="detail-value">${operator.tip}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge status-${operator.status}">${operator.status}</span>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">ATLAS Status:</span>
                        <span class="detail-value">
                            <span class="atlas-status ${this.getAtlasStatusClass(operator.atlas_status)}">${operator.atlas_status}</span>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Prioritet:</span>
                        <span class="detail-value">
                            <span class="priority-badge priority-${operator.prioritet}">${operator.prioritet}</span>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Kompletnost:</span>
                        <span class="detail-value">
                            <div class="progress-bar" style="width: 80px; display: inline-block;">
                                <div class="progress-fill" style="width: ${operator.kompletnost || 0}%"></div>
                            </div>
                            ${operator.kompletnost || 0}%
                        </span>
                    </div>
                </div>

                <div class="details-section">
                    <h4><i class="fas fa-address-book"></i> Kontakt Informacije</h4>
                    ${operator.adresa ? `
                    <div class="detail-item">
                        <span class="detail-label">Adresa:</span>
                        <span class="detail-value">${operator.adresa}</span>
                    </div>
                    ` : ''}
                    ${operator.telefon ? `
                    <div class="detail-item">
                        <span class="detail-label">Telefon:</span>
                        <span class="detail-value">
                            <a href="tel:${operator.telefon}" style="color: #3b82f6; text-decoration: none;">
                                <i class="fas fa-phone"></i> ${operator.telefon}
                            </a>
                        </span>
                    </div>
                    ` : ''}
                    ${operator.email ? `
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">
                            <a href="mailto:${operator.email}" style="color: #3b82f6; text-decoration: none;">
                                <i class="fas fa-envelope"></i> ${operator.email}
                            </a>
                        </span>
                    </div>
                    ` : ''}
                    ${operator.web ? `
                    <div class="detail-item">
                        <span class="detail-label">Website:</span>
                        <span class="detail-value">
                            <a href="${operator.web}" target="_blank" style="color: #3b82f6; text-decoration: none;">
                                <i class="fas fa-external-link-alt"></i> ${operator.web}
                            </a>
                        </span>
                    </div>
                    ` : ''}
                    ${operator.kontakt_osoba ? `
                    <div class="detail-item">
                        <span class="detail-label">Kontakt osoba:</span>
                        <span class="detail-value">${operator.kontakt_osoba}</span>
                    </div>
                    ` : ''}
                    ${operator.datum_azuriranja ? `
                    <div class="detail-item">
                        <span class="detail-label">Poslednje ažuriranje:</span>
                        <span class="detail-value">${operator.datum_azuriranja}</span>
                    </div>
                    ` : ''}
                </div>

                ${operator.opis ? `
                <div class="details-section" style="grid-column: 1 / -1;">
                    <h4><i class="fas fa-file-alt"></i> Opis Organizacije</h4>
                    <p style="margin: 0; line-height: 1.6;">${operator.opis}</p>
                </div>
                ` : ''}

                ${services ? `
                <div class="details-section">
                    <h4><i class="fas fa-concierge-bell"></i> Usluge</h4>
                    <div class="service-tags">
                        ${services}
                    </div>
                </div>
                ` : ''}

                ${technologies ? `
                <div class="details-section">
                    <h4><i class="fas fa-microchip"></i> Tehnologije</h4>
                    <div class="tech-tags">
                        ${technologies}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    formatServicesList(services) {
        if (!services || !Array.isArray(services) || services.length === 0) {
            return null;
        }
        
        const serviceNames = {
            'mobile_prepaid': 'Mobilni Prepaid',
            'mobile_postpaid': 'Mobilni Postpaid',
            'mobile_esim': 'eSIM',
            'mobile_roaming': 'Roaming',
            'mobile_mnp': 'Prenos broja',
            'fixed_pstn': 'Fiksna telefonija (PSTN)',
            'fixed_voip': 'VoIP telefonija',
            'internet_ftth': 'Optički internet (FTTH)',
            'internet_cable': 'Kablovski internet',
            'internet_satellite': 'Satelitski internet',
            'internet_fixed_wireless': 'Bežični internet',
            'internet_business': 'Poslovni internet',
            'internet_mobile': 'Mobilni internet',
            'iptv': 'IPTV',
            'cable_tv': 'Kablovska TV',
            'sat_tv': 'Satelitska TV',
            'multiplex_d': 'DVB-T multipleks',
            'cloud_hosting': 'Cloud hosting',
            'cloud_services': 'Cloud usluge',
            'data_center': 'Data centar',
            'colocation': 'Kolokacija',
            'data_transfer': 'Prenos podataka',
            'sms_gateway': 'SMS Gateway',
            'smart_city': 'Pametni grad',
            'system_integration': 'Sistemska integracija',
            'cybersecurity': 'Cyber sigurnost',
            'iot_solutions': 'IoT rešenja'
        };
        
        return services.map(service =>
            `<span class="service-tag">${serviceNames[service] || service}</span>`
        ).join('');
    }
    
    formatTechnologiesList(technologies) {
        if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
            return null;
        }
        
        const techNames = {
            'tech_2g': '2G',
            'tech_3g': '3G',
            'tech_4g': '4G',
            'tech_5g_ready': '5G Ready',
            'tech_volte': 'VoLTE',
            'tech_vowifi': 'VoWiFi',
            'tech_mvno': 'MVNO',
            'tech_ftth_fttb': 'FTTH/FTTB',
            'tech_docsis': 'DOCSIS',
            'tech_satellite': 'Satelit',
            'tech_fixed_wireless': 'Fiksni bežični',
            'tech_voip_fixed': 'VoIP',
            'tech_fiber': 'Optika',
            'tech_mpls': 'MPLS',
            'tech_sdwan': 'SD-WAN',
            'tech_ipv4': 'IPv4',
            'tech_ipv6': 'IPv6',
            'tech_sip': 'SIP',
            'tech_data_center': 'Data centar',
            'tech_cloud': 'Cloud',
            'tech_carrier_grade': 'Carrier Grade'
        };
        
        return technologies.map(tech =>
            `<span class="tech-tag">${techNames[tech] || tech}</span>`
        ).join('');
    }
    
    deleteOperator(id) {
        const operator = this.operators.find(op => op.id === id);
        if (operator && confirm(`Da li ste sigurni da želite da obrišete operatera "${operator.naziv}"?`)) {
            this.operators = this.operators.filter(op => op.id !== id);
            this.saveToLocalStorage();
            this.renderOperators();
            this.updateStatistics();
            this.showNotification('Operater je uspešno obrisan!', 'success');
        }
    }
    
    showOperatorDetails(operator) {
        const detailsHTML = `
            <div class="operator-details">
                <h3>${operator.naziv}</h3>
                ${operator.komercijalni_naziv ? `<p><strong>Komercijalni naziv:</strong> ${operator.komercijalni_naziv}</p>` : ''}
                <p><strong>Tip:</strong> ${operator.tip}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${operator.status}">${operator.status}</span></p>
                <p><strong>ATLAS Status:</strong> ${operator.atlas_status}</p>
                <p><strong>Prioritet:</strong> <span class="priority-badge priority-${operator.prioritet}">${operator.prioritet}</span></p>
                <p><strong>Kompletnost:</strong> ${operator.kompletnost}%</p>
                ${operator.opis ? `<p><strong>Opis:</strong> ${operator.opis}</p>` : ''}
                ${operator.adresa ? `<p><strong>Adresa:</strong> ${operator.adresa}</p>` : ''}
                ${operator.telefon ? `<p><strong>Telefon:</strong> ${operator.telefon}</p>` : ''}
                ${operator.email ? `<p><strong>Email:</strong> <a href="mailto:${operator.email}">${operator.email}</a></p>` : ''}
                ${operator.web ? `<p><strong>Web:</strong> <a href="${operator.web}" target="_blank">${operator.web}</a></p>` : ''}
                ${operator.kontakt_osoba ? `<p><strong>Kontakt osoba:</strong> ${operator.kontakt_osoba}</p>` : ''}
                <p><strong>Poslednje ažuriranje:</strong> ${operator.datum_azuriranja}</p>
            </div>
        `;
        
        alert('Detalji operatera:\n\n' + operator.naziv + '\n' + operator.tip + '\nStatus: ' + operator.status);
    }
    
    exportData() {
        const dataToExport = {
            operateri: this.operators,
            metadata: {
                exportDate: new Date().toISOString(),
                totalOperators: this.operators.length,
                version: '1.0'
            }
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `atlas_operateri_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Podaci su uspešno izvezeni!', 'success');
    }
    
    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.json')) {
            this.showNotification('Molimo izaberite JSON fajl', 'error');
            return;
        }
        
        try {
            const fileContent = await this.readFileAsText(file);
            const importData = JSON.parse(fileContent);
            
            if (!this.validateImportData(importData)) {
                this.showNotification('Neispravni format JSON fajla', 'error');
                return;
            }
            
            await this.processImportData(importData);
            
        } catch (error) {
            console.error('Import error:', error);
            this.showNotification('Greška pri učitavanju fajla: ' + error.message, 'error');
        } finally {
            // Clear file input
            event.target.value = '';
        }
    }
    
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Greška pri čitanju fajla'));
            reader.readAsText(file);
        });
    }
    
    validateImportData(data) {
        // Proverava da li JSON ima operateri array
        if (!data || typeof data !== 'object') return false;
        
        // Podržava i direktno array operatera i objekat sa operateri property
        const operators = Array.isArray(data) ? data : data.operateri || data.operators;
        
        if (!Array.isArray(operators)) return false;
        if (operators.length === 0) return false;
        
        // Proverava da li svaki operator ima minimalne potrebne podatke
        return operators.every(op =>
            op && typeof op === 'object' &&
            op.naziv &&
            op.tip
        );
    }
    
    async processImportData(importData) {
        const operators = Array.isArray(importData) ? importData : importData.operateri || importData.operators;
        
        if (!confirm(`Želite li da uvezete ${operators.length} operatera? Ovo može prepisati postojeće podatke.`)) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            let importedCount = 0;
            let updatedCount = 0;
            
            for (const importOperator of operators) {
                // Dodeli ID ako nema
                if (!importOperator.id) {
                    importOperator.id = Math.max(...this.operators.map(op => op.id), 0) + 1;
                }
                
                // Proverava da li operator već postoji
                const existingIndex = this.operators.findIndex(op =>
                    op.id === importOperator.id ||
                    (op.naziv === importOperator.naziv && op.komercijalni_naziv === importOperator.komercijalni_naziv)
                );
                
                // Dodeljuje default vrednosti
                const processedOperator = {
                    ...importOperator,
                    kompletnost: importOperator.kompletnost || this.calculateCompletenessForOperator(importOperator),
                    datum_azuriranja: new Date().toISOString().split('T')[0],
                    atlas_status: importOperator.atlas_status || 'U pripremi za ATLAS',
                    prioritet: importOperator.prioritet || 'srednji'
                };
                
                if (existingIndex !== -1) {
                    // Ažurira postojeći
                    this.operators[existingIndex] = processedOperator;
                    updatedCount++;
                } else {
                    // Dodaje novi
                    this.operators.push(processedOperator);
                    importedCount++;
                }
            }
            
            this.saveToLocalStorage();
            this.renderOperators();
            this.updateStatistics();
            
            this.showNotification(
                `Uspešno uvezeno: ${importedCount} novih, ${updatedCount} ažuriranih operatera`,
                'success'
            );
            
        } catch (error) {
            console.error('Processing error:', error);
            this.showNotification('Greška pri obradi podataka: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    calculateCompletenessForOperator(operator) {
        const requiredFields = ['naziv', 'tip', 'status'];
        const optionalFields = ['komercijalni_naziv', 'opis', 'adresa', 'telefon', 'email', 'web', 'kontakt_osoba'];
        
        let filledRequired = 0;
        let filledOptional = 0;
        
        requiredFields.forEach(field => {
            if (operator[field] && operator[field].toString().trim()) {
                filledRequired++;
            }
        });
        
        optionalFields.forEach(field => {
            if (operator[field] && operator[field].toString().trim()) {
                filledOptional++;
            }
        });
        
        // Required fields are worth 60%, optional fields 40%
        const requiredPercentage = (filledRequired / requiredFields.length) * 60;
        const optionalPercentage = (filledOptional / optionalFields.length) * 40;
        
        return Math.round(requiredPercentage + optionalPercentage);
    }
    
    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Utility functions
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    getAtlasStatusClass(status) {
        if (!status) return 'atlas-priprema';
        if (status.includes('Spreman')) return 'atlas-spreman';
        if (status.includes('Prioritet')) return 'atlas-prioritet';
        if (status.includes('Arhiviran')) return 'atlas-arhiviran';
        return 'atlas-priprema';
    }
    
    getDemoData() {
        return [
            {
                id: 1,
                naziv: "BH Telecom d.d. Sarajevo",
                komercijalni_naziv: "BH Telecom",
                tip: "Dominantni operater",
                status: "aktivan",
                opis: "Najveći telekom operater u BiH sa kompletnom ponudom telekomunikacijskih usluga",
                adresa: "Obala Kulina bana 8, 71000 Sarajevo",
                telefon: "+387 33 000 900",
                email: "info@bhtelecom.ba",
                web: "https://www.bhtelecom.ba",
                kompletnost: 100,
                atlas_status: "Spreman za ATLAS",
                prioritet: "visok",
                kontakt_osoba: "Nedim Fazlibegović - Šef službe za ZPT i saradnju sa sudovima",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 2,
                naziv: "Telekom Srpske a.d. Banja Luka",
                komercijalni_naziv: "m:tel",
                tip: "Dominantni operater",
                status: "aktivan",
                opis: "Drugi najveći telekom operater u BiH sa kompletnom ponudom usluga",
                adresa: "Banja Luka, Republika Srpska",
                telefon: "0800 50 000",
                email: "info@mtel.ba",
                web: "https://www.mtel.ba",
                kompletnost: 100,
                atlas_status: "U pripremi za ATLAS",
                prioritet: "visok",
                kontakt_osoba: "Zoran Sopka - Šef Službe za bezbjednost",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 3,
                naziv: "JP Hrvatske telekomunikacije d.d. Mostar",
                komercijalni_naziv: "HT Eronet",
                tip: "Dominantni operater",
                status: "aktivan",
                opis: "Treći najveći telekom operater u BiH, fokusiran na Hercegovačko-neretvansku županiju",
                adresa: "Kneza Branimira bb, 88000 Mostar",
                telefon: "+387 36 395 000",
                email: "info@hteronet.ba",
                web: "https://www.eronet.ba",
                kompletnost: 100,
                atlas_status: "U pripremi za ATLAS",
                prioritet: "visok",
                kontakt_osoba: "Slaven Zelenika - Rukovoditelj Odjela za internu kontrolu i sigurnost",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 4,
                naziv: "ONE.Vip d.o.o.",
                komercijalni_naziv: "ONE",
                tip: "Mobilni operater",
                status: "aktivan",
                opis: "Jedan od vodećih mobilnih operatera u BiH sa fokusem na mobilne usluge",
                adresa: "Sarajevo, BiH",
                telefon: "066 15 15 15",
                email: "info@one.ba",
                web: "https://www.one.ba",
                kompletnost: 90,
                atlas_status: "U pripremi za ATLAS",
                prioritet: "visok",
                kontakt_osoba: "ZPT služba",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 5,
                naziv: "Dasto Semtel d.o.o. Bijeljina",
                komercijalni_naziv: "Zona.ba",
                tip: "MVNO operater",
                status: "aktivan",
                opis: "Jedinstveni hibridni operater koji kombinuje MVNO mobilne usluge sa ISP internet uslugama",
                adresa: "Račanska 98, 76300 Bijeljina",
                telefon: "+387 55 420 100",
                email: "info@zona.ba",
                web: "https://zona.ba",
                kompletnost: 95,
                atlas_status: "Prioritetan za ATLAS (inovativni hibridni model)",
                prioritet: "visok",
                kontakt_osoba: "Suzana Simić - Administrativni kontakt",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 6,
                naziv: "haloo d.o.o. Sarajevo",
                komercijalni_naziv: "haloo",
                tip: "MVNO operater",
                status: "aktivan",
                opis: "Flanker brend i podružnica HT Eroneta za jednostavne i jeftine mobilne usluge",
                adresa: "Kneza Branimira bb, 88000 Mostar (HT Eronet)",
                telefon: "064 4 400 400",
                email: "info@haloo.ba",
                web: "https://www.haloo.ba/",
                kompletnost: 90,
                atlas_status: "Spreman za ATLAS",
                prioritet: "visok",
                kontakt_osoba: "Korisnička podrška",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 7,
                naziv: "Novotel d.o.o. Sarajevo",
                komercijalni_naziv: "Novotel",
                tip: "MVNO operater",
                status: "aktivan",
                opis: "MVNO operater koji pruža mobilne telekomunikacione usluge na tržištu BiH",
                adresa: "Sarajevo, BiH",
                telefon: "+387 33 XXX XXX",
                email: "info@novotel.ba",
                web: "https://www.novotel.ba",
                kompletnost: 85,
                atlas_status: "U pripremi za ATLAS",
                prioritet: "srednji",
                kontakt_osoba: "Potrebno dopuniti",
                datum_azuriranja: "2025-07-31"
            },
            {
                id: 8,
                naziv: "Logosoft d.o.o. Sarajevo",
                komercijalni_naziv: "Logosoft",
                tip: "MVNO operater",
                status: "aktivan",
                opis: "Pruža usluge interneta, fiksne i mobilne telefonije sa fokusom na poslovne korisnike",
                adresa: "Grbavička 4, 71000 Sarajevo",
                telefon: "+387 33 931 900",
                email: "info@logosoft.ba",
                web: "https://www.logosoft.ba",
                kompletnost: 95,
                atlas_status: "Spreman za ATLAS",
                prioritet: "visok",
                kontakt_osoba: "Fuad Trle - Tehnička podrška",
                datum_azuriranja: "2025-07-31"
            }
        ];
    }
    
    openHelpModal() {
        this.elements.helpModal.classList.add('active');
        this.elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeHelpModal() {
        this.elements.helpModal.classList.remove('active');
        this.elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ATLASApp();
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .type-badge {
        padding: 2px 6px;
        background: #f1f5f9;
        color: #475569;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);