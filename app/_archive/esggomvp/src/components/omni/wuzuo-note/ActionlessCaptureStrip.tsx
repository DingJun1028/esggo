'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";

interface Props {
    onCapture: (text: string) => void;
    isProcessing?: boolean;
}

/**
 * ⚡ ActionlessCaptureStrip - 靈光閃現輸入條
 * 實作「無作」即時捕捉：最小化輸入摩擦，最大化靈感留存
 */
export const ActionlessCaptureStrip: React.FC<Props> = ({ onCapture, isProcessing }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onCapture(text);
            setText('');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <LiquidGlassContainer
                enablePerspective
                className="p-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl group hover:border-cyan-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                glowColor="aqua"
            >
                <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-2">
                    <div className="flex-shrink-0">
                        <motion.div
                            animate={isProcessing ? { scale: [1, 1.2, 1], rotate: [0, 180, 360] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`p-2 rounded-xl ${isProcessing ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}`}
                        >
                            {isProcessing ? <Sparkles size={18} /> : <Zap size={18} />}
                        </motion.div>
                    </div>

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Actionless Stratagem... 捕捉靈光一閃的妙計"
                        className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20 font-light tracking-wide focus:ring-0"
                        disabled={isProcessing}
                    />

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/10 hidden sm:block uppercase tracking-widest">Type to Capture</span>
                        <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 font-sans text-[10px] font-medium text-white/20 bg-white/5 border border-white/10 rounded uppercase">
                            Enter
                        </kbd>
                    </div>
                </form>

                {/* 底部能量條裝飾 */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        />
                    )}
                </AnimatePresence>
            </LiquidGlassContainer>
        </div>
    );
};

import { AnimatePresence } from 'framer-motion';
