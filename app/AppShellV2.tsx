'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Fingerprint, HeartPulse, 
  MessageSquare, BarChart3, Cable, Rocket, Bot, Sparkles, 
  Trophy, Brain, Layers, Command, Leaf, Users, ShieldCheck, 
  Grid3X3, Hexagon, ListChecks, Lock, ClipboardList, Shield, 
  Landmark, Sun, Moon, Bell, ChevronLeft, ChevronRight, 
  ChevronDown, ChevronUp, User, Search, Settings, MoreHorizontal,
  Star, Zap, Activity, Menu, X, Building2, Link as LinkIcon, Database,
  LayoutTemplate, Stethoscope, ScatterChart, Map, CheckSquare,
  FileCheck, Calculator, Truck, HeartHandshake, PenTool, Dna,
  Globe, ShieldAlert, History, Vault, BadgeCheck, Link2, Send,
  Library, BookOpen, PieChart, GraduationCap, Briefcase, Headset,
  Network, Cpu, Share2, TestTube, TerminalSquare, Palette, UploadCloud
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useTheme } from '../contexts/ThemeContext';
import { SaaS_NAVIGATION, IT_OPS_NAVIGATION, NavGroup, NavItem } from '../config/navigation';

// Icon Mapper for Dynamic Navigation
const IconMapper: Record<string, React.ReactNode> = {
  Building2: <Building2 size={20} />,
  Link: <LinkIcon size={20} />,
  Database: <Database size={20} />,
  LayoutTemplate: <LayoutTemplate size={20} />,
  Stethoscope: <Stethoscope size={20} />,
  ScatterChart: <ScatterChart size={20} />,
  Map: <Map size={20} />,
  CheckSquare: <CheckSquare size={20} />,
  FileCheck: <FileCheck size={20} />,
  Leaf: <Leaf size={20} />,
  Users: <Users size={20} />,
  Landmark: <Landmark size={20} />,
  Calculator: <Calculator size={20} />,
  Truck: <Truck size={20} />,
  HeartHandshake: <HeartHandshake size={20} />,
  PenTool: <PenTool size={20} />,
  MessageSquare: <MessageSquare size={20} />,
  Dna: <Dna size={20} />,
  Globe: <Globe size={20} />,
  ShieldAlert: <ShieldAlert size={20} />,
  LayoutDashboard: <LayoutDashboard size={20} />,
  History: <History size={20} />,
  Vault: <Vault size={20} />,
  BadgeCheck: <BadgeCheck size={20} />,
  Link2: <Link2 size={20} />,
  Send: <Send size={20} />,
  Library: <Library size={20} />,
  BookOpen: <BookOpen size={20} />,
  PieChart: <PieChart size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  Briefcase: <Briefcase size={20} />,
  Headset: <Headset size={20} />,
  Network: <Network size={20} />,
  Cpu: <Cpu size={20} />,
  Command: <Command size={20} />,
  Share2: <Share2 size={20} />,
  Activity: <Activity size={20} />,
  TestTube: <TestTube size={20} />,
  TerminalSquare: <TerminalSquare size={20} />,
  Palette: <Palette size={20} />,
};

// Core 6 Journeys for Mobile Bottom Bar (Refined for Mobile optimization)
const mobileBottomItems = [
  { href: '/', label: '首頁', icon: <LayoutDashboard size={24} /> },
  { href: '/editor', label: '撰寫', icon: <FileText size={24} /> },
  { href: '/vault', label: '金庫', icon: <Lock size={24} /> },
  { href: '/intelligence', label: '情報', icon: <BarChart3 size={24} /> },
  { href: '/omniagent-orchestrator', label: '代理', icon: <Bot size={24} /> },
  { href: '/profile', label: '帳號', icon: <User size={24} /> },
];

export default function AppShellV2({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setMode } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [topbarCollapsed, setTopbarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedSidebar = localStorage.getItem('sidebar_collapsed');
    if (savedSidebar === 'true') setSidebarCollapsed(true);
    const savedTopbar = localStorage.getItem('topbar_collapsed');
    if (savedTopbar === 'true') setTopbarCollapsed(true);
  }, []);

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

  if (!isMounted) return null;

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-all duration-700 font-sans relative",
      isDark 
        ? "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200" 
        : "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-indigo-50/20 to-white text-[#003262]"
    )}>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 80 : 288,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }}
        className={cn(
          "hidden md:flex flex-col h-full relative z-50 border-r transition-all duration-500 backdrop-blur-3xl shadow-2xl",
          isDark 
            ? "bg-[#003262]/80 border-white/10" 
            : "bg-white/70 border-slate-200/50"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "p-6 h-20 flex items-center gap-4 overflow-hidden border-b transition-colors",
          isDark ? "border-white/5" : "border-slate-100"
        )}>
          <div className="min-w-[40px] flex justify-center">
            <BrandLogo size="sm" />
          </div>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-sm tracking-tighter leading-none">ESGGO 善向永續 系統</span>
              <span className="text-[9px] font-bold opacity-40 tracking-[0.2em] uppercase mt-1">OmniCore v8.5</span>
            </motion.div>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-10 no-scrollbar">
          {[...SaaS_NAVIGATION, ...IT_OPS_NAVIGATION].map((group, i) => (
            <div key={group.groupId} className="space-y-3">
              {!sidebarCollapsed && (
                <p className="px-4 text-[10px] font-black opacity-30 uppercase tracking-[0.3em] whitespace-nowrap">
                  {group.groupTitle}
                </p>
              )}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                        isActive 
                          ? (isDark ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "bg-[#003262] text-white shadow-lg")
                          : (isDark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-100/80 hover:text-[#003262]")
                      )}
                    >
                      <div className={cn(
                        "transition-all duration-300 flex-shrink-0",
                        sidebarCollapsed ? "mx-auto" : "",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )}>
                        {IconMapper[item.icon] || <LayoutDashboard size={20} />}
                      </div>
                      
                      {!sidebarCollapsed && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="flex flex-col flex-1 min-w-0"
                        >
                          <span className="text-[13px] font-black tracking-tight truncate">{item.title}</span>
                          <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest truncate">{item.sub}</span>
                        </motion.div>
                      )}

                      {/* Active Indicator Dot */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeDot"
                          className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#FDB515] shadow-[0_0_8px_#FDB515]" 
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className={cn(
          "p-4 border-t transition-colors",
          isDark ? "border-white/5" : "border-slate-100"
        )}>
          <button 
            onClick={handleSidebarToggle}
            className={cn(
              "w-full h-12 rounded-2xl flex items-center justify-center transition-all",
              isDark ? "hover:bg-white/5 text-slate-500 hover:text-slate-300" : "hover:bg-slate-100 text-slate-400 hover:text-[#003262]"
            )}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        
        {/* ─── DESKTOP TOPBAR ─── */}
        <AnimatePresence>
          {!topbarCollapsed && (
            <motion.header
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 80, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "hidden md:flex items-center justify-between px-10 border-b relative z-40 backdrop-blur-2xl transition-colors",
                isDark ? "bg-slate-950/60 border-white/5" : "bg-white/50 border-slate-200/50"
              )}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/5 rounded-full border border-slate-900/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">OmniSync_Operational</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search Trigger */}
                <button className={cn(
                  "p-2.5 rounded-xl border transition-all",
                  isDark ? "bg-white/5 border-white/10 text-slate-400 hover:text-white" : "bg-slate-50 border-slate-200 text-slate-500 hover:text-[#003262]"
                )}>
                  <Search size={18} />
                </button>

                {/* Theme Switcher */}
                <button 
                  onClick={toggleTheme}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all flex items-center gap-2",
                    isDark ? "bg-[#FDB515]/10 border-[#FDB515]/20 text-[#FDB515]" : "bg-blue-50 border-blue-200 text-[#003262]"
                  )}
                >
                  {isDark ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* Notifications */}
                <button className={cn(
                  "p-2.5 rounded-xl border transition-all relative",
                  isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                )}>
                  <Bell size={18} />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#FDB515] rounded-full border-2 border-white shadow-sm" />
                </button>

                {/* User Profile */}
                <div className={cn(
                  "flex items-center gap-3 pl-6 border-l ml-2",
                  isDark ? "border-white/10" : "border-slate-200"
                )}>
                  <div className="w-10 h-10 rounded-2xl bg-[#003262] flex items-center justify-center text-[#FDB515] font-black shadow-lg border-2 border-white/20">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-tight">DingJun</span>
                    <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Administrator</span>
                  </div>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Topbar Collapse Handle (Desktop) */}
        <button 
          onClick={handleTopbarToggle}
          className={cn(
            "hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-[100] px-8 py-1 rounded-b-2xl border transition-all duration-500 group overflow-hidden shadow-lg",
            isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200",
            topbarCollapsed ? "translate-y-0" : "translate-y-[80px]"
          )}
        >
          {topbarCollapsed 
            ? <ChevronDown size={14} className="text-[#FDB515] group-hover:scale-125 transition-transform" /> 
            : <ChevronUp size={14} className="text-slate-400 group-hover:scale-125 transition-transform" />
          }
        </button>

        {/* ─── MOBILE TOP FUNCTION BAR ─── */}
        <div className={cn(
          "md:hidden h-16 flex items-center px-4 border-b z-40 sticky top-0 backdrop-blur-3xl shadow-sm transition-colors",
          isDark ? "bg-slate-950/90 border-white/5" : "bg-white/90 border-slate-100"
        )}>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 w-full">
            {/* Theme Toggle Mobile */}
            <button 
              onClick={toggleTheme}
              className={cn(
                "flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black flex items-center gap-2 border transition-all shadow-sm",
                isDark ? "bg-[#FDB515]/20 border-[#FDB515]/30 text-[#FDB515]" : "bg-blue-50 border-blue-100 text-[#003262]"
              )}
            >
              {isDark ? <Moon size={14} /> : <Sun size={14} />} THEME
            </button>
            
            {/* Quick Actions Pills */}
            <button className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black flex items-center gap-2 border transition-all shadow-sm",
              isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-500"
            )}>
              <Star size={14} /> FAVORITE
            </button>
            <button className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black flex items-center gap-2 border transition-all shadow-sm",
              isDark ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-700"
            )}>
              <Bot size={14} /> AI_CORE
            </button>
            <button className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-black flex items-center gap-2 border transition-all shadow-sm",
              isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-700"
            )}>
              <Settings size={14} /> SYSTEM
            </button>
          </div>
        </div>

        {/* ─── MAIN SCROLLABLE CONTENT ─── */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname + (isDark ? 'dark' : 'light')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-full p-4 md:p-10 lg:p-14 pb-32 md:pb-14 max-w-[1920px] mx-auto relative z-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          
          {/* Background Decorative Blobs */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none -z-0" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#FDB515]/3 blur-[100px] pointer-events-none -z-0" />
        </main>

        {/* ─── MOBILE BOTTOM TAB BAR ─── */}
        <div className={cn(
          "md:hidden h-24 fixed bottom-0 left-0 right-0 z-[100] border-t flex items-center px-4 backdrop-blur-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-colors",
          isDark ? "bg-slate-950/90 border-white/5" : "bg-white/90 border-slate-100"
        )}>
          <div className="flex items-center justify-between w-full overflow-x-auto no-scrollbar gap-2 py-3 px-2">
            {mobileBottomItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[68px] h-16 rounded-3xl transition-all duration-500 relative",
                    isActive ? "scale-105" : "opacity-40"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="mobileActiveBg"
                      className="absolute inset-0 bg-[#FDB515]/10 rounded-3xl border border-[#FDB515]/20" 
                    />
                  )}
                  <div className={cn(
                    "p-2 rounded-2xl transition-colors relative z-10",
                    isActive ? "text-[#FDB515]" : (isDark ? "text-white" : "text-[#003262]")
                  )}>
                    {item.icon}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black tracking-tighter transition-colors mt-1 relative z-10",
                    isActive ? "text-[#FDB515]" : (isDark ? "text-slate-400" : "text-slate-500")
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── FLOATING RESONANCE INDICATOR (Desktop Only) ─── */}
        <div className="hidden md:flex fixed bottom-12 right-12 z-[60] group">
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className={cn(
              "px-8 py-4 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl flex items-center gap-5 transition-all duration-500 cursor-pointer",
              isDark 
                ? "bg-[#003262]/60 border-[#FDB515]/30 shadow-[#FDB515]/5" 
                : "bg-white/80 border-[#003262]/20 shadow-xl"
            )}
          >
            <div className="relative">
               <div className={cn(
                 "p-3 rounded-2xl transition-colors",
                 isDark ? "bg-[#FDB515]/10 text-[#FDB515]" : "bg-[#003262] text-white shadow-lg"
               )}>
                 <Bot size={24} className="group-hover:rotate-12 transition-transform" />
               </div>
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse shadow-[0_0_10px_#10b981]" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-[11px] font-black uppercase tracking-[0.25em]", 
                isDark ? "text-[#FDB515]" : "text-[#003262]"
              )}>OmniAgent Pulse</span>
              <div className="flex items-center gap-3 mt-1.5">
                 <div className="h-1.5 w-32 bg-slate-200/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: '92.4%' }} 
                      className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
                    />
                 </div>
                 <span className="text-[10px] font-mono font-black opacity-60">92.4%</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Global Style Adjustments */}
      <style jsx global>{`
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
      `}</style>
    </div>
  );
}
