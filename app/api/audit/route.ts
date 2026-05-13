import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getAdmin() {
  return createClient(supabaseUrl || '', serviceRoleKey || '', {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  try {
    const admin = getAdmin();
    const { data, error } = await admin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const admin = getAdmin();

    let hash = '';
    try {
      const msgBuffer = new TextEncoder().encode(JSON.stringify(body) + Date.now());
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      hash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .substring(0, 16)
        .toUpperCase();
    } catch {
      hash = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    const { data, error } = await admin.from('audit_logs').insert({
      action: body.action,
      actor: body.actor || 'system',
      target_table: body.target_table,
      target_id: body.target_id,
      old_value: body.old_value,
      new_value: body.new_value,
      gri_reference: body.gri_reference,
      protocol_dimension: body.protocol_dimension || 'T1_Traceable',
      hash_lock: hash,
      created_at: new Date().toISOString(),
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}