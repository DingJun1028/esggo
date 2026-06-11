import { NextResponse } from 'next/server';
import { extractMetricsFromEvidence } from '@/lib/omni-gateway';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '@/src/shared/types';

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json<ApiResponse>(
        createErrorResponse('MISSING_FILE_ID', 'Missing fileId for metric extraction'),
        { status: 400 }
      );
    }

    const result = await extractMetricsFromEvidence(fileId);

    return NextResponse.json<ApiResponse>(
      createSuccessResponse(result)
    );
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      createErrorResponse('ALCHEMY_FAILED', error.message || 'OmniAgent Alchemy extraction failed'),
      { status: 500 }
    );
  }
}
