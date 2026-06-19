'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Gamepad2,
    Sparkles,
    Trophy,
    Users,
    Sword,
    Info,
    ArrowRight,
    Activity,
    Lock
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';
import ImpactCard, { VirtueStats } from '@/components/ImpactCard';
import { OmniBase } from '@/core/OmniBase';
import { IOmniAtom, IProtocol5T } from '@/core/omni-types';

// 🎴 Eco-Alliance Core Cards (Mock Data based on v2.1.0 Whitepaper)
const ECO_ALLIANCE_CARDS = [
    {
        id: '001',
        name: 'System Core',
        title: '善向永續',
        description: '萬能元件心核：主打智 (Intelligence) 與誠 (Integrity)。',
        quality: 9,
        protocolStage: 5,
    },
    {
        id: '002',
        name: 'Reliability Guardian',
        title: '山衛科技',
        description: '基於物理應力實測的「可靠度驗證盾」，主打誠 (Integrity) 與勇 (Courage)。',
        quality: 8,
        protocolStage: 4,
    },
    {
        id: '003',
        name: 'Talent Awakening',
        title: '全人測評',
        description: '基於 DEI 與心理安全感的「全人職能導圖」，主打仁 (Benevolence) 與智 (Intelligence)。',
        quality: 7,
        protocolStage: 3,
    },
    {
        id: '004',
        name: 'Wangdao AI',
        title: '王道阿丹',
        description: '反映「利他即利己」的「共榮智核」，主打和 (Harmony) 與智 (Intelligence)。',
        quality: 8,
        protocolStage: 5,
    },
    {
        id: '005',
        name: 'Sustainability Narrative',
        title: '語言步驟',
        description: '將共識轉譯為價值的「敘事導師」，主打仁 (Benevolence) 與和 (Harmony)。',
        quality: 6,
        protocolStage: 2,
    },
];

// 🌪️ Environmental Entropy Cards (Opponents)
const ENTROPY_CARDS = [
    {
        id: 'E-01',
        name: 'Greenwashing Haze',
        title: '漂綠霧霾',
        description: '鎖定所有非「史詩」以上等級卡牌的技能。',
        quality: 4,
        protocolStage: 1,
    },
    {
        id: 'E-02',
        name: 'Climate Storm',
        title: '極端氣候風暴',
        description: '每回合結束時扣除玩家 2 點「仁 (HP)」。',
        quality: 6,
        protocolStage: 2,
    },
];

export default function VillageSquare() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'cards' | 'journey' | 'alliance'>('cards');
    const [isSummoning, setIsSummoning] = useState(false);
    const [summonedCard, setSummonedCard] = useState<any>(null);

    const handleSummon = () => {
        setIsSummoning(true);
        // Simulate a forge/summon sequence
        setTimeout(() => {
            const newCard = cards[Math.floor(Math.random() * cards.length)];
            setSummonedCard(newCard);
            setIsSummoning(false);
        }, 3000);
    };

    // Convert mock data to cards with calculated virtues
    const cards = ECO_ALLIANCE_CARDS.map(c => {
        const atom: Partial<IOmniAtom<any>> = {
            quality: c.quality,
            protocol: {
                traceable: { status: c.protocolStage >= 1 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                trackable: { status: c.protocolStage >= 2 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                transparent: { status: c.protocolStage >= 3 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                tangible: { status: c.protocolStage >= 4 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                trustworthy: { status: c.protocolStage >= 5 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                sustainability: { status: c.protocolStage >= 5 ? 'verified' : 'pending', timestamp: '', evidence: '' },
            }
        };
        const stats = OmniBase.calculateVirtueScore(atom as any) as any as VirtueStats;
        return { ...c, stats };
    });

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua selection:text-black pb-24">
            <PageHeader
                title={t.impact_village.title}
                subtitle={t.impact_village.subtitle}
                category="Impact Village"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* 🏛️ Nexus Branding Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-aqua">
                            <Sparkles size={16} />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
                                {t.impact_village.nexus_status}
                            </span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                            Impact Nexus <span className="text-aqua">真實結晶</span>
                        </h2>
                    </div>

                    {/* NPC Message / Guide */}
                    <div className="max-w-md liquid-glass p-4 border border-aqua/20 rounded-2xl flex gap-4 items-center">
                        <div className="size-12 rounded-full bg-aqua/20 flex items-center justify-center shrink-0">
                            <Users size={24} className="text-aqua" />
                        </div>
                        <div className="text-[10px] leading-relaxed text-gray-400">
                            「數據不再是冰冷的數字，而是可感知的影響力。召喚師，打出您的美德卡牌，擊碎供應鏈中的漂綠霧霾。」 — <span className="text-aqua">JunAiKey Master</span>
                        </div>
                    </div>
                </div>

                {/* 🧭 Tabs / Game Modes */}
                <div className="flex gap-4 mb-12">
                    {[
                        { id: 'cards', label: 'Eco-Alliance Cards', icon: Gamepad2 },
                        { id: 'journey', label: 'Alpha-Omega Journey', icon: Activity },
                        { id: 'alliance', label: 'Truth Quest', icon: Sword }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-full flex items-center gap-3 text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === tab.id
                                ? 'bg-aqua text-black shadow-[0_0_30px_rgba(99,162,176,0.4)]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 🎴 Card Grid Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'cards' && (
                        <motion.div
                            key="cards"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {cards.map((card) => (
                                <ImpactCard key={card.id} {...card} />
                            ))}

                            {/* Entropy Events Header */}
                            <div className="col-span-full mt-12 mb-4">
                                <h3 className="text-xl font-black text-red-500 tracking-tighter uppercase flex items-center gap-2">
                                    <Activity size={20} />
                                    Environmental Entropy <span className="text-white/40 italic">環境熵增</span>
                                </h3>
                            </div>

                            {/* Entropy Cards */}
                            {ENTROPY_CARDS.map(c => {
                                const atom: Partial<IOmniAtom<any>> = {
                                    quality: c.quality,
                                    protocol: {
                                        traceable: { status: c.protocolStage >= 1 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                                        trackable: { status: c.protocolStage >= 2 ? 'verified' : 'pending', timestamp: '', evidence: '' },
                                        transparent: { status: 'pending', timestamp: '', evidence: '' },
                                        tangible: { status: 'pending', timestamp: '', evidence: '' },
                                        trustworthy: { status: 'pending', timestamp: '', evidence: '' },
                                        sustainability: { status: 'pending', timestamp: '', evidence: '' },
                                    }
                                };
                                const stats = OmniBase.calculateVirtueScore(atom as any) as any as VirtueStats;
                                return <ImpactCard key={c.id} {...c} stats={stats} />;
                            })}

                            {/* Summon Card Action */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSummon}
                                className="border-2 border-dashed border-aqua/30 bg-aqua/5 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-aqua hover:bg-aqua/10 transition-all relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-aqua/5 to-transparent z-0" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="size-16 rounded-full bg-aqua/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Sparkles size={32} className="text-aqua" />
                                    </div>
                                    <h4 className="text-sm font-black tracking-widest uppercase text-white">
                                        {t.impact_village.summon}
                                    </h4>
                                    <p className="text-[10px] text-aqua/60 mt-2 font-bold italic">RESONATE WITH TRUTH</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'journey' && (
                        <motion.div
                            key="journey"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { step: '啟蒙期', goal: '感知', color: 'text-blue-400', desc: '透過儀表板與簡報，啟動用戶對永續的 Tangible 連結。' },
                                    { step: '實踐期', goal: '透明', color: 'text-emerald-400', desc: '理解 $E = \\sum (AD \\times EF)$ 的 Transparent 邏輯。' },
                                    { step: '自動期', goal: '追蹤', color: 'text-aqua', desc: '鍛造 AI 代理，實現任務的 Trackable 自動化。' },
                                    { step: '永恆期', goal: '封鎖', color: 'text-gold', desc: '成果匯入誠信護照，完成 Trustworthy 的終極封印。' },
                                ].map((item, i) => (
                                    <div key={i} className="liquid-glass p-6 border border-white/5 rounded-3xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Globe size={64} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Stage 0{i + 1}</span>
                                        <h3 className={`text-xl font-black mt-2 mb-1 ${item.color}`}>{item.step}</h3>
                                        <p className="text-[10px] font-bold text-white tracking-widest uppercase mb-4">Core: {item.goal}</p>
                                        <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 🔮 Summoning Overlay */}
            <AnimatePresence>
                {isSummoning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="size-64 border-4 border-aqua/30 rounded-full flex items-center justify-center relative"
                        >
                            <div className="absolute inset-0 border-4 border-dashed border-aqua/10 rounded-full animate-spin-slow" />
                            <Sparkles size={80} className="text-aqua animate-pulse" />
                        </motion.div>
                        <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl font-black mt-12 tracking-widest text-white uppercase italic"
                        >
                            Summoning <span className="text-aqua">Truth Crystal</span>
                        </motion.h3>
                        <p className="text-[10px] text-aqua/50 mt-4 tracking-[0.5em] font-black uppercase">Aligning 5T Protocols...</p>
                    </motion.div>
                )}

                {summonedCard && !isSummoning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setSummonedCard(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className="text-2xl font-black text-aqua tracking-tighter italic">NEW CRYSTAL MANIFESTED</span>
                            </div>
                            <ImpactCard {...summonedCard} />
                            <button
                                onClick={() => setSummonedCard(null)}
                                className="mt-8 w-full py-4 bg-white text-black font-black text-xs tracking-widest uppercase rounded-full hover:bg-aqua hover:text-black transition-colors"
                            >
                                Secure into Vault
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
