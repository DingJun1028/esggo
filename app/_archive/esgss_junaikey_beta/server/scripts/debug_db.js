import { createRequire } from 'module';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: resolve(process.cwd(), '.env') });

async function verifyConnection() {
  console.log('🌌 [ETERNAL_DB] Verifying Connection...');

  const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  console.log(`Target: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

  const client = new Client(process.env.DATABASE_URL || dbConfig);

  try {
    await client.connect();
    console.log('✅ Connection Established.');

    const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

    console.log('📜 Existing Tables:');
    res.rows.forEach(row => console.log(` - ${row.table_name}`));

    // Check for migrations table
    const migRes = await client.query('SELECT * FROM pgmigrations ORDER BY id DESC LIMIT 5;');
    console.log('📚 Recent Migrations:');
    migRes.rows.forEach(row => console.log(` - ${row.name} (${row.run_on})`));
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    if (err.code) console.error('Code:', err.code);
  } finally {
    await client.end();
  }
}

verifyConnection();
