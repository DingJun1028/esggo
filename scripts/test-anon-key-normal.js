
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing anon key WITHOUT custom headers...');

async function test() {
  if (!anonKey) {
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
    return;
  }

  try {
    // Normal client with anon key (no custom headers)
    const supabase = createClient(supabaseUrl, anonKey);

    console.log('Attempting to select from evidence_vault...');
    const { data, error } = await supabase.from('evidence_vault').select('*').limit(1);

    if (error) {
      console.log('❌ Error:', error);
      console.log('Error code:', error.code);
      if (error.details) console.log('Details:', error.details);
    } else {
      console.log('✅ Success! Retrieved data:', data);
      console.log('Number of records:', data.length);
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();