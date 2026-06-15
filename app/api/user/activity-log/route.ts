import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        return NextResponse.json(data);
      }
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('[API] GET user activity logs failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, details } = await request.json();
    const userId = 'default-user';

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('user_activity_logs').insert({
        user_id: userId,
        action,
        details: details || {},
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('[Supabase] Telemetry logging failed:', error);
      } else {
        return NextResponse.json({ success: true });
      }
    }

    console.log(`[Simulation Telemetry] Logged action: ${action}`, details);
    return NextResponse.json({ success: true, simulated: true });
  } catch (error) {
    console.error('[API] POST user activity log failed:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}
