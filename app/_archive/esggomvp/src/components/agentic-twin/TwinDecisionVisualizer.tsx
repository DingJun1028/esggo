'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ITwinDecision } from '@/core/omni-types';

interface TwinDecisionVisualizerProps {
  decision: ITwinDecision;
  compact?: boolean;
}

/**
 * 💠 TwinDecisionVisualizer: Premium 5T Protocol Visualization
 * Style: LiquidGlass Aura
 */
export const TwinDecisionVisualizer: React.FC<TwinDecisionVisualizerProps> = ({ 
  decision, 
  compact = false 
}) => {
  const metadata = decision.metadata5T;
  
  const scores = useMemo(() => {
    if (!metadata) return [];
    return [
      { label: 'Truth', score: metadata.tangible.score, color: '#63a6b0' }, // Aqua 青
      { label: 'Traceable', score: metadata.traceable.score, color: '#ffd700' }, // 永恆金
      { label: 'Trackable', score: metadata.trackable.score, color: '#52C41A' }, // 成功綠
      { label: 'Transparent', score: metadata.transparent.score, color: '#63a6b0' }, // Aqua 青
      { label: 'Trust', score: metadata.trustworthy.score, color: '#ffd700' }, // 永恆金
    ];
  }, [metadata]);

  if (!metadata) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
        <p className="text-sm text-gray-500">Awaiting 5T Verification...</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl ${compact ? 'max-w-md' : 'w-full'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Agentic Decision Audit</h3>
          <p className="text-xs text-white/60 font-mono">{decision.decisionId}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${decision.status === 'VALIDATED' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
            {decision.status}
          </span>
          <span className="text-2xl font-black text-white mt-1">
            {Math.round(decision.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {scores.map((s, idx) => (
          <div key={s.label} className="relative">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-white/80">{s.label}</span>
              <span className="text-xs font-mono text-white/60">{Math.round(s.score * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.score * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}80` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="text-sm font-semibold text-white/90 mb-3">5T Reasoning Cluster</h4>
        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
          <p className="text-sm text-white/70 leading-relaxed italic">
            "{decision.recommendation}"
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(metadata).map(([key, val]) => (
          <div key={key} className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{key}</p>
            <p className="text-xs text-white/80 truncate max-w-[120px]">{(val as any).details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
