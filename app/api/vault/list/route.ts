import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function getAdminClient() {
  const { createClient } = await import('@supabase/supabase-js');
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const gri = searchParams.get('gri');

  try {
    const supabase = await getAdminClient();

    let query = supabase
      .from('evidence_vault')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);
    if (gri) query = query.ilike('gri_reference', `%${gri}%`);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [], count: (data || []).length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file_name, file_type, category, gri_reference, uploader, source_url } = body;

    if (!file_name) {
      return NextResponse.json({ success: false, error: 'file_name is required' }, { status: 400 });
    }

    const supabase = await getAdminClient();

    const hashInput = `${file_name}-${gri_reference || ''}-${Date.now()}`;
    const hash_lock = createHash('sha256').update(hashInput).digest('hex');

    const { data, error } = await supabase
      .from('evidence_vault')
      .insert({
        file_name,
        file_type: file_type || 'PDF',
        category: category || 'General',
        gri_reference: gri_reference || '',
        uploader: uploader || 'system',
        source_url: source_url || '',
        status: 'pending',
        zkp_proof: false,
        hash_lock,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await supabase.from('audit_logs').insert({
      action: 'EVIDENCE_UPLOAD',
      resource: `evidence:${data.id}`,
      user_name: uploader || 'system',
      t5_tag: 'T1+T2',
      hash_lock,
      details: `New evidence uploaded: ${file_name}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}