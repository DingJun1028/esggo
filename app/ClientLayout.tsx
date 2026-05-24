'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, FileText, Brain, HeartPulse, BarChart3,
  Leaf, Users, Building2, Target, ClipboardList, Database,
  TrendingDown, FileSearch, BookOpen, Library, DollarSign,
  Truck, UserCheck, GraduationCap, UserCircle, Bot, Cog,
  Settings, ChevronLeft, ChevronRight, Menu, X, Home,
  Bell, ShieldCheck, ChevronDown, Search, Layers, Code, MoreHorizontal
} from 'lucide-react';
import { CommandPalette } from '../components/ui/CommandPalette';
import {
  BrandButton, BrandBadge, BrandAvatar, BrandStatusDot, BrandSearchBar, BrandTooltip, BrandCard
} from '../components/brand';
import { initAnalytics, isDemoMode } from '../lib/firebase';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useFcmToken } from '../hooks/useFcmToken';

interface NavItem { href: string; label: string; sub: string; icon: React.ReactNode; badge?: string; }
interface NavGroup { title: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'CORE 核心',
    items: [
      { href: '/',             label: '控制台',   sub: 'Dashboard',    icon: <LayoutDashboard size={16} /> },
      { href: '/editor',       label: '永續撰寫', sub: 'SustainWrite', icon: <FileText size={16} /> },
      { href: '/digital-twin', label: '數位分身', sub: 'Digital Twin', icon: <Brain size={16} /> },
      { href: '/health-check', label: '企業健檢', sub: 'Health Check', icon: <HeartPulse size={16} /> },
      { href: '/intelligence', label: '商情中心', sub: 'Intelligence',  icon: <BarChart3 size={16} /> },
    ],
  },
  {
    title: 'OmniHermes + ESG Go',
    items: [
      { href: '/hermes-orchestrator', label: 'Agent 調度', sub: 'Orchestrator', icon: <Bot size={16} /> },
      { href: '/hermes-architecture', label: '架構治理',   sub: 'Architecture', icon: <Layers size={16} /> },
      { href: '/swarm',               label: '代理蜂群',   sub: 'Swarm V3',     icon: <Users size={16} />, badge: 'V3' },
    ],
  },
  {
    title: 'E · S · G 模組',
    items: [
      { href: '/environmental', label: '環境指揮', sub: 'Environmental', icon: <Leaf size={16} /> },
      { href: '/social',        label: '社會影響', sub: 'Social',        icon: <Users size={16} /> },
      { href: '/governance',    label: '公司治理', sub: 'Governance',    icon: <Building2 size={16} /> },
    ],
  },
  {
    title: 'GOVERNANCE 治理',
    items: [
      { href: '/materiality',  label: '重大性矩陣', sub: 'Materiality',    icon: <Target size={16} /> },
      { href: '/audit-log',    label: '審計日誌',   sub: 'Audit Log',      icon: <ClipboardList size={16} /> },
      { href: '/vault',        label: '證據金庫',   sub: 'Evidence Vault', icon: <Database size={16} /> },
    ],
  },
  {
    title: 'INSIGHTS 洞察',
    items: [
      { href: '/roadmap',      label: '淨零路線圖', sub: 'Net-Zero',     icon: <TrendingDown size={16} /> },
      { href: '/audit-verify', label: 'VerifyLink™', sub: 'ZKP Verify',  icon: <FileSearch size={16} /> },
      { href: '/publish',      label: '報告發布',   sub: 'Publish',      icon: <BookOpen size={16} /> },
      { href: '/reading-room', label: '永續閱覽室', sub: 'Reading Room', icon: <Library size={16} /> },
      { href: '/supply-chain', label: '供應鏈透明', sub: 'Supply Chain', icon: <Truck size={16} /> },
      { href: '/finance',      label: '永續財務',   sub: 'Finance',      icon: <DollarSign size={16} /> },
      { href: '/stakeholders', label: '利害關係人', sub: 'Stakeholders', icon: <UserCheck size={16} /> },
    ],
  },
  {
    title: 'SYSTEM 系統',
    items: [
      { href: '/tasks',          label: '任務中心', sub: 'Tasks',       icon: <ClipboardList size={16} /> },
      { href: '/profile',        label: '企業管理', sub: 'Profile',     icon: <Building2 size={16} /> },
      { href: '/ai-platform',    label: 'AI 平台',  sub: 'AI Platform', icon: <Bot size={16} /> },
      { href: '/api-setup',      label: '整合中心', sub: 'API Setup',   icon: <Cog size={16} /> },
      { href: '/terminal',       label: 'Terminal', sub: 'Console X',   icon: <Code size={16} /> },
      { href: '/design-library', label: '元件庫',   sub: 'Atoms V2',    icon: <Settings size={16} /> },
    ],
  },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: '/',             label: '控制台', sub: '', icon: <Home size={20} /> },
  { href: '/editor',       label: '撰寫',   sub: '', icon: <FileText size={20} /> },
  { href: '/vault',        label: '金庫',   sub: '', icon: <Database size={20} /> },
  { href: '/swarm',        label: '蜂群',   sub: '', icon: <Users size={20} /> },
  { href: '#more',         label: '更多',   sub: '', icon: <MoreHorizontal size={20} /> },
];

function SidebarInner({ collapsed, currentPath, onNav }: {
  collapsed: boolean; currentPath: string; onNav?: () => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NAV_GROUPS.map(g => [g.title, true]))
  );

  const isActive = (href: string) =>
    href === '/' ? currentPath === '/' : currentPath.startsWith(href);

  const toggleGroup = (title: string) =>
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#003262]">
      {/* Logo */}
      <div className="flex items-center gap-3 h-[var(--topbar-h)] px-[var(--space-4)] border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#FDB515] flex items-center justify-center text-[#003262] font-black text-sm shrink-0 shadow-[0_4px_12px_rgba(253,181,21,0.2)] tracking-tight">O</div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#FDB515] leading-tight tracking-wide">
              OmniHermes
            </p>
            <p className="text-[9px] text-white/50 font-semibold uppercase">
              ESG Go System
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-none">
        {NAV_GROUPS.map(group => (
          <div key={group.title} className="mb-2">
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-extrabold text-white/30 uppercase tracking-[0.12em] bg-transparent border-none cursor-pointer font-mono rounded-md min-h-[28px] hover:text-white/50 transition-colors"
              >
                <span>{group.title}</span>
                {openGroups[group.title] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            )}

            <div className="flex flex-col gap-0.5 mt-1">
              {(collapsed || openGroups[group.title]) && group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNav}
                    title={collapsed ? `${item.label} · ${item.sub}` : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg min-h-[40px] no-underline transition-all duration-200 border-l-[3px] ${
                      active 
                        ? 'bg-[#FDB515]/10 text-[#FDB515] font-bold border-[#FDB515]' 
                        : 'bg-transparent text-white/60 font-normal border-transparent hover:bg-white/5 hover:text-white/90'
                    }`}
                  >
                    <span className={`shrink-0 ${active ? 'text-[#FDB515]' : 'text-white/30'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</p>
                        <p className={`text-[9px] mt-0.5 uppercase tracking-[0.04em] ${active ? 'text-[#FDB515]/60' : 'text-white/30'}`}>{item.sub}</p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
            <BrandStatusDot status="active" pulse size="sm" />
            <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase">
              5T PROTOCOL ACTIVE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
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

    if (isAuthenticated === false && pathname !== '/auth/login' && pathname !== '/terminal') {
      router.replace('/auth/login');
    } else if (isAuthenticated === true && pathname === '/auth/login') {
      router.replace('/dashboard');
    }
  }, [mounted, isAuthenticated, loading, pathname, router]);

  if (!mounted) return null;

  // Don't show shell on login page or terminal, but allow rendering them
  if (pathname === '/auth/login' || pathname === '/terminal') {
    return <>{children}</>;
  }

  // If still checking auth or not authenticated, don't show the dashboard shell yet
  if (loading || isAuthenticated === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentPath = pathname ?? '/';

  return (
    <div className="flex min-h-screen bg-[#F8FAFD] w-full overflow-hidden">
      <CommandPalette />
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-[#003262]/30 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 flex flex-col z-[50] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#003262] ${collapsed ? 'w-[68px]' : 'w-[248px]'} ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        <SidebarInner
          collapsed={collapsed}
          currentPath={currentPath}
          onNav={() => setMobileOpen(false)}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white border border-[#003262]/10 items-center justify-center shadow-sm cursor-pointer z-10 hover:bg-slate-50 transition-colors text-[#003262]"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] w-full max-w-[100vw] lg:max-w-none ml-0 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[248px]'} pb-[58px] lg:pb-0`}>
        <header className="flex items-center justify-between px-4 lg:px-6 h-[52px] lg:h-[60px] bg-white/80 backdrop-blur-md border-b border-[#003262]/10 sticky top-0 z-[40]">
          <button className="flex lg:hidden items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 text-[#003262] transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden lg:block flex-1 max-w-[400px]">
            <BrandSearchBar 
              placeholder="搜尋治理指標、GRI 標準或 AI 任務..." 
              onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
            />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 lg:gap-3">
            <BrandTooltip content={token ? "推播已啟用" : "啟用系統通知"}>
              <BrandButton 
                variant="ghost" 
                size="sm" 
                className={`!w-9 !h-9 p-0 ${token ? 'text-[#FDB515]' : 'text-[#003262]'}`}
                onClick={async () => {
                  if (!token) {
                    const t = await retrieveToken();
                    if (t) console.log("FCM Token retrieved:", t);
                  }
                }}
              >
                <Bell size={18} />
              </BrandButton>
            </BrandTooltip>
            <BrandTooltip content="治理規範">
              <BrandButton variant="ghost" size="sm" className="!w-9 !h-9 p-0 text-[#003262]" onClick={() => router.push('/audit-governance')}>
                <ShieldCheck size={18} />
              </BrandButton>
            </BrandTooltip>
            <BrandAvatar 
              src="/avatar-placeholder.png" 
              name="Admin User" 
              size="md" 
              status="online"
              onClick={() => router.push('/profile')}
            />
          </div>
        </header>

        <main id="main-content" className="flex-1 w-full pb-20">
          {children}
        </main>

        {/* Mobile More Full Screen Menu */}
        <div 
          className={`lg:hidden fixed inset-0 bottom-[58px] bg-[#003262]/95 backdrop-blur-md z-[100] overflow-y-auto p-6 pb-10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMoreOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-5'}`}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-[#FDB515] text-2xl font-extrabold tracking-tight">功能總覽</h2>
              <p className="text-xs text-white/60 mt-1">ESG Go System Navigation</p>
            </div>
            <button 
              onClick={() => setMobileMoreOpen(false)} 
              className="bg-white/10 border-none text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-8">
            {NAV_GROUPS.map((group, gIndex) => (
              <div 
                key={group.title}
                style={{ 
                  animation: mobileMoreOpen ? `slideUpFade 0.4s ease-out forwards ${gIndex * 0.05}s` : 'none',
                  opacity: mobileMoreOpen ? 0 : 1
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-3 bg-[#FDB515] rounded-sm" />
                  <h3 className="text-white text-sm font-bold uppercase tracking-widest">
                    {group.title}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {group.items.map(item => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileMoreOpen(false)}
                      className="flex flex-col gap-3 p-4 rounded-2xl border border-white/10 no-underline text-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] hover:border-white/20 transition-colors bg-gradient-to-br from-white/5 to-white/[0.02]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FDB515]/15 text-[#FDB515] flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.label}</p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{item.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[58px] bg-white/95 backdrop-blur-2xl border-t border-[#003262]/10 z-[50] flex items-center justify-around px-2 shadow-[0_-4px_24px_rgba(0,50,98,0.07)] pb-[env(safe-area-inset-bottom)]">
          {MOBILE_NAV_ITEMS.map(item => {
            if (item.href === '#more') {
              return (
                <button 
                  key="more" 
                  onClick={() => setMobileMoreOpen(!mobileMoreOpen)} 
                  className={`flex flex-col items-center justify-center w-full h-full gap-1 bg-transparent border-none cursor-pointer transition-colors ${mobileMoreOpen ? 'text-[#003262] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {item.icon}
                  <span className="text-[10px]">{item.label}</span>
                </button>
              );
            }
            const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMoreOpen(false)} className={`flex flex-col items-center justify-center w-full h-full gap-1 no-underline transition-colors ${active ? 'text-[#003262] font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
                {item.icon}
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
    </Suspense>
  );
}
