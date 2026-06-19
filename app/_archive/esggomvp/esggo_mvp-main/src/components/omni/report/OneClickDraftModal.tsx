"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Sparkles, Loader2, Download, CheckCircle2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (draftContent: Record<string, string>, atomUuid?: string) => void;
}

export const OneClickDraftModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [resultData, setResultData] = useState<{ transcript: any[]; summary: string[] } | null>(null);

    const simulateProcess = async () => {
        setStep('processing');
        const logs = [
            "🧠 正在啟動 OCR 引擎...",
            "📡 提取原始憑證數據 (5T 驗證中)...",
            "✨ 召喚永續精靈 (JunAiKey)...",
            "👤 同步數位分身屬性 (六德共鳴)...",
            "💬 進行深度對話編排...",
            "📝 生成 Typst 底稿文法..."
        ];

        for (let i = 0; i < logs.length; i++) {
            setLog(prev => [...prev, logs[i]]);
            setProgress((i + 1) * (100 / logs.length));
            await new Promise(r => setTimeout(r, 800));
        }

        setResultData({
            transcript: [
                { role: 'Sprite', content: '我從這份電費單中看到了 12,500 kWh 的消耗，這是一個與「智」相關的關鍵數據。' },
                { role: 'Twin', content: '確實，這代表我們在製程優化上還有空間，這也是「誠」的體現。' }
            ],
            summary: [
                "識別到關鍵指標：電力消耗 12,500 kWh (Scope 2)",
                "分身與精靈達成共識：優先優化 Q3 製程節能",
                "Typst 格式底稿已封裝 5T 數位誠信雜湊"
            ]
        });
        setStep('result');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-2xl bg-[#0B0D17] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-aqua/20 text-aqua rounded-2xl">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">永續底稿。一鍵完成</h2>
                            <p className="text-xs text-white/40 tracking-widest uppercase font-mono">Sentient Drafting Engine</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {step === 'upload' && (
                            <motion.div
                                key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div
                                    onClick={simulateProcess}
                                    className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center hover:border-aqua/50 hover:bg-aqua/5 cursor-pointer transition-all group"
                                >
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Upload className="text-white/40 group-hover:text-aqua" size={32} />
                                    </div>
                                    <p className="text-lg font-bold text-white mb-2">拖曳或點選上傳憑證</p>
                                    <p className="text-sm text-white/40 font-serif">支援 PDF, PNG, JPG (自動啟動 5T OCR 掃描)</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 italic text-sm text-white/60 font-serif leading-relaxed">
                                    💡 貼心小提醒：系統將自動調度您的「數位分身」與「永續精靈」進行對談，並根據憑證數據產出精確的 Typst DSL 底稿。
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div
                                key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-aqua tracking-widest uppercase">Process Engine Status</span>
                                        <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-aqua shadow-[0_0_15px_rgba(99,166,176,0.5)]"
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="bg-black/40 rounded-3xl p-6 h-48 overflow-y-auto font-mono text-xs space-y-2 border border-white/5">
                                    {log.map((l, i) => (
                                        <div key={i} className="flex gap-3 text-white/60">
                                            <span className="text-aqua">[{new Date().toLocaleTimeString()}]</span>
                                            <span>{l}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2 text-aqua pt-2 italic animate-pulse">
                                        <Loader2 size={12} className="animate-spin" />
                                        <span>正在執行高維度編排...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'result' && (
                            <motion.div
                                key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-[2rem] flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500 text-black rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-400">底稿生成成功 (5T Verified)</h4>
                                        <p className="text-xs text-emerald-400/60 font-serif">對話實錄與核心摘要已同步至永恆宮殿。</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
                                        <h5 className="text-[10px] font-black text-aqua uppercase tracking-widest">精靈對話片段</h5>
                                        <div className="text-xs text-white/70 italic leading-relaxed">
                                            「...這代表我們在製程優化上還有空間...」
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
                                        <h5 className="text-[10px] font-black text-[#ffd700] uppercase tracking-widest">重點摘要</h5>
                                        <ul className="text-[10px] text-white/60 list-disc list-inside">
                                            <li>電力消耗 12,500 kWh</li>
                                            <li>製程優化評估建議</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                                    >
                                        返回中心
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const draftContent = {
                                                introduction: "本公司成立於 1990 年，致力於引領永續創新。在 2025 年，我們穩健擴展核心業務，同時將 ESG 理念融入企業文化中。由數位分身與永續精靈共同協作的數據分析顯示，我們在能源轉型上取得了突破性的進展。",
                                                governance: "本公司設有永續發展委員會，由獨立董事擔任召集人。透過定期審查氣候風險與機會，我們確保企業治理架構符合國際標準，並已將 5T 協議納入內部控制循環中。\n\n[[CHART:GOVERNANCE_RADAR]]\n\n所有決策皆通過 OmniNexus 進行 Hash Lock 鎖定，保障資訊的不可篡改性。",
                                                environmental: "在 2025 年的碳盤查中，我們的 Scope 1 排放量下降了 15%。此外，我們導入了能源管理系統及水資源回收技術。\n\n[[CHART:CARBON_HEATMAP]]\n\n透過 AI 智能代理的優化，耗電量成功減少 12,500 kWh，展現企業邁向淨零的決心。",
                                                social: "我們提供員工多元包容的工作環境，推動社區關懷計畫。\n\n[[CHART:SOCIAL_DIVERSITY]]\n\n今年員工滿意度調查分數達 85/100，我們深刻理解每一位員工都是企業最寶貴的資產。",
                                                appendix: "本報告涵蓋期間為 2025/01/01 至 2025/12/31，依照 GRI 準則編製。各項數據皆已經過第三方外部確信（Limited Assurance），以確保資訊的準確性與可靠性。"
                                            };

                                            try {
                                                // Real manifestation call to preserve 5T integrity
                                                const res = await fetch('/api/omni-one', {
                                                    method: 'POST',
                                                    body: JSON.stringify({
                                                        operation: 'manifest_asset',
                                                        params: {
                                                            intent: 'One-Click Report Draft Generation',
                                                            type: 'Accomplishment',
                                                            payload: draftContent,
                                                            domainRef: 'EXCELLENCE_REPORT_FORGE',
                                                            impactMetric: 'Drafting Efficiency +300%'
                                                        }
                                                    })
                                                });
                                                const manifestResult = await res.json();
                                                onComplete(draftContent, manifestResult.uuid);
                                            } catch (err) {
                                                console.error("Manifestation failed during drafting:", err);
                                                onComplete(draftContent, "FALLBACK-UUID-ERROR");
                                            }
                                        }}
                                        className="flex-1 py-4 bg-aqua text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-aqua/20 flex items-center justify-center gap-2"
                                    >
                                        <FileText size={16} /> 套用至編輯器稿件
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
