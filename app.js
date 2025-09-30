// ATLAS Telekomunikacioni Operateri BiH - Aplikacija
// Version: 1.0
// Date: 2025-07-31

// Import standard catalog
import { standardCatalog, catalogUtils } from './generated/standard_catalog.js';

// Import utilities
import {
    getReadableTechName,
    getReadableServiceName,
    getTechTooltip,
    getServiceTooltip
} from './src/utils/formatters.js';
import { CATEGORY_TYPE_MAP } from './src/utils/constants.js';

// Import components
import { OperatorCard } from './src/components/OperatorCard.js';
import { NotificationManager } from './src/components/NotificationManager.js';
import { SearchFilter } from './src/components/SearchFilter.js';

// Import services
import { DataImportExportService } from './src/services/DataImportExportService.js';
import { StorageService } from './src/services/StorageService.js';

// Catalog loaded successfully
console.log('✅ Standard catalog loaded:', standardCatalog?.services?.length || 0, 'services,', standardCatalog?.technologies?.length || 0, 'technologies');

// Add global test function for debugging
window.testCatalog = function() {
    console.log('🧪 === CATALOG TEST FUNCTION ===');
    console.log('Standard catalog:', standardCatalog);
    console.log('Services count:', standardCatalog?.services?.length || 0);
    console.log('Technologies count:', standardCatalog?.technologies?.length || 0);

    const app = window.app;
    if (app) {
        const catalogData = app.getStandardServicesAndTechnologies();
        console.log('App catalog data:', catalogData);
        console.log('Services in app:', catalogData.standardServices?.length || 0);
        console.log('Technologies in app:', catalogData.standardTechnologies?.length || 0);
    } else {
        console.error('❌ App not found in window');
    }

    console.log('🧪 === END CATALOG TEST ===');
};


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
            clearSearchBtn: document.getElementById('clearSearchBtn'),
            searchResults: document.getElementById('searchResults'),
            searchResultsText: document.getElementById('searchResultsText'),
            statusFilter: document.getElementById('statusFilter'),
            typeFilter: document.getElementById('typeFilter'),
            categoryFilter: document.getElementById('categoryFilter'),
            
            // Modal
            operatorModal: document.getElementById('operatorModal'),
            modalOverlay: document.getElementById('modalOverlay'),
            modalTitle: document.getElementById('modalTitle'),
            operatorForm: document.getElementById('operatorForm'),
            
            // Buttons
            addOperatorBtn: document.getElementById('addOperatorBtn'),
            reloadDataBtn: document.getElementById('reloadDataBtn'),
            closeModal: document.getElementById('closeModal'),
            cancelBtn: document.getElementById('cancelBtn'),
            saveBtn: document.getElementById('saveBtn'),
            exportDataBtn: document.getElementById('exportDataBtn'),
            importDataBtn: document.getElementById('importDataBtn'),
            fileImportInput: document.getElementById('fileImportInput'),
            
            // Tehnički kontakti
            techContactsContainer: document.getElementById('tech-contacts-container'),
            addTechContactBtn: document.getElementById('add-tech-contact'),
            
            // Usluge
            servicesContainer: document.getElementById('services-container'),
            addServiceBtn: document.getElementById('add-service'),
            
            // Tehnologije
            technologiesContainer: document.getElementById('technologies-container'),
            addTechnologyBtn: document.getElementById('add-technology'),
            
            // Help Modal
            helpBtn: document.getElementById('helpBtn'),
            helpModal: document.getElementById('helpModal'),
            closeHelpModal: document.getElementById('closeHelpModal'),
            closeHelpModalBtn: document.getElementById('closeHelpModalBtn')
        };
        
        // Initialize services and components
        this.notificationManager = new NotificationManager();
        this.storageService = new StorageService(this.notificationManager);
        this.dataImportExportService = new DataImportExportService(this.storageService, this.notificationManager);
        this.searchFilter = new SearchFilter(this, this.notificationManager);
        this.operatorCard = new OperatorCard(this, this.notificationManager, this.storageService);
        
        this.init();
    }
    
    async init() {
        try {
            this.showLoading(true);
            await this.loadData();
            
            // Dodaj test podatke za usluge i tehnologije
            this.addTestServicesAndTechnologies();
            
            this.setupEventListeners();
            this.renderOperators();
            this.updateStatistics();
            this.showLoading(false);
            
            // Clean up any duplicate tooltips after initialization
            setTimeout(() => {
                this.cleanupDuplicateTooltips();
            }, 200);
            
            // Debug: prikaži kategorizaciju svih operatera na početku
            console.log('🏷️ === POČETNA KATEGORIZACIJA OPERATERA ===');
            const categoryCounts = { dominantni: 0, mobilni: 0, b2b: 0, isp: 0 };
            this.operators.forEach(op => {
                const cat = this.getCategoryClass(op);
                categoryCounts[cat]++;
                console.log(`${op.naziv} (${op.komercijalni_naziv || 'N/A'}) → ${cat}`);
            });
            console.log('📊 Ukupno po kategorijama:', categoryCounts);
            console.log('🏷️ === KRAJ KATEGORIZACIJE ===');
            
            console.log('ATLAS aplikacija uspešno pokrenuta');
        } catch (error) {
            console.error('Greška pri pokretanju aplikacije:', error);
            this.showLoading(false);
            this.showNotification('Greška pri učitavanju podataka', 'error');
        }
    }
    
    async loadData() {
        console.log('=== Početak loadData() ===');
        console.log('Storage key:', this.storageKey);
        
        try {
            // PRIORITET 1: UVIJEK prvo pročitaj LocalStorage
            const savedData = localStorage.getItem(this.storageKey);
            let localData = null;
            let localVersion = '0.0';
            let localOperatorCount = 0;
            
            if (savedData) {
                try {
                    localData = JSON.parse(savedData);
                    localVersion = localData.version || '1.0';
                    localOperatorCount = localData.operateri ? localData.operateri.length : 0;
                    console.log('✅ LocalStorage pronađen:');
                    console.log('   - Verzija:', localVersion);
                    console.log('   - Broj operatera:', localOperatorCount);
                    console.log('   - Datum ažuriranja:', localData.metadata ? localData.metadata.lastUpdated : 'Nepoznato');
                } catch (parseError) {
                    console.warn('⚠️ Greška pri parsiranju LocalStorage:', parseError);
                    console.log('   - Nastavljam sa JSON fallback-om');
                }
            } else {
                console.log('❌ LocalStorage nije pronađen - koristi JSON');
            }
            
            // PRIORITET 2: Ako LocalStorage ima podatke, KORISTI GA ODMAH (bez JSON-a za brisanja)
            if (localData && Array.isArray(localData.operateri) && localData.operateri.length >= 0) {
                this.operators = localData.operateri;
                console.log('🎯 PRIORITET: Učitani podaci IZ LOCALSTORAGE (persistencija brisanja/dodavanja)');
                console.log('   - Ukupno operatera:', this.operators.length);
                console.log('   - Verzija:', localVersion);
                console.log('   - Izvor: LocalStorage (prioritet)');
                return; // IZLAZ - ne učitavaj JSON ako LocalStorage postoji
            }
            
            // PRIORITET 3: Ako nema LocalStorage-a, učitaj JSON
            console.log('📥 Učitavam JSON jer LocalStorage nema podatke...');
            const response = await fetch('./operateri.json?v=' + Date.now()); // cache busting
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Nije moguće učitati operateri.json`);
            }
            
            const jsonData = await response.json();
            const jsonVersion = jsonData.version || "1.0";
            const jsonOperatorCount = jsonData.operateri ? jsonData.operateri.length : 0;
            
            console.log('✅ JSON učitan uspješno:');
            console.log('   - Verzija:', jsonVersion);
            console.log('   - Broj operatera:', jsonOperatorCount);
            
            this.operators = jsonData.operateri || [];
            this.saveToLocalStorage(jsonData); // Sačuvaj u LocalStorage za budućnost
            console.log('📄 Podaci učitani IZ JSON FAJLA (fallback):', this.operators.length, 'operatera');
            console.log('   - Verzija:', jsonVersion);
            console.log('   - Sačuvano u LocalStorage za sljedeći put');
            
        } catch (error) {
            console.error('❌ Greška pri učitavanju JSON fajla:', error);
            
            // Provjeri da li je CORS greška
            if (error.message.includes('Failed to fetch') || error.toString().includes('CORS')) {
                console.log('🔒 CORS greška detektovana - potreban je HTTP server');
                console.log('💡 Pokrenite: python -m http.server 8000');
                console.log('💡 Ili otvorite: http://localhost:8000');
                
                // Prikaži korisniku poruku o CORS problemu
                this.showCORSWarning();
            }
            
            // FALLBACK 1: Pokušaj LocalStorage
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    this.operators = parsedData.operateri || [];
                    console.log('🔄 FALLBACK: Učitani podaci IZ LOCALSTORAGE zbog greške JSON-a:', this.operators.length, 'operatera');
                    return;
                } catch (parseError) {
                    console.warn('⚠️ Greška pri parsiranju LocalStorage u fallback-u:', parseError);
                }
            }
            
            // FALLBACK 2: Demo podaci
            console.log('🚨 KRAJNJ FALLBACK: Koriste se demo podaci');
            this.operators = this.getDemoData();
            this.saveToLocalStorage();
        }
        
        console.log('=== loadData() završen ===');
        console.log('Ukupno operatera učitano:', this.operators.length);
        console.log('Izvor podataka:', this.operators.length > 0 ? 'LocalStorage ili JSON' : 'Demo');
        console.log('====================');
    }
    
    // Forsiraj reload iz JSON fajla
    async forceReloadFromJSON() {
        try {
            this.showLoading(true);
            console.log('Forsiram reload iz JSON...');
            
            // Obriši localStorage cache
            localStorage.removeItem(this.storageKey);
            console.log('LocalStorage obrisan za reload:', this.storageKey);
            
            // Učitaj svježe iz JSON
            const response = await fetch('./operateri.json?v=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                this.operators = data;
                this.saveToLocalStorage();
                this.renderOperators();
                this.updateStatistics();
                console.log(`✅ Reload uspješan! Učitano ${data.length} operatera`);
                
                // Prikaži potvrdu korisniku
                alert(`Reload uspješan! Učitano ${data.length} operatera.`);
            } else {
                throw new Error('JSON nije valjan niz operatera');
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('❌ Greška pri reload-u:', error);
            this.showLoading(false);
            alert('Greška pri reload-u podataka: ' + error.message);
        }
    }
    
    saveToLocalStorage(fullData = null) {
        try {
            let dataToSave;
            
            if (fullData) {
                // Ako je prosleđena cela struktura podataka, koristi je
                dataToSave = {
                    operateri: this.operators,
                    version: fullData.version || '2.1',
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        source: 'JSON file'
                    }
                };
            } else {
                // Inače kreiraj osnovnu strukturu
                dataToSave = {
                    operateri: this.operators,
                    version: '2.1', // Sinhronizuj sa JSON verzijom
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        source: 'local'
                    }
                };
            }
            
            const serializedData = JSON.stringify(dataToSave);
            localStorage.setItem(this.storageKey, serializedData);
            console.log('Podaci sačuvani u LocalStorage pod ključem:', this.storageKey);
            console.log('Broj operatera sačuvanih:', dataToSave.operateri.length);
            console.log('Verzija sačuvana:', dataToSave.version);
            
            // Validacija - pročitaj nazad da provjeriš
            const validation = localStorage.getItem(this.storageKey);
            if (validation) {
                const parsed = JSON.parse(validation);
                console.log('Validacija LocalStorage: učitano', parsed.operateri.length, 'operatera');
            }
            
            // Prikažemo sync status bar kada se čuvaju lokalni podaci
            this.showSyncStatus();
            
        } catch (error) {
            console.error('Greška pri čuvanju u LocalStorage:', error);
            this.showNotification('Greška pri čuvanju podataka', 'error');
        }
    }
    
    // Sync Status Bar funkcije
    showSyncStatus() {
        const statusBar = document.getElementById('sync-status-bar');
        if (statusBar) {
            statusBar.style.display = 'block';
            
            // Sakrij posle 10 sekundi ako nema interakcije
            setTimeout(() => {
                if (statusBar.style.display === 'block') {
                    this.hideSyncStatus();
                }
            }, 10000);
        }
    }
    
    hideSyncStatus() {
        const statusBar = document.getElementById('sync-status-bar');
        if (statusBar) {
            statusBar.style.display = 'none';
        }
    }
    
    // Export/Download funkcionalnost za čuvanje izmena u JSON fajl
    exportUpdatedData() {
        try {
            // Kreiraj podatke za export u istom formatu kao operateri.json
            const exportData = {
                operateri: this.operators,
                version: '2.1',
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    source: 'ATLAS application - exported changes',
                    exportedAt: new Date().toISOString(),
                    totalOperators: this.operators.length
                }
            };
            
            // Kreiraj JSON string sa formatiranjem
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Kreiraj Blob i download link
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Kreiraj download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `operateri_updated_${new Date().toISOString().split('T')[0]}.json`;
            a.style.display = 'none';
            
            // Dodaj u DOM, klikni, i ukloni
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Očisti URL
            URL.revokeObjectURL(url);
            
            console.log('✅ Export završen:', {
                fileName: a.download,
                operators: exportData.operateri.length,
                timestamp: exportData.metadata.exportedAt
            });
            
            this.showNotification(`📥 Izvoženo ${exportData.operateri.length} operatera u fajl: ${a.download}`, 'success', 5000);
            
        } catch (error) {
            console.error('❌ Greška pri exportu:', error);
            this.showNotification('Greška pri exportu podataka', 'error');
        }
    }
    
    // Funkcija za import novih podataka iz JSON fajla
    importDataFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validiraj strukturu
                    if (!importedData.operateri || !Array.isArray(importedData.operateri)) {
                        throw new Error('Invalid JSON structure - missing operateri array');
                    }
                    
                    // Postavi podatke
                    this.operators = importedData.operateri;
                    
                    // Sačuvaj u LocalStorage
                    this.saveToLocalStorage(importedData);
                    
                    // Refresh display
                    this.renderOperators();
                    this.updateCounts();
                    
                    console.log('✅ Import završen:', {
                        fileName: file.name,
                        operators: importedData.operateri.length,
                        version: importedData.version
                    });
                    
                    this.showNotification(`📤 Učitano ${importedData.operateri.length} operatera iz fajla: ${file.name}`, 'success', 5000);
                    
                } catch (error) {
                    console.error('❌ Greška pri importu:', error);
                    this.showNotification('Greška pri čitanju fajla - proverite format', 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }
    
    setupEventListeners() {
        // Search and Filter
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.elements.clearSearchBtn.addEventListener('click', () => {
            this.clearSearch();
        });
        
        this.elements.statusFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        this.elements.typeFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        this.elements.categoryFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        // Quick Category Filters
        console.log('🔧 === SETUP FILTER EVENT LISTENERS ===');
        const filterButtons = document.querySelectorAll('.filter-btn');
        console.log('📊 Pronađeno filter dugmića:', filterButtons.length);
        
        filterButtons.forEach((btn, index) => {
            const category = btn.dataset.category;
            console.log(`   ${index + 1}. "${btn.textContent.trim()}" → data-category="${category}"`);
            
            btn.addEventListener('click', (e) => {
                console.log('🖱️ KLIK na filter dugme:', e.target.dataset.category);
                this.handleQuickFilter(e.target.dataset.category);
            });
        });
        console.log('🔧 === FILTER SETUP ZAVRŠEN ===');
        
        // Test funkcija za debug u konzoli
        window.debugFilters = () => {
            console.log('🔍 === FILTER SYSTEM DEBUG TEST ===');
            console.log('📊 Ukupno operatera:', this.operators.length);
            
            // Test filter dugmići
            const filterButtons = document.querySelectorAll('.filter-btn');
            console.log('🔘 Filter dugmići:', filterButtons.length);
            filterButtons.forEach(btn => {
                console.log(`   - "${btn.textContent.trim()}" (${btn.dataset.category})`);
            });
            
            // Test kategorizacija svih operatera
            console.log('🏷️ Kategorizacija operatera:');
            const categoryCounts = { dominantni: 0, mobilni: 0, b2b: 0, isp: 0 };
            this.operators.forEach(op => {
                const cat = this.getCategoryClass(op);
                categoryCounts[cat]++;
                console.log(`   ${op.naziv} → ${cat}`);
            });
            
            console.log('📊 Broj po kategorijama:', categoryCounts);
            
            // Test quick filter za svaku kategoriju
            ['dominantni', 'mobilni', 'b2b', 'isp'].forEach(category => {
                const filtered = this.operators.filter(op => this.getCategoryClass(op) === category);
                console.log(`🔍 Filter "${category}": ${filtered.length} operatera`);
            });
            
            console.log('💡 Za testiranje pozovi: window.testFilter("dominantni")');
        };
        
        window.testFilter = (category) => {
            console.log(`🧪 Test filter: ${category}`);
            this.handleQuickFilter(category);
        };
        
        // Modal Controls
        this.elements.addOperatorBtn.addEventListener('click', () => {
            this.openModal('add');
        });
        
        // Reload Data Button
        this.elements.reloadDataBtn.addEventListener('click', () => {
            this.forceReloadFromJSON();
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

        // Tehnički kontakti dugme
        if (this.elements.addTechContactBtn) {
            this.elements.addTechContactBtn.addEventListener('click', () => {
                this.addTechContactField();
            });
        }

        // Usluge dugme - dodaj event listener
        if (this.elements.addServiceBtn) {
            this.elements.addServiceBtn.addEventListener('click', () => {
                console.log('🔵 Dodavanje nove usluge...');
                const isEditMode = this.currentEditId !== null;
                const existingServices = this.getExistingServicesFromForm();
                this.addServiceField(null, isEditMode, existingServices);
            });
        }

        // Tehnologije dugme - dodaj event listener
        if (this.elements.addTechnologyBtn) {
            this.elements.addTechnologyBtn.addEventListener('click', () => {
                console.log('🔵 Dodavanje nove tehnologije...');
                const isEditMode = this.currentEditId !== null;
                const existingTechnologies = this.getExistingTechnologiesFromForm();
                this.addTechnologyField(null, isEditMode, existingTechnologies);
            });
        }

        // Disable add buttons in edit mode - management is in single section
        if (this.currentEditId) {
            if (this.elements.addServiceBtn) this.elements.addServiceBtn.disabled = true;
            if (this.elements.addTechnologyBtn) this.elements.addTechnologyBtn.disabled = true;
        } else {
            // Enable for add mode
            if (this.elements.addServiceBtn) this.elements.addServiceBtn.disabled = false;
            if (this.elements.addTechnologyBtn) this.elements.addTechnologyBtn.disabled = false;
        }

        // Real-time completeness calculation
        const formFields = ['naziv', 'komercijalni_naziv', 'kategorija', 'tip', 'status', 'prioritet', 'opis', 'adresa', 'telefon', 'email', 'web', 'atlas_status', 'kontakt_osoba'];
        formFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => {
                    const formData = new FormData(this.elements.operatorForm);
                    const completeness = this.calculateCompleteness(formData);
                    document.getElementById('kompletnost').value = completeness;
                });
            }
        });

        // Dynamic tip filtering based on category
        const kategorijaField = document.getElementById('kategorija');
        if (kategorijaField) {
            kategorijaField.addEventListener('change', () => {
                this.updateTipOptions();
            });
        }

        // Real-time validation for specific fields
        const validationFields = [
            { id: 'email', validator: this.isValidEmail.bind(this), message: 'Email adresa nije ispravna' },
            { id: 'telefon', validator: this.isValidPhone.bind(this), message: 'Broj telefona nije ispravan' },
            { id: 'web', validator: this.isValidUrl.bind(this), message: 'Web adresa nije ispravna' }
        ];

        validationFields.forEach(fieldInfo => {
            const field = document.getElementById(fieldInfo.id);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(field, fieldInfo.validator, fieldInfo.message);
                });
                field.addEventListener('focus', () => {
                    this.clearFieldError(field);
                });
            }
        });
        
        // Export Data
        this.elements.exportDataBtn.addEventListener('click', () => {
            this.dataImportExportService.exportData(this.operators);
        });
        
        // Import Data
        this.elements.importDataBtn.addEventListener('click', () => {
            this.elements.fileImportInput.click();
        });
        
        this.elements.fileImportInput.addEventListener('change', (e) => {
            this.dataImportExportService.handleFileImport(e, this.operators, (updatedOperators) => {
                this.operators = updatedOperators;
                this.renderOperators();
                this.updateStatistics();
            });
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
                // If search is active, clear it first, then close modal
                if (this.elements.searchInput.value) {
                    this.clearSearch();
                    this.elements.searchInput.blur();
                } else {
                    this.closeModal();
                }
            }
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.elements.searchInput.focus();
                this.elements.searchInput.select();
            }
            // Enter to search when input is focused
            if (e.key === 'Enter' && document.activeElement === this.elements.searchInput) {
                this.handleSearch();
            }
        });
    }
    
    showLoading(show) {
        this.elements.loadingIndicator.style.display = show ? 'block' : 'none';
        this.elements.operatorsTableBody.style.display = show ? 'none' : '';
    }
    
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        // Clear any existing highlights
        this.clearSearchHighlights();
        
        if (term === '') {
            this.filteredOperators = [...this.operators];
            // Reset search filter buttons
            this.resetQuickFilters();
            // Hide clear button and results info
            this.elements.clearSearchBtn.style.display = 'none';
            this.elements.searchResults.style.display = 'none';
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
            
            // Highlight search term in results
            this.highlightSearchTerm = term;
            
            // Show clear button and results info
            this.elements.clearSearchBtn.style.display = 'block';
            this.elements.searchResults.style.display = 'flex';
            
            // Update results info
            const resultsCount = this.filteredOperators.length;
            const totalCount = this.operators.length;
            this.elements.searchResultsText.textContent = 
                `${resultsCount} od ${totalCount} operatera • "${term}"`;
        }
        
        this.applyFilters();
    }
    
    clearSearchHighlights() {
        this.highlightSearchTerm = null;
        // Remove existing highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
    }
    
    highlightText(text, searchTerm) {
        if (!searchTerm || !text) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    clearSearch() {
        this.elements.searchInput.value = '';
        this.clearSearchHighlights();
        this.resetQuickFilters();
        this.elements.clearSearchBtn.style.display = 'none';
        this.elements.searchResults.style.display = 'none';
        this.filteredOperators = [...this.operators];
        this.applyFilters();
    }

    resetQuickFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
    }
    
    applyFilters() {
        console.log('🔍 === APPLY FILTERS DEBUG START ===');
        let filtered = this.filteredOperators.length > 0 ? [...this.filteredOperators] : [...this.operators];
        console.log('📊 Početni broj operatera za filtriranje:', filtered.length);
        
        // Status filter
        const statusFilter = this.elements.statusFilter.value;
        console.log('📋 Status filter vrednost:', statusFilter);
        if (statusFilter) {
            const beforeCount = filtered.length;
            filtered = filtered.filter(op => op.status === statusFilter);
            console.log(`   Status filter: ${beforeCount} → ${filtered.length} operatera`);
        }
        
        // Category filter
        const categoryFilter = this.elements.categoryFilter.value;
        console.log('📋 Category filter vrednost:', categoryFilter);
        if (categoryFilter) {
            const beforeCount = filtered.length;
            filtered = filtered.filter(op => this.getCategoryClass(op) === categoryFilter);
            console.log(`   Category filter: ${beforeCount} → ${filtered.length} operatera`);
        }
        
        // Type filter
        const typeFilter = this.elements.typeFilter.value;
        console.log('📋 Type filter vrednost:', typeFilter);
        if (typeFilter) {
            const beforeCount = filtered.length;
            
            // Koristimo direktno tip operatera
            filtered = filtered.filter(op => op.tip.includes(typeFilter));
            console.log(`   Type filter: ${beforeCount} → ${filtered.length} operatera`);
            console.log('   Filtrirani operateri:', filtered.map(op => `${op.naziv} (${op.tip})`));
        }
        
        console.log('📊 Finalni broj operatera:', filtered.length);
        console.log('🔍 === APPLY FILTERS DEBUG END ===');
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
        
        tbody.innerHTML = operators.map(operator => {
            // Apply highlighting if search term exists
            const naziv = this.highlightSearchTerm ? 
                this.highlightText(operator.naziv, this.highlightSearchTerm) : operator.naziv;
            const komercijalni = this.highlightSearchTerm && operator.komercijalni_naziv ? 
                this.highlightText(operator.komercijalni_naziv, this.highlightSearchTerm) : operator.komercijalni_naziv;
            const tip = this.highlightSearchTerm ? 
                this.highlightText(operator.tip, this.highlightSearchTerm) : operator.tip;
            
            return `
            <tr class="fade-in operator-row" data-id="${operator.id}" onclick="app.operatorCard.toggleOperatorDetails(${operator.id})">
                <td class="operator-col">
                    <div class="operator-name">
                        <strong>${naziv}</strong>
                        ${komercijalni ? `<small class="commercial-name">${komercijalni}</small>` : ''}
                        <span class="expand-indicator">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </div>
                </td>
                <td class="category-col">
                    <span class="category-badge category-${this.getCategoryClass(operator)}">
                        ${this.getCategoryDisplay(operator)}
                    </span>
                </td>
                <td class="type-col">
                    <span class="type-badge">${this.truncateText(tip, 25)}</span>
                </td>
                <td class="status-col">
                    <span class="status-badge status-${operator.status}">${operator.status}</span>
                </td>
                <td class="completeness-col">
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${operator.kompletnost || 0}%"></div>
                        </div>
                        <small class="progress-text">${operator.kompletnost || 0}%</small>
                    </div>
                </td>
                <td class="contact-col">
                    <div class="contact-info">
                        ${operator.telefon ? `
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <a href="tel:${operator.telefon}">${operator.telefon}</a>
                            </div>
                        ` : ''}
                        ${operator.email ? `
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <a href="mailto:${operator.email}">${this.truncateText(operator.email, 18)}</a>
                            </div>
                        ` : ''}
                    </div>
                </td>
                <td class="actions-col">
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="event.stopPropagation(); app.viewOperator(${operator.id})" title="Pogledaj detalje">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="event.stopPropagation(); app.editOperator(${operator.id})" title="Uredi">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); app.operatorCard.deleteOperator(${operator.id})" title="Obriši">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
            <tr class="operator-details" id="details-${operator.id}">
                <td colspan="7">
                    <div class="operator-details-content">
                        ${this.operatorCard.generateOperatorDetails(operator)}
                    </div>
                </td>
            </tr>
        `;
        }).join('');
        
        // Clean up duplicate tooltips after rendering
        setTimeout(() => {
            this.cleanupDuplicateTooltips();
        }, 100);
    }
    
    updateStatistics() {
        const total = this.operators.length;
        const active = this.operators.filter(op => op.status === 'aktivan').length;
        const inactive = total - active;
        
        // Count operators by category instead of priority
        const dominantni = this.operators.filter(op => this.getCategoryClass(op) === 'dominantni').length;
        
        this.elements.totalOperators.textContent = total;
        this.elements.activeOperators.textContent = active;
        this.elements.inactiveOperators.textContent = inactive;
        this.elements.highPriorityOperators.textContent = dominantni;
        
        // Update quick filter counts
        this.updateQuickFilterCounts();
    }
    
    updateQuickFilterCounts() {
        const counts = {
            all: this.operators.length,
            dominantni: this.operators.filter(op => this.getCategoryClass(op) === 'dominantni').length,
            mobilni: this.operators.filter(op => this.getCategoryClass(op) === 'mobilni').length,
            isp: this.operators.filter(op => this.getCategoryClass(op) === 'isp').length,
            b2b: this.operators.filter(op => this.getCategoryClass(op) === 'b2b').length
        };
        
        Object.entries(counts).forEach(([category, count]) => {
            const countElement = document.getElementById(`count${category.charAt(0).toUpperCase() + category.slice(1)}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }
    
    handleQuickFilter(category) {
        console.log('🔍 === QUICK FILTER DEBUG START ===');
        console.log('📥 Primljena kategorija:', category);
        console.log('📊 Ukupno operatera u aplikaciji:', this.operators.length);
        console.log('📋 Trenutno filtrirani operateri (search):', this.filteredOperators.length);
        
        // Reset search filters when using quick filter
        this.filteredOperators = [...this.operators];
        this.elements.searchInput.value = '';
        this.highlightSearchTerm = '';
        console.log('🔄 Search resetovan - sada koristimo sve operatere');
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const filterBtn = document.querySelector(`[data-category="${category}"]`);
        if (filterBtn) {
            filterBtn.classList.add('active');
            console.log('✅ Filter dugme aktivirano za kategoriju:', category);
        } else {
            console.warn('❌ Filter dugme za kategoriju "' + category + '" nije pronađeno');
            return;
        }
        
        // Filter operators
        if (category === 'all') {
            this.renderOperators();
            console.log('📋 Prikazani svi operateri (', this.operators.length, ')');
        } else {
            console.log('🔎 Filtriranje operatera po kategoriji "' + category + '"...');
            
            // Debug: prikaz kategorizacije za sve operatere
            this.operators.forEach(op => {
                const opCategory = this.getCategoryClass(op);
                console.log(`   - ${op.naziv}: kategorija="${opCategory}", tip="${op.tip}"`);
            });
            
            const filtered = this.operators.filter(op => this.getCategoryClass(op) === category);
            console.log('📊 Filtrirano operatera:', filtered.length);
            console.log('📋 Filtrirani operateri:', filtered.map(op => op.naziv));
            
            this.renderOperators(filtered);
        }
        console.log('🔍 === QUICK FILTER DEBUG END ===');
    }
    
    openModal(mode, operatorId = null) {
        this.currentEditId = operatorId;
        
        if (mode === 'add') {
            this.elements.modalTitle.textContent = 'Dodaj Novog Operatera';
            this.elements.saveBtn.textContent = 'Sačuvaj';
            this.elements.operatorForm.reset();
            
            // Očisti dinamičke kontejnere
            this.clearTechContacts();
            this.clearServices();
            this.clearTechnologies();

            // Enable add buttons for add mode
            if (this.elements.addServiceBtn) this.elements.addServiceBtn.disabled = false;
            if (this.elements.addTechnologyBtn) this.elements.addTechnologyBtn.disabled = false;
            
        } else if (mode === 'edit' && operatorId) {
            const operator = this.operators.find(op => op.id === operatorId);
            if (operator) {
                this.elements.modalTitle.textContent = `Uređivanje operatera: ${operator.naziv}`;
                this.elements.saveBtn.textContent = 'Ažuriraj Izmene';
                this.populateForm(operator);
            } else {
                this.elements.modalTitle.textContent = 'Uredi Operatera';
            }

            // Disable add buttons in edit mode - single management section
            if (this.elements.addServiceBtn) this.elements.addServiceBtn.disabled = true;
            if (this.elements.addTechnologyBtn) this.elements.addTechnologyBtn.disabled = true;
        }
        
        this.elements.operatorModal.classList.add('active');
        this.elements.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // ✅ PRIORITET 2: Setup form monitoring for progress tracking
        this.setupFormMonitoring();
        this.updateFormProgress();
    }
    
    closeModal() {
        this.elements.operatorModal.classList.remove('active');
        this.elements.modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditId = null;
        this.elements.operatorForm.reset();
        this.elements.saveBtn.textContent = 'Sačuvaj';
        
        // Očisti dinamičke kontejnere
        this.clearTechContacts();
        this.clearServices();
        this.clearTechnologies();

        // Re-enable add buttons after closing
        if (this.elements.addServiceBtn) this.elements.addServiceBtn.disabled = false;
        if (this.elements.addTechnologyBtn) this.elements.addTechnologyBtn.disabled = false;
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
        
        // Nova polja
        if (form.elements.napomena) {
            form.elements.napomena.value = operator.napomena || '';
        }
        
        // Customer Service brojevi
        if (operator.kontakt && operator.kontakt.customer_service) {
            const cs = operator.kontakt.customer_service;
            if (form.elements.customer_service_privatni) {
                form.elements.customer_service_privatni.value = cs.privatni || '';
            }
            if (form.elements.customer_service_poslovni) {
                form.elements.customer_service_poslovni.value = cs.poslovni || '';
            }
            if (form.elements.customer_service_dopuna) {
                form.elements.customer_service_dopuna.value = cs.dopuna || '';
            }
            if (form.elements.customer_service_podrska) {
                form.elements.customer_service_podrska.value = cs.msat_podrska || '';
            }
        }
        
        // Društvene mreže
        if (operator.kontakt && operator.kontakt.drustvene_mreze) {
            const sm = operator.kontakt.drustvene_mreze;
            if (form.elements.facebook) {
                form.elements.facebook.value = sm.facebook || '';
            }
            if (form.elements.instagram) {
                form.elements.instagram.value = sm.instagram || '';
            }
            if (form.elements.twitter) {
                form.elements.twitter.value = sm.twitter || '';
            }
            if (form.elements.linkedin) {
                form.elements.linkedin.value = sm.linkedin || '';
            }
        }
        
        // Tehnički kontakti
        this.clearTechContacts();
        if (operator.tehnicki_kontakti && operator.tehnicki_kontakti.length > 0) {
            operator.tehnicki_kontakti.forEach(kontakt => {
                this.addTechContactField(kontakt);
            });
        }

        // Usluge - koristi edit mode
        this.clearServices();
        const existingServices = this.extractServicesFromDetailedStructure(operator);
        if (existingServices.length > 0) {
            // U edit modu, prosledi sve postojece usluge odjednom
            this.addServiceField(null, true, existingServices);
        } else {
            // Ako nema usluga, dodaj prazan edit mode
            this.addServiceField(null, true, []);
        }

        // Tehnologije - koristi edit mode
        this.clearTechnologies();
        const existingTechnologies = this.extractTechnologiesFromDetailedStructure(operator);
        if (existingTechnologies.length > 0) {
            // U edit modu, prosledi sve postojece tehnologije odjednom
            this.addTechnologyField(null, true, existingTechnologies);
        } else {
            // Ako nema tehnologija, dodaj prazan edit mode
            this.addTechnologyField(null, true, []);
        }

        // Zakonske obaveze
        if (operator.zakonske_obaveze) {
            const zo = operator.zakonske_obaveze;
            if (form.elements.dozvola_za_rad) {
                form.elements.dozvola_za_rad.value = zo.dozvola_za_rad || '';
            }
            if (form.elements.datum_izdavanja) {
                form.elements.datum_izdavanja.value = zo.datum_izdavanja || '';
            }
            if (form.elements.vazenje_dozvole) {
                form.elements.vazenje_dozvole.value = zo.vazenje_dozvole || '';
            }
            if (form.elements.status_dozvole) {
                form.elements.status_dozvole.value = zo.status_dozvole || '';
            }
            if (form.elements.napomene_dozvole) {
                form.elements.napomene_dozvole.value = zo.napomene_dozvole || '';
            }
        }

        // Update tip options based on category for edit mode
        setTimeout(() => {
            this.updateTipOptions();
        }, 100);
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
            datum_azuriranja: new Date().toISOString().split('T')[0],
            
            // Nova polja
            napomena: formData.get('napomena') ? formData.get('napomena').trim() : '',
            
            // Tehnički kontakti
            tehnicki_kontakti: this.getTechContactsData(),
            
            // Usluge
            usluge: this.getServicesData(),
            
            // Tehnologije  
            tehnologije: this.getTechnologiesData(),
            
            // Zakonske obaveze
            zakonske_obaveze: {
                dozvola_za_rad: formData.get('dozvola_za_rad') ? formData.get('dozvola_za_rad').trim() : '',
                datum_izdavanja: formData.get('datum_izdavanja') || '',
                vazenje_dozvole: formData.get('vazenje_dozvole') || '',
                status_dozvole: formData.get('status_dozvole') || '',
                napomene_dozvole: formData.get('napomene_dozvole') ? formData.get('napomene_dozvole').trim() : ''
            },
            
            // Kontakt struktura sa customer service i društvenim mrežama
            kontakt: {
                adresa: formData.get('adresa').trim(),
                telefon: formData.get('telefon').trim(),
                email: formData.get('email').trim(),
                web: formData.get('web').trim(),
                customer_service: {
                    privatni: formData.get('customer_service_privatni') ? formData.get('customer_service_privatni').trim() : '',
                    poslovni: formData.get('customer_service_poslovni') ? formData.get('customer_service_poslovni').trim() : '',
                    dopuna: formData.get('customer_service_dopuna') ? formData.get('customer_service_dopuna').trim() : '',
                    msat_podrska: formData.get('customer_service_podrska') ? formData.get('customer_service_podrska').trim() : ''
                },
                drustvene_mreze: {
                    facebook: formData.get('facebook') ? formData.get('facebook').trim() : '',
                    instagram: formData.get('instagram') ? formData.get('instagram').trim() : '',
                    twitter: formData.get('twitter') ? formData.get('twitter').trim() : '',
                    linkedin: formData.get('linkedin') ? formData.get('linkedin').trim() : ''
                }
            }
        };
        
        // Ukloni prazne vrednosti iz customer_service
        Object.keys(operatorData.kontakt.customer_service).forEach(key => {
            if (!operatorData.kontakt.customer_service[key]) {
                delete operatorData.kontakt.customer_service[key];
            }
        });
        
        // Ukloni prazne vrednosti iz drustvene_mreze
        Object.keys(operatorData.kontakt.drustvene_mreze).forEach(key => {
            if (!operatorData.kontakt.drustvene_mreze[key]) {
                delete operatorData.kontakt.drustvene_mreze[key];
            }
        });

        // Ukloni prazne vrednosti iz zakonske_obaveze
        Object.keys(operatorData.zakonske_obaveze).forEach(key => {
            if (!operatorData.zakonske_obaveze[key]) {
                delete operatorData.zakonske_obaveze[key];
            }
        });

        // Ukloni zakonske_obaveze ako je objekat prazan
        if (Object.keys(operatorData.zakonske_obaveze).length === 0) {
            delete operatorData.zakonske_obaveze;
        }
        
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
        
        // ✅ PRIORITET 2: Validacija usluga, tehnologija i kontakata
        
        // Validate services - at least one service is required
        const services = this.getServicesData();
        if (!services || services.length === 0) {
            errors.push({ 
                field: 'usluge', 
                message: 'Morate dodati barem jednu uslugu' 
            });
        }
        
        // Validate technologies - at least one technology is required
        const technologies = this.getTechnologiesData();
        if (!technologies || technologies.length === 0) {
            errors.push({ 
                field: 'tehnologije', 
                message: 'Morate dodati barem jednu tehnologiju' 
            });
        }
        
        // Validate technical contacts - check if all contacts have required fields
        const techContacts = this.getTechContactsData();
        if (techContacts && techContacts.length > 0) {
            techContacts.forEach((contact, index) => {
                if (!contact.ime || !contact.ime.trim()) {
                    errors.push({ 
                        field: 'tech_contacts', 
                        message: `Tehnički kontakt #${index + 1}: Ime je obavezno` 
                    });
                }
                if (contact.email && !this.isValidEmail(contact.email)) {
                    errors.push({ 
                        field: 'tech_contacts', 
                        message: `Tehnički kontakt #${index + 1}: Email nije ispravan` 
                    });
                }
            });
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
        return CATEGORY_TYPE_MAP[kategorija] && CATEGORY_TYPE_MAP[kategorija].includes(tip);
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
        
        // ✅ PRIORITET 2: Show toast notification with errors summary
        const errorCount = errors.length;
        const errorsList = errors.slice(0, 3).map(e => `• ${e.message}`).join('<br>');
        const moreErrors = errorCount > 3 ? `<br>...i još ${errorCount - 3} greška` : '';
        
        this.showToast(
            `Pronađeno ${errorCount} ${errorCount === 1 ? 'greška' : 'greške'}`,
            `${errorsList}${moreErrors}`,
            'error',
            6000
        );
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
    
    // Update tip options based on selected category
    updateTipOptions() {
        const kategorijaField = document.getElementById('kategorija');
        const tipField = document.getElementById('tip');
        
        if (!kategorijaField || !tipField) return;
        
        const selectedKategorija = kategorijaField.value;
        const currentTipValue = tipField.value;
        
        // Clear existing options
        tipField.innerHTML = '<option value="">Izaberite tip operatera</option>';
        
        // Add filtered options based on category
        if (selectedKategorija && CATEGORY_TYPE_MAP[selectedKategorija]) {
            CATEGORY_TYPE_MAP[selectedKategorija].forEach(tip => {
                const option = document.createElement('option');
                option.value = tip;
                option.textContent = tip;

                // Restore previously selected value if it's valid for new category
                if (tip === currentTipValue) {
                    option.selected = true;
                }

                tipField.appendChild(option);
            });
        }
    }
    
    // Validate individual field and show/hide error
    validateField(field, validator, errorMessage) {
        const fieldName = field.id;
        const fieldValue = field.value.trim();
        
        // Remove existing error message
        this.clearFieldError(field);
        
        // Skip validation if field is empty (optional fields)
        if (!fieldValue) return true;
        
        // Validate using provided validator function
        if (!validator(fieldValue)) {
            this.showFieldError(field, errorMessage);
            return false;
        }
        
        return true;
    }
    
    // Show error message for a field
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc2626';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        
        // Insert after the field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
        
        // Add error styling to field
        field.style.borderColor = '#dc2626';
        field.style.boxShadow = '0 0 0 1px #dc2626';
    }
    
    // Clear error message for a field
    clearFieldError(field) {
        // Remove error message element
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        // Reset field styling
        field.style.borderColor = '';
        field.style.boxShadow = '';
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
        
        // ✅ PRIORITET 2: Enhanced toast notification
        this.showToast(
            'Operater uspešno dodat!',
            `${operatorData.naziv} je sačuvan u bazi podataka`,
            'success',
            4000
        );
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
            
            // ✅ PRIORITET 2: Enhanced toast notification
            this.showToast(
                'Operater uspešno ažuriran!',
                `Izmene za ${operatorData.naziv} su sačuvane`,
                'success',
                4000
            );
        }
    }
    
    editOperator(id) {
        this.openModal('edit', id);
    }
    
    viewOperator(id) {
        const operator = this.operators.find(op => op.id === id);
        if (operator) {
            // Open the expandable details instead of modal
            this.operatorCard.toggleOperatorDetails(id);
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
        
        // Clean up duplicate tooltips after toggling details
        setTimeout(() => {
            this.cleanupDuplicateTooltips();
        }, 150);
    }

    // Missing methods that need to be implemented
    showNotification(message, type = 'info', duration = 3000) {
        return this.notificationManager.showNotification(message, type, duration);
    }

    clearTechContacts() {
        const container = this.elements.techContactsContainer;
        if (container) container.innerHTML = '';
    }

    clearServices() {
        const container = this.elements.servicesContainer;
        if (container) container.innerHTML = '';
    }

    clearTechnologies() {
        const container = this.elements.technologiesContainer;
        if (container) container.innerHTML = '';
    }

    addTechContactField(kontakt = null) {
        const container = this.elements.techContactsContainer;
        const index = container.children.length;

        const contactDiv = document.createElement('div');
        contactDiv.className = 'tech-contact-form';
        contactDiv.innerHTML = `
            <div class="tech-contact-header">
                <h5>Tehnički Kontakt ${index + 1}</h5>
                <button type="button" class="btn btn-outline-danger btn-sm remove-tech-contact">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Ime i prezime</label>
                    <input type="text" name="tech_contact_${index}_ime" value="${kontakt ? kontakt.ime || '' : ''}" placeholder="Zoran Sopka">
                </div>
                <div class="form-group">
                    <label>Pozicija</label>
                    <input type="text" name="tech_contact_${index}_pozicija" value="${kontakt ? kontakt.pozicija || '' : ''}" placeholder="Šef Službe za bezbjednost">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="tech_contact_${index}_email" value="${kontakt ? kontakt.email || '' : ''}" placeholder="zoran.sopka@mtel.ba">
                </div>
                <div class="form-group">
                    <label>Telefon</label>
                    <input type="text" name="tech_contact_${index}_telefon" value="${kontakt ? kontakt.telefon || '' : ''}" placeholder="+387 66 915 505">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Tip kontakta</label>
                    <select name="tech_contact_${index}_tip">
                        <option value="bezbednost" ${kontakt && kontakt.tip_kontakta === 'bezbednost' ? 'selected' : ''}>Bezbednost</option>
                        <option value="tehnicki" ${kontakt && kontakt.tip_kontakta === 'tehnicki' ? 'selected' : ''}>Tehnički</option>
                        <option value="pravni" ${kontakt && kontakt.tip_kontakta === 'pravni' ? 'selected' : ''}>Pravni</option>
                        <option value="poslovni" ${kontakt && kontakt.tip_kontakta === 'poslovni' ? 'selected' : ''}>Poslovni</option>
                    </select>
                </div>
            </div>
        `;

        container.appendChild(contactDiv);

        // Add event listener for removal
        const removeBtn = contactDiv.querySelector('.remove-tech-contact');
        removeBtn.addEventListener('click', () => {
            contactDiv.remove();
            this.reindexTechContacts();
        });
    }

    // Fix extraction functions to properly handle the nested JSON structure
    extractServicesFromDetailedStructure(operator) {
        const services = [];

        if (operator.detaljne_usluge) {
            // Flatten the nested structure
            Object.keys(operator.detaljne_usluge).forEach(category => {
                const categoryServices = operator.detaljne_usluge[category];
                if (Array.isArray(categoryServices)) {
                    categoryServices.forEach(service => {
                        if (typeof service === 'string') {
                            // Service is just a string ID
                            services.push({
                                kategorija: category,
                                naziv: service,
                                opis: '',
                                status: 'aktivna'
                            });
                        } else if (typeof service === 'object' && service.naziv) {
                            // Service is an object with properties
                            services.push({
                                kategorija: category,
                                naziv: service.naziv,
                                opis: service.opis || '',
                                status: service.status || 'aktivna'
                            });
                        }
                    });
                }
            });
        }

        return services;
    }

    extractTechnologiesFromDetailedStructure(operator) {
        const technologies = [];

        if (operator.detaljne_tehnologije) {
            // Flatten the nested structure
            Object.keys(operator.detaljne_tehnologije).forEach(category => {
                const categoryTechnologies = operator.detaljne_tehnologije[category];
                if (Array.isArray(categoryTechnologies)) {
                    categoryTechnologies.forEach(tech => {
                        if (typeof tech === 'string') {
                            // Technology is just a string ID
                            technologies.push({
                                tip: category,
                                naziv: tech,
                                opis: '',
                                kapacitet: ''
                            });
                        } else if (typeof tech === 'object' && tech.naziv) {
                            // Technology is an object with properties
                            technologies.push({
                                tip: category,
                                naziv: tech.naziv,
                                opis: tech.opis || '',
                                kapacitet: tech.kapacitet || ''
                            });
                        }
                    });
                }
            });
        }

        return technologies;
    }

    addServiceField(usluga = null, isEditMode = false, existingServices = []) {
        const container = this.elements.servicesContainer;
        const index = container.children.length;

        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-form';

        // Get standard services from catalog
        let standardServices = [];
        try {
            const catalogData = this.getStandardServicesAndTechnologies();
            standardServices = catalogData.standardServices || [];
        } catch (error) {
            console.error('Error loading services catalog:', error);
            standardServices = this.getFallbackServices();
        }

        // Filter available services
        const availableServices = standardServices.filter(service =>
            !existingServices.some(existing =>
                existing.naziv === service.naziv ||
                existing.naziv === service.naziv_en
            )
        );

        // Categories mapping
        const categoriesMap = {
            'mobile': 'Mobilni servisi',
            'fixed': 'Fiksni telefon',
            'internet': 'Internet usluge',
            'tv': 'TV usluge',
            'cloud': 'Cloud/Poslovni',
            'additional': 'Dodatne usluge',
            'security': 'Bezbednost'
        };

        // --- PATCH: Render tags with tooltips for existing services ---
        function renderServiceTag(service) {
            const tooltip = window.getServiceTooltip ? window.getServiceTooltip(service.naziv) : (service.opis || '');
            return `<span class="service-tag" data-tooltip="${tooltip}">${service.naziv}</span>`;
        }

        serviceDiv.innerHTML = `
            <div class="service-header">
                <h5>Usluga ${index + 1}</h5>
                <button type="button" class="btn btn-outline-danger btn-sm remove-service">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            ${isEditMode ? `
            <!-- EDIT MODE: Dual Section Layout -->
            <div class="edit-mode-layout">
                <!-- EXISTING SERVICES SECTION -->
                <div class="existing-services-section" style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
                    <h6 style="color: #0c4a6e; margin-bottom: 12px; font-weight: 600;">
                        <i class="fas fa-check-circle" style="color: #10b981;"></i>
                        📋 Trenutno dodane usluge (${existingServices.length})
                    </h6>
                    <div class="existing-services-list service-tags" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${existingServices.length > 0 ? existingServices.map((service, serviceIndex) => `
                            <div class="existing-service-item" style="display: flex; align-items: center; gap: 6px; background: white; border: 1px solid #10b981; border-radius: 6px; margin-bottom: 6px; padding: 4px 8px;">
                                ${renderServiceTag(service)}
                                <button type="button" class="btn btn-outline-danger btn-sm remove-existing-service"
                                        data-service-index="${serviceIndex}"
                                        style="font-size: 11px; padding: 2px 6px;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('') : '<div style="color: #6b7280; font-style: italic; padding: 10px;">Nema dodanih usluga</div>'}
                    </div>
                </div>

                <!-- AVAILABLE SERVICES SECTION -->
                <div class="available-services-section" style="padding: 15px; background: #fefce8; border: 1px solid #f59e0b; border-radius: 8px;">
                    <h6 style="color: #92400e; margin-bottom: 12px; font-weight: 600;">
                        <i class="fas fa-plus-circle" style="color: #f59e0b;"></i>
                        ➕ Dodaj nove usluge (${availableServices.length} dostupno)
                    </h6>
                    <div class="available-services-catalog" style="max-height: 250px; overflow-y: auto;">
                        ${availableServices.length > 0 ? Object.keys(categoriesMap).map(domain => {
                            const categoryServices = availableServices.filter(service => service.domain === domain);
                            return categoryServices.length > 0 ? `
                                <div class="service-category-group" style="margin-bottom: 16px;">
                                    <h6 style="color: #374151; font-weight: 600; margin-bottom: 8px; padding: 4px 8px; background: #e5e7eb; border-radius: 4px; font-size: 12px;">${categoriesMap[domain]}</h6>
                                    <div class="category-services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px;">
                                        ${categoryServices.map(service => `
                                            <div class="available-service-item"
                                                 data-domain="${service.domain}"
                                                 data-naziv="${service.naziv}"
                                                 data-opis="${service.opis}"
                                                 data-status="${service.status}"
                                                 data-tooltip="${service.opis || ''}"
                                                 style="padding: 8px 10px; background: white; border: 1px solid #d97706; border-radius: 6px; cursor: pointer; font-size: 11px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                                <div style="font-weight: 600; color: #92400e; margin-bottom: 2px;">${service.naziv}</div>
                                                <div style="color: #6b7280; font-size: 10px; line-height: 1.3;">${service.opis}</div>
                                                <div style="text-align: right; margin-top: 4px;">
                                                    <button type="button" class="add-service-btn" style="background: #f59e0b; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 9px; cursor: pointer;">
                                                        + Dodaj
                                                    </button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : '';
                        }).join('') : '<div style="color: #6b7280; font-style: italic; padding: 10px; text-align: center;">Sve dostupne usluge su već dodane</div>'}
                    </div>
                </div>
            </div>
            ` : `
            <!-- ADD MODE: Single section -->
            <div class="form-row">
                <div class="form-group">
                    <label>Kategorija usluge</label>
                    <select name="service_${index}_kategorija">
                        <option value="mobile" ${usluga && usluga.kategorija === 'mobile' ? 'selected' : ''}>Mobilni servisi</option>
                        <option value="fixed" ${usluga && usluga.kategorija === 'fixed' ? 'selected' : ''}>Fiksni telefon</option>
                        <option value="internet" ${usluga && usluga.kategorija === 'internet' ? 'selected' : ''}>Internet usluge</option>
                        <option value="tv" ${usluga && usluga.kategorija === 'tv' ? 'selected' : ''}>TV usluge</option>
                        <option value="cloud" ${usluga && usluga.kategorija === 'cloud' ? 'selected' : ''}>Cloud/Poslovni</option>
                        <option value="additional" ${usluga && usluga.kategorija === 'additional' ? 'selected' : ''}>Dodatne usluge</option>
                        <option value="security" ${usluga && usluga.kategorija === 'security' ? 'selected' : ''}>Bezbednost</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Naziv usluge</label>
                    <input type="text" name="service_${index}_naziv" value="${usluga ? usluga.naziv || '' : ''}" placeholder="Internet 100/20 Mbps">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Opis usluge</label>
                    <input type="text" name="service_${index}_opis" value="${usluga ? usluga.opis || '' : ''}" placeholder="Optički internet do 100 Mbps">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="service_${index}_status">
                        <option value="active" ${usluga && usluga.status === 'active' ? 'selected' : ''}>Aktivna</option>
                        <option value="planned" ${usluga && usluga.status === 'planned' ? 'selected' : ''}>Planirana</option>
                        <option value="deprecated" ${usluga && usluga.status === 'deprecated' ? 'selected' : ''}>Ukinuta</option>
                    </select>
                </div>
            </div>
            `}
        `;

        // PATCH: Attach tooltip logic to tags in modal
        setTimeout(() => {
            const tags = serviceDiv.querySelectorAll('.service-tag, .available-service-item');
            tags.forEach(tag => {
                tag.addEventListener('mouseenter', function(e) {
                    const tooltipText = tag.getAttribute('data-tooltip');
                    if (!tooltipText) return;
                    let tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip';
                    tooltip.textContent = tooltipText;
                    document.body.appendChild(tooltip);
                    const rect = tag.getBoundingClientRect();
                    tooltip.style.left = rect.left + window.scrollX + 'px';
                    tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 8) + 'px';
                    setTimeout(() => tooltip.classList.add('active'), 10);
                    tag._tooltip = tooltip;
                });
                tag.addEventListener('mouseleave', function(e) {
                    if (tag._tooltip) {
                        tag._tooltip.remove();
                        tag._tooltip = null;
                    }
                });
            });
        }, 0);

        container.appendChild(serviceDiv);

        // Add event listeners
        const removeBtn = serviceDiv.querySelector('.remove-service');
        removeBtn.addEventListener('click', () => {
            serviceDiv.remove();
            this.reindexServices();
        });

        if (isEditMode) {
            // Edit mode event listeners
            const removeButtons = serviceDiv.querySelectorAll('.remove-existing-service');
            removeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const serviceIndex = parseInt(button.getAttribute('data-service-index'));
                    existingServices.splice(serviceIndex, 1);
                    this.refreshServiceField(container, index, isEditMode, existingServices);
                });
            });

            const addButtons = serviceDiv.querySelectorAll('.add-service-btn');
            addButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const item = button.closest('.available-service-item');
                    const naziv = item.getAttribute('data-naziv');
                    const opis = item.getAttribute('data-opis');
                    const domain = item.getAttribute('data-domain');
                    const status = item.getAttribute('data-status');

                    existingServices.push({
                        kategorija: domain,
                        naziv: naziv,
                        opis: opis,
                        status: status
                    });

                    this.refreshServiceField(container, index, isEditMode, existingServices);
                });
            });
        }
    }

    addTechnologyField(tehnologija = null, isEditMode = false, existingTechnologies = []) {
        const container = this.elements.technologiesContainer;
        const index = container.children.length;

        const technologyDiv = document.createElement('div');
        technologyDiv.className = 'technology-form';

        // Get standard technologies from catalog
        let standardTechnologies = [];
        try {
            const catalogData = this.getStandardServicesAndTechnologies();
            standardTechnologies = catalogData.standardTechnologies || [];
        } catch (error) {
            console.error('Error loading technologies catalog:', error);
            standardTechnologies = this.getFallbackTechnologies();
        }

        // Filter available technologies
        const availableTechnologies = standardTechnologies.filter(tech =>
            !existingTechnologies.some(existing =>
                existing.naziv === tech.naziv ||
                existing.naziv === tech.naziv_en
            )
        );

        // Categories mapping
        const categoriesMap = {
            'access': 'Pristupna mreža',
            'core': 'Core mreža',
            'wireless': 'Bežične tehnologije',
            'optical': 'Optičke tehnologije',
            'transport': 'Transport tehnologije'
        };

        // --- PATCH: Render tags with tooltips for existing technologies ---
        function renderTechnologyTag(tech) {
            const tooltip = tech.opis || '';
            return `<span class="technology-tag" data-tooltip="${tooltip}">${tech.naziv}</span>`;
        }

        technologyDiv.innerHTML = `
            <div class="technology-header">
                <h5>Tehnologija ${index + 1}</h5>
                <button type="button" class="btn btn-outline-danger btn-sm remove-technology">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            ${isEditMode ? `
            <!-- EDIT MODE: Dual Section Layout -->
            <div class="edit-mode-layout">
                <!-- EXISTING TECHNOLOGIES SECTION -->
                <div class="existing-technologies-section" style="margin-bottom: 20px; padding: 15px; background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px;">
                    <h6 style="color: #065f46; margin-bottom: 12px; font-weight: 600;">
                        <i class="fas fa-check-circle" style="color: #10b981;"></i>
                        📋 Trenutno dodane tehnologije (${existingTechnologies.length})
                    </h6>
                    <div class="existing-technologies-list technology-tags" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${existingTechnologies.length > 0 ? existingTechnologies.map((tech, techIndex) => `
                            <div class="existing-technology-item" style="display: flex; align-items: center; gap: 6px; background: white; border: 1px solid #10b981; border-radius: 6px; margin-bottom: 6px; padding: 4px 8px;">
                                ${renderTechnologyTag(tech)}
                                <button type="button" class="btn btn-outline-danger btn-sm remove-existing-technology"
                                        data-technology-index="${techIndex}"
                                        style="font-size: 11px; padding: 2px 6px;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('') : '<div style="color: #6b7280; font-style: italic; padding: 10px;">Nema dodanih tehnologija</div>'}
                    </div>
                </div>

                <!-- AVAILABLE TECHNOLOGIES SECTION -->
                <div class="available-technologies-section" style="padding: 15px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px;">
                    <h6 style="color: #78350f; margin-bottom: 12px; font-weight: 600;">
                        <i class="fas fa-plus-circle" style="color: #f59e0b;"></i>
                        ➕ Dodaj nove tehnologije (${availableTechnologies.length} dostupno)
                    </h6>
                    <div class="available-technologies-catalog" style="max-height: 250px; overflow-y: auto;">
                        ${availableTechnologies.length > 0 ? Object.keys(categoriesMap).map(domain => {
                            const categoryTechnologies = availableTechnologies.filter(tech => tech.domain === domain);
                            return categoryTechnologies.length > 0 ? `
                                <div class="technology-category-group" style="margin-bottom: 16px;">
                                    <h6 style="color: #374151; font-weight: 600; margin-bottom: 8px; padding: 4px 8px; background: #e5e7eb; border-radius: 4px; font-size: 12px;">${categoriesMap[domain]}</h6>
                                    <div class="category-technologies-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px;">
                                        ${categoryTechnologies.map(tech => `
                                            <div class="available-technology-item"
                                                 data-domain="${tech.domain}"
                                                 data-naziv="${tech.naziv}"
                                                 data-opis="${tech.opis}"
                                                 data-tip="${tech.domain}"
                                                 data-kapacitet="${tech.kapacitet || ''}"
                                                 data-tooltip="${tech.opis || ''}"
                                                 style="padding: 8px 10px; background: white; border: 1px solid #d97706; border-radius: 6px; cursor: pointer; font-size: 11px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                                <div style="font-weight: 600; color: #78350f; margin-bottom: 2px;">${tech.naziv}</div>
                                                <div style="color: #6b7280; font-size: 10px; line-height: 1.3;">${tech.opis}</div>
                                                ${tech.kapacitet ? `<div style="color: #0ea5e9; font-size: 9px; margin-top: 2px;">⚡ ${tech.kapacitet}</div>` : ''}
                                                <div style="text-align: right; margin-top: 4px;">
                                                    <button type="button" class="add-technology-btn" style="background: #f59e0b; color: white; border: none; padding: 2px 6px; border-radius: 3px; font-size: 9px; cursor: pointer;">
                                                        + Dodaj
                                                    </button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : '';
                        }).join('') : '<div style="color: #6b7280; font-style: italic; padding: 10px; text-align: center;">Sve dostupne tehnologije su već dodane</div>'}
                    </div>
                </div>
            </div>
            ` : `
            <!-- ADD MODE: Single section -->
            <div class="form-row">
                <div class="form-group">
                    <label>Tip tehnologije</label>
                    <select name="technology_${index}_tip">
                        <option value="access" ${tehnologija && tehnologija.tip === 'access' ? 'selected' : ''}>Pristupna mreža</option>
                        <option value="core" ${tehnologija && tehnologija.tip === 'core' ? 'selected' : ''}>Core mreža</option>
                        <option value="wireless" ${tehnologija && tehnologija.tip === 'wireless' ? 'selected' : ''}>Bežične tehnologije</option>
                        <option value="optical" ${tehnologija && tehnologija.tip === 'optical' ? 'selected' : ''}>Optičke tehnologije</option>
                        <option value="transport" ${tehnologija && tehnologija.tip === 'transport' ? 'selected' : ''}>Transport tehnologije</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Naziv tehnologije</label>
                    <input type="text" name="technology_${index}_naziv" value="${tehnologija ? tehnologija.naziv || '' : ''}" placeholder="FTTH, xDSL, LTE...">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Opis tehnologije</label>
                    <input type="text" name="technology_${index}_opis" value="${tehnologija ? tehnologija.opis || '' : ''}" placeholder="Optička pristupna mreža">
                </div>
                <div class="form-group">
                    <label>Kapacitet</label>
                    <input type="text" name="technology_${index}_kapacitet" value="${tehnologija ? tehnologija.kapacitet || '' : ''}" placeholder="Npr. 1 Gbps">
                </div>
            </div>
            `}
        `;

        // PATCH: Attach tooltip logic to tags in modal
        setTimeout(() => {
            const tags = technologyDiv.querySelectorAll('.technology-tag, .available-technology-item');
            tags.forEach(tag => {
                tag.addEventListener('mouseenter', function(e) {
                    const tooltipText = tag.getAttribute('data-tooltip');
                    if (!tooltipText) return;
                    let tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip';
                    tooltip.textContent = tooltipText;
                    document.body.appendChild(tooltip);
                    const rect = tag.getBoundingClientRect();
                    tooltip.style.left = rect.left + window.scrollX + 'px';
                    tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 8) + 'px';
                    setTimeout(() => tooltip.classList.add('active'), 10);
                    tag._tooltip = tooltip;
                });
                tag.addEventListener('mouseleave', function(e) {
                    if (tag._tooltip) {
                        tag._tooltip.remove();
                        tag._tooltip = null;
                    }
                });
            });
        }, 0);

        container.appendChild(technologyDiv);

        // Add event listeners
        const removeBtn = technologyDiv.querySelector('.remove-technology');
        removeBtn.addEventListener('click', () => {
            technologyDiv.remove();
            this.reindexTechnologies();
        });

        if (isEditMode) {
            // Edit mode event listeners
            const removeButtons = technologyDiv.querySelectorAll('.remove-existing-technology');
            removeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const technologyIndex = parseInt(button.getAttribute('data-technology-index'));
                    existingTechnologies.splice(technologyIndex, 1);
                    this.refreshTechnologyField(container, index, isEditMode, existingTechnologies);
                });
            });

            const addButtons = technologyDiv.querySelectorAll('.add-technology-btn');
            addButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const item = button.closest('.available-technology-item');
                    const naziv = item.getAttribute('data-naziv');
                    const opis = item.getAttribute('data-opis');
                    const domain = item.getAttribute('data-domain');
                    const tip = item.getAttribute('data-tip');
                    const kapacitet = item.getAttribute('data-kapacitet');

                    existingTechnologies.push({
                        tip: tip,
                        naziv: naziv,
                        opis: opis,
                        kapacitet: kapacitet
                    });

                    this.refreshTechnologyField(container, index, isEditMode, existingTechnologies);
                });
            });
        }
    }

    cleanupDuplicateTooltips() {
        // Remove duplicate tooltips
        const tooltips = document.querySelectorAll('.tooltip');
        const seen = new Set();

        tooltips.forEach(tooltip => {
            const text = tooltip.textContent.trim();
            if (seen.has(text)) {
                tooltip.remove();
            } else {
                seen.add(text);
            }
        });
    }

    // NOTE: Consolidated extractServicesFromDetailedStructure and extractTechnologiesFromDetailedStructure
    // are defined earlier (around line 1628-1696) and handle both flat and nested structures
    // These duplicate methods are removed to prevent conflicts

    getTechContactsData() {
        const contacts = [];
        const contactForms = this.elements.techContactsContainer.querySelectorAll('.tech-contact-form');

        contactForms.forEach((form, index) => {
            const ime = form.querySelector(`[name="tech_contact_${index}_ime"]`).value.trim();
            const pozicija = form.querySelector(`[name="tech_contact_${index}_pozicija"]`).value.trim();
            const email = form.querySelector(`[name="tech_contact_${index}_email"]`).value.trim();
            const telefon = form.querySelector(`[name="tech_contact_${index}_telefon"]`).value.trim();
            const tip_kontakta = form.querySelector(`[name="tech_contact_${index}_tip"]`).value;

            if (ime || pozicija || email || telefon) {
                contacts.push({
                    ime,
                    pozicija,
                    email,
                    telefon,
                    tip_kontakta
                });
            }
        });

        return contacts;
    }

    getServicesData() {
        const services = [];
        const serviceForms = this.elements.servicesContainer.querySelectorAll('.service-form');

        serviceForms.forEach((form, index) => {
            // Check if this is edit mode (has existing services section)
            const existingServicesSection = form.querySelector('.existing-services-section');
            if (existingServicesSection) {
                // EDIT MODE: Get services from the existing services list
                const existingItems = form.querySelectorAll('.existing-service-item');
                existingItems.forEach(item => {
                    const serviceName = item.querySelector('span[style*="font-weight: 600"]');
                    const serviceDesc = item.querySelector('small');
                    if (serviceName) {
                        services.push({
                            kategorija: 'unknown', // Will be updated when saving
                            naziv: serviceName.textContent.trim(),
                            opis: serviceDesc ? serviceDesc.textContent.trim() : '',
                            status: 'aktivna'
                        });
                    }
                });
            } else {
                // ADD MODE: Get services from form inputs
                const kategorija = form.querySelector(`[name="service_${index}_kategorija"]`)?.value;
                const naziv = form.querySelector(`[name="service_${index}_naziv"]`)?.value?.trim();
                const opis = form.querySelector(`[name="service_${index}_opis"]`)?.value?.trim();
                const status = form.querySelector(`[name="service_${index}_status"]`)?.value;

                if (naziv || opis) {
                    services.push({
                        kategorija,
                        naziv,
                        opis,
                        status
                    });
                }
            }
        });

        return services;
    }

    getTechnologiesData() {
        const technologies = [];
        const technologyForms = this.elements.technologiesContainer.querySelectorAll('.technology-form');

        technologyForms.forEach((form, index) => {
            // Check if this is edit mode (has existing technologies section)
            const existingTechnologiesSection = form.querySelector('.existing-technologies-section');
            if (existingTechnologiesSection) {
                // EDIT MODE: Get technologies from the existing technologies list
                const existingItems = form.querySelectorAll('.existing-technology-item');
                existingItems.forEach(item => {
                    const techName = item.querySelector('span[style*="font-weight: 600"]');
                    const techDesc = item.querySelector('small');
                    if (techName) {
                        technologies.push({
                            tip: 'unknown', // Will be updated when saving
                            naziv: techName.textContent.trim(),
                            opis: techDesc ? techDesc.textContent.trim() : '',
                            kapacitet: ''
                        });
                    }
                });
            } else {
                // ADD MODE: Get technologies from form inputs
                const tip = form.querySelector(`[name="technology_${index}_tip"]`)?.value;
                const naziv = form.querySelector(`[name="technology_${index}_naziv"]`)?.value?.trim();
                const opis = form.querySelector(`[name="technology_${index}_opis"]`)?.value?.trim();
                const kapacitet = form.querySelector(`[name="technology_${index}_kapacitet"]`)?.value?.trim();

                if (naziv || opis) {
                    technologies.push({
                        tip,
                        naziv,
                        opis,
                        kapacitet
                    });
                }
            }
        });

        return technologies;
    }

    reindexTechContacts() {
        const contacts = this.elements.techContactsContainer.querySelectorAll('.tech-contact-form');
        contacts.forEach((contact, index) => {
            const inputs = contact.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name && name.startsWith('tech_contact_')) {
                    const newName = name.replace(/tech_contact_\d+_/, 'tech_contact_' + index + '_');
                    input.setAttribute('name', newName);
                }
            });

            const header = contact.querySelector('h5');
            if (header) {
                header.textContent = 'Tehnički Kontakt ' + (index + 1);
            }
        });
    }

    reindexServices() {
        const services = this.elements.servicesContainer.querySelectorAll('.service-form');
        services.forEach((service, index) => {
            const inputs = service.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name && name.startsWith('service_')) {
                    const newName = name.replace(/service_\d+_/, 'service_' + index + '_');
                    input.setAttribute('name', newName);
                }
            });

            const header = service.querySelector('h5');
            if (header) {
                header.textContent = 'Usluga ' + (index + 1);
            }
        });
    }

    reindexTechnologies() {
        const technologies = this.elements.technologiesContainer.querySelectorAll('.technology-form');
        technologies.forEach((technology, index) => {
            const inputs = technology.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name && name.startsWith('technology_')) {
                    const newName = name.replace(/technology_\d+_/, 'technology_' + index + '_');
                    input.setAttribute('name', newName);
                }
            });

            const header = technology.querySelector('h5');
            if (header) {
                header.textContent = 'Tehnologija ' + (index + 1);
            }
        });
    }

    refreshServiceField(container, index, isEditMode, existingServices) {
        // Remove the current service field
        const currentField = container.children[index];
        if (currentField) {
            currentField.remove();
        }

        // Re-add the service field with updated data
        this.addServiceField(null, isEditMode, existingServices);
    }

    refreshTechnologyField(container, index, isEditMode, existingTechnologies) {
        // Remove the current technology field
        const currentField = container.children[index];
        if (currentField) {
            currentField.remove();
        }

        // Re-add the technology field with updated data
        this.addTechnologyField(null, isEditMode, existingTechnologies);
    }

    // Use the imported standard catalog with legacy compatibility
    getStandardServicesAndTechnologies() {
        return {
            standardServices: standardCatalog.services,
            standardTechnologies: standardCatalog.technologies
        };
    }

    // Fallback functions for catalog
    getFallbackTechnologies() {
        return [
            { tip: "bezicna", naziv: "2G GSM", opis: "Druga generacija mobilnih mreža", kapacitet: "64 kbps" },
            { tip: "bezicna", naziv: "3G UMTS", opis: "Treća generacija mobilnih mreža", kapacitet: "2 Mbps" },
            { tip: "bezicna", naziv: "4G LTE", opis: "Četvrta generacija mobilnih mreža", kapacitet: "150 Mbps" },
            { tip: "bezicna", naziv: "5G", opis: "Peta generacija mobilnih mreža", kapacitet: "20 Gbps" },
            { tip: "pristupna", naziv: "FTTH", opis: "Fiber to the Home", kapacitet: "1 Gbps" },
            { tip: "pristupna", naziv: "xDSL", opis: "Digital Subscriber Line", kapacitet: "100 Mbps" },
            { tip: "pristupna", naziv: "DOCSIS", opis: "Cable modem technology", kapacitet: "500 Mbps" },
            { tip: "transportna", naziv: "MPLS", opis: "Multiprotocol Label Switching", kapacitet: "10 Gbps" },
            { tip: "transportna", naziv: "Ethernet", opis: "Gigabit Ethernet", kapacitet: "1 Gbps" },
            { tip: "core", naziv: "IPv6", opis: "Internet Protocol version 6", kapacitet: "Unlimited" },
            { tip: "core", naziv: "CG-NAT", opis: "Carrier Grade NAT", kapacitet: "100 Gbps" },
            { tip: "satelitska", naziv: "VSAT", opis: "Very Small Aperture Terminal", kapacitet: "50 Mbps" }
        ];
    }

    getFallbackServices() {
        return [
            { kategorija: "mobilni", naziv: "Mobilni Prepaid", opis: "Mobilne usluge na prepaid osnovu", status: "aktivna" },
            { kategorija: "mobilni", naziv: "Mobilni Postpaid", opis: "Mobilne usluge na postpaid osnovu", status: "aktivna" },
            { kategorija: "mobilni", naziv: "eSIM", opis: "Elektronska SIM kartica", status: "aktivna" },
            { kategorija: "internet", naziv: "FTTH Internet", opis: "Fiber to the Home internet", status: "aktivna" },
            { kategorija: "internet", naziv: "ADSL/VDSL Internet", opis: "Internet preko bakarnih linija", status: "aktivna" },
            { kategorija: "televizija", naziv: "IPTV", opis: "TV preko IP mreže", status: "aktivna" },
            { kategorija: "televizija", naziv: "Satelitska TV", opis: "TV preko satelita", status: "aktivna" },
            { kategorija: "cloud", naziv: "Cloud Hosting", opis: "Hosting usluge u oblaku", status: "aktivna" },
            { kategorija: "cloud", naziv: "Data Center", opis: "Data center usluge", status: "aktivna" },
            { kategorija: "ostalo", naziv: "Prodaja uređaja", opis: "Prodaja telekom opreme", status: "aktivna" }
        ];
    }

    showCORSWarning() {
        this.showNotification('CORS greška - pokrenite HTTP server: python -m http.server 8000', 'error', 10000);
    }

    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    getCategoryClass(operator) {
        const naziv = operator.naziv.toLowerCase();
        const komercijalni = (operator.komercijalni_naziv || '').toLowerCase();
        const tip = operator.tip.toLowerCase();

        // Dominantni operateri
        if (naziv.includes('bh telecom') || komercijalni.includes('bh telecom') ||
            naziv.includes('ht eronet') || komercijalni.includes('eronet') ||
            naziv.includes('telekom srpske') || komercijalni.includes('m:tel') || komercijalni.includes('mtel')) {
            return 'dominantni';
        }

        // Mobilni/MVNO operateri
        if (tip.includes('mvno') || tip.includes('mobilni') ||
            komercijalni.includes('zona.ba') || komercijalni.includes('haloo') ||
            komercijalni.includes('one') || komercijalni.includes('logosoft') ||
            komercijalni.includes('novotel')) {
            return 'mobilni';
        }

        // B2B/Enterprise operateri
        if (tip.includes('b2b') || tip.includes('enterprise') || tip.includes('carrier') ||
            tip.includes('veleprodajne') || tip.includes('konsalting') ||
            naziv.includes('akton') || naziv.includes('lanaco') || naziv.includes('prointer')) {
            return 'b2b';
        }

        // ISP operateri (default za sve ostale)
        return 'isp';
    }

    getCategoryDisplay(operator) {
        const categoryClass = this.getCategoryClass(operator);
        const categoryMap = {
            'dominantni': '🏢 Dominantni',
            'mobilni': '📱 Mobilni/MVNO',
            'isp': '🌐 Regionalni ISP',
            'b2b': '💼 Enterprise/B2B'
        };
        return categoryMap[categoryClass] || '❓ Ostalo';
    }

    /**
     * Get existing services from form (helper for button click)
     */
    getExistingServicesFromForm() {
        const services = [];
        const serviceForms = this.elements.servicesContainer.querySelectorAll('.service-form');
        
        serviceForms.forEach((form) => {
            const existingSection = form.querySelector('.existing-services-section');
            if (existingSection) {
                const items = existingSection.querySelectorAll('.existing-service-item');
                items.forEach(item => {
                    const nameSpan = item.querySelector('span[style*="font-weight: 600"]');
                    const descSpan = item.querySelector('small');
                    if (nameSpan) {
                        services.push({
                            naziv: nameSpan.textContent.trim(),
                            opis: descSpan ? descSpan.textContent.trim() : '',
                            status: 'aktivna'
                        });
                    }
                });
            }
        });
        
        return services;
    }

    /**
     * Get existing technologies from form (helper for button click)
     */
    getExistingTechnologiesFromForm() {
        const technologies = [];
        const technologyForms = this.elements.technologiesContainer.querySelectorAll('.technology-form');
        
        technologyForms.forEach((form) => {
            const existingSection = form.querySelector('.existing-technologies-section');
            if (existingSection) {
                const items = existingSection.querySelectorAll('.existing-technology-item');
                items.forEach(item => {
                    const nameSpan = item.querySelector('span[style*="font-weight: 600"]');
                    const descSpan = item.querySelector('small');
                    if (nameSpan) {
                        technologies.push({
                            naziv: nameSpan.textContent.trim(),
                            opis: descSpan ? descSpan.textContent.trim() : '',
                            tip: 'access'
                        });
                    }
                });
            }
        });
        
        return technologies;
    }

    // Legacy method - no longer needed as we have real data
    addTestServicesAndTechnologies() {
        // This method was used to add test data during development
        // Now we load real data from operateri.json and LocalStorage
        // Keeping empty implementation to prevent errors
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

    // ✅ PRIORITET 2: Progress Bar & Real-time Validation Methods

    /**
     * Update form progress bar based on filled fields
     */
    updateFormProgress() {
        const progressFill = document.getElementById('formProgressFill');
        const progressText = document.getElementById('formProgressText');
        
        if (!progressFill || !progressText) return;

        // Calculate progress based on form completion
        const formData = new FormData(this.elements.operatorForm);
        
        let totalFields = 0;
        let filledFields = 0;

        // Basic required fields (weight: 2 points each)
        const requiredFields = ['naziv', 'kategorija', 'tip', 'status'];
        requiredFields.forEach(field => {
            totalFields += 2;
            const value = formData.get(field);
            if (value && value.trim()) filledFields += 2;
        });

        // Optional basic fields (weight: 1 point each)
        const optionalFields = ['komercijalni_naziv', 'opis', 'napomena', 'adresa', 'telefon', 'email', 'web', 'kontakt_osoba', 'prioritet', 'atlas_status'];
        optionalFields.forEach(field => {
            totalFields += 1;
            const value = formData.get(field);
            if (value && value.trim()) filledFields += 1;
        });

        // Services (weight: 3 points)
        totalFields += 3;
        const services = this.getServicesData();
        if (services && services.length > 0) filledFields += 3;

        // Technologies (weight: 3 points)
        totalFields += 3;
        const technologies = this.getTechnologiesData();
        if (technologies && technologies.length > 0) filledFields += 3;

        // Technical contacts (weight: 2 points)
        totalFields += 2;
        const techContacts = this.getTechContactsData();
        if (techContacts && techContacts.length > 0) filledFields += 2;

        const percentage = Math.round((filledFields / totalFields) * 100);
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% kompletno`;

        // Update section statuses
        this.updateSectionStatus('basic', this.isBasicSectionComplete(formData));
        this.updateSectionStatus('contact', this.isContactSectionComplete(formData));
        this.updateSectionStatus('services', services && services.length > 0);
        this.updateSectionStatus('technologies', technologies && technologies.length > 0);
        this.updateSectionStatus('tech-contacts', techContacts && techContacts.length > 0);
    }

    /**
     * Check if basic section is complete
     */
    isBasicSectionComplete(formData) {
        const requiredFields = ['naziv', 'kategorija', 'tip', 'status'];
        return requiredFields.every(field => {
            const value = formData.get(field);
            return value && value.trim();
        });
    }

    /**
     * Check if contact section is complete
     */
    isContactSectionComplete(formData) {
        const fields = ['telefon', 'email', 'web'];
        return fields.some(field => {
            const value = formData.get(field);
            return value && value.trim();
        });
    }

    /**
     * Update section status indicator
     */
    updateSectionStatus(sectionName, isComplete) {
        const sectionElement = document.querySelector(`.section-status[data-section="${sectionName}"]`);
        if (!sectionElement) return;

        sectionElement.classList.remove('complete', 'incomplete');
        
        if (isComplete) {
            sectionElement.classList.add('complete');
            sectionElement.querySelector('i').className = 'fas fa-check-circle';
        } else {
            sectionElement.classList.add('incomplete');
            sectionElement.querySelector('i').className = 'fas fa-exclamation-circle';
        }
    }

    /**
     * Show toast notification
     */
    showToast(title, message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="toast-icon">${iconMap[type] || 'ℹ'}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Setup real-time form monitoring
     */
    setupFormMonitoring() {
        // Monitor all form inputs for progress updates
        const form = this.elements.operatorForm;
        if (!form) return;

        const allInputs = form.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateFormProgress();
            });
            input.addEventListener('change', () => {
                this.updateFormProgress();
            });
        });

        // Also monitor when services/technologies are added/removed
        const observer = new MutationObserver(() => {
            this.updateFormProgress();
        });

        if (this.elements.servicesContainer) {
            observer.observe(this.elements.servicesContainer, { childList: true, subtree: true });
        }
        if (this.elements.technologiesContainer) {
            observer.observe(this.elements.technologiesContainer, { childList: true, subtree: true });
        }
        if (this.elements.techContactsContainer) {
            observer.observe(this.elements.techContactsContainer, { childList: true, subtree: true });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ATLASApp();
});

// CSS styles are handled in styles.css file
