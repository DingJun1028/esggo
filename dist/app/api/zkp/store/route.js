import { NextResponse } from 'next/server';
import { omniCore } from '@/lib/omni-core';
export async function POST(request) {
    try {
        const body = await request.json();
        const { proof, metricName } = body;
        if (!proof || !metricName) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }
        const auditRecord = await omniCore.storeZKPProof(proof, metricName);
        return NextResponse.json({
            success: true,
            data: auditRecord,
            message: 'ZKP Proof securely anchored to Data Connect Audit Log.'
        });
    }
    catch (error) {
        console.error('[ZKP API] Failed to store proof:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map