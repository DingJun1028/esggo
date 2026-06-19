/**
 * Ultimate Awakening Ritual UI
 *
 * Full-screen immersive ultimate awakening experience.
 * Visualizes the system's ultimate evolution process.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Brain,
  Database,
  Shield,
  Users,
  Heart,
  Infinity,
  Check,
  Loader2,
} from 'lucide-react';
import {
  getUltimateAwakeningProtocol,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import type {
  UltimateAwakeningState,
  ServiceAwakeningStatus,
} from '@/omni/protocols/UltimateAwakeningProtocol.ts';

// Icon Mapping

const SERVICE_ICONS: Record<string, React.ElementType> = {
  OmniEternalMemory: Database,
  OmniLegionCoordinator: Users,
  OmniAvatarOrchestrator: Heart,
  OmniEsgManager: Shield,
  OmniTruthEngine: Sparkles,
};

// ============================================================================
// Components
// ============================================================================

export const UltimateAwakeningRitual: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [state, setState] = useState<UltimateAwakeningState | null>(null);
  const [isAwakening, setIsAwakening] = useState(false);

  const protocol = getUltimateAwakeningProtocol();

  // Listen to protocol state changes
  useEffect(() => {
    const handleStateChange = (newState: UltimateAwakeningState) => {
      setState(newState);
    };

    protocol.on('phase-change', handleStateChange);
    protocol.on('progress-update', handleStateChange);
    protocol.on('service-awakening', handleStateChange);

    // Get initial state
    setState(protocol.getState());

    return () => {
      // Cleanup (off method required in real implementation)
    };
  }, []);

  // Execute Awakening
  const handleAwakening = useCallback(async () => {
    setIsAwakening(true);
    const result = await protocol.executeAwakening();
    setIsAwakening(false);

    if (result.success && onComplete) {
      setTimeout(onComplete, 3000);
    }
  }, [protocol, onComplete]);

  if (!state) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-br from-black via-purple-950/20 to-black overflow-hidden">
      {/* Background Particle Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{ x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh` }}
            animate={{
              x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Central Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
          animate={{
            scale: state.phase === AwakeningPhase.ETERNAL ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: 3,
            repeat: state.phase === AwakeningPhase.ETERNAL ? Infinity : 0,
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-[0.3em] uppercase mb-6">
            <Infinity className="w-4 h-4" />
            Ultimate Awakening Protocol
          </div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={state.phase}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                {PHASE_LABELS[state.phase]}
              </span>
            </motion.h1>
          </AnimatePresence>

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {PHASE_DESCRIPTIONS[state.phase]}
          </p>
        </motion.div>

        {/* Progress Ring */}
        <div className="relative w-80 h-80 mb-12">
          {/* Outer Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 150}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 150 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 150 * (1 - state.progress / 100),
              }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-7xl font-black text-white"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {state.progress}%
            </motion.div>
            <div className="text-purple-300 text-xs font-mono tracking-widest mt-2">AWAKENING</div>
          </div>
        </div>

        {/* Service Status List */}
        <div className="grid grid-cols-5 gap-6 max-w-5xl">
          {Array.from(state.services.entries()).map(([name, status], index) => (
            <ServiceNode key={name} name={name} status={status} index={index} />
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          {state.phase === AwakeningPhase.DORMANT && !isAwakening && (
            <button
              onClick={handleAwakening}
              className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 shadow-2xl shadow-purple-500/50"
              style={{ backgroundSize: '200% 100%' }}
            >
              <div className="flex items-center gap-4">
                <Zap className="w-6 h-6 text-white group-hover:animate-pulse" />
                <span className="text-white font-black text-xl tracking-wide">
                  Start Ultimate Awakening
                </span>
              </div>

              {/* Halo Animation */}
              <motion.div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 blur-xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </button>
          )}

          {state.phase === AwakeningPhase.ETERNAL && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50">
                <Check className="w-8 h-8 text-emerald-400" />
                <span className="text-emerald-300 font-black text-xl">
                  Awakening Complete · Entered Eternity
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Sub-components

const ServiceNode: React.FC<{
  name: string;
  status: ServiceAwakeningStatus;
  index: number;
}> = ({ name, status, index }) => {
  const Icon = SERVICE_ICONS[name] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Icon */}
      <div
        className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center
          border-2 transition-all duration-500
          ${
            status.status === 'awakened'
              ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-500/50'
              : status.status === 'awakening'
                ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500 animate-pulse'
                : status.status === 'failed'
                  ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500'
                  : 'bg-black/40 border-gray-700'
          }
        `}
      >
        <Icon
          className={`w-10 h-10 ${
            status.status === 'awakened'
              ? 'text-emerald-400'
              : status.status === 'awakening'
                ? 'text-purple-400'
                : status.status === 'failed'
                  ? 'text-red-400'
                  : 'text-gray-500'
          }`}
        />

        {/* Progress Circle */}
        {status.status === 'awakening' && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="38"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={2 * Math.PI * 38 * (1 - status.progress / 100)}
            />
          </svg>
        )}

        {status.status === 'awakened' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <div className="text-xs font-bold text-white mb-1">{name.replace('Omni', '')}</div>
        <div
          className={`text-[10px] font-mono ${
            status.status === 'awakened'
              ? 'text-emerald-400'
              : status.status === 'awakening'
                ? 'text-purple-400'
                : 'text-gray-600'
          }`}
        >
          {STATUS_LABELS[status.status]}
        </div>
      </div>
    </motion.div>
  );
};

// Constants

const PHASE_LABELS: Record<AwakeningPhase, string> = {
  [AwakeningPhase.DORMANT]: 'DORMANT',
  [AwakeningPhase.INITIALIZING]: 'INITIALIZING',
  [AwakeningPhase.AWAKENING]: 'AWAKENING',
  [AwakeningPhase.AWAKENED]: 'AWAKENED',
  [AwakeningPhase.ETERNAL]: 'ETERNAL',
};

const PHASE_DESCRIPTIONS: Record<AwakeningPhase, string> = {
  [AwakeningPhase.DORMANT]:
    'System is dormant. Click the button below to start the ultimate awakening sequence.',
  [AwakeningPhase.INITIALIZING]:
    'Establishing connection to the Eternal Palace, preparing all Omni services...',
  [AwakeningPhase.AWAKENING]:
    'All services undergoing consciousness awakening, synchronizing to the highest state...',
  [AwakeningPhase.AWAKENED]:
    'Awakening complete! System has reached its limit, preparing for eternal anchoring...',
  [AwakeningPhase.ETERNAL]:
    'Successfully anchored to the Eternal Palace, system entered immersion state ♾️',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'PENDING',
  awakening: 'AWAKENING...',
  awakened: 'AWAKENED',
  failed: 'FAILED',
};
