import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Fingerprint, Zap, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../utils/i18n';
import { avatarOrchestrator } from '@/omni/services/OmniAvatarOrchestrator';
import { AvatarPersona } from '@/types/agency';

interface PersonalOnboardingWizardProps {
    onComplete: () => void;
}

export const PersonalOnboardingWizard: React.FC<PersonalOnboardingWizardProps> = ({ onComplete }) => {
    const { t } = useI18n();
    const [step, setStep] = useState(0); // 0: Welcome, 1: Syncing, 2: Awakening, 3: Complete
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (step === 1) {
            // Simulate Syncing
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep(2), 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        } else if (step === 2) {
            // Simulate Awakening & Initialize
            const awaken = async () => {
                try {
                    await avatarOrchestrator.initializeAgents();
                    const mockAgent = { id: 'primary-agent', name: 'Jun', role: 'Sovereign' } as any;
                    await avatarOrchestrator.awaken(mockAgent, AvatarPersona.ANALYST);
                } catch (e) {
                    console.error("Awakening failed", e);
                }
                setTimeout(() => setStep(3), 2000);
            };
            awaken();
        }
    }, [step]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050c14]/95 backdrop-blur-3xl text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-[#63a6b0]/10 rounded-full blur-[150px] animate-pulse" />
            </div>

            <div className="relative max-w-2xl w-full p-12 text-center">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="space-y-8"
                        >
                            <div className="size-32 mx-auto bg-gradient-to-br from-[#63a6b0] to-[#ffd700] p-1 rounded-full">
                                <div className="w-full h-full bg-[#050c14] rounded-full flex items-center justify-center">
                                    <Sparkles className="w-16 h-16 text-[#63a6b0]" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    {t('avatar.welcome.title')}
                                </h1>
                                <p className="text-lg text-slate-400 font-light max-w-lg mx-auto leading-relaxed">
                                    {t('avatar.welcome.subtitle')}
                                </p>
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-4 bg-[#63a6b0] hover:bg-[#52959f] text-[#050c14] font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(99,166,176,0.5)]"
                            >
                                {t('avatar.welcome.startSetup')}
                            </button>
                            <button onClick={onComplete} className="block mx-auto text-xs text-slate-600 hover:text-white uppercase tracking-widest mt-8">
                                {t('avatar.welcome.skip')}
                            </button>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="relative size-40 mx-auto flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                                    <circle cx="80" cy="80" r="76" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                                    <circle
                                        cx="80" cy="80" r="76"
                                        stroke="#63a6b0" strokeWidth="4" fill="none"
                                        strokeDasharray={477}
                                        strokeDashoffset={477 - (477 * progress) / 100}
                                        className="transition-all duration-100 ease-linear"
                                    />
                                </svg>
                                <Fingerprint className="w-16 h-16 text-[#63a6b0] animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{t('avatar.onboarding.step1Title')}</h2>
                                <p className="text-sm text-slate-400">{t('avatar.onboarding.step1Desc')}</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="relative size-40 mx-auto flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-t-[#63a6b0] border-[#63a6b0]/20 rounded-full"
                                />
                                <Zap className="w-16 h-16 text-[#ffd700] animate-bounce" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{t('avatar.onboarding.step2Title')}</h2>
                                <p className="text-sm text-slate-400">{t('avatar.onboarding.step2Desc')}</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="size-32 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                                    {t('avatar.onboarding.step3Title')}
                                </h2>
                                <p className="text-lg text-slate-400 max-w-md mx-auto">
                                    {t('avatar.onboarding.step3Desc')}
                                </p>
                            </div>
                            <button
                                onClick={onComplete}
                                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
                            >
                                {t('avatar.onboarding.finalAction')}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
