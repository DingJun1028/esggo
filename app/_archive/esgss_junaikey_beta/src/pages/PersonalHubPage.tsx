import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Star,
    User,
    Settings as SettingsIcon,
    ArrowLeft,
    Compass,
    Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../utils/i18n';
import { usePersonalOnboarding } from '@/hooks/usePersonalOnboarding';
import { OverviewView } from './personal-hub/OverviewView';
import { SpiritView } from './personal-hub/SpiritView';
import { AvatarView } from './personal-hub/AvatarView';
import { StrategyView } from './personal-hub/StrategyView';
import { Settings } from '../components/Settings';
import { MasterOrbGuide } from '../components/guide/MasterOrbGuide';
import { PersonalOnboardingWizard } from './personal-hub/PersonalOnboardingWizard';

const PersonalHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, language } = useI18n();
    const isZh = language === 'zh-TW';
    const { loading, avatarData, showOnboarding, handleOnboardingComplete } = usePersonalOnboarding();

    // Tabs state
    const [activeTab, setActiveTab] = useState<'overview' | 'spirit' | 'strategy' | 'avatar' | 'settings'>('overview');
    const [resonance, setResonance] = useState(85); // Global resonance state

    const tabs = [
        { id: 'overview', label: isZh ? '主控總覽' : 'Overview', icon: LayoutDashboard },
        { id: 'spirit', label: isZh ? '靈魂共鳴' : 'Spirit', icon: Star },
        { id: 'strategy', label: isZh ? '策略軍火庫' : 'Strategy', icon: Briefcase },
        { id: 'avatar', label: isZh ? '數位分身' : 'Avatar', icon: User },
        { id: 'settings', label: isZh ? '系統設定' : 'Settings', icon: SettingsIcon },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 font-sans selection:bg-[#63a6b0]/30 relative flex overflow-hidden">
            {/* Background Aura */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-[#63a6b0]/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar Navigation */}
            <aside className="w-80 h-screen bg-slate-950/50 backdrop-blur-3xl border-r border-white/5 flex flex-col z-50">
                <div className="p-8 pb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 mb-8 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white flex items-center gap-2 group"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">返回首頁</span>
                    </button>

                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-[#63a6b0]/20 flex items-center justify-center">
                                <Compass className="text-[#63a6b0] w-5 h-5" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tighter italic uppercase">
                                <span className="text-brand-primary aqua-text-glow">Personal</span> Hub
                            </h1>
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed">
                            {isZh ? '我的主控中心：以終為始，善向永續' : 'My Personal Center: Impact-First Evolution'}
                        </p>
                    </header>

                    <nav className="space-y-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 relative group
                                    ${activeTab === tab.id
                                        ? 'bg-brand-primary/10 text-white border border-brand-primary/20 aqua-glow-md aqua-pulse-fast'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 hover-aqua-glow'}`}
                            >
                                <tab.icon className={`size-5 transition-transform duration-500 ${activeTab === tab.id ? 'scale-110 text-brand-primary' : 'group-hover:scale-110'}`} />
                                <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>

                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabGlow"
                                        className="absolute inset-0 bg-gradient-to-r from-[#63a6b0]/5 to-transparent rounded-3xl pointer-events-none"
                                    />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-gradient-to-tr from-[#63a6b0] to-[#ffd700] p-0.5">
                            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-xs font-black text-[#63a6b0]">
                                12
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-white italic uppercase tracking-tight">Jun. Sovereign</p>
                            <p className="text-[9px] font-bold text-[#63a6b0] uppercase tracking-widest">Mastery level 12</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
                <div className="max-w-6xl mx-auto p-12 lg:p-16 pb-32 relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <OverviewView avatarData={avatarData} />
                            </motion.div>
                        )}
                        {activeTab === 'spirit' && (
                            <motion.div
                                key="spirit"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <SpiritView onResonanceChange={setResonance} />
                            </motion.div>
                        )}
                        {activeTab === 'strategy' && (
                            <motion.div
                                key="strategy"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <StrategyView />
                            </motion.div>
                        )}
                        {activeTab === 'avatar' && (
                            <motion.div
                                key="avatar"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <AvatarView />
                            </motion.div>
                        )}
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Settings language={language} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 5T Protocol Ticker Decor */}
                <div className="fixed bottom-0 left-80 right-0 h-10 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center px-12 z-40 overflow-hidden pointer-events-none">
                    <div className="flex gap-12 animate-scroll-text whitespace-nowrap">
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#63a6b0]">TANGIBLE_001_ACTIVE</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">TRACEABLE_X94_SYNCED</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#63a6b0]">TRACKABLE_S21_PENDING</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#ffd700]">TRUSTWORTHY_HASH_LOCKED</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">TRANSPARENT_VERIFIED</span>
                    </div>
                </div>
            </main>

            {/* Onboarding Wizard Overlay */}
            <AnimatePresence>
                {showOnboarding && (
                    <PersonalOnboardingWizard onComplete={() => handleOnboardingComplete({
                        id: 'user-001',
                        name: 'Jun',
                        level: 1,
                        joinedAt: new Date().toISOString(),
                        avatarId: 'avatar-alpha',
                        avatarName: 'Jun Avatar',
                        archetype: 'analyst'
                    })} />
                )}
            </AnimatePresence>

            {/* Float Guide */}
            <MasterOrbGuide resonance={resonance} activeView={activeTab} />
        </div>
    );
};

export default PersonalHubPage;
