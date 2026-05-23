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
  Search, Command, X, Sparkles, ArrowRight
} from 'lucide-react';
import HermesFloatingAgent from '../components/brand/HermesFloatingAgent';

const navGroups = [
  {
    label: 'CORE',
    items: [
      { href: '/', label: '控制台', sub: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { href: '/editor', label: '永續撰寫', sub: 'SustainWrite', icon: <FileText size={18} /> },
      { href: '/digital-twin', label: '數位分身', sub: 'Digital Twin', icon: <Fingerprint size={18} /> },
      { href: '/health-check', label: '企業健檢', sub: 'Health Check', icon: <HeartPulse size={18} /> },
      { href: '/advisory', label: '專家諮詢', sub: 'Advisory', icon: <MessageSquare size={18} /> },
      { href: '/intelligence', label: '商情中心', sub: 'Intelligence', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    label: 'E-S-G 模組',
    items: [
      { href: '/environmental', label: '環境指揮', sub: 'Environmental', icon: <Leaf size={18} /> },
      { href: '/social', label: '社會影響', sub: 'Social', icon: <Users size={18} /> },
      { href: '/governance', label: '公司治理', sub: 'Governance', icon: <ShieldCheck size={18} /> },
    ],
  },
  {
    label: 'GOVERNANCE',
    items: [
      { href: '/materiality', label: '重大性矩陣', sub: 'Materiality', icon: <Hexagon size={18} /> },
      { href: '/audit-log', label: '審計日誌', sub: 'Audit Log', icon: <ListChecks size={18} /> },
      { href: '/vault', label: '證據金庫', sub: 'Evidence Vault', icon: <Lock size={18} /> },
      { href: '/document-checklist', label: '文件清單', sub: 'Doc Checklist', icon: <ClipboardList size={18} /> },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { href: '/roadmap', label: '淨零路線圖', sub: 'Net-Zero', icon: <Map size={18} /> },
      { href: '/publish', label: '報告發布', sub: 'Publish', icon: <BookOpen size={18} /> },
      { href: '/reading-room', label: '永續閱覽室', sub: 'Reading Room', icon: <Library size={18} /> },
      { href: '/library', label: '永續智庫', sub: 'Library', icon: <Building2 size={18} /> },
      { href: '/finance', label: '永續財務', sub: 'Finance', icon: <Wallet size={18} /> },
      { href: '/supply-chain', label: '供應鏈透明', sub: 'Supply Chain', icon: <Link2 size={18} /> },
      { href: '/stakeholders', label: '利害關係人', sub: 'Stakeholders', icon: <Handshake size={18} /> },
      { href: '/audit-verify', label: 'VerifyLink™', sub: 'ZKP Verify', icon: <CheckCircle2 size={18} /> },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/tasks', label: '任務中心', sub: 'Tasks', icon: <CheckSquare size={18} /> },
      { href: '/profile', label: '企業管理', sub: 'Profile', icon: <Building2 size={18} /> },
      { href: '/api-setup', label: '整合中心', sub: 'API Setup', icon: <Cable size={18} /> },
      { href: '/ai-platform', label: 'AI 平台', sub: 'AI Platform', icon: <Bot size={18} /> },
    ],
  },
];

function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setScanning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query) {
      setResults(navGroups.flatMap(g => g.items).slice(0, 6));
      return;
    }

    const timer = setTimeout(async () => {
      setScanning(true);
      try {
        const { globalSearch } = await import('../lib/db');
        const dbResults = await globalSearch(query);
        
        const navMatches = navGroups.flatMap(g => g.items).filter(i => 
          i.label.includes(query) || i.sub.toLowerCase().includes(query.toLowerCase())
        );

        setResults([...navMatches, ...dbResults]);
      } finally {
        setScanning(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const getIcon = (item: any) => {
    if (item.icon) return item.icon;
    switch (item.type) {
      case 'metric': return <BarChart3 size={18} />;
      case 'task':   return <CheckSquare size={18} />;
      case 'audit':  return <Shield size={18} />;
      default:       return <FileText size={18} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-extreme overflow-hidden">
        <div className="flex items-center gap-4 p-5 border-b border-slate-100">
          <Search size={20} className={searching ? "text-blue-500 animate-spin" : "text-slate-400"} />
          <input 
            autoFocus
            placeholder="搜尋功能、指標數據或 5T 紀錄..."
            className="flex-1 bg-transparent border-none outline-none text-base font-bold text-[#003262] placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[9px] font-black text-slate-400">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 no-scrollbar">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button
                  key={`${item.href}-${idx}`}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#003262]/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#003262] group-hover:border-[#003262]/20 transition-all shadow-sm">
                      {getIcon(item)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-[#003262]">{item.label || item.title}</p>
                        {item.type && <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[8px] font-black uppercase tracking-tighter opacity-40">{item.type}</span>}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub || item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-200 group-hover:text-[#003262] transition-all opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Bot size={40} className="mx-auto text-slate-200 mb-4 animate-bounce" />
              <p className="text-sm font-bold text-slate-400 italic">查無結果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ collapsed, onCollapse, onSearch }: { collapsed: boolean; onCollapse: () => void; onSearch: () => void }) {
  const pathname = usePathname() ?? '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} bg-[#003262] border-r border-white/5 shadow-2xl shadow-black/20`}>
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

function MobileNav() {
  const pathname = usePathname() ?? '/';
  const quickItems = [
    { href: '/', label: '控制', icon: <LayoutDashboard size={18} /> },
    { href: '/advisory', label: '諮詢', icon: <MessageSquare size={18} /> },
    { href: '/environmental', label: '環境', icon: <Leaf size={18} /> },
    { href: '/vault', label: '金庫', icon: <Lock size={18} /> },
    { href: '/editor', label: '撰寫', icon: <FileText size={18} /> },
  ];

  return (
    <nav className="mobile-nav">
      {quickItems.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center justify-center gap-1.5 flex-1 py-3 transition-all relative ${active ? 'text-[#003262]' : 'text-slate-400'}`}
          >
            <div className={`transition-all duration-300 ${active ? 'scale-110 -translate-y-1 text-[#FDB515]' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'text-[#003262] opacity-100 scale-105' : 'opacity-60'}`}>
              {item.label}
            </span>
            {active && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#FDB515] shadow-[0_0_8px_#FDB515]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="app-shell min-h-screen font-sans bg-[#F8FAFC]">
      {!isMobile && (
        <SidebarContent 
          collapsed={collapsed} 
          onCollapse={() => setCollapsed(!collapsed)} 
          onSearch={() => setIsSearchOpen(true)}
        />
      )}
      
      <main className={`main-content transition-all duration-500 relative ${!isMobile && collapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile-mode' : ''}`}>
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]" />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
      
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
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
