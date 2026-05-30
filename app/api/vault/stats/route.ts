// app/api/vault/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/src/shared/types';
import { randomUUID } from 'crypto';

/**
 * GET /api/vault/stats
 * 獲取證據庫統計資訊 (Transparent)
 */
export async function GET(request: NextRequest) {
  const requestId = randomUUID();

  try {
    const supabase = await createServerClient();

    const { count: totalCount, error: totalError } = await supabase
      .from('evidence_vault' as any)
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    const { data: lifecycleData, error: lifecycleError } = await supabase
      .from('evidence_vault' as any)
      .select('lifecycle_stage');

    if (lifecycleError) throw lifecycleError;

    const lifecycleStats = (lifecycleData as unknown[])?.reduce((acc, item: unknown) => {
      acc[item.lifecycle_stage] = (acc[item.lifecycle_stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const { data: sourceData, error: sourceError } = await supabase
      .from('evidence_vault' as any)
      .select('source_origin');

    if (sourceError) throw sourceError;

    const sourceStats = (sourceData as unknown[])?.reduce((acc, item: unknown) => {
      acc[item.source_origin] = (acc[item.source_origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const { count: recentCount, error: recentError } = await supabase
      .from('evidence_vault' as any)
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', oneDayAgo);

    if (recentError) throw recentError;

    return NextResponse.json<ApiResponse>(createSuccessResponse(
      {
        total: totalCount || 0,
        recentAdded: recentCount || 0,
        byLifecycleStage: lifecycleStats || {},
        bySourceOrigin: sourceStats || {},
      },
      { request_id: requestId }
    ));
  } catch (error: unknown) {
    return NextResponse.json<ApiResponse>(
      createErrorResponse('INTERNAL_ERROR', error.message || '統計失敗'),
      { status: 500 }
    );
  }
}
