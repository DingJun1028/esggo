import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Network, Zap, ShieldCheck } from 'lucide-react';

export default function ApolloStudioConsole() {
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const triggerSwarm = () => {
    setIsOrchestrating(true);
    setLogs(prev => [...prev, '[Apollo] 啟動 Hermes Orchestrator...']);
    setTimeout(() => setLogs(prev => [...prev, '[Nexus] 指令下達至 L-Hub 代理群集']), 800);
    setTimeout(() => setLogs(prev => [...prev, '[Swarm] 檢索 Vault Omni 進行數據溯源']), 1500);
    setTimeout(() => setLogs(prev => [...prev, '[ZKP] 生成 5T 零知識證明封印']), 2500);
    setTimeout(() => {
      setLogs(prev => [...prev, '✅ 任務調度完成 (100% Trustworthy)']);
      setIsOrchestrating(false);
    }, 3500);
  };

  return (
    <div className="p-8 bg-[#020617] text-white rounded-3xl border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.15)] relative overflow-hidden w-full max-w-4xl mx-auto">
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <Network size={300} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 shadow-inner">
            <Cpu size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
              Apollo Studio
            </h2>
            <p className="text-xs text-indigo-300/70 font-mono tracking-widest mt-1">OmniAgent Swarm Orchestration Center</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
          <div className={`w-2.5 h-2.5 rounded-full ${isOrchestrating ? 'bg-amber-400 animate-pulse shadow-[0_0_12px_#fbbf24]' : 'bg-emerald-400 shadow-[0_0_12px_#34d399]'}`} />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {isOrchestrating ? 'Orchestrating' : 'Swarm_Standby'}
          </span>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
          <Zap size={24} className="text-cyan-400 mb-3 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <span className="text-3xl font-black mb-1">1.2ms</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Swarm Latency</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
          <Network size={24} className="text-indigo-400 mb-3 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <span className="text-3xl font-black mb-1">24</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Nodes</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
          <ShieldCheck size={24} className="text-emerald-400 mb-3 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-3xl font-black mb-1">99.9%</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trust Score</span>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-[#0f172a]/80 border border-indigo-500/30 rounded-2xl p-5 h-56 overflow-y-auto font-mono text-sm mb-8 relative z-10 shadow-inner">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600/50 uppercase tracking-widest text-xs font-bold">
            [ 等待全域調度指令... ]
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                key={i} 
                className={`flex items-start gap-3 ${log.includes('✅') ? 'text-emerald-400' : 'text-indigo-300'}`}
              >
                <span className="opacity-50 shrink-0">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                <span>{log}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button 
        onClick={triggerSwarm}
        disabled={isOrchestrating}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all relative z-10 text-sm overflow-hidden group ${
          isOrchestrating 
            ? 'bg-indigo-900/40 text-indigo-500/50 border border-indigo-900/50 cursor-not-allowed'
            : 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] active:scale-[0.98]'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isOrchestrating ? (
            <><Activity size={18} className="animate-pulse" /> 調度執行中 (Running...)</>
          ) : (
            <><Zap size={18} /> 發射全局調度指令 (Engage Swarm)</>
          )}
        </span>
      </button>
    </div>
  );
}
