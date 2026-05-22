import { NextRequest, NextResponse } from 'next/server';
import { readFromVault, verifyRecord } from '@/lib/vault-omni';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const uuid = searchParams.get('uuid');

  if (!uuid) {
    return NextResponse.json({ success: false, error: 'Missing uuid' }, { status: 400 });
  }

  const record = await readFromVault(uuid);

  if (!record) {
    return NextResponse.json({
      success: true,
      data: { uuid, valid: false, status: 'NOT_FOUND', detail: '查無此 UUID 的聖碑記錄' },
    });
  }

  const result = verifyRecord(record);

  // Log audit
  const supabase = getServiceClient();
  if (supabase) {
    await supabase.from('audit_logs').insert({
      action: 'VAULT_OMNI_VERIFY',
      resource: `vault_omni_core:${uuid}`,
      user_name: 'verifier',
      t5_tag: 'T2+T5',
      hash_lock: record.hash_lock,
      details: result.detail,
    }).maybeSingle();
  }

  return NextResponse.json({
    success: true,
    data: {
      uuid,
      valid: result.valid,
      status: result.valid ? 'TRUSTWORTHY' : 'TAMPERED',
      detail: result.detail,
      computedHash: result.computedHash,
      storedHash: result.storedHash,
      dimension: record.dimension,
      timestamp: record.timestamp,
      verifiedAt: new Date().toISOString(),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { hashInput } = await request.json();
    if (!hashInput) return NextResponse.json({ success: false, error: 'Missing hashInput' }, { status: 400 });

    const computed = createHash('sha256').update(
      typeof hashInput === 'string' ? hashInput : JSON.stringify(hashInput)
    ).digest('hex');

    return NextResponse.json({ success: true, data: { computed, algorithm: 'SHA-256' } });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}