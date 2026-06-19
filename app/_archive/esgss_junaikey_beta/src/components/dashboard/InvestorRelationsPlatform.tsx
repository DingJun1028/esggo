import React from 'react';
import {
  TrendingUp,
  ShowChart,
  PieChart,
  AccountBalance,
  Verified,
  Download,
  Public,
  Security,
  Assessment,
  Language,
  Hub,
  ArrowForwardIos,
  FilterAlt,
  Timeline,
} from '@mui/icons-material';
import {
  BarChart3,
  TrendingUp as TrendingIcon,
  LineChart,
  PieChart as PieChartIcon,
  ShieldCheck,
  Globe,
  FileText,
  Download as DownloadIcon,
  CreditCard,
  Activity,
  ExternalLink,
  Briefcase,
  Search,
  Filter,
  Zap,
  ArrowUpRight,
  Target,
  Coins,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 📈 Investor Relations Platform (Service 6.1)
 * --------------------------------------------------
 * "ESG ROI & Capital Visibility" for DingJun Hong.
 * Features: Capital Flow Heatmap, ROI Performance, Disclosure Engine.
 */
export const InvestorRelationsPlatform = () => {
  const metrics = [
    {
      label: 'ESG Alpha (超額收益)',
      val: '+8.42%',
      trend: '+1.5% vs Benchmark',
      up: true,
      icon: TrendingUp,
    },
    {
      label: '風險緩解率 (Risk Mit)',
      val: '12.8%',
      trend: 'Reduced Volatility',
      up: true,
      icon: Security,
    },
    { label: '資產管理規模 (AUM)', val: '$4.2B', trend: 'ESG Integrated', icon: AccountBalance },
    { label: '披露透明度 (Disclosure)', val: '99.9%', trend: 'Verified SSOT', icon: Verified },
  ];

  const portfolio = [
    {
      name: '再生能源基金 A1',
      sector: 'Energy',
      allocation: '35%',
      performance: '+12.4%',
      score: 92,
    },
    {
      name: '綠色建築開發債券',
      sector: 'Real Estate',
      allocation: '25%',
      performance: '+6.8%',
      score: 85,
    },
    {
      name: '低碳交通基礎設施',
      sector: 'Transport',
      allocation: '20%',
      performance: '+9.2%',
      score: 88,
    },
  ];

  return (
    <div className="bg-[#050d0d] text-white min-h-screen font-display selection:bg-[#0ABAB5]/20 overflow-x-hidden">
      {/* Background Refraction FX */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,#0ABAB510,transparent_50%),radial-gradient(ellipse_at_bottom_left,#051414,transparent_50%)]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#0ABAB5 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-6 backdrop-blur-3xl bg-[#050d0d]/80 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 text-[#0ABAB5]">
            <div className="size-10 bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 rounded-2xl flex items-center justify-center shadow-lg">
              <AccountBalance fontSize="medium" />
            </div>
            <h1 className="text-white text-xl font-black tracking-tighter uppercase leading-none italic">
              JunAiKey Capital
            </h1>
          </div>
          <nav className="hidden xl:flex items-center gap-10">
            {['投資概覽', '績效分析', '披露報告', '全球佈局'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 ${i === 0 ? 'text-[#0ABAB5] border-b-2 border-[#0ABAB5] pb-1' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative group hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 size-4 group-focus-within:text-[#0ABAB5] transition-colors" />
            <input
              className="w-80 bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-xs font-black outline-none focus:ring-1 focus:ring-[#0ABAB5] placeholder:text-white/20 shadow-inner"
              placeholder="搜尋投資項目或 ISIN... Search..."
            />
          </div>
          <button className="bg-[#0ABAB5] hover:bg-[#0ABAB5]/80 text-[#050d0d] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
            報告出口 Export
          </button>
          <div className="size-11 rounded-full border-2 border-[#0ABAB5]/30 p-1 overflow-hidden ring-4 ring-[#0ABAB5]/5">
            <div
              className="size-full rounded-full bg-cover bg-center shadow-inner"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-10 py-12 flex flex-col gap-16">
        {/* Page Heading Section */}
        <div className="flex flex-wrap justify-between items-end gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 shadow-lg">
              <ShowChart className="text-[#0ABAB5] size-4" />
              <span className="text-[10px] font-black tracking-[0.4em] text-[#0ABAB5] uppercase">
                Service 6.1 Investor Relations
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white italic">
              投資者關係與 ESG ROI 平台
            </h1>
            <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight max-w-3xl">
              DingJun Hong <span className="text-white font-medium not-italic">資本透明化核心</span>{' '}
              - 量化 ESG 價值，解鎖永續成長潛力 Capital Growth
            </p>
          </motion.div>

          <div className="flex gap-4">
            <button className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 px-8 py-5 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-2xl">
              <FilterAlt fontSize="small" /> 高級篩選 Filter
            </button>
            <button className="bg-[#0ABAB5]/10 text-[#0ABAB5] border border-[#0ABAB5]/30 px-8 py-5 rounded-[2rem] flex items-center gap-4 hover:bg-[#0ABAB5]/20 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-2xl">
              <FileText size={18} /> 即時披露報告 Disclosure
            </button>
          </div>
        </div>

        {/* High-Level Performance Dash */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-12 rounded-[3.5rem] relative overflow-hidden group hover:border-[#0ABAB5]/40 transition-all shadow-3xl"
            >
              <div className="absolute -right-6 -top-6 size-32 bg-[#0ABAB5]/5 rounded-full blur-[80px] group-hover:bg-[#0ABAB5]/10 transition-all" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                  {stat.label}
                </p>
                <stat.icon className="text-[#0ABAB5] opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-3 relative z-10">
                <p className="text-5xl font-black text-white tracking-tighter italic">{stat.val}</p>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${stat.up ? 'text-emerald-400' : 'text-white/40'}`}
                >
                  {stat.up && <TrendingUp fontSize="inherit" />} {stat.trend}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 h-1 bg-white/5 rounded-full overflow-hidden p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-full bg-[#0ABAB5] rounded-full shadow-[0_0_10px_#0ABAB5]"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROI Flow & Portfolio Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Capital Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-8 backdrop-blur-3xl bg-[#0a1414]/60 border-2 border-white/5 rounded-[4rem] p-16 relative overflow-hidden h-[700px] shadow-3xl flex flex-col group"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="size-14 bg-[#0ABAB5]/20 border border-[#0ABAB5]/40 rounded-3xl flex items-center justify-center shadow-xl">
                  <Timeline className="text-[#0ABAB5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black italic tracking-tighter text-white">
                    資本流入與 ESG 連動趨勢{' '}
                    <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest ml-4">
                      Capital Correlation Stream
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">
                    Real-time Global Capital Flow Integration v6.0
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {['1D', '1W', '1M', '1Y', 'ALL'].map((t, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all ${i === 3 ? 'bg-[#0ABAB5] text-[#050d0d] border-[#0ABAB5]' : 'bg-white/5 text-white/30 border-white/5 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Placeholder (Simulated with Gradient & Motion) */}
            <div className="flex-1 relative flex items-end gap-4 px-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${20 + Math.random() * 60}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className={`w-full rounded-2xl relative transition-all duration-700 ${i === 8 ? 'bg-[#0ABAB5] shadow-[0_0_40px_rgba(10,186,181,0.4)] ring-4 ring-[#0ABAB5]/10' : 'bg-white/[0.05] hover:bg-[#0ABAB5]/20'}`}
                  >
                    {i === 8 && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#0ABAB5] text-[#050d0d] px-4 py-2 rounded-lg text-[10px] font-black whitespace-nowrap shadow-2xl">
                        PEAK ROI: +14.2%
                      </div>
                    )}
                  </motion.div>
                  <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">
                    {
                      [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                      ][i]
                    }
                  </span>
                </div>
              ))}

              {/* Line Path Overlay */}
              <svg className="absolute inset-0 size-full pointer-events-none opacity-30">
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  d="M 50 400 Q 150 200 250 350 T 450 150 T 650 250 T 850 100"
                  fill="none"
                  stroke="#0ABAB5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Status Footer */}
            <div className="mt-12 flex items-center justify-between pt-10 border-t border-white/5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-[#0ABAB5] animate-pulse" />
                  <span className="text-[10px] font-black text-[#0ABAB5] uppercase tracking-widest">
                    系統核驗中 System Syncing...
                  </span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  數據刷新頻率 Data Refresh: 15s
                </span>
              </div>
              <div className="flex items-center gap-4 text-emerald-400 text-[10px] font-black uppercase tracking-widest italic">
                <ShieldCheck size={16} /> 所有單項事實來源 SSOT 已鎖定
              </div>
            </div>
          </motion.div>

          {/* Portfolio Heatmap / Strategy Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div className="flex items-center gap-5 px-4 font-black text-2xl italic tracking-tighter uppercase leading-none">
              <Briefcase size={28} className="text-[#0ABAB5]" />
              投資組合熱力圖{' '}
              <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest block mt-2 ml-4">
                Portfolio Heatmap
              </span>
            </div>

            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-4 h-[600px]">
              {portfolio.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 10, borderColor: '#0ABAB5' }}
                  className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] transition-all cursor-pointer group hover:bg-[#0ABAB5]/5 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black italic text-white tracking-tight group-hover:text-[#0ABAB5] transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">
                        {item.sector}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black italic text-[#0ABAB5] tracking-tighter">
                        {item.performance}
                      </p>
                      <p className="text-[9px] font-black text-emerald-400/60 uppercase tracking-widest">
                        ANNUAL ROI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 mb-8">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20">
                        <span>配置權重 Allocation</span>
                        <span className="text-white">{item.allocation}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: item.allocation }}
                          transition={{ duration: 1.5 }}
                          className="h-full bg-white/40 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="size-20 rounded-full border-4 border-[#0ABAB5]/20 flex flex-col items-center justify-center backdrop-blur-3xl bg-[#0ABAB5]/5 shadow-2xl">
                      <span className="text-xl font-black text-[#0ABAB5] tracking-tighter italic">
                        {item.score}
                      </span>
                      <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">
                        ESG SCORE
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black text-[#0ABAB5] uppercase tracking-[0.2em] italic">
                      查看深度分析 Insight
                    </span>
                    <ArrowForwardIos fontSize="inherit" className="text-[#0ABAB5] size-3" />
                  </div>
                </motion.div>
              ))}

              {/* Add more strategy asset placeholder */}
              <div className="p-10 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group hover:bg-[#0ABAB5]/5 hover:border-[#0ABAB5]/40 transition-all cursor-pointer opacity-30 hover:opacity-100">
                <Target
                  size={32}
                  className="text-white/20 group-hover:text-[#0ABAB5] transition-all"
                />
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                  優化資產配置 Strategy Optimization
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Disclosure Excellence Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-3xl bg-gradient-to-br from-[#102222] to-[#050d0d] border border-[#0ABAB5]/20 rounded-[5rem] p-24 shadow-3xl relative overflow-hidden group"
        >
          <div className="absolute -top-20 -right-20 size-[600px] bg-[#0ABAB5]/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="flex flex-col xl:flex-row items-center gap-24 relative z-10">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-[#0ABAB5]/10 border border-[#0ABAB5]/20">
                  <Globe size={16} className="text-[#0ABAB5]" />
                  <span className="text-[10px] font-black text-[#0ABAB5] uppercase tracking-[0.4em]">
                    Global Compliance Readiness
                  </span>
                </div>
                <h2 className="text-6xl font-black italic tracking-tighter text-white leading-tight uppercase italic">
                  面向全球投資者的
                  <br />
                  披露卓越中心 Disclosure Excellence
                </h2>
                <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight max-w-3xl">
                  利用{' '}
                  <span className="text-[#0ABAB5] font-black not-italic underline decoration-[#0ABAB5]/30">
                    SSOT 單一事實來源
                  </span>{' '}
                  技術，確保每一份 ESG 數據都具備審計級別的真實性。滿足 GRI、SASB 與 TCFD
                  等多重國際標準，縮小與機構投資者的資訊不對稱。
                </p>
              </div>

              <div className="flex gap-8">
                <button className="bg-[#0ABAB5] text-[#050d0d] px-16 py-6 rounded-[2.5rem] font-black italic text-xl uppercase tracking-tighter shadow-[0_20px_60px_rgba(10,186,181,0.3)] hover:translate-y-[-5px] transition-all active:scale-95 group">
                  生成 Q4 季度披露報告 Generate Q4{' '}
                  <DownloadIcon
                    size={24}
                    className="ml-4 inline group-hover:translate-y-1 transition-transform"
                  />
                </button>
                <button className="bg-white/5 border border-white/10 px-16 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all shadow-2xl active:scale-95">
                  聯繫 ESG 審計專家 Specialist
                </button>
              </div>
            </div>

            <div className="xl:w-1/3 grid grid-cols-1 gap-6 w-full">
              {[
                { label: '透明度指數 Transparency', val: '99.9%', icon: ShieldCheck, active: true },
                { label: '合規通過率 Compliance', val: '100%', icon: Globe },
                { label: '披露效率 Efficiency', val: '2s Instant', icon: Zap, active: true },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`p-10 rounded-[3.5rem] flex items-center gap-10 border transition-all hover:scale-105 shadow-2xl ${card.active ? 'bg-[#0ABAB5]/10 border-[#0ABAB5]/30' : 'bg-white/5 border-white/10'}`}
                >
                  <div className="size-16 rounded-[2rem] bg-white/5 flex items-center justify-center text-[#0ABAB5] shadow-inner group-hover/card:scale-110">
                    <card.icon size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                      {card.label}
                    </p>
                    <p className="text-3xl font-black italic text-white tracking-tighter">
                      {card.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="mt-40 border-t border-white/5 p-20 text-center space-y-12 backdrop-blur-3xl bg-black/20">
        <div className="flex justify-center gap-20">
          {['GRI Standards', 'SASB Certified', 'TCFD Compliant', 'UN PRI Signatory'].map(
            (logo, i) => (
              <span
                key={i}
                className="text-white/10 text-xl font-black italic tracking-tighter grayscale hover:grayscale-0 hover:text-[#0ABAB5] transition-all cursor-default"
              >
                {logo}
              </span>
            )
          )}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
          © 2024 ESGss JunAiKey • DingJun Hong • Capital Management & Disclosure Engine v6.1
        </p>
        <div className="flex justify-center gap-12 text-[#0ABAB5]/40 text-[9px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-[#0ABAB5] transition-colors">
            隱私政策 Policy
          </a>
          <a href="#" className="hover:text-[#0ABAB5] transition-colors">
            投資協議 Terms
          </a>
          <a href="#" className="hover:text-[#0ABAB5] transition-colors">
            審計日誌 Logs
          </a>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #051414;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0ABAB540;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};
