// @ts-nocheck
// Setup reading_room_documents table and seed data via Supabase SQL API
// Run: node scripts/setup-reading-room.cjs

const https = require('https');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');

// Get the actual JWT service role key
let SERVICE_KEY = null;
for (const line of envContent.split('\n')) {
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    let k = line.substring('SUPABASE_SERVICE_ROLE_KEY=').trim();
    // Handle case where key value contains the prefix again
    if (k.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      k = k.substring('SUPABASE_SERVICE_ROLE_KEY=').trim();
    }
    if (k.startsWith('eyJ')) {
      SERVICE_KEY = k;
      break;
    }
  }
}

if (!SERVICE_KEY) {
  console.error('ERROR: No valid service role key found');
  process.exit(1);
}

const SUPABASE_URL = 'https://yhwfmavnhaivvgzeuklx.supabase.co';

function sqlRequest(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    const options = {
      hostname: new URL(SUPABASE_URL).hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('Setting up reading_room_documents...');
  
  // Try to create table via SQL API
  const createSQL = `
    CREATE TABLE IF NOT EXISTS public.reading_room_documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'standard',
      file_url TEXT,
      gri_reference TEXT,
      esg_category TEXT,
      tags TEXT[] DEFAULT '{}',
      source TEXT,
      published_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  console.log('Creating table...');
  const result = await sqlRequest(createSQL);
  console.log('Create table result:', result.status, result.body.substring(0, 100));
}

main().catch(console.error);
