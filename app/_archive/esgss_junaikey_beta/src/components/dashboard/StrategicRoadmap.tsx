import React from 'react';
import {
  Search,
  Sparkles,
  BarChart3,
  Navigation,
  Target,
  Milestone,
  Brain,
  Info,
  Users,
  GitBranch,
  Bot,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Lightbulb,
  Zap,
  Map,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🗺️ Strategic Roadmap (Service 2.4)
 * --------------------------------------------------
 * "Sustainability Transformation Advisor" for 洪鼎竣.
 * Features "Path of Light" visualization and liquid glass aesthetics.
 */
export const StrategicRoadmap = () => {
  const phases = [
    {
      id: 'p1',
      title: '現狀評估 Current Assessment',
      phase: 'Phase 01',
      desc: '分析鼎鈞鴻現有商業模式之環境足跡與社會影響力基準點。',
      status: 'completed',
      icon: Compass,
    },
    {
      id: 'p2',
      title: '策略制定 Strategy Formulation',
      phase: 'Phase 02',
      desc: '建構符合 ESG 規範的轉型框架，並整合利害關係人期待。',
      status: 'active',
      icon: Lightbulb,
    },
    {
      id: 'p3',
      title: '執行路徑 Execution Roadmap',
      phase: 'Phase 03',
      desc: '部署低碳技術、循環經濟模組及數位管理系統。',
      status: 'pending',
      icon: Zap,
    },
    {
      id: 'p4',
      title: '績效追蹤 Performance Tracking',
      phase: 'Phase 04',
      desc: '即時監控 ESG KPI，產出符合國際標準的永續報告書。',
      status: 'pending',
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 overflow-x-hidden">
      {/* Floating Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[5%] left-[10%] size-96 bg-[#0ab8b2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] size-[500px] bg-[#0ab8b2]/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1240px] mx-auto px-8 md:px-16 py-12 relative">
        {/* Page Heading Overlay */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none text-white">
              2.4 永續轉型顧問
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-[#0ab8b2] text-xl font-bold tracking-tight uppercase">
                Sustainability Transformation Advisor
              </p>
              <p className="text-white/60 text-lg font-light">
                引領 <span className="text-white font-medium">丁俊宏 (DingJun Hong)</span>{' '}
                邁向液態玻璃質感的永續未來
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-3xl bg-white/[0.03] border border-[#0ab8b2]/30 px-8 py-6 rounded-[2rem] flex items-center gap-6 border-l-4 border-l-[#0ab8b2] shadow-2xl"
          >
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                目前階段 Current Stage
              </p>
              <p className="text-white font-black text-xl tracking-tight">
                策略制定中 Strategy Formulation
              </p>
            </div>
            <Sparkles className="text-[#0ab8b2] size-10 animate-pulse" />
          </motion.div>
        </div>

        {/* Global Progress Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 mb-16 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0ab8b2]/40 to-transparent" />

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <BarChart3 className="text-[#0ab8b2] size-8" />
                <p className="text-white text-xl font-black tracking-tight leading-none">
                  轉型路徑進度：策略制定階段
                </p>
              </div>
              <p className="text-[#0ab8b2] text-4xl font-black italic tracking-tighter">65%</p>
            </div>

            <div className="h-4 rounded-full bg-white/5 overflow-hidden relative p-1 border border-white/5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'circOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#0ab8b2]/20 via-[#0ab8b2] to-[#0ab8b2]/20 shadow-[0_0_20px_#0ab8b2] relative"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-20" />
              </motion.div>
            </div>

            <p className="text-white/40 text-sm font-medium italic tracking-tight">
              「光之徑 (Path of Light)」正在動態引導中，確保轉型每一步皆符合 GRI 標準。
            </p>
          </div>
        </motion.div>

        {/* Path of Light Visualization Section */}
        <section className="mb-24 relative px-4">
          <div className="flex items-center gap-6 mb-16">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#0ab8b2]" />
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
              策略轉型核心：光之路徑{' '}
              <span className="text-[#0ab8b2]/40 font-light not-italic ml-4 text-xl">
                The Path of Light
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-x-12 relative">
            {/* Liquid Timeline Rail */}
            <div className="flex flex-col items-center relative">
              <div className="absolute inset-0 flex justify-center py-4">
                <div className="w-[4px] bg-white/5 rounded-full h-full relative overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 2, delay: 1 }}
                    className="w-full bg-gradient-to-b from-[#0ab8b2] via-[#0ab8b2] to-transparent shadow-[0_0_15px_#0ab8b2]"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-between h-[1000px] py-2 relative z-10 font-black">
                {phases.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.2 }}
                    className={`size-16 rounded-full border-4 flex items-center justify-center transition-all duration-700 shadow-2xl ${p.status === 'completed' ? 'bg-[#0ab8b2] border-[#0ab8b2] text-[#102222]' : p.status === 'active' ? 'bg-[#102222] border-[#0ab8b2] text-[#0ab8b2] shadow-[0_0_30px_#0ab8b2]' : 'bg-[#102222] border-white/10 text-white/20'}`}
                  >
                    <p.icon className="size-8" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timeline Content Matrix */}
            <div className="space-y-24 py-2">
              {phases.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.2 }}
                  className={`group relative transition-all duration-700 ${p.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div
                    className={`flex flex-col gap-4 ${p.status === 'active' ? 'backdrop-blur-3xl bg-white/[0.04] border border-[#0ab8b2]/30 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(10,184,178,0.1)] border-l-8 border-l-[#0ab8b2]' : 'px-4'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={`text-sm font-black uppercase tracking-[0.3em] ${p.status === 'active' ? 'text-[#0ab8b2]' : 'text-white/30'}`}
                      >
                        {p.phase}
                      </p>
                      {p.status === 'completed' && (
                        <CheckCircle2 className="text-[#0ab8b2] size-5" />
                      )}
                      {p.status === 'active' && (
                        <span className="bg-[#0ab8b2] text-[#102222] text-[9px] font-black px-3 py-1 rounded-full animate-pulse tracking-widest uppercase">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-2xl font-black tracking-tight transition-colors ${p.status === 'active' ? 'text-white' : 'text-white/80 group-hover:text-[#0ab8b2]'}`}
                    >
                      {p.title}
                    </h3>
                    <p
                      className={`text-lg font-light leading-relaxed max-w-3xl ${p.status === 'active' ? 'text-white/80' : 'text-white/40'}`}
                    >
                      {p.desc}
                    </p>

                    {p.status === 'active' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-white/[0.03] border border-white/5 rounded-3xl flex gap-6 items-center shadow-inner"
                      >
                        <div className="size-12 rounded-2xl bg-[#0ab8b2]/10 flex items-center justify-center text-[#0ab8b2]">
                          <Brain className="size-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-black text-xs uppercase tracking-widest">
                            JunAi 智慧洞察 AI Insight
                          </p>
                          <p className="text-sm text-white/50 font-light">
                            目前 SASB 半導體產業指標顯示，
                            <span className="text-[#0ab8b2]/80 font-bold italic">
                              能源管理效率
                            </span>{' '}
                            為轉型重中之重。
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Strategic Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24 px-4">
          {[
            {
              title: '利害關係人對齊',
              en: 'Stakeholder Alignment',
              icon: Users,
              desc: '確保投資者、員工及供應鏈夥伴對丁俊宏的永續目標達成共識，降低轉型阻力並建立信任感。',
              items: ['投資人 ESG 期待分析', '供應鏈碳中和倡議', '內部永續文化培訓'],
            },
            {
              title: '價值主張重塑',
              en: 'Value Proposition Reconstruction',
              icon: GitBranch,
              desc: '重新定義核心業務競爭力，將環境足跡與社會貢獻整合進品牌的核心價值中。',
              items: ['循環經濟產品設計', '永續品牌定位升級', '社會影響力價值量化'],
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-2xl group border-b-4 border-b-[#0ab8b2]/20 hover:border-b-[#0ab8b2] transition-all"
            >
              <div className="size-16 rounded-[1.5rem] bg-[#0ab8b2]/10 flex items-center justify-center text-[#0ab8b2] mb-8 ring-1 ring-[#0ab8b2]/20 shadow-xl group-hover:scale-110 transition-transform">
                <card.icon className="size-8" />
              </div>
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-black tracking-tight">{card.title}</h3>
                <p className="text-[#0ab8b2] text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                  {card.en}
                </p>
                <p className="text-white/40 leading-relaxed font-light">{card.desc}</p>
              </div>
              <div className="pt-8 border-t border-white/5 grid grid-cols-1 gap-4">
                {card.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group/item">
                    <ArrowRight className="size-4 text-[#0ab8b2]/40 group-hover/item:text-[#0ab8b2] group-hover/item:translate-x-1 transition-all" />
                    <span className="text-sm font-bold text-white/60 group-hover/item:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Advisor Interface Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-3xl bg-gradient-to-r from-[#0ab8b2]/10 via-transparent to-transparent border border-white/5 rounded-[3rem] p-12 px-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_0_50px_rgba(10,184,178,0.05)]"
        >
          <div className="flex items-center gap-8 group">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-[#0ab8b2]/20 blur-2xl rounded-full"
              />
              <div className="relative size-20 rounded-full bg-[#102222] border-2 border-[#0ab8b2] flex items-center justify-center shadow-2xl">
                <Bot className="size-10 text-[#0ab8b2] group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full border-4 border-[#102222] shadow-lg animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-black text-2xl tracking-tight italic">
                ESGss JunAi 已準備就緒
              </p>
              <p className="text-[#0ab8b2]/60 text-base font-medium tracking-tight uppercase tracking-widest">
                您的專屬永續轉型 AI 助手正在待命
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <button className="flex-1 px-12 py-5 backdrop-blur-3xl bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl">
              查看詳細報告 Full Report
            </button>
            <button className="flex-1 px-12 py-5 bg-[#0ab8b2] text-[#102222] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(10,184,178,0.4)] hover:brightness-110 active:scale-95 transition-all">
              開始下一階段 Next Phase
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};
