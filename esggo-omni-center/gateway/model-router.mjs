/**
 * ESGGO Smart Model Router (Gateway Version)
 * 根據 ESG 任務類型自動選擇最佳免費模型
 */

// ── 任務類型推斷 ─────────────────────────────────────────────
export function inferTaskType(message) {
  const lowerMsg = (message || '').toLowerCase();

  if (lowerMsg.match(/碳排|carbon|ghg|排放量|iso.?14064|scope/)) return 'carbon_calculation';
  if (lowerMsg.match(/合規|compliance|csrd|gri.??報告|法規|審查/)) return 'compliance_review';
  if (lowerMsg.match(/tcfd|氣候|climate|風險分析|淨零|net.?zero/)) return 'tcfd_analysis';
  if (lowerMsg.match(/sdg|永續發展目標|聯合國/)) return 'sdg_mapping';
  if (lowerMsg.match(/重大性|materiality|矩陣|priority/)) return 'materiality_matrix';
  if (lowerMsg.match(/ocr|帳單|收據|發票|提取|extract/)) return 'evidence_ocr';
  if (lowerMsg.match(/問卷|survey|利害關係人|stakeholder|分析/)) return 'stakeholder_analysis';
  if (lowerMsg.match(/報告|report|draft|草稿|撰寫/)) return 'gri_report_draft';
  if (lowerMsg.match(/修復|fix|bug|debug|error|錯誤/)) return 'omni_jules_heal';
  if (lowerMsg.match(/郵件|email|歸檔|archive/)) return 'email_archival';
  if (lowerMsg.match(/蜂群|swarm|orchestrat|調度|協調/)) return 'swarm_orchestration';

  return 'general';
}

// ── 模型配置 ─────────────────────────────────────────────────
// 共 21 個模型，分佈 7 個 Provider
const MODELS = {
  // Groq (速度王, 30 req/min)
  groq_llama70b: { provider: 'groq', model: 'llama-3.3-70b-versatile', maxTokens: 256, temperature: 0.7 },
  groq_llama8b:  { provider: 'groq', model: 'llama-3.1-8b-instant',    maxTokens: 256, temperature: 0.5 },
  groq_gemma:    { provider: 'groq', model: 'gemma2-9b-it',            maxTokens: 256, temperature: 0.6 },

  // OpenRouter :free (品質王, 200 req/day)
  or_qwen80b:    { provider: 'openrouter', model: 'qwen/qwen3-next-80b-a3b-instruct:free',    maxTokens: 512, temperature: 0.7 },
  or_llama90b:   { provider: 'openrouter', model: 'meta-llama/llama-3.2-90b-vision:free',     maxTokens: 512, temperature: 0.7 },
  or_llama70b:   { provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct:free',   maxTokens: 256, temperature: 0.7 },
  or_mistral24b: { provider: 'openrouter', model: 'mistralai/mistral-small-3.1-24b:free',     maxTokens: 256, temperature: 0.6 },
  or_gemma31b:   { provider: 'openrouter', model: 'google/gemma-4-31b-it:free',               maxTokens: 512, temperature: 0.6 },
  or_deepseek_r1:    { provider: 'openrouter', model: 'deepseek/deepseek-r1:free',           maxTokens: 512, temperature: 0.6 },
  or_phi4:          { provider: 'openrouter', model: 'microsoft/phi-4:free',                 maxTokens: 256, temperature: 0.5 },
  or_gemini20_flash: { provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free',    maxTokens: 512, temperature: 0.7 },
  or_gemma212b:     { provider: 'openrouter', model: 'google/gemma-2-12b-it:free',           maxTokens: 256, temperature: 0.6 },
  or_commandr_plus: { provider: 'openrouter', model: 'cohere/command-r-plus-08-2024:free',   maxTokens: 512, temperature: 0.7 },

  // Cloudflare AI Workers (全球邊緣, 10K req/day)
  cf_llama70b:   { provider: 'cloudflare', model: '@cf/meta/llama-3.3-70b-instruct-fp16',    maxTokens: 256, temperature: 0.7 },
  cf_llama8b:    { provider: 'cloudflare', model: '@cf/meta/llama-3.1-8b-instruct-fp16',     maxTokens: 256, temperature: 0.5 },
  cf_mistral7b:  { provider: 'cloudflare', model: '@cf/mistralai/mistral-7b-instruct-v0.2', maxTokens: 256, temperature: 0.6 },

  // Together.ai (高品質, $25/月免費額度)
  tg_llama70b:   { provider: 'together', model: 'meta-llama/Llama-3-70b-chat-hf',           maxTokens: 512, temperature: 0.7 },
  tg_qwen72b:    { provider: 'together', model: 'Qwen/Qwen2.5-72B-Instruct-Turbo',         maxTokens: 512, temperature: 0.7 },

  // Mistral AI (歐洲品質)
  mistral_large: { provider: 'mistral', model: 'mistral-large-latest', maxTokens: 512, temperature: 0.7 },
  mistral_small: { provider: 'mistral', model: 'mistral-small-latest', maxTokens: 256, temperature: 0.6 },

  // Local VPS Hosting (Gemma 3 4B - 100% Free, Private)
  vps_gemma:      { provider: 'local_gemma', model: 'gemma3:4b',             maxTokens: 4096,  temperature: 0.7 },
};

// ── 路由表 ───────────────────────────────────────────────────
// 每個任務 3 個 fallback，跨 Provider 確保可用性
const ROUTING_TABLE = {
  carbon_calculation:    { primary: MODELS.groq_llama70b, fallback1: MODELS.or_qwen80b,     fallback2: MODELS.vps_gemma },
  compliance_review:     { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b,  fallback2: MODELS.vps_gemma },
  gri_report_draft:      { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b,  fallback2: MODELS.vps_gemma },
  tcfd_analysis:         { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b,  fallback2: MODELS.vps_gemma },
  sdg_mapping:           { primary: MODELS.vps_gemma,    fallback1: MODELS.groq_llama70b,    fallback2: MODELS.or_qwen80b },
  materiality_matrix:    { primary: MODELS.or_qwen80b,   fallback1: MODELS.or_llama90b,  fallback2: MODELS.vps_gemma },
  evidence_ocr:          { primary: MODELS.vps_gemma,    fallback1: MODELS.groq_llama8b,    fallback2: MODELS.cf_llama8b },
  email_archival:        { primary: MODELS.vps_gemma,    fallback1: MODELS.groq_llama8b,    fallback2: MODELS.cf_llama8b },
  stakeholder_analysis:  { primary: MODELS.groq_llama70b, fallback1: MODELS.or_qwen80b,    fallback2: MODELS.vps_gemma },
  omni_jules_heal:       { primary: MODELS.or_llama90b, fallback1: MODELS.groq_llama70b, fallback2: MODELS.vps_gemma },
  swarm_orchestration:   { primary: MODELS.vps_gemma,    fallback1: MODELS.groq_llama8b,    fallback2: MODELS.cf_llama8b },
  report_assembly:       { primary: MODELS.or_qwen80b,   fallback1: MODELS.vps_gemma,    fallback2: MODELS.tg_llama70b },
  general:               { primary: MODELS.groq_llama70b, fallback1: MODELS.vps_gemma,    fallback2: MODELS.or_mistral24b },
};

// ── 路由函數 ─────────────────────────────────────────────────
export function routeModel(taskType) {
  const normalizedType = (taskType || 'general').toLowerCase();
  return ROUTING_TABLE[normalizedType] || ROUTING_TABLE.general;
}

export function formatRoutingResult(result, taskType) {
  return `[${taskType}] Primary: ${result.primary.provider}/${result.primary.model} | Fallback1: ${result.fallback1.provider}/${result.fallback1.model} | Fallback2: ${result.fallback2.provider}/${result.fallback2.model}`;
}

// ── Provider 狀態追蹤 ─────────────────────────────────────────
const providerStatus = {};

export function markModelDown(modelId) {
  providerStatus[modelId] = { down: true, lastError: Date.now() };
}

export function isModelUp(modelId) {
  const status = providerStatus[modelId];
  if (!status || !status.down) return true;
  // 5 分鐘後自動恢復
  if (Date.now() - status.lastError > 5 * 60 * 1000) {
    status.down = false;
    return true;
  }
  return false;
}

export function getProviderStatus() {
  return { ...providerStatus };
}

// ── Cloudflare AI Workers API ─────────────────────────────────
export async function callCloudflareAI(model, messages, options = {}) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('Cloudflare credentials not configured');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs || 15000);

  let response;
  try {
    response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          max_tokens: options.maxTokens || 256,
          temperature: options.temperature || 0.7,
          stream: options.stream || false,
        }),
      }
    );
  } catch (e) {
    clearTimeout(timer);
    if (e && e.name === 'AbortError') throw new Error(`Cloudflare AI 逾時 (${options.timeoutMs || 15000}ms)`);
    throw e;
  }
  clearTimeout(timer);

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Cloudflare AI error: ${JSON.stringify(data.errors)}`);
  }

  return data.result;
}

// ── 統計 ─────────────────────────────────────────────────────
export function getModelStats() {
  const providers = {};
  for (const [key, model] of Object.entries(MODELS)) {
    if (!providers[model.provider]) providers[model.provider] = { models: 0, maxTokens: 0 };
    providers[model.provider].models++;
    providers[model.provider].maxTokens = Math.max(providers[model.provider].maxTokens, model.maxTokens);
  }
  return {
    totalModels: Object.keys(MODELS).length,
    providers,
    routingTasks: Object.keys(ROUTING_TABLE).length,
  };
}

// ── Free Provider 代理層（統一免費模型池 + 自動故障轉移）─────────
// 複用本檔既有的 markModelDown / isModelUp / callCloudflareAI（含逾時）。
const PROVIDER_ENDPOINTS = {
  groq:       { apiUrl: 'https://api.groq.com/openai/v1/chat/completions', apiKeyEnv: 'GROQ_API_KEY' },
  openrouter: { apiUrl: 'https://openrouter.ai/api/v1/chat/completions',   apiKeyEnv: 'OPENROUTER_API_KEY' },
  together:   { apiUrl: 'https://api.together.xyz/v1/chat/completions',    apiKeyEnv: 'TOGETHER_API_KEY' },
  mistral:    { apiUrl: 'https://api.mistral.ai/v1/chat/completions',      apiKeyEnv: 'MISTRAL_API_KEY' },
  gemini:     { apiUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', apiKeyEnv: 'GEMINI_API_KEY' },
  cloudflare: { apiUrl: 'cloudflare', apiKeyEnv: 'CLOUDFLARE_API_TOKEN' },
  local_gemma: { 
    apiUrl: process.env.LOCAL_GEMMA_API_URL 
      ? `${process.env.LOCAL_GEMMA_API_URL}/chat/completions` 
      : 'https://omniagent.esggo.co/ollama/v1/chat/completions', 
    apiKeyEnv: 'LOCAL_GEMMA_AUTH_TOKEN' 
  },
};

const FREE_PROVIDER_POOL = Object.values(MODELS).map(m => ({
  id: m.model,
  provider: m.provider,
  model: m.model,
  maxTokens: m.maxTokens ?? 256,
  temperature: m.temperature ?? 0.7,
  apiUrl: PROVIDER_ENDPOINTS[m.provider].apiUrl,
  apiKeyEnv: PROVIDER_ENDPOINTS[m.provider].apiKeyEnv,
  isFreeTier: String(m.model).endsWith(':free'),
}));

export function getFreeModelPool() { return FREE_PROVIDER_POOL; }
export function getFreeTierModels() { return FREE_PROVIDER_POOL.filter(m => m.isFreeTier); }
function freeProviderByModel(modelId) { return FREE_PROVIDER_POOL.find(p => p.model === modelId); }

const SENSITIVE_TASKS = new Set(['carbon_calculation', 'compliance_review', 'tcfd_analysis', 'materiality_matrix', 'sdg_mapping']);
const PUBLIC_FREE_PROVIDERS = new Set(['groq', 'openrouter', 'together', 'mistral', 'gemini', 'cloudflare']);

export async function callChatProvider(cfg, messages, options = {}) {
  if (cfg.provider === 'cloudflare') {
    const data = await callCloudflareAI(cfg.model, messages, {
      maxTokens: options.maxTokens ?? cfg.maxTokens,
      temperature: options.temperature ?? cfg.temperature,
      timeoutMs: options.timeoutMs ?? 15000,
    });
    return data.result.response;
  }
  const apiKey = process.env[cfg.apiKeyEnv];
  if (!apiKey) throw new Error(`Missing API key env: ${cfg.apiKeyEnv}`);
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(cfg.apiUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(cfg.provider === 'openrouter' ? { 'HTTP-Referer': 'https://esggo.app', 'X-Title': 'ESG GO' } : {}),
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        max_tokens: options.maxTokens ?? cfg.maxTokens,
        temperature: options.temperature ?? cfg.temperature,
      }),
    });
  } catch (e) {
    clearTimeout(timer);
    if (e && e.name === 'AbortError') throw new Error(`Provider ${cfg.provider}/${cfg.model} 逾時 (${timeoutMs}ms)`);
    throw e;
  }
  clearTimeout(timer);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Provider ${cfg.provider}/${cfg.model} HTTP ${response.status}: ${text}`);
  }
  const data = await response.json();
  if (data.error) throw new Error(`Provider ${cfg.provider}/${cfg.model}: ${data.error.message}`);
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error(`Provider ${cfg.provider}/${cfg.model}: empty response`);
  return content;
}

export async function callFreeProvider(taskType, messages, options = {}) {
  const key = (taskType || 'general').toLowerCase();
  const routing = routeModel(key);
  const sensitive = SENSITIVE_TASKS.has(key);
  const chainIds = [routing.primary, routing.fallback1, routing.fallback2].map(m => m.model).filter(Boolean);
  const ordered = [
    ...chainIds.map(id => freeProviderByModel(id)).filter(Boolean),
    ...FREE_PROVIDER_POOL.filter(p => !chainIds.includes(p.model)),
  ];
  let lastError;
  let skippedUnconfigured = 0;
  for (const cfg of ordered) {
    if (!isModelUp(cfg.model)) continue;
    if (!process.env[cfg.apiKeyEnv]) { skippedUnconfigured += 1; continue; }
    if (sensitive && options.excludePublicFree && PUBLIC_FREE_PROVIDERS.has(cfg.provider)) continue;
    try {
      const content = await callChatProvider(cfg, messages, options);
      return { content, used: cfg };
    } catch (e) {
      markModelDown(cfg.model);
      lastError = e;
    }
  }
  if (skippedUnconfigured > 0 && lastError === undefined) {
    throw new Error(`[FreeProvider] 無已配置 API Key 的免費 Provider 可用（${skippedUnconfigured} 個被跳過）。請設定對應環境變數。`);
  }
  throw new Error(`[FreeProvider] 所有免費模型皆失敗：${String(lastError)}`);
}

export function selectFreeModel(taskType) {
  const routing = routeModel(taskType || 'general');
  const preferred = [routing.primary, routing.fallback1].find(m => String(m.model).endsWith(':free'));
  return (preferred || routing.primary).model;
}
