import { omniAgentBus } from '@/lib/agents/omni-agent-bus';

export interface BusEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

const EVENT_BUFFER_MAX = 200;
export const eventBuffer: BusEvent[] = [];
export const subscribers: Set<(event: BusEvent) => void> = new Set();

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

omniAgentBus.registerBroadcastHook(pushBusEvent);
