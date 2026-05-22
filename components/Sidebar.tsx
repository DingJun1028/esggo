'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Leaf, Users, Shield, FileText, Search,
  BarChart3, ClipboardList, Database, TrendingDown, BookOpen,
  Building2, CheckSquare, Globe, Fingerprint, GraduationCap,
  UserCheck, Award, HeartHandshake, Bot, Cpu, ChevronDown,
  ChevronRight, PanelLeftClose, PanelLeftOpen, Zap, Activity,
  Settings, FlaskConical, Layers, Target, AlertTriangle, Layout,
  DollarSign, Link2, Briefcase, Network, Sun, Moon
} from 'lucide-react';
import { useThemeStore, SidebarTheme } from '../lib/theme-store';
import ThemeSwitcher from './ThemeSwitcher';

interface NavItem {
  href: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'CORE',
    items: [
      { href: '/', label: '控制台', sub: 'Dashboard', icon: LayoutDashboard },
      { href: '/editor', label: '永續撰寫', sub: 'SustainWrite', icon: FileText, badge: 'AI' },
      { href: '/digital-twin', label: '數位分身', sub: 'Digital Twin', icon: Fingerprint },
      { href: '/health-check', label: '企業健檢', sub: 'Health Check', icon: CheckSquare },
      { href: '/advisory', label: '專家諮詢', sub: 'Advisory', icon: Users },
      { href: '/intelligence', label: '商情中心', sub: 'Intelligence', icon: BarChart3 },
    ],
  },
  {
    title: 'E-S-G MODULES',
    items: [
      { href: '/environmental', label: '環境指揮', sub: 'Environmental', icon: Leaf },
      { href: '/social', label: '社會影響', sub: 'Social', icon: HeartHandshake },
      { href: '/governance', label: '公司治理', sub: 'Governance', icon: Shield },
    ],
  },
  {
    title: 'GOVERNANCE',
    items: [
      { href: '/materiality', label: '重大性矩陣', sub: 'Materiality', icon: AlertTriangle },
      { href: '/templates', label: '專家模板', sub: 'Templates', icon: Layout },
      { href: '/audit-log', label: '審計日誌', sub: 'Audit Log', icon: ClipboardList },
      { href: '/vault', label: '證據金庫', sub: 'Evidence Vault', icon: Database },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { href: '/roadmap', label: '淨零路線圖', sub: 'Net-Zero', icon: TrendingDown },
      { href: '/publish', label: '報告發布', sub: 'Publish', icon: Globe },
      { href: '/reading-room', label: '永續閱覽室', sub: 'Reading Room', icon: BookOpen },
      { href: '/library', label: '永續智庫', sub: 'Library', icon: Layers },
      { href: '/finance', label: '永續財務', sub: 'Finance', icon: DollarSign },
      { href: '/supply-chain', label: '供應鏈透明', sub: 'Supply Chain', icon: Link2 },
      { href: '/stakeholders', label: '利害關係人', sub: 'Stakeholders', icon: Network },
      { href: '/audit-verify', label: 'VerifyLink™', sub: 'ZKP Verify', icon: Award },
    ],
  },
  {
    title: 'ACADEMY',
    items: [
      { href: '/academy', label: '永續學院', sub: 'Academy', icon: GraduationCap },
      { href: '/advisors', label: '顧問專區', sub: 'Advisors', icon: UserCheck },
      { href: '/agents', label: '代理專區', sub: 'Agents', icon: Briefcase },
      { href: '/consulting', label: '顧問服務', sub: 'Consulting', icon: HeartHandshake },
      { href: '/ai-platform', label: 'AI 整合平台', sub: 'AI Platform', icon: Cpu },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/tasks', label: '任務中心', sub: 'Tasks', icon: CheckSquare },
      { href: '/profile', label: '企業管理', sub: 'Profile', icon: Building2 },
      { href: '/api-setup', label: '整合中心', sub: 'API Setup', icon: Settings },
      { href: '/swarm', label: 'Hermes Swarm', sub: 'AI Swarm', icon: Bot, badge: 'NEW' },
      { href: '/hermes-agent', label: 'Hermes Agent', sub: 'NousResearch', icon: FlaskConical },
    ],
  },
];

function getThemeStyles(theme: SidebarTheme) {
  if (theme === 'dark') {
    return {
      sidebar: 'bg-[#002244] border-r border-[#003880]',
      logo: 'border-b border-[#003880]',
      logoText: 'text-white',
      logoSub: 'text-[#FDB515]/70',
      groupTitle: 'text-[#FDB515]/50',
      navItem: 'text-[#94b8d8] hover:bg-white/10 hover:text-white',
      navItemActive: 'bg-[#FDB515]/15 text-[#FDB515] border-r-2 border-[#FDB515]',
      navItemSub: 'text-[#FDB515]/50',
      navItemSubActive: 'text-[#FDB515]/70',
      iconActive: 'text-[#FDB515]',
      iconInactive: 'text-[#94b8d8]',
      badge: 'bg-[#FDB515]/20 text-[#FDB515]',
      collapseBtn: 'text-[#94b8d8] hover:text-white hover:bg-white/10',
      footer: 'border-t border-[#003880]',
      footerText: 'text-[#94b8d8]',
      footerDot: 'bg-green-400',
      chevron: 'text-[#94b8d8]',
      syncText: 'text-[#FDB515]/70',
      groupHeader: 'hover:bg-white/5',
      groupExpanded: 'bg-white/5',
      themeArea: 'border-t border-[#003880]',
    };
  }
  return {
    sidebar: 'bg-white border-r border-gray-200',
    logo: 'border-b border-gray-100',
    logoText: 'text-[#003262]',
    logoSub: 'text-gray-500',
    groupTitle: 'text-gray-400',
    navItem: 'text-gray-600 hover:bg-[#003262]/5 hover:text-[#003262]',
    navItemActive: 'bg-[#003262] text-white',
    navItemSub: 'text-gray-400',
    navItemSubActive: 'text-white/70',
    iconActive: 'text-white',
    iconInactive: 'text-gray-400',
    badge: 'bg-[#FDB515]/20 text-[#003262]',
    collapseBtn: 'text-gray-400 hover:text-[#003262] hover:bg-gray-100',
    footer: 'border-t border-gray-100',
    footerText: 'text-gray-500',
    footerDot: 'bg-green-500',
    chevron: 'text-gray-400',
    syncText: 'text-gray-400',
    groupHeader: 'hover:bg-gray-50',
    groupExpanded: 'bg-gray-50/50',
    themeArea: 'border-t border-gray-100',
  };
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname() || '/';
  const { sidebarTheme } = useThemeStore();
  const t = getThemeStyles(sidebarTheme);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    CORE: true,
    'E-S-G MODULES': true,
    GOVERNANCE: true,
    INSIGHTS: false,
    ACADEMY: false,
    SYSTEM: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  if (!mounted) return null;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col z-40 transition-all duration-300 ${t.sidebar} ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center justify-between px-4 py-4 ${t.logo}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              sidebarTheme === 'dark' ? 'bg-[#FDB515] text-[#003262]' : 'bg-[#003262] text-white'
            }`}>
              GO
            </div>
            <div>
              <p className={`text-sm font-bold leading-tight ${t.logoText}`}>ESG GO</p>
              <p className={`text-xs leading-tight ${t.logoSub}`}>善向永續</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mx-auto ${
            sidebarTheme === 'dark' ? 'bg-[#FDB515] text-[#003262]' : 'bg-[#003262] text-white'
          }`}>
            GO
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1.5 rounded-lg transition-colors ${t.collapseBtn}`}
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className={`mx-auto mt-2 p-1.5 rounded-lg transition-colors ${t.collapseBtn}`}
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {NAV_GROUPS.map((group) => {
          const isGroupActive = group.items.some(item => isActive(item.href));
          const isExpanded = expandedGroups[group.title] ?? true;

          return (
            <div key={group.title} className="mb-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors rounded-md mx-1 ${
                    isGroupActive ? t.groupExpanded : t.groupHeader
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${t.groupTitle}`}>
                    {group.title}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${t.chevron} ${isExpanded ? '' : '-rotate-90'}`}
                  />
                </button>
              )}

              {(isExpanded || isCollapsed) && (
                <div className={`${isCollapsed ? 'px-2' : 'px-2'} space-y-0.5 mt-0.5`}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? `${item.label} ${item.sub}` : undefined}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                          active ? t.navItemActive : t.navItem
                        } ${isCollapsed ? 'justify-center' : ''}`}
                      >
                        <Icon
                          size={16}
                          className={`flex-shrink-0 ${active ? t.iconActive : t.iconInactive}`}
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.badge}`}>
                                {item.badge}
                              </span>
                            )}
                            <span className={`text-[10px] ${active ? t.navItemSubActive : t.navItemSub}`}>
                              {item.sub}
                            </span>
                          </>
                        )}
                        {isCollapsed && active && (
                          <span className={`absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-l-full ${
                            sidebarTheme === 'dark' ? 'bg-[#FDB515]' : 'bg-[#003262]'
                          }`} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      {!isCollapsed && (
        <div className={t.themeArea}>
          <div className="p-3">
            <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${t.groupTitle}`}>外觀主題</p>
            <div className="flex gap-2">
              <button
                onClick={() => useThemeStore.getState().setSidebarTheme('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  sidebarTheme === 'light'
                    ? 'bg-white text-[#003262] border-[#003262] shadow-sm'
                    : sidebarTheme === 'dark'
                    ? 'bg-white/5 text-[#94b8d8] border-white/10 hover:border-white/20'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun size={12} />
                淺色
              </button>
              <button
                onClick={() => useThemeStore.getState().setSidebarTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                  sidebarTheme === 'dark'
                    ? 'bg-[#FDB515]/20 text-[#FDB515] border-[#FDB515] shadow-sm'
                    : sidebarTheme === 'dark'
                    ? 'bg-white/5 text-[#94b8d8] border-white/10 hover:border-white/20'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon size={12} />
                深色
              </button>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className={`p-2 flex flex-col items-center gap-2 ${t.themeArea}`}>
          <button
            onClick={() => useThemeStore.getState().setSidebarTheme(sidebarTheme === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-lg transition-colors ${t.collapseBtn}`}
            title={sidebarTheme === 'light' ? '切換深色主題' : '切換淺色主題'}
          >
            {sidebarTheme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={`px-3 py-3 ${t.footer}`}>
        {!isCollapsed ? (
          <div className={`flex items-center gap-2 text-xs ${t.footerText}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${t.footerDot}`} />
            <span className={t.syncText}>Supabase 同步中</span>
            <span className="ml-auto">v8.5</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${t.footerDot}`} />
          </div>
        )}
      </div>
    </aside>
  );
}