import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Globe,
    Zap,
    ShieldAlert,
    Trophy,
    ChevronRight,
    Crosshair,
    Cpu,
    Target,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '@/hooks/useConfirm';
import { strategyService, StrategicPlay } from '@/services/StrategyService';
import { v4 as uuid } from 'uuid';
import { GanttChart } from '@/components/analytics/GanttChart';
import { ImpactHeatmap } from '@/components/analytics/ImpactHeatmap';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { useBehaviorAnalytics } from '@/hooks/useBehaviorAnalytics';

export const StrategicOrchestratorPage: React.FC = () => {
    const navigate = useNavigate();
    const [plays, setPlays] = useState<StrategicPlay[]>([]);
    const [selectedPlay, setSelectedPlay] = useState<StrategicPlay | null>(null);
    const [executing, setExecuting] = useState<string | null>(null);
    const { heatmap: rawHeatmap, isLoading: isHeatmapLoading } = useBehaviorAnalytics();

    useEffect(() => {
        setPlays(strategyService.getSuggestedPlays());
    }, []);

    const confirm = useConfirm();

    const ganttTasks = useMemo(() => [
        { id: '1', label: 'Governance Framework', start: 0, duration: 40, status: 'Complete' as const, type: 'CORE' },
        { id: '2', label: 'Scope 3 Auditing', start: 30, duration: 50, status: 'In Progress' as const, type: 'ESG' },
        { id: '3', label: 'Supply Chain Sync', start: 70, duration: 30, status: 'Planned' as const, type: 'OPS' },
    ], []);

    const heatmapData = useMemo(() => {
        if (!rawHeatmap || rawHeatmap.length === 0) {
            // Fallback to minimal mock if no data yet
            return Array.from({ length: 64 }, (_, i) => ({
                x: i % 8,
                y: Math.floor(i / 8),
                value: 0.1,
                label: 'Initializing...'
            }));
        }
        return rawHeatmap.map(p => ({
            x: Number(p.x),
            y: Number(p.y),
            value: (p.value || 0) / 100, // Normalize to 0-1
            label: (p as any).label || 'Activity'
        }));
    }, [rawHeatmap]);

    const chartCore = useMemo(() => ComponentCoreFactory.create(
        'StrategicOrchestratorCharts',
        '1.0.0',
        ['RiskImpact Analysis', 'Sustainability Roadmap']
    ), []);

    const handleExecute = async (id: string) => {
        const ok = await confirm({
            title: '啟動戰略執行',
            message: '您確定要啟動此戰略任務嗎？這將消耗量子算力並觸發實時環境影響。',
            variant: 'info',
            confirmLabel: '立即啟動',
            cancelLabel: '重新考量',
        });

        if (!ok) return;

        setExecuting(id);
        setTimeout(() => {
            const result = strategyService.executePlay(id);
            if (result.success) {
                setPlays(prev => prev.filter(p => p.id !== id));
                setSelectedPlay(null);
            }
            setExecuting(null);
        }, 2000);
    };

    return (
        <div className="h-screen w-screen text-[var(--tiffany-text)] font-sans relative overflow-hidden bg-black transition-colors duration-500">
            {/* Background World Loom */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1000 600">
                    <path
                        d="M100,300 Q250,100 400,300 T700,300 T1000,100"
                        stroke="#81D8D0"
                        fill="none"
                        strokeWidth="1"
                        className="animate-pulse"
                    />
                    <path
                        d="M0,500 Q300,400 600,500 T900,200"
                        stroke="#D4AF37"
                        fill="none"
                        strokeWidth="0.5"
                    />
                </svg>
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 h-24 bg-black/40 backdrop-blur-md border-b border-[#81D8D0]/10 flex items-center justify-between px-8 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[var(--tiffany-bg)] border border-[var(--tiffany-border)] shadow-lg shadow-[var(--tiffany-blue)]/5">
                            <LayoutDashboard className="w-6 h-6 text-[var(--tiffany-blue)]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">戰略指揮中心</h1>
                            <p className="text-[10px] text-[var(--tiffany-blue)] tracking-[0.2em] uppercase font-medium">行政戰情室 v99.0</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none">共鳴對齊度</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[var(--tiffany-blue)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: '92%' }}
                                />
                            </div>
                            <span className="text-sm font-mono text-[var(--tiffany-blue)] leading-none">92%</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-zinc-800" />
                    <button className="px-4 py-2 bg-[var(--sovereign-gold)]/10 border border-[var(--sovereign-gold)]/30 rounded-lg text-[var(--sovereign-gold)] text-xs font-bold hover:bg-[var(--sovereign-gold)]/20 transition-all flex items-center gap-2">
                        <Trophy className="w-3 h-3" />
                        主權級 ALPHA
                    </button>
                </div>
            </header>

            {/* Main War Room */}
            <main className="absolute inset-0 pt-24 pb-8 px-6 grid grid-cols-12 grid-rows-6 gap-6">

                {/* Left Column: Strategic Map */}
                <section className="col-span-12 lg:col-span-5 row-span-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#81D8D0]/5 to-transparent shadow-inner" />
                    <div className="absolute top-6 left-6 flex items-center gap-2 text-[var(--tiffany-blue)]">
                        <Globe className="w-5 h-5" />
                        <span className="text-xs uppercase tracking-widest font-bold">戰略地圖</span>
                    </div>

                    {/* Heatmap Integration */}
                    <div className="absolute inset-0 p-8 pt-12">
                        <ImpactHeatmap
                            data={heatmapData}
                            xAxisLabel="Risk Magnitude"
                            yAxisLabel="Market Opportunity"
                            core={chartCore}
                        />
                    </div>
                </section>

                {/* Center Top: Correlation Engine */}
                <section className="col-span-12 lg:col-span-4 row-span-2 bg-[#81D8D0]/5 border border-[#81D8D0]/10 rounded-3xl p-6 relative overflow-hidden">
                    <GanttChart
                        tasks={ganttTasks}
                        core={chartCore}
                    />
                </section>

                {/* Center Bottom: Strategy Forge */}
                <section className="col-span-12 lg:col-span-4 row-span-4 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Crosshair className="w-5 h-5 text-[var(--sovereign-gold)]" />
                        <h2 className="text-xs font-bold uppercase tracking-widest">戰略鍛造路徑</h2>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {plays.map((play) => (
                            <motion.button
                                key={play.id}
                                layoutId={play.id}
                                onClick={() => setSelectedPlay(play)}
                                className={`w-full p-4 rounded-2xl border transition-all text-left group relative overflow-hidden ${selectedPlay?.id === play.id
                                    ? 'bg-[var(--sovereign-gold)]/20 border-[var(--sovereign-gold)] shadow-[0_0_20px_var(--sovereign-gold)]/20'
                                    : 'bg-black/40 border-white/5 hover:border-[#D4AF37]/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-bold text-white group-hover:text-[var(--sovereign-gold)] transition-colors">{play.title}</h3>
                                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-black/60 text-zinc-400 border border-white/10 uppercase font-bold tracking-tighter">
                                        {play.type}
                                    </span>
                                </div>
                                <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                                    {play.description}
                                </p>
                                {play.impact === 'HIGH' && (
                                    <div className="absolute top-0 right-0 p-1 bg-[var(--sovereign-gold)] text-black rounded-bl-lg">
                                        <Zap className="w-3 h-3 fill-current" />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedPlay && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-4 pt-4 border-t border-white/10"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldAlert className="w-4 h-4 text-[var(--sovereign-gold)]" />
                                    <span className="text-[10px] uppercase font-bold text-zinc-400">需要執行協議</span>
                                </div>
                                <button
                                    onClick={() => handleExecute(selectedPlay.id)}
                                    disabled={executing !== null}
                                    className="w-full py-3 bg-[var(--sovereign-gold)] text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {executing === selectedPlay.id ? (
                                        <>
                                            <motion.div
                                                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                            啟動中...
                                        </>
                                    ) : (
                                        <>執行戰略 <ChevronRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Right Column: Impact Log */}
                <section className="col-span-12 lg:col-span-3 row-span-6 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-5 h-5 text-[var(--tiffany-blue)]" />
                        <h2 className="text-xs font-bold uppercase tracking-widest">影響力日誌</h2>
                    </div>

                    <div className="flex-1 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-20px] before:w-px before:bg-zinc-800 last:before:hidden">
                                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[var(--tiffany-blue)] shadow-[0_0_8px_var(--tiffany-blue)]" />
                                <span className="text-[9px] font-mono text-zinc-500">14:2{i} - T-CORE</span>
                                <h4 className="text-[11px] font-bold text-zinc-300 mt-1 uppercase">達成戰略共鳴</h4>
                                <p className="text-[10px] text-zinc-500 mt-1">核心優化後系統延遲降低了 4ms。</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom Status Bar */}
            <footer className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 border-t border-white/5 flex items-center justify-between px-8 text-[9px] uppercase tracking-[0.2em] font-medium text-zinc-500">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> S-NET 在線</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 關聯安全</span>
                </div>
                <span>奧米戰略指揮中心 // 完成第 99 階段</span>
            </footer>
        </div >
    );
};
export default StrategicOrchestratorPage;
