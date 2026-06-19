/**
 * 🏆 成就系統 - Achievements System
 * 
 * 功能：
 * - 成就展示
 * - 進度追蹤
 * - 稀有度顯示
 * - 領取獎勵
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star,
  Lock,
  CheckCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: number | string;
  progress?: number;
  unlockedAt?: string;
  claimed: boolean;
}

interface AchievementsProps {
  userId: string;
  onClaim?: (achievementId: string) => void;
  onClose?: () => void;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-victory',
    title: '初試啼聲',
    description: '赢得第一場戰鬥',
    icon: '🎖️',
    rarity: 'common',
    requirement: 1,
    progress: 1,
    unlockedAt: '2026-01-15',
    claimed: true
  },
  {
    id: 'carbon-slayer',
    title: '碳排放终结者',
    description: '击败 10 只高碳排魔王',
    icon: '🌍',
    rarity: 'rare',
    requirement: 10,
    progress: 7,
    claimed: false
  },
  {
    id: 'card-master',
    title: '卡牌大師',
    description: '收集 50 張 ESG 卡牌',
    icon: '🃏',
    rarity: 'rare',
    requirement: 50,
    progress: 42,
    claimed: false
  },
  {
    id: 'legendary-hunter',
    title: '傳說獵人',
    description: '獲得 5 張傳說卡牌',
    icon: '✨',
    rarity: 'epic',
    requirement: 5,
    progress: 2,
    claimed: false
  },
  {
    id: 'evolution-complete',
    title: '進化完全體',
    description: 'AI 數位分身達到 LV.50',
    icon: '🦋',
    rarity: 'epic',
    requirement: 50,
    progress: 42,
    claimed: false
  },
  {
    id: 'century-warrior',
    title: '百戰百勝',
    description: '累計勝利 100 場',
    icon: '💯',
    rarity: 'legendary',
    requirement: 100,
    progress: 68,
    claimed: false
  },
  {
    id: 'eternal-master',
    title: '永續大師',
    description: '達到最高等級 LV.99',
    icon: '👑',
    rarity: 'legendary',
    requirement: 99,
    progress: 42,
    claimed: false
  },
  {
    id: 'perfect-battle',
    title: '完美戰鬥',
    description: '零失誤完成 1 場戰鬥',
    icon: '💎',
    rarity: 'epic',
    requirement: 1,
    progress: 0,
    claimed: false
  },
  {
    id: 'social-champion',
    title: '社會擁護者',
    description: '使用社會卡牌獲勝 50 次',
    icon: '⚖️',
    rarity: 'rare',
    requirement: 50,
    progress: 23,
    claimed: false
  },
  {
    id: 'governance-guardian',
    title: '治理守護者',
    description: '使用治理卡牌獲勝 50 次',
    icon: '🏛️',
    rarity: 'rare',
    requirement: 50,
    progress: 31,
    claimed: false
  }
];

const RARITY_CONFIG = {
  common: { color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30', label: '普通' },
  rare: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: '稀有' },
  epic: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', label: '史詩' },
  legendary: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', label: '傳說' }
};

export const Achievements: React.FC<AchievementsProps> = ({
  userId,
  onClaim,
  onClose
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // 計算統計
  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlockedAt).length,
    claimed: achievements.filter(a => a.claimed).length
  };

  // 篩選成就
  const filteredAchievements = achievements.filter(a => {
    if (!selectedRarity) return true;
    return a.rarity === selectedRarity;
  });

  // 計算進度百分比
  const calculateProgress = (achievement: Achievement): number => {
    if (typeof achievement.requirement !== 'number' || !achievement.progress) {
      return achievement.unlockedAt ? 100 : 0;
    }
    return Math.min(100, (achievement.progress / achievement.requirement) * 100);
  };

  // 領取獎勵
  const handleClaim = (achievement: Achievement) => {
    if (achievement.claimed || !achievement.unlockedAt) return;

    setAchievements(prev => prev.map(a => 
      a.id === achievement.id ? { ...a, claimed: true } : a
    ));
    onClaim?.(achievement.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">成就系統</h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            關閉
          </button>
        )}
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-white/10 text-center">
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-slate-400">總成就數</div>
        </div>
        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-center">
          <div className="text-3xl font-bold text-emerald-400">{stats.unlocked}</div>
          <div className="text-sm text-slate-400">已解鎖</div>
        </div>
        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 text-center">
          <div className="text-3xl font-bold text-amber-400">{stats.claimed}</div>
          <div className="text-sm text-slate-400">已領取</div>
        </div>
      </div>

      {/* 稀有度篩選 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedRarity(null)}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
            !selectedRarity
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-white/10'
          }`}
        >
          全部
        </button>
        {Object.entries(RARITY_CONFIG).map(([rarity, config]) => (
          <button
            key={rarity}
            onClick={() => setSelectedRarity(rarity)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedRarity === rarity
                ? `${config.bg} ${config.color} border ${config.border}`
                : 'bg-slate-800/50 text-slate-400 border border-white/10'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* 成就列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const rarity = RARITY_CONFIG[achievement.rarity];
          const isUnlocked = !!achievement.unlockedAt;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAchievement(achievement)}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isUnlocked
                  ? `${rarity.bg} ${rarity.border}`
                  : 'bg-slate-800/30 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 圖標 */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  isUnlocked
                    ? rarity.bg
                    : 'bg-slate-700'
                }`}>
                  {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-slate-500" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                      {achievement.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${rarity.bg} ${rarity.color}`}>
                      {rarity.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>

                  {/* 進度條 */}
                  {!isUnlocked && achievement.progress !== undefined && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>進度</span>
                        <span>{achievement.progress}/{achievement.requirement}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500"
                          style={{ width: `${calculateProgress(achievement)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 領取狀態 */}
                  {isUnlocked && (
                    <div className="flex items-center gap-2">
                      {achievement.claimed ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          已領取
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClaim(achievement);
                          }}
                          className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded text-xs hover:bg-amber-500/30 transition-colors"
                        >
                          領取獎勵
                        </button>
                      )}
                      <span className="text-xs text-slate-500">
                        {achievement.unlockedAt}
                      </span>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 成就詳情彈窗 */}
      {selectedAchievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{selectedAchievement.icon}</div>
              <h3 className="text-xl font-bold text-white">{selectedAchievement.title}</h3>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                RARITY_CONFIG[selectedAchievement.rarity].bg
              } ${RARITY_CONFIG[selectedAchievement.rarity].color}`}>
                {RARITY_CONFIG[selectedAchievement.rarity].label} 成就
              </span>
            </div>

            <p className="text-slate-400 text-center mb-6">
              {selectedAchievement.description}
            </p>

            <div className="p-4 bg-slate-800/50 rounded-xl mb-6">
              <div className="text-sm text-slate-400 mb-2">解鎖條件</div>
              <div className="text-white">
                {typeof selectedAchievement.requirement === 'number' 
                  ? `完成 ${selectedAchievement.requirement} 次`
                  : selectedAchievement.requirement}
              </div>
              {selectedAchievement.progress !== undefined && selectedAchievement.unlockedAt && (
                <div className="text-sm text-emerald-400 mt-2">
                  ✓ 已解鎖 {selectedAchievement.unlockedAt}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              關閉
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Achievements;
