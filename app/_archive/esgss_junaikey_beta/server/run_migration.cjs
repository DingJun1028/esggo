const { runner } = require('node-pg-migrate');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables explicitly
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

async function runMigrations() {
  console.log('🚀 Starting Programmatic Migration...');
  console.log(`📂 Migrations Directory: ${path.join(__dirname, 'migrations')}`);
  console.log(
    `🔌 DB Connection: ${process.env.DB_HOST}:${process.env.PORT || 5432} / ${process.env.DB_NAME}`
  );

  try {
    const options = {
      databaseUrl: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        // ssl: { rejectUnauthorized: false } // Uncomment if needed for cloud DB
      },
      dir: path.join(__dirname, 'migrations'),
      direction: 'up',
      migrationsTable: 'pgmigrations',
      count: Infinity, // Run all pending
      verbose: true,
      // dryRun: true // Uncomment to test
    };

    await runner(options);
    console.log('✅ Migrations completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
