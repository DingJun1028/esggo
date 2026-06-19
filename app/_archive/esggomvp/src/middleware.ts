import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * 🛡️ OmniGuard Sentinel Proxy
 *
 * Version: 2.1 (Next.js 15+ Best Practices)
 * Integrates:
 * 1. Multi-tiered Rate Limiting (Upstash Redis)
 * 2. Hardened Security Headers (RFC 6585 compliant)
 * 3. 5T Protocol Enforcement
 */

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// Rate Limiters
const globalLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "15 m"),
    analytics: true,
    prefix: "ratelimit:global",
}) : null;

const aiLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "ratelimit:ai",
}) : null;

const authLimiter = redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:auth",
}) : null;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Prefer the first forwarded IP; fall back to x-real-ip (set by Vercel/nginx); then localhost
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        "127.0.0.1";

    // --- 1. Rate Limiting (Guard) ---
    let rateLimitResult = null;
    if (redis && pathname.startsWith('/api')) {
        try {
            if (pathname.includes('/api/auth') || pathname.includes('/api/vault')) {
                rateLimitResult = await authLimiter!.limit(ip);
            } else if (pathname.includes('/api/omni/actions') || pathname.includes('/api/ai')) {
                rateLimitResult = await aiLimiter!.limit(ip);
            } else {
                rateLimitResult = await globalLimiter!.limit(ip);
            }
        } catch (e) {
            console.error("[OmniGuard Proxy Error]:", e);
        }
    }

    // --- 2. Response Construction ---
    const isRateLimited = rateLimitResult && !rateLimitResult.success;

    let response: NextResponse;
    if (isRateLimited && rateLimitResult) {
        // RFC 6585 §4: Retry-After is required for 429 responses
        const retryAfterSeconds = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
        response = new NextResponse(
            JSON.stringify({
                success: false,
                error: {
                    code: "RATE_LIMIT_EXCEEDED",
                    message: "系統偵測到異常請求頻率，請稍後再試。以終為始，善向永續。♾️",
                },
                metadata: {
                    timestamp: Date.now(),
                    retryAfter: retryAfterSeconds,
                }
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': retryAfterSeconds.toString(),
                }
            }
        );
    } else {
        response = NextResponse.next();
    }

    // --- 3. Security Headers (Shield) ---
    const headers = response.headers;
    headers.set("X-DNS-Prefetch-Control", "on");
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "origin-when-cross-origin");
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    // Prevent search engine indexing of API endpoints
    if (pathname.startsWith('/api')) {
        headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    // Content Security Policy — expanded to cover NCB + Google Fonts
    headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://generativelanguage.googleapis.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' blob: data: https:",
            "connect-src 'self' https://generativelanguage.googleapis.com https://*.upstash.io https://*.nocodebackend.com",
            "worker-src 'self' blob:",
            "frame-ancestors 'self'",
        ].join('; ')
    );

    // Rate Limit Metadata Headers
    if (rateLimitResult) {
        headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)",
    ],
};
