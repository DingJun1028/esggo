import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing with service role key (should bypass RLS)...');
console.log(`Service role key present: !!${serviceRoleKey}`);
if (serviceRoleKey) {
  console.log(`Service role key length: ${serviceRoleKey.length}`);
  console.log(`Service role key preview: ${serviceRoleKey.substring(0, 50)}...`);
}

async function test() {
  if (!serviceRoleKey) {
    console.log('SUPABASE_SERVICE_ROLE_KEY not found');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const { data, error } = await supabase.from('evidence_vault').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Error with service role key:', error);
      console.log('Error code:', error.code);
    } else {
      console.log('✅ Success with service role key! Count:', data);
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();