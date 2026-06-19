import { NextResponse } from 'next/server';
import { extractMetricsFromEvidence } from '@/lib/omni-gateway';
import { ApiResponse } from '@/types/omni-core';

export async function POST(req: Request) {
  try {
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        {
          id: Date.now().toString(),
          status: 'error',
          content: 'Missing fileId for metric extraction',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    const result = await extractMetricsFromEvidence(fileId);

    return NextResponse.json({
      id: Date.now().toString(),
      status: 'success',
      content: 'OmniAgent Alchemy metric extraction complete.',
      data: result,
      timestamp: Date.now(),
    } as ApiResponse);
  } catch (error: any) {
    return NextResponse.json(
      {
        id: Date.now().toString(),
        status: 'error',
        content: error.message || 'OmniAgent Alchemy extraction failed',
        timestamp: Date.now(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
