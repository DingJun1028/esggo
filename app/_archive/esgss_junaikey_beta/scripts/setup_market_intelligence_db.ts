
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
const host = "3.1.189.176";
const port = 5432;
const user = "postgres";
const password = "A127178099S1421680s";
const database = "postgres";

console.log("HOST_CHARS:", JSON.stringify(host.split('').map(c => c.charCodeAt(0))));

console.log("DB_CONFIG:", {
  host: `[${host}]`,
  port,
  user: `[${user}]`,
  database: `[${database}]`,
  passwordLength: password.length
});

const pool = new Pool({
  host,
  port,
  user,
  password,
  database,
  ssl: { rejectUnauthorized: false },
});

async function setupDB() {
  const client = await pool.connect();
  try {
    console.log('🔌 Connected to database...');

    console.log('🛠️ Creating tables if not exist...');

    // 1. esg_incidents
    await client.query(`
      CREATE TABLE IF NOT EXISTS esg_incidents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        item_id uuid REFERENCES market_intelligence_items(id),
        risk_level text,
        status text DEFAULT 'Unresolved',
        ai_rationale text,
        severity_score numeric,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `);
    console.log('✅ Table esg_incidents ensuring complete.');

    // 2. esg_notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS esg_notifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        type text,
        title text,
        message text,
        priority text,
        status text DEFAULT 'unread',
        recipient_user_id uuid,
        metadata jsonb,
        created_at timestamptz DEFAULT now()
      );
    `);
    console.log('✅ Table esg_notifications ensuring complete.');

  } catch (err) {
    console.error('❌ Error setting up database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    console.log('👋 Connection closed.');
  }
}

setupDB();
