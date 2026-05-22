'use client';
import { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const navGroups = [
  {
    label: 'CORE',
    items: [
      { href: '/', label: '控制台', sub: 'Dashboard', icon: '⊞' },
      { href: '/editor', label: '永續撰寫', sub: 'SustainWrite', icon: '✎' },
      { href: '/digital-twin', label: '數位分身', sub: 'Digital Twin', icon: '◈' },
      { href: '/health-check', label: '企業健檢', sub: 'Health Check', icon: '♥' },
      { href: '/advisory', label: '專家諮詢', sub: 'Advisory', icon: '◎' },
      { href: '/intelligence', label: '商情中心', sub: 'Intelligence', icon: '◉' },
    ],
  },
  {
    label: 'E-S-G 模組',
    items: [
      { href: '/environmental', label: '環境指揮', sub: 'Environmental', icon: '🌿' },
      { href: '/social', label: '社會影響', sub: 'Social', icon: '👥' },
      { href: '/governance', label: '公司治理', sub: 'Governance', icon: '⚖' },
    ],
  },
  {
    label: 'GOVERNANCE',
    items: [
      { href: '/materiality', label: '重大性矩陣', sub: 'Materiality', icon: '⬡' },
      { href: '/audit-log', label: '審計日誌', sub: 'Audit Log', icon: '📋' },
      { href: '/vault', label: '證據金庫', sub: 'Evidence Vault', icon: '🔐' },
      { href: '/document-checklist', label: '文件清單', sub: 'Doc Checklist', icon: '📄' },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { href: '/roadmap', label: '淨零路線圖', sub: 'Net-Zero', icon: '🗺' },
      { href: '/publish', label: '報告發布', sub: 'Publish', icon: '📑' },
      { href: '/reading-room', label: '永續閱覽室', sub: 'Reading Room', icon: '📚' },
      { href: '/library', label: '永續智庫', sub: 'Library', icon: '🏛' },
      { href: '/finance', label: '永續財務', sub: 'Finance', icon: '💰' },
      { href: '/supply-chain', label: '供應鏈透明', sub: 'Supply Chain', icon: '🔗' },
      { href: '/stakeholders', label: '利害關係人', sub: 'Stakeholders', icon: '🤝' },
      { href: '/audit-verify', label: 'VerifyLink™', sub: 'ZKP Verify', icon: '✓' },
    ],
  },
  {
    label: 'ACADEMY',
    items: [
      { href: '/academy', label: '永續學院', sub: 'Academy', icon: '🎓' },
      { href: '/advisors', label: '顧問服務', sub: 'Advisors', icon: '👔' },
      { href: '/agents', label: '代理專區', sub: 'Agents', icon: '🌐' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/tasks', label: '任務中心', sub: 'Tasks', icon: '✅' },
      { href: '/profile', label: '企業管理', sub: 'Profile', icon: '🏢' },
      { href: '/api-setup', label: '整合中心', sub: 'API Setup', icon: '🔌' },
      { href: '/system-status', label: '系統狀態', sub: 'Status', icon: '📡' },
      { href: '/ai-platform', label: 'AI 整合平台', sub: 'AI Platform', icon: '🤖' },
      { href: '/proof-center', label: '誠信證明', sub: 'Proof Center', icon: '🛡' },
    ],
  },
];

function SidebarContent({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: () => void }) {
  const pathname = usePathname() ?? '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: '#001e3c',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
        <div style={{ width: 36, height: 36, background: '#FDB515', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#001e3c', flexShrink: 0 }}>
          ESG
        </div>
        {!collapsed && (
          <div>
            <div style={{ color: '#FDB515', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>ESG GO</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>善向永續</div>
          </div>
        )}
        <button
          onClick={onCollapse}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4, borderRadius: 4, fontSize: 16, flexShrink: 0 }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div style={{ padding: '12px 20px 4px', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '10px 16px' : '8px 20px',
                  margin: '1px 8px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  background: isActive(item.href) ? 'rgba(253,181,21,0.15)' : 'transparent',
                  borderLeft: isActive(item.href) ? '3px solid #FDB515' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                title={collapsed ? `${item.label} · ${item.sub}` : undefined}
              >
                <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {!collapsed && (
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: isActive(item.href) ? '#FDB515' : '#e2e8f0', fontSize: 12, fontWeight: isActive(item.href) ? 600 : 400, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, whiteSpace: 'nowrap' }}>{item.sub}</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>5T 誠信協議 · 已啟用</span>
          </div>
        </div>
      )}
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname() ?? '/';
  const quickItems = [
    { href: '/', label: '控制台', icon: '⊞' },
    { href: '/advisory', label: '諮詢', icon: '◎' },
    { href: '/environmental', label: '環境', icon: '🌿' },
    { href: '/vault', label: '金庫', icon: '🔐' },
    { href: '/editor', label: '撰寫', icon: '✎' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: '#001e3c', borderTop: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    }}>
      {quickItems.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', padding: '4px 12px' }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, color: active ? '#FDB515' : 'rgba(255,255,255,0.5)', fontWeight: active ? 700 : 400 }}>{item.label}</span>
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

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #003262', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#003262', fontSize: 14 }}>載入中...</p>
        </div>
      </div>
    );
  }

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {!isMobile && (
        <SidebarContent collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      )}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : sidebarWidth,
        marginBottom: isMobile ? 64 : 0,
        minHeight: '100vh',
        transition: 'margin-left 0.25s ease',
        overflow: 'auto',
      }}>
        {children}
      </main>
      {isMobile && <MobileNav />}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #003262', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}