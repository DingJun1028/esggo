import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing service role key WITHOUT custom headers...');

async function test() {
  if (!serviceRoleKey) {
    console.log('SUPABASE_SERVICE_ROLE_KEY not found');
    return;
  }
  
  try {
    // Normal client with service role key (no custom headers)
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('Attempting to select from evidence_vault...');
    const { data, error } = await supabase.from('evidence_vault').select('*').limit(1);
    
    if (error) {
      console.log('❌ Error:', error);
      console.log('Error code:', error.code);
      if (error.details) console.log('Details:', error.details);
    } else {
      console.log('✅ Success! Retrieved data:', data);
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();