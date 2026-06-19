import React from 'react';
import {
  BarChart3,
  Activity,
  ShieldAlert,
  Zap,
  Search,
  FileText,
  Settings,
  Share2,
  Users,
  Building2,
  ExternalLink,
  Info,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Navigation,
  ChevronRight,
  Maximize2,
  RefreshCcw,
  Gavel,
  ShieldCheck,
  Binary,
  Cpu,
  Microscope,
  Stethoscope,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 💉 Corporate Health Check (Service 2.1)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" ESG Diagnostic System.
 * Features: Radar Chart, Risk nodes, and Diagnostic Workflow.
 */
export const CorporateHealthCheck = () => {
  const stats = [
    {
      label: '環境保護 (E)',
      score: 88,
      trend: '+5.2%',
      positive: true,
      icon: LeafIcon,
      desc: '碳中和進度良好',
    },
    {
      label: '社會責任 (S)',
      score: 72,
      trend: '+1.5%',
      positive: true,
      icon: Users,
      desc: '員工福祉指數優化',
    },
    {
      label: '公司治理 (G)',
      score: 91,
      trend: '-0.8%',
      positive: false,
      icon: Gavel,
      desc: '合規風險評估待檢核',
    },
  ];

  const riskNodes = [
    {
      id: 1,
      title: '供應鏈溫室氣體核算',
      level: 'Critical Risk',
      desc: '範疇三數據完整性缺失，可能導致 ESG 評級下調。',
      status: 'critical',
    },
    {
      id: 2,
      title: '勞動人權透明度',
      level: 'Warning',
      desc: '薪酬公平性報告需補強細節說明。',
      status: 'warning',
    },
    {
      id: 3,
      title: '數據隱私管理',
      level: 'Normal',
      desc: '目前符合 GDPR 與本國法規要求。',
      status: 'normal',
    },
  ];

  return (
    <div className="bg-[#0f2322] text-white min-h-screen font-display selection:bg-[#05b3ad]/20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] size-[600px] bg-[#05b3ad]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] size-[500px] bg-[#05b3ad]/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-10 relative">
        {/* Page Heading */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 mb-16">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-[#05b3ad]"
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs font-black tracking-[0.3em] uppercase">
                Service 2.1 • Diagnostic System
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black tracking-tighter leading-none"
            >
              企業健康檢查{' '}
              <span className="text-[#05b3ad]/40 font-light italic text-4xl lg:text-5xl block md:inline md:ml-4">
                Corporate Health Check
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-3xl text-lg font-light leading-relaxed"
            >
              鼎鈞紅高階 Tiffany Blue 液體玻璃 ESG 診斷生態系統：
              <br />
              <span className="text-white/80 font-medium">
                即時掃描企業體徵，量化環境、社會與治理維度表現。
              </span>
            </motion.p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">
                系統狀態 System Status
              </p>
              <p className="text-sm text-[#05b3ad] font-bold tracking-tight">
                數據串接正常 / 正在掃描...
              </p>
            </div>
            <button className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl transition-all flex items-center gap-3 group active:scale-95">
              <RefreshCcw className="text-[#05b3ad] w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-black text-xs uppercase tracking-widest">
                重新掃描體徵 Re-Scan
              </span>
            </button>
          </div>
        </div>

        {/* Top Stats Array */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="backdrop-blur-2xl bg-white/[0.03] border border-[#05b3ad]/20 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-[#05b3ad]/50 transition-all shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-black text-white tracking-widest leading-none">
                    {stat.score}
                    <span className="text-base text-slate-500 font-light ml-1">/100</span>
                  </h3>
                </div>
                <div className="size-14 rounded-2xl bg-[#05b3ad]/10 flex items-center justify-center text-[#05b3ad] ring-1 ring-[#05b3ad]/20 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.score}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-[#05b3ad] rounded-full shadow-[0_0_15px_#05b3ad]"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p
                    className={`text-[10px] font-black flex items-center gap-1.5 uppercase tracking-tighter ${stat.positive ? 'text-emerald-400' : 'text-orange-400'}`}
                  >
                    {stat.positive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {stat.trend} <span className="text-white/20 opacity-50 ml-1">since prev</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                    {stat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Visualization & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Radar Chart Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="col-span-12 lg:col-span-7 backdrop-blur-3xl bg-white/[0.02] border border-[#05b3ad]/20 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
                  企業生命體徵雷達分析{' '}
                  <span className="text-[#05b3ad] font-black text-[10px] tracking-[0.3em] uppercase bg-[#05b3ad]/10 px-3 py-1 rounded-full">
                    Corporate Life Signs
                  </span>
                </h3>
                <p className="text-slate-400 text-sm mt-3 font-light">
                  綜合健康評分：<span className="text-white font-bold">84</span> (當前診斷週期
                  Diagnostic Cycle)
                </p>
              </div>
              <div className="bg-[#05b3ad] text-[#0f2322] px-5 py-2 rounded-xl text-[10px] font-black border border-[#05b3ad]/30 uppercase tracking-[0.2em] animate-pulse">
                LIVE SCANNING
              </div>
            </div>

            <div className="relative aspect-square max-w-[450px] mx-auto my-12 group">
              <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(5, 179, 173, 0.2) 0%, transparent 70%) blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <svg
                className="w-full h-full transform -rotate-15 drop-shadow-2xl"
                viewBox="0 0 400 400"
              >
                {/* Radar Grid Lines */}
                {[0.9, 0.7, 0.5, 0.3].map((s, i) => (
                  <polygon
                    key={i}
                    fill="none"
                    points="200,20 373,120 373,320 200,420 27,320 27,120"
                    stroke="rgba(5, 179, 173, 0.2)"
                    strokeWidth="1"
                    transform={`scale(${s}) translate(${(400 * (1 - s)) / 2 / s}, ${(400 * (1 - s)) / 2 / s})`}
                  />
                ))}
                {/* Data Polygon */}
                <motion.polygon
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 1 }}
                  fill="rgba(5, 179, 173, 0.25)"
                  points="200,60 340,150 320,300 200,380 80,300 100,150"
                  stroke="#05b3ad"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_15px_rgba(5,179,173,0.6)]"
                />
                <circle
                  cx="200"
                  cy="220"
                  fill="none"
                  r="150"
                  stroke="#05b3ad"
                  strokeDasharray="10 15"
                  strokeWidth="1"
                  className="animate-spin-slow opacity-20"
                />
              </svg>

              {/* Labels */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#102322]/90 border border-[#05b3ad]/50 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg">
                環境保護 (E)
              </div>
              <div className="absolute top-1/4 -right-12 bg-[#102322]/90 border border-[#05b3ad]/50 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg">
                社會責任 (S)
              </div>
              <div className="absolute bottom-1/4 -right-12 bg-[#102322]/90 border border-[#05b3ad]/50 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg">
                公司治理 (G)
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#102322]/90 border border-[#05b3ad]/50 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg">
                永續發展 (P)
              </div>
              <div className="absolute bottom-1/4 -left-12 bg-[#102322]/90 border border-[#05b3ad]/50 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl shadow-lg">
                數據透明 (T)
              </div>
            </div>
          </motion.div>

          {/* Risk Node Analysis */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="backdrop-blur-3xl bg-white/[0.02] border border-[#05b3ad]/20 p-10 rounded-[3rem] flex-1 shadow-2xl"
            >
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4">
                風險節點分析{' '}
                <span className="text-[#05b3ad] font-black text-[10px] tracking-[0.3em] uppercase">
                  Risk Nodes
                </span>
              </h3>

              <div className="space-y-8">
                {riskNodes.map(node => (
                  <div
                    key={node.id}
                    className="flex items-start gap-6 group cursor-pointer p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="relative mt-1">
                      <div
                        className={`size-4 rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000 ${node.status === 'critical' ? 'bg-red-500 animate-pulse' : node.status === 'warning' ? 'bg-orange-500' : 'bg-[#05b3ad]'}`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-sm tracking-tight text-white">
                          {node.title}
                        </h4>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${node.status === 'critical' ? 'text-red-400 bg-red-400/10' : node.status === 'warning' ? 'text-orange-400 bg-orange-400/10' : 'text-[#05b3ad] bg-[#05b3ad]/10'}`}
                        >
                          {node.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        {node.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[#05b3ad] transition-colors" />
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-[#05b3ad]/5 rounded-3xl border border-[#05b3ad]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
                  <Lightbulb className="w-16 h-16 text-[#05b3ad]" />
                </div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <Lightbulb className="text-[#05b3ad] w-5 h-5" />
                  <span className="text-[10px] font-black text-[#05b3ad] uppercase tracking-[0.3em]">
                    診斷建議 Recommendation
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-light italic relative z-10">
                  「當前供應鏈風險評分為全場最高，建議立即導入{' '}
                  <span className="text-[#05b3ad] font-bold">AI 自動化碳核算系統</span> 服務 1.3
                  以補足範疇三數據缺口。」
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Diagnostic Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="backdrop-blur-3xl bg-white/[0.02] border border-[#05b3ad]/20 rounded-[3rem] p-12 overflow-hidden relative shadow-2xl"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#05b3ad]/50 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {[
              {
                step: 1,
                label: '數據掃描',
                en: 'Data Scan',
                icon: Binary,
                desc: '自動化收集企業原始數據',
              },
              {
                step: 2,
                label: '深度分析',
                en: 'Deep Analysis',
                icon: Cpu,
                desc: 'AI 引擎進行多維度建模',
              },
              {
                step: 3,
                label: '健康診斷',
                en: 'Health Check',
                icon: Microscope,
                desc: '產出視覺化生命體徵報告',
              },
              {
                step: 4,
                label: '改善處方',
                en: 'Prescription',
                icon: Stethoscope,
                desc: '生成 ESG 優化行動策略',
                active: true,
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group relative cursor-default"
              >
                {i < 3 && (
                  <div className="absolute top-12 left-1/2 w-full h-[1px] bg-gradient-to-r from-[#05b3ad]/50 to-transparent hidden md:block" />
                )}
                <div
                  className={`size-24 rounded-full flex items-center justify-center mb-6 transition-all duration-700 relative z-10 border-2 ${step.active ? 'bg-[#05b3ad] text-[#0f2322] border-[#05b3ad] shadow-[0_0_25px_#05b3ad]' : 'bg-[#05b3ad]/10 text-[#05b3ad] border-[#05b3ad]/30 hover:border-[#05b3ad] hover:bg-[#05b3ad]/20'}`}
                >
                  <step.icon className="w-10 h-10" />
                </div>
                <h4
                  className={`text-xl font-black mb-2 ${step.active ? 'text-[#05b3ad]' : 'text-white'}`}
                >
                  {step.step}. {step.label}
                </h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
                  {step.en}
                </p>
                <p className="text-xs text-slate-400 font-light leading-relaxed max-w-[180px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-16 -right-16 opacity-[0.03] rotate-12">
            <Microscope className="w-[300px] h-[300px] text-[#05b3ad]" />
          </div>
        </motion.div>

        {/* Footer Meta */}
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 pb-10">
          <div className="flex items-center gap-6">
            <div className="size-10 text-[#05b3ad] opacity-60">
              <AwardIcon className="w-full h-full" />
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-loose">
              © 2024 DingJun Hong ESG Ecosystem.
              <br />
              <span className="text-[#05b3ad]/40">Tiffany Blue Diagnostic Protocol v2.1.0</span>
            </p>
          </div>
          <div className="flex gap-12">
            {['Privacy Policy', 'Terms of Service', 'Documentation'].map(link => (
              <a
                key={link}
                className="text-[10px] text-slate-500 hover:text-[#05b3ad] transition-colors font-black uppercase tracking-[0.2em]"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

// Internal mapping helper
const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const AwardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="3">
    <path
      clipRule="evenodd"
      d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
      fillRule="evenodd"
    />
  </svg>
);
