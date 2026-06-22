import { NextRequest, NextResponse } from 'next/server';
import { omniAgentBus } from '@/lib/agents/oa-agent-bus';

/**
 * POST /api/omni-agent/celestial
 * Execute a Celestial Command via OAAgentBus.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { intent, context } = body;

    if (!intent) {
      return NextResponse.json({ error: 'Intent is required' }, { status: 400 });
    }

    const result = await omniAgentBus.executeCelestialCommand(intent, context || {});
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
