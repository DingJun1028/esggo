import { NextResponse } from 'next/server';

import { eventBuffer, subscribers, getEventStats, getBufferUtilization } from '../../events';

/**
 * GET /api/omni-agent-api/stream/events/stats
 * Returns event statistics, subscriber count, and buffer utilization.
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      stats: getEventStats(),
      subscribers: subscribers.length,
      buffer: getBufferUtilization(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
