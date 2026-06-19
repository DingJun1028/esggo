import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Coins,
  Zap,
} from 'lucide-react';

export const EvolutionLoopPanel: React.FC = () => {
  const [activeFeedback, setActiveFeedback] = useState<any | null>(null);

  const mockFeedback = [
    {
      id: 'fb_1',
      stakeholder: '投資者 A (ESG 基金)',
      message: '對於第 342 頁的「減碳算法」期待更嚴謹的披露，特別是範疇三的數據核實方式。',
      type: 'QUERY',
      impact: 'HIGH',
      confidence: 95,
    },
    {
      id: 'fb_2',
      stakeholder: '利害關係人 B (員工代表)',
      message: '建議將「身心韌性計畫」的細節擴展到所有遠端辦公的同仁。',
      type: 'SUGGESTION',
      impact: 'MEDIUM',
      confidence: 88,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">
              永續進化環 (Evolution Loop)
            </h3>
            <p className="text-[10px] text-slate-500">利害關係人共鳴與智慧裁決系統</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <Zap size={10} className="text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400">真理之鏡 Active</span>
        </div>
      </div>

      {/* Feedback List */}
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
        {mockFeedback.map(f => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => setActiveFeedback(f)}
            className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400">{f.stakeholder}</span>
              <span
                className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                  f.impact === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}
              >
                {f.impact} IMPACT
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2">{f.message}</p>
          </motion.div>
        ))}
      </div>

      {/* Adjudication Overlay (Mirror of Truth) */}
      <AnimatePresence>
        {activeFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col p-6"
          >
            <div className="mb-6 flex items-center gap-2">
              <ArrowRightLeft className="text-amber-400" size={18} />
              <h4 className="text-sm font-black text-white uppercase tracking-widest">
                真理之鏡：智慧裁決
              </h4>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500">反饋內容</span>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed">
                  {activeFeedback.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex flex-col items-center">
                  <ShieldCheck size={16} className="text-emerald-400 mb-1" />
                  <span className="text-[9px] text-slate-500">誠信建議</span>
                  <span className="text-xs font-black text-emerald-400">接受且更新</span>
                </div>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex flex-col items-center">
                  <Coins size={16} className="text-amber-400 mb-1" />
                  <span className="text-[9px] text-slate-500">自信度</span>
                  <span className="text-xs font-black text-amber-400">
                    {activeFeedback.confidence}%
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 italic text-center">
                奧秘精靈建議：「根據 Microsoft 最新算法典範，建議採納此優化方案以提升報告公信力。」
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setActiveFeedback(null)}
                className="py-3 bg-slate-800 text-slate-400 text-sm font-bold rounded-xl hover:text-white"
              >
                略過
              </button>
              <button
                onClick={() => {
                  alert('已執行裁決：數據將自動同步至任務清單。');
                  setActiveFeedback(null);
                }}
                className="py-3 bg-blue-500 text-slate-950 text-sm font-black rounded-xl hover:bg-blue-400 shadow-lg shadow-blue-500/20"
              >
                確認執行進化
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
