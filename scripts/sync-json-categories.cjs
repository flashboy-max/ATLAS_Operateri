/**
 * Sync JSON Categories Script
 * Syncs operator JSON files with PostgreSQL category values
 * Run: node scripts/sync-json-categories.js
 */

const fs = require('fs');
const path = require('path');

// Category mapping from PostgreSQL export
const categoryMapping = {
    1: 'alternativni',
    2: 'alternativni',
    3: 'dominantni',
    4: 'dominantni',
    5: 'dominantni',
    6: 'dominantni',
    7: 'alternativni',
    8: 'alternativni',
    9: 'alternativni',
    10: 'alternativni',
    11: 'alternativni',
    12: 'alternativni',
    13: 'alternativni',
    14: 'alternativni',
    15: 'alternativni',
    16: 'alternativni',
    17: 'alternativni',
    18: 'alternativni',
    19: 'alternativni',
    20: 'alternativni',
    21: 'alternativni',
    22: 'alternativni',
    23: 'alternativni',
    24: 'alternativni',
    25: 'alternativni',
    26: 'alternativni',
    27: 'alternativni',
    28: 'alternativni',
    29: 'alternativni',
    30: 'alternativni'
};

const operatorsDir = path.join(__dirname, '..', 'operators');
let updatedCount = 0;
let errorCount = 0;

console.log('🔄 Starting JSON category sync...\n');

// Process each operator ID
Object.keys(categoryMapping).forEach(id => {
    const filePath = path.join(operatorsDir, `${id}.json`);
    const expectedCategory = categoryMapping[id];
    
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${id}.json`);
            return;
        }
        
        // Read JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const operatorData = JSON.parse(fileContent);
        
        // Check current category
        const currentCategory = operatorData.kategorija || 'alternativni';
        
        if (currentCategory !== expectedCategory) {
            // Update category
            operatorData.kategorija = expectedCategory;
            
            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(operatorData, null, 2), 'utf8');
            
            console.log(`✅ ID ${id}: ${currentCategory} → ${expectedCategory} (${operatorData.naziv})`);
            updatedCount++;
        } else {
            console.log(`✓  ID ${id}: ${expectedCategory} (already correct)`);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${id}.json:`, error.message);
        errorCount++;
    }
});

console.log('\n📊 Sync Summary:');
console.log(`   Updated: ${updatedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total processed: ${Object.keys(categoryMapping).length} files`);

if (updatedCount > 0) {
    console.log('\n✅ JSON files synced with PostgreSQL categories!');
} else {
    console.log('\n✅ All JSON files already in sync!');
}
