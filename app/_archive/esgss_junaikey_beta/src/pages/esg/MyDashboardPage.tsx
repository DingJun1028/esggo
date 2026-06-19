import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Zap,
    ShieldCheck,
    Target,
    Calendar,
    Activity,
    Lock,
    Cpu,
    Boxes,
    Compass,
    Rocket,
    Crown,
    CheckCircle2,
    Clock,
    UserCircle2,
    BarChart,
    Lock as LockIcon,
    Eye,
    FileText,
    Fingerprint,
    GitBranch,
    Gem
} from 'lucide-react';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';
import { ThothDigitalTwin } from '@/components/dashboard/wisdom/ThothDigitalTwin';
import { W4OmniScript } from '@/components/dashboard/W4OmniScript';
import { NPCCompanionWidget } from '@/components/dashboard/NPCCompanionWidget';
import { usePersonalOnboarding } from '@/hooks/usePersonalOnboarding';
import { FIRST_RESONANCE_STEPS } from '@/data/onboarding-steps';
import { UserAvatarProfile } from '@/types/user';
import { T5TValidator, createT5TValidator, IT5TProtocol, T5TProtocolFactory } from '@/services/ceremony';
import '../../styles/liquid-glass.css';

const MyDashboardPage: React.FC = () => {
    const { loading, showOnboarding, avatarData, handleOnboardingComplete } = usePersonalOnboarding();

    // Mock Dashboard Data
    const [data, setData] = useState({
        level: 12,
        xp: 750,
        xpToNext: 1200,
        negentropy: 88,
        stats: [
            { label: '碳盤存量 tCO2e', value: '124.5', icon: <Cpu className="w-4 h-4" /> },
            { label: '宮殿完整度', value: '99.9%', icon: <ShieldCheck className="w-4 h-4" /> },
            { label: '奧秘晶體純度', value: '85%', icon: <Gem className="w-4 h-4" /> },
            { label: '資產封印數', value: '08', icon: <Lock className="w-4 h-4" /> },
        ],
        activeMissions: [
            { id: 1, title: '年度報告封裝', subgroup: '報告中心', progress: 80, status: 'Urgent' },
            { id: 2, title: '供應鏈碳強度分析', subgroup: '商情偵測', progress: 45, status: 'In Progress' },
            { id: 3, title: '導師初階認證', subgroup: '學院', progress: 100, status: 'Completed' },
        ],
        recentAchievements: [
            { title: '宮殿築基者', date: '2026-02-13', type: 'Architecture' },
            { title: '晶體提純專家', date: '2026-02-10', type: 'Purity' },
        ]
    });

    // 5T 協議狀態
    const [t5tStatus] = useState<{
        tangible: number;
        traceable: number;
        trackable: number;
        transparent: number;
        trustworthy: number;
        overallScore: number;
        complianceStatus: 'compliant' | 'partial' | 'non_compliant';
    }>({
        tangible: 75,
        traceable: 82,
        trackable: 68,
        transparent: 90,
        trustworthy: 78,
        overallScore: 79,
        complianceStatus: 'partial'
    });


    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 pt-24 font-sans selection:bg-[#63a6b0]/30 relative overflow-hidden">
            {/* Background FX - Divine Palace Aura */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[20%] left-[10%] w-[60%] h-[60%] bg-[#63a6b0]/5 rounded-full blur-[180px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/3 rounded-full blur-[140px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="flex flex-wrap items-end justify-between gap-8 mb-16 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-6">
                        <div className="size-20 rounded-full border-4 border-[#63a6b0]/20 p-1">
                            <div className="w-full h-full bg-[#63a6b0] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,166,176,0.5)]">
                                <UserCircle2 className="w-10 h-10" />
                            </div>
                        </div>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[#63a6b0] mb-2"
                            >
                                個人主控台：永恆宮殿 {avatarData?.archetype && `| ${avatarData.archetype.toUpperCase()}`}
                            </motion.div>
                            <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
                                {avatarData?.avatarName ? (
                                    <>
                                        {avatarData.avatarName} <span className="text-[#63a6b0]">Cabin</span>
                                    </>
                                ) : (
                                    <>
                                        我的 <span className="text-[#63a6b0]">儀表板</span>
                                    </>
                                )}
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-10 items-center bg-white/5 border border-white/10 rounded-[2rem] p-6 pr-10">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">等級 Level</p>
                            <p className="text-3xl font-black italic text-[#63a6b0] leading-none">12</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">XP 涅槃進度</p>
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#63a6b0]" style={{ width: '62.5%' }} />
                                </div>
                                <span className="text-[10px] font-black italic text-white/50">62%</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {data.stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="liquid-glass p-6 hover:scale-[1.02] transition-all group"
                        >
                            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-[#63a6b0] mb-4 group-hover:scale-110 transition-transform">
                                {s.icon}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{s.label}</p>
                            <p className="text-3xl font-black italic tracking-tighter">{s.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Active Missions */}
                    <div className="lg:col-span-8 liquid-glass p-10">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                <Target className="text-[#63a6b0]" /> 正在進行的使命 Active Missions
                            </h3>
                            <button className="text-[10px] font-black uppercase text-[#63a6b0] flex items-center gap-2">
                                全部使命 <Compass className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.activeMissions.map((m, i) => (
                                <div key={i} className="group p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                {m.status === 'Completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Rocket className="w-5 h-5 text-[#63a6b0]" />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase italic tracking-tight">{m.title}</h4>
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{m.subgroup}</span>
                                            </div>
                                        </div>
                                        {m.status === 'Urgent' && (
                                            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Urgent</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#63a6b0] to-[#0df2df]" style={{ width: `${m.progress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black italic text-white/40">{m.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Negentropy & Achievements */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* 5T Protocol Status Indicator */}
                        <div className="liquid-glass p-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#63a6b0] mb-4 flex items-center gap-2">
                                <Fingerprint className="w-4 h-4" /> 5T 協議狀態
                            </h3>

                            {/* Overall Score */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black ${t5tStatus.complianceStatus === 'compliant'
                                                ? 'bg-emerald-500/20 text-emerald-500'
                                                : t5tStatus.complianceStatus === 'partial'
                                                    ? 'bg-amber-500/20 text-amber-500'
                                                    : 'bg-rose-500/20 text-rose-500'
                                            }`}
                                    >
                                        {t5tStatus.overallScore}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">合規分數</p>
                                        <p className={`text-xs font-bold uppercase ${t5tStatus.complianceStatus === 'compliant' ? 'text-emerald-400' :
                                                t5tStatus.complianceStatus === 'partial' ? 'text-amber-400' : 'text-rose-400'
                                            }`}>
                                            {t5tStatus.complianceStatus === 'compliant' ? '完全合規' :
                                                t5tStatus.complianceStatus === 'partial' ? '部分合規' : '不合規'}
                                        </p>
                                    </div>
                                </div>
                                <LockIcon className="w-5 h-5 text-[#63a6b0]/50" />
                            </div>

                            {/* 5T Dimensions */}
                            <div className="space-y-3">
                                {[
                                    { key: 'tangible', label: 'Tangible', icon: Fingerprint, color: '#63a6b0' },
                                    { key: 'traceable', label: 'Traceable', icon: GitBranch, color: '#4ade80' },
                                    { key: 'trackable', label: 'Trackable', icon: Eye, color: '#d4af37' },
                                    { key: 'trustworthy', label: 'Trustworthy', icon: Lock, color: '#8b5cf6' },
                                ].map((dim) => {
                                    const value = t5tStatus[dim.key as keyof typeof t5tStatus] as number;
                                    return (
                                        <div key={dim.key} className="flex items-center gap-3">
                                            <dim.icon className="w-4 h-4" style={{ color: dim.color }} />
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-[10px] font-medium text-white/60">{dim.label}</span>
                                                    <span className="text-[10px] font-mono" style={{ color: dim.color }}>{value}%</span>
                                                </div>
                                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ background: dim.color }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${value}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* W4 OmniScript */}
                        <div className="h-[280px] overflow-hidden">
                            <W4OmniScript
                                config={{
                                    ceremonyName: '永恆宮殿 W4 刻印',
                                    allianceMembers: ['InfoOne', 'OmniESGcell', 'Omnicell'],
                                    autoExecute: false,
                                    showCertificate: true
                                }}
                            />
                        </div>
                        <div className="bg-gradient-to-br from-[#63a6b0]/20 to-[#0df2df]/20 border border-[#63a6b0]/30 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-[40px] group-hover:bg-white/20 transition-all duration-700" />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#63a6b0] mb-6">負熵系統評分 Negentropy</h3>
                            <div className="size-32 rounded-full border-4 border-[#63a6b0]/20 mx-auto flex flex-col items-center justify-center relative z-10">
                                <span className="text-4xl font-black italic text-[#63a6b0]">{data.negentropy}</span>
                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">系統有序值</span>
                            </div>
                            <p className="text-[10px] font-medium text-white/40 leading-relaxed mt-6 px-4 italic">
                                您近期的活動成功降低了組織的「資訊熵」，系統正朝向更高階的智慧形態演化。
                            </p>
                        </div>

                        <div className="liquid-glass p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2 italic">
                                <Crown className="w-4 h-4" /> 最近成就 Achievements
                            </h3>
                            <div className="space-y-3">
                                {data.recentAchievements.map((ach, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-[#63a6b0]/40 transition-all">
                                        <div className="size-10 rounded-lg bg-[#63a6b0]/10 flex items-center justify-center text-[#63a6b0] group-hover:scale-110 transition-transform">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-bold text-white/80">{ach.title}</h4>
                                            <p className="text-[9px] font-black text-white/20 uppercase mt-0.5">{ach.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Onboarding Overlay */}

            <ServiceOnboardingOverlay
                isOpen={showOnboarding}
                onComplete={(data: UserAvatarProfile) => handleOnboardingComplete(data)}
                serviceName="InfoOne"
                serviceDesc="Creating your Digital Avatar is the first step in the 'Impact Nexus'. This defines your Source Origin."
                steps={FIRST_RESONANCE_STEPS}
            />
        </div>
    );
};

export default MyDashboardPage;
