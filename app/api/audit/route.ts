import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { error } = await supabase.from('audit_logs').insert([{
      ...body,
      company_id: body.company_id || 'default',
      created_at: new Date().toISOString()
    }]);

    if (error) throw error;

    console.log('[5T Audit] Log saved:', JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[5T Audit] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ ok: true, logs: data || [] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, logs: [] });
  }
}