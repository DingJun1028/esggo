import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const CANARY_PERCENTAGE = 100;
const THEMES = ['esggo', 'default'] as const;
type Theme = (typeof THEMES)[number];

function getTheme(request: NextRequest): Theme {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith('/canary/esggo')) return 'esggo';

  const cookieTheme = request.cookies.get('theme-preference')?.value as Theme | null;
  if (cookieTheme && THEMES.includes(cookieTheme)) return cookieTheme;

  const forceTheme = request.nextUrl.searchParams.get('theme') as Theme | null;
  if (forceTheme && THEMES.includes(forceTheme)) return forceTheme;

  const hash = Array.from(path).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isCanary = hash % 100 < CANARY_PERCENTAGE;
  return isCanary ? 'esggo' : 'default';
}

function setThemeCookie(response: NextResponse, theme: Theme): void {
  response.cookies.set('theme-preference', theme, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax',
  });
}

/**
 * ESG GO | System Middleware v1.5
 *
 * Auth modes:
 * - Supabase mode: When NEXT_PUBLIC_SUPABASE_URL is configured (not placeholder)
 * - Demo mode: When Supabase is not configured, allows omni_demo_session cookie
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isPlaceholder =
    supabaseUrl.includes('placeholder') ||
    supabaseKey.includes('placeholder') ||
    !supabaseUrl ||
    !supabaseKey;

  const isDemoMode = isPlaceholder;
  const hasDemoSession = request.cookies.get('omni_demo_session')?.value === 'true';

  const supabase = createServerClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key',
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBypass = request.cookies.get('omni_user_bypass')?.value === 'true' && isDevelopment;
  const hasOmniSession = request.cookies.has('omni_session');

  const isPublicRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname.startsWith('/test-') ||
    request.nextUrl.pathname.startsWith('/api/');

  // 5T Traceable: clear corrupted session on auth error
  if (error && !isBypass && !isPublicRoute && !isDemoMode) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.cookies.delete('sb-access-token');
    redirectResponse.cookies.delete('sb-refresh-token');
    return redirectResponse;
  }

  // Auth gate: Supabase mode → redirect to login if no user
  if (!user && !isBypass && !isPublicRoute && !isDemoMode) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Auth gate: Demo mode → redirect to login if no demo session & no omni_session
  if (isDemoMode && !hasDemoSession && !hasOmniSession && !isPublicRoute && !isBypass) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Logged-in users on login/signup → redirect to dashboard
  if ((user || hasDemoSession || hasOmniSession || isBypass) &&
      (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') &&
      !isDevelopment) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const theme = getTheme(request);
  setThemeCookie(supabaseResponse, theme);

  const securityHeaders = {
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://*.firebaseapp.com https://acrobat.adobe.com https://use.typekit.net https://www.googletagmanager.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://p.typekit.net https://accounts.google.com; font-src 'self' https://fonts.gstatic.com https://use.typekit.net data: https: http:; img-src 'self' data: https://*.supabase.co https://*.unsplash.com https://p.typekit.net; connect-src 'self' ws://161.118.248.180:8642 http://161.118.248.180:8642 wss://* https://*.supabase.co https://accounts.google.com https://*.googleapis.com https://*.firebaseio.com https://acrobat.adobe.com https://*.adobe.com https://www.google-analytics.com; frame-src 'self' https://accounts.google.com https://acrobat.adobe.com https://*.adobe.com;",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  Object.entries(securityHeaders).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value);
  });
  supabaseResponse.headers.set('x-theme', theme);

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
