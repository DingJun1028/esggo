import React from 'react';
import { Language, UserTier, UserTitle } from '../types';
import {
    Trophy, Star, Medal, Crown, Target, Award,
    TrendingUp, Users, Zap, Gamepad2, Gift
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    avatar?: string;
    badge?: string;
}

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'EcoWarrior', score: 2850, badge: '🥇' },
    { rank: 2, name: 'GreenLeader', score: 2720, badge: '🥈' },
    { rank: 3, name: 'SustainPro', score: 2680, badge: '🥉' },
    { rank: 4, name: 'CarbonHero', score: 2450 },
    { rank: 5, name: 'ESGMaster', score: 2330 },
];

export const Gamification: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const {
        level, xp, vocation, activeTitle, ownedTitles,
        tier, quests, completeQuest, goodwillBalance
    } = useCompany();

    const xpToNextLevel = vocation.nextLevelExp - vocation.exp;
    const xpProgress = (vocation.exp / vocation.nextLevelExp) * 100;

    const getTierColor = (tier: UserTier) => {
        switch (tier) {
            case 'Pro': return 'from-purple-500 to-purple-300';
            case 'Enterprise': return 'from-amber-500 to-amber-300';
            default: return 'from-gray-500 to-gray-300';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={Gamepad2}
                    title={{ zh: '遊戲化挑戰 (Gamification)', en: 'Gamification' }}
                    description={{ zh: '玩家檔案、排行榜與成就系統', en: 'Player Profile, Leaderboards & Achievement System.' }}
                    language={language}
                    tag={{ zh: '遊戲動力 v3.0', en: 'GAME_DYNAMICS_v3.0' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 玩家檔案 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 rounded-[2rem] text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{isZh ? '玩家等級' : 'Player Level'}</h3>
                        <div className="text-5xl font-mono font-black text-white tracking-tighter">
                            {level}
                        </div>
                        <div className="text-sm text-purple-300 mt-2">{vocation.type}</div>
                    </div>

                    {/* XP 進度 */}
                    <div className="glass-bento p-5 bg-slate-900/60 border-white/10 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-white">{isZh ? '經驗值' : 'Experience'}</span>
                            <span className="text-sm font-mono text-purple-400">{xp} / {vocation.nextLevelExp} XP</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${xpProgress}%` }}
                            />
                        </div>
                        <div className="text-right text-[10px] text-gray-400">
                            {xpToNextLevel} XP {isZh ? '至下一等級' : 'to next level'}
                        </div>
                    </div>

                    {/* 活躍稱號 */}
                    <div className="glass-bento p-5 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400" />
                            {isZh ? '活躍稱號' : 'Active Title'}
                        </h4>
                        {activeTitle ? (
                            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
                                <div className="text-sm font-bold text-amber-400 mb-1">{activeTitle.text}</div>
                                <div className="text-[10px] text-amber-300">{activeTitle.description}</div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">{isZh ? '無活躍稱號' : 'No active title'}</div>
                        )}
                    </div>
                </div>

                {/* 2. 任務與成就 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 bg-slate-950 border-white/10 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><Target className="w-3.5 h-3.5 text-emerald-400" /> Active_Quests</h3>
                        </div>

                        <div className="flex-1 min-h-0 overflow-auto space-y-3">
                            {quests.filter(q => q.status === 'ready').map(quest => (
                                <div key={quest.id} className="glass-bento p-4 rounded-xl bg-slate-900/40 border border-white/10 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-white mb-1">{quest.title}</h4>
                                            <div className="text-[10px] text-gray-400 mb-2">{quest.enTitle}</div>
                                            <div className="text-[11px] text-gray-300">{quest.impactDesc}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-mono text-emerald-400">+{quest.xpReward} XP</div>
                                            <div className="text-sm font-mono text-blue-400">+{quest.gwcReward} GWC</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => completeQuest(quest.id, quest.xpReward)}
                                        className="w-full py-2 bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Award className="w-3 h-3" />
                                        {isZh ? '完成任務' : 'Complete Quest'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. 排行榜 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 bg-slate-900/60 border-white/10 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Leaderboard</h3>
                        </div>

                        <div className="flex-1 min-h-0 overflow-auto space-y-2">
                            {SAMPLE_LEADERBOARD.map(entry => (
                                <div key={entry.rank} className={`glass-bento p-3 rounded-xl border transition-all ${
                                    entry.rank <= 3
                                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20'
                                        : 'bg-slate-900/40 border-white/10'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                entry.rank === 1 ? 'bg-amber-500 text-black' :
                                                entry.rank === 2 ? 'bg-gray-400 text-black' :
                                                entry.rank === 3 ? 'bg-amber-600 text-white' :
                                                'bg-slate-700 text-white'
                                            }`}>
                                                {entry.badge || entry.rank}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{entry.name}</div>
                                                <div className="text-[10px] text-gray-400">{isZh ? '第' : 'Rank'} {entry.rank}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-mono font-bold text-amber-400">
                                            {entry.score.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 個人統計 */}
                    <div className="glass-bento p-4 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            {isZh ? '個人統計' : 'Personal Stats'}
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-xl font-mono font-bold text-emerald-400">{quests.filter(q => q.status === 'completed').length}</div>
                                <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '完成任務' : 'Completed'}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-xl font-mono font-bold text-blue-400">{goodwillBalance}</div>
                                <div className="text-[8px] text-gray-500 uppercase font-black">GWC</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};