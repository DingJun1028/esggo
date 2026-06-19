/**
 * 🎮 永續素養遊戲化系統
 * --------------------------------------------------
 * [功能] ITK 影響力指數、任務系統、徽章與排行榜
 * [整合] 每日任務、成就解鎖、社交排名
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Trophy,
  Star,
  Target,
  CheckCircle,
  Clock,
  Gift,
  Users,
  TrendingUp,
  Zap,
  Medal,
  Crown,
  Calendar,
  Award,
  Sparkles,
  ChevronRight,
  Play,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ITKScore {
  total: number;
  breakdown: {
    insight: number; // I - 洞察力
    trustworthiness: number; // T - 可信度
    kindness: number; // K - 善意影響
  };
  level: number;
  title: string;
  nextLevelXP: number;
  currentXP: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement' | 'challenge';
  category: 'learning' | 'action' | 'social' | 'reporting';
  xpReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  deadline?: Date;
  icon: React.ReactNode;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  isUnlocked: boolean;
  requirement: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  itkScore: number;
  level: number;
  title: string;
  isCurrentUser: boolean;
}

// ============================================================================
// Constants
// ============================================================================

// Custom icons (to avoid hoisting issues)
const BookOpenIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const CalculatorIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
  </svg>
);

const LEVEL_TITLES = [
  { level: 1, title: '永續新手', minXP: 0 },
  { level: 2, title: '環保學徒', minXP: 100 },
  { level: 3, title: '碳足跡獵人', minXP: 300 },
  { level: 4, title: 'ESG 探索者', minXP: 600 },
  { level: 5, title: '永續實踐家', minXP: 1000 },
  { level: 6, title: '綠色先鋒', minXP: 1500 },
  { level: 7, title: '影響力大使', minXP: 2200 },
  { level: 8, title: '永續領袖', minXP: 3000 },
  { level: 9, title: '地球守護者', minXP: 4000 },
  { level: 10, title: '傳奇典範', minXP: 5500 },
] as const;

const MOCK_QUESTS: Quest[] = [
  {
    id: 'daily-1',
    title: '完成碳足跡計算',
    description: '使用碳盤查工具計算一項活動的碳排放',
    type: 'daily',
    category: 'action',
    xpReward: 20,
    progress: 1,
    target: 1,
    isCompleted: true,
    icon: <CalculatorIcon size={16} />,
  },
  {
    id: 'daily-2',
    title: '閱讀 ESG 新聞',
    description: '閱讀 3 篇每日 ESG 新聞',
    type: 'daily',
    category: 'learning',
    xpReward: 15,
    progress: 2,
    target: 3,
    isCompleted: false,
    icon: <BookOpenIcon size={16} />,
  },
  {
    id: 'daily-3',
    title: '回答知識問答',
    description: '完成今日永續知識測驗',
    type: 'daily',
    category: 'learning',
    xpReward: 25,
    progress: 0,
    target: 1,
    isCompleted: false,
    icon: <Zap size={16} />,
  },
  {
    id: 'weekly-1',
    title: '供應鏈 ESG 審核',
    description: '完成 5 家供應商的 ESG 評分審核',
    type: 'weekly',
    category: 'action',
    xpReward: 100,
    progress: 3,
    target: 5,
    isCompleted: false,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    icon: <Target size={16} />,
  },
  {
    id: 'weekly-2',
    title: '分享永續文章',
    description: '在社群分享 3 篇永續報導',
    type: 'weekly',
    category: 'social',
    xpReward: 50,
    progress: 1,
    target: 3,
    isCompleted: false,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    icon: <Users size={16} />,
  },
  {
    id: 'achieve-1',
    title: '碳中和先鋒',
    description: '完成公司首次完整碳盤查',
    type: 'achievement',
    category: 'reporting',
    xpReward: 500,
    progress: 1,
    target: 1,
    isCompleted: true,
    icon: <Award size={16} />,
  },
];

const MOCK_BADGES: Badge[] = [
  {
    id: 'b1',
    name: '首次登入',
    description: '開啟永續旅程',
    icon: '🌱',
    rarity: 'common',
    isUnlocked: true,
    unlockedAt: new Date('2024-01-01'),
    requirement: '完成帳號註冊',
  },
  {
    id: 'b2',
    name: '碳足跡達人',
    description: '完成 10 次碳排計算',
    icon: '👣',
    rarity: 'common',
    isUnlocked: true,
    unlockedAt: new Date('2024-02-15'),
    requirement: '累計計算 10 次碳排',
  },
  {
    id: 'b3',
    name: '知識淵博',
    description: '閱讀 50 篇 ESG 新聞',
    icon: '📚',
    rarity: 'rare',
    isUnlocked: true,
    unlockedAt: new Date('2024-03-01'),
    requirement: '累計閱讀 50 篇新聞',
  },
  {
    id: 'b4',
    name: '社群影響者',
    description: '分享內容獲得 100 次互動',
    icon: '🌟',
    rarity: 'rare',
    isUnlocked: false,
    requirement: '獲得 100 次按讚或分享',
  },
  {
    id: 'b5',
    name: '永續報告大師',
    description: '完成完整永續報告',
    icon: '📊',
    rarity: 'epic',
    isUnlocked: false,
    requirement: '發布經驗證的永續報告',
  },
  {
    id: 'b6',
    name: '淨零先驅',
    description: '達成碳中和目標',
    icon: '🏆',
    rarity: 'legendary',
    isUnlocked: false,
    requirement: '公司達成碳中和',
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u1',
    name: '王永續',
    avatar: '👨‍💼',
    itkScore: 4850,
    level: 9,
    title: '地球守護者',
    isCurrentUser: false,
  },
  {
    rank: 2,
    userId: 'u2',
    name: '李環保',
    avatar: '👩‍💼',
    itkScore: 3920,
    level: 8,
    title: '永續領袖',
    isCurrentUser: false,
  },
  {
    rank: 3,
    userId: 'u3',
    name: '陳碳權',
    avatar: '🧑‍💼',
    itkScore: 3450,
    level: 8,
    title: '永續領袖',
    isCurrentUser: false,
  },
  {
    rank: 4,
    userId: 'u4',
    name: '林綠能',
    avatar: '👨‍🔬',
    itkScore: 2890,
    level: 7,
    title: '影響力大使',
    isCurrentUser: true,
  },
  {
    rank: 5,
    userId: 'u5',
    name: '張再生',
    avatar: '👩‍🔬',
    itkScore: 2540,
    level: 7,
    title: '影響力大使',
    isCurrentUser: false,
  },
];

// ============================================================================
// Main Component
// ============================================================================

interface GamificationSystemProps {
  userId?: string;
  onQuestComplete?: (quest: Quest) => void;
}

export const GamificationSystem: React.FC<GamificationSystemProps> = ({
  userId = 'u4',
  onQuestComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'badges' | 'leaderboard'>('quests');
  const [quests, setQuests] = useState<Quest[]>(MOCK_QUESTS);
  const [showXpAnimation, setShowXpAnimation] = useState(false);

  useEffect(() => {
    omniLogger.info(LogCategory.GROWTH, '遊戲化系統已啟動', {
      userId,
      source_origin: 'GamificationSystem.mount',
    });
  }, [userId]);

  // Calculate ITK Score
  const itkScore = useMemo<ITKScore>(() => {
    const total = 2890;
    // LEVEL_TITLES is a non-empty const array, so fallback is always defined
    const levelInfo =
      LEVEL_TITLES.slice()
        .reverse()
        .find(l => total >= l.minXP) ?? LEVEL_TITLES[0];
    const nextLevel = LEVEL_TITLES.find(l => l.minXP > total);

    return {
      total,
      breakdown: {
        insight: 980,
        trustworthiness: 1120,
        kindness: 790,
      },
      level: levelInfo.level,
      title: levelInfo.title,
      nextLevelXP: nextLevel?.minXP || levelInfo.minXP,
      currentXP: total,
    };
  }, []);

  // Progress to next level
  const levelProgress = useMemo(() => {
    const currentLevelXP = LEVEL_TITLES.find(l => l.level === itkScore.level)?.minXP || 0;
    const xpInLevel = itkScore.currentXP - currentLevelXP;
    const xpNeeded = itkScore.nextLevelXP - currentLevelXP;
    return (xpInLevel / xpNeeded) * 100;
  }, [itkScore]);

  // Daily quest completion stats
  const dailyStats = useMemo(() => {
    const dailyQuests = quests.filter(q => q.type === 'daily');
    const completed = dailyQuests.filter(q => q.isCompleted).length;
    return { completed, total: dailyQuests.length };
  }, [quests]);

  // Complete a quest
  const completeQuest = (questId: string) => {
    const trace_id = uuidv4();
    const quest = quests.find(q => q.id === questId);

    omniLogger.info(LogCategory.GROWTH, `用戶完成任務: ${quest?.title || questId}`, {
      trace_id,
      quest_id: questId,
      xp_reward: quest?.xpReward,
      source_origin: 'GamificationSystem.completeQuest',
    });

    setQuests(prev =>
      prev.map(q => (q.id === questId ? { ...q, isCompleted: true, progress: q.target } : q))
    );
    setShowXpAnimation(true);
    setTimeout(() => setShowXpAnimation(false), 1500);

    if (quest) {
      onQuestComplete?.(quest);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500 text-yellow-300';
      case 'epic':
        return 'from-purple-500 to-pink-500 text-purple-300';
      case 'rare':
        return 'from-blue-500 to-cyan-500 text-blue-300';
      default:
        return 'from-slate-500 to-slate-600 text-slate-300';
    }
  };

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-amber-500/20 neon-border-amber animate-in">
      {/* Header with ITK Score */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 animate-pulse">
              👨‍🔬
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-xs font-bold text-amber-500 shadow-md">
              {itkScore.level}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{itkScore.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                ITK 指數
              </span>
              <span className="text-2xl font-black text-white">{itkScore.total}</span>
            </div>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-2 py-1 rounded-md w-fit">
              <span>
                I: <span className="text-amber-400">{itkScore.breakdown.insight}</span>
              </span>
              <span>
                T: <span className="text-orange-400">{itkScore.breakdown.trustworthiness}</span>
              </span>
              <span>
                K: <span className="text-emerald-400">{itkScore.breakdown.kindness}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame size={16} />
            <span className="text-sm font-medium">7 天連勝</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            距離 Lv.{itkScore.level + 1} 還需 {itkScore.nextLevelXP - itkScore.currentXP} XP
          </p>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="mb-6">
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* XP Animation */}
      <AnimatePresence>
        {showXpAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 text-2xl font-bold text-amber-400"
          >
            +20 XP! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'quests', label: '任務', icon: <Target size={14} /> },
          { id: 'badges', label: '徽章', icon: <Medal size={14} /> },
          { id: 'leaderboard', label: '排行榜', icon: <Trophy size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'quests' && (
          <motion.div
            key="quests"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3"
          >
            {/* Daily Progress */}
            <div className="p-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl border border-amber-500/30 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-amber-400">每日任務進度</span>
                <span className="text-lg font-bold text-white">
                  {dailyStats.completed}/{dailyStats.total}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${(dailyStats.completed / dailyStats.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Quest List */}
            {quests.map(quest => (
              <div
                key={quest.id}
                className={`p-4 rounded-xl transition-all ${
                  quest.isCompleted
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quest.isCompleted
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {quest.isCompleted ? <CheckCircle size={20} /> : quest.icon}
                    </div>
                    <div>
                      <h4
                        className={`font-medium ${quest.isCompleted ? 'text-green-400' : 'text-white'}`}
                      >
                        {quest.title}
                      </h4>
                      <p className="text-xs text-slate-500">{quest.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={12} />
                      <span className="text-sm font-medium">+{quest.xpReward} XP</span>
                    </div>
                    {!quest.isCompleted && (
                      <p className="text-xs text-slate-500">
                        {quest.progress}/{quest.target}
                      </p>
                    )}
                  </div>
                </div>
                {!quest.isCompleted && quest.progress > 0 && (
                  <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="grid grid-cols-3 gap-3"
          >
            {MOCK_BADGES.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  badge.isUnlocked ? 'bg-slate-800/50' : 'bg-slate-800/20 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2 ${
                    badge.isUnlocked
                      ? `bg-gradient-to-r ${getRarityColor(badge.rarity)}`
                      : 'bg-slate-700'
                  }`}
                >
                  {badge.isUnlocked ? badge.icon : <Lock size={20} />}
                </div>
                <h4 className="text-sm font-medium text-white">{badge.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                {!badge.isUnlocked && (
                  <p className="text-xs text-amber-400 mt-2">{badge.requirement}</p>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-2"
          >
            {MOCK_LEADERBOARD.map(entry => (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  entry.isCurrentUser
                    ? 'bg-amber-500/20 border border-amber-500/30'
                    : 'bg-slate-800/30'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1
                      ? 'bg-yellow-500 text-black'
                      : entry.rank === 2
                        ? 'bg-slate-400 text-black'
                        : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </div>
                <div className="text-2xl">{entry.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">
                    {entry.name} {entry.isCurrentUser && '(你)'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Lv.{entry.level} {entry.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-400">{entry.itkScore}</p>
                  <p className="text-xs text-slate-500">ITK</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamificationSystem;
