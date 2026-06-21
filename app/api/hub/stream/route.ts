// app/api/hub/stream/route.ts
// Server-Sent Events 即時資料流
// 前端透過 EventSource 訂閱，接收設施狀態變更、記憶更新、任務事件

import { NextRequest } from 'next/server';
// @ts-ignore - realtime module exists at lib/omni-hub/realtime.ts
import { realtime } from '@/lib/omni-hub/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
