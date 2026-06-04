import { NextResponse } from 'next/server';
import { scanEvidenceWithVision } from '@/lib/omni-gateway';
import { createSuccessResponse, createErrorResponse } from '@/src/shared/types';
export async function POST(req) {
    try {
        const { fileId, fileType } = await req.json();
        if (!fileId) {
            return NextResponse.json(createErrorResponse('MISSING_FILE_ID', 'Missing fileId for vision scanning'), { status: 400 });
        }
        const result = await scanEvidenceWithVision(fileId, fileType || 'image/jpeg');
        return NextResponse.json(createSuccessResponse(result));
    }
    catch (error) {
        return NextResponse.json(createErrorResponse('VISION_FAILED', error.message || 'OmniAgent Vision scanning failed'), { status: 500 });
    }
}
//# sourceMappingURL=route.js.map