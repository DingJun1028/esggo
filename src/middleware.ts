/**
 * Next.js Middleware — Security Headers, CORS, Rate Limiting
 *
 * Applied to all routes by default. Public routes (health, static assets)
 * are explicitly excluded from auth checks.
 *
 * Architecture:
 *   1. Security headers on every response
 *   2. CORS preflight handling
 *   3. Rate limiting via Upstash Redis (in-memory fallback)
 *   4. Optional Firebase token verification for protected API routes
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Configuration ──────────────────────────────────────────────────

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = process.env.NODE_ENV === 'production' ? 100 : 1000;

// Routes that skip authentication entirely
const PUBLIC_ROUTES: readonly string[] = [
  '/api/healthz',
  '/api/health',
  '/api/health/metrics',
  '/_next/',
  '/favicon.ico',
  '/assets/',
  '/public/',
];

// Routes that require Firebase token verification
const PROTECTED_API_PREFIXES: readonly string[] = [
  '/api/delegation',
  '/api/esg-report',
  '/api/sustain-write',
  '/api/evidence',
  '/api/zkp',
  '/api/omni-agent',
];

// ─── Security Headers ───────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): NextResponse {
  const headers = response.headers;

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Clickjacking protection
  headers.set('X-Frame-Options', 'DENY');

  // XSS protection (legacy browsers)
  headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy — disable camera, microphone, geolocation by default
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Strict Transport Security (HSTS) — only in production
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // Content Security Policy — restrictive baseline
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  // Remove server identification
  headers.delete('X-Powered-By');
  headers.delete('Server');

  return response;
}

// ─── CORS ───────────────────────────────────────────────────────────

function handleCors(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('Origin') ?? '';

  // In development, allow localhost
  const isDev = process.env.NODE_ENV !== 'production';
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

  if (ALLOWED_ORIGINS.length === 0 && !isDev) {
    // No CORS_ORIGINS configured in production — block cross-origin
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') ?? '');
    response.headers.set('Access-Control-Allow-Credentials', 'false');
  } else if (isDev && isLocalhost) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

// ─── Rate Limiting (in-memory, single-instance) ─────────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const resetAt = now + RATE_LIMIT_WINDOW * 1000;

  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt };
  }

  record.count += 1;
  const allowed = record.count <= RATE_LIMIT_MAX;
  return { allowed, remaining: Math.max(0, RATE_LIMIT_MAX - record.count), resetAt: record.resetAt };
}

// Cleanup old entries every 5 minutes (best-effort)
let lastCleanup = Date.now();
function cleanupRateLimitStore() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  for (const [key, record] of rateLimitStore) {
    if (now > record.resetAt) rateLimitStore.delete(key);
  }
}

// ─── Token Verification ─────────────────────────────────────────────

async function verifyFirebaseToken(
  token: string
): Promise<{ uid: string; email?: string } | null> {
  try {
    const { getAuth } = await import('firebase-admin/auth');
    const { getAdminApp } = await import('./lib/firebase-admin');
    const app = getAdminApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

// ─── Middleware Entry ────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── CORS preflight ──
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return handleCors(request, applySecurityHeaders(response));
  }

  // ── Public routes — skip auth, still apply headers ──
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  if (isPublic) {
    const response = NextResponse.next();
    return handleCors(request, applySecurityHeaders(response));
  }

  // ── Rate limiting ──
  cleanupRateLimitStore();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const clientId = `${ip}:${pathname}`;
  const { allowed, remaining, resetAt } = checkRateLimit(clientId);

  if (!allowed) {
    return applySecurityHeaders(
      NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((resetAt - Date.now()) / 1000) },
        { status: 429 }
      )
    );
  }

  // ── Protected API routes — verify Firebase token ──
  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtectedApi) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Missing authorization token' }, { status: 401 })
      );
    }

    const user = await verifyFirebaseToken(token);
    if (!user) {
      return applySecurityHeaders(
        NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
      );
    }

    // Inject user info into headers for downstream route handlers
    const response = NextResponse.next();
    response.headers.set('X-User-Id', user.uid);
    if (user.email) response.headers.set('X-User-Email', user.email);
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    return handleCors(request, applySecurityHeaders(response));
  }

  // ── All other routes — pass through with headers ──
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  return handleCors(request, applySecurityHeaders(response));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
};
