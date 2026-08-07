// ============================================================
// 萬能即時翻譯 — 服務層 (HTTP + WebSocket + SSE) · 純免費版
// 引擎: Google gtx(免費,零key) → LibreTranslate(自建) → MyMemory(免費) → 原文兜底 (零付費 key)
// 端點:
//   GET  /health           健康檢查
//   GET  /                 Live 即時翻譯 UI
//   GET  /studio          收音端 (麥克風 / 電腦聲音 → 多語翻譯)
//   GET  /stream?room=xxx 觀眾端 (SSE 雙語浮層字幕)
//   POST /translate       單語 / 多語翻譯 (回 JSON，並廣播 SSE)
//   POST /speak           即時轉播推播 (studio 已轉錄文字 → SSE 字幕)
//   WS   /ws              即時流 (輸入即翻譯並廣播)
// 5T 溯源標頭: X-OA-Engine / X-OA-Cached / X-OA-Trace
// 雙向 TS 終始矩陣: 領域型別契約見 ../../shared/types.ts (canonical) → types/generated/esggo-shared.d.ts (generated)
// @ts-check
/// <reference path="./types/generated/esggo-shared.d.ts" />
// ============================================================
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer } from 'ws';
import { translateDetailed, translateToMany, stats, hashOf } from './translate.mjs';

// 讀取 .env（零依賴實作，優先於 process.env 已存在值）
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const i = line.indexOf('=');
      if (i > 0) { const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim(); if (k && process.env[k] === undefined) process.env[k] = v; }
    }
  }
} catch { /* 忽略 .env 讀取錯誤，維持預設 */ }

const PORT = Number(process.env.PORT || 8788);
const APP_VERSION = '1.3.0';           // 加強版: REST/WS/SSE 全鏈轉播 + 語碼規範化
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// 5T 溯源標頭 (在 writeHead 中內聯注入, 避免 writeHead 後 setHeader 衝突)
/**
 * @param {import('node:http').ServerResponse} res
 * @param {any} obj
 * @param {Record<string, string>} [extraHeaders]
 */
function writeJson(res, obj, extraHeaders = {}) {
  res.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  res.end(JSON.stringify(obj));
}

// SSE 觀眾端客戶端集合與廣播
// 每個 SSE 客戶端帶 room 訂閱（?room=xxx）；broadcast 時按 room 過濾（room 空 = 接收全部）
const sseClients = new Set();
/**
 * @param {import('./types/generated/esggo-shared.d.ts').ISseTranslationEvent} payload
 */
function broadcastTranslation(payload) {
  const data = `event: translation\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const c of sseClients) {
    try {
      // room 過濾：客戶端指定 room 時，只收相同 room 的轉播
      if (c.room && payload.room && c.room !== payload.room) continue;
      c.res.write(data);
    } catch { sseClients.delete(c); }
  }
}

/**
 * 以 Buffer 累積請求體 (原始 bytes, 用於音訊上傳)
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<Buffer>}
 */
async function readBodyRaw(req) {
  /** @type {Buffer[]} */
  const chunks = [];
  for await (const c of req) chunks.push(/** @type {Buffer} */ (c));
  return Buffer.concat(chunks);
}

/**
 * 以 Buffer 累積請求體再轉字串 (避免多 byte UTF-8 在 stream 分塊邊界被切斷導致亂碼，Cloudflare Tunnel 環境下必須)
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<string>}
 */
async function readBody(req) {
  return (await readBodyRaw(req)).toString('utf-8');
}

// --- 共用：執行翻譯並廣播 SSE（REST /translate、/speak 與 WS /ws 共用，打通 studio→stream 即時轉播） ---
/**
 * @param {import('./types/generated/esggo-shared.d.ts').ISpeakPayload} p
 * @returns {Promise<(import('./types/generated/esggo-shared.d.ts').ISseTranslationEvent & { version?: string }) | null>}
 */
async function doTranslateAndBroadcast({ text, from, to, targets, room, speaker = 'studio' }) {
  if (!text) return null;
  const trace = hashOf(text).slice(0, 16);
  if (Array.isArray(targets) && targets.length) {
    const r = await translateToMany(text, String(from), /** @type {string[]} */ (targets));
    /** @type {import('./types/generated/esggo-shared.d.ts').ISseTranslationEvent} */
    const out = { text, translations: r.translations, engines: r.engines, trace, room: room || '', speaker: speaker || 'studio' };
    broadcastTranslation(out);
    return { ...out, engine: Object.values(r.engines)[0] || 'n/a', cached: false };
  }
  const rec = await translateDetailed(text, String(from), String(to));
  /** @type {Record<string, string>} */
  const tr = { [/** @type {string} */ (to)]: rec.text };
  /** @type {import('./types/generated/esggo-shared.d.ts').ISseTranslationEvent} */
  const out = { text, translations: tr, engine: rec.engine, cached: rec.cached, trace, room: room || '', speaker: speaker || 'studio' };
  broadcastTranslation(out);
  return { ...out, text: rec.text };
}

const server = http.createServer(async (req, res) => {
  /** @type {string} */
  const url = req.url || '';
  // CORS (前端跨域呼叫)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // 健康檢查
  if (url === '/health' && req.method === 'GET') {
    return writeJson(res, { status: 'ok', version: APP_VERSION, stats });
  }

  // SSE 觀眾端串流（必須在主靜態路由之前攔截，否則會被當成 HTML 頁回傳）
  if (url.startsWith('/stream') && req.method === 'GET') {
    // 解析 query: ?src=studio&room=xxx（room 用於多房間隔離）
    const q = new URL(url, 'http://localhost').searchParams;
    const room = q.get('room') || '';
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    const client = { res, id: Date.now() + Math.random(), room };
    sseClients.add(client);
    res.write(`id: ${client.id}\nevent: heartbeat\ndata: {"room":"${room}"}\n\n`);
    req.on('close', () => { sseClients.delete(client); });
    return; // 到此為止，不進靜態路由
  }

  // 靜態前端 UI
  if (req.method === 'GET') {
    let page = null;
    if (url === '/' || url.startsWith('/index')) {
      page = '/index.html';
    } else {
      const urlPath = url.split('?')[0];
      if (urlPath === '/studio' || urlPath === '/studio.html') page = '/studio.html';
      else if (urlPath === '/stream.html') page = '/stream.html';
      else if (urlPath.endsWith('.html') && fs.existsSync(path.join(PUBLIC_DIR, urlPath))) page = urlPath;
    }
    if (page) {
      const fp = path.join(PUBLIC_DIR, page);
      if (fs.existsSync(fp)) {
        return res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(fs.readFileSync(fp));
      }
    }
  }

  // 即時轉播推播：studio 直接推播已轉錄文字 → 觀眾端 SSE 即時字幕（免觀眾端二次翻譯）
  if (url === '/speak' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch { res.writeHead(400); return res.end('read fail'); }
    let p;
    try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('bad json'); }
    const { text, from = 'auto', to = 'zh-TW', targets, room = '', speaker = 'studio' } = p;
    if (!text) { res.writeHead(400); return res.end('missing text'); }
    const rec = await doTranslateAndBroadcast({ text, from: String(from), to: String(to), targets, room, speaker });
    if (!rec) { res.writeHead(400); return res.end('missing text'); }
    return writeJson(res, { ok: true, ...rec, version: APP_VERSION }, {
      'X-OA-Engine': String(rec.engine || 'n/a'), 'X-OA-Trace': String(rec.trace || ''),
    });
  }

  // 翻譯核心 API (單語 / 多語) — 同時廣播 SSE，打通 studio(REST)→stream(SSE) 即時轉播
  if (url === '/translate' && req.method === 'POST') {
    let body;
    try { body = await readBody(req); } catch { res.writeHead(400); return res.end('read fail'); }
    let p;
    try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('bad json'); }

    const { text, from = 'auto', to = 'zh', targets, room = '' } = p;
    if (!text) { res.writeHead(400); return res.end('missing text'); }

    // 多語平行翻譯 (即時轉播場景)
    if (Array.isArray(targets) && targets.length) {
      const r = await translateToMany(text, String(from), /** @type {string[]} */ (targets));
      const firstEngine = Object.values(r.engines)[0] || 'n/a';
      broadcastTranslation({ text, translations: r.translations, engines: r.engines, trace: hashOf(text).slice(0, 16), room, speaker: 'rest' });
      return writeJson(res, { ...r, version: APP_VERSION }, {
        'X-OA-Engine': String(firstEngine), 'X-OA-Cached': 'false', 'X-OA-Trace': hashOf(text).slice(0, 16),
      });
    }

    // 單語翻譯
    const rec = await translateDetailed(text, String(from), String(to));
    /** @type {Record<string, string>} */
    const tr = { [String(to)]: rec.text };
    broadcastTranslation({ text, translations: tr, engine: rec.engine, cached: rec.cached, trace: hashOf(rec.text).slice(0, 16), room, speaker: 'rest' });
    return writeJson(res, { text: rec.text, engine: rec.engine, cached: rec.cached, version: APP_VERSION }, {
      'X-OA-Engine': String(rec.engine || 'n/a'), 'X-OA-Cached': String(rec.cached), 'X-OA-Trace': hashOf(rec.text).slice(0, 16),
    });
  }

  // 伺服器端語音轉文字 (STT): 前端 MediaRecorder 分段錄音 → 此端點 → 呼叫本地 faster-whisper 微服務 → 回文字
  // 免費零 key: 不依賴瀏覽器 Web Speech API, 手機/平板/任意瀏覽器皆可用
  if (url === '/transcribe' && req.method === 'POST') {
    let audioBuf;
    try { audioBuf = await readBodyRaw(req); } catch { res.writeHead(400); return res.end('read fail'); }
    if (!audioBuf.length) { res.writeHead(400); return res.end(JSON.stringify({ error: 'empty audio' })); }
    const q = new URL(url, 'http://localhost').searchParams;
    const lang = q.get('lang') || '';
    try {
      const sttRes = await fetch(`http://127.0.0.1:${process.env.STT_PORT || 8791}/transcribe?lang=${encodeURIComponent(lang)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: new Uint8Array(audioBuf),
        signal: AbortSignal.timeout(Number(process.env.STT_TIMEOUT_MS || 30000)),
      });
      const sttJson = await sttRes.json();
      if (!sttRes.ok) { res.writeHead(sttRes.status); return res.end(JSON.stringify(sttJson)); }
      return writeJson(res, { text: sttJson.text || '', language: sttJson.language || 'unknown' });
    } catch (/** @type {any} */ e) {
      res.writeHead(502);
      return res.end(JSON.stringify({ error: 'STT service unavailable: ' + (e.message || e) }));
    }
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ usage: 'POST /translate {text,from,to|targets[]} | POST /speak {text,from,to|targets[],room} | GET /health | WS /ws | GET / (UI) | GET /stream?room=xxx (SSE)' }));
});

// WebSocket 即時流 (若 ws 套件可用)
if (typeof WebSocketServer !== 'undefined') {
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (/** @type {any} */ ws) => {
    ws.on('message', async (/** @type {any} */ msg) => {
      let p; try { p = JSON.parse(msg.toString()); } catch { return; }
      const { text, from = 'auto', to = 'zh', targets, room = '' } = p;
      if (!text) return;
      const rec = await doTranslateAndBroadcast({ text, from, to, targets, room });
      if (rec) ws.send(JSON.stringify({ ...rec, version: APP_VERSION }));
    });
  });
}

server.listen(PORT, () => {
  console.log(`[universal-translator] listening on :${PORT} (HTTP + WS /ws + SSE /stream + UI)`);
});
