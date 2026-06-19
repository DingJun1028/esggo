
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

async function setupOmniSupabase() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('🌌 Setting up OmniSupabase Tables...');

        // 1. OmniSpace Entities
        await client.query(`
            CREATE TABLE IF NOT EXISTS omni_space_entities (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                data JSONB NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now(),
                metadata JSONB DEFAULT '{}'::jsonb
            );
        `);
        console.log('✅ Created omni_space_entities table.');

        // 2. OmniTable Rows
        await client.query(`
            CREATE TABLE IF NOT EXISTS omni_table_rows (
                id TEXT PRIMARY KEY,
                table_id TEXT NOT NULL,
                data JSONB NOT NULL,
                crystal_id TEXT,
                knowledge_id TEXT,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log('✅ Created omni_table_rows table.');

        // 3. Knowledge Sync Status
        await client.query(`
            CREATE TABLE IF NOT EXISTS knowledge_sync_status (
                knowledge_id TEXT PRIMARY KEY,
                synced BOOLEAN DEFAULT FALSE,
                last_sync_at TIMESTAMPTZ,
                error TEXT
            );
        `);
        console.log('✅ Created knowledge_sync_status table.');

        // 4. Omni Evolution Log
        await client.query(`
            CREATE TABLE IF NOT EXISTS omni_evolution_log (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                version INTEGER NOT NULL,
                timestamp TIMESTAMPTZ DEFAULT now(),
                changes JSONB NOT NULL
            );
        `);
        console.log('✅ Created omni_evolution_log table.');

        // 5. User Awakening (Hypercube)
        await client.query(`
            CREATE TABLE IF NOT EXISTS omni_user_evolution (
                user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- or FK to auth.users
                level INTEGER DEFAULT 1,
                rune_exp INTEGER DEFAULT 0,
                awakening_count INTEGER DEFAULT 0,
                tesseract_nodes INTEGER DEFAULT 0,
                dimensional_resonance INTEGER DEFAULT 0,
                hypercube_metrics JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log('✅ Created omni_user_evolution table.');

        // 6. Updated At Trigger
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        await client.query(`
            DROP TRIGGER IF EXISTS update_omni_space_entities_modtime ON omni_space_entities;
            CREATE TRIGGER update_omni_space_entities_modtime
                BEFORE UPDATE ON omni_space_entities
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);

        await client.query(`
            DROP TRIGGER IF EXISTS update_omni_table_rows_modtime ON omni_table_rows;
            CREATE TRIGGER update_omni_table_rows_modtime
                BEFORE UPDATE ON omni_table_rows
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);

        await client.query(`
            DROP TRIGGER IF EXISTS update_omni_user_evolution_modtime ON omni_user_evolution;
            CREATE TRIGGER update_omni_user_evolution_modtime
                BEFORE UPDATE ON omni_user_evolution
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('✅ Triggers created.');

    } catch (err) {
        console.error('❌ Setup failed:', err);
    } finally {
        await client.end();
    }
}

setupOmniSupabase();
