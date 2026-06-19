import React from 'react';
import {
  Monitor,
  Notifications,
  AccountCircle,
  Psychology,
  // HealthMetrics, // Not exported from @mui/icons-material
  TrendingUp,
  RebaseEdit,
  Home,
  Insights,
  MedicalServices,
  Settings,
} from '@mui/icons-material';
import {
  Radar,
  Hexagon,
  Zap,
  Target,
  ShieldCheck,
  BrainCircuit,
  Activity,
  BarChart3,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 📈 Strategy & Diagnosis Mobile (Service 1.2 & 2.1 Mobile)
 * --------------------------------------------------
 * "AI Strategy Hub & Corporate Health Check" for DingJun Hong.
 * Features: Strategy Carousel, Hexagonal Radar Chart, Vital Metrics Grid.
 */
export const StrategyDiagnosisMobile = () => {
  const strategyCards = [
    {
      title: '供應鏈優化建議',
      desc: '預計提升運營效率 15%，降低物流成本。',
      tag: 'Priority',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC8uJV4KXUOwDmJrLz0kPN2MGNrD4IgzMZ4KJm4iEqZ8t05gIG_FC3LwmdvYILaDugieJ7tgW27ZuVTsNmbnS-BAamYgK898pC-rsL_ge6lhfmcDCS9HCLv-VM7lZxUsgA3_QD2q8YtoJcvlO3r5iDOzBwj4Bbv8igxqqmC-6WQFTrWdvVSYD_OyJRpnA3oIIzFaBVSgF3MBtPnUYahbGWTFtJwykY6uVtNMKVqfb6oU7GXK-XvIzLhqx7lJafxDw8p0WIJgloaLLc',
    },
    {
      title: '市場擴張動能',
      desc: '東南亞新興市場 ESG 規範符合性分析。',
      tag: 'Growth',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCWCWxXrulpkXfY6D4s6gPEUMtxthMST41CcE1CrDp9ulZsoEEoVMxNZRz9EIaaznNt74zKLZmszUsTprH8qTD6MF9xlm2BP75HJ9ovFU8UIXBna_o7vdZmyOPuk6kgqpnYkH43kI-23FdAbeH9Voc7V7_JXNwDMfOokO2Az366LtuQPHTueILfq6mwps0JN8TjYYZUyQqLp90Rd5-6Y5yKIczDcx7fsdfTMcY5dOou3dFSx0YHNJK516jZOvj3cBiAzvrFZShsW1Y',
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 flex flex-col relative pb-32 max-w-[480px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#0ab8b208,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#0a1b1b]/80 border-b border-[#0ab8b2]/20 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-[#0ab8b2] rounded-lg flex items-center justify-center text-white shadow-lg">
            <Monitor style={{ fontSize: '20px' }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">
              策略與診斷 1.2 / 2.1
            </h1>
            <p className="text-[9px] text-[#0ab8b2] font-black uppercase tracking-widest mt-1 opacity-80">
              Strategy & Diagnosis
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="size-11 flex items-center justify-center rounded-xl bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 text-[#0ab8b2] active:scale-90 transition-all">
            <Notifications style={{ fontSize: '20px' }} />
          </button>
          <button className="size-11 flex items-center justify-center rounded-xl bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 text-[#0ab8b2] active:scale-90 transition-all">
            <AccountCircle style={{ fontSize: '20px' }} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 py-8 space-y-12">
        {/* Section 1.2: AI Strategy Hub */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-3">
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <Psychology className="text-[#0ab8b2]" /> AI 戰略洞察 Strategy Hub
            </h2>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#0ab8b2] animate-pulse" />
              <span className="text-[9px] text-[#0ab8b2] font-black uppercase tracking-widest">
                Live Updates
              </span>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-6 no-scrollbar pb-4 px-1">
            {strategyCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[320px] backdrop-blur-3xl bg-white/[0.03] border border-[#0ab8b2]/30 rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-2xl group cursor-pointer hover:border-[#0ab8b2]/60 transition-all"
              >
                <div
                  className="w-full h-40 rounded-2xl bg-cover bg-center relative overflow-hidden shadow-inner"
                  style={{ backgroundImage: `url('${card.image}')` }}
                >
                  <div className="w-full h-full bg-[#0ab8b2]/20 flex items-end p-4">
                    <span className="bg-[#0ab8b2] text-[#102222] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                      {card.tag}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic text-white tracking-tighter group-hover:text-[#0ab8b2] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-white/40 text-sm font-light italic leading-relaxed tracking-tight">
                    {card.desc}
                  </p>
                </div>
                <button className="w-full py-4 bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#102222] font-black rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                  查看詳情 View Insight <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2.1: Corporate Health Check */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-3">
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <Activity className="text-[#0ab8b2]" /> 企業生命徵象 Health Metrics
            </h2>
            <div className="flex items-center gap-2 text-emerald-400 font-black italic text-xs">
              <TrendingUp fontSize="small" /> +5.2%
            </div>
          </div>

          {/* Radar Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="backdrop-blur-3xl bg-gradient-to-br from-[#0ab8b2]/10 to-transparent border border-[#0ab8b2]/30 rounded-[3rem] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5)] flex flex-col gap-10"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] text-[#0ab8b2] font-black uppercase tracking-[.4em]">
                  綜合健康評分 Total Score
                </p>
                <h3 className="text-5xl font-black italic text-white tracking-tighter flex items-baseline gap-2 leading-none">
                  88{' '}
                  <span className="text-lg font-black text-white/20 not-italic uppercase tracking-widest">
                    / 100
                  </span>
                </h3>
              </div>
              <div className="px-5 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                優異良好 Excellent
              </div>
            </div>

            {/* Radar Chart SVG */}
            <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center group/chart">
              <svg
                className="w-full h-full transform -rotate-18 animate-pulse-slow"
                viewBox="0 0 200 200"
              >
                {/* Hexagon Grid */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgba(10, 184, 178, 0.05)"
                  strokeWidth="1"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke="rgba(10, 184, 178, 0.05)"
                  strokeWidth="1"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  fill="none"
                  stroke="rgba(10, 184, 178, 0.05)"
                  strokeWidth="1"
                />

                <polygon
                  className="text-[#0ab8b2]/10"
                  fill="none"
                  points="100,20 169.3,60 169.3,140 100,180 30.7,140 30.7,60"
                  stroke="currentColor"
                />

                {/* Animated Data Shape */}
                <motion.polygon
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: 'backOut' }}
                  fill="url(#radarGrad)"
                  points="100,40 150,70 160,130 100,160 50,130 60,80"
                  stroke="#0ab8b2"
                  strokeJoin="round"
                  strokeWidth="3"
                  className="drop-shadow-[0_0_15px_rgba(10,184,178,0.4)]"
                />

                <defs>
                  <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#0ab8b2', stopOpacity: 0.5 }} />
                    <stop offset="100%" style={{ stopColor: '#0ab8b2', stopOpacity: 0.1 }} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Labels */}
              <div className="absolute inset-0 flex flex-col justify-between items-center pointer-events-none p-4 py-6">
                <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest">
                  財務 FNC
                </span>
                <div className="flex justify-between w-full">
                  <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest">
                    市場 MKT
                  </span>
                  <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest">
                    創新 INN
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest">
                    員工 HR
                  </span>
                  <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest">
                    環境 ENV
                  </span>
                </div>
                <span className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest">
                  治理 GVN
                </span>
              </div>
            </div>

            {/* Vital Metrics Grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: '財務穩健度 Stability', val: '92%', positive: true },
                { label: 'ESG 符合度 Compliance', val: '84%', positive: true },
              ].map((metric, i) => (
                <div
                  key={i}
                  className="backdrop-blur-3xl bg-white/5 border border-white/5 p-5 rounded-2xl border-l-[6px] border-l-[#0ab8b2] shadow-inner"
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 italic leading-none mb-2">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-black italic text-white tracking-tighter">
                    {metric.val}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Floating Strategy Action Button */}
      <button className="fixed bottom-28 right-6 size-16 bg-[#0ab8b2] text-[#102222] rounded-full shadow-[0_15px_40px_rgba(10,184,178,0.4)] flex items-center justify-center z-40 active:scale-95 border-4 border-[#102222] transition-transform animate-bounce-slow">
        <RebaseEdit style={{ fontSize: '28px' }} />
      </button>

      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-24 backdrop-blur-3xl bg-[#0a1b1b]/90 border-t border-[#0ab8b2]/20 px-8 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {[
          { icon: Home, label: '首頁' },
          { icon: Insights, label: '戰略', active: true },
          { icon: MedicalServices, label: '診斷' },
          { icon: Settings, label: '設定' },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-[#0ab8b2] scale-110 active:scale-95' : 'text-white/20 hover:text-white'}`}
          >
            <item.icon
              style={{ fontSize: '26px' }}
              className={item.active ? 'drop-shadow-[0_0_8px_#0ab8b2]' : ''}
            />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
        @keyframes pulse-slow {
           0%, 100% { opacity: 1; transform: rotate(-18deg) scale(1); }
           50% { opacity: 0.8; transform: rotate(-18deg) scale(0.98); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        @keyframes bounce-slow {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
