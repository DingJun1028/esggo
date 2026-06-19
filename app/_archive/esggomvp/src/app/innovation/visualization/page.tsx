'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart4, LayoutGrid, Zap, Shield, Database } from 'lucide-react';
import FunnelChart from '@/components/charts/FunnelChart';
import GanttChart from '@/components/charts/GanttChart';
import GnosisHeatmap from '@/components/charts/GnosisHeatmap';

const funnelData = [
    { name: 'Awareness', value: 1000, fill: '#63a6b0' },
    { name: 'Engagement', value: 800, fill: '#55b4c1' },
    { name: 'Consideration', value: 600, fill: '#48c2d2' },
    { name: 'Action', value: 400, fill: '#3bd0e3' },
    { name: 'Retention', value: 200, fill: '#ffd700' },
];

const ganttTasks: any[] = [
    { id: '1', name: 'Scope 1 Audit', start: 0, duration: 40, status: 'Completed', color: '#63a6b0' },
    { id: '2', name: 'Supply Chain Sync', start: 30, duration: 50, status: 'Active', color: '#ffd700' },
    { id: '3', name: 'Green Financing', start: 70, duration: 30, status: 'Planned', color: '#52C41A' },
];

const heatmapData = Array.from({ length: 25 }, (_, i) => ({
    id: String(i),
    name: `Sector ${i}`,
    intensity: Math.random(),
    dimension: `${Math.floor(Math.random() * 100)}% Risk`,
    status: Math.random() > 0.8 ? 'Critical' : 'Stable' as any,
}));

export default function VisualizationPage() {
    const [activeTab, setActiveTab] = useState<'charts' | 'resonance'>('charts');

    return (
        <div className="min-h-screen pb-20">
            <PageHeader
                title="視覺化與系統共鳴 (Visualization & Resonance)"
                subtitle="探索 InfoOne 的高效能數據引擎與視覺美學。"
                category="數據創新"
            />

            <main className="max-w-7xl mx-auto px-6 mt-12">
                {/* Tab Switcher */}
                <div className="flex gap-4 mb-16 justify-center">
                    {[
                        { id: 'charts', label: 'Premium Charts', icon: LayoutGrid },
                        { id: 'resonance', label: 'System Resonance', icon: Activity },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-4 rounded-full flex items-center gap-3 transition-all font-black uppercase tracking-widest text-[10px] ${activeTab === tab.id
                                ? 'bg-aqua text-black shadow-[0_0_20px_rgba(99,166,176,0.5)]'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'charts' ? (
                        <motion.div
                            key="charts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            <FunnelChart data={funnelData} title="Conversion Resonance (5T)" />
                            <HeatmapSection />
                            <div className="lg:col-span-2">
                                <GanttChart tasks={ganttTasks} title="ESG Transcendence Timeline" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="resonance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <ResonanceMetric icon={<Zap />} label="Signal Purity" value="99.9%" status="PERFECT" />
                            <ResonanceMetric icon={<Shield />} label="5T Integrity" value="Trustworthy" status="LOCKED" />
                            <ResonanceMetric icon={<Database />} label="L2 Redis Link" value="STABLE" status="CONNECTED" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function HeatmapSection() {
    return <GnosisHeatmap data={heatmapData} title="Global Impact Heatmap" />;
}

function ResonanceMetric({ icon, label, value, status }: any) {
    return (
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 liquid-glass relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:text-aqua transition-all">
                {icon}
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">{label}</p>
            <h4 className="text-3xl font-black text-white italic uppercase mb-2">{value}</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aqua/10 border border-aqua/30">
                <div className="size-1.5 bg-aqua rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-aqua uppercase tracking-widest">{status}</span>
            </div>
        </div>
    );
}
