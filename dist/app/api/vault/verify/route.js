// app/api/vault/verify/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '../../../../lib/supabase/server';
import { createSuccessResponse, createErrorResponse } from '@/src/shared/types';
import { randomUUID, createHash } from 'crypto';
/**
 * POST /api/vault/verify
 * 驗證證據的 Hash Lock 完整性 (Trustworthy)
 */
export async function POST(request) {
    const requestId = randomUUID();
    try {
        const body = await request.json();
        const { uuid } = body;
        if (!uuid) {
            return NextResponse.json(createErrorResponse('MISSING_PARAMETER', '缺少參數：uuid'), { status: 400 });
        }
        const supabase = await createServerClient();
        const { data: rawData, error } = await supabase
            .from('evidence_vault')
            .select('*')
            .eq('uuid', uuid)
            .single();
        const data = rawData;
        if (error || !data) {
            return NextResponse.json(createErrorResponse('NOT_FOUND', '證據不存在'), { status: 404 });
        }
        const dataToHash = {
            formula: data.formula,
            impact_metric: data.impact_metric,
            source_origin: data.source_origin,
            timestamp: data.timestamp
        };
        const computedHash = createHash('sha256')
            .update(JSON.stringify(dataToHash))
            .digest('hex');
        const isValid = computedHash === data.hash_lock;
        return NextResponse.json(createSuccessResponse({
            uuid: data.uuid,
            isValid,
            storedHash: data.hash_lock,
            computedHash,
            verifiedAt: new Date().toISOString(),
            message: isValid ? '驗證通過' : '數據已被篡改！',
        }, { request_id: requestId }));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : '驗證過程中發生未知的伺服器內部錯誤';
        return NextResponse.json(createErrorResponse('VERIFICATION_FAILED', errorMessage), { status: 500 });
    }
}
//# sourceMappingURL=route.js.map