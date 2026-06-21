// lib/omni-hub/rate-limit.ts
// API Rate Limit 中介層
// 基於 IP 的滑動窗口限流

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '100', 10);
const RATE_WINDOW_MS = 60 * 1000; // 1 分鐘

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);

  if (!record || now > record.resetTime) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: RATE_WINDOW_MS };
  }

  if (record.count >= RATE_LIMIT) {
    const resetIn = record.resetTime - now;
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetIn: record.resetTime - now };
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return 'unknown';
}

// 定期清理過期記錄
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const keys = Array.from(RATE_LIMIT_MAP.keys());
    for (let i = 0; i < keys.length; i++) {
      const record = RATE_LIMIT_MAP.get(keys[i]);
      if (record && now > record.resetTime) RATE_LIMIT_MAP.delete(keys[i]);
    }
  }, 60 * 1000);
}
