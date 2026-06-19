import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Compass,
    Rocket,
    CheckCircle2,
    Cpu,
    Zap,
    ShieldCheck,
    Clock,
    Fingerprint,
    Lock as LockIcon,
    Eye
} from 'lucide-react';
import { W4OmniScript } from '@/components/dashboard/W4OmniScript';
import { UserAvatarProfile } from '@/types/user';

interface OverviewViewProps {
    avatarData: UserAvatarProfile | null;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ avatarData }) => {
    // Mock Dashboard Data (Extracted from MyDashboardPage)
    const [data] = useState({
        level: 12,
        xp: 750,
        xpToNext: 1200,
        negentropy: 88,
        stats: [
            { label: '碳盤存量 tCO2e', value: '124.5', icon: <Cpu className="w-4 h-4" /> },
            { label: '已修齊技能', value: '15', icon: <Zap className="w-4 h-4" /> },
            { label: '誠信資產', value: '08', icon: <ShieldCheck className="w-4 h-4" /> },
            { label: '學習時數', value: '42h', icon: <Clock className="w-4 h-4" /> },
        ],
        activeMissions: [
            { id: 1, title: '年度報告封裝', subgroup: '報告中心', progress: 80, status: 'Urgent' },
            { id: 2, title: '供應鏈碳強度分析', subgroup: '商情偵測', progress: 45, status: 'In Progress' },
            { id: 3, title: '導師初階認證', subgroup: '學院', progress: 100, status: 'Completed' },
        ],
        recentAchievements: [
            { title: '大數據洞察者', date: '2025-02-04', type: 'Intel' },
            { title: '誠信守護者', date: '2025-02-01', type: 'Governance' },
        ]
    });

    const [t5tStatus] = useState({
        tangible: 75,
        traceable: 82,
        trackable: 68,
        transparent: 90,
        trustworthy: 78,
        overallScore: 79,
        complianceStatus: 'partial' as const
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="liquid-glass p-6 hover:scale-[1.02] transition-all group"
                    >
                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
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
                            <Target className="text-brand-primary" /> 正在進行的使命 Active Missions
                        </h3>
                        <button className="text-[10px] font-black uppercase text-brand-primary flex items-center gap-2">
                            全部使命 <Compass className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.activeMissions.map((m, i) => (
                            <div key={i} className="group p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                                            {m.status === 'Completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Rocket className="w-5 h-5 text-brand-primary" />}
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
                                        <div className="h-full bg-gradient-to-r from-brand-primary to-aqua-400" style={{ width: `${m.progress}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black italic text-white/40">{m.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Protocol & Negentropy */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="liquid-glass p-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary mb-4 flex items-center gap-2">
                            <Fingerprint className="w-4 h-4" /> 5T 協議狀態
                        </h3>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black ${t5tStatus.complianceStatus === 'compliant' ? 'bg-emerald-500/20 text-emerald-500' :
                                    t5tStatus.complianceStatus === 'partial' ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'
                                    }`}>
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
                            <LockIcon className="w-5 h-5 text-brand-primary/50" />
                        </div>

                        <div className="space-y-3">
                            {[
                                { key: 'tangible', label: 'Tangible', icon: Fingerprint, color: 'var(--brand-primary)' },
                                { key: 'traceable', label: 'Traceable', icon: Fingerprint, color: 'var(--color-t5-traceable)' },
                                { key: 'trackable', label: 'Trackable', icon: Eye, color: 'var(--color-t5-trackable)' },
                                { key: 'trustworthy', label: 'Trustworthy', icon: LockIcon, color: 'var(--color-t5-trustworthy)' },
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

                    <div className="bg-gradient-to-br from-brand-primary/20 to-aqua-400/20 border border-brand-primary/30 rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-[40px]" />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary mb-6">負熵系統評分</h3>
                        <div className="size-32 rounded-full border-4 border-brand-primary/20 mx-auto flex flex-col items-center justify-center relative z-10">
                            <span className="text-4xl font-black italic text-brand-primary">{data.negentropy}</span>
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">系統有序值</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
