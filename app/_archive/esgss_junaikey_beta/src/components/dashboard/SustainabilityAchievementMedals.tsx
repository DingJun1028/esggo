import React from 'react';
import {
  Diamond,
  Search,
  WorkspacePremium,
  Stars,
  MilitaryTech,
  Update,
  Co2,
  Security,
  VolunteerActivism,
  NaturePeople,
  Lock,
  Verified,
} from '@mui/icons-material';
import {
  Trophy,
  Medal,
  Star,
  ShieldCheck,
  Search as SearchIcon,
  Clock,
  ChevronRight,
  Zap,
  Target,
  Lock as LockIcon,
  Waves,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🏆 Sustainability Achievement Medals (Service 1.2 Variant)
 * --------------------------------------------------
 * "Achievement Gallery & Impact Narratives" for DingJun Hong.
 * Features: XP Sphere (Fluid Animation), Medal Refraction FX, Leveling System.
 */
export const SustainabilityAchievementMedals = () => {
  const medals = [
    {
      title: '碳中和領航者',
      label: 'Carbon Neutral Master',
      icon: Co2,
      desc: '表彰在組織內部成功推動達成年度碳中和轉型計畫。透過導入 AI 數據追蹤，顯著優化生產能效，為永續發展樹立示範標竿。',
      date: '2023.08.15',
      unlocked: true,
    },
    {
      title: '5T 數據守護者',
      label: '5T Transparency Guardian',
      icon: Security,
      desc: '維護生態系統的五大透明度指標 (5T)，確保永續報告書之真實性。建立去中心化稽核機制，降低數據失真風險。',
      date: '2023.05.20',
      unlocked: true,
    },
    {
      title: '共榮社區療癒者',
      label: 'Community Healer',
      icon: VolunteerActivism,
      desc: '深耕在地社區發展與弱勢關懷，成功建立具備高度韌性的支援網路。透過教育培訓計畫，提升社區數位永續競爭力。',
      date: '2023.03.12',
      unlocked: true,
    },
    {
      title: '綠色足跡領袖',
      label: 'Green Footprint Leader',
      icon: NaturePeople,
      desc: '全面引導團隊導入日常減塑與精準節能措施。顯著降低單人辦公碳足跡達 40%，推動綠色辦公文化內化於企業基因中。',
      date: '2022.11.30',
      unlocked: true,
    },
    {
      title: '循環經濟推手',
      label: 'Circular Expert',
      icon: Lock,
      locked: true,
    },
  ];

  return (
    <div className="bg-[#0a1617] text-slate-100 min-h-screen font-display selection:bg-[#0de7f2]/30 overflow-x-hidden">
      {/* Background Refraction FX */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[5%] size-[600px] bg-[#0de7f2]/5 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] -right-[10%] size-[500px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] size-[700px] bg-[#0de7f2]/10 rounded-full blur-[180px]" />
      </div>

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#0de7f2]/10 bg-[#0a1617]/80 backdrop-blur-xl px-10 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 text-[#0de7f2] group cursor-pointer">
              <div className="size-10 transition-transform duration-700 group-hover:rotate-180">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
                JunAiKey{' '}
                <span className="text-white/40 not-italic font-black text-xs uppercase tracking-widest ml-1">
                  ESGss
                </span>
              </h2>
            </div>
            <nav className="hidden lg:flex items-center gap-10">
              {['成就勳章', '永續足跡', '影響力共榮'].map((link, i) => (
                <a
                  key={i}
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 ${i === 0 ? 'text-[#0de7f2] border-b-2 border-[#0de7f2] pb-1' : 'text-white/40 hover:text-white'}`}
                  href="#"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-6 py-2 gap-4 focus-within:border-[#0de7f2]/50 transition-all shadow-inner">
              <SearchIcon className="text-[#0de7f2]/60 size-4" />
              <input
                className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-white/20 w-48 font-black uppercase tracking-widest"
                placeholder="搜尋成就 Search..."
              />
            </div>
            <div className="relative group">
              <div className="size-11 rounded-full border-2 border-[#0de7f2] p-1 bg-white/5 ring-4 ring-[#0de7f2]/10 transition-all group-hover:ring-[#0de7f2]/20 cursor-pointer">
                <div
                  className="size-full rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-10 py-12 space-y-20">
        {/* User Profile Summary Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-3xl bg-gradient-to-br from-[#0de7f2]/10 to-transparent border border-[#0de7f2]/30 rounded-[3.5rem] p-16 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group shadow-3xl"
        >
          <div className="absolute top-0 right-0 size-96 bg-[#0de7f2]/5 blur-[120px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0de7f2]/40 blur-[80px] rounded-full scale-125" />
              <div className="relative size-44 rounded-full border-[8px] border-[#0de7f2]/20 p-2 bg-[#0a1617] ring-1 ring-[#0de7f2]/30">
                <div
                  className="size-full rounded-full bg-cover bg-center shadow-inner"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                  }}
                />
              </div>
              <div className="absolute -bottom-2 right-0 bg-gradient-to-br from-[#0de7f2] to-[#089199] text-[#0a1617] text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl border border-white/20 uppercase tracking-widest">
                ELITE LEVEL
              </div>
            </div>

            <div className="text-center md:text-left space-y-8">
              <div className="space-y-2">
                <h1 className="text-6xl font-black tracking-tighter text-white italic">丁俊宏</h1>
                <p className="text-2xl font-light text-[#0de7f2]/60 italic tracking-tight">
                  DingJun Hong{' '}
                  <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest ml-4">
                    Authorized Leader
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="flex flex-col gap-2">
                  <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                    專家頭銜 Title
                  </span>
                  <span className="text-white font-black italic flex items-center gap-3">
                    <WorkspacePremium className="text-[#0de7f2] size-4" /> 碳中和領航者
                  </span>
                </div>
                <div className="flex flex-col gap-2 border-l border-white/10 pl-10">
                  <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                    成就積分 XP
                  </span>
                  <span className="text-white font-black italic flex items-center gap-3">
                    <Stars className="text-[#0de7f2] size-4" /> 12,500 P
                  </span>
                </div>
                <div className="flex flex-col gap-2 border-l border-white/10 pl-10">
                  <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                    永續獎章 Medals
                  </span>
                  <span className="text-white font-black italic flex items-center gap-3">
                    <MilitaryTech className="text-[#0de7f2] size-4" /> 12 枚勳章
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl group/xp">
            <div className="text-right space-y-2">
              <div className="text-4xl font-black italic text-[#0de7f2] tracking-tighter leading-none">
                Level 42
              </div>
              <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                距下一等級還需 450 XP
              </div>
            </div>
            <div className="relative size-28 rounded-full bg-gradient-to-b from-[#0de7f2] to-[#054f53] overflow-hidden border-4 border-white/30 shadow-[0_0_50px_rgba(13,231,242,0.5)] group-hover/xp:scale-105 transition-transform">
              <div className="absolute top-1/3 -left-1/2 size-[200%] bg-white/20 rounded-[42%] animate-wave-slow pointer-events-none" />
              <div className="absolute top-[40%] -left-1/2 size-[200%] bg-white/10 rounded-[38%] animate-wave-fast pointer-events-none shadow-inner" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-black italic drop-shadow-xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  75%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievement Gallery Header */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[#0de7f2]">
                <Diamond fontSize="small" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Achievement Gallery
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                個人永續成就勳章畫廊
              </h2>
            </div>
            <div className="flex items-center gap-4 bg-white/[0.03] px-8 py-4 rounded-2xl border border-white/5 shadow-inner">
              <Update className="text-white/30 size-4" />
              <span className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none italic">
                最後系統走查：2023年10月24日
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-white/5 gap-12 overflow-x-auto no-scrollbar pb-1">
            {[
              { label: '全部解鎖 (12)', active: true },
              { label: '環境保護 (5)' },
              { label: '社會責任 (4)' },
              { label: '公司治理 (3)' },
            ].map((tab, i) => (
              <button
                key={i}
                className={`pb-6 px-2 text-[11px] font-black uppercase tracking-[.2em] transition-all whitespace-nowrap ${tab.active ? 'text-[#0de7f2] border-b-2 border-[#0de7f2] scale-105' : 'text-white/20 hover:text-white/60'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Medals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12">
            {medals.map((medal, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -15 }}
                className={`group relative backdrop-blur-3xl bg-white/[0.03] border border-[#0de7f2]/25 rounded-[3rem] p-12 flex flex-col items-center transition-all duration-700 shadow-3xl ${medal.locked ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-[#0de7f2]/5'}`}
              >
                {/* Medal Visualizer */}
                <div className="relative size-56 mb-12 flex items-center justify-center">
                  {!medal.locked && (
                    <>
                      <div className="absolute inset-0 rounded-full border border-[#0de7f2]/10 animate-[spin_20s_linear_infinite]" />
                      <div className="absolute inset-6 rounded-full border-2 border-dashed border-[#0de7f2]/20 animate-[spin_30s_linear_infinite_reverse]" />
                    </>
                  )}
                  <div
                    className={`size-36 rounded-full flex items-center justify-center backdrop-blur-3xl relative overflow-hidden z-10 ${medal.locked ? 'border-2 border-dashed border-white/20' : 'bg-[#0de7f2]/15 border-2 border-white/40 shadow-[inset_0_0_30px_rgba(255,255,255,0.3),inset_-5px_-5px_15px_rgba(13,231,242,0.4),0_20px_40px_rgba(0,0,0,0.5)] ring-1 ring-[#0de7f2]/30'}`}
                  >
                    {medal.locked ? (
                      <LockIcon size={48} className="text-white/20" />
                    ) : (
                      <medal.icon
                        style={{ fontSize: '64px' }}
                        className="text-white font-light drop-shadow-[0_5px_15px_rgba(13,231,242,0.8)]"
                      />
                    )}
                    {/* Refraction Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <h3
                    className={`text-2xl font-black italic tracking-tighter uppercase transition-colors ${medal.locked ? 'text-white/20' : 'text-white group-hover:text-[#0de7f2]'}`}
                  >
                    {medal.title}
                  </h3>
                  <p
                    className={`text-[10px] font-black uppercase tracking-[.3em] ${medal.locked ? 'text-white/10' : 'text-white/20 group-hover:text-[#0de7f2]/40'}`}
                  >
                    {medal.label}
                  </p>
                </div>

                {/* Hover Impact Narrative Card */}
                {!medal.locked && (
                  <AnimatePresence>
                    <motion.div className="absolute inset-x-6 -bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-6 transition-all duration-500 z-30 pointer-events-none group-hover:pointer-events-auto">
                      <div className="backdrop-blur-3xl bg-[#0a1617]/95 border-2 border-[#0de7f2]/40 rounded-[2rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-[#0de7f2]/30" />
                          <span className="text-[#0de7f2] text-[9px] font-black tracking-[0.4em] uppercase whitespace-nowrap">
                            服務影響力敘事 Narrative
                          </span>
                          <div className="h-px flex-1 bg-[#0de7f2]/30" />
                        </div>
                        <h4 className="text-white text-base font-black italic text-center uppercase tracking-tight">
                          {medal.title} · 核心成就
                        </h4>
                        <p className="text-white/60 text-xs font-light italic leading-relaxed text-justify indent-6 tracking-tight">
                          {medal.desc}
                        </p>
                        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <span className="text-[#0de7f2] italic">解鎖日期 Unlocked</span>
                          <span className="text-white/20">{medal.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-40 px-10 py-20 border-t border-white/5 bg-black/20 text-center space-y-10">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-4 text-[#0de7f2]/60">
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
              <span className="text-xl font-black italic tracking-tighter uppercase">
                JunAiKey Ecosystem Assets
              </span>
            </div>
            <p className="text-white/20 text-[10px] font-medium uppercase tracking-[0.3em] font-mono">
              © 2024 ESGss 全系統 UI/UX 走查優化版 • 數位資產受加密協議保護 SECURE PROTECTED
            </p>
          </div>

          <div className="flex items-center gap-12">
            {['數據隱私', '系統合規'].map((link, i) => (
              <a
                key={i}
                className="text-white/30 hover:text-[#0de7f2] transition-colors text-[10px] font-black uppercase tracking-widest"
                href="#"
              >
                {link}
              </a>
            ))}
            <div className="flex items-center gap-4 bg-[#0de7f2]/10 px-6 py-2 rounded-full border border-[#0de7f2]/20 shadow-xl">
              <span className="size-2 rounded-full bg-[#0de7f2] animate-pulse" />
              <span className="text-[#0de7f2] text-[10px] font-black uppercase tracking-widest leading-none">
                Node Connected
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .animate-wave-slow {
          animation: wave 10s infinite linear;
        }
        .animate-wave-fast {
          animation: wave 7s infinite linear reverse;
        }
        @keyframes wave {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
