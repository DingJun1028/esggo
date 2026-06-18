import { NextRequest, NextResponse } from 'next/server';
import { debugService } from '@/lib/debug-platform/DebugService';

/**
 * Debug Platform API - Receives and processes debug events from client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, action } = body;

    if (action === 'clear') {
      debugService.clear();
      return NextResponse.json({ success: true, message: 'Debug logs cleared' });
    }

    if (action === 'config') {
      const { config } = body;
      debugService.configure(config);
      return NextResponse.json({ success: true, config });
    }

    if (Array.isArray(events)) {
      for (const event of events) {
        if (event.level && event.source && event.message) {
          debugService.log(event.level, event.source, event.message, event.context, event.error);
        }
      }
      return NextResponse.json({ success: true, received: events.length });
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') as any;
  const source = searchParams.get('source') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  return NextResponse.json({
    events: debugService.getEvents({ level, source, limit }),
    metrics: debugService.getMetrics(),
    snapshots: debugService.getSnapshots(limit),
  });
}

export async function DELETE() {
  debugService.clear();
  return NextResponse.json({ success: true, message: 'All debug logs cleared' });
}
