
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
    // Mask password: postgresql://user:password@hostname:port/db
    const masked = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`CURRENT_DATABASE_URL_MASKED: ${masked}`);
} else {
    console.error("DATABASE_URL not found");
}
