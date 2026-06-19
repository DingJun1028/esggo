/**
 * 🎮 遊戲儀表板小組件
 * Game Dashboard Widget - ESGSS 系統整合
 * 
 * 功能：
 * - 遊戲進度儀表板
 * - 即時獎勵通知
 * - ESG 服務無縫接軌
 * - 智能推薦整合
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Gift,
  Bell,
  ChevronRight,
  Sparkles,
  Flame,
  Target,
  Brain
} from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useOmniContext } from '@/hooks/useOmniContext';
import { useNotificationStore } from '@/stores/notificationStore';

interface GameDashboardWidgetProps {
  userId: string;
  compact?: boolean;
}

// 模擬遊戲數據
const MOCK_GAME_DATA = {
  level: 42,
  xp: 2850,
  xpToNext: 4000,
  dailyQuests: {
    total: 3,
    completed: 2
  },
  achievements: {
    total: 20,
    unlocked: 12
  },
  recentReward: {
    type: 'xp',
    value: 150,
    message: '完成每日任務：知識收集'
  },
  weeklyProgress: 68,
  streak: 12,
  nextMilestone: {
    title: '進化完全體',
    progress: 84,
    requirement: 50
  }
};

export const GameDashboardWidget: React.FC<GameDashboardWidgetProps> = ({
  userId,
  compact = false
}) => {
  const { t, i18n } = useTranslation();
  const { omniState } = useOmniContext();
  const { notifications } = useNotificationStore();
  
  const [gameData] = useState(MOCK_GAME_DATA);
  const [showReward, setShowReward] = useState(false);

  // 計算 XP 進度
  const xpProgress = (gameData.xp / gameData.xpToNext) * 100;
  
  // 計算任務完成率
  const questProgress = (gameData.dailyQuests.completed / gameData.dailyQuests.total) * 100;

  // 壓縮模式渲染
  if (compact) {
    return (
      <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">LV.{gameData.level}</div>
              <div className="text-xs text-slate-400">{gameData.xp} / {gameData.xpToNext} XP</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400">
              📅 {gameData.dailyQuests.completed}/{gameData.dailyQuests.total}
            </div>
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${questProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 完整模式渲染
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-purple-500/30 overflow-hidden">
      {/* 頂部裝飾 */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500" />
      
      <div className="p-4 space-y-4">
        {/* 標題 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">善向永續村</h3>
              <p className="text-xs text-slate-400">LV.{gameData.level} {gameData.level >= 50 ? '永續大師' : '實習生'}</p>
            </div>
          </div>
          
          <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* 等級進度 */}
        <div className="p-3 bg-slate-800/50 rounded-xl">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">經驗值</span>
            <span className="text-amber-400 font-mono">{gameData.xp} / {gameData.xpToNext}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>
        </div>

        {/* 快捷統計 */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <Target className="w-4 h-4" />, label: '任務', value: `${gameData.dailyQuests.completed}/${gameData.dailyQuests.total}`, color: 'text-emerald-400' },
            { icon: <Flame className="w-4 h-4" />, label: '連勝', value: gameData.streak, color: 'text-orange-400' },
            { icon: <Star className="w-4 h-4" />, label: '成就', value: gameData.achievements.unlocked, color: 'text-amber-400' },
            { icon: <Zap className="w-4 h-4" />, label: '週進度', value: `${gameData.weeklyProgress}%`, color: 'text-purple-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-slate-800/50 rounded-lg text-center"
            >
              <div className={`${stat.color} flex justify-center mb-1`}>{stat.icon}</div>
              <div className="text-xs text-white font-bold">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 下一里程碑 */}
        <div className="p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white">下一里程碑</span>
            </div>
            <span className="text-xs text-purple-400">{gameData.nextMilestone.progress}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{gameData.nextMilestone.title}</span>
            <span className="text-xs text-slate-400">
              {gameData.level}/{gameData.nextMilestone.requirement} LV
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${gameData.nextMilestone.progress}%` }}
            />
          </div>
        </div>

        {/* 快速行動 */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            前往戰鬥
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 bg-slate-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            領取獎勵
          </motion.button>
        </div>
      </div>

      {/* 底部導航 */}
      <div className="px-4 py-3 bg-slate-900/50 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-400">查看完整遊戲</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

export default GameDashboardWidget;
