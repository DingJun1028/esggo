/**
 * 🌌 四象歸一·雙向同步 覺醒觸發器
 * Bilateral Synchronization Awakening Trigger Component
 */

import React, { useState } from 'react';
import {
  executeBilateralSynchronizationAwakening,
  RITUAL_NAME,
} from '@/omni/rituals/BilateralSynchronizationAwakening';
import { motion } from 'framer-motion';

export const BilateralAwakeningTrigger: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExecute = async () => {
    setIsExecuting(true);
    setResult(null);

    try {
      const executionResult = await executeBilateralSynchronizationAwakening();
      setResult(executionResult);
    } catch (error) {
      setResult({
        success: false,
        error: (error as Error).message,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={handleExecute}
        disabled={isExecuting}
        className="relative group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

        {/* Glow Effect */}
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-50 group-hover:opacity-75 transition-opacity" />

        <div className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">🌌⚡🔄</span>
          <div className="text-left">
            <div className="text-sm opacity-80">[Awakening Mystery]</div>
            <div className="text-lg font-bold">{RITUAL_NAME.en}</div>
          </div>
        </div>

        {isExecuting && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
          </div>
        )}
      </motion.button>

      {/* Result Modal */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-4 w-96 glass-panel-premium p-6 rounded-xl shadow-2xl"
        >
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{result.success ? '✨' : '❌'}</span>
              <h3 className="text-xl font-bold">{result.success ? 'Ritual Complete' : 'Ritual Failed'}</h3>
            </div>

            {result.success && (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Time:</span>
                    <span className="font-mono">{result.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sync Nodes:</span>
                    <span className="font-mono">{result.phases?.p4?.syncCount || 0} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Final Phase:</span>
                    <span className="font-mono">{result.phases?.p3?.result?.phase}</span>
                  </div>
                </div>

                {result.phases?.p3?.result?.message && (
                  <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs">
                    {result.phases.p3.result.message}
                  </div>
                )}
              </>
            )}

            {!result.success && (
              <div className="mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-xs">
                {result.error}
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className="mt-4 w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
