// ============================================================
// 萬能即時翻譯 — 服務層 (HTTP + Optional WebSocket)
// 複用 translate.mjs 引擎 (LibreTranslate → MyMemory → 原文兜底)
// WebSocket: 若 ws 套件可用則啟用，否則僅保留 REST API
//       : Akkadu 語音口譯模組 (dev/prod, /interpreter/*)
// ============================================================
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { translateDetailed, translateToMany, stats, hashOf } from './translate.mjs';
import { akkaduStatus } from './akkadu.mjs';

const PORT = Number(process.env.PORT || 8788);
const APP_VERSION = '1.1.0';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// --- ws 延遲載入 (若 ws 套件缺失，僅保留 HTTP) ---
let WebSocketServer = null;
try {
  ({ WebSocketServer } = require('ws'));
} catch (e) {
  console.warn('[universal-translator] ws module not available, REST-only mode');
}

// 5T 溈源標頭
function tHeader(res, rec) {
  res.setHeader('X-OA-Engine', rec.engine);
  res.setHeader('X-OA-Cached', String(rec.cached));
  res.setHeader('X-OA-Trace', hashOf(rec.text).slice(0, 16));
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // 健康檢查
  if (req.url === '/health' && req.method === 'GET') {
    return res
      .writeHead(200, { 'content-type': 'application/json' })
      .end(JSON.stringify({ status: 'ok', version: APP_VERSION, stats, akkadu: akkaduStatus() }));
  }

  // Akkadu 口譯模組狀態
  if (req.url === '/interpreter/status' && req.method === 'GET') {
    return res
      .writeHead(200, { 'content-type': 'application/json' })
      .end(JSON.stringify({ ...akkaduStatus(), version: APP_VERSION }));
  }

  // 靜態前端頁面 (receiver / broadcaster)
  if (req.method === 'GET') {
    const page = req.url === '/' ? '/receiver.html'
      : req.url.startsWith('/receiver') ? '/receiver.html'
      : req.url.startsWith('/broadcaster') ? '/broadcaster.html'
      : null;
    if (page) {
      const fp = path.join(PUBLIC_DIR, page);
      if (fs.existsSync(fp)) {
        return res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(fs.readFileSync(fp));
      }
    }
  }

  // 即時轉播 / 指定轉播 核心 API
  if (req.url === '/translate' && req.method === 'POST') {
    let body = '';
    for await (const c of req) body += c;
    let p;
    try { p = JSON.parse(body); } catch { res.writeHead(400); return res.end('bad json'); }

    const { text, from = 'auto', to = 'zh', targets } = p;
    if (!text) { res.writeHead(400); return res.end('missing text'); }

    // 多語平行翻譯 (即時轉播場景)
    if (Array.isArray(targets) && targets.length) {
      const r = await translateToMany(text, from, targets);
      res.writeHead(200, { 'content-type': 'application/json' });
      tHeader(res, Object.values(r.translations).length ? { engine: Object.values(r.engines)[0], cached: false, text } : { engine: 'n/a', cached: false, text });
      return res.end(JSON.stringify({ ...r, version: APP_VERSION }));
    }

    // 單語翻譯
    const rec = await translateDetailed(text, from, to);
    res.writeHead(200, { 'content-type': 'application/json' });
    tHeader(res, rec);
    return res.end(JSON.stringify({ text: rec.text, engine: rec.engine, cached: rec.cached, version: APP_VERSION }));
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ usage: 'POST /translate {text,from,to|targets[]} | GET /health | WS /ws (if ws installed)' }));
});

// WebSocket 即時流 (ws 套件可用時啟用)
if (WebSocketServer) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (ws) => {
    ws.on('message', async (msg) => {
      let p;
      try { p = JSON.parse(msg.toString()); } catch { return ws.send(JSON.stringify({ error: 'bad json' })); }
      const { text, from = 'auto', to = 'zh' } = p;
      if (!text) return ws.send(JSON.stringify({ error: 'missing text' }));
      const rec = await translateDetailed(text, from, to);
      ws.send(JSON.stringify({ text: rec.text, engine: rec.engine, cached: rec.cached, version: APP_VERSION }));
    });
  });
}

server.listen(PORT, () => {
  const mode = WebSocketServer ? 'HTTP+WS' : 'HTTP-only';
  console.log(`[universal-translator] listening on :${PORT} (${mode})`);
});