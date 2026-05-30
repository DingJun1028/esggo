'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint, Activity, Zap, Sliders, Globe,
  RefreshCw, Play, Shield, Dna, BrainCircuit,
  Lock, CheckCircle2, AlertTriangle, Database,
  ShieldCheck, Search, BookOpen, Sparkles,
  Layers, Maximize2, Cpu, ArrowRight
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandStatusDot } from '@/components/brand';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ScenarioVisualizer } from '@/components/ui/ScenarioVisualizer';
import { SwarmResonance } from '@/components/ui/SwarmResonance';
import { CausalTopologyGraph, NodeStatus } from '@/components/ui/CausalTopologyGraph';
import { cn } from '@/lib/utils';
import { omniAgentBus } from '@/lib/agents/omni-commander';

interface IntegritySeal {
  id: string;
  gate: string;
  hash: string;
  timestamp: string;
  resource: string;
}

export default function DigitalTwinPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [isSearchingKB, setIsSearchingKB] = useState(false);
  const [seals, setSeals] = useState<IntegritySeal[]>([]);
  const [lastInsight, setLastInsight] = useState<string | null>(null);

  // Graph States
  const [agentStatus, setAgentStatus] = useState<NodeStatus>('idle');
  const [zkpStatus, setZkpStatus] = useState<NodeStatus>('idle');
  const [vaultStatus, setVaultStatus] = useState<NodeStatus>('idle');
  const [healingStatus, setHealingStatus] = useState<NodeStatus>('idle');

  // DNA Parameters - Scenario A
  const [paramsA, setParamsA] = useState({ greenEnergy: 10, carbonTax: 300, supplyChainLocal: 40 });
  const [scenarioResultA, setScenarioResultA] = useState<any>({
    originalValues: { carbonEmissions: 12000, energyUsage: 350000 },
    projectedValues: { carbonEmissions: 12000, energyUsage: 350000 },
    complianceProjections: {
      carbonEmissions: { isValid: true, score: 82, violations: [] },
      'GRI 302-1': { isValid: false, score: 70, violations: ['尚未評估再生能源擴展衝擊'] },
    }
  });

  useEffect(() => {
    // 1. 5T Seals
    const unsubSeal = omniAgentBus.subscribe('5T_SEAL', (payload: any) => {
      const newSeal: IntegritySeal = {
        id: Math.random().toString(36).substring(7),
        gate: payload.gate || 'T4',
        hash: payload.hash,
        timestamp: new Date().toLocaleTimeString(),
        resource: payload.resource || 'Simulation_Result'
      };
      setSeals(prev => [newSeal, ...prev].slice(0, 5));
      setVaultStatus('success');
    });

    // 2. Healing
    const unsubHealingStart = omniAgentBus.subscribe('HEALING_START', () => {
      setIsHealing(true);
      setHealingStatus('healing');
      setZkpStatus('failed'); // Simulation of integrity drift
    });
    const unsubHealingEnd = omniAgentBus.subscribe('HEALING_COMPLETE', () => {
      setHealingStatus('success');
      setZkpStatus('success');
      setTimeout(() => setIsHealing(false), 3000); 
    });

    // 3. RAG/Knowledge
    const unsubRAGStart = omniAgentBus.subscribe('RAG_QUERY_START', () => {
      setIsSearchingKB(true);
      setAgentStatus('processing');
    });
    const unsubRAGEnd = omniAgentBus.subscribe('RAG_QUERY_COMPLETE', (payload: any) => {
      setIsSearchingKB(false);
      setAgentStatus('success');
      setZkpStatus('processing');
      if (payload.insight) setLastInsight(payload.insight);
    });

    return () => {
      unsubSeal(); unsubHealingStart(); unsubHealingEnd(); unsubRAGStart(); unsubRAGEnd();
    };
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setVaultStatus('idle');
    setZkpStatus('idle');
    setHealingStatus('idle');

    omniAgentBus.publish('RAG_QUERY_START', { query: `ESG Strategy with ${paramsA.greenEnergy}% green energy` });
    omniAgentBus.publish('SIMULATION_START', { type: 'DIGITAL_TWIN_PROJECTION', parameters: paramsA });

    try {
      const response = await fetch('/api/digital-twin/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: 'A', parameters: paramsA })
      });
      
      if (!response.ok) throw new Error('Simulation API failed');
      
      const { success, result, error } = await response.json();
      
      if (!success) throw new Error(error || 'Unknown error');

      setScenarioResultA(result);
      
      omniAgentBus.publish('RAG_QUERY_COMPLETE', { 
        insight: `基於 NCBDB 串接之真實數據與 GRI 302 標準，此綠電佈署將顯著提升 TCFD 披露評級。` 
      });
      
      // Simulate sealing process
      setTimeout(() => {
        omniAgentBus.publish('5T_SEAL', { gate: 'T4', hash: '0x' + Math.random().toString(16).substring(2, 10), resource: 'A_PROJECTION' });
        setIsSimulating(false);
      }, 1000);
    } catch (err) {
      console.error('Simulation error:', err);
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-void-stark text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Healing Shield Overlay */}
      <AnimatePresence>
        {isHealing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[2px] animate-pulse" />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-cyan-900/40 border-2 border-cyan-400/50 p-12 rounded-full shadow-[0_0_100px_rgba(34,211,238,0.4)]">
              <ShieldCheck size={100} className="text-cyan-400 animate-pulse" />
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-cyan-400 font-black tracking-[0.8em] uppercase text-2xl drop-shadow-glow">Universal Healing</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sovereign Bento Header ── */}
      <header className="h-[12vh] min-h-[100px] border-b border-white/5 bg-white/[0.02] backdrop-blur-md px-8 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shadow-cyan-glow">
                <Cpu size={20} className="text-cyan-400" />
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black tracking-[0.4em] text-cyan-400 uppercase">Omni_Twin_Engine_v5.0</span>
                <BrandBadge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0">CIRCULAR_EVOLUTION</BrandBadge>
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-white/90">
            因果拓樸與數位孿生中心 <span className="text-white/20 font-light text-xl">| Causal Reality Hub</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-6 px-6 border-x border-white/5 mx-4 h-full py-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Network_Resonance</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">STABLE.99.9%</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Hash_Locks_Active</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">1,024_SEALS</span>
             </div>
          </div>
          <BrandButton variant="primary" onClick={handleSimulate} disabled={isSimulating} className="shadow-cyan-glow hover:shadow-cyan-500/40 transition-all h-12 px-6 rounded-2xl group">
            <Zap size={16} className={cn("mr-2 group-hover:scale-125 transition-transform", isSimulating && "animate-pulse")} /> 
            {isSimulating ? '量子推演中...' : '發起意圖模擬'}
          </BrandButton>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="flex-1 p-6 grid grid-cols-12 grid-rows-12 gap-6 overflow-hidden">
        
        {/* Left Column: DNA & Ledger (3/12) */}
        <div className="col-span-3 row-span-12 flex flex-col gap-6 overflow-hidden">
           <BrandCard padding="lg" className="bg-white/[0.03] backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden group flex-shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Dna size={120} className="text-indigo-400 rotate-12" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-10 flex items-center gap-2">
                 <Sliders size={14} className="text-indigo-400" /> 永續 DNA 參數矩陣
              </h3>
              <div className="space-y-12">
                {[
                  { label: '綠電佈署比例', val: paramsA.greenEnergy, unit: '%', color: 'indigo', set: (v: number) => setParamsA(p => ({ ...p, greenEnergy: v })) },
                  { label: '內部碳定價', val: paramsA.carbonTax, unit: '$', color: 'emerald', set: (v: number) => setParamsA(p => ({ ...p, carbonTax: v })), min: 300, max: 2000, step: 100 },
                  { label: '在地供應鏈', val: paramsA.supplyChainLocal, unit: '%', color: 'cyan', set: (v: number) => setParamsA(p => ({ ...p, supplyChainLocal: v })) }
                ].map((item) => (
                  <div key={item.label} className="space-y-5">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase text-white/40 tracking-wider">{item.label}</label>
                      <span className={`text-xl font-black text-${item.color}-400 font-mono shadow-sm`}>{item.unit}{item.val}</span>
                    </div>
                    <div className="relative flex items-center">
                       <input type="range" min={item.min || 0} max={item.max || 100} step={item.step || 5} value={item.val} onChange={(e) => item.set(parseInt(e.target.value))} className={`w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-${item.color}-500 hover:opacity-100 transition-opacity`}/>
                    </div>
                  </div>
                ))}
              </div>
           </BrandCard>

           <BrandCard padding="md" className="bg-cyan-500/[0.02] border-cyan-500/10 flex-1 flex flex-col overflow-hidden">
              <div className="p-2 flex items-center justify-between border-b border-white/5 mb-4 shrink-0">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 flex items-center gap-2">
                    <Lock size={12} /> 主權實證帳本
                 </h3>
                 <span className="text-[8px] text-white/20 font-mono">REALTIME_SYNC</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                <AnimatePresence>
                  {seals.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                       <Database size={32} className="mb-2" />
                       <p className="text-[10px] text-white italic">等待 5T 協議自動刻印...</p>
                    </div>
                  ) : (
                    seals.map(seal => (
                      <motion.div key={seal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 shadow-2xl group hover:bg-white/[0.04] transition-colors">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-1.5">
                              <ShieldCheck size={10} className="text-cyan-400" />
                              <span className="text-[10px] font-black text-cyan-400 tracking-tighter">GATE {seal.gate}</span>
                           </div>
                           <span className="text-[8px] text-white/20 font-mono">{seal.timestamp}</span>
                        </div>
                        <div className="text-[9px] font-mono text-white/40 break-all border-l border-white/10 pl-2 leading-loose">HASH: {seal.hash}</div>
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[8px] text-emerald-400 font-bold uppercase">Truth Locked</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
           </BrandCard>
        </div>

        {/* Center/Right Column: Nerve Center & Swarm (9/12) */}
        <div className="col-span-9 row-span-12 flex flex-col gap-6 overflow-hidden">
           
           {/* Top: Causal Topology Nerve Center */}
           <div className="h-[40vh] min-h-[350px] shrink-0">
              <CausalTopologyGraph 
                taskId="sim_omega_77" 
                agentStatus={agentStatus}
                zkpStatus={zkpStatus}
                vaultStatus={vaultStatus}
                healingStatus={healingStatus}
              />
           </div>

           {/* Bottom: Visualizer & Swarm Monitor */}
           <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
              {/* Main Visualizer */}
              <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
                 <div className={cn("flex-1 bg-white/[0.01] border border-white/5 rounded-[32px] p-2 relative overflow-hidden transition-all duration-1000", isSimulating ? "opacity-40 blur-md scale-[0.98]" : "opacity-100 scale-100")}>
                    <div className="absolute top-6 left-6 z-10 flex gap-3">
                       <UniversalBadge variant="success" icon={<Globe size={12}/>}>Realtime Projection</UniversalBadge>
                       <AnimatePresence>{isSearchingKB && (
                         <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-xl text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                            <Search size={12} className="animate-spin" /> RAG 知識深度檢索中
                         </motion.div>
                       )}</AnimatePresence>
                    </div>
                    <div className="h-full overflow-hidden">
                       <ScenarioVisualizer result={scenarioResultA} />
                    </div>
                 </div>
                 
                 {/* Insight Bar */}
                 <BrandCard padding="md" className="bg-gradient-to-r from-cyan-500/[0.08] to-indigo-500/[0.08] border-white/10 shrink-0 flex items-center gap-6 overflow-hidden relative group h-24">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-cyan-glow group-hover:rotate-12 transition-all">
                       <BrainCircuit size={28} className="text-cyan-400" />
                    </div>
                    <div className="flex-1 space-y-1 relative z-10">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">OmniCore Intelligence Synthesis</span>
                          <div className="h-[1px] flex-1 bg-white/5" />
                       </div>
                       <p className="text-base text-white/80 font-medium leading-relaxed italic pr-12 line-clamp-2">
                         {lastInsight || "初始化系統意圖中，準備執行多維度因果律對齊模擬。"}
                       </p>
                    </div>
                    {lastInsight && (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute right-6 opacity-40">
                         <Sparkles size={40} className="text-amber-400" />
                      </motion.div>
                    )}
                 </BrandCard>
              </div>

              {/* Swarm Monitor */}
              <div className="col-span-4 flex flex-col gap-6 overflow-hidden">
                 <div className="flex-1 bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-white/10 overflow-hidden flex flex-col shadow-inner">
                    <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-2">
                          <Activity size={14} className="text-emerald-400" />
                          <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Swarm Resonance Monitor</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[8px] font-mono text-emerald-400 uppercase">Streaming</span>
                       </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <SwarmResonance />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-4 shrink-0">
                    <BrandCard padding="md" className="border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Knowledge Density</span>
                          <span className="text-2xl font-black font-mono text-cyan-400">98.2<span className="text-xs ml-1 opacity-40">%</span></span>
                       </div>
                       <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                          <BookOpen size={20} className="text-cyan-400 opacity-50" />
                       </div>
                    </BrandCard>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* ── Fixed Footer Navigation ── */}
      <footer className="h-[6vh] border-t border-white/5 bg-black/60 backdrop-blur-xl px-8 flex items-center justify-between text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] shrink-0 relative z-30">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 5T_CORE_OK</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> INTENT_BUS_SYNC</span>
         </div>
         <div className="flex items-center gap-1.5">
            <span className="text-white/10 italic pr-4">JunAiKey Original Identity Matrix</span>
            <ArrowRight size={10} className="text-white/20" />
            <span className="font-black text-white/50 bg-white/5 px-2 py-0.5 rounded">OMNICORE_P0_SEALED</span>
         </div>
      </footer>

      {/* Global CSS for Custom Scrollbar in Liquid Glass Style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}
