import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const userId = 'default-user';

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({
          theme: data.theme,
          language: data.language,
          sidebarCollapsed: data.sidebar_collapsed,
        });
      }
    }

    return NextResponse.json({
      theme: 'light',
      language: 'zh-TW',
      sidebarCollapsed: false,
    });
  } catch (error) {
    console.error('[API] GET user preferences failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve preferences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { theme, language, sidebarCollapsed } = await request.json();
    const userId = 'default-user';

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('user_preferences').upsert(
        {
          user_id: userId,
          theme: theme || 'light',
          language: language || 'zh-TW',
          sidebar_collapsed: !!sidebarCollapsed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.warn('[Supabase] Preferences upsert failed:', error);
      } else {
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: true, simulated: true });
  } catch (error) {
    console.error('[API] POST user preferences failed:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
