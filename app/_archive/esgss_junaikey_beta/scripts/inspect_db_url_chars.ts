
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
    const chars = [];
    for (let i = 0; i < dbUrl.length; i++) {
        chars.push(dbUrl.charCodeAt(i));
    }
    console.log("DB_URL_CHARS:", JSON.stringify(chars));
} else {
    console.error("DATABASE_URL not found");
}
