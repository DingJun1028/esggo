
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
        if (line.startsWith('DATABASE_URL=')) {
            const url = line.split('=')[1].trim();
            // Mask password: postgresql://user:password@hostname...
            const masked = url.replace(/:([^:@]+)@/, ':****@');
            console.log(`RAW_DATABASE_URL_MASKED: ${masked}`);
        }
    }
} catch (e) {
    console.error("Error reading .env file", e);
}
