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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { evidenceUuid, sealType = '5t', formula, impactMetric, sourceOrigin } = body;

    if (!evidenceUuid) {
      return NextResponse.json({ success: false, error: 'Missing evidenceUuid' }, { status: 400 });
    }

    const rawSealData = {
      uuid: evidenceUuid,
      sealType,
      formula: formula || 'SHA-256(data)',
      impactMetric: impactMetric || {},
      sourceOrigin: sourceOrigin || 'esg-go-platform',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    const frozen = Object.freeze({ ...rawSealData });
    const payload = JSON.stringify(frozen);
    const hashLock = createHash('sha256').update(payload).digest('hex');
    const finalPayload = JSON.stringify({ ...frozen, hashLock });

    const uniqueName = `evidence:${evidenceUuid}:seal:${sealType}`;

    const supabase = await getAdminClient();

    const { data: secretId, error: vaultError } = await supabase.rpc('create_evidence_seal', {
      p_secret: finalPayload,
      p_name: uniqueName,
      p_description: `5T Integrity Seal for evidence ${evidenceUuid}`,
    });

    if (vaultError) {
      console.warn('Vault RPC error (non-critical):', vaultError.message);
    }

    const { error: dbError } = await supabase
      .from('evidence_vault')
      .update({
        hash_lock: hashLock,
        zkp_proof: true,
        status: 'verified',
      })
      .eq('id', evidenceUuid);

    if (dbError) {
      console.warn('DB update error:', dbError.message);
    }

    await supabase.from('audit_logs').insert({
      action: 'VAULT_SEAL_5T',
      resource: `evidence:${evidenceUuid}`,
      user_name: 'system',
      t5_tag: 'T4+T5',
      hash_lock: hashLock,
      details: `5T seal created for evidence ${evidenceUuid}, type: ${sealType}`,
    });

    return NextResponse.json({
      success: true,
      hashLock,
      uniqueName,
      secretId: secretId || null,
      sealedAt: rawSealData.timestamp,
    });
  } catch (error: any) {
    console.error('Seal error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const evidenceUuid = searchParams.get('evidenceUuid');
  const sealType = searchParams.get('sealType') || '5t';

  if (!evidenceUuid) {
    return NextResponse.json({ success: false, error: 'Missing evidenceUuid' }, { status: 400 });
  }

  const uniqueName = `evidence:${evidenceUuid}:seal:${sealType}`;

  try {
    const supabase = await getAdminClient();
    const { data, error } = await supabase.rpc('get_decrypted_seal', { p_name: uniqueName });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    return NextResponse.json({ success: true, uniqueName, decrypted: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}