/**
 * 5T Trustworthy — esggo-omni-center memory 路由寫入認證守門驗證（鏡像對稱）
 * 驗證 esggo-omni-center/app/api/memory/route.ts 的 assertMemoryWriteAuth。
 * 聚焦守門拒絕職責 (401)；放行後業務流由整合測試另覆蓋。
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

function makeReq(method: 'GET' | 'POST' | 'DELETE', headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/memory', {
    method,
    headers: { 'content-type': 'application/json', ...headers },
    body: method === 'GET' ? undefined : JSON.stringify({ key: 'v' }),
  });
}

describe('esggo-omni-center POST /api/memory — 寫入認證守門', () => {
  afterEach(() => { vi.unstubAllEnvs(); });

  it('有 MEMORY_API_KEY 時缺少密鑰 → 401', async () => {
    vi.stubEnv('MEMORY_API_KEY', 'mem-key-xyz');
    vi.stubEnv('x-user-id', '');
    const { POST } = await import('../esggo-omni-center/app/api/memory/route');
    const res = await POST(makeReq('POST'));
    expect(res.status).toBe(401);
  });

  it('有 MEMORY_API_KEY 時錯誤密鑰 → 401', async () => {
    vi.stubEnv('MEMORY_API_KEY', 'mem-key-xyz');
    const { POST } = await import('../esggo-omni-center/app/api/memory/route');
    const res = await POST(makeReq('POST', { 'x-memory-key': 'wrong' }));
    expect(res.status).toBe(401);
  });

  it('無 MEMORY_API_KEY 時缺少 x-user-id → 401', async () => {
    vi.stubEnv('MEMORY_API_KEY', '');
    const { POST } = await import('../esggo-omni-center/app/api/memory/route');
    const res = await POST(makeReq('POST'));
    expect(res.status).toBe(401);
  });

  it('有 MEMORY_API_KEY 時正確 x-memory-key → 非 401', async () => {
    vi.stubEnv('MEMORY_API_KEY', 'mem-key-xyz');
    const { POST } = await import('../esggo-omni-center/app/api/memory/route');
    const res = await POST(makeReq('POST', { 'x-memory-key': 'mem-key-xyz' }));
    expect(res.status).not.toBe(401);
  });

  it('DELETE 無認證 → 401', async () => {
    vi.stubEnv('MEMORY_API_KEY', 'mem-key-xyz');
    vi.stubEnv('x-user-id', '');
    const { DELETE } = await import('../esggo-omni-center/app/api/memory/route');
    const res = await DELETE(makeReq('DELETE'));
    expect(res.status).toBe(401);
  });
});
