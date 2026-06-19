'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, ChevronRight, ShieldCheck, Zap, Info, Lock } from 'lucide-react';
import { OmniBase } from '@/core/OmniBase';
import { IOmniAtom } from '@/core/omni-types';

interface WizardStep {
    id: string;
    title: string;
    description: string;
    action: string;
    status: 'pending' | 'active' | 'completed' | 'error';
}

interface SentientAIWizardProps {
    isOpen: boolean;
    onClose: () => void;
    currentStage: number;
    onAction: (actionId: string) => void;
}

export default function SentientAIWizard({ isOpen, onClose, currentStage, onAction }: SentientAIWizardProps) {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: "Greetings. I am Dr. Thoth, your Sentient SRC Guide. I notice you are beginning the Atomic Forging sequence for this quarter's ESG Report." }
    ]);

    const steps: WizardStep[] = [
        { id: 'extract', title: 'Contextual Ingestion', description: 'Analyze source atoms for GRI/SASB alignment.', action: 'Analyze Data', status: currentStage >= 1 ? 'completed' : (currentStage === 0 ? 'active' : 'pending') },
        { id: 'validate', title: '5T Verification', description: 'Cross-reference evidence nodes with hash locks.', action: 'Verify Integrity', status: currentStage >= 2 ? 'completed' : (currentStage === 1 ? 'active' : 'pending') },
        { id: 'forge', title: 'Narrative Synthesis', description: 'Crystallize data into a human-readable impact story.', action: 'Forge Narrative', status: currentStage >= 3 ? 'completed' : (currentStage === 2 ? 'active' : 'pending') },
        { id: 'seal', title: 'Eternal Vaulting', description: 'Secure the report in the Immutable Ledger.', action: 'Seal Report', status: currentStage >= 4 ? 'completed' : (currentStage === 3 ? 'active' : 'pending') },
    ];

    useEffect(() => {
        if (currentStage === 1) {
            setMessages(prev => [...prev, { role: 'ai', text: "Extraction initialized. I am scanning 14,000 electricity bills and HR records. All data points are being mapped to their respective Atoms." }]);
        } else if (currentStage === 2) {
            setMessages(prev => [...prev, { role: 'ai', text: "5T Verification in progress. Analyzing 'Traceability' and 'Transparency'. WARNING: 2 missing water meter records detected in the Kaohsiung factory. Shall I invoke Jules for semantic repair?" }]);
        } else if (currentStage === 3) {
            setMessages(prev => [...prev, { role: 'ai', text: "Data is stable. Forging the narrative matrix. I am weaving the 'Environmental Stewardship' chapter with real-time carbon reduction milestones." }]);
        } else if (currentStage === 4) {
            setMessages(prev => [...prev, { role: 'ai', text: "The Great Unification is complete. Your report is now an Eternal Asset. Proceed to sign the CSO E-Seal?" }]);
        }
    }, [currentStage]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
                    />

                    {/* Wizard Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-black/80 backdrop-blur-3xl border-l border-aqua/30 z-[250] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-aqua/10 to-transparent">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-aqua/20 rounded-2xl text-aqua">
                                    <Bot size={24} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Dr. Thoth</h3>
                                    <p className="text-[10px] text-aqua/60 font-black uppercase tracking-[0.3em]">Sentient SRC Guide v10.6</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50">
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Dialogue Stream */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'ai'
                                        ? 'bg-white/5 border border-white/10 text-gray-300'
                                        : 'bg-aqua text-black font-bold'
                                        }`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {/* Smart Suggestions */}
                            <div className="pt-4 flex flex-wrap gap-2">
                                <button className="px-3 py-1.5 rounded-lg bg-aqua/10 border border-aqua/20 text-aqua text-[10px] font-bold hover:bg-aqua/20 transition-all">"Review Gaps"</button>
                                <button className="px-3 py-1.5 rounded-lg bg-aqua/10 border border-aqua/20 text-aqua text-[10px] font-bold hover:bg-aqua/20 transition-all">"Sync E-Seals"</button>
                                <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 text-[10px] font-bold hover:bg-white/10 transition-all italic">"Explain 5T Logic"</button>
                            </div>
                        </div>

                        {/* Step Journey */}
                        <div className="p-8 bg-black/40 border-t border-white/10 space-y-4">
                            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 italic">The Path of Manifestation</h4>
                            <div className="space-y-4">
                                {steps.map((step, idx) => (
                                    <div key={step.id} className={`flex items-start gap-4 p-3 rounded-2xl border transition-all ${step.status === 'active'
                                        ? 'bg-aqua/5 border-aqua/30'
                                        : step.status === 'completed'
                                            ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
                                            : 'bg-transparent border-transparent opacity-30'
                                        }`}>
                                        <div className={`p-2 rounded-xl shrink-0 ${step.status === 'active'
                                            ? 'bg-aqua text-black'
                                            : step.status === 'completed'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white/5 text-gray-600'
                                            }`}>
                                            {step.status === 'completed' ? <ShieldCheck size={14} /> : (idx + 1)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h5 className="text-[11px] font-bold text-white uppercase tracking-tighter">{step.title}</h5>
                                                {step.status === 'active' && <span className="text-[8px] bg-aqua/20 text-aqua px-2 py-0.5 rounded font-black animate-pulse">CURRENT</span>}
                                            </div>
                                            <p className="text-[9px] text-gray-500 leading-tight">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {currentStage === 4 && (
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => onAction('seal')}
                                        className="w-full flex items-center justify-between p-4 bg-aqua text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all"
                                    >
                                        <span>Immutable E-Seal Authentication</span>
                                        <Lock size={14} />
                                    </button>
                                    <button
                                        onClick={() => onAction('bridge')}
                                        className="w-full flex items-center justify-between p-4 bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
                                    >
                                        <span>Bridge to Next Generation</span>
                                        <Zap size={14} />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => onAction(steps[currentStage]?.id || 'next')}
                                className="w-full mt-6 py-4 bg-aqua text-black rounded-xl font-black text-xs uppercase tracking-widest primary-glow transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Zap size={16} />
                                {steps[currentStage]?.action || "Continue Journey"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
