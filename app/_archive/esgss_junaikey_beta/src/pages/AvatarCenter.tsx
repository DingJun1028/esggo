/**
 * 🎮 數位分身中心 (Digital Avatar Center)
 * 
 * 功能：
 * - 分身狀態總覽
 * - 屬性與技能管理
 * - 裝備與物品欄
 * - 成就與徽章系統
 * - 成長軌跡追蹤
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

import {
    User, Heart, Zap, Shield, Sword, Star, Coins,
    BookOpen, Trophy, Map, Settings, ChevronRight,
    Database, Activity, Lock, CheckCircle, ArrowUp,
    ArrowDown, TrendingUp, Target, Flame
} from 'lucide-react';

import FiveTProtocolBadge from '@/components/omni/FiveTProtocolBadge';


// ============================================================================
// 🎯 類型定義
// ============================================================================

// 分身屬性
interface AvatarStats {
    level: number;
    xp: number;
    xpMax: number;
    hp: number;
    hpMax: number;
    energy: number;
    energyMax: number;
    strength: number;      // 力量 - 影響攻擊力
    wisdom: number;        // 智慧 - 影響技能
    agility: number;       // 敏捷 - 影響迴避
    charisma: number;     // 魅力 - 影響互動
    endurance: number;    // 耐力 - 影響防禦
}

// 技能
interface Skill {
    id: string;
    name: string;
    description: string;
    icon: string;
    level: number;
    maxLevel: number;
    category: 'COMBAT' | 'SUPPORT' | 'GATHER' | 'CRAFT';
    cooldown: number;
    unlocked: boolean;
}

// 裝備槽位
interface EquipmentSlot {
    id: string;
    name: string;
    icon: string;
    item: EquipmentItem | null;
}

// 裝備物品
interface EquipmentItem {
    id: string;
    name: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    icon: string;
    stats: Record<string, number>;
    set?: string;
}

// 成就
interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    completed: boolean;
    completedAt?: Date;
    progress: number;
    target: number;
    reward: string;
}

// 徽章
interface Badge {
    id: string;
    name: string;
    icon: string;
    rarity: string;
    earned: boolean;
    earnedAt?: Date;
}

// 成長軌跡
interface GrowthRecord {
    date: Date;
    action: string;
    xp: number;
    zone: string;
}

// ============================================================================
// 📊 數據模擬
// ============================================================================

const INITIAL_STATS: AvatarStats = {
    level: 5,
    xp: 2450,
    xpMax: 5000,
    hp: 100,
    hpMax: 100,
    energy: 80,
    energyMax: 100,
    strength: 12,
    wisdom: 15,
    agility: 10,
    charisma: 14,
    endurance: 11
};

const SKILLS_DATA: Skill[] = [
    {
        id: 'carbon-master',
        name: '碳足跡大師',
        description: '計算碳排放時獲得 20% 經驗加成',
        icon: '🌱',
        level: 3,
        maxLevel: 5,
        category: 'GATHER',
        cooldown: 0,
        unlocked: true
    },
    {
        id: 'data-shield',
        name: '數據護盾',
        description: '受到錯誤數據攻擊時減少 30% 傷害',
        icon: '🛡️',
        level: 2,
        maxLevel: 5,
        category: 'SUPPORT',
        cooldown: 30,
        unlocked: true
    },
    {
        id: 'ESG-slash',
        name: 'ESG 劈砍',
        description: '對「漂綠惡魔」造成 150% 傷害',
        icon: '⚔️',
        level: 1,
        maxLevel: 5,
        category: 'COMBAT',
        cooldown: 15,
        unlocked: false
    },
    {
        id: 'alchemy-touch',
        name: '煉金觸碰',
        description: '將廢棄數據轉化為資源',
        icon: '🧪',
        level: 1,
        maxLevel: 5,
        category: 'CRAFT',
        cooldown: 60,
        unlocked: false
    }
];

const EQUIPMENT_SLOTS: EquipmentSlot[] = [
    { id: 'head', name: '頭部', icon: '🎩', item: { id: 'wisdom-hat', name: '智慧之帽', rarity: 'RARE', icon: '🎩', stats: { wisdom: +5 } } },
    { id: 'body', name: '身體', icon: '👕', item: { id: 'ESG-robe', name: '永續長袍', rarity: 'EPIC', icon: '👕', stats: { charisma: +3, endurance: +5 } } },
    { id: 'weapon', name: '武器', icon: '⚔️', item: { id: 'truth-sword', name: '真理之劍', rarity: 'LEGENDARY', icon: '⚔️', stats: { strength: +8, wisdom: +3 } } },
    { id: 'accessory', name: '飾品', icon: '💍', item: null },
    { id: 'belt', name: '腰帶', icon: '🎀', item: { id: 'energy-belt', name: '能量腰帶', rarity: 'COMMON', icon: '🎀', stats: { energyMax: +20 } } }
];

const ACHIEVEMENTS_DATA: Achievement[] = [
    {
        id: 'first-quest',
        name: '初入永續村',
        description: '完成第一個任務',
        icon: '🎯',
        completed: true,
        completedAt: new Date('2026-01-15'),
        progress: 1,
        target: 1,
        reward: '100 XP'
    },
    {
        id: 'card-collector',
        name: '卡牌收藏家',
        description: '收集 10 張知識卡牌',
        icon: '🃏',
        completed: false,
        progress: 4,
        target: 10,
        reward: '稀有卡牌包'
    },
    {
        id: 'tower-climber',
        name: '塔之征服者',
        description: '挑戰無限輪迴塔 50 層',
        icon: '🗼',
        completed: false,
        progress: 12,
        target: 50,
        reward: '傳說徽章'
    },
    {
        id: 'five-t-master',
        name: '5T 大師',
        description: '完成 5T 協議完整流程 5 次',
        icon: '⭐',
        completed: false,
        progress: 2,
        target: 5,
        reward: '5T 稱號'
    },
    {
        id: 'nature-friend',
        name: '自然之友',
        description: '完成森林精靈的所有任務',
        icon: '🌳',
        completed: false,
        progress: 1,
        target: 5,
        reward: '自然守護者稱號'
    }
];

const BADGES_DATA: Badge[] = [
    { id: 'b1', name: 'ESG 新手', icon: '🌱', rarity: 'COMMON', earned: true, earnedAt: new Date('2026-01-10') },
    { id: 'b2', name: '碳足跡專家', icon: '📊', rarity: 'RARE', earned: true, earnedAt: new Date('2026-01-20') },
    { id: 'b3', name: '區塊鏈使者', icon: '⛓️', rarity: 'EPIC', earned: false },
    { id: 'b4', name: '永續之光', icon: '✨', rarity: 'LEGENDARY', earned: false },
    { id: 'b5', name: '奧秘精靈', icon: '🧚', rarity: 'LEGENDARY', earned: false }
];

// ============================================================================
// 📊 屬性面板組件
// ============================================================================

const StatsPanel = ({ stats }: { stats: AvatarStats }) => {
    const { t } = useLanguage();
    const getStatColor = (value: number) => {

        if (value >= 15) return 'text-t5-trackable'; // 紫色/追蹤
        if (value >= 12) return 'text-t5-traceable'; // 藍色/溯源
        if (value >= 10) return 'text-t5-tangible';  // 綠色/感知
        return 'text-slate-400';
    };

    const getStatIcon = (name: string) => {
        switch (name) {
            case 'strength': return <Sword className="w-4 h-4 text-red-400" />;
            case 'wisdom': return <BookOpen className="w-4 h-4 text-blue-400" />;
            case 'agility': return <Activity className="w-4 h-4 text-green-400" />;
            case 'charisma': return <Heart className="w-4 h-4 text-pink-400" />;
            case 'endurance': return <Shield className="w-4 h-4 text-amber-400" />;
            default: return null;
        }
    };

    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-brand-primary flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {t('avatar.stats.title')}
                </h3>
                <FiveTProtocolBadge size="sm" showLabels />
            </div>



            {/* 等級與經驗 */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">Lv.{stats.level}</span>
                    <span className="text-sm text-slate-400">{stats.xp} / {stats.xpMax} XP</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-brand-primary to-aqua-600 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                        animate={{ width: `${(stats.xp / stats.xpMax) * 100}%` }}
                    />
                </div>
            </div>

            {/* 生命與能量 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-red-400 flex items-center">
                            <Heart className="w-4 h-4 mr-1" /> HP
                        </span>
                        <span className="text-xs text-slate-400">{stats.hp}/{stats.hpMax}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-red-500"
                            animate={{ width: `${(stats.hp / stats.hpMax) * 100}%` }}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-yellow-400 flex items-center">
                            <Zap className="w-4 h-4 mr-1" /> Energy
                        </span>
                        <span className="text-xs text-slate-400">{stats.energy}/{stats.energyMax}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-yellow-500"
                            animate={{ width: `${(stats.energy / stats.energyMax) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 五維屬性 */}
            <div className="space-y-3">
                {[
                    { name: 'strength', label: t('avatar.stats.strength'), value: stats.strength },
                    { name: 'wisdom', label: t('avatar.stats.wisdom'), value: stats.wisdom },
                    { name: 'agility', label: t('avatar.stats.agility'), value: stats.agility },
                    { name: 'charisma', label: t('avatar.stats.charisma'), value: stats.charisma },
                    { name: 'endurance', label: t('avatar.stats.endurance'), value: stats.endurance }
                ].map(attr => (

                    <div key={attr.name} className="flex items-center">
                        {getStatIcon(attr.name)}
                        <span className="w-12 text-sm text-slate-300 ml-2">{attr.label}</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full ml-2 overflow-hidden">
                            <motion.div
                                className={`h-full ${getStatColor(attr.value)}`}
                                animate={{ width: `${(attr.value / 20) * 100}%` }}
                            />
                        </div>
                        <span className={`w-8 text-sm font-mono ${getStatColor(attr.value)} ml-2`}>
                            {attr.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// ⚔️ 技能組件
// ============================================================================

const SkillsPanel = ({ skills }: { skills: Skill[] }) => {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');


    const categories = [
        { id: 'ALL', label: '全部', icon: '📦' },
        { id: 'COMBAT', label: '戰鬥', icon: '⚔️' },
        { id: 'SUPPORT', label: '輔助', icon: '🛡️' },
        { id: 'GATHER', label: '採集', icon: '🌱' },
        { id: 'CRAFT', label: '製作', icon: '🧪' }
    ];

    const filteredSkills = selectedCategory === 'ALL'
        ? skills
        : skills.filter(s => s.category === selectedCategory);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'COMBAT': return 'text-red-400';
            case 'SUPPORT': return 'text-t5-traceable';
            case 'GATHER': return 'text-t5-tangible';
            case 'CRAFT': return 'text-t5-trackable';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-t5-trackable mb-4 flex items-center">
                <Flame className="w-5 h-5 mr-2" />
                {t('avatar.skills.title')}
            </h3>


            {/* 分類標籤 */}
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            flex items-center px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all
                            ${selectedCategory === cat.id
                                ? 'bg-aqua-500/20 border border-aqua-500/50 text-brand-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                                : 'bg-white/10 text-slate-400 hover:bg-white/20'}
                        `}
                    >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* 技能列表 */}
            <div className="space-y-3">
                {filteredSkills.map(skill => (
                    <motion.div
                        key={skill.id}
                        className={`
                            p-3 rounded-lg border
                            ${skill.unlocked
                                ? 'bg-white/10 border-white/20'
                                : 'bg-black/40 border-white/5 opacity-50'}
                        `}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-start">
                            <span className="text-2xl mr-3">{skill.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`font-medium ${getRarityColor(skill.category)}`}>
                                        {skill.name}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Lv.{skill.level}/{skill.maxLevel}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{skill.description}</p>

                                {/* 等級進度 */}
                                <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-brand-primary to-t5-trackable"
                                        animate={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// 🎒 裝備組件
// ============================================================================

const EquipmentPanel = ({ slots }: { slots: EquipmentSlot[] }) => {
    const { t } = useLanguage();
    const getRarityBorder = (rarity?: string) => {

        switch (rarity) {
            case 'LEGENDARY': return 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
            case 'EPIC': return 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
            case 'RARE': return 'border-blue-500';
            default: return 'border-slate-600';
        }
    };

    const getRarityText = (rarity?: string) => {
        switch (rarity) {
            case 'LEGENDARY': return 'text-amber-400';
            case 'EPIC': return 'text-purple-400';
            case 'RARE': return 'text-blue-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                {t('avatar.equipment.title')}
            </h3>


            <div className="grid grid-cols-5 gap-3">
                {slots.map(slot => (
                    <motion.div
                        key={slot.id}
                        className={`
                            aspect-square rounded-xl border-2 p-2 flex flex-col items-center justify-center
                            ${slot.item
                                ? `bg-gradient-to-br from-slate-800 to-slate-900 ${getRarityBorder(slot.item.rarity)}`
                                : 'bg-black/40 border-white/10 border-dashed'}
                        `}
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="text-2xl mb-1">{slot.icon}</span>
                        {slot.item ? (
                            <>
                                <span className="text-xs">{slot.item.name}</span>
                                <span className={`text-[10px] ${getRarityText(slot.item.rarity)}`}>
                                    {slot.item.rarity}
                                </span>
                            </>
                        ) : (
                            <span className="text-[10px] text-slate-600">{slot.name}</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* 套裝效果提示 */}
            <div className="mt-4 p-3 bg-gradient-to-r from-amber-900/30 to-purple-900/30 rounded-lg border border-amber-500/20">
                <div className="flex items-center text-sm">
                    <Target className="w-4 h-4 text-amber-400 mr-2" />
                    <span className="text-amber-200">套裝效果：</span>
                    <span className="text-slate-300 ml-2">真理套裝 (2/3) - 智慧 +10</span>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// 🏆 成就組件
// ============================================================================

const AchievementsPanel = ({ achievements }: { achievements: Achievement[] }) => {
    const { t } = useLanguage();
    const completedCount = achievements.filter(a => a.completed).length;


    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-yellow-400 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    {t('avatar.achievements.title')}
                </h3>

                <span className="text-sm text-slate-400">
                    {completedCount}/{achievements.length} 已完成
                </span>
            </div>

            <div className="space-y-3">
                {achievements.map(achievement => (
                    <motion.div
                        key={achievement.id}
                        className={`
                            p-3 rounded-lg border
                            ${achievement.completed
                                ? 'bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-yellow-500/30'
                                : 'bg-white/5 border-white/10'}
                        `}
                        whileHover={{ x: 5 }}
                    >
                        <div className="flex items-start">
                            <span className="text-2xl mr-3">{achievement.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`font-medium ${achievement.completed ? 'text-yellow-400' : 'text-slate-200'}`}>
                                        {achievement.name}
                                    </span>
                                    {achievement.completed && (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>

                                {/* 進度條 */}
                                {!achievement.completed && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                            <span>進度</span>
                                            <span>{achievement.progress}/{achievement.target}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-brand-primary"
                                                animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 完成時間 */}
                                {achievement.completed && achievement.completedAt && (
                                    <span className="text-[10px] text-slate-500">
                                        完成於：{achievement.completedAt.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// 🎖️ 徽章組件
// ============================================================================

const BadgesPanel = ({ badges }: { badges: Badge[] }) => {
    const { t } = useLanguage();
    const earnedBadges = badges.filter(b => b.earned);


    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                {t('avatar.badges.title')}
                <span className="ml-2 text-sm text-slate-400">({earnedBadges.length}/{badges.length})</span>
            </h3>


            <div className="grid grid-cols-5 gap-3">
                {badges.map(badge => (
                    <motion.div
                        key={badge.id}
                        className={`
                            aspect-square rounded-xl border flex items-center justify-center
                            ${badge.earned
                                ? `bg-gradient-to-br from-slate-800 to-slate-900 border-${badge.rarity === 'LEGENDARY' ? 't5-transparent' : badge.rarity === 'EPIC' ? 't5-trackable' : 't5-traceable'}/50 shadow-[0_0_15px_rgba(0,255,255,0.15)]`
                                : 'bg-black/40 border-white/10'}
                        `}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        title={badge.earned ? badge.name : '未獲得'}
                    >
                        <span className={`text-3xl ${!badge.earned && 'grayscale opacity-30'}`}>
                            {badge.icon}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* 稀有度說明 */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <span className="text-amber-400">🦁 傳說</span>
                <span className="text-purple-400">💜 史詩</span>
                <span className="text-blue-400">💎 稀有</span>
                <span className="text-slate-400">⚪ 普通</span>
            </div>
        </div>
    );
};

// ============================================================================
// 📈 成長軌跡組件
// ============================================================================

const GrowthPanel = ({ records }: { records: GrowthRecord[] }) => {
    const { t } = useLanguage();
    return (

        <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                {t('avatar.growth.title')}
            </h3>


            <div className="space-y-2">
                {records.slice(0, 7).map((record, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-aqua-600 flex items-center justify-center mr-3 shadow-lg">
                                <Map className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-200">{record.action}</div>
                                <div className="text-[10px] text-slate-500">
                                    {record.date.toLocaleDateString()} · {record.zone}
                                </div>
                            </div>
                        </div>
                        <span className="text-sm text-brand-primary">+{record.xp} XP</span>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-slate-400 flex items-center justify-center transition-colors">
                查看更多 <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
};

// ============================================================================
// 🎮 主頁面組件
// ============================================================================

const AvatarCenter = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'equipment' | 'achievements' | 'badges'>('stats');

    const [stats] = useState<AvatarStats>(INITIAL_STATS);
    const [skills] = useState<Skill[]>(SKILLS_DATA);
    const [slots] = useState<EquipmentSlot[]>(EQUIPMENT_SLOTS);
    const [achievements] = useState<Achievement[]>(ACHIEVEMENTS_DATA);
    const [badges] = useState<Badge[]>(BADGES_DATA);

    // 模擬成長記錄
    const [growthRecords] = useState<GrowthRecord[]>([
        { date: new Date(), action: '完成碳足跡計算任務', xp: 150, zone: 'GUILD' },
        { date: new Date(Date.now() - 86400000), action: '獲得「範疇二」卡牌', xp: 200, zone: 'WILD' },
        { date: new Date(Date.now() - 172800000), action: '挑戰輪迴塔第 5 層', xp: 100, zone: 'TOWER' },
        { date: new Date(Date.now() - 259200000), action: '與 Dr. Thoth 對話', xp: 50, zone: 'VILLAGE' },
    ]);

    const tabs = [
        { id: 'stats', label: t('avatar.tabs.stats'), icon: <User className="w-5 h-5" /> },
        { id: 'skills', label: t('avatar.tabs.skills'), icon: <Flame className="w-5 h-5" /> },
        { id: 'equipment', label: t('avatar.tabs.equipment'), icon: <Shield className="w-5 h-5" /> },
        { id: 'achievements', label: t('avatar.tabs.achievements'), icon: <Trophy className="w-5 h-5" /> },
        { id: 'badges', label: t('avatar.tabs.badges'), icon: <Star className="w-5 h-5" /> }
    ];


    return (
        <div className="fixed inset-0 bg-[#0a0f14] text-slate-200 font-sans overflow-hidden">
            {/* 標題欄 */}
            <header className="h-14 border-b border-white/10 bg-[#0a0f14]/80 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center space-x-4">
                    <h1 className="text-lg font-bold tracking-wider text-brand-primary">
                        🎮 {t('avatar.title')}
                    </h1>

                    <div className="flex items-center px-3 py-1 bg-gradient-to-r from-brand-primary/20 to-aqua-500/20 border border-brand-primary/30 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                        <span className="text-sm text-brand-primary">Lv.{stats.level}</span>
                        <span className="mx-2 text-slate-600">|</span>
                        <User className="w-4 h-4 text-brand-primary mr-1" />
                        <span className="text-sm text-brand-primary">ESG 永續英雄</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </header>

            {/* 主內容區域 */}
            <div className="flex h-[calc(100vh-3.5rem)]">
                {/* 左側標籤導航 */}
                <nav className="w-20 bg-[#05080a] border-r border-white/5 flex flex-col items-center py-6 space-y-4 shrink-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                w-14 h-14 rounded-xl flex items-center justify-center transition-all
                                ${activeTab === tab.id
                                    ? 'bg-gradient-to-br from-brand-primary/20 to-aqua-500/20 border border-brand-primary/50 text-brand-primary shadow-[0_0_15px_rgba(0,255,255,0.25)]'
                                    : 'bg-transparent text-slate-500 hover:bg-white/10'}
                            `}
                        >
                            {tab.icon}
                            <span className="text-[10px] mt-1">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* 右側內容區域 */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'stats' && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-2 gap-6"
                            >
                                <StatsPanel stats={stats} />
                                <GrowthPanel records={growthRecords} />
                            </motion.div>
                        )}

                        {activeTab === 'skills' && (
                            <motion.div
                                key="skills"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <SkillsPanel skills={skills} />
                            </motion.div>
                        )}

                        {activeTab === 'equipment' && (
                            <motion.div
                                key="equipment"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-2 gap-6"
                            >
                                <EquipmentPanel slots={slots} />
                                <EquipmentPanel slots={slots} /> {/* 預留第二區塊 */}
                            </motion.div>
                        )}

                        {activeTab === 'achievements' && (
                            <motion.div
                                key="achievements"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AchievementsPanel achievements={achievements} />
                            </motion.div>
                        )}

                        {activeTab === 'badges' && (
                            <motion.div
                                key="badges"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <BadgesPanel badges={badges} />
                                    <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-cyan-400 mb-4">
                                            徽章效果
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-lg border border-amber-500/30">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-xl mr-2">🌱</span>
                                                    <span className="font-medium text-amber-200">ESG 新手</span>
                                                </div>
                                                <p className="text-xs text-slate-400">所有 ESG 任務經驗 +5%</p>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg border border-blue-500/30">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-xl mr-2">📊</span>
                                                    <span className="font-medium text-blue-200">碳足跡專家</span>
                                                </div>
                                                <p className="text-xs text-slate-400">碳足跡計算技能等級 +1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AvatarCenter;
