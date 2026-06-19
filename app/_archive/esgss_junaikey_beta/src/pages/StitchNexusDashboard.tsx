import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Orbit,
    Zap,
    Shield,
    Database,
    Activity,
    Share2,
    ArrowRight,
    Lock,
    Eye,
    Search
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

/**
 * StitchNexusDashboardContent - Main content of the dashboard
 */
const StitchNexusDashboardContent: React.FC = () => {
    const { mode, resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const nexusCore = useMemo(() => ComponentCoreFactory.create(
        'StitchNexusCore',
        '2.0.0',
        ['Spatial', 'Bento', '5T']
    ), []);

    // 5T Protocol Items
    const protocolItems = [
        { id: 'tangible', label: 'Tangible', icon: Eye, color: '#63a6b0', status: 'Active' },
        { id: 'traceable', label: 'Traceable', icon: Search, color: '#3b82f6', status: 'Verified' },
        { id: 'trackable', label: 'Trackable', icon: Activity, color: '#10b981', status: 'Syncing' },
        { id: 'transparent', label: 'Transparent', icon: Orbit, color: '#8b5cf6', status: 'Public' },
        { id: 'trustworthy', label: 'Trustworthy', icon: Lock, color: '#ffd700', status: 'Locked' },
    ];

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans relative overflow-x-hidden transition-colors duration-500`}>

                {/* Background Grid/Aura */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className={`animated-aura absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-[#63a6b0]/20' : 'bg-[#63a6b0]/10'}`} />
                    <div className={`animated-aura absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 ${isDark ? 'bg-amber-500/10' : 'bg-amber-500/5'}`} />
                </div>

                <div className="relative z-10 p-8 pt-24 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-[#63a6b0]/20 rounded-2xl text-[#63a6b0] shadow-lg shadow-[#63a6b0]/20">
                                    <Orbit className="w-10 h-10 animate-spin-slow" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                                        Stitch <span className="text-[#63a6b0]">Nexus</span>
                                    </h1>
                                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-50 mt-2">
                                        Spatial Governance & 5T Protocol
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Core Status: Optimal</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bento Grid System */}
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[120px]">

                        {/* 1. Main ESG Pulse (Large) */}
                        <div className="md:col-span-4 lg:col-span-8 row-span-3">
                            <div className={`h-full rounded-4xl p-8 border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'} shadow-2xl relative overflow-hidden group`}>
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity size={120} />
                                </div>
                                <div className="flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black mb-2 tracking-tight">Omni-ESG Pulse</h2>
                                            <p className="text-sm opacity-50">Monitoring global impact across 24 MECE services.</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-[#63a6b0]/20 text-[#63a6b0] text-[10px] font-bold rounded-full border border-[#63a6b0]/30 shadow-inner">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#63a6b0] animate-ping" />
                                            REAL-TIME DATA
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                        {[
                                            { label: 'Environment', val: '94.2%', Change: '+1.2%', color: 'from-[#63a6b0] to-blue-400' },
                                            { label: 'Social', val: '88.5%', Change: '+0.5%', color: 'from-purple-500 to-pink-500' },
                                            { label: 'Governance', val: '99.1%', Change: 'Stable', color: 'from-emerald-500 to-teal-500' },
                                            { label: 'Trust', val: '100', Change: 'Locked', color: 'from-amber-500 to-yellow-500' },
                                        ].map((stat) => (
                                            <div key={stat.label} className={`p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between`}>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase opacity-40 mb-3 tracking-widest">{stat.label}</p>
                                                    <p className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.val}</p>
                                                </div>
                                                <p className="text-[9px] font-mono opacity-40 uppercase">{stat.Change}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. 5T Security Status (Vertical) */}
                        <div className="md:col-span-2 lg:col-span-4 row-span-4">
                            <div className={`h-full rounded-4xl p-8 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'} shadow-2xl relative overflow-hidden backdrop-blur-3xl`}>
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ffd700]" />
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
                                    <Shield className="w-6 h-6 text-[#ffd700]" />
                                    Security Vault
                                </h3>
                                <div className="space-y-7">
                                    {protocolItems.map((item) => (
                                        <div key={item.id} className="group cursor-pointer">
                                            <div className="flex items-center justify-between mb-2.5">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all group-hover:scale-110">
                                                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                                    </div>
                                                    <span className="text-xs font-black opacity-80 uppercase tracking-[0.2em]">{item.label}</span>
                                                </div>
                                                <span className="text-[10px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">{item.status}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: 1.5, delay: 0.2 }}
                                                    className="h-full rounded-full shadow-[0_0_10px_currentColor]"
                                                    style={{ backgroundColor: item.color, color: item.color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-14 p-5 bg-amber-500/5 rounded-3xl border border-amber-500/10 backdrop-blur-sm group hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lock size={12} className="text-amber-500" />
                                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Protocol Hash-Lock</p>
                                    </div>
                                    <p className="text-[9px] font-mono break-all opacity-30 group-hover:opacity-60 transition-opacity">
                                        SHA256:8f2a6d3e1c9b0a7f4e5d2c1b8a9f0e3d2c1b8a9f0e3d2c1b8a9f
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Integration Hub (Link Tile) */}
                        <div className="md:col-span-2 lg:col-span-4 row-span-2">
                            <Link to="/integration-hub" className="block h-full group">
                                <section className={`h-full rounded-4xl p-8 border ${isDark ? 'bg-gradient-to-br from-[#63a6b0]/20 to-transparent border-[#63a6b0]/20' : 'bg-slate-50 border-slate-200'} hover:border-[#63a6b0]/50 hover:shadow-2xl hover:shadow-[#63a6b0]/10 transition-all`}>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner">
                                            <Share2 className="text-[#63a6b0] w-7 h-7" />
                                        </div>
                                        <ArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all w-6 h-6" />
                                    </div>
                                    <h4 className="font-black text-2xl mb-1 italic">API Nexus</h4>
                                    <p className="text-sm opacity-50 font-medium">12 active bidirectional sync streams.</p>
                                </section>
                            </Link>
                        </div>

                        {/* 4. Knowledge Progression (Horizontal) */}
                        <div className="md:col-span-4 lg:col-span-4 row-span-2">
                            <section className={`h-full rounded-4xl p-8 border ${isDark ? 'bg-[#050c14] border-white/5' : 'bg-white border-slate-100'} shadow-inner relative overflow-hidden group`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#63a6b0]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-500/10 rounded-xl">
                                            <Zap className="text-amber-500 h-6 w-6 animate-pulse" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg leading-tight uppercase">System Evolution</h4>
                                            <p className="text-[10px] opacity-40 font-mono">MVP RELEASE CHANNEL</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black uppercase mb-3 tracking-widest">
                                            <span className="opacity-50">Sentience Rank 18</span>
                                            <span className="text-amber-500">85% toward Awakening</span>
                                        </div>
                                        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: '85%' }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>

                {/* Status Bar Ticker */}
                <div className={`fixed bottom-0 left-0 right-0 h-12 border-t ${isDark ? 'bg-black/80 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-2xl z-50 flex items-center px-8 overflow-hidden`}>
                    <div className="flex gap-12 font-mono text-[9px] font-bold uppercase tracking-[0.5em] animate-marquee whitespace-nowrap">
                        <span className="text-[#63a6b0] drop-shadow-[0_0_8px_#63a6b0]">SYSTEM_INITIALIZED_OMNI_CORE</span>
                        <span className="opacity-40">ALPHA_DASHBOARD_STABLE</span>
                        <span className="text-amber-500 drop-shadow-[0_0_8px_#f59e0b]">5T_PROTOCOL_ENFORCED</span>
                        <span className="opacity-40">RESISTANCE_CALIBRATION_PENDING</span>
                        <span className="text-emerald-500 drop-shadow-[0_0_8px_#10b981]">TRUTH_CRYSTAL_ACTIVE</span>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

/**
 * StitchNexusDashboard - The default export wrapped in its providers
 */
const StitchNexusDashboard: React.FC = () => (
    <StitchThemeProvider>
        <StitchNexusDashboardContent />
    </StitchThemeProvider>
);

export default StitchNexusDashboard;
