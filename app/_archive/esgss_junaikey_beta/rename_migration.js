const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(process.cwd(), 'server/database/migrations');
const oldName = '010_rename_boost_log_to_omni_log.sql';
const newName = '012_rename_boost_log_to_omni_log.sql';

const oldPath = path.join(migrationsDir, oldName);
const newPath = path.join(migrationsDir, newName);

// Check if old file exists
if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Renamed: ' + oldName + ' -> ' + newName);
} else {
  console.log('File not found: ' + oldPath);
}

// List remaining migration files
console.log('\nMigration files:');
fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()
  .forEach(f => console.log('  - ' + f));
