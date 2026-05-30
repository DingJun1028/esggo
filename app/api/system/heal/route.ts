import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { companyId = 'default' } = await req.json();
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Database credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Invoke the execute_autonomous_healing function from the schema
    const { data, error } = await supabase.rpc('execute_autonomous_healing', {
      p_company_id: companyId
    });

    if (error) throw error;

    return NextResponse.json({ success: true, result: data });
  } catch (error: unknown) {
    console.error('[Omni Healing API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
