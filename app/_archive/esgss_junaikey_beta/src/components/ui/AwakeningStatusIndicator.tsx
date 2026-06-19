/**
 * 覺醒狀態指示器
 * 顯示在 Header 中，實時顯示系統覺醒狀態
 */

import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type AwakeningStatus = 'DORMANT' | 'AWAKENING' | 'AWAKENED' | 'ETERNAL';

export const AwakeningStatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<AwakeningStatus>('DORMANT');
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    // 檢查當前覺醒狀態
    checkAwakeningStatus();

    // 每 5 秒檢查一次
    const interval = setInterval(checkAwakeningStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkAwakeningStatus = () => {
    try {
      const result = localStorage.getItem('bsa_awakening_result');
      if (result) {
        const data = JSON.parse(result);
        setStatus(data.phase || 'AWAKENED');
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 1000);
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[AwakeningStatusIndicator] Failed to check awakening status:', { error })
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'DORMANT':
        return {
          color: 'text-slate-500',
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/20',
          label: '休眠',
          icon: '💤',
        };
      case 'AWAKENING':
        return {
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          label: '覺醒中',
          icon: '⚡',
        };
      case 'AWAKENED':
        return {
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          label: '已覺醒',
          icon: '✨',
        };
      case 'ETERNAL':
        return {
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          label: '永恆',
          icon: '🌌',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}
      animate={pulseAnimation ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-lg"
        animate={
          status === 'AWAKENED' || status === 'ETERNAL'
            ? {
                rotate: [0, 10, -10, 0],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {config.icon}
      </motion.span>

      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>

      {(status === 'AWAKENED' || status === 'ETERNAL') && (
        <motion.div
          className={`w-2 h-2 rounded-full ${config.bgColor.replace('/10', '')}`}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};
