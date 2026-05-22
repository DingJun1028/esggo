import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getAdminClient() {
  const { createClient } = await import('@supabase/supabase-js');
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role credentials not configured');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashToVerify = searchParams.get('hash');
  const evidenceId = searchParams.get('evidenceId');

  if (!hashToVerify && !evidenceId) {
    return NextResponse.json({ success: false, error: 'Provide hash or evidenceId' }, { status: 400 });
  }

  try {
    const supabase = await getAdminClient();

    if (evidenceId) {
      const { data, error } = await supabase
        .from('evidence_vault')
        .select('id, file_name, hash_lock, status, zkp_proof, created_at')
        .eq('id', evidenceId)
        .single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: 'Evidence not found' }, { status: 404 });
      }

      const uniqueName = `evidence:${evidenceId}:seal:5t`;
      let vaultData = null;
      let vaultMatch = false;

      if (serviceRoleKey) {
        const { data: decrypted } = await supabase.rpc('get_decrypted_seal', { p_name: uniqueName });
        if (decrypted) {
          try {
            const parsed = JSON.parse(decrypted);
            vaultMatch = parsed.hashLock === data.hash_lock;
            vaultData = { hashLock: parsed.hashLock, sealType: parsed.sealType };
          } catch {}
        }
      }

      return NextResponse.json({
        success: true,
        evidenceId,
        fileName: data.file_name,
        dbHashLock: data.hash_lock,
        zkpProof: data.zkp_proof,
        status: data.status,
        vaultMatch,
        vaultData,
        verifiedAt: new Date().toISOString(),
      });
    }

    if (hashToVerify) {
      const { data: records, error } = await supabase
        .from('evidence_vault')
        .select('id, file_name, hash_lock, status, zkp_proof, created_at')
        .eq('hash_lock', hashToVerify)
        .limit(5);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        found: (records || []).length > 0,
        count: (records || []).length,
        records: records || [],
        verifiedAt: new Date().toISOString(),
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawData, claimedHash } = body;

    if (!rawData || !claimedHash) {
      return NextResponse.json({ success: false, error: 'Provide rawData and claimedHash' }, { status: 400 });
    }

    const computedHash = createHash('sha256').update(JSON.stringify(rawData)).digest('hex');
    const isValid = computedHash === claimedHash;

    return NextResponse.json({
      success: true,
      isValid,
      computedHash,
      claimedHash,
      message: isValid ? '✅ Hash verified — data integrity confirmed' : '❌ Hash mismatch — data may have been tampered',
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}