/**
 * OmniAgent VPS Gateway Server v2.1
 * Oracle Cloud VM.Standard.A1.Flex (ARM64) | 161.118.248.180
 * Ubuntu 24.04 | 4 OCPU / 24 GB RAM
 *
 * AI Providers:
 *  - Google Gemini (gemini-2.0-flash) — via GEMINI_API_KEY
 *  - OpenRouter    (27 free models)   — via OPENROUTER_API_KEY
 *    Fallback priority: Gemini → OpenRouter → Mock Templates
 *
 * Features:
 *  - Helmet security headers
 *  - Rate limiting (global + per-IP)
 *  - CORS allowlist
 *  - GET /models  → list all available free OpenRouter models
 *  - POST /execute → AI task execution with model selection
 *  - GET /status, GET /health
 *  - Graceful shutdown
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Bootstrap ──────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
} catch {
  console.warn('[OmniGateway] No .env file found — using process environment');
}

const PORT             = Number(process.env.PORT || 8642);
const NODE_ENV         = process.env.NODE_ENV || 'development';
const GEMINI_API_KEY   = process.env.GEMINI_API_KEY;
const OPENROUTER_KEY   = process.env.OPENROUTER_API_KEY;
const VPS_IP           = process.env.VPS_IP || '161.118.248.180';
const ALLOWED_ORIGINS  = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const YOUR_SITE_URL    = process.env.SITE_URL || `http://${VPS_IP}:${PORT}`;
const YOUR_SITE_NAME   = process.env.SITE_NAME || 'ESGGO OmniAgent Gateway';
const TELEGRAM_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;

// ── OpenRouter: all currently-free models (as of 2026-06-10) ──
// Source: https://openrouter.ai/api/v1/models  (pricing.prompt === "0")
// These are fetched at startup and can be refreshed via GET /models?refresh=1
let OPENROUTER_FREE_MODELS = [
  { id: 'nex-agi/nex-n2-pro:free',                                  name: 'Nex AGI: Nex-N2-Pro' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free',                   name: 'NVIDIA: Nemotron 3 Ultra 550B' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',       name: 'NVIDIA: Nemotron 3 Nano Omni Reasoning' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free',                   name: 'NVIDIA: Nemotron 3 Super 120B' },
  { id: 'nvidia/nemotron-3-nano-30b-a3b:free',                      name: 'NVIDIA: Nemotron 3 Nano 30B' },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free',                      name: 'NVIDIA: Nemotron Nano 12B V2 VL' },
  { id: 'nvidia/nemotron-nano-9b-v2:free',                          name: 'NVIDIA: Nemotron Nano 9B V2' },
  { id: 'poolside/laguna-xs.2:free',                                name: 'Poolside: Laguna XS.2' },
  { id: 'poolside/laguna-m.1:free',                                 name: 'Poolside: Laguna M.1' },
  { id: 'moonshotai/kimi-k2.6:free',                               name: 'MoonshotAI: Kimi K2.6' },
  { id: 'google/gemma-4-26b-a4b-it:free',                          name: 'Google: Gemma 4 26B A4B' },
  { id: 'google/gemma-4-31b-it:free',                              name: 'Google: Gemma 4 31B' },
  { id: 'liquid/lfm-2.5-1.2b-thinking:free',                       name: 'LiquidAI: LFM2.5-1.2B-Thinking' },
  { id: 'liquid/lfm-2.5-1.2b-instruct:free',                       name: 'LiquidAI: LFM2.5-1.2B-Instruct' },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free',                   name: 'Qwen: Qwen3 Next 80B A3B' },
  { id: 'qwen/qwen3-coder:free',                                    name: 'Qwen: Qwen3 Coder 480B A35B' },
  { id: 'openai/gpt-oss-120b:free',                                 name: 'OpenAI: GPT-OSS 120B' },
  { id: 'openai/gpt-oss-20b:free',                                  name: 'OpenAI: GPT-OSS 20B' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free',                  name: 'Meta: Llama 3.3 70B Instruct' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free',                   name: 'Meta: Llama 3.2 3B Instruct' },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free',               name: 'Nous: Hermes 3 405B Instruct' },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Venice: Dolphin Mistral 24B' },
  { id: 'nvidia/nemotron-3.5-content-safety:free',                  name: 'NVIDIA: Nemotron 3.5 Content Safety' },
  { id: 'openrouter/owl-alpha',                                     name: 'OpenRouter: Owl Alpha' },
  { id: 'openrouter/free',                                          name: 'OpenRouter: Free Models Router' },
];

// Default OpenRouter model for ESG tasks (best general-purpose free model)
const OPENROUTER_DEFAULT = 'google/gemma-4-31b-it:free';

// ── Telegram Bot Initialization ────────────────────────────
let bot = null;
if (TELEGRAM_TOKEN) {
  try {
    bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    console.log('[OmniGateway] 🤖 Telegram Bot enabled (Polling)');

    bot.on('message', async (msg) => {
      // Ignore commands (handled separately) and non-text
      if (!msg.text || msg.text.startsWith('/')) return;
      
      const chatId = msg.chat.id;
      const userName = msg.from?.first_name || 'User';
      console.log(`[OmniGateway] 📩 Telegram from ${userName}: ${msg.text.slice(0, 50)}...`);

      // Auto-reply with loading status
      const loadingMsg = await bot.sendMessage(chatId, '🧠 OmniAgent G4 正在思考中...', { reply_to_message_id: msg.message_id });

      try {
        const aiResult = await dispatchAI({
          prompt: msg.text,
          taskType: 'telegram_chat',
          title: `Telegram Chat from ${userName}`,
          model: OPENROUTER_DEFAULT
        });

        await bot.editMessageText(aiResult.content, {
          chat_id: chatId,
          message_id: loadingMsg.message_id,
          parse_mode: 'Markdown'
        });
      } catch (err) {
        console.error('[OmniGateway] Telegram AI error:', err);
        await bot.editMessageText('❌ AI 處理失敗，請稍後再試。', {
          chat_id: chatId,
          message_id: loadingMsg.message_id
        });
      }
    });

    bot.onText(/\/start/, (msg) => {
      bot.sendMessage(msg.chat.id, `👋 你好！我是 **OmniAgent G4**。\n\n我已連接至 Oracle Cloud VPS 並由 **Gemma 4 (31B)** 免費推理版驅動。\n\n你可以直接傳送 ESG 相關問題給我，或使用以下指令：\n/status - 檢查系統狀態\n/models - 列出可用模型`, { parse_mode: 'Markdown' });
    });

    bot.onText(/\/status/, (msg) => {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      bot.sendMessage(msg.chat.id, `🛰 **OmniAgent 系統狀態**\n\n狀態: ✅ Online\n版本: v2.1.0\n核心: Gemma 4 (31B)\nUptime: ${uptime}s\n\n系統一切運作正常。`, { parse_mode: 'Markdown' });
    });

    bot.onText(/\/models/, (msg) => {
      const modelList = OPENROUTER_FREE_MODELS.slice(0, 5).map(m => `- ${m.name}`).join('\n');
      bot.sendMessage(msg.chat.id, `🧠 **部分可用免費模型**\n\n${modelList}\n\n預設使用: Google Gemma 4 31B`, { parse_mode: 'Markdown' });
    });

  } catch (err) {
    console.error('[OmniGateway] ❌ Failed to start Telegram Bot:', err.message);
  }
} else {
  console.warn('[OmniGateway] ⚠️ TELEGRAM_BOT_TOKEN not found, Telegram integration disabled');
}

// ── AI Clients ─────────────────────────────────────────────
const geminiClient = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

if (!geminiClient && !OPENROUTER_KEY) {
  console.warn('[OmniGateway] ⚠️  No AI keys configured — using mock templates only');
} else {
  if (geminiClient)   console.log('[OmniGateway] ✅ Gemini API enabled');
  if (OPENROUTER_KEY) console.log('[OmniGateway] ✅ OpenRouter API enabled');
}

// ── Fetch live free models from OpenRouter ─────────────────
async function refreshOpenRouterFreeModels() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}` }
    });
    const json = await res.json();
    const free = (json.data || []).filter(m => String(m.pricing?.prompt) === '0');
    if (free.length > 0) {
      OPENROUTER_FREE_MODELS = free.map(m => ({ id: m.id, name: m.name, context: m.context_length }));
      console.log(`[OmniGateway] 🔄 OpenRouter free models refreshed: ${free.length} models`);
    }
  } catch (err) {
    console.warn('[OmniGateway] Could not refresh OpenRouter models:', err.message);
  }
}

// ── OpenRouter API call ────────────────────────────────────
async function callOpenRouter(modelId, systemPrompt, userPrompt) {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not configured');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization':   `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer':    YOUR_SITE_URL,
      'X-Title':         YOUR_SITE_NAME,
      'Content-Type':    'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature: 0.7,
      max_tokens:  2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}

// ── ESG Mock Templates ─────────────────────────────────────
const MOCK_TEMPLATES = {
  report_drafting:       (t) => `## ${t.title}\n\n根據 GRI 2021 框架與最新 ESG 趨勢分析，本章節草稿已由 OmniAgent 生成。\n\n**重點摘要**：\n- 資料邊界：全集團子公司\n- 盤查基準年：2024 年度\n- 揭露方式：GRI 符合性聲明\n\n> ⚠️ 此內容由 VPS OmniAgent v2.1 自動生成，請人工審閱後使用。`,
  compliance_review:     (t) => `## 合規審查結果：${t.title}\n\n**對標框架**：CSRD / ESRS E1、GRI 305\n\n| 指標 | 符合狀態 | 備註 |\n|------|---------|------|\n| 範疇一排放 | ✅ 符合 | 已揭露 |\n| 範疇二排放 | ✅ 符合 | 已揭露 |\n| 氣候適應策略 | ⚠️ 不足 | 建議補強 |\n\n**整體符合率：85%**`,
  evidence_mapping:      (t) => `## 證據映射清單：${t.title}\n\n- **[GRI 302-1]** → 2024 電費總帳單 (Vault_ID: ev_${genId('ev')})\n- **[GRI 403-1]** → 工安委員會會議紀錄 (Vault_ID: ev_${genId('ev')})\n- **[GRI 305-1]** → 碳盤查報告書 (Vault_ID: ev_${genId('ev')})\n\n> ⚠️ 已自動索引至 OmniAgent 證據金庫 (5T Compliant)。`,
  course_assistant:      (t) => `## 課程 FAQ 回覆：${t.title}\n\n您的問題涉及「範疇三盤查難點」。核心挑戰在於供應鏈數據獲取的頻率與精準度。建議採用 ISO 14064-1 附錄內容並優先對高排放供應商進行問卷調查。`,
  task_planning:         (t) => `## 專案執行規劃：${t.title}\n\n| 階段 | 任務 | 時程 |\n|------|------|------|\n| 1 | 啟動盤查 | W1-W2 |\n| 2 | 數據初審 | W3-W5 |\n| 3 | 報告定稿 | W6-W8 |\n| 4 | 外部確信 | W9-W10 |`,
  stakeholder_analysis:  (t) => `## 利害關係人分析：${t.title}\n\n- **關注度最高**：環境永續 (E)\n- **影響力最高**：投資人與客戶\n- **新興議題**：供應鏈透明度、員工福祉`,
  materiality_generation:(t) => `## 重大性矩陣建議：${t.title}\n\n建議移入第一象限：\n- **碳風險管理**（衝擊 4.9 / 關注 4.7）\n- **供應鏈盡職調查**（衝擊 4.6 / 關注 4.4）`,
  cbam_validation:       (t) => `## CBAM 驗證日誌：${t.title}\n\n| 鋼鐵稅號 | 7318 | ✅ 符合 |\n| 排放係數 | 1.89 tCO₂/t | ⚠️ 略高於均值 1.82 |`,
};

// ── Helpers ────────────────────────────────────────────────
const genId    = (p) => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const startTime = Date.now();

const ESG_SYSTEM_PROMPT = `你是 ESGGO 平台的 OmniAgent AI 助手，專精於 ESG 永續報告、GRI 框架、CSRD 合規與碳盤查。
請以專業繁體中文回覆，提供具體、可執行的分析內容，使用 Markdown 格式。`;

// ── Core AI dispatcher ─────────────────────────────────────
// Priority: Gemini → OpenRouter → Mock
async function dispatchAI(task) {
  const prompt = task.prompt || `請針對以下任務生成 ESG 分析報告：\n任務類型：${task.taskType}\n標題：${task.title || task.taskType}`;

  // 1. Gemini
  if (geminiClient) {
    try {
      const model  = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([ESG_SYSTEM_PROMPT, prompt]);
      return { content: result.response.text(), provider: 'Google Gemini', model: 'gemini-1.5-flash' };
    } catch (err) {
      console.warn(`[OmniGateway] Gemini failed (${err.message}), trying OpenRouter...`);
    }
  }

  // 2. OpenRouter — use requested model or default
  if (OPENROUTER_KEY) {
    const modelId = task.model || OPENROUTER_DEFAULT;
    try {
      const content = await callOpenRouter(modelId, ESG_SYSTEM_PROMPT, prompt);
      return { content, provider: 'OpenRouter', model: modelId };
    } catch (err) {
      console.warn(`[OmniGateway] OpenRouter failed (${err.message}), falling back to mock...`);
    }
  }

  // 3. Mock templates
  const templateFn = MOCK_TEMPLATES[task.taskType];
  const content    = templateFn ? templateFn(task) : `OmniAgent 已處理任務：${task.title || task.taskType}`;
  return { content, provider: 'Mock Templates', model: 'mock-v2.1' };
}

// ── Express App ────────────────────────────────────────────
const app = express();

app.use(helmet({ crossOriginEmbedderPolicy: false }));

const corsOptions = {
  origin: ALLOWED_ORIGINS.length > 0
    ? (origin, cb) => (!origin || ALLOWED_ORIGINS.includes(origin) ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`)))
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Omni-Token'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '2mb' }));

// Global rate limit
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

// Strict limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60_000, max: 30,
  message: { error: 'AI rate limit exceeded. Max 30 requests/min.' },
});

// ── Routes ─────────────────────────────────────────────────

/** Lightweight health check */
app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

/** Full status */
app.get('/status', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status:           'online',
    version:          '2.1.0',
    platform:         'Ubuntu 24.04 (Oracle Cloud ARM64)',
    instance:         'VM.Standard.A1.Flex — 4 OCPU / 24 GB',
    vps_ip:           VPS_IP,
    system_name:      'OmniAgent Gateway + ESGGO',
    environment:      NODE_ENV,
    providers: {
      gemini:       !!geminiClient,
      openrouter:   !!OPENROUTER_KEY,
      free_models:  OPENROUTER_FREE_MODELS.length,
      mock_fallback: true,
    },
    uptime_seconds:   Math.floor((Date.now() - startTime) / 1000),
    memory: {
      used_mb:  (mem.heapUsed  / 1024 / 1024).toFixed(2),
      total_mb: (mem.heapTotal / 1024 / 1024).toFixed(2),
      rss_mb:   (mem.rss       / 1024 / 1024).toFixed(2),
    },
    endpoints: ['/health', '/status', '/models', '/execute'],
  });
});

/**
 * GET /models
 * Returns all available OpenRouter free models.
 * Add ?refresh=1 to force a live refresh from OpenRouter API.
 */
app.get('/models', aiLimiter, async (req, res) => {
  if (req.query.refresh === '1' && OPENROUTER_KEY) {
    await refreshOpenRouterFreeModels();
  }
  res.json({
    provider:      'OpenRouter',
    default_model: OPENROUTER_DEFAULT,
    free_models:   OPENROUTER_FREE_MODELS,
    count:         OPENROUTER_FREE_MODELS.length,
    note:          'All models listed have pricing.prompt = 0 (free). Pass "model" field in /execute to select.',
    refreshed_at:  new Date().toISOString(),
  });
});

/**
 * POST /execute
 * Body: { task: { id, taskType, title, prompt?, model?, inputRefIds?, actorId?, policyDecisionId? } }
 * 
 * model: (optional) OpenRouter model ID, e.g. "meta-llama/llama-3.3-70b-instruct:free"
 *        If omitted, uses Gemini → OpenRouter default → Mock
 */
app.post('/execute', aiLimiter, async (req, res) => {
  const { task } = req.body;
  if (!task?.id || !task?.taskType) {
    return res.status(400).json({ error: 'task.id and task.taskType are required' });
  }

  console.log(`[OmniGateway] Execute: ${task.id} | type=${task.taskType} | model=${task.model || 'auto'}`);

  const startTs = new Date().toISOString();
  let aiResult;

  try {
    aiResult = await dispatchAI(task);
  } catch (err) {
    console.error('[OmniGateway] AI dispatch failed:', err);
    return res.status(500).json({ error: 'AI execution failed', details: err.message });
  }

  const execId      = genId('exec');
  const finishedTs  = new Date().toISOString();

  const execution = {
    id:                execId,
    taskId:            task.id,
    sessionId:         genId('sess'),
    runtime:           'omniagent-vps',
    runtimeVersion:    '2.1.0',
    modelProvider:     aiResult.provider,
    modelName:         aiResult.model,
    triggerSource:     task.triggerSource || 'user',
    status:            'completed',
    inputRefIds:       task.inputRefIds       || [],
    outputRefIds:      [],
    createdBy:         task.actorId           || 'system',
    auditLogId:        genId('aud'),
    policyDecisionId:  task.policyDecisionId  || null,
    startedAt:         startTs,
    finishedAt:        finishedTs,
    createdAt:         startTs,
    updatedAt:         finishedTs,
  };

  const artifact = {
    id:            genId('art'),
    executionId:   execId,
    taskId:        task.id,
    artifactType:  'report_section_draft',
    title:         `${task.title || task.taskType} (${aiResult.provider})`,
    content:       aiResult.content,
    sourceRefIds:  task.inputRefIds || [],
    reviewStatus:  'awaiting_review',
    version:       1,
    createdAt:     startTs,
    updatedAt:     finishedTs,
  };

  execution.outputRefIds = [artifact.id];

  res.json({ execution, artifact });
});

// ── 404 & error handlers ───────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', available: ['/health', '/status', '/models', '/execute'] });
});

app.use((err, _req, res, _next) => {
  console.error('[OmniGateway] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log('════════════════════════════════════════════════════');
  console.log(`🚀 OmniAgent Gateway v2.1 — LIVE`);
  console.log(`   URL      : http://${VPS_IP}:${PORT}`);
  console.log(`   Models   : http://${VPS_IP}:${PORT}/models`);
  console.log(`   Gemini   : ${geminiClient ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   OpenRouter: ${OPENROUTER_KEY ? `✅ Enabled (${OPENROUTER_FREE_MODELS.length} free models)` : '❌ Disabled'}`);
  console.log('════════════════════════════════════════════════════');

  // Live-refresh OpenRouter free models on startup if key is available
  if (OPENROUTER_KEY) await refreshOpenRouterFreeModels();
});

// ── Graceful shutdown ──────────────────────────────────────
const shutdown = (sig) => {
  console.log(`\n[OmniGateway] ${sig} received. Shutting down gracefully...`);
  if (bot) bot.stopPolling();
  server.close(() => { console.log('[OmniGateway] Closed. Bye!'); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
