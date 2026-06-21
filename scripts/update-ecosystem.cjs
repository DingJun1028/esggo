const fs = require('fs');
const path = '/var/www/esggo/.env';
const env = {};
try {
  const lines = fs.readFileSync(path, 'utf8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx === -1) continue;
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim();
  }
} catch (e) { console.error('Cannot read .env:', e.message); }

const OPENROUTER_API_KEY = env['OPENROUTER_API_KEY'] || '';
const OPENROUTER_MODEL = env['AI_MODEL'] || 'google/gemma-4-31b-it:free';
const GEMINI_API_KEY = env['GEMINI_API_KEY'] || '';
const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'] || '';
const SUPABASE_KEY = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
const SUPABASE_SERVICE = env['SUPABASE_SERVICE_ROLE_KEY'] || '';

module.exports = {
  apps: [
    {
      name: 'esggo-core',
      cwd: '/var/www/esggo',
      script: 'server.js',
      node_args: '-r dotenv/config',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        OPENROUTER_API_KEY: OPENROUTER_API_KEY,
        OPENROUTER_MODEL: OPENROUTER_MODEL,
        GEMINI_API_KEY: GEMINI_API_KEY,
        NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_KEY,
        SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE,
      },
      env_development: {
        NODE_ENV: 'development',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/esggo-error.log',
      out_file: './logs/esggo-out.log',
      merge_logs: true,
    },
  ],
};
