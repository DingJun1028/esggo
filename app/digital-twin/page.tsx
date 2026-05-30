'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint, Activity, Zap, Sliders, Globe,
  RefreshCw, Play, Shield, Dna, BrainCircuit,
  Lock, CheckCircle2, AlertTriangle, Database,
  ShieldCheck, Search, BookOpen, Sparkles
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandStatusDot } from '@/components/brand';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ScenarioVisualizer } from '@/components/ui/ScenarioVisualizer';
import { SwarmResonance } from '@/components/ui/SwarmResonance';
import { ComparisonChart } from '@/components/ui/ComparisonChart';
import { cn } from '@/lib/utils';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';

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

  // 模擬環境參數 (DNA Parameters) - Scenario A
  const [paramsA, setParamsA] = useState({ greenEnergy: 10, carbonTax: 300, supplyChainLocal: 40 });
  const [scenarioResultA, setScenarioResultA] = useState<any>({
    originalValues: { carbonEmissions: 12000, energyUsage: 350000 },
    projectedValues: { carbonEmissions: 12000, energyUsage: 350000 },
    complianceProjections: {
      carbonEmissions: { isValid: true, score: 82, violations: [] },
      'GRI 302-1': { isValid: false, score: 70, violations: ['尚未評估再生能源擴展衝擊'] },
    }
  });

  // 模擬環境參數 (DNA Parameters) - Scenario B
  const [paramsB, setParamsB] = useState({ greenEnergy: 50, carbonTax: 1000, supplyChainLocal: 80 });
  const [scenarioResultB, setScenarioResultB] = useState<any>({
    originalValues: { carbonEmissions: 12000, energyUsage: 350000 },
    projectedValues: { carbonEmissions: 12000, energyUsage: 350000 },
    complianceProjections: {
      carbonEmissions: { isValid: true, score: 82, violations: [] },
      'GRI 302-1': { isValid: false, score: 70, violations: ['尚未評估再生能源擴展衝擊'] },
    }
  });

  useEffect(() => {
    // 1. Listen for 5T Seals from the Auditor
    const unsubSeal = omniAgentBus.subscribe('5T_SEAL', (payload: any) => {
      const newSeal: IntegritySeal = {
        id: Math.random().toString(36).substring(7),
        gate: payload.gate || 'T4',
        hash: payload.hash,
        timestamp: new Date().toLocaleTimeString(),
        resource: payload.resource || 'Simulation_Result'
      };
      setSeals(prev => [newSeal, ...prev].slice(0, 5));
    });

    // 2. Listen for Healing Events
    const unsubHealingStart = omniAgentBus.subscribe('HEALING_START', () => setIsHealing(true));
    const unsubHealingEnd = omniAgentBus.subscribe('HEALING_COMPLETE', () => {
      setTimeout(() => setIsHealing(false), 3000); // Keep shield visible for 3s
    });

    // 3. Listen for RAG/Knowledge Events
    const unsubRAGStart = omniAgentBus.subscribe('RAG_QUERY_START', () => setIsSearchingKB(true));
    const unsubRAGEnd = omniAgentBus.subscribe('RAG_QUERY_COMPLETE', (payload: any) => {
      setIsSearchingKB(false);
      if (payload.insight) setLastInsight(payload.insight);
    });

    return () => {
      unsubSeal();
      unsubHealingStart();
      unsubHealingEnd();
      unsubRAGStart();
      unsubRAGEnd();
    };
  }, []);

  const handleSimulate = async (scenario: 'A' | 'B') => {
    setIsSimulating(true);

    const targetParams = scenario === 'A' ? paramsA : paramsB;

    // Trigger Knowledge Retrieval
    omniAgentBus.publish('RAG_QUERY_START', { query: `ESG Strategy with ${targetParams.greenEnergy}% green energy` });
    
    // Publish to OmniAgent Bus
    omniAgentBus.publish('SIMULATION_START', {
      type: 'DIGITAL_TWIN_PROJECTION',
      scenario,
      parameters: targetParams
    });

    // 模擬 OmniAgent 量子模擬推演延遲
    setTimeout(() => {
      const reduction = (targetParams.greenEnergy * 0.5) + (targetParams.supplyChainLocal * 0.2);
      const newCarbon = 12000 * (1 - reduction / 100);
      const newEnergy = 350000 * (1 - (targetParams.greenEnergy * 0.3) / 100);

      const isGriValid = targetParams.greenEnergy >= 20;

      const newResult = {
        originalValues: { carbonEmissions: 12000, energyUsage: 350000 },
        projectedValues: { carbonEmissions: newCarbon, energyUsage: newEnergy },
        complianceProjections: {
          carbonEmissions: {
            isValid: true,
            score: Math.min(99, 82 + reduction),
            violations: []
          },
          'GRI 302-1': {
            isValid: isGriValid,
            score: Math.min(99, 50 + targetParams.greenEnergy * 2),
            violations: isGriValid ? [] : ['再生能源佔比未達 20% 綠電門檻安全線']
          },
        }
      };

      if (scenario === 'A') setScenarioResultA(newResult);
      else setScenarioResultB(newResult);
      
      // Complete RAG Insight simulation
      omniAgentBus.publish('RAG_QUERY_COMPLETE', { 
        insight: `基於歷史政策與 GRI 302 標準，情境 ${scenario} 的綠電佈署將顯著提升 TCFD 披露評級。` 
      });

      // Publish completion to Bus
      omniAgentBus.publish('SIMULATION_COMPLETE', {
        type: 'DIGITAL_TWIN_PROJECTION',
        scenario,
        parameters: targetParams,
        results: newResult
      });

      setIsSimulating(false);
    }, 2000);
  };

  const handleSimulateBoth = () => {
    handleSimulate('A');
    handleSimulate('B');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700 overflow-x-hidden">
      {/* Healing Shield Overlay */}
      <AnimatePresence>
        {isHealing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[2px] animate-pulse" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-cyan-900/40 border-2 border-cyan-400/50 p-8 rounded-full shadow-[0_0_100px_rgba(34,211,238,0.3)]"
            >
              <ShieldCheck size={80} className="text-cyan-400 animate-bounce" />
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-cyan-400 font-black tracking-[0.5em] uppercase text-xl">
                Universal Healing Active
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8 relative">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <UniversalBadge variant="success" icon="✨">ESG GO 模組</UniversalBadge>
              <UniversalBadge variant="glow" icon={<Shield size={12}/>}>Healing Active</UniversalBadge>
              <UniversalBadge variant="glass" icon={<BookOpen size={12}/>}>RAG Ready</UniversalBadge>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <BrandStatusDot status={isHealing ? "warning" : "active"} pulse size="sm" />
              <span className="text-xs font-mono font-black tracking-[0.3em] text-cyan-600 dark:text-cyan-400 uppercase">
                Omni_Twin_Engine_v4.0
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Fingerprint className="text-cyan-600 dark:text-cyan-400" size={32} />
              數位孿生、智庫與自我修復 <span className="text-slate-400 font-light">| OmniCore</span>
            </h1>
            <p className="text-lg text-white/60 max-w-3xl">
              結合萬能智庫 (Universal Knowledge Base) 與自動化修復 (HealingGuardian) 的終極治理中心。
            </p>
          </div>
          <div className="flex gap-3">
            <BrandBadge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
              <Activity size={14} className="mr-1" /> 5T 誠信網絡已達標
            </BrandBadge>
            <BrandButton variant="primary" onClick={handleSimulateBoth} disabled={isSimulating}>
              <RefreshCw size={14} className={cn("mr-2", isSimulating && "animate-spin")} /> 同時比對 A/B 情境
            </BrandButton>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UniversalCard title="萬能智庫 (RAG)" variant="glow">
            <div className="flex items-center gap-2 mb-2">
              <Database size={14} className="text-cyan-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Memory Density: 98%</span>
            </div>
            <p className="text-xs text-white/70">統整企業歷史報告與國際標準，為代理人提供主權上下文。</p>
          </UniversalCard>
          <UniversalCard title="萬能修復 (Healing)" variant="bordered">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Immunity Level: MAX</span>
            </div>
            <p className="text-xs text-white/70">自動化熵減系統，即時攔截並修復非授權的數據偏移。</p>
          </UniversalCard>
          <UniversalCard title="量子模擬" variant="glass">
            <p className="text-xs text-white/70">透過道德 DNA 滑桿，即時預演不同永續策略的未來影響。</p>
          </UniversalCard>
          <UniversalCard title="主權帳本" variant="default">
            <p className="text-xs text-white/70">所有模擬意圖與修復紀錄皆寫入帳本，確保決策可追蹤性。</p>
          </UniversalCard>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Scenario A */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-cyan-400 border-b-2 border-cyan-400 pb-1">情境 A (保守推演)</h2>
            </div>
            <BrandCard padding="lg" className="border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#020617]/40 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Dna size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">永續 DNA 參數 A</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">綠電比例 (%)</label>
                    <span className="text-sm font-black text-indigo-400">{paramsA.greenEnergy}%</span>
                  </div>
                  <input type="range" min="0" max="100" step="5" value={paramsA.greenEnergy} onChange={(e) => setParamsA(p => ({ ...p, greenEnergy: parseInt(e.target.value) }))} className="w-full accent-indigo-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">碳定價 (NTD)</label>
                    <span className="text-sm font-black text-emerald-400">${paramsA.carbonTax}</span>
                  </div>
                  <input type="range" min="300" max="2000" step="100" value={paramsA.carbonTax} onChange={(e) => setParamsA(p => ({ ...p, carbonTax: parseInt(e.target.value) }))} className="w-full accent-emerald-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">在地供應鏈 (%)</label>
                    <span className="text-sm font-black text-cyan-400">{paramsA.supplyChainLocal}%</span>
                  </div>
                  <input type="range" min="10" max="100" step="5" value={paramsA.supplyChainLocal} onChange={(e) => setParamsA(p => ({ ...p, supplyChainLocal: parseInt(e.target.value) }))} className="w-full accent-cyan-600" />
                </div>
              </div>

              <div className="mt-8">
                <BrandButton variant="primary" fullWidth className="h-12 rounded-xl text-xs" onClick={() => handleSimulate('A')} disabled={isSimulating}>
                  {isSimulating ? <RefreshCw size={16} className="animate-spin mr-2" /> : <Play size={16} className="mr-2" />} 執行情境 A
                </BrandButton>
              </div>
            </BrandCard>

            <div className={cn("transition-all duration-700 relative", isSimulating ? "opacity-50 blur-sm scale-[0.98]" : "opacity-100 scale-100")}>
              <ScenarioVisualizer result={scenarioResultA} />
            </div>
          </motion.div>

          {/* Scenario B */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-emerald-400 border-b-2 border-emerald-400 pb-1">情境 B (激進轉型)</h2>
            </div>
            <BrandCard padding="lg" className="border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#020617]/40 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Dna size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">永續 DNA 參數 B</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">綠電比例 (%)</label>
                    <span className="text-sm font-black text-indigo-400">{paramsB.greenEnergy}%</span>
                  </div>
                  <input type="range" min="0" max="100" step="5" value={paramsB.greenEnergy} onChange={(e) => setParamsB(p => ({ ...p, greenEnergy: parseInt(e.target.value) }))} className="w-full accent-indigo-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">碳定價 (NTD)</label>
                    <span className="text-sm font-black text-emerald-400">${paramsB.carbonTax}</span>
                  </div>
                  <input type="range" min="300" max="2000" step="100" value={paramsB.carbonTax} onChange={(e) => setParamsB(p => ({ ...p, carbonTax: parseInt(e.target.value) }))} className="w-full accent-emerald-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">在地供應鏈 (%)</label>
                    <span className="text-sm font-black text-cyan-400">{paramsB.supplyChainLocal}%</span>
                  </div>
                  <input type="range" min="10" max="100" step="5" value={paramsB.supplyChainLocal} onChange={(e) => setParamsB(p => ({ ...p, supplyChainLocal: parseInt(e.target.value) }))} className="w-full accent-cyan-600" />
                </div>
              </div>

              <div className="mt-8">
                <BrandButton variant="secondary" fullWidth className="h-12 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-600 text-white border-0" onClick={() => handleSimulate('B')} disabled={isSimulating}>
                  {isSimulating ? <RefreshCw size={16} className="animate-spin mr-2" /> : <Play size={16} className="mr-2" />} 執行情境 B
                </BrandButton>
              </div>
            </BrandCard>

            <div className={cn("transition-all duration-700 relative", isSimulating ? "opacity-50 blur-sm scale-[0.98]" : "opacity-100 scale-100")}>
              <ScenarioVisualizer result={scenarioResultB} />
            </div>
          </motion.div>
        </motion.div>

        {/* Sync Comparison Chart */}
        <div className={cn("transition-all duration-700", isSimulating ? "opacity-50 blur-sm" : "opacity-100")}>
          <ComparisonChart resultA={scenarioResultA} resultB={scenarioResultB} />
        </div>

        {/* Global Monitor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-8 h-[400px]">
            <SwarmResonance />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <BrandCard padding="md" className="border-cyan-500/20 bg-cyan-500/5 h-full overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 mb-4 sticky top-0 bg-[#06182c] py-2 z-10">
                <Lock size={16} className="text-cyan-400" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white/80">主權實證帳本 (Sovereign Proofs)</h4>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {seals.length === 0 ? (
                    <p className="text-[10px] text-white/30 italic">等待 5T 協議自動刻印...</p>
                  ) : (
                    seals.map(seal => (
                      <motion.div key={seal.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="p-2 rounded bg-black/40 border border-white/5 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-cyan-400">{seal.gate} SEALED</span>
                          <span className="text-[8px] text-white/20">{seal.timestamp}</span>
                        </div>
                        <div className="text-[8px] font-mono text-white/40 truncate">HASH: {seal.hash}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                          <span className="text-[8px] text-emerald-500/70 font-bold uppercase">Verified Truth</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </BrandCard>
          </div>
        </div>

        {/* AI Insight Bar */}
        <BrandCard padding="md" className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/50 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <BrainCircuit size={24} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                <strong className="font-black mr-2">OmniAgent 雙模組戰略洞察：</strong>
                透過 A/B 情境雙向推演，可即時比較不同綠電佈署與在地供應鏈策略對溫室氣體減量及 GRI 302-1 合規的影響。
              </p>
            </div>
            {lastInsight && (
              <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-[10px] font-bold text-white/60">智庫同步</span>
              </div>
            )}
          </div>
          
          {lastInsight && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pl-10 border-l border-blue-400/20">
              <p className="text-xs text-blue-700 dark:text-blue-300 italic leading-relaxed">「{lastInsight}」</p>
            </motion.div>
          )}
        </BrandCard>
      </div>
    </div>
  );
}
