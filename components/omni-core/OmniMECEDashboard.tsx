'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, Activity } from 'lucide-react';
import { meceEngine, MECEExecutionLog, OMNI_MECE_PRINCIPLES, OmniMECEKey } from '@/lib/omni-core/omni-mece-engine';

export default function OmniMECEDashboard() {
  const [logs, setLogs] = useState<MECEExecutionLog[]>([]);
  const [gaps, setGaps] = useState<OmniMECEKey[]>([]);

  useEffect(() => {
    // Poll the MECE Engine for logs and gaps
    const interval = setInterval(() => {
      setLogs([...meceEngine.getLogs()].reverse().slice(0, 5)); // Last 5 logs
      setGaps(meceEngine.generateGapAnalysis());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalScore = logs.reduce((acc, log) => acc + log.impactMetric, 0);

  return (
    <div className="relative bg-[#020617]/60 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 mt-8 overflow-hidden group w-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 border-b border-indigo-500/20 pb-4">
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" />
          MECE 極限進化法則分析儀 (Live)
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-widest">累積進化能量</p>
            <p className="text-xl font-mono text-indigo-400 font-bold">{totalScore} <span className="text-xs text-slate-500">T/E</span></p>
          </div>
          <Activity className="text-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* 左側：近期進化日誌 */}
        <div>
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Zap size={16} className="text-amber-400" /> 近期進化日誌 (Recent Evolution)
          </h3>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-slate-500 italic">尚未偵測到進化事件，系統處於寂靜狀態...</p>
            ) : (
              logs.map((log, idx) => (
                <motion.div 
                  key={`${log.timestamp}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-black/40 border border-white/5 rounded-lg text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200">{log.event}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {log.principleKeys.map(k => {
                      const p = OMNI_MECE_PRINCIPLES[k];
                      return (
                        <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {p?.name}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* 右側：進化缺口分析 (Gap Analysis) */}
        <div>
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Target size={16} className="text-emerald-400" /> 短板診斷 (Gap Analysis)
          </h3>
          <p className="text-xs text-slate-400 mb-4">以下法則在近期運行中尚未被觸發，建議排程對應之優化任務以達「無縫接軌」與「最佳實踐」。</p>
          
          <div className="flex flex-wrap gap-2">
            {gaps.length === 0 ? (
              <p className="text-sm text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck size={16} /> 所有法則皆已落實，系統處於圓滿狀態！
              </p>
            ) : (
              gaps.map(k => {
                const p = OMNI_MECE_PRINCIPLES[k];
                return (
                  <div key={k} className="group relative">
                    <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50 cursor-help transition-colors hover:bg-slate-700/50">
                      {p?.name}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-slate-700 text-[10px] text-slate-300 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      {p?.desc}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
