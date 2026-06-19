import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancement } from '@/5-hooks/useAdvancement';
import { Award, Shield, Zap, TrendingUp, Star, Lock, Info, Hexagon, Trophy, GraduationCap } from 'lucide-react';

const AdvancementHallPage: React.FC = () => {
    const { rank, loading, allBadges } = useAdvancement('user_active');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-[#63a6b0] animate-pulse font-mono text-xl tracking-[0.5em]">SYNCHRONIZING DESTINY...</div>
            </div>
        );
    }

    const progress = rank?.progress || { completionPercentage: 0, nextMilestone: 'Unknown' };

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 font-sans selection:bg-[#63a6b0]/30 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#63a6b0]/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[#63a6b0]"
                        >
                            <Trophy className="w-3 h-3" />
                            晉級殿堂 Advancement Hall
                        </motion.div>
                        <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none">
                            成就 <br />
                            <span className="text-[#63a6b0] drop-shadow-[0_0_25px_#63a6b040]">授勳儀式</span>
                        </h1>
                        <p className="text-white/40 max-w-lg text-lg font-light italic leading-tight">
                            見證您的 ESG 成長路徑。每一項知識結晶都將轉化為永恆的主權資產。
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0]/60 mb-1">總累積經驗 Total XP</p>
                            <p className="text-5xl font-black italic tracking-tighter text-white">{rank?.experiencePoints || 0}</p>
                        </div>
                        <div className="size-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-[#63a6b0]/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700" />
                            <Hexagon className="w-12 h-12 text-[#63a6b0] relative z-10 group-hover:rotate-90 transition-transform duration-1000" />
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Rank Hero Card */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/[0.03] italic uppercase pointer-events-none select-none">
                                {rank?.currentRank}
                            </div>

                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="size-20 rounded-2xl bg-[#63a6b0] flex items-center justify-center text-slate-950 shadow-[0_0_30px_#63a6b060]">
                                        <TrendingUp className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black uppercase italic tracking-tight">{rank?.title}</h2>
                                        <p className="text-[#63a6b0] font-mono tracking-widest text-sm uppercase">Level {rank?.level} Sovereign Participant</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-black uppercase tracking-[0.2em] text-white/40">
                                            距離下一階：<span className="text-white">{rank?.progress.nextMilestone}</span>
                                        </p>
                                        <p className="text-xl font-mono text-[#63a6b0]">{progress.completionPercentage}%</p>
                                    </div>
                                    <div className="h-4 w-full bg-white/5 rounded-full border border-white/10 p-1 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress.completionPercentage}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-[#63a6b0] to-cyan-300 rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: '報告書發布', val: rank?.statistics.totalReportsPublished || 0, icon: Shield },
                                        { label: '教學完成', val: rank?.statistics.totalTutorialsCompleted || 0, icon: GraduationCap },
                                        { label: '連續活躍', val: rank?.statistics.streakDays || 0, icon: Zap },
                                        { label: '測驗均分', val: `${rank?.statistics.averageQuizScore || 0}%`, icon: Star },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#63a6b0]/40 transition-colors">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <div className="flex items-center gap-2">
                                                <stat.icon className="w-4 h-4 text-[#63a6b0]" />
                                                <span className="text-lg font-bold italic">{stat.val}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Recent Activities */}
                        <section className="space-y-6">
                            <h3 className="text-xl font-bold italic uppercase tracking-widest border-l-4 border-[#63a6b0] pl-4">近期成長足跡 Recent Growth</h3>
                            <div className="grid gap-4">
                                {rank?.progress.recentActivities.length === 0 ? (
                                    <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] text-center text-white/20 italic">
                                        尚無近期活動軌跡...
                                    </div>
                                ) : (
                                    rank?.progress.recentActivities.map((act, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="size-12 rounded-xl bg-[#63a6b0]/10 flex items-center justify-center text-[#63a6b0] group-hover:scale-110 transition-transform">
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg italic">{act.type.toUpperCase()}</p>
                                                    <p className="text-sm text-white/40">{act.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#63a6b0] font-black">+{act.xpEarned} XP</p>
                                                <p className="text-[10px] text-white/20 uppercase font-black">{new Date(act.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Badge Wall Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <Award className="text-[#63a6b0]" /> 勳章牆 (Badge Wall)
                            </h3>

                            <div className="grid grid-cols-3 gap-6">
                                {allBadges.map((badge) => {
                                    const isEarned = rank?.badges.some(b => b.id === badge.id);
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`flex flex-col items-center gap-2 group relative ${isEarned ? 'opacity-100' : 'opacity-20 grayscale'}`}
                                        >
                                            <div className={`size-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${isEarned ? 'bg-[#63a6b0]/20 border border-[#63a6b0]/40 shadow-[0_0_20px_#63a6b030]' : 'bg-slate-800 border border-white/5'
                                                }`}>
                                                <span className="group-hover:scale-125 transition-transform duration-500">{badge.icon}</span>
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-tighter text-center max-w-[60px] leading-tight">
                                                {badge.name}
                                            </span>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-3 hidden group-hover:block z-50 w-48 p-3 rounded-xl bg-slate-950 border border-white/20 shadow-2xl backdrop-blur-3xl">
                                                <p className="text-xs font-bold text-[#63a6b0] mb-1">{badge.name}</p>
                                                <p className="text-[10px] text-white/60 leading-relaxed font-light">{badge.description}</p>
                                                {!isEarned && (
                                                    <p className="mt-2 text-[8px] text-white/30 uppercase tracking-widest">
                                                        <Lock className="inline size-2 mr-1" /> 未解鎖
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Next Milestone Info */}
                        <section className="bg-gradient-to-br from-[#63a6b0]/20 to-blue-900/20 border border-[#63a6b0]/30 rounded-[2.5rem] p-8 backdrop-blur-md relative overflow-hidden group">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 italic">
                                <Info className="text-[#63a6b0]" /> 下一階段特權
                            </h3>
                            <ul className="space-y-3 relative z-10">
                                <li className="text-sm text-cyan-200/70 flex items-start gap-3">
                                    <div className="size-1.5 rounded-full bg-[#63a6b0] mt-1.5" />
                                    <span>存取進階 5T 數據驗證</span>
                                </li>
                                <li className="text-sm text-cyan-200/70 flex items-start gap-3">
                                    <div className="size-1.5 rounded-full bg-[#63a6b0] mt-1.5" />
                                    <span>解鎖「宗師級」報告書背景</span>
                                </li>
                                <li className="text-sm text-cyan-200/70 flex items-start gap-3">
                                    <div className="size-1.5 rounded-full bg-[#63a6b0] mt-1.5" />
                                    <span>優先體驗 AI 自動對齊服務</span>
                                </li>
                            </ul>
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#63a6b0]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        </section>
                    </div>
                </main>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');
                .font-sans { font-family: 'Space Grotesk', sans-serif; }
            `}</style>
        </div>
    );
};

export default AdvancementHallPage;
