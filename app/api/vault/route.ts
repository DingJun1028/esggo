import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('evidence_vault' as any)
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching vault records:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
