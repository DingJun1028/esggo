'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Bot, Activity, CheckCircle2, AlertCircle, 
  Clock, Zap, Cpu, Shield, ArrowRight, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { BrandCard, BrandBadge, BrandButton, BrandStatusDot } from '../brand';
import { AgentTask } from '../../lib/agent/types';
import { useSwarmSync } from '../../hooks/useSwarmSync';

interface SwarmAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  persona: 'compliance' | 'harmony' | 'innovation' | 'entropy';
  color: string;
}

const MOCK_AGENTS: SwarmAgent[] = [
  { id: 'agt-01', name: 'Z0-Compliance', role: 'Regulatory Auditor', status: 'processing', persona: 'compliance', color: '#003262' },
  { id: 'agt-02', name: 'H1-Harmony', role: 'Social Impact analyst', status: 'active', persona: 'harmony', color: '#10B981' },
  { id: 'agt-03', name: 'V4-Vault', role: 'Security & ZKP Guard', status: 'idle', persona: 'innovation', color: '#8B5CF6' },
];

export function SwarmMonitor() {
  const { tasks, agents, loading, error, refresh } = useSwarmSync(5000);

  return (
    <BrandCard padding="none" className="glass-panel border-none h-full overflow-hidden flex flex-col shadow-lg bg-gradient-to-br from-white/90 to-slate-50/50">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-800/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-berkeley-blue flex items-center justify-center text-white">
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-berkeley-blue uppercase tracking-[0.2em]">Omni-Swarm Monitor</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time Orchestration • v1.1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BrandBadge variant="outline" size="xs" className="text-berkeley-blue border-berkeley-blue/20">{loading ? 'Syncing...' : 'Live'}</BrandBadge>
          <div className={cn("w-2 h-2 rounded-full bg-emerald-500", !loading && "animate-ping")} />
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 space-y-6">
        {/* Active Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(agents.length > 0 ? agents : []).map((agent) => {
            const isProcessing = agent.status === 'processing';
            
            return (
              <div key={agent.id} className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-row sm:flex-col items-center text-left sm:text-center gap-4 sm:gap-2 transition-all hover:border-blue-200">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0",
                  isProcessing ? "border-blue-400 animate-spin-slow" : "border-slate-100"
                )}>
                  <Bot size={20} style={{ color: agent.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-slate-800 uppercase truncate w-full">{agent.name.split('-')[1] || agent.name}</p>
                  <div className="flex items-center sm:justify-center gap-1">
                    <div className={cn("w-1 h-1 rounded-full", 
                      isProcessing ? "bg-blue-500" : 
                      agent.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{agent.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Task Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">任務流 (Live Stream)</h5>
            <button onClick={() => refresh()} className="text-slate-300 hover:text-blue-500 transition-colors">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''}/>
            </button>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {tasks.slice(0, 3).map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-3 bg-white/80 rounded-xl border border-slate-100 flex items-center gap-3 group transition-all hover:bg-blue-50/50"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Activity size={16} className={task.status === 'approved_for_execution' ? "animate-pulse" : ""} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-berkeley-blue truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase">{task.taskType}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[8px] font-mono text-slate-300">ID: {task.id.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-blue-400" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {tasks.length === 0 && !loading && (
              <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-xl">
                <Clock size={20} className="mx-auto text-slate-200 mb-2" />
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">無活躍任務</p>
              </div>
            )}
          </div>
        </div>

        {/* Compute Load Indicator */}
        <div className="p-4 bg-berkeley-blue rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">BlueCC 算力負載</span>
              <Cpu size={14} className="text-primary-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black font-mono tracking-tighter">42.8<span className="text-xs ml-0.5 opacity-60">%</span></span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '42.8%' }}
                  className="h-full bg-primary-400" 
                />
              </div>
            </div>
            <p className="text-[9px] font-bold opacity-60 uppercase">Cluster: blue-cluster-omni • asia-east1</p>
          </div>
          <Zap size={60} className="absolute -bottom-4 -right-4 text-white/5" />
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <BrandButton variant="ghost" size="xs" fullWidth className="h-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-berkeley-blue">
          進入蜂群指揮中心
        </BrandButton>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </BrandCard>
  );
}
