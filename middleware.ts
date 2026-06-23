import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const CANARY_PERCENTAGE = 100;
const THEMES = ['esggo', 'default'] as const;
type Theme = typeof THEMES[number];

function getTheme(request: NextRequest): Theme {
  const url = request.nextUrl.clone();
  const path = url.pathname;
  
  if (path.startsWith('/canary/esggo')) {
    return 'esggo';
  }
  
  const cookieTheme = request.cookies.get('theme-preference')?.value as Theme | null;
  if (cookieTheme && THEMES.includes(cookieTheme)) {
    return cookieTheme;
  }
  
  const forceTheme = request.nextUrl.searchParams.get('theme') as Theme | null;
  if (forceTheme && THEMES.includes(forceTheme)) {
    return forceTheme;
  }
  
  const hash = Array.from(path).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isCanary = (hash % 100) < CANARY_PERCENTAGE;
  return isCanary ? 'esggo' : 'default';
}

function setThemeCookie(response: NextResponse, theme: Theme): void {
  response.cookies.set('theme-preference', theme, { 
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax'
  });
}

/**
 * ESG GO | System Middleware v1.4
 * Focus: Security Headers, Performance, Auth Redirects, Theme Canary Routing
 */
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const theme = getTheme(request);
  setThemeCookie(response, theme);
  
  const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://*.firebaseapp.com https://acrobat.adobe.com https://use.typekit.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://p.typekit.net https://accounts.google.com; font-src 'self' https://fonts.gstatic.com https://use.typekit.net data: https: http:; img-src 'self' data: https://*.supabase.co https://*.unsplash.com https://p.typekit.net; connect-src 'self' ws://161.118.248.180:8642 http://161.118.248.180:8642 wss://* https://*.supabase.co https://accounts.google.com https://*.googleapis.com https://*.firebaseio.com https://acrobat.adobe.com https://*.adobe.com https://www.google-analytics.com; frame-src 'self' https://accounts.google.com https://acrobat.adobe.com https://*.adobe.com;",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  response.headers.set('x-theme', theme);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
