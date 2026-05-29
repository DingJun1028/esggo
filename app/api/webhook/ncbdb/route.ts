import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { omniCore } from '@/lib/omni-core';
import { omniAgentBus } from '@/lib/agents/omni-commander';

/**
 * NCBDB Webhook Receiver - 5T Integrity Sensor
 * 負責監聽來自 NCBDB 的手動數據變更，並觸發「萬能修復」與 T5 審計追蹤。
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Webhook Secret (T5 Trackable Security)
    const signature = req.headers.get('x-ncb-signature');
    const secret = process.env.NCBDB_WEBHOOK_SECRET;

    if (!secret || !signature) {
      console.warn('[Webhook Sensor] Missing signature or secret.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payloadString = await req.text();
    const expectedSignature = createHash('sha256').update(`${payloadString}${secret}`).digest('hex');
    
    const isVerified = timingSafeEqual(
      new Uint8Array(Buffer.from(signature)),
      new Uint8Array(Buffer.from(expectedSignature))
    );

    if (!isVerified) {
      console.warn('[Webhook Sensor] Invalid signature detected.');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse Payload
    const payload = JSON.parse(payloadString);
    const { action, table, record, oldRecord } = payload;
    
    console.log(`[Webhook Sensor] 📡 Detected ${action} on table ${table}. Record ID: ${record?.id}`);

    // 3. Initiate Causality Trace & Omni Restoration
    if (action === 'update' || action === 'insert') {
      omniAgentBus.publish('WEBHOOK_RECEIVED', { source: 'NCBDB', action, table, recordId: record?.id });
      
      console.log(`[Webhook Sensor] ⚠️ External data modification detected. Activating Omni Restoration passive talent...`);
      
      // Construct restoration input based on 'Cause-Process-Effect' (觀因循果)
      const faultyData = {
        metric: record.impact_metric || record.value || 'External_Modification',
        source: `NCBDB_Webhook_${action}`,
        formula: record.formula || 'Manual Edit',
        trigger: 'NCBDB_User_Interface',
        rawPayload: record,
        previousState: oldRecord
      };

      // Trigger the Omni Restoration to purify and re-seal the data
      const crystal = await omniCore.restoreComponent(faultyData);
      
      console.log(`[Webhook Sensor] ✅ Data successfully restored and sealed. New HashLock: ${crystal.hash_lock}`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook processed and data restored via Omni Restoration.',
        crystal_uuid: crystal.uuid
      });
    }

    return NextResponse.json({ success: true, message: 'Event ignored.' });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Webhook Sensor] ❌ Error processing webhook:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
