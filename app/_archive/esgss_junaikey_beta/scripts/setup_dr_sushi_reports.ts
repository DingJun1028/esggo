
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const DATABASE_URL = process.env.DATABASE_URL;


if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is required');
    process.exit(1);
} else {
    console.log('🔌 Connecting to:', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
}


const { Pool } = pg;
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function setupDrSushiReports() {
    const client = await pool.connect();
    try {
        console.log('🍣 Setting up Dr. Sushi Reports Table...');

        await client.query('BEGIN');

        // Create market_intelligence_reports table
        await client.query(`
      CREATE TABLE IF NOT EXISTS market_intelligence_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        tags TEXT[] DEFAULT '{}',
        source_item_ids UUID[] DEFAULT '{}',
        report_type TEXT NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);

        // Add trigger for updated_at if it doesn't exist (it might already exist from previous scripts)
        // We'll just try to create the trigger, if the function exists.
        // Assuming update_updated_at_column function exists from previous setups.

        // Check if trigger exists
        const triggerCheck = await client.query(`
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_market_intelligence_reports_modtime';
    `);

        if (triggerCheck.rowCount === 0) {
            await client.query(`
            CREATE TRIGGER update_market_intelligence_reports_modtime
            BEFORE UPDATE ON market_intelligence_reports
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);
            console.log('✅ Created trigger for updated_at.');
        } else {
            console.log('ℹ️ Trigger for updated_at already exists.');
        }

        await client.query('COMMIT');
        console.log('✅ Successfully created market_intelligence_reports table.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error setting up Dr. Sushi Reports:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

setupDrSushiReports();
