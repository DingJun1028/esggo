import { NextRequest, NextResponse } from 'next/server';
import {
  connectDataSource,
  syncDataSource,
  processOCRDocument,
  applyDataToTemplates,
} from '@/lib/esg/data-integrator';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sourceId = searchParams.get('sourceId');

  if (sourceId) {
    const result = await syncDataSource(sourceId);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: 'Missing sourceId parameter' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, config, sourceId, griCode, data } = body;

  if (action === 'connect') {
    const id = await connectDataSource(config);
    return NextResponse.json({ sourceId: id });
  }

  if (action === 'sync' && sourceId) {
    const result = await syncDataSource(sourceId);
    return NextResponse.json(result);
  }

  if (action === 'ocr') {
    const { fileName, griReference } = body;
    const ocrDoc = await processOCRDocument({ name: fileName } as any, griReference);
    return NextResponse.json({ ocr: ocrDoc });
  }

  if (action === 'apply-data' && griCode && data) {
    const filled = await applyDataToTemplates(config?.userId || '', griCode, data);
    return NextResponse.json({ filledTemplates: filled });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
