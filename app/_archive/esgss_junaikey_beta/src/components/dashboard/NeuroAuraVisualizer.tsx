import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { neuroAuraService, AuraProfile } from '../../services/NeuroAuraService';

export const NeuroAuraVisualizer: React.FC = () => {
  const [aura, setAura] = useState<AuraProfile | null>(null);

  useEffect(() => {
    const updateAura = async () => {
      const data = await neuroAuraService.calculateAura();
      setAura(data);
    };
    updateAura();
    const interval = setInterval(updateAura, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!aura) return null;

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900/50 border border-white/5 group">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />

      {/* SVG Aura Effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="aura-blur">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="aura"
            />
          </filter>
        </defs>
        <motion.circle
          cx="50%"
          cy="50%"
          animate={{
            r: [40, 60, 40],
            fill: [aura.dominantColor, '#ffffff', aura.dominantColor],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          filter="url(#aura-blur)"
        />
      </svg>

      {/* Aura Stats Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50"
        >
          Current Neuro-Aura
        </motion.div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-black text-white">{aura.resonance.toFixed(0)}%</div>
            <div className="text-[8px] font-black text-slate-500 uppercase">Resonance</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-black text-white">{aura.harmony.toFixed(0)}%</div>
            <div className="text-[8px] font-black text-slate-500 uppercase">Harmony</div>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 text-[9px] font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 uppercase tracking-tighter"
          style={{ color: aura.dominantColor, borderColor: `${aura.dominantColor}33` }}
        >
          {neuroAuraService.getAuraStatus(aura)}
        </motion.div>
      </div>

      {/* Background Ambient Pulses */}
      <AnimatePresence>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.1, 0], scale: [0.5, 1.5], rotate: [0, 90] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[200px] h-[200px] border border-white/5 rounded-full"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
