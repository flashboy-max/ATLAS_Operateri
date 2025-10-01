import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from root directory
app.use(express.static(__dirname));

// Ensure operators directory exists
const operatorsDir = path.join(__dirname, 'operators');
if (!fs.existsSync(operatorsDir)) {
    fs.mkdirSync(operatorsDir, { recursive: true });
}

// API endpoint to save operator
app.post('/api/save-operator', (req, res) => {
    try {
        const { operatorId, operatorData } = req.body;

        if (!operatorId || !operatorData) {
            return res.status(400).json({ error: 'Missing operatorId or operatorData' });
        }

        // Validate operator data structure
        if (!operatorData.naziv || !operatorData.id) {
            return res.status(400).json({ error: 'Invalid operator data structure' });
        }

        // Ensure operatorId matches data.id
        if (operatorData.id !== operatorId) {
            return res.status(400).json({ error: 'Operator ID mismatch' });
        }

        const filePath = path.join(operatorsDir, `${operatorId}.json`);

        // Write operator data to file
        fs.writeFileSync(filePath, JSON.stringify(operatorData, null, 2), 'utf8');

        res.json({ success: true, message: 'Operator saved successfully' });

    } catch (error) {
        console.error('Error saving operator:', error);
        res.status(500).json({ error: 'Failed to save operator' });
    }
});

// API endpoint to get operator
app.get('/api/operator/:id', (req, res) => {
    try {
        const operatorId = req.params.id;
        const filePath = path.join(operatorsDir, `${operatorId}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        const operatorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(operatorData);

    } catch (error) {
        console.error('Error loading operator:', error);
        res.status(500).json({ error: 'Failed to load operator' });
    }
});

// API endpoint to list all operators
app.get('/api/operators', (req, res) => {
    try {
        const files = fs.readdirSync(operatorsDir).filter(file => file.endsWith('.json'));
        const operators = files.map(file => {
            const filePath = path.join(operatorsDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return {
                id: data.id,
                naziv: data.naziv,
                file: file
            };
        });

        res.json(operators);

    } catch (error) {
        console.error('Error listing operators:', error);
        res.status(500).json({ error: 'Failed to list operators' });
    }
});

// API endpoint to delete operator
app.delete('/api/operator/:id', (req, res) => {
    try {
        const operatorId = req.params.id;
        const filePath = path.join(operatorsDir, `${operatorId}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        // Read operator data before deletion for logging
        const operatorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Delete the file
        fs.unlinkSync(filePath);
        
        console.log(`✅ Operator deleted: ${operatorData.naziv} (ID: ${operatorId})`);
        res.json({ 
            success: true, 
            message: `Operator "${operatorData.naziv}" successfully deleted`,
            deletedOperator: {
                id: operatorData.id,
                naziv: operatorData.naziv
            }
        });

    } catch (error) {
        console.error('Error deleting operator:', error);
        res.status(500).json({ error: 'Failed to delete operator' });
    }
});

app.listen(PORT, () => {
    console.log(`ATLAS Backend Server running on http://localhost:${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
});