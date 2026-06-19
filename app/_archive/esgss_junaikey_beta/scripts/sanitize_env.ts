
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');

try {
    const rawBuffer = fs.readFileSync(envPath);
    let content = "";

    // Check for UTF-16 BOM
    if (rawBuffer[0] === 0xFF && rawBuffer[1] === 0xFE) {
        content = rawBuffer.toString('utf16le');
    } else if (rawBuffer[0] === 0xFE && rawBuffer[1] === 0xFF) {
        content = rawBuffer.toString('utf16be');
    } else {
        content = rawBuffer.toString('utf8');
    }

    // Remove all \r and normalize line endings to \n
    const sanitized = content.replace(/\r/g, '').split('\n').map(line => line.trim()).join('\n');

    fs.writeFileSync(envPath, sanitized, 'utf8');
    console.log("✅ .env file sanitized and rewritten as UTF-8 with LF.");
} catch (e) {
    console.error("❌ Error sanitizing .env file:", e);
}
