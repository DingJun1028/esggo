// ═══════════════════════════════════════════════════════════════
// ESGGO Smart AI Router — Cloudflare Workers 入口
// wrangler.toml: main = "worker/src/index.ts"
// 邊界：只做 WSGI 層職責（驗證/CORS/速率限制/observability/admin），
// 不重寫路由；AI 路由委派到 src/core/ai/model-router.ts。
// ═══════════════════════════════════════════════════════════════

import { z } from 'zod';
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
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_TOKEN?: string;
  GROQ_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  TOGETHER_API_KEY?: string;
  MISTRAL_API_KEY?: string;
  GEMINI_API_KEY?: string;
  VPS_OLLAMA_URL?: string;
  VPS_OLLAMA_USER?: string;
  VPS_OLLAMA_PASS?: string;
  FREE_MODELS_KV?: unknown;
}

// ── 安全上限 / 策略常數 ──────────────────────────────────────
const MAX_BODY_BYTES = 64 * 1024;
const MAX_TOKENS_CAP = 4096;
const RATE_LIMIT_REQUESTS = 60;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_BURST = 120;
const REQUEST_TIMEOUT_MS = 120_000;
const ADMIN_PROBE_CONCURRENCY = Math.max(1, Math.min(Number(process.env.WORKER_ADMIN_CONCURRENCY ?? 4) || 4, 8));

// source token 白名單；空集合 = 白名單關閉（避免 dev 卡住）
const ALLOWED_SOURCE_TOKENS = new Set(
  (process.env.WORKER_ALLOWED_SOURCE_TOKENS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

// ── Schema / Error Envelope ─────────────────────────────────
const ChatRequestSchema = z.object({
  message: z.string().min(1, 'message is required'),
  taskType: z.string().max(120, 'taskType is too long').optional(),
});

const ErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SOURCE_INVALID: 'SOURCE_INVALID',
  ROUTING_FAILED: 'ROUTING_FAILED',
} as const;

type AppErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

interface StandardErrorPayload {
  ok: false;
  error: string;
  code: AppErrorCode;
  detail?: string;
  taskType?: string;
  requestId: string;
}

interface StandardSuccessPayload<T> {
  ok: true;
  data: T;
  requestId: string;
}

type ApiEnvelope<T> = StandardSuccessPayload<T> | StandardErrorPayload;

// ── 可觀測性／結構化 logger（worker 內建，無外部相依；近似 Pino style） ──
interface LogField {
  reqId?: string;
  method?: string;
  path?: string;
  status?: number;
  ip?: string;
  taskType?: string;
  detail?: string;
  provider?: string;
  model?: string;
  durationMs?: number;
  ok?: boolean;
  [key: string]: unknown;
}

const REDACT_KEYS = new Set([
  'authorization',
  'authorization.bearer',
  'bearer',
  'apiKey',
  'api_key',
  'apikey',
  'token',
  'access_token',
  'id_token',
  'secret',
  'password',
  'pass',
  'basic',
  'cloudflare_api_token',
  'groq_api_key',
  'openrouter_api_key',
  'together_api_key',
  'mistral_api_key',
  'gemini_api_key',
  'vps_ollama_pass',
]);

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const lk = k.toLowerCase();
    if (REDACT_KEYS.has(lk)) {
      out[k] = '[REDACTED]';
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = redact(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function emitLog(level: 'info' | 'warn' | 'error', msg: string, fields: LogField = {}): void {
  const entry = redact({
    service: 'esggo-smart-ai-router',
    level,
    msg,
    ...fields,
  });
  const out = JSON.stringify(entry);
  if (level === 'error') console.error(out);
  else if (level === 'warn') console.warn(out);
  else console.info(out);
}

function createRequestLogger(reqId: string, current?: { method?: string; path?: string; status?: number; ip?: string }) {
  return {
    info(msg: string, fields: LogField = {}) {
      emitLog('info', msg, { reqId, ...current, ...fields });
    },
    warn(msg: string, fields: LogField = {}) {
      emitLog('warn', msg, { reqId, ...current, ...fields });
    },
    error(msg: string, fields: LogField = {}) {
      emitLog('error', msg, { reqId, ...current, ...fields });
    },
  };
}

// ── 可觀測性 / 日誌 ─────────────────────────────────────────
function createRequestId(): string {
  const id = crypto.randomUUID();
  const hex = id.replace(/-/g, '').slice(0, 12);
  return Number.parseInt(hex, 16).toString(36);
}

function createObservabilityHeaders(
  reqId: string,
  status: number,
  extra: Record<string, string> = {},
  route?: { taskType?: string; strategy?: string } | null,
  used?: { provider?: string; model?: string } | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    ...extra,
    'x-esggo-request-id': reqId,
    'x-esggo-status': String(status),
    'x-esggo-trace': 'smart-ai-router',
  };
  if (route?.taskType) headers['x-esggo-task'] = route.taskType;
  if (route?.strategy) headers['x-esggo-strategy'] = route.strategy;
  if (used?.provider) headers['x-esggo-used-provider'] = used.provider;
  if (used?.model) headers['x-esggo-used-model'] = used.model;
  return headers;
}

function logApi(
  reqId: string,
  method: string,
  path: string,
  status: number,
  level: 'info' | 'warn' | 'error',
  msg: string,
  meta: Record<string, unknown> = {},
): void {
  const entry = {
    ts: new Date().toISOString(),
    reqId,
    method,
    path,
    status,
    level,
    msg,
    ...meta,
  } as Record<string, unknown>;
  const out = JSON.stringify(entry);
  if (level === 'error') console.error(out);
  else if (level === 'warn') console.warn(out);
  else console.info(out);
}

// ── Auth / Rate Limit / IP ──────────────────────────────────
function sourceAuthorizationStatus(token: string | null): { ok: boolean; detail?: string } {
  if (!token) {
    return { ok: false, detail: 'missing source token' };
  }
  if (ALLOWED_SOURCE_TOKENS.size === 0) {
    return { ok: true };
  }
  if (!ALLOWED_SOURCE_TOKENS.has(token)) {
    return { ok: false, detail: 'source not allowed' };
  }
  return { ok: true };
}

function extractSourceToken(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function validateSource(token: string | null): { ok: boolean; detail?: string } {
  return sourceAuthorizationStatus(token);
}

function rateKey(ip: string): string {
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  return `rate:${ip}:${Math.floor(Date.now() / windowMs)}`;
}

function burstKey(ip: string): string {
  const windowMs = 10_000;
  return `burst:${ip}:${Math.floor(Date.now() / windowMs)}`;
}

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  const kv = env.FREE_MODELS_KV as
    | { get?: (key: string) => Promise<string | null>; put?: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void> }
    | undefined;
  if (!kv || typeof kv.get !== 'function' || typeof kv.put !== 'function') {
    return true;
  }

  const [rawWindow, rawBurst] = await Promise.all([
    kv.get(rateKey(ip)).catch(() => null),
    kv.get(burstKey(ip)).catch(() => null),
  ]);
  const windowCount = rawWindow ? Number(rawWindow) : 0;
  const burstCount = rawBurst ? Number(rawBurst) : 0;

  if (burstCount >= RATE_LIMIT_BURST) {
    return false;
  }

  if (windowCount >= RATE_LIMIT_REQUESTS) {
    return false;
  }

  await Promise.all([
    kv.put(rateKey(ip), String(windowCount + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS }).catch(() => undefined),
    kv.put(burstKey(ip), String(burstCount + 1), { expirationTtl: 10 }).catch(() => undefined),
  ]);
  return true;
}

function clientIp(request: Request): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;
  return 'unknown';
}

// ── Env Hydration ───────────────────────────────────────────
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

// ── Response helpers ────────────────────────────────────────
function corsHeaders(reqId: string, status: number, extra: Record<string, string> = {}): Record<string, string> {
  return {
    ...extra,
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    'access-control-expose-headers': 'x-esggo-request-id, x-esggo-status, x-esggo-task, x-esggo-used-provider, x-esggo-used-model',
  };
}

function buildHeaders(reqId: string, status: number, route?: { taskType?: string; strategy?: string } | null, used?: { provider?: string; model?: string } | null): Record<string, string> {
  return createObservabilityHeaders(reqId, status, corsHeaders(reqId, status), route, used);
}

function jsonResponse(body: ApiEnvelope<unknown>, status: number, reqId: string, route?: { taskType?: string; strategy?: string } | null, used?: { provider?: string; model?: string } | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: buildHeaders(reqId, status, route, used),
  });
}

function successResponse<T>(reqId: string, data: T, status: number, route?: { taskType?: string; strategy?: string } | null, used?: { provider?: string; model?: string } | null): Response {
  return jsonResponse({ ok: true, data, requestId: reqId }, status, reqId, route, used);
}

function errorResponse(reqId: string, code: AppErrorCode, status: number, detail?: string, taskType?: string): Response {
  return jsonResponse({ ok: false, error: code, code, detail, taskType, requestId: reqId }, status, reqId);
}

// ── Parse helpers ───────────────────────────────────────────
async function parseJsonBody(request: Request): Promise<unknown> {
  const text = await request.text();
  const len = request.headers.get('content-length');
  const declared = len ? Number(len) : undefined;
  if (typeof declared === 'number' && Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    throw { code: 'PAYLOAD_TOO_LARGE' as AppErrorCode, status: 413, detail: 'payload too large' };
  }
  if (text.length > MAX_BODY_BYTES) {
    throw { code: 'PAYLOAD_TOO_LARGE' as AppErrorCode, status: 413, detail: 'payload too large' };
  }
  try {
    return JSON.parse(text);
  } catch {
    throw { code: 'BAD_REQUEST' as AppErrorCode, status: 400, detail: 'invalid JSON body' };
  }
}

// ── Admin: provider resolver / probe ────────────────────────
function resolveProviderAlias(alias: string): FreeProviderConfig | null {
  const key = alias.trim().toLowerCase();
  if (key.startsWith('local_gemma') || key.startsWith('esggo-gemma') || key === 'gemma4') {
    return {
      id: alias.trim(),
      provider: 'local_gemma',
      model: alias.trim(),
      maxTokens: 32,
      temperature: 0,
      apiUrl: process.env.VPS_OLLAMA_URL || 'https://omniagent.esggo.co/ollama/api/chat',
      apiKeyEnv: '',
      isFreeTier: true,
    };
  }
  if (key.startsWith('groq_') || key.startsWith('groq/')) {
    return { id: alias.trim(), provider: 'groq', model: alias.trim(), maxTokens: 32, temperature: 0, apiUrl: 'https://api.groq.com/openai/v1/chat/completions', apiKeyEnv: 'GROQ_API_KEY', isFreeTier: false };
  }
  if (key.startsWith('or_') || key.startsWith('openrouter/')) {
    return { id: alias.trim(), provider: 'openrouter', model: alias.trim(), maxTokens: 32, temperature: 0, apiUrl: 'https://openrouter.ai/api/v1/chat/completions', apiKeyEnv: 'OPENROUTER_API_KEY', isFreeTier: false };
  }
  if (key.startsWith('cf_') || key.startsWith('@cf/')) {
    return { id: alias.trim(), provider: 'cloudflare', model: alias.trim(), maxTokens: 32, temperature: 0, apiUrl: 'cloudflare', apiKeyEnv: 'CLOUDFLARE_API_TOKEN', isFreeTier: false };
  }
  if (key.startsWith('tg_') || key.startsWith('together/')) {
    return { id: alias.trim(), provider: 'together', model: alias.trim(), maxTokens: 32, temperature: 0, apiUrl: 'https://api.together.xyz/v1/chat/completions', apiKeyEnv: 'TOGETHER_API_KEY', isFreeTier: false };
  }
  if (key.startsWith('mistral_') || key.startsWith('mistral/')) {
    return { id: alias.trim(), provider: 'mistral', model: alias.trim(), maxTokens: 32, temperature: 0, apiUrl: 'https://api.mistral.ai/v1/chat/completions', apiKeyEnv: 'MISTRAL_API_KEY', isFreeTier: false };
  }
  if (key.startsWith('gemini')) {
    return { id: alias.trim(), provider: 'gemini', model: alias.trim(), maxTokens: 32, temperature: 0, apiUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', apiKeyEnv: 'GEMINI_API_KEY', isFreeTier: false };
  }
  return null;
}

function providerEndpoint(modelConfig: FreeProviderConfig): string {
  if (modelConfig.apiUrl === 'cloudflare' && process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
    return `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${modelConfig.model}`;
  }
  return process.env.VPS_OLLAMA_URL || modelConfig.apiUrl;
}

async function sendProviderMessage(
  provider: string,
  model: string,
  messages: ChatMessage[],
  options: {
    maxTokens: number;
    temperature: number;
    timeoutMs: number;
    endpoint: string;
    apiKey?: string;
  },
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1_000, Math.min(options.timeoutMs, REQUEST_TIMEOUT_MS)));
  try {
    const body = JSON.stringify({
      model,
      messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
    });
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (options.apiKey) headers['authorization'] = `Bearer ${options.apiKey}`;

    const response = await fetch(options.endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers,
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`${provider}/${model} HTTP ${response.status}: ${text}`);
    }

    const text = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`${provider}/${model}: invalid JSON`);
    }
    const root = parsed as Record<string, unknown>;
    const choices = (root['choices'] as Record<string, unknown>[] | undefined) ?? [];
    const message = (choices[0] as Record<string, unknown> | undefined)?.['message'] as Record<string, unknown> | undefined;
    const result = (root['result'] as Record<string, unknown> | undefined)?.['response'];
    const content = (message?.['content'] as string | undefined) ?? (result as string | undefined);
    if (typeof content !== 'string' || !content) {
      throw new Error(`${provider}/${model}: empty response`);
    }
    return content;
  } finally {
    clearTimeout(timer);
  }
}

async function probeProvider(reqId: string, modelConfig: FreeProviderConfig): Promise<{ provider: string; model: string; ok: boolean; detail?: string }> {
  const started = Date.now();
  try {
    const endpoint = providerEndpoint(modelConfig);
    let detail = 'ok';
    let ok = false;
    try {
      const apiKey = modelConfig.apiKeyEnv ? process.env[modelConfig.apiKeyEnv] : undefined;
      const text = await sendProviderMessage(modelConfig.provider, modelConfig.model, [{ role: 'user', content: 'hi' }], {
        maxTokens: 32,
        temperature: 0,
        timeoutMs: REQUEST_TIMEOUT_MS,
        endpoint,
        apiKey,
      });
      ok = Boolean(text);
      if (!ok) detail = 'empty response';
    } catch (e) {
      detail = e instanceof Error ? e.message : String(e);
    }
    console.error(JSON.stringify({ service: 'esggo-smart-ai-router', level: 'info', msg: 'provider.probe', reqId, provider: modelConfig.provider, model: modelConfig.model, ok, durationMs: Date.now() - started, detail }));
    return { provider: modelConfig.provider, model: modelConfig.model, ok, detail };
  } catch (e) {
    const detail = e instanceof Error ? e.message : 'probe failed';
    return { provider: modelConfig.provider, model: modelConfig.model, ok: false, detail };
  }
}

// ── Admin handlers 開放給開發者批次驗證 provider ───────────
async function handleAdminProbe(reqId: string, request: Request): Promise<Response> {
  const token = extractSourceToken(request);
  const source = sourceAuthorizationStatus(token);
  if (!source.ok) {
    return Promise.resolve(errorResponse(reqId, ErrorCode.SOURCE_INVALID, 401, source.detail));
  }
  const parsed = await parseJsonBody(request).catch((p) => p);
  if ((parsed as { code?: string })?.code) {
    return errorResponse(reqId, (parsed as { code: AppErrorCode }).code, (parsed as { status?: number }).status ?? 400, (parsed as { detail?: string }).detail);
  }
  const providers = Array.isArray((parsed as { providers?: unknown[] })?.providers)
    ? (parsed as { providers?: unknown[] }).providers!.map((p) => String(p)).filter(Boolean)
    : [];
  if (!providers.length) {
    return errorResponse(reqId, ErrorCode.BAD_REQUEST, 400, 'providers is required');
  }
  const results: Array<{ provider: string; model: string; ok: boolean; detail?: string }> = [];
  for (const alias of providers.slice(0, 16)) {
    const resolved = resolveProviderAlias(alias);
    if (!resolved) {
      results.push({ provider: alias, model: alias, ok: false, detail: 'unknown provider alias' });
      continue;
    }
    results.push(await probeProvider(reqId, resolved));
  }
  return successResponse(reqId, results, 200);
}

async function handleAdminBatchVerify(reqId: string, request: Request): Promise<Response> {
  const token = extractSourceToken(request);
  const source = sourceAuthorizationStatus(token);
  if (!source.ok) {
    return Promise.resolve(errorResponse(reqId, ErrorCode.SOURCE_INVALID, 401, source.detail));
  }
  const parsed = await parseJsonBody(request).catch((p) => p);
  if ((parsed as { code?: string })?.code) {
    return errorResponse(reqId, (parsed as { code: AppErrorCode }).code, (parsed as { status?: number }).status ?? 400, (parsed as { detail?: string }).detail);
  }
  const providers = Array.isArray((parsed as { providers?: unknown[] })?.providers)
    ? (parsed as { providers?: unknown[] }).providers!.map((p) => String(p)).filter(Boolean)
    : [];
  const maxConcurrency = Math.max(1, Number((parsed as { maxConcurrency?: number })?.maxConcurrency ?? ADMIN_PROBE_CONCURRENCY) || ADMIN_PROBE_CONCURRENCY);
  if (!providers.length) {
    return errorResponse(reqId, ErrorCode.BAD_REQUEST, 400, 'providers is required');
  }

  const semaphore = Math.min(maxConcurrency, providers.length);
  let active = 0;
  const results: Array<{ alias: string; provider: string; model: string; ok: boolean; detail?: string }> = [];

  for (const alias of providers.slice(0, 16)) {
    await new Promise<void>((resolve) => {
      const tick = () => {
        if (active < semaphore) resolve();
        else setTimeout(tick, 1);
      };
      tick();
    });
    const task = (async () => {
      active += 1;
      try {
        const resolved = resolveProviderAlias(alias);
        if (!resolved) {
          results.push({ alias, provider: alias, model: alias, ok: false, detail: 'unknown provider alias' });
          return;
        }
        const endpoint = providerEndpoint(resolved);
        const apiKey = resolved.apiKeyEnv ? process.env[resolved.apiKeyEnv] : undefined;
        const text = await sendProviderMessage(resolved.provider, resolved.model, [{ role: 'user', content: 'ok' }], {
          maxTokens: 1,
          temperature: 0,
          timeoutMs: REQUEST_TIMEOUT_MS,
          endpoint,
          apiKey,
        });
        results.push({ alias, provider: resolved.provider, model: resolved.model, ok: Boolean(text), detail: text ? undefined : 'empty response' });
      } catch (e) {
        results.push({ alias, provider: alias, model: alias, ok: false, detail: e instanceof Error ? e.message : String(e) });
      } finally {
        active -= 1;
      }
    })();
    await task;
  }

  await new Promise<void>((resolve) => {
    const tick = () => (active > 0 ? setTimeout(tick, 1) : resolve());
    tick();
  });
  return successResponse(reqId, results, 200);
}

// ── Health ──────────────────────────────────────────────────
function handleHealthCheck(reqId: string, env: Env): Response {
  const payload = {
    ok: true,
    service: 'esggo-smart-ai-router',
    version: env.SMART_ROUTER_VERSION ?? '2.0.0-beta.1',
    environment: env.ENVIRONMENT ?? 'production',
    envReady: Boolean(
      env.ENVIRONMENT &&
        env.SMART_ROUTER_VERSION &&
        env.GROQ_API_KEY &&
        env.OPENROUTER_API_KEY &&
        env.CLOUDFLARE_ACCOUNT_ID &&
        env.CLOUDFLARE_API_TOKEN,
    ),
    capacity: { maxBodyBytes: MAX_BODY_BYTES, maxTokensCap: MAX_TOKENS_CAP, rateLimitRequests: RATE_LIMIT_REQUESTS, rateLimitWindowSeconds: RATE_LIMIT_WINDOW_SECONDS },
    timestamp: Date.now(),
    requestId: reqId,
  };
  return successResponse(reqId, payload, 200);
}

function handleRouteInfo(reqId: string, env: Env): Response {
  const payload = {
    service: 'esggo-smart-ai-router',
    version: env.SMART_ROUTER_VERSION ?? '2.0.0-beta.1',
    endpoints: {
      'POST /v1/chat': 'body: { message: string, taskType?: string } -> free model inference',
      'GET /healthz': 'health check',
      'POST /admin/probe': 'provider probe (source token required)',
      'POST /admin/batch-verify': 'batch verifier (source token required)',
    },
  };
  return successResponse(reqId, payload, 200);
}

// ── Chat handler ────────────────────────────────────────────
async function callChatAndBuildResponse(reqId: string, request: Request, env: Env): Promise<Response> {
  let parsed: z.infer<typeof ChatRequestSchema>;
  try {
    const body = await parseJsonBody(request);
    parsed = ChatRequestSchema.parse(body);
  } catch (e) {
    if ((e as { code?: AppErrorCode })?.code) {
      const err = e as { code: AppErrorCode; status: number; detail?: string };
      return errorResponse(reqId, err.code, err.status, err.detail);
    }
    const detail = e instanceof z.ZodError ? e.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ') : 'invalid request';
    return errorResponse(reqId, ErrorCode.BAD_REQUEST, 400, detail);
  }

  const message = (parsed.message ?? '').trim();
  if (!message) {
    return errorResponse(reqId, ErrorCode.BAD_REQUEST, 400, 'missing message');
  }

  const providedTaskType = parsed.taskType?.trim();
  const taskType = providedTaskType && providedTaskType.length > 0 ? providedTaskType : inferTaskType(message);
  const routing = routeModel(taskType);
  const messages: ChatMessage[] = [{ role: 'user', content: message }];
  const options: FreeProviderOptions = { maxTokens: MAX_TOKENS_CAP, temperature: 0.4, timeoutMs: REQUEST_TIMEOUT_MS };

  const started = Date.now();
  const chatLogger = createRequestLogger(reqId, { method: 'POST', path: '/v1/chat', ip: clientIp(request) });
  try {
    const { content, used } = await callFreeProvider(taskType, messages, options);
    const usedCfg = used as FreeProviderConfig;
    const routeMeta: { taskType?: string; strategy?: string } = { taskType: routing.taskType, strategy: routing.strategy };
    const usedMeta: { provider?: string; model?: string } = { provider: usedCfg.provider, model: usedCfg.model };
    chatLogger.info('inference.success', { taskType: routing.taskType, provider: usedCfg.provider, model: usedCfg.model, durationMs: Date.now() - started });
    const payload = { taskType: routing.taskType, strategy: routing.strategy, used: usedCfg, response: content };
    const res = successResponse(reqId, payload, 200, routeMeta, usedMeta);
    chatLogger.info('response', { status: res.status, ok: res.status < 400 });
    return res;
  } catch (e) {
    const detail = e instanceof Error ? e.message : 'unknown routing error';
    chatLogger.error('inference.failed', { taskType, detail, durationMs: Date.now() - started });
    const res = errorResponse(reqId, ErrorCode.ROUTING_FAILED, 502, detail, taskType);
    chatLogger.info('response', { status: res.status, ok: res.status < 400 });
    return res;
  }
}

// ── Main entry ──────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const reqId = createRequestId();
    hydrateEnv(env);
    const logger = createRequestLogger(reqId);

    if (request.method === 'OPTIONS') {
      logger.info('request', { method: request.method, path: new URL(request.url).pathname, status: 204, ip: clientIp(request) });
      return new Response(null, { status: 204, headers: buildHeaders(reqId, 204) });
    }

    const url = new URL(request.url);

    if (url.pathname === '/healthz' || url.pathname === '/health') {
      logger.info('request', { method: request.method, path: url.pathname, status: 200, ip: clientIp(request) });
      return handleHealthCheck(reqId, env);
    }

    if (url.pathname === '/' || url.pathname === '/api') {
      logger.info('request', { method: request.method, path: url.pathname, status: 200, ip: clientIp(request) });
      return handleRouteInfo(reqId, env);
    }

    if (url.pathname === '/admin/probe' && request.method === 'POST') {
      const ip = clientIp(request);
      const logger = createRequestLogger(reqId);
      logger.info('request', { method: request.method, path: url.pathname, ip });
      const res = await handleAdminProbe(reqId, request);
      logger.info('response', { method: request.method, path: url.pathname, status: res.status, ip, ok: res.status < 400 });
      return res;
    }

    if (url.pathname === '/admin/batch-verify' && request.method === 'POST') {
      const ip = clientIp(request);
      logger.info('request', { method: request.method, path: url.pathname, ip });
      const res = await handleAdminBatchVerify(reqId, request);
      logger.info('response', { method: request.method, path: url.pathname, status: res.status, ip, ok: res.status < 400 });
      return res;
    }

    if (url.pathname === '/v1/chat' && request.method === 'POST') {
      const token = extractSourceToken(request);
      const source = sourceAuthorizationStatus(token);
      if (!source.ok) {
        logger.warn('source_invalid', { ip: clientIp(request) });
        return errorResponse(reqId, ErrorCode.SOURCE_INVALID, 401, source.detail);
      }

      const ip = clientIp(request);
      const allowed = await checkRateLimit(env, ip);
      if (!allowed) {
        logger.warn('rate_limit', { ip });
        return errorResponse(reqId, ErrorCode.RATE_LIMIT_EXCEEDED, 429, 'Too many requests');
      }

      logger.info('request', { method: request.method, path: url.pathname, ip });
      const res = await callChatAndBuildResponse(reqId, request, env);
      logger.info('response', { method: request.method, path: url.pathname, status: res.status, ip, ok: res.status < 400 });
      return res;
    }

    logger.warn('not_found', { method: request.method, path: url.pathname, ip: clientIp(request) });
    return errorResponse(reqId, ErrorCode.BAD_REQUEST, 404, `not found: ${url.pathname}`);
  },
};
