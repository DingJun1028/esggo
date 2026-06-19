
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_FILE = '011_init_omnipotent_think_tank.sql';
const MIGRATION_PATH = path.join(__dirname, '../database/migrations', MIGRATION_FILE);

async function runMigration() {
    console.log(`[MIGRATION] Starting manual migration: ${MIGRATION_FILE}`);

    // Debug Logging
    console.log('[DEBUG] DB Configuration Check:');
    console.log(' - Host:', process.env.VECTOR_DB_HOST || process.env.SUPABASE_DB_HOST);
    console.log(' - Port:', process.env.VECTOR_DB_PORT || process.env.SUPABASE_DB_PORT);
    console.log(' - User:', process.env.VECTOR_DB_USER || process.env.SUPABASE_DB_USER);
    console.log(' - SSL:', process.env.VECTOR_DB_SSL);

    try {
        const sqlContent = fs.readFileSync(MIGRATION_PATH, 'utf-8');
        console.log(`[MIGRATION] Read ${sqlContent.length} bytes from file.`);

        const client = await pool.connect();
        try {
            console.log('[MIGRATION] Database connected. Executing SQL...');
            await client.query('BEGIN');
            await client.query(sqlContent);
            await client.query('COMMIT');
            console.log('[MIGRATION] Success! Migration applied.');
        } catch (dbError) {
            await client.query('ROLLBACK');
            console.error('[MIGRATION] Database Error:', dbError);
            process.exit(1);
        } finally {
            client.release();
        }
    } catch (fsError) {
        console.error('[MIGRATION] File System Error:', fsError);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
