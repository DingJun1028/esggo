import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Globe, Wind, Database, Droplets, LayoutDashboard, FileText, Activity, GraduationCap, Bot, Variable, Share2, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { View } from '@/types/core';
import { StitchThemeProvider, useStitchTheme } from '@/contexts/StitchThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeSettingsPanel } from '@/pages/stitch-themes/components/ThemeSettingsPanel';

const Section: React.FC<{ title: string; subtitle: string; description: string; children: React.ReactNode; icon: React.ReactNode; themeColor: string }> = ({ title, subtitle, description, children, icon, themeColor }) => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    const getBgColorStyle = (color: string, opacity: number) => {
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return undefined; // Let Tailwind handle class-based colors
    };

    const getTextColorStyle = (color: string) => {
        if (color.startsWith('#')) {
            return color;
        }
        return undefined; // Let Tailwind handle class-based colors
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
                rounded-3xl p-8 border shadow-xl relative overflow-hidden group h-full transition-all duration-300 hover:shadow-2xl
                ${isDark
                    ? 'bg-slate-900 border-slate-700 shadow-slate-900/50'
                    : 'bg-white border-slate-100 shadow-slate-200/50'
                }
            `}
        >
            <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-10`}
                style={{ backgroundColor: getBgColorStyle(themeColor, 0.1) }}
            />

            <div className="relative z-10">
                <div
                    className={`p-4 rounded-2xl w-fit mb-6 ${!themeColor.startsWith('#') ? `bg-${themeColor}/10 text-${themeColor}` : ''}`}
                    style={{
                        backgroundColor: getBgColorStyle(themeColor, isDark ? 0.2 : 0.1),
                        color: getTextColorStyle(themeColor)
                    }}
                >
                    {icon}
                </div>

                <h3 className={`text-2xl font-bold mb-1 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {title}
                </h3>
                <p
                    className={`text-sm font-medium mb-4 uppercase tracking-wider opacity-80 ${!themeColor.startsWith('#') ? `text-${themeColor}` : ''}`}
                    style={{ color: getTextColorStyle(themeColor) }}
                >
                    {subtitle}
                </p>

                <p className={`mb-8 leading-relaxed h-20 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {description}
                </p>

                <div className={`rounded-xl p-6 border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 group-hover:bg-slate-750' : 'bg-slate-50 border-slate-100 group-hover:bg-white'}`}>
                    {children}
                </div>

                <div className={`mt-6 flex items-center text-sm font-semibold transition-colors ${isDark ? 'text-slate-500 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
                    Explore Theme <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

const StitchShowcaseContent: React.FC = () => {
    const { resolvedMode } = useStitchTheme();
    const { t } = useLanguage();
    const isDark = resolvedMode === 'dark';

    const themeColors = {
        bg: isDark ? 'bg-slate-950' : 'bg-slate-50',
        text: isDark ? 'text-white' : 'text-slate-900',
        textSub: isDark ? 'text-slate-400' : 'text-slate-600',
        headerBg: isDark ? 'bg-slate-900' : 'bg-white',
        borderColor: isDark ? 'border-slate-800' : 'border-slate-200',
    };

    return (
        <MainLayout activeView={View.STYLE_GUIDE} onViewChange={() => { }}>
            <div className={`min-h-screen font-sans pb-20 override-main-bg transition-colors duration-500 ${themeColors.bg} ${themeColors.text}`}>
                {/* Hero Header */}
                <header className={`${themeColors.headerBg} border-b ${themeColors.borderColor} py-20 px-8 text-center relative overflow-hidden transition-colors duration-500`}>
                    <div className={`absolute top-0 left-0 w-full h-full opacity-5 bg-cover bg-center transition-opacity duration-500 ${isDark ? 'opacity-10' : 'opacity-5'}`} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2576&auto=format&fit=crop')" }} />
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FFFF]/10 text-[#00FFFF] font-medium text-sm mb-6"
                        >
                            <Sparkles size={16} /> Google Stitch Design System
                        </motion.div>
                        <h1 className={`text-5xl font-black mb-6 tracking-tight ${themeColors.text}`}>
                            {t('stitch.hero.title')}
                        </h1>
                        <p className={`text-xl leading-relaxed mb-8 ${themeColors.textSub}`}>
                            {t('stitch.hero.subtitle')}
                        </p>

                        <div className="flex justify-center mt-8">
                            <ThemeSettingsPanel />
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-8 py-16">
                    <Link to="/stitch-nexus" className="block group mb-12">
                        <Section
                            title="Stitch Nexus Dashboard"
                            subtitle="Omni-Spatial Integration"
                            description="The ultimate spatial dashboard implementing the 5T protocol, combining all atomic themes into a single Bento Box experience."
                            icon={<LayoutDashboard size={32} />}
                            themeColor="#63a6b0"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[#63a6b0]">SYSTEM_EVOLUTION</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#63a6b0] animate-pulse" />
                                    <span className="text-xs opacity-50 font-mono">MVP_RESONANCE_ACTIVE</span>
                                </div>
                            </div>
                        </Section>
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Element 1: Water (Wisdom/Softness) -> Aqua (Primary) */}
                        <Link to="/stitch-showcase/aqua" className="block group">
                            <Section
                                title={t('theme.aqua')}
                                subtitle="Aqua Flow ??The Source"
                                description={t('theme.aqua.desc')}
                                icon={<Droplets size={32} />}
                                themeColor="#00FFFF" // Aqua
                            >
                                <div className="p-4 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-[#00FFFF]">FLOW_RATE</span>
                                        <span className="text-xs text-[#00FFFF]">98%</span>
                                    </div>
                                    <div className="h-2 bg-[#00FFFF]/20 rounded-full overflow-hidden">
                                        <div className="h-full w-[98%] bg-[#00FFFF] rounded-full" />
                                    </div>
                                </div>
                            </Section>
                        </Link>

                        {/* Element 2: Metal (Justice/Structure) -> Gold */}
                        <Link to="/stitch-showcase/gold" className="block group">
                            <Section
                                title={t('theme.gold')}
                                subtitle="Imperial Gold ??The Value"
                                description={t('theme.gold.desc')}
                                icon={<Star size={32} />}
                                themeColor="amber-500" // Gold
                            >
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs">Au</div>
                                    <div>
                                        <div className="text-xs font-bold text-amber-700">Gold Reserve</div>
                                        <div className="text-[10px] text-amber-600">Verified Asset</div>
                                    </div>
                                </div>
                            </Section>
                        </Link>

                        {/* Element 3: Earth (Trust/Foundation) -> Mist (Grey/Silver) */}
                        <Link to="/stitch-showcase/mist" className="block group">
                            <Section
                                title={t('theme.mist')}
                                subtitle="Silver Mist ??The Foundation"
                                description={t('theme.mist.desc')}
                                icon={<Globe size={32} />}
                                themeColor="slate-500" // Mist
                            >
                                <div className="grid grid-cols-4 gap-1">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="h-8 bg-slate-200 rounded-sm" />
                                    ))}
                                </div>
                            </Section>
                        </Link>

                        {/* Element 4: Wood (Benevolence/Growth) -> Ocean (Teal/Deep Green) */}
                        <Link to="/stitch-showcase/ocean" className="block group">
                            <Section
                                title={t('theme.ocean')}
                                subtitle="Deep Ocean ??The Growth"
                                description={t('theme.ocean.desc')}
                                icon={<Wind size={32} />} // Using Wind/Leaf/Tree metaphor
                                themeColor="emerald-600" // Ocean/Forest
                            >
                                <div className="relative h-12 w-full bg-emerald-50 rounded-lg overflow-hidden flex items-end">
                                    <div className="w-1/4 h-1/2 bg-emerald-300 mx-1 rounded-t-sm" />
                                    <div className="w-1/4 h-3/4 bg-emerald-400 mx-1 rounded-t-sm" />
                                    <div className="w-1/4 h-2/3 bg-emerald-500 mx-1 rounded-t-sm" />
                                    <div className="w-1/4 h-full bg-emerald-600 mx-1 rounded-t-sm" />
                                </div>
                            </Section>
                        </Link>

                        {/* Element 5: Governance (Fire/Energy/Void) -> Void */}
                        <Link to="/stitch-showcase/void" className="block group">
                            <Section
                                title={t('theme.void')}
                                subtitle="System Void ??The Structure"
                                description={t('theme.void.desc')}
                                icon={<Database size={32} />}
                                themeColor="slate-800" // Void
                            >
                                <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-700'}`}>
                                    <span className="text-emerald-400 font-mono text-xs block mb-2">$ SYSTEM_CHECK</span>
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <div className="h-2 w-full bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            </Section>
                        </Link>

                    </div>
                </div>

                {/* First Wave: Ten Core Functions Matrix (Grouped by Theme) */}
                <div className="max-w-7xl mx-auto px-8 pb-16">
                    <div className="text-center mb-16">
                        <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold tracking-wider uppercase mb-4 ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                            {t('stitch.functions.subtitle')}
                        </span>
                        <h2 className={`text-4xl font-bold ${themeColors.text}`}>
                            {t('stitch.functions.title')}
                        </h2>
                    </div>

                    <div className="space-y-16">
                        {[
                            {
                                id: 'aqua',
                                functions: [
                                    { id: 'hub', icon: <LayoutDashboard size={24} />, link: '/personal-hub' },
                                    { id: 'nexus', icon: <Share2 size={24} />, link: '/card-collection' }
                                ],
                                color: 'text-[#00FFFF]', bg: 'bg-[#00FFFF]', border: 'border-[#00FFFF]', hex: '#00FFFF'
                            },
                            {
                                id: 'gold',
                                functions: [
                                    { id: 'report', icon: <FileText size={24} />, link: '/esg-reporting' },
                                    { id: 'alchemy', icon: <Variable size={24} />, link: '/learning-alchemy' }
                                ],
                                color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', hex: '#f59e0b'
                            },
                            {
                                id: 'ocean',
                                functions: [
                                    { id: 'intel', icon: <Activity size={24} />, link: '/market-intel' },
                                    { id: 'village', icon: <Sparkles size={24} />, link: '/sustainable-village' }
                                ],
                                color: 'text-emerald-600', bg: 'bg-emerald-600', border: 'border-emerald-600', hex: '#059669'
                            },
                            {
                                id: 'mist',
                                functions: [
                                    { id: 'academy', icon: <GraduationCap size={24} />, link: '/goodward-academy' },
                                    { id: 'vault', icon: <Database size={24} />, link: '/knowledge-vault' }
                                ],
                                color: 'text-slate-500', bg: 'bg-slate-500', border: 'border-slate-500', hex: '#64748b'
                            },
                            {
                                id: 'void',
                                functions: [
                                    { id: 'ai', icon: <Bot size={24} />, link: '/omni-mind' },
                                    { id: 'status', icon: <Server size={24} />, link: '/admin/health' }
                                ],
                                color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', hex: '#0f172a'
                            }
                        ].map((themeGroup) => (
                            <div key={themeGroup.id} className="relative">
                                {/* Decorative line connecting groups? Optional */}

                                <div className="flex flex-col lg:flex-row gap-8 items-start">
                                    {/* Theme Header */}
                                    <div className="w-full lg:w-1/3 pt-4">
                                        <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${themeGroup.color}`}>
                                            {t(`theme.${themeGroup.id}` as any)} Series
                                        </div>
                                        <h3 className={`text-2xl font-bold mb-4 ${themeColors.text}`}>
                                            {t(`theme.${themeGroup.id}.desc` as any)}
                                        </h3>
                                        <div className={`h-1 w-20 rounded-full`} style={{ backgroundColor: themeGroup.hex }} />
                                    </div>

                                    {/* Function Cards */}
                                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {themeGroup.functions.map((func) => (
                                            <Link key={func.id} to={func.link} className="block group">
                                                <motion.div
                                                    whileHover={{ y: -5 }}
                                                    className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden h-full
                                                        ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-600' : 'bg-white border-slate-100 hover:shadow-xl'}
                                                    `}
                                                >
                                                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-6 -mt-6 transition-all opacity-5 group-hover:opacity-10`} style={{ backgroundColor: themeGroup.hex }} />

                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`} style={{ color: themeGroup.hex }}>
                                                        {func.icon}
                                                    </div>

                                                    <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${themeColors.text}`}>
                                                        {t(`stitch.func.${func.id}` as any)}
                                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
                                                    </h3>

                                                    <p className={`text-sm leading-relaxed ${themeColors.textSub}`}>
                                                        {t(`stitch.func.${func.id}.desc` as any)}
                                                    </p>

                                                    <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0`} style={{ backgroundColor: themeGroup.hex }} />
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`mt-20 border-t pt-12 text-center transition-colors duration-500 ${themeColors.borderColor}`}>
                    <p className={`text-sm ${themeColors.textSub}`}>
                        {t('stitch.footer')}
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

const StitchShowcasePage: React.FC = () => (
    <StitchThemeProvider>
        <StitchShowcaseContent />
    </StitchThemeProvider>
);

export default StitchShowcasePage;

