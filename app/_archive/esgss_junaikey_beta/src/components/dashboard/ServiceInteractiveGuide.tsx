import React, { useState } from 'react';
import {
  Radio,
  BarChart3,
  Lightbulb,
  Settings2,
  Activity,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle2,
  Zap,
  History,
  Sparkles,
  Rocket,
  Layers,
  Search,
  Leaf,
  FileDown,
  Network,
  Lock,
  Waves,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🌊 Service Interactive Guide (5T Logic Flow)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" aesthetic with refraction effects.
 * Merges "Dynamic Service Guidance" and "Interactive Teaching Path".
 * REFACTORED: Use Lucide icons only.
 */
export const ServiceInteractiveGuide = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: '01',
      title: '數據感測 Data Sensing',
      fullTitle: '服務初始化 (數據感測)',
      icon: Radio,
      desc: '利用高精度液態玻璃感應技術，即時捕捉環境參數與 ESG 指標數據，建立服務生態系的基礎動態模型。',
      techNote: '定義初步目標與架構，建立 ESG 基準線。',
      outcome: '明確的路線圖與關鍵指標設定',
      status: '執行中 (85%)',
      stats: '94.2%',
      statsLabel: '感測器節點同步率',
      tags: ['技術效能', '透明度提升'],
      color: '#0df2df',
    },
    {
      id: '02',
      title: '核心策略規劃 Strategy',
      fullTitle: '核心策略規劃 (智慧分析)',
      icon: BarChart3,
      desc: '制定 ESG 核心競爭力，將流體玻璃技術融入企業流程。建立 5T 門徑的策略對接矩陣。',
      techNote: '透過 AI 引擎進行產業對標，優化減碳成本。',
      outcome: '提升 25% 運營透明度與法規合規性。',
      status: '準備中',
      stats: '72%',
      statsLabel: '策略模擬完成度',
      tags: ['AI 驅動', '策略加速'],
      color: '#0df2df',
    },
    {
      id: '03',
      title: '實施與執行 Implementation',
      fullTitle: '系統實施 (決策建議)',
      icon: Layers,
      desc: '驅動流體玻璃技術部署與數據自動採集。將策略轉化為具體的 IT 技術架構。',
      techNote: '自動化數據鏈路配置，確保數據不可篡改. ',
      outcome: '降低 40% 的報表生成時間。',
      status: '等待中',
      stats: '0%',
      statsLabel: '部署準備率',
      tags: ['自動化', '5T 合規'],
      color: '#0df2df',
    },
    {
      id: '04',
      title: '成效分析 Evaluation',
      fullTitle: '成效分析 (執行優化)',
      icon: Search,
      desc: '監控減排計畫成效，對比基準線並輸出動態差異報表。',
      techNote: '實時追蹤 ROI 與環境社會影響力。',
      outcome: '獲得第三方認證的年度審核。',
      status: '待啟動',
      stats: 'N/A',
      statsLabel: '數據匯總',
      tags: ['動態監控', '報告輸出'],
      color: '#0df2df',
    },
    {
      id: '05',
      title: '永續優化 Growth',
      fullTitle: '永續優化 (反饋監控)',
      icon: Leaf,
      desc: '進入閉環學習循環，持續優化 ESG 績效並擴展至全球供應鏈。',
      techNote: '長期的組織文化轉型與永續領導力培養。',
      outcome: '實現淨零碳排與社會影響力最大化。',
      status: '願景',
      stats: '∞',
      statsLabel: '永續價值',
      tags: ['教育賦能', '長期價值'],
      color: '#0df2df',
    },
  ];

  const current = steps[activeStep] ||
    steps[0] || {
      title: 'Loading...',
      icon: Shield,
      description: 'Initializing Guide...',
      technical: 'N/A',
      outcome: 'Pending',
      status: 'Pending',
      stats: 'N/A',
      statsLabel: 'Loading',
      tags: [],
      color: '#0df2df',
    };

  return (
    <div className="bg-[#102221] text-white min-h-screen overflow-x-hidden relative font-display selection:bg-[#0df2df]/20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-[#0df2df]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-[#0df2df]/8 rounded-full blur-[140px]" />
      </div>

      <div className="flex flex-col h-full grow">
        <main className="flex flex-1 px-8 lg:px-10 py-8 gap-8 max-w-[1600px] mx-auto w-full">
          <aside className="w-72 flex flex-col gap-6 shrink-0 hidden xl:flex">
            <div className="flex h-full min-h-[600px] flex-col justify-between backdrop-blur-xl bg-[#283938]/60 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                  <h1 className="text-white text-xl font-bold leading-normal tracking-tight">
                    服務路徑導引
                  </h1>
                  <p className="text-[#9cbab7] text-xs font-normal leading-normal uppercase tracking-widest opacity-60">
                    Interactive 5T Logic Flow
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {steps.map((step, i) => {
                    const isActive = activeStep === i;
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all cursor-pointer group ${isActive ? 'bg-[#0df2df]/20 border border-[#0df2df]/40 text-[#0df2df] shadow-[0_0_20px_rgba(13,242,223,0.15)]' : 'text-[#9cbab7] hover:bg-white/5 border border-transparent'}`}
                      >
                        <step.icon
                          className={`w-5 h-5 ${isActive ? 'text-[#0df2df]' : 'text-[#9cbab7] group-hover:text-white'}`}
                        />
                        <p
                          className={`text-sm font-bold leading-none ${isActive ? 'text-[#0df2df]' : 'group-hover:text-white'}`}
                        >
                          {step.title.split(' ')[0]}
                        </p>
                        {isActive && (
                          <motion.div
                            layoutId="indicator"
                            className="ml-auto size-1.5 rounded-full bg-[#0df2df]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0df2df]/5 border border-[#0df2df]/20 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-[#0df2df] uppercase tracking-widest">
                      實時指標
                    </span>
                    <Zap className="text-[#0df2df] w-4 h-4 animate-pulse" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1 tracking-tighter">
                    {current.stats}
                  </div>
                  <p className="text-[#9cbab7] text-[10px] font-medium opacity-60 uppercase">
                    {current.statsLabel}
                  </p>
                </div>
                <button className="flex w-full items-center justify-center rounded-2xl h-14 bg-[#0df2df]/10 text-[#0df2df] border border-[#0df2df]/30 text-sm font-bold hover:bg-[#0df2df] hover:text-[#102221] transition-all shadow-lg active:scale-95 group">
                  <span className="truncate">查看完整報告</span>
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-8">
            <div className="flex flex-wrap justify-between items-end gap-6 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#0df2df]/20 text-[#0df2df] text-[10px] font-bold px-3 py-1 rounded-full border border-[#0df2df]/30 uppercase tracking-[0.2em]">
                    Active Node
                  </span>
                  <span className="text-white/20 text-xs font-mono">
                    GATE {activeStep + 1} {'// 5T_PROTOCOL_STABLE'}
                  </span>
                </div>
                <h2 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-tighter mb-2">
                  動態服務流程導引
                </h2>
                <p className="text-[#9cbab7] text-xl font-light leading-normal max-w-2xl">
                  ESG All In One —{' '}
                  <span className="text-[#0df2df] font-bold underline decoration-[#0df2df]/30 underline-offset-8 decoration-2">
                    {current.title.split(' ')[0]}節點
                  </span>
                </p>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center justify-center rounded-2xl h-14 px-8 bg-[#283938] text-white text-sm font-bold border border-[#3b5452] hover:bg-[#3b5452] transition-all shadow-xl">
                  <FileDown className="w-4 h-4 mr-2" />
                  <span>下載流程圖</span>
                </button>
                <button
                  onClick={() => setActiveStep(prev => (prev + 1) % steps.length)}
                  className="flex items-center justify-center rounded-2xl h-14 px-8 bg-[#0df2df] text-[#102221] text-sm font-black hover:brightness-110 transition-all shadow-xl shadow-[#0df2df]/10 active:scale-95"
                >
                  <span>下一步</span>
                </button>
              </div>
            </div>

            <div className="relative flex-1 rounded-[3rem] border border-white/5 bg-gradient-to-br from-[#102221] to-[#162a29] overflow-hidden group shadow-2xl min-h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative z-10"
                    >
                      <div className="absolute inset-0 scale-[1.8] blur-3xl rounded-full bg-[#0df2df]/20 animate-pulse pointer-events-none" />
                      <div className="relative size-64 md:size-72 rounded-full border-2 border-[#0df2df]/60 bg-[#102221] flex flex-col items-center justify-center gap-4 shadow-[0_0_60px_rgba(13,242,223,0.3)] backdrop-blur-md">
                        <current.icon size={80} className="text-[#0df2df]" />
                        <div className="flex flex-col items-center text-center">
                          <span className="text-white/40 font-bold tracking-[0.4em] text-[10px] uppercase mb-1">
                            STEP {current.id}
                          </span>
                          <span className="text-[#0df2df] font-black text-2xl md:text-3xl tracking-tight">
                            {current.title.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
