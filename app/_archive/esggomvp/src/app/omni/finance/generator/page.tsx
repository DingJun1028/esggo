'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { FinanceStatementGenerator } from '@/core/FinanceStatementGenerator';
import { OmniIcon } from '@/components/omni/icons';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';
import { ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, DollarSign, Activity, Sparkles } from 'lucide-react';

export default function FinanceGeneratorPage() {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Wizard State
    const [expectedRoi, setExpectedRoi] = useState("15");
    const [carbonReduction, setCarbonReduction] = useState("1250");
    const [trainingHours, setTrainingHours] = useState("450");
    const [waterConservation, setWaterConservation] = useState("800");

    const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
        { id: 'f1', title: '1. 財務預估 (Vision)', description: '設定合理的 ESG 投資回報率 (ROI) 預期，作為影響力量化的財務基準。', color: 'primary' },
        { id: 'f2', title: '2. 環境效益 (Environment)', description: '精確估算減碳量與節水率，系統將自動翻譯為財務領域的成本節約。', color: 'accent' },
        { id: 'f3', title: '3. 社會資本 (Social)', description: '將員工培訓與社區投入等無形資本，轉換為企業韌性與風險重估模型。', color: 'success' },
        { id: 'f4', title: '4. 價值顯化 (Manifest)', description: '一鍵產出具備 5T 協議認證的財務影響力報表，打動董事會與投資人。', color: 'primary' }
    ];

    const handleGenerate = () => {
        setIsGenerating(true);
        setStep(4);
        setTimeout(() => {
            const mockEsgData = [
                { code: 'CARBON_EMISSION_REDUCTION', value: parseInt(carbonReduction) || 0, unit: 'tCO2e' },
                { code: 'EMPLOYEE_TRAINING_HOURS', value: parseInt(trainingHours) || 0, unit: 'hrs' },
                { code: 'WATER_CONSERVATION', value: parseInt(waterConservation) || 0, unit: 'm3' }
            ];

            // Generate and inject custom ROI
            const statement = FinanceStatementGenerator.generateImpactStatement(mockEsgData);
            statement.financialMateriality.esgRoiPercentage = `+${expectedRoi}%`;

            setResult(statement);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-4 md:p-8 font-sans text-slate-900 dark:text-white">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                        Finance Impact <span className="text-emerald-500">Generator</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">
                        ESG ROI & Capital Transformation Wizard
                    </p>
                </header>

                <div className="mb-8">
                    <OmniComicStrip panels={comicPanels} />
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <LiquidGlassContainer glowColor="emerald" intensity="medium" className="p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">

                        {/* Progress Tracker */}
                        <div className="flex gap-2 mb-12 absolute top-0 left-0 w-full">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 transition-colors duration-500 ${step >= s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                                />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {/* STEP 1: Core Financials */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 flex flex-col justify-center"
                                >
                                    <div className="flex items-center gap-4 mb-6 text-emerald-500">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl"><DollarSign size={24} /></div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Financial Expectations</h2>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-8 max-w-lg">Define your target ESG ROI. This serves as the benchmark for calculating financial materiality and projected savings.</p>

                                    <div className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Target ESG ROI (%)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={expectedRoi}
                                                    onChange={(e) => setExpectedRoi(e.target.value)}
                                                    className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 dark:text-slate-600">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-12 flex justify-end">
                                        <button onClick={() => setStep(2)} className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-black uppercase text-xs tracking-widest transition-all hover:scale-105 shadow-xl shadow-emerald-500/20">
                                            Next: Environmental Metrics <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: Environmental Metrics */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 flex flex-col justify-center"
                                >
                                    <div className="flex items-center gap-4 mb-6 text-cyan-500">
                                        <div className="p-3 bg-cyan-500/10 rounded-2xl"><Activity size={24} /></div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Environmental Impact</h2>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-lg">Quantify your environmental initiatives. These figures will be cross-referenced with your ROI targets.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carbon Reduction</label>
                                            <div className="relative flex items-center">
                                                <input type="number" value={carbonReduction} onChange={(e) => setCarbonReduction(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all font-mono" />
                                                <span className="absolute right-4 text-xs font-bold text-slate-400 dark:text-slate-500">tCO2e</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Water Conservation</label>
                                            <div className="relative flex items-center">
                                                <input type="number" value={waterConservation} onChange={(e) => setWaterConservation(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-all font-mono" />
                                                <span className="absolute right-4 text-xs font-bold text-slate-400 dark:text-slate-500">m³</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-12 flex justify-between">
                                        <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <ChevronLeft size={16} /> Back
                                        </button>
                                        <button onClick={() => setStep(3)} className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full font-black uppercase text-xs tracking-widest transition-all hover:scale-105 shadow-xl shadow-cyan-500/20">
                                            Next: Social Impact <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Social & Finalize */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 flex flex-col justify-center"
                                >
                                    <div className="flex items-center gap-4 mb-6 text-indigo-500">
                                        <div className="p-3 bg-indigo-500/10 rounded-2xl"><ShieldCheck size={24} /></div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Social & Governance</h2>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-lg">Finalize the input sequence with social metrics to complete the full 5T asset generation.</p>

                                    <div className="max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Employee Training Hours</label>
                                            <div className="relative flex items-center">
                                                <input type="number" value={trainingHours} onChange={(e) => setTrainingHours(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-mono" />
                                                <span className="absolute right-4 text-xs font-bold text-slate-400 dark:text-slate-500">hrs</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-12 flex justify-between items-center">
                                        <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <ChevronLeft size={16} /> Back
                                        </button>
                                        <button onClick={handleGenerate} className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black uppercase text-xs tracking-widest transition-all hover:scale-105 shadow-xl">
                                            <Sparkles size={16} /> Manifest Statement
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Generating & Results */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center"
                                >
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 animate-spin" />
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Forging Financial Matrix</h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Applying Gnosis Formulas · Locking 5T Atom</p>
                                            </div>
                                        </div>
                                    ) : result ? (
                                        <div className="w-full text-left">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                                        <OmniIcon name="Analysis" size={32} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Impact Manifested</h2>
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Certified Financial Materiality Report</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldCheck size={14} /> Trustworthy
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                <div className="p-6 rounded-3xl bg-emerald-500 text-white md:col-span-1 flex flex-col justify-between shadow-xl shadow-emerald-500/20">
                                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Projected ESG ROI</div>
                                                    <div className="text-5xl md:text-6xl font-black tracking-tighter">{result.financialMateriality.esgRoiPercentage}</div>
                                                </div>

                                                <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 md:col-span-2 grid grid-cols-2 gap-6">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Projected Savings</div>
                                                        <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">${result.financialMateriality.projectedSavings.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Risk Exposure Reduction</div>
                                                        <div className="text-3xl font-black text-slate-900 dark:text-white">{result.financialMateriality.riskExposureReduction}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800 mt-auto">
                                                <button onClick={() => { setStep(1); setResult(null); }} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors">
                                                    Restart Genesis
                                                </button>
                                                <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform group">
                                                    Save to Hypercube <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </LiquidGlassContainer>
                </div>
            </div>
            <div className="text-center mt-12 mb-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">
                Service is Learning · Knowledge is Asset
            </div>
        </div>
    );
}
