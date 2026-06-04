import { NextRequest, NextResponse } from 'next/server';
/**
 * POST /api/vault-omni/engrave
 * 聖碑刻印：執行 5T 封印並寫入 Single Table。
 */
export declare function POST(request: NextRequest): Promise<NextResponse<{
    success: boolean;
    error: string;
}> | NextResponse<{
    success: boolean;
    data: {
        uuid: string;
        hash_lock: string;
        dimension: string;
        timestamp: number;
        version: string;
        verification: {
            is_valid: boolean;
            method: string;
        };
        vault_result: {
            success: boolean;
            id?: string;
            error?: string;
        };
    };
}>>;
//# sourceMappingURL=route.d.ts.map