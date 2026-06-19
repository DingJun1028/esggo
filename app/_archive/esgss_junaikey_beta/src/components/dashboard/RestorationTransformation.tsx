import React from 'react';
import {
  Biotech,
  Strategy,
  TrendingUp,
  Visibility,
  Eco,
  Settings,
  LogOut,
  ChevronRight,
  Analytics,
} from '@mui/icons-material';
import {
  Globe,
  MapPin,
  Zap,
  Target,
  ShieldCheck,
  Activity,
  Cpu,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🌿 Restoration & Transformation Space (Service 2.3 & 2.4)
 * --------------------------------------------------
 * "Impact Restoration Lab & Sustainability Transformation Advisor"
 * Features: Topological Impact Map, Mile-marker Roadmap, Vital Ecosystem Stats.
 */
export const RestorationTransformation = () => {
  const milestones = [
    {
      title: '碳中和策略',
      status: '已完成',
      color: 'bg-[#0df2df]',
      desc: '建立組織碳足跡基準，制定 2030 淨零路徑圖，優化能源消耗結構。',
      progress: [1, 1, 1],
    },
    {
      title: '供應鏈優化',
      status: '進行中',
      color: 'bg-yellow-500',
      active: true,
      desc: '推動供應商綠色轉型，落實 ESG 採購標準，減少範圍三溫室氣體排放。',
      progress: [1, 0, 0],
    },
    {
      title: '循環經濟轉型',
      status: '待啟動',
      color: 'bg-slate-700',
      locked: true,
      desc: '重塑產品生命週期，導入再生材料，達成零廢棄生產目標。',
      progress: [0, 0, 0],
    },
  ];

  return (
    <div className="bg-[#051414] text-white min-h-screen font-display selection:bg-[#0df2df]/20 p-8 lg:p-12 overflow-y-auto no-scrollbar">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1240px] mx-auto mb-16"
      >
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter italic bg-gradient-to-r from-white via-white to-[#0df2df] bg-clip-text text-transparent uppercase">
          2.3 & 2.4 修復與轉型
        </h1>
        <div className="flex items-center gap-4 mt-6">
          <p className="text-[#9cbab7] text-xl font-light italic tracking-tight">
            Restoration & Transformation | 影響力修復實驗室 & 永續轉型顧問
          </p>
          <div className="h-px flex-1 bg-white/5 mx-6" />
          <div className="flex items-center gap-3 bg-[#0df2df]/10 px-6 py-2 rounded-full border border-[#0df2df]/20">
            <span className="size-2 rounded-full bg-[#0df2df] animate-pulse" />
            <span className="text-[10px] font-black text-[#0df2df] uppercase tracking-widest">
              System Sync: Live
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview Grid */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { label: '修復基地總數 Sites', val: '128', trend: '+12%', unit: '' },
          { label: '減碳總量 Carbon Offset', val: '4,250', trend: '+5.4%', unit: 't' },
          { label: '轉型進度 Progress', val: '85', trend: '+2.1%', unit: '%' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="backdrop-blur-3xl bg-white/[0.03] p-8 rounded-[2rem] border border-white/10 flex flex-col gap-4 shadow-2xl group hover:border-[#0df2df]/30 transition-all"
          >
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-black italic tracking-tighter">
                {stat.val}
                <span className="text-lg font-light ml-1 text-white/30">{stat.unit}</span>
              </p>
              <span className="text-emerald-400 text-xs font-black italic flex items-center gap-1">
                <TrendingUp fontSize="small" /> {stat.trend}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                className="h-full bg-[#0df2df] rounded-full shadow-[0_0_10px_#0df2df]"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Split Section */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Restoration Lab (Map Focus) */}
        <section className="flex flex-col gap-10">
          <div className="flex items-center gap-5 px-2">
            <div className="size-12 rounded-2xl bg-[#0df2df]/10 border border-[#0df2df]/30 flex items-center justify-center text-[#0df2df] shadow-inner">
              <Biotech fontSize="medium" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase italic">
              2.3 影響力修復實驗室 Lab
            </h2>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 group shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
          >
            {/* Abstract Topo Map Background */}
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-[20s] linear animate-slow-zoom"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzVijlx_1H9_bhC0VkfOEDvd34ge335PCXGBPhmFiwOGKajPyzfp_9VwBFeG9_sST_BoEMChjgmmm354WEWYwQlGVrJt1wwMYwWLgMH9GElIXEpOINHt5ivXVHKRqCXfpAUJ6eZp80t34tTfTQ00TguXBYYwxsiQD3I-TmkO5xpiUbGfGNQw0vygQZ9HW7unVeU8NCa4mtHWb7DA-1zHs8zmyhOSIblHOYEcaJIDYDeVDmY_cgLjYJK9uinCC2XSGBO9j6Uk-6MKo')",
              }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-1000" />
            </div>

            {/* Map Pulse Nodes */}
            <div className="absolute top-1/4 left-1/3 size-6 bg-[#0df2df] rounded-full animate-pulse shadow-[0_0_20px_#0df2df] border-4 border-black group-hover:scale-150 transition-transform cursor-pointer" />
            <div className="absolute top-2/3 left-1/2 size-4 bg-[#0df2df]/60 rounded-full animate-ping cursor-pointer" />
            <div className="absolute top-1/2 right-1/4 size-5 bg-[#0df2df] rounded-full shadow-[0_0_15px_#0df2df] border-2 border-black cursor-pointer" />

            {/* Overlay Dashboard Widget */}
            <div className="absolute bottom-8 left-8 right-8 backdrop-blur-3xl bg-black/60 border border-white/10 p-6 rounded-3xl flex justify-between items-center shadow-2xl">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-[#0df2df] uppercase tracking-[0.4em]">
                  Current Observation Zone
                </p>
                <p className="text-lg font-black italic text-white tracking-tight uppercase">
                  亞馬遜雨林 R-04 基地 Amazon-Rest-04
                </p>
              </div>
              <button className="bg-[#0df2df]/20 hover:bg-[#0df2df]/40 border border-[#0df2df]/50 text-[#0df2df] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 group/btn">
                <Visibility style={{ fontSize: '16px' }} />
                <span>查看實證 Evidence</span>
                <ArrowRight
                  size={14}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            {[
              { label: '生態多樣性指數 Biodiversity', val: '0.84', color: 'text-emerald-400' },
              { label: '土壤固碳率 Carbon Sequestration', val: '12.5%', color: 'text-amber-400' },
            ].map((metric, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 shadow-xl flex flex-col gap-2"
              >
                <h4 className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] italic">
                  {metric.label}
                </h4>
                <p className={`text-4xl font-black italic tracking-tighter ${metric.color}`}>
                  {metric.val}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Right: Transformation Advisor (Roadmap Focus) */}
        <section className="flex flex-col gap-10">
          <div className="flex items-center gap-5 px-2">
            <div className="size-12 rounded-2xl bg-[#0df2df]/10 border border-[#0df2df]/30 flex items-center justify-center text-[#0df2df] shadow-inner">
              <Strategy fontSize="medium" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase italic">
              2.4 永續轉型顧問 Advisor
            </h2>
          </div>

          <div className="relative flex flex-col gap-12 pl-20 py-6 min-h-[600px]">
            {/* Roadmap Central Spine */}
            <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-gradient-to-b from-[#0df2df] to-white/5 opacity-20 rounded-full" />

            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`relative group ${m.locked ? 'opacity-40 grayscale' : ''}`}
              >
                {/* Node Dot */}
                <div
                  className={`absolute -left-[53px] top-2 size-10 rounded-full border-[6px] border-[#051414] shadow-2xl z-10 flex items-center justify-center ${m.color} ${m.active ? 'animate-pulse ring-4 ring-[#0df2df]/20' : ''}`}
                >
                  {m.active && <Zap size={16} className="text-[#051414]" />}
                </div>

                <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] hover:border-[#0df2df]/40 transition-all cursor-pointer shadow-xl group-hover:scale-[1.02] duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black italic tracking-tighter text-[#0df2df] uppercase italic">
                      {m.title}
                    </h3>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${m.active ? 'bg-[#0df2df]/10 border-[#0df2df]/30 text-[#0df2df]' : 'bg-white/5 border-white/10 text-white/30'}`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm font-light italic leading-relaxed tracking-tight mb-8">
                    {m.desc}
                  </p>
                  <div className="flex gap-4">
                    {m.progress.map((p, j) => (
                      <div
                        key={j}
                        className={`h-2 flex-1 rounded-full transition-all duration-1000 ${p ? 'bg-[#0df2df] shadow-[0_0_8px_#0df2df]' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Terminal Action Area */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-12 p-10 rounded-[3rem] bg-gradient-to-br from-[#0df2df]/10 to-transparent border border-[#0df2df]/20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl text-center md:text-left"
            >
              <div className="space-y-2">
                <p className="text-2xl font-black italic text-white tracking-tighter leading-tight">
                  準備好開始您的轉型之旅了嗎？
                </p>
                <p className="text-[#9cbab7] text-sm font-light italic">
                  諮詢我們的專家，獲取客製化的永續解決方案 Consulting Services.
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-10 py-4 rounded-2xl border border-[#0df2df]/40 text-[#0df2df] font-black uppercase text-[11px] tracking-widest hover:bg-[#0df2df]/10 transition-all active:scale-95">
                  獲取報告 Report
                </button>
                <button className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-[#0df2df] text-[#051414] font-black uppercase text-[11px] tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all">
                  預約諮詢 Booking
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom { animation: slow-zoom 40s infinite linear; }
      `}</style>
    </div>
  );
};
