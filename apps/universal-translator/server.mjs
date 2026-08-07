// ============================================================
// 萬能即時翻譯 — 服務層 (HTTP + WebSocket) · 純免費版
// 引擎: LibreTranslate(自建) → MyMemory(免費) → 原文兜底 (零付費 key)
// 端點: /health | /translate (單語/多語) | /ws (即時流) | 靜態 UI (/)
// 5T 溯源標頭: X-OA-Engine / X-OA-Cached / X-OA-Trace
// ============================================================
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer } from 'ws';
import { translateDetailed, translateToMany, stats, hashOf } from './translate.mjs';

const PORT = Number(process.env.PORT || 8788);
const APP_VERSION = '1.2.0';           // 免費版: 移除 Akkadu, 加即時 UI
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// 5T 溯源標頭 (在 writeHead 中內聯注入, 避免 writeHead 後 setHeader 衝突)
function writeJson(res, obj, extraHeaders = {}) {
  res.writeHead(200, {
    'content-type': 'application/json',
    ...extraHeaders,
  });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  // CORS (前端跨域呼叫)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // 健康檢查
  if (req.url === '/health' && req.method === 'GET') {
    return writeJson(res, { status: 'ok', version: APP_VERSION, stats });
  }

  // 靜態前端 UI (免費版 Live 即時翻譯頁)
  if (req.method === 'GET') {
    // 路由: / → index.html; /studio, /studio.html, /stream, ... → public/<name>.html; 其他靜態檔
    let page = null;
    if (req.url === '/' || req.url.startsWith('/index')) {
      page = '/index.html';
    } else {
      // 去掉 query string, 取 path
      const urlPath = req.url.split('?')[0];
      if (urlPath === '/studio' || urlPath === '/studio.html') page = '/studio.html';
      else if (urlPath === '/stream' || urlPath === '/stream.html') page = '/stream.html';
      else if (urlPath === '/broadcaster' || urlPath === '/broadcaster.html') page = '/broadcaster.html';
      else if (urlPath === '/receiver' || urlPath === '/receiver.html') page = '/receiver.html';
      else if (urlPath.endsWith('.html') && fs.existsSync(path.join(PUBLIC_DIR, urlPath))) page = urlPath;
    }
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
      const firstEngine = Object.values(r.engines)[0] || 'n/a';
      return writeJson(res, { ...r, version: APP_VERSION }, {
        'X-OA-Engine': firstEngine, 'X-OA-Cached': 'false', 'X-OA-Trace': hashOf(text).slice(0, 16),
      });
    }

    // 單語翻譯
    const rec = await translateDetailed(text, from, to);
    return writeJson(res, { text: rec.text, engine: rec.engine, cached: rec.cached, version: APP_VERSION }, {
      'X-OA-Engine': rec.engine, 'X-OA-Cached': String(rec.cached), 'X-OA-Trace': hashOf(rec.text).slice(0, 16),
    });
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ usage: 'POST /translate {text,from,to|targets[]} | GET /health | WS /ws | GET / (UI) | GET /stream (SSE)' }));
});

// SSE 端點：觀眾端串流 /stream?src=studio
let sseClients = new Set();
server.on('request', (req, res) => {
  if (req.url === '/stream' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    const clientId = Date.now();
    sseClients.add({ res, id: clientId });
    req.on('close', () => sseClients.delete(sseClients.entries().next().value?.value || findClient(clientId)));
    res.write(`id: ${clientId}\nevent: heartbeat\n\n`);
  }
});

// WebSocket 即時流 (若 ws 套件可用)
if (typeof WebSocketServer !== 'undefined') {
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (ws) => {
    ws.on('message', async (msg) => {
      let p; try { p = JSON.parse(msg.toString()); } catch { return; }
      const { text, from = 'auto', to = 'zh' } = p;
      if (!text) return;
      const rec = await translateDetailed(text, from, to);
      ws.send(JSON.stringify({ text: rec.text, engine: rec.engine, cached: rec.cached, version: APP_VERSION }));
    });
  });
}

server.listen(PORT, () => {
  console.log(`[universal-translator] listening on :${PORT} (HTTP + WS /ws + UI)`);
});
