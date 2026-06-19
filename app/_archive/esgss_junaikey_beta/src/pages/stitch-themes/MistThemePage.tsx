import React from 'react';
import { motion } from 'framer-motion';
import { CloudFog, Wind, Flame, ThermometerSun, AlertTriangle, ArrowUpRight, CloudRain, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSettingsPanel } from './components/ThemeSettingsPanel';

const MistThemeContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const themeColors = {
        bg: isDark ? 'bg-slate-950' : 'bg-slate-200',
        text: isDark ? 'text-slate-200' : 'text-slate-700',
        subText: isDark ? 'text-slate-400' : 'text-slate-600',
        cardBg: isDark ? 'bg-slate-900/40 border-white/10' : 'bg-white/40 border-white/50',
        glassContainer: isDark ? 'bg-slate-900/30 border-white/10 shadow-black/50' : 'bg-white/30 border-white/20 shadow-slate-300/50',
        metricCard: isDark ? 'bg-slate-800/40 border-white/10' : 'bg-white/40 border-white/50',
        blob1: isDark ? 'bg-rose-500/10' : 'bg-rose-400/20',
        blob2: isDark ? 'bg-orange-500/10' : 'bg-orange-300/20',
        blob3: isDark ? 'bg-slate-700/20' : 'bg-slate-300/40',
    };

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-sans selection:bg-rose-200 selection:text-rose-900 overflow-hidden relative transition-colors duration-500`}>

                {/* Ambient Background */}
                <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] ${themeColors.blob1} rounded-full blur-[120px] mix-blend-multiply animate-blob transition-colors duration-700`} />
                <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] ${themeColors.blob2} rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000 transition-colors duration-700`} />
                <div className={`absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] ${themeColors.blob3} rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000 transition-colors duration-700`} />

                {/* Glass Container */}
                <div className={`relative z-10 min-h-screen flex flex-col backdrop-blur-3xl ${themeColors.glassContainer} border-x max-w-7xl mx-auto shadow-2xl transition-all duration-500`}>

                    {/* Header Controls */}
                    <div className="pt-8 px-8 flex justify-between items-center">
                        <Link to="/stitch-showcase" className={`inline-flex items-center gap-2 ${isDark ? 'text-rose-400' : 'text-rose-600'} hover:underline transition-colors font-medium`}>
                            <ArrowRight className="rotate-180" size={16} /> Back to Hub
                        </Link>
                        <ThemeSettingsPanel />
                    </div>

                    <main className="flex-1 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 ${isDark ? 'bg-white/10 text-rose-300' : 'bg-white/40 text-rose-600'} border border-white/50 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md transition-colors`}>
                                <Zap size={12} /> Element: {t('theme.mist')}
                            </div>

                            <div>
                                <h1 className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${isDark ? 'from-slate-100 to-slate-400' : 'from-slate-800 to-slate-500'} mb-2 tracking-tighter`}>
                                    氣候
                                </h1>
                                <h2 className="text-4xl md:text-5xl font-light text-rose-500 flex items-center gap-4">
                                    Climate Action <span className={`text-sm font-bold ${isDark ? 'bg-rose-900/30 text-rose-300 border-rose-800/50' : 'bg-rose-100 text-rose-600 border-rose-200/50'} px-3 py-1 rounded-full border tracking-wide transition-colors`}>薪火相傳</span>
                                </h2>
                            </div>

                            <p className={`text-xl ${themeColors.subText} leading-relaxed font-light`}>
                                "The fire of innovation must burn brighter than the fire of destruction."
                                <br /><br />
                                {t('theme.mist.desc')}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Net Zero Target', value: '2030', icon: CloudFog },
                                    { label: 'Current Reduction', value: '-18%', icon: ArrowUpRight },
                                ].map((stat, i) => (
                                    <div key={i} className={`${themeColors.metricCard} backdrop-blur-md p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all group`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <stat.icon className={`${isDark ? 'text-slate-500 group-hover:text-rose-400' : 'text-slate-400 group-hover:text-rose-500'} transition-colors`} />
                                            <span className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'} uppercase`}>Projection</span>
                                        </div>
                                        <div className={`text-4xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} mb-1`}>{stat.value}</div>
                                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium`}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content - Glass Cards */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* Weather/Status Card */}
                            <div className="bg-gradient-to-br from-rose-500 to-orange-400 rounded-3xl p-1 shadow-2xl shadow-rose-500/20">
                                <div className="bg-white/10 backdrop-blur-md rounded-[20px] p-6 text-white h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-32 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div>
                                            <div className="text-rose-100/80 text-sm font-medium mb-1">Global Temperature</div>
                                            <div className="text-5xl font-bold tracking-tighter">+1.2°C</div>
                                        </div>
                                        <ThermometerSun size={48} className="text-white/80" />
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3 bg-black/10 p-3 rounded-xl border border-white/10">
                                            <AlertTriangle size={20} className="text-yellow-300" />
                                            <div className="flex-1">
                                                <div className="text-sm font-bold">Heat Warning</div>
                                                <div className="text-xs text-white/70">Zone B experiencing extreme variance.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* List Card */}
                            <div className={`${isDark ? 'bg-slate-800/60 border-white/10 shadow-black/30' : 'bg-white/60 border-white/60 shadow-slate-200/50'} backdrop-blur-xl rounded-3xl p-6 border shadow-xl transition-colors`}>
                                <h3 className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-4 flex items-center gap-2`}>
                                    <CloudRain size={18} className="text-blue-500" />
                                    Emission Contributors
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Manufacturing', val: 45, color: 'bg-slate-800' },
                                        { name: 'Logistics', val: 32, color: 'bg-rose-500' },
                                        { name: 'Operations', val: 23, color: 'bg-orange-400' },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-white/50'} rounded-lg transition-colors cursor-pointer`}>
                                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                            <div className={`flex-1 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.name}</div>
                                            <div className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{item.val}%</div>
                                        </div>
                                    ))}
                                </div>
                                <button className={`w-full mt-6 py-3 border ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'} rounded-xl text-sm font-bold transition-colors`}>
                                    View Full Report
                                </button>
                            </div>

                        </div>
                    </main>
                </div>

                {/* CSS Animation for blobs */}
                <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
            </div>
        </MainLayout>
    );
};

const MistThemePage: React.FC = () => (
    <StitchThemeProvider>
        <MistThemeContent />
    </StitchThemeProvider>
);

export default MistThemePage;
