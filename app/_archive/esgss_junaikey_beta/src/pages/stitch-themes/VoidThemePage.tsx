import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText, Lock, ShieldCheck, Sprout, Gavel, Eye, Network, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSettingsPanel } from './components/ThemeSettingsPanel';

const VoidThemeContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const themeColors = {
        bg: isDark ? 'bg-black' : 'bg-zinc-100',
        text: isDark ? 'text-white' : 'text-zinc-900',
        subText: isDark ? 'text-white/60' : 'text-zinc-600',
        border: isDark ? 'border-white/10' : 'border-zinc-300',
        cardBg: isDark ? 'bg-black/80' : 'bg-white',
        cardBorder: isDark ? 'border-white/20' : 'border-zinc-300',
        accentText: isDark ? 'text-emerald-500' : 'text-emerald-700',
        accentBorder: isDark ? 'border-emerald-500/50' : 'border-emerald-600/30',
        elementBadge: isDark ? 'bg-emerald-950/20 text-emerald-500 border-emerald-500/50' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
        buttonPrimary: isDark
            ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black'
            : 'border-emerald-700 text-emerald-800 hover:bg-emerald-700 hover:text-white',
        buttonSecondary: isDark
            ? 'border-white/20 text-white/40 hover:bg-white/5 hover:text-white'
            : 'border-zinc-300 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800',
    };

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-mono selection:bg-emerald-900 selection:text-white flex flex-col transition-colors duration-500`}>

                <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full shadow-2xl">

                    {/* Left Panel: Command */}
                    <div className={`w-full md:w-1/3 p-8 md:p-12 ${isDark ? 'border-r border-white/10' : 'border-r border-zinc-200 bg-zinc-50'} flex flex-col justify-center transition-colors duration-500 relative`}>
                        {/* Header Controls */}
                        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
                            <Link to="/stitch-showcase" className={`inline-flex items-center gap-2 ${isDark ? 'text-emerald-500' : 'text-emerald-700'} hover:underline transition-colors font-medium text-xs uppercase tracking-widest`}>
                                <ArrowRight className="rotate-180" size={14} /> Hub
                            </Link>
                            <ThemeSettingsPanel />
                        </div>

                        <div className="mt-16">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 border ${themeColors.elementBadge} rounded-none text-xs font-bold mb-8 uppercase tracking-[0.2em] w-fit`}>
                                <Sprout size={12} /> Element: {t('theme.void')}
                            </div>

                            <h1 className="text-5xl font-bold mb-2">
                                治理 <span className={`block ${themeColors.accentText} mt-2`}>Governance</span>
                            </h1>
                            <h2 className={`text-xl ${isDark ? 'text-white/50' : 'text-zinc-500'} mb-8 font-light flex items-center gap-3`}>
                                <span className={`w-8 h-[1px] ${isDark ? 'bg-white/30' : 'bg-black/30'}`}></span>
                                growth & compliance
                                <span className={`font-bold border px-2 text-xs py-0.5 rounded-sm ${themeColors.elementBadge}`}>萬物生長</span>
                            </h2>

                            <p className={`text-sm ${themeColors.subText} mb-12 leading-loose`}>
                                "All things grow." (萬物生長)<br />
                                {t('theme.void.desc')}
                            </p>

                            <div className="space-y-4">
                                <button className={`w-full py-4 border ${themeColors.buttonPrimary} font-bold transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group`}>
                                    <Scale size={16} /> View Compliance Matrix
                                </button>
                                <button className={`block w-full py-4 border ${themeColors.buttonSecondary} font-bold transition-all uppercase tracking-widest text-sm text-center`}>
                                    Return to Void
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Matrix */}
                    <div className="w-full md:w-2/3 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
                        <div className={`absolute inset-0 ${isDark ? 'bg-black/80 backdrop-grayscale' : 'bg-white/90 backdrop-grayscale'} transition-colors duration-500`} />
                        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,1)_100%)]' : 'bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,1)_100%)]'} transition-colors duration-500`} />

                        <div className="relative z-10 p-8 md:p-16 h-full flex flex-col justify-end">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Card 1 */}
                                <div className={`${themeColors.cardBg} border ${themeColors.cardBorder} p-6 hover:${themeColors.accentBorder} transition-colors group shadow-lg`}>
                                    <ShieldCheck className={`${isDark ? 'text-white/30' : 'text-zinc-400'} group-hover:${themeColors.accentText} mb-4 transition-colors`} size={32} />
                                    <h3 className={`text-lg font-bold mb-2 ${themeColors.text}`}>Compliance</h3>
                                    <div className={`h-1 w-full ${isDark ? 'bg-white/10' : 'bg-zinc-200'} rounded-full mb-4 overflow-hidden`}>
                                        <div className="h-full bg-emerald-500 w-[98%]" />
                                    </div>
                                    <div className={`flex justify-between text-xs font-mono ${themeColors.subText}`}>
                                        <span>ISO 27001</span>
                                        <span className={themeColors.accentText}>PASSED</span>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className={`${themeColors.cardBg} border ${themeColors.cardBorder} p-6 hover:${themeColors.accentBorder} transition-colors group shadow-lg`}>
                                    <Network className={`${isDark ? 'text-white/30' : 'text-zinc-400'} group-hover:${themeColors.accentText} mb-4 transition-colors`} size={32} />
                                    <h3 className={`text-lg font-bold mb-2 ${themeColors.text}`}>Stakeholders</h3>
                                    <div className="flex -space-x-2 mb-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/10 border-black' : 'bg-zinc-200 border-white'} flex items-center justify-center text-xs ${isDark ? 'text-white/50' : 'text-zinc-500'}`}>
                                                U{i}
                                            </div>
                                        ))}
                                        <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-emerald-900/50 border-black text-emerald-400' : 'bg-emerald-100 border-white text-emerald-700'} flex items-center justify-center text-xs font-bold`}>
                                            +99
                                        </div>
                                    </div>
                                    <div className={`flex justify-between text-xs font-mono ${themeColors.subText}`}>
                                        <span>VOTING POWER</span>
                                        <span className={themeColors.text}>DISTRIBUTED</span>
                                    </div>
                                </div>

                                {/* Card 3 - Wide */}
                                <div className={`md:col-span-2 ${themeColors.cardBg} border ${themeColors.cardBorder} p-6 hover:${themeColors.accentBorder} transition-colors group flex items-center justify-between shadow-lg`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Gavel className={themeColors.accentText} size={20} />
                                            <h3 className={`text-lg font-bold ${themeColors.text}`}>Latest Resolution</h3>
                                        </div>
                                        <p className={`${themeColors.subText} text-sm max-w-md`}>Proposal #8821: Implementation of 100% Renewable Transition Plan by Q4 2026.</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${themeColors.text}`}>92%</div>
                                        <div className={`text-xs ${themeColors.accentText} uppercase tracking-wider`}>Approved</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

const VoidThemePage: React.FC = () => (
    <StitchThemeProvider>
        <VoidThemeContent />
    </StitchThemeProvider>
);

export default VoidThemePage;
