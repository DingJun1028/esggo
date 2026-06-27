import { NextResponse } from 'next/server';
import { agnesApi } from '@/lib/agnes-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, context } = body;

    if (!input) {
      return NextResponse.json({ success: false, error: 'Input is required' }, { status: 400 });
    }

    const result = await agnesApi.processRequest(input, context);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[AGNES_API] Error processing request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const metrics = await agnesApi.getMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
