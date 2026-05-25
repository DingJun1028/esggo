import { NextResponse } from 'next/server';
import { scanEvidenceWithVision } from '@/lib/hermes-gateway';
import { ApiResponse } from '@/types/omni-core';

export async function POST(req: Request) {
  try {
    const { fileId, fileType } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        {
          id: Date.now().toString(),
          status: 'error',
          content: 'Missing fileId for vision scanning',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    const result = await scanEvidenceWithVision(fileId, fileType || 'image/jpeg');

    return NextResponse.json({
      id: Date.now().toString(),
      status: 'success',
      content: 'Hermes Vision analysis complete.',
      data: result,
      timestamp: Date.now(),
    } as ApiResponse);
  } catch (error: any) {
    return NextResponse.json(
      {
        id: Date.now().toString(),
        status: 'error',
        content: error.message || 'Hermes Vision scanning failed',
        timestamp: Date.now(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
