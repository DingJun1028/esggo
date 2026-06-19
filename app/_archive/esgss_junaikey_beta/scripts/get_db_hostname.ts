
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
    try {
        const url = new URL(dbUrl);
        console.log(`DB_HOSTNAME: ${url.hostname}`);
    } catch (e) {
        // Fallback for non-standard URLs
        const match = dbUrl.match(/@([^:/]+)/);
        if (match) {
            console.log(`DB_HOSTNAME_REGEX: ${match[1]}`);
        } else {
            console.error("Could not find hostname in DATABASE_URL");
        }
    }
} else {
    console.error("DATABASE_URL not found");
}
