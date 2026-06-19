import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    TrendingUp,
    AlertCircle,
    ShieldCheck,
    BarChart3,
    Newspaper,
    ArrowRight,
    Tag,
    ExternalLink,
    Globe,
    Cpu,
    Boxes
} from 'lucide-react';
import { v4 as uuid } from 'uuid';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { FunnelChart } from '@/components/analytics/FunnelChart';

interface IntelItem {
    id: string;
    source: string;
    title: string;
    description: string;
    reliability: 'High' | 'Medium' | 'Low';
    impact: number;
    sentiment: React.ReactNode;
    time: string;
    tags: string[];
}

/**
 * 📡 MarketIntelligencePage
 * 
 * Implements "Market Intel" interface with Liquid Glass aesthetics.
 * 5T Protocol: Core Identity for traceability.
 */
const MarketIntelligencePage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('MarketIntelligencePage'), []);

    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Mock Intel Feed
    const [feed, setFeed] = useState<IntelItem[]>([
        {
            id: '1',
            source: 'Reuters ESG',
            title: 'EU Officially Adopts CBAM Expansion',
            description: 'AI Summary: Policy revision significantly impacts Asian hydrogen exports. Scope 3 verification recommended immediately.',
            reliability: 'High',
            impact: 9,
            sentiment: <span className="text-amber-500 font-bold">WARNING</span>,
            time: '2h ago',
            tags: ['CBAM', 'Green Hydrogen', 'Policy']
        },
        {
            id: '2',
            source: 'GRI Global',
            title: '2025 Materiality Assessment Toolkit Released',
            description: 'AI Summary: New toolkit aids SMEs in achieving GRI 3 compliance faster using automated data collection.',
            reliability: 'High',
            impact: 6,
            sentiment: <span className="text-emerald-500 font-bold">POSITIVE</span>,
            time: '5h ago',
            tags: ['GRI', 'Governance', 'SME']
        },
        {
            id: '3',
            source: 'Sustainable Finance',
            title: 'Global SLLs Surpass $500B Volume',
            description: 'AI Summary: Market shows strong confidence in projects with third-party verified transparency.',
            reliability: 'Medium',
            impact: 8,
            sentiment: <span className="text-blue-500 font-bold">TRENDING</span>,
            time: '1d ago',
            tags: ['SLL', 'Finance', 'Investment']
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    // Performance Optimization: Memoized Filtered Feed
    const filteredFeed = useMemo(() => {
        if (!searchQuery) return feed;
        const q = searchQuery.toLowerCase();
        return feed.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.tags.some(t => t.toLowerCase().includes(q))
        );
    }, [feed, searchQuery]);

    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenIntelOnboarding');
        if (!hasSeen) setShowOnboarding(true);
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenIntelOnboarding', 'true');
        setShowOnboarding(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    const chartCore = useMemo(() => ComponentCoreFactory.create(
        'IntelligenceDistillationFunnel',
        '1.0.0',
        ['Distillation Matrix Alpha', 'Sentinel Verified']
    ), []);

    const funnelData = useMemo(() => [
        { name: 'Raw Data', value: 100, fill: '#63a6b0', description: 'Total unstructured ESG signals captured from global feeds.' },
        { name: 'Validated', value: 75, fill: '#4a8b94', description: 'Signals verified through local node consensus.' },
        { name: 'Correlated', value: 45, fill: '#346d76', description: 'Data points matched with existing ESG frameworks.' },
        { name: 'Actionable', value: 18, fill: '#D4AF37', description: 'High-confidence alerts ready for strategic execution.' },
    ], []);

    return (
        <EsgServiceLayout title="Market Intelligence Center" activeId="market" progress={65}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="MarketIntelligencePage"
                className="animate-fade-in"
            >
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="liquid-glass p-6 group hover:border-[#63a6b0]/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#63a6b0]/10 rounded-xl text-[#63a6b0]">
                                <Globe size={20} />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">GLOBAL</span>
                        </div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Sources Monitored</h3>
                        <div className="text-3xl font-light text-white">2,415</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="liquid-glass p-6 group hover:border-[#63a6b0]/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                                <AlertCircle size={20} />
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">URGENT</span>
                        </div>
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Critical Alerts</h3>
                        <div className="text-3xl font-light text-white">03</div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Trends & Sentinel */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Intelligence Distillation Funnel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="liquid-glass p-6 min-h-[400px]"
                        >
                            <FunnelChart
                                data={funnelData}
                                title="Intelligence Distillation"
                                core={chartCore}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="liquid-glass p-8 relative overflow-hidden"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#63a6b0] mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Global Trends</span>
                                <BarChart3 className="w-4 h-4 text-slate-500" />
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { tag: 'Carbon Border Tax', growth: '+45%' },
                                    { tag: 'GRI 2021 Update', growth: '+30%' },
                                    { tag: 'Green Financing', growth: '+22%' },
                                    { tag: 'Biodiversity Disclosure', growth: '+12%' }
                                ].map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/20 transition-all cursor-pointer group">
                                        <span className="text-[11px] font-bold uppercase text-slate-300 group-hover:text-white transition-colors">{t.tag}</span>
                                        <span className="text-[10px] font-bold text-emerald-400 font-mono">{t.growth}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="liquid-glass-strong p-8 relative overflow-hidden border-t-amber-500/50"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <AlertCircle size={80} className="text-amber-500" />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Strategic Sentinel
                            </h3>
                            <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-sm relative z-10">
                                <p className="text-[11px] font-bold text-amber-200 leading-relaxed mb-4">
                                    Supply Chain Risk Detected: Policy-driven production halt in major aluminum region may impact your Scope 3 intensity.
                                </p>
                                <button className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 group hover:text-amber-400 transition-colors">
                                    VIEW MITIGATION PLAN <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Intelligence Feed */}
                    <div className="lg:col-span-8">
                        <div className="liquid-glass p-10 relative overflow-hidden h-full">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-light text-white flex items-center gap-3">
                                    <Newspaper className="text-[#63a6b0]" /> Intelligence Feed
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Filter className="w-4 h-4" /></button>
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-[#63a6b0] transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search intel..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#63a6b0]/50 transition-all w-48 focus:w-64"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredFeed.map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group p-8 bg-white/[0.02] border border-white/5 rounded-[24px] hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/30 transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-[9px] font-bold text-slate-300 uppercase tracking-widest hover:bg-white/20 transition-colors">{item.source}</div>
                                                    <span className="text-[10px] font-mono text-slate-500 uppercase">{item.time}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-slate-400">
                                                        Reliability
                                                        {item.reliability === 'High' ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#63a6b0]"></div>
                                                        <span className="text-[9px] font-bold text-[#63a6b0] uppercase italic">Impact {item.impact}/10</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-bold leading-tight text-white group-hover:text-[#63a6b0] transition-colors mb-3">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                                <div className="flex gap-2">
                                                    {item.tags.map((tag, idx) => (
                                                        <span key={idx} className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase border border-white/5 px-2 py-1 rounded-md hover:border-white/20 hover:text-slate-300 transition-all">
                                                            <Tag className="w-2.5 h-2.5" /> {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                        Sentiment: {item.sentiment}
                                                    </span>
                                                    <ExternalLink className="w-4 h-4 text-slate-600 hover:text-white group-hover:text-[#63a6b0] transition-colors" />
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
                serviceName="Market Intel Center"
                serviceDesc="Stay ahead of regulations with real-time, AI-filtered intelligence."
                steps={[
                    { id: 'sentinel', type: 'info', title: 'Sentinel Setup', description: 'Define your industry focus and key risks to calibrate the scanning matrix.', icon: <Search /> },
                    { id: 'distillation', type: 'info', title: 'AI Distillation', description: 'Automated summarization of long-form policies into actionable insights.', icon: <Cpu /> },
                    { id: 'tracking', type: 'info', title: 'Reliability Tracking', description: '5T Protocol traceability ensures all intel sources are verified and weighted.', icon: <ShieldCheck /> },
                    { id: 'alignment', type: 'info', title: 'Strategic Alignment', description: 'Convert intelligence directly into governance tasks and strategy updates.', icon: <Boxes /> }
                ]}
            />
        </EsgServiceLayout>
    );
};

export default MarketIntelligencePage;
