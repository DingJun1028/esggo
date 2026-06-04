'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Leaf, Users, Shield, FileText, BarChart3, ClipboardList, Database, TrendingDown, BookOpen, Building2, CheckSquare, Globe, Fingerprint, GraduationCap, UserCheck, Award, HeartHandshake, Bot, Cpu, ChevronDown, PanelLeftClose, PanelLeftOpen, Settings, FlaskConical, Layers, AlertTriangle, Layout, DollarSign, Link2, Briefcase, Network, X } from 'lucide-react';
import { useThemeStore } from '../lib/theme-store';
import { useSaaS } from '../hooks/useSaaS';
import { BrandBadge } from './brand';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
const NAV_GROUPS = [
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
        title: 'E · S · G 模組',
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
            { href: '/wiki', label: '系統智庫', sub: 'Wiki', icon: BookOpen, badge: 'NEW' },
            { href: '/profile', label: '企業管理', sub: 'Profile', icon: Building2 },
            { href: '/api-setup', label: '整合中心', sub: 'API Setup', icon: Settings },
            { href: '/swarm', label: 'OmniAgent Swarm', sub: 'AI Swarm', icon: Bot, badge: 'NEW' },
            { href: '/omniagent-agent', label: 'OmniAgent Agent', sub: 'NousResearch', icon: FlaskConical },
        ],
    },
];
function getThemeStyles(theme) {
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
    if (theme === 'glass') {
        return {
            sidebar: 'bg-white/40 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]',
            logo: 'border-b border-white/40',
            logoText: 'text-[#003262]',
            logoSub: 'text-[#003262]/60',
            groupTitle: 'text-[#003262]/40',
            navItem: 'text-[#003262]/70 hover:bg-white/60 hover:text-[#003262]',
            navItemActive: 'bg-white/80 text-[#003262] shadow-sm',
            navItemSub: 'text-[#003262]/50',
            navItemSubActive: 'text-[#003262]/80',
            iconActive: 'text-[#003262]',
            iconInactive: 'text-[#003262]/50',
            badge: 'bg-[#FDB515]/20 text-[#003262]',
            collapseBtn: 'text-[#003262]/50 hover:text-[#003262] hover:bg-white/60',
            footer: 'border-t border-white/40',
            footerText: 'text-[#003262]/60',
            footerDot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
            chevron: 'text-[#003262]/40',
            syncText: 'text-[#003262]/60',
            groupHeader: 'hover:bg-white/40',
            groupExpanded: 'bg-white/60',
            themeArea: 'border-t border-white/40',
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
function SaaSStatusWidget() {
    const { plan, usage, upgradePlan } = useSaaS();
    const pct = Math.round((usage.aiWords / usage.aiLimit) * 100);
    return (_jsxs("div", { className: "mx-4 mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-[8px] font-black text-slate-400 uppercase tracking-widest", children: "SaaS Plan" }), _jsx(BrandBadge, { variant: "gold", size: "xs", className: "scale-75 origin-right uppercase", children: plan })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between items-end", children: [_jsx("span", { className: "text-[7px] font-bold text-slate-400 uppercase tracking-tighter", children: "AI Capacity" }), _jsxs("span", { className: "text-[9px] font-black text-[#003262]", children: [pct, "%"] })] }), _jsx("div", { className: "h-1 w-full bg-slate-200 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${pct}%` }, className: "h-full bg-blue-600" }) })] }), _jsx("button", { onClick: upgradePlan, className: "w-full py-1.5 rounded-lg bg-white border border-slate-200 text-[#003262] text-[8px] font-black uppercase tracking-widest hover:bg-[#003262] hover:text-white transition-all shadow-sm", children: "Upgrade" })] }));
}
export default function Sidebar({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) {
    const pathname = usePathname() || '/';
    const { sidebarTheme } = useThemeStore();
    const t = getThemeStyles(sidebarTheme);
    const [expandedGroups, setExpandedGroups] = useState({
        CORE: true,
        'E · S · G 模組': true,
        GOVERNANCE: true,
        INSIGHTS: false,
        ACADEMY: false,
        SYSTEM: false,
    });
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const isActive = (href) => {
        if (!pathname)
            return false;
        if (href === '/')
            return pathname === '/';
        return pathname.startsWith(href);
    };
    const toggleGroup = (title) => {
        setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };
    if (!mounted)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: mobileOpen && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setMobileOpen?.(false), className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] lg:hidden" })) }), _jsxs("aside", { className: cn(`fixed lg:relative h-screen flex flex-col z-50 transition-all duration-300 ease-in-out ${t.sidebar}`, isCollapsed ? 'w-[72px]' : 'w-[280px]', 
                // Mobile visibility: fixed on mobile, static position on desktop
                mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'), children: [_jsxs("div", { className: `flex items-center justify-between px-4 py-4 ${t.logo}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm", sidebarTheme === 'dark' ? 'bg-[#FDB515] text-[#003262]' : 'bg-[#003262] text-white'), children: "GO" }), !isCollapsed && (_jsxs("div", { className: "fade-in", children: [_jsx("p", { className: `text-sm font-bold leading-tight ${t.logoText}`, children: "ESG GO" }), _jsx("p", { className: `text-xs leading-tight ${t.logoSub}`, children: "\u5584\u5411\u6C38\u7E8C" })] }))] }), _jsx("button", { onClick: () => setMobileOpen?.(false), className: "lg:hidden p-2 text-slate-400", children: _jsx(X, { size: 20 }) }), _jsx("button", { onClick: () => setIsCollapsed(!isCollapsed), className: "hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-[#003262] transition-colors", children: isCollapsed ? _jsx(PanelLeftOpen, { size: 16 }) : _jsx(PanelLeftClose, { size: 16 }) })] }), isCollapsed && (_jsx("button", { onClick: () => setIsCollapsed(false), className: `hidden lg:flex mx-auto mt-2 p-1.5 rounded-lg transition-colors ${t.collapseBtn}`, children: _jsx(PanelLeftOpen, { size: 16 }) })), _jsx("nav", { className: "flex-1 overflow-y-auto py-3 scrollbar-thin", children: NAV_GROUPS.map((group) => {
                            const isGroupActive = group.items.some(item => isActive(item.href));
                            const isExpanded = expandedGroups[group.title] ?? true;
                            return (_jsxs("div", { className: "mb-1", children: [!isCollapsed && (_jsxs("button", { onClick: () => toggleGroup(group.title), className: `w-full flex items-center justify-between px-3 py-1.5 transition-colors rounded-md mx-1 ${isGroupActive ? t.groupExpanded : t.groupHeader}`, children: [_jsx("span", { className: `text-[10px] font-bold tracking-widest uppercase ${t.groupTitle}`, children: group.title }), _jsx(ChevronDown, { size: 12, className: `transition-transform ${t.chevron} ${isExpanded ? '' : '-rotate-90'}` })] })), (isExpanded || isCollapsed) && (_jsx("div", { className: `${isCollapsed ? 'px-2' : 'px-2'} space-y-0.5 mt-0.5`, children: group.items.map((item) => {
                                            const Icon = item.icon;
                                            const active = isActive(item.href);
                                            return (_jsxs(Link, { href: item.href, title: isCollapsed ? `${item.label} ${item.sub}` : undefined, className: `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all relative ${active ? t.navItemActive : t.navItem} ${isCollapsed ? 'justify-center' : ''}`, onClick: () => setMobileOpen?.(false), children: [_jsx(Icon, { size: 16, className: `flex-shrink-0 ${active ? t.iconActive : t.iconInactive}` }), !isCollapsed && (_jsxs(_Fragment, { children: [_jsx("span", { className: "flex-1 truncate", children: item.label }), item.badge && _jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.badge}`, children: item.badge }), _jsx("span", { className: `text-[10px] ${active ? t.navItemSubActive : t.navItemSub}`, children: item.sub })] }))] }, item.href));
                                        }) }))] }, group.title));
                        }) }), !isCollapsed && _jsx(SaaSStatusWidget, {}), _jsx("div", { className: `px-3 py-3 ${t.footer}`, children: !isCollapsed ? (_jsxs("div", { className: `flex items-center gap-2 text-xs ${t.footerText}`, children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full animate-pulse ${t.footerDot}` }), _jsx("span", { className: t.syncText, children: "Sovereign Sync" }), _jsx("span", { className: "ml-auto opacity-40", children: "v8.5" })] })) : (_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: `w-1.5 h-1.5 rounded-full animate-pulse ${t.footerDot}` }) })) })] })] }));
}
//# sourceMappingURL=Sidebar.js.map