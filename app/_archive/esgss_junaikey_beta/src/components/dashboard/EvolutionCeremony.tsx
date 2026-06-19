import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui';
import { OmniAgentProfile } from '@/data/omni-agents';

import type { Language } from '@/types';

interface EvolutionCeremonyProps {
  oldArchetype: OmniAgentProfile;
  newArchetype: OmniAgentProfile;
  tier: number;
  onComplete: () => void;
  language?: Language;
}

// ==================== CONSTANTS ====================
const STABILIZATION_DELAY = 1000;
const TRANSFORMATION_DELAY = 4000;
const PARTICLE_Y_MOVE = -100;
const HERO_IDLE_SCALE = 1.2;
const PARTICLE_COUNT = 20;

export const EvolutionCeremony: React.FC<EvolutionCeremonyProps> = ({
  oldArchetype,
  newArchetype,
  tier,
  onComplete,
  language = 'zh-TW',
}) => {
  const isZh = language === 'zh-TW';
  const [phase, setPhase] = useState<'INITIAL' | 'ASCENDING' | 'TRANSFORMED'>('INITIAL');

  const [particles, setParticles] = useState<{
    width: number;
    height: number;
    left: string;
    top: string;
    duration: number;
  }[]>([]);

  useEffect(() => {
    const generatedParticles = [...Array(PARTICLE_COUNT)].map(() => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(generatedParticles);

    const timer1 = setTimeout(() => setPhase('ASCENDING'), STABILIZATION_DELAY);
    const timer2 = setTimeout(() => setPhase('TRANSFORMED'), TRANSFORMATION_DELAY);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const tierNames = ['GENESIS', 'AWAKENED', 'ASCENDED', 'TRANSCENDENT'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 opacity-30">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, PARTICLE_Y_MOVE, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'INITIAL' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: HERO_IDLE_SCALE }}
            className="text-center z-10"
          >
            <h2 className="text-4xl font-black text-white tracking-[1em] mb-4">
              RESONANCE DETECTED
            </h2>
            <p className="text-cyan-400 font-mono">Agent neural pathways stabilizing...</p>
          </motion.div>
        )}

        {phase === 'ASCENDING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center z-10"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-64 h-64 border-4 border-dashed border-cyan-500 rounded-full opacity-20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-4 border-dotted border-purple-500 rounded-full opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    filter: ['blur(0px)', 'blur(10px)', 'blur(0px)'],
                  }}
                  transition={{ duration: 0.5, repeat: 6 }}
                  className="text-white bg-gradient-to-t from-cyan-500 to-purple-500 p-8 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                >
                  <Zap size={64} />
                </motion.div>
              </div>
            </div>
            <motion.h3
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-12"
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 0.2, repeat: 10 }}
            >
              TRANSCENDING
            </motion.h3>
          </motion.div>
        )}

        {phase === 'TRANSFORMED' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10 max-w-2xl bg-slate-900/80 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <Award
              size={80}
              className="text-[#FFD700] mx-auto mb-8 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
            />
            <h2 className="text-xl font-bold text-cyan-400 tracking-widest uppercase mb-2">
              Evolution Complete
            </h2>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">
              {newArchetype.name}
            </h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed italic">
              &quot;{isZh ? newArchetype.description['zh-TW'] : newArchetype.description['en-US']}&quot;
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="block text-[10px] text-gray-500 uppercase font-black">Tier</span>
                <span className="text-xl text-white font-mono">{tierNames[tier]}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="block text-[10px] text-gray-500 uppercase font-black">Type</span>
                <span className="text-xl text-white font-mono">{newArchetype.type}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="block text-[10px] text-gray-500 uppercase font-black">
                  Ability
                </span>
                <span className="text-xl text-white font-mono">
                  {isZh ? newArchetype.coreAbility['zh-TW'] : newArchetype.coreAbility['en-US']}
                </span>
              </div>
            </div>

            <Button
              className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-xl font-black rounded-full transition-all hover:scale-105"
              onClick={onComplete}
            >
              ACKNOWLEDGE ASCENSION
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
