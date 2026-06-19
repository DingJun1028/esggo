import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Zap, Heart, Cpu } from 'lucide-react';

interface AvatarTrait {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
}

const TRAITS: AvatarTrait[] = [
    {
        id: 'visionary',
        name: '願景開拓 (Visionary)',
        icon: <Sparkles className="w-6 h-6" />,
        color: 'from-amber-400 to-orange-500',
        description: '專注於未來的永續文明建構。'
    },
    {
        id: 'guardian',
        name: '穩健守護 (Guardian)',
        icon: <Shield className="w-6 h-6" />,
        color: 'from-blue-400 to-cyan-500',
        description: '確保系統合規與風險控管的基石。'
    },
    {
        id: 'catalyst',
        name: '共鳴催化 (Catalyst)',
        icon: <Zap className="w-6 h-6" />,
        color: 'from-purple-400 to-pink-500',
        description: '驅動跨界協作與群體共鳴的引導者。'
    },
    {
        id: 'humanist',
        name: '全人共感 (Humanist)',
        icon: <Heart className="w-6 h-6" />,
        color: 'from-emerald-400 to-teal-500',
        description: '以人為本，關注社會福祉與心理資本。'
    },
    {
        id: 'architect',
        name: '邏輯架構 (Architect)',
        icon: <Cpu className="w-6 h-6" />,
        color: 'from-slate-400 to-indigo-500',
        description: '優化數據流轉與系統效率的精密核心。'
    }
];

interface Props {
    onComplete: (traitId: string) => void;
}

export const AvatarCreationPortal: React.FC<Props> = ({ onComplete }) => {
    const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
    const [isSealing, setIsSealing] = useState(false);

    const handleSeal = () => {
        if (!selectedTrait) return;
        setIsSealing(true);
        // Simulate complex seal animation
        setTimeout(() => {
            onComplete(selectedTrait);
        }, 2500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Chapter 1: Primary Resonance (初次共鳴)</h2>
                <p className="text-slate-400">選擇您的「個人數位分身」核心特質，開啟永續旅程。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
                {TRAITS.map((trait) => (
                    <motion.div
                        key={trait.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTrait(trait.id)}
                        className={`
              relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300
              flex flex-col items-center text-center
              ${selectedTrait === trait.id
                                ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                : 'border-slate-800 bg-slate-800/50 hover:border-slate-600'}
            `}
                    >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${trait.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                            {trait.icon}
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2">{trait.name}</h3>
                        <p className="text-[10px] text-slate-400">{trait.description}</p>

                        {selectedTrait === trait.id && (
                            <motion.div
                                layoutId="active-glow"
                                className="absolute inset-0 rounded-2xl border-2 border-white pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col items-center">
                <AnimatePresence mode="wait">
                    {!isSealing ? (
                        <motion.button
                            key="seal-button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            disabled={!selectedTrait}
                            onClick={handleSeal}
                            className={`
                px-10 py-4 rounded-full font-bold text-lg transition-all
                ${selectedTrait
                                    ? 'bg-white text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
              `}
                        >
                            執行 5T 封印 (Execute 5T Seal)
                        </motion.button>
                    ) : (
                        <motion.div
                            key="sealing-status"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 relative mb-4">
                                <motion.div
                                    className="absolute inset-0 border-4 border-white rounded-full border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-2 border-4 border-amber-500 rounded-full border-b-transparent"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <p className="text-white font-mono animate-pulse">
                                [CRYSTALLIZING_IDENTITY] ... HASHING_5T_EVIDENCE
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-12 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">5T Trust Protocol</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    您的數位分身一旦封印，將產生唯一的 SHA-256 哈希值，並永久存儲於「主權資產庫」中。此行為不可篡改，且為「服務即教學」的起點。
                </p>
            </div>
        </div>
    );
};
