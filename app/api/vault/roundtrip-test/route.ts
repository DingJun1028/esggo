import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(request: NextRequest) {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    steps: [],
  };

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing SUPABASE_SERVICE_ROLE_KEY in environment',
      hint: 'Add SUPABASE_SERVICE_ROLE_KEY to your .env file',
    }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const testName = `test_evidence_seal_${Date.now()}`;
  const testSecret = JSON.stringify({
    test: true,
    timestamp: new Date().toISOString(),
    hashLock: createHash('sha256').update('test-payload').digest('hex'),
  });

  // Step 1: Write to vault
  try {
    const { data, error } = await supabase.rpc('create_evidence_seal', {
      p_secret: testSecret,
      p_name: testName,
      p_description: 'Round-trip test seal',
    });

    results.steps.push({
      step: 1,
      name: 'create_evidence_seal',
      success: !error,
      secretId: data,
      error: error?.message || null,
    });
  } catch (e: any) {
    results.steps.push({ step: 1, name: 'create_evidence_seal', success: false, error: e.message });
  }

  // Step 2: Read back
  try {
    const { data, error } = await supabase.rpc('get_decrypted_seal', {
      p_name: testName,
    });

    const matches = data === testSecret;
    results.steps.push({
      step: 2,
      name: 'get_decrypted_seal',
      success: !error && matches,
      roundTripMatch: matches,
      error: error?.message || null,
    });
  } catch (e: any) {
    results.steps.push({ step: 2, name: 'get_decrypted_seal', success: false, error: e.message });
  }

  const allPassed = results.steps.every((s: any) => s.success);

  return NextResponse.json({
    ...results,
    overallSuccess: allPassed,
    clientRole: 'service_role',
    message: allPassed
      ? '✅ 5T Vault round-trip test PASSED — service_role can write and read encrypted secrets'
      : '⚠️ Some steps failed — check steps array for details',
  });
}