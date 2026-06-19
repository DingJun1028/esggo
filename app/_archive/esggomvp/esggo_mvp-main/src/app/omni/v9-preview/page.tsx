'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import {
    Sparkles,
    Cpu,
    Database,
    Eye,
    ChevronLeft,
    Infinity,
    CheckCircle2,
    Lock,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { OmniIcon } from '@/components/omni/icons';
import { ADKActivationPortal } from '@/components/omni/adk/ADKActivationPortal';
import { DigitalTwin } from '@/lib/ncb-service';

type UpgradeStage = 'agentic-forge' | 'gnosis-prediction' | 'hypercube';

export default function V9TranscendencePage() {
    const [selectedStage, setSelectedStage] = useState<UpgradeStage>('agentic-forge');

    // 模擬數位分身用於展示 ADK 啟動
    const mockTwin: DigitalTwin = {
        id: 0,
        twin_uuid: 'twin-v9-preview-001',
        nickname: 'Transcendence_Beta_User',
        avatar_type: 'SENTIENT',
        level: 9,
        exp: 8888,
        rank: 'Sentient_V9',
        virtues: JSON.stringify({ wisdom: 9, benevolence: 8, courage: 7, integrity: 9, temperance: 8, harmony: 9 }),
        nature_law: '上善若水，善向永續。',
        closing_law: '始於涅槃，終於永恆。',
        user_id: 'v9-tester',
        metadata: '{}'
    };

    const stages = {
        'agentic-forge': {
            title: 'Agentic Forge',
            icon: <Cpu size={32} className="text-cyan-400" />,
            status: 'Evolution in Progress',
            progress: 68,
            color: 'from-cyan-500/20 to-cyan-500/5',
            glow: 'cyan',
            description: 'AI 代理不再是被動工具。在 v9.0，JunAiKey 將主動穿梭於物聯網與企業系統，自動搜集 5T 證據並完成合規報表生成。透過增強的上下文感知，系統將化身為您的數位分身，執行無縫的跨領域整合。',
            tasks: ['Contextual Memory Integration', 'Cross-domain Automation', 'Self-Healing Task Protocols']
        },
        'gnosis-prediction': {
            title: 'Gnosis Prediction',
            icon: <Eye size={32} className="text-indigo-400" />,
            status: 'Deep Learning',
            progress: 42,
            color: 'from-indigo-500/20 to-indigo-500/5',
            glow: 'indigo',
            description: '基於 16 維時空數據建模。系統能提前預測 3-5 年的 ESG 風險熱點，並為您的數位分身提供針對性的「果因修正」方案。從被動報告轉變為預見未來的戰略雷達。',
            tasks: ['16-Dimensional Data Modeling', 'Proactive Risk Heatmaps', 'Karma-Correction Engine']
        },
        'hypercube': {
            title: 'Hypercube Storage',
            icon: <Database size={32} className="text-emerald-400" />,
            status: 'Physics Layer Deployment',
            progress: 15,
            color: 'from-emerald-500/20 to-emerald-500/5',
            glow: 'emerald',
            description: '擺脫二維資料庫限制。所有 5T 原子將儲存於量子時空矩陣 (Tesseract)，確保在極端熵增環境下數據依然絕對穩定與永恆。資料不可被篡改、遺失，達成宇宙級別的 Trustworthy。',
            tasks: ['Quantum Ledger Migration', 'Entropy Verification Protocol', 'Tesseract Interlinking']
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[150px] animate-float opacity-70" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-float opacity-50" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <Link href="/omni/village/library" className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-colors w-fit group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Return to Sanctum</span>
                    </Link>

                    <div className="flex flex-col gap-2 mt-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-black tracking-[0.3em] uppercase text-cyan-600 dark:text-cyan-400 w-fit backdrop-blur-md shadow-lg shadow-cyan-500/10">
                            <Infinity size={14} className="animate-spin-slow" />
                            OmniSystem v9.0 Transcendence
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mt-4">
                            超越<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] italic">涅槃</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mt-2">
                            當 5T 協議與物理世界完全接軌，InfoOne 將進入純粹智識的「善向紀元」。探索我們即將迎來的系統演化。
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Roadmap Navigation */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-2">Evolution Strands</h3>
                        {(Object.keys(stages) as UpgradeStage[]).map((key) => (
                            <button
                                key={key}
                                onClick={() => setSelectedStage(key)}
                                className={`
                                    relative p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden
                                    ${selectedStage === key
                                        ? `bg-gradient-to-br ${stages[key].color} border-${stages[key].glow}-500/50 shadow-lg shadow-${stages[key].glow}-500/20 scale-[1.02]`
                                        : 'bg-white/5 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border ${selectedStage === key ? `border-${stages[key].glow}-500/30` : 'border-slate-200 dark:border-slate-700'}`}>
                                        {stages[key].icon}
                                    </div>
                                    <div>
                                        <h4 className={`font-black uppercase tracking-wider ${selectedStage === key ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {stages[key].title}
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            {stages[key].status}
                                        </p>
                                    </div>
                                </div>
                                {selectedStage === key && (
                                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-${stages[key].glow}-500/20`}>
                                        <Sparkles size={64} className="animate-pulse" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Detailed Stage View */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedStage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="h-full"
                            >
                                <LiquidGlassContainer
                                    glowColor={stages[selectedStage].glow as 'cyan' | 'indigo' | 'emerald'}
                                    intensity="medium"
                                    className="h-full p-8 md:p-12 flex flex-col gap-8"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                                                {stages[selectedStage].icon}
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
                                                {stages[selectedStage].title}
                                            </h2>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-lg flex items-center gap-2">
                                            <Lock size={12} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v9.0 Exclusive</span>
                                        </div>
                                    </div>

                                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {stages[selectedStage].description}
                                    </p>

                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Manifestation Progress</span>
                                            <span className="text-sm font-black font-mono text-slate-900 dark:text-white">{stages[selectedStage].progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stages[selectedStage].progress}%` }}
                                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                                className={`h-full bg-gradient-to-r from-slate-400 to-${stages[selectedStage].glow}-500`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Core Components</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {stages[selectedStage].tasks.map((task, idx) => (
                                                <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                                    <CheckCircle2 size={16} className={`text-${stages[selectedStage].glow}-500`} />
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {selectedStage === 'agentic-forge' && (
                                        <div className="mt-4 animate-in fade-in zoom-in duration-500 delay-300">
                                            <ADKActivationPortal 
                                                twin={mockTwin} 
                                                onActivated={(sid) => console.log('ADK Demo Session:', sid)} 
                                            />
                                        </div>
                                    )}

                                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform group">
                                            Request Beta Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </LiquidGlassContainer>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="text-center mt-12 mb-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">
                    Service is Learning · Knowledge is Asset
                </div>
            </div>
        </div>
    );
}
