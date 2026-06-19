'use client';

/**
 * 🏛️ FirstResonancePortal (v9.0 Sentient Onboarding)
 * 定位: 初次共鳴門戶 — 用戶數位分身的誕生地
 * 視覺: LiquidGlass + Aqua 青 (#63a6b0)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck, ArrowRight, UserCircle2, Infinity as InfinityIcon } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { avatarService } from '@/core/omni-avatar-service';
import type { DigitalTwin } from '@/lib/ncb-service';

/** 🛡️ Mock useAuth until actual auth provider is fully linked (Epic 15 Onboarding Context) */
const useAuth = () => ({
    user: { id: 'user-sentient-001', name: 'Dr. Thoth' }
});

export const FirstResonancePortal: React.FC = () => {
    const { user } = useAuth();
    const [step, setStep] = useState<'WELCOME' | 'INITIATE' | 'MANIFEST' | 'AWAKEN'>('WELCOME');
    const [nickname, setNickname] = useState('');
    const [resonanceInput, setResonanceInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedTwin, setGeneratedTwin] = useState<DigitalTwin | null>(null);
    const handleManifest = async () => {
        if (!user || !nickname || !resonanceInput) return;
        setIsProcessing(true);
        try {
            const twin = await avatarService.manifestFirstResonance(user.id, nickname, resonanceInput);
            setGeneratedTwin(twin);
            setStep('MANIFEST');
        } catch (error) {
            console.error('Manifest failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-[600px] w-full flex items-center justify-center p-6 font-['Outfit']">
            <AnimatePresence mode="wait">
                {step === 'WELCOME' && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="max-w-xl text-center flex flex-col items-center gap-8"
                    >
                        <div className="w-20 h-20 rounded-full bg-omni-primary/10 flex items-center justify-center text-omni-primary animate-pulse shadow-[0_0_20px_var(--theme-primary)]">
                            <InfinityIcon size={40} />
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-omni-text-main leading-tight">
                            初次共鳴 <br /> <span className="text-omni-primary">First Resonance</span>
                        </h1>
                        <p className="text-omni-text-muted leading-relaxed font-medium">
                            歡迎來到 InfoOne。在這裡，「服務即教學，知識即資產」。<br />
                            現在，讓我們啟動您的數位主體性，讓永續轉化為您的力量。
                        </p>
                        <button
                            onClick={() => setStep('INITIATE')}
                            className="px-8 py-4 bg-omni-primary text-[color:var(--theme-bg)] rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_var(--theme-primary)] hover:scale-105 transition-transform group flex items-center gap-3"
                        >
                            開始共鳴 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {step === 'INITIATE' && (
                    <motion.div
                        key="initiate"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-2xl"
                    >
                        <LiquidGlassContainer glowColor="var(--theme-primary)" intensity="high" className="p-10 flex flex-col gap-8 border-omni-glass-border bg-omni-surface">
                            <div className="flex items-center gap-4">
                                <UserCircle2 className="text-omni-primary" size={32} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-omni-primary/80">Step 01 / Perception</span>
                                    <h2 className="text-2xl font-black text-omni-text-main">定義您的稱號與願景</h2>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-black uppercase tracking-wide text-omni-text-muted">稱號 (Nickname)</label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={e => setNickname(e.target.value)}
                                    placeholder="輸入您的數位代號..."
                                    className="w-full bg-omni-bg border border-omni-glass-border p-4 rounded-xl text-omni-text-main focus:outline-none focus:border-omni-primary transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-black uppercase tracking-wide text-omni-text-muted">對永續的共鳴 (Your Vision)</label>
                                <textarea
                                    rows={4}
                                    value={resonanceInput}
                                    onChange={e => setResonanceInput(e.target.value)}
                                    placeholder="描述您對 ESG 或永續發展的一個真實想法..."
                                    className="w-full bg-omni-bg border border-omni-glass-border p-4 rounded-xl text-omni-text-main focus:outline-none focus:border-omni-primary transition-all resize-none"
                                />
                            </div>

                            <button
                                onClick={handleManifest}
                                disabled={isProcessing || !nickname || !resonanceInput}
                                className="w-full py-5 bg-omni-primary text-[color:var(--theme-bg)] rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_var(--theme-primary)] disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
                            >
                                {isProcessing ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>顯化分身 <Sparkles size={18} /></>
                                )}
                            </button>
                        </LiquidGlassContainer>
                    </motion.div>
                )}

                {step === 'MANIFEST' && (
                    <motion.div
                        key="manifest"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-omni-accent/10 text-omni-accent border border-omni-accent/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck size={12} /> 5T Verified Manifestation
                            </div>
                            <h2 className="text-4xl font-black italic uppercase text-omni-text-main leading-tight">
                                覺醒：<br /> <span className="text-omni-primary">{generatedTwin?.nickname}</span>
                            </h2>
                            <p className="text-omni-text-muted leading-relaxed">
                                您的數位分身已在「永恆宮殿」中刻印完成。這不僅是一個人設，更是您所有 ESG 成就的溯源起點。
                                系統已將您的初始感言封印為首個「知識資產」。
                            </p>
                            <div className="flex flex-col gap-2 p-4 bg-omni-surface rounded-2xl border border-omni-glass-border">
                                <span className="text-[10px] font-black uppercase text-omni-text-muted">Nature Law / 自然共鳴律</span>
                                <p className="text-sm font-medium italic text-omni-primary">"{generatedTwin?.nature_law}"</p>
                            </div>
                            <button
                                onClick={() => setStep('AWAKEN')}
                                className="w-full py-4 bg-omni-text-main text-omni-bg rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                進入智者圖書館
                            </button>
                        </div>

                        <div className="relative aspect-square">
                            <LiquidGlassContainer glowColor="var(--theme-primary)" intensity="medium" className="h-full flex flex-col items-center justify-center p-8 text-center gap-6 overflow-hidden border-omni-glass-border bg-omni-surface">
                                <div className="w-32 h-32 rounded-full border-4 border-omni-primary/30 flex items-center justify-center p-2 relative shadow-[0_0_20px_var(--theme-primary)]">
                                    <div className="absolute inset-0 border-t-omni-primary border-2 rounded-full animate-spin" />
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-omni-primary to-omni-accent flex items-center justify-center text-white shadow-2xl">
                                        <Zap size={64} className="drop-shadow-lg" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-black text-omni-primary uppercase tracking-widest">Current Rank</div>
                                    <div className="text-2xl font-black text-omni-text-main italic">{generatedTwin?.rank}</div>
                                </div>
                                <div className="w-full grid grid-cols-3 gap-2 mt-4">
                                    {['Wisdom', 'Integrity', 'Harmony'].map(v => (
                                        <div key={v} className="flex flex-col gap-1 p-2 bg-omni-bg/50 rounded-lg">
                                            <span className="text-[8px] font-black uppercase text-omni-text-muted">{v}</span>
                                            <span className="text-xs font-black text-omni-accent">Lv. 5</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute -bottom-8 -right-8 opacity-20 blur-xl w-32 h-32 bg-omni-primary rounded-full transition-all" />
                            </LiquidGlassContainer>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
