'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileEdit, Brain, Activity, Leaf, Users, Building2, Target, Archive, ClipboardList, TrendingUp, BookOpen, GraduationCap, Bot, ChevronLeft, ChevronRight, Globe, CheckCircle2, Bell, Menu, X, Fingerprint, Database, Layers, ScrollText, FileBarChart, HeartHandshake, Cpu, Gauge, ClipboardCheck, Wallet, Radio, Link2, Network, Shield } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import OmniAgentFloatingAgent from './brand/OmniAgentFloating';
import OmniCommandPalette from './omni/OmniCommandPalette';
import { THEMES, applyTheme, getSavedTheme } from '../lib/theme-config';
import OmniSearchBar from './omni/OmniSearchBar';
const NAV_GROUPS = [
    {
        title: 'CORE',
        items: [
            { href: '/', label: '控制台', labelEn: 'Dashboard', icon: LayoutDashboard },
            { href: '/editor', label: '永續撰寫', labelEn: 'SustainWrite', icon: FileEdit, badge: 'AI' },
            { href: '/digital-twin', label: '數位分身', labelEn: 'Digital Twin', icon: Fingerprint },
            { href: '/health-check', label: '企業健檢', labelEn: 'Health Check', icon: Activity },
            { href: '/advisory', label: '專家諮詢', labelEn: 'Advisory', icon: Brain, badge: 'AI' },
            { href: '/intelligence', label: '商情中心', labelEn: 'Intelligence', icon: Globe },
        ],
    },
    {
        title: 'E-S-G',
        items: [
            { href: '/environmental', label: '環境指揮', labelEn: 'Environmental', icon: Leaf },
            { href: '/social', label: '社會影響', labelEn: 'Social', icon: Users },
            { href: '/governance', label: '公司治理', labelEn: 'Governance', icon: Building2 },
        ],
    },
    {
        title: 'GOVERNANCE',
        items: [
            { href: '/materiality', label: '重大性矩陣', labelEn: 'Materiality', icon: Target },
            { href: '/audit-log', label: '審計日誌', labelEn: 'Audit Log', icon: ClipboardList },
            { href: '/vault', label: '證據金庫', labelEn: 'Evidence Vault', icon: Archive },
            { href: '/document-checklist', label: '文件主清單', labelEn: 'Doc Checklist', icon: ClipboardCheck, isNew: true },
        ],
    },
    {
        title: 'INSIGHTS',
        items: [
            { href: '/roadmap', label: '淨零路線圖', labelEn: 'Net-Zero', icon: TrendingUp },
            { href: '/publish', label: '報告發布', labelEn: 'Publish', icon: FileBarChart },
            { href: '/audit-verify', label: 'VerifyLink™', labelEn: 'Verify', icon: CheckCircle2 },
            { href: '/reading-room', label: '永續閱覽室', labelEn: 'Reading Room', icon: BookOpen },
            { href: '/finance', label: '永續財務', labelEn: 'Finance', icon: Wallet },
            { href: '/supply-chain', label: '供應鏈透明', labelEn: 'Supply Chain', icon: Network },
            { href: '/stakeholders', label: '利害關係人', labelEn: 'Stakeholders', icon: HeartHandshake },
        ],
    },
    {
        title: 'REPORT',
        items: [
            { href: '/omni-src', label: '萬能報告中心', labelEn: 'Omni-SRC', icon: ScrollText, isNew: true },
            { href: '/compliance-check', label: '合規檢核', labelEn: 'Compliance', icon: Shield },
            { href: '/gri-tracker', label: 'GRI追蹤器', labelEn: 'GRI Tracker', icon: Gauge, isNew: true },
            { href: '/standards', label: '標準智庫', labelEn: 'Standards', icon: Database },
        ],
    },
    {
        title: 'ACADEMY',
        items: [
            { href: '/academy', label: '永續學院', labelEn: 'Academy', icon: GraduationCap },
            { href: '/advisors', label: '顧問服務', labelEn: 'Advisors', icon: HeartHandshake },
            { href: '/agents', label: '代理專區', labelEn: 'Agents', icon: Radio },
        ],
    },
    {
        title: 'SYSTEM',
        items: [
            { href: '/tasks', label: '任務中心', labelEn: 'Tasks', icon: ClipboardList },
            { href: '/profile', label: '企業管理', labelEn: 'Profile', icon: Building2 },
            { href: '/swarm', label: 'OmniAgent蜂群', labelEn: 'Swarm', icon: Bot, badge: 'NEW' },
            { href: '/think-tank', label: '萬能智庫', labelEn: 'Think Tank', icon: Brain, badge: 'LIVE', isNew: true },
            { href: '/ai-platform', label: 'AI整合平台', labelEn: 'AI Platform', icon: Cpu },
            { href: '/api-setup', label: '整合中心', labelEn: 'API Setup', icon: Link2 },
            { href: '/design-library', label: '設計系統庫', labelEn: 'Design Library', icon: Layers },
        ],
    },
];
function SidebarNav({ collapsed, setCollapsed, mobileOpen, setMobileOpen, currentTheme, onThemeChange, }) {
    const pathname = usePathname() || '/';
    const [collapsedGroups, setCollapsedGroups] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const isActive = (href) => {
        if (href === '/')
            return pathname === '/';
        return pathname.startsWith(href);
    };
    const filteredGroups = searchQuery
        ? NAV_GROUPS.map(g => ({
            ...g,
            items: g.items.filter(i => i.label.includes(searchQuery) ||
                i.labelEn.toLowerCase().includes(searchQuery.toLowerCase())),
        })).filter(g => g.items.length > 0)
        : NAV_GROUPS;
    const sidebarWidth = collapsed ? 64 : 240;
    return (_jsxs(_Fragment, { children: [mobileOpen && (_jsx("div", { style: {
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 40,
                    backdropFilter: 'blur(4px)',
                }, onClick: () => setMobileOpen(false) })), _jsxs("aside", { style: {
                    position: 'fixed', left: 0, top: 0, bottom: 0,
                    width: mobileOpen ? 240 : sidebarWidth,
                    background: 'var(--sidebar-bg)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderRight: '1px solid var(--sidebar-border)',
                    display: 'flex', flexDirection: 'column', zIndex: 50,
                    transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
                    overflowX: 'hidden',
                }, children: [_jsxs("div", { style: {
                            padding: '14px 16px',
                            borderBottom: '1px solid var(--sidebar-border)',
                            display: 'flex', alignItems: 'center', gap: 10, minHeight: 60,
                        }, children: [_jsx("div", { style: {
                                    width: 30, height: 30,
                                    borderRadius: currentTheme === 'berkeley' ? 6 : 8,
                                    background: currentTheme === 'berkeley'
                                        ? 'linear-gradient(135deg,#003262,#3b7ea1)'
                                        : currentTheme === 'water-zen'
                                            ? 'linear-gradient(135deg,#2ea8b0,#52b788)'
                                            : currentTheme === 'minimal-blue'
                                                ? 'linear-gradient(135deg,#0ea5e9,#22c55e)'
                                                : 'linear-gradient(135deg,#06b6d4,#10b981)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 0 12px var(--shadow-glow, rgba(6,182,212,0.3))',
                                }, children: _jsx(Leaf, { size: 14, color: "#fff" }) }), (!collapsed || mobileOpen) && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }, children: "ESG GO" }), _jsx("div", { style: { fontSize: 9, color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.08em' }, children: "\u5584\u5411\u6C38\u7E8C" })] })), mobileOpen && (_jsx("button", { onClick: () => setMobileOpen(false), style: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }, children: _jsx(X, { size: 16 }) }))] }), (!collapsed || mobileOpen) && (_jsx("div", { style: { padding: '8px 12px', borderBottom: '1px solid var(--sidebar-border)' }, children: _jsx(OmniSearchBar, { value: searchQuery, onChange: setSearchQuery }) })), _jsx("nav", { style: { flex: 1, overflowY: 'auto', padding: '6px 0' }, children: filteredGroups.map(group => (_jsxs("div", { style: { marginBottom: 2 }, children: [(!collapsed || mobileOpen) && (_jsx("div", { style: {
                                        padding: '5px 16px 3px',
                                        fontSize: 9, fontWeight: 700,
                                        letterSpacing: '0.12em',
                                        color: 'var(--sidebar-group)',
                                    }, children: group.title })), group.items.map(item => {
                                    const active = isActive(item.href);
                                    const Icon = item.icon;
                                    const showLabel = !collapsed || mobileOpen;
                                    return (_jsxs(Link, { href: item.href, onClick: () => setMobileOpen(false), style: {
                                            display: 'flex', alignItems: 'center', gap: 9,
                                            padding: showLabel ? '7px 14px' : '8px 17px',
                                            margin: '1px 8px', borderRadius: 7,
                                            textDecoration: 'none',
                                            background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                                            borderLeft: active ? '2px solid var(--sidebar-active-color)' : '2px solid transparent',
                                            color: active ? 'var(--sidebar-active-color)' : 'var(--sidebar-text)',
                                            transition: 'all 0.15s',
                                            justifyContent: showLabel ? 'flex-start' : 'center',
                                            minHeight: 32,
                                        }, title: !showLabel ? item.label : undefined, children: [_jsx(Icon, { size: 13, style: { flexShrink: 0 } }), showLabel && (_jsxs(_Fragment, { children: [_jsx("span", { style: {
                                                            flex: 1, fontSize: 12,
                                                            fontWeight: active ? 600 : 400,
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                        }, children: item.label }), item.badge && (_jsx("span", { style: {
                                                            fontSize: 8, fontWeight: 700,
                                                            padding: '1px 5px', borderRadius: 4,
                                                            background: item.badge === 'NEW'
                                                                ? 'rgba(16,185,129,0.15)'
                                                                : 'rgba(6,182,212,0.15)',
                                                            color: item.badge === 'NEW'
                                                                ? 'var(--accent-secondary, #10b981)'
                                                                : 'var(--accent-primary)',
                                                            letterSpacing: '0.04em',
                                                        }, children: item.badge })), item.isNew && !item.badge && (_jsx("span", { style: {
                                                            width: 5, height: 5, borderRadius: '50%',
                                                            background: 'var(--accent-secondary, #10b981)', flexShrink: 0,
                                                        } }))] }))] }, item.href));
                                })] }, group.title))) }), _jsxs("div", { style: {
                            padding: '10px 12px',
                            borderTop: '1px solid var(--sidebar-border)',
                            display: 'flex', flexDirection: 'column', gap: 8,
                        }, children: [_jsx(ThemeSelector, { currentTheme: currentTheme, onSelect: onThemeChange, collapsed: collapsed && !mobileOpen }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }, children: [(!collapsed || mobileOpen) && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)' }, children: [_jsx("div", { style: {
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: 'var(--accent-secondary, #10b981)',
                                                    boxShadow: '0 0 6px var(--accent-secondary, #10b981)',
                                                } }), _jsx("span", { style: { fontWeight: 600, color: 'var(--accent-primary)' }, children: "87%" }), _jsx("span", { children: "5T Score" })] })), _jsx("button", { onClick: () => setCollapsed(!collapsed), style: {
                                            width: 26, height: 26, borderRadius: 6,
                                            background: 'var(--glass-frosted)',
                                            border: '1px solid var(--sidebar-border)',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--text-muted)',
                                            marginLeft: collapsed && !mobileOpen ? 'auto' : undefined,
                                        }, children: collapsed && !mobileOpen ? _jsx(ChevronRight, { size: 11 }) : _jsx(ChevronLeft, { size: 11 }) })] })] })] })] }));
}
export default function OmniCoreShell({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('dark-navy');
    useEffect(() => {
        setMounted(true);
        const savedCollapsed = localStorage.getItem('omni-sidebar-collapsed');
        if (savedCollapsed)
            setCollapsed(JSON.parse(savedCollapsed));
        const savedTheme = getSavedTheme();
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('omni-sidebar-collapsed', JSON.stringify(collapsed));
        }
    }, [collapsed, mounted]);
    const handleThemeChange = (id) => {
        setCurrentTheme(id);
        applyTheme(id);
    };
    if (!mounted) {
        return (_jsxs("div", { style: {
                minHeight: '100vh',
                background: '#020617',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }, children: [_jsx("div", { style: {
                        width: 40, height: 40,
                        border: '2px solid #06b6d4', borderTopColor: 'transparent',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                    } }), _jsx("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })] }));
    }
    const sidebarWidth = collapsed ? 64 : 240;
    const themeConfig = THEMES.find(t => t.id === currentTheme) || THEMES[1];
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            fontFamily: "'Inter','PingFang TC',system-ui,sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }, children: [_jsx("div", { style: {
                    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    background: currentTheme === 'water-zen'
                        ? 'radial-gradient(ellipse at 10% 90%, rgba(46,168,176,0.06) 0%, transparent 60%), radial-gradient(ellipse at 90% 10%, rgba(82,183,136,0.05) 0%, transparent 60%)'
                        : currentTheme === 'berkeley'
                            ? 'radial-gradient(ellipse at 0% 0%, rgba(0,50,98,0.05) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(253,181,21,0.04) 0%, transparent 50%)'
                            : currentTheme === 'minimal-blue'
                                ? 'radial-gradient(ellipse at 30% 20%, rgba(14,165,233,0.04) 0%, transparent 60%)'
                                : 'radial-gradient(ellipse at 20% 20%, rgba(6,182,212,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.04) 0%, transparent 50%)',
                } }), _jsx(Suspense, { fallback: null, children: _jsx(SidebarNav, { collapsed: collapsed, setCollapsed: setCollapsed, mobileOpen: mobileOpen, setMobileOpen: setMobileOpen, currentTheme: currentTheme, onThemeChange: handleThemeChange }) }), _jsxs("main", { style: {
                    marginLeft: sidebarWidth,
                    flex: 1,
                    display: 'flex', flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
                    position: 'relative', zIndex: 1,
                }, children: [_jsxs("header", { style: {
                            height: 52,
                            background: 'var(--header-bg)',
                            backdropFilter: 'blur(12px)',
                            borderBottom: '1px solid var(--sidebar-border)',
                            display: 'flex', alignItems: 'center',
                            padding: '0 18px', gap: 10,
                            position: 'sticky', top: 0, zIndex: 40,
                        }, children: [_jsx("button", { onClick: () => setMobileOpen(true), className: "mobile-menu-btn", style: {
                                    display: 'none', width: 30, height: 30,
                                    borderRadius: 7, background: 'transparent',
                                    border: 'none', cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                }, children: _jsx(Menu, { size: 16 }) }), _jsx("div", { style: { flex: 1 } }), _jsxs("div", { style: {
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '3px 8px',
                                    background: 'var(--glass-frosted)',
                                    borderRadius: 6,
                                    border: '1px solid var(--sidebar-border)',
                                    fontSize: 10, color: 'var(--text-muted)',
                                }, children: [_jsx("span", { children: themeConfig.emoji }), _jsx("span", { style: { fontWeight: 600, color: 'var(--accent-primary)' }, children: themeConfig.name })] }), _jsx("div", { style: { display: 'flex', gap: 3 }, children: ['T1', 'T2', 'T3', 'T4', 'T5'].map((t, i) => (_jsx("div", { style: {
                                        width: 18, height: 18, borderRadius: 4,
                                        background: i < 4 ? 'rgba(6,182,212,0.12)' : 'rgba(253,181,21,0.12)',
                                        border: `1px solid ${i < 4 ? 'rgba(6,182,212,0.3)' : 'rgba(253,181,21,0.3)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 7, fontWeight: 800,
                                        color: i < 4 ? 'var(--accent-primary)' : '#fdb515',
                                    }, children: i + 1 }, t))) }), _jsxs("button", { style: {
                                    width: 30, height: 30, borderRadius: 7,
                                    background: 'var(--glass-frosted)',
                                    border: '1px solid var(--sidebar-border)',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', position: 'relative',
                                }, children: [_jsx(Bell, { size: 13 }), _jsx("span", { style: {
                                            position: 'absolute', top: 7, right: 7,
                                            width: 5, height: 5, borderRadius: '50%',
                                            background: 'var(--accent-primary)',
                                        } })] })] }), _jsx("div", { style: { flex: 1, overflow: 'auto' }, children: children })] }), _jsx(OmniCommandPalette, {}), _jsx(OmniAgentFloatingAgent, {}), _jsx("style", { children: `
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.25); border-radius: 2px; }
      ` })] }));
}
//# sourceMappingURL=OmniCoreShell.js.map