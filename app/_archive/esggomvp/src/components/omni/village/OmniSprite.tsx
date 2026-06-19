'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Send,
    Zap,
    Sparkles,
    BrainCircuit,
    ChevronUp,
    Ghost,
    Smile,
    AlertCircle,
    Search
} from 'lucide-react';
import { useSpriteStore, SpriteMood } from '@/core/omni-sprite-engine';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { omniNexusTrinity } from '@/core/omni-nexus-trinity';

/**
 * 🧚 OmniSprite - 全域萬能精靈 (Floating Assistant)
 */
export const OmniSprite: React.FC = () => {
    const { isOpen, mood, toggle, messages, addMessage, setMood } = useSpriteStore();
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 自動捲動到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setInputValue('');
        addMessage(userMsg, 'user');

        setIsTyping(true);
        setMood('thinking');

        try {
            const response = await omniNexusTrinity.dispatch('ask_jules', { prompt: userMsg });
            if (response.success) {
                addMessage(response.data, 'sprite');
            } else {
                addMessage('抱歉，我現在無法連結至智慧母體。', 'sprite');
            }
        } catch (error) {
            addMessage('量子通道不穩定，請稍後再試。', 'sprite');
        } finally {
            setIsTyping(false);
            setMood('idle');
        }
    };

    const SpriteIcon = () => {
        switch (mood) {
            case 'excited': return <Sparkles className="text-amber-400 animate-pulse" />;
            case 'warning': return <AlertCircle className="text-rose-400 animate-bounce" />;
            case 'thinking': return <BrainCircuit className="text-cyan-400 animate-spin" />;
            case 'observing': return <Search className="text-emerald-400" />;
            default: return <Smile className="text-blue-400" />;
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-4">

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                        className="w-[350px] sm:w-[400px]"
                    >
                        <LiquidGlassContainer intensity="high" glowColor="blue" className="h-[500px] flex flex-col overflow-hidden bg-[var(--theme-surface)] border-omni-glass-border backdrop-blur-3xl rounded-[2.5rem]">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-omni-glass-border bg-omni-primary-muted">
                                <div className="flex items-center gap-3">
                                    <div className="p-1 px-3 rounded-xl bg-omni-primary text-[10px] font-black italic text-white uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                        OmniSprite v1.4.0
                                    </div>
                                    <div className="text-[10px] text-omni-text-muted font-black flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        SYNCED
                                    </div>
                                </div>
                                <button onClick={toggle} className="p-1.5 hover:bg-black/5 rounded-xl transition-colors text-omni-text-muted">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Message Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-hide"
                            >
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed font-medium shadow-sm ${msg.sender === 'user'
                                            ? 'bg-omni-primary text-white rounded-tr-none'
                                            : 'bg-omni-surface-2 border border-omni-glass-border text-omni-text-main rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[9px] font-black text-omni-text-muted uppercase mt-1.5 tracking-tighter opacity-70">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-center gap-3 text-omni-primary/60 text-xs italic">
                                        <LoaderDots />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-omni-primary">精靈正在調取智慧座標...</span>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-5 border-t border-omni-glass-border bg-omni-surface-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="對精靈說點什麼..."
                                        className="w-full bg-omni-surface border border-omni-glass-border rounded-2xl px-5 py-4 pr-14 text-sm text-omni-text-main placeholder:text-omni-text-muted focus:outline-none focus:border-omni-primary transition-all font-bold shadow-sm"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-omni-primary text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
                onClick={toggle}
            >
                {/* Aura Ring - Apple Minimalist Style */}
                <div className={`absolute inset-[-12px] rounded-full blur-2xl transition-all duration-1000 opacity-20 ${mood === 'excited' ? 'bg-amber-400' : mood === 'thinking' ? 'bg-blue-400' : 'bg-omni-primary'
                    }`} />

                <div className="relative w-16 h-16 rounded-full bg-omni-surface border border-omni-glass-border flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-3xl">
                    {/* Interior Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-omni-primary/10 to-transparent animate-pulse" />

                    {/* Sprite Icon */}
                    <div className="relative z-10 scale-110">
                        <SpriteIcon />
                    </div>
                </div>

                {/* Status Dot */}
                <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-omni-primary border-[3px] border-omni-surface flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
            </motion.div>
        </div>
    );
};

const LoaderDots = () => (
    <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full bg-cyan-400"
            />
        ))}
    </div>
);
