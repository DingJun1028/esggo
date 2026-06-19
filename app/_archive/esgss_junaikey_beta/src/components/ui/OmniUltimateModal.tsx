import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface UltimateResult {
  success: boolean;
  truthsRevealed: number;
  evidenceLinked: number;
  insightsBroadcast: number;
}

interface OmniUltimateModalProps {
  isOpen: boolean;
  isExecuting: boolean;
  result: UltimateResult | null;
  onClose: () => void;
}

export const OmniUltimateModal: React.FC<OmniUltimateModalProps> = ({
  isOpen,
  isExecuting,
  result,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {/* Executing Animation Overlay */}
      {isExecuting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md"
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
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-aqua-500 via-purple-600 to-yellow-500 flex items-center justify-center"
              style={{
                boxShadow: '0 0 100px rgba(168, 85, 247, 0.8)',
              }}
            >
              <Sparkles size={48} className="text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-2 tracking-wider">🌌 代理合一 🌌</h2>
            <p className="text-aqua-400 text-lg animate-pulse">自覺覺他・無有奧義發動中...</p>
          </motion.div>
        </motion.div>
      )}

      {/* Result Modal */}
      {isOpen && result && !isExecuting && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 right-8 z-[110] w-[450px] rounded-2xl p-6 border border-aqua-500/30 neon-border-aqua overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(8, 10, 20, 0.98), rgba(20, 20, 40, 0.98))',
            boxShadow: '0 0 40px rgba(0,255,255, 0.3)',
          }}
        >
          {/* Background Grid Animation (Thousand Faces Effect) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 gap-0.5">
            {Array.from({ length: 36 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0.2] }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-full h-full bg-aqua-400/30"
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-aqua-400 to-purple-400 flex items-center gap-2">
                <Sparkles size={24} className="text-aqua-400 animate-spin-slow" />
                奧義：奧秘精靈 (Omni-Sprite)
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Visual Representation of Unity */}
              <div className="flex items-center justify-center py-4 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="w-32 h-32 rounded-full border border-dashed border-aqua-500/30"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="w-40 h-40 rounded-full border border-dashed border-purple-500/30"
                  />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-white drop-shadow-glow"
                >
                  ∞
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">同步化身</div>
                  <div className="text-lg font-bold text-aqua-400">
                    {result.evidenceLinked * 12}{' '}
                    <span className="text-xs text-slate-500">Entities</span>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-slate-400">總算力輸出</div>
                  <div className="text-lg font-bold text-purple-400">
                    99.9% <span className="text-xs text-slate-500">Efficiency</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span>揭示真理 (Truths)</span>
                  <span className="text-aqua-400 font-mono">+{result.truthsRevealed}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>廣播洞察 (Insights)</span>
                  <span className="text-purple-400 font-mono">+{result.insightsBroadcast}</span>
                </div>
              </div>

              {result.success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 p-3 bg-gradient-to-r from-aqua-900/40 to-purple-900/40 rounded-lg border border-aqua-500/30 text-center"
                >
                  <p className="text-xs text-aqua-200 font-mono tracking-wide">
                    "千面歸一，萬法同源。系統共識已達成。"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
