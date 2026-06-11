import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing insert and select with anon key...');

async function test() {
  if (!anonKey) {
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
    return;
  }
  
  try {
    // Normal client with anon key (no custom headers)
    const supabase = createClient(supabaseUrl, anonKey);
    
    // First, let's see what's in the table
    console.log('\n--- Checking current contents of evidence_vault ---');
    const { data: initialData, error: initialError } = await supabase
      .from('evidence_vault')
      .select('*');
    
    if (initialError) {
      console.log('❌ Error selecting:', initialError);
    } else {
      console.log(`✅ Found ${initialData.length} rows in evidence_vault`);
      if (initialData.length > 0) {
        console.log('First row:', initialData[0]);
      }
    }
    
    // Now try to insert a row
    console.log('\n--- Attempting to insert a row ---');
    const insertResult = await supabase
      .from('evidence_vault')
      .insert([{ 
        company_id: 'TestCompany', 
        file_name: 'test.txt', 
        file_type: 'TXT', 
        file_size: 100,
        storage_path: 'test/test.txt',
        status: 'Test'
      }]);
    
    if (insertResult.error) {
      console.log('❌ Error inserting:', insertResult.error);
      console.log('Error code:', insertResult.error.code);
    } else {
      console.log('✅ Success inserting! Count:', insertResult.count);
    }
    
    // Try selecting again to see if our row is there
    console.log('\n--- Checking contents after insert ---');
    const { data: finalData, error: finalError } = await supabase
      .from('evidence_vault')
      .select('*');
    
    if (finalError) {
      console.log('❌ Error selecting after insert:', finalError);
    } else {
      console.log(`✅ Found ${finalData.length} rows in evidence_vault after insert`);
      if (finalData.length > 0) {
        console.log('Last row:', finalData[finalData.length - 1]);
      }
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();