
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from specific path
dotenv.config({ path: path.join(__dirname, '../server/.env') });
dotenv.config(); // fallback

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

async function setupDB() {
    const client = await pool.connect();
    try {
        console.log('🔌 Connected to database...');
        console.log('🛠️ Applying Phase 2 Schema Updates...');

        // 1. Add tags column to market_intelligence_items
        await client.query(`
            ALTER TABLE market_intelligence_items 
            ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
        `);
        console.log('✅ Added tags column to market_intelligence_items.');

        // 2. Create market_intelligence_favorites table
        await client.query(`
            CREATE TABLE IF NOT EXISTS market_intelligence_favorites (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL, -- References auth.users, but we might not have fk constraint if auth schema is separate
                item_id UUID NOT NULL REFERENCES market_intelligence_items(id) ON DELETE CASCADE,
                created_at TIMESTAMPTZ DEFAULT now(),
                UNIQUE(user_id, item_id)
            );
        `);
        console.log('✅ Table market_intelligence_favorites ensuring complete.');

        // 3. Create user_intelligence_preferences table
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_intelligence_preferences (
                user_id UUID PRIMARY KEY, -- References auth.users
                interested_tags TEXT[] DEFAULT '{}',
                interaction_history JSONB DEFAULT '[]'::jsonb,
                inferred_persona JSONB DEFAULT '{}'::jsonb,
                updated_at TIMESTAMPTZ DEFAULT now()
            );
        `);
        console.log('✅ Table user_intelligence_preferences ensuring complete.');

        // 4. Create updated_at trigger function if not exists
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // 5. Apply trigger to user_intelligence_preferences
        // Drop first to avoid error if exists
        await client.query(`
            DROP TRIGGER IF EXISTS update_user_preferences_modtime ON user_intelligence_preferences;
            CREATE TRIGGER update_user_preferences_modtime
                BEFORE UPDATE ON user_intelligence_preferences
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
         `);
        console.log('✅ Triggers applied.');


    } catch (err) {
        console.error('❌ Error updating database schema:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
        console.log('👋 Connection closed.');
    }
}

setupDB();
