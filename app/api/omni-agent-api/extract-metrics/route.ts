import { NextResponse } from 'next/server';
import { extractMetricsFromEvidence } from '../../../../lib/omniagent-gateway';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileId } = body;
    if (!fileId) {
      return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
    }
    const result = await extractMetricsFromEvidence(fileId);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[OmniAgent Extract API]', e);
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
  }
}
