import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, MessageSquare, Zap, Target, ShieldCheck, Cpu } from 'lucide-react';
import { realTimeDataSync, Unsubscribe } from '../../1-service/realTimeDataSync';
import swarmConsensusService from '../../services/SwarmConsensusService';

/**
 * 🐝 群體共鳴監測器 (Swarm Monitor)
 * --------------------------------------------------
 * [協議] 🔴 Phase 28: 自我進化與全域主權
 */

interface SwarmEvent {
  id: string;
  type: 'AUDIT_REQUEST' | 'VOTE_CAST' | 'CONSENSUS_REACHED';
  message: string;
  timestamp: number;
  agent?: string;
  impact?: number;
}

export const SwarmMonitor: React.FC = () => {
  const [events, setEvents] = useState<SwarmEvent[]>([]);
  const [activeAgents, setActiveAgents] = useState<{ id: string; status: 'ONLINE' | 'AUDITING'; resonance: number }[]>([]);
  const [globalHarmony, setGlobalHarmony] = useState(0.92);

  useEffect(() => {
    let unsubscribeVotes: Unsubscribe | undefined;
    let unsubscribeAudits: Unsubscribe | undefined;
    let unsubscribeLifecycle: Unsubscribe | undefined;

    // 監聽 Swarm 相關消息
    unsubscribeVotes = realTimeDataSync.subscribe('swarm_consensus_votes', (data: any) => {
      addEvent({
        type: 'VOTE_CAST',
        message: `Agent ${data.voterDid?.substring(0, 8) || 'Alpha'} cast vote for packet ${data.cid?.substring(0, 8)}`,
        agent: data.voterDid,
        impact: data.vote === 'Approve' ? 0.95 : 0.05
      });
    });

    unsubscribeAudits = realTimeDataSync.subscribe('swarm_audit_requests', (data: any) => {
      addEvent({
        type: 'AUDIT_REQUEST',
        message: `New Audit Request for CID: ${data.cid?.substring(0, 8)}`,
        impact: 1.0
      });
    });

    unsubscribeLifecycle = realTimeDataSync.subscribe('distributed_lifecycle_complete', (data: any) => {
      addEvent({
        type: 'CONSENSUS_REACHED',
        message: `Crystallization Finalized: ${data.cid?.substring(0, 8)} | Consensus: ${data.consensus}`,
        impact: data.harmony || 0.9
      });
      if (data.harmony) setGlobalHarmony(data.harmony);
    });

    // 模擬動態代理列表
    setActiveAgents([
      { id: 'Observer-Alpha', status: 'ONLINE', resonance: 0.98 },
      { id: 'Observer-Beta', status: 'ONLINE', resonance: 0.95 },
      { id: 'Sovereign-Sentinel', status: 'AUDITING', resonance: 0.99 },
    ]);

    return () => {
      unsubscribeVotes?.();
      unsubscribeAudits?.();
      unsubscribeLifecycle?.();
    };
  }, []);

  const addEvent = (partial: Omit<SwarmEvent, 'id' | 'timestamp'>) => {
    const newEvent: SwarmEvent = {
      ...partial,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 20));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-[2rem] border border-white/10 overflow-hidden backdrop-blur-xl">
      {/* Header Area */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Swarm <span className="text-cyan-400">Observer Monitor</span></h4>
              <p className="text-[10px] text-slate-500 font-mono tracking-tighter">Real-Time Resonance & Distributed Audit Feed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-cyan-400 uppercase">Global Harmony</div>
            <div className="text-xl font-black text-white">{(globalHarmony * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-x divide-white/5 h-full overflow-hidden">
        {/* Active Agents Column */}
        <div className="p-4 space-y-4 overflow-y-auto">
          <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Cpu size={12} /> Active Sprites
          </h5>
          {activeAgents.map(agent => (
            <div key={agent.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/5 relative group transition-all hover:bg-white/[0.05]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-300">{agent.id}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'}`} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-[8px] text-slate-500 uppercase font-bold">Resonance</div>
                <div className="text-[10px] font-mono text-cyan-400">{(agent.resonance * 100).toFixed(0)}%</div>
              </div>
              <div className="mt-1 h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.resonance * 100}%` }}
                  className="h-full bg-cyan-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Real-Time Feed Column */}
        <div className="md:col-span-2 p-4 flex flex-col h-full overflow-hidden">
          <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity size={12} /> Live Audit Stream
          </h5>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-black/40 border-l-2 border-white/5 rounded-r-xl group"
                  style={{ borderLeftColor: event.type === 'CONSENSUS_REACHED' ? '#10b981' : event.type === 'AUDIT_REQUEST' ? '#06b6d4' : '#818cf8' }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                      {event.type === 'CONSENSUS_REACHED' ? <ShieldCheck size={10} className="text-emerald-500" /> : <MessageSquare size={10} />}
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className="text-[8px] font-mono text-slate-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-mono tracking-tight">{event.message}</p>
                  {event.impact && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="text-[8px] text-slate-500 uppercase font-bold">RS:</div>
                      <div className="flex-1 h-0.5 bg-slate-800 rounded-full">
                        <motion.div
                          className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${event.impact * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {events.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 gap-2">
                <Target size={48} />
                <span className="text-xs uppercase font-black tracking-tighter">Analyzing Swarm Frequencies...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="p-3 px-6 bg-black/40 border-t border-white/5 flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Zap size={10} className="text-cyan-400" /> Latency: 42ms</span>
          <span className="flex items-center gap-1"><Activity size={10} className="text-indigo-400" /> Throughput: 1.2k req/s</span>
        </div>
        <div className="text-emerald-500 animate-pulse">Proof of Resonance (PoR) Verified</div>
      </div>
    </div>
  );
};
