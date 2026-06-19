import React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Gavel,
  Co2,
  GridView,
  PlayCircle,
  Assignment,
  ChevronRight,
  CalendarToday,
  FileDownload,
  Search,
  Dashboard,
  ModelTraining,
  Warning,
  Database,
  Settings,
  EmergencyHome,
  Eco,
  Factory,
  GroupWork,
  Analytics,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🏛️ Board Decision Dashboard (Service 3.5)
 * --------------------------------------------------
 * "Executive Strategy & ESG Governance" for DingJun Hong.
 * Features: Risk Matrix, Scenario Simulation, Strategic Log.
 */
export const BoardDecisionDashboard = () => {
  return (
    <div className="bg-[#0a0c10] text-white min-h-screen font-display selection:bg-[#09aea9]/20 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-white/10 p-8 flex flex-col justify-between hidden xl:flex backdrop-blur-3xl bg-white/[0.02] m-6 rounded-[2.5rem] shadow-2xl overflow-y-auto">
        <div className="space-y-12">
          <div className="space-y-2">
            <h1 className="text-white text-2xl font-black tracking-tighter">DingJun Hong</h1>
            <p className="text-[#09aea9] text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
              董事會執行環境 Board Executive
            </p>
          </div>

          <nav className="space-y-4">
            {[
              { label: '決策儀表板', en: 'Decision Hub', icon: Dashboard, active: true },
              { label: '情境模擬', en: 'Simulations', icon: ModelTraining },
              { label: '風險矩陣', en: 'Risk Matrix', icon: Warning },
              { label: '數據中心', en: 'Data Vault', icon: Database },
              { label: '系統設定', en: 'System Config', icon: Settings },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all border ${item.active ? 'bg-[#09aea9] text-[#0a0c10] border-[#09aea9] shadow-[0_0_20px_rgba(9,174,169,0.3)]' : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10 hover:text-white'}`}
              >
                <item.icon className="size-5" />
                <div className="flex flex-col">
                  <span className="font-black text-sm tracking-tight">{item.label}</span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest ${item.active ? 'text-[#0a0c10]/60' : 'text-white/20'}`}
                  >
                    {item.en}
                  </span>
                </div>
              </a>
            ))}
          </nav>
        </div>

        <button className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95">
          <EmergencyHome className="size-4" />
          緊急通報 EMERGENCY
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden px-10">
        {/* Top Navigation Overlay */}
        <header className="flex items-center justify-between py-6 border-b border-white/5 relative z-50">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 text-[#09aea9]">
              <div className="size-9 bg-[#09aea9]/10 border border-[#09aea9]/20 rounded-xl flex items-center justify-center">
                <svg fill="currentColor" viewBox="0 0 48 48">
                  <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" />
                </svg>
              </div>
              <h2 className="text-white text-lg font-black tracking-tight leading-none uppercase">
                ESGss JunAiKey
              </h2>
            </div>
            <nav className="hidden lg:flex items-center gap-10">
              {['治理概覽', '風險分析', '決策工具', '報告導出'].map((link, i) => (
                <a
                  key={i}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${i === 2 ? 'text-[#09aea9]' : 'text-white/40 hover:text-white'}`}
                  href="#"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex bg-white/5 border border-white/10 rounded-2xl px-5 py-2 items-center gap-4 focus-within:border-[#09aea9]/50 transition-all group">
              <Search className="text-white/30 text-xl group-focus-within:text-[#09aea9] size-4" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-white/20 outline-none w-48 text-white"
                placeholder="搜索數據 Search Data..."
              />
            </div>
            <button className="bg-[#09aea9] hover:bg-[#09aea9]/80 transition-all text-[#0a0c10] px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95">
              用戶中心 Profile
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto py-12 space-y-12 custom-scrollbar">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-black tracking-tighter text-white">
                3.5 董事會決策儀表板
              </h1>
              <p className="text-white/40 text-xl font-light tracking-tight italic uppercase tracking-[0.1em]">
                高階決策支援：ESG 數據轉化為{' '}
                <span className="text-white font-medium not-italic">
                  戰略洞察 Strategic Insights
                </span>
              </p>
            </motion.div>
            <div className="flex gap-4">
              <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                <CalendarToday className="size-4" /> 2024 年度
              </button>
              <button className="flex items-center gap-3 bg-[#09aea9] text-[#0a0c10] px-8 py-4 rounded-2xl border border-[#09aea9]/20 transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95">
                <FileDownload className="size-4" /> 導出執行報告
              </button>
            </div>
          </div>

          {/* Executive KPI Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                label: 'ESG 綜合評分 종합',
                val: '88.5',
                unit: '',
                trend: '+2.4%',
                up: true,
                icon: Analytics,
                color: '#09aea9',
              },
              {
                label: '碳足跡趨勢 Carbon Footprint',
                val: '1,240',
                unit: 'tCO2e',
                trend: '-5.1%',
                up: true,
                icon: Co2,
                color: '#fb923c',
              },
              {
                label: '合規性風險狀態 Compliance',
                val: '低風險',
                unit: '合規率 99%',
                trend: 'SECURED',
                up: true,
                icon: Gavel,
                color: '#60a5fa',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 p-8 rounded-[3rem] space-y-6 shadow-2xl relative group overflow-hidden"
                style={{ borderLeft: `6px solid ${stat.color}` }}
              >
                <div className="flex justify-between items-start">
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                  <stat.icon size={20} className="opacity-40" style={{ color: stat.color }} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                    <p className="text-white/20 text-sm font-bold">{stat.unit}</p>
                  </div>
                  <div
                    className={`text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {stat.trend}
                  </div>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: i === 0 ? '88.5%' : i === 1 ? '65%' : '99%' }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color, boxShadow: `0 0 15px ${stat.color}` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Risk Matrix & Heatmap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-8 backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[4rem] p-12 shadow-2xl flex flex-col min-h-[550px]"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-5 italic">
                    <GridView className="text-[#09aea9] size-8" />
                    戰略風險矩陣{' '}
                    <span className="text-[#09aea9]/40 not-italic font-black text-xs uppercase tracking-widest">
                      Risk Matrix Explorer
                    </span>
                  </h3>
                  <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
                    動態影響與發生機率建模 Dynamic Impact & Probability Modeling
                  </p>
                </div>
                <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-3 text-white/50">
                    <div className="size-2 rounded-full bg-[#09aea9]" /> 高影響 High
                  </span>
                  <span className="flex items-center gap-3 text-white/50">
                    <div className="size-2 rounded-full bg-white/20" /> 低影響 Low
                  </span>
                </div>
              </div>

              {/* Heatmap Layout */}
              <div className="relative flex-1 border-l-2 border-b-2 border-white/5 flex flex-col">
                <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-2 pb-8 pl-8">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.02] rounded-2xl border border-white/[0.03] transition-colors hover:bg-white/[0.05] relative group"
                    >
                      {/* Active Risk Nodes */}
                      {i === 12 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="size-4 bg-[#09aea9] rounded-full shadow-[0_0_20px_#09aea9]"
                          />
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#09aea9]/40 text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-2xl">
                            供應鏈碳稅分析 Carbon Tax
                          </div>
                        </div>
                      )}
                      {i === 4 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="size-5 bg-[#09aea9]/60 rounded-full shadow-[0_0_25px_#09aea9] border-2 border-white/20"
                          />
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#09aea9]/40 text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-2xl">
                            新歐盟法規指令 EU Regulation
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Matrix Labels */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">
                  發生機率 Probability
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">
                  影響程度 Impact
                </div>
              </div>
            </motion.div>

            {/* Scenario Simulation Panel */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="backdrop-blur-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 p-10 rounded-[4rem] space-y-10 shadow-2xl relative overflow-hidden"
              >
                <div className="space-y-1 relative z-10">
                  <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tighter italic leading-none">
                    <PlayCircle className="text-[#09aea9] size-7" />
                    情境模擬工具
                  </h3>
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                    JunAi Decision Simulation
                  </p>
                </div>

                <div className="space-y-4 relative z-10">
                  {[
                    {
                      label: '增加綠能投資 (25%)',
                      desc: '預計減少 15% 碳排',
                      icon: Eco,
                      active: true,
                    },
                    { label: '供應鏈碳排減半', desc: '優化高碳排供應商', icon: Factory },
                    { label: '全員工減碳獎勵', desc: '提升社會影響力評分', icon: GroupWork },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      className={`w-full p-6 py-8 rounded-3xl flex items-center justify-between group transition-all duration-500 border ${btn.active ? 'bg-[#09aea9]/10 border-[#09aea9]/40 shadow-inner' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`size-12 rounded-2xl flex items-center justify-center transition-all ${btn.active ? 'bg-[#09aea9] text-[#0a0c10] shadow-[0_0_15px_#09aea9]' : 'bg-white/5 text-white/40 group-hover:text-white'}`}
                        >
                          <btn.icon size={24} />
                        </div>
                        <div className="text-left font-black">
                          <p
                            className={`text-sm tracking-tight ${btn.active ? 'text-white' : 'text-white/60'}`}
                          >
                            {btn.label}
                          </p>
                          <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
                            {btn.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className={`transition-all ${btn.active ? 'text-[#09aea9] translate-x-1' : 'text-white/10 group-hover:text-white'}`}
                      />
                    </button>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6 relative z-10">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] italic">
                    當前模擬結果 Current Simulation Output
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-black/40 border border-[#09aea9]/20 p-5 rounded-3xl space-y-2">
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-widest leading-none">
                        淨零進程 Net Zero
                      </p>
                      <p className="text-[#09aea9] text-3xl font-black tracking-tighter leading-none">
                        +18%
                      </p>
                    </div>
                    <div className="bg-black/40 border border-orange-400/20 p-5 rounded-3xl space-y-2">
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-widest leading-none">
                        營運成本 Op-Cost
                      </p>
                      <p className="text-orange-400 text-3xl font-black tracking-tighter leading-none">
                        +4.2%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[-50px] right-[-50px] size-64 bg-[#09aea9]/5 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>

          {/* Strategic Action Log */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl mb-12"
          >
            <div className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-[#09aea9]/5 backdrop-blur-md">
              <h3 className="text-2xl font-black text-white flex items-center gap-5 tracking-tighter italic leading-none">
                <Assignment className="text-[#09aea9] size-7" />
                董事會戰略行動{' '}
                <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest ml-4">
                  Strategic Action Log
                </span>
              </h3>
              <button className="text-[#09aea9] text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-125 transition-all">
                查看全部記錄 View All
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {[
                {
                  title: '批准 2024 年永續發展預算',
                  sub: '需於下週三前完成簽核 Signing Required',
                  priority: '高優先級 Critical',
                  color: 'text-orange-400',
                  dot: 'bg-orange-500',
                  btn: '簽署 EXECUTE',
                },
                {
                  title: '回覆 CSRD 合規諮詢回報',
                  sub: '法律部門已完成初步審核 Legal Verified',
                  priority: '合規運營 Compliance',
                  color: 'text-blue-400',
                  dot: 'bg-blue-500',
                  btn: '查看 VIEW',
                },
                {
                  title: '供應鏈多元化政策更新案',
                  sub: '數據支持：ESG 得分提升預期 +5%',
                  priority: '治理優化 Governance',
                  color: 'text-emerald-400',
                  dot: 'bg-emerald-500',
                  btn: '查看 VIEW',
                },
              ].map((action, idx) => (
                <div
                  key={idx}
                  className="px-12 py-10 flex items-center justify-between group hover:bg-white/[0.03] transition-all"
                >
                  <div className="flex items-center gap-8">
                    <div
                      className={`size-3 rounded-full ${action.dot} shadow-[0_0_10px_currentColor] animate-pulse`}
                    />
                    <div className="space-y-1">
                      <p className="text-xl font-black text-white tracking-tight group-hover:text-[#09aea9] transition-colors">
                        {action.title}
                      </p>
                      <p className="text-white/30 text-xs font-medium italic">{action.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span
                      className={`px-5 py-2 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest bg-white/5 ${action.color}`}
                    >
                      {action.priority}
                    </span>
                    <button
                      className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${idx === 0 ? 'bg-[#09aea9] text-[#0a0c10] shadow-[0_0_20px_rgba(9,174,169,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                    >
                      {action.btn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
