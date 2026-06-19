import dotenv from 'dotenv';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function deployMigration() {
  console.log('🚀 Starting OmniTable Sync Log Migration...');

  const client = new Client({
    host: process.env.SUPABASE_DB_HOST,
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
    database: process.env.SUPABASE_DB_NAME,
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false } // Required for Supabase in some envs
  });

  try {
    await client.connect();
    console.log('✅ Connected to database.');

    const migrationPath = path.resolve(__dirname, '../database/migrations/010_omnitable_sync_log.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📜 Executing migration script...');
    await client.query(sql);

    console.log('✅ Migration applied successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected.');
  }
}

deployMigration();
