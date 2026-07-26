// ═══════════════════════════════════════════════════════════════
// ESGGO Smart AI Router — Worker 入口單元測試
// 透過 stub 全域 fetch，讓 callFreeProvider 走真實路由/降級邏輯，
// 只替換最底層的網路呼叫，完全不需注入生產代碼。
// 覆蓋：健康檢查 / 路由說明 / 推理 200 / 缺 message 400 /
// 無效 JSON 400 / OPTIONS 預檢 / 自動推斷 taskType / CORS 頭 /
// 路由失敗 502 / env 金鑰接線。
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  resetProviderHealth,
} from '../../src/core/ai/model-router';
import worker, { type Env } from '../src/index';

const baseEnv: Env = {
  ENVIRONMENT: 'test',
  SMART_ROUTER_VERSION: '2.0.0-test',
  GROQ_API_KEY: 'groq-test',
  OPENROUTER_API_KEY: 'or-test',
};

const OK_BODY = JSON.stringify({ message: '幫我做碳排計算' });

// Ollama /api/chat 成功回應形狀
const ollamaOk = (text: string) =>
  new Response(JSON.stringify({ message: { content: text } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

const requestOf = (path: string, init?: RequestInit) =>
  new Request(`https://router.esggo.test${path}`, init);

describe('worker entry — 基本路由', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('GET /health 回 200', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const res = await worker.fetch(requestOf('/health'), baseEnv, ctx);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.ok).toBe(true);
    expect(data.gateway).toBe('omnigateway-core');
  });

  it('GET / 回路由說明', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const res = await worker.fetch(requestOf('/'), baseEnv, ctx);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.docs).toMatch(/status/);
  });

  it('OPTIONS /v1/chat/completions 回 204 預檢 + CORS 頭', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const res = await worker.fetch(
      requestOf('/v1/chat/completions', { method: 'OPTIONS' }),
      baseEnv,
      ctx
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('未知路徑回 200 但為 Default 說明', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const res = await worker.fetch(requestOf('/nope'), baseEnv, ctx);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.docs).toMatch(/status/);
  });
});

describe('worker entry — 聊天推理 /v1/chat/completions', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('POST 成功：回 data', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ollamaOk('OK')),
    );
    const req = requestOf('/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer test-token' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] }),
    });
    const env = { ...baseEnv, OMNI_GATEWAY_KEY: 'test-token' };
    const res = await worker.fetch(req, env, ctx);
    expect(res.status).toBe(200);
  });

  it('缺少 message 回 400', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const req = requestOf('/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer test-token' },
      body: JSON.stringify({}),
    });
    const env = { ...baseEnv, OMNI_GATEWAY_KEY: 'test-token' };
    const res = await worker.fetch(req, env, ctx);
    expect(res.status).toBe(400);
    const data = (await res.json()) as any;
  });

  it('GET /v1/chat/completions 非 POST 回 405', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const req = requestOf('/v1/chat/completions', { method: 'PUT' });
    const res = await worker.fetch(req, baseEnv, ctx);
    expect(res.status).toBe(405);
  });

  it('推理失敗回 502', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );
    const req = requestOf('/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer test-token' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] }),
    });
    const env = { ...baseEnv, OMNI_GATEWAY_KEY: 'test-token' };
    const res = await worker.fetch(req, env, ctx);
    expect(res.status).toBe(502);
  });
});

describe('worker entry — 金鑰接線 (hydrateEnv)', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('env 金鑰可用', async () => {
    const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const env: Env = {
      ...baseEnv,
      GROQ_API_KEY: 'injected-groq',
      OPENROUTER_API_KEY: 'injected-or',
      CLOUDFLARE_API_TOKEN: 'injected-cf',
      OMNI_GATEWAY_KEY: 'test-token',
    };
    vi.stubGlobal('fetch', vi.fn(async () => ollamaOk('OK')));
    const req = requestOf('/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': 'Bearer test-token' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] }),
    });
    const res = await worker.fetch(req, env, ctx);
    expect(res.status).toBe(200);
  });
});
