import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, ShieldCheck, ArrowRight, UserCircle2, Infinity as InfinityIcon, Eye } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { avatarService } from '@/core/omni-avatar-service';
import { useLanguage } from '@/components/LanguageProvider';
import type { DigitalTwin } from '@/lib/ncb-service';

/** 🛡️ Mock useAuth until actual auth provider is fully linked (Epic 15 Onboarding Context) */
const useAuth = () => ({
    user: { id: 'user-sentient-001', name: 'Dr. Thoth' }
});

export const FirstResonancePortal: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();
    const [step, setStep] = useState<'EYES_OPEN' | 'INITIATE' | 'CONFIRM' | 'MANIFEST' | 'AWAKEN'>('EYES_OPEN');
    const [nickname, setNickname] = useState('');
    const [resonanceInput, setResonanceInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [spriteResponse, setSpriteResponse] = useState('');
    const [generatedTwin, setGeneratedTwin] = useState<DigitalTwin | null>(null);

    const handleConfirm = () => {
        if (!nickname || !resonanceInput) return;
        setSpriteResponse(`「${nickname}，我感受到了您的願景：${resonanceInput.substring(0, 20)}... 這是一顆充滿力量的種子。準備好將它顯化為永恆嗎？」`);
        setStep('CONFIRM');
    };
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

    const handleEnter = () => {
        setStep('AWAKEN');
        setTimeout(() => {
            router.push('/omni');
        }, 1500);
    };

    return (
        <div className="min-h-[600px] w-full flex items-center justify-center p-6 font-['Outfit']">
            <AnimatePresence mode="wait">

                {step === 'EYES_OPEN' && (
                    <motion.div
                        key="eyes_open"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-2xl text-center"
                    >
                        <motion.div
                            initial={{ filter: 'blur(20px)', opacity: 0 }}
                            animate={{ filter: 'blur(0px)', opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <div className="size-24 bg-omni-primary/10 rounded-full flex items-center justify-center text-omni-primary mx-auto shadow-2xl shadow-omni-primary/20">
                                <Eye size={48} className="animate-pulse" />
                            </div>
                            
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-omni-text-main italic uppercase tracking-tighter">
                                    {t.ai.thoth_welcome}
                                </h2>
                                <p className="text-omni-text-muted text-lg font-medium max-w-md mx-auto leading-relaxed">
                                    {t.ai.thoth_eyes_open}
                                </p>
                            </div>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                onClick={() => setStep('INITIATE')}
                                className="px-12 py-5 bg-omni-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl shadow-omni-primary/30 hover:scale-110 hover:rotate-1 transition-all group"
                            >
                                <span className="flex items-center gap-3">
                                    {t.ai.begin_resonance} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </motion.button>
                        </motion.div>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest text-omni-primary/80">Step 01 / 第一章：初次共鳴</span>
                                    <h2 className="text-2xl font-black text-omni-text-main">啟動您的數位共鳴</h2>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-black uppercase tracking-wide text-omni-text-muted">數位代號 (Nickname)</label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={e => setNickname(e.target.value)}
                                    placeholder="稱呼您的數位分身..."
                                    className="w-full bg-omni-bg border border-omni-glass-border p-4 rounded-xl text-omni-text-main focus:outline-none focus:border-omni-primary transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="text-xs font-black uppercase tracking-wide text-omni-text-muted">共鳴之語 (Your Resonance Statement)</label>
                                <textarea
                                    rows={4}
                                    value={resonanceInput}
                                    onChange={e => setResonanceInput(e.target.value)}
                                    placeholder="輸入您對永續最深刻的一句話..."
                                    className="w-full bg-omni-bg border border-omni-glass-border p-4 rounded-xl text-omni-text-main focus:outline-none focus:border-omni-primary transition-all resize-none"
                                />
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing || !nickname || !resonanceInput}
                                className="w-full py-5 bg-omni-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] shadow-omni-primary/20 transition-all"
                            >
                                進行靈魂共鳴 (Resonate) <ArrowRight size={18} />
                            </button>
                        </LiquidGlassContainer>
                    </motion.div>
                )}

                {step === 'CONFIRM' && (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-xl"
                    >
                        <LiquidGlassContainer glowColor="var(--theme-primary)" intensity="high" className="p-10 flex flex-col gap-8 border-omni-glass-border bg-omni-surface text-center">
                            <div className="size-20 bg-omni-primary/10 rounded-full flex items-center justify-center text-omni-primary mx-auto">
                                <Sparkles size={40} className="animate-pulse" />
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-omni-text-main italic uppercase">精靈回應 · Resonance confirmed</h3>
                                <div className="p-6 bg-omni-bg rounded-2xl border border-omni-glass-border">
                                    <p className="text-sm font-medium leading-relaxed text-omni-primary italic">
                                        {spriteResponse}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleManifest}
                                    disabled={isProcessing}
                                    className="w-full py-5 bg-omni-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-omni-primary/30 flex items-center justify-center gap-3 hover:scale-105 transition-all"
                                >
                                    {isProcessing ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>確認顯化分身 (Confirm Awake) <Zap size={18} /></>
                                    )}
                                </button>
                                <button
                                    onClick={() => setStep('INITIATE')}
                                    className="text-xs font-black uppercase tracking-widest text-omni-text-muted hover:text-omni-text-main transition-colors"
                                >
                                    返回修改 (Back)
                                </button>
                            </div>
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
                                分身覺醒：<br /> <span className="text-omni-primary">{generatedTwin?.nickname}</span>
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
                                onClick={handleEnter}
                                className="w-full py-4 bg-omni-text-main text-omni-bg rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                覺醒完畢：進入萬能中樞 (Enter) <ArrowRight size={20} />
                            </button>
                        </div>

                        <div className="relative aspect-square">
                            <LiquidGlassContainer glowColor="var(--theme-primary)" intensity="medium" className="h-full flex flex-col items-center justify-center p-8 text-center gap-6 overflow-hidden border-omni-glass-border bg-omni-surface">
                                <div className="w-32 h-32 rounded-full border-4 border-omni-primary/30 flex items-center justify-center p-2 relative shadow-sm">
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

                {step === 'AWAKEN' && (
                    <motion.div
                        key="awaken"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="size-32 bg-omni-primary rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,166,176,0.6)]"
                        >
                            <InfinityIcon size={64} />
                        </motion.div>
                        <h2 className="text-2xl font-black uppercase tracking-[0.5em] text-omni-primary animate-pulse">
                            系統同步中...
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
