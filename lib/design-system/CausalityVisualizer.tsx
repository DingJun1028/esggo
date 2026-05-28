/**
 * 🔗 CausalityVisualizer - Tangible Perception of Integrity
 * v1.0 | #CausalityPillar #5TIntegrity #TangibleBeauty
 * 
 * 視覺化呈現數據的「因、循、果」軌跡。
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, CheckCircle } from 'lucide-react';
import { IEvidence } from '@/shared/types';

interface CausalityVisualizerProps {
  evidence: IEvidence;
  status?: string;
}

export const CausalityVisualizer: React.FC<CausalityVisualizerProps> = ({ 
  evidence, 
  status = 'Trustworthy' 
}) => {
  const steps = [
    { label: '因 (Cause)', icon: <Shield size={16} />, value: evidence.originCause, color: 'text-blue-500' },
    { label: '循 (Process)', icon: <Activity size={16} />, value: `${evidence.processTrace.length} 階刻印`, color: 'text-purple-500' },
    { label: '果 (Effect)', icon: <CheckCircle size={16} />, value: evidence.finalEffect, color: 'text-emerald-500' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-[var(--at-bg-glass)] backdrop-blur-[var(--at-glass-blur)] border border-[var(--at-border)] shadow-[var(--at-shadow)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--at-text-main)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          誠信脈動 (Integrity Pulse)
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          {status}
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* 連接線 (Desktop) */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 -translate-y-1/2 hidden md:block" />

        {steps.map((step, idx) => (
          <motion.div 
            key={step.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="relative z-10 flex flex-col items-center text-center p-3 rounded-xl bg-[var(--at-bg-card)] border border-[var(--at-border)] w-full md:w-32 shadow-sm"
          >
            <div className={`p-2 rounded-full bg-slate-50 mb-2 ${step.color}`}>
              {step.icon}
            </div>
            <p className="text-[10px] font-bold text-[var(--at-text-sub)] mb-1 uppercase">{step.label}</p>
            <p className="text-[11px] font-medium text-[var(--at-text-main)] truncate w-full" title={step.value}>
              {step.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
