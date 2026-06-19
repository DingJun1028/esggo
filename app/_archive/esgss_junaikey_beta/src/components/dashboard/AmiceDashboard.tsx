import React, { useState } from 'react';
import {
  AutoAwesome,
  Psychology,
  Radar,
  Description,
  Verified,
  Database,
  Analytics,
  Lightbulb,
  IosShare,
  ModelTraining,
  Help,
  Calculate,
  Notifications,
  ArrowForward,
} from '@mui/icons-material'; // Actually the user used Material Symbols Outlined, I should use Lucide or similar mapping to match the look.
// I will use Lucide-react for the actual implementation for consistency with other components.
import {
  Sparkles,
  Brain,
  Radar as RadarIcon,
  FileText,
  ShieldCheck,
  Database as DbIcon,
  BarChart3,
  Lightbulb as BulbIcon,
  Share,
  GraduationCap,
  HelpCircle,
  Calculator,
  Bell,
  ChevronRight,
  UserCheck,
  Activity,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🧠 AI Strategy Hub (1.2) - Strategic Narrative & Stakeholder Alignment
 * --------------------------------------------------
 * Powered by Gemini-2.0. Focuses on educational ESG strategy.
 * Visualizes data-to-insight workflow and stakeholder sentiment.
 */
export const AmiceDashboard = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-[#0a1414] text-white min-h-screen font-sans flex flex-col selection:bg-[#0ABAB5]/30">
      {/* Header Area (Merged with App.tsx header but this dashboard has internal sub-nav) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Workflow Navigator */}
        <div className="bg-black/40 border-b border-white/10 px-8 py-4 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between max-w-5xl mx-auto overflow-x-auto gap-8 no-scrollbar">
            {[
              { label: 'Data Input', sub: 'Structured Assets', icon: DbIcon, active: true },
              { label: 'Processing', sub: 'Model Computation', icon: Activity, active: false },
              { label: 'Verification', sub: 'Logic Compliance', icon: ShieldCheck, active: false },
              { label: 'Insight', sub: 'Strategy Action', icon: BulbIcon, active: false },
            ].map((step, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-3 shrink-0 ${step.active ? 'opacity-100' : 'opacity-40'}`}
              >
                <div
                  className={`size-10 rounded-full border flex items-center justify-center ${step.active ? 'border-[#0ABAB5] bg-[#0ABAB5]/20 text-[#0ABAB5]' : 'border-white/20 bg-white/5 text-white/40'}`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] font-bold uppercase ${step.active ? 'text-[#0ABAB5]' : 'text-white/40'}`}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-white/60 leading-none whitespace-nowrap">
                    {step.sub}
                  </span>
                </div>
                {i < 3 && (
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-white/10 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Workspace Overlay with gradient */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a1414] to-[#0d1f1f] p-8 custom-scrollbar">
            {/* Page Heading and Action */}
            <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
              <div className="flex min-w-[280px] flex-col gap-2">
                <h1 className="text-white text-5xl font-black leading-tight tracking-tight">
                  1.2 AI Strategy Hub
                </h1>
                <p className="text-white/60 text-lg font-normal leading-normal max-w-xl">
                  Educational service-centric ESG methodology powered by{' '}
                  <span className="text-[#0ABAB5] font-bold">Gemini-2.0</span>.
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-lg h-12 px-6 bg-white/5 text-white text-sm font-bold border border-white/10 hover:bg-white/10 hover:border-[#0ABAB5]/50 transition-all shadow-lg active:scale-95">
                <Share className="w-4 h-4" />
                <span>EXPORT SUMMARY</span>
              </button>
            </div>

            {/* Top Indicator Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="backdrop-blur-xl bg-[#0f1e1e]/50 rounded-2xl p-6 flex flex-col gap-2 border-l-4 border-l-[#0ABAB5] shadow-[0_0_25px_rgba(10,186,181,0.12)] border border-[#0ABAB5]/20">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  Alignment Index
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-white text-3xl font-black">94.2%</p>
                  <p className="text-[#0ABAB5] text-xs font-bold">+2.4%</p>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#0ABAB5] h-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-[#0f1e1e]/50 rounded-2xl p-6 flex flex-col gap-2 border-l-4 border-l-white/10 border border-white/5">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  Stakeholder Sentiment
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-white text-3xl font-black">High</p>
                  <p className="text-[#0ABAB5] text-xs font-bold uppercase tracking-tight">
                    Optimistic
                  </p>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <div className="h-1.5 w-8 rounded-full bg-[#0ABAB5]"></div>
                  <div className="h-1.5 w-8 rounded-full bg-[#0ABAB5]"></div>
                  <div className="h-1.5 w-8 rounded-full bg-[#0ABAB5]"></div>
                  <div className="h-1.5 w-8 rounded-full bg-white/10"></div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-[#0f1e1e]/50 rounded-2xl p-6 flex flex-col gap-2 border-l-4 border-l-white/10 border border-white/5">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  Verification Node
                </p>
                <p className="text-white text-lg font-bold leading-tight">ISO-14064-1 Protocol</p>
                <div className="flex items-center gap-2 mt-2 text-[#0ABAB5]">
                  <ShieldCheck className="w-4 h-4" />
                  <p className="text-[10px] font-mono font-bold tracking-wider">
                    BLOCKCHAIN CONFIRMED
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Strategic Narrative Card */}
                <div className="backdrop-blur-2xl bg-[#0f1e1e]/50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-[#0ABAB5] w-5 h-5" />
                      <h3 className="text-white text-sm font-bold tracking-tight uppercase">
                        Gemini-2.0 Strategic Narrative
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <span className="size-1.5 rounded-full bg-[#0ABAB5]/30"></span>
                      <span className="size-1.5 rounded-full bg-[#0ABAB5]/60"></span>
                      <span className="size-1.5 rounded-full bg-[#0ABAB5] animate-pulse"></span>
                    </div>
                  </div>
                  <div className="p-8 space-y-8 text-white/80 leading-relaxed">
                    <p className="text-xl italic font-light text-white border-l-4 border-[#0ABAB5] pl-6 py-2 bg-[#0ABAB5]/5">
                      "Strategic synthesis of ISO-14064-1 data indicates your enterprise is
                      currently positioned in the upper quartile of net-zero alignment for the 2025
                      cycle."
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h4 className="text-[#0ABAB5] text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-[#0ABAB5]" /> Growth Vectors
                        </h4>
                        <ul className="space-y-3 text-sm">
                          <li className="flex gap-3 items-start">
                            <span className="text-[#0ABAB5] mt-1 shrink-0">
                              <ChevronRight className="w-3 h-3" />
                            </span>{' '}
                            Supply chain decarbonization optimization
                          </li>
                          <li className="flex gap-3 items-start">
                            <span className="text-[#0ABAB5] mt-1 shrink-0">
                              <ChevronRight className="w-3 h-3" />
                            </span>{' '}
                            Renewable energy tax credit harvesting
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                          Risk Mitigation
                        </h4>
                        <ul className="space-y-3 text-sm">
                          <li className="flex gap-3 items-start">
                            <span className="text-white/20 mt-1 shrink-0">
                              <ChevronRight className="w-3 h-3" />
                            </span>{' '}
                            Regulatory volatility in Tier 2 markets
                          </li>
                          <li className="flex gap-3 items-start">
                            <span className="text-white/20 mt-1 shrink-0">
                              <ChevronRight className="w-3 h-3" />
                            </span>{' '}
                            Scope 3 reporting latency issues
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-5 bg-[#0ABAB5]/10 rounded-2xl border border-[#0ABAB5]/20 flex items-start gap-4">
                      <Lightbulb className="text-[#0ABAB5] w-6 h-6 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                          Service-Centric Recommendation
                        </h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                          Transitioning to liquid-immersion cooling provides both ESG compliance and
                          a 4.5x multiplier on long-term brand equity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar Chart Card */}
                <div className="backdrop-blur-2xl bg-[#0f1e1e]/50 rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(10,186,181,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30" />
                  <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-8 relative z-10">
                    <RadarIcon className="text-[#0ABAB5] w-5 h-5" />
                    Stakeholder Impact Radar
                  </h3>

                  <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative size-56 shrink-0 flex items-center justify-center">
                      <div className="absolute inset-0 border border-[#0ABAB5]/10 rounded-full" />
                      <div className="absolute w-[75%] h-[75%] border border-white/5 rounded-full" />
                      <div className="absolute w-[50%] h-[50%] border border-white/5 rounded-full" />
                      <div className="absolute w-[25%] h-[25%] border border-white/5 rounded-full" />

                      {/* Placeholder Polygon since we can't easily draw dynamic SVG polygons here without more code */}
                      <svg
                        className="absolute w-full h-full drop-shadow-[0_0_12px_rgba(10,186,181,0.4)]"
                        viewBox="0 0 100 100"
                      >
                        <polygon
                          fill="rgba(10, 186, 181, 0.2)"
                          points="50,15 85,35 75,75 25,75 15,35"
                          stroke="#0ABAB5"
                          strokeWidth="1.5"
                        ></polygon>
                        {[
                          { x: 50, y: 15 },
                          { x: 85, y: 35 },
                          { x: 75, y: 75 },
                          { x: 25, y: 75 },
                          { x: 15, y: 35 },
                        ].map((pt, i) => (
                          <circle key={i} cx={pt.x} cy={pt.y} fill="#fff" r="1.5"></circle>
                        ))}
                      </svg>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-[10px] text-white/40 font-bold uppercase mb-1 tracking-widest">
                            Governance
                          </p>
                          <p className="text-sm font-bold text-[#0ABAB5] flex items-center gap-1">
                            High Alignment <ChevronRight className="w-3 h-3" />
                          </p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-[10px] text-white/40 font-bold uppercase mb-1 tracking-widest">
                            Investors
                          </p>
                          <p className="text-sm font-bold text-white flex items-center gap-1">
                            Stability Peak <ChevronRight className="w-3 h-3" />
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Cross-stakeholder sentiment analysis indicates a strong positive reception
                        to the transparency initiatives introduced in Q3.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Panel */}
              <aside className="flex flex-col gap-6">
                {/* Learning Sidebar */}
                <div className="backdrop-blur-2xl bg-[#0f1e1e]/50 rounded-3xl p-6 border border-white/10 border-t-2 border-t-[#0ABAB5] shadow-xl">
                  <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                    <GraduationCap className="text-[#0ABAB5] w-5 h-5" />
                    Learning Sidebar
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[#0ABAB5] text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                        Intelligence Engine
                      </h4>
                      <div className="bg-black/60 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="text-[#0ABAB5] w-4 h-4" />
                          <span className="text-xs font-bold text-white">
                            Gemini-2.0 Multi-modal
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Our core reasoning engine utilizes advanced few-shot prompting and
                          chain-of-thought processing to interpret complex ESG frameworks like
                          ISO-14064-1.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[#0ABAB5] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Strategic Methodology
                      </h4>
                      {[
                        {
                          step: '01',
                          title: 'Data Sourcing',
                          sub: 'Automated ingestion of IoT and ERP ESG metrics.',
                        },
                        {
                          step: '02',
                          title: 'Logic Mapping',
                          sub: 'Aligning raw data with compliance taxonomy.',
                        },
                        {
                          step: '03',
                          title: 'Narrative Synthesis',
                          sub: 'Transforming metrics into board-ready strategies.',
                        },
                      ].map(item => (
                        <div key={item.step} className="flex gap-4 items-start group">
                          <div className="size-7 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#0ABAB5] group-hover:bg-[#0ABAB5] group-hover:text-[#0a1414] transition-all">
                            {item.step}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-white/40 leading-tight">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 bg-[#0ABAB5]/10 rounded-2xl border border-[#0ABAB5]/20 relative overflow-hidden">
                      <div className="absolute -right-2 -bottom-2 opacity-5">
                        <HelpCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="text-[#0ABAB5] w-5 h-5" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Teacher Tip
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 leading-relaxed">
                        High alignment scores typically lead to lower cost of capital in green bond
                        markets. Monitor the "Investors" node on the radar for direct impact.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transparency Panel */}
                <div className="backdrop-blur-2xl bg-[#0f1e1e]/50 rounded-3xl p-6 border border-white/10 shadow-xl">
                  <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                    <Calculator className="text-white/40 w-5 h-5" />
                    Transparent Logic
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0ABAB5]/5 rounded-2xl border-l-4 border-[#0ABAB5] border-y border-r border-white/5">
                      <p className="text-[10px] text-[#0ABAB5] font-bold uppercase mb-1 tracking-widest leading-none">
                        Step 1: Inventory
                      </p>
                      <p className="text-xs text-white font-medium">
                        Direct GHGs identified across 14 facilities.
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border-l-4 border-white/20 border-y border-r border-white/10">
                      <p className="text-[10px] text-white/40 font-bold uppercase mb-1 tracking-widest leading-none">
                        Step 2: Quantification
                      </p>
                      <p className="text-xs text-white/60">
                        Mass balance approach applied to fuel consumption.
                      </p>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 border border-[#0ABAB5]/30 rounded-xl text-[10px] text-[#0ABAB5] font-bold hover:bg-[#0ABAB5]/10 transition-all uppercase tracking-widest">
                    View Audit Log
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
