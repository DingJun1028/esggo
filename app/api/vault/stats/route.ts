import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/src/shared/types';
import { randomUUID } from 'crypto';
import type { Database } from '@/types/supabase';

type EvidenceVault = Database['public']['Tables']['evidence_vault']['Row'];

export async function GET(request: NextRequest) {
  const requestId = randomUUID();

  try {
    const supabase = await createServerClient<Database>();

    const { count: totalCount, error: totalError } = await supabase
      .from('evidence_vault')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    const { data: lifecycleData, error: lifecycleError } = await supabase
      .from('evidence_vault')
      .select('lifecycle_stage');

    if (lifecycleError) throw lifecycleError;

    const lifecycleStats = (lifecycleData as EvidenceVault[] | null)?.reduce((acc, item) => {
      const stage = item.lifecycle_stage || 'unknown';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const { data: sourceData, error: sourceError } = await supabase
      .from('evidence_vault')
      .select('source_origin');

    if (sourceError) throw sourceError;

    const sourceStats = (sourceData as EvidenceVault[] | null)?.reduce((acc, item) => {
      const origin = item.source_origin || 'unknown';
      acc[origin] = (acc[origin] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const { count: recentCount, error: recentError } = await supabase
      .from('evidence_vault')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(oneDayAgo).toISOString());

    if (recentError) throw recentError;

    return NextResponse.json<ApiResponse>(
      createSuccessResponse(
        {
          total: totalCount || 0,
          recentAdded: recentCount || 0,
          byLifecycleStage: lifecycleStats || {},
          bySourceOrigin: sourceStats || {},
        },
        { request_id: requestId }
      )
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '統計失敗';
    return NextResponse.json<ApiResponse>(createErrorResponse('INTERNAL_ERROR', message), {
      status: 500,
    });
  }
}
