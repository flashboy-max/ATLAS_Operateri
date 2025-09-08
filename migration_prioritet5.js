/**
 * PRIORITET 5 - Migration Script za Proširenje Strukture Podataka
 * Migrira postojeće operatere u novu proširenu strukturu
 */

class OperatorMigrator {
    
    constructor() {
        this.serviceCategories = {
            'mobile_prepaid': 'mobilne',
            'mobile_postpaid': 'mobilne', 
            'internet_ftth': 'internet',
            'internet_business': 'internet',
            'internet_fixed_wireless': 'internet',
            'fixed_voip': 'fiksne',
            'iptv': 'tv',
            'data_transfer': 'cloud_poslovne',
            'colocation': 'cloud_poslovne',
            'sms_gateway': 'dodatne'
        };
        
        this.techCategories = {
            'tech_gsm': 'mobilne',
            'tech_3g': 'mobilne',
            'tech_4g_lte': 'mobilne',
            'tech_5g': 'mobilne',
            'tech_voip_fixed': 'fiksne',
            'tech_sip': 'fiksne',
            'tech_pstn': 'fiksne',
            'tech_ftth': 'mrezne',
            'tech_fixed_wireless': 'mrezne',
            'tech_mpls': 'mrezne',
            'tech_ipv4': 'mrezne',
            'tech_ipv6': 'mrezne'
        };
    }
    
    /**
     * Migrira postojeći operator u novu strukturu
     */
    migrateOperator(oldOperator) {
        const newOperator = {
            // Postojeća polja - zadržana
            id: oldOperator.id,
            naziv: oldOperator.naziv,
            komercijalni_naziv: oldOperator.komercijalni_naziv,
            tip: oldOperator.tip,
            status: oldOperator.status,
            
            // NOVA POLJA - osnovni podaci
            opis: oldOperator.opis || "Detaljan opis operatera će biti ažuriran...",
            napomena: oldOperator.napomena || "",
            
            // REORGANIZOVANI KONTAKT
            kontakt: {
                adresa: oldOperator.adresa || "",
                telefon: oldOperator.telefon || "",
                email: oldOperator.email || "",
                web: oldOperator.web || "",
                customer_service: {},
                drustvene_mreze: {}
            },
            
            // NOVA SEKCIJA - tehnički kontakti
            tehnicki_kontakti: this.createTechnicalContacts(oldOperator),
            
            // REORGANIZOVANE USLUGE po kategorijama
            detaljne_usluge: this.categorizeServices(oldOperator.usluge || []),
            
            // REORGANIZOVANE TEHNOLOGIJE po kategorijama
            detaljne_tehnologije: this.categorizeTechnologies(oldOperator.tehnologije || []),
            
            // NOVA SEKCIJA - zakonske obaveze
            zakonske_obaveze: {
                zakonito_presretanje: null,
                implementacija: "",
                kontakt_osoba: oldOperator.kontakt_osoba || "",
                posleduje_misljenje_zuo: null,
                pristup_obracunskim_podacima: null,
                napomene: ""
            },
            
            // Postojeća polja - zadržana
            kompletnost: oldOperator.kompletnost || 0,
            datum_azuriranja: oldOperator.datum_azuriranja || new Date().toISOString().split('T')[0],
            
            // Deprecated polja - zadržati za kompatibilnost
            atlas_status: oldOperator.atlas_status,
            prioritet: oldOperator.prioritet,
            kontakt_osoba: oldOperator.kontakt_osoba // deprecated, koristiti tehnicki_kontakti
        };
        
        return newOperator;
    }
    
    /**
     * Kreira tehnički kontakte na osnovu postojećih podataka
     */
    createTechnicalContacts(oldOperator) {
        const contacts = [];
        
        if (oldOperator.kontakt_osoba && oldOperator.kontakt_osoba !== "[potrebno dopuniti]") {
            contacts.push({
                ime: oldOperator.kontakt_osoba,
                pozicija: "Tehnički kontakt",
                email: oldOperator.email || "",
                telefon: oldOperator.telefon || "",
                tip_kontakta: "tehnicki"
            });
        }
        
        return contacts;
    }
    
    /**
     * Kategoriše usluge u nove kategorije
     */
    categorizeServices(oldServices) {
        const categories = {
            mobilne: [],
            fiksne: [],
            internet: [],
            tv: [],
            cloud_poslovne: [],
            dodatne: []
        };
        
        oldServices.forEach(service => {
            const category = this.serviceCategories[service] || 'dodatne';
            const serviceName = this.getServiceDisplayName(service);
            if (serviceName && !categories[category].includes(serviceName)) {
                categories[category].push(serviceName);
            }
        });
        
        return categories;
    }
    
    /**
     * Kategoriše tehnologije u nove kategorije
     */
    categorizeTechnologies(oldTechnologies) {
        const categories = {
            mobilne: [],
            fiksne: [],
            mrezne: []
        };
        
        oldTechnologies.forEach(tech => {
            const category = this.techCategories[tech] || 'mrezne';
            const techName = this.getTechDisplayName(tech);
            if (techName && !categories[category].includes(techName)) {
                categories[category].push(techName);
            }
        });
        
        return categories;
    }
    
    /**
     * Pretvara service kod u human-readable naziv
     */
    getServiceDisplayName(serviceCode) {
        const serviceNames = {
            'mobile_prepaid': 'GSM Prepaid',
            'mobile_postpaid': 'GSM Postpaid',
            'internet_ftth': 'FTTH',
            'internet_business': 'Poslovni internet',
            'internet_fixed_wireless': 'Bežični internet',
            'fixed_voip': 'IP telefonija',
            'iptv': 'IPTV',
            'data_transfer': 'Prenos podataka',
            'colocation': 'Kolokacija',
            'sms_gateway': 'SMS Gateway'
        };
        
        return serviceNames[serviceCode] || serviceCode;
    }
    
    /**
     * Pretvara tech kod u human-readable naziv
     */
    getTechDisplayName(techCode) {
        const techNames = {
            'tech_gsm': 'GSM 900/1800',
            'tech_3g': 'UMTS 900/2100',
            'tech_4g_lte': 'LTE',
            'tech_5g': '5G',
            'tech_voip_fixed': 'VoIP',
            'tech_sip': 'SIP',
            'tech_pstn': 'PSTN',
            'tech_ftth': 'FTTH/FTTB',
            'tech_fixed_wireless': 'Fixed Wireless',
            'tech_mpls': 'MPLS',
            'tech_ipv4': 'IPv4',
            'tech_ipv6': 'IPv6',
            'tech_data_center': 'Data Center',
            'tech_carrier_grade': 'Carrier Grade'
        };
        
        return techNames[techCode] || techCode;
    }
    
    /**
     * Migrira celu bazu operatera
     */
    migrateDatabase(oldData) {
        console.log('🔄 Početak migracije baze podataka...');
        
        const newOperatori = oldData.operateri.map((operator, index) => {
            console.log(`📝 Migriram operator ${index + 1}/${oldData.operateri.length}: ${operator.naziv}`);
            return this.migrateOperator(operator);
        });
        
        const newData = {
            operateri: newOperatori,
            version: "2.0",
            migrated_at: new Date().toISOString(),
            migration_notes: "Migracija PRIORITET 5 - Proširena struktura podataka sa tehničkim kontaktima, kategorisanim uslugama/tehnologijama i zakonskim obavezama"
        };
        
        console.log('✅ Migracija završena uspešno!');
        console.log(`📊 Migriran ${newOperatori.length} operatera`);
        
        return newData;
    }
}

// Export za browser usage
if (typeof window !== 'undefined') {
    window.OperatorMigrator = OperatorMigrator;
}

// Export za Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperatorMigrator;
}
