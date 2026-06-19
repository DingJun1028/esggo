import React, { useState } from 'react';
import {
  Dashboard,
  AccountBalance,
  Description,
  Analytics,
  AutoAwesome,
  Notifications,
  LocationOn,
  Close,
  Favorite,
  Lightbulb,
  Info,
  ChevronRight,
} from '@mui/icons-material';
import {
  BarChart3,
  Zap,
  Target,
  ShieldCheck,
  Activity,
  Activity as ActivityIcon,
  Globe,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Leaf,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 💰 Financing & Reporting Space (Service 2.5 & 3.0)
 * --------------------------------------------------
 * "Green Financing Matcher & ESG Reporting Monitor"
 * Features: Swipable Project Cards, Ring-based Reporting Progress, AI Report Helper.
 */

const ANIMATION_STAGGER_DELAY = 0.3;

export const FinancingReporting = () => {
  const [activeTab, setActiveTab] = useState('match');

  const reportMetrics = [
    {
      label: '環境 (Environmental)',
      val: 75,
      status: '快報優化中',
      desc: '溫室氣體核算、水資源管理數據已導入',
      offset: 53.4,
    },
    {
      label: '社會 (Social)',
      val: 50,
      status: '待補充數據',
      desc: '員工多元化、供應鏈管理報告撰寫中',
      offset: 106.8,
    },
    {
      label: '治理 (Governance)',
      val: 90,
      status: '即將完成',
      desc: '董事會組成、商業道德規範已審核',
      offset: 21.3,
    },
  ];

  return (
    <div className="bg-[#0a1414] text-white min-h-screen font-display selection:bg-[#0df2df]/20 p-8 lg:p-12 overflow-y-auto no-scrollbar">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-3xl bg-[#0a1414]/80 border-b border-white/5 py-6 mb-12">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="size-10 text-[#0df2df] drop-shadow-[0_0_10px_#0df2df]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                綠色融資與報告平台 Platform
              </h1>
              <p className="text-[10px] text-[#0df2df] uppercase tracking-[0.4em] font-black mt-2">
                ESGss JunAiKey 2.5 & 3.0 Suite
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {['項目媒合', '報告監控', '融資概況', '顧問中心'].map((tab, i) => (
              <button
                key={i}
                className={`text-[11px] font-black uppercase tracking-widest transition-all pb-2 border-b-2 ${i === 0 ? 'border-[#0df2df] text-[#0df2df]' : 'border-transparent text-white/30 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-[#0df2df]/20 transition-all text-white/60 hover:text-[#0df2df]">
              <Notifications />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <button className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0df2df]/40 transition-all group">
              <div className="size-8 rounded-full bg-gradient-to-tr from-[#0df2df] to-blue-500 flex items-center justify-center text-[10px] font-black text-[#0a1414]">
                JD
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-[#0df2df]">
                鼎鈞國際 JD Intl.
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar (Left) */}
        <aside className="lg:col-span-2 space-y-8">
          <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-5 rounded-[2rem] flex flex-col gap-3 shadow-2xl">
            {[
              { icon: Dashboard, label: '工作控制台 Desk', active: true },
              { icon: AccountBalance, label: '融資助手 2.5 Finance' },
              { icon: Description, label: '報告平台 3.0 Report' },
              { icon: Analytics, label: '數據分析器 Analytics' },
            ].map((item, i) => (
              <button
                key={i}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${item.active ? 'bg-[#0df2df] text-[#0a1414] shadow-xl scale-105 font-black' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon style={{ fontSize: '20px' }} />
                <span className="text-[10px] uppercase tracking-widest">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          <div className="backdrop-blur-3xl bg-gradient-to-br from-[#0df2df]/10 to-transparent border border-[#0df2df]/20 p-8 rounded-[2rem] space-y-4 shadow-3xl">
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-[#0df2df]">
              當前融資額度 Credit
            </h3>
            <div className="space-y-1">
              <p className="text-3xl font-black italic tracking-tighter">NT$ 45.0M</p>
              <p className="text-[10px] text-emerald-400 font-black italic uppercase flex items-center gap-2">
                <TrendingUp size={14} /> 較上月提升 12% Uptrend
              </p>
            </div>
          </div>
        </aside>

        {/* Center: Swipable Hub */}
        <section className="lg:col-span-6 flex flex-col gap-10">
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div className="flex gap-10">
              <button className="text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-[#0df2df] text-[#0df2df] pb-4 transition-all">
                融資項目媒合 (2.5)
              </button>
              <button className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 pb-4 hover:text-white transition-all">
                推薦投資機構 Partners
              </button>
            </div>
            <button className="bg-[#0df2df] text-[#0a1414] px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all">
              <AutoAwesome style={{ fontSize: '18px' }} /> AI 協作撰寫助手
            </button>
          </div>

          <div className="relative h-[550px] w-full flex items-center justify-center">
            <div className="absolute w-[80%] h-[80%] bg-[#1a2e2c]/50 rounded-[3.5rem] border border-white/5 translate-y-16 scale-90 opacity-20" />
            <div className="absolute w-[90%] h-[90%] bg-[#1a2e2c]/80 rounded-[3.5rem] border border-white/10 translate-y-8 scale-95 opacity-50" />

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative w-full h-full bg-[#1a2e2c] border-2 border-[#0df2df]/30 rounded-[3.5rem] p-12 flex flex-col justify-between overflow-hidden shadow-3xl group"
            >
              <div className="absolute -top-10 -right-10 opacity-5 size-60 text-[#0df2df]">
                <Leaf size={240} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-3">
                  <span className="px-5 py-2 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/30 text-[#0df2df] text-[10px] font-black uppercase tracking-widest">
                    綠色建築轉型項目 Building
                  </span>
                  <h3 className="text-4xl font-black italic tracking-tighter text-white uppercase italic mt-2">
                    台北智慧物流中心節能升級 Taipei Hub
                  </h3>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">
                    融資需求 Funding
                  </p>
                  <p className="text-3xl font-black italic text-[#0df2df] tracking-tighter mt-1">
                    NT$ 12,500,000
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 shadow-inner">
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-3 italic">
                    預期碳減排量 Offset
                  </p>
                  <p className="text-3xl font-black italic">
                    450{' '}
                    <span className="text-sm font-light text-white/20 not-italic">tCO2e/年</span>
                  </p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 shadow-inner">
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-3 italic">
                    預估回收期 Payback
                  </p>
                  <p className="text-3xl font-black italic">
                    4.2{' '}
                    <span className="text-sm font-light text-white/20 not-italic">年 Years</span>
                  </p>
                </div>
                <div className="col-span-2 p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 shadow-inner flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">
                      地理位置 Location
                    </p>
                    <p className="text-xl font-black italic text-white flex items-center gap-3">
                      <LocationOn className="text-[#0df2df]" /> 台北市 內湖區 Taipei Neihu
                    </p>
                  </div>
                  <ArrowRight
                    className="text-[#0df2df] opacity-40 group-hover:translate-x-3 transition-all duration-500"
                    size={32}
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-4 relative z-10">
                <button className="flex-1 py-6 rounded-[1.5rem] bg-white/5 border border-white/10 font-black text-[12px] uppercase tracking-widest hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all flex items-center justify-center gap-4 active:scale-95 group/skip">
                  <Close /> 忽略 Skip
                </button>
                <button className="flex-1 py-6 rounded-[1.5rem] bg-[#0df2df] text-[#0a1414] font-black text-[12px] uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_15px_30px_rgba(13,242,223,0.3)] flex items-center justify-center gap-4 active:scale-95 group/match">
                  <Favorite /> 立即媒合 Match Now
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ESG Monitor (Right) */}
        <section className="lg:col-span-4 flex flex-col gap-10">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase italic">
              ESG 報告監控 Report 3.0
            </h3>
            <div className="px-5 py-2 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-widest uppercase italic">
              2024 年度 Fiscal
            </div>
          </div>

          <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] space-y-12 shadow-3xl">
            <div className="space-y-8">
              {reportMetrics.map((metric, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-10 group cursor-pointer"
                >
                  <div className="relative size-24 shrink-0 flex items-center justify-center">
                    <svg className="size-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                      />
                      <motion.circle
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: metric.offset }}
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#0df2df"
                        strokeWidth="6"
                        strokeDasharray="251.2"
                        className="drop-shadow-[0_0_8px_#0df2df]"
                        transition={{ duration: 2, ease: 'easeOut', delay: i * ANIMATION_STAGGER_DELAY }}
                      />
                    </svg>
                    <span className="absolute text-sm font-black italic">{metric.val}%</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-black italic uppercase tracking-tight text-white">
                        {metric.label}
                      </h4>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest ${i === 2 ? 'text-emerald-400' : 'text-[#0df2df]'}`}
                      >
                        {metric.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 font-light italic leading-relaxed tracking-tight">
                      {metric.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/5 space-y-6">
              <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-6">
                AI 即時修改建議 AI Insights
              </h4>
              <div className="space-y-4">
                <div className="bg-[#0df2df]/5 border border-[#0df2df]/20 p-6 rounded-3xl flex gap-5 group hover:bg-[#0df2df]/10 transition-all">
                  <Lightbulb className="text-[#0df2df] size-6 shrink-0 group-hover:scale-125 transition-transform" />
                  <p className="text-[11px] leading-relaxed font-light italic text-[#0df2df] text-justify tracking-tight">
                    建議在「環境」篇幅中增加與同產業標竿企業的減碳對比圖表，以增強投資人信心與報告公信力。
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl flex gap-5 transition-all">
                  <Info className="text-white/20 size-6 shrink-0" />
                  <p className="text-[11px] leading-relaxed font-light italic text-white/30 text-justify tracking-tight">
                    目前「社會」類別數據與 SASB 標準尚有 15%
                    偏差，需調整描述語句以符合國際披露準則。
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Heat Map Widget */}
            <div className="rounded-[2.5rem] bg-black/60 border border-white/5 h-48 relative overflow-hidden group shadow-inner mt-8">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLcq58iWNWjacz6HPyvkJgr3DHQRmHJx8TJfgp8ZhWz_Mhz7RIVtu7yN7GxKMtjwwoe4OfXkrWaHYiO4fzh2LHJkhQBdcycKGvNGOswOljBy1kZsIiPS09ef5YcgKQGr6CA7xjNh9H3uJJCMZCKrme-EfO6XgJe3kD4PPj9i83P2m-2fAwo8cHb0VhKDRkwJmdO6XWJ5hOwLOBzXakZr4uLzdRSO7vetYp6o9g0WHH449i0UXfKIa-9R-Phf_oF9tH3Jdgx0HYucs"
                className="size-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-3000 group-hover:scale-125"
                alt="map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1414] to-transparent" />
              <div className="absolute bottom-6 left-8 space-y-1">
                <p className="text-[#0df2df] text-[9px] font-black uppercase tracking-[0.4em]">
                  融資熱點 Hotspots
                </p>
                <p className="text-sm font-black italic text-white/60 tracking-tight uppercase">
                  亞太區 - 綠色能源項目分布 Asia Green Energy
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
