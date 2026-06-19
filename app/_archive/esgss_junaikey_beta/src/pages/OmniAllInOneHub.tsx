import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    TrendingUp,
    UserCircle,
    Users,
    Home,
    Settings,
    Shield,
    Activity,
    Search,
    Lock,
    Eye,
    Zap,
    ArrowUpRight,
    Globe,
    Languages,
    Terminal,
    Database,
    Fingerprint
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { FloatingOrb } from '@/components/layout/FloatingOrb';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProtocolModal } from '@/components/omni/ProtocolModal';
import { OmniTagConsole } from '@/components/omni/OmniTagConsole';
import FiveTProtocolBadge from '@/components/omni/FiveTProtocolBadge';
import { useOmniContext } from '@/omni/context/OmniContext';

const UUIDLabel: React.FC<{ id: string, visible?: boolean }> = ({ id, visible = false }) => (
    <div className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/40 rounded-md border border-white/5 ${visible ? 'opacity-80' : 'opacity-30 group-hover:opacity-100'} transition-opacity`}>
        <span className="text-[7px] font-mono text-white/50">{id}</span>
    </div >
);


const ProtocolBadge: React.FC<{
    type: 'TRANSPARENT' | 'TRACEABLE' | 'TRACKABLE' | 'TRUSTWORTHY';
    onClick: (e: React.MouseEvent) => void;
}> = ({ type, onClick }) => {
    const symbols = { TRANSPARENT: '善', TRACEABLE: '真', TRACKABLE: '路', TRUSTWORTHY: '信' };
    const colors = { TRANSPARENT: 'text-purple-400', TRACEABLE: 'text-blue-400', TRACKABLE: 'text-emerald-400', TRUSTWORTHY: 'text-amber-400' };
    return (
        <button
            onClick={onClick}
            className={`px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold ${colors[type]} hover:bg-white/10 transition-all flex items-center gap-1`}
        >
            <Shield size={8} />
            {symbols[type]}
        </button>
    );
};

const BentoCard: React.FC<{
    title: string;
    description: string;
    icon: any;
    color: string;
    path: string;
    span?: string;
    protocol?: string;
    metrics?: { label: string, value: string }[];
    devMode?: boolean;
}> = ({ title, description, icon: Icon, color, path, span = "col-span-4", protocol, metrics, devMode }) => {

    const { resolvedMode } = useStitchTheme();

    const { language, t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const [modalData, setModalData] = useState<{ isOpen: boolean; type: any; title: string, content: any }>({
        isOpen: false, type: 'TRANSPARENT', title: '', content: ''
    });

    const openModal = (e: React.MouseEvent, type: any, title: string, content: any) => {
        e.preventDefault();
        e.stopPropagation();
        setModalData({ isOpen: true, type, title, content });
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={`${span} group relative`}
        >
            <UUIDLabel
                id={`UUID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
                visible={devMode}
            />

            <Link to={path} className="block h-full">
                <div className={`h-full rounded-[24px] p-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${isDark
                    ? 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl'
                    } shadow-sm group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]`}>

                    {/* Background Accent */}
                    <div
                        className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                        style={{ backgroundColor: color }}
                    />

                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}
                            style={{ backgroundColor: `${color}15`, color: color }}>
                            <Icon size={24} />
                        </div>
                        {protocol && (
                            <ProtocolBadge
                                type={protocol as any}
                                onClick={(e) => openModal(e, protocol, `5T Verification: ${protocol}`, description)}
                            />
                        )}
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-black tracking-tight mb-1 italic">
                            {title}
                        </h3>
                        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium mb-4`}>
                            {description}
                        </p>


                        {metrics && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {metrics.map((m, i) => (
                                    <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[9px] opacity-40 uppercase font-bold tracking-wider mb-0.5">{m.label}</p>
                                        <p className="text-sm font-black truncate" style={{ color }}>{m.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {devMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-[#63a6b0] uppercase tracking-widest">{t('omni.console.spectrum')}</span>
                                    <div className="flex gap-1">

                                        <div className="w-1 h-3 bg-blue-400 rounded-full" />
                                        <div className="w-1 h-3 bg-indigo-400 rounded-full" />
                                        <div className="w-1 h-3 bg-purple-400 rounded-full" />
                                        <div className="w-1 h-3 bg-rose-400 rounded-full" />
                                        <div className="w-1 h-3 bg-amber-400 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <span className="px-1.5 py-0.5 rounded bg-[#63a6b0]/10 text-[7px] font-mono text-[#63a6b0]">sys:protocol:5t</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[7px] font-mono text-slate-500">core:v6.2.quantum</span>
                                </div>
                            </motion.div>
                        )}
                    </div>


                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-slate-400">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
            </Link>
            <ProtocolModal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ ...modalData, isOpen: false })}
                type={modalData.type}
                title={modalData.title}
                content={modalData.content}
            />
        </motion.div>
    );
};

const OmniAllInOneHubContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t, language, setLanguage } = useLanguage();
    const { isDevMode, toggleDevMode } = useOmniContext();

    const [selectedModule, setSelectedModule] = useState<string>('all');
    const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
    const isDark = resolvedMode === 'dark';


    const toggleLang = () => setLanguage(language === 'zh-TW' ? 'en-US' : 'zh-TW');

    const filteredModules = selectedModule === 'all'
        ? ['report', 'intelligence', 'avatar', 'users', 'village', 'backend']
        : [selectedModule];

    return (
        <div className={`min-h-screen pt-24 pb-12 px-8 ${isDark ? 'bg-[#050810] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500`}>
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Top Bar / Header */}
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-tight">
                                {t('mvp.hub.title')}
                            </h1>

                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={toggleDevMode}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${isDevMode ? 'bg-[#63a6b0]/40 border-[#63a6b0]' : 'bg-[#63a6b0]/20 border-[#63a6b0]/30 opacity-60 hover:opacity-100'}`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${isDevMode ? 'bg-[#63a6b0] animate-ping' : 'bg-[#63a6b0]'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#63a6b0]">{isDevMode ? t('omni.dev.mapping.active') : t('omni.dev.protocol.standby')}</span>
                                </button>

                                <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40">{t('mvp.hub.subtitle')}</p>
                            </div>


                        </motion.div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsConsoleOpen(true)}
                            className={`p-3 rounded-2xl border flex items-center gap-2 transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                            title="Open Tag Console"
                        >
                            <Terminal size={18} className="text-[#63a6b0]" />
                        </button>
                        <button
                            onClick={toggleLang}
                            className={`p-3 rounded-2xl border flex items-center gap-2 transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Languages size={18} className="text-[#63a6b0]" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{language === 'zh-TW' ? 'EN' : '繁中'}</span>
                        </button>
                    </div>

                </header>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
                    {/* 1. Sustainability Report */}
                    {filteredModules.includes('report') && (
                        <BentoCard
                            span="lg:col-span-8 md:col-span-4 row-span-2"
                            title={t('mvp.modules.report.title')}
                            description={t('mvp.modules.report.desc')}
                            icon={FileText}
                            color="#63a6b0"
                            path="/esg-report-center"
                            protocol="TRANSPARENT"
                            metrics={[
                                { label: t('mvp.metrics.overview'), value: 'Indicator Overview' },
                                { label: t('mvp.metrics.data'), value: 'Data Inventory' },
                                { label: t('mvp.metrics.audit'), value: 'Compliance Audit' },
                                { label: t('mvp.metrics.report'), value: 'Generator' }
                            ]}
                            devMode={isDevMode}
                        />

                    )}


                    {/* 2. Business Intelligence */}
                    {filteredModules.includes('intelligence') && (
                        <BentoCard
                            span="lg:col-span-4 md:col-span-4 row-span-2"
                            title={t('mvp.modules.intelligence.title')}
                            description={t('mvp.modules.intelligence.desc')}
                            icon={TrendingUp}
                            color="#3b82f6"
                            path="/intelligence/market"
                            protocol="TRACEABLE"
                            metrics={[
                                { label: t('mvp.metrics.trace'), value: 'Trace Chain' },
                                { label: t('mvp.metrics.origin'), value: 'Source Origin' },
                                { label: t('mvp.metrics.rival'), value: 'Competitor Bm' },
                                { label: t('mvp.metrics.law'), value: 'Regulatory' }
                            ]}
                            devMode={isDevMode}
                        />

                    )}


                    {/* 3. Digital Twin */}
                    {filteredModules.includes('avatar') && (
                        <BentoCard
                            span="lg:col-span-4 md:col-span-4 row-span-2"
                            title={t('mvp.modules.avatar.title')}
                            description={t('mvp.modules.avatar.desc')}
                            icon={UserCircle}
                            color="#8b5cf6"
                            path="/avatar/center"
                            protocol="TRACKABLE"
                            metrics={[
                                { label: t('mvp.metrics.awakening'), value: 'The Awakening' },
                                { label: t('mvp.metrics.forge'), value: 'Skill Forge' },
                                { label: t('mvp.metrics.agency'), value: 'Agency Node' },
                                { label: t('mvp.metrics.omni'), value: 'Omni Converter' }
                            ]}
                            devMode={isDevMode}
                        />

                    )}


                    {/* 4. Personal Hub */}
                    {filteredModules.includes('users') && (
                        <BentoCard
                            span="lg:col-span-4 md:col-span-4 row-span-1"
                            title={t('mvp.modules.personal.title')}
                            description={t('mvp.modules.personal.desc')}
                            icon={Users}
                            color="#10b981"
                            path="/personal-hub"
                            protocol="TRUSTWORTHY"
                            metrics={[
                                { label: t('mvp.metrics.imprint'), value: 'Imprinting' },
                                { label: t('mvp.metrics.contract'), value: 'Permission Matrix' },
                                { label: t('mvp.metrics.audit_log'), value: 'Activity Log' },
                                { label: t('mvp.metrics.badge'), value: 'Soul Badge' }
                            ]}
                            devMode={isDevMode}
                        />

                    )}


                    {/* 5. Village ARPG (Benevolent Village) */}
                    {filteredModules.includes('village') && (
                        <BentoCard
                            span="lg:col-span-4 md:col-span-4 row-span-2"
                            title={t('mvp.modules.village.title')}
                            description={t('mvp.modules.village.desc')}
                            icon={Home}
                            color="#f59e0b"
                            path="/esg/village"
                            protocol="TRANSPARENT"
                            metrics={[
                                { label: t('mvp.metrics.map'), value: 'Village Map' },
                                { label: t('mvp.metrics.eco'), value: 'Ecosystem' },
                                { label: t('mvp.metrics.energy'), value: 'Energy Engine' },
                                { label: t('mvp.metrics.guild'), value: 'Mission Guild' }
                            ]}
                            devMode={isDevMode}
                        />

                    )}


                    {/* 6. Omni Backend */}
                    {filteredModules.includes('backend') && (
                        <BentoCard
                            span="lg:col-span-8 md:col-span-8 row-span-1"
                            title={t('mvp.modules.backend.title')}
                            description={t('mvp.modules.backend.desc')}
                            icon={Settings}
                            color="#ec4899"
                            path="/omni-backend"
                            protocol="TRACKABLE"
                            metrics={[
                                { label: t('mvp.metrics.entropy'), value: 'Entropy Dash' },
                                { label: t('mvp.metrics.net'), value: 'Agent Orchest' },
                                { label: t('mvp.metrics.review'), value: 'Arch Review' },
                                { label: t('mvp.metrics.i18n'), value: 'I18n Mapping' }
                            ]}
                            devMode={isDevMode}
                        />

                    )}

                </div>
            </div>

            {/* Global Floating Navigation */}
            <FloatingOrb onModuleSelect={setSelectedModule} />

            {/* Status Footer Ticker */}
            <div className={`fixed bottom-0 left-0 right-0 h-10 border-t ${isDark ? 'bg-black/40 border-white/5' : 'bg-white/40 border-slate-200'} backdrop-blur-xl z-10 flex items-center px-6 overflow-hidden`}>
                <div className="flex gap-12 font-mono text-[8px] font-bold uppercase tracking-[0.5em] animate-marquee whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity">
                    {isDevMode && <span className="text-rose-500 font-extrabold">DEEP_MAPPING_PROTOCOL_OVERRIDE_ENABLED_://_SOVEREIGN_MODE</span>}
                    <span>5T_PROTOCOL_SYNCING</span>
                    <span className="text-[#63a6b0]">OMNI_ONE_KEEPER_ACTIVE</span>
                    <span>SUSTAINABILITY_VECTOR_OPTIMAL</span>
                    <span className="text-emerald-500">TRUTH_CRYSTAL_LOCKED</span>
                    <span>RESISTANCE_MINIMAL</span>
                </div>
            </div>
            <OmniTagConsole
                isOpen={isConsoleOpen}
                onClose={() => setIsConsoleOpen(false)}
            />
        </div>

    );
};

const OmniAllInOneHub: React.FC = () => (
    <StitchThemeProvider>
        <OmniAllInOneHubContent />
    </StitchThemeProvider>
);

export default OmniAllInOneHub;
