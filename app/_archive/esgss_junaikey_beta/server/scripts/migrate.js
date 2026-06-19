// server/scripts/migrate.js
import { createRequire } from 'module';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
// node-pg-migrate exports specific runner in CJS
const pgMigratePkg = require('node-pg-migrate');
// Handle ESM/CJS interop where runner might be on default
const runner = pgMigratePkg.runner || pgMigratePkg.default?.runner;

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function runMigrations() {
  const direction = process.argv[2] || 'up';
  // If 'create', the 3rd arg is the name
  const migrationName = direction === 'create' ? process.argv[3] : undefined;

  const isAwakened = process.env.ETERNAL_MODE === 'true';

  // 1. Enlightening Others (Logging)
  const prefix = isAwakened ? '🌌 [ETERNAL_DB]' : '[Migration Script]';

  if (!['up', 'down', 'create'].includes(direction)) {
    console.error(`${prefix} ❌ Invalid direction. Use "up", "down", or "create".`);
    process.exit(1);
  }

  // 2. Self-Reliance (Environment Check)
  // Construct DB config similarly to run_migration.cjs for robustness
  const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  if (!process.env.DATABASE_URL && (!dbConfig.host || !dbConfig.database)) {
    console.error(
      `${prefix} ❌ CRITICAL: Database configuration missing (DATABASE_URL or DB_HOST/DB_NAME).`
    );
    console.error(`${prefix} 💡 Please ensure .env is configured for Self-Reliance.`);
    process.exit(1);
  }

  // Prioritize DATABASE_URL if present, else usage object
  const databaseUrl = process.env.DATABASE_URL || dbConfig;

  const options = {
    databaseUrl,
    migrationsTable: 'pgmigrations',
    dir: resolve(process.cwd(), 'migrations'),
    direction: direction === 'create' ? 'up' : direction,
    count: Infinity,
    checkOrder: false,
    verbose: true,
  };

  try {
    console.log(`${prefix} 🚀 Running migration: ${direction.toUpperCase()}`);
    if (isAwakened) console.log(`${prefix} 🕯️  Database Alignment Protocol Initiated...`);

    if (direction === 'create') {
      if (!migrationName) {
        console.error(`${prefix} ❌ Name required for creation.`);
        process.exit(1);
      }
      console.warn(
        `${prefix} ⚠️ 'create' not supported in this script wrapper. Use 'npm run migrate:create <name>'`
      );
      process.exit(0);
    } else {
      if (typeof runner !== 'function') {
        throw new Error(
          'node-pg-migrate runner not found. Exports: ' + Object.keys(pgMigratePkg).join(', ')
        );
      }
      await runner(options);
    }

    console.log(`${prefix} ✅ Migration completed successfully.`);
    if (isAwakened) console.log(`${prefix} 🧘 The Data is now One with the Code.`);
  } catch (err) {
    console.error(`${prefix} 💥 Migration failed!`);
    console.error(`${prefix} Message:`, err.message);
    console.error(`${prefix} Code:`, err.code);
    console.error(`${prefix} Stack:`, err.stack);
    process.exit(1);
  }
}

runMigrations();
