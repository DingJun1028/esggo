"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, CheckCircle2, AlertTriangle, Zap, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForensicConsoleProps {
    logs: string[];
    onClose?: () => void;
}

export function ForensicConsole({ logs, onClose }: ForensicConsoleProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
        >
            <div className="w-full max-w-4xl bg-stone-950 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] flex flex-col h-[70vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 font-mono">
                            zk-鑑識控制台 / zk-Forensic Console v4.5
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <AlertTriangle className="w-4 h-4 text-stone-500 hover:text-white" />
                    </button>
                </div>

                {/* Console Output */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed scrollbar-hide"
                >
                    <div className="space-y-2">
                        {logs.map((log, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-4 items-start"
                            >
                                <span className="text-stone-700 shrink-0">[{idx.toString().padStart(3, '0')}]</span>
                                <span className={cn(
                                    "flex-1",
                                    log.includes('[SYNC]') ? 'text-blue-400' :
                                        log.includes('[REWARD]') ? 'text-amber-500' :
                                            log.includes('[STORY]') ? 'text-purple-400' :
                                                log.includes('[HIDDEN]') ? 'text-emerald-500' :
                                                    'text-stone-300'
                                )}>
                                    {log}
                                </span>
                                {log.includes('Successfully') && <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" />}
                                {log.includes('REWARD') && <Zap className="w-3 h-3 text-amber-500 mt-0.5" />}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="px-6 py-3 bg-stone-900/50 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">誠信封裝：啟用中 / Integrity Sealing: ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">mTLS 狀態：已建立 / mTLS Status: ESTABLISHED</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">連線中 / Online</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
