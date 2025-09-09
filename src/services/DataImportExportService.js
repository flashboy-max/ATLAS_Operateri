/**
 * Data Import/Export Service for ATLAS operators
 * Handles JSON file import and export operations
 */
export class DataImportExportService {
    constructor(storageService, notificationManager) {
        this.storageService = storageService;
        this.notificationManager = notificationManager;
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
                    totalOperators: operators.length,
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

            console.log('✅ Export završen:', {
                fileName: link.download,
                operators: exportData.operateri.length,
                timestamp: exportData.metadata.exportedAt
            });

            this.notificationManager.showNotification(`📥 Izvoženo ${exportData.operateri.length} operatera u fajl: ${link.download}`, 'success', 5000);

            // Sakrij sync status bar jer su podaci izvezeni
            this.notificationManager.hideSyncStatus();

            // Dodaj visual feedback sa instrukcijama
            setTimeout(() => {
                this.notificationManager.showNotification('💡 Tip: Zamenite stari operateri.json sa novo izvoženim fajlom da sačuvate promene', 'info', 8000);
            }, 2000);

        } catch (error) {
            console.error('❌ Greška pri exportu:', error);
            this.notificationManager.showNotification('Greška pri exportu podataka', 'error');
        }
    }

    /**
     * Handle file import from file input event
     */
    async handleFileImport(event, currentOperators, updateCallback) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            this.notificationManager.showNotification('Molimo izaberite JSON fajl', 'error');
            return;
        }

        try {
            const fileContent = await this.readFileAsText(file);
            const importData = JSON.parse(fileContent);

            if (!this.validateImportData(importData)) {
                this.notificationManager.showNotification('Neispravni format JSON fajla', 'error');
                return;
            }

            await this.processImportData(importData, currentOperators, updateCallback);

        } catch (error) {
            console.error('Import error:', error);
            this.notificationManager.showNotification('Greška pri učitavanju fajla: ' + error.message, 'error');
        } finally {
            // Clear file input
            event.target.value = '';
        }
    }

    /**
     * Read file as text using FileReader API
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Greška pri čitanju fajla'));
            reader.readAsText(file);
        });
    }

    /**
     * Validate import data structure
     */
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

    /**
     * Process imported data and merge with existing operators
     */
    async processImportData(importData, currentOperators, updateCallback) {
        const operators = Array.isArray(importData) ? importData : importData.operateri || importData.operators;

        if (!confirm(`Želite li da uvezete ${operators.length} operatera? Ovo može prepisati postojeće podatke.`)) {
            return;
        }

        this.notificationManager.showLoading(true);

        try {
            let importedCount = 0;
            let updatedCount = 0;

            for (const importOperator of operators) {
                // Dodeli ID ako nema
                if (!importOperator.id) {
                    importOperator.id = Math.max(...currentOperators.map(op => op.id), 0) + 1;
                }

                // Proverava da li operator već postoji
                const existingIndex = currentOperators.findIndex(op =>
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
                    currentOperators[existingIndex] = processedOperator;
                    updatedCount++;
                } else {
                    // Dodaje novi
                    currentOperators.push(processedOperator);
                    importedCount++;
                }
            }

            // Save updated operators
            this.storageService.saveToLocalStorage(currentOperators);

            this.notificationManager.showNotification(
                `Uspešno uvezeno: ${importedCount} novih, ${updatedCount} ažuriranih operatera`,
                'success'
            );

            // Call update callback to refresh UI
            if (updateCallback) {
                updateCallback(currentOperators);
            }

        } catch (error) {
            console.error('❌ Greška pri procesuiranju import podataka:', error);
            this.notificationManager.showNotification('Greška pri procesuiranju uvezenih podataka', 'error');
        } finally {
            this.notificationManager.showLoading(false);
        }
    }

    /**
     * Calculate completeness for operator
     */
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
}
