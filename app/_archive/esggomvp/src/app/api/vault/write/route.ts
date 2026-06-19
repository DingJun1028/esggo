// frontend/src/app/api/vault/write/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UCCEngine } from '@/lib/ucc-engine';
import { EvidenceInput, ApiResponse } from '@/types/evidence';
// import { randomUUID } from 'crypto'; // Removed for browser compatibility

export async function POST(request: NextRequest) {
    const requestId = `req-${Math.random().toString(36).slice(2, 11)}`;

    try {
        // 1. Parse body
        const body: EvidenceInput = await request.json();

        // 2. Validation
        if (!body.formula || !body.impactMetric || !body.sourceOrigin) {
            return NextResponse.json<ApiResponse>({
                success: false,
                error: {
                    code: 'INVALID_INPUT',
                    message: 'Missing required fields: formula, impactMetric, sourceOrigin',
                },
                meta: { timestamp: Date.now(), requestId },
            }, { status: 400 });
        }

        // 3. UCC Engine Seal
        const engine = new UCCEngine();
        const evidence = await engine.sealEvidence(body);

        return NextResponse.json<ApiResponse>({
            success: true,
            data: evidence,
            meta: { timestamp: Date.now(), requestId },
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json<ApiResponse>({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error.message || 'Write failed',
            },
            meta: { timestamp: Date.now(), requestId },
        }, { status: 500 });
    }
}
