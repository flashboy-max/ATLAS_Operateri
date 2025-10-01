import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const operateriPath = path.join(__dirname, 'operateri.json');
const operatorsDir = path.join(__dirname, 'operators');
const backupPath = path.join(__dirname, 'operateri_backup_migration.json');

// Ensure operators directory exists
if (!fs.existsSync(operatorsDir)) {
    fs.mkdirSync(operatorsDir, { recursive: true });
}

// Read operateri.json
console.log('Reading operateri.json...');
const operateriData = JSON.parse(fs.readFileSync(operateriPath, 'utf8'));

// Create backup
console.log('Creating backup...');
fs.writeFileSync(backupPath, JSON.stringify(operateriData, null, 2), 'utf8');

// Split into individual files
const operators = operateriData.operateri || [];
console.log(`Migrating ${operators.length} operators...`);
let successCount = 0;
let errorCount = 0;

operators.forEach((operator, index) => {
    try {
        if (!operator.id) {
            console.error(`Operator at index ${index} missing id:`, operator.naziv);
            errorCount++;
            return;
        }

        const filePath = path.join(operatorsDir, `${operator.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(operator, null, 2), 'utf8');
        successCount++;
        console.log(`✓ Migrated: ${operator.naziv} (${operator.id})`);

    } catch (error) {
        console.error(`✗ Error migrating operator ${operator.naziv}:`, error.message);
        errorCount++;
    }
});

console.log('\nMigration completed!');
console.log(`✓ Successfully migrated: ${successCount} operators`);
console.log(`✗ Errors: ${errorCount}`);
console.log(`📁 Backup created: ${backupPath}`);
console.log(`📂 Individual files created in: ${operatorsDir}`);

// Verify migration
console.log('\nVerifying migration...');
const files = fs.readdirSync(operatorsDir).filter(file => file.endsWith('.json'));
console.log(`📄 Files created: ${files.length}`);

if (files.length === successCount) {
    console.log('✅ Migration verification passed!');
} else {
    console.log('⚠️  Migration verification failed - file count mismatch');
}