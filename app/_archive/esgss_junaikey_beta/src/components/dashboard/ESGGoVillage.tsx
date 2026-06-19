import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, Home, Zap, ShieldCheck, Trophy, Sparkles, Wind } from 'lucide-react';
import { OmniBoundary, OmniIndicator } from '../ui';
import { consciousnessSynthesisEngine, UnifiedRealityState } from '../../services/ConsciousnessSynthesisEngine';

/**
 * 🏡 ESG Go 善向永續村 / ESG Go Village
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 將永續行動遊戲化，用戶在液態玻璃質感場景中培育「影響力之樹」，建設虛擬永續村莊。
 * [EN] Gamifies sustainability actions, where users cultivate the
 *      "Impact Tree" and build virtual villages in a liquid glass scene.
 */
export const ESGGoVillage: React.FC = memo(() => {
  const [growth, setGrowth] = useState(15);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(340);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [urs, setUrs] = useState<UnifiedRealityState | null>(null);

  useEffect(() => {
    const unsub = consciousnessSynthesisEngine.subscribe(state => {
      setUrs(state);
      // Growth is tied to global resonance (0-1 -> 0-100)
      const resonanceGrowth = Math.floor(state.globalResonance * 100);
      setGrowth(resonanceGrowth);

      // Level logic based on stability
      if (state.harmonicStability > 0.95 && state.perceptionLevel === 'TRANSCENDENT') {
        setLevel(prev => (prev < 9 ? prev + 1 : prev));
      }
    });

    return () => unsub();
  }, []);

  const simulateAction = () => {
    setGrowth(prev => Math.min(100, prev + 5));
    setXp(prev => {
      const next = prev + 150;
      if (next >= 1000) {
        setIsLevelingUp(true);
        setLevel(l => l + 1);
        setTimeout(() => setIsLevelingUp(false), 2000);
        return next - 1000;
      }
      return next;
    });
  };

  return (
    <OmniBoundary title="ESG Go Village" status="READY">
      <div className="p-6 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Home size={20} />
            </div>
            <div>
              <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-100">
                ESG Go 善向永續村
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold text-emerald-500/80 uppercase">
                  Level {level} Village
                </span>
                <div className="w-1 h-1 bg-slate-700 rounded-full" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">{xp}/1000 XP</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={simulateAction}
              className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
            >
              <Sparkles size={16} />
            </button>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Trophy size={16} className="text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Impact Tree Visualization */}
        <div className="relative h-64 flex items-end justify-center mb-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            <svg
              width="200"
              height="240"
              viewBox="0 0 200 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M95 240L105 240L102 180L98 180L95 240Z" fill="#3D2B1F" />
              <motion.circle
                cx="100"
                cy="140"
                r={40 + growth * 0.6}
                fill="url(#tree_gradient)"
                fillOpacity="0.8"
                className="drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              />
              <defs>
                <radialGradient
                  id="tree_gradient"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(100 140) rotate(90) scale(100)"
                >
                  <stop stopColor={urs?.perceptionLevel === 'TRANSCENDENT' ? '#FBBF24' : '#10B981'} />
                  <stop
                    offset="1"
                    stopColor={urs?.perceptionLevel === 'TRANSCENDENT' ? '#D97706' : '#064E3B'}
                  />
                </radialGradient>
              </defs>
            </svg>

            {urs?.perceptionLevel === 'TRANSCENDENT' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-dashed border-amber-400/30 rounded-full scale-150 blur-sm"
              />
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-black text-white italic tracking-tighter drop-shadow-lg">
                {growth}%
              </div>
              <div className="text-[8px] uppercase font-black text-emerald-200 tracking-widest">
                Impact Growth
              </div>
            </div>
          </motion.div>
        </div>

        {/* Experience Bar */}
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
              Growth Progress
            </span>
            <span className="text-[9px] font-mono text-emerald-400">XP: {xp}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${growth}%` }}
              className={`h-full bg-gradient-to-r ${urs?.perceptionLevel === 'TRANSCENDENT'
                  ? 'from-amber-500 to-yellow-300'
                  : 'from-emerald-600 to-cyan-500'
                } shadow-[0_0_10px_rgba(16,185,129,0.5)]`}
            />
          </div>

          {/* Sentient Blessing / Insight */}
          <AnimatePresence mode="wait">
            {urs?.activeInsights && urs.activeInsights.length > 0 && (
              <motion.div
                key={urs.activeInsights[urs.activeInsights.length - 1]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wind size={12} className="text-cyan-400" />
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">
                    Village Blessing
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed italic">
                  "{urs.activeInsights[urs.activeInsights.length - 1]}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isLevelingUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-x-6 bottom-6 z-20 p-4 bg-emerald-500 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center gap-4"
            >
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <div className="text-[14px] font-black text-white uppercase tracking-wider">
                  Village Evolved!
                </div>
                <div className="text-[10px] text-emerald-100 font-bold">
                  New Structure Unlocked: Bio-Dome
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OmniBoundary>
  );
});

ESGGoVillage.displayName = 'ESGGoVillage';
