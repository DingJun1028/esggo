'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Brain, Shield, Sparkles, Send, Target, Rocket, Lock, 
  RefreshCw, Bot, TrendingUp, ChevronRight, BarChart3, 
  Layers, Database, PieChart, Activity, AlertTriangle, 
  Award, ArrowUpRight, ZapOff, Sparkle, Globe, Network
} from 'lucide-react';
import { 
  BrandButton, BrandCard, BrandBadge, BrandPageHeader, 
  BrandCardHeader, StandardPage, BrandTabs, BrandStatusDot
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { ConsensusVisualizer } from '../../components/ui/ConsensusVisualizer';
import { swarmConsensusEngine, ConsensusResult } from '../../lib/swarm-consensus-engine';
import { cn } from '../../lib/utils';
import { useSystemEvolution } from '../../hooks/useSystemEvolution';

export default function StrategyLabPage() {
  const [activeMode, setActiveTab] = useState<'consensus' | 'roadmap' | 'evolution'>('consensus');
  const [proposal, setProposal] = useState('');
  const [result, setResult] = useState<ConsensusResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { submitEvolution } = useSystemEvolution();

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSealStrategy = async () => {
    if (!result) return;
    showToast('正在執行 5T 戰略封印...', 'info');
    await new Promise(r => setTimeout(r, 1500));
    await submitEvolution(proposal.substring(0, 30) + '...', result.consensusScore);
    showToast('戰略封印完成，系統架構已同步更新', 'success');
  };

  const GROWTH_PATHWAYS = [
    { title: '數位主權路徑 (T5 Sovereign)', focus: '5T 協議 & 自主算力', target: '2026 Q4', impact: 98 },
    { title: '零排放轉型路徑', focus: 'RE100 & 碳信用鏈', target: '2030 Q1', impact: 85 },
    { title: '社會共榮實驗室', focus: 'DEI 指標 & 供應鏈韌性', target: '2025 Q2', impact: 92 },
  ];

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'strategy-lab',
    title: '戰略與進化實驗室 Strategy Lab',
    subtitle: 'Swarm Consensus · 自主進化模擬 · 5T 戰略封印。由 Hermes AI 引導您的企業從數據治理走向主權進化。',
    icon: <Brain size={32} className="text-[#003262]" />,
    griReference: 'Governance / Self-Evolution',
    activeT5Tags: ['T2', 'T4', 'T5'],

    primaryActions: [
      { id: 'ai-growth', label: 'AI 進化建議', icon: <Sparkles size={16}/>, onClick: () => alert('Hermes 正在基於 5T 歷史數據計算進化路徑...') },
      { id: 'reset', label: '重置', icon: <RefreshCw size={16}/>, variant: 'outline', onClick: () => { setProposal(''); setResult(null); } }
    ],

    kpis: [
      { key: 'consensus-rate', label: '蜂群共識率', value: '84', unit: '%', icon: <Activity size={18}/> },
      { key: 'evo-stage', label: '進化階段', value: 'OX-3', icon: <Layers size={18}/>, verified: true },
      { key: 'trust-score', label: '戰略信任分', value: '96.8', icon: <Award size={18} className="text-amber-500"/> },
    ],

    sections: [
      {
        id: 'mode-nav',
        title: '實驗室模式',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeMode}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={[
              { id: 'consensus', label: '蜂群共識模擬 (Consensus)', icon: <Bot size={14}/> },
              { id: 'roadmap', label: '動態進化路徑 (Roadmap)', icon: <TrendingUp size={14}/> },
              { id: 'evolution', label: '架構自我成長 (Evo)', icon: <RefreshCw size={14}/> },
            ]}
          />
        )
      },
      {
        id: 'consensus-input',
        title: '戰略提案模擬',
        columns: 5,
        hidden: activeMode !== 'consensus',
        component: (
          <div className="space-y-6">
            <BrandCard padding="lg" className="border-none shadow-premium bg-white/80 backdrop-blur-md relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">戰略願景 (Strategic Vision)</label>
                    <textarea 
                      className="w-full h-64 bg-slate-50 rounded-[2rem] p-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none leading-relaxed"
                      placeholder="請輸入您的企業戰略提案。例如：將全台 24 處營運據點轉化為 100% 綠電節點，並實施 5T 即時確信..."
                      value={proposal}
                      onChange={e => setProposal(e.target.value)}
                    />
                  </div>
                  <BrandButton 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    className="h-16 text-base font-black shadow-xl"
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !proposal.trim()}
                    loading={isEvaluating}
                  >
                    {isEvaluating ? '召喚蜂群共識中...' : '啟動蜂群戰略審核'}
                    {!isEvaluating && <Sparkles size={18} className="ml-2" />}
                  </BrandButton>
               </div>
               <Bot size={120} className="absolute -bottom-10 -left-10 text-slate-100 opacity-50 -rotate-12" />
            </BrandCard>
          </div>
        )
      },
      {
        id: 'consensus-result',
        title: '蜂群決策結果',
        columns: 7,
        hidden: activeMode !== 'consensus',
        component: (
          <div className="h-full">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                   <ConsensusVisualizer result={result} />
                   <div className="mt-6 p-6 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FDB515]">
                            <Lock size={24} />
                         </div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-widest">5T Strategic Seal</p>
                            <p className="text-[10px] text-white/40 font-mono">sha256:ox_strat_{Math.random().toString(36).substring(7)}</p>
                         </div>
                      </div>
                      <BrandButton variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10" onClick={handleSealStrategy}>
                         提交至聖碑
                      </BrandButton>
                   </div>
                </motion.div>
              ) : isEvaluating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[400px] border border-slate-100 rounded-[3rem] bg-white/50 flex flex-col items-center justify-center p-12 text-center">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-blue-700 border-t-transparent animate-spin" />
                      <Brain size={40} className="absolute inset-0 m-auto text-blue-700 animate-pulse" />
                   </div>
                   <h3 className="text-xl font-black text-[#003262] uppercase tracking-widest mt-8">多維度權重演算中</h3>
                   <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2"><BrandStatusDot status="active" pulse size="xs"/> Z0-Auditor 正在檢查法規合規性...</p>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2"><BrandStatusDot status="active" pulse size="xs"/> H1-Diplomat 正在模擬社會影響力...</p>
                   </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/30 text-slate-300 p-12 text-center">
                   <Rocket size={48} className="opacity-20 mb-6" />
                   <p className="text-sm font-bold uppercase tracking-widest">等待提案提交</p>
                   <p className="text-[10px] mt-2 max-w-xs leading-relaxed">請在左側輸入您的企業願景，啟動 AI 自主治理流程。Hermes 將匯集所有專家的共識權重。</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )
      },
      {
        id: 'roadmap-view',
        title: 'AI 進化路徑建議',
        columns: 12,
        hidden: activeMode !== 'roadmap',
        component: (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GROWTH_PATHWAYS.map((path, i) => (
              <BrandCard key={i} hover padding="lg" className="border-none shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#003262] text-[#FDB515] flex items-center justify-center shadow-lg">
                    {i === 0 ? <Shield size={24}/> : i === 1 ? <Zap size={24}/> : <Globe size={24}/>}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#003262] mb-1">{path.title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{path.focus}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600">預計達成: {path.target}</span>
                    <div className="flex items-center gap-1 text-emerald-500 font-black">
                      <TrendingUp size={14}/>
                      <span className="text-sm">{path.impact}%</span>
                    </div>
                  </div>
                  <BrandButton variant="primary" fullWidth size="sm" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    展開進化細節 <ArrowUpRight size={14} className="ml-1"/>
                  </BrandButton>
                </div>
              </BrandCard>
            ))}
          </div>
        )
      },
      {
        id: 'evolution-visual',
        title: '系統自我成長狀態 (System Evolution)',
        columns: 12,
        hidden: activeMode !== 'evolution',
        component: (
          <div className="p-12 bg-slate-900 rounded-[3rem] text-center space-y-8 relative overflow-hidden border border-white/5">
             <div className="relative z-10 space-y-4">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20">
                   <RefreshCw size={48} className="text-white animate-spin-slow" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">oX Self-Evolution Active</h3>
                <p className="text-blue-100/50 text-sm max-w-xl mx-auto leading-relaxed">
                   Hermes 正在即時監控全域數據流。當偵測到結構性治理模式時，系統將自動提議架構升級（如：新增 5T 驗證節點或擴展 Swarm 角色）。
                </p>
                <div className="pt-8">
                   <BrandBadge variant="gold" size="md" className="px-6 py-2 rounded-full font-black">Current Tier: Autonomous OX-3</BrandBadge>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-[2] pointer-events-none">
                <Network size={400} className="text-white" />
             </div>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
