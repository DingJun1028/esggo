import { NextRequest, NextResponse } from 'next/server';
import { processDocumentWithOcr } from '@/core/services/document-processor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processedDoc = await processDocumentWithOcr(buffer, fileName || 'unknown.pdf');

    return NextResponse.json({
      success: true,
      data: processedDoc
    });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
