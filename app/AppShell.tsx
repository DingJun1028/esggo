'use client';
import { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

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
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} bg-[#003262] border-r border-[#003262]/20 shadow-xl shadow-[#003262]/10`}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-white/10 min-h-[64px]">
        <div className="w-9 h-9 rounded-xl bg-[#FDB515] flex items-center justify-center font-black text-[#003262] text-sm shadow-lg shadow-[#FDB515]/20 flex-shrink-0">
          ESG
        </div>
        {!collapsed && (
          <div className="animate-in fade-in duration-300">
            <div className="text-[#FDB515] font-bold text-sm leading-tight tracking-tight uppercase">OmniHermes</div>
            <div className="text-white/40 text-[9px] font-black uppercase tracking-widest">Enterprise OS</div>
          </div>
        )}
        <button
          onClick={onCollapse}
          className="ml-auto p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar space-y-6">
        {navGroups.map((group) => (
          <div key={group.label} className="px-3">
            {!collapsed && (
              <div className="px-4 mb-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                {group.label}
              </div>
            )}
            <div className="space-y-1">
               {group.items.map((item) => (
                 <Link
                   key={item.href}
                   href={item.href}
                   className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all group ${
                     isActive(item.href) 
                       ? 'bg-gradient-to-r from-[#FDB515]/20 to-transparent text-[#FDB515] border-l-4 border-[#FDB515]' 
                       : 'text-white/60 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                   }`}
                   title={collapsed ? `${item.label} · ${item.sub}` : undefined}
                 >
                   <span className={`text-lg transition-transform duration-300 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`}>
                     {item.icon}
                   </span>
                   {!collapsed && (
                     <div className="overflow-hidden animate-in slide-in-from-left-2 duration-300">
                       <div className="text-[13px] font-bold whitespace-nowrap leading-none mb-0.5">
                         {item.label}
                       </div>
                       <div className="text-[10px] text-white/30 whitespace-nowrap group-hover:text-white/40 transition-colors uppercase font-medium">{item.sub}</div>
                     </div>
                   )}
                 </Link>
               ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-5 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">5T Integrity Active</span>
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
    <nav className="mobile-nav bg-[#003262] border-t border-white/10 px-4 shadow-2xl">
      {quickItems.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all ${active ? 'text-[#FDB515]' : 'text-white/40'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            {active && <div className="w-1 h-1 rounded-full bg-[#FDB515] mt-0.5 shadow-[0_0_8px_#FDB515]" />}
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
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!mounted) return null;

  return (
    <div className="app-shell min-h-screen font-sans">
      {!isMobile && (
        <SidebarContent collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      )}
      
      <main className={`main-content transition-all duration-300 relative ${!isMobile && collapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile-mode' : ''}`}>
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-[#EBF2FA] via-[#F8FAFC] to-[#F1F5F9]" />
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