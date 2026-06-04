// app/api/vault/stats/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { createSuccessResponse, createErrorResponse } from '@/src/shared/types';
import { randomUUID } from 'crypto';
/**
 * GET /api/vault/stats
 * 獲取證據庫統計資訊 (Transparent)
 */
export async function GET(request) {
    const requestId = randomUUID();
    try {
        const supabase = await createServerClient();
        const { count: totalCount, error: totalError } = await supabase
            .from('evidence_vault')
            .select('*', { count: 'exact', head: true });
        if (totalError)
            throw totalError;
        const { data: lifecycleData, error: lifecycleError } = await supabase
            .from('evidence_vault')
            .select('lifecycle_stage');
        if (lifecycleError)
            throw lifecycleError;
        const lifecycleStats = lifecycleData?.reduce((acc, item) => {
            const stage = item.lifecycle_stage || 'unknown';
            acc[stage] = (acc[stage] || 0) + 1;
            return acc;
        }, {});
        const { data: sourceData, error: sourceError } = await supabase
            .from('evidence_vault')
            .select('source_origin');
        if (sourceError)
            throw sourceError;
        const sourceStats = sourceData?.reduce((acc, item) => {
            const origin = item.source_origin || 'unknown';
            acc[origin] = (acc[origin] || 0) + 1;
            return acc;
        }, {});
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const { count: recentCount, error: recentError } = await supabase
            .from('evidence_vault')
            .select('*', { count: 'exact', head: true })
            .gte('timestamp', oneDayAgo);
        if (recentError)
            throw recentError;
        return NextResponse.json(createSuccessResponse({
            total: totalCount || 0,
            recentAdded: recentCount || 0,
            byLifecycleStage: lifecycleStats || {},
            bySourceOrigin: sourceStats || {},
        }, { request_id: requestId }));
    }
    catch (error) {
        return NextResponse.json(createErrorResponse('INTERNAL_ERROR', error.message || '統計失敗'), { status: 500 });
    }
}
//# sourceMappingURL=route.js.map