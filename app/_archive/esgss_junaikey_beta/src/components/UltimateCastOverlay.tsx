import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Hexagon, Component, Aperture } from 'lucide-react';
import type { UltimateRune } from '@/types/runeArts';

interface UltimateCastOverlayProps {
  ultimate: UltimateRune | null;
  onComplete: () => void;
}

export const UltimateCastOverlay: React.FC<UltimateCastOverlayProps> = ({
  ultimate,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'charge' | 'cast' | 'impact'>('charge');

  useEffect(() => {
    if (!ultimate) return;

    // Sequence timing
    const timer1 = setTimeout(() => setPhase('cast'), 1500);
    const timer2 = setTimeout(() => setPhase('impact'), 3000);
    const timer3 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [ultimate, onComplete]);

  if (!ultimate) return null;

  return (
    <Portal>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Background Dynamic Effects */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent animate-[spin_10s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        {/* Central Visual */}
        <div className="relative z-10 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {phase === 'charge' && (
              <motion.div
                key="charge"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="relative"
              >
                <Hexagon size={120} className="text-cyan-400 fill-cyan-400/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap
                    size={60}
                    className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  />
                </div>
                {/* Energy gathering particles */}
                <div className="absolute -inset-20">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      animate={{
                        x: Math.cos(i * (Math.PI / 4)) * 100,
                        y: Math.sin(i * (Math.PI / 4)) * 100,
                        opacity: [0, 1, 0],
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {phase === 'cast' && (
              <motion.div
                key="cast"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="text-center"
              >
                <h1 className="text-6xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] transform -skew-x-12">
                  {ultimate.name}
                </h1>
                <p className="text-2xl text-cyan-200 font-mono tracking-[0.5em] mt-4 uppercase">
                  Ultimate Released
                </p>
              </motion.div>
            )}

            {phase === 'impact' && (
              <motion.div
                key="impact"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  className="w-[300vw] h-[300vw] bg-white"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Portal>
  );
};

// Simple Portal to render at body root
import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return createPortal(children, document.body);
};
