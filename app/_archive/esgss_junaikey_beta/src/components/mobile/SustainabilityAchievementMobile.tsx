import React, { useState } from 'react';
import {
  Verified,
  Settings,
  Bolt,
  // Eco, // Not exported from @mui/icons-material - use Leaf from lucide-react
  WaterDrop,
  Forest,
  Lock,
  HistoryEdu,
  Share,
  Home,
  MilitaryTech,
  Analytics,
  Person,
  Add,
} from '@mui/icons-material';
import {
  Trophy,
  Medal,
  Star,
  ShieldCheck,
  Zap,
  Clock,
  Award,
  Share2,
  ExternalLink,
  X,
  ChevronRight,
  ChevronDown,
  Leaf, // Replacement for MUI Eco icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🏆 Sustainability Achievement Mobile (Medal Gallery)
 * --------------------------------------------------
 * "Impact XP & Medal Gallery" for DingJun Hong.
 * Features: Liquid XP Bar, Refraction Medal Grid, Narrative Modal.
 */
export const SustainabilityAchievementMobile = () => {
  const [selectedMedal, setSelectedMedal] = useState<any>(null);

  const medals = [
    {
      id: 1,
      title: '減碳先鋒',
      label: 'ENVIRONMENT PROTECTOR',
      sub: 'Reduced 50kg CO2',
      icon: Leaf, // Fixed: Eco not exported from @mui/icons-material
      color: 'text-[#0df2df]',
      bg: 'from-[#0df2df]/20',
      glow: 'shadow-[0_0_8px_rgba(13,242,223,0.8)]',
      desc: '您在 2024 年第一季度積極參與了綠色出行挑戰。透過紀錄 50 次非碳排放通勤，您成功減少了 50kg 的碳排放，相當於為地球多種執了 3 棵成年樹木。',
    },
    {
      id: 2,
      title: '水資源衛士',
      label: 'WATER GUARDIAN',
      sub: 'Saved 200L Water',
      icon: WaterDrop,
      color: 'text-blue-400',
      bg: 'from-blue-500/20',
      glow: 'shadow-[0_0_8px_rgba(96,165,250,0.8)]',
      desc: '透過優化家庭與辦公設備的用水效率，您在過去一個月中節省了超過 200 公升的潔淨水資源。',
    },
    {
      id: 3,
      title: '森林守護者',
      label: 'FOREST GUARDIAN',
      sub: 'Planted 5 Trees',
      icon: Forest,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/20',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      desc: '您的永續投資專案成功回饋生態系統，資助並參與了全球再造林計畫，實際種植了 5 棵原生樹種。',
    },
    {
      id: 4,
      title: '循環精英',
      label: 'CIRCULAR EXPERT',
      sub: 'Locked',
      icon: Lock,
      locked: true,
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative pb-32 max-w-[480px] mx-auto border-x border-white/5 shadow-2xl overflow-x-hidden">
      {/* Background Refraction Accents */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -right-20 size-96 rounded-full bg-[#0df2df]/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 size-96 rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-30 backdrop-blur-3xl bg-black/40 px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#0df2df]/20 rounded-lg text-[#0df2df] shadow-lg">
            <Verified style={{ fontSize: '20px' }} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
            成就勳章 Awards
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors active:scale-90 shadow-xl">
          <Settings style={{ fontSize: '20px' }} className="text-white/60" />
        </button>
      </header>

      {/* Impact XP Section */}
      <section className="px-6 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 p-8 rounded-[2.5rem] backdrop-blur-3xl bg-[#0df2df]/5 border border-[#0df2df]/20 shadow-2xl relative overflow-hidden"
        >
          <div className="flex justify-between items-end relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] text-[#0df2df] font-black uppercase tracking-[0.4em]">
                Impact Level
              </p>
              <h3 className="text-5xl font-black italic tracking-tighter flex items-baseline gap-2">
                12{' '}
                <span className="text-sm font-black text-white/30 not-italic uppercase tracking-widest">
                  LVL
                </span>
              </h3>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[11px] font-black italic text-white uppercase tracking-tight">
                影響力經驗值 (Impact XP)
              </p>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">
                3,450 / 4,000
              </p>
            </div>
          </div>

          <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner p-[2px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '86%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0df2df] via-[#a5fff8] to-[#0df2df] shadow-[0_0_15px_rgba(13,242,223,0.5)] animate-shimmer" />
            </motion.div>
          </div>

          <div className="flex items-center gap-3 text-[#0df2df]/80 text-[10px] font-black uppercase tracking-widest italic relative z-10">
            <Bolt style={{ fontSize: '14px' }} className="animate-pulse" />
            <span>距離下一等級還差 550 XP Accelerator</span>
          </div>

          {/* Abstract Pulse Decoration */}
          <div className="absolute -bottom-10 -right-10 size-40 bg-[#0df2df]/10 blur-[50px] rounded-full animate-pulse" />
        </motion.div>
      </section>

      {/* Tabs Navigation */}
      <nav className="px-6 mb-8 mt-4">
        <div className="flex border-b border-white/10 gap-8 overflow-x-auto no-scrollbar pb-1">
          {['環境守護', '社會共融', '經濟共榮'].map((tab, i) => (
            <button
              key={i}
              className={`flex-none pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${i === 0 ? 'border-b-2 border-[#0df2df] text-[#0df2df] scale-105' : 'text-white/20 hover:text-white/60'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Medal Gallery Grid */}
      <main className="px-6 flex flex-col gap-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase italic">
            勳章畫廊 Gallery
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic leading-none">
            點擊查看 3D 液態玻璃勳章詳情 Narrative
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 pb-20">
          {medals.map(medal => (
            <motion.div
              key={medal.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !medal.locked && setSelectedMedal(medal)}
              className={`backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2rem] p-4 flex flex-col transition-all duration-300 shadow-xl group ${medal.locked ? 'opacity-40 grayscale' : 'hover:border-[#0df2df]/40'}`}
            >
              <div
                className={`aspect-square rounded-2xl bg-gradient-to-br ${medal.bg || 'from-white/5'} to-transparent flex items-center justify-center relative overflow-hidden shadow-inner`}
              >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0df2df]/40 via-transparent to-transparent group-hover:scale-125 transition-transform duration-700" />
                <div
                  className={`size-24 rounded-full flex items-center justify-center backdrop-blur-3xl border border-white/30 transition-all duration-500 relative z-10 ${medal.locked ? 'bg-black/20' : 'bg-white/10 shadow-2xl group-hover:scale-110'}`}
                >
                  <medal.icon
                    style={{ fontSize: '48px' }}
                    className={`${medal.color || 'text-white/20'} ${medal.glow || ''} transition-all`}
                  />
                </div>
                {/* Simulated Glass Refraction Image Overlay */}
                {!medal.locked && (
                  <img
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 pointer-events-none transition-transform duration-1000 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD__p31pcpt92bMkVB9B3GsVQ1I6Og_be5geL4UnmHZ-fI-lzJnzFD3_mLLIZl26QVZ1r-80Ywy8ODzpoDkaYAMCVJS7vrXo8fJrn1yydGJQgn-1DlufdeBp6k8KK6T7jTXW32oh2KkJOwV2-rx_QzL7jXpgdGi171FVaqU_FUpojc6ymT7YEGs6_ETZNUcfjWfCWWV1lCNBp3tqMTUkhmYg-HoX3gGXRCrZ1Oa1XGlZlrwbEwXM003boeNHUbcmhpbYA5xbEv7ydk"
                    alt="glass-refraction"
                  />
                )}
              </div>
              <div className="p-4 space-y-1">
                <h4
                  className={`font-black text-sm italic tracking-tight uppercase ${medal.color || 'text-white/30'}`}
                >
                  {medal.title}
                </h4>
                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                  {medal.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Quick Action Medal Detail Modal (Slide Up) */}
      <AnimatePresence>
        {selectedMedal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedal(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[60] backdrop-blur-3xl bg-[#0a0a0a]/95 rounded-t-[3.5rem] p-10 border-t border-white/20 shadow-[0_-20px_100px_rgba(0,0,0,0.8)] pointer-events-auto"
            >
              <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />

              <div className="flex flex-col items-center text-center gap-8">
                <div
                  className={`size-40 rounded-full bg-[#0df2df]/10 flex items-center justify-center border-4 border-[#0df2df]/40 shadow-[0_0_50px_rgba(13,242,223,0.3)] ring-1 ring-[#0df2df]/20 transition-all`}
                >
                  <selectedMedal.icon
                    style={{ fontSize: '80px' }}
                    className={`${selectedMedal.color} drop-shadow-[0_0_20px_rgba(13,242,223,0.8)]`}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                    {selectedMedal.title}
                  </h3>
                  <p className="text-[#0df2df] text-[11px] font-black tracking-[0.3em] uppercase opacity-80">
                    {selectedMedal.label}
                  </p>
                </div>

                <div className="w-full p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 text-left space-y-4 shadow-inner">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-3">
                    <HistoryEdu style={{ fontSize: '14px' }} className="text-[#0df2df]" />
                    Service Impact Narrative
                  </h4>
                  <p className="text-sm leading-relaxed text-white/80 font-light italic tracking-tight text-justify indent-6">
                    {selectedMedal.desc}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-4 pt-4">
                  <button className="w-full py-5 rounded-[1.5rem] bg-[#0df2df] text-[#0a0a0a] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(13,242,223,0.3)] active:scale-95 transition-all">
                    <Share style={{ fontSize: '18px' }} /> 分享成就 Share Impact
                  </button>
                  <button
                    onClick={() => setSelectedMedal(null)}
                    className="w-full py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-white/40 font-black text-[11px] uppercase tracking-widest hover:text-white transition-all active:scale-90"
                  >
                    關閉詳情 Exit Details
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-24 backdrop-blur-3xl bg-black/60 border-t border-white/10 px-8 flex justify-between items-center z-40 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {[
          { icon: Home, label: '首頁' },
          { icon: MilitaryTech, label: '勳章', active: true },
          { center: true },
          { icon: Analytics, label: '數據' },
          { icon: Person, label: '我的' },
        ].map((item, i) =>
          item.center ? (
            <div key={i} className="relative -top-10">
              <button className="size-16 rounded-full bg-[#0df2df] shadow-[0_0_25px_rgba(13,242,223,0.6)] flex items-center justify-center text-[#0a0a0a] border-4 border-[#0a0a0a] active:scale-90 transition-all">
                <Add style={{ fontSize: '32px' }} className="font-black" />
              </button>
            </div>
          ) : (
            <button
              key={i}
              className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-[#0df2df] scale-110' : 'text-white/20 hover:text-white'}`}
            >
              <item.icon
                style={{ fontSize: '24px' }}
                className={item.active ? 'drop-shadow-[0_0_8px_rgba(13,242,223,0.5)]' : ''}
              />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {item.label}
              </span>
            </button>
          )
        )}
      </nav>

      <style>{`
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-wave-slow { animation: wave 10s infinite linear; }
        @keyframes wave { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
