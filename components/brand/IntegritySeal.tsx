'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Hash, Lock, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface IntegritySealProps {
  isSealed: boolean;
  hash?: string;
  timestamp?: string;
  className?: string;
}

export default function IntegritySeal({ isSealed, hash, timestamp, className = '' }: IntegritySealProps) {
  return (
    <div className={cn("relative group", className)}>
      <AnimatePresence mode="wait">
        {isSealed ? (
          <motion.div
            key="sealed"
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            className="flex items-center gap-4 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-[2rem] shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden"
          >
            {/* Luminous Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-white/5 to-emerald-500/5 animate-pulse" />
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 z-10">
              <ShieldCheck size={24} />
            </div>
            
            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase">T5_INTEGRITY_SEALED</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Hash size={12} className="text-emerald-400" />
                <p className="text-[9px] font-mono font-black text-emerald-700 truncate opacity-80">
                  {hash || '0x4f...8e21'}
                </p>
              </div>
            </div>
            
            <div className="text-right hidden md:block z-10">
              <p className="text-[8px] font-bold text-emerald-600/60 uppercase">Certified At</p>
              <p className="text-[9px] font-black text-emerald-700">{timestamp || new Date().toLocaleDateString()}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 bg-slate-100/50 border border-dashed border-slate-300 p-4 rounded-[2rem] grayscale opacity-60"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Integrity_Pending</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">Awaiting 5T Finalization...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Particle (Hologram Effect) */}
      {isSealed && (
        <motion.div 
          className="absolute -top-2 -right-2 text-emerald-400"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap size={16} fill="currentColor" />
        </motion.div>
      )}
    </div>
  );
}
