import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, FileText, CheckCircle, Upload, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBehaviorAnalytics } from '@/hooks/useBehaviorAnalytics';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

// Mock Data for "Smart Gathering"
const DATA_SOURCES = [
    { id: 1, name: 'ERP System (SAP)', status: 'connected', lastSync: '10 mins ago', type: 'automated' },
    { id: 2, name: 'IoT Energy Meters', status: 'connected', lastSync: '1 min ago', type: 'automated' },
    { id: 3, name: 'HR Portal', status: 'pending', lastSync: '2 days ago', type: 'manual' },
    { id: 4, name: 'Supply Chain (Portal)', status: 'error', lastSync: 'Failed', type: 'external' },
];

const REPORTING_STANDARDS = [
    { id: 'gri', name: 'GRI Standards 2024', progress: 85, color: 'text-gold-500' },
    { id: 'sasb', name: 'SASB Technology', progress: 60, color: 'text-blue-500' },
    { id: 'tcfd', name: 'TCFD Climate', progress: 30, color: 'text-green-500' },
];

export const EsgReportingPage: React.FC = () => {
    const { mode } = useStitchTheme();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'sources' | 'reports' | 'governance'>('dashboard');
    const { trends, activityData, funnelData, isLoading } = useBehaviorAnalytics();

    const reportCore = useMemo(() => ComponentCoreFactory.create(
        'ESGReportingCore',
        '1.2.0',
        ['Transparency', 'Traceability', 'Trust']
    ), []);

    // Gold Theme Colors (Approximated if not in context, but following "Eternal Gold" logic)
    // Gold Primary: #FFD700
    // Background: Darker/Rich to contrast Gold.

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 font-sans">
            {/* Header Section - Gold Theme */}
            <header className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full border border-yellow-500/50">
                        <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="text-yellow-600 dark:text-yellow-400">智慧大集</span> Smart Gathering
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t('stitch.func.report.desc')}
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-800 mt-6">
                    {['dashboard', 'sources', 'reports', 'governance'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                ? 'text-[#63a6b0]'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            {tab === 'governance' ? 'Governance Insights' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#63a6b0]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Smart Gathering Status */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Aggregation Status */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Database className="w-5 h-5 text-yellow-500" />
                                Data Aggregation
                            </h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase">
                                System Active
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DATA_SOURCES.map(source => (
                                <div key={source.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${source.status === 'connected' ? 'bg-green-500' : source.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                        <div>
                                            <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{source.name}</p>
                                            <p className="text-xs text-slate-500">{source.type} • {source.lastSync}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-yellow-500">
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="flex items-center gap-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:underline">
                                <Upload className="w-4 h-4" />
                                Connect New Source
                            </button>
                        </div>
                    </section>

                    {/* 2. Reporting Progress */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#63a6b0]" />
                                Report Generation
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {REPORTING_STANDARDS.map(std => (
                                <div key={std.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{std.name}</span>
                                        <span className="text-slate-500">{std.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[#63a6b0]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${std.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Behavioral Governance (Real Integration) */}
                    {activeTab === 'governance' && (
                        <section className="space-y-6">
                            <HeatmapChart />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <section className="p-6 liquid-glass border border-white/10 rounded-xl">
                                    <FunnelChart
                                        title="5T Transformation Funnel"
                                        data={funnelData.length > 0 ? funnelData : [
                                            { name: 'Initial Engagement', value: 100, fill: '#63a6b0', description: 'Total unique visitors' },
                                            { name: 'Action Density', value: 75, fill: '#4a828a', description: 'Users performing key ESG actions' },
                                            { name: 'Report Generation', value: 40, fill: '#345e64', description: 'Reports finalized and locked' },
                                            { name: '5T Verification', value: 15, fill: '#ffd700', description: 'Audit-ready sustainable assets' },
                                        ]}
                                        core={reportCore}
                                    />
                                </section>

                                <div className="space-y-6">
                                    <div className="bg-[#63a6b0]/5 border border-[#63a6b0]/20 rounded-xl p-6">
                                        <h3 className="text-sm font-bold text-[#63a6b0] uppercase tracking-widest mb-4">Event Resonance Distribution</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {trends?.summary_data && Object.entries(trends.summary_data).map(([key, value]) => (
                                                <div key={key} className="p-3 bg-black/20 rounded-lg border border-white/5 text-center">
                                                    <p className="text-[10px] text-zinc-500 uppercase">{key}</p>
                                                    <p className="text-lg font-bold text-white">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 border border-white/5 rounded-xl bg-white/5">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-tighter">Strategic Impact Score</h4>
                                        <div className="text-4xl font-extralight text-white">
                                            {trends?.top_event_types?.[0]?.count ? (trends.top_event_types[0].count * 1.2).toFixed(1) : '94.2'}
                                            <span className="text-sm text-[#63a6b0] ml-2">ALPHA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Trust & Verification */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Trust Score Card - Gold Theme Highlight */}
                    <section className="bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl p-6 border border-yellow-500/20 text-center">
                        <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mb-4 border-2 border-yellow-500">
                            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">98/100</h3>
                        <p className="text-yellow-700 dark:text-yellow-500 font-medium text-sm uppercase tracking-wide">Trust Score</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 px-4">
                            Your data integrity is verified by blockchain hash-locking.
                        </p>
                    </section>

                    {/* Verification Log */}
                    <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Verified Events
                        </h3>
                        <ul className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <div className="mt-1 min-w-[4px] h-4 bg-yellow-300 rounded-full"></div>
                                    <div>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium">Data Block #{2039 + i} Sealed</p>
                                        <p className="text-slate-400 text-xs">2 hours ago via Smart Contract</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default EsgReportingPage;
