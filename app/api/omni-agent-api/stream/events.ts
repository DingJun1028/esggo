// 5T End-to-End Type Safety Enforced
/**
 * OAAgentBus SSE Event Buffer
 * v2.0.0 | Production-Ready
 *
 * Changelog v2.0.0:
 * - Added event filtering
 * - Added event type statistics
 * - Added subscriber health monitoring
 */

import { omniAgentBus } from '@/lib/agents/omni-agent-bus';

export interface BusEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

const EVENT_BUFFER_MAX = 500;
const DEDUP_WINDOW_MS = 5000;

export const eventBuffer: BusEvent[] = [];
export const subscribers: ((event: BusEvent) => void)[] = [];

// Event type statistics
const eventStats: Record<string, number> = {};

// Deduplication
const recentEventKeys: Record<string, number> = {};

function getEventKey(event: string, payload: Record<string, unknown>): string {
  // Create a dedup key from event type + relevant payload fields
  const keyFields = [event, payload.evidenceUuid, payload.skillId, payload.colorDropId].filter(
    Boolean
  );
  return keyFields.join(':');
}

export function pushBusEvent(event: string, payload: Record<string, unknown>) {
  const now = Date.now();

  // Deduplication check
  const dedupKey = getEventKey(event, payload);
  const lastSeen = recentEventKeys[dedupKey] || 0;
  if (now - lastSeen < DEDUP_WINDOW_MS) {
    return; // Skip duplicate
  }
  recentEventKeys[dedupKey] = now;

  // Cleanup old dedup entries
  for (const key of Object.keys(recentEventKeys)) {
    if (now - recentEventKeys[key] > DEDUP_WINDOW_MS) {
      delete recentEventKeys[key];
    }
  }

  const entry: BusEvent = {
    id: Math.random().toString(36).substring(2, 10),
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  // Add to buffer
  eventBuffer.push(entry);
  if (eventBuffer.length > EVENT_BUFFER_MAX) {
    eventBuffer.shift();
  }

  // Update stats
  eventStats[event] = (eventStats[event] || 0) + 1;

  // Notify subscribers
  for (const cb of subscribers) {
    try {
      cb(entry);
    } catch (e) {
      console.warn('[EventBuffer] Subscriber error:', e);
    }
  }
}

export function getEventStats(): Record<string, number> {
  return { ...eventStats };
}

export function getSubscriberCount(): number {
  return subscribers.length;
}

export function getBufferUtilization(): { current: number; max: number; percent: number } {
  return {
    current: eventBuffer.length,
    max: EVENT_BUFFER_MAX,
    percent: Math.round((eventBuffer.length / EVENT_BUFFER_MAX) * 100),
  };
}

// Auto-register with OAAgentBus
omniAgentBus.registerBroadcastHook(pushBusEvent);
