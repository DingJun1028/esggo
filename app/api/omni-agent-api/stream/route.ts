import { NextRequest } from 'next/server';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';

/**
 * OmniAgent Bus SSE Stream
 * ────────────────────────
 * Server-Sent Events endpoint that bridges the backend OmniAgentBus
 * to the frontend in real-time. The client subscribes once and receives
 * a continuous stream of mission events, agent tasks, and 5T seal confirmations.
 *
 * 5T Protocol Gate: T5 Trackable — lifecycle-aware event propagation.
 */

// In-memory event buffer (shared across SSE connections in the same process)
interface BusEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

const EVENT_BUFFER_MAX = 200;
const eventBuffer: BusEvent[] = [];
const subscribers: Set<(event: BusEvent) => void> = new Set();

/**
 * Push an event into the SSE broadcast channel.
 * Called by the OmniAgentBus broadcast hook layer.
 */
export function pushBusEvent(event: string, payload: Record<string, unknown>) {
  const entry: BusEvent = {
    id: Math.random().toString(36).substring(2, 10),
    event,
    payload,
    timestamp: new Date().toISOString(),
  };
  eventBuffer.push(entry);
  if (eventBuffer.length > EVENT_BUFFER_MAX) eventBuffer.shift();

  // Notify all active SSE subscribers
  subscribers.forEach(cb => cb(entry));
}

/**
 * Auto-register pushBusEvent as a broadcast hook on the OmniAgentBus.
 * This bridges all agent events → SSE stream → frontend in real-time.
 */
omniAgentBus.registerBroadcastHook(pushBusEvent);

/**
 * GET /api/omni-agent-api/stream
 * Opens an SSE connection for real-time OmniAgent event streaming.
 */
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial handshake
      const handshake = `data: ${JSON.stringify({
        event: 'STREAM_CONNECTED',
        payload: { message: 'OmniAgent Bus SSE connected', bufferedEvents: eventBuffer.length, busHooks: omniAgentBus.hookCount },
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(handshake));

      // Replay recent events (last 20)
      const recentEvents = eventBuffer.slice(-20);
      for (const evt of recentEvents) {
        const msg = `id: ${evt.id}\nevent: ${evt.event}\ndata: ${JSON.stringify(evt)}\n\n`;
        controller.enqueue(encoder.encode(msg));
      }

      // Subscribe to future events
      const onEvent = (evt: BusEvent) => {
        try {
          const msg = `id: ${evt.id}\nevent: ${evt.event}\ndata: ${JSON.stringify(evt)}\n\n`;
          controller.enqueue(encoder.encode(msg));
        } catch {
          // Client disconnected
          subscribers.delete(onEvent);
        }
      };
      subscribers.add(onEvent);

      // Heartbeat every 15s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${new Date().toISOString()}\n\n`));
        } catch {
          clearInterval(heartbeat);
          subscribers.delete(onEvent);
        }
      }, 15000);

      // Cleanup on abort
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        subscribers.delete(onEvent);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
