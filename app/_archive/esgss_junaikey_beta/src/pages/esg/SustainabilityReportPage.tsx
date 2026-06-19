import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    BarChart3,
    Globe,
    ArrowRight,
    Search,
    Plus,
    Lock,
    Cpu,
    Boxes,
    FileCheck,
    MoreVertical,
    DownloadCloud
} from 'lucide-react';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

interface ReportSummary {
    id: string;
    title: string;
    year: number;
    framework: string;
    status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Trustworthy';
    completeness: number;
}

/**
 * 📄 SustainabilityReportPage
 * 
 * Implements "GRI/SASB Reporting" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const SustainabilityReportPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('SustainabilityReportPage'), []);

    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Mock Reports
    const [reports, setReports] = useState<ReportSummary[]>([
        { id: 'rep-2024', title: '2024 Annual Sustainability Report', year: 2024, framework: 'GRI Standards', status: 'Trustworthy', completeness: 100 },
        { id: 'rep-2023', title: '2023 ESG Impact Report', year: 2023, framework: 'GRI / TCFD', status: 'Published', completeness: 100 },
        { id: 'rep-current', title: '2025 Q1 Progress Update', year: 2025, framework: 'GRI Omni 2021', status: 'Draft', completeness: 45 },
    ]);

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenReportCenterOnboarding');
        if (!hasSeen) setShowOnboarding(true);
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenReportCenterOnboarding', 'true');
        setShowOnboarding(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <EsgServiceLayout title="Sustainability Reporting Hub" activeId="report" progress={95}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="SustainabilityReportPage"
                className="animate-fade-in"
            >
                {/* Header Actions */}
                <div className="flex justify-end mb-8 relative z-10">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#63a6b0] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,166,176,0.3)] border border-[#63a6b0]/50">
                        <Plus className="w-4 h-4" /> Start Report Project
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Summary Cards & Frameworks */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="liquid-glass p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <BarChart3 size={120} className="text-white" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#63a6b0]" /> Report Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Published</p>
                                    <p className="text-3xl font-light italic text-white">12 <span className="text-[10px] text-slate-600 not-italic">docs</span></p>
                                </div>
                                <div className="p-4 bg-[#63a6b0]/10 rounded-2xl border border-[#63a6b0]/20 hover:bg-[#63a6b0]/20 transition-colors">
                                    <p className="text-[10px] text-[#63a6b0]/70 font-bold uppercase mb-1">Anchored</p>
                                    <p className="text-3xl font-light italic text-[#63a6b0]">08 <span className="text-[10px] text-[#63a6b0]/50 not-italic">locked</span></p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="liquid-glass p-8"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 italic">Supported Frameworks</h3>
                            <div className="space-y-3">
                                {['GRI Standards 2021', 'SASB Industry Specific', 'TCFD Climate Disclosure', 'ISSO 14064 GHG'].map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-[#63a6b0]/10 hover:border-[#63a6b0]/30 transition-all cursor-pointer group">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{f}</span>
                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#63a6b0] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Reports List */}
                    <div className="lg:col-span-8 flex flex-col h-full">
                        <div className="liquid-glass p-10 relative overflow-hidden flex-1">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-light text-white flex items-center gap-3">
                                    <FileText className="text-[#63a6b0]" /> Report Ledger
                                </h3>
                                <div className="flex bg-black/20 border border-white/10 rounded-xl px-4 py-2 items-center gap-3 focus-within:border-[#63a6b0]/50 transition-colors">
                                    <Search className="w-4 h-4 text-slate-500" />
                                    <input type="text" placeholder="Search reports..." className="bg-transparent border-none text-xs text-white outline-none placeholder:text-slate-600 w-48" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence>
                                    {reports.map((r, i) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group flex flex-wrap items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/30 transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#63a6b0]/10 group-hover:border-[#63a6b0]/30 transition-all shadow-inner">
                                                    <FileCheck className="text-slate-400 group-hover:text-[#63a6b0] w-7 h-7 transition-colors" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold italic uppercase tracking-tight text-white group-hover:text-[#63a6b0] transition-colors">{r.title}</h4>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">{r.framework}</span>
                                                        <span className="text-[10px] font-mono text-slate-600 border-l border-white/10 pl-3">{r.year}</span>
                                                        <span className="text-[10px] font-bold text-[#63a6b0] border-l border-white/10 pl-3">{r.completeness}% Complete</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 mt-4 md:mt-0">
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2 justify-end mb-1">
                                                        {r.status === 'Trustworthy' ? (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#63a6b0]/20 border border-[#63a6b0]/40 rounded-full box-glow-cyan">
                                                                <Lock className="w-3 h-3 text-[#63a6b0]" />
                                                                <span className="text-[9px] font-bold text-[#63a6b0] uppercase tracking-wider">Locked</span>
                                                            </div>
                                                        ) : r.status === 'Published' ? (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                                                                <Globe className="w-3 h-3 text-emerald-500" />
                                                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Published</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Draft</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-[9px] font-mono text-slate-600 uppercase">Updated: 2026-02-05</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 hover:bg-[#63a6b0]/20 hover:text-[#63a6b0] rounded-xl transition-all border border-transparent hover:border-[#63a6b0]/50">
                                                        <DownloadCloud className="w-5 h-5 text-slate-500 hover:text-[#63a6b0]" />
                                                    </button>
                                                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                                        <MoreVertical className="w-5 h-5 text-slate-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboarding Overlay */}
            <ServiceOnboardingOverlay
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
                serviceName="Sustainability Reporting Hub"
                serviceDesc="Transform transparency into impact with verified, 5T-locked reporting assets."
                steps={[
                    { id: 'project-setup', type: 'info', title: 'Project Setup', description: 'Select reporting year, framework (GRI/SASB/TCFD) and sync organizational data.', icon: <Boxes /> },
                    { id: 'ai-drafting', type: 'info', title: 'AI Drafting', description: 'Use JunAiKey to auto-generate drafts and refine via professional checklists.', icon: <Cpu /> },
                    { id: 'compliance', type: 'info', title: 'Compliance Check', description: 'Verify GRI indicator coverage to ensure every disclosure is backed by data.', icon: <FileCheck /> },
                    { id: 'publishing', type: 'info', title: '5T Publishing', description: 'Execute SHA-256 hash locking to publish an immutable sustainability certificate.', icon: <Lock /> }
                ]}
            />
        </EsgServiceLayout>
    );
};

export default SustainabilityReportPage;
