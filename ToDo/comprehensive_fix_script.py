#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS Comprehensive Data Fix Script
Kompletna popravka bulk import problema
"""

import json
import sys
from typing import Dict, List, Any

# Mapiranje tipova operatera na osnovu naziva
OPERATOR_TYPES = {
    # Mobilni operateri
    "BH Telecom": "Dominantni",
    "Telekom Srpske": "Dominantni", 
    "m-tel": "Dominantni",
    "HT Eronet": "Dominantni",
    "ONE.Vip": "Mobilni/MVNO",
    "Haloo": "Mobilni/MVNO",
    "Novotel": "Mobilni/MVNO",
    
    # ISP operateri
    "ADRIA NET": "Regionalni ISP",
    "AKTON": "Enterprise/B2B",
    "CRA TELECOM": "Regionalni ISP",
    "Dasto Semtel": "Regionalni ISP",
    "Zona.ba": "Regionalni ISP",
    "Elta-kabel": "Regionalni ISP",
    "GiNet": "Regionalni ISP",
    "Global Internet": "Regionalni ISP",
    "HKB Net": "Regionalni ISP",
    "LANACO": "Enterprise/B2B",
    "Logosoft": "Enterprise/B2B",
    "M&H Company": "Enterprise/B2B",
    "Miss.Net": "Regionalni ISP",
    "Ortak": "Regionalni ISP",
    "PROINTER ITSS": "Enterprise/B2B",
    "Supernova": "Regionalni ISP",
    "Blicnet": "Regionalni ISP",
    "Telemach": "Dominantni",
    "Telinea": "Regionalni ISP",
    "Telrad Net": "Regionalni ISP",
    "VKT-Net": "Regionalni ISP",
    "Wirac.Net": "Regionalni ISP",
    
    # TV/Cable operateri
    "MEDIA SKY": "Regionalni ISP",
    "MEDIASAT": "Regionalni ISP", 
    "KATV HS": "Regionalni ISP",
    "TX TV": "Regionalni ISP"
}

def get_operator_type(naziv: str) -> str:
    """Determiniši tip operatera na osnovu naziva"""
    naziv_lower = naziv.lower()
    
    # Direktni matchovi
    for key, tip in OPERATOR_TYPES.items():
        if key.lower() in naziv_lower:
            return tip
    
    # Fallback logika
    if any(word in naziv_lower for word in ['tv', 'cable', 'kabel']):
        return "Regionalni ISP"
    elif any(word in naziv_lower for word in ['telecom', 'telekom', 'tel']):
        return "Dominantni"
    elif any(word in naziv_lower for word in ['net', 'internet', 'wifi', 'wireless']):
        return "Regionalni ISP"
    elif any(word in naziv_lower for word in ['mvno', 'haloo', 'novotel']):
        return "Mobilni/MVNO"
    else:
        return "Enterprise/B2B"

def remove_duplicates(operators: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Ukloni duplikate, zadržavajući originalne operatere (ID < 14)"""
    seen_names = {}
    unique_operators = []
    removed_count = 0
    
    for operator in operators:
        naziv = operator.get('naziv', '')
        operator_id = operator.get('id', 0)
        
        if naziv in seen_names:
            # Ako već imamo operatera sa tim nazivom, zadržavamo onaj sa manjim ID
            existing_id = seen_names[naziv]['id']
            if operator_id < existing_id:
                # Trenutni operator ima manji ID, zamenjujemo
                unique_operators = [op for op in unique_operators if op.get('naziv') != naziv]
                unique_operators.append(operator)
                seen_names[naziv] = operator
                removed_count += 1
                print(f"🔄 Zamenjen duplikat: {naziv} (zadržan ID: {operator_id}, uklonjen ID: {existing_id})")
            else:
                # Postojeći operator ima manji ID, preskačemo trenutni
                removed_count += 1
                print(f"🗑️ Uklonjen duplikat: {naziv} (ID: {operator_id})")
        else:
            # Prvi put vidimo ovaj naziv
            seen_names[naziv] = operator
            unique_operators.append(operator)
    
    print(f"✅ Uklonjeno {removed_count} duplikata")
    return unique_operators

def fix_operator_comprehensive(operator: Dict[str, Any]) -> Dict[str, Any]:
    """Kompletna popravka operatera"""
    fixed = operator.copy()
    
    # Popravka tip-a
    if not fixed.get('tip') or fixed.get('tip') == "":
        fixed['tip'] = get_operator_type(fixed.get('naziv', ''))
        print(f"✅ Dodatn tip '{fixed['tip']}' za {fixed.get('naziv')}")
    
    # Popravka osnovnih polja
    if not fixed.get('komercijalni_naziv'):
        fixed['komercijalni_naziv'] = ""
    
    if not fixed.get('opis'):
        fixed['opis'] = ""
    
    if not fixed.get('napomena'):
        fixed['napomena'] = ""
    
    # Popravka kontakt strukture
    if not isinstance(fixed.get('kontakt'), dict):
        fixed['kontakt'] = {
            "adresa": "",
            "telefon": "",
            "email": "",
            "web": "",
            "customer_service": {},
            "drustvene_mreze": {}
        }
    
    # Očisti problematične internet usluge
    if 'detaljne_usluge' in fixed and 'internet' in fixed['detaljne_usluge']:
        internet_list = fixed['detaljne_usluge']['internet']
        if isinstance(internet_list, list):
            # Zadržava samo kratke, validne usluge
            cleaned_internet = []
            for item in internet_list:
                if isinstance(item, str) and len(item) < 50 and not any(
                    keyword in item for keyword in [
                        "Zakonito presretanje", 
                        "potrebno dopuniti", 
                        "Status:",
                        "Datum posljednje",
                        "Napomena:",
                        "Problemi:"
                    ]
                ):
                    cleaned_internet.append(item)
            
            fixed['detaljne_usluge']['internet'] = cleaned_internet
    
    # Dodaj osnovnu strukturu ako ne postoji
    if 'detaljne_usluge' not in fixed:
        fixed['detaljne_usluge'] = {
            "mobilne": [],
            "fiksne": [],
            "internet": [],
            "tv": [],
            "cloud_poslovne": [],
            "dodatne": []
        }
    
    if 'detaljne_tehnologije' not in fixed:
        fixed['detaljne_tehnologije'] = {
            "mobilne": [],
            "fiksne": [],
            "mrezne": []
        }
    
    if 'tehnicki_kontakti' not in fixed:
        fixed['tehnicki_kontakti'] = []
    
    return fixed

def comprehensive_fix():
    """Kompletna popravka ATLAS podataka"""
    print("🛠️ ATLAS COMPREHENSIVE DATA FIX")
    print("=" * 60)
    
    # Učitaj podatke
    try:
        with open('operateri.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Greška pri učitavanju: {e}")
        return
    
    operators = data.get('operateri', [])
    print(f"📊 Početno stanje: {len(operators)} operatera")
    
    # 1. Ukloni duplikate
    print(f"\n🔧 KORAK 1: Uklanjanje duplikata...")
    unique_operators = remove_duplicates(operators)
    print(f"📊 Nakon uklanjanja duplikata: {len(unique_operators)} operatera")
    
    # 2. Popravka svih operatera
    print(f"\n🔧 KORAK 2: Popravka svih operatera...")
    fixed_operators = []
    fix_count = 0
    
    for operator in unique_operators:
        original = json.dumps(operator, sort_keys=True)
        fixed = fix_operator_comprehensive(operator)
        fixed_json = json.dumps(fixed, sort_keys=True)
        
        if original != fixed_json:
            fix_count += 1
        
        fixed_operators.append(fixed)
    
    print(f"✅ Popravljeno {fix_count} operatera")
    
    # 3. Reindex ID-jeve
    print(f"\n🔧 KORAK 3: Reindexiranje ID-jeva...")
    for i, operator in enumerate(fixed_operators, 1):
        operator['id'] = i
    
    # 4. Sačuvaj rezultate
    print(f"\n💾 KORAK 4: Čuvanje rezultata...")
    
    # Backup originala
    with open('operateri_backup_komplet.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Sačuvaj popravke
    data['operateri'] = fixed_operators
    with open('operateri.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Backup sačuvan: operateri_backup_komplet.json")
    print(f"✅ Novi podaci sačuvani: operateri.json")
    
    # 5. Finalna statistika
    print(f"\n📊 FINALNA STATISTIKA:")
    print(f"✅ Finalno operatera: {len(fixed_operators)}")
    
    # Proveri tipove
    tip_counts = {}
    for op in fixed_operators:
        tip = op.get('tip', 'NEPOZNAT')
        tip_counts[tip] = tip_counts.get(tip, 0) + 1
    
    print(f"\n📈 TIPOVI OPERATERA:")
    for tip, count in sorted(tip_counts.items()):
        print(f"   {tip}: {count}")
    
    print(f"\n🎉 KOMPLETNA POPRAVKA ZAVRŠENA!")
    
    return fixed_operators

if __name__ == "__main__":
    comprehensive_fix()
