import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Wallet,
  Handshake,
  Search,
  UserCircle,
  AccountBalance,
  Analytics,
  VerifiedUser,
  Payments,
  Eco,
  CheckCircle2,
  GridView,
  SolarPower,
  Droplets,
  Info,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 💰 Green Financing Assistant (Service 2.5)
 * --------------------------------------------------
 * "Sustainable Finance Ecosystem" for DingJun Hong.
 * Features: Project Stepper, ESG Scorecard, Financing Heatmap.
 */
export const GreenFinancingAssistant = () => {
  const steps = [
    {
      label: '專案評估',
      en: 'Project Evaluation',
      icon: Analytics,
      status: 'completed',
      progress: '100%',
    },
    {
      label: '永續驗證',
      en: 'ESG Verification',
      icon: VerifiedUser,
      status: 'active',
      progress: '65%',
    },
    { label: '投資媒合', en: 'Matchmaking', icon: Handshake, status: 'pending' },
    { label: '資金撥付', en: 'Disbursement', icon: Payments, status: 'pending' },
  ];

  const scorecardData = [
    { label: '環境', h: '92%', delay: 0 },
    { label: '社會', h: '75%', delay: 0.1 },
    { label: '治理', h: '85%', delay: 0.2 },
    { label: '能源', h: '98%', delay: 0.3 },
    { label: '廢棄物', h: '40%', delay: 0.4 },
    { label: '碳足跡', h: '88%', delay: 0.5 },
  ];

  const heatmapNodes = [
    { name: '風能專案', rate: '94%', color: 'bg-[#0ab8b2]' },
    { name: '生質能', rate: '40%', color: 'bg-[#0ab8b2]/40' },
    { name: '節能照明', rate: '20%', color: 'bg-[#0ab8b2]/20' },
    { name: '氫能開發', rate: '60%', color: 'bg-[#0ab8b2]/60' },
    { name: '儲能系統', rate: '90%', color: 'bg-[#0ab8b2]/90' },
    { name: '智慧電網', rate: '70%', color: 'bg-[#0ab8b2]/70' },
    { name: '電動車', rate: '50%', color: 'bg-[#0ab8b2]/50' },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 overflow-x-hidden">
      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_left,#1a3a3a,#102222)]" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 px-10 py-5 backdrop-blur-3xl bg-white/[0.02] border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-[#0ab8b2] flex items-center justify-center rounded-2xl shadow-xl shadow-[#0ab8b2]/20">
                <AccountBalance className="text-[#102222] size-7" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-xl font-black leading-none tracking-tight">
                  鼎鈞弘永續金融
                </h1>
                <span className="text-[#0ab8b2] text-[10px] uppercase tracking-[0.3em] font-black mt-1">
                  Green Financing Assistant
                </span>
              </div>
            </div>
            <nav className="hidden xl:flex items-center gap-8 border-l border-white/5 pl-10">
              {['投資儀表板', '永續專案庫', '資金媒合區', '法遵報告'].map((link, i) => (
                <a
                  key={i}
                  className={`text-sm font-black transition-colors ${i === 0 ? 'text-[#0ab8b2]' : 'text-white/40 hover:text-[#0ab8b2]'}`}
                  href="#"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0ab8b2]/40 size-4" />
              <input
                className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-2.5 text-sm focus:ring-1 focus:ring-[#0ab8b2] focus:border-[#0ab8b2] w-72 text-white outline-none placeholder:text-white/20"
                placeholder="搜尋綠色債券、ESG 專案..."
                type="text"
              />
            </div>
            <button className="bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#102222] px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
              個人中心 Profile
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 md:px-16 py-12">
        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-2"
        >
          <h2 className="text-5xl font-black text-white tracking-tighter">2.5 綠色融資助手</h2>
          <p className="text-[#0ab8b2]/60 text-xl font-light tracking-tight italic">
            連接全球永續資本，賦能綠色轉型專案 —{' '}
            <span className="text-white font-medium not-italic">ESG 投資生態系統核心專區</span>
          </p>
        </motion.div>

        {/* Service Workflow Stepper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 rounded-3xl p-10 mb-12 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-4 relative">
                  <div
                    className={`size-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${step.status === 'pending' ? 'bg-white/5 border border-white/10 text-white/20' : 'bg-[#0ab8b2] text-[#102222] border-4 border-[#102222] ring-2 ring-[#0ab8b2]/40'}`}
                  >
                    <step.icon className="size-8" />
                  </div>
                  <div className="text-center">
                    <p
                      className={`font-black text-sm tracking-tight ${step.status === 'pending' ? 'text-white/20' : 'text-white'}`}
                    >
                      {step.label}
                    </p>
                    {step.progress && (
                      <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest leading-none mt-1">
                        {step.progress}
                      </span>
                    )}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-white/5 relative mx-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          step.status === 'completed'
                            ? '100%'
                            : step.status === 'active'
                              ? '50%'
                              : '0%',
                      }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#0ab8b2] to-transparent shadow-[0_0_15px_#0ab8b2]"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              label: '當前專案評分 Score',
              val: '88.5',
              unit: '/ 100',
              trend: '+2.4%',
              icon: TrendingUp,
            },
            {
              label: '減碳預測 Prediction (tCO2e)',
              val: '12,500',
              unit: '',
              trend: '淨零領先',
              icon: Eco,
            },
            {
              label: '預計融資總額 Total (萬)',
              val: '5,200',
              unit: 'TWD',
              trend: '融資綠燈',
              icon: CheckCircle2,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="backdrop-blur-2xl bg-white/[0.03] border border-white/5 border-l-4 border-l-[#0ab8b2] p-8 rounded-2xl shadow-xl hover:bg-white/[0.05] transition-all"
            >
              <p className="text-[#0ab8b2]/60 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-black text-white tracking-tighter">{stat.val}</span>
                <span className="text-white/20 text-lg font-light">{stat.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0ab8b2] text-[10px] font-black uppercase tracking-widest border-t border-white/5 pt-4">
                <stat.icon size={14} /> {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Green Project Scorecard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-3xl p-10 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-12">
              <h3 className="text-2xl font-black flex items-center gap-4 tracking-tight">
                <Analytics className="text-[#0ab8b2] size-8" />
                綠色專案評分卡
              </h3>
              <span className="bg-[#0ab8b2]/10 text-[#0ab8b2] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#0ab8b2]/20">
                2024 年度評估
              </span>
            </div>

            <div className="space-y-10">
              <div className="flex justify-between items-end bg-[#0ab8b2]/5 p-6 rounded-2xl border border-[#0ab8b2]/20">
                <div>
                  <p className="text-6xl font-black text-white tracking-tighter mb-2">A+</p>
                  <p className="text-[#0ab8b2]/60 text-sm font-bold tracking-tight">
                    綜合 ESG 指標表現極佳 Perfect Performance
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[#0ab8b2] text-2xl font-black tracking-tighter">+15%</span>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                    相較去年同期
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-6 items-end gap-4 h-48 relative">
                <div className="absolute inset-x-0 bottom-0 h-px bg-white/5" />
                {scorecardData.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-4 h-full justify-end group cursor-pointer"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: d.h }}
                      transition={{ duration: 1, delay: 1 + d.delay }}
                      className="w-full bg-[#0ab8b2]/20 rounded-t-xl transition-all group-hover:bg-[#0ab8b2] shadow-2xl group-hover:shadow-[#0ab8b2]/40 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-20" />
                    </motion.div>
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest rotate-[-45deg] whitespace-nowrap mt-4 group-hover:text-white transition-colors">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Financing Opportunity Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-start mb-12">
              <h3 className="text-2xl font-black flex items-center gap-4 tracking-tight">
                <GridView className="text-[#0ab8b2] size-8" />
                融資機會熱度圖
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                <span>低 Low</span>
                <div className="flex gap-1.5">
                  {[0.1, 0.3, 0.6, 1].map((o, i) => (
                    <div
                      key={i}
                      className="size-4 rounded-md bg-[#0ab8b2] shadow-sm"
                      style={{ opacity: o }}
                    />
                  ))}
                </div>
                <span>高潛力 High</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 flex-1">
              {heatmapNodes.map((n, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className={`${n.color} rounded-2xl flex flex-col items-center justify-center p-4 relative group cursor-pointer shadow-xl border border-white/5`}
                >
                  <span className="text-[11px] font-black text-white/90 text-center leading-tight tracking-tight">
                    {n.name}
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-white text-[#102222] px-3 py-1 rounded-lg text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-2xl">
                    投資媒合率: {n.rate}
                  </div>
                </motion.div>
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-white/5 rounded-2xl border border-white/5 opacity-40"
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="text-[#0ab8b2] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:underline group">
                查看完整市場深度報告 Market Report{' '}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Project Match List Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-black text-white mb-8 tracking-tighter italic">
            推薦投資媒合專案{' '}
            <span className="text-[#0ab8b2]/40 not-italic ml-4 text-xl">
              Matchmaking Opportunities
            </span>
          </h3>
          <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-[#0ab8b2]/10 border-b border-white/10">
                <tr>
                  {[
                    '專案名稱 Project',
                    'ESG 分數 Score',
                    '預估收益 IRR',
                    '當前進度 Status',
                    '',
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#0ab8b2]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {
                    name: '台南三期太陽能擴建',
                    sub: 'Renewable Energy | TW-7712',
                    score: 92.4,
                    irr: '5.8%',
                    status: '準備撥款',
                    icon: SolarPower,
                  },
                  {
                    name: '智慧水處理自動化系統',
                    sub: 'Water Tech | TW-9923',
                    score: 87.1,
                    irr: '4.2%',
                    status: '審核中',
                    icon: Droplets,
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.04] transition-all cursor-pointer group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="size-12 rounded-2xl bg-[#0ab8b2]/10 flex items-center justify-center border border-[#0ab8b2]/20">
                          <row.icon className="text-[#0ab8b2] size-6" />
                        </div>
                        <div>
                          <p className="font-black text-lg text-white group-hover:text-[#0ab8b2] transition-colors">
                            {row.name}
                          </p>
                          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">
                            {row.sub}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-2xl font-black text-[#0ab8b2] tracking-tighter">
                      {row.score}
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-xl font-black text-white tracking-widest">{row.irr}</p>
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">
                        Forecasted
                      </p>
                    </td>
                    <td className="px-10 py-8">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${row.status === '準備撥款' ? 'bg-[#0ab8b2] text-[#102222]' : 'bg-white/5 text-white/40 ring-1 ring-white/10'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="size-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#0ab8b2] hover:text-[#102222] transition-all">
                        <Info size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer Meta */}
        <footer className="mt-32 pt-12 border-t border-white/5 opacity-30 flex flex-col md:flex-row justify-between items-center gap-10 pb-20">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-[#0ab8b2] rounded-xl flex items-center justify-center">
              <AccountBalance size={20} className="text-[#102222]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-white tracking-widest uppercase">
                DingJun Hong Sustainable Finance
              </p>
              <p className="text-[10px] text-white/50 font-medium">
                © 2024 鼎鈞弘永續金融生態系統 版權所有. JunAiKey High-end Service 2.5
              </p>
            </div>
          </div>
          <div className="flex gap-10">
            {['Privacy Policy', 'Terms of Service', 'Documentation'].map(link => (
              <a
                key={link}
                className="text-[10px] text-white hover:text-[#0ab8b2] transition-colors font-black uppercase tracking-[0.3em]"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
};
