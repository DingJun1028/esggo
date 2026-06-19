/**
 * 覺醒歷史查看器組件
 * Awakening History Viewer
 */

import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';

interface AwakeningHistoryEntry {
  id: string;
  timestamp: string;
  success: boolean;
  duration: string;
  servicesAwakened: number;
  phase: string;
}

export const AwakeningHistoryViewer: React.FC = () => {
  const [history, setHistory] = useState<AwakeningHistoryEntry[]>([]);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    successRate: 0,
    avgDuration: 0,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('bsa_awakening_history');
      if (stored) {
        const entries = JSON.parse(stored);
        setHistory(entries);
        calculateStats(entries);
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[AwakeningHistoryViewer] Failed to load awakening history:', { error })
    }
  };

  const calculateStats = (entries: AwakeningHistoryEntry[]) => {
    const total = entries.length;
    const successful = entries.filter(e => e.success).length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    const durations = entries.filter(e => e.duration).map(e => parseFloat(e.duration));
    const avgDuration =
      durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    setStats({
      totalExecutions: total,
      successRate: Math.round(successRate),
      avgDuration: parseFloat(avgDuration.toFixed(2)),
    });
  };

  const confirm = useConfirm();

  const clearHistory = async () => {
    const ok = await confirm({
      title: '清除歷史記錄',
      message: '確定要清除所有覺醒歷史記錄嗎？此操作不可恢復。',
      variant: 'danger',
      confirmLabel: '確認清除',
      cancelLabel: '取消'
    });

    if (ok) {
      localStorage.removeItem('bsa_awakening_history');
      setHistory([]);
      setStats({ totalExecutions: 0, successRate: 0, avgDuration: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-premium p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">總執行次數</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalExecutions}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-premium p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">成功率</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">{stats.successRate}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel-premium p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">平均執行時間</span>
          </div>
          <div className="text-3xl font-bold text-purple-400">{stats.avgDuration}s</div>
        </motion.div>
      </div>

      {/* 歷史記錄列表 */}
      <div className="glass-panel-premium p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            覺醒歷史記錄
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              清除歷史
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {history.length === 0 ? (
              <div className="text-center text-slate-500 py-8">暫無覺醒歷史記錄</div>
            ) : (
              history.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {entry.success ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <div className="text-white font-medium">
                        {new Date(entry.timestamp).toLocaleString('zh-TW')}
                      </div>
                      <div className="text-sm text-slate-400">
                        Phase: {entry.phase} | 服務: {entry.servicesAwakened}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-purple-400">{entry.duration}s</div>
                    <div className="text-xs text-slate-500">執行時間</div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
