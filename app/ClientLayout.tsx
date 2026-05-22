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
  Bell, ShieldCheck, ChevronDown, Search, Layers, Code
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
      { href: '/swarm',               label: '代理蜂群',   sub: 'Swarm Mode',   icon: <Users size={16} /> },
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
  { href: '/tasks',        label: '任務',   sub: '', icon: <ClipboardList size={20} /> },
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

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem('sidebar_collapsed') === 'true') setCollapsed(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!mounted) return null;

  const currentPath = pathname ?? '/';

  return (
    <div className="app-shell">
      <CommandPalette />
      
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
              <BrandButton variant="ghost" size="icon">
                <Bell size={18} />
              </BrandButton>
            </BrandTooltip>
            <BrandTooltip content="治理規範">
              <BrandButton variant="ghost" size="icon" onClick={() => router.push('/audit-governance')}>
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

        {/* Mobile Nav */}
        <nav className="mobile-nav">
          {MOBILE_NAV_ITEMS.map(item => {
            const active = item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`mobile-nav-item ${active ? 'active' : ''}`}>
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
