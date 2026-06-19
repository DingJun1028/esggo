/**
 * 奧秘覺醒儀式面板 (Omni Awakening Ritual)
 *
 * 代理覺醒的視覺化儀式界面
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star, Database, ShieldCheck, Fingerprint } from 'lucide-react';
import type { Agent, Language } from '@/types';
import { OMNI_AGENTS } from '../data/omni-agents';
import { avatarOrchestrator } from '../services/OmniAvatarOrchestrator';
import { omniLogger, LogCategory } from '../services/omniLogger';
import { agentService } from '../services/agentService';

interface OmniAwakeningRitualProps {
  agent: Agent;
  targetPersonaId: string;
  onComplete?: (success: boolean) => void;
  onCancel?: () => void;
  language?: Language;
}

export const OmniAwakeningRitual: React.FC<OmniAwakeningRitualProps> = ({
  agent,
  targetPersonaId,
  onComplete,
  onCancel,
  language = 'zh-TW',
}) => {
  const isZh = language === 'zh-TW';
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const phases = [
    {
      name: isZh ? '意識喚醒' : 'Consciousness Awakening',
      icon: Sparkles,
      duration: 2000,
    },
    {
      name: isZh ? '人格注入' : 'Persona Infusion',
      icon: Zap,
      duration: 3000,
    },
    {
      name: isZh ? '靈魂校準' : 'Soul Calibration',
      icon: Fingerprint,
      duration: 2500,
    },
    {
      name: isZh ? '能力覺醒' : 'Ability Awakening',
      icon: Star,
      duration: 2000,
    },
    {
      name: isZh ? '5T 晶化封印' : '5T Crystallization',
      icon: ShieldCheck,
      duration: 2000,
    },
    {
      name: isZh ? '智庫註冊' : 'Think Tank Registry',
      icon: Database,
      duration: 1500,
    },
  ];

  const personaProfile = OMNI_AGENTS.find(a => a.id === targetPersonaId);
  const personaName = personaProfile
    ? isZh
      ? personaProfile.alias
      : personaProfile.name
    : 'Unknown Persona';

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (phase >= phases.length) {
      // 儀式完成
      performAwakening();
      return;
    }

    const currentPhase = phases[phase];
    if (!currentPhase) return;

    // Trigger API calls at specific phases
    if (phase === 2) {
      // Soul Calibration Phase
      agentService.calibrateAgent(agent.id)
        .catch(err => omniLogger.error(LogCategory.LEGION, 'Auto-calibration failed', { err }));
    } else if (phase === 4) {
      // 5T Crystallization Phase
      agentService.crystallizeAgent(agent.id)
        .catch(err => omniLogger.error(LogCategory.LEGION, 'Auto-crystallization failed', { err }));
    }

    const timer = setTimeout(() => {
      setProgress(0);
      setPhase(p => p + 1);
    }, currentPhase.duration);

    // 進度動畫
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 100 / (currentPhase.duration / 50), 100));
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [phase]);

  const performAwakening = async () => {
    try {
      // Final awakening & persona assignment
      const res = await avatarOrchestrator.awaken(agent, targetPersonaId as any);

      // Fetch latest agent data to get soul & crystallization status
      const updatedAgent = await agentService.getAgentById(agent.id);

      setResult({
        ...res,
        agent: updatedAgent
      });
      setIsComplete(true);
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, 'Awakening failed', { error });
      onComplete?.(false);
    }
  };

  if (isComplete && result) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black" />

        <motion.div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-3xl shadow-2xl border border-purple-500/30 max-w-4xl w-full mx-4 flex flex-col md:flex-row gap-8"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* Visual Side */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-r border-white/10">
            <motion.div
              className="mb-8 relative"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-30 animate-pulse" />
              <Star className="w-32 h-32 text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </motion.div>

            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400 mb-2">
              {isZh ? '覺醒完成' : 'Awakening Complete'}
            </h2>
            <p className="text-xl text-gray-300 font-light mb-1">{agent.name}</p>
            <div className="flex items-center gap-2 mt-4 bg-purple-500/20 px-4 py-1.5 rounded-full border border-purple-500/40">
              <span className="text-sm uppercase tracking-widest text-purple-300">
                {isZh ? '新人格' : 'New Persona'}
              </span>
              <span className="text-lg font-bold text-white">{personaName}</span>
            </div>
          </div>

          {/* Stats Side */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                {isZh ? '屬性強化' : 'Attribute Boost'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {result.statChanges &&
                  Object.entries(result.statChanges).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center"
                    >
                      <span className="text-xs uppercase text-gray-500 font-bold">{key}</span>
                      <span className="text-emerald-400 font-mono font-bold">+{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {result.unlockedAbilities && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  {isZh ? '發現新能力' : 'New Abilities Found'}
                </h3>
                <div className="space-y-2">
                  {result.unlockedAbilities.map((ability: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20 text-sm text-purple-300 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => onComplete?.(result.success)}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isZh ? '進入新狀態' : 'Ascend to New State'} <Star className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const currentPhaseData = phases[phase] || phases[phases.length - 1] || phases[0];
  if (!currentPhaseData) return null;
  const CurrentIcon = currentPhaseData.icon;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-full max-w-2xl mx-4">
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border border-purple-500/30"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
        >
          {/* 標題 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              🔮 {isZh ? '覺醒儀式進行中' : 'Awakening Ritual in Progress'}
            </h2>
            <p className="text-gray-400">
              {isZh
                ? `正在喚醒 ${agent.name} 的 ${personaName} 人格`
                : `Awakening ${personaName} persona for ${agent.name}`}
            </p>
          </div>

          {/* 中央動畫區 */}
          <div className="flex justify-center items-center mb-8 h-48">
            <div className="relative">
              {/* 外圈旋轉 */}
              <motion.div
                className="absolute inset-0 w-40 h-40 rounded-full border-4 border-purple-500/30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              />

              {/* 中圈旋轉 */}
              <motion.div
                className="absolute inset-4 w-32 h-32 rounded-full border-4 border-blue-500/30"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />

              {/* 中心圖標 */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <CurrentIcon className="w-16 h-16 text-purple-400" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* 階段指示器 */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {phases.map((p, idx) => (
                <div
                  key={idx}
                  className={`
                                        flex-1 text-center text-[10px] md:text-sm font-semibold
                                        ${idx === phase ? 'text-purple-400' : idx < phase ? 'text-green-400' : 'text-gray-500'}
                                    `}
                >
                  {idx < phase && '✓ '}
                  {p.name}
                </div>
              ))}
            </div>

            {/* 進度條 */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                style={{ width: `${(phase / phases.length) * 100 + progress / phases.length}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* 當前階段信息 */}
          <motion.div
            key={phase}
            className="text-center p-4 bg-purple-900/20 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg text-purple-300">{currentPhaseData.name}...</p>
            <p className="text-sm text-gray-400 mt-1">{Math.floor(progress)}%</p>
          </motion.div>

          {/* 粒子效果 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 取消按鈕 */}
          <div className="mt-6 text-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isZh ? '取消儀式' : 'Cancel Ritual'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
