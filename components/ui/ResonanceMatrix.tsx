'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BrandCard, BrandBadge } from '../brand';
import { ResonanceResult } from '../../lib/governance-engine';
import { cn } from '../../lib/utils';

interface Props {
  results: ResonanceResult[];
}

export function ResonanceMatrix({ results }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r) => {
          const isDissonant = r.resonance < 70;
          
          return (
            <BrandCard key={r.topicId} padding="md" className="border-slate-100 shadow-sm transition-all hover:border-blue-200 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xs font-black text-berkeley-blue uppercase tracking-tight">{r.label}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Resonance: {r.resonance}%</p>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  isDissonant ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {isDissonant ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase">
                    <Target size={10} className="text-blue-500" />
                    Internal
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(r.internalPriority / 5) * 100}%` }} className="h-full bg-blue-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase">
                    <Users size={10} className="text-purple-500" />
                    Stakeholder
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(r.stakeholderPriority / 5) * 100}%` }} className="h-full bg-purple-600" />
                  </div>
                </div>
              </div>

              {isDissonant && (
                <div className="mt-3 p-2 bg-amber-50/50 rounded-lg border border-amber-100/50">
                  <p className="text-[9px] text-amber-700 font-medium leading-tight">
                    ⚠️ 策略失焦：外部利害關係人期望與內部優先級存在顯著偏差。
                  </p>
                </div>
              )}
            </BrandCard>
          );
        })}
      </div>

      {/* Summary Chart Area */}
      <BrandCard padding="lg" className="bg-gradient-to-br from-slate-900 to-berkeley-blue text-white border-none shadow-premium overflow-hidden relative">
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary-300">共鳴矩陣分析 (Resonance Map)</h3>
              <p className="text-xs text-primary-100 opacity-60">Visualizing Strategy vs. Expectations</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Overall Alignment</p>
              <p className="text-2xl font-black font-mono">
                {Math.round(results.reduce((acc, r) => acc + r.resonance, 0) / (results.length || 1))}%
              </p>
            </div>
          </div>

          {/* Simple Scatter Simulation */}
          <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 relative p-8">
            {/* Axis */}
            <div className="absolute left-8 bottom-8 right-8 h-px bg-white/20" />
            <div className="absolute left-8 bottom-8 top-8 w-px bg-white/20" />
            <span className="absolute left-10 bottom-2 text-[8px] font-black text-white/30 uppercase">內部優先級 (Internal Priority)</span>
            <span className="absolute left-2 top-10 -rotate-90 text-[8px] font-black text-white/30 uppercase origin-left">外部期望 (External Exp.)</span>

            {results.map((r, i) => (
              <motion.div
                key={r.topicId}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  left: `${(r.internalPriority / 5) * 80 + 10}%`, 
                  bottom: `${(r.stakeholderPriority / 5) * 80 + 10}%` 
                }}
                className="absolute w-4 h-4"
              >
                <div className={cn(
                  "w-full h-full rounded-full border-2 border-white/50 shadow-lg cursor-help group/dot relative",
                  r.resonance > 80 ? "bg-emerald-500" : r.resonance > 60 ? "bg-blue-500" : "bg-amber-500"
                )}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-berkeley-blue px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {r.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <Zap size={150} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
      </BrandCard>
    </div>
  );
}
