import React, { useState } from 'react';
import {
  Home,
  Hub as HubIcon,
  MilitaryTech,
  Analytics,
  Person,
  QrCodeScanner,
  Notifications,
  Settings,
  ArrowForwardIos,
  Add,
} from '@mui/icons-material';
import {
  LayoutDashboard,
  Trophy,
  ShieldCheck,
  Newspaper,
  Fingerprint,
  Zap,
  Sparkles,
  Command,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Mobile Components
import { PersonalEsgMobile } from './PersonalEsgMobile';
import { SustainabilityAchievementMobile } from './SustainabilityAchievementMobile';
import { IntegrityPassportMobile } from './IntegrityPassportMobile';
import { DailyIntelligenceMobile } from './DailyIntelligenceMobile';

/**
 * 📱 Mobile Ecosystem Hub (Master Mobile Orchestrator)
 * --------------------------------------------------
 * The unified mobile entrance for all JunAiKey ESG services.
 * Features: Dynamic Bottom Nav, Gesture Transitions, Premium System Sync.
 */
export const MobileEcosystemHub = () => {
  const [activeSpace, setActiveSpace] = useState('home');

  const spaces = [
    { id: 'home', label: '首頁 Score', icon: Home, component: PersonalEsgMobile },
    { id: 'intelligence', label: '智能 Intel', icon: HubIcon, component: DailyIntelligenceMobile },
    { id: 'passport', label: '護照 Pass', icon: Fingerprint, component: IntegrityPassportMobile },
    {
      id: 'achievement',
      label: '勳章 Medals',
      icon: MilitaryTech,
      component: SustainabilityAchievementMobile,
    },
    {
      id: 'settings',
      label: '個人 Profile',
      icon: Person,
      component: () => (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8 bg-[#0a0a0a] min-h-screen">
          <div className="size-32 rounded-full border-4 border-[#0df2df]/30 p-2 shadow-2xl ring-4 ring-[#0df2df]/5">
            <div
              className="size-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
              }}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">
              DingJun Hong
            </h3>
            <p className="text-[#0df2df] text-xs font-black uppercase tracking-[0.3em] italic">
              System Administrator
            </p>
          </div>
          <div className="w-full space-y-4">
            {['帳戶分析', '隱私權與安全', '數據同步點', '退出系統'].map((item, i) => (
              <button
                key={i}
                className={`w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest flex items-center justify-between px-8 ${i === 3 ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : ''}`}
              >
                {item} <ArrowForwardIos style={{ fontSize: '14px' }} className="opacity-40" />
              </button>
            ))}
          </div>
          <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.5em] mt-10 italic">
            JunAiKey Mobile v1.4.2
          </p>
        </div>
      ),
    },
  ];

  const ActiveComponent = spaces.find(s => s.id === activeSpace)?.component || PersonalEsgMobile;

  return (
    <div className="bg-[#0a0a0a] text-white h-screen flex flex-col overflow-hidden font-display selection:bg-[#0df2df]/20 relative">
      {/* Global Persistence Overlay (Subtle) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#0df2df10,transparent_50%),radial-gradient(circle_at_bottom_left,#000,transparent_50%)]" />

      {/* Main Orchestration Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSpace}
            initial={{ opacity: 0, x: activeSpace === 'home' ? -20 : 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: activeSpace === 'home' ? 20 : -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="min-h-full"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Unified Mobile Master Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-black/80 border-t border-white/5 flex items-center justify-around px-4 z-[100] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        {spaces.map((space, i) =>
          space.id === 'passport' ? (
            <div key={i} className="relative -top-10">
              <button
                onClick={() => setActiveSpace('passport')}
                className={`size-16 rounded-full shadow-[0_10px_30px_rgba(13,179,174,0.4)] flex items-center justify-center border-4 border-[#0a0a0a] active:scale-90 transition-all hover:scale-110 ${activeSpace === 'passport' ? 'bg-[#0df2df] text-[#0a0a0a]' : 'bg-white/5 text-white/40'}`}
              >
                <QrCodeScanner style={{ fontSize: '32px' }} className="font-bold" />
              </button>
            </div>
          ) : (
            <button
              key={i}
              onClick={() => setActiveSpace(space.id)}
              className={`flex flex-col items-center gap-1.5 transition-all ${activeSpace === space.id ? 'text-[#0df2df] scale-110 active:scale-95' : 'text-white/20 hover:text-white'}`}
            >
              <space.icon
                style={{ fontSize: '24px' }}
                className={
                  activeSpace === space.id ? 'drop-shadow-[0_0_8px_rgba(13,242,223,0.5)]' : ''
                }
              />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {space.label.split(' ')[0]}
              </span>
            </button>
          )
        )}
      </nav>

      {/* System Telemetry Sync Label */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-none opacity-40">
        <div className="size-1 rounded-full bg-[#0df2df] animate-pulse" />
        <span className="text-[8px] font-mono text-[#0df2df] tracking-widest uppercase font-black italic">
          SECURE SYNC: STABLE 100%
        </span>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
