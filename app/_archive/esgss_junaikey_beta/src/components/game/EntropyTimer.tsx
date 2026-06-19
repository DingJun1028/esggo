/**
 * ⏱️ 熵增計時器 - Entropy Timer System
 * 
 * 功能：
 * - 村莊熵值即時監控
 * - 長時間未行動觸發熵增
 * - 視覺化熵值進度條
 * - 等級相關熵值計算
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle,
  Flame,
  RefreshCw,
  ChevronUp,
  TrendingDown
} from 'lucide-react';

interface EntropyTimerProps {
  entropy: number;
  onEntropyChange: (value: number) => void;
  level: number;
}

// 熵增閾值配置
const ENTROPY_CONFIG = {
  low: { max: 30, color: 'text-emerald-400', bg: 'bg-emerald-500', label: '健康' },
  medium: { max: 60, color: 'text-amber-400', bg: 'bg-amber-500', label: '警戒' },
  high: { max: 80, color: 'text-orange-400', bg: 'bg-orange-500', label: '危險' },
  critical: { max: 100, color: 'text-red-400', bg: 'bg-red-500', label: '緊急' }
};

export const EntropyTimer: React.FC<EntropyTimerProps> = ({
  entropy,
  onEntropyChange,
  level
}) => {
  const [lastActionTime, setLastActionTime] = useState(Date.now());
  const [isRecovering, setIsRecovering] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5分鐘檢查一次

  // 計算熵增速度（等級越高，熵增越慢）
  const getEntropyRate = useCallback(() => {
    const baseRate = 0.5;
    const levelReduction = Math.min(level * 0.02, 0.3);
    return baseRate - levelReduction;
  }, [level]);

  // 檢查熵值狀態
  const getEntropyStatus = () => {
    if (entropy <= 30) return ENTROPY_CONFIG.low;
    if (entropy <= 60) return ENTROPY_CONFIG.medium;
    if (entropy <= 80) return ENTROPY_CONFIG.high;
    return ENTROPY_CONFIG.critical;
  };

  // 模擬熵增計時器
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastAction = Date.now() - lastActionTime;
      
      // 超過30分鐘未行動，開始熵增
      if (timeSinceLastAction > 30 * 60 * 1000 && !isRecovering) {
        const rate = getEntropyRate();
        const newEntropy = Math.min(100, entropy + rate);
        onEntropyChange(newEntropy);
      }
      
      setCountdown(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    return () => clearInterval(interval);
  }, [entropy, lastActionTime, getEntropyRate, onEntropyChange, isRecovering]);

  // 記錄玩家行動
  const recordAction = useCallback(() => {
    setLastActionTime(Date.now());
    setIsRecovering(true);
    
    // 行動後降低熵值
    const reduction = 5 + (level * 0.5);
    const newEntropy = Math.max(0, entropy - reduction);
    onEntropyChange(newEntropy);
    
    // 3秒後恢復正常模式
    setTimeout(() => setIsRecovering(false), 3000);
  }, [entropy, level, onEntropyChange]);

  // 緊急行動按鈕
  const handleEmergencyAction = () => {
    const emergencyReduction = 20;
    const newEntropy = Math.max(0, entropy - emergencyReduction);
    onEntropyChange(newEntropy);
    recordAction();
  };

  const status = getEntropyStatus();

  // 格式化倒數計時
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-white">村莊熵值監控</span>
        </div>
        
        {/* 狀態標籤 */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          status === ENTROPY_CONFIG.low ? 'bg-emerald-500/20 text-emerald-400' :
          status === ENTROPY_CONFIG.medium ? 'bg-amber-500/20 text-amber-400' :
          status === ENTROPY_CONFIG.high ? 'bg-orange-500/20 text-orange-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {status.label}
        </span>
      </div>

      {/* 熵值進度條 */}
      <div className="relative mb-4">
        <div className="h-6 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${entropy}%`,
              backgroundColor: entropy > 80 ? '#ef4444' : 
                              entropy > 60 ? '#f97316' :
                              entropy > 30 ? '#eab308' : '#22c55e'
            }}
            className="h-full rounded-full transition-colors duration-300"
          />
          
          {/* 階段標記 */}
          <div className="absolute inset-0 flex items-center justify-around px-2">
            <div className="w-0.5 h-2 bg-white/20" />
            <div className="w-0.5 h-2 bg-white/20" />
            <div className="w-0.5 h-2 bg-white/20" />
          </div>
        </div>
        
        {/* 數值顯示 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow">
            {entropy.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 說明文字 */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <AlertTriangle className="w-4 h-4" />
        <span>
          {entropy > 80 
            ? '⚠️ 村莊處於緊急狀態！立即採取行動！'
            : entropy > 60 
              ? '熵值過高，請盡快完成永續任務'
              : entropy > 30 
                ? '村莊需要持續維護，保持活躍'
                : '🌿 村莊狀態良好，繼續保持！'}
        </span>
      </div>

      {/* 緊急行動區 */}
      {entropy > 60 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 rounded-lg border border-red-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-sm font-medium text-white">緊急淨化行動</div>
                <div className="text-xs text-red-400">-20% 熵值</div>
              </div>
            </div>
            <button
              onClick={handleEmergencyAction}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-sm font-bold hover:from-red-600 hover:to-orange-600 transition-all"
            >
              立即淨化
            </button>
          </div>
        </motion.div>
      )}

      {/* 恢復提示 */}
      {isRecovering && entropy < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-xs text-emerald-400 mt-3"
        >
          <TrendingDown className="w-4 h-4" />
          <span>正在淨化村莊... (-{5 + (level * 0.5)}%)</span>
        </motion.div>
      )}

      {/* 下次檢測 */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
        <span>下次熵值檢測</span>
        <span className="font-mono">{formatCountdown(countdown)}</span>
      </div>
    </div>
  );
};

export default EntropyTimer;
