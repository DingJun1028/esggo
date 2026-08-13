/**
 * 5T Trustworthy — esggo-omni-center cron 路由認證守門驗證（鏡像對稱）
 * 驗證 esggo-omni-center/app/api/cron/route.ts 的 assertCronAuth。
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

function makePost(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/cron', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ job: 'daily-report' }),
  });
}

describe('esggo-omni-center POST /api/cron — 認證守門', () => {
  afterEach(() => { vi.unstubAllEnvs(); });

  it('有 CRON_SECRET 時缺少密鑰 → 401', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret-xyz');
    vi.stubEnv('x-user-id', '');
    const { POST } = await import('../esggo-omni-center/app/api/cron/route');
    const res = await POST(makePost());
    expect(res.status).toBe(401);
  });

  it('有 CRON_SECRET 時錯誤密鑰 → 401', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret-xyz');
    const { POST } = await import('../esggo-omni-center/app/api/cron/route');
    const res = await POST(makePost({ 'x-cron-secret': 'wrong' }));
    expect(res.status).toBe(401);
  });

  it('有 CRON_SECRET 時正確 x-cron-secret → 非 401', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret-xyz');
    const { POST } = await import('../esggo-omni-center/app/api/cron/route');
    const res = await POST(makePost({ 'x-cron-secret': 'cron-secret-xyz' }));
    expect(res.status).not.toBe(401);
  });

  it('無 CRON_SECRET 時缺 x-user-id → 401', async () => {
    vi.stubEnv('CRON_SECRET', '');
    const { POST } = await import('../esggo-omni-center/app/api/cron/route');
    const res = await POST(makePost());
    expect(res.status).toBe(401);
  });
});
