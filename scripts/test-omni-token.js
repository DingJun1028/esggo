import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const omniToken = process.env.OMNI_MCP_ACCESS_TOKEN;

console.log('Testing OMNI_MCP_ACCESS_TOKEN directly...');
console.log(`Token present: ${!!omniToken}`);
if (omniToken) {
  console.log(`Token length: ${omniToken.length}`);
  console.log(`Token preview: ${omniToken.substring(0, 50)}...`);
}

async function test() {
  if (!omniToken) {
    console.log('OMNI_MCP_ACCESS_TOKEN not found');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${omniToken}` } }
    });
    
    const { data, error } = await supabase.from('evidence_vault').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Error with OMNI_MCP_ACCESS_TOKEN:', error);
      console.log('Error code:', error.code);
    } else {
      console.log('✅ Success with OMNI_MCP_ACCESS_TOKEN! Count:', data);
    }
  } catch (err) {
    console.log('Exception:', err);
  }
}

test();