#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS BULK IMPORT SCRIPT
Automatski uvozi sve markdown operatere u JSON bazu
"""

import json
import os
import re
from datetime import datetime

class AtlasBulkImporter:
    def __init__(self):
        self.operators = []
        self.start_id = 14  # početni ID za nove operatere
        
    def parse_markdown_file(self, filepath, filename):
        """Parsiraj markdown fajl i izvuči podatke operatera"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            
            operator = {
                "id": self.start_id,
                "naziv": self.extract_naziv(lines, filename),
                "komercijalni_naziv": self.extract_komercijalni_naziv(lines),
                "tip": self.extract_tip(lines),
                "status": "aktivan",
                "opis": self.extract_opis(lines),
                "napomena": self.extract_napomenu(lines),
                "kontakt": self.extract_kontakt(lines),
                "tehnicki_kontakti": [],  # popuniće se ručno za ključne operatere
                "detaljne_usluge": self.extract_detaljne_usluge(lines),
                "detaljne_tehnologije": self.extract_detaljne_tehnologije(lines),
                "zakonske_obaveze": self.extract_zakonske_obaveze(lines),
                "kompletnost": 0,
                "datum_azuriranja": datetime.now().strftime("%Y-%m-%d"),
                "atlas_status": "U pripremi za ATLAS",
                "prioritet": "srednji",
                "kontakt_osoba": ""
            }
            
            operator["kompletnost"] = self.calculate_completeness(operator)
            self.start_id += 1
            
            return operator
            
        except Exception as e:
            print(f"❌ Greška pri parsiranju {filename}: {e}")
            return None
    
    def extract_naziv(self, lines, filename):
        """Izvuci naziv operatera iz heading-a ili imena fajla"""
        for line in lines:
            if line.startswith('# ') and 'ATLAS' not in line:
                return line[2:].strip()
        
        # Fallback: koristi ime fajla
        return filename.replace('.md', '').strip()
    
    def extract_komercijalni_naziv(self, lines):
        """Izvuci komercijalni naziv"""
        for line in lines:
            if 'komercijalni naziv:' in line.lower():
                match = re.search(r'komercijalni naziv:\s*\*\*(.+?)\*\*', line, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        return ""
    
    def extract_tip(self, lines):
        """Izvuci tip operatera"""
        for line in lines:
            if 'tip operatera:' in line.lower():
                match = re.search(r'tip operatera:\s*\*\*(.+?)\*\*', line, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        return ""
    
    def extract_opis(self, lines):
        """Izvuci opis operatera"""
        for line in lines:
            if 'opis operatera:' in line.lower():
                match = re.search(r'opis operatera:\s*\*\*(.+?)\*\*', line, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        return ""
    
    def extract_napomenu(self, lines):
        """Izvuci napomenu"""
        for line in lines:
            if 'napomena:' in line.lower():
                match = re.search(r'napomena:\s*\*\*(.+?)\*\*', line, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        return ""
    
    def extract_kontakt(self, lines):
        """Izvuci kontakt podatke"""
        kontakt = {
            "adresa": "",
            "telefon": "",
            "email": "",
            "web": "",
            "customer_service": {},
            "drustvene_mreze": {}
        }
        
        for line in lines:
            lower_line = line.lower()
            
            # Adresa
            if 'sjedište' in lower_line or 'adresa:' in lower_line:
                match = re.search(r'[\*\-\s]*.*?[:\-]\s*(.+)', line)
                if match:
                    kontakt["adresa"] = match.group(1).strip().replace('**', '')
            
            # Telefon
            if 'glavni telefon:' in lower_line or 'telefon:' in lower_line:
                match = re.search(r'[\+\d\s\-\(\)]+', line)
                if match:
                    kontakt["telefon"] = match.group(0).strip()
            
            # Email
            if 'email:' in lower_line:
                match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', line)
                if match:
                    kontakt["email"] = match.group(0)
            
            # Web
            if 'web stranica:' in lower_line or 'http' in line:
                match = re.search(r'(https?://[^\s\)]+)', line)
                if match:
                    kontakt["web"] = match.group(1)
        
        return kontakt
    
    def extract_detaljne_usluge(self, lines):
        """Izvuci detaljne usluge koristeći ✅/❌ oznake"""
        usluge = {
            "mobilne": [],
            "fiksne": [],
            "internet": [],
            "tv": [],
            "cloud_poslovne": [],
            "dodatne": []
        }
        
        current_section = ''
        section_enabled = False
        
        for line in lines:
            lower_line = line.lower()
            
            if '✅' in line:
                if 'mobilne' in lower_line:
                    current_section = 'mobilne'
                    section_enabled = True
                elif 'internet' in lower_line:
                    current_section = 'internet'
                    section_enabled = True
                elif 'fiksne' in lower_line or 'fixed' in lower_line:
                    current_section = 'fiksne'
                    section_enabled = True
                elif 'tv' in lower_line or 'video' in lower_line:
                    current_section = 'tv'
                    section_enabled = True
                continue
            elif '❌' in line:
                section_enabled = False
                continue
            
            # Čitaj usluge u enabled sekciji
            if section_enabled and line.strip().startswith('-') and current_section:
                service_name = re.sub(r'^[\s\-\*]+', '', line).strip()
                service_name = re.sub(r'\([^)]*\)', '', service_name).strip()
                
                if service_name and current_section in usluge:
                    usluge[current_section].append(service_name)
        
        return usluge
    
    def extract_detaljne_tehnologije(self, lines):
        """Izvuci detaljne tehnologije"""
        tehnologije = {
            "mobilne": [],
            "fiksne": [],
            "mrezne": []
        }
        
        content = ' '.join(lines).lower()
        
        # Mobilne tehnologije
        if '2g' in content or 'gsm' in content:
            tehnologije["mobilne"].append('GSM 900/1800')
        if '3g' in content or 'umts' in content:
            tehnologije["mobilne"].append('UMTS 900/2100')
        if '4g' in content or 'lte' in content:
            tehnologije["mobilne"].append('LTE 800/1800/2600')
        if '5g' in content:
            tehnologije["mobilne"].append('5G 3500')
        
        # Mrežne tehnologije
        if 'ftth' in content or 'optički' in content:
            tehnologije["mrezne"].append('FTTH/FTTB')
        if 'adsl' in content or 'xdsl' in content:
            tehnologije["mrezne"].append('xDSL')
        if 'docsis' in content:
            tehnologije["mrezne"].append('DOCSIS')
        if 'wifi' in content or 'wi-fi' in content or 'bežični' in content:
            tehnologije["mrezne"].append('WiFi/Wireless')
        
        return tehnologije
    
    def extract_zakonske_obaveze(self, lines):
        """Izvuci zakonske obaveze"""
        return {
            "zakonito_presretanje": None,
            "implementacija": "",
            "kontakt_osoba": "",
            "posleduje_misljenje_zuo": None,
            "pristup_obracunskim_podacima": None,
            "napomene": "Potrebna provera zakonskih obaveza"
        }
    
    def calculate_completeness(self, operator):
        """Izračunaj kompletnost operatera"""
        score = 0
        max_score = 100
        
        # Osnovni podaci (40 poena)
        if operator["naziv"]: score += 10
        if operator["tip"]: score += 10
        if operator["opis"]: score += 10
        if operator["status"]: score += 10
        
        # Kontakt podaci (30 poena)
        if operator["kontakt"]["adresa"]: score += 10
        if operator["kontakt"]["telefon"]: score += 10
        if operator["kontakt"]["email"]: score += 10
        
        # Usluge i tehnologije (20 poena)
        ukupno_usluga = sum(len(arr) for arr in operator["detaljne_usluge"].values())
        if ukupno_usluga > 0: score += 10
        
        ukupno_tehnologija = sum(len(arr) for arr in operator["detaljne_tehnologije"].values())
        if ukupno_tehnologija > 0: score += 10
        
        # Dodatni podaci (10 poena)
        if operator["kontakt"]["web"]: score += 5
        if operator["napomena"]: score += 5
        
        return min(score, max_score)
    
    def import_all_operators(self):
        """Uvezi sve operatere iz markdown fajlova"""
        folder_path = "ToDo/Pojedinacni_operateri"
        
        if not os.path.exists(folder_path):
            print(f"❌ Folder {folder_path} ne postoji!")
            return False
        
        markdown_files = [f for f in os.listdir(folder_path) if f.endswith('.md')]
        print(f"📂 Pronađeno {len(markdown_files)} markdown fajlova")
        
        for filename in markdown_files:
            filepath = os.path.join(folder_path, filename)
            operator = self.parse_markdown_file(filepath, filename)
            
            if operator:
                self.operators.append(operator)
                print(f"✅ {operator['naziv']}")
            else:
                print(f"❌ {filename}")
        
        print(f"\n📊 Ukupno konvertovano: {len(self.operators)} operatera")
        return True
    
    def merge_with_existing(self, existing_json_path="operateri.json"):
        """Spoji sa postojećom bazom"""
        try:
            with open(existing_json_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
            
            # Dodaj nove operatere
            new_data = existing_data.copy()
            new_data["operateri"].extend(self.operators)
            
            # Ažuriraj metadata
            new_data["version"] = "2.1"
            new_data["bulk_import_at"] = datetime.now().isoformat()
            new_data["bulk_import_notes"] = f"Bulk import dodao {len(self.operators)} operatera iz markdown fajlova"
            
            return new_data
            
        except Exception as e:
            print(f"❌ Greška pri spajanju: {e}")
            return None
    
    def save_new_database(self, new_data, output_path="operateri_with_bulk_import.json"):
        """Sačuvaj novu bazu"""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, ensure_ascii=False, indent=2)
            
            print(f"💾 Nova baza sačuvana: {output_path}")
            return True
            
        except Exception as e:
            print(f"❌ Greška pri čuvanju: {e}")
            return False

def main():
    print("🚀 ATLAS BULK IMPORT SCRIPT")
    print("=" * 50)
    
    importer = AtlasBulkImporter()
    
    # 1. Uvezi operatere
    if not importer.import_all_operators():
        return
    
    # 2. Spoji sa postojećom bazom
    new_data = importer.merge_with_existing()
    if not new_data:
        return
    
    # 3. Sačuvaj novu bazu
    if importer.save_new_database(new_data):
        print("\n🎉 BULK IMPORT USPEŠNO ZAVRŠEN!")
        print(f"📊 Stara baza: 13 operatera")
        print(f"📊 Nova baza: {len(new_data['operateri'])} operatera")
        print(f"📊 Dodano: {len(importer.operators)} novih operatera")
        print("\n📋 SLEDEĆI KORAK:")
        print("   copy operateri_with_bulk_import.json operateri.json")

if __name__ == "__main__":
    main()
