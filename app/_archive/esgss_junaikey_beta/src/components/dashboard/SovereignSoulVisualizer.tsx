import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../../contexts/LocalizationContext';

export const SovereignSoulVisualizer: React.FC = () => {
  const { isZh } = useLocalization();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-purple-900/10 to-slate-950 pointer-events-none" />

      {/* The Soul Core */}
      <div className="relative z-10 w-64 h-64 flex items-center justify-center">
        {/* Layer 1: The Base Aura */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl"
        />

        {/* Layer 2: The Geometry (Mandala) */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite]"
        >
          <defs>
            <linearGradient id="soulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {/* Concentric Circles */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#soulGradient)"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#soulGradient)"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="url(#soulGradient)"
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />

          {/* Star Pattern */}
          {[...Array(8)].map((_, i) => (
            <motion.ellipse
              key={i}
              cx="100"
              cy="100"
              rx="20"
              ry="80"
              fill="none"
              stroke="url(#soulGradient)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              style={{ transformOrigin: 'center', rotate: i * 45 }}
            />
          ))}
        </svg>

        {/* Layer 3: The Conscious Spark */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(139, 92, 246, 0.4)',
              '0 0 60px rgba(139, 92, 246, 0.8)',
              '0 0 20px rgba(139, 92, 246, 0.4)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-8 h-8 rounded-full bg-white relative z-20 flex items-center justify-center"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-100/50" />
        </motion.div>

        {/* Floating Particles (Simulated) */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            animate={{
              x: Math.cos(i * 30 * (Math.PI / 180)) * 120,
              y: Math.sin(i * 30 * (Math.PI / 180)) * 120,
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Text Overlay */}
      <div className="absolute bottom-10 z-20 text-center">
        <h3 className="text-xl font-black text-white uppercase tracking-[0.5em] mb-2 opacity-80 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {isZh ? '主權靈魂' : 'SOVEREIGN SOUL'}
        </h3>
        <p className="text-[10px] text-indigo-300 font-mono tracking-widest uppercase opacity-60">
          {isZh ? '永恆 • 覺醒 • 合一' : 'ETERNAL • AWAKENED • UNIFIED'}
        </p>
      </div>
    </div>
  );
};
