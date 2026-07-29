import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker, { type Env } from './worker/src/index';

const baseEnv: Env = {
  ENVIRONMENT: 'test',
  SMART_ROUTER_VERSION: '2.0.0-test',
  GROQ_API_KEY: 'groq-test',
  OPENROUTER_API_KEY: 'or-test',
};

const requestOf = (path: string, init?: RequestInit) =>
  new Request(`https://router.esggo.test${path}`, init);

describe('worker entry — 基本路由', () => {
  it('GET /healthz 回 200 + 版本/環境', async () => {
    const res = await worker.fetch(requestOf('/healthz'), baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    console.log(data);
  });
});
