// @ts-nocheck
import { NextResponse } from 'next/server';
import { omniAgentBus } from '@/lib/agents/oa-agent-bus';

/**
 * GET /api/system/bus-health
 * Returns OAAgentBus health status and event statistics.
 */
export async function GET() {
  try {
    const health = omniAgentBus.getHealth();
    const subscriberCount = omniAgentBus.subscribers?.size || 0;

    return NextResponse.json({
      success: true,
      health,
      subscriberCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
