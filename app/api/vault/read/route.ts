// app/api/vault/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { ApiResponse } from '@/src/shared/types';
import { randomUUID } from 'crypto';

/**
 * GET /api/vault/read?uuid=xxx
 * 讀取指定證據 (Traceable)
 */
export async function GET(request: NextRequest) {
  const requestId = randomUUID();
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get('uuid');

  try {
    if (!uuid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: { code: 'MISSING_PARAMETER', message: '缺少參數：uuid' },
        meta: { timestamp: Date.now(), requestId },
      }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: rawData, error } = await supabase
      .from('evidence_vault' as any)
      .select('*')
      .eq('uuid', uuid)
      .single();

    const data = rawData as any;
    if (error || !data) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: { code: 'NOT_FOUND', message: '證據不存在' },
        meta: { timestamp: Date.now(), requestId },
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        uuid: data.uuid,
        timestamp: data.timestamp,
        formula: data.formula,
        impactMetric: data.impact_metric,
        hashLock: data.hash_lock,
        sourceOrigin: data.source_origin,
        lifecycleStage: data.lifecycle_stage,
        metadata: data.metadata,
        createdAt: data.created_at,
      },
      meta: { timestamp: Date.now(), requestId },
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message || '讀取失敗' },
      meta: { timestamp: Date.now(), requestId },
    }, { status: 500 });
  }
}
