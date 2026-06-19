import React, { useState } from 'react';
import { Language } from '@/types';
import { Trophy, Target, Flame, Star, Award, TrendingUp, Zap } from 'lucide-react';

export const Gamification: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';

  const playerStats = {
    level: 12,
    xp: 3450,
    xpToNextLevel: 5000,
    streak: 18,
    totalPoints: 12850,
    rank: '#127',
  };

  const quests = [
    {
      id: 1,
      title: isZh ? '每日簽到' : 'Daily Check-in',
      description: isZh ? '連續登入 7 天' : 'Login for 7 consecutive days',
      progress: 5,
      target: 7,
      reward: { xp: 100, coins: 50 },
      difficulty: 'easy',
      category: 'daily',
    },
    {
      id: 2,
      title: isZh ? 'ESG 數據大師' : 'ESG Data Master',
      description: isZh ? '更新 30 筆 ESG 數據' : 'Update 30 ESG data entries',
      progress: 22,
      target: 30,
      reward: { xp: 500, coins: 250 },
      difficulty: 'medium',
      category: 'data',
    },
    {
      id: 3,
      title: isZh ? '碳中和先鋒' : 'Carbon Neutral Pioneer',
      description: isZh ? '完成碳中和計畫' : 'Complete carbon neutrality plan',
      progress: 0,
      target: 1,
      reward: { xp: 2000, coins: 1000 },
      difficulty: 'hard',
      category: 'achievement',
    },
  ];

  const achievements = [
    {
      name: isZh ? 'ESG 新手' : 'ESG Rookie',
      icon: '🌟',
      description: isZh ? '完成第一個任務' : 'Complete first quest',
      unlocked: true,
    },
    {
      name: isZh ? '數據收集者' : 'Data Collector',
      icon: '📊',
      description: isZh ? '輸入 100 筆數據' : 'Enter 100 data entries',
      unlocked: true,
    },
    {
      name: isZh ? '報告專家' : 'Report Expert',
      icon: '📄',
      description: isZh ? '生成 10 份報告' : 'Generate 10 reports',
      unlocked: true,
    },
    {
      name: isZh ? '學習達人' : 'Learning Master',
      icon: '🎓',
      description: isZh ? '完成 5 門課程' : 'Complete 5 courses',
      unlocked: false,
    },
    {
      name: isZh ? '社群領袖' : 'Community Leader',
      icon: '👥',
      description: isZh ? '邀請 20 位用戶' : 'Invite 20 users',
      unlocked: false,
    },
    {
      name: isZh ? '永續傳奇' : 'Sustainability Legend',
      icon: '🏆',
      description: isZh ? '達到 50 級' : 'Reach level 50',
      unlocked: false,
    },
  ];

  const leaderboard = [
    { rank: 1, name: isZh ? '張環保' : 'Green Zhang', points: 28450, level: 28 },
    { rank: 2, name: isZh ? '李永續' : 'Sustainable Li', points: 25120, level: 26 },
    { rank: 3, name: isZh ? '王減碳' : 'Carbon Wang', points: 22890, level: 24 },
    {
      rank: 127,
      name: isZh ? '你' : 'You',
      points: playerStats.totalPoints,
      level: playerStats.level,
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="text-amber-400 w-6 h-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            {isZh ? '遊戲化系統' : 'Gamification'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh ? '完成任務、獲得成就、提升等級' : 'Complete quests, earn achievements, level up'}
          </p>
        </div>
      </div>

      {/* Player Card */}
      <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.2)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                🦸
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  {isZh ? '等級' : 'Level'} {playerStats.level}
                </h2>
                <p className="text-indigo-100 text-sm">
                  {isZh ? '永續實踐者' : 'Sustainability Practitioner'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 mb-2">
                <div className="text-white text-xs">{isZh ? '排名' : 'Rank'}</div>
                <div className="text-2xl font-black text-white">{playerStats.rank}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white mb-1">
                <Star className="w-4 h-4" />
                <span className="text-xs">{isZh ? '經驗值' : 'XP'}</span>
              </div>
              <div className="text-xl font-black text-white">{playerStats.xp.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-xs">{isZh ? '連勝紀錄' : 'Streak'}</span>
              </div>
              <div className="text-xl font-black text-white">
                {playerStats.streak} {isZh ? '天' : 'days'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 text-white mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xs">{isZh ? '總積分' : 'Points'}</span>
              </div>
              <div className="text-xl font-black text-white">
                {playerStats.totalPoints.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white text-sm mb-2">
              <span>{isZh ? '升級進度' : 'Level Progress'}</span>
              <span>
                {playerStats.xp} / {playerStats.xpToNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-white to-indigo-200 rounded-full transition-all duration-500"
                style={{ width: `${(playerStats.xp / playerStats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quests */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          {isZh ? '進行中任務' : 'Active Quests'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests.map(quest => (
            <div
              key={quest.id}
              className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-bold">{quest.title}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    quest.difficulty === 'easy'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : quest.difficulty === 'medium'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-purple-500/10 text-purple-400'
                  }`}
                >
                  {quest.difficulty === 'easy'
                    ? isZh
                      ? '簡單'
                      : 'Easy'
                    : quest.difficulty === 'medium'
                      ? isZh
                        ? '中等'
                        : 'Medium'
                      : isZh
                        ? '困難'
                        : 'Hard'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4">{quest.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{isZh ? '進度' : 'Progress'}</span>
                  <span className="text-emerald-400 font-bold">
                    {quest.progress}/{quest.target}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-bold">+{quest.reward.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-bold">
                    +{quest.reward.coins} {isZh ? '幣' : 'Coins'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          {isZh ? '成就收藏' : 'Achievements'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, i) => (
            <div
              key={i}
              className={`text-center p-4 rounded-2xl transition-all cursor-pointer ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-800/30 border border-slate-700 opacity-40 grayscale'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="text-xs text-white font-bold mb-1">{achievement.name}</p>
              <p className="text-[10px] text-slate-400">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          {isZh ? '排行榜' : 'Leaderboard'}
        </h2>
        <div className="space-y-2">
          {leaderboard.map((player, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                player.rank === 127
                  ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                  : 'bg-slate-800/30 hover:bg-slate-800/50 border border-transparent hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    player.rank === 1
                      ? 'bg-amber-600 text-white'
                      : player.rank === 2
                        ? 'bg-slate-400 text-white'
                        : player.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-white/10 text-slate-400'
                  }`}
                >
                  #{player.rank}
                </div>
                <div>
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-xs text-slate-400">
                    {isZh ? '等級' : 'Level'} {player.level}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-amber-400">
                  {player.points.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">{isZh ? '積分' : 'points'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
