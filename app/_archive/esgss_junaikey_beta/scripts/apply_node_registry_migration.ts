/**
 * scripts/apply_node_registry_migration.ts
 * Manually apply the node_registry migration via DATABASE_URL.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ Missing DATABASE_URL.');
    process.exit(1);
}

const migrationSQL = `
CREATE TABLE IF NOT EXISTS public.node_registry (
    node_id TEXT PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    node_type TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_node_registry_uuid ON public.node_registry(uuid);
`;

async function applyMigration() {
    console.log('🌌 Applying Node-UUID Registry Migration...');
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        await client.query(migrationSQL);
        console.log('✅ node_registry table created/verified.');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyMigration();
