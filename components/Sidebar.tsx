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
  DollarSign, Link2, Briefcase, Network, Sun, Moon, X
} from 'lucide-react';
import { useThemeStore, SidebarTheme } from '../lib/theme-store';
import { useSaaS } from '../hooks/useSaaS';
import { BrandBadge } from './index';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

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
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

function SaaSStatusWidget() {
  const { plan, usage, upgradePlan } = useSaaS();
  const pct = Math.round((usage.aiWords / usage.aiLimit) * 100);

  return (
    <div className="mx-4 mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 shadow-sm">
       <div className="flex items-center justify-between">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SaaS Plan</p>
          <BrandBadge variant="gold" size="xs" className="scale-75 origin-right uppercase">{plan}</BrandBadge>
       </div>
       <div className="space-y-1">
          <div className="flex justify-between items-end">
             <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">AI Capacity</span>
             <span className="text-[9px] font-black text-[#003262]">{pct}%</span>
          </div>
          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-blue-600" />
          </div>
       </div>
       <button 
         onClick={upgradePlan}
         className="w-full py-1.5 rounded-lg bg-white border border-slate-200 text-[#003262] text-[8px] font-black uppercase tracking-widest hover:bg-[#003262] hover:text-white transition-all shadow-sm"
       >
          Upgrade
       </button>
    </div>
  );
}

export default function Sidebar({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
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
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setMobileOpen?.(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          `fixed top-0 left-0 h-screen flex flex-col z-50 transition-all duration-500 ease-in-out ${t.sidebar}`,
          isCollapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between px-4 py-4 ${t.logo}`}>
           <div className="flex items-center gap-2.5">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                sidebarTheme === 'dark' ? 'bg-[#FDB515] text-[#003262]' : 'bg-[#003262] text-white'
              )}>GO</div>
              {!isCollapsed && (
                <div className="fade-in">
                  <p className={`text-sm font-bold leading-tight ${t.logoText}`}>ESG GO</p>
                  <p className={`text-xs leading-tight ${t.logoSub}`}>善向永續</p>
                </div>
              )}
           </div>
           
           <button onClick={() => setMobileOpen?.(false)} className="lg:hidden p-2 text-slate-400">
              <X size={20} />
           </button>
           
           <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-[#003262] transition-colors">
              {isCollapsed ? <PanelLeftOpen size={16}/> : <PanelLeftClose size={16}/>}
           </button>
        </div>

        {/* Desktop Expand button */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className={`hidden lg:flex mx-auto mt-2 p-1.5 rounded-lg transition-colors ${t.collapseBtn}`}
          >
            <PanelLeftOpen size={16} />
          </button>
        )}

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
                          onClick={() => setMobileOpen?.(false)}
                        >
                          <Icon size={16} className={`flex-shrink-0 ${active ? t.iconActive : t.iconInactive}`} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.badge}`}>{item.badge}</span>}
                              <span className={`text-[10px] ${active ? t.navItemSubActive : t.navItemSub}`}>{item.sub}</span>
                            </>
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

        {/* SaaS Widget */}
        {!isCollapsed && <SaaSStatusWidget />}

        {/* Footer */}
        <div className={`px-3 py-3 ${t.footer}`}>
          {!isCollapsed ? (
            <div className={`flex items-center gap-2 text-xs ${t.footerText}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${t.footerDot}`} />
              <span className={t.syncText}>Sovereign Sync</span>
              <span className="ml-auto opacity-40">v8.5</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${t.footerDot}`} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
