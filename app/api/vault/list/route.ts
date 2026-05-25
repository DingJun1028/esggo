// app/api/vault/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { ApiResponse } from '../../../../types/evidence';
import { randomUUID } from 'crypto';

/**
 * GET /api/vault/list
 * 查詢證據列表 (Traceable)
 */
export async function GET(request: NextRequest) {
  const requestId = randomUUID();
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const lifecycleStage = searchParams.get('lifecycleStage');
  const sourceOrigin = searchParams.get('sourceOrigin');

  try {
    const supabase = await createServerClient();
    
    let query = supabase
      .from('evidence_vault' as any)
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (lifecycleStage) query = query.eq('lifecycle_stage', lifecycleStage);
    if (sourceOrigin) query = query.eq('source_origin', sourceOrigin);

    const { data, error, count } = await query;
    if (error) throw new Error(`查詢失敗：${error.message}`);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: (data as any[])?.map((item: any) => ({
        uuid: item.uuid,
        timestamp: item.timestamp,
        formula: item.formula,
        impactMetric: item.impact_metric,
        sourceOrigin: item.source_origin,
        lifecycleStage: item.lifecycle_stage,
        createdAt: item.created_at,
      })),
      meta: {
        timestamp: Date.now(),
        requestId,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        } as any,
      } as any,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message || '查詢失敗' },
      meta: { timestamp: Date.now(), requestId },
    }, { status: 500 });
  }
}
