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
  Bell, ShieldCheck, ChevronDown, Search, Layers,
} from 'lucide-react';

interface NavItem { href: string; label: string; sub: string; icon: React.ReactNode; }
interface NavGroup { title: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'CORE',
    items: [
      { href: '/',             label: '控制台',   sub: 'Dashboard',    icon: <LayoutDashboard size={15} /> },
      { href: '/editor',       label: '永續撰寫', sub: 'SustainWrite', icon: <FileText size={15} /> },
      { href: '/digital-twin', label: '數位分身', sub: 'Digital Twin', icon: <Brain size={15} /> },
      { href: '/health-check', label: '企業健檢', sub: 'Health Check', icon: <HeartPulse size={15} /> },
      { href: '/intelligence', label: '商情中心', sub: 'Intelligence',  icon: <BarChart3 size={15} /> },
    ],
  },
  {
    title: 'E · S · G',
    items: [
      { href: '/environmental', label: '環境指揮', sub: 'Environmental', icon: <Leaf size={15} /> },
      { href: '/social',        label: '社會影響', sub: 'Social',        icon: <Users size={15} /> },
      { href: '/governance',    label: '公司治理', sub: 'Governance',    icon: <Building2 size={15} /> },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      { href: '/materiality',  label: '重大性矩陣', sub: 'Materiality',    icon: <Target size={15} /> },
      { href: '/audit-log',    label: '審計日誌',   sub: 'Audit Log',      icon: <ClipboardList size={15} /> },
      { href: '/vault',        label: '證據金庫',   sub: 'Evidence Vault', icon: <Database size={15} /> },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { href: '/roadmap',      label: '淨零路線圖', sub: 'Net-Zero',     icon: <TrendingDown size={15} /> },
      { href: '/audit-verify', label: 'VerifyLink', sub: 'ZKP Verify',   icon: <FileSearch size={15} /> },
      { href: '/publish',      label: '報告發布',   sub: 'Publish',      icon: <BookOpen size={15} /> },
      { href: '/reading-room', label: '永續閱覽室', sub: 'Reading Room', icon: <Library size={15} /> },
      { href: '/supply-chain', label: '供應鏈透明', sub: 'Supply Chain', icon: <Truck size={15} /> },
      { href: '/finance',      label: '永續財務',   sub: 'Finance',      icon: <DollarSign size={15} /> },
      { href: '/stakeholders', label: '利害關係人', sub: 'Stakeholders', icon: <UserCheck size={15} /> },
    ],
  },
  {
    title: 'ACADEMY',
    items: [
      { href: '/academy',  label: '永續學院', sub: 'Academy', icon: <GraduationCap size={15} /> },
      { href: '/advisors', label: '顧問服務', sub: 'Advisory', icon: <UserCircle size={15} /> },
    ],
  },
  {
    title: 'HERMES AI',
    items: [
      { href: '/hermes-orchestrator', label: 'Agent 調度', sub: 'Orchestrator', icon: <Bot size={15} /> },
      { href: '/hermes-architecture', label: '架構治理',   sub: 'Architecture', icon: <Layers size={15} /> },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/tasks',          label: '任務中心', sub: 'Tasks',       icon: <ClipboardList size={15} /> },
      { href: '/profile',        label: '企業管理', sub: 'Profile',     icon: <Building2 size={15} /> },
      { href: '/ai-platform',    label: 'AI 平台',  sub: 'AI Platform', icon: <Bot size={15} /> },
      { href: '/api-setup',      label: '整合中心', sub: 'API Setup',   icon: <Cog size={15} /> },
      { href: '/design-library', label: '元件庫',   sub: 'Components',  icon: <Settings size={15} /> },
    ],
  },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: '/',             label: '控制台', sub: '', icon: <Home size={20} /> },
  { href: '/editor',       label: '撰寫',   sub: '', icon: <FileText size={20} /> },
  { href: '/vault',        label: '金庫',   sub: '', icon: <Database size={20} /> },
  { href: '/intelligence', label: '商情',   sub: '', icon: <BarChart3 size={20} /> },
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 'var(--topbar-h)', padding: '0 var(--space-4)',
        borderBottom: '1px solid var(--border-default)', flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-lg)',
          background: 'var(--blue-700)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
          letterSpacing: '-0.02em',
        }}>E</div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              ESG GO
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>
              善向永續
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px', scrollbarWidth: 'none' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '5px 8px',
                  fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', borderRadius: 'var(--radius-md)',
                  minHeight: 28,
                }}
                aria-expanded={openGroups[group.title]}
                aria-controls={`nav-group-${group.title}`}
              >
                <span>{group.title}</span>
                {openGroups[group.title]
                  ? <ChevronDown size={10} />
                  : <ChevronRight size={10} />}
              </button>
            )}

            <div
              id={`nav-group-${group.title}`}
              style={{ display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              {(collapsed || openGroups[group.title]) && group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNav}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? `${item.label} · ${item.sub}` : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 'var(--radius-lg)',
                      minHeight: 40, textDecoration: 'none',
                      background: active ? 'var(--blue-50)' : 'transparent',
                      color: active ? 'var(--blue-700)' : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 400,
                      borderLeft: `2px solid ${active ? 'var(--blue-700)' : 'transparent'}`,
                      transition: 'all var(--duration-fast) var(--ease)',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      color: active ? 'var(--blue-700)' : 'var(--text-tertiary)',
                    }}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{
                          fontSize: 12, lineHeight: 1.2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{item.label}</p>
                        <p style={{
                          fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{item.sub}</p>
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
        <div style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--border-default)', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 'var(--radius-lg)',
            background: 'var(--blue-50)',
          }}>
            <div className="status-dot active pulse" />
            <span style={{ fontSize: 10, color: 'var(--blue-700)', fontWeight: 600 }}>
              5T 系統運行中
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

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem('sidebar_collapsed', String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  if (!mounted) return null;

  const currentPath = pathname ?? '/';

  return (
    <div className="app-shell">
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        role="button"
        aria-label="關閉選單"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        role="navigation"
        aria-label="主要導航"
      >
        <SidebarInner
          collapsed={collapsed}
          currentPath={currentPath}
          onNav={() => setMobileOpen(false)}
        />

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hide-mobile"
          style={{
            position: 'absolute', top: '50%', right: -12,
            width: 24, height: 24,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)', cursor: 'pointer', zIndex: 10,
          }}
          aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
        >
          {collapsed
            ? <ChevronRight size={11} style={{ color: 'var(--blue-700)' }} />
            : <ChevronLeft size={11} style={{ color: 'var(--blue-700)' }} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="topbar" role="banner">
          {/* Mobile menu button */}
          <button
            className="show-mobile-only btn btn-ghost btn-icon btn-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="開啟導航選單"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile logo */}
          <div className="show-mobile-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 'var(--radius-md)',
              background: 'var(--blue-700)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13,
            }}>E</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              ESG GO
            </span>
          </div>

          {/* Search */}
          <div className="hide-mobile" style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
            <Search size={13} style={{
              position: 'absolute', left: 10, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)', pointerEvents: 'none',
            }} />
            <input
              type="search"
              placeholder="搜尋頁面、指標、標準..."
              className="input input-sm"
              style={{ paddingLeft: 32, height: 36 }}
              onKeyDown={e => {
                const val = (e.target as HTMLInputElement).value;
                if (e.key === 'Enter' && val) {
                  router.push(`/search?q=${encodeURIComponent(val)}`);
                }
              }}
              aria-label="全域搜尋"
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link
              href="/notifications"
              className="btn btn-ghost btn-icon btn-sm hide-mobile"
              aria-label="通知"
            >
              <Bell size={16} />
            </Link>
            <Link
              href="/audit-governance"
              className="btn btn-ghost btn-icon btn-sm hide-mobile"
              aria-label="UIUX 治理規範"
            >
              <ShieldCheck size={16} />
            </Link>
            <Link
              href="/profile"
              className="btn btn-ghost btn-icon btn-sm"
              aria-label="企業管理"
            >
              <UserCircle size={18} />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="mobile-nav" aria-label="手機底部導航">
          {MOBILE_NAV_ITEMS.map(item => {
            const active = item.href === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            className="mobile-nav-item"
            onClick={() => setMobileOpen(true)}
            aria-label="更多功能選單"
          >
            <Menu size={20} />
            <span>更多</span>
          </button>
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