import { NextRequest, NextResponse } from 'next/server';

/**
 * Omni_Terminal | Resend Proof API
 * Structures and "sends" a cryptographic 5T proof receipt to a stakeholder.
 * Inspired by Supabase 'send-email-resend' pattern.
 */
export async function POST(req: NextRequest) {
  try {
    const { transactionId, email, metadata } = await req.json();

    if (!transactionId || !email) {
      return NextResponse.json({ error: 'Missing transactionId or email' }, { status: 400 });
    }

    console.log(`[Resend Engine] Dispatching 5T Proof Receipt to ${email}...`);
    console.log(`[Resend Engine] Transaction: ${transactionId} | Hash: ${metadata?.hash || 'N/A'}`);

    // Simulation of the Resend API call
    await new Promise(r => setTimeout(r, 1500));

    return NextResponse.json({
      success: true,
      messageId: `re_${Math.random().toString(36).substr(2, 24)}`,
      sentTo: email,
      timestamp: new Date().toISOString(),
      ok: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
