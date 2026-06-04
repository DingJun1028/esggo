import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { HealingGuardian } from '@/lib/healing-guardian';
/**
 * 📡 NCBDB 誠信感測器 Webhook (NCBDB Integrity Sensor)
 * v3.0 | #OmniCore #HealingGuardian
 */
export async function POST(req) {
    try {
        // 1. Verify Webhook Secret (T5 Trackable Security)
        const signature = req.headers.get('x-ncb-signature');
        const secret = process.env.NCBDB_WEBHOOK_SECRET;
        if (secret && signature) {
            const payloadString = await req.text();
            const expectedSignature = createHash('sha256').update(`${payloadString}${secret}`).digest('hex');
            const isVerified = timingSafeEqual(new Uint8Array(Buffer.from(signature)), new Uint8Array(Buffer.from(expectedSignature)));
            if (!isVerified) {
                console.warn('[Webhook Sensor] Invalid signature detected.');
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            const payload = JSON.parse(payloadString);
            await HealingGuardian.evaluateSensorPayload(payload);
        }
        else {
            // In development mode or if secret not set, allow but warn
            const payload = await req.json();
            console.log('[NCBDB Webhook] Processing without full signature verification...');
            await HealingGuardian.evaluateSensorPayload(payload);
        }
        return NextResponse.json({
            status: 'success',
            message: 'HealingGuardian evaluating.',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('[NCBDB Webhook] Error processing payload:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map