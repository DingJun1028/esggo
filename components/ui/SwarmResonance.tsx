'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Shield, Zap, Activity, Info } from 'lucide-react';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';
import { cn } from '@/lib/utils';

interface EventLog {
  id: string;
  timestamp: string;
  event: string;
  payload: unknown;
  agent?: string;
}

export function SwarmResonance() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEvent = (event: string, payload: unknown) => {
      const newLog: EventLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        event,
        payload,
        agent: (payload as any)?.agent || (event.startsWith('AGENT_') ? (payload as any)?.agent : 'System')
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    // Subscribe to all known events
    const unsubscribes = [
      omniAgentBus.subscribe('SIMULATION_START', (p) => handleEvent('SIMULATION_START', p)),
      omniAgentBus.subscribe('SIMULATION_COMPLETE', (p) => handleEvent('SIMULATION_COMPLETE', p)),
      omniAgentBus.subscribe('AGENT_TASK', (p) => handleEvent('AGENT_TASK', p)),
      omniAgentBus.subscribe('COMMAND_ISSUED', (p) => handleEvent('COMMAND_ISSUED', p)),
      omniAgentBus.subscribe('5T_SEAL', (p) => handleEvent('5T_SEAL', p)),
      omniAgentBus.subscribe('MISSION_START', (p) => handleEvent('MISSION_START', p)),
      omniAgentBus.subscribe('MISSION_COMPLETE', (p) => handleEvent('MISSION_COMPLETE', p)),
    ];

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const getAgentIcon = (agent?: string) => {
    switch (agent) {
      case 'ESG_Auditor': return <Shield className="text-emerald-400" size={14} />;
      case 'Agent0': return <Cpu className="text-cyan-400" size={14} />;
      case 'OmniAgent': return <Zap className="text-amber-400" size={14} />;
      default: return <Activity className="text-blue-400" size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest uppercase text-white/90">Swarm Resonance Monitor</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-3 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20 italic">
              <Info size={24} className="mb-2 opacity-20" />
              <p>Waiting for intent resonance...</p>
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group border-l-2 border-white/5 pl-3 py-1 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/30">[{log.timestamp}]</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 font-bold border border-white/5">
                    {log.event}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-white/60 text-[9px]">
                    {getAgentIcon(log.agent)}
                    {log.agent}
                  </div>
                </div>
                <div className="text-white/50 break-all leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                  {typeof log.payload === 'string' ? log.payload : JSON.stringify(log.payload)}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] text-white/30 font-bold uppercase tracking-tighter">Connection: Active (5T Secure)</span>
        <span className="text-[9px] text-cyan-500/50 font-mono animate-pulse">● LIVE</span>
      </div>
    </div>
  );
}
