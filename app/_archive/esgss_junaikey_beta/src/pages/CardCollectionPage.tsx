import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Search,
    Filter,
    ArrowLeft,
    Zap,
    ShieldCheck,
    Brain,
    Heart,
    Sparkles,
    Info,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { View, ImpactNexusCard, MeridianFlow } from '@/types/core';

// Mock Data for ESG Cards
const MOCK_CARDS: ImpactNexusCard[] = [
    {
        id: 'card-001',
        name: '碳盤查之眼',
        company: 'SHAN_WEI',
        rarity: 'SOVEREIGN',
        meridian: 'INWARD_REN',
        stats: { ATK: 85, DEF: 92, MP: 78, HP: 88 },
        virtues: { intelligence: 9, benevolence: 8, integrity: 10, courage: 8, temperance: 9, harmony: 8 },
        ability: {
            name: '精準溯源',
            description: '立即揭示 Scope 1-3 的隱藏排放數據庫。',
            mp_cost: 25
        },
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
        ability: {
            name: '資本屏障',
            description: '在下一輪中降低 50% 的財務風險衝擊。',
            mp_cost: 30
        },
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
        ability: {
            name: '共融共鳴',
            description: '根據團隊的多樣性指標增加攻擊力。',
            mp_cost: 20
        },
        knowledge_points: ['SROI', 'DEI 策略']
    }
];

const CardCollectionPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

    const filteredCards = MOCK_CARDS.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.knowledge_points.some(kp => kp.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRarity = !selectedRarity || card.rarity === selectedRarity;
        return matchesSearch && matchesRarity;
    });

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-[#63a6b0]/30 overflow-x-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#63a6b0]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ffd700]/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#63a6b0]/50 hover:bg-[#63a6b0]/10 transition-all text-slate-400 hover:text-[#63a6b0] group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-200 to-[#63a6b0] bg-clip-text text-transparent tracking-tight">
                                卡牌收藏 <span className="text-[#63a6b0]/60">CARD COLLECTION</span>
                            </h1>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                                知識即資產，透過 ESG 實踐鍛造您的數位戰力
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#63a6b0] transition-colors" />
                            <input
                                type="text"
                                placeholder="搜尋卡牌或知識點..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-4 py-3 w-64 md:w-80 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:border-[#63a6b0]/50 focus:ring-4 focus:ring-[#63a6b0]/10 transition-all text-sm font-medium placeholder:text-slate-600"
                            />
                        </div>
                        <button className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#63a6b0]/50 hover:bg-[#63a6b0]/10 transition-all text-slate-400">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Stats Summary Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: '總卡牌數', value: MOCK_CARDS.length, icon: Database, color: '#63a6b0' },
                        { label: 'SOVEREIGN級', value: MOCK_CARDS.filter(c => c.rarity === 'SOVEREIGN').length, icon: Sparkles, color: '#ffd700' },
                        { label: '已解鎖知識點', value: 12, icon: Brain, color: '#a855f7' },
                        { label: '當前勝率', value: '68%', icon: Zap, color: '#f59e0b' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 p-4 rounded-3xl flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-slate-800/50" style={{ color: stat.color }}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-black text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredCards.map((card) => (
                            <motion.div
                                key={card.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative"
                            >
                                {/* Card Container */}
                                <div className="relative aspect-[3/4] rounded-[2.5rem] bg-slate-900/40 backdrop-blur-3xl border border-slate-800/80 overflow-hidden transition-all duration-500 group-hover:border-[#63a6b0]/40 group-hover:shadow-[0_0_40px_rgba(99,166,176,0.15)] group-hover:-translate-y-2">

                                    {/* Card Rarity Glow */}
                                    <div className={`absolute -top-24 -left-24 w-48 h-48 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40 ${card.rarity === 'SOVEREIGN' ? 'bg-[#ffd700]' :
                                            card.rarity === 'PLATINUM' ? 'bg-cyan-400' : 'bg-[#63a6b0]'
                                        }`} />

                                    {/* Top Bar */}
                                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-slate-950/50 border border-slate-800 ${card.rarity === 'SOVEREIGN' ? 'text-[#ffd700] border-[#ffd700]/30' :
                                                card.rarity === 'PLATINUM' ? 'text-cyan-300 border-cyan-300/30' : 'text-[#63a6b0] border-[#63a6b0]/30'
                                            }`}>
                                            {card.rarity}
                                        </span>
                                        <div className="flex gap-1.5 font-mono text-[10px] text-slate-500 font-bold bg-slate-950/30 px-2 py-1 rounded-lg">
                                            {card.meridian}
                                        </div>
                                    </div>

                                    {/* Illustration Placeholder (Premium Glassmorphism Effect) */}
                                    <div className="absolute top-0 inset-x-0 h-1/2 flex items-center justify-center p-12">
                                        <div className="w-full h-full relative group/icon">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#63a6b0]/20 to-transparent blur-2xl group-hover/icon:blur-3xl transition-all" />
                                            <div className="relative h-full w-full rounded-full border border-white/5 bg-white/5 flex items-center justify-center backdrop-blur-md">
                                                <Sparkles className={`w-12 h-12 ${card.rarity === 'SOVEREIGN' ? 'text-[#ffd700]' : 'text-[#63a6b0]'
                                                    }`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="absolute bottom-0 inset-x-0 p-8 pt-0">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#63a6b0] transition-colors">{card.name}</h3>
                                            <div className="flex gap-2 flex-wrap">
                                                {card.knowledge_points.map(kp => (
                                                    <span key={kp} className="text-[9px] font-bold text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded-md border border-slate-800/50 italic">#{kp}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="flex items-center gap-2 group/stat">
                                                <Zap className="w-3.5 h-3.5 text-orange-400" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-[8px] font-bold text-slate-500">ATK</span>
                                                        <span className="text-[10px] font-black text-white">{card.stats.ATK}</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-orange-400 group-hover/stat:bg-orange-300 transition-colors" style={{ width: `${card.stats.ATK}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 group/stat">
                                                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-[8px] font-bold text-slate-500">DEF</span>
                                                        <span className="text-[10px] font-black text-white">{card.stats.DEF}</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-400 group-hover/stat:bg-blue-300 transition-colors" style={{ width: `${card.stats.DEF}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 group/stat">
                                                <Brain className="w-3.5 h-3.5 text-purple-400" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-[8px] font-bold text-slate-500">MP</span>
                                                        <span className="text-[10px] font-black text-white">{card.stats.MP}</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-400 group-hover/stat:bg-purple-300 transition-colors" style={{ width: `${card.stats.MP}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 group/stat">
                                                <Heart className="w-3.5 h-3.5 text-rose-400" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-[8px] font-bold text-slate-500">HP</span>
                                                        <span className="text-[10px] font-black text-white">{card.stats.HP}</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-rose-400 group-hover/stat:bg-rose-300 transition-colors" style={{ width: `${card.stats.HP}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ability Section */}
                                        <div className="p-4 rounded-2xl bg-[#63a6b0]/5 border border-[#63a6b0]/10">
                                            <div className="flex items-center justify-between mb-1 text-[#63a6b0]">
                                                <span className="text-[10px] font-black uppercase tracking-widest">{card.ability.name}</span>
                                                <span className="text-[10px] font-bold">-{card.ability.mp_cost} MP</span>
                                            </div>
                                            <p className="text-[9px] leading-relaxed text-slate-400 font-medium italic">"{card.ability.description}"</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Global Footer (Natural Resonance) */}
                <footer className="mt-20 pt-10 border-t border-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                        <Sparkles className="w-3 h-3" />
                        道法自然 系統毅然 上善若水 善向永續
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>Omni-Genesis Engine</span>
                        <span>v8.2.1-Sentient</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CardCollectionPage;
