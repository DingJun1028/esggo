'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Activity, CheckCircle2, ChevronRight, Zap, GripHorizontal, Minimize2, Maximize2, ShieldCheck } from 'lucide-react';
import { useOmniTable } from '@/hooks/useOmniTable';
import { useOmniAgentBus } from '@/lib/omni-agent-bus';

// =========================================================================
// OmniAgent Pulse - Liquid Glass Floating UI
// =========================================================================
export function OmniAgentPulse() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { connectionStatus, records } = useOmniTable('valid-jwt-token');
  const { signals, activeResonance } = useOmniAgentBus();
  const constraintsRef = useRef(null);

  // Derive status from records
  const lastSyncRecord = records.length > 0 ? records[0] : null;
  const isSyncing = connectionStatus === 'CONNECTED' && Math.random() > 0.5; // Simulated active syncing state
  const timeSinceLastSync = lastSyncRecord 
    ? Math.floor((Date.now() - lastSyncRecord.timestamp) / 1000)
    : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" ref={constraintsRef}>
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        initial={{ x: 20, y: typeof window !== 'undefined' ? window.innerHeight - 250 : 500 }}
        className="absolute pointer-events-auto shadow-2xl flex flex-col"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.8 }}
              className="w-[340px] bg-slate-950/30 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-cyan-500/20"
            >
              {/* Liquid Gloss Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent z-20"></div>
              
              {/* Header / Drag Handle */}
              <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 p-3 border-b border-cyan-500/20 flex items-center justify-between cursor-grab active:cursor-grabbing group">
                <div className="flex items-center gap-2">
                  <GripHorizontal size={14} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-xs font-bold font-mono text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                    <Bot size={14} /> OmniCommander
                  </span>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <Minimize2 size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Mission Status */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Mission</span>
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Activity size={10} className={activeResonance ? 'animate-ping text-emerald-400' : (connectionStatus === 'CONNECTED' ? 'animate-pulse' : '')} /> 
                      {activeResonance ? 'RESONATING' : connectionStatus}
                    </span>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-lg p-2.5">
                    <h4 className="text-xs font-bold text-white mb-1">SYNC_OMNIBLUE_OMNITABLE</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Maintaining bidirectional 5T protocol synchronization across Logic Nodes and Hash Locks.
                    </p>
                  </div>
                </div>

                {/* Real-time Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col items-center text-center">
                    <ShieldCheck size={14} className="text-emerald-400 mb-1" />
                    <span className="text-[10px] text-slate-500">ZKP Seals</span>
                    <span className="text-sm font-black text-white">{records.length}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col items-center text-center">
                    <Zap size={14} className={isSyncing ? "text-cyan-400" : "text-slate-600"} />
                    <span className="text-[10px] text-slate-500">Last Sync</span>
                    <span className="text-sm font-black text-white">{lastSyncRecord ? `${timeSinceLastSync}s ago` : '--'}</span>
                  </div>
                </div>

                {/* Log Stream */}
                <div className="bg-black/50 border border-white/5 rounded-lg p-2 h-[80px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-10" />
                  <div className="space-y-1 relative z-0 flex flex-col justify-end h-full font-mono text-[9px]">
                    {signals.length > 0 ? signals.slice(0, 3).map((s) => (
                      <div key={s.id} className="flex gap-2 text-slate-400 opacity-80">
                        <span className="text-emerald-500">[{new Date(s.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-amber-400">[{s.type}]</span>
                        <span className="truncate">{s.source}</span>
                      </div>
                    )) : records.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex gap-2 text-slate-400 opacity-80">
                        <span className="text-cyan-500">[{new Date(r.timestamp).toLocaleTimeString()}]</span>
                        <span className="truncate">{r.event_type} locked</span>
                      </div>
                    ))}
                    {records.length === 0 && (
                      <div className="text-slate-600">Awaiting resonance...</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-full p-2 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-cyan-500/30 flex items-center gap-3 pr-5 cursor-pointer relative overflow-hidden"
            >
              {/* Gloss Highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"></div>
              
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center relative border border-cyan-400/20">
                <Bot size={22} className="text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-ping opacity-20" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none drop-shadow-md">OmniAgent</span>
                <span className="text-[10px] font-mono text-cyan-400 mt-1 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{connectionStatus}</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
