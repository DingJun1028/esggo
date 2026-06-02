'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, Brain, HeartPulse, BarChart3,
  ShieldAlert, Settings, Bell, Search, Menu, X, ChevronRight, ChevronDown,
  User, Database, ShieldCheck, Activity, Zap, Bot, Layout, 
  HelpCircle, MessageSquare, Plus, RefreshCw, Lock, Globe, Cpu, MoreVertical, AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { BrandBadge, BrandButton, BrandCard } from '../components/brand';
import { cn } from '../lib/utils';
import { initAnalytics, isDemoMode } from '../lib/firebase';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { SaaSProvider, useSaaS } from '../hooks/useSaaS';
import { useFcmToken } from '../hooks/useFcmToken';
import OmniAgentControlCenter from '../components/brand/OmniAgentControlCenter';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { ToastProvider, ToastContainer } from '../components/ui';
import AppThemeSwitcher from '../components/AppThemeSwitcher';
import { OmniAgentPulse } from '../components/omni/OmniAgentPulse';

function SystemHealthBanner() {
  const { systemStatus } = useAuth();
  if (systemStatus === 'online') return null;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
      systemStatus === 'offline' ? "bg-red-50 border-red-100 text-red-600" : "bg-amber-50 border-amber-100 text-amber-600"
    )}>
       <AlertCircle size={10} className={systemStatus === 'offline' ? "animate-pulse" : ""} />
       {systemStatus === 'offline' ? "System_Offline" : "Auth_Sync_Degraded"}
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
       <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider group-hover:text-blue-600">{companyId}</span>
       <ChevronDown size={10} className="text-slate-300" />
    </div>
  );
}

import AppShellV2 from './AppShellV2';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    initAnalytics();
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!mounted || loading) return;

    if (isAuthenticated === false && pathname !== '/auth/login' && pathname !== '/terminal' && pathname !== '/') {
      router.replace('/auth/login');
    } else if (isAuthenticated === true && pathname === '/auth/login') {
      router.replace('/dashboard');
    }
  }, [mounted, isAuthenticated, loading, pathname, router]);

  if (!mounted) return null;

  // 1. Public Routes
  if (pathname === '/auth/login' || pathname === '/terminal' || pathname === '/') {
    return <><ToastContainer /><OmniAgentPulse />{children}</>;
  }

  // 2. Loading State
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

  // 3. Protected Shell
  if (isAuthenticated) {
    return (
      <AppShellV2>
        {children}
        <ToastContainer />
        <OmniAgentPulse />
      </AppShellV2>
    );
  }

  return null;
}

import { ThemeProvider } from '../contexts/ThemeContext';
import { TRPCProvider } from '../src/client/providers/TRPCProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TRPCProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <ToastProvider>
              <AuthProvider>
                <SaaSProvider>
                  <AppContent>{children}</AppContent>
                </SaaSProvider>
              </AuthProvider>
            </ToastProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </TRPCProvider>
    </Suspense>
  );
}
