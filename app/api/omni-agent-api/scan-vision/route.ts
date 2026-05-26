import { NextRequest, NextResponse } from 'next/server';
import { scanEvidenceWithVision } from '../../../../lib/omniagent-gateway';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, fileType } = body;
    if (!fileId || !fileType) {
      return NextResponse.json({ error: 'fileId and fileType are required' }, { status: 400 });
    }
    const result = await scanEvidenceWithVision(fileId, fileType);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[OmniAgent Vision API]', e);
    return NextResponse.json({ error: 'Vision scan failed' }, { status: 500 });
  }
}
