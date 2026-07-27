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

  it('GET /healthz 回 200 + 版本/環境', async () => {
    const res = await worker.fetch(requestOf('/healthz'), baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.ok).toBe(true);
    expect(data.service).toBe('esggo-smart-ai-router');
    expect(data.version).toBe('2.0.0-test');
    expect(data.environment).toBe('test');
  });

  it('GET / 回路由說明', async () => {
    const res = await worker.fetch(requestOf('/'), baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.endpoints['POST /v1/chat']).toBeTruthy();
  });

  it('OPTIONS /v1/chat 回 204 預檢 + CORS 頭', async () => {
    const res = await worker.fetch(
      requestOf('/v1/chat', { method: 'OPTIONS' }),
      baseEnv,
      { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('未知路徑回 404', async () => {
    const res = await worker.fetch(requestOf('/nope'), baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(404);
    const data = (await res.json()) as any;
    expect(data.error).toBe('not found');
  });
});

describe('worker entry — 聊天推理 /v1/chat', () => {
  beforeEach(() => resetProviderHealth());
  afterEach(() => vi.unstubAllGlobals());

  it('POST 成功：回 taskType + used + response（走 local_gemma 真實路由）', async () => {
    // 路由 primary 為 local_gemma（免 Key，優先），mock 其 Ollama 端點回應
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ollamaOk('GEMMA_OK')),
    );
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: OK_BODY,
    });
    const res = await worker.fetch(req, baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.taskType).toBe('carbon_calculation'); // 關鍵詞自動推斷
    expect(data.used).toBeDefined();
    expect(data.used.provider).toBe('local_gemma');
    expect(data.response).toBe('GEMMA_OK');
  });

  it('自訂 taskType 優先於自動推斷', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ollamaOk('SDG_OK')));
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'hi', taskType: 'sdg_mapping' }),
    });
    const res = await worker.fetch(req, baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    const data = (await res.json()) as any;
    expect(data.taskType).toBe('sdg_mapping');
  });

  it('缺少 message 回 400', async () => {
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await worker.fetch(req, baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(400);
    const data = (await res.json()) as any;
    expect(data.error).toMatch(/missing/);
  });

  it('無效 JSON 回 400', async () => {
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not json{',
    });
    const res = await worker.fetch(req, baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(400);
  });

  it('GET /v1/chat 非 POST 回 404（不匹配 POST 分支）', async () => {
    const req = requestOf('/v1/chat', { method: 'GET' });
    const res = await worker.fetch(req, baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(404);
  });

  it('推理失敗（Ollama 全掛含所有 fallback）回 502 + detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: OK_BODY,
    });
    const res = await worker.fetch(req, baseEnv, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    expect(res.status).toBe(502);
    const data = (await res.json()) as any;
    expect(data.error).toBe('routing failed');
    expect(data.detail).toMatch(/network down|所有免費模型/);
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
    // 讓 Ollama 端點（含自訂 VPS_OLLAMA_URL）都能回應
    vi.stubGlobal('fetch', vi.fn(async () => ollamaOk('OK')));
    const req = requestOf('/v1/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: OK_BODY,
    });
    await worker.fetch(req, env, { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as any);
    // 請求處理後 process.env 應含來自 env binding 的金鑰
    expect(process.env.GROQ_API_KEY).toBe('injected-groq');
    expect(process.env.OPENROUTER_API_KEY).toBe('injected-or');
    expect(process.env.CLOUDFLARE_API_TOKEN).toBe('injected-cf');
    expect(process.env.VPS_OLLAMA_URL).toBe('https://vps.local/ollama/api/chat');
  });
});
