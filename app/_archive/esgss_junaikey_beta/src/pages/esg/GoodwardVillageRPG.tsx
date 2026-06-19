import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Zap,
    ShieldCheck,
    Home,
    Hammer,
    Package,
    Lock,
    Cpu,
    Boxes,
    Sword,
    ScrollText,
    Dna,
    Mountain,
    Waves,
    Users,
    Sparkles,
    ChevronRight,
    Search,
    Activity
} from 'lucide-react';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';

const GoodwardVillageRPG: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [activeTab, setActiveTab] = useState<'VILLAGE' | 'CARDS' | 'QUESTS'>('VILLAGE');

    // Mock Game Data
    const [gameState, setGameState] = useState({
        village: {
            level: 5,
            name: '涅槃之村',
            stats: { environment: 780, social: 650, governance: 920 },
            buildings: [
                { id: 1, name: '太陽能發電站', type: 'Eco', lvl: 3, icon: <Mountain /> },
                { id: 2, name: '職能培訓中心', type: 'Social', lvl: 2, icon: <Users /> },
                { id: 3, name: '誠信議事廳', type: 'Gov', lvl: 1, icon: <ShieldCheck /> },
            ]
        },
        cards: [
            { id: 'c1', name: '再生能源結晶', rarity: 'Epic', power: 85, attr: 'Temperance' },
            { id: 'c2', name: '多元包容之盾', rarity: 'Rare', power: 60, attr: 'Benevolence' },
        ],
        quests: [
            { id: 'q1', title: '綠色冷鏈改造', reward: 'XP +500, Eco Card x1', status: 'Active' },
            { id: 'q2', title: '社區共榮日', reward: 'XP +300, Social Card x1', status: 'Available' },
        ]
    });

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenRPGOnboarding');
        if (!hasSeen) setShowOnboarding(true);
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenRPGOnboarding', 'true');
        setShowOnboarding(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 pt-24 font-sans selection:bg-[#63a6b0]/30 relative overflow-hidden">
            {/* Background FX - Game World Aura */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[70%] h-[70%] bg-[#63a6b0]/5 rounded-full blur-[180px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-emerald-500/3 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-wrap items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4"
                        >
                            善向紀元：永續村成長之旅
                        </motion.div>
                        <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none">
                            永續村 <br />
                            <span className="text-emerald-500">Goodward RPG</span>
                        </h1>
                    </div>

                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5">
                        {['VILLAGE', 'CARDS', 'QUESTS'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Game Content Area */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'VILLAGE' && (
                                <motion.div
                                    key="village"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 h-[600px] relative overflow-hidden group"
                                >
                                    <div className="absolute top-10 left-10 z-10">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/80">{gameState.village.name}</h3>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">村莊等級 Level {gameState.village.level}</p>
                                    </div>

                                    {/* Mock Isometric View */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <div className="size-[800px] border border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
                                            <div className="size-[600px] border border-white/5 rounded-full" />
                                            <div className="size-[400px] border border-white/5 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 left-10 right-10 flex gap-6 z-10">
                                        {gameState.village.buildings.map((b) => (
                                            <div key={b.id} className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
                                                <h4 className="text-[11px] font-black uppercase tracking-tight">{b.name}</h4>
                                                <p className="text-[9px] font-black text-white/20 uppercase mt-1">Lvl. {b.lvl}</p>
                                            </div>
                                        ))}
                                        <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                                            <Hammer className="text-white/20" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'CARDS' && (
                                <motion.div
                                    key="cards"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-2 md:grid-cols-3 gap-6"
                                >
                                    {gameState.cards.map((c) => (
                                        <div key={c.id} className="aspect-[3/4.5] bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 relative group overflow-hidden cursor-pointer hover:border-emerald-500/40 transition-all">
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-6">
                                                    <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded italic text-emerald-500 uppercase">{c.rarity}</span>
                                                    <span className="text-xl font-black italic text-white/20">#{c.power}</span>
                                                </div>
                                                <div className="size-20 bg-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                                    <Dna className="w-10 h-10 text-emerald-500/80" />
                                                </div>
                                                <h4 className="text-sm font-black text-center uppercase tracking-tight">{c.name}</h4>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="aspect-[3/4.5] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all cursor-pointer">
                                        <Sparkles className="text-emerald-500/40" />
                                        <p className="text-[10px] font-black uppercase text-white/20">合成新卡牌 Synthesize</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Stats & Mini-Games */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2 italic">
                                <Activity className="w-4 h-4" /> 村莊指標 Metrics
                            </h3>
                            <div className="space-y-6">
                                {Object.entries(gameState.village.stats).map(([label, val], i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black uppercase text-white/50">{label}</span>
                                            <span className="text-[10px] font-black text-emerald-500 italic">{val}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500/60" style={{ width: `${(val / 1000) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2 italic">
                                <ScrollText className="w-4 h-4 text-emerald-500" /> 特派任務 Quests
                            </h3>
                            <div className="space-y-4">
                                {gameState.quests.map((q) => (
                                    <div key={q.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-emerald-500/5 transition-all cursor-pointer">
                                        <h4 className="text-[11px] font-bold text-white/80">{q.title}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[9px] font-black text-emerald-500/60 uppercase">{q.reward}</span>
                                            <ChevronRight className="w-3 h-3 text-white/20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboarding Overlay */}
            <ServiceOnboardingOverlay
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
                serviceName="善向永續村 RPG"
                serviceDesc="這不只是遊戲，這是您主權資產的視覺化戰場。"
                steps={[
                    { title: '建設村莊 Build', description: '透過 ESG 實踐獲得資源，升級建築以解鎖系統 Buff。', icon: <Home /> },
                    { title: '卡牌養成 Cards', description: '將 5T 數據結晶化為卡牌，收集並合成最強大的知識資產。', icon: <Dna /> },
                    { title: '完成任務 Quests', description: '與平台活動同步，完成任務以獲得 XP、金幣與特殊獎勵。', icon: <ScrollText /> },
                    { title: '進化涅槃 Evolution', description: '帶領村莊走向零碳未來，成為全球永續生態圈的領導節點。', icon: <Sparkles /> }
                ]}
            />
        </div>
    );
};

export default GoodwardVillageRPG;
