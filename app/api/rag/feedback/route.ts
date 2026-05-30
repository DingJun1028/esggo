import { NextResponse } from 'next/server';
import { ExternalSyncService } from '@/lib/services/external-sync-service';
import { buildComponent, engraveToSingleTable } from '@/lib/vault-omni';

export async function POST(request: Request) {
    try {
        const { messageId, query, answer, feedback } = await request.json();

        // 1. 寫入內部 Omni Vault (Supabase) 作為 Audit Trail
        try {
            const component = buildComponent({
                sourceOrigin: 'EvolutionLoop-Feedback',
                evidenceData: { query, answer, feedback, messageId },
                impactMetric: 'Feedback Log',
                formula: 'Feedback',
            });
            await engraveToSingleTable(component);
        } catch (dbErr) {
            console.warn('[Feedback API] Omni Vault 寫入失敗', dbErr);
        }

        // 2. 同步至外部系統 (AITable.ai & BlueCC) 觸發萬能進化環
        const syncService = ExternalSyncService.getInstance();
        await syncService.triggerEvolutionSync({
            type: 'feedback',
            data: { messageId, query, answer, feedback, timestamp: new Date().toISOString() }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Feedback API] 錯誤:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
