'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    ShieldCheck,
    Zap,
    Leaf,
    Users,
    Scale,
    Cpu,
    Globe,
    Activity,
    Database,
    Search,
    ChevronRight,
    Sparkles,
    BarChart3,
    Dna,
    Bot
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useLanguage } from '@/components/LanguageProvider';
import { OmniBase } from '@/core/OmniBase';
import { IContext5W1H } from '@/core/omni-types';
import ServiceJourney from '@/components/ServiceJourney';
import SentientAIWizard from '@/components/SentientAIWizard';
import { ReportService } from '@/core/ReportService';
import { OmniExporter } from '@/core/OmniExporter';
import { omniLogger, LogCategory } from '@/core/omniLogger';
import { FinanceStatementGenerator } from '@/core/FinanceStatementGenerator';
import { Download, TrendingUp } from 'lucide-react';

/**
 * 🏛️ Universal Sustainability Report Center
 * High-density layout supporting 200+ ESG functions with 5T Forging Animation.
 */
export default function ReportForgePage() {
    const { t, locale } = useLanguage();
    const [isForging, setIsForging] = useState(false);
    const [forgeStage, setForgeStage] = useState(0); // 0: Idle, 1: Extraction, 2: Validation, 3: Forging, 4: Success
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [dynamicFeatures, setDynamicFeatures] = useState<Record<string, string[]>>({});

    // Scenarios State
    const [hasError, setHasError] = useState(false);
    const [showActionPanel, setShowActionPanel] = useState(false);
    const [lastForgedData, setLastForgedData] = useState<any[]>([]);
    const [forgedAtom, setForgedAtom] = useState<any | null>(null);
    const [financeImpact, setFinanceImpact] = useState<any | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [context5W1H, setContext5W1H] = useState<IContext5W1H | null>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    useEffect(() => {
        // Generate initial 5W1H context for the SRC Hub (Grand Unification)
        const initialContext = OmniBase.generate5W1H({}, {
            who: "DingJun Hong (OmniIdentity Atom #000)",
            what: "Sustainable Report Center (SRC) Hub",
            where: "Governance Quadrant / Report Forge",
            why: "Knowledge Asset Forging & 5T Verification",
            how: "Virtuous Forging Flow (OmniBase v12)"
        });
        setContext5W1H(initialContext);
    }, []);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const res = await fetch('/api/data/public-esg-features');
                const result = await res.json();
                if (result.success && result.data) {
                    setDynamicFeatures(result.data);
                }
            } catch (err) {
                console.error("Failed to load real data:", err);
            }
        };
        fetchFeatures();
    }, []);

    const categories = [
        {
            id: 'env',
            title: "Environmental Impact Matrix",
            icon: <Leaf className="text-emerald-400" />,
            features: [
                'Carbon Scope 1-3 Audit', 'Zero Waste Circularity', 'Biodiversity Mapping',
                'Water Scarcity Resilience', 'Sustainable Logistics', 'Chemical Lifecycle'
            ],
            color: 'bg-emerald-500/10 border-emerald-500/20'
        },
        {
            id: 'soc',
            title: "Social Capital Sentinel",
            icon: <Users className="text-blue-400" />,
            features: [
                'DEI Multi-dimensional Inclusion', 'Occupational Health (ISO 45001)',
                'Human Rights Due Diligence', 'Community Impact SROI', 'Fair Wage Index'
            ],
            color: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            id: 'gov',
            title: "Governance & Ethics Core",
            icon: <Scale className="text-purple-400" />,
            features: [
                'Board Cognitive Diversity', 'Anti-Corruption Framework', 'Tax Transparency (GRI 207)',
                'Whistleblower Protection', 'Shareholder Sovereignty'
            ],
            color: 'bg-purple-500/10 border-purple-500/20'
        },
        {
            id: 'sentinel',
            title: "5T Intelligence Sovereign",
            icon: <Cpu className="text-aqua" />,
            features: [
                '5T Hash Lock Security', 'Zero Hallucination Audit', 'Gnosis Knowledge Mapping',
                'UCC Autonomous Assets', 'Eternal Vault Storage'
            ],
            color: 'bg-aqua/10 border-aqua/20'
        },
        {
            id: 'phase5',
            title: "Omniscience Command Hub",
            icon: <Globe className="text-amber-400" />,
            features: [
                'Omni-Dropzone X-Ray', 'Chrono-Matrix Calendar',
                'Omniscient Ledger', 'Sovereign War Room'
            ],
            color: 'bg-amber-500/10 border-amber-500/20',
            links: [
                '/governance/omni-dropzone',
                '/dashboard/chrono-matrix',
                '/governance/omniscient-ledger',
                '/dashboard/war-room'
            ]
        }
    ];

    const activeCategoryData = categories.find(c => c.id === selectedCategory);

    // Determines if the selected category simulates an "Empty Data" state
    const isMissingData = selectedCategory === 'env'; // Mock "Environment" as missing data for tutorial purposes

    const handleForge = () => {
        setIsForging(true);
        setForgeStage(1);
        setHasError(false);
        setShowActionPanel(false);
        setIsWizardOpen(true); // Auto-open sentient guide

        setContext5W1H(prev => OmniBase.generate5W1H({}, {
            who: context5W1H?.who || "DingJun Hong",
            what: context5W1H?.what || "SRC Impact Report",
            when: (context5W1H?.when || Date.now()).toString(),
            where: context5W1H?.where || "Governance Quadrant",
            how: "Atomic Extraction (Virtuous Flow Stage 1)",
            why: "Extracting Traceable DNA from Source Atoms"
        }));

        // In a sentient environment, the AI Wizard would guide these transitions
        // For demonstration, we keep the auto-transition but allow wizard interaction
    };

    const handleFinalSeal = async () => {
        setIsForging(true);
        setForgeStage(1);

        // Stage transitions
        setTimeout(() => setForgeStage(2), 1500);
        setTimeout(() => setForgeStage(3), 3000);
        
        // Final Manifestation
        setTimeout(async () => {
            setForgeStage(4);
            const forgedData = activeCategoryData?.features.map((f, i) => ({
                code: f,
                name: f,
                value: 100 - i,
                unit: "5T",
                confidence: 1.0
            })) || [];

            setLastForgedData(forgedData);
            setFinanceImpact(FinanceStatementGenerator.generateImpactStatement(forgedData));

            try {
                const atom = await ReportService.generateEliteReport(
                    activeCategoryData?.title || "Sentient ESG Report",
                    forgedData,
                    { format: 'PDF', frameworks: ['GRI', 'SASB'] }
                );
                setForgedAtom(atom);
                omniLogger.info(LogCategory.SYSTEM, `Forge: Asset manifested successfully. UUID: ${atom.uuid}`);
            } catch (err) {
                omniLogger.error(LogCategory.SYSTEM, "Forge Integration Failed", err);
                setHasError(true);
            }
        }, 4500);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        setTimeout(() => {
            OmniExporter.exportToCSV(
                `InfoOne_Report_${selectedCategory}_${Date.now()}`,
                activeCategoryData?.title || "ESG Report",
                lastForgedData,
                {
                    uuid: context5W1H?.uuid || 'OMNI-SEED-000',
                    timestamp: Date.now(),
                    author: context5W1H?.who || 'DingJun Hong'
                }
            );
            setIsDownloading(false);
        }, 1500);
    };

    const handleWizardAction = (actionId: string) => {
        if (actionId === 'extract' && forgeStage === 1) {
            setForgeStage(2);
            setContext5W1H(prev => ({ ...prev!, how: "5T Validation (Virtuous Flow Stage 2)", why: "Verifying Integrity via 5T Hash Lock" }));
        } else if (actionId === 'validate' && forgeStage === 2) {
            setForgeStage(3);
            setContext5W1H(prev => ({ ...prev!, how: "Asset Crystallization (Virtuous Flow Stage 3)", why: "Forging Knowledge-as-Asset Matrix" }));
        } else if (actionId === 'forge' && forgeStage === 3) {
            setForgeStage(4);
            setContext5W1H(prev => ({ ...prev!, how: "Final Authentication (Virtuous Flow Stage 4)", why: "Securing Immutable Evidence" }));
        } else if (actionId === 'bridge') {
            setContext5W1H(prev => ({ ...prev!, how: "Recursive Iteration", why: "Evolving from Alpha to Omega" }));
            // Trigger animation or next-gen view
        } else if (actionId === 'seal' && forgeStage === 4) {
            handleFinalSeal(); // Link to real seal logic
            setIsForging(false);
            setForgeStage(0);
            setIsWizardOpen(false);
            setShowActionPanel(true);
        }
    };

    const handleJulesFix = () => {
        setHasError(false);
        setForgeStage(0);
        setIsForging(false);
        // In real app, this would dispatch via JulesClient
        alert("Omni-Rosetta: Invoking Jules Agent to repair missing variables...");
    }

    const journeyStepMap: Record<number, string> = {
        0: 'traceable',
        1: 'traceable',
        2: 'trackable',
        3: 'transparent',
        4: 'trustworthy',
        5: 'tangible'
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <PageHeader
                title="Sustainable Report Center (SRC) Hub"
                subtitle={locale === 'zh-TW'
                    ? "200+ 功能完全開放：涵蓋 ESG 24 項核心領域與 5T 誠信對標，將數據轉化為不可篡改的知識資產。"
                    : "200+ Functions enabled: Covering 24 ESG MECE sectors with 5T Integrity audit."}
                category="Governance"
            />

            {/* 🗺️ User Journey Alignment (5T Protocol) */}
            <div className="py-2">
                <ServiceJourney
                    currentStepId={journeyStepMap[isForging ? forgeStage : (showActionPanel ? 5 : 0)]}
                />
            </div>

            {/* 🌐 5W1H Grand Unification Context Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            >
                {[
                    { label: 'Who (主體)', value: context5W1H?.who, icon: <Users size={14} /> },
                    { label: 'What (客體)', value: context5W1H?.what, icon: <FileText size={14} /> },
                    { label: 'When (時間)', value: context5W1H?.when ? new Date(context5W1H.when).toLocaleTimeString() : '...', icon: <Activity size={14} /> },
                    { label: 'Where (場域)', value: context5W1H?.where, icon: <Globe size={14} /> },
                    { label: 'Why (因果)', value: context5W1H?.why, icon: <Sparkles size={14} /> },
                    { label: 'How (邏輯)', value: context5W1H?.how, icon: <Cpu size={14} /> },
                ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-aqua/5 border border-aqua/20 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-aqua opacity-70">
                            {item.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                        <p className="text-[10px] text-[var(--theme-text-main)] font-bold truncate">{item.value}</p>
                    </div>
                ))}
            </motion.div>

            {/* 💡 Omni-Sprite Smart Recommendation (主動服務引導) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 flex items-start gap-4"
            >
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 mt-1">
                    <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[var(--theme-text-main)] mb-1 flex items-center gap-2">
                        Omni-Sprite Recommendation
                        <span className="px-2 py-0.5 bg-blue-500 text-[var(--theme-text-main)] text-[9px] rounded-full uppercase tracking-widest font-black">Active</span>
                    </h4>
                    <p className="text-xs text-[var(--theme-text-sub)]">
                        {locale === 'zh-TW'
                            ? "導師建議：根據您本季度的環境與社會數據，優先產出『碳盤存範圍 1-3』與『DEI 包容度』整合報告，以符合最新 GRI 準則並最大化市場溝通效益。"
                            : "Advisor Note: Based on this quarter's E & S metrics, we recommend forging an integrated 'Scope 1-3' & 'DEI' report to align with the latest GRI standards."}
                    </p>
                </div>
            </motion.div>

            {/* 🚀 Active Sentinel Pulse with Omni-Progress Sphere */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass border border-aqua/30 rounded-3xl p-4 md:p-8 flex flex-col md:flex-row items-center justify-between overflow-hidden relative min-h-[320px] md:min-h-[400px]"
            >
                <div className="absolute inset-0 bg-aqua/5 animate-pulse" />

                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 w-full">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-black uppercase tracking-[0.5em] text-aqua">Sentinel Pulse v10.6</span>
                                <span className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-[var(--theme-text-main)] italic tracking-tighter uppercase mb-2">Alpha-Omega Journey</h2>
                            <p className="text-xs text-[var(--theme-text-muted)] uppercase tracking-widest leading-relaxed">
                                Monitoring 200+ ESG functions. Currently distilling sentient evidence through the 5T forge process.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleForge}
                                disabled={isForging}
                                className="px-10 py-5 bg-aqua text-black rounded-2xl font-black text-xs uppercase tracking-widest primary-glow hover:scale-105 transition-all active:scale-95 disabled:grayscale"
                                style={{ boxShadow: '0 0 30px rgba(99, 162, 176, 0.5)' }}
                            >
                                {isForging ? "Sentient Forge Active" : "Launch Atomic Forge"}
                            </button>
                                <button
                                    onClick={() => setIsWizardOpen(true)}
                                    className="px-8 py-5 bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] text-[var(--theme-text-main)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--theme-surface-3)] transition-all flex items-center gap-3"
                                >
                                    <Bot size={18} className="text-aqua" />
                                    Consult AI Wizard
                                </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 📦 200 Functions Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-8 rounded-[2.5rem] border ${cat.color} liquid-glass group hover:border-aqua/40 cursor-pointer transition-all duration-500 shadow-2xl overflow-hidden`}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-[var(--theme-text-muted)] uppercase">Module 0{idx + 1}</span>
                        </div>

                        <h3 className="text-lg font-bold mb-6 text-[var(--theme-text-main)] group-hover:text-aqua transition-colors">{cat.title}</h3>

                        <div className="space-y-3">
                            {cat.features.map((f, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-3 group/item">
                                    <div className="w-1 h-1 bg-aqua/50 rounded-full group-hover/item:w-3 transition-all" />
                                    <span className="text-[10px] text-[var(--theme-text-muted)] group-hover/item:text-omni-primary transition-colors uppercase tracking-widest">{f}</span>
                                </div>
                            ))}
                            <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-aqua/60 animate-pulse">
                                <Sparkles size={12} />
                                <span>+ 38 More Deep Functions</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t.report_hub.audit_ready}</span>
                            <ChevronRight size={16} className="text-aqua" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ⚒️ Multi-Stage Forging Animation Overlay */}
            <AnimatePresence>
                {isForging && (
                    <motion.div
                        onClick={() => setSelectedCategory(null)}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--theme-bg)]/90 backdrop-blur-3xl"
                    >
                        <div className="max-w-xl w-full p-12 text-center space-y-12">
                            {hasError ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-32 h-32 mx-auto rounded-full bg-red-500/10 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] flex items-center justify-center relative"
                                >
                                    <div className="absolute inset-0 border-t-4 border-red-500 rounded-full animate-spin" />
                                    <Zap size={48} className="text-red-500" />
                                </motion.div>
                            ) : forgeStage < 4 ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 mx-auto rounded-full border-b-4 border-aqua shadow-[0_0_50px_rgba(99,162,176,0.5)] flex items-center justify-center"
                                >
                                    <Zap size={48} className="text-aqua animate-pulse" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-32 h-32 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.5)] flex items-center justify-center"
                                >
                                    <ShieldCheck size={48} className="text-emerald-400" />
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${hasError ? 'text-red-500' : 'text-[var(--theme-text-main)]'}`}>
                                    {hasError && "Forging Sequence Failed"}
                                    {!hasError && forgeStage === 1 && "Data Extraction"}
                                    {!hasError && forgeStage === 2 && "5T Validation"}
                                    {!hasError && forgeStage === 3 && "Forging Matrices..."}
                                    {!hasError && forgeStage === 4 && "Report Forged!"}
                                </h2>
                                <p className={`text-xs font-bold tracking-[0.3em] uppercase ${hasError ? 'text-red-400' : 'text-aqua'}`}>
                                    {hasError && "[ERR: OMNI_CORE_ANOMALY] Data corruption detected."}
                                    {!hasError && forgeStage === 1 && "Connecting to Omni Crystal..."}
                                    {!hasError && forgeStage === 2 && "Distilling Sentient Evidence..."}
                                    {!hasError && forgeStage === 3 && "Weaving Narrative & Assets..."}
                                    {!hasError && forgeStage === 4 && "Knowledge Asset Locked & Secured."}
                                </p>
                            </div>

                            {/* Error Actions Omni Cause Effect */}
                            {hasError && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-6"
                                >
                                    <button
                                        onClick={handleJulesFix}
                                        className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-black uppercase text-xs flex items-center justify-center gap-2 group"
                                    >
                                        <Sparkles size={16} className="group-hover:animate-ping" />
                                        Invoke Jules Agent for Semantic Repair
                                    </button>
                                    <button
                                        onClick={() => {
                                            setHasError(false);
                                            setForgeStage(0);
                                            setIsForging(false);
                                        }}
                                        className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Abort Sequence
                                    </button>
                                </motion.div>
                            )}

                            {/* 5T Progress Tracker */}
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { l: 'Tangible', zh: '可感知', stage: 1 },
                                    { l: 'Traceable', zh: '可溯源', stage: 1 },
                                    { l: 'Trackable', zh: '可追蹤', stage: 2 },
                                    { l: 'Transparent', zh: '可驗算', stage: 2 },
                                    { l: 'Trustworthy', zh: '不可篡改', stage: 3 }
                                ].map((step, i) => (
                                    <motion.div
                                        key={step.l}
                                        initial={{ opacity: 0.5, y: 10 }}
                                        animate={{
                                            opacity: forgeStage >= step.stage ? 1 : 0.3,
                                            y: 0
                                        }}
                                        transition={{ delay: i * 0.1 }}
                                        className="space-y-3"
                                    >
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                                            {forgeStage >= step.stage && (
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`absolute inset-0 ${forgeStage >= 4 ? 'bg-emerald-400' : 'bg-aqua'}`}
                                                />
                                            )}
                                        </div>
                                        <p className={`text-[9px] font-black uppercase tracking-tighter ${forgeStage >= 4 ? 'text-emerald-400' : (forgeStage >= step.stage ? 'text-aqua' : 'text-gray-600')}`}>
                                            {step.l}
                                        </p>
                                        <p className="text-[8px] text-gray-500 font-bold">{step.zh}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-[10px] text-gray-400 italic">
                                {forgeStage < 4 ? "Dr. Thoth is weaving the GRI/SASB integrity matrix..." : "The Eternal Palace acknowledges your contribution."}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 📊 Intelligence & Education Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 md:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 liquid-glass flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                    <div className="shrink-0 w-32 h-32 rounded-full border-4 border-aqua/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-t-4 border-aqua rounded-full animate-spin" />
                        <BarChart3 size={48} className="text-aqua" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h4 className="text-xl font-bold flex items-center gap-2">
                            Gnosis Real-time Manifestation
                            <span className="px-2 py-0.5 bg-aqua/20 text-aqua text-[9px] rounded uppercase font-black">Teaching Mode</span>
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                            {locale === 'zh-TW'
                                ? "智慧引擎正提純 50,000+ 數據點。透過 5T 協議，我們將碎片化的資訊轉化為具備「知識資產」特性的最終報告。這不僅是合規，更是企業價值的數位證明。"
                                : "Our Intelligence Engine is currently distilling 50,000+ data points for a total compliant narrative. All functions are integrated into a single source of truth (Single-Atom Strategy)."}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {['GRI 2026', 'SASB-Universal', 'TCFD v4', 'EU-CSRD'].map(s => (
                                <div key={s} className="group relative">
                                    <span className="px-3 py-1 bg-aqua/10 border border-aqua/30 rounded text-[9px] font-black text-aqua uppercase tracking-widest cursor-help">{s}</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black border border-aqua/30 rounded-lg text-[8px] text-gray-300 w-32 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        {s === 'GRI 2026' ? '全球報告倡議組織最新準則，強調雙重重大性。' : '對標國際主流永續揭露框架，確保全域合規。'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-aqua/5 border border-aqua/20 liquid-glass flex flex-col justify-center text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-aqua/10 rounded-full blur-3xl" />
                    <Dna className="mx-auto text-aqua mb-4 animate-pulse" size={32} />
                    <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">Truth Dimension</h4>
                    <p className="text-[10px] text-gray-400 leading-loose">
                        100% Immutable Evidence<br />
                        99.8% AI Audit Accuracy<br />
                        Zero Compliance Hallucination
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-[8px] text-aqua/60 italic">"Service as Teaching: Understanding the DNA of ESG."</p>
                    </div>
                </div>
            </div>

            {/* 🚪 Interactive Service Drawer */}
            <AnimatePresence>
                {selectedCategory && activeCategoryData && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCategory(null)}
                            className="fixed inset-0 bg-[var(--theme-surface)]/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`fixed top-0 right-0 h-full w-full max-w-md ${activeCategoryData.color} bg-[var(--theme-surface)]/90 backdrop-blur-3xl border-l border-[var(--theme-glass-border)] z-[110] p-8 overflow-y-auto shadow-2xl`}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-omni-primary/10 rounded-2xl">
                                        {activeCategoryData.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-[var(--theme-text-main)]">{activeCategoryData.title}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                {locale === 'zh-TW'
                                    ? `此模組包含 ${activeCategoryData.features.length} 項核心底層服務，提供您可以深入追蹤、計算與管理的數位永續解決方案。`
                                    : `This module contains ${activeCategoryData.features.length} core underlying services, providing digital sustainability solutions you can deeply track, compute, and manage.`}
                            </p>

                            <div className="space-y-4">
                                {activeCategoryData.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex justify-between items-center group cursor-pointer"
                                        onClick={() => {
                                            if (activeCategoryData.links && activeCategoryData.links[idx]) {
                                                window.location.href = activeCategoryData.links[idx];
                                            }
                                        }}
                                    >
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-aqua transition-colors">{feature}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t.report_hub.audit_ready} - Module {idx + 1}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>

                            {/* Pre-Flight Checklist Logic */}
                            {isMissingData ? (
                                <div className="mt-12 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">Pre-Flight Warning</div>
                                    <Database className="mx-auto text-amber-500 mb-2" size={24} />
                                    <h4 className="text-sm font-bold text-amber-500 mb-1">Data Readiness: 0%</h4>
                                    <p className="text-[10px] text-amber-500/70 uppercase tracking-widest font-black mb-4">Insufficient Base Data for Generation</p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setForgeStage(0)}
                                            className="px-6 py-3 rounded-xl border border-white/10 text-xs font-black tracking-widest uppercase hover:bg-white/5 transition-all"
                                        >
                                            {t.common.backToOrigin}
                                        </button>
                                        <Link
                                            href="/impact/village-square"
                                            className="px-8 py-3 rounded-xl bg-aqua text-black text-xs font-black tracking-widest uppercase hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <Sparkles size={14} />
                                            Crystallize into Impact Village
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-12 p-6 rounded-3xl bg-black/40 border border-white/10 text-center">
                                    <Sparkles className="mx-auto text-aqua mb-2" size={24} />
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-black mb-4">Omni-Sprite Direct Access</p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            handleForge();
                                        }}
                                        className="w-full py-3 bg-aqua text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] transition-transform active:scale-95"
                                    >
                                        Forge Knowledge Asset
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* 🎉 Enhanced Post-Success Reality Action Panel */}
            <AnimatePresence>
                {showActionPanel && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="fixed inset-0 z-[300] flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="max-w-xl w-full p-8 rounded-3xl bg-[var(--theme-surface)] border border-emerald-500/30 shadow-[0_0_100px_rgba(52,211,153,0.1)] pointer-events-auto liquid-glass">
                                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-6">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-center text-white mb-2">Report Asset Secured</h3>
                                <p className="text-sm text-center text-gray-400 mb-8 max-w-sm mx-auto">
                                    Your knowledge asset has been generated, mapped, and mathematically verified through the 5T Hash Lock.
                                </p>

                                <div className="space-y-4">
                                    {financeImpact && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="p-4 rounded-2xl bg-aqua/5 border border-aqua/20 mb-4"
                                        >
                                            <div className="flex items-center gap-2 mb-3 text-aqua">
                                                <TrendingUp size={16} />
                                                <h5 className="text-[10px] font-black uppercase tracking-widest">{t.finance.materiality}</h5>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[8px] text-gray-500 uppercase font-bold">{t.finance.roi}</p>
                                                    <p className="text-sm font-black text-white">{financeImpact.financialMateriality.esgRoiPercentage}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-gray-500 uppercase font-bold">{t.finance.savings}</p>
                                                    <p className="text-sm font-black text-aqua">${financeImpact.financialMateriality.projectedSavings.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="w-full p-4 rounded-2xl bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] hover:border-aqua/50 hover:bg-aqua/10 transition-all flex items-center justify-between group disabled:opacity-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-aqua/20 text-aqua rounded-lg group-hover:scale-110 transition-transform">
                                                {isDownloading ? <Activity size={20} className="animate-spin" /> : <Download size={20} />}
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-[var(--theme-text-main)] text-sm">{isDownloading ? t.report_forge.downloading : t.report_forge.download_asset}</h4>
                                                <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest">CSV / XLSX Asset with 5T Anchor</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-[var(--theme-text-muted)] group-hover:text-aqua transition-colors" />
                                    </button>

                                     <button
                                         disabled={!forgedAtom}
                                         className="w-full p-4 rounded-2xl bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all flex items-center justify-between group disabled:opacity-50"
                                     >
                                         <div className="flex items-center gap-4">
                                             <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform"><Database size={20} /></div>
                                             <div className="text-left">
                                                 <h4 className="font-bold text-[var(--theme-text-main)] text-sm">{forgedAtom ? "Asset Stored in Vault" : t.report_forge.store_vault}</h4>
                                                 <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest">
                                                     {forgedAtom ? `UUID: ${forgedAtom.uuid.slice(0, 12)}...` : "Make it mathematically immutable"}
                                                 </p>
                                             </div>
                                         </div>
                                         {forgedAtom ? <ShieldCheck size={20} className="text-emerald-400" /> : <ChevronRight size={20} className="text-[var(--theme-text-muted)] group-hover:text-emerald-400 transition-colors" />}
                                     </button>

                                    <button className="w-full p-4 rounded-2xl bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] hover:border-blue-500/50 hover:bg-blue-500/10 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><BarChart3 size={20} /></div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-[var(--theme-text-main)] text-sm">{t.report_forge.view_dashboard}</h4>
                                                <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest">Review visual metrics</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-[var(--theme-text-muted)] group-hover:text-blue-400 transition-colors" />
                                    </button>

                                    <button
                                        onClick={() => setShowActionPanel(false)}
                                        className="w-full p-3 rounded-xl bg-transparent border border-[var(--theme-glass-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-main)] hover:bg-[var(--theme-surface-2)] uppercase tracking-widest font-black text-xs transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* 🧙‍♂️ Sentient AI Wizard Sidebar */}
            <SentientAIWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                currentStage={forgeStage}
                onAction={handleWizardAction}
            />
        </div>
    );
}
