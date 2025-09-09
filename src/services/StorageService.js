/**
 * Storage Service for ATLAS operators data persistence
 * Handles loading, saving, importing and exporting operator data
 */
export class StorageService {
    constructor(notificationManager = null) {
        this.storageKey = 'atlas_operators_data';
        this.notificationManager = notificationManager;
    }

    /**
     * Load operators data with priority system:
     * 1. LocalStorage (for persistence of user changes)
     * 2. JSON file (fallback)
     * 3. Demo data (last resort)
     */
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
                console.log('🎯 PRIORITET: Učitani podaci IZ LOCALSTORAGE (persistencija brisanja/dodavanja)');
                console.log('   - Ukupno operatera:', localData.operateri.length);
                console.log('   - Verzija:', localVersion);
                console.log('   - Izvor: LocalStorage (prioritet)');
                return localData.operateri; // VRATI podatke umesto da ih postavljaš
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

            const operators = jsonData.operateri || [];
            this.saveToLocalStorage(operators, jsonData); // Sačuvaj u LocalStorage za budućnost
            console.log('📄 Podaci učitani IZ JSON FAJLA (fallback):', operators.length, 'operatera');
            console.log('   - Verzija:', jsonVersion);
            console.log('   - Sačuvano u LocalStorage za sljedeći put');

            return operators;

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
                    const operators = parsedData.operateri || [];
                    console.log('🔄 FALLBACK: Učitani podaci IZ LOCALSTORAGE zbog greške JSON-a:', operators.length, 'operatera');
                    return operators;
                } catch (parseError) {
                    console.warn('⚠️ Greška pri parsiranju LocalStorage u fallback-u:', parseError);
                }
            }

            // FALLBACK 2: Demo podaci
            console.log('🚨 KRAJNJ FALLBACK: Koriste se demo podaci');
            return this.getDemoData();
        }
    }

    /**
     * Force reload data from JSON file, clearing LocalStorage cache
     */
    async forceReloadFromJSON() {
        try {
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
                const operators = data;
                this.saveToLocalStorage(operators);
                console.log(`✅ Reload uspješan! Učitano ${data.length} operatera`);

                // Prikaži potvrdu korisniku
                if (this.notificationManager) {
                    this.notificationManager.showNotification(`Reload uspješan! Učitano ${data.length} operatera.`, 'success');
                } else {
                    alert(`Reload uspješan! Učitano ${data.length} operatera.`);
                }

                return operators;
            } else {
                throw new Error('JSON nije valjan niz operatera');
            }

        } catch (error) {
            console.error('❌ Greška pri reload-u:', error);
            const errorMessage = 'Greška pri reload-u podataka: ' + error.message;

            if (this.notificationManager) {
                this.notificationManager.showNotification(errorMessage, 'error');
            } else {
                alert(errorMessage);
            }

            throw error;
        }
    }

    /**
     * Save operators data to LocalStorage
     */
    saveToLocalStorage(operators, fullData = null) {
        try {
            let dataToSave;

            if (fullData) {
                // Ako je prosleđena cela struktura podataka, koristi je
                dataToSave = {
                    operateri: operators,
                    version: fullData.version || '2.1',
                    metadata: {
                        lastUpdated: new Date().toISOString(),
                        source: 'JSON file'
                    }
                };
            } else {
                // Inače kreiraj osnovnu strukturu
                dataToSave = {
                    operateri: operators,
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
            if (this.notificationManager) {
                this.notificationManager.showSyncStatus();
            }

        } catch (error) {
            console.error('Greška pri čuvanju u LocalStorage:', error);
            if (this.notificationManager) {
                this.notificationManager.showNotification('Greška pri čuvanju podataka', 'error');
            }
        }
    }

    /**
     * Export operators data to JSON file for download
     */
    exportData(operators) {
        try {
            // Kreiraj podatke za export u istom formatu kao operateri.json
            const exportData = {
                operateri: operators,
                version: '2.1',
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    source: 'ATLAS application - exported changes',
                    exportedAt: new Date().toISOString(),
                    totalOperators: operators.length
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

            if (this.notificationManager) {
                this.notificationManager.showNotification(`📥 Izvoženo ${exportData.operateri.length} operatera u fajl: ${a.download}`, 'success', 5000);
            }

        } catch (error) {
            console.error('❌ Greška pri exportu:', error);
            if (this.notificationManager) {
                this.notificationManager.showNotification('Greška pri exportu podataka', 'error');
            }
        }
    }

    /**
     * Import operators data from JSON file
     */
    importDataFromFile(callback) {
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
                    const operators = importedData.operateri;

                    // Sačuvaj u LocalStorage
                    this.saveToLocalStorage(operators, importedData);

                    console.log('✅ Import završen:', {
                        fileName: file.name,
                        operators: importedData.operateri.length,
                        version: importedData.version
                    });

                    if (this.notificationManager) {
                        this.notificationManager.showNotification(`📤 Učitano ${importedData.operateri.length} operatera iz fajla: ${file.name}`, 'success', 5000);
                    }

                    // Pozovi callback sa učitanim podacima
                    if (callback) {
                        callback(operators, importedData);
                    }

                } catch (error) {
                    console.error('❌ Greška pri importu:', error);
                    if (this.notificationManager) {
                        this.notificationManager.showNotification('Greška pri čitanju fajla - proverite format', 'error');
                    }
                }
            };

            reader.readAsText(file);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    /**
     * Show CORS warning to user
     */
    showCORSWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            max-width: 400px;
            text-align: center;
        `;
        warning.innerHTML = `
            <h3 style="color: #92400e; margin: 0 0 10px 0;">🔒 CORS Greška</h3>
            <p style="color: #78350f; margin: 0 0 15px 0;">
                Potreban je HTTP server za učitavanje JSON podataka.
            </p>
            <p style="color: #92400e; font-weight: bold; margin: 0;">
                Pokrenite: <code>python -m http.server 8000</code>
            </p>
        `;

        document.body.appendChild(warning);

        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 10000);
    }

    /**
     * Get demo data as last resort fallback
     */
    getDemoData() {
        return [
            {
                id: 1,
                naziv: "Demo Operater 1",
                komercijalni_naziv: "Demo Op 1",
                kategorija: "dominantni",
                tip: "Dominantni operater",
                status: "aktivan",
                opis: "Demo operater za testiranje",
                adresa: "Demo Adresa 1",
                telefon: "+387 65 123 456",
                email: "demo1@example.com",
                web: "https://demo1.com",
                atlas_status: "U pripremi za ATLAS",
                prioritet: "visoki",
                kompletnost: 85,
                kontakt_osoba: "Demo Kontakt 1",
                datum_azuriranja: new Date().toISOString().split('T')[0]
            },
            {
                id: 2,
                naziv: "Demo Operater 2",
                komercijalni_naziv: "Demo Op 2",
                kategorija: "mobilni_mvno",
                tip: "Mobilni operater",
                status: "aktivan",
                opis: "Drugi demo operater",
                adresa: "Demo Adresa 2",
                telefon: "+387 65 234 567",
                email: "demo2@example.com",
                web: "https://demo2.com",
                atlas_status: "U pripremi za ATLAS",
                prioritet: "srednji",
                kompletnost: 70,
                kontakt_osoba: "Demo Kontakt 2",
                datum_azuriranja: new Date().toISOString().split('T')[0]
            }
        ];
    }
}
