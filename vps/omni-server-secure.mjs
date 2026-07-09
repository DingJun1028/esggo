// vps/omni-server-secure.mjs
// 安全強化版 Standalone Server（含 helmet、rate-limit、CORS）

import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Rate limit map (IP → { count, resetTime })
const rateLimitMap = new Map();
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '100', 10);
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimitCheck(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// Security headers (helmet-like)
function setSecurityHeaders(res) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Content-Security-Policy', process.env.CSP || "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ws: wss:;");
}

// CORS
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',');
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Request logger
function logRequest(req, res, start) {
  const duration = Date.now() - start;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms - ${ip}`);
}

await app.prepare();

const server = createServer((req, res) => {
  const start = Date.now();
  const parsedUrl = parse(req.url, true);
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Security headers
  setSecurityHeaders(res);

  // CORS
  setCorsHeaders(req, res);

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    logRequest(req, res, start);
    return;
  }

  // Rate limiting
  if (!rateLimitCheck(ip)) {
    res.statusCode = 429;
    res.setHeader('Retry-After', '60');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Too many requests' }));
    logRequest(req, res, start);
    return;
  }

  // Handle request
  handle(req, res, parsedUrl).then(() => {
    logRequest(req, res, start);
  }).catch((err) => {
    console.error('Error handling request:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
    logRequest(req, res, start);
  });
});

server.listen(port, hostname, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
  console.log(`> Security: rate-limit=${RATE_LIMIT}/min, helmet=true, cors=true`);
});
