#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS Comprehensive Duplicate Cleanup
Rigorozno uklanjanje SVIH duplikata
"""

import json

def clean_name(name: str) -> str:
    """Očisti naziv za poređenje"""
    return (name.lower()
            .replace(' ', '')
            .replace('.', '')
            .replace('-', '')
            .replace('(', '')
            .replace(')', '')
            .replace('đ', 'd')
            .replace('ć', 'c')
            .replace('č', 'c')
            .replace('š', 's')
            .replace('ž', 'z'))

def are_same_operator(name1: str, name2: str) -> bool:
    """Proveri da li su isti operateri"""
    clean1 = clean_name(name1)
    clean2 = clean_name(name2)
    
    # Direktno poklapanje
    if clean1 == clean2:
        return True
    
    # Base naziv poklapanje (bez dodataka)
    base1 = clean1.split('sarajevo')[0].split('banjaluka')[0].split('mostar')[0]
    base2 = clean2.split('sarajevo')[0].split('banjaluka')[0].split('mostar')[0]
    
    # Specifični slučajevi
    if 'adrianet' in clean1 and 'adrianet' in clean2:
        return True
    if 'akton' in clean1 and 'akton' in clean2:
        return True
    if 'dastosemtel' in clean1 and 'dastosemtel' in clean2:
        return True
    if 'jphrvatsketelek' in clean1 and 'jphrvatsketelek' in clean2:
        return True
    if 'missnet' in clean1 and 'missnet' in clean2:
        return True
    if 'telekom' in clean1 and 'srpske' in clean1 and 'telekom' in clean2 and 'srpske' in clean2:
        return True
    
    return False

def comprehensive_cleanup():
    """Sveobuhvatno čišćenje"""
    print("🧹 ATLAS COMPREHENSIVE DUPLICATE CLEANUP")
    print("=" * 60)
    
    # Učitaj podatke
    with open('operateri.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    operators = data.get('operateri', [])
    print(f"📊 Početno: {len(operators)} operatera")
    
    # Backup
    with open('operateri_backup_comprehensive.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Manual definisanje duplikata koji treba da se uklone
    REMOVE_IDS = [
        13,  # ADRIA NET Sarajevo (zadržati ID 1)
        14,  # AKTON d.o.o. Sarajevo (zadržati ID 2) 
        16,  # Dasto Semtel Zona.ba (zadržati ID 4)
        22,  # HT Eronet (zadržati ID 5)
        27,  # Miss.Net Bihac (zadržati ID 10)
        32,  # Telekom Srpske m-tel (zadržati ID 6)
    ]
    
    print(f"🗑️ Uklonjeni duplikati (ID):")
    for remove_id in REMOVE_IDS:
        for op in operators:
            if op.get('id') == remove_id:
                print(f"   ID {remove_id}: {op.get('naziv')}")
                break
    
    # Ukloni duplikate
    clean_operators = [op for op in operators if op.get('id') not in REMOVE_IDS]
    
    # Reindex ID-jeve
    for i, operator in enumerate(clean_operators, 1):
        operator['id'] = i
    
    # Sačuvaj
    data['operateri'] = clean_operators
    with open('operateri.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n📊 REZULTATI:")
    print(f"✅ Finalno operatera: {len(clean_operators)}")
    print(f"🗑️ Uklonjeno: {len(REMOVE_IDS)} duplikata")
    print(f"💾 Backup: operateri_backup_comprehensive.json")
    
    # Statistike tipova
    tip_counts = {}
    for op in clean_operators:
        tip = op.get('tip', 'NEPOZNAT')
        # Skrati duge tipove
        if len(tip) > 50:
            tip = tip[:47] + "..."
        tip_counts[tip] = tip_counts.get(tip, 0) + 1
    
    print(f"\n📈 TIPOVI OPERATERA:")
    for tip, count in sorted(tip_counts.items()):
        print(f"   {count:2d}x {tip}")
    
    # Proveri da li još ima duplikata
    print(f"\n🔍 FINALNA PROVJERA DUPLIKATA:")
    potential_duplicates = []
    for i, op1 in enumerate(clean_operators):
        for j, op2 in enumerate(clean_operators[i+1:], i+1):
            if are_same_operator(op1.get('naziv', ''), op2.get('naziv', '')):
                potential_duplicates.append((op1.get('id'), op1.get('naziv'), op2.get('id'), op2.get('naziv')))
    
    if potential_duplicates:
        print(f"❌ Još uvek ima {len(potential_duplicates)} duplikata:")
        for dup in potential_duplicates:
            print(f"   ID {dup[0]}: {dup[1]} <-> ID {dup[2]}: {dup[3]}")
    else:
        print("✅ NEMA DUPLIKATA! Čišćenje uspešno!")
    
    print(f"\n🎉 COMPREHENSIVE CLEANUP ZAVRŠEN!")
    return clean_operators

if __name__ == "__main__":
    comprehensive_cleanup()
