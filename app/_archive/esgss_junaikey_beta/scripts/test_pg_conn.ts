
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { Client } = pg;

async function test() {
    console.log(`Testing connection to: ${process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@')}`);
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Connection established!");
        const res = await client.query('SELECT NOW()');
        console.log("Query Result:", res.rows[0]);
    } catch (err) {
        console.error("❌ Connection failed!");
        console.error(err);
    } finally {
        await client.end();
    }
}

test();
