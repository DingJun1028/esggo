
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const host = process.env.SUPABASE_DB_HOST || '';
const codes = host.split('').map(c => ({ char: c, code: c.charCodeAt(0) }));

fs.writeFileSync('host_diagnostic.json', JSON.stringify(codes, null, 2));
console.log("Written host_diagnostic.json");
