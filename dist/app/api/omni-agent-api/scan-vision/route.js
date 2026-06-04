import { NextResponse } from 'next/server';
import { scanEvidenceWithVision } from '../../../../lib/omni-gateway';
export async function POST(request) {
    try {
        const body = await request.json();
        const { fileId, fileType } = body;
        if (!fileId || !fileType) {
            return NextResponse.json({ error: 'fileId and fileType are required' }, { status: 400 });
        }
        const result = await scanEvidenceWithVision(fileId, fileType);
        return NextResponse.json(result);
    }
    catch (e) {
        console.error('[OmniAgent Vision API]', e);
        return NextResponse.json({ error: 'Vision scan failed' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map