'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { IKnowledgePoint } from '@/core/village-knowledge';
import { IKnowledgeMastery } from '@/core/omni-types';
import {
    CheckCircle2,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Zap,
    ShieldCheck,
    ExternalLink,
    BrainCircuit,
    Lock,
    RefreshCw,
    Award,
    Flame,
    Gem
} from 'lucide-react';
import { esgDataLockService } from '@/core/omni-5t-lock';
import { omniNexusTrinity } from '@/core/omni-nexus-trinity';
import { OmniOne } from '@/core/omni-one';
import { OmniAssessmentEngine } from '@/core/omni-assessment-engine';
import { useAvatarStore } from '@/core/omni-avatar-state';
import { KnowledgeChallengeModal } from './KnowledgeChallengeModal';
import { toast } from 'sonner';

interface Props {
    knowledge: IKnowledgePoint;
    isLearned: boolean;
    onLearn: (uuid: string, mastery?: IKnowledgeMastery) => void;
}

const domainColor: Record<string, string> = {
    E: 'emerald',
    S: 'blue',
    G: 'amber',
};

const domainLabel: Record<string, string> = {
    E: '環境 (E)',
    S: '社會 (S)',
    G: '治理 (G)',
};

const difficultyLabel: Record<string, string> = {
    beginner: '入門',
    intermediate: '進階',
    advanced: '大師',
};

const difficultyColor: Record<string, string> = {
    beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

/**
 * 🏛️ KnowledgeCard — 永續知識點卡片 (Epic 9 Mastery Version)
 */
export const KnowledgeCard = React.memo(({ knowledge, isLearned, onLearn }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [isSealing, setIsSealing] = useState(false);
    const [julesResponse, setJulesResponse] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);

    const [mastery, setMastery] = useState<IKnowledgeMastery>(
        knowledge.mastery || { level: 0, challengeHistory: [] }
    );

    const color = domainColor[knowledge.domain];

    // --- 核心邏輯：一重封印 (Perception) ---
    const handleLearn = async () => {
        if (mastery.level >= 1 || isSealing) return;

        setIsSealing(true);
        try {
            // 實作 5T 封印 (感知)
            await esgDataLockService.lockRecord({
                id: knowledge.uuid,
                type: (knowledge.domain === 'E' ? 'environment' : knowledge.domain === 'S' ? 'social' : 'governance') as any,
                data: { title: knowledge.title_zh, stage: 'Perception' },
                source: 'Village_Library_User_Action',
                timestamp: new Date().toISOString()
            });

            const newMastery: IKnowledgeMastery = {
                ...mastery,
                level: 1,
                perceptionDate: Date.now()
            };
            setMastery(newMastery);

            // 實作 Epic 8 連動
            const atom = await OmniOne.manifest({
                intent: `一重感知: ${knowledge.title_zh}`,
                type: 'Intelligence',
                payload: { ...knowledge, masteryStage: 'Perception' } as any,
                tags: [knowledge.domain === 'E' ? 'ENVIRONMENT' : knowledge.domain === 'S' ? 'SOCIAL' : 'GOVERNANCE'],
                domainRef: 'VILLAGE-LEARNING-HUB'
            });

            const assessment = await OmniAssessmentEngine.getInstance().assessAtom(atom);
            useAvatarStore.getState().applyAssessment(assessment);

            toast.success(`一重封印：感知完成`, {
                description: `您已初步理解此知識，EXP +${knowledge.expReward}。`,
                icon: <Award className="text-cyan-400" size={14} />
            });

            onLearn(knowledge.uuid, newMastery);
        } catch (error) {
            toast.error('感知封印失敗');
        } finally {
            setIsSealing(false);
        }
    };

    // --- 核心邏輯：二重封印 (Gnosis) ---
    const handleChallengeSuccess = async (score: number, answer: string) => {
        const newMastery: IKnowledgeMastery = {
            ...mastery,
            level: 2,
            gnosisDate: Date.now(),
            challengeHistory: [
                ...mastery.challengeHistory,
                { timestamp: Date.now(), question: 'Trial of Thoth', answer, isPassed: true, score }
            ]
        };
        setMastery(newMastery);

        // 職能獎勵觸發
        const atom = await OmniOne.manifest({
            intent: `二重驗算: ${knowledge.title_zh} [Score: ${score}]`,
            type: 'Accomplishment',
            payload: { ...knowledge, masteryStage: 'Gnosis', evaluationScore: score } as any,
            tags: ['GNOSIS', 'VERIFIED'],
            domainRef: 'VILLAGE-KNOWLEDGE-TRIALS'
        });

        const assessment = await OmniAssessmentEngine.getInstance().assessAtom(atom);
        useAvatarStore.getState().applyAssessment(assessment);

        toast.success(`二重封印：驗算達成 (Score: ${score})`, {
            description: `智慧屬性大幅提升！您已深悉其因果本質。`,
            icon: <Gem className="text-purple-400" size={16} />
        });

        onLearn(knowledge.uuid, newMastery);
    };

    const handleAskJules = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        setExpanded(true);
        try {
            const prompt = `針對「${knowledge.title_zh}」提供深度因果推演。摘要: ${knowledge.summary_zh}。`;
            const response = await omniNexusTrinity.dispatch('ask_jules', { prompt });
            if (response.success) setJulesResponse(response.data);
        } catch (error) {
            toast.error('Jules 引擎忙碌中');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <LiquidGlassContainer
                glowColor={mastery.level > 1 ? 'purple' : mastery.level === 1 ? color : 'aqua'}
                intensity={mastery.level > 0 ? 'medium' : 'low'}
                className={`transition-all duration-500 overflow-hidden ${mastery.level === 3 ? 'border-amber-500/50' : ''}`}
            >
                <div className="flex flex-col gap-3">
                    {/* Mastery Progress Bar */}
                    <div className="flex gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`flex-1 transition-all duration-700 ${mastery.level >= step
                                    ? step === 3 ? 'bg-amber-400' : step === 2 ? 'bg-purple-400' : `bg-${color}-400`
                                    : 'bg-transparent'
                                    } shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                            />
                        ))}
                    </div>

                    {/* Badge Row */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap text-[9px] font-black tracking-widest uppercase">
                            <span className={`px-2 py-0.5 rounded-full border text-${color}-400 bg-${color}-500/10 border-${color}-500/20`}>
                                {domainLabel[knowledge.domain]}
                            </span>
                            {mastery.level > 0 && (
                                <span className={`flex items-center gap-1 ${mastery.level === 3 ? 'text-amber-400' : mastery.level === 2 ? 'text-purple-400' : 'text-cyan-400'}`}>
                                    {mastery.level === 3 ? <Gem size={9} /> : mastery.level === 2 ? <BrainCircuit size={9} /> : <ShieldCheck size={9} />}
                                    Seal {mastery.level}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-black text-amber-400 flex items-center gap-1">
                            <Zap size={9} className={mastery.level > 0 ? "animate-bounce" : ""} />
                            +{knowledge.expReward * (mastery.level || 1)} EXP
                        </span>
                    </div>

                    {/* Title & Summary */}
                    <div onClick={() => setExpanded(!expanded)} className="cursor-pointer group">
                        <h3 className="font-black italic text-base leading-tight dark:text-white group-hover:text-cyan-400 transition-colors">
                            {knowledge.title_zh}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed font-['Outfit'] mt-1">
                            {knowledge.summary_zh}
                        </p>
                    </div>

                    {/* Hidden Details */}
                    <AnimatePresence>
                        {expanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-3 border-t border-white/5 flex flex-col gap-3">
                                {knowledge.formula && (
                                    <div className="p-3 rounded-xl bg-slate-950/50 border border-white/10">
                                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">因果驗算公式</p>
                                        <code className="text-[11px] text-cyan-300 font-mono">{knowledge.formula}</code>
                                    </div>
                                )}
                                {julesResponse && (
                                    <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 italic text-[11px] text-cyan-100/70">
                                        <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">Dr. Thoth 啟示</p>
                                        {julesResponse}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-1">
                                    {knowledge.tags.map(t => <span key={t} className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/40">#{t}</span>)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                        <button onClick={handleAskJules} className="p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20 transition-all">
                            <BrainCircuit size={12} className={isAnalyzing ? 'animate-spin' : ''} />
                        </button>

                        <div className="flex gap-2">
                            {mastery.level === 1 && (
                                <button
                                    onClick={() => setIsChallengeOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30 shadow-lg shadow-purple-500/10"
                                >
                                    <Flame size={10} className="animate-pulse" /> 開啟試煉
                                </button>
                            )}

                            <button
                                onClick={handleLearn}
                                disabled={mastery.level >= 1 || isSealing}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${mastery.level >= 1
                                    ? `bg-${color}-500/20 border border-${color}-500/30 text-${color}-400`
                                    : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                                    }`}
                            >
                                {isSealing ? <RefreshCw size={10} className="animate-spin" /> : mastery.level >= 1 ? <CheckCircle2 size={10} /> : <BookOpen size={10} />}
                                {mastery.level >= 1 ? '一重封印中' : isSealing ? '感光中...' : '標記感知'}
                            </button>
                        </div>
                    </div>
                </div>

                <KnowledgeChallengeModal
                    knowledge={knowledge}
                    isOpen={isChallengeOpen}
                    onClose={() => setIsChallengeOpen(false)}
                    onSuccess={handleChallengeSuccess}
                />
            </LiquidGlassContainer>
        </motion.div>
    );
}, (prev, next) => {
    return prev.knowledge.uuid === next.knowledge.uuid && prev.isLearned === next.isLearned;
});
