import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Wind,
  Shield,
  HardDrive,
  Share2,
  Cpu,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Orbit,
  Component,
} from 'lucide-react';
import { useQuantumResonance } from '../../hooks/useQuantumResonance';
import { useAgentRpg } from '../../hooks/useAgentRpg';

export const ResonanceMap: React.FC = () => {
  const { attemptBreakthrough, isProcessing, evolvedSkills } = useQuantumResonance();
  const { profile } = useAgentRpg();
  const [lastResult, setLastResult] = useState<any>(null);

  const attributes = [
    {
      id: 'computePower',
      name: '運算能力 (Compute)',
      icon: <Cpu className="w-5 h-5" />,
      color: 'cyan',
    },
    {
      id: 'empathyLevel',
      name: '情感共鳴 (Empathy)',
      icon: <Wind className="w-5 h-5" />,
      color: 'purple',
    },
    {
      id: 'governanceScore',
      name: '治理權重 (Governance)',
      icon: <Shield className="w-5 h-5" />,
      color: 'orange',
    },
  ];

  const handleBreakthrough = async (attr: string) => {
    const result = await attemptBreakthrough(attr);
    setLastResult(result);
    setTimeout(() => setLastResult(null), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Resonance Visualization */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden h-[600px] flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
              <Orbit className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                深層共鳴地圖 (Resonance Map)
              </h3>
              <p className="text-[10px] text-cyan-500/70 font-mono">QUANTUM_LAYER_v3.4</p>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            {/* 3D-like Orbital Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-[400px] h-[400px] border border-cyan-500/10 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: -720 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="w-[200px] h-[200px] border border-purple-500/20 rounded-full flex items-center justify-center"
                />
              </motion.div>
            </div>

            {/* Central Agent Node */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border-2 border-white/20 backdrop-blur-2xl flex flex-col items-center justify-center relative z-10 shadow-[0_0_50px_rgba(34,211,238,0.15)]"
            >
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Breakthrough</div>
              <div className="text-xl font-black text-white">LEVEL {profile.level}</div>
              <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-pulse" />
            </motion.div>

            {/* Adaptive Skill Indicators */}
            {evolvedSkills && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-10 left-10 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Component className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] font-black text-gray-300 uppercase">
                    Adaptive Evolution
                  </span>
                </div>
                <div className="text-sm font-black text-white">{evolvedSkills.name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded bg-${evolvedSkills.evolutionPath === 'E' ? 'green' : evolvedSkills.evolutionPath === 'S' ? 'purple' : 'orange'}-500/20 text-${evolvedSkills.evolutionPath === 'E' ? 'green' : evolvedSkills.evolutionPath === 'S' ? 'purple' : 'orange'}-400 uppercase`}
                  >
                    {evolvedSkills.evolutionPath} PATH
                  </span>
                  <span className="text-[9px] text-cyan-400 font-mono">
                    x{evolvedSkills.powerMultiplier.toFixed(2)} PWR
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Right Col: Breakthrough Chamber */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-black/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              極限突破 (Breakthrough Chamber)
            </h3>
          </div>

          <div className="space-y-4">
            {attributes.map(attr => (
              <div
                key={attr.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-${attr.color}-500/10 text-${attr.color}-400`}
                    >
                      {attr.icon}
                    </div>
                    <div className="text-[12px] font-bold text-gray-200">{attr.name}</div>
                  </div>
                  <div className="text-lg font-black font-mono text-white">
                    {(profile as any)[attr.id] || 0}
                  </div>
                </div>
                <button
                  onClick={() => handleBreakthrough(attr.id)}
                  disabled={isProcessing || profile.level < 5} // Lowered to 5 for demo, plan said 20
                  className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    profile.level < 5
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  {isProcessing ? 'CALCULATING RESONANCE...' : 'Initiate Breakthrough'}
                </button>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {lastResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-8 p-6 rounded-2xl border ${
                  lastResult.success
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {lastResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <h4
                    className={`text-sm font-black uppercase ${lastResult.success ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {lastResult.success ? '量子突破成功!' : '量子突破失敗'}
                  </h4>
                </div>
                <div className="text-[11px] text-gray-400 font-mono space-y-1">
                  <div>Attribute: {lastResult.attribute}</div>
                  <div className="flex items-center gap-2">
                    <span>{lastResult.oldValue}</span>
                    <Zap className="w-3 h-3" />
                    <span className={lastResult.success ? 'text-green-400 font-bold' : ''}>
                      {lastResult.newValue}
                    </span>
                  </div>
                  <div className="pt-2 text-[9px] text-gray-600 uppercase">
                    Entropy Cost: +{(lastResult.entropyImpact * 100).toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-[9px] text-gray-600 uppercase font-black">
              <span>Resonance Energy</span>
              <span className="text-cyan-400">100 / 100</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-full bg-cyan-500/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
