import { NextResponse } from 'next/server';
import { extractMetricsFromEvidence } from '@/lib/omni-gateway';
import { createSuccessResponse, createErrorResponse } from '@/src/shared/types';
export async function POST(req) {
    try {
        const { fileId } = await req.json();
        if (!fileId) {
            return NextResponse.json(createErrorResponse('MISSING_FILE_ID', 'Missing fileId for metric extraction'), { status: 400 });
        }
        const result = await extractMetricsFromEvidence(fileId);
        return NextResponse.json(createSuccessResponse(result));
    }
    catch (error) {
        return NextResponse.json(createErrorResponse('ALCHEMY_FAILED', error.message || 'OmniAgent Alchemy extraction failed'), { status: 500 });
    }
}
//# sourceMappingURL=route.js.map