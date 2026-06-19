import React from 'react';
import { motion } from 'framer-motion';
import { Star, Crown, Diamond, CheckCircle2, TrendingUp, Shield, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSettingsPanel } from './components/ThemeSettingsPanel';

const GoldThemeContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const themeColors = {
        bg: isDark ? 'bg-neutral-900' : 'bg-[#FFFDF5]',
        text: isDark ? 'text-amber-50' : 'text-neutral-900',
        subText: isDark ? 'text-amber-100/60' : 'text-neutral-600',
        cardBg: isDark ? 'bg-neutral-800/50' : 'bg-white',
        cardBorder: isDark ? 'border-amber-500/30' : 'border-amber-200',
        buttonPrimary: 'bg-amber-500 text-neutral-900 hover:bg-amber-400',
        buttonSecondary: isDark
            ? 'text-amber-400 border-amber-500/30 hover:bg-amber-900/20'
            : 'text-amber-700 border-amber-300 hover:bg-amber-50',
    };

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-sans selection:bg-amber-400 selection:text-black transition-colors duration-500`}>

                {/* Header Controls */}
                <div className="pt-8 px-8 flex justify-between items-center relative z-20">
                    <Link to="/stitch-showcase" className={`inline-flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-700'} hover:underline transition-colors font-medium`}>
                        <ArrowRight className="rotate-180" size={16} /> Back to Hub
                    </Link>
                    <ThemeSettingsPanel />
                </div>

                {/* Hero Section */}
                <section className="relative pt-20 pb-20 px-8 overflow-hidden">
                    {/* Luxe Background */}
                    <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-900 to-neutral-900' : 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-100/40 via-[#FFFDF5] to-[#FFFDF5]'} -z-10 transition-colors duration-500`} />
                    <div className={`absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent ${isDark ? 'via-amber-500/50' : 'via-amber-400/30'} to-transparent -z-10`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-32 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-amber-500/50' : 'via-amber-400/30'} to-transparent -z-10`} />

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className={`inline-flex items-center gap-2 px-3 py-1 border ${isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-600/20 text-amber-700'} rounded-sm text-xs font-bold mb-8 uppercase tracking-[0.2em]`}>
                                <Diamond size={12} /> Element: {t('theme.gold')}
                            </div>
                            <h1 className={`text-7xl font-serif ${isDark ? 'text-amber-50' : 'text-neutral-900'} mb-6 leading-tight`}>
                                價值 <span className={`text-2xl font-sans font-light block mt-2 ${isDark ? 'text-amber-200/50' : 'text-amber-800/40'} uppercase tracking-widest`}>True Value</span>
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-amber-300 via-yellow-200 to-amber-500' : 'from-amber-600 via-yellow-500 to-amber-600'} block mt-4 font-sans font-black italic`}>誠信如金</span>
                            </h1>
                            <p className={`text-lg ${themeColors.subText} mb-10 leading-relaxed max-w-lg border-l-2 ${isDark ? 'border-amber-500/30' : 'border-amber-300'} pl-6`}>
                                <strong>Integrity is Gold.</strong><br />
                                {t('theme.gold.desc')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className={`px-8 py-4 ${themeColors.buttonPrimary} font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 rounded-sm`}>
                                    Invest in Trust <TrendingUp size={18} />
                                </button>
                                <button className={`px-8 py-4 ${themeColors.buttonSecondary} border transition-all font-medium flex items-center justify-center gap-2 rounded-sm`}>
                                    Asset Report
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Gold Card */}
                            <div className={`${isDark ? 'bg-neutral-800/50' : 'bg-white/80'} backdrop-blur-xl p-1 rounded-2xl border ${themeColors.cardBorder} shadow-2xl relative transition-colors duration-500`}>
                                <div className="absolute -top-3 -right-3 bg-amber-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/40 z-20">
                                    AAA RATED
                                </div>

                                <div className={`${isDark ? 'bg-neutral-900 border-white/5' : 'bg-[#FFFDF5] border-amber-100'} rounded-xl p-8 border h-full transition-colors duration-500`}>
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <p className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-1">Global Trust Index</p>
                                            <h3 className={`text-4xl font-bold ${themeColors.text}`}>99.98<span className="text-lg text-amber-500/60 ml-1">pts</span></h3>
                                        </div>
                                        <div className={`p-3 ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} rounded-lg text-amber-500 border`}>
                                            <Shield size={24} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { label: 'Green Bonds', value: '+24.5%', trend: 'up' },
                                            { label: 'Verification Level', value: 'Diamond', trend: 'flat' },
                                            { label: 'Integrity Score', value: 'Perfect', trend: 'up' },
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center justify-between p-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50 border-amber-100'} rounded-lg border hover:border-amber-500/30 transition-colors group`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                                    <span className={`${isDark ? 'text-neutral-300' : 'text-neutral-600'} font-medium`}>{item.label}</span>
                                                </div>
                                                <span className={`${isDark ? 'text-amber-100' : 'text-amber-800'} font-mono font-bold`}>{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-amber-100'} flex justify-between text-xs text-neutral-500 uppercase tracking-widest`}>
                                        <span>Verified by InfoOne</span>
                                        <span>ID: #G-88219</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Glow */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${isDark ? 'bg-amber-500/20' : 'bg-amber-400/20'} blur-[100px] -z-10 pointer-events-none transition-colors duration-500`} />
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className={`py-24 px-8 border-t ${isDark ? 'border-white/5 bg-neutral-900' : 'border-amber-100 bg-white'} transition-colors duration-500`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Premium Trust', icon: Shield, desc: 'Unshakeable confidence in data integrity.' },
                                { title: 'Green Finance', icon: TrendingUp, desc: 'Capital flowing directly to sustainable impact.' },
                                { title: 'Solid Value', icon: Award, desc: 'Tangible assets backed by verified actions.' }
                            ].map((feature, i) => (
                                <div key={i} className={`p-8 border ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-amber-100 bg-amber-50/50'} rounded-none hover:border-amber-500/40 transition-colors group relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    <feature.icon className="text-amber-500 mb-6 w-10 h-10" />
                                    <h3 className={`text-xl font-bold ${themeColors.text} mb-3`}>{feature.title}</h3>
                                    <p className={`${themeColors.subText} group-hover:text-amber-600 transition-colors leading-relaxed`}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className={`py-12 text-center ${isDark ? 'text-neutral-600 bg-black' : 'text-neutral-400 bg-neutral-50'} text-xs uppercase tracking-widest`}>
                    <Link to="/stitch-showcase" className="hover:text-amber-500 transition-colors">← Back to Benevolent Sustainability Hub</Link>
                </footer>
            </div>
        </MainLayout>
    );
};

const GoldThemePage: React.FC = () => (
    <StitchThemeProvider>
        <GoldThemeContent />
    </StitchThemeProvider>
);

export default GoldThemePage;
