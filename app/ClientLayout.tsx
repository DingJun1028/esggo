'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { ToastProvider, ToastContainer } from '../components/ui';
import OmniCommandPalette from '../components/omni/OmniCommandPalette';
import { ThemeProvider } from '../contexts/ThemeContext';
import AppShellV2 from './AppShellV2';
import { DebugPanel } from '../lib/debug-platform';

function SystemHealthBanner() {
  const { systemStatus } = useAuth();
  if (systemStatus === 'online') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
        systemStatus === 'offline'
          ? 'bg-red-50 border-red-100 text-red-600'
          : 'bg-amber-50 border-amber-100 text-amber-600'
      )}
    >
      <AlertCircle size={10} className={systemStatus === 'offline' ? 'animate-pulse' : ''} />
      {systemStatus === 'offline' ? 'System_Offline' : 'Auth_Sync_Degraded'}
    </div>
  );
}

function TenantSwitcher() {
  const { companyId } = useAuth();
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl shadow-sm group cursor-pointer hover:bg-white transition-all">
      <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
        {companyId.charAt(0).toUpperCase()}
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider group-hover:text-blue-600">
        {companyId}
      </span>
      <ChevronDown size={10} className="text-slate-300" />
    </div>
  );
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

  if (!mounted) return null;

  if (
    pathname === '/login' ||
    pathname === '/terminal' ||
    pathname === '/' ||
    pathname === '/esggo-omnipencil'
  ) {
    return (
      <>
        <ToastContainer />
        {/* <OmniCommandPalette /> */}
        {children}
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFD]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 w-full h-full border-4 border-blue-100 rounded-2xl" />
          <div className="absolute inset-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-2xl animate-spin" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AppShellV2>
        {children}
        <ToastContainer />
        {/* <OmniCommandPalette /> */}
      </AppShellV2>
    );
  }

  return null;
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
