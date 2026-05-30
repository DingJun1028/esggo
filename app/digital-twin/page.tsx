'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint, Activity, Zap, Sliders, Globe,
  RefreshCw, Play, Shield, Dna, BrainCircuit,
  Lock, CheckCircle2, AlertTriangle, Database
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandStatusDot } from '@/components/brand';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { ScenarioVisualizer } from '@/components/ui/ScenarioVisualizer';
import { SwarmResonance } from '@/components/ui/SwarmResonance';
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
  const [seals, setSeals] = useState<IntegritySeal[]>([]);

  // 模擬環境參數 (DNA Parameters)
  const [params, setParams] = useState({
    greenEnergy: 10,
    carbonTax: 300,
    supplyChainLocal: 40
  });

  // 對接 ScenarioVisualizer 的 ProjectionResult 資料結構
  const [scenarioResult, setScenarioResult] = useState<any>({
    originalValues: { carbonEmissions: 12000, energyUsage: 350000 },
    projectedValues: { carbonEmissions: 12000, energyUsage: 350000 },
    complianceProjections: {
      carbonEmissions: { isValid: true, score: 82, violations: [] },
      'GRI 302-1': { isValid: false, score: 70, violations: ['尚未評估再生能源擴展衝擊'] },
    }
  });

  useEffect(() => {
    // Listen for 5T Seals from the Auditor
    const unsubscribe = omniAgentBus.subscribe('5T_SEAL', (payload: any) => {
      const newSeal: IntegritySeal = {
        id: Math.random().toString(36).substring(7),
        gate: payload.gate || 'T4',
        hash: payload.hash,
        timestamp: new Date().toLocaleTimeString(),
        resource: payload.resource || 'Simulation_Result'
      };
      setSeals(prev => [newSeal, ...prev].slice(0, 5));
    });
    return () => unsubscribe();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);

    // Publish to OmniAgent Bus
    omniAgentBus.publish('SIMULATION_START', {
      type: 'DIGITAL_TWIN_PROJECTION',
      parameters: params
    });

    // 模擬 OmniAgent 量子模擬推演延遲
    setTimeout(() => {
      const reduction = (params.greenEnergy * 0.5) + (params.supplyChainLocal * 0.2);
      const newCarbon = 12000 * (1 - reduction / 100);
      const newEnergy = 350000 * (1 - (params.greenEnergy * 0.3) / 100);

      const isGriValid = params.greenEnergy >= 20;

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
            score: Math.min(99, 50 + params.greenEnergy * 2),
            violations: isGriValid ? [] : ['再生能源佔比未達 20% 綠電門檻安全線']
          },
        }
      };

      setScenarioResult(newResult);
      
      // Publish completion to Bus
      omniAgentBus.publish('SIMULATION_COMPLETE', {
        type: 'DIGITAL_TWIN_PROJECTION',
        parameters: params,
        results: newResult
      });

      setIsSimulating(false);
    }, 1500);
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
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              ESG GO 模組
            </UniversalBadge>
            <div className="flex items-center gap-3 mb-2">
              <BrandStatusDot status="active" pulse size="sm" />
              <span className="text-xs font-mono font-black tracking-[0.3em] text-cyan-600 dark:text-cyan-400 uppercase">
                Omni_Twin_Engine_v3.1
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Fingerprint className="text-cyan-600 dark:text-cyan-400" size={32} />
              數位孿生與情境模擬 <span className="text-slate-400 font-light">| Digital Twin</span>
            </h1>
            <p className="text-lg text-white/60 max-w-3xl">
              Digital Twin 是企業治理知識的數位映射中心，負責承載企業價值觀、知識資產與治理記憶。
            </p>
          </div>
          <div className="flex gap-3">
            <BrandBadge variant="outline" className="border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
              <Activity size={14} className="mr-1" /> 量子拓樸開啟
            </BrandBadge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UniversalCard title="核心定位" variant="glow">
            <p className="text-sm text-white/70">建立企業專屬治理知識庫，保留長期 ESG 記憶與脈絡。</p>
          </UniversalCard>
          <UniversalCard title="量子模擬" variant="bordered">
            <p className="text-sm text-white/70">透過道德 DNA 滑桿，即時預演不同永續策略的未來影響。</p>
          </UniversalCard>
          <UniversalCard title="主權帳本" variant="glass">
            <p className="text-sm text-white/70">所有模擬意圖皆寫入主權帳本，確保決策過程的可追蹤性。</p>
          </UniversalCard>
          <UniversalCard title="RAG 知識" variant="default">
            <p className="text-sm text-white/70">結合企業歷史數據，讓 AI 生成更具主權性與一致性。</p>
          </UniversalCard>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ─── 左側：永續 DNA 參數設定 ─── */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <BrandCard padding="lg" className="h-full border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#020617]/40 shadow-xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Dna size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">永續 DNA 參數</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sustainability DNA Variables</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">綠電佈署比例 (%)</label>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">{params.greenEnergy}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="5"
                    value={params.greenEnergy}
                    onChange={(e) => setParams(p => ({ ...p, greenEnergy: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">內部碳定價 (NTD/tCO2e)</label>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">${params.carbonTax}</span>
                  </div>
                  <input
                    type="range" min="300" max="2000" step="100"
                    value={params.carbonTax}
                    onChange={(e) => setParams(p => ({ ...p, carbonTax: parseInt(e.target.value) }))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">供應鏈在地化比例 (%)</label>
                    <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 font-mono">{params.supplyChainLocal}%</span>
                  </div>
                  <input
                    type="range" min="10" max="100" step="5"
                    value={params.supplyChainLocal}
                    onChange={(e) => setParams(p => ({ ...p, supplyChainLocal: parseInt(e.target.value) }))}
                    className="w-full accent-cyan-600"
                  />
                </div>
              </div>

              <div className="mt-12">
                <BrandButton
                  variant="primary"
                  fullWidth
                  className="h-14 rounded-2xl shadow-xl shadow-blue-900/20 text-xs"
                  onClick={handleSimulate}
                  disabled={isSimulating}
                >
                  {isSimulating ? <RefreshCw size={18} className="animate-spin mr-2" /> : <Play size={18} className="mr-2" />}
                  {isSimulating ? "OmniAgent 量子推演中..." : "啟動情境模擬 (Run Simulation)"}
                </BrandButton>
              </div>
            </BrandCard>

            {/* Sovereign Proofs (Integrity Seals) */}
            <BrandCard padding="md" className="border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="text-cyan-400" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white/80">主權實證帳本 (Sovereign Proofs)</h4>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {seals.length === 0 ? (
                    <p className="text-[10px] text-white/30 italic">等待 5T 協議自動刻印...</p>
                  ) : (
                    seals.map(seal => (
                      <motion.div
                        key={seal.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-2 rounded bg-black/40 border border-white/5 flex flex-col gap-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-cyan-400">{seal.gate} SEALED</span>
                          <span className="text-[8px] text-white/20">{seal.timestamp}</span>
                        </div>
                        <div className="text-[8px] font-mono text-white/40 truncate">
                          HASH: {seal.hash}
                        </div>
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
          </motion.div>

          {/* ─── 右側：情境模擬視覺化 ─── */}
          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className={cn("xl:col-span-7 transition-all duration-700", isSimulating ? "opacity-50 blur-sm scale-[0.98]" : "opacity-100 scale-100")}>
                <ScenarioVisualizer result={scenarioResult} />
              </div>
              <div className="xl:col-span-5 h-[550px]">
                <SwarmResonance />
              </div>
            </div>

            <BrandCard padding="md" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/50 flex items-center gap-4">
              <BrainCircuit size={24} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                <strong className="font-black mr-2">OmniAgent 戰略洞察：</strong>
                {params.greenEnergy >= 20
                  ? `綠電比例達 ${params.greenEnergy}% 已突破 GRI 302-1 合規門檻，預計可使碳排放量降低 ${(params.greenEnergy * 0.5 + params.supplyChainLocal * 0.2).toFixed(1)}%。`
                  : '目前的綠電佈署比例過低，將面臨極高的碳費曝險與合規挑戰，建議立即調高綠電投資。'}
              </p>
            </BrandCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
