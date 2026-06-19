'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Zap, Target, BookOpen, Calculator, Award, ArrowRight, X } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { hep } from '@/core/OmniHypercube';

interface ResonanceGuideProps {
    isOpen: boolean;
    onClose: () => void;
    phase?: 'FORGE' | 'VERIFY' | 'FOUNDRY' | 'AGORA' | 'EVOLVE';
}

/**
 * 🛰️ ResonanceGuide: 超立方共鳴新手導引組件
 * 貫徹「服務即教學」：解釋數據透明度、公式與功能成就。
 */
export const ResonanceGuide: React.FC<ResonanceGuideProps> = ({ isOpen, onClose, phase = 'FORGE' }) => {
    const explanation = hep.getProtocolExplanation(phase);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="relative w-full max-w-2xl"
                    >
                        <LiquidGlassContainer className="p-8 space-y-8 bg-omni-surface-2 border-omni-primary/30 shadow-2xl overflow-hidden shadow-omni-primary/20">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 rounded-2xl bg-omni-primary/20 flex items-center justify-center text-omni-primary">
                                        <Zap size={28} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-omni-text-main tracking-tight">
                                            仁督二脈：全域導航 <span className="text-omni-primary">[{explanation.title}]</span>
                                        </h2>
                                        <p className="text-xs text-omni-text-sub uppercase tracking-widest font-bold">Ren & Du Meridians Evolution Guide</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors z-50 relative">
                                    <X size={24} className="text-omni-text-muted" />
                                </button>
                            </div>

                            {/* Formula & Transparency */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-omni-primary mb-1">
                                    <Calculator size={18} />
                                    <h3 className="font-black text-sm uppercase tracking-wider">透明驗算與公式 (Transparency)</h3>
                                </div>
                                <div className="p-6 rounded-3xl bg-black/40 border border-omni-glass-border font-mono relative overflow-hidden group">
                                    <code className="text-omni-accent text-lg block text-center mb-2 font-bold tracking-wider">
                                        {explanation.formula}
                                    </code>
                                    <div className="absolute inset-0 bg-gradient-to-r from-omni-primary/5 via-transparent to-omni-primary/5 pointer-events-none" />
                                    <p className="text-[10px] text-center text-omni-text-muted mt-4 font-bold tracking-widest">
                                        * 基於超立方 {phase} 階段：任脈數據流與督脈治理流交會之激發矩陣。
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-omni-primary/5 rounded-2xl border border-omni-primary/10">
                                    <Info size={16} className="text-omni-primary mt-1 shrink-0" />
                                    <p className="text-xs text-omni-text-main leading-relaxed italic">
                                        「{explanation.effect}」— 壽司博士 Dr. Thoth
                                    </p>
                                </div>
                            </section>

                            {/* Features & Achievements */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-omni-primary mb-1">
                                        <Award size={18} />
                                        <h3 className="font-black text-sm uppercase tracking-wider">功能成就 (Achievements)</h3>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-omni-glass-border bg-white/5 group hover:border-omni-primary transition-all shadow-inner shadow-white/5">
                                        <p className="font-bold text-omni-text-main mb-1 tracking-wide">{explanation.achievement}</p>
                                        <p className="text-[10px] text-omni-text-sub uppercase tracking-tighter">打通仁督界線，解鎖共鳴矩陣操作權限</p>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-omni-primary mb-1">
                                        <Target size={18} />
                                        <h3 className="font-black text-sm uppercase tracking-wider">最佳實踐 (Best Practices)</h3>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-omni-glass-border bg-omni-primary/5 flex items-center gap-3">
                                        <ArrowRight size={16} className="text-omni-primary" />
                                        <p className="text-[11px] text-omni-text-main font-bold leading-relaxed">
                                            {explanation.bestPractice}
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* Action */}
                            <div className="pt-4 relative z-20">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-omni-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-omni-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    感悟完成 (Manifested)
                                </button>
                            </div>

                            {/* Decorative Hypercube Background */}
                            <div className="absolute -right-20 -bottom-20 size-80 bg-omni-primary/10 blur-[100px] pointer-events-none" />
                        </LiquidGlassContainer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
