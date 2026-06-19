/**
 * 🎁 遊戲獎勵通知組件
 * Game Reward Notification - 通知系統整合
 * 
 * 功能：
 * - 即時獎勵彈窗
 * - 成就解鎖通知
 * - 任務完成提醒
 * - 與通知中心整合
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Gift,
  Sparkles,
  X,
  Coins,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';

interface RewardNotificationProps {
  reward: {
    type: 'xp' | 'currency' | 'card' | 'achievement' | 'levelup';
    value: string | number;
    title?: string;
    message?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClose: () => void;
  duration?: number;
}

// 獎勵類型配置
const REWARD_CONFIG = {
  xp: {
    icon: <Star className="w-8 h-8 text-amber-400" />,
    bgColor: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-500',
    particle: '✨'
  },
  currency: {
    icon: <Coins className="w-8 h-8 text-emerald-400" />,
    bgColor: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-teal-500',
    particle: '🪙'
  },
  card: {
    icon: <Gift className="w-8 h-8 text-purple-400" />,
    bgColor: 'bg-purple-500',
    gradient: 'from-purple-500 to-violet-500',
    particle: '🎴'
  },
  achievement: {
    icon: <Award className="w-8 h-8 text-amber-400" />,
    bgColor: 'bg-amber-500',
    gradient: 'from-amber-500 to-yellow-500',
    particle: '🏆'
  },
  levelup: {
    icon: <Zap className="w-8 h-8 text-blue-400" />,
    bgColor: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    particle: '⚡'
  }
};

export const GameRewardNotification: React.FC<RewardNotificationProps> = ({
  reward,
  onClose,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const config = REWARD_CONFIG[reward.type as keyof typeof REWARD_CONFIG];

  // 自動關閉計時器
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          setIsVisible(false);
          clearInterval(interval);
          setTimeout(onClose, 300);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-4 right-4 z-50 cursor-pointer"
          onClick={handleClick}
        >
          {/* 背景光效 */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-2xl opacity-20 blur-xl`} />
          
          <div className={`relative w-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden`}>
            {/* 進度條 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${config.bgColor}`}
              />
            </div>

            {/* 頂部裝飾 */}
            <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* 圖標 */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}
                >
                  {config.icon}
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {reward.type === 'levelup' && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-xs font-bold text-white">
                        等級提升!
                      </span>
                    )}
                    {reward.rarity && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        reward.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' :
                        reward.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                        reward.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {reward.rarity}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {reward.title || 
                      (reward.type === 'xp' ? '獲得經驗值!' :
                       reward.type === 'currency' ? '獲得金幣!' :
                       reward.type === 'card' ? '獲得新卡牌!' :
                       reward.type === 'achievement' ? '成就解鎖!' :
                       '等級提升!')
                    }
                  </h3>
                  
                  <p className="text-sm text-slate-400">
                    {reward.message || 
                      (reward.type === 'xp' ? `+${reward.value} 經驗值` :
                       reward.type === 'currency' ? `+${reward.value} 金幣` :
                       reward.type === 'card' ? '已加入你的卡牌收藏' :
                       reward.message)
                    }
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="p-1 bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 行動按鈕 */}
              {reward.type === 'card' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  查看卡牌
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}

              {reward.type === 'achievement' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  查看成就
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* 底部粒子效果 */}
            <div className="absolute bottom-2 right-2 text-2xl opacity-50">
              {config.particle}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 批量獎勵顯示
interface BatchRewardProps {
  rewards: RewardNotificationProps['reward'][];
  onComplete: () => void;
}

export const BatchReward: React.FC<BatchRewardProps> = ({
  rewards,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < rewards.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => {
          if (prev >= rewards.length - 1) {
            setTimeout(onComplete, 2000);
          }
          return prev + 1;
        });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, rewards.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {rewards.slice(0, currentIndex + 1).map((reward, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute"
        >
          <GameRewardNotification
            reward={reward}
            onClose={() => {}}
          />
        </motion.div>
      ))}
      
      {currentIndex >= rewards.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">所有獎勵已領取!</h2>
        </motion.div>
      )}
    </div>
  );
};

export default GameRewardNotification;
