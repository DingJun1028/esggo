/**
 * 📜 任務系統 - Quest System
 * 
 * 功能：
 * - 每日任務
 * - 每週任務
 * - 主線任務
 * - 成就追蹤
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Trophy, 
  Clock, 
  CheckCircle,
  Star,
  Target,
  Flame,
  Gift,
  ChevronRight
} from 'lucide-react';

interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'main';
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: {
    type: 'xp' | 'currency' | 'card';
    value: string | number;
  };
  expiresAt?: string;
  completed: boolean;
}

interface QuestSystemProps {
  userId: string;
  onQuestComplete: (questId: string, reward: Quest['reward']) => void;
  onClose: () => void;
}

// 模擬任務數據
const MOCK_QUESTS: Quest[] = [
  {
    id: 'daily-001',
    type: 'daily',
    title: '每日出擊',
    description: '完成 1 場戰鬥',
    progress: 1,
    target: 1,
    reward: { type: 'xp', value: 100 },
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    completed: true
  },
  {
    id: 'daily-002',
    type: 'daily',
    title: '知識收集',
    description: '收集 1 張新卡牌',
    progress: 0,
    target: 1,
    reward: { type: 'card', value: 'random' },
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    completed: false
  },
  {
    id: 'daily-003',
    type: 'daily',
    title: '淨化行動',
    description: '降低村莊熵值 10%',
    progress: 5,
    target: 10,
    reward: { type: 'currency', value: 50 },
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    completed: false
  },
  {
    id: 'weekly-001',
    type: 'weekly',
    title: '戰士一週',
    description: '完成 10 場戰鬥',
    progress: 7,
    target: 10,
    reward: { type: 'xp', value: 1000 },
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false
  },
  {
    id: 'weekly-002',
    type: 'weekly',
    title: '進化之路',
    description: '提升 AI 等級 5 級',
    progress: 3,
    target: 5,
    reward: { type: 'card', value: 'epic' },
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false
  }
];

export const QuestSystem: React.FC<QuestSystemProps> = ({
  userId,
  onQuestComplete,
  onClose
}) => {
  const [quests, setQuests] = useState<Quest[]>(MOCK_QUESTS);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'main'>('daily');

  // 計算剩餘時間
  const getRemainingTime = (expiresAt?: string): string => {
    if (!expiresAt) return '';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return '已過期';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}時${minutes}分`;
  };

  // 獲取任務進度百分比
  const getProgressPercent = (quest: Quest): number => {
    return Math.min(100, (quest.progress / quest.target) * 100);
  };

  // 篩選任務
  const filteredQuests = quests.filter(q => q.type === activeTab);

  // 計算統計
  const stats = {
    daily: {
      total: quests.filter(q => q.type === 'daily').length,
      completed: quests.filter(q => q.type === 'daily' && q.completed).length
    },
    weekly: {
      total: quests.filter(q => q.type === 'weekly').length,
      completed: quests.filter(q => q.type === 'weekly' && q.completed).length
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl overflow-hidden"
      >
        {/* 頂部標題 */}
        <div className="relative p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">任務中心</h2>
              <p className="text-sm text-slate-400">完成任務獲得豐厚獎勵</p>
            </div>
          </div>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-2 gap-3 p-4 border-b border-white/10">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">每日任務</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.daily.completed}/{stats.daily.total}
            </div>
            <div className="text-xs text-slate-400">
              完成 {Math.round((stats.daily.completed / stats.daily.total) * 100)}%
            </div>
          </div>
          
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">每週任務</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.weekly.completed}/{stats.weekly.total}
            </div>
            <div className="text-xs text-slate-400">
              完成 {Math.round((stats.weekly.completed / stats.weekly.total) * 100)}%
            </div>
          </div>
        </div>

        {/* 標籤導航 */}
        <div className="flex gap-2 p-4 border-b border-white/10">
          {[
            { id: 'daily', label: '每日', icon: <SunIcon /> },
            { id: 'weekly', label: '每週', icon: <WeekIcon /> },
            { id: 'main', label: '主線', icon: <Star className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 任務列表 */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {filteredQuests.map(quest => (
            <motion.div
              key={quest.id}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-xl border transition-all ${
                quest.completed
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-800/50 border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    quest.completed
                      ? 'bg-emerald-500/20'
                      : quest.type === 'daily'
                        ? 'bg-amber-500/20'
                        : 'bg-blue-500/20'
                  }`}>
                    {quest.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : quest.type === 'daily' ? (
                      <Flame className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Star className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${
                      quest.completed ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {quest.title}
                    </h3>
                    <p className="text-xs text-slate-400">{quest.description}</p>
                  </div>
                </div>

                {/* 獎勵顯示 */}
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  quest.reward.type === 'xp'
                    ? 'bg-amber-500/20 text-amber-400'
                    : quest.reward.type === 'currency'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {quest.reward.type === 'xp' && '⭐'}
                  {quest.reward.type === 'currency' && '🪙'}
                  {quest.reward.type === 'card' && '🎴'}
                  {' '}{typeof quest.reward.value === 'number' ? quest.reward.value : quest.reward.value}
                </div>
              </div>

              {/* 進度條 */}
              {!quest.completed && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>進度</span>
                    <span>{quest.progress}/{quest.target}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercent(quest)}%` }}
                      className={`h-full rounded-full ${
                        quest.type === 'daily' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* 剩餘時間 */}
              {quest.expiresAt && !quest.completed && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>剩餘 {getRemainingTime(quest.expiresAt)}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// 太陽圖標
const SunIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

// 週圖標
const WeekIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default QuestSystem;
