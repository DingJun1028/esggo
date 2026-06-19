'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { ToastProvider, ToastContainer } from '../components/ui';
import OmniCommandPalette from '../components/omni/OmniCommandPalette';
import { ThemeProvider } from '../contexts/ThemeContext';
import AppShellV2 from './AppShellV2';
import { DebugPanel } from '../lib/debug-platform';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    // Only redirect to login if clearly NOT authenticated AND not on public routes
    if (
      isAuthenticated === false &&
      pathname !== '/login' &&
      pathname !== '/terminal' &&
      pathname !== '/' &&
      pathname !== '/esggo-omnipencil'
    ) {
      router.replace('/login');
    } else if (isAuthenticated === true && pathname === '/login') {
      router.replace('/dashboard');
    }
  }, [mounted, isAuthenticated, loading, pathname, router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Public routes — no shell
  const isPublic =
    pathname === '/login' ||
    pathname === '/terminal' ||
    pathname === '/' ||
    pathname === '/esggo-omnipencil' ||
    pathname.startsWith('/test-');

  if (isPublic) {
    return (
      <div className="relative">
        <ToastContainer />
        <OmniCommandPalette />
        {children}
      </div>
    );
  }

  // Authenticated routes — wrap in AppShellV2
  if (isAuthenticated) {
    return (
      <AppShellV2>
        {children}
        <ToastContainer />
        <OmniCommandPalette />
      </AppShellV2>
    );
  }

  // Fallback: show children without shell (for / when not authenticated)
  return (
    <div className="relative">
      <ToastContainer />
      <OmniCommandPalette />
      {children}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const isDebugEnabled =
    process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_ENABLED === 'true';

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Suspense fallback={null}>
            <AppContent>{children}</AppContent>
          </Suspense>
          {isDebugEnabled && <DebugPanel />}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
