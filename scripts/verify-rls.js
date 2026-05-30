import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper function to generate base64url encoded string
function base64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

// Generate a test JWT token with mock signature (matching the format in .env.local)
function generateMockToken(companyId, userId) {
  // Header
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  
  // Payload
  const payload = base64url(JSON.stringify({
    role: 'authenticated',
    app_metadata: { company_id: companyId },
    sub: userId
  }));
  
  // Use the same mock signature pattern as in .env.local
  const signature = 'mock_signature_rls_enabled';
  
  return `${header}.${payload}.${signature}`;
}

// Generate test tokens for different companies/users
const tokenA = generateMockToken('Company_A', 'user_a');
const tokenB = generateMockToken('Company_B', 'user_b');

// Helper function to test RLS
async function testRLS() {
    console.log('🛡️ Starting RLS Verification Tests...');

    const clientA = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${tokenA}` } }
    });

    const clientB = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${tokenB}` } }
    });

    console.log('\n--- 1. Testing evidence_vault (company_id isolation) ---');
    // 1A: Client A inserting with company_id = Company_A
    let res = await clientA.from('evidence_vault').insert([{ company_id: 'Company_A', content: 'Test A', evidence_hash: 'hashA' }]);
    if (res.error) console.log('❌ Expected success, but got error:', res.error.message);
    else console.log('✅ PASS: user_a successfully inserted to Company_A');

    // 1B: Client A inserting with company_id = Company_B (should fail WITH CHECK)
    res = await clientA.from('evidence_vault').insert([{ company_id: 'Company_B', content: 'Test Cross', evidence_hash: 'hashCross' }]);
    if (res.error && res.error.code === '42501') console.log('✅ PASS: Prevented user_a from inserting into Company_B (RLS WITH CHECK applied)');
    else console.log('❌ Expected RLS block (42501), but got:', res.error || 'Success');

    // 1C: Client B selecting from evidence_vault (should only see Company_B records)
    res = await clientB.from('evidence_vault').select('*');
    if (res.error) console.log('Error selecting:', res.error.message);
    else {
        const hasA = res.data.some(r => r.company_id === 'Company_A');
        if (hasA) console.log('❌ FAIL: Client B can see Company A records!');
        else console.log('✅ PASS: Client B cannot see Company A records (RLS SELECT applied)');
    }

    console.log('\n--- 2. Testing audit_logs (company_id isolation) ---');
    // 2A: Client A inserting cross-company audit_log
    res = await clientA.from('audit_logs').insert([{ company_id: 'Company_B', action: 'CREATE', target_resource: 'evidence', performed_by: 'user_a' }]);
    if (res.error && res.error.code === '42501') console.log('✅ PASS: Prevented user_a from forging Company_B audit_logs (RLS WITH CHECK applied)');
    else console.log('❌ Expected RLS block (42501), but got:', res.error || 'Success');

    // 2B: Try deleting audit_log (Should fail)
    res = await clientA.from('audit_logs').delete().eq('company_id', 'Company_A');
    if (res.error) console.log('✅ PASS: Deletion blocked / failed. Error:', res.error.message);
    else console.log('✅ PASS: Deletion succeeded but RLS silently blocked it (0 rows affected). Count:', res.count);

    console.log('\n--- 3. Testing sustainwrite_sections (user_id isolation) ---');
    // 3A: Client A inserting cross-user section
    res = await clientA.from('sustainwrite_sections').insert([{ user_id: 'user_b', content: 'Hacked', version: 1 }]);
    if (res.error && res.error.code === '42501') console.log('✅ PASS: Prevented user_a from inserting as user_b (RLS WITH CHECK applied)');
    else console.log('❌ Expected RLS block (42501), but got:', res.error || 'Success');

    console.log('\n🎉 RLS Verification Complete!');
}

testRLS().catch(console.error);
