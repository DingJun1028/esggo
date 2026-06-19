'use client';

import React, { useState, useEffect } from 'react';
import { OmniEsgCell } from './cards/OmniEsgCell';
import { OmniIcon } from './icons';
import FunnelChart from '../charts/FunnelChart';
import GanttChart from '../charts/GanttChart';
import GnosisHeatmap from '../charts/GnosisHeatmap';
import { OmniAnalyticsEngine } from '../../core/omni-analytics-engine';
import { LiquidGlassContainer } from './liquid-glass/LiquidGlassContainer';
import { motion } from 'framer-motion';
import { AgentPulse } from './intelligence/AgentPulse';

export const OmniDashboard: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [metrics, setMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const engine = OmniAnalyticsEngine.getInstance();
                const s = await engine.generateSummary();
                const m = await engine.getAllMetrics();
                setSummary(s);
                setMetrics(m);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const mockFunnelData = React.useMemo(() => [
        { name: 'Awareness', value: 1000, fill: 'var(--theme-primary)' },
        { name: 'Interest', value: 800, fill: 'var(--theme-primary)' },
        { name: 'Decision', value: 600, fill: 'var(--theme-primary)' },
        { name: 'Action', value: 400, fill: 'var(--theme-accent)' },
    ], []);

    const mockGanttTasks = React.useMemo(() => [
        { id: '1', name: 'Phase A: Manifestation', start: 0, duration: 25, status: 'Completed' as const, element: 'Water' as const },
        { id: '2', name: 'Phase B: Evolution', start: 25, duration: 30, status: 'Active' as const, element: 'Wood' as const },
        { id: '3', name: 'Phase C: Transcendence', start: 55, duration: 25, status: 'Planned' as const, element: 'Gold' as const },
        { id: '4', name: 'Phase D: Nirvana', start: 80, duration: 20, status: 'Planned' as const, element: 'Fire' as const },
    ], []);

    const mockHeatmapData = React.useMemo(() => [
        { id: 'n1', name: 'Decision Engine', intensity: 0.9, dimension: 'Omni-Core', status: 'Stable' as const },
        { id: 'n2', name: 'Nexus API', intensity: 0.4, dimension: 'Omni-Rune', status: 'Stable' as const },
        { id: 'n3', name: 'Task Dispatch', intensity: 0.6, dimension: 'Omni-Agent', status: 'Stable' as const },
        { id: 'n4', name: 'Wisdom Vault', intensity: 0.95, dimension: 'Omni-Knowledge', status: 'Stable' as const },
        { id: 'n5', name: 'Delta Sync', intensity: 0.3, dimension: 'Omni-Sync', status: 'Stable' as const },
        { id: 'n6', name: 'Interface Flow', intensity: 0.5, dimension: 'Omni-Interface', status: 'Stable' as const },
        { id: 'n7', name: 'Evo Loop', intensity: 0.8, dimension: 'Omni-Evolution', status: 'Stable' as const },
        { id: 'n8', name: 'Zen Monitor', intensity: 0.2, dimension: 'Omni-Monitoring', status: 'Stable' as const },
        { id: 'n9', name: 'Shield Domain', intensity: 0.1, dimension: 'Omni-Security', status: 'Stable' as const },
        { id: 'n10', name: 'Meta Forge', intensity: 0.7, dimension: 'Omni-Meta', status: 'Stable' as const },
        { id: 'n11', name: 'Tag Matrix', intensity: 0.45, dimension: 'Omni-Tag', status: 'Stable' as const },
        { id: 'n12', name: 'Liquid Glass', intensity: 0.85, dimension: 'Omni-Theme', status: 'Stable' as const },
    ], []);

    if (loading) return (
        <div className="min-h-screen bg-omni-bg flex items-center justify-center">
            <div className="text-[var(--theme-primary)] font-black tracking-[0.3em] text-2xl uppercase">LOADING QUANTUM MATRIX...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-omni-bg p-8 font-sans text-omni-text-main">
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[var(--theme-primary)]/10 flex items-center justify-center border border-[var(--theme-primary)]/30 shadow-sm">
                        <OmniIcon name="Eternal" size={28} className="text-omni-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight uppercase text-omni-primary">OMNI QUANTUM DASHBOARD</h1>
                        <p className="text-omni-text-muted text-xs font-bold uppercase tracking-[0.3em] mt-1">
                            Real-time ESG intelligence matrix powered by 5T Protocol
                        </p>
                    </div>
                </div>

                {/* [HEP] Hypercube Evolution Status Bar */}
                <LiquidGlassContainer className="mt-8 p-6 flex flex-wrap gap-8 items-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-omni-primary/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-optimal)] border border-[var(--color-optimal)]/20" />
                        <span className="text-xs font-black text-omni-text-main uppercase tracking-widest">HEP_V11_ACTIVE</span>
                    </div>
                    <div className="h-6 w-[1px] bg-omni-glass-border hidden md:block" />
                    <div className="flex-grow max-w-xs space-y-2 relative z-10">
                        <div className="flex justify-between text-[10px] font-bold text-omni-text-muted uppercase tracking-wider">
                            <span>System Harmony</span>
                            <span className="text-omni-primary">{summary?.esgScore || 94}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-omni-surface-2 rounded-full overflow-hidden border border-omni-glass-border">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${summary?.esgScore || 94}%` }}
                                className="h-full bg-[var(--theme-primary)]"
                            />
                        </div>
                    </div>
                    <div className="flex-grow max-w-xs space-y-2 relative z-10">
                        <div className="flex justify-between text-[10px] font-bold text-omni-text-muted uppercase tracking-wider">
                            <span>Entropy Level</span>
                            <span className="text-rose-400 font-mono">{summary?.trendIndicator ? (summary.trendIndicator / 10).toFixed(2) : '0.06'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-omni-surface-2 rounded-full overflow-hidden border border-omni-glass-border">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(summary?.trendIndicator || 0.6) * 10}%` }}
                                className="h-full bg-[var(--color-lethal)]"
                            />
                        </div>
                    </div>
                    <div className="ml-auto text-xs font-black text-omni-accent relative z-10 tracking-[0.2em]">
                        PHASE: <span className="text-omni-text-main font-mono">SENTIENT_{summary?.riskLevel?.toUpperCase() || 'NIRVANA'}</span>
                    </div>
                </LiquidGlassContainer>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Quantum Analytics Section (Charts) */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-omni-primary">Quantum Analytics</h2>
                        <div className="h-[1px] flex-grow mx-8 bg-omni-glass-border" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                        <div className="space-y-10">
                            <LiquidGlassContainer className="p-8 border-omni-primary/20 bg-white/40">
                                <div className="mb-6">
                                    <h3 className="text-xs font-black text-omni-primary uppercase tracking-[0.2em]">Intel Synergy Monitor</h3>
                                    <p className="text-[10px] text-omni-text-muted uppercase tracking-widest font-mono mt-1">Real-time Agentic Resonance</p>
                                </div>
                                <AgentPulse />
                            </LiquidGlassContainer>
                            <LiquidGlassContainer className="p-8">
                                <FunnelChart data={mockFunnelData} title="Action Convergence Funnel" />
                            </LiquidGlassContainer>
                        </div>
                        <div className="flex flex-col h-full">
                            <LiquidGlassContainer className="p-8 h-full">
                                <GanttChart tasks={mockGanttTasks} title="Universal Evolution Genesis" />
                            </LiquidGlassContainer>
                        </div>
                    </div>
                </section>

                {/* Grid Section (Cells) */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-omni-primary">Quantum Cells</h2>
                        <div className="h-[1px] flex-grow mx-8 bg-omni-glass-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metrics.map(cell => (
                            <OmniEsgCell
                                key={cell.id}
                                id={cell.id}
                                title={cell.name}
                                value={cell.value.toString()}
                                unit={cell.unit}
                                category={cell.category.charAt(0).toUpperCase() + cell.category.slice(1) as any}
                                icon={cell.category === 'environmental' ? 'Leaf' : 'Globe'}
                                confidence={95}
                                dataSource="ai"
                                lastUpdated="Just now"
                                trend={cell.trend}
                                mode="card"
                            />
                        ))}
                    </div>
                </section>

                {/* List Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-omni-primary">Operational Insight</h2>
                        <div className="h-[1px] flex-grow mx-8 bg-omni-glass-border" />
                    </div>
                    <div className="flex flex-col gap-4">
                        {metrics.map(cell => (
                            <OmniEsgCell
                                key={cell.id}
                                id={cell.id}
                                title={cell.name}
                                value={cell.value.toString()}
                                unit={cell.unit}
                                category={cell.category.charAt(0).toUpperCase() + cell.category.slice(1) as any}
                                icon={cell.category === 'environmental' ? 'Leaf' : 'Globe'}
                                confidence={95}
                                dataSource="ai"
                                lastUpdated="Just now"
                                trend={cell.trend}
                                mode="list"
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OmniDashboard;
