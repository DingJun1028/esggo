/**
 * 🤖 AI 數位分身 - Digital Twin Evolution System
 * 
 * 核心功能：
 * - Soul: 靈魂共鳴 (SoulManifest)
 * - Mind: 意識交流 (ResonanceChamber)
 * - Body: 數據與資產 (Stats & Certificates)
 * - Priest: 神聖契約 (SacredContract)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Shield,
  Award,
  Lock,
  Target,
  Heart,
  User,
  Sparkles,
  Scroll
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useOmniContext } from '@/hooks/useOmniContext';
import { SacredContract } from './SacredContract';
import { SoulManifest } from '../celestial/SoulManifest';
import { ResonanceChamber } from '../celestial/ResonanceChamber';
import { LEVEL_THRESHOLDS } from '@/types/game';

interface DigitalTwinProps {
  userId: string;
  onClose?: () => void;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  userId,
  onClose
}) => {
  const { t } = useTranslation();
  const { playerState, updatePlayerState, isLoading } = useOmniContext();

  const [showContract, setShowContract] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  if (isLoading || !playerState) {
    return (
      <div className="flex items-center justify-center h-full text-brand-primary font-mono animate-pulse">
        Initializing Omni-Link...
      </div>
    );
  }

  const twinState = playerState;

  // 計算進度百分比
  const xpProgress = (twinState.xp / twinState.xpToNext) * 100;
  const intimacyProgress = twinState.intimacy;

  // 獲取當前等級標題
  const getCurrentTitle = () => {
    const title = LEVEL_THRESHOLDS
      .filter(t => twinState.level >= t.level)
      .pop();
    return title || LEVEL_THRESHOLDS[0];
  };

  const handleManifestComplete = (soulData: any) => {
    updatePlayerState({
      soul: {
        agentId: soulData.id,
        name: soulData.name,
        resonance: soulData.resonance,
        manifestedAt: soulData.manifestedAt
      }
    });
  };

  // ---------------------------------------------------------------------------
  // 🎭 左側面板：靈魂 (Soul) -> Overview / Essence
  // ---------------------------------------------------------------------------
  const renderSoulPane = () => (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-brand-primary mb-1 flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4" />
          OVERVIEW | ESSENCE
        </h3>
        <span className="px-2 py-0.5 bg-brand-primary/10 text-[10px] text-brand-primary rounded-full border border-brand-primary/20 font-mono">TRINITY L1</span>
      </div>

      {!playerState.soul ? (
        <SoulManifest onManifestComplete={handleManifestComplete} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: ['0 0 20px rgba(0,255,255,0.2)', '0 0 40px rgba(0,255,255,0.4)', '0 0 20px rgba(0,255,255,0.2)']
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-primary/20 to-aqua-600/20 border-2 border-brand-primary/50 flex items-center justify-center"
            >
              <User className="w-16 h-16 text-brand-primary" />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-brand-primary/50 px-3 py-1 rounded-full text-xs text-brand-primary font-mono shadow-lg">
              {playerState.soul.resonance}%
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">{playerState.soul.name}</h2>
            <p className="text-[10px] text-brand-primary/70 mt-1 font-mono uppercase tracking-widest">Digital Avatar Manifested</p>
          </div>

          <div className="w-full p-4 bg-slate-800/30 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Sync Rate</span>
              <span className="text-emerald-400 font-medium">Stable</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-mono">Entropy Status</span>
              <span className="text-aqua-400 font-medium">Purified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ---------------------------------------------------------------------------
  // 🧘 中間面板：身體 (Body/Asset) -> Detail / Metrics
  // ---------------------------------------------------------------------------
  const renderBodyPane = () => (
    <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
      {/* Trinity Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-t5-traceable flex items-center gap-2 font-mono">
          <Zap className="w-4 h-4" />
          DETAIL | METRICS
        </h3>
        <span className="px-2 py-0.5 bg-t5-traceable/10 text-[10px] text-t5-traceable rounded-full border border-t5-traceable/20 font-mono">TRINITY L2</span>
      </div>

      {/* Header Stats */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">EVOLUTION RANK</div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">LV.{twinState.level} <span className="text-brand-primary opacity-80">{(getCurrentTitle()?.title || 'User').split(' ')[1] || getCurrentTitle()?.title || 'User'}</span></h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">EXPERIENCE</div>
          <div className="text-2xl font-bold text-white">{twinState.xp} <span className="text-xs text-slate-500">/ {twinState.xpToNext}</span></div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress}%` }}
          className="h-full bg-gradient-to-r from-brand-primary via-t5-traceable to-t5-tangible shadow-[0_0_10px_rgba(0,255,255,0.3)]"
        />
      </div>

      {/* Personality Radar (Simplified Bar for now) */}
      <div className="bg-slate-800/20 rounded-2xl p-5 border border-white/5 mb-8">
        <h4 className="text-xs font-bold text-white/70 mb-5 flex items-center gap-2 font-mono">
          <Target className="w-4 h-4 text-purple-400" />
          PERSONALITY MATRIX
        </h4>
        <div className="space-y-4">
          {Object.entries(twinState.personalityProfile).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-16 text-[10px] text-slate-500 font-mono uppercase">{key.slice(0, 3)}</span>
              <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  className={`h-full rounded-full ${value > 80 ? 'bg-brand-primary' : 'bg-t5-traceable/70'}`}
                />
              </div>
              <span className="text-[10px] text-white/50 w-8 text-right font-mono">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates / Sacred Contract */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-white/70 flex items-center gap-2 font-mono">
            <Award className="w-4 h-4 text-amber-500/80" />
            ASSETS & CONTRACTS
          </h4>
          <button
            onClick={() => setShowContract(true)}
            className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/30 rounded-lg text-[10px] hover:bg-brand-primary/20 transition-all font-mono uppercase tracking-wider flex items-center gap-2"
          >
            <Scroll className="w-3 h-3" />
            Establish Covenant
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {twinState.certificates.map(cert => (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-aqua-500/30 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <Shield className="w-4 h-4 text-aqua-400 opacity-70 group-hover:opacity-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-aqua-500 animate-pulse" />
              </div>
              <div className="text-xs text-slate-200 font-medium leading-tight mb-2">{cert.title}</div>
              <div className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">{cert.earnedAt}</div>
            </motion.div>
          ))}
          {/* Empty Placeholder */}
          {twinState.certificates.length === 0 && (
            <div className="col-span-2 py-10 text-center text-slate-600 text-[10px] border border-dashed border-white/10 rounded-xl font-mono uppercase tracking-widest">
              No Digital Assets Sealed
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // 🧠 右側面板：意識 (Mind) -> Extension / Consciousness
  // ---------------------------------------------------------------------------
  const renderMindPane = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xs font-bold text-purple-400 flex items-center gap-2 font-mono">
          <Brain className="w-4 h-4" />
          EXTENSION | MIND
        </h3>
        <span className="px-2 py-0.5 bg-purple-500/10 text-[10px] text-purple-400 rounded-full border border-purple-500/20 font-mono">TRINITY L3</span>
      </div>

      <div className="flex-1">
        {playerState.soul ? (
          <ResonanceChamber agentid={playerState.soul.agentId} agentName={playerState.soul.name} />
        ) : (
          <div className="h-full flex items-center justify-center text-center p-8 opacity-30">
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              </motion.div>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Consciousness Offline</p>
              <p className="text-slate-600 text-[10px] mt-2 font-serif italic">"Manifest a Soul to enable Resonance."</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-[#0a0f14] text-slate-200 overflow-hidden flex font-sans">
      {/* 3-Pane Layout */}

      {/* Left Pane: Soul (28%) - Overview */}
      <div className="w-[28%] border-r border-white/5 bg-slate-900/40">
        {renderSoulPane()}
      </div>

      {/* Center Pane: Body (42%) - Detail */}
      <div className="w-[42%] bg-slate-900/60 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.1),transparent_70%)] pointer-events-none" />
        {renderBodyPane()}
      </div>

      {/* Right Pane: Mind (30%) - Extension */}
      <div className="w-[30%] border-l border-white/5 bg-slate-900/40">
        {renderMindPane()}
      </div>

      {/* Contract Modal */}
      <AnimatePresence>
        {showContract && (
          <SacredContract
            twinState={twinState}
            onClose={() => setShowContract(false)}
            onSign={(data) => {
              console.log('Contract signed:', data);
              // Here we would create a new Certificate and update state
              setShowContract(false);
            }}
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.1),transparent_70%)] pointer-events-none" />
    </div>
  );
};

export default DigitalTwin;
