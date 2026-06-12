'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Fingerprint, HeartPulse, 
  MessageSquare, BarChart3, Cable, Rocket, Bot, Sparkles, 
  Trophy, Brain, Layers, Command, Leaf, Users, ShieldCheck, 
  Grid3X3, Hexagon, ListChecks, Lock, ClipboardList, Shield, Heart, 
  Landmark, Sun, Moon, Bell, ChevronLeft, ChevronRight, 
  ChevronDown, ChevronUp, User, Search, Settings, MoreHorizontal,
  Star, Zap, Activity, Menu, X, Building2, Link as LinkIcon, Database,
  LayoutTemplate, Stethoscope, ScatterChart, Map, CheckSquare,
  FileCheck, Calculator, Truck, HeartHandshake, PenTool, Dna,
  Globe, ShieldAlert, History, Archive, BadgeCheck, Link2, Send,
  Library, BookOpen, PieChart, GraduationCap, Briefcase, Headphones,
  Network, Cpu, Share2, TestTube, TerminalSquare, Palette, UploadCloud,
  Flame, Plus, Save
} from 'lucide-react';
import { cn } from '../lib/utils';
import BrandButton from '../components/brand/BrandButton';
import BrandStatusDot from '../components/brand/BrandStatusDot';
import OmniAgentPulseFloating from '../components/core/OmniAgentPulseFloating';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { SaaS_NAVIGATION, IT_OPS_NAVIGATION, NavGroup, NavItem } from '../config/navigation';
import { GlobalSearch } from '../components/GlobalSearch';
import AppThemeSwitcher from '../components/AppThemeSwitcher';
import OmniOverviewMenu from '../components/OmniOverviewMenu';

// Icon Mapper for Dynamic Navigation
export const IconMapper: Record<string, React.ReactNode> = {
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
  Archive: <Archive size={20} />,
  BadgeCheck: <BadgeCheck size={20} />,
  Link2: <Link2 size={20} />,
  Send: <Send size={20} />,
  Library: <Library size={20} />,
  BookOpen: <BookOpen size={20} />,
  PieChart: <PieChart size={20} />,
  GraduationCap: <GraduationCap size={20} />,
  Briefcase: <Briefcase size={20} />,
  Headphones: <Headphones size={20} />,
  Network: <Network size={20} />,
  Cpu: <Cpu size={20} />,
  Command: <Command size={20} />,
  Share2: <Share2 size={20} />,
  Activity: <Activity size={20} />,
  TestTube: <TestTube size={20} />,
  TerminalSquare: <TerminalSquare size={20} />,
  Palette: <Palette size={20} />,
  Flame: <Flame size={20} />,
  Vault: <Lock size={20} />,
  Shield: <Shield size={20} />,
  Heart: <Heart size={20} />,
  Star: <Star size={20} />,
};

// Core Journeys for Mobile Bottom Bar (Refined for Mobile optimization)
const mobileBottomItems = [
  { href: '/dashboard', label: '首頁', icon: <LayoutDashboard size={24} /> },
  { href: '/editor', label: '撰寫', icon: <FileText size={24} /> },
  { href: '/vault', label: '金庫', icon: <Lock size={24} /> },
  { href: '/intelligence', label: '情報', icon: <BarChart3 size={24} /> },
];

export default function AppShellV2({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setMode } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { user } = useAuth();
  const isSuperAdmin = user && (user.role === 'superadmin' || user.email === 'dev@esggo.com' || user.id === 'dev_user');
  
  // Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [topbarCollapsed, setTopbarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(true); // Default to true

  const [showOverviewMenu, setShowOverviewMenu] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const [logoPosition, setLogoPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favorites, setFavorites] = useState<{ id: string; title: string; path: string; icon: string; sub?: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('esggo_favorites');
    if (stored) {
      try {
        const favs = JSON.parse(stored);
        setFavorites(favs);
        setIsFavorited(favs.some((item: any) => item.path === pathname));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initial = [
        { id: 'dashboard', title: '全域控制台', path: '/dashboard', icon: 'LayoutDashboard', sub: 'Overview' },
        { id: 'editor', title: 'SustainWrite 編輯器', path: '/editor', icon: 'PenTool', sub: 'Editor' }
      ];
      localStorage.setItem('esggo_favorites', JSON.stringify(initial));
      setFavorites(initial);
      setIsFavorited(initial.some((item: any) => item.path === pathname));
    }
  }, [pathname]);

  const toggleFavorite = () => {
    const stored = localStorage.getItem('esggo_favorites');
    let favs = [];
    if (stored) {
      try {
        favs = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    
    const exists = favs.some((item: any) => item.path === pathname);
    let updated = [];
    if (exists) {
      updated = favs.filter((item: any) => item.path !== pathname);
      setIsFavorited(false);
    } else {
      const allNavItems = [...SaaS_NAVIGATION, ...IT_OPS_NAVIGATION].flatMap(g => g.items);
      const currentItem = allNavItems.find(item => item.path === pathname);
      
      if (currentItem) {
        updated = [...favs, {
          id: currentItem.id,
          title: currentItem.title,
          path: currentItem.path,
          icon: currentItem.icon,
          sub: currentItem.sub
        }];
        setIsFavorited(true);
      } else {
        updated = [...favs, {
          id: pathname.replace('/', '') || 'home',
          title: document.title.replace(' | ESGGO', '') || '目前頁面',
          path: pathname,
          icon: 'Star',
          sub: 'Custom'
        }];
        setIsFavorited(true);
      }
    }
    localStorage.setItem('esggo_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  useEffect(() => {
    const savedSidebar = localStorage.getItem('sidebar_collapsed');
    if (savedSidebar === 'true') setSidebarCollapsed(true);
    const savedTopbar = localStorage.getItem('topbar_collapsed');
    if (savedTopbar === 'true') setTopbarCollapsed(true);
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



  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-all duration-700 font-sans relative",
      isDark 
        ? "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200" 
        : "bg-[#FAF9F6] text-[#003262]"
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
          "px-6 py-4 min-h-[96px] flex items-center gap-4 overflow-hidden border-b transition-colors",
          isDark ? "border-white/5" : "border-slate-100"
        )}>
          <div className="flex justify-center w-full" ref={logoRef}>
            <BrandLogo size="sm" hideText={sidebarCollapsed} />
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-10 no-scrollbar">
          {[
            ...SaaS_NAVIGATION.map(g => {
              if (g.groupId === 'favorites') {
                return {
                  ...g,
                  items: [
                    ...favorites.map(fav => ({
                      id: `fav-${fav.id}`,
                      title: fav.title,
                      path: fav.path,
                      icon: fav.icon,
                      sub: fav.sub
                    })),
                    {
                      id: 'manage-favorites',
                      title: '管理我的最愛',
                      path: '/favorites',
                      icon: 'Heart',
                      sub: 'Manage'
                    }
                  ]
                };
              }
              return g;
            }),
            ...(isSuperAdmin ? IT_OPS_NAVIGATION : [])
          ].map((group, i) => (
            <div 
              key={group.groupId} 
              className={cn(
                "space-y-3 transition-all duration-500",
                group.groupId === 'super-admin' && !sidebarCollapsed 
                  ? "p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 dark:border-purple-500/20 rounded-3xl relative overflow-hidden shadow-inner" 
                  : "",
                group.groupId === 'favorites' && !sidebarCollapsed 
                  ? "p-4 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/10 dark:border-amber-500/20 rounded-3xl relative overflow-hidden shadow-inner" 
                  : ""
              )}
            >
              {group.groupId === 'super-admin' && !sidebarCollapsed && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 dark:bg-pink-500/10 blur-2xl rounded-full pointer-events-none" />
              )}
              {group.groupId === 'favorites' && !sidebarCollapsed && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 dark:bg-yellow-500/10 blur-2xl rounded-full pointer-events-none" />
              )}
              {!sidebarCollapsed && (
                <p className="px-4 text-[10px] font-black opacity-40 uppercase tracking-[0.3em] whitespace-nowrap flex items-center justify-between">
                  <span>{group.groupTitle}</span>
                  {group.groupId === 'super-admin' && (
                    <span className="text-[9px] bg-purple-500/10 text-purple-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-normal">SYS</span>
                  )}
                  {group.groupId === 'favorites' && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-normal">FAV</span>
                  )}
                </p>
              )}
              <div className="space-y-1.5 relative z-10">
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
                          className="absolute right-3" 
                        >
                          <BrandStatusDot 
                            status="active" // Could still be 'active' for semantic meaning
                            size="xs" // w-1.5 h-1.5
                            colorClassName="bg-[#FDB515]" // Restore gold color
                            shadowClassName="shadow-[0_0_8px_#FDB515]" // Restore shadow
                            dotOnly={true} // Render only the dot, no label container
                          />
                        </motion.div>
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
          "p-4 border-t transition-colors flex flex-col gap-2",
          isDark ? "border-white/5" : "border-slate-100"
        )}>
          {!sidebarCollapsed && (
            <div className={cn(
              "text-[10px] text-center font-mono tracking-widest opacity-40 select-none",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>
              v8.5.2-Alpha
            </div>
          )}
          <BrandButton
            onClick={handleSidebarToggle}
            variant="ghost"
            size="md"
            icon={sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            fullWidth
            className={cn(
              "h-12",
              isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-[#003262]"
            )}
            hoverBgClassName={isDark ? "hover:bg-white/5" : "hover:bg-slate-100"}
          />
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
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('restore-omni-pulse'))}
                  className="flex items-center gap-3 px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-full border border-slate-900/5 transition-colors cursor-pointer"
                  title="喚醒萬能精靈 (Restore OmniAgent Pulse)"
                >
                  <BrandStatusDot 
                    status="active" 
                    pulse={true} 
                    size="md" 
                    shadowClassName="shadow-[0_0_12px_#10b981]" 
                    dotOnly={true} 
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">OmniSync_Operational</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Search Trigger (Global Search CMD+K) */}
                <GlobalSearch />

                {/* Theme Switcher */}
                <AppThemeSwitcher />

                {/* Favorite Toggle Button */}
                <BrandButton
                  onClick={toggleFavorite}
                  variant="ghost"
                  icon={<Star size={18} className={cn(isFavorited ? "fill-yellow-400 text-yellow-400" : "text-slate-400")} />}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all flex items-center justify-center",
                    isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                  title={isFavorited ? "移出我的最愛" : "加入我的最愛"}
                />

                {/* Notifications */}
                <div className="relative">
                  <BrandButton
                    variant="ghost"
                    icon={<Bell size={18} />}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all flex items-center justify-center",
                      isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                    )}
                  />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#FDB515] rounded-full border-2 border-white shadow-sm" />
                </div>

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
          isDark ? "bg-slate-950/90 border-white/5" : "bg-white/90 border-slate-300"
        )}>
          <div className="flex items-center gap-3 overflow-x-scroll no-scrollbar py-2 w-full pr-4"> 
            {/* Theme Toggle Mobile */}
            <div className="flex-shrink-0">
              <AppThemeSwitcher />
            </div>
            
            {/* Quick Actions Pills */}
            <BrandButton 
              onClick={toggleFavorite}
              icon={<Star size={18} className={cn(isFavorited ? "fill-yellow-400 text-yellow-400" : "text-slate-400")} />}
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full border transition-all shadow-sm flex items-center justify-center p-0",
                isFavorited 
                  ? "bg-yellow-500/10 border-yellow-500/20" 
                  : (isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-300")
              )}
            />
            {/* "全觀" (Overview) Button */}
            <BrandButton
              icon={<Menu size={18} />}
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full border transition-all shadow-sm flex items-center justify-center p-0",
                isDark ? "bg-slate-700/50 border-slate-600/50 text-slate-300" : "bg-slate-200 border-slate-300 text-slate-600"
              )}
              onClick={() => setShowOverviewMenu(true)}
            />
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
          
          {/* Background Decorative Blobs Removed for Cleanliness */}
        </main>

        {/* ─── MOBILE BOTTOM TAB BAR & FAB ─── */}
        <div className={cn(
          "md:hidden h-24 fixed bottom-0 left-0 right-0 z-[100] border-t flex justify-center px-4 backdrop-blur-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-colors",
          isDark ? "bg-slate-950/90 border-white/5" : "bg-white/90 border-slate-300"
        )}>
          
          {/* FAB Pop-up Menu */}
          <AnimatePresence>
            {showFabMenu && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFabMenu(false)}
                  className="fixed inset-0 bg-black/40 z-[-1] backdrop-blur-sm -top-[100vh]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className={cn(
                    "absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col gap-3 p-4 rounded-3xl shadow-2xl border w-64",
                    isDark ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
                  )}
                >
                  <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#FDB515]/10 text-left transition-colors">
                    <div className="bg-[#FDB515]/20 p-2 rounded-xl text-[#FDB515]"><Plus size={20} /></div>
                    <span className="font-bold text-sm">新增紀錄</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cyan-500/10 text-left transition-colors">
                    <div className="bg-cyan-500/20 p-2 rounded-xl text-cyan-500"><MessageSquare size={20} /></div>
                    <span className="font-bold text-sm">快速留言</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-500/10 text-left transition-colors">
                    <div className="bg-blue-500/20 p-2 rounded-xl text-blue-500"><Save size={20} /></div>
                    <span className="font-bold text-sm">SustainWrite 儲存</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between w-full max-w-sm gap-2 py-3 px-2">
            {mobileBottomItems.map((item, idx) => {
              const isActive = pathname === item.href;
              const isCenter = idx === 2; // We want 2 items, FAB, 2 items
              
              return (
                <React.Fragment key={idx}>
                  {isCenter && (
                    <div className="flex flex-col items-center justify-center min-w-[72px] h-16 relative z-50">
                      <button
                        onClick={() => setShowFabMenu(!showFabMenu)}
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transform transition-transform duration-300",
                          showFabMenu ? "rotate-45 bg-rose-500" : "bg-[#FDB515] hover:scale-110"
                        )}
                      >
                        <Plus size={28} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[64px] h-16 rounded-3xl transition-all duration-500 relative",
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
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ─── FLOATING RESONANCE INDICATOR (Desktop Only) ─── */}
        <OmniAgentPulseFloating logoPosition={logoPosition} />
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
