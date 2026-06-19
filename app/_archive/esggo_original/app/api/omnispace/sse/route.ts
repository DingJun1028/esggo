import { NextRequest } from 'next/server';
import { globalHealingService } from '../../../../src/server/healing/GlobalHealingServer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const eventStore = globalHealingService.getEventStore();

  const customReadable = new ReadableStream({
    start(controller) {
      const onEventSaved = (event: any) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // 訂閱 EventStore 的事件
      eventStore.on('event_appended', onEventSaved);

      // 客戶端斷線時清除監聽
      req.signal.addEventListener('abort', () => {
        eventStore.off('event_appended', onEventSaved);
        controller.close();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
