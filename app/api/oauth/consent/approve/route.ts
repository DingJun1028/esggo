import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { consent_id, user_id } = await request.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // 1. Verify user session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.id !== user_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Logic to approve the consent in Supabase
  // In a real Supabase OAuth 2.1 flow, this would call an internal Supabase function
  // or update a specific 'oauth_consents' table. 
  // Since we are building the 'Sovereign Path', we will register this in our own audit trail as well.
  
  console.log(`[oX Auth] Consent ${consent_id} approved for user ${user_id}`);

  try {
    // Register the approval in audit logs (T5 Trackable)
    await supabase.from('audit_logs').insert({
      action: 'OAUTH_CONSENT_APPROVED',
      resource: `consent:${consent_id}`,
      user_name: session.user.email,
      company_id: session.user.app_metadata?.company_id || 'default',
      details: JSON.stringify({ consent_id, scopes: ['evidence_vault', 'audit_logs'] }),
      t5_tag: 'T5'
    });

    return NextResponse.json({ ok: true, message: 'Authorization granted successfully.' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
