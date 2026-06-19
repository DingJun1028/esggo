'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Activity, Cpu, Sparkles, HeartPulse } from 'lucide-react';

/**
 * 🎼 [智慧智能團] Agent Pulse Component
 * Visualizes the "Deep Integration" of the specialized agents.
 */
export const AgentPulse: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  
  const agents = [
    { name: '@orchestrator', icon: <Cpu className="w-4 h-4" />, color: 'text-blue-400', label: 'Mind (心智)' },
    { name: '@frontend-specialist', icon: <Sparkles className="w-4 h-4" />, color: 'text-purple-400', label: 'Soul (靈魂)' },
    { name: '@debugger', icon: <HeartPulse className="w-4 h-4" />, color: 'text-emerald-400', label: 'Body (體魄)' },
    { name: '@performance-optimizer', icon: <Zap className="w-4 h-4" />, color: 'text-amber-400', label: 'Pulse (脈動)' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % agents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [agents.length]);

  return (
    <div className="relative p-6 rounded-md bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] overflow-hidden group">
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md bg-[var(--theme-primary-muted)] border border-[var(--theme-primary)]/20">
            <Activity className="w-5 h-5 text-[var(--theme-primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--theme-text-main)]">[智慧智能團] 全域感應</h3>
            <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest font-mono">Omni-Agent Integration Mode</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-md bg-[var(--color-optimal)]/10 border border-[var(--color-optimal)]/20 flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-optimal)]" />
          <span className="text-[10px] font-bold text-[var(--color-optimal)] uppercase tracking-tighter">Healed</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={false}
            animate={{
              opacity: activeStage === index ? 1 : 0.4,
              scale: activeStage === index ? 1.02 : 1,
              borderColor: activeStage === index ? 'var(--theme-primary)' : 'var(--theme-glass-border)',
              backgroundColor: activeStage === index ? 'var(--theme-bg)' : 'transparent',
            }}
            className="p-3 rounded-md border flex flex-col items-center text-center transition-all duration-200 shadow-sm"
          >
            <div className={`p-2 rounded-full mb-2 ${activeStage === index ? agent.color + ' bg-slate-100' : 'text-slate-400'}`}>
              {agent.icon}
            </div>
            <span className="text-[11px] font-bold text-[var(--theme-text-main)] block truncate w-full">{agent.name}</span>
            <span className="text-[9px] text-[var(--theme-text-muted)] font-medium">{agent.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--theme-glass-border)] flex items-center justify-between">
        <div className="flex -space-x-1.5">
           {[0, 1, 2, 3].map((_, i) => (
             <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-100 flex items-center justify-center">
               <div className={`w-1.5 h-1.5 rounded-full ${i <= activeStage ? 'bg-[var(--theme-primary)]' : 'bg-slate-300'}`} />
             </div>
           ))}
        </div>
        <div className="text-[10px] text-[var(--theme-text-muted)] flex items-center space-x-2">
          <span className="font-mono uppercase tracking-widest">Integration:</span>
          <span className="font-bold text-[var(--theme-primary)]">OPTIMAL</span>
        </div>
      </div>
    </div>
  );
};
