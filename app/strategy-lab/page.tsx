'use client';

import { useState } from 'react';
import { 
  Zap, Brain, Shield, Sparkles, Send, 
  Target, Rocket, Lock, RefreshCw, Bot 
} from 'lucide-react';
import { 
  BrandButton, BrandCard, BrandBadge, BrandPageHeader, 
  BrandCardHeader, StandardPage 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { ConsensusVisualizer } from '../../components/ui/ConsensusVisualizer';
import { swarmConsensusEngine, ConsensusResult } from '../../lib/swarm-consensus-engine';
import { motion, AnimatePresence } from 'framer-motion';

export default function StrategyLabPage() {
  const [proposal, setProposal] = useState('');
  const [result, setResult] = useState<ConsensusResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!proposal.trim()) return;
    setIsEvaluating(true);
    setResult(null);
    
    // AI simulation delay
    await new Promise(r => setTimeout(r, 2000));
    
    const res = await swarmConsensusEngine.evaluateProposal(proposal);
    setResult(res);
    setIsEvaluating(false);
  };

  const pageConfig: UniversalPageConfig = {
    id: 'strategy-lab',
    title: '戰略實驗室 Strategy Lab',
    subtitle: 'Swarm Consensus · 自主決策模擬 · 5T 戰略封印：由多維度 AI 蜂群共同審核您的企業戰略。',
    icon: <Target size={32} />,
    griReference: 'Governance Strategic',
    activeT5Tags: ['T2', 'T4', 'T5'],
    primaryActions: [
      { id: 'reset', label: '重置提案', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: () => { setProposal(''); setResult(null); } }
    ],
    sections: [
      {
        id: 'input',
        title: '戰略提案輸入',
        columns: 12, // Stack on mobile
        lgColumns: 6, // Side by side on large
        component: (
          <div className="space-y-6">
            <BrandCard padding="md sm:padding-lg" className="border-none shadow-premium bg-white/80 backdrop-blur-md">
              <BrandCardHeader title="提案內容" subtitle="Input Strategic Vision" />
              <div className="mt-6 sm:mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">戰略目標 (Strategic Proposal)</label>
                  <textarea 
                    className="w-full h-40 sm:h-48 bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none"
                    placeholder="例如：計畫在 2030 年前全面汰換老舊發電設備..."
                    value={proposal}
                    onChange={e => setProposal(e.target.value)}
                  />
                </div>
                
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-start gap-3">
                   <Bot size={18} className="text-purple-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-purple-700 leading-relaxed font-medium">
                      提議將由 **Omni-Swarm** 的四位專業代理人進行獨立評估。
                   </p>
                </div>

                <BrandButton 
                  variant="primary" 
                  fullWidth 
                  size="lg" 
                  className="h-14 sm:h-16 text-base font-black shadow-xl"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !proposal.trim()}
                  loading={isEvaluating}
                >
                  {isEvaluating ? '召喚中...' : '啟動蜂群戰略審核'}
                  {!isEvaluating && <Sparkles size={18} className="ml-2" />}
                </BrandButton>
              </div>
            </BrandCard>
          </div>
        )
      },
      {
        id: 'result',
        title: '蜂群決策分析',
        columns: 12,
        lgColumns: 6,
        component: (
          <div className="h-full">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                   <ConsensusVisualizer result={result} />
                </motion.div>
              ) : isEvaluating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full border-2 border-slate-100 rounded-[3rem] bg-white/50 flex flex-col items-center justify-center p-12 text-center">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-blue-700 border-t-transparent animate-spin" />
                      <Brain size={40} className="absolute inset-0 m-auto text-blue-700 animate-pulse" />
                   </div>
                   <h3 className="text-xl font-black text-berkeley-blue uppercase tracking-widest mt-8">多維度權重演算中</h3>
                   <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
                      Z0-Auditor 正在檢查法規合規性...<br/>
                      H1-Diplomat 正在模擬社會影響力...<br/>
                      V4-Sentinel 正在驗證數據封印完整性...
                   </p>
                </motion.div>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/30 text-slate-300 p-12 text-center">
                   <div className="w-20 h-20 rounded-[2.5rem] bg-white shadow-sm flex items-center justify-center mb-6"><Rocket size={40} className="opacity-20" /></div>
                   <p className="text-sm font-bold uppercase tracking-widest">等待提案提交</p>
                   <p className="text-[10px] mt-2 max-w-xs uppercase tracking-wider">請在左側輸入您的企業願景，啟動 AI 自主治理流程。</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return <StandardPage config={pageConfig} />;
}
