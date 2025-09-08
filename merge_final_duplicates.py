#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS Final Merge Script
Mergovanje poslednja dva duplikata: haloo i Telrad Net
"""

import json

def merge_duplicate_cleanup():
    """Merguj i ukloni poslednje duplikate"""
    print("🔧 ATLAS Final Merge - Removing Last Duplicates")
    print("=" * 60)
    
    # Učitaj podatke
    with open('operateri.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    operators = data.get('operateri', [])
    print(f"📊 Trenutno stanje: {len(operators)} operatera")
    
    # Backup
    with open('operateri_backup_merge.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Identifikuj duplikate
    haloo_ops = []
    telrad_ops = []
    other_ops = []
    
    for op in operators:
        naziv = op.get('naziv', '').lower()
        if 'haloo' in naziv:
            haloo_ops.append(op)
        elif 'telrad net' in naziv:
            telrad_ops.append(op)
        else:
            other_ops.append(op)
    
    print(f"\n🔍 ANALIZA DUPLIKATA:")
    print(f"📱 Haloo operateri: {len(haloo_ops)}")
    for op in haloo_ops:
        print(f"   ID {op.get('id')}: {op.get('naziv')}")
        print(f"      Tip: {op.get('tip')}")
    
    print(f"\n🌐 Telrad Net operateri: {len(telrad_ops)}")
    for op in telrad_ops:
        print(f"   ID {op.get('id')}: {op.get('naziv')}")
        print(f"      Tip: {op.get('tip')}")
    
    # Merguj haloo operatere - zadržati detaljniji
    if len(haloo_ops) > 1:
        # Zadržati "Haloo d.o.o. Sarajevo (MVNO)" jer je detaljniji
        best_haloo = None
        for op in haloo_ops:
            if 'sarajevo' in op.get('naziv', '').lower() and 'mvno' in op.get('naziv', '').lower():
                best_haloo = op
                break
        
        if not best_haloo:
            best_haloo = haloo_ops[0]  # fallback
        
        # Ažuriraj naziv da bude konzistentan
        best_haloo['naziv'] = "Haloo d.o.o. Sarajevo (MVNO)"
        best_haloo['komercijalni_naziv'] = "haloo"
        best_haloo['tip'] = "Mobilni/MVNO"
        
        other_ops.append(best_haloo)
        print(f"\n✅ Mergovan haloo -> zadržan: {best_haloo['naziv']}")
    
    # Merguj Telrad Net operatere - zadržati detaljniji
    if len(telrad_ops) > 1:
        # Zadržati "Telrad Net d.o.o. Bijeljina" jer ima lokaciju
        best_telrad = None
        for op in telrad_ops:
            if 'bijeljina' in op.get('naziv', '').lower():
                best_telrad = op
                break
        
        if not best_telrad:
            best_telrad = telrad_ops[0]  # fallback
        
        # Ažuriraj naziv da bude konzistentan
        best_telrad['naziv'] = "Telrad Net d.o.o."
        best_telrad['komercijalni_naziv'] = "Telrad Net"
        best_telrad['tip'] = "Regionalni ISP"
        
        other_ops.append(best_telrad)
        print(f"✅ Mergovan Telrad Net -> zadržan: {best_telrad['naziv']}")
    
    # Reindex ID-jeve
    final_operators = other_ops
    for i, operator in enumerate(final_operators, 1):
        operator['id'] = i
    
    # Sačuvaj rezultate
    data['operateri'] = final_operators
    with open('operateri.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n📊 FINALNI REZULTATI:")
    print(f"✅ Finalno operatera: {len(final_operators)}")
    print(f"🗑️ Uklonjeno duplikata: {len(operators) - len(final_operators)}")
    print(f"💾 Backup sačuvan: operateri_backup_merge.json")
    
    # Finalna statistika tipova
    tip_counts = {}
    for op in final_operators:
        tip = op.get('tip', 'NEPOZNAT')
        tip_counts[tip] = tip_counts.get(tip, 0) + 1
    
    print(f"\n📈 TIPOVI OPERATERA:")
    for tip, count in sorted(tip_counts.items()):
        print(f"   {count:2d}x {tip}")
    
    # Finalna lista
    print(f"\n📋 FINALNA LISTA OPERATERA ({len(final_operators)}):")
    for i, op in enumerate(final_operators, 1):
        print(f"{i:2d}. {op.get('naziv')} ({op.get('tip')})")
    
    print(f"\n🎉 SVI DUPLIKATI UKLONJENI!")
    return final_operators

if __name__ == "__main__":
    merge_duplicate_cleanup()
