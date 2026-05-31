import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';

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

    const { error: vaultError } = await supabase.from('vault_omni_core').insert({
      uuid: evidenceUuid,
      dimension: sealType,
      hash_lock: finalPayload
    });

    if (vaultError) {
      console.warn('Vault insert error:', vaultError.message);
    }

    let targetTable = 'evidence_vault';
    let updatePayload: unknown = { hash_lock: hashLock, zkp_proof: true, status: 'verified' };

    if (sourceOrigin === 'environmental-module') {
      targetTable = 'environmental_data';
      updatePayload = { hash_lock: hashLock, verified: true };
    } else if (sourceOrigin === 'social-module') {
      targetTable = 'social_metrics';
      updatePayload = { hash_lock: hashLock, verified: true };
    } else if (sourceOrigin === 'governance-module') {
      targetTable = 'governance_metrics';
      updatePayload = { hash_lock: hashLock, verified: true };
    }

    const { error: dbError } = await supabase
      .from(targetTable)
      .update(updatePayload)
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

    // Fire T5 Lifecycle Event via OmniAgentBus
    omniAgentBus.publish('vault:seal:5t', {
      evidenceUuid,
      sealType,
      hashLock,
      sourceOrigin,
      timestamp: rawSealData.timestamp
    }).catch(console.warn);

    return NextResponse.json({
      success: true,
      hashLock,
      uniqueName,
      secretId: uniqueName,
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
    const { data, error } = await supabase
       .from('vault_omni_core')
       .select('hash_lock')
       .eq('uuid', evidenceUuid)
       .eq('dimension', sealType)
       .order('created_at', { ascending: false })
       .limit(1)
       .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    return NextResponse.json({ success: true, uniqueName, decrypted: data.hash_lock });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}