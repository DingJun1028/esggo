import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MousePointerClick, User } from 'lucide-react';

export const WisdomMentor: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 p-6 rounded-3xl bg-[var(--tiffany-bg)] backdrop-filter var(--tiffany-blur) border border-[var(--tiffany-border)] shadow-2xl max-w-md"
        >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#81D8D0]/20 flex items-center justify-center border border-[#81D8D0]/40">
                            <Bot className="w-6 h-6 text-[#81D8D0]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[var(--tiffany-text)] font-bold text-sm">Wisdom Mentor</span>
                        <span className="text-[10px] text-[var(--tiffany-text-secondary)] font-bold uppercase tracking-wider">Active Intelligence</span>
                    </div>
                </div>
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    <span className="text-[9px] text-slate-500 font-mono tracking-tighter">v1.2.4-ALPHA</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-[#81D8D0]/60" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-none bg-[var(--tiffany-glass-bg)] border border-[var(--tiffany-border)] text-[var(--tiffany-text)] text-xs leading-relaxed">
                        你好！我是您的教學小助手。點擊左側的「數據錄入」圖標，我將引導您完成首份 <span className="text-[#81D8D0] font-bold">ESG 報告</span> 的數據申報與 5T 驗證流程。
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <div className="p-3 rounded-2xl rounded-tr-none bg-[#81D8D0]/10 border border-[#81D8D0]/20 text-white text-xs">
                        好的，我現在開始錄入。
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#81D8D0]/20 flex-shrink-0 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#81D8D0]" />
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(129, 216, 208, 0.15)' }}
                className="mt-2 w-full p-3 rounded-xl border border-dashed border-[#81D8D0]/30 flex items-center justify-center gap-2 group transition-all"
            >
                <MousePointerClick className="w-4 h-4 text-[#81D8D0] group-hover:animate-bounce" />
                <span className="text-[11px] text-[#81D8D0] font-bold uppercase tracking-widest">Init Data Flow</span>
            </motion.button>
        </motion.div>
    );
};
