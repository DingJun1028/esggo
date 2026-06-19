import { NextRequest, NextResponse } from 'next/server';
import { blueCC } from '../../../lib/services/blue-cc';

export async function GET(request: NextRequest) {
  try {
    const status = await blueCC.getSystemStatus();
    const resources = await blueCC.listResources();
    
    return NextResponse.json({
      ok: true,
      status,
      resources
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agentName, specs } = body;

    if (action === 'deploy') {
      const result = await blueCC.deployAgent(agentName, specs);
      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
