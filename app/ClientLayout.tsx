'use client';

import React, { useState, useEffect, Suspense, Component, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../lib/utils';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { ToastProvider, ToastContainer } from '../components/ui';
import OmniCommandPalette from '../components/omni/OmniCommandPalette';
import AppShellV2 from './AppShellV2';
import { DebugPanel } from '../lib/debug-platform';

// Error boundary to prevent AppShellV2 crashes from breaking the whole page
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

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
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
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

  // Authenticated routes — wrap in AppShellV2 with error boundary
  if (isAuthenticated) {
    return (
      <ErrorBoundary
        fallback={
          <div className="relative">
            <ToastContainer />
            <OmniCommandPalette />
            {children}
          </div>
        }
      >
        <AppShellV2>
          {children}
          <ToastContainer />
          <OmniCommandPalette />
        </AppShellV2>
      </ErrorBoundary>
    );
  }

  // Fallback: show children without shell
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
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={null}>
          <AppContent>{children}</AppContent>
        </Suspense>
        {isDebugEnabled && <DebugPanel />}
      </AuthProvider>
    </ToastProvider>
  );
}
