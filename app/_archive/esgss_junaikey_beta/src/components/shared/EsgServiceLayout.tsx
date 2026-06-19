import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ChevronRight,
    Brain,
    Sparkles,
    Zap,
    LayoutDashboard,
    Thermometer,
    Droplets,
    Users,
    ShieldAlert,
    FileSearch,
    TrendingUp,
    MessageSquare,
    Search
} from 'lucide-react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { useI18n } from '@/utils/i18n';
import '@/styles/liquid-glass.css';

/**
 * ?? ESG "上�??�水" Theme Constants (Legacy Support, migrating to CSS vars)
 */
export const ESG_THEME = {
    PRIMARY: '#00FFFF',
    PRIMARY_DARK: '#4A8A98',
    PRIMARY_LIGHT: '#8BC4CF',
    BG_DEEP: '#020617',
    BG_CARD: 'rgba(30, 41, 59, 0.4)',
    BORDER: 'rgba(255, 255, 255, 0.05)',
    TEXT_PRIMARY: '#F8FAFB',
    TEXT_SECONDARY: '#94A3B8',
};

interface NavItem {
    id: string;
    label: string;
    icon: any;
    path: string;
}

interface EsgServiceLayoutProps {
    children: React.ReactNode;
    title: string;
    activeId: string;
    progress?: number;
    headerAction?: React.ReactNode;
}

/**
 * ?? EsgServiceLayout
 * Shared layout for all ESG services following the "上�??�水" philosophy.
 * Integrates 5T Protocol & Liquid Glass Design System.
 */
const EsgServiceLayout: React.FC<EsgServiceLayoutProps> = ({ children, title, activeId, progress = 0, headerAction }) => {
    const navigate = useNavigate();
    const { t } = useI18n();
    const [isMuseOpen, setIsMuseOpen] = useState(true);

    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('EsgServiceLayout'), []);

    const navItems: NavItem[] = useMemo(() => [
        { id: 'dashboard', label: t('esgLayout.nav.dashboard'), icon: LayoutDashboard, path: '/esg/dashboard' },
        { id: 'climate', label: t('esgLayout.nav.climate'), icon: Thermometer, path: '/esg/climate-risk' },
        { id: 'water', label: t('esgLayout.nav.water'), icon: Droplets, path: '/esg/water' },
        { id: 'rights', label: t('esgLayout.nav.rights'), icon: ShieldAlert, path: '/esg/human-rights' },
        { id: 'community', label: t('esgLayout.nav.community'), icon: Users, path: '/esg/community' },
        { id: 'transparency', label: t('esgLayout.nav.transparency'), icon: FileSearch, path: '/esg/transparency' },
        { id: 'investment', label: t('esgLayout.nav.investment'), icon: TrendingUp, path: '/esg/investment' },
        { id: 'stakeholder', label: t('esgLayout.nav.stakeholder'), icon: MessageSquare, path: '/esg/stakeholder' },
    ], [t]);

    return (
        <div
            className="min-h-screen text-slate-200 overflow-hidden relative bg-[#020617]"
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
            data-component="EsgServiceLayout"
        >

            {/* 1. The Void Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-[0.05] blur-[150px] rounded-full bg-[#00FFFF]" />
                <div className="absolute top-0 left-0 w-[300px] h-[300px] opacity-[0.03] blur-[100px] rounded-full bg-[#8BC4CF]" />
            </div>

            {/* 2. Progress Stream (Liquid Flow) */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 z-50 overflow-hidden">
                <motion.div
                    className="h-full relative bg-[#00FFFF]"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/30 to-transparent blur-sm" />
                </motion.div>
            </div>

            {/* 3. Navigation Bar (Left Sticky) - Liquid Glass Strong */}
            <motion.div
                className="fixed left-0 top-0 bottom-0 w-20 border-r flex flex-col items-center py-6 z-40 liquid-glass-strong border-r-white/5"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="p-3 mb-8 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex flex-col gap-5">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`p-3 rounded-xl transition-all relative group ${activeId === item.id ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <item.icon size={22} style={{ color: activeId === item.id ? '#00FFFF' : 'inherit' }} />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-xs font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/5 glass-edge-light">
                                {item.label}
                            </div>

                            {activeId === item.id && (
                                <motion.div
                                    layoutId="active-nav-bg"
                                    className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none border-[#00FFFF]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* 4. Main Stage */}
            <main
                className={`transition-all duration-500 pt-16 pb-16 min-h-screen ${isMuseOpen ? 'pl-20 pr-[340px]' : 'pl-20 pr-20'}`}
            >
                <div className="max-w-7xl mx-auto px-10">
                    {/* Header Section */}
                    <div className="flex justify-between items-end mb-10 pt-10">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono mb-2 text-[#00FFFF]">
                                <span>ESGSS</span>
                                <ChevronRight size={10} />
                                <span className="uppercase tracking-widest opacity-70">{t('esgLayout.header.services')}</span>
                            </div>
                            <h1 className="text-4xl font-light tracking-tight text-white">{title}</h1>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-[#00FFFF] transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder={t('esgLayout.header.search')}
                                    className="liquid-glass border-white/5 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#00FFFF]/50 transition-colors w-64 text-slate-200"
                                />
                            </div>
                            {headerAction}
                            <button
                                className="px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all shadow-lg hover:shadow-[#00FFFF]/20 bg-[#00FFFF] text-[#020617] glass-edge-light"
                            >
                                {t('esgLayout.header.addData')}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </main>

            {/* 5. Omni Muse (Right AI Sidebar) - Liquid Glass Strong */}
            <motion.div
                className={`fixed right-0 top-0 bottom-0 z-40 liquid-glass-strong border-l border-white/5 shadow-2xl overflow-hidden flex flex-col`}
                initial={{ width: isMuseOpen ? 320 : 60 }}
                animate={{ width: isMuseOpen ? 320 : 60 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <button
                    onClick={() => setIsMuseOpen(!isMuseOpen)}
                    className="h-16 flex items-center justify-center border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                    {isMuseOpen ? <ChevronRight className="text-slate-500 group-hover:text-white" /> : <Brain size={24} className="text-[#00FFFF] animate-pulse" />}
                </button>

                <AnimatePresence>
                    {isMuseOpen && (
                        <motion.div
                            className="p-6 flex-1 flex flex-col gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2 } }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex items-center gap-2 text-[#00FFFF]">
                                <Sparkles size={16} />
                                <h3 className="text-xs font-bold uppercase tracking-widest">{t('esgLayout.muse.title')}</h3>
                            </div>

                            {/* Insight Card - Liquid Glass */}
                            <div className="p-5 liquid-glass hover:border-[#00FFFF]/30 transition-all group cursor-pointer">
                                <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-wider">{t('esgLayout.muse.insight.title')}</p>
                                <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">
                                    {t('esgLayout.muse.insight.content')}
                                </p>
                                <button className="text-xs font-bold flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity text-[#00FFFF]">
                                    <Zap size={12} /> {t('esgLayout.muse.explore')}
                                </button>
                            </div>

                            {/* Reference Card - Liquid Glass */}
                            <div className="p-5 liquid-glass transition-all">
                                <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-wider">{t('esgLayout.muse.reference.title')}</p>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {t('esgLayout.muse.reference.content')}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default EsgServiceLayout;

