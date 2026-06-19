import React, { useState, useEffect } from 'react';
import { Bot, RefreshCcw, CheckCircle, ShieldAlert, Sparkles, AlertTriangle, Info, Zap } from 'lucide-react';
import { runAIReview } from '@/app/omni/actions/omni-ai-action';
import { ReportSchema } from '@/core/utils/report-schemas';
import { useToast } from '@/components/omni/liquid-glass/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface AIReviewAssistantProps {
    data: Record<string, any>;
    schema: ReportSchema;
    status: 'idle' | 'reviewing' | 'complete';
    onReviewComplete?: (result: { passed: boolean; feedback: string[]; score: number }) => void;
}

// ── 打字機文字組件 ────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(timer);
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);
    return <span>{displayedText}</span>;
}

export default function AIReviewAssistant({ data, schema, status: externalStatus, onReviewComplete }: AIReviewAssistantProps) {
    const [localStatus, setLocalStatus] = useState(externalStatus);
    const [reviewStep, setReviewStep] = useState('');
    const [aiResult, setAiResult] = useState<{
        score: number;
        weightedScores?: { e: number; s: number; g: number };
        feedback: { type: string; message: string; field?: string }[];
    } | null>(null);
    const { success, warning, error: toastError } = useToast();

    const handleStartReview = async () => {
        setLocalStatus('reviewing');
        setAiResult(null);

        const steps = [
            '正在擷取表單原始位元組流...',
            'Dr. Thoth 正在計算行業權重比例...',
            '正在比對 Karma Engine 產業基準值...',
            '生成智能建議與合規性分析報告...'
        ];

        let stepIdx = 0;
        const stepTimer = setInterval(() => {
            setReviewStep(steps[stepIdx]);
            stepIdx = (stepIdx + 1) % steps.length;
        }, 600);

        try {
            // [Google Jules Protocol: 造緣] 呼叫真實的 AI Core (Gemini 驅動)
            const result = await runAIReview(data, schema);

            clearInterval(stepTimer);
            setReviewStep('分析完成，正在將結果寫入持久層...');

            // 擬真延遲：讓用戶感知 AI 在整理最終結果
            await new Promise(r => setTimeout(r, 800));

            setAiResult({
                score: result.score,
                weightedScores: result.weightedScores,
                feedback: result.feedback
            });
            setLocalStatus('complete');
            if (onReviewComplete) onReviewComplete(result as any);

            if (result.passed) {
                success('AI 審閱完成', '報告內容符合行業合規基準。');
            } else {
                warning('AI 審閱警告', '檢測到顯著的合規性缺口或數據異常。');
            }
        } catch (err) {
            clearInterval(stepTimer);
            console.error("AI Review failed:", err);
            setLocalStatus('idle');
            toastError('AI 連結中斷', '請確認網路狀態與 Google Auth。');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
            case 'error': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
            default: return <Info className="w-4 h-4 text-cyan-400" />;
        }
    };

    const getColorClass = (type: string) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-300';
            case 'error': return 'bg-rose-500/10 border-rose-500/20 text-rose-300';
            default: return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
        }
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-xl">
            {/* 背景裝飾光暈 */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-all" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black italic tracking-wider text-white">Dr. Thoth (AI 協理)</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${localStatus === 'reviewing' ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400'} shadow-[0_0_8px_rgba(34,211,238,0.5)]`} />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                                {localStatus === 'reviewing' ? 'Analyzing...' : 'Active Intelligence'}
                            </span>
                        </div>
                    </div>
                </div>

                {localStatus !== 'reviewing' && (
                    <button
                        onClick={handleStartReview}
                        className="text-xs font-mono px-4 py-2 bg-white/5 hover:bg-cyan-500/20 text-white/50 hover:text-cyan-300 rounded-full border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-2 group/btn"
                    >
                        {localStatus === 'complete' ? '重新審閱' : '開始審閱'}
                        <RefreshCcw size={12} className="group-hover/btn:rotate-180 transition-transform duration-700" />
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {localStatus === 'reviewing' && (
                    <motion.div
                        key="reviewing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="py-10 flex flex-col items-center gap-4 text-center"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin" />
                            <Zap size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-mono text-cyan-300/80 tracking-tighter animate-pulse">{reviewStep}</p>
                            <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Karma Engine v4.5 Active</p>
                        </div>
                    </motion.div>
                )}

                {localStatus === 'complete' && aiResult && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-5 relative z-10"
                    >
                        {/* 評分環增強版 */}
                        <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="40" cy="40" r="34"
                                        stroke="currentColor" strokeWidth="6"
                                        fill="transparent"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="40" cy="40" r="34"
                                        stroke="currentColor" strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray={213.6}
                                        initial={{ strokeDashoffset: 213.6 }}
                                        animate={{ strokeDashoffset: 213.6 * (1 - aiResult.score / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`${aiResult.score > 80 ? 'text-emerald-400' : aiResult.score > 60 ? 'text-amber-400' : 'text-rose-400'}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black italic text-white leading-none">{aiResult.score}</span>
                                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Confidence</span>
                                </div>
                                {/* 裝飾流光 */}
                                <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.1)] animate-pulse" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-[11px] font-black italic text-white/60 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={12} className="text-amber-400" />
                                        AI Insight Report
                                    </h4>
                                    <div className="flex gap-2">
                                        {['E', 'S', 'G'].map((type) => {
                                            const val = (aiResult.weightedScores as any)?.[type.toLowerCase()] || 0;
                                            return (
                                                <div key={type} className="flex flex-col items-end">
                                                    <div className="text-[8px] font-bold text-white/30 mb-0.5">{type}</div>
                                                    <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${val}%` }}
                                                            className={`h-full ${val > 80 ? 'bg-cyan-500' : 'bg-amber-400'}`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {aiResult.feedback.slice(0, 2).map((f: any, i: number) => (
                                        <div key={i} className={`text-[10px] leading-relaxed p-2 rounded-lg border flex gap-2 ${f.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' :
                                            f.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                                'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                            }`}>
                                            <div className="mt-0.5">
                                                {f.type === 'error' ? <ShieldAlert size={10} /> : <Info size={10} />}
                                            </div>
                                            <TypewriterText text={f.message} speed={25} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 全部回饋列表 (簡化版) */}
                        <div className="grid grid-cols-1 gap-2">
                            {aiResult.feedback.length > 2 && (
                                <p className="text-[9px] text-white/30 text-center font-mono">+ {aiResult.feedback.length - 2} more insights hidden</p>
                            )}
                        </div>
                    </motion.div>
                )}

                {localStatus === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 flex flex-col items-center gap-4 text-center"
                    >
                        <div className="p-4 bg-white/5 rounded-full border border-dashed border-white/10 group-hover:border-cyan-500/30 transition-all duration-700">
                            <Bot size={32} className="text-white/10 group-hover:text-cyan-400/50 transition-all duration-700 group-hover:scale-110" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/40 font-mono tracking-tight group-hover:text-white/60 transition-colors">Ready for Karma Analysis</p>
                            <p className="text-[10px] text-white/10 uppercase tracking-[0.2em]">Omni Intelligence Layer v4.5</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
