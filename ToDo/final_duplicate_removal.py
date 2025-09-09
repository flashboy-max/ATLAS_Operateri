#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS Duplicate Removal Script
Finalno uklanjanje duplikata i usklađivanje sa markdown fajlovima
"""

import json
import os
from typing import Dict, List, Any

def are_duplicates(name1: str, name2: str) -> bool:
    """Proveri da li su dva naziva duplikati"""
    # Normalizuj nazive za poređenje
    def normalize(name):
        return name.lower().replace(' ', '').replace('.', '').replace('-', '').replace('(', '').replace(')', '')
    
    norm1 = normalize(name1)
    norm2 = normalize(name2)
    
    # Direktno poklapanje
    if norm1 == norm2:
        return True
    
    # Poklapanje base naziva (bez dodataka)
    base1 = norm1.split('(')[0].split('-')[0]
    base2 = norm2.split('(')[0].split('-')[0]
    
    if base1 == base2 and len(base1) > 5:  # Dovoljno dugačak da bude značajan
        return True
    
    return False

def find_duplicates(operators: List[Dict[str, Any]]) -> List[List[int]]:
    """Pronađi grupe duplikata"""
    duplicate_groups = []
    processed = set()
    
    for i, op1 in enumerate(operators):
        if i in processed:
            continue
            
        group = [i]
        naziv1 = op1.get('naziv', '')
        
        for j, op2 in enumerate(operators[i+1:], i+1):
            if j in processed:
                continue
                
            naziv2 = op2.get('naziv', '')
            
            if are_duplicates(naziv1, naziv2):
                group.append(j)
                processed.add(j)
        
        if len(group) > 1:
            duplicate_groups.append(group)
            for idx in group:
                processed.add(idx)
    
    return duplicate_groups

def choose_best_operator(operators: List[Dict[str, Any]], indices: List[int]) -> int:
    """Izaberi najbolji operator iz grupe duplikata"""
    candidates = [operators[i] for i in indices]
    
    # Prioritet: manji ID (originalni operateri)
    best_idx = min(indices)
    best_op = operators[best_idx]
    
    # Ali ako neki ima detaljnije podatke, uzmi njega
    for idx in indices:
        op = operators[idx]
        
        # Proveri kompletnost podataka
        score = 0
        if op.get('opis') and len(op.get('opis', '')) > 10:
            score += 2
        if op.get('kontakt', {}).get('telefon'):
            score += 1
        if op.get('kontakt', {}).get('email'):
            score += 1
        if op.get('kontakt', {}).get('web'):
            score += 1
        
        best_score = 0
        if best_op.get('opis') and len(best_op.get('opis', '')) > 10:
            best_score += 2
        if best_op.get('kontakt', {}).get('telefon'):
            best_score += 1
        if best_op.get('kontakt', {}).get('email'):
            best_score += 1
        if best_op.get('kontakt', {}).get('web'):
            best_score += 1
        
        if score > best_score:
            best_idx = idx
            best_op = op
    
    return best_idx

def remove_duplicates_final():
    """Finalno uklanjanje duplikata"""
    print("🔧 ATLAS Final Duplicate Removal")
    print("=" * 50)
    
    # Učitaj podatke
    try:
        with open('operateri.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Greška pri učitavanju: {e}")
        return
    
    operators = data.get('operateri', [])
    print(f"📊 Početno stanje: {len(operators)} operatera")
    
    # Pronađi duplikate
    duplicate_groups = find_duplicates(operators)
    
    if duplicate_groups:
        print(f"🔍 Pronađeno {len(duplicate_groups)} grupa duplikata:")
        
        for i, group in enumerate(duplicate_groups, 1):
            print(f"\n📋 Grupa {i}:")
            for idx in group:
                op = operators[idx]
                print(f"   ID {op.get('id')}: {op.get('naziv')}")
        
        # Backup
        with open('operateri_backup_final.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Ukloni duplikate
        keep_indices = []
        removed_count = 0
        
        # Dodaj sve operatere koji nisu duplikati
        all_duplicate_indices = set()
        for group in duplicate_groups:
            all_duplicate_indices.update(group)
        
        for i, operator in enumerate(operators):
            if i not in all_duplicate_indices:
                keep_indices.append(i)
        
        # Dodaj najbolje iz svake grupe duplikata
        for group in duplicate_groups:
            best_idx = choose_best_operator(operators, group)
            keep_indices.append(best_idx)
            removed_count += len(group) - 1
            
            print(f"\n✅ Grupa duplikata - zadržan:")
            print(f"   ID {operators[best_idx].get('id')}: {operators[best_idx].get('naziv')}")
            print(f"   Uklonjeno {len(group) - 1} duplikata")
        
        # Kreiraj novu listu operatera
        keep_indices.sort()
        final_operators = [operators[i] for i in keep_indices]
        
        # Reindex ID-jeve
        for i, operator in enumerate(final_operators, 1):
            operator['id'] = i
        
        # Sačuvaj rezultate
        data['operateri'] = final_operators
        with open('operateri.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"\n📊 REZULTATI:")
        print(f"✅ Finalno operatera: {len(final_operators)}")
        print(f"🗑️ Uklonjeno duplikata: {removed_count}")
        print(f"💾 Backup sačuvan: operateri_backup_final.json")
        
    else:
        print("✅ Nema duplikata!")
    
    # Proveri usklađenost sa markdown fajlovima
    md_folder = 'ToDo/Pojedinacni_operateri'
    if os.path.exists(md_folder):
        md_files = [f.replace('.md', '') for f in os.listdir(md_folder) if f.endswith('.md')]
        print(f"\n📂 Markdown fajlovi: {len(md_files)}")
        
        final_operators = data.get('operateri', [])
        print(f"📋 JSON operateri: {len(final_operators)}")
        
        # Tipovi operatera
        tip_counts = {}
        for op in final_operators:
            tip = op.get('tip', 'NEPOZNAT')
            tip_counts[tip] = tip_counts.get(tip, 0) + 1
        
        print(f"\n📈 TIPOVI OPERATERA:")
        for tip, count in sorted(tip_counts.items()):
            print(f"   {tip}: {count}")
    
    print(f"\n🎉 FINALNO ČIŠĆENJE ZAVRŠENO!")

if __name__ == "__main__":
    remove_duplicates_final()
