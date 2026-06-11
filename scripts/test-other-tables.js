import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing select on other tables with anon key...');

async function test() {
  if (!anonKey) {
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY not found');
    return;
  }
  
  try {
    // Normal client with anon key (no custom headers)
    const supabase = createClient(supabaseUrl, anonKey);
    
    // Check audit_logs table
    console.log('\n--- Checking audit_logs table ---');
    const { data: auditData, error: auditError } = await supabase
      .from('audit_logs')
      .select('id, company_id, action')
      .limit(5);
    
    if (auditError) {
      console.log('❌ Error querying audit_logs:', auditError);
    } else {
      console.log(`✅ Found ${auditData.length} rows in audit_logs:`);
      auditData.forEach((row, index) => {
        console.log(`  ${index + 1}: id=${row.id}, company_id=${row.company_id}, action=${row.action}`);
      });
    }
    
    // Check sustainwrite_sections table
    console.log('\n--- Checking sustainwrite_sections table ---');
    const { data: sectionData, error: sectionError } = await supabase
      .from('sustainwrite_sections')
      .select('id, company_id, section_key')
      .limit(5);
    
    if (sectionError) {
      console.log('❌ Error querying sustainwrite_sections:', sectionError);
    } else {
      console.log(`✅ Found ${sectionData.length} rows in sustainwrite_sections:`);
      sectionData.forEach((row, index) => {
        console.log(`  ${index + 1}: id=${row.id}, company_id=${row.company_id}, section_key=${row.section_key}`);
      });
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();