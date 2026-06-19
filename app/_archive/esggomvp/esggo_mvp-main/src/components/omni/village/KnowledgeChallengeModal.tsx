'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BrainCircuit,
    X,
    Zap,
    ShieldCheck,
    MessageSquare,
    ChevronRight,
    Loader2,
    Sparkles
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { IKnowledgePoint } from '@/core/village-knowledge';
import { omniNexusTrinity } from '@/core/omni-nexus-trinity';
import { toast } from 'sonner';

interface Props {
    knowledge: IKnowledgePoint;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (score: number, answer: string) => void;
}

/**
 * 🏛️ KnowledgeChallengeModal - Dr. Thoth 的啟示挑戰
 * 實現「二重封印：驗算 (Gnosis)」的 AI 問答機制。
 */
export const KnowledgeChallengeModal: React.FC<Props> = ({
    knowledge,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [step, setStep] = useState<'intro' | 'challenge' | 'evaluating' | 'result'>('intro');
    const [challengeQuestion, setChallengeQuestion] = useState<string>('');
    const [userAnswer, setUserAnswer] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [evaluation, setEvaluation] = useState<{ score: number; feedback: string } | null>(null);

    // 1. 生成啟示挑戰問題
    const generateChallenge = async () => {
        setIsGenerating(true);
        try {
            const prompt = `您是 Dr. Thoth (壽司博士)，正在對學生進行「啟示挑戰」。
            知識點: ${knowledge.title_zh} (${knowledge.standard})
            摘要: ${knowledge.summary_zh}
            規範: 請根據上述內容提出一個「深度思考題」，驗證學生是否理解其因果本質，而非死背定義。
            字數限制: 50字內。直接輸出問題內容。`;

            const response = await omniNexusTrinity.dispatch('ask_jules', { prompt });
            if (response.success) {
                setChallengeQuestion(response.data);
                setStep('challenge');
            }
        } catch (error) {
            toast.error('無法召喚 Dr. Thoth，請稍後重試。');
        } finally {
            setIsGenerating(false);
        }
    };

    // 2. 評估回答品質
    const handleEvaluate = async () => {
        if (!userAnswer.trim()) return;
        setStep('evaluating');
        try {
            const prompt = `您是 Dr. Thoth。請評估學生對「${knowledge.title_zh}」挑戰題的回答。
            問題: ${challengeQuestion}
            學生回答: ${userAnswer}
            請給予評分 (0-100) 與簡短解析 (50字內)。
            回傳格式: { "score": 85, "feedback": "您的見解抓住了碳足跡的核心..." }
            若回答過於敷衍或完全錯誤，請給予低分。`;

            const response = await omniNexusTrinity.dispatch('ask_jules', { prompt });
            if (response.success) {
                try {
                    const result = JSON.parse(response.data);
                    setEvaluation(result);
                    setStep('result');
                } catch {
                    // Fallback parse
                    setEvaluation({ score: 80, feedback: response.data });
                    setStep('result');
                }
            }
        } catch (error) {
            toast.error('驗算失敗');
            setStep('challenge');
        }
    };

    const handleConfirm = () => {
        if (evaluation && evaluation.score >= 60) {
            onSuccess(evaluation.score, userAnswer);
            onClose();
        } else {
            setStep('intro');
            setUserAnswer('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <LiquidGlassContainer glowColor="cyan" intensity="high" className="rounded-3xl border-cyan-500/30 overflow-hidden bg-slate-900/80">
                    <div className="relative p-6 flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                                    <BrainCircuit size={24} className="animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic text-white tracking-tighter">智者試煉：二重封印</h2>
                                    <p className="text-[10px] uppercase font-black text-cyan-400/60 tracking-[0.2em]">The Trial of Dr. Thoth (Gnosis)</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40"><X size={20} /></button>
                        </div>

                        {/* Content Steps */}
                        <div className="min-h-[200px] flex flex-col">
                            <AnimatePresence mode="wait">
                                {step === 'intro' && (
                                    <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                                        <p className="text-slate-300 leading-relaxed text-sm">
                                            「凡人學習皮毛，智者體悟神髓。
                                            您已完成一重感知，是否準備好接受 **啟示挑戰** 以成就二重封印？」
                                        </p>
                                        <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-3">
                                            <Sparkles className="text-amber-400" size={20} />
                                            <div>
                                                <p className="text-[11px] font-bold text-white/80">挑戰獎勵: 職能屬性加倍</p>
                                                <p className="text-[9px] text-white/40">解鎖知識精進 Level 2 (Gnosis)</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={generateChallenge}
                                            disabled={isGenerating}
                                            className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-900 font-black italic tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                                        >
                                            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                                            開啟試煉
                                        </button>
                                    </motion.div>
                                )}

                                {step === 'challenge' && (
                                    <motion.div key="challenge" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                                        <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                                            <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <MessageSquare size={10} /> 啟示挑戰：
                                            </p>
                                            <p className="text-white text-base font-bold italic">
                                                "{challengeQuestion}"
                                            </p>
                                        </div>
                                        <textarea
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="請輸入您的見解或答案..."
                                            className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-500/50 outline-none transition-all resize-none"
                                        />
                                        <button
                                            onClick={handleEvaluate}
                                            disabled={!userAnswer.trim()}
                                            className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black italic tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                                        >
                                            確認答案 <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 'evaluating' && (
                                    <motion.div key="evaluating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-6 py-10">
                                        <div className="relative">
                                            <BrainCircuit size={64} className="text-cyan-400 animate-pulse" />
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                                className="absolute -inset-4 border-2 border-dashed border-cyan-500/30 rounded-full"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-white">Dr. Thoth 正在驗算您的理解...</p>
                                            <p className="text-sm text-white/40">這可能需要幾秒鐘的時間</p>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'result' && evaluation && (
                                    <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="text-5xl font-black italic text-cyan-400">{evaluation.score}</div>
                                            <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">本質理解分</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-slate-800/80 border border-white/10 italic text-sm text-slate-200 leading-relaxed text-center">
                                            "{evaluation.feedback}"
                                        </div>
                                        <button
                                            onClick={handleConfirm}
                                            className={`w-full py-4 rounded-2xl font-black italic tracking-widest flex items-center justify-center gap-2 transition-all ${evaluation.score >= 60
                                                    ? 'bg-cyan-500 text-slate-900'
                                                    : 'bg-rose-500 text-white'
                                                }`}
                                        >
                                            {evaluation.score >= 60 ? (
                                                <><ShieldCheck size={18} /> 完成二重封印</>
                                            ) : (
                                                <>再次挑戰</>
                                            )}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </LiquidGlassContainer>
            </motion.div>
        </div>
    );
};
