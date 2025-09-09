// ATLAS Telekomunikacioni Operateri BiH - Aplikacija
// Version: 1.0
// Date: 2025-07-31

// Mapping funkcije za čitljive nazive
function getReadableTechName(techKey) {
    const techMap = {
        // Mobilne tehnologije
        'tech_2g': 'GSM 2G',
        'tech_3g': 'UMTS 3G', 
        'tech_4g': 'LTE 4G',
        'tech_4g_lte': 'LTE 4G',
        'tech_5g_ready': '5G Ready',
        'tech_5g': '5G',
        'tech_volte': 'VoLTE',
        'tech_vowifi': 'VoWiFi',
        'tech_ims_mobile': 'IMS Mobile',
        'tech_hlr_hss': 'HLR/HSS',
        'tech_eir': 'EIR',
        'tech_smsc_mmsc': 'SMSC/MMSC',
        'tech_mvno': 'MVNO Platform',
        'tech_esim': 'eSIM',
        'tech_mnp': 'MNP',
        
        // Fiksne tehnologije
        'tech_pstn': 'PSTN',
        'tech_isdn': 'ISDN',
        'tech_voip_fixed': 'VoIP Fixed',
        'tech_ims_fixed': 'IMS Fixed',
        'tech_softswitch_fixed': 'Softswitch',
        
        // Mrežne tehnologije
        'tech_ftth_fttb': 'FTTH/FTTB',
        'tech_xdsl': 'xDSL',
        'tech_docsis': 'DOCSIS',
        'tech_ipv4': 'IPv4',
        'tech_ipv6': 'IPv6',
        'tech_cgnat': 'CG-NAT',
        'tech_mpls': 'MPLS',
        'tech_sdwan': 'SD-WAN',
        'tech_cdn': 'CDN',
        'tech_fixed_wireless': 'Fixed Wireless',
        'tech_satellite': 'Satellite',
        'tech_vsat': 'VSAT',
        'tech_cable': 'Cable',
        'tech_fiber': 'Fiber Optic',
        'tech_data_center': 'Data Center',
        'tech_cloud': 'Cloud',
        'tech_cybersecurity': 'Cybersecurity',
        'tech_sip': 'SIP',
        'tech_vpn': 'VPN',
        'iptv_platform': 'IPTV Platform',
        'satellite_tv_infrastructure': 'Satellite TV',
        'tech_multiplex_d': 'Multiplex D',
        'tech_digital_terrestrial': 'Digital Terrestrial'
    };
    
    return techMap[techKey] || techKey.replace('tech_', '').replace(/_/g, ' ').toUpperCase();
}

function getReadableServiceName(serviceKey) {
    const serviceMap = {
        // Mobilne usluge
        'mobile_prepaid': 'Mobilni Prepaid',
        'mobile_postpaid': 'Mobilni Postpaid',
        'mobile_esim': 'eSIM',
        'mobile_volte_vowifi': 'VoLTE/VoWiFi',
        'mobile_roaming': 'Roaming',
        'mobile_mnp': 'MNP',
        'roaming_internet_options': 'Roaming Internet',
        
        // Fiksne usluge
        'fixed_pstn': 'PSTN',
        'fixed_isdn': 'ISDN',
        'fixed_voip': 'VoIP',
        'ip_centrex': 'IP Centrex',
        'fixed_portability': 'Portabilnost Brojeva',
        'glasovna_posta': 'Glasovna Pošta',
        
        // Internet usluge
        'internet_ftth': 'FTTH Internet',
        'internet_flat': 'Flat Internet',
        'internet_flying': 'Flying Internet',
        'internet_adsl_vdsl': 'ADSL/VDSL',
        'internet_mobile': 'Mobilni Internet',
        'internet_business': 'Poslovni Internet',
        'internet_dedicated': 'Dedicated Internet',
        'internet_vpn': 'VPN Internet',
        'internet_fixed_wireless': 'Fixed Wireless',
        'internet_satellite': 'Satelitski Internet',
        'internet_cable': 'Kablovski Internet',
        'netbiz_packages': 'NetBiz Paketi',
        'business_internet_packages': 'Poslovni Paketi',
        
        // TV usluge
        'sat_tv': 'Satelitska TV',
        'iptv': 'IPTV',
        'tv_streaming': 'TV Streaming',
        'cable_tv': 'Kablovska TV',
        'digital_tv': 'Digitalna TV',
        'multiplex_d_tv': 'Multiplex D TV',
        
        // Cloud/Poslovne usluge
        'data_center': 'Data Center',
        'system_integration': 'Sistemska Integracija',
        'smart_city': 'Smart City',
        'smart_home': 'Smart Home',
        'cloud_hosting': 'Cloud Hosting',
        'cloud_backup': 'Cloud Backup',
        'cloud_infra': 'Cloud Infrastruktura',
        'cybersecurity': 'Cyber Security',
        'it_consulting': 'IT Konsalting',
        'colocation': 'Colocation',
        'wholesale_services': 'Veleprodajne Usluge',
        'sms_gateway': 'SMS Gateway',
        'telemach_app': 'Telemach App',
        
        // Dodatne usluge
        'device_sales': 'Prodaja Uređaja',
        'terminal_equipment': 'Terminalna Oprema',
        'router_sales': 'Prodaja Rutera'
    };
    
    return serviceMap[serviceKey] || serviceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getTechTooltip(techKey) {
    const tooltips = {
        'tech_2g': 'Druga generacija mobilnih mreža (GSM 900/1800 MHz)',
        'tech_3g': 'Treća generacija mobilnih mreža (UMTS 900/2100 MHz)',
        'tech_4g': 'Četvrta generacija mobilnih mreža (LTE 800/1800/2600 MHz)',
        'tech_4g_lte': 'Long Term Evolution - napredna 4G tehnologija',
        'tech_5g_ready': '5G Ready infrastruktura spremna za nadogradnju',
        'tech_volte': 'Voice over LTE - glasovni pozivi preko 4G mreže',
        'tech_vowifi': 'Voice over WiFi - glasovni pozivi preko WiFi',
        'tech_ims_mobile': 'IP Multimedia Subsystem za mobilne usluge',
        'tech_hlr_hss': 'Home Location Register / Home Subscriber Server',
        'tech_eir': 'Equipment Identity Register - registar uređaja',
        'tech_smsc_mmsc': 'SMS/MMS Center - centri za tekstualne poruke',
        'tech_ftth_fttb': 'Fiber to the Home/Building - optika do objekta',
        'tech_xdsl': 'Digital Subscriber Line tehnologije',
        'tech_docsis': 'Data Over Cable Service Interface - kablovski internet',
        'tech_ipv4': 'Internet Protocol verzija 4',
        'tech_ipv6': 'Internet Protocol verzija 6 - nova generacija',
        'tech_cgnat': 'Carrier Grade Network Address Translation',
        'tech_mpls': 'Multi-Protocol Label Switching',
        'tech_sdwan': 'Software Defined Wide Area Network',
        'tech_fixed_wireless': 'Bežični pristup fiksnoj lokaciji',
        'tech_satellite': 'Satelitske komunikacije',
        'tech_vsat': 'Very Small Aperture Terminal',
        'tech_pstn': 'Public Switched Telephone Network',
        'tech_isdn': 'Integrated Services Digital Network',
        'tech_voip_fixed': 'Voice over IP za fiksne linije',
        'iptv_platform': 'Internet Protocol Television platforma',
        'tech_multiplex_d': 'Multiplex D - digitalna radiodifuzija',
        'tech_digital_terrestrial': 'Digitalna zemaljska radiodifuzija',
        'tech_esim': 'Embedded SIM - digitalna SIM kartica',
        'tech_mnp': 'Mobile Number Portability - prenos brojeva'
    };
    
    return tooltips[techKey] || 'Napredna telekomunikaciona tehnologija';
}

function getServiceTooltip(serviceKey) {
    const tooltips = {
        'mobile_prepaid': 'Mobilne usluge sa pretplatom - plaćanje unapred',
        'mobile_postpaid': 'Mobilne usluge sa pretplatom - mesečno naplaćivanje',
        'mobile_esim': 'Embedded SIM - digitalna SIM kartica',
        'mobile_volte_vowifi': 'HD glasovni pozivi preko 4G/WiFi mreža',
        'mobile_roaming': 'Korišćenje usluga van domaće mreže',
        'mobile_mnp': 'Mobile Number Portability - prenos broja',
        'internet_ftth': 'Optički internet direktno do objekta',
        'internet_flat': 'Neograničeni internet bez FUP ograničenja',
        'internet_adsl_vdsl': 'Internet preko bakarnih linija',
        'internet_business': 'Poslovni internet sa SLA garantijama',
        'internet_dedicated': 'Dedicirani internet sa garantovanom brzinom',
        'sat_tv': 'Satelitska televizija sa HD/4K kvalitetom',
        'iptv': 'Televizija preko internet protokola',
        'data_center': 'Hosting i colocation usluge',
        'cloud_hosting': 'Virtuelni serveri u oblaku',
        'cybersecurity': 'Zaštita od cyber pretnji i napada',
        'smart_city': 'IoT rešenja za pametne gradove',
        'wholesale_services': 'B2B2C usluge za druge operatere',
        'internet_cable': 'Internet preko kablovskih mreža',
        'digital_tv': 'Digitalna televizija sa HD kvalitetom',
        'cable_tv': 'Kablovska televizija',
        'fixed_voip': 'VoIP telefonija za domaćinstva i preduzeća'
    };
    
    return tooltips[serviceKey] || 'Telekomunikaciona usluga za krajnje korisnike';
}

// Category-Type mapping for dynamic filtering
const categoryTypeMap = {
  'dominantni': ['Dominantni operater'],
  'mobilni_mvno': ['Mobilni operater', 'MVNO operater'],
  'regionalni_isp': ['Internet servis provajder', 'Kablovski operater'],
  'enterprise_b2b': ['B2B provajder', 'IT provajder']
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
            
            // Clean up any duplicate tooltips after initialization
            setTimeout(() => {
                this.cleanupDuplicateTooltips();
            }, 200);
            
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
        
        this.elements.clearSearchBtn.addEventListener('click', () => {
            this.clearSearch();
        });
        
        this.elements.statusFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        this.elements.typeFilter.addEventListener('change', () => {
            this.applyFilters();
        });
        
        // Quick Category Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickFilter(e.target.dataset.category);
            });
        });
        
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
        
        tbody.innerHTML = operators.map(operator => {
            // Apply highlighting if search term exists
            const naziv = this.highlightSearchTerm ? 
                this.highlightText(operator.naziv, this.highlightSearchTerm) : operator.naziv;
            const komercijalni = this.highlightSearchTerm && operator.komercijalni_naziv ? 
                this.highlightText(operator.komercijalni_naziv, this.highlightSearchTerm) : operator.komercijalni_naziv;
            const tip = this.highlightSearchTerm ? 
                this.highlightText(operator.tip, this.highlightSearchTerm) : operator.tip;
            
            return `
            <tr class="fade-in operator-row" data-id="${operator.id}" onclick="app.toggleOperatorDetails(${operator.id})">
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
                        <button class="action-btn delete" onclick="event.stopPropagation(); app.deleteOperator(${operator.id})" title="Obriši">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
            <tr class="operator-details" id="details-${operator.id}">
                <td colspan="7">
                    <div class="operator-details-content">
                        ${this.generateOperatorDetails(operator)}
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
        console.log('handleQuickFilter pozvan sa kategorijom:', category);
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const filterBtn = document.querySelector(`[data-category="${category}"]`);
        if (filterBtn) {
            filterBtn.classList.add('active');
            console.log('Filter dugme aktivirano za kategoriju:', category);
        } else {
            console.warn('Filter dugme za kategoriju "' + category + '" nije pronađeno');
            return;
        }
        
        // Filter operators
        if (category === 'all') {
            this.renderOperators();
            console.log('Prikazani svi operateri');
        } else {
            const filtered = this.operators.filter(op => this.getCategoryClass(op) === category);
            this.renderOperators(filtered);
            console.log('Filtrirano operatera po kategoriji "' + category + '":', filtered.length);
        }
    }
    
    openModal(mode, operatorId = null) {
        this.currentEditId = operatorId;
        
        if (mode === 'add') {
            this.elements.modalTitle.textContent = 'Dodaj Novog Operatera';
            this.elements.saveBtn.textContent = 'Sačuvaj';
            this.elements.operatorForm.reset();
        } else if (mode === 'edit' && operatorId) {
            const operator = this.operators.find(op => op.id === operatorId);
            if (operator) {
                this.elements.modalTitle.textContent = `Uređivanje operatera: ${operator.naziv}`;
                this.elements.saveBtn.textContent = 'Ažuriraj Izmene';
                this.populateForm(operator);
            } else {
                this.elements.modalTitle.textContent = 'Uredi Operatera';
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
        this.elements.saveBtn.textContent = 'Sačuvaj';
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
        if (selectedKategorija && categoryTypeMap[selectedKategorija]) {
            categoryTypeMap[selectedKategorija].forEach(tip => {
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
            // Open the expandable details instead of modal
            this.toggleOperatorDetails(id);
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
    
    generateOperatorDetails(operator) {
        return `
            <div class="details-grid-enhanced">
                <!-- 📋 Osnovne informacije -->
                <div class="details-section">
                    <h4><i class="fas fa-info-circle"></i> 📋 Osnovne Informacije</h4>
                    <div class="detail-item">
                        <span class="detail-label">Naziv:</span>
                        <span class="detail-value"><strong>${operator.naziv}</strong></span>
                    </div>
                    ${operator.komercijalni_naziv ? `
                    <div class="detail-item">
                        <span class="detail-label">Komercijalni naziv:</span>
                        <span class="detail-value">${operator.komercijalni_naziv}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">Tip operatera:</span>
                        <span class="detail-value">${operator.tip}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge status-${operator.status}">${operator.status}</span>
                        </span>
                    </div>
                    ${operator.opis ? `
                    <div class="detail-item">
                        <span class="detail-label">Opis:</span>
                        <span class="detail-value description">${operator.opis}</span>
                    </div>
                    ` : ''}
                    ${operator.napomena ? `
                    <div class="detail-item">
                        <span class="detail-label">Napomena:</span>
                        <span class="detail-value note">${operator.napomena}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">Kompletnost podataka:</span>
                        <span class="detail-value">
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${operator.kompletnost || 0}%"></div>
                                </div>
                                <span class="progress-text">${operator.kompletnost || 0}%</span>
                            </div>
                        </span>
                    </div>
                </div>

                <!-- 📞 Kontakt Informacije -->
                <div class="details-section">
                    <h4><i class="fas fa-address-book"></i> 📞 Kontakt Informacije</h4>
                    ${this.generateContactInfo(operator)}
                </div>

                <!-- 👥 Tehnički Kontakti -->
                ${operator.tehnicki_kontakti && operator.tehnicki_kontakti.length > 0 ? `
                <div class="details-section tech-contacts-section" style="grid-column: 1 / -1;">
                    <h4><i class="fas fa-users-cog"></i> 👥 Tehnički Kontakti za Agencije</h4>
                    <div class="tech-contacts-grid">
                        ${operator.tehnicki_kontakti.map(kontakt => `
                            <div class="tech-contact-card">
                                <div class="contact-header">
                                    <h5>${kontakt.ime}</h5>
                                    <span class="contact-position">${kontakt.pozicija}</span>
                                </div>
                                <div class="contact-details">
                                    ${kontakt.email ? `
                                    <div class="contact-item">
                                        <i class="fas fa-envelope"></i>
                                        <a href="mailto:${kontakt.email}" class="contact-link">${kontakt.email}</a>
                                    </div>
                                    ` : ''}
                                    ${kontakt.telefon ? `
                                    <div class="contact-item">
                                        <i class="fas fa-phone"></i>
                                        <a href="tel:${kontakt.telefon}" class="contact-link">${kontakt.telefon}</a>
                                    </div>
                                    ` : ''}
                                </div>
                                <span class="contact-type-badge">${this.getContactTypeName(kontakt.tip_kontakta)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- 🔧 Detaljne Usluge -->
                <div class="details-section services-detailed">
                    <h4><i class="fas fa-concierge-bell"></i> 🔧 Detaljne Usluge</h4>
                    ${this.generateDetailedServices(operator)}
                </div>

                <!-- ⚙️ Detaljne Tehnologije -->
                <div class="details-section technologies-detailed">
                    <h4><i class="fas fa-microchip"></i> ⚙️ Detaljne Tehnologije</h4>
                    ${this.generateDetailedTechnologies(operator)}
                </div>

                <!-- ⚖️ Zakonske Obaveze -->
                ${operator.zakonske_obaveze ? `
                <div class="details-section legal-obligations" style="grid-column: 1 / -1;">
                    <h4><i class="fas fa-balance-scale"></i> ⚖️ Zakonske Obaveze</h4>
                    <div class="legal-grid">
                        <div class="legal-item">
                            <span class="legal-label">Zakonito presretanje:</span>
                            <span class="legal-value ${operator.zakonske_obaveze.zakonito_presretanje ? 'positive' : 'negative'}">
                                ${operator.zakonske_obaveze.zakonito_presretanje === true ? '✅ Implementirano' : 
                                  operator.zakonske_obaveze.zakonito_presretanje === false ? '❌ Nije implementirano' : '⚠️ Nepoznato'}
                            </span>
                        </div>
                        ${operator.zakonske_obaveze.implementacija ? `
                        <div class="legal-item">
                            <span class="legal-label">Implementacija:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.implementacija}</span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.kontakt_osoba ? `
                        <div class="legal-item">
                            <span class="legal-label">Kontakt osoba:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.kontakt_osoba}</span>
                        </div>
                        ` : ''}
                        <div class="legal-item">
                            <span class="legal-label">Pristup obračunskim podacima:</span>
                            <span class="legal-value ${operator.zakonske_obaveze.pristup_obracunskim_podacima ? 'positive' : 'negative'}">
                                ${operator.zakonske_obaveze.pristup_obracunskim_podacima === true ? '✅ Dostupno' : 
                                  operator.zakonske_obaveze.pristup_obracunskim_podacima === false ? '❌ Nije dostupno' : '⚠️ Nepoznato'}
                            </span>
                        </div>
                        ${operator.zakonske_obaveze.napomene ? `
                        <div class="legal-item legal-notes">
                            <span class="legal-label">Napomene:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.napomene}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    generateContactInfo(operator) {
        let contactHTML = '';
        
        // Koristiti novu strukturu kontakt objekata ako postoji
        if (operator.kontakt && typeof operator.kontakt === 'object') {
            const kontakt = operator.kontakt;
            
            if (kontakt.adresa) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">🏢 Adresa:</span>
                    <span class="detail-value">${kontakt.adresa}</span>
                </div>`;
            }
            
            if (kontakt.telefon) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">☎️ Telefon:</span>
                    <span class="detail-value">
                        <a href="tel:${kontakt.telefon}" class="contact-link">
                            <i class="fas fa-phone"></i> ${kontakt.telefon}
                        </a>
                    </span>
                </div>`;
            }
            
            if (kontakt.email) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">✉️ Email:</span>
                    <span class="detail-value">
                        <a href="mailto:${kontakt.email}" class="contact-link">
                            <i class="fas fa-envelope"></i> ${kontakt.email}
                        </a>
                    </span>
                </div>`;
            }
            
            if (kontakt.web) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">� Web stranica:</span>
                    <span class="detail-value">
                        <a href="${kontakt.web}" target="_blank" class="contact-link">
                            <i class="fas fa-external-link-alt"></i> ${kontakt.web}
                        </a>
                    </span>
                </div>`;
            }
            
            // Customer Service brojevi
            if (kontakt.customer_service && Object.keys(kontakt.customer_service).length > 0) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">📞 Customer Service:</span>
                    <div class="customer-service-list">
                        ${Object.entries(kontakt.customer_service).map(([tip, broj]) => `
                            <div class="customer-service-item">
                                <span class="service-type">${this.getServiceTypeName(tip)}:</span>
                                <a href="tel:${broj}" class="contact-link">
                                    <i class="fas fa-phone"></i> ${broj}
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }
            
            // Društvene mreže
            if (kontakt.drustvene_mreze && Object.keys(kontakt.drustvene_mreze).length > 0) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">🌐 Društvene mreže:</span>
                    <div class="social-media-links">
                        ${Object.entries(kontakt.drustvene_mreze).map(([platform, url]) => `
                            <a href="${url}" target="_blank" class="social-link social-${platform}" title="${this.getSocialPlatformName(platform)}">
                                <i class="fab fa-${platform}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>`;
            }
        } else {
            // Fallback za staru strukturu
            if (operator.adresa) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">�🏢 Adresa:</span>
                    <span class="detail-value">${operator.adresa}</span>
                </div>`;
            }
            
            if (operator.telefon) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">☎️ Telefon:</span>
                    <span class="detail-value">
                        <a href="tel:${operator.telefon}" class="contact-link">
                            <i class="fas fa-phone"></i> ${operator.telefon}
                        </a>
                    </span>
                </div>`;
            }
            
            if (operator.email) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">✉️ Email:</span>
                    <span class="detail-value">
                        <a href="mailto:${operator.email}" class="contact-link">
                            <i class="fas fa-envelope"></i> ${operator.email}
                        </a>
                    </span>
                </div>`;
            }
            
            if (operator.web) {
                contactHTML += `
                <div class="detail-item">
                    <span class="detail-label">🌐 Web:</span>
                    <span class="detail-value">
                        <a href="${operator.web}" target="_blank" class="contact-link">
                            <i class="fas fa-external-link-alt"></i> ${operator.web}
                        </a>
                    </span>
                </div>`;
            }
        }
        
        return contactHTML;
    }

    generateDetailedServices(operator) {
        if (operator.detaljne_usluge && typeof operator.detaljne_usluge === 'object') {
            // Nova struktura - kategorisane usluge
            return Object.entries(operator.detaljne_usluge).map(([kategorija, usluge]) => {
                if (!usluge || usluge.length === 0) return '';
                
                return `
                <div class="service-category">
                    <h5 class="category-title">
                        ${this.getServiceCategoryIcon(kategorija)} ${this.getServiceCategoryName(kategorija)}
                    </h5>
                    <div class="service-tags">
                        ${usluge.map(usluga => `
                            <span class="service-tag service-${kategorija}" 
                                  data-tooltip="${getServiceTooltip(usluga)}">
                                ${getReadableServiceName(usluga)}
                            </span>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('');
        } else {
            // Fallback za staru strukturu
            return this.formatServicesList(operator.usluge || []);
        }
    }

    generateDetailedTechnologies(operator) {
        if (operator.detaljne_tehnologije && typeof operator.detaljne_tehnologije === 'object') {
            // Nova struktura - kategorisane tehnologije
            return Object.entries(operator.detaljne_tehnologije).map(([kategorija, tehnologije]) => {
                if (!tehnologije || tehnologije.length === 0) return '';
                
                return `
                <div class="tech-category">
                    <h5 class="category-title">
                        ${this.getTechCategoryIcon(kategorija)} ${this.getTechCategoryName(kategorija)}
                    </h5>
                    <div class="tech-tags">
                        ${tehnologije.map(tehnologija => `
                            <span class="tech-tag tech-${kategorija}"
                                  data-tooltip="${getTechTooltip(tehnologija)}">
                                ${getReadableTechName(tehnologija)}
                            </span>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('');
        } else {
            // Fallback za staru strukturu
            return this.formatTechnologiesList(operator.tehnologije || []);
        }
    }

    // Helper funkcije za nove podatke
    getContactTypeName(tip) {
        const tipovi = {
            'bezbednost': 'Bezbednost',
            'tehnicki': 'Tehnički',
            'pravni': 'Pravni',
            'poslovni': 'Poslovni'
        };
        return tipovi[tip] || tip;
    }

    getServiceTypeName(tip) {
        const tipovi = {
            'privatni': 'Privatni',
            'poslovni': 'Poslovni', 
            'dopuna': 'Dopuna',
            'msat': 'm:SAT',
            'hitni': 'Hitni'
        };
        return tipovi[tip] || tip;
    }

    getSocialPlatformName(platform) {
        const platforme = {
            'facebook': 'Facebook',
            'instagram': 'Instagram',
            'twitter': 'Twitter',
            'linkedin': 'LinkedIn',
            'youtube': 'YouTube'
        };
        return platforme[platform] || platform;
    }

    getServiceCategoryIcon(kategorija) {
        const ikone = {
            'mobilne': '📱',
            'fiksne': '📞',
            'internet': '🌐',
            'tv': '📺',
            'cloud_poslovne': '☁️',
            'dodatne': '🛒'
        };
        return ikone[kategorija] || '🔧';
    }

    getServiceCategoryName(kategorija) {
        const nazivi = {
            'mobilne': 'Mobilne usluge',
            'fiksne': 'Fiksne usluge',
            'internet': 'Internet usluge',
            'tv': 'TV usluge',
            'cloud_poslovne': 'Cloud/Poslovne usluge',
            'dodatne': 'Dodatne usluge'
        };
        return nazivi[kategorija] || kategorija;
    }

    getTechCategoryIcon(kategorija) {
        const ikone = {
            'mobilne': '📱',
            'fiksne': '📞',
            'mrezne': '🌐'
        };
        return ikone[kategorija] || '⚙️';
    }

    getTechCategoryName(kategorija) {
        const nazivi = {
            'mobilne': 'Mobilne tehnologije',
            'fiksne': 'Fiksne tehnologije',
            'mrezne': 'Mrežne tehnologije'
        };
        return nazivi[kategorija] || kategorija;
    }

    deleteOperator(id) {
        const operator = this.operators.find(op => op.id === id);
        if (operator && confirm(`Da li ste sigurni da želite da obrišete operatera "${operator.naziv}"?`)) {
            console.log('Brisanje operatera sa ID:', id, 'naziv:', operator.naziv);
            const preCount = this.operators.length;
            this.operators = this.operators.filter(op => op.id !== id);
            const postCount = this.operators.length;
            console.log('Operateri prije brisanja:', preCount, 'nakon brisanja:', postCount);
            
            this.saveToLocalStorage();
            this.renderOperators();
            this.updateStatistics();
            this.showNotification('Operater je uspešno obrisan!', 'success');
        }
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
    
    // Clean up duplicate tooltips to prevent overlaps
    cleanupDuplicateTooltips() {
        // Remove title attributes from elements that have data-tooltip
        const elementsWithDataTooltip = document.querySelectorAll('[data-tooltip]');
        elementsWithDataTooltip.forEach(element => {
            if (element.hasAttribute('title')) {
                element.removeAttribute('title');
            }
        });
        
        // Also remove any old tooltip elements that might be stuck
        const existingTooltips = document.querySelectorAll('.tooltip-container, .tooltip-arrow');
        existingTooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
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
    
    // NEW METHODS - Category Detection and Display
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
    
    // Toggle Operator Details - NEW METHOD
    toggleOperatorDetails(operatorId) {
        const detailsRow = document.getElementById(`details-${operatorId}`);
        const operatorRow = document.querySelector(`[data-id="${operatorId}"]`);
        
        if (detailsRow && operatorRow) {
            const isExpanded = detailsRow.style.display === 'table-row';
            
            // Close all other details first
            document.querySelectorAll('.operator-details').forEach(row => {
                row.style.display = 'none';
            });
            document.querySelectorAll('.operator-row').forEach(row => {
                row.classList.remove('expanded');
            });
            
            if (!isExpanded) {
                // Open this details
                detailsRow.style.display = 'table-row';
                operatorRow.classList.add('expanded');
                
                // Scroll to the details smoothly
                setTimeout(() => {
                    detailsRow.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
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