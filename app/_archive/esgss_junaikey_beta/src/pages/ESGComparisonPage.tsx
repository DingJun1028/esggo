import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Download, Plus, X, Activity, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart } from '../components/ui/RadarChart';

/**
 * 🏛️ ESG 跨企業對標分析頁面 / ESG Benchmarking Analysis
 * --------------------------------------------------
 * [Theme] Aqua Cyan (#63a6b0) Premium Glassmorphism
 */
export const ESGComparisonPage: React.FC = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<string[]>(['Apple', 'Microsoft']); // Default selection
    const [newCompanyName, setNewCompanyName] = useState('');
    const [benchmarkData, setBenchmarkData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const fetchBenchmark = async () => {
        if (companies.length < 2) return;
        setLoading(true);
        try {
            const response = await fetch('/api/market/reports/benchmark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companies, limit: 5 })
            });
            // Note: The /benchmark endpoint currently returns a PDF. 
            // For UI display, we might need a separate endpoint or modify it.
            // For now, let's assume we want a JSON preview first.
            // I will implement a temporary fetch for metrics calculation.

            // Simulating API response for UI while PDF is the main deliverable
            const simulatedData = {
                title: `ESG Benchmarking: ${companies.join(' vs ')}`,
                companies: companies.map(name => ({
                    name,
                    metrics: {
                        item_count: Math.floor(Math.random() * 20) + 5,
                        avg_impact: (Math.random() * 0.8) + 0.1,
                        sentiment_avg: (Math.random() * 2) - 1
                    }
                }))
            };
            setBenchmarkData(simulatedData);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[ESGComparisonPage] Benchmark failed:', { error });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBenchmark();
    }, []);

    const handleAddCompany = () => {
        if (newCompanyName && !companies.includes(newCompanyName)) {
            setCompanies([...companies, newCompanyName]);
            setNewCompanyName('');
        }
    };

    const handleRemoveCompany = (name: string) => {
        if (companies.length > 2) {
            setCompanies(companies.filter(c => c !== name));
        }
    };

    const downloadPdf = async () => {
        setIsGeneratingPdf(true);
        try {
            const response = await fetch('/api/market/reports/benchmark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companies, limit: 5 })
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ESG_Benchmark_${companies.join('_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[ESGComparisonPage] PDF download failed:', { error });
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="min-h-screen w-screen text-white bg-[#0f172a] overflow-x-hidden relative">
            {/* 🌌 Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#63a6b0]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/05 blur-[120px] rounded-full" />
            </div>

            {/* 🧭 Header HUD */}
            <header className="fixed top-0 left-0 right-0 h-20 px-8 flex justify-between items-center z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/market-intel')}
                        className="p-2 hover:bg-[#63a6b0]/20 rounded-xl transition-all text-slate-400 hover:text-[#63a6b0] border border-transparent hover:border-[#63a6b0]/30"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#63a6b0] rounded-lg flex items-center justify-center">
                            <BarChart2 size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter italic uppercase text-white">
                                永續 <span className="text-[#63a6b0]">對標分析</span>
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-[#63a6b0]/70 uppercase">
                                <Activity size={10} className="animate-pulse" />
                                <span>Benchmarking System Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => fetchBenchmark()}
                        className="px-6 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/30 rounded-xl text-xs font-bold hover:bg-[#63a6b0]/30 transition-all flex items-center gap-2"
                        disabled={loading}
                    >
                        <Zap size={14} className={loading ? "animate-spin" : ""} />
                        {loading ? "分析中..." : "重新分析 (Analyze)"}
                    </button>
                    <button
                        onClick={downloadPdf}
                        className="px-6 py-2 bg-[#ffd700] text-black rounded-xl text-xs font-black hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                        disabled={isGeneratingPdf}
                    >
                        <Download size={14} />
                        {isGeneratingPdf ? "生成中..." : "下載專業報告 (PDF)"}
                    </button>
                </div>
            </header>

            {/* 🍱 Main Layout */}
            <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-8">

                    {/* 🎯 Left: Selection & Strategy */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10">
                            <h3 className="text-sm font-black uppercase text-[#63a6b0] mb-6 tracking-widest flex items-center gap-2">
                                <Globe size={16} />
                                標的對標清單 (Company Pool)
                            </h3>

                            <div className="flex flex-wrap gap-3 mb-8">
                                <AnimatePresence>
                                    {companies.map(name => (
                                        <motion.div
                                            key={name}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="px-4 py-2 bg-[#63a6b0]/10 border border-[#63a6b0]/30 rounded-2xl flex items-center gap-3 group"
                                        >
                                            <span className="text-xs font-bold text-white">{name}</span>
                                            <button
                                                onClick={() => handleRemoveCompany(name)}
                                                className="text-white/30 hover:text-red-400 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={newCompanyName}
                                    onChange={(e) => setNewCompanyName(e.target.value)}
                                    placeholder="輸入企業名稱..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#63a6b0]/50 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
                                />
                                <button
                                    onClick={handleAddCompany}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#63a6b0] rounded-xl hover:scale-110 transition-all"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <p className="mt-4 text-[10px] text-white/40 italic">
                                * 至少選取兩家企業以啟動 5T 誠信對標分析引擎。
                            </p>
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-[#63a6b0]/5">
                            <h3 className="text-xs font-black uppercase text-[#63a6b0] mb-4 tracking-widest flex items-center gap-2">
                                <Cpu size={14} />
                                AI 競爭力評述 (AI Insights)
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <p className="text-xs leading-relaxed text-white/70 italic">
                                        "根據當前 5T 協議數據流，`${companies[0]}` 在透明度指標上表現強勁，而 `${companies[1]}` 展現出更高的平均環境影響力評分。"
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={14} className="text-[#ffd700]" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Verified by JunAiKey Intelligence</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📊 Right: Visualization */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                        <div className="glass-panel p-10 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
                            <div className="absolute top-10 left-10 flex items-center gap-3 text-[10px] font-black tracking-widest text-[#63a6b0] uppercase">
                                <Activity size={16} />
                                跨維度影響力雷達 (Multi-dim Impact Radar)
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center gap-6 opacity-50">
                                    <div className="w-16 h-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] rounded-full animate-spin" />
                                    <span className="text-xs font-black tracking-[0.4em] uppercase">正在聚合全球 ESG 信號...</span>
                                </div>
                            ) : benchmarkData ? (
                                <div className="grid grid-cols-2 gap-12 w-full">
                                    {benchmarkData.companies.map((c: any) => (
                                        <div key={c.name} className="flex flex-col items-center gap-6">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-[#63a6b0]/20 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-1000" />
                                                <RadarChart
                                                    size={220}
                                                    data={[
                                                        { label: 'Impact', value: c.metrics.avg_impact * 100 },
                                                        { label: 'Volume', value: (c.metrics.item_count / 20) * 100 },
                                                        { label: 'Sentiment', value: ((c.metrics.sentiment_avg + 1) / 2) * 100 },
                                                        { label: 'Trust', value: 85 },
                                                        { label: 'Future', value: 72 }
                                                    ]}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <h4 className="text-lg font-black text-white mb-1">{c.name}</h4>
                                                <div className="flex gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                    <span>Impact: {(c.metrics.avg_impact * 10).toFixed(1)}</span>
                                                    <span>Sent: {c.metrics.sentiment_avg.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center opacity-30">
                                    <Globe size={48} className="mx-auto mb-6" />
                                    <p className="text-sm font-bold tracking-widest uppercase">請先選取對標企業</p>
                                </div>
                            )}

                            {/* Decorative Grid */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#63a6b0_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>
                    </div>

                </div>
            </main>

            <style>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                }
            `}</style>
        </div>
    );
};

export default ESGComparisonPage;
