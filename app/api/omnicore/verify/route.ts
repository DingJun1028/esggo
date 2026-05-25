import { NextResponse } from 'next/server';
import { omniCore } from '@/lib/omni-core';
import { ApiResponse, VerifyRequestPayload } from '@/types/omni-core';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { component } = body as VerifyRequestPayload;

    if (!component) {
      return NextResponse.json(
        {
          id: Date.now().toString(),
          status: 'error',
          content: 'Missing component for verification',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    const isValid = await omniCore.verifyComponent(component);

    return NextResponse.json({
      id: Date.now().toString(),
      status: isValid ? 'verified' : 'error',
      content: isValid 
        ? 'Hash Lock integrity verified successfully.' 
        : 'Hash Lock mismatch! Data integrity compromised.',
      timestamp: Date.now(),
      data: { isValid },
    } as ApiResponse);
  } catch (error: any) {
    return NextResponse.json(
      {
        id: Date.now().toString(),
        status: 'error',
        content: error.message || 'Internal Server Error during verification',
        timestamp: Date.now(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
