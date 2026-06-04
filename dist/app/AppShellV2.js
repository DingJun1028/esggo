'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileText, MessageSquare, BarChart3, Bot, Command, Leaf, Users, Lock, Landmark, Sun, Moon, Bell, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, User, Settings, Star, Activity, Building2, Link as LinkIcon, Database, LayoutTemplate, Stethoscope, ScatterChart, Map, CheckSquare, FileCheck, Calculator, Truck, HeartHandshake, PenTool, Dna, Globe, ShieldAlert, History, Vault, BadgeCheck, Link2, Send, Library, BookOpen, PieChart, GraduationCap, Briefcase, Headset, Network, Cpu, Share2, TestTube, TerminalSquare, Palette } from 'lucide-react';
import { cn } from '../lib/utils';
import BrandButton from '../components/brand/BrandButton';
import BrandStatusDot from '../components/brand/BrandStatusDot';
import OmniAgentPulseFloating from '../components/core/OmniAgentPulseFloating';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useTheme } from '../contexts/ThemeContext';
import { SaaS_NAVIGATION, IT_OPS_NAVIGATION } from '../config/navigation';
import { GlobalSearch } from '../components/GlobalSearch';
// Icon Mapper for Dynamic Navigation
const IconMapper = {
    Building2: _jsx(Building2, { size: 20 }),
    Link: _jsx(LinkIcon, { size: 20 }),
    Database: _jsx(Database, { size: 20 }),
    LayoutTemplate: _jsx(LayoutTemplate, { size: 20 }),
    Stethoscope: _jsx(Stethoscope, { size: 20 }),
    ScatterChart: _jsx(ScatterChart, { size: 20 }),
    Map: _jsx(Map, { size: 20 }),
    CheckSquare: _jsx(CheckSquare, { size: 20 }),
    FileCheck: _jsx(FileCheck, { size: 20 }),
    Leaf: _jsx(Leaf, { size: 20 }),
    Users: _jsx(Users, { size: 20 }),
    Landmark: _jsx(Landmark, { size: 20 }),
    Calculator: _jsx(Calculator, { size: 20 }),
    Truck: _jsx(Truck, { size: 20 }),
    HeartHandshake: _jsx(HeartHandshake, { size: 20 }),
    PenTool: _jsx(PenTool, { size: 20 }),
    MessageSquare: _jsx(MessageSquare, { size: 20 }),
    Dna: _jsx(Dna, { size: 20 }),
    Globe: _jsx(Globe, { size: 20 }),
    ShieldAlert: _jsx(ShieldAlert, { size: 20 }),
    LayoutDashboard: _jsx(LayoutDashboard, { size: 20 }),
    History: _jsx(History, { size: 20 }),
    Vault: _jsx(Vault, { size: 20 }),
    BadgeCheck: _jsx(BadgeCheck, { size: 20 }),
    Link2: _jsx(Link2, { size: 20 }),
    Send: _jsx(Send, { size: 20 }),
    Library: _jsx(Library, { size: 20 }),
    BookOpen: _jsx(BookOpen, { size: 20 }),
    PieChart: _jsx(PieChart, { size: 20 }),
    GraduationCap: _jsx(GraduationCap, { size: 20 }),
    Briefcase: _jsx(Briefcase, { size: 20 }),
    Headset: _jsx(Headset, { size: 20 }),
    Network: _jsx(Network, { size: 20 }),
    Cpu: _jsx(Cpu, { size: 20 }),
    Command: _jsx(Command, { size: 20 }),
    Share2: _jsx(Share2, { size: 20 }),
    Activity: _jsx(Activity, { size: 20 }),
    TestTube: _jsx(TestTube, { size: 20 }),
    TerminalSquare: _jsx(TerminalSquare, { size: 20 }),
    Palette: _jsx(Palette, { size: 20 }),
};
// Core 6 Journeys for Mobile Bottom Bar (Refined for Mobile optimization)
const mobileBottomItems = [
    { href: '/', label: '首頁', icon: _jsx(LayoutDashboard, { size: 24 }) },
    { href: '/editor', label: '撰寫', icon: _jsx(FileText, { size: 24 }) },
    { href: '/vault', label: '金庫', icon: _jsx(Lock, { size: 24 }) },
    { href: '/intelligence', label: '情報', icon: _jsx(BarChart3, { size: 24 }) },
    { href: '/omniagent-orchestrator', label: '代理', icon: _jsx(Bot, { size: 24 }) },
    { href: '/profile', label: '帳號', icon: _jsx(User, { size: 24 }) },
];
export default function AppShellV2({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { resolvedTheme, setMode } = useTheme();
    const isDark = resolvedTheme === 'dark';
    // Layout States
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [topbarCollapsed, setTopbarCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const logoRef = useRef(null);
    const [logoPosition, setLogoPosition] = useState(null);
    useEffect(() => {
        setIsMounted(true);
        const savedSidebar = localStorage.getItem('sidebar_collapsed');
        if (savedSidebar === 'true')
            setSidebarCollapsed(true);
        const savedTopbar = localStorage.getItem('topbar_collapsed');
        if (savedTopbar === 'true')
            setTopbarCollapsed(true);
    }, []);
    useEffect(() => {
        const measureLogoPosition = () => {
            if (logoRef.current) {
                const rect = logoRef.current.getBoundingClientRect();
                setLogoPosition({
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                });
            }
        };
        // Measure on mount
        measureLogoPosition();
        // Re-measure on window resize
        window.addEventListener('resize', measureLogoPosition);
        return () => window.removeEventListener('resize', measureLogoPosition);
    }, [sidebarCollapsed]); // Re-measure when sidebar collapses/expands
    const handleSidebarToggle = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem('sidebar_collapsed', String(newState));
    };
    const handleTopbarToggle = () => {
        const newState = !topbarCollapsed;
        setTopbarCollapsed(newState);
        localStorage.setItem('topbar_collapsed', String(newState));
    };
    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };
    if (!isMounted)
        return null;
    return (_jsxs("div", { className: cn("flex h-screen overflow-hidden transition-all duration-700 font-sans relative", isDark
            ? "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200"
            : "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-indigo-50/20 to-white text-[#003262]"), children: [_jsxs(motion.aside, { initial: false, animate: {
                    width: sidebarCollapsed ? 80 : 288,
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }, className: cn("hidden md:flex flex-col h-full relative z-50 border-r transition-all duration-500 backdrop-blur-3xl shadow-2xl", isDark
                    ? "bg-[#003262]/80 border-white/10"
                    : "bg-white/70 border-slate-200/50"), children: [_jsxs("div", { className: cn("p-6 h-20 flex items-center gap-4 overflow-hidden border-b transition-colors", isDark ? "border-white/5" : "border-slate-100"), children: [_jsx("div", { className: "min-w-[40px] flex justify-center", ref: logoRef, children: _jsx(BrandLogo, { size: "sm" }) }), !sidebarCollapsed && (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "flex flex-col", children: [_jsx("span", { className: "font-black text-sm tracking-tighter leading-none", children: "ESGGO\u5584\u5411\u6C38\u7E8C" }), _jsx("span", { className: "text-[9px] font-bold opacity-40 tracking-[0.2em] uppercase mt-1", children: "OmniCore v8.5" })] }))] }), _jsx("nav", { className: "flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-10 no-scrollbar", children: [...SaaS_NAVIGATION, ...IT_OPS_NAVIGATION].map((group, i) => (_jsxs("div", { className: "space-y-3", children: [!sidebarCollapsed && (_jsx("p", { className: "px-4 text-[10px] font-black opacity-30 uppercase tracking-[0.3em] whitespace-nowrap", children: group.groupTitle })), _jsx("div", { className: "space-y-1.5", children: group.items.map((item) => {
                                        const isActive = pathname === item.path;
                                        return (_jsxs(Link, { href: item.path, className: cn("flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative", isActive
                                                ? (isDark ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "bg-[#003262] text-white shadow-lg")
                                                : (isDark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-100/80 hover:text-[#003262]")), children: [_jsx("div", { className: cn("transition-all duration-300 flex-shrink-0", sidebarCollapsed ? "mx-auto" : "", isActive ? "scale-110" : "group-hover:scale-110"), children: IconMapper[item.icon] || _jsx(LayoutDashboard, { size: 20 }) }), !sidebarCollapsed && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex flex-col flex-1 min-w-0", children: [_jsx("span", { className: "text-[13px] font-black tracking-tight truncate", children: item.title }), _jsx("span", { className: "text-[9px] font-bold opacity-40 uppercase tracking-widest truncate", children: item.sub })] })), isActive && (_jsx(motion.div, { layoutId: "activeDot", className: "absolute right-3", children: _jsx(BrandStatusDot, { status: "active" // Could still be 'active' for semantic meaning
                                                        , size: "xs" // w-1.5 h-1.5
                                                        , colorClassName: "bg-[#FDB515]" // Restore gold color
                                                        , shadowClassName: "shadow-[0_0_8px_#FDB515]" // Restore shadow
                                                        , dotOnly: true }) }))] }, item.id));
                                    }) })] }, group.groupId))) }), _jsx("div", { className: cn("p-4 border-t transition-colors", isDark ? "border-white/5" : "border-slate-100"), children: _jsx(BrandButton, { onClick: handleSidebarToggle, variant: "ghost", size: "md", icon: sidebarCollapsed ? _jsx(ChevronRight, { size: 20 }) : _jsx(ChevronLeft, { size: 20 }), fullWidth: true, className: cn("h-12", isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-[#003262]"), hoverBgClassName: isDark ? "hover:bg-white/5" : "hover:bg-slate-100" }) })] }), _jsxs("div", { className: "flex-1 flex flex-col min-w-0 relative h-full", children: [_jsx(AnimatePresence, { children: !topbarCollapsed && (_jsxs(motion.header, { initial: { height: 0, opacity: 0 }, animate: { height: 80, opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, className: cn("hidden md:flex items-center justify-between px-10 border-b relative z-40 backdrop-blur-2xl transition-colors", isDark ? "bg-slate-950/60 border-white/5" : "bg-white/50 border-slate-200/50"), children: [_jsx("div", { className: "flex items-center gap-6", children: _jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-slate-900/5 rounded-full border border-slate-900/5", children: [_jsx(BrandStatusDot, { status: "active", pulse: true, size: "md", shadowClassName: "shadow-[0_0_12px_#10b981]", dotOnly: true }), _jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em] opacity-60", children: "OmniSync_Operational" })] }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(GlobalSearch, {}), _jsx(BrandButton, { onClick: toggleTheme, variant: "ghost", icon: isDark ? _jsx(Moon, { size: 18 }) : _jsx(Sun, { size: 18 }), className: cn("p-2.5 rounded-xl border transition-all flex items-center justify-center", isDark ? "bg-[#FDB515]/10 border-[#FDB515]/20 text-[#FDB515]" : "bg-blue-50 border-blue-200 text-[#003262]") }), _jsxs("div", { className: "relative", children: [_jsx(BrandButton, { variant: "ghost", icon: _jsx(Bell, { size: 18 }), className: cn("p-2.5 rounded-xl border transition-all flex items-center justify-center", isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500") }), _jsx("div", { className: "absolute top-2 right-2 w-2 h-2 bg-[#FDB515] rounded-full border-2 border-white shadow-sm" })] }), _jsxs("div", { className: cn("flex items-center gap-3 pl-6 border-l ml-2", isDark ? "border-white/10" : "border-slate-200"), children: [_jsx("div", { className: "w-10 h-10 rounded-2xl bg-[#003262] flex items-center justify-center text-[#FDB515] font-black shadow-lg border-2 border-white/20", children: "A" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-xs font-black tracking-tight", children: "DingJun" }), _jsx("span", { className: "text-[9px] font-bold opacity-40 uppercase tracking-widest", children: "Administrator" })] })] })] })] })) }), _jsx("button", { onClick: handleTopbarToggle, className: cn("hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-[100] px-8 py-1 rounded-b-2xl border transition-all duration-500 group overflow-hidden shadow-lg", isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200", topbarCollapsed ? "translate-y-0" : "translate-y-[80px]"), children: topbarCollapsed
                            ? _jsx(ChevronDown, { size: 14, className: "text-[#FDB515] group-hover:scale-125 transition-transform" })
                            : _jsx(ChevronUp, { size: 14, className: "text-slate-400 group-hover:scale-125 transition-transform" }) }), _jsx("div", { className: cn("md:hidden h-16 flex items-center px-4 border-b z-40 sticky top-0 backdrop-blur-3xl shadow-sm transition-colors", isDark ? "bg-slate-950/90 border-white/5" : "bg-white/90 border-slate-100"), children: _jsxs("div", { className: "flex items-center gap-3 overflow-x-auto no-scrollbar py-2 w-full", children: [_jsx(BrandButton, { onClick: toggleTheme, icon: isDark ? _jsx(Moon, { size: 14 }) : _jsx(Sun, { size: 14 }), className: cn("flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black border transition-all shadow-sm", isDark ? "bg-[#FDB515]/20 border-[#FDB515]/30 text-[#FDB515]" : "bg-blue-50 border-blue-100 text-[#003262]"), children: "THEME" }), _jsx(BrandButton, { icon: _jsx(Star, { size: 14 }), className: cn("flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black border transition-all shadow-sm", isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-500"), children: "FAVORITE" }), _jsx(BrandButton, { icon: _jsx(Bot, { size: 14 }), className: cn("flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black border transition-all shadow-sm", isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-700"), children: "AI_CORE" }), _jsx(BrandButton, { icon: _jsx(Settings, { size: 14 }), className: cn("flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black border transition-all shadow-sm", isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-700"), children: "SYSTEM" })] }) }), _jsxs("main", { className: "flex-1 overflow-y-auto no-scrollbar scroll-smooth relative", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, className: "min-h-full p-4 md:p-10 lg:p-14 pb-32 md:pb-14 max-w-[1920px] mx-auto relative z-10", children: children }, pathname + (isDark ? 'dark' : 'light')) }), _jsx("div", { className: "absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none -z-0" }), _jsx("div", { className: "absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#FDB515]/3 blur-[100px] pointer-events-none -z-0" })] }), _jsx("div", { className: cn("md:hidden h-24 fixed bottom-0 left-0 right-0 z-[100] border-t flex items-center px-4 backdrop-blur-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-colors", isDark ? "bg-slate-950/90 border-white/5" : "bg-white/90 border-slate-100"), children: _jsx("div", { className: "flex items-center justify-between w-full overflow-x-auto no-scrollbar gap-2 py-3 px-2", children: mobileBottomItems.map((item, idx) => {
                                const isActive = pathname === item.href;
                                return (_jsxs(Link, { href: item.href, className: cn("flex flex-col items-center justify-center min-w-[68px] h-16 rounded-3xl transition-all duration-500 relative", isActive ? "scale-105" : "opacity-40"), children: [isActive && (_jsx(motion.div, { layoutId: "mobileActiveBg", className: "absolute inset-0 bg-[#FDB515]/10 rounded-3xl border border-[#FDB515]/20" })), _jsx("div", { className: cn("p-2 rounded-2xl transition-colors relative z-10", isActive ? "text-[#FDB515]" : (isDark ? "text-white" : "text-[#003262]")), children: item.icon }), _jsx("span", { className: cn("text-[10px] font-black tracking-tighter transition-colors mt-1 relative z-10", isActive ? "text-[#FDB515]" : (isDark ? "text-slate-400" : "text-slate-500")), children: item.label })] }, idx));
                            }) }) }), _jsx(OmniAgentPulseFloating, { logoPosition: logoPosition })] }), _jsx("style", { jsx: true, global: true, children: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        ::selection {
          background: ${isDark ? 'rgba(253,181,21,0.3)' : 'rgba(0,122,255,0.15)'};
          color: ${isDark ? '#FDB515' : '#003262'};
        }
        main {
          mask-image: linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent);
        }
      ` })] }));
}
//# sourceMappingURL=AppShellV2.js.map