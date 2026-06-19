/**
 * 🎯 Sustainability War Room - Impact Radar (B3)
 * --------------------------------------------------
 * [Function] Multi-factor External Risk Analysis (PESTEL) & Strategic Advice
 * [Style] High-end Futuristic
 * [Interaction] PESTEL Factor Interaction, Impact Index Dashboard
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  ShieldAlert,
  Zap,
  Globe,
  Scale,
  TrendingUp,
  Activity,
  Cpu,
  Leaf,
  AlertTriangle,
  ChevronRight,
  Crosshair,
  Terminal,
  Bot,
} from 'lucide-react';

// --- Type Definitions ---

interface RiskFactor {
  id: string;
  name: string;
  score: number; // 0-100
  description: string;
  trend: 'up' | 'down' | 'stable';
  details: string[];
}

interface Strategy {
  id: string;
  factorId: string;
  title: string;
  type: '防禦' | '轉型' | '機會';
  content: string;
  aiInsight: string;
  confidence: number;
}

// --- Mock Data ---

const MOCK_FACTORS: Record<string, RiskFactor> = {
  political: {
    id: 'political',
    name: '政治 (Political)',
    score: 75,
    description: '地緣政治緊張局勢升溫，CBAM 碳關稅政策即將實施',
    trend: 'up',
    details: ['歐盟 CBAM 申報要求變嚴', '供應鏈地緣政治風險指數上升'],
  },
  economic: {
    id: 'economic',
    name: '經濟 (Economic)',
    score: 62,
    description: '全球通膨壓力趨緩，但綠色融資成本仍高',
    trend: 'stable',
    details: ['碳權交易價格波動加劇', '綠色債券發行利率變動'],
  },
  social: {
    id: 'social',
    name: '社會 (Social)',
    score: 45,
    description: 'DEI (多元共融) 意識抬頭，需關注員工福祉',
    trend: 'down',
    details: ['Z 世代對企業永續形象要求提高', '勞工權益法規更新'],
  },
  technological: {
    id: 'technological',
    name: '技術 (Technological)',
    score: 88,
    description: 'AI 算力能耗激增，數位轉型迫在眉睫',
    trend: 'up',
    details: ['生成式 AI 應用普及', 'IoT 能源管理系統需求增加'],
  },
  environmental: {
    id: 'environmental',
    name: '環境 (Environmental)',
    score: 92,
    description: '極端氣候事件頻發，水資源管理風險極高',
    trend: 'up',
    details: ['極端降雨導致營運中斷風險', '生物多樣性揭露要求 (TNFD)'],
  },
  legal: {
    id: 'legal',
    name: '法律 (Legal)',
    score: 68,
    description: 'IFRS S1/S2 準則接軌，合規成本上升',
    trend: 'up',
    details: ['國內金管會年報編制新規定', '個資保護法規修訂'],
  },
};

const MOCK_STRATEGIES: Strategy[] = [
  {
    id: 's1',
    factorId: 'environmental',
    title: '氣候韌性強化計畫',
    type: '防禦',
    content: '建立極端氣候預警機制，強化廠區防洪設施。導入 TCFD 框架進行財務衝擊量化分析。',
    aiInsight: '根據歷史氣象數據模擬，該區域未來 5 年強降雨機率增加 30%，建議優先編列防洪預算。',
    confidence: 95,
  },
  {
    id: 's2',
    factorId: 'legal',
    title: '供應鏈碳數據合規自動化',
    type: '轉型',
    content: '部署自動化碳盤查系統，對接上下游供應商數據，確保 CBAM 申報資料合規性。',
    aiInsight: '自動化可降低 80% 人工申報錯誤率，並縮短 60% 準備時間。',
    confidence: 88,
  },
  {
    id: 's3',
    factorId: 'technological',
    title: 'AI 能源優化部署',
    type: '機會',
    content: '利用 AI 演算法優化空調與製程用電，降低 Scope 2 排放並節省能源成本。',
    aiInsight: '預估可節省 12-15% 年度電力支出，ROI 預計於 1.5 年內回收。',
    confidence: 92,
  },
];

// --- Components ---

export const ImpactRadar: React.FC = () => {
  const [selectedFactor, setSelectedFactor] = useState<RiskFactor>(MOCK_FACTORS.environmental!);

  // Calculate Overall Impact Index (Average)
  const impactIndex = Math.round(
    Object.values(MOCK_FACTORS).reduce((acc, curr) => acc + curr.score, 0) / 6
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_60%)]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left: Dashboard & Factor Selection */}
        <div className="lg:col-span-4 space-y-6">
          {/* Overall Impact Index Dashboard */}
          <GlassCard className="p-8 text-center relative overflow-hidden group">
            <motion.div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-slate-400 text-sm font-bold tracking-widest mb-4 flex items-center justify-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              GLOBAL IMPACT INDEX
            </h2>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" fill="none" stroke="#1e293b" strokeWidth="12" />
                <motion.circle
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: impactIndex / 100 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#impact-gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="1 1"
                />
                <defs>
                  <linearGradient id="impact-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                  {impactIndex}
                </span>
                <span className="text-xs text-cyan-300 font-bold bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800/50 mt-1">
                  CRITICAL LEVEL
                </span>
              </div>
            </div>
          </GlassCard>

          {/* PESTEL 因子選擇器 */}
          <div className="grid grid-cols-2 gap-3">
            {Object.values(MOCK_FACTORS).map(factor => (
              <FactorButton
                key={factor.id}
                factor={factor}
                isSelected={selectedFactor.id === factor.id}
                onClick={() => setSelectedFactor(factor)}
              />
            ))}
          </div>
        </div>

        {/* Center: Factor Details & AI Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFactor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6 h-full border-t-4 border-t-cyan-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-950/50 rounded-lg border border-cyan-800/50 text-cyan-400">
                      {getIcon(selectedFactor.id)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedFactor.name}</h3>
                      <p className="text-slate-400 text-sm">Risk Assessment Protocol</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyan-400">{selectedFactor.score}</div>
                    <div className="text-xs text-slate-500">RISK SCORE</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-cyan-200 text-sm font-bold mb-2 flex items-center gap-2">
                    <Crosshair size={14} /> SITUATION ANALYSIS
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedFactor.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-cyan-200 text-sm font-bold flex items-center gap-2">
                    <Terminal size={14} /> KEY INDICATORS
                  </h4>
                  {selectedFactor.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/50 p-3 rounded border-l-2 border-cyan-500/50 flex items-start gap-3"
                    >
                      <AlertTriangle size={16} className="text-yellow-500 mt-1 shrink-0" />
                      <span className="text-slate-300 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Strategic Response */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              STRATEGIC RESPONSE
            </h3>
            <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded border border-yellow-400/20">
              AI GENERATED
            </span>
          </div>

          <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {MOCK_STRATEGIES.filter(s => s.factorId === selectedFactor.id).map(strategy => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}

            {MOCK_STRATEGIES.filter(s => s.factorId === selectedFactor.id).length === 0 && (
              <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                No specific strategies generated for this factor yet.
              </div>
            )}

            {/* Global Strategy */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-slate-500 text-xs font-bold mb-3 uppercase">
                Recommended Cross-Domain Actions
              </h4>
              <StrategyCard strategy={MOCK_STRATEGIES[2]!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const GlassCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl ${className}`}
  >
    {children}
  </div>
);

const FactorButton = ({
  factor,
  isSelected,
  onClick,
}: {
  factor: RiskFactor;
  isSelected: boolean;
  onClick: () => void;
}) => {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
        isSelected
          ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
          : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded ${
            factor.trend === 'up'
              ? 'bg-red-500/20 text-red-400'
              : factor.trend === 'down'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate-500/20 text-slate-400'
          }`}
        >
          {factor.trend === 'up' ? '↗ RISING' : factor.trend === 'down' ? '↘ FALLING' : '→ STABLE'}
        </span>
        <span className={`font-mono font-bold ${getScoreColor(factor.score)}`}>{factor.score}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
          {getIcon(factor.id)}
        </div>
        <span
          className={`font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}
        >
          {factor.name.split(' ')[0]}
        </span>
      </div>

      {isSelected && (
        <motion.div
          layoutId="outline"
          className="absolute inset-0 border-2 border-cyan-500 rounded-xl"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const StrategyCard = ({ strategy }: { strategy: Strategy }) => (
  <GlassCard className="p-4 border-l-4 border-l-yellow-400 hover:bg-slate-800/50 transition-colors cursor-pointer group">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-yellow-400 px-2 py-0.5 bg-yellow-400/10 rounded border border-yellow-400/20">
        {strategy.type} STRATEGY
      </span>
      <span className="text-xs text-slate-500 font-mono">CONF: {strategy.confidence}%</span>
    </div>
    <h4 className="font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
      {strategy.title}
    </h4>
    <p className="text-slate-400 text-xs mb-3 line-clamp-2">{strategy.content}</p>
    <div className="bg-slate-950/50 p-2 rounded text-xs text-cyan-300 border border-cyan-900/30 flex gap-2">
      <Bot size={14} className="shrink-0 mt-0.5" />
      <span>{strategy.aiInsight}</span>
    </div>
  </GlassCard>
);

const getIcon = (id: string) => {
  switch (id) {
    case 'political':
      return <Globe size={18} />;
    case 'economic':
      return <TrendingUp size={18} />;
    case 'social':
      return <Activity size={18} />;
    case 'technological':
      return <Cpu size={18} />;
    case 'environmental':
      return <Leaf size={18} />;
    case 'legal':
      return <Scale size={18} />;
    default:
      return <AlertTriangle size={18} />;
  }
};
