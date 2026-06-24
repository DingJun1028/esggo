import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 5T Security: Validate bypass strictly (Traceable / Trust)
  // Only allow bypass in development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBypass = request.cookies.get('omni_user_bypass')?.value === 'true' && isDevelopment;

  const isPublicRoute =
    request.nextUrl.pathname === '/login' || 
    request.nextUrl.pathname === '/signup' || 
    request.nextUrl.pathname.startsWith('/test-');

  const isPlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  // 5T Traceable: If there's an auth error (e.g. invalid JWT), clear corrupted session
  if (error && !isBypass && !isPublicRoute && !isPlaceholder) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirectResponse = NextResponse.redirect(url);
    // Clear potentially corrupted session cookies
    redirectResponse.cookies.delete('sb-access-token');
    redirectResponse.cookies.delete('sb-refresh-token');
    return redirectResponse;
  }

  if (!user && !isBypass && !isPublicRoute && !isPlaceholder) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if ((user || isBypass) && isPublicRoute && !isDevelopment) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
