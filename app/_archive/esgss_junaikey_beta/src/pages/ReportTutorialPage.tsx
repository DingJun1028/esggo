import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportTutorial } from '@/5-hooks/useReportTutorial';
import { BookOpen, CheckCircle, ChevronRight, GraduationCap, Award, Info, AlertCircle, Zap } from 'lucide-react';

const ReportTutorialPage: React.FC = () => {
    const { state, steps, loading, completeStep } = useReportTutorial('user_active');
    const [activeStepId, setActiveStepId] = useState<string | null>(null);

    const activeStep = steps.find(s => s.id === activeStepId);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050c14]">
                <div className="text-[#63a6b0] animate-pulse font-mono text-xl tracking-[0.5em]">INITIALIZING SENSEI PROTOCOL...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050c14] text-slate-100 p-8 font-sans selection:bg-[#63a6b0]/30 relative overflow-hidden">
            {/* Ambient background FX */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#63a6b0]/5 rounded-full blur-[120px] pointer-events-none" />

            <header className="max-w-6xl mx-auto mb-16 relative p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[10px] font-black uppercase tracking-[0.3em] text-[#63a6b0]">
                            <GraduationCap className="w-3 h-3" />
                            開班授課 Sensei Academy
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
                            永續 <br />
                            <span className="text-[#63a6b0] drop-shadow-[0_0_20px_#63a6b030]">知識精煉</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-lg font-light leading-tight italic">
                            依循 GRI/TCFD 框架，讓每一項數據揭露成為您的智慧資產。
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#63a6b0]/60 mb-1">Knowledge Power</p>
                        <div className="text-5xl font-black italic tracking-tighter text-white">{state?.totalPoints || 0} XP</div>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#63a6b0]/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-10">
                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        {activeStep ? (
                            <motion.div
                                key={activeStep.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-[#63a6b0]/20 p-4 rounded-2xl text-[#63a6b0] shadow-[0_0_20px_#63a6b020]">
                                            <BookOpen className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black italic tracking-tight uppercase">{activeStep.title}</h2>
                                            <p className="text-[#63a6b0] font-mono text-xs uppercase tracking-[0.2em]">{activeStep.titleEn}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveStepId(null)}
                                        className="text-white/20 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                                    >
                                        [ 返回列表 Back ]
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    {activeStep.content.sections.map(section => (
                                        <div key={section.id} className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 group hover:border-[#63a6b0]/20 transition-all">
                                            <h3 className="text-xl font-bold mb-6 text-[#63a6b0] italic flex items-center gap-3">
                                                <div className="w-1.5 h-6 bg-[#63a6b0] rounded-full" />
                                                {section.title}
                                            </h3>
                                            <div className="whitespace-pre-line text-white/70 leading-relaxed text-lg font-light">
                                                {section.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-16 flex items-center justify-between p-8 bg-[#63a6b0]/10 rounded-3xl border border-[#63a6b0]/20">
                                    <div className="flex items-center gap-4">
                                        <Award className="text-yellow-400 w-10 h-10" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-[#63a6b0]">Reward Milestone</p>
                                            <p className="text-white/80 font-bold italic">獲得成果揭露點數 <span className="text-[#63a6b0] text-xl font-black">{activeStep.reward.points} XP</span></p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => completeStep(activeStep.id, 100)}
                                        className="px-12 py-4 bg-[#63a6b0] hover:bg-[#74b7c1] text-slate-950 font-black italic uppercase tracking-widest rounded-2xl transition-all shadow-[0_15px_30px_#63a6b040] active:scale-95 flex items-center gap-3"
                                    >
                                        完成章節 <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {steps.map((step) => (
                                    <motion.button
                                        key={step.id}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        onClick={() => setActiveStepId(step.id)}
                                        className={`text-left p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group ${state?.completedSteps.includes(step.id)
                                            ? 'bg-emerald-500/5 border-emerald-500/20'
                                            : 'bg-white/[0.03] border-white/10 hover:border-[#63a6b0]/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`p-4 rounded-2xl ${state?.completedSteps.includes(step.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-[#63a6b0]'}`}>
                                                {state?.completedSteps.includes(step.id) ? <CheckCircle className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                                            </div>
                                            <span className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase">
                                                {step.duration} MINS ESSENCE
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2 group-hover:text-[#63a6b0] transition-colors">{step.title}</h3>
                                        <p className="text-white/40 text-sm font-light italic leading-snug line-clamp-2">{step.description}</p>

                                        <div className="absolute -right-4 -bottom-4 size-20 bg-[#63a6b0]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-10">
                    <section className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
                        <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Award className="text-[#63a6b0]" /> 學習成就
                        </h3>
                        <div className="space-y-4">
                            {state?.badges.length === 0 ? (
                                <div className="text-center py-10 opacity-20">
                                    <Info className="w-12 h-12 mx-auto mb-3" />
                                    <p className="text-xs uppercase font-black tracking-widest leading-loose">尚未完成任何 <br />數據精煉勳章</p>
                                </div>
                            ) : (
                                state?.badges.map((badge, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                        <div className="size-12 bg-[#63a6b0]/20 rounded-xl flex items-center justify-center text-[#63a6b0] shadow-[0_0_15px_#63a6b020]">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <span className="font-black italic text-sm text-white/70">{badge}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="bg-gradient-to-br from-[#63a6b0]/20 to-blue-900/10 border border-[#63a6b0]/30 rounded-[2.5rem] p-8 backdrop-blur-md relative overflow-hidden group">
                        <h3 className="text-lg font-black italic uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="text-[#63a6b0]" /> 導師秘笈
                        </h3>
                        <p className="text-sm text-cyan-200/50 leading-loose italic font-light">
                            「上善若水，水善利萬物而不爭。撰寫報告書時，數據應如泉水般真實清澈，邏輯應如溪流般順暢無阻。」
                        </p>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#63a6b0]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ReportTutorialPage;
