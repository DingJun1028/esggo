import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import {
    User, Star, Award, CheckCircle, Zap, TrendingUp, BookOpen,
    Target, Crown, Sparkles, Shield, Trophy, GraduationCap, Code, Database, Globe, Users
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface SkillNode {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
    category: 'technical' | 'leadership' | 'compliance' | 'innovation';
    prerequisites: string[];
    xpRequired: number;
    description: string;
}

const SKILL_TREE: SkillNode[] = [
    {
        id: 'esg-basics',
        name: 'ESG基礎知識',
        level: 3,
        maxLevel: 5,
        category: 'compliance',
        prerequisites: [],
        xpRequired: 500,
        description: '掌握ESG三大支柱的基本概念和框架'
    },
    {
        id: 'sustainability-reporting',
        name: '永續報告撰寫',
        level: 2,
        maxLevel: 5,
        category: 'compliance',
        prerequisites: ['esg-basics'],
        xpRequired: 800,
        description: '學習GRI、SASB等標準的報告撰寫技巧'
    },
    {
        id: 'carbon-footprint-analysis',
        name: '碳足跡分析',
        level: 4,
        maxLevel: 5,
        category: 'technical',
        prerequisites: ['esg-basics'],
        xpRequired: 1200,
        description: '掌握Scope 1、2、3排放計算方法'
    },
    {
        id: 'stakeholder-engagement',
        name: '利害關係人管理',
        level: 1,
        maxLevel: 5,
        category: 'leadership',
        prerequisites: ['esg-basics'],
        xpRequired: 600,
        description: '學習有效的利害關係人溝通策略'
    },
    {
        id: 'regulatory-compliance',
        name: '法規合規管理',
        level: 3,
        maxLevel: 5,
        category: 'compliance',
        prerequisites: ['sustainability-reporting'],
        xpRequired: 1000,
        description: '熟悉各國ESG相關法規和合規要求'
    },
    {
        id: 'data-analytics',
        name: '數據分析技能',
        level: 2,
        maxLevel: 5,
        category: 'technical',
        prerequisites: ['carbon-footprint-analysis'],
        xpRequired: 900,
        description: '使用數據分析工具進行ESG績效評估'
    },
    {
        id: 'sustainable-innovation',
        name: '永續創新思維',
        level: 1,
        maxLevel: 5,
        category: 'innovation',
        prerequisites: ['stakeholder-engagement', 'data-analytics'],
        xpRequired: 1500,
        description: '培養將永續概念融入商業創新的能力'
    },
    {
        id: 'executive-leadership',
        name: 'ESG執行領導力',
        level: 0,
        maxLevel: 5,
        category: 'leadership',
        prerequisites: ['sustainable-innovation', 'regulatory-compliance'],
        xpRequired: 2000,
        description: '領導組織實現全面ESG轉型的頂級技能'
    }
];

export const TalentPassport: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { userName, vocation, level, xp, awardXp, addAuditLog } = useCompany();

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

    const categories = [
        { id: 'all', name: isZh ? '全部' : 'All', icon: Star, color: 'text-white' },
        { id: 'technical', name: isZh ? '技術技能' : 'Technical', icon: Code, color: 'text-blue-400' },
        { id: 'leadership', name: isZh ? '領導力' : 'Leadership', icon: Crown, color: 'text-purple-400' },
        { id: 'compliance', name: isZh ? '合規' : 'Compliance', icon: Shield, color: 'text-green-400' },
        { id: 'innovation', name: isZh ? '創新' : 'Innovation', icon: Sparkles, color: 'text-gold-400' }
    ];

    const filteredSkills = useMemo(() => {
        if (selectedCategory === 'all') return SKILL_TREE;
        return SKILL_TREE.filter(skill => skill.category === selectedCategory);
    }, [selectedCategory]);

    const getSkillIcon = (category: string) => {
        switch (category) {
            case 'technical': return <Code className="w-4 h-4" />;
            case 'leadership': return <Crown className="w-4 h-4" />;
            case 'compliance': return <Shield className="w-4 h-4" />;
            case 'innovation': return <Sparkles className="w-4 h-4" />;
            default: return <Star className="w-4 h-4" />;
        }
    };

    const getSkillColor = (category: string) => {
        switch (category) {
            case 'technical': return 'from-blue-500 to-blue-300';
            case 'leadership': return 'from-purple-500 to-purple-300';
            case 'compliance': return 'from-green-500 to-green-300';
            case 'innovation': return 'from-amber-500 to-amber-300';
            default: return 'from-gray-500 to-gray-300';
        }
    };

    const canUpgradeSkill = (skill: SkillNode) => {
        if (skill.level >= skill.maxLevel) return false;
        const prerequisitesMet = skill.prerequisites.every(prereq =>
            SKILL_TREE.find(s => s.id === prereq)?.level >= 2
        );
        return prerequisitesMet && xp >= skill.xpRequired;
    };

    const upgradeSkill = (skill: SkillNode) => {
        if (!canUpgradeSkill(skill)) return;

        // Simulate skill upgrade
        const updatedSkill = { ...skill, level: skill.level + 1 };
        // In a real app, this would update the skill tree
        awardXp(-skill.xpRequired);
        addAuditLog(`技能升級: ${skill.name}`, `從等級 ${skill.level} 升級到 ${skill.level + 1}`);
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={User}
                    title={{ zh: '人才護照 (Talent Passport)', en: 'Talent Passport' }}
                    description={{ zh: 'ESG技能星系與區塊鏈認證證書', en: 'ESG Skill Galaxy & Blockchain Certificates.' }}
                    language={language}
                    tag={{ zh: '技能鍛造 v2.1', en: 'SKILL_FORGE_v2.1' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 個人檔案與總體統計 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    {/* 個人檔案卡片 */}
                    <div className="glass-bento p-4 bg-slate-900/40 border-white/5 rounded-[2rem] text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{userName}</h3>
                        <div className="text-sm text-gray-400 mb-2">{vocation.type} Lv.{level}</div>

                        {/* XP 進度條 */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>XP</span>
                                <span>{xp}/{vocation.nextLevelExp}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(xp / vocation.nextLevelExp) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 統計卡片 */}
                    <div className="glass-bento p-4 bg-slate-900/60 border-white/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            {isZh ? '成就統計' : 'Achievement Stats'}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-emerald-400">{SKILL_TREE.filter(s => s.level > 0).length}</div>
                                <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '已解鎖技能' : 'Skills'}</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-blue-400">{Math.round(SKILL_TREE.reduce((acc, s) => acc + (s.level / s.maxLevel), 0) / SKILL_TREE.length * 100)}%</div>
                                <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '整體熟練度' : 'Mastery'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 技能星系圖 (6/12) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 flex flex-col bg-slate-950 border-white/10 min-h-0 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Skill_Galaxy_Map</h3>

                            {/* 類別篩選器 */}
                            <div className="flex gap-2">
                                {categories.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-3 py-1.5 rounded-xl text-[8px] font-bold uppercase transition-all flex items-center gap-1 ${
                                                selectedCategory === cat.id
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                        >
                                            <Icon className="w-3 h-3" />
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredSkills.map(skill => {
                                    const canUpgrade = canUpgradeSkill(skill);
                                    const isMaxed = skill.level >= skill.maxLevel;
                                    const progressPercent = (skill.level / skill.maxLevel) * 100;

                                    return (
                                        <div
                                            key={skill.id}
                                            className={`glass-bento p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer group ${
                                                selectedSkill?.id === skill.id
                                                    ? 'border-white/30 bg-white/5'
                                                    : 'border-white/10 bg-slate-900/40'
                                            }`}
                                            onClick={() => setSelectedSkill(skill)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2 rounded-xl bg-gradient-to-br ${getSkillColor(skill.category)}`}>
                                                    {getSkillIcon(skill.category)}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-white">{skill.level}/{skill.maxLevel}</div>
                                                    <div className="text-[8px] text-gray-500 uppercase font-black">{isZh ? '等級' : 'Level'}</div>
                                                </div>
                                            </div>

                                            <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">{skill.name}</h4>
                                            <p className="text-[10px] text-gray-400 mb-3 line-clamp-2">{skill.description}</p>

                                            {/* 進度條 */}
                                            <div className="space-y-1 mb-3">
                                                <div className="flex justify-between text-[8px] text-gray-500">
                                                    <span>{isZh ? '熟練度' : 'Mastery'}</span>
                                                    <span>{Math.round(progressPercent)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-800 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full bg-gradient-to-r ${getSkillColor(skill.category)} transition-all duration-500`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {canUpgrade && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        upgradeSkill(skill);
                                                    }}
                                                    className="w-full py-2 bg-emerald-500 text-black font-bold text-[10px] uppercase rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Zap className="w-3 h-3" />
                                                    {isZh ? `升級 (-${skill.xpRequired} XP)` : `UPGRADE (-${skill.xpRequired} XP)`}
                                                </button>
                                            )}

                                            {isMaxed && (
                                                <div className="w-full py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase rounded-xl flex items-center justify-center gap-2">
                                                    <Award className="w-3 h-3" />
                                                    {isZh ? '已精通' : 'Mastered'}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. 技能詳情與認證 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    {selectedSkill ? (
                        <div className="flex-1 glass-bento p-4 flex flex-col bg-slate-900/60 border-white/10 min-h-0 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${getSkillColor(selectedSkill.category)}`}>
                                    {getSkillIcon(selectedSkill.category)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{selectedSkill.name}</h4>
                                    <div className="text-[10px] text-gray-500 uppercase font-black">{selectedSkill.category}</div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '技能描述' : 'Description'}</div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">{selectedSkill.description}</p>
                                </div>

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '先修條件' : 'Prerequisites'}</div>
                                    <div className="space-y-1">
                                        {selectedSkill.prerequisites.length > 0 ? (
                                            selectedSkill.prerequisites.map(prereq => {
                                                const prereqSkill = SKILL_TREE.find(s => s.id === prereq);
                                                return (
                                                    <div key={prereq} className="flex items-center gap-2 text-[10px] text-gray-400">
                                                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                        {prereqSkill?.name}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-[10px] text-gray-500">{isZh ? '無' : 'None'}</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase font-black mb-2">{isZh ? '升級需求' : 'Upgrade Cost'}</div>
                                    <div className="text-sm font-mono text-white">{selectedSkill.xpRequired} XP</div>
                                </div>
                            </div>

                            {/* 區塊鏈認證徽章 */}
                            <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="w-4 h-4 text-purple-400" />
                                    <div className="text-[10px] font-bold text-purple-400 uppercase">{isZh ? '區塊鏈認證' : 'Blockchain Verified'}</div>
                                </div>
                                <div className="text-[8px] text-gray-400 font-mono break-all">
                                    0x{selectedSkill.id.slice(0, 8).toUpperCase()}...{selectedSkill.id.slice(-4).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 glass-bento p-4 flex flex-col items-center justify-center bg-slate-900/40 border-white/5 min-h-0 rounded-[2rem] text-center">
                            <GraduationCap className="w-12 h-12 text-gray-600 mb-4" />
                            <div className="text-sm text-gray-500">{isZh ? '選擇一個技能查看詳情' : 'Select a skill to view details'}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};