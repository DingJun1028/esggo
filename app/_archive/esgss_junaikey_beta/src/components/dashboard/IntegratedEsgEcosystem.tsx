import React, { useState } from 'react';
import {
  BarChart3,
  Newspaper,
  Cpu,
  Globe,
  TrendingUp,
  Trophy,
  ShieldCheck,
  Activity,
  LayoutDashboard,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Zap,
  Fingerprint,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import All High-End Components
import { DailyNewsMonitor } from './DailyNewsMonitor';
import { PersonalEsgDashboard } from './PersonalEsgDashboard';
import { ProtocolCoreStabilization } from './ProtocolCoreStabilization';
import { SocialImpactNetwork } from './SocialImpactNetwork';
import { InvestorRelationsPlatform } from './InvestorRelationsPlatform';
import { SustainabilityAchievementMedals } from './SustainabilityAchievementMedals';

/**
 * 🌌 Integrated ESG Ecosystem (Master Hub)
 * --------------------------------------------------
 * The central orchestration layer for all JunAiKey services.
 * Features: Dynamic Space Switching, Global State Monitor, Premium Sidebar.
 */
export const IntegratedEsgEcosystem = () => {
  const [activeSpace, setActiveSpace] = useState('intelligence');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const spaces = [
    {
      id: 'intelligence',
      label: '每日情報脈搏 Pulse',
      icon: Newspaper,
      component: DailyNewsMonitor,
      color: 'text-[#0ABAB5]',
    },
    {
      id: 'personal',
      label: '個人 ESG 儀表板 Personal',
      icon: LayoutDashboard,
      component: PersonalEsgDashboard,
      color: 'text-emerald-400',
    },
    {
      id: 'protocol',
      label: '5T 協議核心穩定 Stabilization',
      icon: Cpu,
      component: ProtocolCoreStabilization,
      color: 'text-blue-400',
    },
    {
      id: 'impact',
      label: '社群影響力網絡 Impact',
      icon: Globe,
      component: SocialImpactNetwork,
      color: 'text-[#0ABAB5]',
    },
    {
      id: 'investor',
      label: '投資人關係平台 Relations',
      icon: TrendingUp,
      component: InvestorRelationsPlatform,
      color: 'text-amber-400',
    },
    {
      id: 'achievement',
      label: '成就勳章畫廊 Awards',
      icon: Trophy,
      component: SustainabilityAchievementMedals,
      color: 'text-[#0de7f2]',
    },
  ];

  const ActiveComponent = spaces.find(s => s.id === activeSpace)?.component || DailyNewsMonitor;

  return (
    <div className="bg-[#051414] text-white h-screen flex overflow-hidden font-display selection:bg-[#0ABAB5]/20">
      {/* Premium Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 340 : 100 }}
        className="bg-[#050d0d] border-r border-white/5 flex flex-col justify-between p-8 relative z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)] h-full"
      >
        <div className="space-y-12">
          {/* Logo Section */}
          <div className="flex items-center gap-6 px-2">
            <div
              className={`size-12 rounded-2xl bg-[#0ABAB5]/10 border border-[#0ABAB5]/30 flex items-center justify-center shadow-lg transition-transform ${!sidebarOpen ? 'scale-110' : ''}`}
            >
              <BarChart3 className="text-[#0ABAB5] size-7" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col"
              >
                <h1 className="text-xl font-black tracking-tighter uppercase leading-none italic">
                  JunAiKey
                </h1>
                <p className="text-[#0ABAB5] text-[9px] font-black uppercase tracking-[0.4em] mt-1">
                  Ecosystem Hub
                </p>
              </motion.div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            {spaces.map(space => (
              <button
                key={space.id}
                onClick={() => setActiveSpace(space.id)}
                className={`w-full group flex items-center gap-6 p-4 rounded-2xl transition-all relative overflow-hidden ${activeSpace === space.id ? 'bg-[#0ABAB5]/10 border border-[#0ABAB5]/30 shadow-xl' : 'hover:bg-white/5 grayscale hover:grayscale-0'}`}
              >
                <space.icon
                  className={`size-6 transition-colors ${activeSpace === space.id ? 'text-[#0ABAB5]' : 'text-white/20 group-hover:text-white'}`}
                />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-[11px] font-black uppercase tracking-widest text-left ${activeSpace === space.id ? 'text-[#0ABAB5]' : 'text-white/30 group-hover:text-white'}`}
                  >
                    {space.label}
                  </motion.span>
                )}
                {activeSpace === space.id && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute left-0 w-1 h-6 bg-[#0ABAB5] shadow-[0_0_15px_#0ABAB5] rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Widgets */}
        <div className="space-y-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen && (
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                收起側欄 Collapse
              </span>
            )}
          </button>

          <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#0ABAB5]/5 border border-[#0ABAB5]/10">
            <div className="size-10 rounded-full border-2 border-[#0ABAB5]/40 p-0.5 overflow-hidden">
              <div
                className="size-full rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                }}
              />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <p className="text-[10px] font-black italic tracking-tight text-white leading-none">
                  DingJun Hong
                </p>
                <p className="text-[8px] text-[#0ABAB5] font-black uppercase tracking-widest mt-1">
                  Elite Leader
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Orchestration Space */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Global State Header - Dynamic breadcrumbs and telemetry */}
        <header className="px-10 py-6 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl bg-black/20 relative z-40">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] italic">
              <span>JunAiKey Ecosystem</span>
              <ChevronRight size={12} className="opacity-20" />
              <span className="text-[#0ABAB5]">
                Space: {spaces.find(s => s.id === activeSpace)?.label.split(' ')[0]}
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#0ABAB5] animate-pulse" />
                <span className="text-[9px] font-black text-[#0ABAB5] uppercase tracking-widest">
                  Global Sync: Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint size={12} className="text-white/20" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic font-mono">
                  0x7F2A...9B3D
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 transition-all active:scale-95 group">
              <Zap
                size={14}
                className="text-[#0ABAB5] group-hover:scale-125 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                系統加速 Turbo
              </span>
            </button>
            <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all cursor-pointer">
              <Settings size={18} />
            </div>
            <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500/40 hover:text-rose-500 transition-all cursor-pointer">
              <LogOut size={18} />
            </div>
          </div>
        </header>

        {/* Content Viewing Area */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpace}
              initial={{ opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.01, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, cubicBezier: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>

          {/* Global Overlay Elements */}
          <div className="fixed top-[-10%] left-[-10%] size-[800px] bg-[#0ABAB5]/5 rounded-full blur-[180px] pointer-events-none -z-10" />
          <div className="fixed bottom-[-10%] right-[-10%] size-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        </div>

        {/* Sticky Footer Telemetry */}
        <footer className="px-10 py-3 bg-[#050d0d] border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.5em] text-white/10 relative z-40">
          <span>© 2024 ESGss JunAiKey Beta • Multi-Space Orchestration System v1.4.2</span>
          <div className="flex items-center gap-12">
            <span className="flex items-center gap-2">
              <div className="size-1 rounded-full bg-emerald-400" /> System Uptime: 99.98%
            </span>
            <span className="flex items-center gap-2">
              <div className="size-1 rounded-full bg-[#0ABAB5]" /> Encryption: AES-256 GCM
            </span>
            <span className="flex items-center gap-2 text-[#0ABAB5]">
              AUTHORIZED FOR DINGJUN HONG ONLY
            </span>
          </div>
        </footer>
      </main>

      <style>{`
        .font-display { font-family: 'Space Grotesk', 'Inter', 'Noto Sans TC', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
