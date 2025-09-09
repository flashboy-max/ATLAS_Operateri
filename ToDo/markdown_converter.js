/**
 * BULK IMPORT TOOL - Uvoz operatera iz markdown fajlova
 * Čita markdown fajlove iz Pojedinacni_operateri/ foldera i konvertuje ih u JSON format
 */

class MarkdownToJsonConverter {
    constructor() {
        this.operatori = [];
        this.startId = 14; // sledeći ID nakon postojećih 13
    }

    // Čita markdown fajl i ekstraktuje podatke
    parseMarkdownFile(content, filename) {
        const lines = content.split('\n');
        const operator = {
            id: this.startId++,
            naziv: this.extractNaziv(lines, filename),
            komercijalni_naziv: this.extractKomercijalniNaziv(lines),
            tip: this.extractTip(lines),
            status: "aktivan", // default
            opis: this.extractOpis(lines),
            napomena: this.extractNapomenu(lines),
            kontakt: this.extractKontakt(lines),
            tehnicki_kontakti: this.extractTehnickiKontakti(lines),
            detaljne_usluge: this.extractDetaljneUsluge(lines),
            detaljne_tehnologije: this.extractDetaljneTehnologije(lines),
            zakonske_obaveze: this.extractZakonskeObaveze(lines),
            kompletnost: 0, // izračunaće se kasnije
            datum_azuriranja: new Date().toISOString().split('T')[0],
            atlas_status: "U pripremi za ATLAS",
            prioritet: "srednji"
        };

        operator.kontakt_osoba = this.extractKontaktOsoba(operator);
        operator.kompletnost = this.calculateCompleteness(operator);
        
        return operator;
    }

    extractNaziv(lines, filename) {
        // Pokušaj da nađe naziv iz heading-a
        for (let line of lines) {
            if (line.startsWith('# ')) {
                return line.substring(2).trim();
            }
        }
        
        // Fallback: koristi ime fajla
        return filename.replace('.md', '').replace(/\s\(.*\)/, '');
    }

    extractKomercijalniNaziv(lines) {
        for (let line of lines) {
            if (line.toLowerCase().includes('komercijalni naziv') || 
                line.toLowerCase().includes('brend:')) {
                const match = line.match(/[:\-]\s*(.+)/);
                if (match) return match[1].trim();
            }
            
            // Posebni slučajevi za poznate brendove
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('zona.ba')) return 'Zona.ba';
            if (lowerLine.includes('m:tel') || lowerLine.includes('mtel')) return 'm:tel';
            if (lowerLine.includes('haloo')) return 'haloo';
            if (lowerLine.includes('one.vip') || lowerLine.includes('one vip')) return 'ONE';
            if (lowerLine.includes('bh telecom')) return 'BH Telecom';
            if (lowerLine.includes('ht eronet')) return 'HT Eronet';
        }
        return "";
    }

    extractTip(lines) {
        const tipKeywords = {
            'dominantni': ['dominantni', 'najveći operater', 'glavni operater'],
            'mvno': ['mvno', 'virtualni mobilni', 'virtual mobile'],
            'isp': ['internet servis', 'isp', 'internet provajder'],
            'kablovski': ['kablovski', 'cable tv', 'katv'],
            'b2b': ['b2b', 'poslovni', 'enterprise', 'carrier'],
            'mobilni': ['mobilni operater', 'mobile operator']
        };

        let detectedTypes = [];
        const content = lines.join(' ').toLowerCase();

        for (let [type, keywords] of Object.entries(tipKeywords)) {
            if (keywords.some(keyword => content.includes(keyword))) {
                detectedTypes.push(this.getTipDisplayName(type));
            }
        }

        return detectedTypes.length > 0 ? detectedTypes.join(', ') : 'Internet servis provajder';
    }

    getTipDisplayName(type) {
        const displayNames = {
            'dominantni': 'Dominantni operater',
            'mvno': 'MVNO operater', 
            'isp': 'Internet servis provajder',
            'kablovski': 'Kablovski operater',
            'b2b': 'B2B provajder',
            'mobilni': 'Mobilni operater'
        };
        return displayNames[type] || type;
    }

    extractOpis(lines) {
        let opis = "";
        let inOpis = false;
        
        for (let line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Početak opisa
            if (lowerLine.includes('opis:') || 
                lowerLine.includes('o kompaniji:') ||
                lowerLine.includes('pregled:')) {
                inOpis = true;
                const match = line.match(/[:\-]\s*(.+)/);
                if (match) opis += match[1].trim() + " ";
                continue;
            }
            
            // Nastavi čitanje opisa
            if (inOpis && line.trim() && !line.startsWith('#')) {
                opis += line.trim() + " ";
            }
            
            // Kraj opisa kad naiđe na sledeći naslov
            if (inOpis && line.startsWith('#')) {
                break;
            }
        }
        
        return opis.trim();
    }

    extractNapomenu(lines) {
        for (let line of lines) {
            if (line.toLowerCase().includes('napomena:') ||
                line.toLowerCase().includes('posebno:')) {
                const match = line.match(/[:\-]\s*(.+)/);
                if (match) return match[1].trim();
            }
        }
        return "";
    }

    extractKontakt(lines) {
        const kontakt = {
            adresa: "",
            telefon: "",
            email: "",
            web: "",
            customer_service: {},
            drustvene_mreze: {}
        };

        for (let line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Adresa - poboljšano prepoznavanje
            if (lowerLine.includes('sjedište') || lowerLine.includes('adresa:') || 
                lowerLine.includes('lokacija:')) {
                // Ukloni prefiks (broj, zvezde, itd.) i uzmi adresu
                let match = line.match(/[\*\-\s]*.*?[:\-]\s*(.+)/);
                if (match) {
                    kontakt.adresa = match[1].trim()
                        .replace(/[\*\-\+]/g, '') // ukloni markdown znakove
                        .trim();
                }
            }
            
            // Telefon - poboljšano prepoznavanje
            if (lowerLine.includes('telefon:') || lowerLine.includes('tel:') ||
                lowerLine.includes('glavni telefon:')) {
                let match = line.match(/[\*\-\s]*.*?[:\-]\s*(.+)/);
                if (match) {
                    const phoneText = match[1].trim();
                    // Uzmi prvi telefon broj koji nađe
                    const phoneMatch = phoneText.match(/[\+\d\s\-\(\)]+/);
                    if (phoneMatch) kontakt.telefon = phoneMatch[0].trim();
                }
            }
            
            // Email
            if (lowerLine.includes('email:') || lowerLine.includes('e-mail:') ||
                lowerLine.includes('glavni email:')) {
                const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                if (match) kontakt.email = match[0];
            }
            
            // Web stranica
            if (lowerLine.includes('web stranica:') || lowerLine.includes('website:') || 
                lowerLine.includes('web:') || line.includes('http')) {
                const match = line.match(/(https?:\/\/[^\s\)]+)/);
                if (match) {
                    kontakt.web = match[1];
                } else if (lowerLine.includes('web stranica:')) {
                    // Pokušaj da uzme URL nakon dvotačke
                    const urlMatch = line.match(/web stranica:\s*(.+)/i);
                    if (urlMatch) {
                        kontakt.web = urlMatch[1].trim();
                    }
                }
            }
            
            // Customer service
            if (lowerLine.includes('customer service:')) {
                const match = line.match(/customer service:\s*(.+)/i);
                if (match) {
                    const csText = match[1].trim();
                    const phoneMatch = csText.match(/[\+\d\s\-\(\)]+/);
                    if (phoneMatch) {
                        kontakt.customer_service = {
                            telefon: phoneMatch[0].trim(),
                            radno_vreme: csText.includes('24/7') ? '24/7' : 'Standardno'
                        };
                    }
                }
            }
        }

        return kontakt;
    }

    extractTehnickiKontakti(lines) {
        // Za sada vraćam prazan niz - ovo ćemo popuniti ručno za ključne operatere
        return [];
    }

    extractDetaljneUsluge(lines) {
        const usluge = {
            mobilne: [],
            fiksne: [],
            internet: [],
            tv: [],
            cloud_poslovne: [],
            dodatne: []
        };

        let currentSection = '';
        let sectionEnabled = false;

        for (let line of lines) {
            const lowerLine = line.toLowerCase();
            
            // Prepoznavanje sekcija po emojima/oznakama
            if (line.includes('✅') && lowerLine.includes('mobilne')) {
                currentSection = 'mobilne';
                sectionEnabled = true;
                continue;
            } else if (line.includes('✅') && lowerLine.includes('internet')) {
                currentSection = 'internet';
                sectionEnabled = true;
                continue;
            } else if (line.includes('✅') && (lowerLine.includes('fiksne') || lowerLine.includes('fixed'))) {
                currentSection = 'fiksne';
                sectionEnabled = true;
                continue;
            } else if (line.includes('✅') && (lowerLine.includes('tv') || lowerLine.includes('video'))) {
                currentSection = 'tv';
                sectionEnabled = true;
                continue;
            } else if (line.includes('❌')) {
                sectionEnabled = false;
                continue;
            }
            
            // Ako smo u enabled sekciji, čitaj usluge
            if (sectionEnabled && line.trim().startsWith('-') && currentSection) {
                let serviceName = line.replace(/^[\s\-\*]+/, '').trim();
                
                // Ukloni markdown znakove i opise u zagradama
                serviceName = serviceName.replace(/\([^)]*\)/g, '').trim();
                
                if (serviceName) {
                    // Kategorisanje na osnovu naziva
                    if (currentSection === 'mobilne') {
                        if (serviceName.toLowerCase().includes('prepaid')) {
                            usluge.mobilne.push('GSM Prepaid');
                        } else if (serviceName.toLowerCase().includes('postpaid')) {
                            usluge.mobilne.push('GSM Postpaid');
                        } else if (serviceName.toLowerCase().includes('data')) {
                            usluge.mobilne.push('Mobilni internet');
                        } else if (serviceName.toLowerCase().includes('roaming')) {
                            usluge.mobilne.push('Roaming');
                        } else if (serviceName.toLowerCase().includes('volte')) {
                            usluge.mobilne.push('VoLTE/VoWiFi');
                        } else {
                            usluge.mobilne.push(serviceName);
                        }
                    } else if (currentSection === 'internet') {
                        if (serviceName.toLowerCase().includes('fixed') || serviceName.toLowerCase().includes('fiksni')) {
                            usluge.internet.push('Fiksni internet');
                        } else if (serviceName.toLowerCase().includes('wireless') || serviceName.toLowerCase().includes('bežični')) {
                            usluge.internet.push('Bežični internet');
                        } else if (serviceName.toLowerCase().includes('business') || serviceName.toLowerCase().includes('poslovni')) {
                            usluge.internet.push('Poslovni internet');
                        } else {
                            usluge.internet.push(serviceName);
                        }
                    } else if (currentSection === 'fiksne') {
                        usluge.fiksne.push(serviceName);
                    } else if (currentSection === 'tv') {
                        usluge.tv.push(serviceName);
                    }
                }
            }
        }
        
        // Fallback - ako ne nađe specifične oznake, koristi opšte prepoznavanje
        if (Object.values(usluge).every(arr => arr.length === 0)) {
            const content = lines.join(' ').toLowerCase();
            
            if (content.includes('gsm') || content.includes('mobilni')) {
                if (content.includes('prepaid')) usluge.mobilne.push('GSM Prepaid');
                if (content.includes('postpaid')) usluge.mobilne.push('GSM Postpaid');
                if (content.includes('mvno')) usluge.mobilne.push('MVNO');
            }
            
            if (content.includes('internet') || content.includes('isp')) {
                if (content.includes('ftth') || content.includes('optički')) usluge.internet.push('FTTH');
                if (content.includes('adsl') || content.includes('xdsl')) usluge.internet.push('xDSL');
                if (content.includes('bežični') || content.includes('wireless')) usluge.internet.push('Bežični internet');
                if (content.includes('poslovni')) usluge.internet.push('Poslovni internet');
            }
        }

        return usluge;
    }

    extractDetaljneTehnologije(lines) {
        const tehnologije = {
            mobilne: [],
            fiksne: [],
            mrezne: []
        };

        const content = lines.join(' ').toLowerCase();
        
        // Mobilne tehnologije
        if (content.includes('2g') || content.includes('gsm')) tehnologije.mobilne.push('GSM 900/1800');
        if (content.includes('3g') || content.includes('umts')) tehnologije.mobilne.push('UMTS 900/2100');
        if (content.includes('4g') || content.includes('lte')) tehnologije.mobilne.push('LTE 800/1800/2600');
        if (content.includes('5g')) tehnologije.mobilne.push('5G 3500');
        if (content.includes('volte')) tehnologije.mobilne.push('VoLTE');
        
        // Mrežne tehnologije
        if (content.includes('ftth') || content.includes('optički')) tehnologije.mrezne.push('FTTH/FTTB');
        if (content.includes('adsl') || content.includes('xdsl')) tehnologije.mrezne.push('xDSL');
        if (content.includes('docsis')) tehnologije.mrezne.push('DOCSIS');
        if (content.includes('mpls')) tehnologije.mrezne.push('MPLS');
        
        // Fiksne tehnologije
        if (content.includes('pstn')) tehnologije.fiksne.push('PSTN');
        if (content.includes('voip') || content.includes('sip')) tehnologije.fiksne.push('VoIP');

        return tehnologije;
    }

    extractZakonskeObaveze(lines) {
        return {
            zakonito_presretanje: null,
            implementacija: "",
            kontakt_osoba: "",
            posleduje_misljenje_zuo: null,
            pristup_obracunskim_podacima: null,
            napomene: ""
        };
    }

    extractKontaktOsoba(operator) {
        // Pokušaj da nađe kontakt osobu iz tehničkih kontakata ili opisa
        if (operator.tehnicki_kontakti.length > 0) {
            return operator.tehnicki_kontakti[0].ime;
        }
        return "";
    }

    calculateCompleteness(operator) {
        let score = 0;
        const maxScore = 100;
        
        // Osnovni podaci (40 poena)
        if (operator.naziv) score += 10;
        if (operator.tip) score += 10;
        if (operator.opis) score += 10;
        if (operator.status) score += 10;
        
        // Kontakt podaci (30 poena)
        if (operator.kontakt.adresa) score += 10;
        if (operator.kontakt.telefon) score += 10;
        if (operator.kontakt.email) score += 10;
        
        // Usluge i tehnologije (20 poena)
        const ukupnoUsluga = Object.values(operator.detaljne_usluge).reduce((acc, arr) => acc + arr.length, 0);
        if (ukupnoUsluga > 0) score += 10;
        
        const ukupnoTehnologija = Object.values(operator.detaljne_tehnologije).reduce((acc, arr) => acc + arr.length, 0);
        if (ukupnoTehnologija > 0) score += 10;
        
        // Dodatni podaci (10 poena)
        if (operator.kontakt.web) score += 5;
        if (operator.napomena) score += 5;
        
        return Math.min(score, maxScore);
    }

    // Glavna funkcija za konverziju svih markdown fajlova
    async convertAllMarkdownFiles(markdownFiles) {
        for (let fileData of markdownFiles) {
            try {
                const operator = this.parseMarkdownFile(fileData.content, fileData.filename);
                this.operatori.push(operator);
                console.log(`✅ Konvertovan: ${operator.naziv}`);
            } catch (error) {
                console.error(`❌ Greška pri konverziji ${fileData.filename}:`, error);
            }
        }
        
        return this.operatori;
    }
}

// Export za korišćenje u web interfejsu
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownToJsonConverter;
} else if (typeof window !== 'undefined') {
    window.MarkdownToJsonConverter = MarkdownToJsonConverter;
}
