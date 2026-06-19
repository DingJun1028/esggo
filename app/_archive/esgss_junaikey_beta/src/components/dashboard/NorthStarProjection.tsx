import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Star, Target } from 'lucide-react';

export const NorthStarProjection: React.FC = () => {
  const [score, setScore] = useState(0);
  const [isAligning, setIsAligning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScore(88.42);
      setIsAligning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl relative overflow-hidden h-full flex flex-col">
      {/* Guidance Beam Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-cyan-400/50 via-cyan-400/10 to-transparent blur-[2px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400">
          <Compass size={16} />
        </div>
        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-200">
          My North Star (我的北極星)
        </h4>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 border-2 border-dashed border-cyan-500/20 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-cyan-500/20 p-4 rounded-full"
            >
              <Star size={32} className="text-cyan-400 fill-cyan-400/20" />
            </motion.div>
          </div>
          {/* Alignment Pulse */}
          <AnimatePresence>
            {isAligning && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-cyan-400 rounded-full"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <div className="text-3xl font-black text-white italic tracking-tighter">
            {score > 0 ? `${score}%` : 'ALIGNING...'}
          </div>
          <div className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-1">
            Alignment Consistency Score
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 relative z-10">
        <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3">
          <Target size={12} className="text-slate-500" />
          <div>
            <div className="text-[8px] text-slate-500 uppercase font-black">Corporate Target</div>
            <div className="text-[10px] text-slate-300 font-bold tracking-tight text-white/90">
              SUSTAINABLE+
            </div>
          </div>
        </div>
        <div className="p-2 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3">
          <Zap size={12} className="text-yellow-400" />
          <div>
            <div className="text-[8px] text-slate-500 uppercase font-black">Optimization</div>
            <div className="text-[10px] text-slate-300 font-bold tracking-tight text-white/90">
              +12.4% CALIBRATED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';
