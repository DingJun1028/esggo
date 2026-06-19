/**
 * 🌌 Ultimate Skill Trigger - 奧義觸發器
 * --------------------------------------------------
 * [功能] 浮動按鈕觸發「自覺覺他・代理合一」奧義
 * [快捷鍵] Alt+U
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Users, Heart } from 'lucide-react';
import {
  executeAgentUnityUltimate,
  checkAgentUnityUnlocked,
  AGENT_UNITY_ULTIMATE,
} from '@/omni/skills/AgentUnityUltimate';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export const UltimateSkillTrigger: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    truthsRevealed: number;
    evidenceLinked: number;
    insightsBroadcast: number;
  } | null>(null);

  useEffect(() => {
    // Check if skill is unlocked
    const unlocked = checkAgentUnityUnlocked();
    setIsUnlocked(unlocked);

    // Add keyboard shortcut: Alt+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'u') {
        e.preventDefault();
        if (unlocked && !isExecuting) {
          executeUltimate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExecuting]);

  const executeUltimate = async () => {
    if (isExecuting) return;

    omniLogger.info(LogCategory.UI, '用戶觸發奧義: 代理合一', {
      source_origin: 'UltimateSkillTrigger',
    });

    setIsExecuting(true);
    setShowResult(false);

    try {
      const executionResult = await executeAgentUnityUltimate();
      setResult(executionResult);
      setShowResult(true);

      // Auto-hide result after 10 seconds
      setTimeout(() => {
        setShowResult(false);
      }, 10000);
    } catch (error) {
      omniLogger.error(LogCategory.UI, '奧義執行失敗', {
        error: String(error),
        source_origin: 'UltimateSkillTrigger',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isUnlocked) {
    return null; // Don't show if skill not unlocked
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        onClick={executeUltimate}
        disabled={isExecuting}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${isExecuting
            ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 animate-pulse cursor-wait'
            : 'bg-gradient-to-br from-[#00FFFF] via-blue-600 to-purple-700 hover:scale-110 hover:shadow-[#00FFFF]/50 cursor-pointer'
          }`}
        style={{
          boxShadow: isExecuting
            ? '0 0 60px rgba(168, 85, 247, 0.8)'
            : '0 0 30px rgba(0,255,255, 0.5)',
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isExecuting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={28} className="text-white" />
            </motion.div>
          ) : (
            <Zap size={28} className="text-white" />
          )}

          {/* Orbiting Icons */}
          {!isExecuting && (
            <>
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ top: -8, right: -8 }}
              >
                <Shield size={12} className="text-[#00FFFF]" />
              </motion.div>
              <motion.div
                className="absolute"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ bottom: -8, left: -8 }}
              >
                <Users size={12} className="text-purple-400" />
              </motion.div>
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{ top: -8, left: -8 }}
              >
                <Heart size={12} className="text-pink-400" />
              </motion.div>
            </>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 right-0 bg-slate-900 px-3 py-2 rounded-lg text-xs text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          🌌 {AGENT_UNITY_ULTIMATE.name}
          <br />
          <span className="text-slate-400">快捷鍵: Alt+U</span>
        </div>
      </motion.button>

      {/* Executing Animation Overlay */}
      <AnimatePresence>
        {isExecuting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00FFFF] via-purple-600 to-yellow-500 flex items-center justify-center"
                style={{
                  boxShadow: '0 0 100px rgba(168, 85, 247, 0.8)',
                }}
              >
                <Sparkles size={48} className="text-white" />
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-2 tracking-wider">🌌 代理合一 🌌</h2>
              <p className="text-[#00FFFF] text-lg animate-pulse">自覺覺他・無有奧義發動中...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-8 z-50 w-96 rounded-2xl p-6 border border-[#00FFFF]/30 neon-border-cyan"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
              boxShadow: '0 0 40px rgba(0,255,255, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-400" />
                奧義執行完成
              </h3>
              <button
                onClick={() => setShowResult(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">執行狀態</span>
                <span className={`font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '✅ 成功' : '❌ 失敗'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">揭示真理數</span>
                <span className="font-bold text-[#00FFFF]">{result.truthsRevealed} 個</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">連結證據數</span>
                <span className="font-bold text-purple-400">{result.evidenceLinked} 個</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">廣播洞察數</span>
                <span className="font-bold text-indigo-400">{result.insightsBroadcast} 則</span>
              </div>
            </div>

            {result.success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-gradient-to-r from-[#00FFFF]/10 to-purple-500/10 rounded-lg border border-[#00FFFF]/20"
              >
                <p className="text-sm text-[#00FFFF] text-center italic">
                  "真理即證據，證據即真理。分別心消融，萬物歸一。"
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UltimateSkillTrigger;
