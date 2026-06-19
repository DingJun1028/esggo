
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../server/.env');
dotenv.config({ path: envPath });

const supUrl = process.env.SUPABASE_URL;
const dbUrl = process.env.DATABASE_URL;

console.log("--- HOSTNAME COMPARISON ---");
if (supUrl) {
    const s = new URL(supUrl).hostname;
    console.log(`SUP_HOST: [${s}] (Length: ${s.length})`);
}
if (dbUrl) {
    let d = "";
    try {
        d = new URL(dbUrl).hostname;
    } catch {
        const match = dbUrl.match(/@([^:/]+)/);
        if (match) d = match[1];
    }
    console.log(`DB_HOST:  [${d}] (Length: ${d.length})`);

    if (supUrl) {
        const supProject = new URL(supUrl).hostname.split('.')[0];
        console.log(`SUP_PROJECT: [${supProject}]`);
        if (d.includes(supProject)) {
            console.log("MATCH: DB_HOST contains SUP_PROJECT");
        } else {
            console.log("MISMATCH: DB_HOST does NOT contain SUP_PROJECT");
        }
    }
}
