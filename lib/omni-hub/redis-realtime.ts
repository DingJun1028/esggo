// lib/omni-hub/redis-realtime.ts
// 萬能中心 — Redis 跨機同步層
// 用 Redis pub/sub 取代純記憶體 bus，支援多 PM2 進程、多機分散

// @ts-ignore - redis 套件需要 ES2015+ target
import { createClient } from 'redis';
import type { RealtimeEvent } from './realtime';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const CHANNEL = 'omni:hub:events';

let pubClient: ReturnType<typeof createClient> | null = null;
let subClient: ReturnType<typeof createClient> | null = null;
let connected = false;

export async function initRedis(): Promise<void> {
  if (connected) return;

  pubClient = createClient({ url: REDIS_URL });
  subClient = createClient({ url: REDIS_URL });

  await pubClient.connect();
  await subClient.connect();

  connected = true;
  console.log('[Redis] Connected to', REDIS_URL);
}

export async function publishEvent(event: RealtimeEvent): Promise<void> {
  if (!connected || !pubClient) return;
  try {
    await pubClient.publish(CHANNEL, JSON.stringify(event));
  } catch (e) {
    console.error('[Redis] Publish error:', e);
  }
}

export function subscribeToEvents(
  handler: (event: RealtimeEvent) => void
): () => void {
  if (!subClient) return () => {};

  subClient.subscribe(CHANNEL, (message: string) => {
    try {
      const event = JSON.parse(message) as RealtimeEvent;
      handler(event);
    } catch {
      // ignore malformed
    }
  });

  return () => {
    subClient?.unsubscribe(CHANNEL).catch(() => {});
  };
}

export async function closeRedis(): Promise<void> {
  if (pubClient) await pubClient.quit();
  if (subClient) await subClient.quit();
  pubClient = null;
  subClient = null;
  connected = false;
}

export function isRedisConnected(): boolean {
  return connected;
}
