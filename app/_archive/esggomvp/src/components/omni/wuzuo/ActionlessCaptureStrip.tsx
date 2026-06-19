"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles, Brain, Cpu } from 'lucide-react';

interface ActionlessCaptureStripProps {
    onCapture?: (text: string) => void;
    placeholder?: string;
    isProcessing?: boolean;
}

/**
 * Actionless Capture Strip (Inspired by MyMemo AI / Tomemo)
 * 一個具備「感官共鳴」脈衝動畫的智慧捕捉欄
 */
export const ActionlessCaptureStrip = ({
    onCapture,
    placeholder = "捕捉靈光一現 (Sentient Inspiration)...",
    isProcessing = false
}: ActionlessCaptureStripProps) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
        if (inputValue.trim() && onCapture) {
            onCapture(inputValue);
            setInputValue("");
        }
    };

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center w-full px-4"
        >
            <div className={`
                relative flex items-center w-full max-w-3xl h-16
                backdrop-blur-3xl bg-white/[0.05]
                border border-white/10 rounded-full
                px-6 gap-4 group/strip
                transition-all duration-500 ease-out
                ${isFocused ? 'ring-2 ring-cyan-500/30 bg-white/[0.08]' : 'hover:bg-white/[0.07] shadow-lg'}
            `}>
                {/* 智慧共鳴脈衝 (Aura Glow) */}
                <div className={`
                    absolute inset-0 rounded-full pointer-events-none opacity-50
                    transition-opacity duration-1000
                    bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-cyan-500/10
                    ${isProcessing ? 'animate-pulse' : 'group-hover/strip:opacity-100'}
                `} />

                {/* AI 狀態圖示 */}
                <div className="relative z-10 flex items-center justify-center w-8 h-8">
                    {isProcessing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        >
                            <Cpu className="w-5 h-5 text-cyan-400" />
                        </motion.div>
                    ) : (
                        <Brain className="w-5 h-5 text-white/50 group-hover/strip:text-cyan-300 transition-colors" />
                    )}
                </div>

                {/* 輸入區域 */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 font-light text-lg"
                />

                {/* 互動按鈕組 */}
                <div className="relative z-10 flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-all">
                        <Mic className="w-5 h-5" />
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSubmit}
                        disabled={!inputValue.trim()}
                        className={`
                            p-2.5 rounded-full transition-all
                            ${inputValue.trim()
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                : 'bg-white/5 text-white/20'}
                        `}
                    >
                        {isProcessing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </motion.button>
                </div>

                {/* 背景裝飾光點 */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_4px_10px_rgba(34,211,238,0.5)]"
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
