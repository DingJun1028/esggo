import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing select of specific columns with anon key...');

async function test() {
  if (!anonKey) {
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
    return;
  }
  
  try {
    // Normal client with anon key (no custom headers)
    const supabase = createClient(supabaseUrl, anonKey);
    
    // Try selecting just a few columns
    console.log('\n--- Selecting id and company_id from evidence_vault ---');
    const { data, error } = await supabase
      .from('evidence_vault')
      .select('id, company_id')
      .limit(5);
    
    if (error) {
      console.log('❌ Error:', error);
      console.log('Error code:', error.code);
    } else {
      console.log(`✅ Success! Found ${data.length} rows:`);
      data.forEach((row, index) => {
        console.log(`  ${index + 1}: id=${row.id}, company_id=${row.company_id}`);
      });
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();