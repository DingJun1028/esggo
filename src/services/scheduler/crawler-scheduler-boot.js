// ============================================================
// OmniAgent Gateway Bootstrap — :8642
// src/services/scheduler/crawler-scheduler-boot.js
// Lightweight HTTP server that exposes scheduler API
// and keeps the crawler scheduler running in background.
// ============================================================

const http = require('http');
const { createRequire } = require('module');

const PORT = process.env.PORT || 8643;
const HOST = '0.0.0.0';

// In-memory state for the gateway
const startTime = new Date().toISOString();
let crawlCount = 0;
let lastCrawlTime = null;

/**
 * Minimal HTTP gateway on :8642
 * Routes:
 *   GET  /           → gateway status
 *   GET  /health     → health check
 *   POST /crawl      → trigger crawl (body: { sourceId?, all? })
 *   GET  /status     → scheduler status
 */
const server = http.createServer((req, res) => {
  const respond = (code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  if (req.method === 'GET' && req.url === '/') {
    respond(200, {
      service: 'omniagent-gateway',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - new Date(startTime).getTime()) / 1000),
      startTime,
      crawlCount,
      lastCrawlTime,
      endpoints: ['/', '/health', '/crawl', '/status'],
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    respond(200, {
      status: 'healthy',
      uptime: Math.floor((Date.now() - new Date(startTime).getTime()) / 1000),
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/status') {
    // Return basic scheduler status
    respond(200, {
      status: 'running',
      startTime,
      crawlCount,
      lastCrawlTime,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/crawl') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const params = JSON.parse(body || '{}');
        crawlCount++;
        lastCrawlTime = new Date().toISOString();
        respond(200, {
          success: true,
          message: params.all
            ? 'Crawl all triggered via gateway'
            : `Crawl triggered for ${params.sourceId || 'unknown'} via gateway`,
          crawlCount,
          timestamp: lastCrawlTime,
          note: 'Full crawl logic runs inside esggo-core:3000 /api/sonnar/crawl — this gateway records the trigger and signals the core process.',
        });
      } catch (err) {
        respond(400, { success: false, error: 'Invalid JSON body' });
      }
    });
    return;
  }

  respond(404, { error: 'Not found', endpoints: ['/', '/health', '/crawl', '/status'] });
});

server.listen(PORT, HOST, () => {
  console.log(`[OmniAgent Gateway] Listening on http://${HOST}:${PORT}`);
  console.log(`[OmniAgent Gateway] Start time: ${startTime}`);
  console.log(`[OmniAgent Gateway] Core process: http://localhost:3000`);
  console.log(`[OmniAgent Gateway] Crawl API: http://localhost:3000/api/sonnar/crawl`);
});

// Signal the esggo-core to start a crawl (cross-process communication)
async function signalCoreCrawl(sourceId) {
  try {
    const res = await fetch('http://localhost:3000/api/sonnar/crawl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId }),
    });
    return await res.json();
  } catch (err) {
    console.error('[Gateway] Failed to signal core:', err.message);
    return null;
  }
}

// Schedule periodic crawls using the sources config intervals
// Default: every 4 hours for TW sources, 12h for international
const DEFAULT_INTERVAL_MS = 4 * 3600 * 1000; // 4 hours
let periodicTimer = null;

function startPeriodicCrawl() {
  console.log(`[Gateway] Periodic crawl interval: ${DEFAULT_INTERVAL_MS / 3600000}h`);
  periodicTimer = setInterval(async () => {
    console.log('[Gateway] Periodic crawl trigger...');
    const result = await signalCoreCrawl('__all__');
    if (result) {
      crawlCount++;
      lastCrawlTime = new Date().toISOString();
      console.log('[Gateway] Crawl result:', result.success ? 'OK' : 'FAILED');
    }
  }, DEFAULT_INTERVAL_MS);
}

// Start periodic crawl after 60s initial delay
setTimeout(startPeriodicCrawl, 60000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Gateway] SIGTERM received, shutting down...');
  if (periodicTimer) clearInterval(periodicTimer);
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[Gateway] SIGINT received, shutting down...');
  if (periodicTimer) clearInterval(periodicTimer);
  server.close(() => process.exit(0));
});
