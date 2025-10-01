const fs = require('fs');
const path = require('path');

const operatorsDir = path.join(__dirname, 'operators');

// Pronađi sve JSON fajlove
const files = fs.readdirSync(operatorsDir).filter(f => f.endsWith('.json'));

let fixedCount = 0;

files.forEach(file => {
    const filePath = path.join(operatorsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Provjeri da li sadrži grešku
    if (content.includes('posleduje_misljenje_zuo')) {
        // Zamijeni pogrešno sa ispravnim
        const fixed = content.replace(/"posleduje_misljenje_zuo"/g, '"posjeduje_misljenje_zuo"');
        
        // Sačuvaj fajl
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log(`✅ Fixed: ${file}`);
        fixedCount++;
    }
});

console.log(`\n✨ Finished! Fixed ${fixedCount} files.`);
console.log('Changed: "posleduje_misljenje_zuo" → "posjeduje_misljenje_zuo"');
