"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Sparkles,
    X,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    Terminal,
    Zap,
    Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

/**
 * OmniCommandTray
 * The persistent AI companion (Agent 0) for ESG GO Platform 2.0.
 * Provides proactive insights, compliance alerts, and tactical shortcuts.
 */
export const OmniCommandTray: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'system', content: string }[]>([
        { role: 'ai', content: "您好，我是 Omni Manager (Agent 0)。專家小隊已就緒，隨時準備執行您的永續指令。" }
    ]);

    // Simulate proactive "Pulse" from Agent 0
    useEffect(() => {
        const timer = setTimeout(() => {
            if (messages.length === 1) {
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: "偵測到供應鏈 Scope 3 數據異動，建議啟動緩解計畫稽核。"
                }]);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] group">
            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    layoutId="tray-container"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-3 bg-slate-950 text-white p-4 rounded-full shadow-2xl border border-white/10 hover:border-teal-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="relative">
                        <Cpu className="w-6 h-6 text-teal-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <span className="font-bold text-sm tracking-widest uppercase hidden group-hover:block">Agent Zero Active</span>
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layoutId="tray-container"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[360px] max-h-[600px] bg-slate-950/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-teal-400" />
                                <span className="text-white font-bold text-xs tracking-tighter uppercase">Omni_Intelligence v2.0</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-white/50" />
                            </button>
                        </div>

                        {/* Stream / Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'ai'
                                            ? "bg-teal-500/10 border border-teal-500/20 text-teal-100"
                                            : "bg-amber-500/5 border border-amber-500/10 text-amber-200 italic"
                                    )}
                                >
                                    {m.content}
                                </motion.div>
                            ))}
                        </div>

                        {/* Tactical Shortcuts */}
                        <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-2">
                            <button className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-teal-500/20 transition-all text-[10px] font-bold text-white uppercase tracking-widest">
                                <Zap className="w-3 h-3 text-teal-400" />
                                緩解計畫生成
                            </button>
                            <button className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-amber-500/20 transition-all text-[10px] font-bold text-white uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3 text-amber-400" />
                                合規缺口掃描
                            </button>
                        </div>

                        {/* Status Footer */}
                        <div className="px-4 py-2 bg-slate-950 flex items-center justify-between text-[10px] font-mono text-white/30 tracking-widest">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                                SQUAD_READY
                            </div>
                            <div>CPU_LOAD: 12%</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
