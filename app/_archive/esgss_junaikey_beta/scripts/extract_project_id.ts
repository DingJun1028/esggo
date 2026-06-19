
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;

if (supabaseUrl) {
    try {
        const url = new URL(supabaseUrl);
        const projectId = url.hostname.split('.')[0];
        console.log(`PROJECT_ID_DETECTED: ${projectId}`);
    } catch (e) {
        console.error("Failed to parse SUPABASE_URL");
    }
} else {
    console.error("SUPABASE_URL not found in .env");
}
