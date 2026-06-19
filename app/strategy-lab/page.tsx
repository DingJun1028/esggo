'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Brain, Shield, Sparkles, Send, Target, Rocket, Lock, 
  RefreshCw, Bot, TrendingUp, ChevronRight, BarChart3, 
  Layers, Database, PieChart, Activity, AlertTriangle, 
  Award, ArrowUpRight, ZapOff, Sparkle, Globe, Network
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { UniversalPageConfig } from '../../lib/page-config';
import { ConsensusVisualizer } from '../../components/ui/ConsensusVisualizer';
import { swarmConsensusEngine, ConsensusResult } from '../../lib/swarm-consensus-engine';
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

  const handleEvaluate = async () => {
    if (!proposal.trim()) return;
    setIsEvaluating(true);
    setResult(null);
    try {
      const consensusResult = await swarmConsensusEngine.evaluateProposal(proposal);
      setResult(consensusResult);
      showToast('蜂群共識已完成', 'success');
    } catch (e) {
      showToast('評估失敗', 'error');
    } finally {
      setIsEvaluating(false);
    }
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
    subtitle: 'Swarm Consensus · 自主進化模擬 · 5T 戰略封印。',
    icon: <Brain size={32} className="text-berkeley-blue" />,
    griReference: 'Governance / Self-Evolution',
    activeT5Tags: ['T2', 'T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'ai-growth', label: 'AI 進化建議', icon: <Sparkles size={16}/>, onClick: () => alert('OmniAgent 正在基於 5T 歷史數據計算進化路徑...') },
      { id: 'reset', label: '重置', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: () => { setProposal(''); setResult(null); } }
    ],

    kpis: [
      { key: 'consensus-rate', label: '蜂群共識率', value: '84', unit: '%', icon: <Activity size={18}/> },
      { key: 'evo-stage', label: '進化階段', value: 'OX-3', icon: <Layers size={18}/>, verified: true },
      { key: 'trust-score', label: '戰略信任分', value: '96.8', icon: <Award size={18} className="text-california-gold"/> },
    ],

    sections: [
      {
        id: 'mode-nav',
        title: '實驗室模式',
        columns: 12,
        component: (
          <Tabs 
            active={activeMode}
            onChange={(t) => setActiveTab(t as any)}
            tabs={[
              { key: 'consensus', label: '蜂群共識模擬 (Consensus)', icon: <Bot size={14}/> },
              { key: 'roadmap', label: '動態進化路徑 (Roadmap)', icon: <TrendingUp size={14}/> },
              { key: 'evolution', label: '架構自我成長 (Evo)', icon: <RefreshCw size={14}/> },
            ]}
            variant="pills"
          />
        )
      },
      {
        id: 'consensus-input',
        title: '戰略提案模擬',
        columns: 4,
        hidden: activeMode !== 'consensus',
        component: (
          <div className="space-y-6">
            <Card className="p-8 bg-white/60 backdrop-blur-xl border-white/60 shadow-glass relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">戰略願景 (Strategic Vision)</label>
                    <textarea 
                      className="w-full h-80 bg-slate-50/50 border border-slate-100/50 rounded-[2.5rem] p-8 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-berkeley-blue/5 outline-none transition-all resize-none leading-relaxed shadow-inner"
                      placeholder="請輸入您的企業戰略提案。例如：將全台 24 處營運據點轉化為 100% 綠電節點，並實施 5T 即時確信..."
                      value={proposal}
                      onChange={e => setProposal(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full h-16 text-base tracking-[0.2em] uppercase shadow-glass rounded-[2rem]"
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !proposal.trim()}
                    isLoading={isEvaluating}
                  >
                    {isEvaluating ? '召喚蜂群共識中...' : '啟動蜂群戰略審核'}
                    {!isEvaluating && <Sparkles size={20} className="ml-3" />}
                  </Button>
               </div>
               <Bot size={160} className="absolute -bottom-16 -left-16 text-slate-100 opacity-20 -rotate-12 pointer-events-none" />
            </Card>
          </div>
        )
      },
      {
        id: 'consensus-result',
        title: '蜂群決策結果',
        columns: 8,
        hidden: activeMode !== 'consensus',
        component: (
          <div className="h-full">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                   <Card className="p-8 bg-white/40 backdrop-blur-sm border-white/60 shadow-sm overflow-hidden">
                      <ConsensusVisualizer result={result} />
                   </Card>
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="p-8 bg-berkeley-blue rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
                   >
                      <div className="flex items-center gap-6 relative z-10">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-california-gold shadow-inner border border-white/10">
                            <Lock size={32} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1">5T Strategic Seal</p>
                            <code className="text-[12px] text-white/60 font-mono font-bold">sha256:ox_strat_{Math.random().toString(36).substring(7)}</code>
                         </div>
                      </div>
                      <Button variant="glass" className="w-full md:w-auto px-10 h-14 rounded-2xl border-white/20 text-white hover:bg-white/10 font-black relative z-10" onClick={handleSealStrategy}>
                         提交至永恆聖碑
                      </Button>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                         <Shield size={240} className="text-white" />
                      </div>
                   </motion.div>
                </motion.div>
              ) : isEvaluating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[500px] border border-slate-100 rounded-[3rem] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center shadow-inner">
                   <div className="relative">
                      <div className="w-28 h-28 rounded-full border-4 border-berkeley-blue/20 border-t-berkeley-blue animate-spin" />
                      <Brain size={48} className="absolute inset-0 m-auto text-berkeley-blue animate-pulse" />
                   </div>
                   <h3 className="text-2xl font-black text-berkeley-blue uppercase tracking-widest mt-10">多維度權重演算中</h3>
                   <div className="mt-6 space-y-3">
                       <p className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-3"><BrandStatusDot status="active" pulse /> Z0-Auditor 正在檢查法規合規性...</p>
                       <p className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-3"><BrandStatusDot status="active" pulse /> H1-Diplomat 正在模擬社會影響力...</p>
                   </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/50 text-slate-300 p-12 text-center group hover:border-berkeley-blue/20 transition-all">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                      <Rocket size={48} className="opacity-40" />
                   </div>
                   <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">等待提案提交</p>
                   <p className="text-[12px] mt-4 max-w-xs leading-relaxed font-medium text-slate-400/80">請在左側輸入您的企業願景，啟動 AI 自主治理流程。OmniAgent 將匯集所有專家的共識權重。</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {GROWTH_PATHWAYS.map((path, i) => (
              <Card key={i} hoverEffect className="p-10 bg-white/60 backdrop-blur-md border-white/80 shadow-glass relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-berkeley-blue/5 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center shadow-inner border border-berkeley-blue/10">
                    {i === 0 ? <Shield size={32}/> : i === 1 ? <Zap size={32} fill="currentColor"/> : <Globe size={32}/>}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-berkeley-blue mb-2 tracking-tight">{path.title}</h4>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{path.focus}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-black text-berkeley-blue/80 uppercase tracking-wider">預計達成: {path.target}</span>
                    <div className="flex items-center gap-1.5 text-verified font-black">
                      <TrendingUp size={16}/>
                      <span className="text-base">{path.impact}%</span>
                    </div>
                  </div>
                  <Button variant="primary" className="w-full h-12 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                    展開進化細節 <ArrowUpRight size={18} className="ml-2"/>
                  </Button>
                </div>
              </Card>
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
          <div className="p-20 bg-slate-50/50 rounded-[4rem] text-center space-y-10 relative overflow-hidden border border-white shadow-glass">
             <div className="relative z-10 space-y-6">
                <div className="w-32 h-32 rounded-[3rem] bg-white shadow-glass border border-white/80 mx-auto flex items-center justify-center relative group">
                   <RefreshCw size={56} className="text-berkeley-blue animate-spin-slow group-hover:text-california-gold transition-colors" />
                   <div className="absolute inset-0 rounded-full border-2 border-dashed border-berkeley-blue/20 animate-spin-slow-reverse" />
                </div>
                <h3 className="text-3xl font-black text-berkeley-blue uppercase tracking-tight">oX Self-Evolution Active</h3>
                <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed font-medium">
                   OmniAgent 正在即時監控全域數據流。當偵測到結構性治理模式時，系統將自動提議架構升級（如：新增 5T 驗證節點或擴展 Swarm 角色）。
                </p>
                <div className="pt-10">
                   <Badge variant="verified" className="px-10 py-3 rounded-full font-black text-sm shadow-sm tracking-[0.2em]">Current Tier: Autonomous OX-3</Badge>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[1.5] pointer-events-none">
                <Network size={600} className="text-berkeley-blue" />
             </div>
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
