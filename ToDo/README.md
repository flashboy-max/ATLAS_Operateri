# ATLAS HTML - Poboljšanja i Planovi

Ovaj folder sadrži planove i dokumentaciju za poboljšanja ATLAS HTML aplikacije za upravljanje telekomunikacionim operaterima u Bosni i Hercegovini.

## O Projektu

ATLAS HTML je potpuno samostalna web aplikacija koja predstavlja frontend verziju ATLAS sistema. Ova aplikacija koristi samo HTML, CSS i JavaScript i može da radi nezavisno od glavnog ATLAS backend sistema.

## Struktura

- `planovi/` - Detaljni planovi poboljšanja i implementacije
- `implementacija/` - Napomene o implementaciji i progress tracking
- `testovi/` - Test planovi i rezultati testiranja
- `backup/` - Rezervne kopije važnih fajlova
- `dokumentacija/` - Tehnička dokumentacija
- `Pojedinacni_operateri/` - Detaljni profili operatera za reference i ažuriranje

## Status Poboljšanja

Datum početka: 31. jul 2025.

### Završene implementacije:
- Osnovni HTML/CSS/JS sistem za upravljanje operaterima
- Pretraga i filtriranje operatera
- CRUD operacije (dodavanje, uređivanje, brisanje)
- Lokalno čuvanje podataka u JSON formatu
- Responzivni dizajn

### U toku:
- Kategorizacija operatera u 3 grupe (Dominantni, MVNO, Regionalni ISP)
- Expandable details funkcionalnost za detaljni prikaz operatera
- Optimizacija za upravljanje 50+ operatera
- Poboljšanje korisničkog interfejsa

### Planirano:
- Paginacija/lazy loading za velike datasets
- Poboljšane search funkcionalnosti sa autocomplete
- Performance optimizacije
- Launch skript za jednoklično pokretanje
- Export/Import funkcionalnosti
- Advanced filtriranje i sortiranje

## Tehnologije

- **HTML5** - Struktura aplikacije
- **CSS3** - Styling i responzivni dizajn
- **Vanilla JavaScript** - Logika aplikacije
- **JSON** - Lokalno čuvanje podataka
- **LocalStorage** - Perzistentno čuvanje stanja

## Pokretanje

Aplikacija se pokreće jednostavno otvaranjem `index.html` datoteke u web pregledniku. Nema potrebe za dodatnim instalacijama ili serverom.

## Ciljevi Projekta

1. **Autonomnost** - Potpuno samostalna aplikacija bez backend zavisnosti
2. **Jednostavnost** - Lako pokretanje i korišćenje
3. **Performance** - Optimizovano za rad sa velikim brojem operatera
4. **Održivost** - Jasna struktura koda i dokumentacija
5. **Skalabilnost** - Priprema za buduća proširenja

## Kontakt i Podrška

Za pitanja i predloge poboljšanja, konsultuj dokumentaciju u `planovi/` folderu ili kreiraj novi plan u `implementacija/` folderu.