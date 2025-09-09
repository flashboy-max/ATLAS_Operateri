// ATLAS Telekomunikacioni Operateri BiH - Aplikacija
// Version: 1.0
// Date: 2025-07-31

// Import standard catalog
import { standardCatalog, catalogUtils } from './generated/standard_catalog.js';

// Import components
import { OperatorCard } from './src/components/OperatorCard.js';

// Import services
import { DataImportExportService } from './src/services/DataImportExportService.js';

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
}

document.head.appendChild(notificationStyles);













