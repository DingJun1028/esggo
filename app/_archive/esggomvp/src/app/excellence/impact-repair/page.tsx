'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    FlaskConical,
    Zap,
    Waves,
    Heart,
    Search,
    CloudLightning,
    Droplets,
    ActivitySquare,
    Sprout,
    Sparkles,
    Leaf
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import GanttChart from '@/components/charts/GanttChart';
import GnosisHeatmap from '@/components/charts/GnosisHeatmap';
import { OmniBase } from '@/core/OmniBase';

/**
 * 💎 Excellence 2.3: Impact Repair Lab (Awakened Version)
 * Systemic environmental and social restoration simulation with Gantt timelines.
 */
export default function ImpactRepairPage() {
    const { locale } = useLanguage();

    const projects = [
        { id: 1, title: 'Coastal Mangrove Restoration', zh: '海岸紅樹林生態復育', impact: '+12% Bio-Diversity', icon: <Droplets />, status: 'active', timeline: 'Q3 2025 - Q4 2026' },
        { id: 2, title: 'Ethical Supply Chain Healing', zh: '供應鏈倫理修復與補償', impact: '+8% Social SROI', icon: <Heart />, status: 'pending', timeline: 'Q1 2026 - Q2 2026' },
        { id: 3, title: 'Aquifer Recharge Program', zh: '地下含水層人工補給', impact: '+15% Water Index', icon: <Waves />, status: 'active', timeline: 'Q2 2025 - Q1 2027' },
    ];

    // Gantt Chart Data modeling the roadmap for the restorative projects
    const ganttData = [
        { id: '1', name: 'Site Analysis (Mangrove)', start: 0, duration: 15, status: 'Completed' as const, color: 'var(--primary)' },
        { id: '2', name: 'Seedling Procurement', start: 15, duration: 15, status: 'Completed' as const, color: 'var(--primary)' },
        { id: '3', name: 'Phase 1 Planting', start: 30, duration: 60, status: 'Active' as const, color: 'var(--accent)' },
        { id: '4', name: 'Aquifer Geological Scan', start: 0, duration: 30, status: 'Completed' as const, color: '#3b82f6' },
        { id: '5', name: 'Water Injection Wells Setup', start: 30, duration: 60, status: 'Active' as const, color: '#3b82f6' },
        { id: '6', name: 'Social Impact Auditing', start: 60, duration: 30, status: 'Planned' as const, color: '#f43f5e' },
    ];

    const heatmapData = [
        { id: 'H1', name: 'Mangrove Salinity', intensity: 0.85, dimension: 'OMC-Evolution', status: 'Stable' },
        { id: 'H2', name: 'Soil Microbes', intensity: 0.45, dimension: 'OMC-Rune', status: 'Stable' },
        { id: 'H3', name: 'Freshwater Drift', intensity: 0.92, dimension: 'OMC-Monitoring', status: 'Critical' },
        { id: 'H4', name: 'Supply Chain Carbon', intensity: 0.65, dimension: 'OMC-Agent', status: 'Stable' },
        { id: 'H5', name: 'Community Trust', intensity: 0.78, dimension: 'OMC-Security', status: 'Drifting' },
        { id: 'H6', name: 'Energy Paradigm', intensity: 0.55, dimension: 'OMC-Sync', status: 'Stable' },
        { id: 'H7', name: 'Legacy Data', intensity: 0.32, dimension: 'OMC-Knowledge', status: 'Stable' },
        { id: 'H8', name: 'Final Release', intensity: 0.98, dimension: 'OMC-Nirvana', status: 'Stable' },
    ] as any[];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "影響修復實驗室 (Impact Repair)" : "Impact Repair Lab"}
                subtitle={locale === 'zh-TW' ? "實踐環境系統性治癒，學習生態復原力。將負面影響轉化為永續資產的鍊金術。" : "Systemic environmental healing and ecological resilience. Execute long-term restoration roadmaps."}
                category="卓越永續服務"
            />

            {/* 🧬 Healing Flux visualization & Projects List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 💓 Main Flux Core */}
                <div className="lg:col-span-1">
                    <GnosisHeatmap data={heatmapData} title={locale === 'zh-TW' ? "修復共鳴矩陣" : "Repair Resonance Matrix"} />
                </div>

                {/* 📊 Repair Modules List */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
                            <Sprout size={16} className="text-[var(--primary)]" /> Bio-Digital Repair Modules
                        </h4>
                        <button className="text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <Search size={12} /> Search Forge
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {projects.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-[2rem] bg-black border border-white/5 liquid-glass group hover:border-blue-500/30 hover:bg-black/80 transition-all cursor-pointer flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${p.status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-500'} group-hover:scale-110 transition-transform`}>
                                        {p.icon}
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${p.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                                        {p.status}
                                    </span>
                                </div>

                                <div>
                                    <h5 className="text-xs font-black text-white/90 uppercase tracking-tight group-hover:text-blue-400 transition-colors mb-1">
                                        {locale === 'zh-TW' ? p.zh : p.title}
                                    </h5>
                                    <p className="text-[10px] text-gray-500 font-mono mb-4">{p.timeline}</p>

                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Proj. Impact</span>
                                        <span className="text-xs text-[var(--accent)] font-black uppercase italic">{p.impact}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-6 rounded-[2rem] border border-dashed border-gray-600 dark:border-white/20 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 hover:border-[var(--primary)] transition-all cursor-pointer group">
                            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:text-[var(--primary)] transition-colors">
                                <Sparkles size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Synthesize New Paradigm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📈 Gantt Chart Roadmap */}
            <div className="grid grid-cols-1">
                <GanttChart tasks={ganttData} title="Global Restoration Timelines (Thoth Projected)" />
            </div>

            {/* 🔮 Deep Restoration Matrix & Social Tissue */}
            <div className="p-10 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass">
                <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left gap-8 lg:gap-12">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <Heart size={24} className="text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">Social Tissue Healing</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
                            Beyond environmental restoration, the AI actively monitors <span className="text-white font-bold">Social Tissue Resilience</span>.
                            We pinpoint fractures in localized human capital algorithms and orchestrate community trust rebuilding via 5T-anchored compensatory programs.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4">
                            <div className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.1)]">Trust Horizon: 94%</div>
                            <div className="px-4 py-1.5 bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] rounded-full text-[9px] font-black uppercase tracking-widest">Equity Pulsing</div>
                            <div className="px-4 py-1.5 bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] rounded-full text-[9px] font-black uppercase tracking-widest">SROI Maximized</div>
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                        <button className="px-8 py-4 bg-black border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all w-full sm:w-auto">
                            Access Healing Logs
                        </button>
                        <button className="px-8 py-4 bg-blue-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] w-full sm:w-auto flex items-center justify-center gap-2">
                            <Zap size={14} /> Initiate Repair Paradigm
                        </button>
                    </div>
                </div>
            </div>

            {/* 📊 Restoration Analytics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { l: 'Repair Accuracy', v: '99.1%', i: <ActivitySquare /> },
                    { l: 'Sentient Proofs', v: '1,442', i: <ShieldCheck /> },
                    { l: 'Ecosystem Pulse', v: 'Expanding', i: <Leaf /> },
                    { l: 'Alpha Recovery', v: 'Nirvana', i: <Zap /> }
                ].map((n, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        key={n.l}
                        className="p-8 rounded-[2rem] bg-black border border-white/5 group hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
                            {n.i}
                        </div>
                        <div className="mb-4 text-gray-600 group-hover:text-blue-400 transition-colors flex justify-center relative z-10">
                            {n.i}
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 relative z-10">{n.l}</p>
                        <p className="text-xl font-black text-white italic uppercase relative z-10 group-hover:text-blue-50">{n.v}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
