// ═══════════════════════════════════════════════════════════════
// ESGGO Smart AI Router — Cloudflare Workers 入口
// wrangler.toml: main = "worker/src/index.ts"
// 接既有路由層 (src/core/ai/model-router.ts) 提供 $0 免費 ESG 推理 API。
// 此 entry 獨立於 Next.js 的 src/，避免污染 app build。
// ═══════════════════════════════════════════════════════════════

import { callFreeProvider, inferTaskType, routeModel, type ChatMessage } from '../../src/core/ai/model-router';

export interface Env {
  ENVIRONMENT?: string;
  SMART_ROUTER_VERSION?: string;
  // Cloudflare AI 通道（callCloudflareAI 讀 CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN）
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  // 其它免費 provider key（callChatProvider 按需讀取）
  GROQ_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  FREE_MODELS_KV?: unknown; // 保留綁定（wrangler.toml 已宣告）
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

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
        endpoints: {
          'POST /v1/chat': 'body: { message: string, taskType?: string } → 免費模型推理',
          'GET /healthz': '健康檢查',
        },
      });
    }

    // ── 聊天推理 ─────────────────────────────────────────────
    if (url.pathname === '/v1/chat' && request.method === 'POST') {
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
      try {
        const { content, used } = await callFreeProvider(taskType, messages, {
          maxTokens: 512,
          temperature: 0.7,
        });
        return json({
          taskType,
          strategy: routing.strategy,
          used: { provider: used.provider, model: used.model },
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
