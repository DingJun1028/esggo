/**
 * 覺醒入口按鈕
 *
 * 浮動在右下角的終極覺醒啟動按鈕
 * 集成自覺覺他自動化儀表板與即時洞察通知
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Infinity, Sparkles, Activity, X } from 'lucide-react';
import { UltimateAwakeningRitual } from '@/omni/interaction/rituals/UltimateAwakeningRitual';
import { getAwakeningAutomationStats } from '@/omni/init/initAwakening';
import { AwakeningAutomationDashboard } from '@/components/dashboard/AwakeningAutomationDashboard';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';
import type { AwakeningInsight } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';
import { useAgentRpg } from '@/hooks/useAgentRpg';
import { useOmniContext } from '@/hooks/useOmniContext';
import { GlobalNavigation } from './GlobalNavigation';

export const AwakeningTrigger: React.FC = () => {
  const { unlockSkill } = useAgentRpg();
  const [isRitualOpen, setIsRitualOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [latestInsight, setLatestInsight] = useState<AwakeningInsight | null>(null);
  const [isAutoActive, setIsAutoActive] = useState(false);

  // 監聽覺醒洞察與自動化狀態
  useEffect(() => {
    const unsubscribe = awakeningBroadcaster.subscribeToInsights(insight => {
      setLatestInsight(insight);

      // 🎁 [奧義] 自動解鎖技能 (Divine Grant Listener)
      if (insight.metadata?.grantSkillId && typeof insight.metadata.grantSkillId === 'string') {
        const skillId = insight.metadata.grantSkillId;
        // 用戶端 hook 執行解鎖 - 使用 setTimeout 避免 Render Loop
        setTimeout(() => {
          unlockSkill(skillId, { bypassCost: true });
        }, 100);
      }
      const timer = setTimeout(() => setLatestInsight(null), 5000);
      return () => clearTimeout(timer);
    });

    // 定期檢查自動化狀態
    const checkStatus = () => {
      try {
        const stats = getAwakeningAutomationStats();
        setIsAutoActive(stats.scheduler.isRunning);
      } catch (e) {
        // Ignore initialization errors
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Enable Context Awareness
  useOmniContext();

  return (
    <>
      <GlobalNavigation />
      {/* 洞察通知氣泡 (Fixed Position) */}
      <AnimatePresence>
        {latestInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[100] max-w-xs bg-black/90 border border-purple-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-md cursor-pointer"
            onClick={() => {
              setIsDashboardOpen(true);
              setLatestInsight(null);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{latestInsight.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{latestInsight.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主按鈕 (Self-contained Fixed Position & Draggable) */}
      <motion.button
        drag
        dragMomentum={false}
        whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
        dragElastic={0.1}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDashboardOpen(true)}
        onContextMenu={e => {
          e.preventDefault();
          setIsRitualOpen(true);
        }}
        className="fixed bottom-6 right-6 z-[100] group cursor-grab touch-none"
      >
        {/* 主按鈕體 */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 shadow-2xl shadow-purple-500/50 flex items-center justify-center overflow-hidden">
          <Infinity className="relative z-10 w-8 h-8 text-white group-hover:animate-pulse" />

          {/* 自主代行活躍指示器 (Pulse Ring) */}
          {isAutoActive && (
            <div className="absolute inset-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-20"></span>
            </div>
          )}

          {/* 內部流光 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />

          {/* 光環動畫 */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 blur-xl"
            animate={{
              scale: isAutoActive ? [1, 1.5, 1] : [1, 1.2, 1], // Breathing deeper when active
              opacity: isAutoActive ? [0.3, 0.7, 0.3] : [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: isAutoActive ? 4 : 2, // Slower, deeper breath when active
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* 外環旋轉 */}
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-purple-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* 提示文字 (Hover) */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-black/90 border border-purple-500/30 backdrop-blur-md whitespace-nowrap pointer-events-none"
        >
          <div className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <Activity
              className={`w-4 h-4 ${isAutoActive ? 'text-emerald-400 animate-pulse' : ''}`}
            />
            {isAutoActive ? '系統自主代行中' : '系統自覺監控中'}
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-1">
            左鍵：儀表板 | 右鍵：終極覺醒
          </div>
        </motion.div>
      </motion.button>

      {/* 自動化儀表板模態 */}
      <AnimatePresence>
        {isDashboardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={e => {
              if (e.target === e.currentTarget) setIsDashboardOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-[#0a0a0f] border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  自覺覺他 · 自動化中心
                </h3>
                <button
                  onClick={() => setIsDashboardOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar bg-grid-pattern">
                <AwakeningAutomationDashboard />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 覺醒儀式全屏模態 */}
      <AnimatePresence>
        {isRitualOpen && (
          <UltimateAwakeningRitual
            onComplete={() => {
              setIsRitualOpen(false);
              setIsDashboardOpen(true); // 儀式完成後展示儀表板
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
