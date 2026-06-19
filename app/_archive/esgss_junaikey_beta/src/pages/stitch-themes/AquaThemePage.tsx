import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Droplets, ArrowRight, Activity, Leaf, Wind, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSettingsPanel } from './components/ThemeSettingsPanel';

const AquaThemeContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const themeColors = {
        bg: isDark ? 'bg-slate-950' : 'bg-[#F0F8FA]',
        text: isDark ? 'text-slate-100' : 'text-slate-800',
        subText: isDark ? 'text-slate-400' : 'text-slate-600',
        cardBg: isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100',
        accentBg: isDark ? 'bg-[#00FFFF]/20' : 'bg-[#00FFFF]/10',
        hoverBg: isDark ? 'hover:bg-slate-800' : 'hover:bg-[#F0F8FA]',
    };

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-sans selection:bg-[#00FFFF] selection:text-white pb-20 transition-colors duration-500`}>
                {/* Header Controls */}
                <div className="pt-8 px-8 flex justify-between items-center">
                    <Link to="/stitch-showcase" className={`inline-flex items-center gap-2 text-[#00FFFF] hover:text-[#4a8996] transition-colors font-medium`}>
                        <ArrowRight className="rotate-180" size={16} /> Back to Hub
                    </Link>
                    <ThemeSettingsPanel />
                </div>

                {/* Hero Section */}
                <section className="relative pt-24 pb-20 px-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00FFFF]/10 to-transparent -z-10" />
                    <div className={`absolute top-20 right-20 w-96 h-96 bg-[#00FFFF]/20 rounded-full blur-3xl -z-10 animate-pulse`} />

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className={`inline-flex items-center gap-2 px-3 py-1 ${themeColors.accentBg} text-[#00FFFF] rounded-full text-xs font-semibold mb-6`}>
                                <Sparkles size={14} /> Element: {t('theme.aqua')}
                            </div>
                            <h1 className={`text-6xl font-black leading-tight ${themeColors.text} mb-6`}>
                                源起 <span className={`text-3xl font-light block mt-2 ${themeColors.subText}`}>The Source</span>
                                <span className="text-[#00FFFF] block mt-4 text-5xl">上�??�水</span>
                            </h1>
                            <p className={`text-lg ${themeColors.subText} mb-8 leading-relaxed`}>
                                <strong>Highest Good is Like Water.</strong><br />
                                {t('theme.aqua.desc')}
                            </p>
                            <div className="flex gap-4">
                                <button className="px-8 py-4 bg-[#00FFFF] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#00FFFF]/30 transition-all active:scale-95 flex items-center gap-2">
                                    Begin Flow <ArrowRight size={18} />
                                </button>
                                <button className={`px-8 py-4 ${isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'} border rounded-xl font-bold hover:border-[#00FFFF] hover:text-[#00FFFF] transition-all`}>
                                    Wisdom Protocol
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className={`p-8 rounded-3xl shadow-2xl ${themeColors.cardBg} border relative z-10 transition-colors duration-500`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className={`text-2xl font-bold ${themeColors.text}`}>Origin Metrics</h3>
                                        <p className={`${themeColors.subText} text-sm`}>Source Vitality Monitor</p>
                                    </div>
                                    <div className={`p-3 ${themeColors.accentBg} rounded-xl text-[#00FFFF]`}>
                                        <Activity size={24} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Wisdom Flow', value: 'Phase 1', icon: Wind },
                                        { label: 'Source Purity', value: '100%', icon: Droplets },
                                        { label: 'Benevolence', value: 'Active', icon: Leaf },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${themeColors.hoverBg} transition-colors cursor-default group`}>
                                            <div className={`p-3 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-lg group-hover:bg-[#00FFFF]/10 group-hover:text-[#00FFFF] transition-all`}>
                                                <item.icon size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                                                    <span className="font-bold text-[#00FFFF]">{item.value}</span>
                                                </div>
                                                <div className={`h-2 w-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                                    <div className="h-full bg-[#00FFFF] rounded-full" style={{ width: item.value === 'Active' ? '100%' : '80%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Background elements */}
                            <div className="absolute -inset-4 bg-[#00FFFF]/20 rounded-[2rem] -z-10 rotate-3" />
                            <div className="absolute -inset-4 bg-[#FFD700]/10 rounded-[2rem] -z-20 -rotate-2" />
                        </motion.div>
                    </div>
                </section>

                {/* Philosophy Grid */}
                <section className={`py-20 px-8 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Fluid Strategy', desc: 'Adapts to any vessel, overcomes any obstacle.' },
                                { title: 'Deep Wisdom', desc: 'Quiet, powerful, and fundamental to life.' },
                                { title: 'Pure Origin', desc: 'Transparent, clear, and traceable to the source.' }
                            ].map((feature, i) => (
                                <div key={i} className={`p-8 rounded-2xl ${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-[#F0F8FA]'} border border-transparent hover:border-[#00FFFF]/20 transition-all group`}>
                                    <div className={`w-12 h-12 ${isDark ? 'bg-slate-700' : 'bg-white'} rounded-xl shadow-sm flex items-center justify-center text-[#00FFFF] mb-6 group-hover:scale-110 transition-transform`}>
                                        <Waves />
                                    </div>
                                    <h3 className={`text-xl font-bold ${themeColors.text} mb-3`}>{feature.title}</h3>
                                    <p className={themeColors.subText}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className={`py-12 text-center text-sm border-t ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                    <Link to="/stitch-showcase" className="hover:text-[#00FFFF] transition-colors">??Back to Benevolent Sustainability Hub</Link>
                </footer>
            </div>
        </MainLayout>
    );
};

const AquaThemePage: React.FC = () => (
    <StitchThemeProvider>
        <AquaThemeContent />
    </StitchThemeProvider>
);

export default AquaThemePage;

