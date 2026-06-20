import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

function getEnv(content: string, key: string): string | undefined {
  const re = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=(.*)$`, 'm');
  const m = content.match(re);
  return m ? m[1].trim() : undefined;
}

const supabaseUrl = getEnv(envContent, 'NEXT_PUBLIC_SUPABASE_URL');
const anonKey = getEnv(envContent, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
const serviceRoleKey = getEnv(envContent, 'SUPABASE_SERVICE_ROLE_KEY');

console.log('URL:', supabaseUrl?.slice(0, 30) + '...');
console.log('Anon key prefix:', anonKey?.slice(0, 20) + '...');
console.log('Service role key prefix:', serviceRoleKey?.slice(0, 20) + '...');

// Try with service role key first
const key = serviceRoleKey || anonKey;
if (!supabaseUrl || !key) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, key, {
  auth: { persistSession: false },
});

// Simple test: count rows
const { count, error } = await supabase
  .from('reading_room_documents')
  .select('*', { count: 'exact', head: true });

if (error) {
  console.error('Test query failed:', error.message);
  console.error('Error code:', error.code);
  console.error('Error details:', error.details);
  console.error('Error hint:', error.hint);
} else {
  console.log('Existing documents:', count);
}
