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
  BrandButton, BrandBadge, BrandAvatar, BrandStatusDot, BrandSearchBar, BrandTooltip
} from '../components/brand';

interface NavItem { href: string; label: string; sub: string; icon: React.ReactNode; }
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--berkeley-blue)' }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        height: 'var(--topbar-h)', padding: '0 var(--space-4)',
        borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-lg)',
          background: 'var(--california-gold)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--berkeley-blue)', fontWeight: 900, fontSize: 14, flexShrink: 0,
          letterSpacing: '-0.02em', boxShadow: '0 4px 12px rgba(253,181,21,0.2)'
        }}>O</div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--california-gold)', lineHeight: 1.2, letterSpacing: '0.02em' }}>
              OmniHermes
            </p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.48)', fontWeight: 600, textTransform: 'uppercase' }}>
              ESG Go System
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', scrollbarWidth: 'none' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '6px 12px',
                  fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.24)',
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', borderRadius: 'var(--radius-md)',
                  minHeight: 28,
                }}
              >
                <span>{group.title}</span>
                {openGroups[group.title] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
              {(collapsed || openGroups[group.title]) && group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNav}
                    title={collapsed ? `${item.label} · ${item.sub}` : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 12px', borderRadius: 'var(--radius-lg)',
                      minHeight: 40, textDecoration: 'none',
                      background: active ? 'rgba(253,181,21,0.12)' : 'transparent',
                      color: active ? 'var(--california-gold)' : 'rgba(255,255,255,0.64)',
                      fontWeight: active ? 700 : 400,
                      borderLeft: `3px solid ${active ? 'var(--california-gold)' : 'transparent'}`,
                      transition: 'all 0.2s var(--ease)',
                    }}
                  >
                    <span style={{ flexShrink: 0, color: active ? 'var(--california-gold)' : 'rgba(255,255,255,0.32)' }}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</p>
                        <p style={{ fontSize: 9, color: active ? 'rgba(253,181,21,0.6)' : 'rgba(255,255,255,0.24)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.sub}</p>
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
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 'var(--radius-lg)',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)'
          }}>
            <BrandStatusDot status="active" pulse size="sm" />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)', fontWeight: 700, letterSpacing: '0.05em' }}>
              5T PROTOCOL ACTIVE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileGlobalMenu({ isOpen, onClose, currentPath }: { isOpen: boolean; onClose: () => void; currentPath: string }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fade-in"
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
        background: 'var(--surface-page)', display: 'flex', flexDirection: 'column',
        overflowY: 'auto', paddingBottom: '2rem'
      }}
    >
      {/* Menu Header */}
      <div style={{
        flexShrink: 0, height: 'var(--topbar-h)', padding: '0 var(--space-5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)', background: '#fff',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-md)',
            background: 'var(--blue-700)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12,
          }}>O</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
            OmniHermes 全功能導覽
          </span>
        </div>
        <BrandButton variant="ghost" size="icon" onClick={onClose} style={{ borderRadius: '50%' }}>
          <X size={20} />
        </BrandButton>
      </div>

      {/* Menu Content */}
      <div style={{ padding: 'var(--space-6) var(--space-5)' }}>
        {NAV_GROUPS.map((group, idx) => (
          <div key={group.title} style={{ marginBottom: idx === NAV_GROUPS.length - 1 ? 0 : '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
              <div style={{ width: 4, height: 16, background: 'var(--blue-700)', borderRadius: 2 }} />
              <h3 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {group.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {group.items.map(item => {
                const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={onClose}
                    style={{ textDecoration: 'none' }}
                  >
                    <BrandCard 
                      padding="sm" 
                      hover 
                      className={`h-full text-center transition-all ${active ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/10' : ''}`}
                      style={{ borderRadius: 'var(--radius-2xl)' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2"
                        style={{ background: active ? 'var(--blue-700)' : 'var(--neutral-100)', color: active ? '#fff' : 'var(--blue-700)' }}
                      >
                        {item.icon}
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--blue-700)' : 'var(--text-primary)', marginBottom: 2 }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {item.sub}
                      </p>
                    </BrandCard>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Footer Info */}
      <div style={{ padding: '0 var(--space-5)', textAlign: 'center', opacity: 0.4 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)' }}>
          OMNI_TERMINAL v8.5.1 · INTEGRITY ACTIVE
        </p>
      </div>
    </div>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem('sidebar_collapsed') === 'true') setCollapsed(true);
      // Simulated Auth Check
      const user = localStorage.getItem('omni_user');
      setIsAuthenticated(!!user);
    } catch { 
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => { 
    setMobileOpen(false); 
    setMobileMoreOpen(false);
  }, [pathname]);

  // Auth Guard & Bidirectional Redirect
  useEffect(() => {
    if (!mounted || isAuthenticated === null) return;

    if (isAuthenticated === false && pathname !== '/auth/login') {
      router.replace('/auth/login');
    } else if (isAuthenticated === true && pathname === '/auth/login') {
      router.replace('/');
    }
  }, [mounted, isAuthenticated, pathname, router]);

  if (!mounted) return null;

  // Don't show shell on login page, but allow rendering the login page itself
  if (pathname === '/auth/login') {
    return <>{children}</>;
  }

  // If still checking auth or not authenticated, don't show the dashboard shell yet
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentPath = pathname ?? '/';

  return (
    <div className="app-shell">
      <CommandPalette />
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <SidebarInner
          collapsed={collapsed}
          currentPath={currentPath}
          onNav={() => setMobileOpen(false)}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hide-mobile"
          style={{
            position: 'absolute', top: '50%', right: -12,
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--surface-card)', border: '1px solid var(--border-default)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)', cursor: 'pointer', zIndex: 10,
          }}
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="topbar">
          <button className="show-mobile-only btn btn-ghost btn-icon btn-sm" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hide-mobile" style={{ flex: 1, maxWidth: 400 }}>
            <BrandSearchBar 
              placeholder="搜尋治理指標、GRI 標準或 AI 任務..." 
              onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
            />
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BrandTooltip content="系統通知">
              <BrandButton variant="ghost" size="sm" style={{ width: 36, height: 36, padding: 0 }}>
                <Bell size={18} />
              </BrandButton>
            </BrandTooltip>
            <BrandTooltip content="治理規範">
              <BrandButton variant="ghost" size="sm" style={{ width: 36, height: 36, padding: 0 }} onClick={() => router.push('/audit-governance')}>
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

        <main id="main-content" style={{ flex: 1, paddingBottom: '5rem' }}>
          {children}
        </main>

        {/* Mobile More Full Screen Menu */}
        <div 
          className="show-mobile-only"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: '60px', 
            background: 'rgba(0, 50, 98, 0.95)', // Berkeley blue with opacity
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 100,
            overflowY: 'auto', padding: '24px 16px',
            opacity: mobileMoreOpen ? 1 : 0,
            pointerEvents: mobileMoreOpen ? 'auto' : 'none',
            transform: mobileMoreOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            paddingBottom: '40px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h2 style={{ color: 'var(--california-gold)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>功能總覽</h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>ESG Go System Navigation</p>
            </div>
            <button 
              onClick={() => setMobileMoreOpen(false)} 
              style={{ 
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', 
                width: 36, height: 36, borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {NAV_GROUPS.map((group, gIndex) => (
              <div 
                key={group.title}
                style={{ 
                  animation: mobileMoreOpen ? `slideUpFade 0.4s ease-out forwards ${gIndex * 0.05}s` : 'none',
                  opacity: mobileMoreOpen ? 0 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 12, background: 'var(--california-gold)', borderRadius: 2 }} />
                  <h3 style={{ color: 'white', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {group.title}
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {group.items.map(item => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileMoreOpen(false)}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: 12,
                        padding: '16px', borderRadius: '16px',
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        textDecoration: 'none', color: 'white',
                        boxShadow: '0 4px 24px -8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <div style={{ 
                        width: 32, height: 32, borderRadius: '10px', 
                        background: 'rgba(253,181,21,0.15)', color: 'var(--california-gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase' }}>{item.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="mobile-nav">
          {MOBILE_NAV_ITEMS.map(item => {
            if (item.href === '#more') {
              return (
                <button 
                  key="more" 
                  onClick={() => setMobileMoreOpen(!mobileMoreOpen)} 
                  className={`mobile-nav-item ${mobileMoreOpen ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            }
            const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMoreOpen(false)} className={`mobile-nav-item ${active ? 'active' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
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
      <AppContent>{children}</AppContent>
    </Suspense>
  );
}
