import { NextResponse } from 'next/server';
import { omniCore } from '@/lib/omni-core';
import { ApiResponse, SealRequestPayload } from '@/types/omni-core';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metric, source, formula, policyId } = body as SealRequestPayload;

    if (!metric || !source || !formula) {
      return NextResponse.json(
        {
          id: Date.now().toString(),
          status: 'error',
          content: 'Missing required fields: metric, source, or formula',
          timestamp: Date.now(),
        } as ApiResponse,
        { status: 400 }
      );
    }

    const result = await omniCore.sealComponent(metric, source, formula, policyId);

    return NextResponse.json({
      id: Date.now().toString(),
      status: 'sealed',
      content: 'Data successfully sealed with Hash Lock (T4 Trustworthy)',
      component: result,
      timestamp: Date.now(),
      hash: result.hash_lock,
    } as ApiResponse);
  } catch (error: any) {
    return NextResponse.json(
      {
        id: Date.now().toString(),
        status: 'error',
        content: error.message || 'Internal Server Error during sealing',
        timestamp: Date.now(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
