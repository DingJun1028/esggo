import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { persona, mode } = body;

    const sessionId = uuidv4();

    return NextResponse.json({
      success: true,
      sessionId,
      persona: persona || 'Default_Guardian',
      mode: mode || 'interactive',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
