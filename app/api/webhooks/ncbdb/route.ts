import { NextResponse } from 'next/server';
import { HealingGuardian } from '@/lib/healing-guardian';

/**
 * 📡 NCBDB 誠信感測器 Webhook (NCBDB Integrity Sensor)
 * Listens for external data modifications and triggers the HealingGuardian.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Log the intercepted modification
    console.log('[NCBDB Webhook] Intercepted data modification event:', payload);

    // Trigger the Healing Engine
    await HealingGuardian.evaluateSensorPayload(payload);

    return NextResponse.json({
      status: 'success',
      message: 'Webhook received. HealingGuardian evaluating.',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[NCBDB Webhook] Error processing payload:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
