import { NextRequest } from 'next/server';
import { processDocumentWithOcr } from '@/core/services/document-processor';
import { jsonError, jsonResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return jsonError('INVALID_PARAMS', 'No file provided', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processedDoc = await processDocumentWithOcr(buffer, fileName || 'unknown.pdf');

    return jsonResponse(processedDoc);
  } catch (error) {
    console.error('Error processing document:', error);
    return jsonError('INTERNAL_ERROR', 'Internal Server Error', 500);
  }
}
