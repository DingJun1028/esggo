import React, { useState, useMemo } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Brain,
    Heart,
    Sparkles,
    ArrowLeft,
    Plus,
    X,
    Save,
    Info,
    Sword,
    ChevronRight,
    TrendingUp,
    LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from 'recharts';
import { View, ImpactNexusCard, MeridianFlow, IMeritProfile10 } from '@/types/core';

// Mock Data for available cards (extending the list)
const MOCK_INVENTORY: ImpactNexusCard[] = [
    {
        id: 'card-001',
        name: '碳盤查之眼',
        company: 'SHAN_WEI',
        rarity: 'SOVEREIGN',
        meridian: 'INWARD_REN',
        stats: { ATK: 85, DEF: 92, MP: 78, HP: 88 },
        virtues: { intelligence: 9, benevolence: 8, integrity: 10, courage: 8, temperance: 9, harmony: 8 },
        ability: { name: '精準溯源', description: '立即揭示 Scope 1-3 的隱藏排放數據庫。', mp_cost: 25 },
        knowledge_points: ['ISO 14064', 'GHG Protocol']
    },
    {
        id: 'card-002',
        name: '綠色融資盾',
        company: 'WANGDAO',
        rarity: 'PLATINUM',
        meridian: 'OUTWARD_DU',
        stats: { ATK: 45, DEF: 98, MP: 65, HP: 75 },
        virtues: { intelligence: 7, benevolence: 7, integrity: 9, courage: 6, temperance: 8, harmony: 9 },
        ability: { name: '資本屏障', description: '在下一輪中降低 50% 的財務風險衝擊。', mp_cost: 30 },
        knowledge_points: ['綠色債券', '永續連結貸款']
    },
    {
        id: 'card-003',
        name: '社會影響力之刃',
        company: 'STEPS',
        rarity: 'GOLD',
        meridian: 'OUTWARD_DU',
        stats: { ATK: 94, DEF: 40, MP: 82, HP: 60 },
        virtues: { intelligence: 8, benevolence: 10, integrity: 7, courage: 9, temperance: 6, harmony: 7 },
        ability: { name: '共融共鳴', description: '根據團隊的多樣性指標增加攻擊力。', mp_cost: 20 },
        knowledge_points: ['SROI', 'DEI 策略']
    },
    {
        id: 'card-004',
        name: '共融導師聖經',
        company: 'HOLISTIC',
        rarity: 'PLATINUM',
        meridian: 'INWARD_REN',
        stats: { ATK: 30, DEF: 60, MP: 95, HP: 98 },
        virtues: { intelligence: 9, benevolence: 10, integrity: 8, courage: 5, temperance: 9, harmony: 10 },
        ability: { name: '全人治癒', description: '恢復全體隊員 40% 的生命力與士氣。', mp_cost: 40 },
        knowledge_points: ['人才永續', '心理健康']
    },
    {
        id: 'card-005',
        name: '永續供應鏈鏈條',
        company: 'SHAN_WEI',
        rarity: 'GOLD',
        meridian: 'OUTWARD_DU',
        stats: { ATK: 70, DEF: 75, MP: 60, HP: 65 },
        virtues: { intelligence: 7, benevolence: 6, integrity: 8, courage: 7, temperance: 7, harmony: 8 },
        ability: { name: '鏈式封鎖', description: '使敵方下一張卡牌的 ESG 效能減半。', mp_cost: 15 },
        knowledge_points: ['供應鏈管理', '物資溯源']
    }
];

const MAX_DECK_SIZE = 5;

const DeckBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const [deck, setDeck] = useState<ImpactNexusCard[]>([]);

    const handleAddToDeck = (card: ImpactNexusCard) => {
        if (deck.length < MAX_DECK_SIZE && !deck.find(c => c.id === card.id)) {
            setDeck([...deck, card]);
        }
    };

    const handleRemoveFromDeck = (cardId: string) => {
        setDeck(deck.filter(c => c.id !== cardId));
    };

    // Calculate aggregate merit profile for the radar chart
    const radarData = useMemo(() => {
        if (deck.length === 0) {
            return [
                { subject: '智 (Intelligence)', A: 0, fullMark: 10 },
                { subject: '仁 (Benevolence)', A: 0, fullMark: 10 },
                { subject: '誠 (Integrity)', A: 0, fullMark: 10 },
                { subject: '勇 (Courage)', A: 0, fullMark: 10 },
                { subject: '節 (Temperance)', A: 0, fullMark: 10 },
                { subject: '和 (Harmony)', A: 0, fullMark: 10 },
            ];
        }

        const aggregate = deck.reduce((acc, card) => {
            acc.intelligence += card.virtues.intelligence;
            acc.benevolence += card.virtues.benevolence;
            acc.integrity += card.virtues.integrity;
            acc.courage += card.virtues.courage;
            acc.temperance += card.virtues.temperance;
            acc.harmony += card.virtues.harmony;
            return acc;
        }, { intelligence: 0, benevolence: 0, integrity: 0, courage: 0, temperance: 0, harmony: 0 });

        return [
            { subject: '智 (Int)', A: aggregate.intelligence / deck.length, fullMark: 10 },
            { subject: '仁 (Ben)', A: aggregate.benevolence / deck.length, fullMark: 10 },
            { subject: '誠 (Ing)', A: aggregate.integrity / deck.length, fullMark: 10 },
            { subject: '勇 (Cou)', A: aggregate.courage / deck.length, fullMark: 10 },
            { subject: '節 (Tem)', A: aggregate.temperance / deck.length, fullMark: 10 },
            { subject: '和 (Har)', A: aggregate.harmony / deck.length, fullMark: 10 },
        ];
    }, [deck]);

    const teamStats = useMemo(() => {
        return deck.reduce((acc, card) => {
            acc.ATK += card.stats.ATK;
            acc.DEF += card.stats.DEF;
            acc.MP += card.stats.MP;
            acc.HP += card.stats.HP;
            return acc;
        }, { ATK: 0, DEF: 0, MP: 0, HP: 0 });
    }, [deck]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-[#63a6b0]/30 overflow-hidden flex flex-col">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#63a6b0]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ffd700]/5 blur-[120px] rounded-full" />
            </div>

            {/* Top Header */}
            <header className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#63a6b0]/50 hover:bg-[#63a6b0]/10 transition-all text-slate-400"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-white to-[#63a6b0] bg-clip-text text-transparent tracking-tighter">
                            牌組建構 <span className="text-[#63a6b0]/60 ml-2">DECK BUILDER</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                            TEAM ANALYTICS & STRATEGIC ORCHESTRATION
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/game/battle/start', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        battle_type: 'PVE',
                                        difficulty: 'NORMAL',
                                        // deck_id 暫時省略，後端會自動選取 active deck
                                    })
                                });
                                const result = await response.json();
                                if (result.success) {
                                    navigate(`/battle/${result.data.battleId}`);
                                } else {
                                    alert(result.message || '無法開始戰鬥');
                                }
                            } catch (err) {
                                omniLogger.error(LogCategory.SYSTEM, '[DeckBuilderPage] Error', { error: err });
                                alert('網絡錯誤');
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00FFFF] to-blue-600 text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] active:scale-95"
                    >
                        <Sword className="w-5 h-5" />
                        開始挑戰 (AI)
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
                        <Save className="w-5 h-5" />
                        儲存牌組
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left Side: Deck & Analytics */}
                <section className="w-[450px] border-r border-slate-900/50 p-8 flex flex-col gap-8 overflow-y-auto">
                    {/* Deck Slots */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#ffd700]" />
                            當前隊伍 ({deck.length}/{MAX_DECK_SIZE})
                        </h2>
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: MAX_DECK_SIZE }).map((_, i) => {
                                const card = deck[i];
                                return (
                                    <div key={i} className={`aspect-[2/3] rounded-xl border border-dashed flex items-center justify-center relative overflow-hidden transition-all ${card ? 'border-[#63a6b0]/50 bg-[#63a6b0]/5' : 'border-slate-800 bg-slate-900/20'
                                        }`}>
                                        {card ? (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#63a6b0]/20" />
                                                <span className="text-[10px] font-black text-white text-center px-1 z-10">{card.name}</span>
                                                <button
                                                    onClick={() => handleRemoveFromDeck(card.id)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all z-20"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </>
                                        ) : (
                                            <Plus className="w-4 h-4 text-slate-700" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Merit Radar Chart */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400" />
                            六德平衡分析 (MERIT PROFILE)
                        </h2>
                        <div className="h-64 bg-slate-900/30 rounded-3xl border border-slate-800/50 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#1e293b" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                                    <Radar
                                        name="Team Profile"
                                        dataKey="A"
                                        stroke="#63a6b0"
                                        fill="#63a6b0"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Team Stats */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#63a6b0]" />
                            全隊合力數值 (AGGREGATE STATS)
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'ATTACK', value: teamStats.ATK, icon: Zap, color: '#fb923c' },
                                { label: 'DEFENSE', value: teamStats.DEF, icon: ShieldCheck, color: '#60a5fa' },
                                { label: 'ENERGY', value: teamStats.MP, icon: Brain, color: '#c084fc' },
                                { label: 'VITALITY', value: teamStats.HP, icon: Heart, color: '#f43f5e' },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                                        <span className="text-[10px] font-black text-slate-500">{stat.label}</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Right Side: Inventory */}
                <section className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <LayoutGrid className="w-6 h-6 text-[#63a6b0]" />
                            卡牌庫存 <span className="text-slate-500 font-mono text-xs">INVENTORY</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Sort by: Rarity</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_INVENTORY.map((card) => {
                            const isInDeck = deck.find(c => c.id === card.id);
                            return (
                                <motion.div
                                    key={card.id}
                                    whileHover={{ y: -5 }}
                                    className={`relative p-6 rounded-[2rem] bg-slate-900/40 border transition-all ${isInDeck ? 'border-[#63a6b0] shadow-[0_0_20px_rgba(99,166,176,0.1)]' : 'border-slate-800 hover:border-[#63a6b0]/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest bg-slate-950/50 border ${card.rarity === 'SOVEREIGN' ? 'text-[#ffd700] border-[#ffd700]/30' : 'text-cyan-300 border-cyan-300/30'
                                            }`}>
                                            {card.rarity}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500">{card.meridian}</span>
                                    </div>

                                    <h3 className="text-lg font-black text-white mb-2">{card.name}</h3>
                                    <p className="text-[10px] text-slate-400 mb-6 flex-1 line-clamp-2 italic">"{card.ability.description}"</p>

                                    <div className="grid grid-cols-4 gap-2 mb-6">
                                        <div className="text-center">
                                            <p className="text-[8px] font-bold text-slate-600">ATK</p>
                                            <p className="text-xs font-black text-white">{card.stats.ATK}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-bold text-slate-600">DEF</p>
                                            <p className="text-xs font-black text-white">{card.stats.DEF}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-bold text-slate-600">MP</p>
                                            <p className="text-xs font-black text-white">{card.stats.MP}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-bold text-slate-600">HP</p>
                                            <p className="text-xs font-black text-white">{card.stats.HP}</p>
                                        </div>
                                    </div>

                                    <button
                                        disabled={!!isInDeck}
                                        onClick={() => handleAddToDeck(card)}
                                        className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isInDeck ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-[#63a6b0]/10 border border-[#63a6b0]/30 text-[#63a6b0] hover:bg-[#63a6b0] hover:text-slate-950'
                                            }`}
                                    >
                                        {isInDeck ? '已在牌組中' : '加入牌組'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DeckBuilderPage;
