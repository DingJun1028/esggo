
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;

if (supabaseUrl) {
    console.log(`SUPABASE_URL: ${supabaseUrl}`);
} else {
    console.error("SUPABASE_URL not found");
}
