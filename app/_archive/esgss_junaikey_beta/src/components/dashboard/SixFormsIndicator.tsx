import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Brain, Zap, Swords, Play, Sparkles } from 'lucide-react';
import { useOmniMemory } from '../../omni/infrastructure/memory/OmniMemory';
import { SixFormsPhase } from '../../omni/infrastructure/types/Omni-entity.types';

// 5T Logic Gate Visualization
// Tangible Representation of the AI's Internal State

const PHASE_CONFIG: Record<
  SixFormsPhase,
  { icon: React.ElementType; color: string; label: string }
> = {
  AWAKENING: { icon: Eye, color: 'text-blue-400', label: '感知 (Awakening)' },
  ANALYSIS: { icon: Brain, color: 'text-purple-400', label: '解析 (Analysis)' },
  RESONANCE: { icon: Zap, color: 'text-yellow-400', label: '共鳴 (Resonance)' },
  STRATEGY: { icon: Swords, color: 'text-red-400', label: '奧義 (Strategy)' },
  EXECUTION: { icon: Play, color: 'text-green-400', label: '施展 (Execution)' },
  EVOLUTION: { icon: Sparkles, color: 'text-amber-400', label: '昇華 (Evolution)' },
};

export const SixFormsIndicator: React.FC = () => {
  const currentPhase = useOmniMemory(state => state.evolutionState.currentPhase);
  const config = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.AWAKENING;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
      <div className="flex flex-col items-end mr-2">
        <span className="text-[9px] text-gray-400 uppercase tracking-widest">Sentient Phase</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPhase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs font-bold font-mono ${config.color}`}
          >
            {config.label}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Pulse Effect */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 rounded-full bg-current opacity-20 ${config.color.replace('text-', 'bg-')}`}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <config.icon className={`w-5 h-5 ${config.color}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-1 ml-2">
        {Object.keys(PHASE_CONFIG).map((phase, i) => {
          const isActive = phase === currentPhase;
          const isPassed = Object.keys(PHASE_CONFIG).indexOf(currentPhase) > i;

          return (
            <motion.div
              key={phase}
              className={`w-1.5 h-1.5 rounded-full ${isActive ? config.color.replace('text-', 'bg-') : isPassed ? 'bg-gray-600' : 'bg-gray-800'}`}
              animate={{ scale: isActive ? 1.5 : 1 }}
            />
          );
        })}
      </div>
    </div>
  );
};
