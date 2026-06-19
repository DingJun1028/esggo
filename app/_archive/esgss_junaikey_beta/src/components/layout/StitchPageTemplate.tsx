import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface StitchPageTemplateProps {
    title?: string;
    subtitle?: string;
    id?: string;
    children: React.ReactNode;
    activeView?: View;
    headerIcon?: React.ReactNode;
    headerAction?: React.ReactNode;
    showTicker?: boolean;
    tickerMessages?: string[];
    className?: string;
    breadcrumbs?: BreadcrumbItem[];
}

const StitchPageTemplateContent: React.FC<StitchPageTemplateProps> = ({
    title,
    subtitle,
    id,
    children,
    activeView = View.STYLE_GUIDE,
    headerIcon,
    headerAction,
    showTicker = true,
    tickerMessages,
    className = "",
    breadcrumbs
}) => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const defaultMessages = [
        "SYSTEM_RESONANCE_ACTIVE",
        "5T_PROTOCOL_ENFORCED",
        "OMNI_CORE_STABLE",
        "TRUTH_CRYSTAL_SYNCED"
    ];

    const messages = tickerMessages || defaultMessages;

    return (
        <MainLayout activeView={activeView} onViewChange={() => { }}>
            <div id={id} className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans relative overflow-x-hidden transition-colors duration-500 ${className}`}>

                {/* Background Aesthetics - Picture Style / Universe */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Deep Space Base */}
                    <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${isDark ? 'from-slate-900 via-[#0B0C10] to-[#000000]' : 'from-slate-100 via-white to-slate-50'}`} />

                    {/* Nebula / Aurora Effects */}
                    <div className={`absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`} />
                    <div className={`animated-aura absolute -top-[10%] -left-[10%] w-[700px] h-[700px] rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-[#63a6b0]/30' : 'bg-[#63a6b0]/10'} mix-blend-screen`} />
                    <div className={`animated-aura absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 ${isDark ? 'bg-amber-500/20' : 'bg-amber-500/10'} mix-blend-screen`} />
                    <div className={`animated-aura absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/5'} mix-blend-screen`} />
                </div>

                <div className="relative z-10 p-8 pt-24 max-w-7xl mx-auto pb-32">
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="mb-6 flex items-center space-x-2 text-xs font-mono uppercase tracking-widest opacity-60">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <span>/</span>}
                                    <a href={crumb.href} className="hover:text-[#63a6b0] transition-colors">
                                        {crumb.label}
                                    </a>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* Standardized Header */}
                    {(title || subtitle) && (
                        <div className="mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-4">
                                    {headerIcon && (
                                        <div className="p-4 bg-[#63a6b0]/20 rounded-2xl text-[#63a6b0] shadow-lg shadow-[#63a6b0]/20">
                                            {headerIcon}
                                        </div>
                                    )}
                                    <div>
                                        {title && (
                                            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                                                {title}
                                            </h1>
                                        )}
                                        {subtitle && (
                                            <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-50 mt-2">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                                    {headerAction ? headerAction : (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                                                Integrity: Locked
                                            </span>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Page Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Status Bar Ticker */}
                {showTicker && (
                    <div className={`fixed bottom-0 left-0 right-0 h-12 border-t ${isDark ? 'bg-black/80 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-2xl z-50 flex items-center px-8 overflow-hidden`}>
                        <div className="flex gap-12 font-mono text-[9px] font-bold uppercase tracking-[0.5em] animate-marquee whitespace-nowrap">
                            {messages.map((msg, idx) => (
                                <span key={idx} className={idx % 2 === 0 ? "text-[#63a6b0] drop-shadow-[0_0_8px_#63a6b0]" : "opacity-40"}>
                                    {msg}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export const StitchPageTemplate: React.FC<StitchPageTemplateProps> = (props) => (
    <StitchThemeProvider>
        <StitchPageTemplateContent {...props} />
    </StitchThemeProvider>
);
