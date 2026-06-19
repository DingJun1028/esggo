'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FlaskConical, Zap, RefreshCw, Layers, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';
import { OmniBase } from '@/core/OmniBase';

export default function InnovationLaboratory() {
    const { t } = useLanguage();
    const [selectedCards, setSelectedCards] = useState<any[]>([]);
    const [alchemyResult, setAlchemyResult] = useState<Record<string, number> | null>(null);
    const [isAlchemizing, setIsAlchemizing] = useState(false);

    // Mock cards available for alchemy
    const availableCards = [
        { id: '001', title: '善向永續', virtues: { zhi: 9, ren: 9, cheng: 9, yong: 9, jie: 9, he: 9 } },
        { id: '002', title: '山衛科技', virtues: { zhi: 7, ren: 6, cheng: 10, yong: 9, jie: 8, he: 7 } },
        { id: '003', title: '全人測評', virtues: { zhi: 8, ren: 10, cheng: 7, yong: 6, jie: 7, he: 9 } },
    ];

    const handleAlchemize = () => {
        if (selectedCards.length === 0) return;
        setIsAlchemizing(true);
        setTimeout(() => {
            const result = OmniBase.alchemizeStrategy(selectedCards.map(c => c.virtues));
            setAlchemyResult(result);
            setIsAlchemizing(false);
        }, 2000);
    };

    const toggleCard = (card: any) => {
        if (selectedCards.find(c => c.id === card.id)) {
            setSelectedCards(selectedCards.filter(c => c.id !== card.id));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-aqua pb-24">
            <PageHeader
                title={t.innovation_lab.title}
                subtitle={t.innovation_lab.subtitle}
                category="Innovation"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* 🧪 Alchemy Station */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="liquid-glass border border-aqua/30 rounded-[3rem] p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background Pulsing */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute size-[400px] bg-aqua/20 blur-[100px] rounded-full z-0"
                        />

                        {isAlchemizing ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative z-10 flex flex-col items-center gap-6"
                            >
                                <RefreshCw size={64} className="text-aqua animate-spin" />
                                <h3 className="text-2xl font-black tracking-tighter uppercase animate-pulse">Transmuting Essence...</h3>
                            </motion.div>
                        ) : alchemyResult ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative z-10 flex flex-col items-center w-full"
                            >
                                <div className="size-24 rounded-full bg-aqua flex items-center justify-center text-black mb-6 shadow-[0_0_50px_rgba(99,162,176,0.5)]">
                                    <Sparkles size={48} />
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">New Strategy Vector</h3>
                                <p className="text-aqua font-bold tracking-widest text-[10px] uppercase mb-8">Evolution Manifested</p>

                                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                    {Object.entries(alchemyResult).map(([v, val]) => (
                                        <div key={v} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center">
                                            <span className="text-[8px] text-gray-500 font-extrabold uppercase mb-1">{v}</span>
                                            <span className="text-xl font-black text-white">{val}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setAlchemyResult(null)}
                                    className="mt-12 text-[10px] font-black tracking-widest uppercase text-aqua hover:underline"
                                >
                                    Reset Alchemy Circle
                                </button>
                            </motion.div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
                                <div className="flex gap-4">
                                    {selectedCards.length > 0 ? (
                                        selectedCards.map(c => (
                                            <motion.div
                                                layoutId={c.id}
                                                key={c.id}
                                                className="size-24 rounded-3xl bg-aqua/20 border border-aqua/50 flex items-center justify-center p-4 text-center"
                                            >
                                                <span className="text-[10px] font-black uppercase text-aqua">{c.title}</span>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="size-24 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                            <FlaskConical size={32} className="text-gray-800" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Combine Virtues</h3>
                                    <p className="text-xs text-gray-500 max-w-xs mx-auto">Select Knowledge Assets from your collection to alchemize into a new strategy vector.</p>
                                </div>

                                <button
                                    disabled={selectedCards.length < 1}
                                    onClick={handleAlchemize}
                                    className="px-12 py-5 rounded-full bg-aqua text-black font-black uppercase tracking-[0.3em] text-sm hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-[0_0_40px_rgba(99,162,176,0.3)]"
                                >
                                    {t.innovation_lab.alchemize}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 📚 Card Library */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black tracking-[0.5em] text-gray-600 uppercase flex items-center gap-2">
                        <Layers size={14} /> Available Assets
                    </h3>
                    <div className="space-y-3">
                        {availableCards.map(card => {
                            const isSelected = selectedCards.find(c => c.id === card.id);
                            return (
                                <div
                                    key={card.id}
                                    onClick={() => toggleCard(card)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'bg-aqua/20 border-aqua' : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div>
                                        <h4 className="text-sm font-bold">{card.title}</h4>
                                        <p className="text-[8px] text-gray-500 uppercase font-black">ID: #{card.id}</p>
                                    </div>
                                    <div className={`size-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-aqua text-black' : 'bg-white/10 text-gray-400'
                                        }`}>
                                        <Plus size={14} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
