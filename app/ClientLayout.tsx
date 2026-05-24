'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, Brain, HeartPulse, BarChart3,
  ShieldAlert, Settings, Bell, Search, Menu, X, ChevronRight, ChevronDown,
  User, Database, ShieldCheck, Activity, Zap, Bot, Layout, 
  HelpCircle, MessageSquare, Plus, RefreshCw, Lock, Globe, Cpu, MoreVertical
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { BrandBadge, BrandButton, BrandCard } from '../components/brand';
import { cn } from '../lib/utils';
import { initAnalytics, isDemoMode } from '../lib/firebase';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { SaaSProvider, useSaaS } from '../hooks/useSaaS';
import { useFcmToken } from '../hooks/useFcmToken';
import HermesControlCenter from '../components/brand/HermesControlCenter';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  
  const { token, notificationPermissionStatus, retrieveToken } = useFcmToken();

  useEffect(() => {
    setMounted(true);
    initAnalytics();
    try {
      if (localStorage.getItem('sidebar_collapsed') === 'true') setCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => { 
    setMobileOpen(false); 
    setMobileMoreOpen(false);
  }, [pathname]);

  // Auth Guard & Bidirectional Redirect
  useEffect(() => {
    if (!mounted || loading) return;

    if (isAuthenticated === false && pathname !== '/auth/login' && pathname !== '/terminal' && pathname !== '/') {
      router.replace('/auth/login');
    } else if (isAuthenticated === true && pathname === '/auth/login') {
      router.replace('/dashboard');
    }
  }, [mounted, isAuthenticated, loading, pathname, router]);

  if (!mounted) return null;

  // Don't show shell on login page, terminal or landing page
  if (pathname === '/auth/login' || pathname === '/terminal' || pathname === '/') {
    return <>{children}</>;
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

  if (isAuthenticated === false) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFD] overflow-hidden selection:bg-blue-500/10">
      <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-sm transition-all duration-300">
         <Sidebar isCollapsed={collapsed} setIsCollapsed={setCollapsed} />
         {!collapsed && (
           <div className="p-4 mt-auto">
              <SaaSStatusWidget />
           </div>
         )}
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-[52px] bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between px-6 z-40 sticky top-0 shadow-sm">
           <div className="flex items-center gap-4">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-[#003262]"><LayoutDashboard size={20}/></button>
              <div className="hidden lg:flex items-center gap-2">
                 <BrandBadge variant="outline" size="xs" className="text-slate-400 font-mono tracking-widest border-slate-100">HERMES_v11.7</BrandBadge>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <TenantSwitcher />
              <button 
                onClick={() => setControlCenterOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-all group border border-blue-100/50 shadow-sm"
              >
                 <Zap size={14} className="group-hover:scale-125 transition-transform text-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Summon_Hermes</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#003262] flex items-center justify-center text-[#FDB515] font-black text-xs shadow-md border-2 border-white">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative">
          <div className="min-h-full pb-20">
            {children}
          </div>
        </main>

        <AnimatePresence>
          {controlCenterOpen && (
            <HermesControlCenter isOpen={controlCenterOpen} onClose={() => setControlCenterOpen(false)} />
          )}
        </AnimatePresence>
        
        {/* Floating Global Action */}
        <button 
          onClick={() => setControlCenterOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-[#003262] text-[#FDB515] flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 border-2 border-white group"
        >
           <Bot size={28} className="group-hover:rotate-12 transition-transform" />
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      </div>
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

function SaaSStatusWidget() {
  const { plan, usage, upgradePlan } = useSaaS();
  const pct = Math.round((usage.aiWords / usage.aiLimit) * 100);

  return (
    <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
       <div className="flex items-center justify-between">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SaaS Plan</p>
          <BrandBadge variant="gold" size="xs" className="scale-75 origin-right uppercase">{plan}</BrandBadge>
       </div>
       <div className="space-y-1.5">
          <div className="flex justify-between items-end">
             <span className="text-[8px] font-bold text-slate-400 uppercase">AI Capacity</span>
             <span className="text-[10px] font-black text-[#003262]">{pct}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-blue-600" />
          </div>
       </div>
       <button 
         onClick={upgradePlan}
         className="w-full h-10 rounded-xl bg-white border border-slate-200 text-[#003262] text-[9px] font-black uppercase tracking-widest hover:bg-[#003262] hover:text-white transition-all shadow-sm"
       >
          Upgrade_Plan
       </button>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <SaaSProvider>
          <AppContent>{children}</AppContent>
        </SaaSProvider>
      </AuthProvider>
    </Suspense>
  );
}
