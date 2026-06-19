import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ExternalLink,
  Hexagon,
  Fingerprint,
  Sparkles,
  Zap,
  Lock,
  Calculator,
  X,
} from 'lucide-react';
import type { ImpactTrustBadgeProps, IMeritProfile10 } from '@/types/core/index.ts';

/**
 * 💡 Impact Trust Badge (誠信標章)
 * --------------------------------------------------
 * A premium, interactive UI element representing an Immutable Proof of Impact (5T Protocol).
 * Now features: Crystallization Animation, Entropy Glow, and Transparent Logic Popup.
 */
const ImpactTrustBadge: React.FC<ImpactTrustBadgeProps> = ({
  proof,
  size = 'md',
  variant = 'premium',
  onVerifyClick,
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const { tangible_manifest, logic_formula, hash_lock } = proof.evidence;
  const verifyUrl = `${globalThis.location.origin}/verify/${proof.uuid}`;

  const sizeClasses = {
    sm: 'w-48 p-4',
    md: 'w-72 p-6',
    lg: 'w-88 p-8',
  };

  const qrSizes = {
    sm: 80,
    md: 112,
    lg: 144,
  };

  const tLabels = [
    'Traceable (溯源)',
    'Trackable (追蹤)',
    'Transparent (透明)',
    'Tangible (感知)',
    'Trustworthy (信實)',
  ];

  const gradeStyles = {
    GOLD: 'border-yellow-500/30 shadow-yellow-500/10',
    PLATINUM: 'border-cyan-400/30 shadow-cyan-500/10',
    SOVEREIGN: 'border-purple-500/30 shadow-purple-500/20',
  };

  const virtueLabels: Record<keyof IMeritProfile10, { zh: string; en: string; color: string }> = {
    intelligence: { zh: '智', en: 'Int', color: 'bg-blue-400' },
    benevolence: { zh: '仁', en: 'Ben', color: 'bg-emerald-400' },
    integrity: { zh: '誠', en: 'Intg', color: 'bg-rose-400' },
    courage: { zh: '勇', en: 'Cou', color: 'bg-orange-400' },
    temperance: { zh: '節', en: 'Tem', color: 'bg-indigo-400' },
    harmony: { zh: '和', en: 'Har', color: 'bg-purple-400' },
  };

  // Dynamic Entropy Glow based on crystallization
  const glowColor = tangible_manifest?.is_crystallized
    ? 'shadow-celestial-blue/50'
    : 'shadow-slate-500/20';
  const glowAnimation = tangible_manifest?.is_crystallized ? 'animate-pulse-slow' : 'animate-none';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        filter: tangible_manifest?.is_crystallized ? 'blur(0px)' : 'blur(2px)', // 🟣 Tangible: Crystallization Effect
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`relative ${sizeClasses[size]} bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl ${glowColor} ${glowAnimation} group`}
    >
      {/* 1. BACKGROUND EFFECTS */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full -mr-20 -mt-20 group-hover:bg-blue-500/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full -ml-20 -mb-20 group-hover:bg-emerald-500/20 transition-all duration-700" />

      {/* 2. HEADER: 5T PROTOCOL IDENTITY */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div
          className="flex items-center gap-2 cursor-help"
          title="5T: Traceable, Trackable, Transparent, Tangible, Trustworthy"
        >
          <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="block text-[10px] font-mono text-emerald-400 tracking-tighter uppercase font-bold leading-none">
              5T Sentinel
            </span>
            <span className="text-[8px] text-slate-500 font-mono">Verified Proof</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${proof.meridian === 'INWARD_REN' ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]`}
          />
          <span className="text-[9px] font-mono text-blue-300 font-bold uppercase tracking-wider">
            {proof.meridian === 'INWARD_REN' ? '任脈' : '督脈'}
          </span>
        </div>
      </div>

      {/* 3. CORE VISUAL: QR CODE & 5T LIGHTS (Clickable for Logic) */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <button
          onClick={() => setShowFormula(true)}
          className="relative p-2.5 bg-white/90 rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
        >
          <QRCodeSVG value={verifyUrl} size={qrSizes[size]} level="H" includeMargin={false} />
          {/* Scan Line Animation */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-scan pointer-events-none" />
        </button>

        <div className="mt-5 flex gap-1.5 items-center">
          {['t1', 't2', 't3', 't4', 't5'].map((t, idx) => (
            <div
              key={t}
              className={`w-2 h-2 rounded-full ${idx < 5 ? (idx === 4 ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-700'} shadow-[0_0_8px_rgba(16,185,129,0.5)] cursor-help`}
              title={tLabels[idx]}
            />
          ))}
          {tangible_manifest?.is_crystallized && (
            <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse ml-1" />
          )}
        </div>
        <p className="mt-2 text-[8px] text-slate-500 font-mono uppercase tracking-[0.3em]">
          5T Sentinel Integrity Verified
        </p>
      </div>

      {/* 4. SIX VIRTUES RADAR (Linear Representation for space) */}
      <div className="relative z-10 space-y-2 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Hexagon className="w-3 h-3 text-emerald-400" /> Six Virtues (六德)
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Score: 1-10</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {(Object.keys(virtueLabels) as Array<keyof IMeritProfile10>).map(key => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="w-full h-12 bg-white/5 rounded-full relative overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${proof.virtues[key] * 10}%` }}
                  className={`absolute bottom-0 inset-x-0 ${virtueLabels[key].color} opacity-60`}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-bold text-white/50">{virtueLabels[key].zh}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FOOTER: VERIFICATION & HASH */}
      <div className="relative z-10 pt-5 border-t border-white/5">
        <button
          type="button"
          onClick={() => onVerifyClick?.(proof.uuid)}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white text-[11px] font-bold rounded-2xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 group/btn"
        >
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          VERIFY IMMUTABILITY
        </button>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[9px] font-mono text-slate-500 tracking-tighter">
              HASH: {hash_lock ? hash_lock.substring(0, 10) : 'PENDING'}
            </span>
          </div>
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* 🟠 Transparent: Logic Formula Popup */}
      <AnimatePresence>
        {showFormula && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-blue-300 mb-2">Transparent Logic (T3)</h4>
            <p className="text-[10px] text-slate-400 mb-4 font-mono">
              This metric is calculated using the following transparent protocol formula:
            </p>
            <div className="bg-black/50 p-3 rounded-lg border border-white/10 w-full mb-4">
              <code className="text-[10px] text-emerald-400 font-mono break-all font-bold">
                {logic_formula || 'S_reduction = Σ(E_base - E_actual) * ω_i'}
              </code>
            </div>
            <button
              onClick={() => setShowFormula(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImpactTrustBadge;
