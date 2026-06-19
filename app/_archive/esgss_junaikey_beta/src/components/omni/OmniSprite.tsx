import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    MessageCircle,
    X,
    ChevronRight,
    Zap,
    Activity,
    BrainCircuit,
    ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { omniPriest } from '@/services/OmniPriestService';
import { IPriestTransaction } from '@/types/omni/trinity';

/**
 * 🧚 JunAiKey 奧秘精靈 (Omni-Sprite)
 * --------------------------------
 * A floating AI assistant that provides contextual wisdom, 
 * tracks resonance, and guides users through the ESG journey.
 */
export const OmniSprite: React.FC<{ activeTab?: string }> = ({ activeTab }) => {
    const { t, i18n } = useTranslation();
    const isZh = i18n.language === 'zh-TW';

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [resonance, setResonance] = useState(88); // Mock resonance level

    const messages = isZh ? [
        "道法自然，系統毅然。今天的永續進度非常優異！",
        "偵測到超立方共鳴。建議查看『奧秘心智』進行深度優化。",
        "服務即教學，您的每一個選擇都正在轉化為知識資產。",
        "需要 me 幫您生成今日的 ESG 簡報嗎？"
    ] : [
        "Nature resonates, the system persists. Today's sustainability progress is excellent!",
        "Hypercube resonance detected. Recommendation: View 'Omni-Mind' for deep optimization.",
        "Service is teaching. Your choices are being transformed into knowledge assets.",
        "Shall I generate your daily ESG briefing?"
    ];

    // Tab-aware context messages
    const tabMessages: Record<string, string> = isZh ? {
        GUIDANCE: "正在尋求智慧指引嗎？我可以針對目前的數據提供優化建議。",
        ASSETS: "您的知識資產正在穩步增值中。5T 誠信度已達標。",
        LAWS: "所有的行動受『感官憲法』守護，誠信是系統的核心。",
        MESH: "偵測到多個活躍節點。系統間的共鳴非常強烈。",
        OMNI: "歡迎進入奧秘領域。超立方進化協議已就緒。"
    } : {
        GUIDANCE: "Seeking wisdom? I can offer optimization tips based on current data.",
        ASSETS: "Your knowledge assets are growing steadily. 5T integrity is locked.",
        LAWS: "Every action is guarded by the Senses Constitution.",
        MESH: "Multiple active nodes detected. The inter-system resonance is high.",
        OMNI: "Welcome to the Omni-realm. Hypercube Evolution Protocol is ready."
    };

    useEffect(() => {
        // Sync resonance with Priest
        const handleTransaction = (tx: IPriestTransaction) => {
            if (tx.resonance) setResonance(Math.round(tx.resonance));
        };
        omniPriest.events.on('transaction', handleTransaction);

        // Context-aware message update on tab change
        if (activeTab && tabMessages[activeTab]) {
            setCurrentMessage(tabMessages[activeTab]);
        }

        return () => {
            omniPriest.events.off('transaction', handleTransaction);
        };
    }, [activeTab, isZh]);

    useEffect(() => {
        // Rotation of random messages
        const cycleMessages = () => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)] || '';
            setCurrentMessage(randomMsg);
        };

        cycleMessages();
        const interval = setInterval(cycleMessages, 10000);
        return () => clearInterval(interval);
    }, [isZh]);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-72 pointer-events-auto"
                    >
                        {/* 🧚 Chat Bubble Area */}
                        <div className="backdrop-blur-2xl bg-slate-900/80 border border-aqua-500/30 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(0,255,255,0.2)] relative overflow-hidden group">
                            {/* Dynamic Aura */}
                            <div className="absolute inset-0 bg-gradient-to-br from-aqua-500/5 to-purple-500/5 opacity-50" />
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-aqua-500/10 rounded-full blur-3xl animate-pulse" />

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-gold-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-aqua-400">
                                            JunAiKey Oracle
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsMinimized(true)} className="text-white/30 hover:text-white transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm font-medium leading-relaxed text-slate-100 italic">
                                    "{currentMessage}"
                                </p>

                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center">
                                        <Activity className="w-3 h-3 text-aqua-400 mb-1" />
                                        <span className="text-[8px] text-slate-500 uppercase">{isZh ? '共鳴' : 'RESONANCE'}</span>
                                        <span className="text-xs font-bold text-white">{resonance}%</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center">
                                        <ShieldCheck className="w-3 h-3 text-emerald-400 mb-1" />
                                        <span className="text-[8px] text-slate-500 uppercase">{isZh ? '誠信' : '5T INTEGRITY'}</span>
                                        <span className="text-xs font-bold text-white">LOCKED</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 bg-aqua-500/10 hover:bg-aqua-500/20 border border-aqua-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-aqua-400 flex items-center justify-center gap-2 transition-all">
                                    <Zap className="w-3 h-3" />
                                    {isZh ? '發動奧秘號令' : 'Execute Command'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🧚 Floating Sprite Toggle */}
            <motion.button
                layout
                onClick={() => {
                    if (isMinimized) setIsMinimized(false);
                    else setIsOpen(!isOpen);
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="pointer-events-auto relative group"
            >
                {/* Ambient Ring */}
                <div className="absolute inset-0 bg-aqua-500/20 rounded-full blur-xl group-hover:bg-aqua-500/40 transition-all animate-pulse" />

                <div className="size-16 bg-slate-950 border-2 border-aqua-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)] relative overflow-hidden backdrop-blur-xl">
                    {/* Animated Internal Elements */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border border-aqua-500/20 rounded-full border-dashed"
                    />

                    <AnimatePresence mode="wait">
                        {isMinimized ? (
                            <motion.div
                                key="minimized"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                className="relative z-10"
                            >
                                <BrainCircuit className="w-8 h-8 text-aqua-400" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative z-10"
                            >
                                <Sparkles className="w-8 h-8 text-gold-400" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Notification Badge */}
                    {!isOpen && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-950 animate-bounce" />
                    )}
                </div>
            </motion.button>
        </div>
    );
};
