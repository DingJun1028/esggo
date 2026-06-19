import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Settings as Hub,
  Bell as NotificationsActive,
  CheckCircle2 as Verified,
  ShieldCheck as Security,
  AlertTriangle as Warning,
  AlertTriangle as ReportProblem,
  Lightbulb,
  ArrowRight as ArrowForward,
  RefreshCw as Sync,
  Filter as FilterList,
  Download as FileDownload,
  Info,
  Bell,
  Activity,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search,
  ArrowRight,
  Download,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🛡️ Compliance Risk Monitoring (Service 3.4)
 * --------------------------------------------------
 * "Real-time Compliance & Risk Analysis" with Node Map.
 * Features: Global compliance stats, Node Visualization, Automated Warnings.
 */
export const ComplianceRiskMonitoring = () => {
  const stats = [
    {
      label: '整體合規率 Global Compliance',
      val: '98.5%',
      trend: '↑ 1.2%',
      color: 'text-[#0df2eb]',
      icon: ShieldCheck,
    },
    {
      label: '活動預警數 Active Warnings',
      val: '12',
      trend: '↓ 2',
      color: 'text-orange-400',
      icon: Warning,
    },
    {
      label: '待處理風險 Pending Risks',
      val: '3',
      trend: 'New',
      color: 'text-red-400',
      icon: ReportProblem,
    },
    {
      label: '5T-Gate 通過率 Gate Pass',
      val: '100%',
      trend: 'MAX',
      color: 'text-[#0df2eb]',
      icon: Security,
    },
  ];

  const risks = [
    {
      id: 1,
      title: '更新歐盟供應鏈指令 (CSDDD)',
      level: '中度風險',
      desc: 'AI 檢測到歐盟新規變動，建議在 14 天內完成供應商盡職調查報告更新，以維持 5T-Gate 認證。',
      color: 'bg-orange-400/20 text-orange-400',
    },
    {
      id: 2,
      title: '優化碳足跡數據精確度',
      level: '預防性建議',
      desc: '整合範疇三排放數據，可提升合規透明度評分 15%。系統已準備好自動化同步工具。',
      color: 'bg-[#0df2eb]/20 text-[#0df2eb]',
    },
  ];

  const alerts = [
    {
      id: 'a1',
      title: '年度審計數據缺失',
      time: '2 mins ago',
      level: 'Critical',
      desc: '檢測到 2024 Q3 能源消耗報表未上傳，影響 5T-Gate 整體評級。',
      color: 'border-red-400 text-red-400',
    },
    {
      id: 'a2',
      title: '法規變更偵測',
      time: '1 hour ago',
      level: 'Warning',
      desc: 'SEC 氣候相關披露規則有細微調整，需重新檢視當前披露流程。',
      color: 'border-orange-400 text-orange-400',
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0df2eb]/20 overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_bottom_right,#1a3a3a,#102222)]" />

      {/* Header Area */}
      <header className="sticky top-0 z-50 px-10 py-5 backdrop-blur-3xl bg-[#102222]/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 text-[#0df2eb]">
            <div className="size-10 bg-[#0df2eb]/10 border border-[#0df2eb]/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(13,242,235,0.2)]">
              <Security className="size-6" />
            </div>
            <h2 className="text-white text-2xl font-black tracking-tighter leading-none">
              ESGss JunAiKey
            </h2>
          </div>
          <nav className="hidden xl:flex items-center gap-8 ml-6">
            {['合規監控', '風險分析', '法規庫', '系統設定'].map((link, i) => (
              <a
                key={i}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${i === 0 ? 'text-[#0df2eb] border-[#0df2eb]' : 'text-white/40 border-transparent hover:text-[#0df2eb]'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative group hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 size-4 group-focus-within:text-[#0df2eb] transition-colors" />
            <input
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-64 focus:ring-1 focus:ring-[#0df2eb] outline-none transition-all"
              placeholder="搜尋法規或風險項 Search..."
            />
          </div>
          <button className="bg-[#0df2eb] hover:bg-[#0df2eb]/80 text-[#102222] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl active:scale-95">
            <Download size={14} /> 導出合規報告 Export Report
          </button>
          <div className="size-10 rounded-full border border-[#0df2eb]/40 p-0.5 overflow-hidden ring-4 ring-[#0df2eb]/5">
            <div
              className="size-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-10 py-12">
        {/* Page Heading Overlay */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-black tracking-tighter text-white">3.4 合規風險監控</h1>
              <span className="text-[10px] bg-[#0df2eb] text-[#102222] px-3 py-1 rounded-lg font-black tracking-[0.2em] uppercase animate-pulse shadow-[0_0_15px_#0df2eb]">
                Live System
              </span>
            </div>
            <p className="text-[#9cbab9] text-xl font-light tracking-tight max-w-2xl italic leading-relaxed">
              實時監控全球法規合規狀態與{' '}
              <span className="text-white font-bold not-italic">5T-Gate</span>{' '}
              驗證機制，動態偵測合規偏移並自動產出緩解策略。
            </p>
          </motion.div>

          <div className="flex gap-4">
            <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
              <RefreshCw size={14} /> 刷新數據 Sync
            </button>
          </div>
        </div>

        {/* Global Metric Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-[#0df2eb]/30 transition-all shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] flex-1 mr-4">
                  {stat.label}
                </p>
                <stat.icon
                  className={`size-6 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <div className="space-y-4">
                <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                <div className="flex items-center gap-3">
                  <span className={`${stat.color} text-[10px] font-black italic`}>
                    {stat.trend}
                  </span>
                  <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                    since last sync
                  </span>
                </div>
              </div>
              {i === 3 && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#0df2eb] to-transparent shadow-[0_0_15px_#0df2eb]" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Central Node Map Area */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden min-h-[600px] flex flex-col shadow-2xl relative"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center relative z-20">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black flex items-center gap-4 tracking-tight">
                    <Hub className="text-[#0df2eb] size-8" />
                    法規要求分佈{' '}
                    <span className="text-[#0df2eb] font-black text-[10px] uppercase tracking-[0.3em] bg-[#0df2eb]/10 px-3 py-1 rounded-full">
                      Compliance Ecosystem
                    </span>
                  </h2>
                  <p className="text-white/30 text-xs font-light">
                    全系統節點動態監測中 System-wide Dynamic Monitoring
                  </p>
                </div>
                <div className="flex gap-10">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-[#0df2eb] shadow-[0_0_10px_#0df2eb] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/50">
                      合規 OK
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-orange-400 shadow-[0_0_10px_#fb923c] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/50">
                      預警 Alert
                    </span>
                  </div>
                </div>
              </div>

              {/* Node Visualizer Viewport */}
              <div className="flex-1 relative bg-[radial-gradient(circle_at_center,rgba(13,242,235,0.08),transparent_70%)] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-20">
                  {/* Main Brain Node */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative z-20 size-48 bg-[#0df2eb]/10 backdrop-blur-3xl rounded-full border-2 border-[#0df2eb]/40 flex items-center justify-center shadow-[0_0_80px_rgba(13,242,235,0.15)] group cursor-pointer"
                  >
                    <div className="text-center group-hover:scale-110 transition-transform duration-700">
                      <Zap className="text-[#0df2eb] size-10 mx-auto mb-2 drop-shadow-[0_0_10px_#0df2eb]" />
                      <p className="text-[9px] uppercase font-black tracking-widest text-[#0df2eb]/60">
                        Esgss Gate
                      </p>
                      <p className="font-black text-xl tracking-tighter text-white">鼎軍宏核心</p>
                    </div>
                    {/* Ring Pulse Effect */}
                    <div className="absolute inset-[-10px] border border-[#0df2eb]/20 rounded-full animate-ping opacity-20" />
                  </motion.div>

                  {/* Satellite Nodes */}
                  {[
                    {
                      label: '環境法規',
                      top: '15%',
                      left: '15%',
                      size: 'size-28',
                      color: '#0df2eb',
                    },
                    {
                      label: '財務披露',
                      bottom: '20%',
                      right: '15%',
                      size: 'size-36',
                      color: '#fb923c',
                      alert: true,
                    },
                    {
                      label: '勞工權益',
                      top: '25%',
                      right: '20%',
                      size: 'size-24',
                      color: '#0df2eb',
                    },
                    {
                      label: '碳排標準',
                      bottom: '15%',
                      left: '20%',
                      size: 'size-32',
                      color: '#0df2eb',
                    },
                  ].map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      style={{
                        top: n.top,
                        left: n.left,
                        right: n.right,
                        bottom: n.bottom,
                        backgroundColor: `${n.color}15`,
                      }}
                      className={`absolute ${n.size} rounded-full flex flex-col items-center justify-center backdrop-blur-3xl border border-white/5 hover:border-white/20 transition-all group cursor-pointer shadow-inner`}
                    >
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-tighter text-center px-4 leading-tight">
                        {n.label}
                        <br />
                        {n.alert ? 'Alert' : 'Secure'}
                      </p>
                      {n.alert && (
                        <AlertTriangle className="size-4 text-orange-400 mt-2 animate-bounce" />
                      )}
                      <div className="absolute inset-0 rounded-full border-2 border-transparent transition-all group-hover:border-white/20 scale-110" />
                    </motion.div>
                  ))}

                  {/* SVG Network Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <defs>
                      <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0df2eb" stopOpacity="0" />
                        <stop offset="50%" stopColor="#0df2eb" stopOpacity="1" />
                        <stop offset="100%" stopColor="#0df2eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line
                      x1="22%"
                      y1="21%"
                      x2="50%"
                      y2="50%"
                      stroke="url(#grad-teal)"
                      strokeWidth="1"
                    />
                    <line
                      x1="80%"
                      y1="75%"
                      x2="50%"
                      y2="50%"
                      stroke="#fb923c"
                      strokeWidth="1.5"
                      strokeDasharray="8 8"
                      className="animate-pulse"
                    />
                    <line x1="68%" y1="30%" x2="50%" y2="50%" stroke="#0df2eb" strokeWidth="1" />
                    <line x1="30%" y1="78%" x2="50%" y2="50%" stroke="#0df2eb" strokeWidth="1" />
                  </svg>
                </div>

                {/* Validation Status HUD Overlay */}
                <div className="absolute bottom-10 left-10 flex gap-10">
                  <div className="backdrop-blur-3xl bg-black/60 px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-6 shadow-2xl relative group">
                    <div className="size-12 rounded-full border-2 border-[#0df2eb] flex items-center justify-center text-[#0df2eb] font-black text-sm tracking-tighter shadow-[0_0_15px_#0df2eb]">
                      5T
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] leading-none">
                        5T-Gate 驗證狀態 Status
                      </p>
                      <p className="text-[#0df2eb] font-black text-sm uppercase tracking-widest leading-none">
                        認證激活 Activated
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Risk Mitigation Suggestion Cards */}
            <div className="space-y-6 px-2">
              <h2 className="text-2xl font-black flex items-center gap-4 tracking-tighter italic text-white/90">
                <Lightbulb className="text-[#0df2eb] size-8" />
                風險緩解建議{' '}
                <span className="text-[#0df2eb]/40 not-italic ml-4 text-sm font-bold uppercase tracking-widest">
                  Risk Mitigation Suggestions
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {risks.map((risk, i) => (
                  <motion.div
                    key={risk.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] group cursor-pointer hover:border-[#0df2eb]/40 transition-all shadow-xl relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <span
                        className={`${risk.color} text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm`}
                      >
                        {risk.level}
                      </span>
                      <ArrowForward
                        size={18}
                        className="text-white/20 group-hover:text-[#0df2eb] transition-all group-hover:translate-x-1"
                      />
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-[#0df2eb] transition-colors">
                      {risk.title}
                    </h3>
                    <p className="text-white/40 text-sm font-light leading-relaxed">{risk.desc}</p>
                    {/* Background Pattern */}
                    <div className="absolute -bottom-4 -right-4 size-24 bg-white/5 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Automated Warning Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[3rem] h-full shadow-2xl overflow-hidden flex flex-col sticky top-32 max-h-[calc(100vh-160px)]"
            >
              <div className="p-10 border-b border-white/5 space-y-2">
                <h2 className="text-2xl font-black flex items-center gap-4 tracking-tight leading-none text-white">
                  <NotificationsActive className="text-red-400 size-8 animate-pulse" />
                  自動化預警系統
                </h2>
                <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
                  Automated Warning Ops
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {alerts.map((alert, i) => (
                  <div
                    key={alert.id}
                    className={`bg-white/[0.03] border-l-4 ${alert.color} rounded-2xl p-6 relative overflow-hidden group hover:bg-white/[0.05] transition-all border border-transparent`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded leading-none">
                        {alert.level} Alert
                      </p>
                      <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                        {alert.time}
                      </p>
                    </div>
                    <h4 className="font-black text-lg text-white mb-3 group-hover:text-[#0df2eb] transition-colors">
                      {alert.title}
                    </h4>
                    <p className="text-white/40 text-xs font-light leading-relaxed mb-6">
                      {alert.desc}
                    </p>
                    <button className="w-full py-4 bg-white/5 hover:bg-red-400 hover:text-[#102222] text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all border border-white/10 active:scale-95">
                      立即處理 Proceed
                    </button>
                  </div>
                ))}

                {/* Verification Hub Summary */}
                <div className="p-10 rounded-[2.5rem] bg-[#0df2eb]/5 border border-[#0df2eb]/20 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0df2eb]/5 to-transparent pointer-events-none" />
                  <div className="size-24 rounded-full border-2 border-[#0df2eb] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(13,242,235,0.2)] group-hover:scale-110 transition-transform duration-700 relative z-10">
                    <Verified className="text-[#0df2eb] size-12" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <h4 className="font-black text-xl text-[#0df2eb] tracking-tight uppercase tracking-[0.05em]">
                      5T-Gate 核心驗證
                    </h4>
                    <p className="text-white/40 text-xs font-medium leading-relaxed max-w-[200px] mx-auto">
                      當前系統處於高度合規狀態。已通過 128 項加密驗證點。
                    </p>
                  </div>
                  <div className="w-full h-[2px] bg-white/5 rounded-full mt-10 overflow-hidden relative z-10 p-[0.5px]">
                    <div className="h-full bg-[#0df2eb] shadow-[0_0_10px_#0df2eb] w-full" />
                  </div>
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mt-6">
                    最後驗證時間:
                    <br />
                    2024-10-24 09:30:12
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="px-12 py-10 border-t border-white/5 backdrop-blur-3xl bg-[#102222]/80 mt-20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-widest">
            <Security size={16} /> <span>© 2024 ESGss JunAiKey. All Rights Reserved.</span>
          </div>
          <div className="flex gap-12">
            {['系統日誌 System Logs', '隱私條約 Privacy', '技術支援 Support'].map((link, i) => (
              <a
                key={i}
                className="text-[10px] text-white/30 hover:text-[#0df2eb] transition-colors font-black uppercase tracking-[0.2em]"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
