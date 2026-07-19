// ═══════════════════════════════════════════════════════════════
// ESGGO Smart AI Router — Cloudflare Workers 入口
// wrangler.toml: main = "worker/src/index.ts"
// 接既有路由層 (src/core/ai/model-router.ts) 提供 $0 免費 ESG 推理 API。
// 此 entry 獨立於 Next.js 的 src/，避免污染 app build。
// ═══════════════════════════════════════════════════════════════

import {
  callFreeProvider,
  inferTaskType,
  routeModel,
  type ChatMessage,
  type FreeProviderConfig,
  type FreeProviderOptions,
} from '../../src/core/ai/model-router';

export interface Env {
  ENVIRONMENT?: string;
  SMART_ROUTER_VERSION?: string;
  // Cloudflare AI 通道（callCloudflareAI 讀 CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN）
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  // 其它免費 provider key（callChatProvider 按需讀取）
  GROQ_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  TOGETHER_API_KEY?: string;
  MISTRAL_API_KEY?: string;
  GEMINI_API_KEY?: string;
  // 本地 VPS Ollama 代理（免 Key，僅需 Basic Auth 憑證時才設定）
  VPS_OLLAMA_URL?: string;
  VPS_OLLAMA_USER?: string;
  VPS_OLLAMA_PASS?: string;
  FREE_MODELS_KV?: unknown; // 保留綁定（wrangler.toml 已宣告）
}

// ── 安全上限 ──────────────────────────────────────────────────
const MAX_BODY_BYTES = 64 * 1024; // 64KB：防止超大請求佔用 worker CPU/記憶體
const MAX_TOKENS_CAP = 4096; // 個人免費層不應超過此值

// 將 Cloudflare Worker 的 env binding 顯式接線進 process.env。
// CF Worker runtime 不會自動將 secret 注入 process.env（與 Node 行為不同），
// model-router 全程從 process.env 讀取金鑰，必須在此顯式映射，否則線上推理必崩。
function hydrateEnv(env: Env): void {
  const map: Record<string, string | undefined> = {
    CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN,
    GROQ_API_KEY: env.GROQ_API_KEY,
    OPENROUTER_API_KEY: env.OPENROUTER_API_KEY,
    TOGETHER_API_KEY: env.TOGETHER_API_KEY,
    MISTRAL_API_KEY: env.MISTRAL_API_KEY,
    GEMINI_API_KEY: env.GEMINI_API_KEY,
    VPS_OLLAMA_URL: env.VPS_OLLAMA_URL,
    VPS_OLLAMA_USER: env.VPS_OLLAMA_USER,
    VPS_OLLAMA_PASS: env.VPS_OLLAMA_PASS,
  };
  for (const [k, v] of Object.entries(map)) {
    if (v !== undefined) process.env[k] = v;
  }
}

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...CORS_HEADERS,
    },
  });
}

function parseBodySize(request: Request): number {
  const len = request.headers.get('content-length');
  if (!len) return 0;
  const n = Number.parseInt(len, 10);
  return Number.isFinite(n) ? n : 0;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 金鑰接線（每次請求都做，確保 wrangler dev / 熱更新後仍正確）
    hydrateEnv(env);

    const url = new URL(request.url);

    // ── 預檢 ─────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── 健康檢查 ─────────────────────────────────────────────
    if (url.pathname === '/healthz' || url.pathname === '/health') {
      return json({
        ok: true,
        service: 'esggo-smart-ai-router',
        version: env.SMART_ROUTER_VERSION ?? '2.0.0-beta.1',
        environment: env.ENVIRONMENT ?? 'production',
      });
    }

    // ── 路由說明 ─────────────────────────────────────────────
    if (url.pathname === '/' || url.pathname === '/api') {
      return json({
        service: 'esggo-smart-ai-router',
        version: env.SMART_ROUTER_VERSION ?? '2.0.0-beta.1',
        endpoints: {
          'POST /v1/chat': 'body: { message: string, taskType?: string } → 免費模型推理',
          'GET /healthz': '健康檢查',
        },
      });
    }

    // ── 聊天推理 ─────────────────────────────────────────────
    if (url.pathname === '/v1/chat' && request.method === 'POST') {
      // 請求大小防護
      if (parseBodySize(request) > MAX_BODY_BYTES) {
        return json({ error: 'payload too large', limit: MAX_BODY_BYTES }, 413);
      }

      let body: { message?: string; taskType?: string };
      try {
        body = await request.json();
      } catch {
        return json({ error: 'invalid JSON body' }, 400);
      }
      const message = (body.message ?? '').toString().trim();
      if (!message) return json({ error: 'missing "message"' }, 400);

      // taskType 優先；否則自動推斷
      const taskType = body.taskType && body.taskType.trim() ? body.taskType : inferTaskType(message);
      const routing = routeModel(taskType);

      const messages: ChatMessage[] = [{ role: 'user', content: message }];
      const options: FreeProviderOptions = {
        maxTokens: MAX_TOKENS_CAP,
        temperature: 0.7,
      };
      try {
        const { content, used } = await callFreeProvider(taskType, messages, options);
        const usedCfg = used as FreeProviderConfig;
        return json({
          taskType,
          strategy: routing.strategy,
          used: { provider: usedCfg.provider, model: usedCfg.model },
          response: content,
        });
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        return json({ error: 'routing failed', detail: err, taskType }, 502);
      }
    }

    return json({ error: 'not found', path: url.pathname }, 404);
  },
};
