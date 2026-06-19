"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Award, ShieldCheck, Eye, Info, X, Target
} from 'lucide-react';
import { OmniSynthesisEngine } from '@/core/omni-synthesis';

/**
 * 🏛️ ESG GO Master View (UUID: soul-hero-001)
 * 服務即教學，知識即資產 | premium v8.2.5
 */

// ── 1. Functional Component: 5T Protocol Card (soul-matrix-003) ──
const ProtocolCard = ({ label, desc, icon, onClick }: { label: string; desc: string; icon: React.ReactNode; onClick: () => void }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -8 }}
        onClick={onClick}
        className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/40 hover:border-[#63a6b0]/50 hover:shadow-[0_20px_50px_rgba(99,166,176,0.15)] group transition-all cursor-pointer shadow-sm flex flex-col items-start text-left relative overflow-hidden"
        data-uuid={`node-${label.toLowerCase()}`}
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#63a6b0]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#63a6b0]/10 transition-colors" />
        <div className="w-14 h-14 rounded-2xl bg-[#63a6b0]/5 flex items-center justify-center mb-6 group-hover:bg-[#63a6b0]/20 group-hover:scale-110 transition-all duration-500 border border-[#63a6b0]/10">
            <div className="text-[#63a6b0]">
                {icon}
            </div>
        </div>
        <h5 className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-3 group-hover:text-[#63a6b0] transition-colors">
            5T PROTOCOL · {label}
        </h5>
        <p className="text-2xl font-black text-gray-900 tracking-tight mb-2 group-hover:translate-x-1 transition-transform">{label}</p>
        <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-gray-900 transition-colors">
            {desc}
        </p>
    </motion.div>
);

// ── 2. Functional Component: Journey Storyboard Panel (soul-journey-002) ──
const JourneyPanel = ({ idx, step, title, desc, img }: { idx: number; step: string; title: string; desc: string; img: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative"
    >
        <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 mb-8 relative">
            <img
                src={img}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-8 left-8 w-14 h-14 rounded-full bg-white/90 backdrop-blur-2xl flex items-center justify-center text-lg font-black text-gray-900 shadow-lg border border-white/40 group-hover:scale-110 transition-transform duration-500">
                {step}
            </div>
        </div>
        <div className="px-4 space-y-3">
            <h5 className="text-3xl font-black tracking-tighter text-gray-900 group-hover:text-[#63a6b0] transition-colors underline-offset-8 decoration-[#63a6b0]/30 hover:underline">
                {title}
            </h5>
            <p className="text-sm text-gray-500 font-semibold leading-relaxed tracking-tight group-hover:text-gray-700 transition-colors">
                {desc}
            </p>
        </div>
    </motion.div>
);

export default function MasterReportView() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifierOpen, setVerifierOpen] = useState(false);
    const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

    const openVerifier = (evidence?: any) => {
        setSelectedEvidence(evidence || reportData?.protocol5T);
        setVerifierOpen(true);
    };

    useEffect(() => {
        async function fetchSynthesis() {
            setLoading(true);
            const data = await OmniSynthesisEngine.synthesizeMasterReport();
            setReportData(data);
            setLoading(false);
        }
        fetchSynthesis();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#FBFBFD]">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="p-6 rounded-full bg-[#63a6b0]/10"
                >
                    <Sparkles className="text-[#63a6b0]" size={48} />
                </motion.div>
                <p className="font-black text-xs tracking-widest text-[#63a6b0] uppercase animate-pulse">
                    ESG GO 正在準備您的永續報告...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFD] text-gray-900 font-sans selection:bg-[#63a6b0]/20 relative overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-8 py-20 space-y-40 relative z-10">

                {/* ── 1. Hero Section (REQ-001: soul-hero-001) ── */}
                <header className="text-center space-y-12 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#63a6b0]/5 border border-[#63a6b0]/10"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#63a6b0] animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#63a6b0]">
                            ESG GO 高等 5T 永續認證
                        </span>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-8xl md:text-[10rem] font-black tracking-tighter text-gray-900 leading-[0.85]"
                        >
                            ESG GO
                        </motion.h1>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black text-gray-300 italic tracking-tight"
                        >
                            智慧永續新紀元
                        </motion.h2>
                    </div>

                    <p className="max-w-2xl mx-auto text-xl text-gray-500 font-medium leading-relaxed">
                        {reportData.summary || "用 5T 協議鎖定真實價值，將數據轉化為永恆資產。"}
                    </p>
                </header>

                {/* ── 2. Service Journey (REQ-002: soul-journey-002) ── */}
                <section className="space-y-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                        <div className="space-y-4">
                            <h3 className="text-5xl font-black tracking-tighter italic">ESG GO 服務旅程</h3>
                            <p className="text-gray-400 font-medium">從數據共鳴到資產顯化的完整閉環。</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Journey Stage</p>
                            <div className="px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold">
                                04 核心階段
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10" data-uuid="soul-journey-002">
                        {[
                            {
                                id: "p1",
                                step: "01",
                                title: "數據共鳴",
                                desc: "將企業原始數據注入魔法區域",
                                img: "https://lh3.googleusercontent.com/d/1O5r-9_Yl8p8m4_Yx9_9_9_9_9_9_9_9" // Fallback placeholder
                            },
                            {
                                id: "p2",
                                step: "02",
                                title: "智能提純",
                                desc: "AI 深度分析與多維合成",
                                img: "https://lh3.googleusercontent.com/d/1O5r-9_Yl8p8m4_Yx9_9_9_9_9_9_9_9"
                            },
                            {
                                id: "p3",
                                step: "03",
                                title: "5T 驗證",
                                desc: "執行協議，確保數據至真至信",
                                img: "https://lh3.googleusercontent.com/d/1O5r-9_Yl8p8m4_Yx9_9_9_9_9_9_9_9"
                            },
                            {
                                id: "p4",
                                step: "04",
                                title: "資產顯化",
                                desc: "產出雜誌級報告與永恆資產",
                                img: "https://lh3.googleusercontent.com/d/1O5r-9_Yl8p8m4_Yx9_9_9_9_9_9_9_9"
                            }
                        ].map((panel, idx) => {
                            // Map generated image localized URLs
                            const images = [
                                "file:///C:/Users/jun/.gemini/antigravity/brain/58686611-bbab-4de7-8bc9-05d87ad18e46/esggo_journey_panel_1_v2_1772718202992.png",
                                "file:///C:/Users/jun/.gemini/antigravity/brain/58686611-bbab-4de7-8bc9-05d87ad18e46/esggo_journey_panel_2_v2_1772718250759.png",
                                "file:///C:/Users/jun/.gemini/antigravity/brain/58686611-bbab-4de7-8bc9-05d87ad18e46/esggo_journey_panel_3_v2_1772718265911.png",
                                "file:///C:/Users/jun/.gemini/antigravity/brain/58686611-bbab-4de7-8bc9-05d87ad18e46/esggo_journey_panel_4_v2_1772718279289.png"
                            ];
                            return <JourneyPanel key={panel.id} idx={idx} step={panel.step} title={panel.title} desc={panel.desc} img={images[idx]} />;
                        })}
                    </div>
                </section>

                {/* ── 3. 5T Matrix (REQ-003: soul-matrix-003) ── */}
                <section className="space-y-16 py-10 bg-white/40 rounded-[4rem] border border-white p-12 shadow-sm backdrop-blur-sm">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-1 bg-[#63a6b0] mx-auto rounded-full opacity-20" />
                        <h3 className="text-4xl font-black tracking-tighter">5T 核心協議矩陣</h3>
                        <p className="text-gray-400 font-medium">我們對每一刻數據、每一份信賴的極致守護。</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6" data-uuid="soul-matrix-003">
                        <ProtocolCard
                            label="Tangible" icon={<Sparkles size={18} />}
                            desc="可感知的真實影響力回饋。"
                            onClick={() => openVerifier({ tangible: reportData.protocol5T.tangible })}
                        />
                        <ProtocolCard
                            label="Traceable" icon={<Target size={18} />}
                            desc="數據起源的不可篡改連結。"
                            onClick={() => openVerifier({ traceable: reportData.protocol5T.traceable })}
                        />
                        <ProtocolCard
                            label="Trackable" icon={<Award size={18} />}
                            desc="動態流轉的精準歷史軌跡。"
                            onClick={() => openVerifier({ trackable: reportData.protocol5T.trackable })}
                        />
                        <ProtocolCard
                            label="Transparent" icon={<Eye size={18} />}
                            desc="算法公式的公開透明驗算。"
                            onClick={() => openVerifier({ transparent: reportData.protocol5T.transparent })}
                        />
                        <ProtocolCard
                            label="Trustworthy" icon={<ShieldCheck size={18} />}
                            desc="Hash Lock 封印的終極資產。"
                            onClick={() => openVerifier({ trustworthy: reportData.protocol5T.trustworthy })}
                        />
                    </div>
                </section>

                <footer className="py-20 text-center border-t border-gray-100 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-10">
                        <p className="text-[10px] font-black tracking-[1em] text-gray-300 uppercase">
                            ESG GO · The Future is Sovereign
                        </p>
                    </div>
                    <p className="text-[8px] font-bold text-gray-200 uppercase tracking-widest">
                        Design by Antigravity · Powered by 5T Protocol
                    </p>
                </footer>
            </div>

            {/* ── Verifier Modal ── */}
            <AnimatePresence>
                {verifierOpen && (
                    <div
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md"
                        onClick={() => setVerifierOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-12 space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-[#63a6b0]/5 text-[#63a6b0]">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black tracking-tighter">5T 數據驗證機制</h4>
                                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Verification Node: soul-verifier-node-1</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.entries(selectedEvidence || {}).map(([key, value]: [string, any]) => (
                                        <div key={key} className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 hover:border-[#63a6b0]/20 transition-all group">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-[10px] font-black text-[#63a6b0] uppercase tracking-widest">{key}</p>
                                                {typeof value?.score === 'number' && (
                                                    <div className="px-2 py-0.5 rounded-full bg-[#63a6b0]/10 text-[9px] font-black text-[#63a6b0]">
                                                        SCORE: {value.score.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-gray-900 leading-snug">
                                                    {typeof value === 'object' ? (value.details || value.desc || JSON.stringify(value)) : value}
                                                </p>
                                                {value.hashLock && (
                                                    <p className="text-[9px] font-mono text-gray-400 break-all bg-white p-2 rounded-lg border border-gray-100 group-hover:text-gray-600 transition-colors">
                                                        HASH: {value.hashLock}
                                                    </p>
                                                )}
                                                {value.sourceOrigin && (
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                        ORIGIN: {value.sourceOrigin}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setVerifierOpen(false)}
                                    className="w-full py-4 rounded-xl bg-gray-900 text-white font-black text-xs tracking-widest uppercase hover:bg-black transition-colors"
                                >
                                    完成驗證
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setVerifierOpen(true)}
                className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform group z-50"
            >
                <Target size={24} className="group-hover:rotate-45 transition-transform" />
            </button>
        </div>
    );
}
