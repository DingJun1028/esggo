import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Function to create a token by modifying the payload of OMNI_MCP_ACCESS_TOKEN
function createModifiedOmniToken(companyId) {
  const omniToken = process.env.OMNI_MCP_ACCESS_TOKEN;
  if (!omniToken) {
    throw new Error('OMNI_MCP_ACCESS_TOKEN not found in environment');
  }
  
  const parts = omniToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid OMNI_MCP_ACCESS_TOKEN format');
  }
  
  // Decode the payload
  let payload;
  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  } catch (err) {
    throw new Error(`Failed to decode OMNI_MCP_ACCESS_TOKEN payload: ${err.message}`);
  }
  
  // Modify the company_id in app_metadata
  if (!payload.app_metadata) {
    payload.app_metadata = {};
  }
  payload.app_metadata.company_id = companyId;
  
  // Re-encode the payload
  const newPayload = base64url(JSON.stringify(payload));
  
  // Return new token with same header and signature
  return `${parts[0]}.${newPayload}.${parts[2]}`;
}

// Helper function to generate base64url encoded string
function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

console.log('Testing with modified OMNI_MCP_ACCESS_TOKEN...');

async function test() {
  try {
    // Create a token for Company_A
    const tokenA = createModifiedOmniToken('Company_A');
    const tokenB = createModifiedOmniToken('Company_B');
    
    console.log('Token A (Company_A):', tokenA.substring(0, 50) + '...');
    console.log('Token B (Company_B):', tokenB.substring(0, 50) + '...');
    
    const supabaseA = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${tokenA}` } }
    });
    
    const supabaseB = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${tokenB}` } }
    });
    
    // Test 1: Try inserting with Company_A (should succeed)
    console.log('\n--- Test 1A: Inserting evidence_vault with Company_A ---');
    const insertResultA = await supabaseA
      .from('evidence_vault')
      .insert([{ company_id: 'Company_A', content: 'Test A', evidence_hash: 'hashA' }]);
    
    if (insertResultA.error) {
      console.log('❌ Error:', insertResultA.error);
    } else {
      console.log('✅ Success: Inserted evidence_vault for Company_A');
    }
    
    // Test 2: Try inserting with Company_B using Company_A token (should fail with RLS)
    console.log('\n--- Test 1B: Inserting evidence_vault with Company_B using Company_A token ---');
    const insertResultB = await supabaseA
      .from('evidence_vault')
      .insert([{ company_id: 'Company_B', content: 'Test Cross', evidence_hash: 'hashCross' }]);
    
    if (insertResultB.error) {
      if (insertResultB.error.code === '42501') {
        console.log('✅ PASS: RLS blocked cross-company insert (expected 42501)');
      } else {
        console.log('❌ Unexpected error:', insertResultB.error);
      }
    } else {
      console.log('❌ FAIL: Insert succeeded when it should have been blocked by RLS');
    }
    
    // Test 3: Try selecting as Company_B (should not see Company_A records)
    console.log('\n--- Test 2: Selecting evidence_vault as Company_B ---');
    const selectResult = await supabaseB.from('evidence_vault').select('*');
    
    if (selectResult.error) {
      console.log('❌ Error selecting:', selectResult.error);
    } else {
      const hasCompanyARecords = selectResult.data.some(r => r.company_id === 'Company_A');
      if (hasCompanyARecords) {
        console.log('❌ FAIL: Company_B can see Company_A records!');
      } else {
        console.log('✅ PASS: Company_B cannot see Company_A records (RLS SELECT applied)');
      }
    }
    
  } catch (err) {
    console.log('Error during test:', err);
  }
}

test();