import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    ChevronRight,
    ShieldCheck,
    UserCircle2,
    Fingerprint,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../styles/liquid-glass.css';

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    type: 'info' | 'input' | 'selection';
    inputPlaceholder?: string;
    options?: { label: string; value: string; icon?: React.ReactNode }[];
    validation?: (value: any) => boolean;
}

import { UserAvatarProfile } from '@/types/user';

interface ServiceOnboardingOverlayProps {
    serviceName: string;
    serviceDesc: string;
    steps: OnboardingStep[];
    onComplete: (data: any | UserAvatarProfile) => void;
    isOpen: boolean;
}

const ServiceOnboardingOverlay: React.FC<ServiceOnboardingOverlayProps> = React.memo(({
    serviceName,
    serviceDesc,
    steps,
    onComplete,
    isOpen
}) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [direction, setDirection] = useState(1);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    // IComponentCore Initialization
    const [core] = useState<IComponentCore>(() =>
        ComponentCoreFactory.create(
            'components/common/ServiceOnboardingOverlay.tsx',
            '1.0.0',
            ['Onboarding', '5T-Protocol', 'LiquidGlass']
        )
    );

    const currentStep = steps[currentStepIndex];

    // Guard against undefined steps
    if (!currentStep) return null;

    const isLastStep = currentStepIndex === steps.length - 1;

    const handleNext = useCallback(() => {
        if (currentStep.type === 'input' && currentStep.validation && !currentStep.validation(formData[currentStep.id])) {
            setValidationError('無效的輸入，請遵循引導規範。 (Invalid Input)');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            return;
        }

        setValidationError(null);
        if (isLastStep) {
            onComplete(formData);
        } else {
            setDirection(1);
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [currentStep, formData, isLastStep, onComplete]);

    const handleInput = (value: any) => {
        setFormData(prev => ({ ...prev, [currentStep.id]: value }));
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        }),
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-sans"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-[#050c14]/80 backdrop-blur-md" />

                    {/* Modal Content - Liquid Glass Container */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        className="relative z-10 w-full max-w-5xl liquid-glass-strong overflow-hidden flex flex-col md:flex-row min-h-[600px] onboarding-container"
                    >
                        {/* Quantum Stream Effect */}
                        <div className="absolute inset-0 pointer-events-none quantum-stream opacity-30" />

                        {/* Left: Branding & Visualization */}
                        <div className="w-full md:w-2/5 p-12 border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
                            {/* Background Gradient */}
                            <div
                                className="absolute inset-0 opacity-40 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle at top left, rgba(99, 166, 176, 0.2), transparent 70%)'
                                }}
                            />

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="size-20 rounded-3xl flex items-center justify-center mb-8 glass-edge-light"
                                    style={{
                                        background: 'rgba(99, 166, 176, 0.2)',
                                        border: '1px solid rgba(99, 166, 176, 0.3)',
                                        boxShadow: '0 0 30px rgba(99, 166, 176, 0.2)'
                                    }}
                                >
                                    <Sparkles className="w-10 h-10 text-[var(--aqua-cyan)]" />
                                </motion.div>
                                <motion.h2
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-5xl font-black italic tracking-tighter uppercase mb-6 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--aqua-cyan)]"
                                >
                                    First <br /> Resonance
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm text-[var(--aqua-cyan)] font-medium leading-relaxed max-w-xs opacity-80"
                                >
                                    {serviceDesc}
                                </motion.p>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[var(--aqua-cyan)] shadow-[0_0_10px_var(--aqua-cyan)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-[var(--aqua-cyan)]">{currentStepIndex + 1} / {steps.length}</span>
                                </div>
                                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--aqua-cyan-light)] border border-[var(--glass-border)] rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-[var(--aqua-cyan)]" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-[var(--aqua-cyan)] tracking-widest">5T Protocol Active</span>
                                        <span className="text-[9px] text-white/40">Secured by Dr. Thoth</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Interaction Area */}
                        <div className="w-full md:w-3/5 p-12 flex flex-col relative bg-black/20">
                            <AnimatePresence mode='wait' custom={direction}>
                                <motion.div
                                    key={currentStep.id}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="flex-1 flex flex-col justify-center"
                                >
                                    <div className="mb-8">
                                        <div className="size-16 rounded-full bg-[var(--aqua-cyan-light)] border border-[var(--aqua-cyan)]/30 flex items-center justify-center mb-6 text-[var(--aqua-cyan)]">
                                            {currentStep.icon}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-3">{currentStep.title}</h3>
                                        <p className="text-lg text-white/50 leading-relaxed">{currentStep.description}</p>
                                    </div>

                                    <div className="min-h-[120px]">
                                        {currentStep.type === 'input' && (
                                            <motion.div
                                                className="space-y-4"
                                                animate={isShaking ? "shake" : "center"}
                                                variants={variants}
                                            >
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={formData[currentStep.id] || ''}
                                                    onChange={(e) => {
                                                        handleInput(e.target.value);
                                                        setValidationError(null);
                                                    }}
                                                    placeholder={currentStep.inputPlaceholder}
                                                    className={`w-full bg-white/5 border-b-2 ${validationError ? 'border-red-500/50' : 'border-white/10'} focus:border-[var(--aqua-cyan)] text-3xl font-light py-4 px-2 outline-none text-white transition-all placeholder:text-white/10`}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                                />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-[var(--aqua-cyan)]/60">
                                                        <Fingerprint className="w-3 h-3" />
                                                        <span>此名稱將連結至您的數位靈魂 ID: {core.uuid.substring(0, 8)}...</span>
                                                    </div>
                                                    <AnimatePresence>
                                                        {validationError && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0 }}
                                                                className="flex items-center gap-1.5 text-xs text-red-400 font-medium"
                                                            >
                                                                <AlertCircle className="w-3.5 h-3.5" />
                                                                {validationError}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        )}

                                        {currentStep.type === 'selection' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 onboarding-option-grid gap-4">
                                                {currentStep.options?.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleInput(opt.value)}
                                                        className={`p-4 rounded-xl border text-left transition-all group flex items-start gap-3 ${formData[currentStep.id] === opt.value
                                                            ? 'bg-[var(--aqua-cyan-light)] border-[var(--aqua-cyan)] ring-1 ring-[var(--aqua-cyan)]'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-lg ${formData[currentStep.id] === opt.value ? 'bg-[var(--aqua-cyan)] text-slate-950' : 'bg-white/10 text-white/40'}`}>
                                                            {opt.icon || <UserCircle2 className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-bold mb-1 ${formData[currentStep.id] === opt.value ? 'text-white' : 'text-white/70'}`}>
                                                                {opt.label}
                                                            </div>
                                                            <div className="text-[10px] text-white/30 uppercase tracking-wider">Select Archetype</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-8 flex items-center justify-end gap-4 border-t border-white/10 pt-8">
                                <button
                                    onClick={handleNext}
                                    disabled={currentStep.type !== 'info' && !formData[currentStep.id]}
                                    className="px-8 py-3 bg-[var(--aqua-cyan)] text-slate-950 rounded-xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,166,176,0.4)]"
                                >
                                    {isLastStep ? 'Initialize Omni-Self' : 'Continue'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default ServiceOnboardingOverlay;
