/**
 * OperatorCard component for ATLAS operators
 * Handles operator details display, contact info generation, and operator management
 */
import { getServiceTooltip, getTechTooltip, getReadableServiceName, getReadableTechName } from '../utils/formatters.js';

export class OperatorCard {
    constructor(app, notificationManager, storageService) {
        this.app = app;
        this.notificationManager = notificationManager;
        this.storageService = storageService;
    }

    /**
     * Toggle operator details visibility
     * @param {number} id - Operator ID
     */
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

    /**
     * Clean up duplicate tooltips
     */
    cleanupDuplicateTooltips() {
        // Remove duplicate tooltips that might have been created
        const tooltips = document.querySelectorAll('[id^="tooltip-"]');
        const seen = new Set();

        tooltips.forEach(tooltip => {
            const id = tooltip.id;
            if (seen.has(id)) {
                tooltip.remove();
            } else {
                seen.add(id);
            }
        });
    }

    /**
     * Generate HTML for operator details
     * @param {Object} operator - Operator data
     * @returns {string} - HTML string
     */
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

    /**
     * Generate contact information HTML
     * @param {Object} operator - Operator data
     * @returns {string} - HTML string
     */
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
                    <span class="detail-label">🌐 Web stranica:</span>
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
                    <span class="detail-label">🏢 Adresa:</span>
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

    /**
     * Generate detailed services HTML
     * @param {Object} operator - Operator data
     * @returns {string} - HTML string
     */
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

    /**
     * Format services list for old structure
     * @param {Array} services - Services array
     * @returns {string} - HTML string
     */
    formatServicesList(services) {
        if (!services || services.length === 0) {
            return '<span class="no-data">Nisu navedene usluge</span>';
        }

        return services.map(service => {
            const serviceName = typeof service === 'string' ? service : service.naziv || service;
            return `<span class="service-tag">${serviceName}</span>`;
        }).join('');
    }

    /**
     * Generate detailed technologies HTML
     * @param {Object} operator - Operator data
     * @returns {string} - HTML string
     */
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

    /**
     * Format technologies list for old structure
     * @param {Array} technologies - Technologies array
     * @returns {string} - HTML string
     */
    formatTechnologiesList(technologies) {
        if (!technologies || technologies.length === 0) {
            return '<span class="no-data">Nisu navedene tehnologije</span>';
        }

        return technologies.map(tech => {
            const techName = typeof tech === 'string' ? tech : tech.naziv || tech;
            return `<span class="tech-tag">${techName}</span>`;
        }).join('');
    }

    /**
     * Delete operator
     * @param {number} id - Operator ID
     */
    deleteOperator(id) {
        const operator = this.app.operators.find(op => op.id === id);
        if (operator && confirm(`Da li ste sigurni da želite da obrišete operatera "${operator.naziv}"?`)) {
            console.log('Brisanje operatera sa ID:', id, 'naziv:', operator.naziv);
            const preCount = this.app.operators.length;
            this.app.operators = this.app.operators.filter(op => op.id !== id);
            const postCount = this.app.operators.length;
            console.log('Operateri prije brisanja:', preCount, 'nakon brisanja:', postCount);

            this.storageService.saveToLocalStorage(this.app.operators);
            this.app.renderOperators();
            this.app.updateStatistics();
            this.notificationManager.showNotification('Operater je uspešno obrisan!', 'success');
        }
    }

    // ===== HELPER FUNCTIONS =====

    /**
     * Get contact type name
     * @param {string} tip - Contact type
     * @returns {string} - Contact type name
     */
    getContactTypeName(tip) {
        const tipovi = {
            'bezbednost': 'Bezbednost',
            'tehnicki': 'Tehnički',
            'pravni': 'Pravni',
            'poslovni': 'Poslovni'
        };
        return tipovi[tip] || tip;
    }

    /**
     * Get service type name
     * @param {string} tip - Service type
     * @returns {string} - Service type name
     */
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

    /**
     * Get social platform name
     * @param {string} platform - Platform name
     * @returns {string} - Platform display name
     */
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

    /**
     * Get service category icon
     * @param {string} kategorija - Category name
     * @returns {string} - Icon emoji
     */
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

    /**
     * Get service category name
     * @param {string} kategorija - Category name
     * @returns {string} - Category display name
     */
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

    /**
     * Get tech category icon
     * @param {string} kategorija - Category name
     * @returns {string} - Icon emoji
     */
    getTechCategoryIcon(kategorija) {
        const ikone = {
            'mobilne': '📱',
            'fiksne': '📞',
            'mrezne': '🌐'
        };
        return ikone[kategorija] || '⚙️';
    }

    /**
     * Get tech category name
     * @param {string} kategorija - Category name
     * @returns {string} - Category display name
     */
    getTechCategoryName(kategorija) {
        const nazivi = {
            'mobilne': 'Mobilne tehnologije',
            'fiksne': 'Fiksne tehnologije',
            'mrezne': 'Mrežne tehnologije'
        };
        return nazivi[kategorija] || kategorija;
    }
}
