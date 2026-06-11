import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing basic Supabase connection...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key length: ${supabaseKey.length}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    // Try a simple query on a table that likely exists
    const { data, error } = await supabase.from('evidence_vault').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('Error:', error);
      console.log('Error code:', error.code);
    } else {
      console.log('Success! Count:', data);
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();