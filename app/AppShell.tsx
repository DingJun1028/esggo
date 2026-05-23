'use client';
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, ChevronLeft, LayoutDashboard, FileText, Fingerprint, 
  HeartPulse, MessageSquare, BarChart3, Leaf, Users, ShieldCheck, 
  Hexagon, ListChecks, Lock, ClipboardList, Map, BookOpen, 
  Library, Wallet, Link2, Handshake, CheckCircle2, GraduationCap, 
  UserRound, Globe, CheckSquare, Building2, Cable, Radio, Bot, Shield,
  Search, Command, X, Sparkles, ArrowRight, Settings2, Layout
} from 'lucide-react';
import HermesFloatingAgent from '../components/brand/HermesFloatingAgent';
import WorkspacePanel from '../components/brand/WorkspacePanel';
import ComposerFooter from '../components/brand/ComposerFooter';
import HermesControlCenter from '../components/brand/HermesControlCenter';

const navGroups = [
  // ... (keep existing navGroups)
];

// ... (keep CommandPalette)

function SidebarContent({ collapsed, onCollapse, onSearch, onOpenSettings }: { collapsed: boolean; onCollapse: () => void; onSearch: () => void; onOpenSettings: () => void }) {
  const pathname = usePathname() ?? '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} bg-[#003262] border-r border-white/5 shadow-2xl shadow-black/20 flex flex-col`}>
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5 min-h-[56px]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FDB515] to-[#f4a100] flex items-center justify-center font-black text-[#003262] text-[11px] shadow-lg flex-shrink-0">
          ESG
        </div>
        {!collapsed && (
          <div className="animate-in fade-in duration-500 slide-in-from-left-4 min-w-0">
            <div className="text-[#FDB515] font-black text-sm leading-none tracking-tight">OmniHermes</div>
            <div className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">Enterprise OS</div>
          </div>
        )}
        <button
          onClick={onCollapse}
          className="ml-auto p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/5"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="px-3 py-2">
        <button 
          onClick={onSearch}
          className={`flex items-center gap-2.5 w-full p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all group ${collapsed ? 'justify-center' : ''}`}
        >
          <Search size={15} className="group-hover:scale-110 transition-transform flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left text-[12px] font-bold">快速搜尋...</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[8px] font-black opacity-50">
                <Command size={9} />K
              </div>
            </>
          )}
        </button>
      </div>

      <nav className="flex-1 py-1 overflow-y-auto no-scrollbar scroll-smooth">
        {navGroups.map((group) => (
          <div key={group.label} className="px-3 mb-4 last:mb-0">
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[9px] font-black text-white/20 uppercase tracking-[0.35em]">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
               {group.items.map((item) => (
                 <Link
                   key={item.href}
                   href={item.href}
                   className={`flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                     isActive(item.href) 
                       ? 'bg-white/10 text-[#FDB515]' 
                       : 'text-white/50 hover:bg-white/5 hover:text-white'
                   }`}
                   title={collapsed ? `${item.label} · ${item.sub}` : undefined}
                 >
                   {isActive(item.href) && (
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FDB515] rounded-full" />
                   )}
                   <span className={`flex-shrink-0 transition-all duration-300 ${isActive(item.href) ? 'text-[#FDB515]' : 'group-hover:text-white'}`}>
                     {React.cloneElement(item.icon as React.ReactElement, { size: 15 })}
                   </span>
                   {!collapsed && (
                     <div className="overflow-hidden min-w-0">
                       <div className="text-[12px] font-bold whitespace-nowrap leading-none">
                         {item.label}
                       </div>
                       <div className={`text-[8px] uppercase font-bold tracking-widest mt-0.5 ${isActive(item.href) ? 'text-[#FDB515]/50' : 'text-white/20 group-hover:text-white/30'}`}>
                         {item.sub}
                       </div>
                     </div>
                   )}
                 </Link>
               ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Control Center Trigger */}
      <div className="px-3 py-2 border-t border-white/5">
         <button 
          onClick={onOpenSettings}
          className={`flex items-center gap-2.5 w-full p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all group ${collapsed ? 'justify-center' : ''}`}
         >
            <Settings2 size={15} className="group-hover:rotate-90 transition-transform flex-shrink-0" />
            {!collapsed && <span className="text-[12px] font-bold">控制中心</span>}
         </button>
      </div>

      <div className={`px-4 py-3 border-t border-white/5 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          {!collapsed && (
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">5T Node · Active</span>
          )}
        </div>
      </div>
    </aside>
  );
}

// ... (keep MobileNav)

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check, { passive: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsWorkspaceOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="app-shell min-h-screen font-sans bg-[#F8FAFC] flex overflow-hidden">
      {!isMobile && (
        <SidebarContent 
          collapsed={collapsed} 
          onCollapse={() => setCollapsed(!collapsed)} 
          onSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsControlCenterOpen(true)}
        />
      )}
      
      <div className="flex-1 flex flex-col relative overflow-hidden min-h-screen">
        <main className={`main-content flex-1 transition-all duration-500 relative ${!isMobile && collapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile-mode' : ''} ${isWorkspaceOpen ? 'mr-[400px]' : ''} pb-32 overflow-y-auto no-scrollbar`}>
          <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]" />
          <div className="relative z-10 p-6 lg:p-10">
            {children}
          </div>
        </main>

        {!isMobile && <ComposerFooter />}
      </div>

      {!isMobile && (
        <WorkspacePanel 
          isOpen={isWorkspaceOpen} 
          onClose={() => setIsWorkspaceOpen(false)} 
        />
      )}
      
      {/* Workspace Trigger (Desktop Only) */}
      {!isMobile && !isWorkspaceOpen && (
        <button 
          onClick={() => setIsWorkspaceOpen(true)}
          className="fixed right-6 top-1/2 -translate-y-1/2 w-10 h-24 bg-white/80 backdrop-blur-xl border border-slate-100 shadow-premium rounded-full flex flex-col items-center justify-center gap-4 text-slate-300 hover:text-[#003262] hover:border-blue-100 transition-all z-40 group"
        >
           <Layout size={18} className="group-hover:scale-110 transition-transform" />
           <div className="h-8 w-px bg-slate-100 group-hover:bg-blue-100 transition-colors" />
           <ChevronLeft size={16} />
        </button>
      )}
      
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <HermesControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />
      {isMobile && <MobileNav />}
      <HermesFloatingAgent />
    </div>
  );
}


export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-[#003262] animate-pulse" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#FDB515] border-t-transparent rounded-2xl animate-spin" />
        </div>
      </div>
    }>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}
