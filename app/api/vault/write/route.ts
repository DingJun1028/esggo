// app/api/vault/write/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UCCEngine } from '../../../../lib/ucc-engine';
import { getAuthenticatedUser, createServerClient } from '../../../../lib/supabase/server';
import { EvidenceInput, ApiResponse } from '@/src/shared/types';
import { randomUUID } from 'crypto';

/**
 * POST /api/vault/write
 * 寫入證據到永恆宮殿 (Evidence Vault)
 */
export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  try {
    const user = await getAuthenticatedUser();
    const body: EvidenceInput = await request.json();

    if (!body.formula || !body.impactMetric || !body.sourceOrigin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '缺少必要欄位：formula, impactMetric, sourceOrigin',
        },
        meta: {
          timestamp: Date.now(),
          requestId,
        },
      }, { status: 400 });
    }

    const engine = new UCCEngine();
    const evidence = await engine.sealEvidence({
      formula: body.formula,
      impactMetric: body.impactMetric,
      sourceOrigin: body.sourceOrigin,
      lifecycleStage: body.lifecycleStage || 'draft',
      metadata: {
        ...body.metadata,
        createdBy: user.id,
        createdByEmail: user.email,
      },
    });

    await logAudit({
      action: 'CREATE',
      tableName: 'evidence_vault',
      recordId: evidence.core.uuid,
      userId: user.id,
      newData: evidence,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: evidence,
      meta: {
        timestamp: Date.now(),
        requestId,
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '寫入失敗',
      },
      meta: {
        timestamp: Date.now(),
        requestId,
      },
    }, { status: 500 });
  }
}

async function logAudit(params: {
  action: string;
  tableName: string;
  recordId: string;
  userId: string;
  newData?: any;
}) {
  const supabase = await createServerClient();
  await supabase.from('audit_trail' as any).insert({
    action: params.action,
    table_name: params.tableName,
    record_id: params.recordId,
    user_id: params.userId,
    new_data: params.newData,
  } as any);
}
