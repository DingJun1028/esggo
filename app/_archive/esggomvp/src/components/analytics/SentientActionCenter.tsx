"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ShieldAlert,
    Sparkles,
    ChevronRight,
    ArrowRight,
    Target
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';

interface Action {
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
}

interface SentientActionCenterProps {
    actions: Action[];
    onExecute?: (actionId: string) => void;
}

/**
 * 🛰️ SentientActionCenter (感悟行動中心)
 * 呈現由 AI 驅動的治理決策與修復建議
 */
export const SentientActionCenter: React.FC<SentientActionCenterProps> = ({
    actions,
    onExecute
}) => {
    return (
        <LiquidGlassContainer glowColor="amber" intensity="medium" className="h-full">
            <div className="p-8 flex flex-col h-full gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                            <Target className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sentient Action Center</h4>
                            <p className="text-[9px] text-omni-text-muted font-mono mt-0.5">KARMA_REPAIR_PROTOCOL_V1</p>
                        </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-white/40">
                        {actions.length} ACTIONS_READY
                    </div>
                </div>

                {/* Action List */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    <AnimatePresence mode="popLayout">
                        {actions.map((action, index) => (
                            <motion.div
                                key={action.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-2xl border transition-all hover:translate-x-1 flex flex-col gap-3 group/item ${action.severity === 'high'
                                        ? 'bg-rose-500/5 border-rose-500/20'
                                        : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {action.severity === 'high' ? (
                                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                                        ) : (
                                            <Sparkles className="w-3 h-3 text-amber-400" />
                                        )}
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${action.severity === 'high' ? 'text-rose-400' : 'text-amber-400'
                                            }`}>
                                            {action.type}
                                        </span>
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full ${action.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                                        } animate-pulse`} />
                                </div>

                                <p className="text-sm text-omni-text-main font-medium leading-relaxed">
                                    {action.message}
                                </p>

                                <div className="flex justify-end pt-2 border-t border-white/5 mt-auto">
                                    <button
                                        onClick={() => onExecute?.(action.id)}
                                        className="flex items-center gap-2 text-[10px] font-black text-omni-primary uppercase tracking-widest group-hover/item:gap-3 transition-all"
                                    >
                                        Execute Command <ChevronRight size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <button className="w-full py-4 rounded-2xl bg-omni-primary/10 border border-omni-primary/20 text-[10px] font-black text-omni-primary uppercase tracking-widest hover:bg-omni-primary hover:text-black transition-all flex items-center justify-center gap-2">
                    Sync with JunAiKey <Zap size={14} />
                </button>
            </div>
        </LiquidGlassContainer>
    );
};
