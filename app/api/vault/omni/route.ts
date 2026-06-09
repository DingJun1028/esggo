import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Database credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // Invoke the list_vault_omni function from the schema
    const { data, error } = await supabase.rpc('list_vault_omni', {
      p_limit: limit
    });

    if (error) throw error;

    return NextResponse.json({ success: true, records: data });
  } catch (error: any) {
    console.error('[Omni Vault List API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
