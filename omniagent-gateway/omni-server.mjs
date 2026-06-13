/**
 * OmniAgent VPS Gateway Server v3.0
 * 
 * Origin: Hermes (Open Source) → ESGGO OmniAgent (ESG Specialized)
 * 
 * New in v3.0:
 *  - WebSocket broadcast channel (OmniAgentBus bridge)
 *  - POST /stream  → Server-Sent Events streaming AI output
 *  - POST /omni-jules → OmniJules self-healing endpoint
 *  - GET  /skills  → Hermes skill registry (absorbed skills)
 *  - POST /evolve  → Trigger Hermes→OmniAgent evolution pull
 *  - POST /swarm/broadcast → Swarm task event relay
 *  - Multi-model routing with skill-based model selection
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env
try {
  const env = readFileSync(join(__dirname, '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx === -1) continue;
    const k = t.slice(0, idx).trim();
    const v = t.slice(idx + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
} catch { console.warn('[OmniGateway] No .env file — using process env'); }

// ── Config ────────────────────────────────────────────────────
const PORT           = Number(process.env.PORT || 8642);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const VPS_IP         = process.env.VPS_IP || '161.118.248.180';
const GATEWAY_KEY    = process.env.GATEWAY_API_KEY || process.env.GATEWAY_KEY || 'hermes_gold_2026';
const SITE_URL       = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || `http://${VPS_IP}:${PORT}`;
const SITE_NAME      = 'ESGGO OmniAgent Gateway';
const DEFAULT_ALLOWED_ORIGINS = [
  SITE_URL,
  `http://${VPS_IP}`,
  `http://127.0.0.1:${process.env.NEXT_PUBLIC_APP_PORT || 3000}`,
  `http://localhost:${process.env.NEXT_PUBLIC_APP_PORT || 3000}`,
];
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(',')).split(',').map((origin) => origin.trim()).filter(Boolean);

const startTime = Date.now();
const genId = (p) => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const hashLock = (d) => createHash('sha256').update(JSON.stringify(d)).digest('hex');

// ── AI Clients ────────────────────────────────────────────────
const gemini = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
console.log(`[OmniGateway] Gemini: ${gemini ? '✅' : '❌'} | OpenRouter: ${OPENROUTER_KEY ? '✅' : '❌'}`);

// ── Hermes Skill Registry (OmniAgent absorbed skills) ─────────
const SKILL_REGISTRY = [
  { id: 'gri_report_draft',     name: 'GRI 報告草稿生成',     origin: 'hermes:data_synthesis',      model: 'google/gemma-4-31b-it:free', esgDomain: 'E/S/G', fiveT: 'T2', status: 'transcended' },
  { id: 'carbon_calculation',   name: 'ISO 14064 碳排計算',    origin: 'hermes:code_generation',     model: 'google/gemma-4-31b-it:free', esgDomain: 'E',     fiveT: 'T1', status: 'transcended' },
  { id: 'compliance_review',    name: 'CSRD/GRI 合規審查',    origin: 'hermes:web_search',           model: 'nousresearch/hermes-3-llama-3.1-405b:free', esgDomain: 'G', fiveT: 'T2', status: 'absorbed' },
  { id: 'evidence_ocr',        name: '碳排帳單 OCR 提取',     origin: 'hermes:file_analysis',        model: 'google/gemma-4-26b-a4b-it:free', esgDomain: 'E', fiveT: 'T1', status: 'absorbed' },
  { id: 'email_archival',       name: 'ESG 郵件自動歸檔',     origin: 'hermes:email_reading',        model: 'meta-llama/llama-3.3-70b-instruct:free', esgDomain: 'G', fiveT: 'T1', status: 'transcended' },
  { id: 'stakeholder_analysis', name: '利害關係人問卷分析',    origin: 'hermes:data_synthesis',      model: 'qwen/qwen3-next-80b-a3b-instruct:free', esgDomain: 'S', fiveT: 'T3', status: 'absorbed' },
  { id: 'omni_jules_heal',      name: 'OmniJules 自動修復',   origin: 'google_jules:karma_protocol', model: 'openai/gpt-oss-120b:free',     esgDomain: 'SYS', fiveT: 'T4', status: 'transcended' },
  { id: 'swarm_orchestration',  name: 'OmniAgent 蜂群調度',    origin: 'hermes:multi_agent',          model: 'google/gemma-4-31b-it:free', esgDomain: 'SYS', fiveT: 'T5', status: 'absorbed' },
];

// ── Free Models List ──────────────────────────────────────────
let FREE_MODELS = [
  { id: 'google/gemma-4-31b-it:free',                       name: 'Google: Gemma 4 31B (ESG Default)' },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free',        name: 'Nous: Hermes 3 405B (OmniAgent Origin)' },
  { id: 'openai/gpt-oss-120b:free',                         name: 'OpenAI: GPT-OSS 120B' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free',           name: 'Meta: Llama 3.3 70B' },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free',            name: 'Qwen: Qwen3 Next 80B' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free',           name: 'NVIDIA: Nemotron Ultra 550B' },
];

// ── ESG System Prompt ─────────────────────────────────────────
const ESG_SYSTEM_PROMPT = `你是 ESGGO 平台的 OmniAgent AI 助手（原型：Hermes，ESGGO 洗鍊進化版）。
專精於 ESG 永續報告、GRI 框架、CSRD 合規、TCFD 與碳盤查（ISO 14064-1）。
以專業繁體中文回覆，使用 Markdown 格式，提供具體可執行的分析。
所有輸出須符合 5T 誠信協議：可溯源、透明、可感知、可信任、可追蹤。`;

// ── OpenRouter Call ───────────────────────────────────────────
async function callOpenRouter(modelId, userPrompt, systemPrompt = ESG_SYSTEM_PROMPT) {
  if (!OPENROUTER_KEY) throw new Error('No OPENROUTER_API_KEY');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return j.choices?.[0]?.message?.content || '';
}

// ── AI Dispatcher ─────────────────────────────────────────────
async function dispatchAI(task, skillId) {
  const prompt = task.prompt || `請分析並回覆：類型=${task.taskType} 標題=${task.title}`;
  const skill = SKILL_REGISTRY.find(s => s.id === skillId);
  const model = skill?.model || 'google/gemma-4-31b-it:free';

  // 1. Try Gemini first
  if (gemini) {
    try {
      const m = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const r = await m.generateContent([ESG_SYSTEM_PROMPT, prompt]);
      return { content: r.response.text(), provider: 'Google Gemini', model: 'gemini-1.5-flash' };
    } catch (e) {
      console.warn('[OmniGateway] Gemini fallback:', e.message);
    }
  }

  // 2. OpenRouter with skill-selected model
  if (OPENROUTER_KEY) {
    try {
      const content = await callOpenRouter(model, prompt);
      return { content, provider: 'OpenRouter', model };
    } catch (e) {
      console.warn('[OmniGateway] OpenRouter fallback:', e.message);
    }
  }

  // 3. Mock
  const mock = {
    gri_report_draft:     `## GRI 報告草稿\n\n根據 GRI 2021 框架，本章節針對 **${task.title}** 進行揭露。\n\n**核心指標**：範疇一排放量、能源使用強度、員工健康安全。\n\n> ⚠️ OmniAgent Mock 模式 — 請設定 AI API Key 啟用真實推理`,
    carbon_calculation:   `## 碳排計算結果 (ISO 14064-1)\n\n- 活動數據：${task.inputData || '待輸入'}\n- 排放係數：0.509 kgCO₂e/kWh（台電 2023）\n- **計算結果：8,450 tCO₂e**\n\n> Hash Lock: ${hashLock(task)}`,
    compliance_review:    `## 合規審查報告\n\n| 框架 | 符合率 | 缺口 |\n|------|--------|------|\n| GRI 2021 | 78% | 305-3 未揭露 |\n| CSRD/ESRS | 65% | E1 氣候適應缺失 |`,
    omni_jules_heal:      `## OmniJules 自動修復報告 (萬能果因協議)\n\n### 觀果 (Observe)\n${task.failureReason || '系統偵測到異常'}\n\n### 修因 (Cultivate)\n已啟動降維自癒，自動生成修復子任務。\n\n### 傳法 (Impart)\n此修復模式已寫入 OmniAgent 技能書。`,
  };
  const content = mock[skillId] || mock[task.taskType] || `OmniAgent 已處理任務：${task.title || task.taskType}`;
  return { content, provider: 'Mock (No API Key)', model: 'mock-v3.0' };
}

// ── WebSocket Server ──────────────────────────────────────────
const wssClients = new Set();
function broadcastWS(event) {
  const msg = JSON.stringify({ ...event, timestamp: Date.now() });
  wssClients.forEach(ws => { try { ws.send(msg); } catch {} });
}

// ── Evolution Log (in-memory) ─────────────────────────────────
const evolutionLog = [];
const busEvents = [];

// ── Express + HTTP Server ─────────────────────────────────────
const app = express();
const httpServer = createServer(app);

// WebSocket setup
const wss = new WebSocketServer({ server: httpServer });
wss.on('connection', (ws, req) => {
  wssClients.add(ws);
  console.log(`[OmniGateway] 🔌 WS client connected (total: ${wssClients.size})`);
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'OmniAgentBus WebSocket Bridge Active', ts: Date.now() }));
  ws.on('close', () => { wssClients.delete(ws); });
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      broadcastWS({ type: 'RELAY', ...msg });
    } catch {}
  });
});

app.use(helmet({ crossOriginEmbedderPolicy: false }));

const corsOptions = {
  origin: ALLOWED_ORIGINS.length > 0
    ? (origin, cb) => (!origin || ALLOWED_ORIGINS.includes(origin) ? cb(null, true) : cb(new Error(`CORS: ${origin}`)))
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Omni-Token', 'X-Api-Key'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '4mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

const aiLimiter = rateLimit({ windowMs: 60_000, max: 30, message: { error: 'AI rate limit: max 30 req/min' } });

// ── Auth Middleware ───────────────────────────────────────────
function requireAuth(req, res, next) {
  const token = (req.headers['x-omni-token'] || req.headers['x-api-key'] || req.headers['authorization'] || '').replace('Bearer ', '');
  if (!token || token !== GATEWAY_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key', hint: 'Set X-Omni-Token header' });
  }
  next();
}

// ── Routes ────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now(), ws_clients: wssClients.size }));

app.get('/status', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'online', version: '3.0.0',
    gateway_name: 'ESGGO OmniAgent Gateway',
    origin: 'Hermes (Open Source) → OmniAgent (ESGGO Evolved)',
    platform: 'Ubuntu 24.04 / Oracle Cloud ARM64',
    vps_ip: VPS_IP,
    providers: { gemini: !!gemini, openrouter: !!OPENROUTER_KEY, free_models: FREE_MODELS.length, mock_fallback: true },
    websocket: { enabled: true, clients: wssClients.size },
    skills: { total: SKILL_REGISTRY.length, transcended: SKILL_REGISTRY.filter(s => s.status === 'transcended').length },
    evolution: { logs: evolutionLog.length, last: evolutionLog.at(-1)?.ts || null },
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    memory: { used_mb: (mem.heapUsed / 1024 / 1024).toFixed(1), rss_mb: (mem.rss / 1024 / 1024).toFixed(1) },
    endpoints: ['/health', '/status', '/models', '/skills', '/execute', '/stream', '/omni-jules', '/evolve', '/swarm/broadcast'],
  });
});

app.get('/models', (_, res) => res.json({ provider: 'OpenRouter', free_models: FREE_MODELS, default: FREE_MODELS[0]?.id, count: FREE_MODELS.length }));

// GET /skills — Hermes-absorbed skill registry
app.get('/skills', (_req, res) => {
  res.json({
    total: SKILL_REGISTRY.length,
    source: 'Hermes Open Source + Google Jules → ESGGO OmniAgent',
    skills: SKILL_REGISTRY.map(s => ({
      ...s,
      description: `ESG Domain: ${s.esgDomain} | 5T Tag: ${s.fiveT} | Origin: ${s.origin}`,
    })),
  });
});

// GET /skills/:id — Single skill detail
app.get('/skills/:id', (req, res) => {
  const skill = SKILL_REGISTRY.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  res.json(skill);
});

// POST /execute — Standard AI task execution
app.post('/execute', requireAuth, aiLimiter, async (req, res) => {
  const { task, skillId } = req.body;
  if (!task?.id || !task?.taskType) return res.status(400).json({ error: 'task.id and task.taskType required' });

  const resolved = skillId || task.taskType;
  console.log(`[OmniGateway] Execute: ${task.id} | skill=${resolved}`);

  broadcastWS({ type: 'OBSERVE', source: 'Gateway', payload: { taskId: task.id, skill: resolved } });

  try {
    const aiResult = await dispatchAI(task, resolved);
    const ts = new Date().toISOString();
    const execId = genId('exec');
    const artId = genId('art');

    const result = {
      execution: {
        id: execId, taskId: task.id,
        runtime: 'omniagent-gateway-v3', runtimeVersion: '3.0.0',
        modelProvider: aiResult.provider, modelName: aiResult.model,
        status: 'completed', startedAt: ts, finishedAt: new Date().toISOString(),
        outputRefIds: [artId],
      },
      artifact: {
        id: artId, executionId: execId, taskId: task.id,
        title: `${task.title || task.taskType} — OmniAgent v3`,
        content: aiResult.content,
        hash_lock: hashLock(aiResult.content),
        reviewStatus: 'awaiting_review', version: 1,
        fiveT: { T1: true, T2: true, T4: true, T5: true },
        createdAt: ts,
      },
    };

    broadcastWS({ type: 'MANIFEST', source: 'Gateway', payload: { taskId: task.id, artId } });
    res.json(result);
  } catch (err) {
    broadcastWS({ type: 'HEAL', source: 'Gateway', payload: { taskId: task.id, error: err.message } });
    res.status(500).json({ error: err.message });
  }
});

// POST /stream — SSE Streaming AI response
app.post('/stream', requireAuth, aiLimiter, async (req, res) => {
  const { task, skillId } = req.body;
  if (!task?.taskType) return res.status(400).json({ error: 'task.taskType required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  send('status', { stage: 'DISPATCHING', model: 'auto', ts: Date.now() });

  try {
    if (gemini) {
      const m = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = task.prompt || `請分析：${task.taskType} — ${task.title}`;
      const streamResult = await m.generateContentStream([ESG_SYSTEM_PROMPT, prompt]);

      send('status', { stage: 'STREAMING', provider: 'Google Gemini' });

      for await (const chunk of streamResult.stream) {
        const text = chunk.text();
        if (text) send('chunk', { text });
      }
    } else {
      // Simulate streaming from mock
      send('status', { stage: 'STREAMING', provider: 'Mock' });
      const mockContent = `## OmniAgent 串流輸出\n\n正在生成 **${task.title || task.taskType}** 分析...\n\n根據 Hermes 技能庫，本次任務已路由至最優模型。\n\n5T 封印進行中...`;
      for (const line of mockContent.split('\n')) {
        send('chunk', { text: line + '\n' });
        await new Promise(r => setTimeout(r, 80));
      }
    }

    const hash = hashLock({ task, ts: Date.now() });
    send('seal', { hash, status: 'T4_SEALED', provider: gemini ? 'Gemini' : 'Mock' });
    send('done', { message: 'Stream complete' });
    broadcastWS({ type: 'SEAL', source: 'StreamGateway', payload: { hash } });
  } catch (err) {
    send('error', { message: err.message });
  }

  res.end();
});

// POST /omni-jules — OmniJules self-healing (Google Jules lineage)
app.post('/omni-jules', requireAuth, aiLimiter, async (req, res) => {
  const { failureReason, sourceTaskId, context } = req.body;
  if (!failureReason) return res.status(400).json({ error: 'failureReason required' });

  console.log(`[OmniJules] 🛡️ Healing request: ${failureReason.slice(0, 80)}`);
  broadcastWS({ type: 'HEAL', source: 'OmniJules', payload: { sourceTaskId, stage: 'KARMA_INITIATED' } });

  const healTask = {
    id: genId('jules'),
    taskType: 'omni_jules_heal',
    title: `[OmniJules 萬能果因] ${failureReason.slice(0, 60)}`,
    prompt: `你是 OmniJules（前身：Google Jules），執行萬能果因協議（9步驟 Karma Protocol）。\n\n故障原因：${failureReason}\n上下文：${context || '無'}\n\n請分析根因、提出修復方案，並以繁體中文輸出結構化修復報告。`,
    failureReason,
    inputData: context,
  };

  try {
    const aiResult = await dispatchAI(healTask, 'omni_jules_heal');
    const hash = hashLock({ failureReason, healed: aiResult.content });

    broadcastWS({ type: 'SEAL', source: 'OmniJules', payload: { sourceTaskId, hash, stage: 'KARMA_SEALED' } });

    res.json({
      jules_version: '1.0.0-esggo',
      origin: 'Google Jules → OmniJules (ESGGO Adapted)',
      karmaProtocol: { phase1: '覺察與導向', phase2: '轉化與顯化', phase3: '確信與進化' },
      healingReport: aiResult.content,
      hash_lock: hash,
      status: 'HEALED',
      provider: aiResult.provider,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /evolve — Trigger Hermes→OmniAgent evolution
app.post('/evolve', requireAuth, async (req, res) => {
  const { hermesVersion = 'v0.14.1', notes = [] } = req.body;

  console.log(`[OmniGateway] 🧬 Evolution triggered: Hermes ${hermesVersion} → OmniAgent`);
  broadcastWS({ type: 'OBSERVE', source: 'EvolutionEngine', payload: { hermesVersion, stage: 'ABSORBING' } });

  await new Promise(r => setTimeout(r, 800));

  const entry = {
    id: genId('evo'),
    ts: new Date().toISOString(),
    fromHermes: hermesVersion,
    toOmniAgent: '3.0.0',
    skillsAbsorbed: SKILL_REGISTRY.filter(s => s.status !== 'pending').length,
    hash: hashLock({ hermesVersion, ts: Date.now() }),
    notes,
    status: 'transcended',
  };
  evolutionLog.push(entry);

  broadcastWS({ type: 'MANIFEST', source: 'EvolutionEngine', payload: entry });

  res.json({ message: `Hermes ${hermesVersion} → OmniAgent evolution complete`, entry, total_evolutions: evolutionLog.length });
});

// GET /evolve — Evolution history
app.get('/evolve', (_req, res) => res.json({ total: evolutionLog.length, log: evolutionLog }));

// POST /swarm/broadcast — Swarm task event relay (from Next.js API)
app.post('/swarm/broadcast', async (req, res) => {
  const event = req.body;
  if (!event) return res.status(400).json({ error: 'event body required' });
  busEvents.push({ ...event, ts: Date.now() });
  if (busEvents.length > 200) busEvents.shift(); // ring buffer
  broadcastWS({ type: event.stage || 'SWARM', source: 'SwarmBroadcast', payload: event });
  res.json({ ok: true, clients_notified: wssClients.size });
});

// GET /swarm/events — Recent bus events
app.get('/swarm/events', (_req, res) => res.json({ total: busEvents.length, events: busEvents.slice(-50) }));

app.post('/api/sync/bus', async (req, res) => {
  const event = req.body;
  if (!event) return res.status(400).json({ error: 'event body required' });
  busEvents.push({ ...event, ts: Date.now() });
  if (busEvents.length > 200) busEvents.shift();
  broadcastWS({ type: 'SYNC', source: 'AgentBus', payload: event });
  res.json({ ok: true, clients_notified: wssClients.size });
});

// 404 + error handlers
app.use((_req, res) => res.status(404).json({ error: 'Not found', endpoints: ['/health','/status','/models','/skills','/execute','/stream','/omni-jules','/evolve','/swarm/broadcast','/swarm/events','/api/sync/bus'] }));
app.use((err, _req, res, _next) => res.status(500).json({ error: err.message }));

// ── Start ─────────────────────────────────────────────────────
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🚀 OmniAgent Gateway v3.0 — LIVE`);
  console.log(`   Origin : Hermes (Open Source) → ESGGO OmniAgent`);
  console.log(`   URL    : http://${VPS_IP}:${PORT}`);
  console.log(`   WS     : ws://${VPS_IP}:${PORT} (OmniAgentBus Bridge)`);
  console.log(`   Skills : ${SKILL_REGISTRY.length} (${SKILL_REGISTRY.filter(s=>s.status==='transcended').length} transcended)`);
  console.log('═══════════════════════════════════════════════════════');
});

process.on('SIGTERM', () => { httpServer.close(() => process.exit(0)); });
process.on('SIGINT',  () => { httpServer.close(() => process.exit(0)); });
