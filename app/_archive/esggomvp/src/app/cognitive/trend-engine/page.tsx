'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { GnosisEngine } from '@/core/gnosis-engine';
import { IOmniAtom } from '@/core/omni-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Search,
    Zap,
    BarChart3,
    Globe,
    ShieldCheck,
    Clock,
    ChevronRight,
    Sparkles,
    Cpu,
    Activity,
    AlertTriangle,
    Eye,
    Target
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 🧠 Cognitive 1.5: Trend Prediction Engine
 * Temporal Sandbox for ESG risk forecasting and scenario management.
 */
export default function TrendPredictionPage() {
    const { locale } = useLanguage();
    const [scenario, setScenario] = useState('1.5C Baseline');
    const [isSimulating, setIsSimulating] = useState(false);
    const [activePrediction, setActivePrediction] = useState<number | null>(null);

    const predictions = [
        { id: 1, title: 'Energy Price Spike', zh: '能源價格突發性飆升', prob: 85, risk: 'High', color: 'text-red-400', impact: '-$2.4M', timeframe: 'Q3 2026', trigger: 'Geopolitical instability' },
        { id: 2, title: 'Carbon Tax Increase', zh: '碳稅政策收緊', prob: 65, risk: 'Medium', color: 'text-orange-400', impact: '-$1.8M', timeframe: 'Q1 2027', trigger: 'Policy shift' },
        { id: 3, title: 'Supply Chain Delay', zh: '供應鏈物流延遲', prob: 45, risk: 'Low', color: 'text-yellow-400', impact: '-$0.9M', timeframe: '2026-Q4', trigger: 'Logistics bottleneck' },
    ];

    const [predictionData, setPredictionData] = useState(predictions);
    const [varValue, setVarValue] = useState(scenario === 'Policy Shock' ? '$8.4M' : '$3.2M');

    const handleSimulate = () => {
        setIsSimulating(true);

        const baseAtom: IOmniAtom<any> = {
            intent: 'Simulation',
            uuid: 'current-state-atom',
            version: '1.0.0',
            timestamp: Date.now(),
            payload: {},
            domainRef: 'TrendEngine',
            impactMetric: scenario === 'Policy Shock' ? '-10%' : '+5%',
            sourceOrigin: 'Simulation',
            originHash: '0x0',
            genealogy: [],
            algorithmId: 'gnosis-v1',
            verificationProof: 'verified',
            formula: 'Gnosis_V1',
            renderType: 'LiquidGlass',
            interaction: 'Fluid',
            auraColor: '#63a6b0',
            isFrozen: false,
            signerKey: 'signer-0x1',
            consensusTimestamp: Date.now(),
            contentHash: 'hash-0x2',
            circleId: 'esg-circle',
            interoperability: true,
            nextEvolution: () => ({ intent: "Evolution" } as any),
            tags: [],
            quality: 1,
            signature: 'sys',
            hash_lock: '',
            protocol: '5T' as any,
            lifecycle: [],
            evidence: {} as any,
            hypercube: {
                entropy: 0.5,
                harmony: 0.5,
                singularity: 'SING_SIM_TREND',
                tesseractHash: 'TESS_SIM_TREND',
                phase: 'FORGE'
            },
            context5W1H: {
                who: 'Dr. Thoth',
                what: 'Simulation',
                when: new Date().toISOString(),
                where: 'Cognitive_Sphere',
                why: scenario,
                how: 'Gnosis_Probabilistic_Model'
            }
        };

        setTimeout(() => {
            const gnosisResult = GnosisEngine.forecast(baseAtom, scenario);
            const prob = Math.round(gnosisResult.predictions[0].probability * 100);

            // Generate some random variation in alerts based on scenario
            const newPredictions = predictions.map(p => ({
                ...p,
                prob: Math.min(100, Math.max(0, p.prob + (Math.random() * 20 - 10))),
                impact: scenario === 'Policy Shock' ?
                    (p.impact.startsWith('-') ? `-$${(Math.random() * 2).toFixed(1)}M` : p.impact) :
                    p.impact
            }));

            setPredictionData(newPredictions);
            setVarValue(scenario === 'Policy Shock' ? `$${(8 + Math.random() * 2).toFixed(1)}M` : `$${(3 + Math.random()).toFixed(1)}M`);
            setIsSimulating(false);
        }, 3000);
    };

    const timelineData = [
        { year: '2024', val: 30 },
        { year: '2025', val: 45 },
        { year: '2026', val: 78 }, // Spike
        { year: '2027', val: 65 },
        { year: '2028', val: 85 },
        { year: '2029', val: 95 },
        { year: '2030', val: 120 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "趨勢預測引擎" : "Trend Prediction Engine"}
                subtitle={locale === 'zh-TW' ? "學習前瞻性風險預警與沙盤推演。透過 Gnosis 核心預測全球法規與環境變動對資產的影響。" : "Advanced risk forecasting and temporal sandbox. Predict regulatory shifts and environmental flux via the Gnosis Core."}
                category="認知智能服務"
            />

            {/* 🔮 Temporal Sandbox */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 p-8 md:p-12 rounded-[3.5rem] bg-black border border-[var(--primary)]/30 liquid-glass relative overflow-hidden min-h-[500px] flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity size={400} className="text-[var(--primary)]" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5 pointer-events-none" />

                    <div className="relative z-10 flex flex-col flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-8 w-full">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[var(--accent)] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                                    </span>
                                    <span className="text-[10px] font-black uppercase text-[var(--accent)] tracking-[0.4em]">Temporal Sandbox Active</span>
                                </div>
                                <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">{scenario}</h3>
                            </div>
                            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                                {['1.5C Baseline', '2.0C Delay', 'Policy Shock'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { setScenario(s); setIsSimulating(true); setTimeout(() => setIsSimulating(false), 2000); }}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${scenario === s ? 'bg-[var(--primary)] text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] relative z-10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full relative border border-white/5 rounded-3xl bg-black/60 overflow-hidden flex flex-col justify-end p-8">
                            {/* Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />

                            {/* 📈 Simulation Graph */}
                            <div className="relative h-48 flex items-end justify-between gap-2 z-10 w-full mb-6">
                                {timelineData.map((d, i) => {
                                    const heightBase = scenario === 'Policy Shock' && i > 2 ? d.val * 1.5 : scenario === '2.0C Delay' ? d.val * 0.8 : d.val;
                                    const isActive = isSimulating;

                                    return (
                                        <div key={d.year} className="flex flex-col items-center flex-1 h-full justify-end group">
                                            <div className="w-full relative flex items-end justify-center h-[90%]">
                                                <motion.div
                                                    animate={isActive ? {
                                                        height: [`${heightBase * 0.5}%`, `${heightBase}%`],
                                                        opacity: [0.5, 1],
                                                        filter: ['blur(4px)', 'blur(0px)']
                                                    } : { height: `${heightBase}%` }}
                                                    transition={{ duration: 1, delay: isActive ? i * 0.1 : 0, ease: "easeOut" }}
                                                    className="w-full max-w-[40px] bg-gradient-to-t from-[var(--primary)]/10 to-[var(--primary)] border-t-2 border-[var(--primary)] rounded-t-sm relative group-hover:from-[var(--accent)]/20 group-hover:to-[var(--accent)] group-hover:border-[var(--accent)] transition-all"
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-[var(--accent)] z-20">
                                                        {Math.round(heightBase)}
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 mt-4 group-hover:text-white transition-colors">{d.year}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                <AnimatePresence>
                                    {isSimulating && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex flex-col items-center gap-4 bg-black/80 p-8 rounded-3xl backdrop-blur-md border border-[var(--primary)]/30"
                                        >
                                            <div className="size-16 border-t-4 border-[var(--primary)] border-r-4 border-r-transparent rounded-full animate-spin" />
                                            <span className="text-[10px] font-black uppercase text-[var(--primary)] tracking-[0.5em] animate-pulse">Running Gnosis Forecast...</span>
                                            <span className="text-[8px] text-gray-500 font-mono">Computing 10,000+ Monte Carlo Pathways</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Target size={10} /> Value at Risk (VaR)
                                    </p>
                                    <p className="text-2xl font-black text-white italic">
                                        {varValue}
                                    </p>
                                </div>
                                <div className="pl-8 border-l border-white/10">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Eye size={10} /> Confidence Score
                                    </p>
                                    <p className="text-2xl font-black text-[var(--primary)] italic">92.5%</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSimulate}
                                disabled={isSimulating}
                                className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[var(--primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flexItems-center gap-2"
                            >
                                Re-Calculate Matrix <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 flex flex-col h-full">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#fff] flex items-center gap-2">
                        <AlertTriangle size={18} className="text-[var(--accent)]" /> Sentinel Alerts
                    </h4>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {predictionData.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setActivePrediction(activePrediction === p.id ? null : p.id)}
                                    className={`p-6 rounded-3xl bg-black/40 border transition-all cursor-pointer overflow-hidden
                                        ${activePrediction === p.id ? 'border-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' : 'border-white/10 hover:border-white/30'}`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                <span className="text-[10px] font-black">{p.prob}%</span>
                                            </div>
                                            <span className={`text-[9px] font-black px-2 py-1 rounded uppercase bg-white/5 border border-white/5 ${p.color}`}>{p.risk}</span>
                                        </div>
                                    </div>
                                    <h5 className="text-sm font-black text-white uppercase tracking-tight mb-2 leading-snug">
                                        {locale === 'zh-TW' ? p.zh : p.title}
                                    </h5>

                                    <AnimatePresence>
                                        {activePrediction === p.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="pt-4 mt-4 border-t border-white/10 space-y-3"
                                            >
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-gray-500 uppercase font-bold">Est. Impact</span>
                                                    <span className="font-mono font-black text-white">{p.impact}</span>
                                                </div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-gray-500 uppercase font-bold">Timeframe</span>
                                                    <span className="font-mono text-white">{p.timeframe}</span>
                                                </div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-gray-500 uppercase font-bold">Trigger Event</span>
                                                    <span className="font-mono text-white text-right max-w-[120px]">{p.trigger}</span>
                                                </div>
                                                <button className="w-full mt-2 py-2 border border-[var(--primary)]/50 text-[var(--primary)] rounded text-[9px] uppercase font-black tracking-widest hover:bg-[var(--primary)] hover:text-black transition-colors">
                                                    Formulate Mitigation Plan
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[var(--accent)]/20 to-transparent border border-[var(--accent)]/30 text-center mt-auto flex-shrink-0">
                        <Sparkles className="mx-auto text-[var(--accent)] mb-3" size={24} />
                        <h5 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em]">Golden Alpha Hub</h5>
                        <p className="text-[9px] text-[var(--sidebar-text)] mt-2 uppercase italic font-bold">Subscribed to Daily ESG Intelligence</p>
                    </div>
                </div>
            </div>

            {/* 📊 Prediction Matrix Nodes */}
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Matrix Dimensions</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { l: 'Regulatory Flux', v: 'High Volatility', i: <ShieldCheck />, c: 'text-red-400' },
                    { l: 'Supply Stability', v: 'Secure Matrix', i: <Globe />, c: 'text-emerald-400' },
                    { l: 'ESG Alpha Score', v: 'Rank: A+', i: <BarChart3 />, c: 'text-[var(--accent)]' },
                    { l: 'Tokenized Impact', v: '1.2M Units', i: <Zap />, c: 'text-[var(--primary)]' }
                ].map(n => (
                    <div key={n.l} className="p-8 rounded-[2rem] bg-black border border-white/10 group hover:border-[var(--primary)]/50 transition-all flex flex-col justify-between h-40">
                        <div className={`mb-4 ${n.c} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all origin-left`}>
                            {n.i}
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{n.l}</p>
                            <p className="text-lg font-black text-white italic uppercase">{n.v}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
