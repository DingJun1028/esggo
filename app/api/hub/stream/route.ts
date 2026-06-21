// app/api/hub/stream/route.ts
// Server-Sent Events 即時資料流
// 前端透過 EventSource 訂閱，接收設施狀態變更、記憶更新、任務事件

import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore - realtime module exists at lib/omni-hub/realtime.ts
import { realtime } from '@/lib/omni-hub/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Auth & rate limit — inline to avoid client bundle pollution
function validateSSE(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token === (process.env.SSE_TOKEN || 'omni-sse-secret')) return true;
  }
  const url = new URL(request.url);
  if (url.searchParams.get('token') === (process.env.SSE_TOKEN || 'omni-sse-secret')) return true;
  const cookie = request.headers.get('cookie');
  if (cookie?.includes('omni_demo_session=')) return true;
  if (cookie?.includes('next-auth.session-token=')) return true;
  if (process.env.NODE_ENV === 'development') return true;
  return false;
}

const RATE_MAP = new Map<string, { count: number; reset: number }>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const r = RATE_MAP.get(ip);
  if (!r || now > r.reset) { RATE_MAP.set(ip, { count: 1, reset: now + 60000 }); return true; }
  if (r.count >= 100) return false;
  r.count++;
  return true;
}

export async function GET(request: NextRequest) {
  if (!validateSSE(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!checkRate(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'Retry-After': '60' } });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // controller closed
        }
      };

      // 初始連線事件
      send('connected', { timestamp: Date.now(), subscribers: realtime.subscriberCount });

      // 訂閱即時事件
      const unsub = realtime.subscribe((event) => {
        send(event.type, event.payload);
      });

      // 心跳（每 30 秒）
      const heartbeat = setInterval(() => {
        send('ping', { ts: Date.now() });
      }, 30000);

      // 清理
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsub();
        try {
          controller.close();
        } catch {
          /* already closed */
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
