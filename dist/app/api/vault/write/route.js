// app/api/vault/write/route.ts
import { NextResponse } from 'next/server';
import { UCCEngine } from '../../../../lib/ucc-engine';
import { getAuthenticatedUser, createServerClient } from '../../../../lib/supabase/server';
import { createSuccessResponse, createErrorResponse } from '@/src/shared/types';
import { randomUUID } from 'crypto';
/**
 * POST /api/vault/write
 * 寫入證據到永恆宮殿 (Evidence Vault)
 */
export async function POST(request) {
    const requestId = randomUUID();
    try {
        const user = await getAuthenticatedUser();
        const body = await request.json();
        if (!body.formula || !body.impactMetric || !body.sourceOrigin) {
            return NextResponse.json(createErrorResponse('INVALID_INPUT', '缺少必要欄位：formula, impactMetric, sourceOrigin'), { status: 400 });
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
        return NextResponse.json(createSuccessResponse(evidence), { status: 201 });
    }
    catch (error) {
        return NextResponse.json(createErrorResponse('INTERNAL_ERROR', error.message || '寫入失敗'), { status: 500 });
    }
}
async function logAudit(params) {
    const supabase = await createServerClient();
    await supabase.from('audit_trail').insert({
        action: params.action,
        table_name: params.tableName,
        record_id: params.recordId,
        user_id: params.userId,
        new_data: params.newData,
    });
}
//# sourceMappingURL=route.js.map