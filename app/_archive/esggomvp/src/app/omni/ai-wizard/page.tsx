'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowRight, ShieldCheck, Database,
    Network, CheckCircle2, ChevronRight, Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIWizardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const router = useRouter();

    const steps = [
        { id: 1, title: 'Framework Mapping', desc: '選擇永續架構' },
        { id: 2, title: 'Data Resonance', desc: '自動映射引擎' },
        { id: 3, title: 'Schema Sealing', desc: '防呆與合約鎖定' }
    ];

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(c => c + 1);
        else router.push('/omni/reports');
    };

    return (
        <div className="min-h-screen bg-omni-bg text-white relative flex items-center justify-center p-6 overflow-hidden">
            {/* Deep Space Background / Aurora */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-omni-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

            {/* Main Modula */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row"
            >
                {/* Left Sidebar: Steps */}
                <div className="w-full md:w-1/3 bg-black/40 border-r border-white/5 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-omni-primary/20 border border-omni-primary/30 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-omni-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">Dr. Thoth</h1>
                                <p className="text-xs text-omni-primary uppercase tracking-widest">AI Guide</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step) => {
                                const isActive = currentStep === step.id;
                                const isPast = currentStep > step.id;
                                return (
                                    <div key={step.id} className="flex gap-4 relative">
                                        {/* Timeline Line */}
                                        {step.id !== steps.length && (
                                            <div className={`absolute left-3.5 top-8 bottom-[-20px] w-px ${isPast ? 'bg-omni-primary' : 'bg-white/10'}`} />
                                        )}

                                        <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${isActive ? 'bg-omni-primary text-black border-omni-primary shadow-[0_0_15px_rgba(0,163,163,0.5)]' :
                                            isPast ? 'bg-omni-primary/20 text-omni-primary border-omni-primary/50' :
                                                'bg-transparent text-white/30 border-white/10'
                                            }`}>
                                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${isActive ? 'text-white' : isPast ? 'text-white/80' : 'text-white/40'}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-white/30 mt-1">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40 leading-relaxed font-mono">
                        UUID: mod-agc-wizard-0001<br />
                        Engine: TS-Resonance Active
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="w-full md:w-2/3 p-8 lg:p-12 relative flex flex-col min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-black italic tracking-tight mb-3">啟動您的永續旅程</h2>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        歡迎使用 OMNI ESG 萬能永續平台。我是您的智庫引導精靈 Dr. Thoth。<br />
                                        首先，請選擇您企業今年度所需對齊的核心永續框架。
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['ISO-14064 (GHG)', 'SASB 標準', 'GRI 永續準則', 'IFRS S1/S2'].map((fw, idx) => (
                                        <div key={fw} className={`p-4 rounded-xl border cursor-pointer transition-all ${idx === 0 ? 'bg-omni-primary/10 border-omni-primary text-white shadow-[0_0_20px_rgba(0,163,163,0.15)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <Database className={`w-5 h-5 ${idx === 0 ? 'text-omni-primary' : 'text-white/40'}`} />
                                                {idx === 0 && <div className="w-2 h-2 rounded-full bg-omni-primary" />}
                                            </div>
                                            <h4 className="font-semibold">{fw}</h4>
                                            <p className="text-xs mt-1 opacity-60">自動映射對應的 200+ 報告模組</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-black italic tracking-tight mb-3">啟動 TS-Resonance 引擎</h2>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Dr. Thoth 正在讀取您的歷史資料... 已將舊有的 Python / SCALA 演算法，完美轉譯至「英碼繁博」 TypeScript 契約。
                                    </p>
                                </div>

                                <div className="flex-1 bg-black/40 rounded-xl border border-white/10 p-5 font-mono text-xs text-white/70 overflow-hidden relative">
                                    <code className="block text-green-400 mb-2">{'// [SUCCESS] Mapping Legacy Algorithm to Zod Schema'}</code>
                                    <code className="block text-blue-400">export const Scope2CalculationSchema = z.object({'{'}</code>
                                    <code className="block pl-4 text-white">purchasedElectricityMWh: z.number().nonnegative(),</code>
                                    <code className="block pl-4 text-white">gridEmissionFactor: z.number().positive(),</code>
                                    <code className="block pl-4 text-white">renewableElectricity: z.number().default(0),</code>
                                    <code className="block text-blue-400">{'}'});</code>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex items-end justify-center pb-6">
                                        <div className="flex items-center gap-2 text-omni-primary bg-omni-primary/10 px-4 py-2 rounded-full border border-omni-primary/30">
                                            <Network className="w-4 h-4 animate-spin-slow" />
                                            <span>演算法透明度 100% 同步完成</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-black italic tracking-tight mb-3">資料防禦與封裝</h2>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        防禦網部署完畢。您的所有報告將自動納入 `ESGDataLock` 雜湊鎖定與 Evidence Vault 追溯體系。
                                    </p>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-omni-primary/20 blur-2xl rounded-full" />
                                        <div className="w-24 h-24 bg-white/5 border border-omni-primary/40 rounded-full flex items-center justify-center relative z-10 text-omni-primary">
                                            <ShieldCheck className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-2">5T Protocol 啟動就緒</h3>
                                        <p className="text-sm text-white/50 max-w-sm">Tangible · Traceable · Trackable · Transparent · Trustworthy</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Action Bar */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentStep(c => Math.max(1, c - 1))}
                            className={`text-sm text-white/40 hover:text-white transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
                        >
                            上一步
                        </button>
                        <button
                            onClick={nextStep}
                            className="bg-omni-primary hover:bg-omni-primary/90 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                            {currentStep === 3 ? (
                                <>進入總樞紐 <Play className="w-4 h-4 fill-black" /></>
                            ) : (
                                <>下一步 <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
