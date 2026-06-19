import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wind,
    Flame,
    Droplets,
    Zap,
    ShieldCheck,
    FileUp,
    TrendingDown,
    ArrowUpRight,
    Search,
    Plus,
    Lock,
    Cpu,
    Boxes
} from 'lucide-react';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import { useStitchTheme } from '@/contexts/StitchThemeContext';

interface CarbonRecord {
    id: string;
    scope: string;
    category: string;
    val: number;
    unit: string;
    tco2e: number;
    status: 'Draft' | 'Verified' | 'Trustworthy';
}

const CarbonAccountingPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('CarbonAccountingPage'), []);
    const { resolvedMode } = useStitchTheme();

    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const [records, setRecords] = useState<CarbonRecord[]>([
        { id: '1', scope: '2', category: 'Electricity Consumption', val: 45000, unit: 'kWh', tco2e: 22.275, status: 'Trustworthy' },
        { id: '2', scope: '1', category: 'Company Fleet Gasoline', val: 1200, unit: 'L', tco2e: 2.832, status: 'Verified' },
        { id: '3', scope: '3', category: 'Employee Commuting', val: 850, unit: 'km', tco2e: 1.25, status: 'Draft' },
    ]);

    const totalEmissions = useMemo(() => {
        return Number(records.reduce((acc, r) => acc + r.tco2e, 0).toFixed(3));
    }, [records]);

    const scopeMix = useMemo(() => {
        const total = records.reduce((acc, r) => acc + r.tco2e, 0);
        if (total === 0) return [];

        const scopes = ['1', '2', '3'];
        const labels = ['Scope 1 Direct', 'Scope 2 Indirect', 'Scope 3 Other'];
        const colors = ['#63a6b0', '#ffd700', '#0df2df'];

        return scopes.map((s, i) => {
            const scopeVal = records
                .filter(r => r.scope === s)
                .reduce((acc, r) => acc + r.tco2e, 0);
            return {
                label: labels[i],
                val: Math.round((scopeVal / total) * 100),
                color: colors[i]
            };
        });
    }, [records]);

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenCarbonOnboarding');
        if (!hasSeen) setShowOnboarding(true);
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenCarbonOnboarding', 'true');
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
        <StitchPageTemplate
            title="Carbon Accounting Center"
            subtitle="ISO_14064_MASTER_LEDGER"
            headerAction={
                <div className="flex items-center gap-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[10px] font-bold uppercase tracking-widest text-[#63a6b0]"
                    >
                        Verified
                    </motion.div>
                </div>
            }
        >
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="CarbonAccountingPage"
                className="animate-fade-in"
            >
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                    <div className="col-span-1 md:col-span-8 p-6 bg-gradient-to-r from-black/40 to-[#63a6b0]/10 border border-white/10 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-[#63a6b0] font-bold uppercase tracking-widest text-xs mb-2">Total Emissions (tCO2e)</h4>
                            <div className="text-6xl font-light text-white tracking-tighter">
                                {totalEmissions}
                            </div>
                            <p className="text-slate-400 text-sm mt-2 max-w-lg">
                                Aggregated data from verified Scope 1, 2, and 3 sources.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <Wind size={200} />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-4 grid grid-cols-1 gap-4">
                        {scopeMix.map((item, i) => (
                            <div key={i} className="bg-black/20 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase text-slate-500">{item.label}</div>
                                    <div className="text-lg font-bold text-white">{item.val}%</div>
                                </div>
                                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Actions */}
                    <div className="lg:col-span-3 space-y-4">
                        <button className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-[#63a6b0]/10 hover:border-[#63a6b0]/30 transition-all group">
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Batch Import</span>
                            <FileUp className="text-[#63a6b0] w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-[#63a6b0]/10 hover:border-[#63a6b0]/30 transition-all group">
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Manual Entry</span>
                            <Plus className="text-[#63a6b0] w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <div className="p-6 bg-black/20 border border-white/5 rounded-3xl mt-8">
                            <h4 className="text-xs font-bold uppercase text-slate-500 mb-4">Integrity Status</h4>
                            <div className="flex items-center gap-2 text-[#63a6b0] mb-2">
                                <ShieldCheck size={16} />
                                <span className="font-bold text-sm">System Secure</span>
                            </div>
                            <p className="text-[10px] text-slate-600">
                                All timestamps verified via 5T Protocol.
                            </p>
                        </div>
                    </div>

                    {/* Right: Data Table */}
                    <div className="lg:col-span-9 bg-black/20 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-light flex items-center gap-3 text-white">
                                <Boxes className="text-[#63a6b0]" size={20} /> Activity Log
                            </h3>
                            <div className="flex bg-black/40 border border-white/10 rounded-xl px-4 py-2 items-center gap-3 w-64 focus-within:border-[#63a6b0]/50 transition-colors">
                                <Search className="w-4 h-4 text-slate-500" />
                                <input type="text" placeholder="Search records..." className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-slate-600" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {records.map((r, i) => (
                                    <motion.div
                                        key={r.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/20 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-[#63a6b0]/30 transitionRule">
                                                {r.scope === '1' ? <Flame className="text-[#63a6b0]" size={18} /> : r.scope === '2' ? <Zap className="text-yellow-400" size={18} /> : <Droplets className="text-cyan-400" size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{r.category}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-mono text-slate-500 uppercase bg-white/5 px-1.5 py-0.5 rounded">Scope {r.scope}</span>
                                                    <span className="text-[10px] font-mono text-[#63a6b0]">{r.val} {r.unit}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-base font-light text-white">{r.tco2e} <span className="text-[10px] text-slate-500 font-mono">tCO2e</span></p>
                                                <div className="flex items-center gap-2 justify-end mt-1">
                                                    {r.status === 'Trustworthy' ? (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#63a6b0]/10 border border-[#63a6b0]/30 rounded-full">
                                                            <Lock className="w-2.5 h-2.5 text-[#63a6b0]" />
                                                            <span className="text-[8px] font-bold text-[#63a6b0] uppercase">Trustworthy</span>
                                                        </div>
                                                    ) : r.status === 'Verified' ? (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                                                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                                                            <span className="text-[8px] font-bold text-emerald-500 uppercase">Verified</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full">
                                                            <span className="text-[8px] font-bold text-slate-500 uppercase">Draft</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-[#63a6b0] transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboarding Overlay */}
            <ServiceOnboardingOverlay
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
                serviceName="Carbon Accounting Center"
                serviceDesc="Precise measurement of Scope 1-3 emissions with full traceability."
                steps={[
                    { id: 'boundary', type: 'info', title: 'Boundary Definition', description: 'Define your organizational and operational boundaries.', icon: <Boxes /> },
                    { id: 'entry', type: 'info', title: 'Data Entry', description: 'Input activity data; AI calculates equivalent emissions.', icon: <Cpu /> },
                    { id: 'evidence', type: 'info', title: 'Traceability', description: 'Link every data point to source evidence (bills, invoices).', icon: <FileUp /> },
                    { id: 'locking', type: 'info', title: 'Asset Locking', description: 'Seal data with Hash Lock technology for trustworthy reporting.', icon: <Lock /> }
                ]}
            />
        </StitchPageTemplate>
    );
};

export default CarbonAccountingPage;
