import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Leaf, Database, Layers, Search, BarChart3, Map, Grid, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSettingsPanel } from './components/ThemeSettingsPanel';

const OceanThemeContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const themeColors = {
        bg: isDark ? 'bg-[#0F172A]' : 'bg-slate-50',
        headerBg: isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
        text: isDark ? 'text-slate-100' : 'text-slate-800',
        subText: isDark ? 'text-slate-400' : 'text-slate-600',
        cardBg: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
        inputBg: isDark ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400',
        tableHeader: isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200',
        tableRowHover: isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50',
        chartBg: isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100',
    };

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col md:flex-row transition-colors duration-500`}>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {/* Topbar */}
                    <header className={`${themeColors.headerBg} h-16 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-500`}>
                        <h1 className={`text-lg font-bold ${themeColors.text} flex items-center gap-2`}>
                            <span className={themeColors.subText}><Link to="/stitch-showcase" className="hover:underline">Foundation</Link> /</span> Earth Core
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'} w-4 h-4`} />
                                <input
                                    type="text"
                                    placeholder={t('ui.search.placeholder')}
                                    className={`pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-500 focus:border-transparent' : 'focus:ring-slate-900 focus:border-transparent'} w-64 transition-colors`}
                                    style={{
                                        backgroundColor: isDark ? '#020617' : '#ffffff',
                                        borderColor: isDark ? '#334155' : '#e2e8f0',
                                        color: isDark ? '#f1f5f9' : '#0f172a'
                                    }}
                                />
                            </div>
                            <ThemeSettingsPanel />
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                E
                            </div>
                        </div>
                    </header>

                    <div className="p-8 max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-8">
                            <div className={`inline-flex items-center gap-2 px-2 py-1 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'} rounded text-xs font-bold mb-4`}>
                                <Globe size={12} /> Element: {t('theme.ocean')}
                            </div>
                            <h2 className={`text-4xl font-bold ${themeColors.text} mb-2`}>生態 Ecosystem ({t('theme.ocean')})</h2>
                            <p className={`${themeColors.subText} max-w-3xl leading-relaxed`}>
                                "Virtue bears all things" (厚德載物).
                                <br />{t('theme.ocean.desc')}
                            </p>
                        </div>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Featured Metric */}
                            <div className={`col-span-1 lg:col-span-2 ${themeColors.cardBg} rounded-lg border p-6 shadow-sm transition-colors duration-500`}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`font-bold ${themeColors.text}`}>Global Biodiversity Index</h3>
                                    <div className="flex gap-2">
                                        <button className={`px-3 py-1 text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} rounded transition-colors`}>Year</button>
                                        <button className={`px-3 py-1 text-xs font-medium ${isDark ? 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'} border rounded transition-colors`}>Month</button>
                                    </div>
                                </div>
                                <div className={`h-48 ${themeColors.chartBg} rounded border flex items-center justify-center ${themeColors.subText} flex-col gap-2 transition-colors duration-500`}>
                                    <BarChart3 size={32} strokeWidth={1} />
                                    <span className="text-xs">Data Visualization Visualization Area</span>
                                </div>
                            </div>

                            {/* Side Metric */}
                            <div className={`${themeColors.cardBg} rounded-lg border p-6 shadow-sm flex flex-col justify-between transition-colors duration-500`}>
                                <div>
                                    <div className={`text-sm font-medium ${themeColors.subText} mb-1`}>Total Species Protected</div>
                                    <div className={`text-4xl font-bold ${themeColors.text} mb-4`}>12,842</div>
                                    <div className="text-sm text-green-600 flex items-center gap-1 font-medium">
                                        <ArrowRight size={12} className="-rotate-45" /> +12% vs last year
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className={themeColors.subText}>Flora</span>
                                        <span className={`font-bold ${themeColors.text}`}>45%</span>
                                    </div>
                                    <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} h-2 rounded-full overflow-hidden`}>
                                        <div className="bg-emerald-500 h-full w-[45%]" />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className={themeColors.subText}>Fauna</span>
                                        <span className={`font-bold ${themeColors.text}`}>32%</span>
                                    </div>
                                    <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} h-2 rounded-full overflow-hidden`}>
                                        <div className="bg-blue-500 h-full w-[32%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Table Section */}
                        <div className={`${themeColors.cardBg} rounded-lg border shadow-sm overflow-hidden transition-colors duration-500`}>
                            <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} flex justify-between items-center`}>
                                <h3 className={`font-bold ${themeColors.text}`}>Protected Zones</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
                            </div>
                            <table className={`w-full text-left text-sm ${themeColors.subText}`}>
                                <thead className={`${themeColors.tableHeader} border-b transition-colors duration-500`}>
                                    <tr>
                                        <th className={`px-6 py-3 font-semibold ${themeColors.text}`}>Zone Name</th>
                                        <th className={`px-6 py-3 font-semibold ${themeColors.text}`}>Region</th>
                                        <th className={`px-6 py-3 font-semibold ${themeColors.text}`}>Status</th>
                                        <th className={`px-6 py-3 font-semibold ${themeColors.text} text-right`}>Area (km²)</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                    {[
                                        { name: 'Amazon Basin Reserve', region: 'South America', status: 'Active', area: '14,000' },
                                        { name: 'Coral Triangle', region: 'Asia Pacific', status: 'Monitoring', area: '8,500' },
                                        { name: 'Congo Rainforest', region: 'Africa', status: 'Active', area: '11,200' },
                                        { name: 'Boreal Shield', region: 'North America', status: 'Protected', area: '22,000' },
                                    ].map((row, i) => (
                                        <tr key={i} className={`${themeColors.tableRowHover} transition-colors`}>
                                            <td className={`px-6 py-4 font-medium ${themeColors.text}`}>{row.name}</td>
                                            <td className="px-6 py-4">{row.region}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-700' : (isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700')}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono">{row.area}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

const OceanThemePage: React.FC = () => (
    <StitchThemeProvider>
        <OceanThemeContent />
    </StitchThemeProvider>
);

export default OceanThemePage;
