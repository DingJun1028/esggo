import { NextResponse } from 'next/server';
import { readFromVault, verifyRecord } from '@/lib/vault-omni';
/**
 * GET /api/vault-omni/verify?uuid=xxx
 * 聖碑校驗：驗證指定紀錄的雜湊完整性。
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const uuid = searchParams.get('uuid');
        if (!uuid) {
            return NextResponse.json({ success: false, error: 'Missing uuid' }, { status: 400 });
        }
        // 1. 從聖碑讀取原始心核
        const component = await readFromVault(uuid);
        if (!component) {
            return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
        }
        // 2. 執行誠信校驗 (T4)
        const isValid = await verifyRecord(uuid);
        return NextResponse.json({
            success: true,
            data: {
                uuid,
                is_valid: isValid,
                status: isValid ? 'TRUSTWORTHY' : 'TAMPERED',
                timestamp: component.timestamp,
                version: component.version,
                hash_lock: component.hash_lock,
                verified_at: new Date().toISOString()
            },
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map