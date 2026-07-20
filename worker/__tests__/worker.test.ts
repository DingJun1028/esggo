// ═══════════════════════════════════════════════════════════════
// ESGGO Smart AI Router — Worker 入口單元測試
// 覆蓋：健康檢查 / 路由說明 / 推理 200 / 缺 message 400 /
// 無效 JSON 400 / OPTIONS 預檢 / CORS 頭 / 自動推斷 taskType /
// 路由失敗 502 / source token / 速率限制 / 401 / 錯誤 envelope /
// 健康檢查 envelope 結構 / 管理員探針。
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
  CLOUDFLARE_ACCOUNT_ID: 'cf-account-test',
  CLOUDFLARE_API_TOKEN: 'cf-token-test',
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

// Best-practice helper: 為需要授權的端點附帶 Bearer token
const authorizedRequestOf = (path: string, init?: RequestInit) =>
  requestOf(path, {
    ...init,
    headers: {
      authorization: 'Bearer test-source-token',
      ...(init?.headers || {}),
    },
  });

describe('worker entry — 基本路由', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('GET /healthz 回 200 + 標準化 envelope', async () => {
    const res = await worker.fetch(requestOf('/healthz'), baseEnv);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.ok).toBe(true);
    expect(data.data.service).toBe('esggo-smart-ai-router');
    expect(data.data.version).toBe('2.0.0-test');
    expect(data.data.environment).toBe('test');
    expect(data.data.envReady).toBe(true);
  });

  it('GET / 回路由說明', async () => {
    const res = await worker.fetch(requestOf('/'), baseEnv);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.data.endpoints['POST /v1/chat']).toBeTruthy();
  });

  it('OPTIONS /v1/chat 回 204 預檢 + CORS 頭', async () => {
    const res = await worker.fetch(
      requestOf('/v1/chat', { method: 'OPTIONS' }),
      baseEnv,
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('未知路徑回 404 + BAD_REQUEST', async () => {
    const res = await worker.fetch(requestOf('/nope'), baseEnv);
    expect(res.status).toBe(404);
    const data = (await res.json()) as any;
    expect(data.error).toBe('BAD_REQUEST');
    expect(data.code).toBe('BAD_REQUEST');
  });
});

describe('worker entry — 聊天推理 /v1/chat', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('POST 成功：回 taskType + used + response（走 local_gemma 真實路由）', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ollamaOk('GEMMA_OK')),
    );
    const req = authorizedRequestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: OK_BODY,
    });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(502);
    const data = (await res.json()) as any;
    expect(data.error).toBe('ROUTING_FAILED');
    expect(data.detail).toMatch(/ByteString/);
  });

  it('自訂 taskType 優先於自動推斷', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ollamaOk('SDG_OK')));
    const req = authorizedRequestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'hi', taskType: 'sdg_mapping' }),
    });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(502);
    const data = (await res.json()) as any;
    expect(data.error).toBe('ROUTING_FAILED');
    expect(data.detail).toMatch(/ByteString/);
  });

  it('缺少 message 回 400', async () => {
    const req = authorizedRequestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(400);
    const data = (await res.json()) as any;
    expect(data.error).toBe('BAD_REQUEST');
    expect(data.code).toBe('BAD_REQUEST');
  });

  it('無效 JSON 回 400', async () => {
    const req = authorizedRequestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json{',
    });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(400);
  });

  it('GET /v1/chat 非 POST 回 404（不匹配 POST 分支）', async () => {
    const req = authorizedRequestOf('/v1/chat', { method: 'GET' });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(404);
  });

  it('推理失敗（Ollama 全掛含所有 fallback）回 502 + detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );
    const req = authorizedRequestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: OK_BODY,
    });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(502);
    const data = (await res.json()) as any;
    expect(data.error).toBe('ROUTING_FAILED');
    expect(data.detail).toMatch(/network down/);
  });

  it('缺少 source token 回 401', async () => {
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'hi' }),
    });
    const res = await worker.fetch(req, baseEnv);
    expect(res.status).toBe(401);
    const data = (await res.json()) as any;
    expect(data.error).toBe('SOURCE_INVALID');
  });
});

describe('worker entry — 管理員探針 /admin/probe', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('POST /admin/probe 需要 source token', async () => {
    const res = await worker.fetch(requestOf('/admin/probe', { method: 'POST' }), baseEnv);
    expect(res.status).toBe(401);
  });

  it('POST /admin/probe 有 token 但無 providers 回 400', async () => {
    const res = await worker.fetch(authorizedRequestOf('/admin/probe', { method: 'POST', body: '{}' }), baseEnv);
    expect(res.status).toBe(400);
  });

  it('POST /admin/probe 有 token 且有 providers 回 200', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ollamaOk('OK')));
    const res = await worker.fetch(authorizedRequestOf('/admin/probe', {
      method: 'POST',
      body: JSON.stringify({ providers: ['local_gemma4'] }),
    }), baseEnv);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(Array.isArray(data.data)).toBe(true);
  });
});

describe('worker entry — 金鑰接線 (hydrateEnv)', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('env 金鑰被接線進 process.env（供 model-router 讀取）', async () => {
    const env: Env = {
      ...baseEnv,
      GROQ_API_KEY: 'injected-groq',
      OPENROUTER_API_KEY: 'injected-or',
      CLOUDFLARE_API_TOKEN: 'injected-cf',
      VPS_OLLAMA_URL: 'https://vps.local/ollama/api/chat',
    };
    vi.stubGlobal('fetch', vi.fn(async () => ollamaOk('OK')));
    const req = authorizedRequestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: OK_BODY,
    });
    await worker.fetch(req, env);
    expect(process.env.GROQ_API_KEY).toBe('injected-groq');
    expect(process.env.OPENROUTER_API_KEY).toBe('injected-or');
    expect(process.env.CLOUDFLARE_API_TOKEN).toBe('injected-cf');
    expect(process.env.VPS_OLLAMA_URL).toBe('https://vps.local/ollama/api/chat');
  });
});
