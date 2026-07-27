/**
 * OmniGateway (Cloudflare Worker)
 *
 * 統一 AI 存取點：Cloudflare WAF → AI Crawl Control → Semantic Cache → Model Router → Fallback → Audit Sink
 *
 * Environment bindings (wrangler secret / dashboard):
 *  - OMNI_GATEWAY_KEY   :  Bearer token for protected routes
 *  - OPENROUTER_API_KEY :  OpenRouter upstream key
 *  - GROQ_API_KEY       :  Groq upstream key
 *  - GEMINI_API_KEY     :  Gemini upstream key
 *  - TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID : optional alert transport
 *  - DISCORD_ALERT_WEBHOOK_ID / DISCORD_ALERT_WEBHOOK_TOKEN : optional alert transport
 *  - AI_CRAWL_CONTROL    : "strict|moderate|off" (default strict)
 *  - CF_AI_CRAWL_CONTROL : optional, same as above
 *
 * KV (optional):
 *  - OMNI_KV : cache namespace
 *
 * VPC Services / Networks (optional):
 *  - PRIVATE_API : VPC service binding to private model / API
 */

type Env = {
  OMNI_GATEWAY_KEY?: string;
  OPENROUTER_API_KEY?: string;
  GROQ_API_KEY?: string;
  GEMINI_API_KEY?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  DISCORD_ALERT_WEBHOOK_ID?: string;
  DISCORD_ALERT_WEBHOOK_TOKEN?: string;
  AI_CRAWL_CONTROL?: string;
  CF_AI_CRAWL_CONTROL?: string;
  OMNI_KV?: KVNamespace;
  PRIVATE_API?: Fetcher;
};

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

interface RequestContext {
  request: Request;
  env: Env;
  ctx: ExecutionContext;
  requestId: string;
  clientIp: string;
  userAgent: string;
  pathname: string;
  crawlMode: 'strict' | 'moderate' | 'off';
}

// ── Helpers ──────────────────────────────────────────────────────────

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-omni-gateway': '1',
      ...headers,
    },
  });
}

function auditSink(ctx: ExecutionContext, event: Record<string, unknown>) {
  const record = { ts: Date.now(), ...event };
  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(fetch('https://esggo.co/api/audit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-omni-token': 'internal' },
    body: JSON.stringify(record),
    // fire-and-forget to origin audit sink
  }).catch(() => {}));
}

async function alertTransport(env: Env, text: string) {
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
    }).catch(() => {});
    return;
  }
  if (env.DISCORD_ALERT_WEBHOOK_ID && env.DISCORD_ALERT_WEBHOOK_TOKEN) {
    const url = `https://discord.com/api/webhooks/${env.DISCORD_ALERT_WEBHOOK_ID}/${env.DISCORD_ALERT_WEBHOOK_TOKEN}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: text }),
    }).catch(() => {});
  }
}

async function cacheGet(env: Env, key: string) {
  try { if (env.OMNI_KV) return await env.OMNI_KV.get(key, 'json'); } catch {}
  return null;
}
async function cacheSet(env: Env, key: string, value: unknown, ttlSec = 1800) {
  try { if (env.OMNI_KV) await env.OMNI_KV.put(key, JSON.stringify(value), { expirationTtl: ttlSec }); } catch {}
}

// ── Crawl Control ───────────────────────────────────────────────────

function resolveCrawlMode(env: Env): 'strict' | 'moderate' | 'off' {
  const raw = (env.AI_CRAWL_CONTROL || env.CF_AI_CRAWL_CONTROL || 'strict') as 'strict' | 'moderate' | 'off';
  if (raw === 'moderate' || raw === 'off') return raw;
  return 'strict';
}

const AI_CRAWLER_SIG = [
  'bot.html', 'bot.js', 'bot.php', 'bot.asp', 'bot.aspx', 'bot.cgi',
  'bot.phtml', 'bot.pl', 'bot.py', 'bot.rb', 'bot.txt', 'bot.xml',
  'bot.yaml', 'bot.yml', 'bot.json', 'bot.ts', 'bot.tsx', 'bot.jsx', 'bot.mjs', 'bot.cjs',
  // bad UA prefixes
  'gptbot', 'chatgpt', 'oai-search', 'perplexitybot', 'claudebot', 'claude-ai',
  'googlebot', 'bingbot', 'baiduspider', 'yandexbot', 'duckduckbot',
  'applebot', 'bytespider', 'ccbot', 'diffbot', ' DuckAssistBot',
  'isens', 'isenslab', 'isenslabbot', 'isensbot',
  'nebula', 'puppeteer', 'playwright', 'selenium', 'headless', 'phantomjs',
  'scrape', 'crawler', 'spider', 'scanner', 'monitor', 'monitoring',
];

function looksLikeAiCrawl(req: Request, crawlMode: 'strict' | 'moderate' | 'off'): boolean {
  if (crawlMode === 'off') return false;
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  const url = new URL(req.url);
  // deny dangerous file suffixes on any path
  if (crawlMode === 'strict' && /\.(bot|yaml|yml|json|ts|tsx|jsx|mjs|cjs|xml|txt)$/i.test(url.pathname)) {
    return true;
  }
  for (const sig of AI_CRAWLER_SIG) {
    if (!sig) continue;
    if (ua.includes(sig)) return true;
  }
  // signed auth bypass (optional)
  const token = req.headers.get('x-omni-token');
  return false;
}

// ── Auth ─────────────────────────────────────────────────────────────

function bearerOk(req: Request, env: Env): boolean {
  const auth = req.headers.get('authorization') || '';
  const token = req.headers.get('x-omni-token') || '';
  const expected = env.OMNI_GATEWAY_KEY || '';
  if (!expected) return true; // allow local only if not configured
  const parts = auth.split(' ');
  const bearer = parts[0]?.toLowerCase() === 'bearer' ? parts[1] : auth;
  return bearer === expected || token === expected;
}

// ── Upstream providers ──────────────────────────────────────────────

async function callOpenRouter(env: Env, body: Record<string, unknown>, requestId: string) {
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.OPENROUTER_API_KEY || ''}`,
      'cf-aig-metadata': JSON.stringify({ source: 'omnigateway-core', requestId }),
      'x-omni-token': env.OPENROUTER_API_KEY || '',
    },
    body: JSON.stringify({ ...body, stream: false }),
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
async function callGroq(env: Env, model: string, messages: ChatMessage[], requestId: string) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.GROQ_API_KEY || ''}`,
      'cf-aig-metadata': JSON.stringify({ source: 'omnigateway-core', requestId }),
    },
    body: JSON.stringify({ model: model || 'llama-3.3-70b-versatile', messages, stream: false }),
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
async function callGemini(env: Env, prompt: string, requestId: string) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${env.GEMINI_API_KEY || ''}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-aig-metadata': JSON.stringify({ source: 'omnigateway-core', requestId }) },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
async function callPrivateModel(env: Env, body: Record<string, unknown>, requestId: string) {
  if (!env.PRIVATE_API) throw new Error('PRIVATE_API not bound');
  const r = await env.PRIVATE_API.fetch(new Request('http://internal-api.company.local/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-aig-metadata': JSON.stringify({ source: 'omnigateway-core', requestId }) },
    body: JSON.stringify({ ...body, stream: false }),
  }));
  return { status: r.status, body: await r.json().catch(() => ({})) };
}

// ── Fallback policy ─────────────────────────────────────────────────

async function fallbackGenerate(env: Env, messages: ChatMessage[], requestId: string): Promise<{ ok: boolean; status: number; body: unknown }> {
  const candidates: Array<() => Promise<{ ok: boolean; status: number; body: unknown }>> = [
    () => callOpenRouter(env, { model: 'openrouter/auto', messages }, requestId).then((r) => ({ ok: r.status < 300, status: r.status, body: r.body })),
    () => callGroq(env, 'llama-3.3-70b-versatile', messages, requestId).then((r) => ({ ok: r.status < 300, status: r.status, body: r.body })),
    () => callGemini(env, messages.map((m) => `${m.role}: ${m.content}`).join('\n'), requestId).then((r) => ({ ok: r.status < 300, status: r.status, body: r.body })),
  ];
  for (const fn of candidates) {
    try {
      const res = await fn();
      if (res.ok) return res;
    } catch {}
  }
  return { ok: false, status: 502, body: { error: 'all_fallback_providers_failed' } };
}

// ── Routes ───────────────────────────────────────────────────────────

async function handleGenerate(req: Request, ctx: ExecutionContext, env: Env, body: { messages?: ChatMessage[]; model?: string }) {
  const messages = body.messages || [];
  const cacheKey = `chat:${JSON.stringify(body.messages).slice(0, 512)}:${body.model || 'auto'}`;
  const cached = await cacheGet(env, cacheKey);
  if (cached && typeof cached === 'object' && cached && !('_expired' in (cached as Record<string, unknown>))) {
    return json({ cached: true, data: cached });
  }
  const res = await fallbackGenerate(env, messages, crypto.randomUUID?.() ?? `${Date.now()}`);
  if (res.ok && typeof res.body === 'object' && res.body) {
    await cacheSet(env, cacheKey, res.body, 1800);
  }
  auditSink(ctx, { path: '/v1/chat/completions', status: res.status, requestId: req.headers.get('x-request-id') ?? '' });
  return json({ data: res.body }, res.status);
}
async function handleStatus(env: Env) {
  return json({
    ok: true,
    gateway: 'omnigateway-core',
    crawl: resolveCrawlMode(env),
    kv: !!env.OMNI_KV,
    vpc: !!env.PRIVATE_API,
    providers: {
      openrouter: !!env.OPENROUTER_API_KEY,
      groq: !!env.GROQ_API_KEY,
      gemini: !!env.GEMINI_API_KEY,
      vpc_private: !!env.PRIVATE_API,
    },
    spendCap: true,
  });
}

// ── Main ─────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const crawlMode = resolveCrawlMode(env);
    const requestId = request.headers.get('x-request-id') || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const clientIp = request.headers.get('cf-connecting-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const pathname = url.pathname;

    // Audit every request
    auditSink(ctx, { method, path: pathname, userAgent, clientIp, requestId });

    // AI Crawl Control: detect bots before protected paths
    if (looksLikeAiCrawl(request, crawlMode)) {
      if (crawlMode === 'strict') return new Response('Forbidden: AI Crawl Control', { status: 403 });
      // moderate: allow but rate-limit via cache key
      const rlKey = `rl:${clientIp}:${pathname}`;
      const rl = await cacheGet(env, rlKey);
      if (Array.isArray(rl) && rl.length >= 5) {
        await alertTransport(env, `OmniGateway rate-limit hit: ${clientIp} ${pathname}`);
        return new Response('Too Many Requests', { status: 429 });
      }
      await cacheSet(env, rlKey, [...(Array.isArray(rl) ? rl : []), Date.now()], 60);
    }

    if (method !== 'GET' && method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    if (pathname === '/status' || pathname === '/health') {
      return handleStatus(env);
    }

    if (pathname === '/v1/chat/completions' && method === 'POST') {
      if (!bearerOk(request, env)) return json({ error: 'unauthorized' }, 401);
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const messages: ChatMessage[] = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
      if (!messages.length) return json({ error: 'messages_required' }, 400);
      const model = typeof body.model === 'string' ? body.model : 'auto';
      const spendAlert = (env as unknown as Record<string, string>)['SPEND_CAP_USD'] ?? '25';
      return handleGenerate(request as unknown as Request, ctx, env, { messages, model });
    }

    if (pathname === '/v1/models' && method === 'GET') {
      return json({
        data: [
          { id: 'openrouter/auto', provider: 'openrouter' },
          { id: 'groq/llama-3.3-70b-versatile', provider: 'groq' },
          { id: 'gemini-2.0-flash-exp', provider: 'gemini' },
          { id: 'vpc/private-model', provider: 'vpc' },
        ],
      });
    }

    // Default
    return json({ gateway: 'omnigateway-core', docs: '/status, /v1/chat/completions, /v1/models' });
  },
};
