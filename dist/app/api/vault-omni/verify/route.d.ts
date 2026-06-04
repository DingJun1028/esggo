import { NextRequest, NextResponse } from 'next/server';
/**
 * GET /api/vault-omni/verify?uuid=xxx
 * 聖碑校驗：驗證指定紀錄的雜湊完整性。
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    data: {
        uuid: string;
        is_valid: boolean;
        status: string;
        timestamp: number;
        version: string;
        hash_lock: string;
        verified_at: string;
    };
}>>;
//# sourceMappingURL=route.d.ts.map