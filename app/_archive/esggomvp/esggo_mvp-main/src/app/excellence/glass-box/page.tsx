'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, ArrowRight, AlertTriangle, CheckCircle, Search,
    Database, Fingerprint, Eye, ShieldCheck, Info, HelpCircle,
    Settings2, Activity
} from 'lucide-react';

/**
 * 💡 Glass Box Inspector
 * 貫徹「服務即教學，知識即資產」：
 * 每一項數據的計算不再是黑箱，而是透明、可驗證、且具備教育價值的知識原子。
 */
export default function GlassBoxInspector() {
    const [inputValue, setInputValue] = useState(45210); // 活動數據 (Activity Data)
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [anomaly, setAnomaly] = useState(false);
    const [factor, setFactor] = useState(0.495); // 排放係數 (Emission Factor)
    const [showGuidance, setShowGuidance] = useState(false);
    const [showFormulaDetails, setShowFormulaDetails] = useState(false);

    // 零幻覺驗算公式：E = AD × EF × GWP
    // E: Emission, AD: Activity Data, EF: Emission Factor, GWP: Global Warming Potential
    const GWP = 1; // CO2 的 GWP 為 1

    const currentResult = useMemo(() => {
        return parseFloat((inputValue * factor * GWP).toFixed(2));
    }, [inputValue, factor]);

    const runVerification = () => {
        setCalculating(true);
        setResult(null);
        setAnomaly(false);

        // 模擬物理引擎處理與 5T 驗證過程
        setTimeout(() => {
            setResult(currentResult);
            if (inputValue > 60000) {
                setAnomaly(true);
            }
            setCalculating(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-main)] py-12 px-6">
            <div className="max-w-6xl mx-auto relative">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-[var(--theme-text-main)] uppercase tracking-tighter flex items-center gap-3">
                            <div className="p-2 bg-aqua/20 rounded-lg border border-aqua/30">
                                <Eye className="text-aqua" size={32} />
                            </div>
                            Glass Box <span className="text-aqua">Inspector</span>
                        </h1>
                        <p className="text-[var(--theme-text-muted)] font-bold tracking-[0.2em] uppercase text-[10px] mt-2 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-aqua" />
                            Zero Hallucination Logic Engine · v12.5.0
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowGuidance(!showGuidance)}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] rounded-full transition-all text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-main)] shadow-sm"
                        >
                            <HelpCircle size={14} className={showGuidance ? "text-aqua" : "text-[var(--theme-text-muted)]"} />
                            Guidance
                        </button>
                    </div>
                </div>

                {/* Global Guidance Overlay */}
                <AnimatePresence>
                    {showGuidance && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-6 bg-aqua/10 border border-aqua/30 rounded-3xl backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Info size={120} className="text-aqua" />
                            </div>
                            <h4 className="text-aqua font-black uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                                <Info size={16} /> 服務即教學：透視計算本質
                            </h4>
                            <p className="text-xs text-aqua/80 leading-relaxed max-w-3xl">
                                歡迎來到 Glass Box。在這裡，我們不只給您結果，我們展示<b>「如何計算」</b>。
                                所有的數據排放皆遵循國際法規標準，透過透明的 $E = AD \times EF$ 公式，
                                將抽象的活動轉換為具體的環境資產。點擊組件上的 <Info size={10} className="inline" /> 圖示以瞭解各環節的邏輯。
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 1. Activity Data (Source) */}
                    <div className="group relative p-8 rounded-[2rem] bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] hover:border-aqua/50 transition-all shadow-xl">
                        <div className="absolute top-4 right-4 text-[var(--theme-text-muted)] group-hover:text-aqua transition-colors">
                            <button
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                title="數據溯源說明"
                                onClick={() => alert("Activity Data (AD): 來自物聯網感測器或帳單之原始能源消耗量。")}
                            >
                                <Info size={18} />
                            </button>
                        </div>

                        <div className="mb-8 flex items-center justify-between opacity-50">
                            <Database size={16} />
                            <span className="text-[10px] uppercase tracking-widest font-black">Step 01 / Input</span>
                        </div>

                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            活動數據 <span className="text-[10px] opacity-50">(AD)</span>
                        </h3>

                        <div className="relative mb-6">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(Number(e.target.value))}
                                className="w-full bg-[var(--theme-surface)] border-2 border-[var(--theme-glass-border)] rounded-2xl px-4 py-8 text-5xl font-black text-[var(--theme-text-main)] focus:outline-none focus:border-aqua transition-all text-center placeholder:text-[var(--theme-text-muted)] shadow-inner"
                            />
                            <span className="absolute bottom-4 right-6 text-xs font-black text-[var(--theme-text-muted)] uppercase tracking-widest">kWh</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">
                                <span>變數模擬 (Variable Simulator)</span>
                                <span className="text-aqua">{inputValue.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="500"
                                value={inputValue}
                                onChange={(e) => setInputValue(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-aqua"
                            />
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--theme-glass-border)] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-aqua/60">
                                <Fingerprint size={14} />
                                <span className="text-[9px] font-mono tracking-tighter text-[var(--theme-text-sub)]">0x9f3d...b72a</span>
                            </div>
                            <div className="text-[8px] text-[var(--theme-text-muted)] uppercase font-black">Source: IoT Sensor Alpha-1</div>
                        </div>
                    </div>

                    {/* 2. Factor Engine (Resolution) */}
                    <div className="p-8 rounded-[2rem] bg-aqua/5 border-2 border-aqua/20 flex flex-col justify-between relative overflow-hidden group">
                        {calculating && (
                            <motion.div
                                className="absolute inset-0 bg-aqua/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                            />
                        )}

                        <div>
                            <div className="mb-8 flex items-center justify-between text-aqua">
                                <div className="p-2 bg-aqua/10 rounded-lg">
                                    <Calculator size={18} />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-black">Step 02 / Factor</span>
                            </div>

                            <div className="text-center space-y-6">
                                <div className="relative inline-block">
                                    <Settings2 size={48} className={`mx-auto ${calculating ? 'text-aqua animate-spin' : 'text-aqua/40'}`} style={{ animationDuration: '3s' }} />
                                    {calculating && (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            <Search size={20} className="text-white" />
                                        </motion.div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-[var(--theme-text-main)] uppercase tracking-widest mb-2">係數解析 (EF)</h3>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--theme-surface)] rounded-full border border-[var(--theme-glass-border)]">
                                        <span className="text-[8px] text-[var(--theme-text-muted)] font-black uppercase tracking-widest">Global Database</span>
                                        <span className="text-[10px] text-aqua font-black">IPCC v6.0</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-[var(--theme-surface)]/60 rounded-2xl border border-aqua/30 backdrop-blur-md shadow-inner">
                                    <span className="block text-[10px] text-[var(--theme-text-muted)] uppercase tracking-widest mb-3 font-black flex items-center justify-center gap-1">
                                        當前排放係數 (Emission Factor)
                                        <button onClick={() => alert("排放係數 (EF): 單位能源所產生的溫室氣體當量。")}><HelpCircle size={10} /></button>
                                    </span>
                                    <div className="flex items-end justify-center gap-2">
                                        <span className="text-5xl font-black text-aqua tracking-tighter">{factor}</span>
                                    </div>
                                    <span className="block text-[10px] text-aqua/60 mt-3 font-mono">kgCO2e / kWh</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={runVerification}
                            disabled={calculating}
                            className={`mt-8 w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all relative overflow-hidden group ${calculating
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-aqua text-black hover:bg-white hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(99,166,176,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {calculating ? 'Verifying...' : 'Execute Logic'}
                                {!calculating && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </div>

                    {/* 3. Result & Formula (Output) */}
                    <div className="p-8 rounded-[2rem] bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] flex flex-col justify-between group shadow-xl">
                        <div>
                            <div className="mb-8 flex items-center justify-between opacity-50 text-[var(--theme-text-muted)]">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] uppercase tracking-widest font-black">Step 03 / Result</span>
                            </div>

                            <div className="text-center mb-10">
                                <button
                                    onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                                    className="mb-4 text-[10px] text-[var(--theme-text-sub)] font-black uppercase tracking-widest hover:text-aqua transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <Calculator size={12} />
                                    透明驗算公式 (Gnosis Formula)
                                </button>

                                <motion.div
                                    className="p-4 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-glass-border)] font-mono text-[var(--theme-text-main)] text-lg relative group cursor-help shadow-inner"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                                >
                                    <span className="text-aqua">E</span> = AD &times; EF &times; GWP
                                </motion.div>

                                <AnimatePresence>
                                    {showFormulaDetails && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 p-4 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-glass-border)] text-left space-y-2 shadow-sm">
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-[var(--theme-text-muted)] font-bold uppercase tracking-widest">AD (kWh)</span>
                                                    <span className="text-[var(--theme-text-main)] font-mono">{inputValue.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-[var(--theme-text-muted)] font-bold uppercase tracking-widest">EF (kg/kWh)</span>
                                                    <span className="text-[var(--theme-text-main)] font-mono">{factor}</span>
                                                </div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-[var(--theme-text-muted)] font-bold uppercase tracking-widest">GWP (CO2)</span>
                                                    <span className="text-[var(--theme-text-main)] font-mono">{GWP}</span>
                                                </div>
                                                <div className="pt-2 border-t border-[var(--theme-glass-border)] flex justify-between text-xs">
                                                    <span className="text-aqua font-black uppercase tracking-widest">Calculation</span>
                                                    <span className="text-aqua font-mono font-bold">
                                                        {inputValue.toLocaleString()} &times; {factor} &times; {GWP}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center min-h-[220px]">
                            <AnimatePresence mode="wait">
                                {result !== null ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: 'spring', damping: 20 }}
                                        className="text-center space-y-4"
                                    >
                                        <div className="relative inline-block">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-7xl font-black text-[var(--theme-text-main)] tracking-tighter"
                                            >
                                                {result.toLocaleString()}
                                            </motion.div>
                                            <div className="absolute -top-4 -right-8 p-1.5 bg-green-500 rounded-full border-4 border-[var(--theme-bg)] shadow-md">
                                                <CheckCircle size={16} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="text-sm font-black text-[var(--theme-text-muted)] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                            <span className="w-8 h-[1px] bg-[var(--theme-glass-border)]"></span>
                                            kgCO2e Total
                                            <span className="w-8 h-[1px] bg-[var(--theme-glass-border)]"></span>
                                        </div>

                                        {anomaly ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-8 p-5 rounded-3xl bg-red-500/10 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.15)] overflow-hidden relative"
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-red-500/5"
                                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-center gap-2 text-red-500 mb-3">
                                                        <AlertTriangle size={20} className="animate-bounce" />
                                                        <h4 className="text-xs font-black uppercase tracking-widest">Anomaly Guard Triggered</h4>
                                                    </div>
                                                    <p className="text-[10px] text-red-400 font-bold leading-relaxed mb-5">
                                                        當前排放量高於場域基準值 +33%。<br />「全知總表」要求進行額外的人造證據複核。
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 py-3 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-400 transition-colors">
                                                            Flag Issue
                                                        </button>
                                                        <button className="flex-1 py-3 bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors">
                                                            Dismiss
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-8 p-6 rounded-3xl bg-green-500/10 border-2 border-green-500 text-green-400 relative overflow-hidden"
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-green-500/5"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                                />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <Activity size={16} />
                                                        <h4 className="text-xs font-black uppercase tracking-widest">Trust Integrity: 99.9%</h4>
                                                    </div>
                                                    <p className="text-[9px] opacity-80 uppercase font-black tracking-widest">Validated & Ready for Sealing</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center"
                                    >
                                        <div className="w-24 h-24 mx-auto border-4 border-dashed border-[var(--theme-glass-border)] rounded-full flex items-center justify-center mb-6 shadow-inner">
                                            <ArrowRight size={32} className="text-[var(--theme-text-muted)] opacity-20" />
                                        </div>
                                        <p className="text-[10px] text-[var(--theme-text-muted)] font-black uppercase tracking-widest">Waiting for Execution Protocol</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-6 px-8 py-4 bg-[var(--theme-surface)] rounded-full border border-[var(--theme-glass-border)] backdrop-blur-md shadow-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">Node Status: <span className="text-[var(--theme-text-main)] font-black">Active</span></span>
                        </div>
                        <div className="w-[1px] h-4 bg-[var(--theme-glass-border)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">Last Seal: <span className="text-[var(--theme-text-main)] font-black">2026-03-03 15:30</span></span>
                        <div className="w-[1px] h-4 bg-[var(--theme-glass-border)]" />
                        <div className="flex items-center gap-2 text-aqua hover:text-[var(--theme-text-main)] cursor-pointer transition-colors px-2">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Verification Logs</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
