import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import { crystalSynthesisService, CrystalData } from '../../services/CrystalSynthesisService';
import AnnualImpactPredictionChart from './charts/AnnualImpactPredictionChart';
import MirrorOfTruth from '../ui/MirrorOfTruth';
import { EvolutionLoopPanel } from './EvolutionLoopPanel';

const SustainabilitySpecialZone: React.FC = () => {
  const [crystals, setCrystals] = useState<CrystalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await crystalSynthesisService.scanCrystals();
        setCrystals(data);
      } catch (error) {
        omniLogger.error(
          LogCategory.SYSTEM,
          '[SustainabilitySpecialZone] Failed to scan crystals',
          { error }
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-slate-200 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
          <div>
            <div className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.5em] mb-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-cyan-500/50" />
              Omni-Sprite Special Zone
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
              永續報告專區 <span className="text-slate-800">/</span> <br />
              <span className="bg-clip-text text-transparent bg-[linear-gradient(110deg,#fff,rgba(255,255,255,0.4),#fff)] bg-[length:200%_100%] animate-[shimmer_3s_infinite]">
                動態典範看板
              </span>
            </h2>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-[0.2em] opacity-50">
              System Integrity Scan
            </div>
            <div className="flex gap-1.5 justify-end">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [12, 24, 12] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1.5 bg-cyan-400/30 rounded-full"
                />
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 group">
            <div className="bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 h-full shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <AnnualImpactPredictionChart />
            </div>
          </div>

          {/* Activity Feed / Crystals */}
          <div className="bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex justify-between items-center">
              <span>
                最近合成晶體 <span className="text-white/20">Synthesis</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 text-[10px]">LIVE</span>
              </span>
            </h3>
            <div className="space-y-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {crystals.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8 border-l-2 border-slate-800/50 hover:border-cyan-500/50 transition-colors pb-1 group/item"
                >
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-800 group-hover/item:bg-cyan-500 transition-colors shadow-[0_0_15px_rgba(6,182,212,0)] group-hover/item:shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                  <div className="text-[9px] text-slate-500 font-black mb-1 uppercase tracking-widest">
                    {new Date(c.timestamp).toLocaleDateString()} · {c.origin}
                  </div>
                  <div className="text-slate-200 font-black text-sm mb-1 group-hover/item:text-cyan-400 transition-colors">
                    {c.sourceName}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic opacity-80 line-clamp-2">
                    "{c.content}"
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[8px] bg-white/5 text-slate-400 px-3 py-1 rounded-lg border border-white/5 uppercase font-black tracking-widest group-hover/item:border-cyan-500/20">
                      {c.targetSection}
                    </span>
                    {c.isStrategic && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg border border-amber-500/20 uppercase font-black tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        Strategic
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/5 hover:border-white/10"
            >
              查看完整數據鏈覽
            </motion.button>
          </div>
        </div>

        {/* Global Compliance Map Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-xl group"
          >
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              SDGs 映射成熟度
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden mb-4 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                transition={{ duration: 1.5, ease: 'circOut' }}
                className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500 relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:100%_100%] animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-emerald-400 tracking-tighter">
                78<span className="text-sm font-normal">%</span>
              </span>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                SDG 13, 17, 8
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-xl group"
          >
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              GRI G4 填充進度
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden mb-4 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '62%' }}
                transition={{ duration: 1.5, ease: 'circOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:100%_100%] animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-blue-400 tracking-tighter">
                62<span className="text-sm font-normal">%</span>
              </span>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                Auto-Crystals
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-xl flex items-center justify-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <div className="text-center relative z-10">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
                Trustworthy Hash Seal
              </div>
              <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 group-hover:border-red-500/30 transition-colors">
                <div className="text-2xl animate-pulse">🔒</div>
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-400 truncate w-32">
                    0x7a2...f8e9
                  </div>
                  <div className="text-[8px] font-black text-red-500/70 uppercase mt-1">
                    Last Seal 12m ago
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Phase 49: Advanced Governance Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-1 bg-white/5 ring-1 ring-white/10 rounded-[3rem] shadow-2xl overflow-hidden h-full">
              <MirrorOfTruth />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-1 bg-white/5 ring-1 ring-white/10 rounded-[3rem] shadow-2xl overflow-hidden h-full">
              <EvolutionLoopPanel />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilitySpecialZone;
