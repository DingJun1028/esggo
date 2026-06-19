import React from 'react';
import {
  Lightbulb,
  TrendingUp,
  FileText,
  Hub,
  GraduationCap,
  MenuBook,
  CheckCircle2,
  RefreshCw,
  School,
  Terminal,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🗺️ Strategic Learning Roadmap (0.0)
 * --------------------------------------------------
 * Visual progression map for the ESGss JunAiKey ecosystem.
 * Features a vertical timeline with "Liquid Nodes".
 */
export const StrategyRoadmap = () => {
  return (
    <div className="bg-[#0a0c10] text-white min-h-screen font-display p-8 lg:p-12 overflow-x-hidden selection:bg-[#09abb3]/30">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[#0a0c10] -z-20" />
      <div className="fixed top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#09abb3]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#09abb3]/20 bg-[#09abb3]/5 mb-6"
        >
          <School className="text-[#09abb3] w-4 h-4 ml-1" />
          <span className="text-[10px] font-bold text-[#09abb3] tracking-widest uppercase">
            Education-Centric Philosophy
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white leading-tight"
        >
          0.0 專案戰略學習地圖
          <span className="block text-3xl md:text-4xl text-[#09abb3]/80 mt-2 font-display italic">
            Strategic Learning Journey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed"
        >
          Empowering DingJun stakeholders through a pedagogical progression path. From conceptual
          alignment to technical mastery in the ESGss JunAiKey ecosystem.
        </motion.p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Journey Line Decor */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#09abb3]/10 via-[#09abb3]/60 to-[#09abb3]/10 opacity-30 -translate-x-1/2 hidden lg:block" />

        <div className="space-y-32 relative">
          {/* Step 01 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="flex-1 lg:text-right">
              <motion.div
                whileHover={{ x: -10 }}
                className="backdrop-blur-[12px] bg-white/[0.03] p-8 rounded-3xl border border-white/10 border-r-4 border-r-[#09abb3] shadow-xl"
              >
                <span className="text-[#09abb3] font-bold text-[10px] tracking-[0.2em] uppercase mb-2 block font-mono">
                  Step 01: Onboarding
                </span>
                <h3 className="text-2xl font-bold mb-4">北極星共識 North Star Alignment</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Service Definition
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Strategic visioning workshops and baseline ESG value assessment for executive
                      alignment.
                    </p>
                  </div>
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Target Outcome
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      100% consensus on long-term sustainability goals and key performance
                      indicators.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="size-20 shrink-0 z-10 relative">
              <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(63, 225, 233, 0.4) 0%, rgba(9, 171, 171, 0.1) 100%) rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-[#0a0c10] border border-[#09abb3]/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[inset_0_0_15px_rgba(63,225,233,0.2),0_0_20px_rgba(9,171,171,0.2)] hover:border-[#09abb3]/60 hover:scale-110 transition-all duration-300">
                <Lightbulb className="text-[#09abb3] w-8 h-8" />
              </div>
            </div>
            <div className="flex-1 hidden lg:block" />
          </div>

          {/* Step 02 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="flex-1 hidden lg:block" />
            <div className="size-20 shrink-0 z-10 relative">
              <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(63, 225, 233, 0.4) 0%, rgba(9, 171, 171, 0.1) 100%) rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-[#0a0c10] border border-[#09abb3]/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[inset_0_0_15px_rgba(63,225,233,0.2),0_0_20px_rgba(9,171,171,0.2)] hover:border-[#09abb3]/60 hover:scale-110 transition-all duration-300">
                <TrendingUp className="text-[#09abb3] w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              <motion.div
                whileHover={{ x: 10 }}
                className="backdrop-blur-[12px] bg-white/[0.03] p-8 rounded-3xl border border-white/10 border-l-4 border-l-[#09abb3] shadow-xl"
              >
                <span className="text-[#09abb3] font-bold text-[10px] tracking-[0.2em] uppercase mb-2 block font-mono">
                  Step 02: Analytical Mastery
                </span>
                <h3 className="text-2xl font-bold mb-4">BI 數據素養 Data Intelligence</h3>
                <div className="space-y-4 text-left">
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Service Definition
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Interactive training modules on data ingestion, classification, and dashboard
                      interpretation.
                    </p>
                  </div>
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Target Outcome
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Autonomous ability to derive actionable insights from complex ESG data sets.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="flex-1 lg:text-right">
              <motion.div
                whileHover={{ x: -10 }}
                className="backdrop-blur-[12px] bg-white/[0.03] p-8 rounded-3xl border border-white/10 border-r-4 border-r-[#09abb3] shadow-xl"
              >
                <span className="text-[#09abb3] font-bold text-[10px] tracking-[0.2em] uppercase mb-2 block font-mono">
                  Step 03: Reporting Flow
                </span>
                <h3 className="text-2xl font-bold mb-4">揭露自動化 Report Generation</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Service Definition
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Hands-on tutorials for the automated ESG Disclosure Engine and compliance
                      mapping.
                    </p>
                  </div>
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Target Outcome
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Reduction of report preparation time by 70% with verified audit readiness.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="size-20 shrink-0 z-10 relative">
              <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(63, 225, 233, 0.4) 0%, rgba(9, 171, 171, 0.1) 100%) rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-[#0a0c10] border border-[#09abb3]/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[inset_0_0_15px_rgba(63,225,233,0.2),0_0_20px_rgba(9,171,171,0.2)] hover:border-[#09abb3]/60 hover:scale-110 transition-all duration-300">
                <FileText className="text-[#09abb3] w-8 h-8" />
              </div>
            </div>
            <div className="flex-1 hidden lg:block" />
          </div>

          {/* Step 04 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="flex-1 hidden lg:block" />
            <div className="size-20 shrink-0 z-10 relative">
              <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(63, 225, 233, 0.4) 0%, rgba(9, 171, 171, 0.1) 100%) rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-[#0a0c10] border border-[#09abb3]/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[inset_0_0_15px_rgba(63,225,233,0.2),0_0_20px_rgba(9,171,171,0.2)] hover:border-[#09abb3]/60 hover:scale-110 transition-all duration-300">
                <Hub className="text-[#3fe1e9] w-8 h-8 drop-shadow-[0_0_10px_rgba(63,225,233,0.5)]" />
              </div>
            </div>
            <div className="flex-1">
              <motion.div
                whileHover={{ x: 10 }}
                className="backdrop-blur-[24px] bg-[#09abb3]/5 rounded-3xl p-8 border border-[#09abb3]/30 border-l-4 border-l-[#3fe1e9] shadow-2xl"
              >
                <span className="text-[#3fe1e9] font-bold text-[10px] tracking-[0.2em] uppercase mb-2 block font-mono">
                  Step 04: Technical Backbone
                </span>
                <h3 className="text-2xl font-bold mb-4 [text-shadow:0_0_10px_rgba(9,171,179,0.5)] text-white">
                  5T 協議核心 5T Protocol Mastery
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Service Definition
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Technical certification for system architects on the underlying data protocols
                      and API integration.
                    </p>
                  </div>
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Target Outcome
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Stable, secure, and synchronized cross-platform data integrity across the
                      ecosystem.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Step 05 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            <div className="flex-1 lg:text-right">
              <motion.div
                whileHover={{ x: -10 }}
                className="backdrop-blur-[12px] bg-white/[0.03] p-8 rounded-3xl border border-white/10 border-r-4 border-r-[#09abb3] shadow-xl"
              >
                <span className="text-[#09abb3] font-bold text-[10px] tracking-[0.2em] uppercase mb-2 block font-mono">
                  Step 05: Continuous Growth
                </span>
                <h3 className="text-2xl font-bold mb-4">永續學院 Academy Ecosystem</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Service Definition
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Lifetime access to the ESG knowledge base and peer-to-peer learning community.
                    </p>
                  </div>
                  <div>
                    <p className="text-[#09abb3]/60 text-[10px] font-black uppercase mb-1 tracking-widest leading-none">
                      Target Outcome
                    </p>
                    <p className="text-sm text-white/80 leading-snug">
                      Ongoing organizational evolution and adaptation to global ESG regulation
                      changes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="size-20 shrink-0 z-10 relative">
              <div className="absolute inset-0 bg-radial-gradient(circle at 30% 30%, rgba(63, 225, 233, 0.4) 0%, rgba(9, 171, 171, 0.1) 100%) rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-[#0a0c10] border border-[#09abb3]/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-[inset_0_0_15px_rgba(63,225,233,0.2),0_0_20px_rgba(9,171,171,0.2)] hover:border-[#09abb3]/60 hover:scale-110 transition-all duration-300">
                <GraduationCap className="text-[#09abb3] w-8 h-8" />
              </div>
            </div>
            <div className="flex-1 hidden lg:block" />
          </div>
        </div>
      </div>

      <div className="mt-32 max-w-4xl mx-auto">
        <div className="backdrop-blur-[12px] bg-gradient-to-b from-[#09abb3]/10 to-transparent p-10 rounded-[2.5rem] text-center border border-[#09abb3]/20 shadow-2xl">
          <h4 className="text-2xl font-bold mb-8">學習即服務 Learning as a Service (LaaS)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="text-[#09abb3] flex justify-center mb-2">
                <MenuBook className="w-10 h-10 group-hover:scale-110 transition-transform" />
              </div>
              <h5 className="font-bold">Pedagogical Base</h5>
              <p className="text-xs text-white/50 leading-relaxed">
                Structured learning paths designed for diverse organizational roles.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="text-[#09abb3] flex justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
              </div>
              <h5 className="font-bold">Verification</h5>
              <p className="text-xs text-white/50 leading-relaxed">
                Milestone-based assessments ensuring true competency before progression.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="text-[#09abb3] flex justify-center mb-2">
                <RefreshCw className="w-10 h-10 group-hover:scale-110 transition-transform" />
              </div>
              <h5 className="font-bold">Iteration</h5>
              <p className="text-xs text-white/50 leading-relaxed">
                Cyclical learning loops that adapt to real-world project feedback.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 bg-[#0a0c10] px-8 py-6 mt-20 flex flex-col md:flex-row items-center justify-between text-[10px] text-white/30 uppercase tracking-[0.3em]">
        <div className="flex gap-8 mb-4 md:mb-0">
          <span className="flex items-center gap-2 font-bold">
            <span className="size-1.5 bg-[#09abb3] rounded-full animate-pulse"></span> System:
            Operational
          </span>
          <span className="flex items-center gap-2 font-bold">
            <span className="size-1.5 bg-[#09abb3] rounded-full"></span> Knowledge Nodes: 42 Active
          </span>
        </div>
        <div className="font-bold">© 2024 DingJun ESGss JunAiKey • Education-First Strategy</div>
      </footer>
    </div>
  );
};
