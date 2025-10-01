// ATLAS Telekomunikacioni Operateri BiH - Aplikacija
// Version: 1.0
// Date: 2025-07-31

// Import standard catalog
import { standardCatalog, catalogUtils } from './generated/standard_catalog.js';

// Catalog loaded successfully
console.log('Standard catalog loaded:', standardCatalog?.services?.length || 0, 'services,', standardCatalog?.technologies?.length || 0, 'technologies');

// Global test function removed for production

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
    'dominantni': [
        'Dominantni operater'
    ],
    'mobilni': [
        'MVNO',
        'ISP + MVNO',
        'Mobilni operater'
    ],
    'isp': [
        'ISP',
        'Internet servis provajder (ISP)',
        'Internet servis provajder (ISP), Bežični (Wi-Fi) širokopojasni internet provajder (ISP)',
        'Regionalni ISP',
        'Regionalni ISP (Novotel partner)',
        'ISP + IPTV',
        'ISP + MMDS + IPTV',
        'ISP + Kablovski operater',
        'Kablovski operater',
        'Kablovski operater (United Group)'
    ],
    'b2b': [
        'Enterprise/B2B',
        'IT provajder, Internet servis provajder (ISP), Sistemska integracija',
        'Internet servis provajder (ISP), Veleprodajne telekomunikacione usluge ("carrier\'s carrier"), B2B'
    ]
};

class ATLASApp {
    constructor() {
        this.operators = [];
        this.filteredOperators = [];
        this.currentEditId = null;
        this.storageKey = 'atlas_operators_data';
        
        // Filter state
        this.currentStatusFilter = 'all';
        this.currentCategoryFilter = null;
        this.currentTypeFilter = '';
        this.currentSearchTerm = '';
        
        // DOM Elements
        this.elements = {
            // Statistics
            totalOperators: document.getElementById('totalOperators'),
            activeOperators: document.getElementById('activeOperators'),
            inactiveOperators: document.getElementById('inactiveOperators'),
            
            // Table
            operatorsTableBody: document.getElementById('operatorsTableBody'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            noResults: document.getElementById('noResults'),
            
            // Search and Filters
            searchInput: document.getElementById('searchInput'),
            clearSearchBtn: document.getElementById('clearSearchBtn'),
            searchResults: document.getElementById('searchResults'),
            searchResultsText: document.getElementById('searchResultsText'),
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
            
            // Stat Cards (Clickable)
            statTotal: document.getElementById('statTotal'),
            statActive: document.getElementById('statActive'),
            statInactive: document.getElementById('statInactive'),
            
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
        
        this.init();
    }
    
    async init() {
        try {
            this.showLoading(true);
            await this.loadData();
            
            // Dodaj test podatke za usluge i tehnologije
            this.addTestServicesAndTechnologies();
            
            // Provjeri da li su svi potrebni elementi prisutni
            this.validateElements();
            
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
                } catch (parseError) {
                    console.warn('Greška pri parsiranju LocalStorage:', parseError);
                }
            }
            
            // PRIORITET 2: Ako LocalStorage ima podatke, KORISTI GA ODMAH (bez JSON-a za brisanja)
            // TEMPORARILY DISABLED FOR TESTING API
            if (false && localData && Array.isArray(localData.operateri) && localData.operateri.length >= 0) {
                this.operators = localData.operateri;
                console.log('PRIORITET: Učitani podaci IZ LOCALSTORAGE (persistencija brisanja/dodavanja)');
                console.log('   - Ukupno operatera:', this.operators.length);
                console.log('   - Verzija:', localVersion);
                console.log('   - Izvor: LocalStorage (prioritet)');
                return; // IZLAZ - ne učitavaj JSON ako LocalStorage postoji
            }
            
            // PRIORITET 3: Učitaj iz API-ja umesto iz JSON-a
            
            try {
                // Prvo dobij listu operatera
                const operatorsResponse = await fetch('/api/operators?v=' + Date.now());
                
                if (!operatorsResponse.ok) {
                    throw new Error(`HTTP ${operatorsResponse.status}: Nije moguće učitati listu operatera`);
                }
                
                const operatorsList = await operatorsResponse.json();
                
                // Učitaj svakog operatera individualno
                this.operators = [];
                for (const op of operatorsList) {
                    try {
                        const operatorResponse = await fetch(`/api/operator/${op.id}?v=` + Date.now());
                        if (operatorResponse.ok) {
                            const operatorData = await operatorResponse.json();
                            this.operators.push(operatorData);
                        } else {
                            console.warn(`Nije moguće učitati operatera ${op.naziv} (${op.id})`);
                        }
                    } catch (opError) {
                        console.warn(`Greška pri učitavanju operatera ${op.naziv}:`, opError.message);
                    }
                }
                
                // Sačuvaj u LocalStorage za offline fallback
                const dataToSave = {
                    operateri: this.operators,
                    version: "2.0",
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        source: "individual-files-api"
                    }
                };
                
            } catch (apiError) {
                console.warn('API nije dostupan, pokušavam JSON fallback:', apiError.message);
                
                // FALLBACK: Učitaj stari JSON fajl
                const response = await fetch('./operateri.json?v=' + Date.now()); // cache busting
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Nije moguće učitati operateri.json`);
                }
                
                const jsonData = await response.json();
                
                this.operators = jsonData.operateri || [];
                const version = jsonData.version || '2.1';
                this.saveToLocalStorage(jsonData); // Sačuvaj u LocalStorage za budućnost
                console.log('Podaci učitani IZ JSON FAJLA (fallback):', this.operators.length, 'operatera');
                console.log('   - Verzija:', version);
                console.log('   - Sačuvano u LocalStorage za sljedeći put');
            }
            
        } catch (error) {
            console.error('Greška pri učitavanju JSON fajla:', error);
            
            // Provjeri da li je CORS greška
            if (error.message.includes('Failed to fetch') || error.toString().includes('CORS')) {
                console.log('CORS greška detektovana - potreban je HTTP server');
                console.log('Pokrenite: python -m http.server 8000');
                console.log('Ili otvorite: http://localhost:8000');
                
                // Prikaži korisniku poruku o CORS problemu
                this.showCORSWarning();
            }
            
            // FALLBACK 1: Pokušaj LocalStorage
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    this.operators = parsedData.operateri || [];
                    return;
                } catch (parseError) {
                    console.warn('Greška pri parsiranju LocalStorage u fallback-u:', parseError);
                }
            }
            
            // FALLBACK 2: Demo podaci
            this.operators = this.getDemoData();
            this.saveToLocalStorage();
        }
    }
    
    // Forsiraj reload iz JSON fajla
    async forceReloadFromJSON() {
        try {
            this.showLoading(true);
            console.log('Forsiram reload iz API-ja...');
            
            // Obriši localStorage cache
            localStorage.removeItem(this.storageKey);
            console.log('LocalStorage obrisan za reload:', this.storageKey);
            
            // Učitaj svježe iz API-ja
            try {
                // Prvo dobij listu operatera
                const operatorsResponse = await fetch('/api/operators?v=' + Date.now());
                if (!operatorsResponse.ok) {
                    throw new Error(`HTTP ${operatorsResponse.status}: Nije moguće učitati listu operatera`);
                }
                
                const operatorsList = await operatorsResponse.json();
                console.log('Lista operatera učitana za reload:', operatorsList.length, 'operatera');
                
                // Učitaj svakog operatera individualno
                this.operators = [];
                for (const op of operatorsList) {
                    try {
                        const operatorResponse = await fetch(`/api/operator/${op.id}?v=` + Date.now());
                        if (operatorResponse.ok) {
                            const operatorData = await operatorResponse.json();
                            this.operators.push(operatorData);
                        } else {
                            console.warn(`Nije moguće učitati operatera ${op.naziv} (${op.id})`);
                        }
                    } catch (opError) {
                        console.warn(`Greška pri učitavanju operatera ${op.naziv}:`, opError.message);
                    }
                }
                
                console.log('Reload - individualni fajlovi učitani:', this.operators.length, 'operatera');
                
                // Sačuvaj u LocalStorage
                const dataToSave = {
                    operateri: this.operators,
                    version: "2.0",
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        source: "api-reload"
                    }
                };
                this.saveToLocalStorage(dataToSave);
                
                // Ažuriraj UI
                this.renderOperators();
                this.updateStatistics();
                
                console.log(`Reload uspješan! Učitano ${this.operators.length} operatera iz API-ja`);
                alert(`Reload uspješan! Učitano ${this.operators.length} operatera iz individualnih fajlova.`);
                
            } catch (apiError) {
                console.warn('API nije dostupan za reload, pokušavam JSON fallback:', apiError.message);
                
                // Fallback na JSON
                const response = await fetch('./operateri.json?v=' + Date.now());
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data && data.operateri && Array.isArray(data.operateri)) {
                    this.operators = data.operateri;
                    this.saveToLocalStorage(data);
                    this.renderOperators();
                    this.updateStatistics();
                    console.log(`Reload uspješan iz JSON! Učitano ${data.operateri.length} operatera`);
                    alert(`Reload uspješan iz JSON! Učitano ${data.operateri.length} operatera.`);
                } else {
                    throw new Error('JSON nije valjan format operatera');
                }
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('Greška pri reload-u:', error);
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
            
            // Sync status bar se prikazuje samo na korisničke akcije (dodavanje/editovanje/brisanje)
            // Ne prikazujemo ga za automatsko čuvanje u LocalStorage
            
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
            
            console.log('Export završen:', {
                fileName: a.download,
                operators: exportData.operateri.length,
                timestamp: exportData.metadata.exportedAt
            });
            
            this.showNotification(`Izvoženo ${exportData.operateri.length} operatera u fajl: ${a.download}`, 'success', 5000);
            
        } catch (error) {
            console.error('Greška pri exportu:', error);
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
                    
                    console.log('Import završen:', {
                        fileName: file.name,
                        operators: importedData.operateri.length,
                        version: importedData.version
                    });
                    
                    this.showNotification(`Učitano ${importedData.operateri.length} operatera iz fajla: ${file.name}`, 'success', 5000);
                    
                } catch (error) {
                    console.error('Greška pri importu:', error);
                    this.showNotification('Greška pri čitanju fajla - proverite format', 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }
    
    validateElements() {
        // Provjeri kritične elemente
        const requiredElements = [
            'searchInput',
            'operatorsTableBody',
            'addOperatorBtn',
            'operatorModal',
            'operatorForm'
        ];
        
        const missingElements = [];
        
        for (const elementName of requiredElements) {
            if (!this.elements[elementName]) {
                missingElements.push(elementName);
                console.error(`❌ Element nije pronađen: ${elementName}`);
            }
        }
        
        if (missingElements.length > 0) {
            console.error('Nedostaju elementi:', missingElements);
            throw new Error(`Nedostaju potrebni elementi: ${missingElements.join(', ')}`);
        }
        
        console.log('✅ Svi potrebni elementi su pronađeni');
    }
    
    setupEventListeners() {
        // Search and Filter
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        this.elements.clearSearchBtn.addEventListener('click', () => {
            this.clearSearch();
        });
        
        this.elements.typeFilter.addEventListener('change', () => {
            this.currentTypeFilter = this.elements.typeFilter.value;
            this.applyCombinedFilters();
        });
        
        // Stat Cards Click Handlers
        this.elements.statTotal.addEventListener('click', () => {
            this.filterByStatus('all');
        });
        
        this.elements.statActive.addEventListener('click', () => {
            this.filterByStatus('aktivan');
        });
        
        this.elements.statInactive.addEventListener('click', () => {
            this.filterByStatus('neaktivan');
        });
        
        // Category Filters
        document.getElementById('filterDominantni').addEventListener('click', () => {
            this.filterByCategory('dominantni');
        });
        
        document.getElementById('filterAlternativni').addEventListener('click', () => {
            this.filterByCategory('alternativni');
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

        // Tehnički kontakti dugme
        if (this.elements.addTechContactBtn) {
            this.elements.addTechContactBtn.addEventListener('click', () => {
                this.addTechContactField();
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
        const term = searchTerm ? searchTerm.toLowerCase().trim() : '';
        
        // Clear any existing highlights
        this.clearSearchHighlights();
        
        // Update current search term
        this.currentSearchTerm = term;
        
        if (term === '') {
            // Hide clear button and results info
            this.elements.clearSearchBtn.style.display = 'none';
            this.elements.searchResults.style.display = 'none';
        } else {
            // Highlight search term in results
            this.highlightSearchTerm = term;
            
            // Show clear button and results info
            this.elements.clearSearchBtn.style.display = 'block';
            this.elements.searchResults.style.display = 'flex';
        }
        
        // Apply all filters including search
        this.applyCombinedFilters();
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
        this.currentSearchTerm = '';
        this.clearSearchHighlights();
        this.elements.clearSearchBtn.style.display = 'none';
        this.elements.searchResults.style.display = 'none';
        this.applyCombinedFilters();
    }
    

    
    filterByStatus(status) {
        // Update status filter state
        this.currentStatusFilter = status;
        
        // If "all" is selected, reset all other filters too
        if (status === 'all') {
            this.currentCategoryFilter = null;
            this.currentTypeFilter = '';
            this.elements.typeFilter.value = '';
            
            // Remove active class from category buttons
            document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
        // Update active state on stat cards
        document.querySelectorAll('.stat-card-btn').forEach(btn => {
            if (btn.dataset.status === status) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Apply all filters combined
        this.applyCombinedFilters();
        
        // Scroll to table if not showing all
        if (status !== 'all') {
            document.getElementById('operatorsTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    filterByCategory(category) {
        // Update category filter state
        this.currentCategoryFilter = category;
        
        // Update active state on category buttons
        document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Apply all filters combined
        this.applyCombinedFilters();
        
        // Scroll to table
        document.getElementById('operatorsTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    applyCombinedFilters() {
        let filtered = [...this.operators];
        
        // Apply search filter first
        if (this.currentSearchTerm) {
            const term = this.currentSearchTerm;
            filtered = filtered.filter(operator => {
                const adresa = operator.kontakt?.adresa || '';
                const email = operator.kontakt?.email || '';
                const telefon = operator.kontakt?.telefon || '';
                const web = operator.kontakt?.web || '';
                
                return (
                    operator.naziv.toLowerCase().includes(term) ||
                    (operator.komercijalni_naziv && operator.komercijalni_naziv.toLowerCase().includes(term)) ||
                    operator.tip.toLowerCase().includes(term) ||
                    (operator.opis && operator.opis.toLowerCase().includes(term)) ||
                    adresa.toLowerCase().includes(term) ||
                    email.toLowerCase().includes(term) ||
                    telefon.toLowerCase().includes(term) ||
                    web.toLowerCase().includes(term)
                );
            });
            
            // Update results info
            const totalCount = this.operators.length;
            this.elements.searchResultsText.textContent = 
                `${filtered.length} od ${totalCount} operatera • "${this.currentSearchTerm}"`;
        }
        
        // Apply status filter
        if (this.currentStatusFilter !== 'all') {
            filtered = filtered.filter(op => op.status === this.currentStatusFilter);
        }
        
        // Apply category filter
        if (this.currentCategoryFilter) {
            filtered = filtered.filter(op => op.kategorija === this.currentCategoryFilter);
        }
        
        // Apply type filter
        const typeFilter = this.elements.typeFilter.value;
        if (typeFilter) {
            filtered = filtered.filter(op => 
                op.tipovi && Array.isArray(op.tipovi) && op.tipovi.includes(typeFilter)
            );
        }
        
        // Render filtered results
        this.renderOperators(filtered);
        
        // Smooth scroll to table if any filter is active
        if (this.currentStatusFilter !== 'all' || this.currentCategoryFilter || typeFilter || this.currentSearchTerm) {
            const tableSection = document.querySelector('.operators-table-section');
            if (tableSection) {
                tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
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
            
            // NOVA STRUKTURA: Pripremi kategoriju i tipove badges
            const kategorija = operator.kategorija || 'N/A';
            const kategorijaDisplay = kategorija === 'dominantni' ? '🏢 Dominantni' : 
                                      kategorija === 'alternativni' ? '🔷 Alternativni' : kategorija;
            
            // Kreiraj badge za svaki tip iz niza
            const tipoviHTML = operator.tipovi && operator.tipovi.length > 0 ?
                operator.tipovi.map(tip => {
                    // Mapiranje tip vrednosti na display text i ikone
                    const tipMappings = {
                        'mobilni': { icon: '📱', text: 'Mobilni', class: 'mobilni' },
                        'mvno': { icon: '📡', text: 'MVNO', class: 'mvno' },
                        'isp': { icon: '🌐', text: 'ISP', class: 'isp' },
                        'kablovski': { icon: '📺', text: 'Kablovski', class: 'kablovski' },
                        'enterprise': { icon: '💼', text: 'Enterprise', class: 'enterprise' },
                        'ostali': { icon: '⚙️', text: 'Ostali', class: 'ostali' }
                    };
                    const tipInfo = tipMappings[tip] || { icon: '', text: tip, class: 'default' };
                    return `<span class="tip-badge tip-${tipInfo.class}">${tipInfo.icon} ${tipInfo.text}</span>`;
                }).join(' ') : '<span class="tip-badge tip-default">N/A</span>';
            
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
                    <span class="kategorija-badge kategorija-${kategorija}">
                        ${kategorijaDisplay}
                    </span>
                </td>
                <td class="type-col">
                    <div class="tipovi-badges">
                        ${tipoviHTML}
                    </div>
                </td>
                <td class="status-col">
                    <span class="status-badge status-${operator.status}">${operator.status}</span>
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
                <td colspan="6">
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
        
        // Update quick filter counts
        this.updateQuickFilterCounts();
    }
    
    updateQuickFilterCounts() {
        // NOVA STRUKTURA: Samo 2 kategorije (bez "Svi")
        const counts = {
            dominantni: this.operators.filter(op => op.kategorija === 'dominantni').length,
            alternativni: this.operators.filter(op => op.kategorija === 'alternativni').length
        };
        
        Object.entries(counts).forEach(([category, count]) => {
            const countElement = document.getElementById(`count${category.charAt(0).toUpperCase() + category.slice(1)}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
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
        
        // NOVA STRUKTURA: Radio buttons za kategoriju
        if (operator.kategorija) {
            const kategorijaRadio = document.querySelector(`input[name="kategorija"][value="${operator.kategorija}"]`);
            if (kategorijaRadio) {
                kategorijaRadio.checked = true;
            }
        }
        
        // NOVA STRUKTURA: Checkboxes za tipove
        // Prvo resetuj sve checkboxove
        document.querySelectorAll('input[name="tipovi"]').forEach(cb => cb.checked = false);
        // Onda označi samo one koji su u nizu tipovi
        if (operator.tipovi && Array.isArray(operator.tipovi)) {
            operator.tipovi.forEach(tip => {
                const tipCheckbox = document.querySelector(`input[name="tipovi"][value="${tip}"]`);
                if (tipCheckbox) {
                    tipCheckbox.checked = true;
                }
            });
        }
        
        form.elements.status.value = operator.status || '';
        form.elements.opis.value = operator.opis || '';
        form.elements.kontakt_osoba.value = operator.kontakt_osoba || '';
        
        // Kontakt podaci mogu biti direktno ili u nested strukturi
        form.elements.adresa.value = operator.kontakt?.adresa || operator.adresa || '';
        form.elements.telefon.value = operator.kontakt?.telefon || operator.telefon || '';
        form.elements.email.value = operator.kontakt?.email || operator.email || '';
        form.elements.web.value = operator.kontakt?.web || operator.web || '';
        
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
            
            // Zakonito presretanje
            if (form.elements.zakonito_presretanje) {
                if (zo.zakonito_presretanje === true) {
                    form.elements.zakonito_presretanje.value = 'true';
                } else if (zo.zakonito_presretanje === false) {
                    form.elements.zakonito_presretanje.value = 'false';
                } else {
                    form.elements.zakonito_presretanje.value = '';
                }
            }
            
            // Pristup obračunskim podacima
            if (form.elements.pristup_obracunskim_podacima) {
                if (zo.pristup_obracunskim_podacima === true) {
                    form.elements.pristup_obracunskim_podacima.value = 'true';
                } else if (zo.pristup_obracunskim_podacima === false) {
                    form.elements.pristup_obracunskim_podacima.value = 'false';
                } else {
                    form.elements.pristup_obracunskim_podacima.value = '';
                }
            }
            
            // Ostali detalji
            if (form.elements.implementacija) {
                form.elements.implementacija.value = zo.implementacija || '';
            }
            if (form.elements.zo_kontakt_osoba) {
                form.elements.zo_kontakt_osoba.value = zo.kontakt_osoba || '';
            }
            if (form.elements.zo_email_kontakt) {
                form.elements.zo_email_kontakt.value = zo.email_kontakt || '';
            }
            if (form.elements.zo_telefon_kontakt) {
                form.elements.zo_telefon_kontakt.value = zo.telefon_kontakt || '';
            }
            if (form.elements.posjeduje_misljenje_zuo) {
                form.elements.posjeduje_misljenje_zuo.value = zo.posjeduje_misljenje_zuo || '';
            }
            if (form.elements.zo_napomene) {
                form.elements.zo_napomene.value = zo.napomene || '';
            }
            
            // Dozvola za rad (stara polja)
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
        
        // NOVA STRUKTURA: Prikupi kategoriju (checked radio button)
        const kategorijaRadio = document.querySelector('input[name="kategorija"]:checked');
        const kategorija = kategorijaRadio ? kategorijaRadio.value : '';
        
        // NOVA STRUKTURA: Prikupi tipove (checked checkboxes)
        const tipoviCheckboxes = document.querySelectorAll('input[name="tipovi"]:checked');
        const tipovi = Array.from(tipoviCheckboxes).map(cb => cb.value);
        
        const operatorData = {
            naziv: formData.get('naziv').trim(),
            komercijalni_naziv: formData.get('komercijalni_naziv').trim(),
            kategorija: kategorija,
            tipovi: tipovi,
            status: formData.get('status'),
            opis: formData.get('opis').trim(),
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
                // Konvertuj string 'true'/'false' u boolean
                zakonito_presretanje: formData.get('zakonito_presretanje') === 'true' ? true : 
                                      formData.get('zakonito_presretanje') === 'false' ? false : undefined,
                pristup_obracunskim_podacima: formData.get('pristup_obracunskim_podacima') === 'true' ? true : 
                                               formData.get('pristup_obracunskim_podacima') === 'false' ? false : undefined,
                implementacija: formData.get('implementacija') ? formData.get('implementacija').trim() : '',
                kontakt_osoba: formData.get('zo_kontakt_osoba') ? formData.get('zo_kontakt_osoba').trim() : '',
                email_kontakt: formData.get('zo_email_kontakt') ? formData.get('zo_email_kontakt').trim() : '',
                telefon_kontakt: formData.get('zo_telefon_kontakt') ? formData.get('zo_telefon_kontakt').trim() : '',
                posjeduje_misljenje_zuo: formData.get('posjeduje_misljenje_zuo') || '',
                napomene: formData.get('zo_napomene') ? formData.get('zo_napomene').trim() : '',
                // Stara polja za dozvolu (opciono)
                dozvola_za_rad: formData.get('dozvola_za_rad') ? formData.get('dozvola_za_rad').trim() : '',
                datum_izdavanja: formData.get('datum_izdavanja') || '',
                vazenje_dozvole: formData.get('vazenje_dozvole') || '',
                status_dozvole: formData.get('status_dozvole') || ''
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
        // NAPOMENA: Čuvaj boolean false vrednosti!
        Object.keys(operatorData.zakonske_obaveze).forEach(key => {
            const value = operatorData.zakonske_obaveze[key];
            // Ukloni samo ako je prazan string ili undefined (NE false boolean!)
            if (value === '' || value === undefined) {
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
        
        // NOVA STRUKTURA: Validacija kategorije (radio button)
        const kategorijaRadio = document.querySelector('input[name="kategorija"]:checked');
        if (!kategorijaRadio) {
            errors.push({ field: 'kategorija', message: 'Kategorija operatera je obavezna' });
        }
        
        // NOVA STRUKTURA: Validacija tipova (checkboxes - bar jedan)
        const tipoviCheckboxes = document.querySelectorAll('input[name="tipovi"]:checked');
        if (tipoviCheckboxes.length === 0) {
            errors.push({ field: 'tipovi', message: 'Morate označiti bar jedan tip operatera' });
            // Prikaži error poruku ispod checkboxa
            const tipoviError = document.getElementById('tipoviError');
            if (tipoviError) {
                tipoviError.style.display = 'block';
            }
        } else {
            // Sakrij error poruku ako je validno
            const tipoviError = document.getElementById('tipoviError');
            if (tipoviError) {
                tipoviError.style.display = 'none';
            }
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
        
        // NAPOMENA: isCategoryTypeConsistent() provera uklonjena jer nova struktura
        // koristi kategorija (dominantni/alternativni) + tipovi (array)
        // Validacija je sada jednostavnija - samo proveravamo da li su polja popunjena
        
        // Completeness validation
        // OVAJ DIO JE VIŠE NEPOTREBAN - polje "kompletnost" se sada računa automatski i nije deo forme
        // Ako se polje vrati u formu, može se vratiti i validacija ispod:
        // const kompletnost = parseInt(formData.get('kompletnost'));
        // if (kompletnost && (kompletnost < 0 || kompletnost > 100)) {
        //     errors.push({ field: 'kompletnost', message: 'Kompletnost mora biti između 0 i 100%' });
        // }
        
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
        
        // Try to save to API (don't wait for result)
        this.saveOperatorToAPI(newOperator);
        
        this.renderOperators();
        this.updateStatistics();
        this.closeModal();
        this.showNotification('Operater je uspešno dodat!', 'success');
        this.showSyncStatus(); // Prikaži sync status za korisničku akciju
    }
    
    updateOperator(id, operatorData) {
        const index = this.operators.findIndex(op => op.id === id);
        if (index !== -1) {
            this.operators[index] = {
                ...this.operators[index],
                ...operatorData
            };
            this.saveToLocalStorage();
            
            // Try to save to API (don't wait for result)
            this.saveOperatorToAPI(this.operators[index]);
            
            this.renderOperators();
            this.updateStatistics();
            this.closeModal();
            this.showNotification('Operater je uspešno ažuriran!', 'success');
            this.showSyncStatus(); // Prikaži sync status za korisničku akciju
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
                    <h4>📋 Osnovne Informacije</h4>
                    <div class="detail-item">
                        <span class="detail-label">NAZIV:</span>
                        <span class="detail-value" style="text-align: center;"><strong>${operator.naziv}</strong></span>
                    </div>
                    ${operator.komercijalni_naziv ? `
                    <div class="detail-item">
                        <span class="detail-label">KOMERCIJALNI NAZIV:</span>
                        <span class="detail-value" style="text-align: center;">${operator.komercijalni_naziv}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">TIP OPERATERA:</span>
                        <span class="detail-value" style="text-align: center;">
                            ${operator.tipovi && operator.tipovi.length > 0 
                                ? operator.tipovi.map(tip => {
                                    const tipLabels = {
                                        'mobilni': '📱 Mobilni operater',
                                        'mvno': '📡 MVNO',
                                        'isp': '🌐 ISP',
                                        'kablovski': '📺 Kablovski',
                                        'enterprise': '💼 Enterprise/B2B',
                                        'ostali': '⚙️ Ostali'
                                    };
                                    return tipLabels[tip] || tip;
                                }).join(', ')
                                : 'Nije definisan'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">STATUS:</span>
                        <span class="detail-value" style="text-align: center;">
                            <span class="status-badge status-${operator.status}">${operator.status}</span>
                        </span>
                    </div>
                    ${operator.opis ? `
                    <div class="detail-item">
                        <span class="detail-label">OPIS:</span>
                        <span class="detail-value description" style="text-align: center;">${operator.opis}</span>
                    </div>
                    ` : ''}
                    ${operator.napomena ? `
                    <div class="detail-item">
                        <span class="detail-label">NAPOMENA:</span>
                        <span class="detail-value note" style="text-align: center;">${operator.napomena}</span>
                    </div>
                    ` : ''}
                </div>

                <!-- 📞 Kontakt informacije -->
                <div class="details-section">
                    <h4>📞 Kontakt informacije</h4>
                    ${this.generateContactInfo(operator)}
                </div>

                <!-- 👥 Tehnički kontakti -->
                ${operator.tehnicki_kontakti && operator.tehnicki_kontakti.length > 0 ? `
                <div class="details-section tech-contacts-section" style="grid-column: 1 / -1;">
                    <h4>👥 Tehnički kontakti za Agencije</h4>
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

                <!-- 🔧 Detaljne usluge -->
                <div class="details-section services-detailed">
                    <h4>🔧 Detaljne usluge</h4>
                    ${this.generateDetailedServices(operator)}
                </div>

                <!-- ⚙️ Detaljne tehnologije -->
                <div class="details-section technologies-detailed">
                    <h4>⚙️ Detaljne tehnologije</h4>
                    ${this.generateDetailedTechnologies(operator)}
                </div>

                <!-- ⚖️ Zakonske obaveze -->
                ${operator.zakonske_obaveze ? `
                <div class="details-section legal-obligations" style="grid-column: 1 / -1;">
                    <h4>⚖️ Zakonske obaveze</h4>
                    <div class="legal-grid">
                        <div class="legal-item">
                            <span class="legal-label">Zakonito presretanje:</span>
                            <span class="legal-value ${operator.zakonske_obaveze.zakonito_presretanje ? 'positive' : 'negative'}">
                                ${operator.zakonske_obaveze.zakonito_presretanje === true ? '✅ Implementirano' : 
                                  operator.zakonske_obaveze.zakonito_presretanje === false ? '❌ Nije implementirano' : '⚠️ Nepoznato'}
                            </span>
                        </div>
                        <div class="legal-item">
                            <span class="legal-label">Pristup obračunskim podacima:</span>
                            <span class="legal-value ${operator.zakonske_obaveze.pristup_obracunskim_podacima ? 'positive' : 'negative'}">
                                ${operator.zakonske_obaveze.pristup_obracunskim_podacima === true ? '✅ Dostupno' : 
                                  operator.zakonske_obaveze.pristup_obracunskim_podacima === false ? '❌ Nije dostupno' : '⚠️ Nepoznato'}
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
                        ${operator.zakonske_obaveze.email_kontakt ? `
                        <div class="legal-item">
                            <span class="legal-label">Email kontakt:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.email_kontakt}</span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.telefon_kontakt ? `
                        <div class="legal-item">
                            <span class="legal-label">Telefon kontakt:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.telefon_kontakt}</span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.posjeduje_misljenje_zuo ? `
                        <div class="legal-item">
                            <span class="legal-label">Posjeduje mišljenje ZUO:</span>
                            <span class="legal-value ${operator.zakonske_obaveze.posjeduje_misljenje_zuo === 'Da' ? 'positive' : 'negative'}">
                                ${operator.zakonske_obaveze.posjeduje_misljenje_zuo}
                            </span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.dozvola_za_rad ? `
                        <div class="legal-item">
                            <span class="legal-label">Dozvola za rad:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.dozvola_za_rad}</span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.datum_izdavanja ? `
                        <div class="legal-item">
                            <span class="legal-label">Datum izdavanja:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.datum_izdavanja}</span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.vazenje_dozvole ? `
                        <div class="legal-item">
                            <span class="legal-label">Važenje dozvole:</span>
                            <span class="legal-value">${operator.zakonske_obaveze.vazenje_dozvole}</span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.status_dozvole ? `
                        <div class="legal-item">
                            <span class="legal-label">Status dozvole:</span>
                            <span class="legal-value ${operator.zakonske_obaveze.status_dozvole === 'aktivna' ? 'positive' : 'negative'}">
                                ${operator.zakonske_obaveze.status_dozvole}
                            </span>
                        </div>
                        ` : ''}
                        ${operator.zakonske_obaveze.napomene ? `
                        <div class="legal-item legal-notes" style="grid-column: 1 / -1;">
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

    formatServicesList(services) {
        if (!services || services.length === 0) {
            return '<span class="no-data">Nisu navedene usluge</span>';
        }
        
        return services.map(service => {
            const serviceName = typeof service === 'string' ? service : service.naziv || service;
            return `<span class="service-tag">${serviceName}</span>`;
        }).join('');
    }

    formatTechnologiesList(technologies) {
        if (!technologies || technologies.length === 0) {
            return '<span class="no-data">Nisu navedene tehnologije</span>';
        }
        
        return technologies.map(tech => {
            const techName = typeof tech === 'string' ? tech : tech.naziv || tech;
            return `<span class="tech-tag">${techName}</span>`;
        }).join('');
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
            
            // Remove from local array
            this.operators = this.operators.filter(op => op.id !== id);
            const postCount = this.operators.length;
            console.log('Operateri prije brisanja:', preCount, 'nakon brisanja:', postCount);
            
            // Save to localStorage
            this.saveToLocalStorage();
            
            // Try to delete from API (don't wait for result)
            this.deleteOperatorFromAPI(id);
            
            // Update UI
            this.renderOperators();
            this.updateStatistics();
            this.showNotification('Operater je uspešno obrisan!', 'success');
            this.showSyncStatus(); // Prikaži sync status za korisničku akciju
        }
    }
    
    exportData() {
        try {
            // Kreiraj podatke za export u istom formatu kao operateri.json
            const exportData = {
                operateri: this.operators,
                version: '2.1',
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    source: 'ATLAS application - exported changes',
                    exportedAt: new Date().toISOString(),
                    totalOperators: this.operators.length,
                    exportDate: new Date().toISOString() // za backward compatibility
                }
            };
            
            // Kreiraj JSON string sa formatiranjem
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Kreiraj Blob i download link
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Kreiraj download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `operateri_updated_${new Date().toISOString().split('T')[0]}.json`;
            link.style.display = 'none';
            
            // Dodaj u DOM, klikni, i ukloni
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Očisti URL
            URL.revokeObjectURL(url);
            
            console.log('Export završen:', {
                fileName: link.download,
                operators: exportData.operateri.length,
                timestamp: exportData.metadata.exportedAt
            });
            
            this.showNotification(`Izvoženo ${exportData.operateri.length} operatera u fajl: ${link.download}`, 'success', 5000);
            
            // Sakrij sync status bar jer su podaci izvezeni
            this.hideSyncStatus();
            
            // Dodaj visual feedback sa instrukcijama
            setTimeout(() => {
                this.showNotification('Tip: Zamenite stari operateri.json sa novo izvoženim fajlom da sačuvate promene', 'info', 8000);
            }, 2000);
            
        } catch (error) {
            console.error('Greška pri exportu:', error);
            this.showNotification('Greška pri exportu podataka', 'error');
        }
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
    
    showCORSWarning() {
        // Kreiraj warning toast
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        `;
        
        warning.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 18px; margin-right: 8px;">🔒</span>
                <strong>CORS Greška Detektovana</strong>
            </div>
            <div style="margin-bottom: 8px;">
                Potrebno je pokrenuti HTTP server za pristup JSON fajlovima.
            </div>
            <div style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; margin-bottom: 8px;">
                python -m http.server 8000
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
                Zatim otvorite: <strong>http://localhost:8000</strong>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        // Ukloni nakon 10 sekundi
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 10000);
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
        // NOVA STRUKTURA: Jednostavno vraća kategoriju operatera direktno iz podataka
        // 'dominantni' ili 'alternativni'
        return operator.kategorija || 'alternativni'; // Default je alternativni ako nije postavljen
    }
    
    getCategoryDisplay(operator) {
        // NOVA STRUKTURA: Samo dve kategorije - dominantni i alternativni
        const kategorija = operator.kategorija || 'alternativni';
        const categoryMap = {
            'dominantni': '🏢 Dominantni',
            'alternativni': '� Alternativni'
        };
        return categoryMap[kategorija] || '❓ N/A';
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

    // Tehnički kontakti funkcije
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
        
        // Dodaj event listener za uklanjanje
        const removeBtn = contactDiv.querySelector('.remove-tech-contact');
        removeBtn.addEventListener('click', () => {
            contactDiv.remove();
            this.reindexTechContacts();
        });
    }
    
    clearTechContacts() {
        if (this.elements.techContactsContainer) {
            this.elements.techContactsContainer.innerHTML = '';
        }
    }
    
    reindexTechContacts() {
        const contacts = this.elements.techContactsContainer.querySelectorAll('.tech-contact-form');
        contacts.forEach((contact, index) => {
            const inputs = contact.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name && name.startsWith('tech_contact_')) {
                    const newName = name.replace(/tech_contact_\d+_/, `tech_contact_${index}_`);
                    input.setAttribute('name', newName);
                }
            });
            
            const header = contact.querySelector('h5');
            if (header) {
                header.textContent = `Tehnički Kontakt ${index + 1}`;
            }
        });
    }
    
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

    // Usluge funkcije
    addServiceField(usluga = null, isEditMode = false, existingServices = []) {
        const container = this.elements.servicesContainer;
        const index = container.children.length;

        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service-form';

        // Standardni katalog usluga sa debug i fallback
        let standardServices = [];
        try {
            const catalogData = this.getStandardServicesAndTechnologies();
            standardServices = catalogData.standardServices || [];

            // Fallback ako je katalog prazan
            if (standardServices.length === 0) {
                console.warn('Services catalog prazan, koristim fallback');
                standardServices = this.getFallbackServices();
            }

        } catch (error) {
            console.error('Greška pri učitavanju usluga:', error);
            standardServices = this.getFallbackServices();
        }

        // Filter available services (exclude already added ones)
        const availableServices = standardServices.filter(service =>
            !existingServices.some(existing => {
                // Match by ID (existing.naziv should match service.id) or by display name
                return existing.naziv === service.id ||
                       existing.naziv === service.naziv ||
                       existing.naziv === service.naziv_en;
            })
        );
        
        // Kategorije za organizaciju - mapiraj domain na kategoriju
        const categoriesMap = {
            'mobile': 'Mobilni servisi',
            'fixed': 'Fiksni telefon',
            'internet': 'Internet usluge',
            'tv': 'TV usluge',
            'cloud': 'Cloud/Poslovni',
            'additional': 'Dodatne usluge',
            'security': 'Bezbednost'
        };

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
                    <div class="existing-services-list">
                        ${existingServices.length > 0 ? existingServices.map((service, serviceIndex) => {
                            // Get display name from catalog or use readable name function
                            const displayName = this.getDisplayNameForService(service.naziv || service);
                            const displayDescription = service.opis || this.getDescriptionForService(service.naziv || service);
                            
                            return `
                            <div class="existing-service-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: white; border: 1px solid #10b981; border-radius: 6px; margin-bottom: 6px;">
                                <div style="flex: 1;">
                                    <span style="font-weight: 600; color: #065f46;">${displayName}</span>
                                    ${displayDescription ? `<br><small style="color: #6b7280;">${displayDescription}</small>` : ''}
                                </div>
                                <button type="button" class="btn btn-outline-danger btn-sm remove-existing-service"
                                        data-service-index="${serviceIndex}"
                                        style="margin-left: 10px; font-size: 11px; padding: 2px 6px;">
                                    <i class="fas fa-times"></i> Ukloni
                                </button>
                            </div>
                        `;}).join('') : '<div style="color: #6b7280; font-style: italic; padding: 10px;">Nema dodanih usluga</div>'}
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
            ` : !usluga ? `
            <!-- ADD MODE: Original single section -->
            <div class="existing-options" style="margin-bottom: 15px;">
                <label style="font-weight: bold; margin-bottom: 12px; display: block;">📋 Standardni katalog usluga (klikni da dodaš):</label>
                <div class="services-catalog" style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc;">
                    ${Object.keys(categoriesMap).map(domain => {
                        const categoryServices = standardServices.filter(service => service.domain === domain);
                        return categoryServices.length > 0 ? `
                            <div class="service-category-group" style="margin-bottom: 16px;">
                                <h6 style="color: #374151; font-weight: 600; margin-bottom: 8px; padding: 4px 8px; background: #e5e7eb; border-radius: 4px;">${categoriesMap[domain]}</h6>
                                <div class="category-services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 6px;">
                                    ${categoryServices.map(service => `
                                        <div class="standard-service-item"
                                             data-domain="${service.domain}"
                                             data-naziv="${service.naziv}"
                                             data-opis="${service.opis}"
                                             data-status="${service.status}"
                                             style="padding: 8px 10px; background: white; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                            <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">${service.naziv}</div>
                                            <div style="color: #6b7280; font-size: 10px; line-height: 1.3;">${service.opis}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : '';
                    }).join('')}
                </div>
                <div style="text-align: center; margin-top: 10px;">
                    <button type="button" class="toggle-manual-entry" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                        ➕ Dodaj potpuno novu uslugu
                    </button>
                </div>
            </div>
            ` : ''}
            
            <div class="manual-entry" ${!usluga ? 'style="display: none;"' : ''}>
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
            </div>
        `;
        
        container.appendChild(serviceDiv);
        
        // Event listener za uklanjanje
        const removeBtn = serviceDiv.querySelector('.remove-service');
        removeBtn.addEventListener('click', () => {
            serviceDiv.remove();
            this.reindexServices();
        });
        
        if (isEditMode) {
            // EDIT MODE EVENT LISTENERS

            // Remove existing service buttons
            const removeButtons = serviceDiv.querySelectorAll('.remove-existing-service');
            removeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const serviceIndex = parseInt(button.getAttribute('data-service-index'));

                    // Remove from existing services array
                    existingServices.splice(serviceIndex, 1);

                    // Re-render the entire service field with updated data
                    this.refreshServiceField(container, index, isEditMode, existingServices);
                });
            });

            // Add available service buttons - use event delegation for dynamic content
            const availableServicesSection = serviceDiv.querySelector('.available-services-section');
            if (availableServicesSection) {
                availableServicesSection.addEventListener('click', (e) => {
                    if (e.target.classList.contains('add-service-btn')) {
                        e.preventDefault();
                        const item = e.target.closest('.available-service-item');
                        if (item) {
                            const naziv = item.getAttribute('data-naziv');
                            const opis = item.getAttribute('data-opis');
                            const domain = item.getAttribute('data-domain');
                            const status = item.getAttribute('data-status');
                            // Add to existing services
                            existingServices.push({
                                kategorija: domain,
                                naziv: naziv,
                                opis: opis,
                                status: status
                            });

                            // Re-render the entire service field with updated data
                            this.refreshServiceField(container, index, isEditMode, existingServices);
                        }
                    }
                });
            }

            // Hover effects for available services
            const availableItems = serviceDiv.querySelectorAll('.available-service-item');
            availableItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#fef3c7';
                    item.style.borderColor = '#f59e0b';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'white';
                    item.style.borderColor = '#d97706';
                });
            });

        } else {
            // ADD MODE EVENT LISTENERS (original functionality)

            // Event listener za standardne usluge
            const standardItems = serviceDiv.querySelectorAll('.standard-service-item');
            standardItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Popuni polja sa postojećim podacima
                    const domain = item.getAttribute('data-domain');
                    const naziv = item.getAttribute('data-naziv');
                    const opis = item.getAttribute('data-opis');
                    const status = item.getAttribute('data-status');

                    serviceDiv.querySelector(`[name="service_${index}_kategorija"]`).value = domain;
                    serviceDiv.querySelector(`[name="service_${index}_naziv"]`).value = naziv;
                    serviceDiv.querySelector(`[name="service_${index}_opis"]`).value = opis;
                    serviceDiv.querySelector(`[name="service_${index}_status"]`).value = status;

                    // Sakrij postojeće opcije i prikaži manual entry
                    const existingOptions = serviceDiv.querySelector('.existing-options');
                    const manualEntry = serviceDiv.querySelector('.manual-entry');
                    if (existingOptions) existingOptions.style.display = 'none';
                    if (manualEntry) manualEntry.style.display = 'block';
                });

                // Hover efekti
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#e0f2fe';
                    item.style.borderColor = '#0ea5e9';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'white';
                    item.style.borderColor = '#e2e8f0';
                });
            });
        }
        
        // Event listener za "Dodaj novu uslugu" dugme
            const toggleBtn = serviceDiv.querySelector('.toggle-manual-entry');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    const existingOptions = serviceDiv.querySelector('.existing-options');
                    const manualEntry = serviceDiv.querySelector('.manual-entry');
                    if (existingOptions) existingOptions.style.display = 'none';
                    if (manualEntry) manualEntry.style.display = 'block';
                });
            }
        }
    
        // Helper method to refresh service field in edit mode
        refreshServiceField(container, index, isEditMode, existingServices) {
            // Remove the current service field
            const currentField = container.children[index];
            if (currentField) {
                currentField.remove();
            }
    
            // Re-add the service field with updated data
            this.addServiceField(null, isEditMode, existingServices);
        }

    clearServices() {
        if (this.elements.servicesContainer) {
            this.elements.servicesContainer.innerHTML = '';
        }
    }

    reindexServices() {
        const services = this.elements.servicesContainer.querySelectorAll('.service-form');
        services.forEach((service, index) => {
            const inputs = service.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name && name.startsWith('service_')) {
                    const newName = name.replace(/service_\d+_/, `service_${index}_`);
                    input.setAttribute('name', newName);
                }
            });
            
            const header = service.querySelector('h5');
            if (header) {
                header.textContent = `Usluga ${index + 1}`;
            }
        });
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

    // Tehnologije funkcije
    addTechnologyField(tehnologija = null, isEditMode = false, existingTechnologies = []) {
        const container = this.elements.technologiesContainer;
        const index = container.children.length;

        const technologyDiv = document.createElement('div');
        technologyDiv.className = 'technology-form';

        let standardTechnologies = [];
        try {
            const catalogData = this.getStandardServicesAndTechnologies();
            standardTechnologies = catalogData.standardTechnologies || [];

            // Fallback ako je katalog prazan
            if (standardTechnologies.length === 0) {
                console.warn('Standard catalog prazan, koristim fallback');
                standardTechnologies = this.getFallbackTechnologies();
            }

        } catch (error) {
            console.error('Greška pri učitavanju tehnologija:', error);
            standardTechnologies = this.getFallbackTechnologies();
        }

        // Filter available technologies (exclude already added ones)
        const availableTechnologies = standardTechnologies.filter(tech =>
            !existingTechnologies.some(existing => {
                // Match by ID (existing.naziv should match tech.id) or by display name
                return existing.naziv === tech.id ||
                       existing.naziv === tech.naziv ||
                       existing.naziv === tech.naziv_en;
            })
        );
        
        // Kategorije za organizaciju - mapiraj domain na kategoriju
        const techTypesMap = {
            'access': 'Pristupna mreža',
            'core': 'Core mreža',
            'transport': 'Transportna mreža',
            'wireless': 'Bežična tehnologija',
            'optical': 'Optička tehnologija',
            'copper': 'Bakarna tehnologija',
            'cable': 'Kablovska tehnologija',
            'protocol': 'Protokoli',
            'switching': 'Preklopna mreža',
            'overlay': 'Overlay mreže',
            'delivery': 'Dostavne mreže',
            'voice': 'Glasovne tehnologije',
            'database': 'Baze podataka',
            'messaging': 'Poruke',
            'nat': 'NAT tehnologije',
            'platform': 'Platforme'
        };

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
                <div class="existing-technologies-section" style="margin-bottom: 20px; padding: 15px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
                    <h6 style="color: #0c4a6e; margin-bottom: 12px; font-weight: 600;">
                        <i class="fas fa-check-circle" style="color: #10b981;"></i>
                        ⚙️ Trenutno dodane tehnologije (${existingTechnologies.length})
                    </h6>
                    <div class="existing-technologies-list">
                        ${existingTechnologies.length > 0 ? existingTechnologies.map((tech, techIndex) => {
                            // Get display name from catalog or use readable name function
                            const displayName = this.getDisplayNameForTechnology(tech.naziv || tech);
                            const displayDescription = tech.opis || this.getDescriptionForTechnology(tech.naziv || tech);
                            const displayCapacity = tech.kapacitet || this.getCapacityForTechnology(tech.naziv || tech);
                            
                            return `
                            <div class="existing-technology-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: white; border: 1px solid #10b981; border-radius: 6px; margin-bottom: 6px;">
                                <div style="flex: 1;">
                                    <span style="font-weight: 600; color: #065f46;">${displayName}</span>
                                    ${displayDescription ? `<br><small style="color: #6b7280;">${displayDescription}</small>` : ''}
                                    ${displayCapacity ? `<br><small style="color: #059669;">${displayCapacity}</small>` : ''}
                                </div>
                                <button type="button" class="btn btn-outline-danger btn-sm remove-existing-technology"
                                        data-technology-index="${techIndex}"
                                        style="margin-left: 10px; font-size: 11px; padding: 2px 6px;">
                                    <i class="fas fa-times"></i> Ukloni
                                </button>
                            </div>
                        `;}).join('') : '<div style="color: #6b7280; font-style: italic; padding: 10px;">Nema dodanih tehnologija</div>'}
                    </div>
                </div>

                <!-- AVAILABLE TECHNOLOGIES SECTION -->
                <div class="available-technologies-section" style="padding: 15px; background: #fefce8; border: 1px solid #f59e0b; border-radius: 8px;">
                    <h6 style="color: #92400e; margin-bottom: 12px; font-weight: 600;">
                        <i class="fas fa-plus-circle" style="color: #f59e0b;"></i>
                        🔧 Dodaj nove tehnologije (${availableTechnologies.length} dostupno)
                    </h6>
                    <div class="available-technologies-catalog" style="max-height: 250px; overflow-y: auto;">
                        ${availableTechnologies.length > 0 ? Object.keys(techTypesMap).map(domain => {
                            const typeTechnologies = availableTechnologies.filter(tech => tech.domain === domain);
                            return typeTechnologies.length > 0 ? `
                                <div class="technology-type-group" style="margin-bottom: 16px;">
                                    <h6 style="color: #374151; font-weight: 600; margin-bottom: 8px; padding: 4px 8px; background: #e5e7eb; border-radius: 4px; font-size: 12px;">${techTypesMap[domain]}</h6>
                                    <div class="type-technologies-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px;">
                                        ${typeTechnologies.map(tech => `
                                            <div class="available-technology-item"
                                                 data-domain="${tech.domain}"
                                                 data-tip="${tech.tip}"
                                                 data-naziv="${tech.naziv}"
                                                 data-opis="${tech.opis}"
                                                 data-kapacitet="${tech.capacity}"
                                                 style="padding: 8px 10px; background: white; border: 1px solid #d97706; border-radius: 6px; cursor: pointer; font-size: 11px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                                <div style="font-weight: 600; color: #92400e; margin-bottom: 2px;">${tech.naziv}</div>
                                                <div style="color: #6b7280; font-size: 10px; line-height: 1.3;">${tech.opis}</div>
                                                <div style="color: #059669; font-size: 9px; margin-top: 2px; font-weight: 500;">${tech.capacity}</div>
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
            ` : !tehnologija ? `
            <!-- ADD MODE: Original single section -->
            <div class="existing-options" style="margin-bottom: 15px;">
                <label style="font-weight: bold; margin-bottom: 12px; display: block;">🔧 Standardni katalog tehnologija (klikni da dodaš):</label>
                <div class="technologies-catalog" style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc;">
                    ${Object.keys(techTypesMap).map(domain => {
                        const typeTechnologies = standardTechnologies.filter(tech => tech.domain === domain);
                        return typeTechnologies.length > 0 ? `
                            <div class="technology-type-group" style="margin-bottom: 16px;">
                                <h6 style="color: #374151; font-weight: 600; margin-bottom: 8px; padding: 4px 8px; background: #e5e7eb; border-radius: 4px;">${techTypesMap[domain]}</h6>
                                <div class="type-technologies-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 6px;">
                                    ${typeTechnologies.map(tech => `
                                        <div class="standard-technology-item"
                                             data-domain="${tech.domain}"
                                             data-tip="${tech.tip}"
                                             data-naziv="${tech.naziv}"
                                             data-opis="${tech.opis}"
                                             data-kapacitet="${tech.capacity}"
                                             style="padding: 8px 10px; background: white; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                                            <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">${tech.naziv}</div>
                                            <div style="color: #6b7280; font-size: 10px; line-height: 1.3;">${tech.opis}</div>
                                            <div style="color: #059669; font-size: 9px; margin-top: 2px; font-weight: 500;">${tech.capacity}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : '';
                    }).join('')}
                </div>
                <div style="text-align: center; margin-top: 10px;">
                    <button type="button" class="toggle-manual-entry-tech" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                        ➕ Dodaj potpuno novu tehnologiju
                    </button>
                </div>
            </div>
            ` : ''}
            
            <div class="manual-entry" ${!tehnologija ? 'style="display: none;"' : ''}>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tip tehnologije</label>
                        <select name="technology_${index}_tip">
                            <option value="access" ${tehnologija && tehnologija.tip === 'access' ? 'selected' : ''}>Pristupna mreža</option>
                            <option value="core" ${tehnologija && tehnologija.tip === 'core' ? 'selected' : ''}>Core mreža</option>
                            <option value="transport" ${tehnologija && tehnologija.tip === 'transport' ? 'selected' : ''}>Transportna mreža</option>
                            <option value="wireless" ${tehnologija && tehnologija.tip === 'wireless' ? 'selected' : ''}>Bežična tehnologija</option>
                            <option value="optical" ${tehnologija && tehnologija.tip === 'optical' ? 'selected' : ''}>Optička tehnologija</option>
                            <option value="copper" ${tehnologija && tehnologija.tip === 'copper' ? 'selected' : ''}>Bakarna tehnologija</option>
                            <option value="cable" ${tehnologija && tehnologija.tip === 'cable' ? 'selected' : ''}>Kablovska tehnologija</option>
                            <option value="protocol" ${tehnologija && tehnologija.tip === 'protocol' ? 'selected' : ''}>Protokoli</option>
                            <option value="switching" ${tehnologija && tehnologija.tip === 'switching' ? 'selected' : ''}>Preklopna mreža</option>
                            <option value="overlay" ${tehnologija && tehnologija.tip === 'overlay' ? 'selected' : ''}>Overlay mreže</option>
                            <option value="delivery" ${tehnologija && tehnologija.tip === 'delivery' ? 'selected' : ''}>Dostavne mreže</option>
                            <option value="voice" ${tehnologija && tehnologija.tip === 'voice' ? 'selected' : ''}>Glasovne tehnologije</option>
                            <option value="database" ${tehnologija && tehnologija.tip === 'database' ? 'selected' : ''}>Baze podataka</option>
                            <option value="messaging" ${tehnologija && tehnologija.tip === 'messaging' ? 'selected' : ''}>Poruke</option>
                            <option value="nat" ${tehnologija && tehnologija.tip === 'nat' ? 'selected' : ''}>NAT tehnologije</option>
                            <option value="platform" ${tehnologija && tehnologija.tip === 'platform' ? 'selected' : ''}>Platforme</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Naziv tehnologije</label>
                        <input type="text" name="technology_${index}_naziv" value="${tehnologija ? tehnologija.naziv || '' : ''}" placeholder="FTTH, xDSL, LTE...">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Opis</label>
                        <input type="text" name="technology_${index}_opis" value="${tehnologija ? tehnologija.opis || '' : ''}" placeholder="Opis tehnologije">
                    </div>
                    <div class="form-group">
                        <label>Kapacitet</label>
                        <input type="text" name="technology_${index}_kapacitet" value="${tehnologija ? tehnologija.kapacitet || '' : ''}" placeholder="1 Gbps">
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(technologyDiv);
        
        // Event listener za uklanjanje
        const removeBtn = technologyDiv.querySelector('.remove-technology');
        removeBtn.addEventListener('click', () => {
            technologyDiv.remove();
            this.reindexTechnologies();
        });
        
        if (isEditMode) {
            // EDIT MODE EVENT LISTENERS

            // Remove existing technology buttons
            const removeButtons = technologyDiv.querySelectorAll('.remove-existing-technology');
            removeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const technologyIndex = parseInt(button.getAttribute('data-technology-index'));

                    // Remove from existing technologies array
                    existingTechnologies.splice(technologyIndex, 1);

                    // Re-render the entire technology field with updated data
                    this.refreshTechnologyField(container, index, isEditMode, existingTechnologies);
                });
            });

            // Add available technology buttons - use event delegation for dynamic content
            const availableTechnologiesSection = technologyDiv.querySelector('.available-technologies-section');
            if (availableTechnologiesSection) {
                availableTechnologiesSection.addEventListener('click', (e) => {
                    if (e.target.classList.contains('add-technology-btn')) {
                        e.preventDefault();
                        const item = e.target.closest('.available-technology-item');
                        if (item) {
                            const naziv = item.getAttribute('data-naziv');
                            const opis = item.getAttribute('data-opis');
                            const domain = item.getAttribute('data-domain');
                            const tip = item.getAttribute('data-tip');
                            const kapacitet = item.getAttribute('data-kapacitet');

                            // Add to existing technologies
                            existingTechnologies.push({
                                tip: tip,
                                naziv: naziv,
                                opis: opis,
                                kapacitet: kapacitet
                            });

                            // Re-render the entire technology field with updated data
                            this.refreshTechnologyField(container, index, isEditMode, existingTechnologies);
                        }
                    }
                });
            }

            // Hover effects for available technologies
            const availableItems = technologyDiv.querySelectorAll('.available-technology-item');
            availableItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#fef3c7';
                    item.style.borderColor = '#f59e0b';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'white';
                    item.style.borderColor = '#d97706';
                });
            });

        } else {
            // ADD MODE EVENT LISTENERS (original functionality)

            // Event listener za standardne tehnologije
            const standardItems = technologyDiv.querySelectorAll('.standard-technology-item');
            standardItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Popuni polja sa postojećim podacima
                    const tip = item.getAttribute('data-tip');
                    const naziv = item.getAttribute('data-naziv');
                    const opis = item.getAttribute('data-opis');
                    const kapacitet = item.getAttribute('data-kapacitet');

                    technologyDiv.querySelector(`[name="technology_${index}_tip"]`).value = tip;
                    technologyDiv.querySelector(`[name="technology_${index}_naziv"]`).value = naziv;
                    technologyDiv.querySelector(`[name="technology_${index}_opis"]`).value = opis;
                    technologyDiv.querySelector(`[name="technology_${index}_kapacitet"]`).value = kapacitet;

                    // Sakrij postojeće opcije i prikaži manual entry
                    const existingOptions = technologyDiv.querySelector('.existing-options');
                    const manualEntry = technologyDiv.querySelector('.manual-entry');
                    if (existingOptions) existingOptions.style.display = 'none';
                    if (manualEntry) manualEntry.style.display = 'block';
                });

                // Hover efekti
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f0fdf4';
                    item.style.borderColor = '#22c55e';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'white';
                    item.style.borderColor = '#e2e8f0';
                });
            });
        }
        
        // Event listener za "Dodaj novu tehnologiju" dugme
        const toggleBtn = technologyDiv.querySelector('.toggle-manual-entry-tech');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const existingOptions = technologyDiv.querySelector('.existing-options');
                const manualEntry = technologyDiv.querySelector('.manual-entry');
                if (existingOptions) existingOptions.style.display = 'none';
                if (manualEntry) manualEntry.style.display = 'block';
            });
        }
    }

    // Helper method to refresh technology field in edit mode
    refreshTechnologyField(container, index, isEditMode, existingTechnologies) {
        // Remove the current technology field
        const currentField = container.children[index];
        if (currentField) {
            currentField.remove();
        }

        // Re-add the technology field with updated data
        this.addTechnologyField(null, isEditMode, existingTechnologies);
    }

    clearTechnologies() {
        if (this.elements.technologiesContainer) {
            this.elements.technologiesContainer.innerHTML = '';
        }
    }

    reindexTechnologies() {
        const technologies = this.elements.technologiesContainer.querySelectorAll('.technology-form');
        technologies.forEach((technology, index) => {
            const inputs = technology.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                if (name && name.startsWith('technology_')) {
                    const newName = name.replace(/technology_\d+_/, `technology_${index}_`);
                    input.setAttribute('name', newName);
                }
            });
            
            const header = technology.querySelector('h5');
            if (header) {
                header.textContent = `Tehnologija ${index + 1}`;
            }
        });
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

    // Funkcije za pregled postojećih usluga i tehnologija
    getAllExistingServices() {
        const existingServices = new Map();
        
        this.operators.forEach(operator => {
            if (operator.usluge && Array.isArray(operator.usluge)) {
                operator.usluge.forEach(usluga => {
                    if (usluga.naziv) {
                        const key = `${usluga.kategorija}_${usluga.naziv}`;
                        if (!existingServices.has(key)) {
                            existingServices.set(key, {
                                kategorija: usluga.kategorija,
                                naziv: usluga.naziv,
                                opis: usluga.opis || '',
                                status: usluga.status || 'aktivna',
                                count: 1
                            });
                        } else {
                            existingServices.get(key).count++;
                        }
                    }
                });
            }
        });
        
        return Array.from(existingServices.values()).sort((a, b) => b.count - a.count);
    }

    getAllExistingTechnologies() {
        const existingTechnologies = new Map();
        
        this.operators.forEach(operator => {
            if (operator.tehnologije && Array.isArray(operator.tehnologije)) {
                operator.tehnologije.forEach(tehnologija => {
                    if (tehnologija.naziv) {
                        const key = `${tehnologija.tip}_${tehnologija.naziv}`;
                        if (!existingTechnologies.has(key)) {
                            existingTechnologies.set(key, {
                                tip: tehnologija.tip,
                                naziv: tehnologija.naziv,
                                opis: tehnologija.opis || '',
                                kapacitet: tehnologija.kapacitet || '',
                                count: 1
                            });
                        } else {
                            existingTechnologies.get(key).count++;
                        }
                    }
                });
            }
        });
        
        return Array.from(existingTechnologies.values()).sort((a, b) => b.count - a.count);
    }

    // Dodaj test podatke za demonstraciju
    addTestServicesAndTechnologies() {
        // Dodaj test usluge ako ne postoje
        if (this.operators.length > 0) {
            // Dodaj test usluge prvom operateru ako ih nema
            if (!this.operators[0].usluge) {
                this.operators[0].usluge = [
                    {
                        kategorija: "mobile",
                        naziv: "mobile_prepaid",
                        opis: "Mobilne usluge na prepaid osnovu",
                        status: "active"
                    },
                    {
                        kategorija: "mobile",
                        naziv: "mobile_postpaid",
                        opis: "Mobilne usluge na postpaid osnovu",
                        status: "active"
                    },
                    {
                        kategorija: "mobile",
                        naziv: "mobile_esim",
                        opis: "Elektronska SIM kartica",
                        status: "active"
                    },
                    {
                        kategorija: "mobile",
                        naziv: "mobile_volte_vowifi",
                        opis: "Voice over LTE i WiFi pozivi",
                        status: "active"
                    },
                    {
                        kategorija: "mobile",
                        naziv: "mobile_roaming",
                        opis: "Usluge u roaming-u",
                        status: "active"
                    },
                    {
                        kategorija: "mobile",
                        naziv: "mobile_mnp",
                        opis: "Mobile Number Portability",
                        status: "active"
                    },
                    {
                        kategorija: "internet",
                        naziv: "internet_ftth",
                        opis: "Fiber to the Home internet",
                        status: "active"
                    },
                    {
                        kategorija: "internet",
                        naziv: "internet_adsl_vdsl",
                        opis: "Internet preko bakarnih linija",
                        status: "active"
                    },
                    {
                        kategorija: "tv",
                        naziv: "iptv",
                        opis: "Internet Protocol Television",
                        status: "active"
                    }
                ];
            }

            if (!this.operators[0].tehnologije) {
                this.operators[0].tehnologije = [
                    {
                        tip: "wireless",
                        naziv: "tech_2g",
                        opis: "Global System for Mobile",
                        kapacitet: "64 kbps"
                    },
                    {
                        tip: "wireless",
                        naziv: "tech_3g",
                        opis: "Universal Mobile Telecommunications System",
                        kapacitet: "2 Mbps"
                    },
                    {
                        tip: "wireless",
                        naziv: "tech_4g",
                        opis: "Long Term Evolution",
                        kapacitet: "150 Mbps"
                    },
                    {
                        tip: "wireless",
                        naziv: "tech_5g_ready",
                        opis: "5G Ready Infrastructure",
                        kapacitet: "1 Gbps"
                    },
                    {
                        tip: "voice",
                        naziv: "tech_volte",
                        opis: "Voice over LTE",
                        kapacitet: "HD Voice"
                    },
                    {
                        tip: "optical",
                        naziv: "tech_ftth_fttb",
                        opis: "Fiber to the Home/Building",
                        kapacitet: "1 Gbps"
                    },
                    {
                        tip: "copper",
                        naziv: "tech_xdsl",
                        opis: "Digital Subscriber Line family",
                        kapacitet: "100 Mbps"
                    }
                ];
            }

            // Dodaj test podatke drugom operateru
            if (this.operators.length > 1) {
                if (!this.operators[1].usluge) {
                    this.operators[1].usluge = [
                        {
                            kategorija: "mobile",
                            naziv: "Mobilni Prepaid",
                            opis: "Mobilne usluge na prepaid osnovu",
                            status: "active"
                        },
                        {
                            kategorija: "mobile",
                            naziv: "Mobilni Postpaid",
                            opis: "Mobilne usluge na postpaid osnovu",
                            status: "active"
                        },
                        {
                            kategorija: "internet",
                            naziv: "FTTH Internet",
                            opis: "Fiber to the Home internet",
                            status: "active"
                        }
                    ];
                }

                if (!this.operators[1].tehnologije) {
                    this.operators[1].tehnologije = [
                        {
                            tip: "wireless",
                            naziv: "4G/LTE",
                            opis: "Long Term Evolution",
                            kapacitet: "150 Mbps"
                        },
                        {
                            tip: "optical",
                            naziv: "FTTH/FTTB",
                            opis: "Fiber to the Home/Building",
                            kapacitet: "1 Gbps"
                        },
                        {
                            tip: "switching",
                            naziv: "MPLS",
                            opis: "Multiprotocol Label Switching",
                            kapacitet: "10 Gbps"
                        }
                    ];
                }
            }
        }
    }

    // Use the imported standard catalog with legacy compatibility
    getStandardServicesAndTechnologies() {
        return {
            standardServices: standardCatalog.services,
            standardTechnologies: standardCatalog.technologies
        };
    }

    // Fallback funkcije za katalog
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

    // Helper functions for displaying catalog data in edit mode
    getDisplayNameForService(serviceId) {
        if (!serviceId) return '';
        
        // First try to find by ID in catalog
        const catalogData = this.getStandardServicesAndTechnologies();
        const catalogItem = catalogData.standardServices.find(s => s.id === serviceId);
        if (catalogItem) {
            return catalogItem.naziv;
        }
        
        // Fallback to readable name function
        return getReadableServiceName(serviceId) || serviceId;
    }

    getDescriptionForService(serviceId) {
        if (!serviceId) return '';
        
        const catalogData = this.getStandardServicesAndTechnologies();
        const catalogItem = catalogData.standardServices.find(s => s.id === serviceId);
        if (catalogItem) {
            return catalogItem.opis;
        }
        
        // Fallback to tooltip
        return getServiceTooltip(serviceId) || '';
    }

    getDisplayNameForTechnology(techId) {
        if (!techId) return '';
        
        // First try to find by ID in catalog
        const catalogData = this.getStandardServicesAndTechnologies();
        const catalogItem = catalogData.standardTechnologies.find(t => t.id === techId);
        if (catalogItem) {
            return catalogItem.naziv;
        }
        
        // Fallback to readable name function
        return getReadableTechName(techId) || techId;
    }

    getDescriptionForTechnology(techId) {
        if (!techId) return '';
        
        const catalogData = this.getStandardServicesAndTechnologies();
        const catalogItem = catalogData.standardTechnologies.find(t => t.id === techId);
        if (catalogItem) {
            return catalogItem.opis;
        }
        
        // Fallback to tooltip
        return getTechTooltip(techId) || '';
    }

    getCapacityForTechnology(techId) {
        if (!techId) return '';
        
        const catalogData = this.getStandardServicesAndTechnologies();
        const catalogItem = catalogData.standardTechnologies.find(t => t.id === techId);
        if (catalogItem) {
            return catalogItem.capacity;
        }
        
        return '';
    }

    // Helper funkcija za izvlačenje usluga iz detaljne strukture
    extractServicesFromDetailedStructure(operator) {
        const services = [];
        
        // Prvo pokušaj novu strukturu (detaljne_usluge)
        if (operator.detaljne_usluge && typeof operator.detaljne_usluge === 'object') {
            Object.entries(operator.detaljne_usluge).forEach(([category, servicesList]) => {
                if (Array.isArray(servicesList)) {
                    servicesList.forEach(serviceId => {
                        services.push({
                            kategorija: category,
                            naziv: serviceId,
                            opis: this.getDescriptionForService(serviceId) || '',
                            status: 'active'
                        });
                    });
                }
            });
        }
        // Fallback na staru strukturu (usluge)
        else if (operator.usluge && Array.isArray(operator.usluge)) {
            operator.usluge.forEach(service => {
                services.push({
                    kategorija: service.kategorija || 'unknown',
                    naziv: service.naziv || service,
                    opis: service.opis || '',
                    status: service.status || 'active'
                });
            });
        }
        
        return services;
    }

    // Helper funkcija za izvlačenje tehnologija iz detaljne strukture
    extractTechnologiesFromDetailedStructure(operator) {
        const technologies = [];
        
        // Prvo pokušaj novu strukturu (detaljne_tehnologije)
        if (operator.detaljne_tehnologije && typeof operator.detaljne_tehnologije === 'object') {
            Object.entries(operator.detaljne_tehnologije).forEach(([category, techsList]) => {
                if (Array.isArray(techsList)) {
                    techsList.forEach(techId => {
                        technologies.push({
                            tip: category,
                            naziv: techId,
                            opis: this.getDescriptionForTechnology(techId) || '',
                            kapacitet: this.getCapacityForTechnology(techId) || ''
                        });
                    });
                }
            });
        }
        // Fallback na staru strukturu (tehnologije)
        else if (operator.tehnologije && Array.isArray(operator.tehnologije)) {
            operator.tehnologije.forEach(tech => {
                technologies.push({
                    tip: tech.tip || 'unknown',
                    naziv: tech.naziv || tech,
                    opis: tech.opis || '',
                    kapacitet: tech.kapacitet || ''
                });
            });
        }
        
        return technologies;
    }

    async saveOperatorToAPI(operator) {
        try {
            const response = await fetch('/api/save-operator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operatorId: operator.id,
                    operatorData: operator
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Operator saved to API:', result.message);
            return true;
        } catch (error) {
            console.error('Error saving operator to API:', error);
            // Don't show error to user, just log it - localStorage is still updated
            return false;
        }
    }

    async deleteOperatorFromAPI(operatorId) {
        try {
            const response = await fetch(`/api/operator/${operatorId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Operator deleted from API:', result.message);
            return true;
        } catch (error) {
            console.error('Error deleting operator from API:', error);
            // Don't show error to user, just log it - localStorage is still updated
            return false;
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