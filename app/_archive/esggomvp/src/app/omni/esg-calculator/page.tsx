'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Target, Terminal, Leaf, Info, RefreshCw } from 'lucide-react';
import { StandardCalculator, type TScope2Params, type ICalculationResult } from '@/core/utils/omni-calculator';

export default function ESGCalculatorPage() {
    const [params, setParams] = useState<TScope2Params>({
        purchasedElectricityMWh: 1000,
        gridEmissionFactorKgCO2ePerMWh: 0.495,
        renewableElectricityMWh: 0
    });

    const [result, setResult] = useState<ICalculationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        try {
            setError(null);
            const res = StandardCalculator.calculateScope2Emissions(params);
            setResult(res);
        } catch (e: any) {
            setResult(null);
            if (e.errors) {
                setError(e.errors[0].message);
            } else {
                setError("輸入參數錯誤");
            }
        }
    };

    return (
        <div className="min-h-screen bg-omni-bg text-white p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-omni-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

            <div className="w-full max-w-5xl z-10">
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-omni-primary/10 border border-omni-primary/20 text-xs font-black tracking-widest uppercase text-omni-primary mb-6">
                        <Terminal size={14} />
                        TS-Resonance Engine Active
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
                        <span className="text-omni-primary drop-shadow-[0_0_20px_rgba(0,163,163,0.5)]">TRANSPARENT</span> CALCULATOR
                    </h1>
                    <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
                        「英碼繁博映射引擎」示範：透明驗算介面。<br />
                        將演算法邏輯以 TypeScript 純函數及 Zod 合約防禦呈現，消除黑箱作業。
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 左側：輸入表單與 Zod 防線 */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                            <div className="p-2 rounded-lg bg-white/10">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold">範疇二 (Scope 2) 市場基準法</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400">總採購電量 (MWh)</label>
                                <input
                                    type="number"
                                    value={params.purchasedElectricityMWh}
                                    onChange={e => setParams(p => ({ ...p, purchasedElectricityMWh: Number(e.target.value) }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-primary/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400">電網排放係數 (kgCO2e/MWh)</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    value={params.gridEmissionFactorKgCO2ePerMWh}
                                    onChange={e => setParams(p => ({ ...p, gridEmissionFactorKgCO2ePerMWh: Number(e.target.value) }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-primary/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400">綠電使用量 (MWh) - 可抵減</label>
                                <input
                                    type="number"
                                    value={params.renewableElectricityMWh}
                                    onChange={e => setParams(p => ({ ...p, renewableElectricityMWh: Number(e.target.value) }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-omni-primary/50 transition-colors"
                                />
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-lg flex items-center gap-2"
                                    >
                                        <Info className="w-4 h-4" />
                                        Zod 驗算攔截：{error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleCalculate}
                                className="w-full mt-4 bg-omni-primary hover:bg-omni-primary/90 text-black font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02]"
                            >
                                <RefreshCw className="w-5 h-5" />
                                執行透明驗算
                            </button>
                        </div>
                    </div>

                    {/* 右側：計算結果與透明公式 */}
                    <div className="flex flex-col gap-6">
                        {/* 算式透明解析區 */}
                        <div className="bg-black/60 border border-white/5 rounded-3xl p-8 flex-1">
                            <div className="flex items-center gap-2 mb-6">
                                <Target className="w-5 h-5 text-omni-primary" />
                                <h3 className="font-bold text-white/80">演算模型透視</h3>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-white/40 mb-1 text-xs uppercase tracking-wider">Formula / 公式</div>
                                    <div className="text-emerald-400">
                                        E_total = (E_purchased - E_renewable) × EF_grid
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-white/40 mb-1 text-xs uppercase tracking-wider">TypeScript Pure Function</div>
                                    <pre className="text-white/60 text-[10px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                        {`static calculateScope2Emissions(params): Result {
  // Zod Validation
  const validated = Schema.parse(params);
  
  // Core Business Logic
  const net = validated.purchased - validated.renewable;
  return net * validated.gridEmissionFactor;
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* 運算結果展示 */}
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-omni-primary/20 to-teal-900/40 border border-omni-primary/30 rounded-3xl p-8 relative overflow-hidden"
                                >
                                    <div className="absolute -right-10 -bottom-10 opacity-10">
                                        <Leaf className="w-48 h-48 text-omni-primary" />
                                    </div>
                                    <h3 className="text-sm font-black text-omni-primary uppercase tracking-widest mb-2">Total Emissions</h3>
                                    <div className="flex items-end gap-3 font-mono">
                                        <span className="text-5xl md:text-6xl font-light text-white tracking-tighter">
                                            {result.totalEmissionsKgCO2e.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-lg text-white/50 mb-2">kgCO2e</span>
                                    </div>
                                    <p className="text-sm text-white/60 mt-4 leading-relaxed">
                                        {result.description} <br /> 公式：{result.formula}
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex items-center justify-center min-h-[200px] text-white/30 text-sm font-mono border-dashed">
                                    等待執行驗算...
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
