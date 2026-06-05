import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing record id' }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Fetch record
    const { data: record, error: fetchError } = await supabase
      .from('esg_records')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    if (record.zkp_hash) {
      return NextResponse.json({ error: 'Already sealed' }, { status: 400 });
    }

    // 2. Generate zkp_hash (simulate ZKP complexity with a salt and timestamp)
    const payload = JSON.stringify({
      id: record.id,
      category: record.category,
      metric_value: record.metric_value,
      timestamp: record.timestamp,
    });
    
    // Simulate PoW or ZKP computation delay
    await new Promise(r => setTimeout(r, 800));

    const hash = createHash('sha256').update(`zkp-seal-${payload}-${Date.now()}`).digest('hex');

    // 3. Update record with the seal
    const { error: updateError } = await supabase
      .from('esg_records')
      .update({ zkp_hash: hash })
      .eq('id', id);

    if (updateError) throw updateError;

    // 4. Create an Immutable Audit Log (5T Integrity: Trust & Trackable)
    await supabase.from('audit_logs').insert([{
      record_id: id,
      action: 'SEAL',
      actor_id: record.org_id || null, // Will be set to the user in a real system
      hash_signature: hash,
    }]);

    return NextResponse.json({ success: true, hash, message: 'ZKP Hash sealed successfully' });
  } catch (err: any) {
    console.error('[ZKP Seal] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
