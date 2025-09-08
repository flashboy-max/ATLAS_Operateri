#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS Data Cleanup Script
Čišćenje problematičnih operatera i validacija strukture podataka
"""

import json
import sys
from typing import Dict, List, Any

def load_operators(file_path: str) -> Dict[str, Any]:
    """Učitaj operatere iz JSON fajla"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Greška pri učitavanju: {e}")
        sys.exit(1)

def validate_operator(operator: Dict[str, Any]) -> List[str]:
    """Validiraj strukturu operatera i vrati listu problema"""
    problems = []
    
    # Obavezna polja
    required_fields = ['id', 'naziv', 'tip', 'status']
    for field in required_fields:
        if not operator.get(field) or operator.get(field) == "":
            problems.append(f"Nedostaje ili prazan '{field}'")
    
    # Validacija kontakt strukture
    if 'kontakt' in operator:
        kontakt = operator['kontakt']
        if not isinstance(kontakt, dict):
            problems.append("Kontakt nije dict struktura")
    
    # Validacija detaljne_usluge strukture
    if 'detaljne_usluge' in operator:
        usluge = operator['detaljne_usluge']
        if not isinstance(usluge, dict):
            problems.append("Detaljne_usluge nije dict struktura")
        else:
            # Proverava da li su podaci u internet sekciji previše dugački (greška bulk import)
            if 'internet' in usluge and isinstance(usluge['internet'], list):
                for item in usluge['internet']:
                    if isinstance(item, str) and len(item) > 100:
                        problems.append("Problematični dugi stringovi u internet sekciji")
                        break
    
    return problems

def fix_operator(operator: Dict[str, Any]) -> Dict[str, Any]:
    """Popravka problematičnog operatera"""
    fixed_operator = operator.copy()
    
    # Popravka praznog tip-a za ADRIA NET Sarajevo
    if operator.get('naziv') == "ADRIA NET Sarajevo" and not operator.get('tip'):
        fixed_operator['tip'] = "Regionalni ISP"
        print(f"✅ Popravljen tip za {operator['naziv']}")
    
    # Čišćenje internet sekcije od problematičnih podataka
    if 'detaljne_usluge' in fixed_operator and 'internet' in fixed_operator['detaljne_usluge']:
        internet_list = fixed_operator['detaljne_usluge']['internet']
        if isinstance(internet_list, list):
            # Zadržava samo kratke, validne internet usluge
            cleaned_internet = []
            for item in internet_list:
                if isinstance(item, str) and len(item) < 50 and not item.startswith("Zakonito"):
                    cleaned_internet.append(item)
            
            fixed_operator['detaljne_usluge']['internet'] = cleaned_internet
            
            if len(cleaned_internet) != len(internet_list):
                print(f"✅ Očišćena internet sekcija za {operator['naziv']}")
    
    return fixed_operator

def find_duplicates(operators: List[Dict[str, Any]]) -> List[str]:
    """Pronađi duplikate operatera"""
    seen_names = {}
    duplicates = []
    
    for operator in operators:
        naziv = operator.get('naziv', '')
        if naziv in seen_names:
            duplicates.append(f"Duplikat: {naziv} (ID: {operator.get('id')} i {seen_names[naziv]})")
        else:
            seen_names[naziv] = operator.get('id')
    
    return duplicates

def cleanup_operators():
    """Glavna funkcija za čišćenje podataka"""
    print("🔧 ATLAS Data Cleanup Script")
    print("=" * 50)
    
    # Učitaj podatke
    data = load_operators('operateri.json')
    operators = data.get('operateri', [])
    
    print(f"📊 Ukupno operatera: {len(operators)}")
    
    # Pronađi probleme
    total_problems = 0
    problematic_operators = []
    
    for operator in operators:
        problems = validate_operator(operator)
        if problems:
            total_problems += len(problems)
            problematic_operators.append({
                'operator': operator,
                'problems': problems
            })
    
    print(f"❌ Ukupno problema: {total_problems}")
    print(f"🔧 Problematični operateri: {len(problematic_operators)}")
    
    # Prikaži probleme
    if problematic_operators:
        print("\n🚨 DETALJNI PREGLED PROBLEMA:")
        for item in problematic_operators:
            operator = item['operator']
            problems = item['problems']
            print(f"\n📋 {operator.get('naziv', 'NEPOZNAT')} (ID: {operator.get('id')})")
            for problem in problems:
                print(f"   ❌ {problem}")
    
    # Pronađi duplikate
    duplicates = find_duplicates(operators)
    if duplicates:
        print(f"\n👥 DUPLIKATI ({len(duplicates)}):")
        for duplicate in duplicates:
            print(f"   🔄 {duplicate}")
    
    # Popravka operatera
    print(f"\n🔧 POPRAVLJAM OPERATERE...")
    fixed_operators = []
    fixed_count = 0
    
    for operator in operators:
        fixed_operator = fix_operator(operator)
        if fixed_operator != operator:
            fixed_count += 1
        fixed_operators.append(fixed_operator)
    
    # Sačuvaj popravke
    if fixed_count > 0:
        # Backup originala
        with open('operateri_backup_pre_cleanup.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Sačuvaj popravke
        data['operateri'] = fixed_operators
        with open('operateri.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Popravljeno {fixed_count} operatera")
        print(f"💾 Backup sačuvan: operateri_backup_pre_cleanup.json")
    else:
        print("ℹ️ Nema potrebe za popravkama")
    
    # Finalna validacija
    print(f"\n📊 FINALNA STATISTIKA:")
    print(f"✅ Ukupno operatera: {len(fixed_operators)}")
    
    final_problems = 0
    for operator in fixed_operators:
        problems = validate_operator(operator)
        final_problems += len(problems)
    
    print(f"❌ Preostali problemi: {final_problems}")
    
    if final_problems == 0:
        print("🎉 SVI OPERATERI SU VALIDNI!")
    
    return fixed_operators

if __name__ == "__main__":
    cleanup_operators()
