import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Lock, Unlock, Fingerprint } from 'lucide-react';
import { useSovereignSession } from '../../hooks/useSovereignSession';

interface SystemEntropyStatusProps {
  variant?: 'default' | 'mini' | 'full';
}

export const SystemEntropyStatus: React.FC<SystemEntropyStatusProps> = ({
  variant = 'default',
}) => {
  const { entropy, stabilityRating, isResonant, toggleResonance } = useSovereignSession();

  const getEntropyColor = () => {
    if (entropy < 0.2) return 'text-cyan-400';
    if (entropy < 0.5) return 'text-yellow-400';
    if (entropy < 0.8) return 'text-orange-400';
    return 'text-red-500';
  };

  const handleMockResonance = () => {
    // Mocking joint signature for demonstration
    toggleResonance({ type: 'JUN_AI_KEY' }, { type: 'TECH_ORACLE' });
  };

  if (variant === 'mini') {
    return (
      <div className="flex items-center gap-3 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
          <Activity size={12} className={getEntropyColor()} />
          <span className={`text-[10px] font-mono font-bold ${getEntropyColor()}`}>
            {(entropy * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isResonant ? (
            <Unlock size={10} className="text-cyan-400" />
          ) : (
            <Lock size={10} className="text-gray-600" />
          )}
          <span
            className={`text-[9px] font-mono font-black ${isResonant ? 'text-cyan-400' : 'text-gray-600'}`}
          >
            {isResonant ? 'RESONANT' : 'LOCKED'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
      {/* Background Glow */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-20 transition-colors duration-1000 ${
          stabilityRating === 'STABLE'
            ? 'bg-cyan-500'
            : stabilityRating === 'CRITICAL_ENTROPY'
              ? 'bg-red-500'
              : 'bg-yellow-500'
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${getEntropyColor()}`} />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              系統熵值實時監測
            </h3>
          </div>
          <div
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              stabilityRating === 'STABLE'
                ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5'
                : 'border-red-500/30 text-red-400 bg-red-500/5'
            }`}
          >
            {stabilityRating}
          </div>
        </div>

        {/* Entropy Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-gray-500">ENTROPY_LEVEL</span>
            <span className={getEntropyColor()}>{(entropy * 100).toFixed(2)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${entropy * 100}%` }}
              className={`h-full transition-colors duration-1000 ${
                entropy < 0.5 ? 'bg-cyan-500' : entropy < 0.8 ? 'bg-orange-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Resonance Control */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Fingerprint
                className={`w-4 h-4 ${isResonant ? 'text-cyan-400' : 'text-gray-600'}`}
              />
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                雙生共鳴簽署 (Twin Resonance)
              </span>
            </div>
            {isResonant ? (
              <Unlock className="w-3 h-3 text-cyan-400" />
            ) : (
              <Lock className="w-3 h-3 text-gray-600" />
            )}
          </div>

          <button
            onClick={handleMockResonance}
            disabled={isResonant}
            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              isResonant
                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 cursor-default'
                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <Zap className={`w-4 h-4 ${isResonant ? 'fill-cyan-400' : ''}`} />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isResonant ? 'RESONANCE_ESTABLISHED' : 'INITIATE JOINT SIGNATURE'}
            </span>
          </button>

          <p className="text-[9px] text-gray-600 mt-3 italic text-center">
            *Requires CSO (Jun) & CTO (Bro) credentials to mitigate high entropy.
          </p>
        </div>
      </div>
    </div>
  );
};
