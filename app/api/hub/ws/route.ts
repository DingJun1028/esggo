// app/api/hub/ws/route.ts
// 萬能中心 — SSE 即時同步端點

import { NextRequest } from 'next/server';

// 內聯 realtime 匯流排（避免模組解析問題）
type RealtimeEvent = { type: string; payload: Record<string, unknown>; timestamp: number };
type EventHandler = (event: RealtimeEvent) => void;

const handlers = new Set<EventHandler>();
const eventHistory: RealtimeEvent[] = [];

function emit(type: string, payload: Record<string, unknown> = {}) {
  const event: RealtimeEvent = { type, payload, timestamp: Date.now() };
  eventHistory.push(event);
  if (eventHistory.length > 200) eventHistory.shift();
  handlers.forEach((h) => {
    try {
      h(event);
    } catch (_) {
      /* ignore */
    }
  });
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* closed */
        }
      };

      send('connected', { timestamp: Date.now(), subscribers: handlers.size });

      const handler: EventHandler = (event) => send(event.type, event.payload);
      handlers.add(handler);

      const heartbeat = setInterval(() => send('ping', { ts: Date.now() }), 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        handlers.delete(handler);
        try {
          controller.close();
        } catch {
          /* closed */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  emit(body.type || 'custom', {
    ...body.payload,
    fromAgentId: body.fromAgentId || 'api',
    timestamp: Date.now(),
  });
  return Response.json({ success: true, subscribers: handlers.size });
}
