export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * A lightweight, Redis-backed rate limiter using a fixed window approach.
 * Falls back to in-memory store if Redis is unavailable.
 */
export async function rateLimit(identifier: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const now = Date.now();
  const reset = now + windowSeconds * 1000;
  const key = `ratelimit:${identifier}`;

  // Lazy import Redis to avoid build-time connection issues
  let redis: any = null;
  try {
    const { getRedis } = await import('@lib/redis/client');
    redis = await getRedis();
  } catch {
    // Redis module unavailable — use in-memory fallback
  }

  if (redis) {
    try {
      const pipeline = redis.pipeline();
      pipeline.incr(key);
      pipeline.pttl(key);
      const results = await pipeline.exec();

      const count = results[0][1] as number;
      const ttl = results[1][1] as number;

      if (count === 1 || ttl < 0) {
        // First request in the window, set expire
        await redis.expire(key, windowSeconds);
      }

      return {
        success: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        reset: now + (ttl > 0 ? ttl : windowSeconds * 1000)
      };
    } catch (error) {
      console.warn('[RateLimit] Redis error, falling back to memory', error);
      return memoryRateLimit(key, limit, windowSeconds, now, reset);
    }
  } else {
    // Memory fallback
    return memoryRateLimit(key, limit, windowSeconds, now, reset);
  }
}

async function memoryRateLimit(key: string, limit: number, windowSeconds: number, now: number, reset: number): Promise<RateLimitResult> {
  const { memoryFallback } = await import('@lib/redis/client');
  const record = memoryFallback.get(key) || { count: 0, reset: 0 };
  
  if (now > record.reset) {
    // Window expired, reset
    record.count = 1;
    record.reset = reset;
  } else {
    record.count += 1;
  }

  memoryFallback.set(key, record, Math.ceil((record.reset - now) / 1000));

  return {
    success: record.count <= limit,
    limit,
    remaining: Math.max(0, limit - record.count),
    reset: record.reset
  };
}
