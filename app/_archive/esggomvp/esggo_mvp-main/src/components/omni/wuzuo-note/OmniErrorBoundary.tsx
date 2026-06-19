'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCcw, Terminal, LifeBuoy } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * 🛡️ OmniErrorBoundary - 整合 Jules 協議的全域錯誤邊界
 * 當系統遭遇「果」(Error) 時，引導用戶進入修復流程。
 */
export class OmniErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[OmniError] Uncaught error:", error, errorInfo);
        // 未來可在此呼叫 Jules API 進行自動日誌紀錄與初步觀果
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-6 font-sans overflow-hidden relative">
                    {/* Background Resonance */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_70%)]" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-white/[0.02] border border-rose-500/20 backdrop-blur-2xl rounded-[32px] p-8 relative z-10 shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center relative">
                                <ShieldAlert size={40} className="text-rose-500" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 rounded-full bg-rose-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-xl font-black text-white tracking-widest uppercase">偵測到因果毀損</h1>
                                <p className="text-[10px] font-mono text-rose-400 uppercase tracking-widest opacity-60">Causal Disruption Detected</p>
                            </div>

                            <div className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 text-left font-mono">
                                <div className="flex items-center gap-2 mb-2">
                                    <Terminal size={12} className="text-white/20" />
                                    <span className="text-[9px] text-white/40 uppercase">Stack Trace Output</span>
                                </div>
                                <p className="text-[10px] text-rose-300/80 line-clamp-4 break-all leading-relaxed">
                                    {this.state.error?.message || "Unknown Gnosis Malfunction"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    <RefreshCcw size={12} />
                                    嘗試重啟
                                </button>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-rose-500/20 transition-all">
                                    <LifeBuoy size={12} />
                                    求助 Jules
                                </button>
                            </div>

                            <p className="text-[8px] text-white/20 italic">
                                「以終為始 · 始終如一」— 系統將在重置後重新嘗試締結因果。
                            </p>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
