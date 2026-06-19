"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    LayoutGrid,
    X,
    Leaf,
    Users,
    Gavel,
    BarChart3,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Pillar {
    id: string;
    name: string;
    icon: any;
    color: string;
    chapters: string[];
}

interface MECEMatrixOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    progress: Record<string, number>;
}

export const MECEMatrixOverlay = ({
    isOpen,
    onClose,
    progress
}: MECEMatrixOverlayProps) => {
    const pillars: Pillar[] = [
        { id: 'E', name: '環境 (Environmental)', icon: Leaf, color: 'bg-emerald-500', chapters: ['1', '2', '3', '4', '5'] },
        { id: 'S', name: '社會 (Social)', icon: Users, color: 'bg-blue-500', chapters: ['6', '7', '8', '9', '10', '11'] },
        { id: 'G', name: '治理 (Governance)', icon: Gavel, color: 'bg-amber-500', chapters: ['12', '13', '14', '15', '16'] },
        { id: 'T', name: '分類與財務 (Taxonomy)', icon: BarChart3, color: 'bg-purple-500', chapters: ['17', '18', '19', '20', '21'] },
        { id: 'C', name: '供應鏈 (Circular)', icon: RefreshCw, color: 'bg-indigo-500', chapters: ['22', '23', '24', '25'] },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl pointer-events-auto"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-3xl flex flex-col max-h-[90vh] pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-stitch-text tracking-tighter uppercase font-headline">MECE_MATRIX <span className="text-stone-300">/</span> 框架對標矩陣</h3>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Compliance Heatmap & Gap Analysis</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center"
                            >
                                <X className="w-6 h-6 text-stone-500" />
                            </button>
                        </div>

                        {/* Matrix Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-stone-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                {pillars.map((pillar) => {
                                    return (
                                        <div key={pillar.id} className="flex flex-col gap-4">
                                            <div className="p-5 rounded-[28px] bg-white border border-stone-100 shadow-sm flex flex-col items-center">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl mb-3", pillar.color)}>
                                                    <pillar.icon className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-sm font-black text-stitch-text uppercase tracking-tight text-center">{pillar.name}</h4>
                                                <div className="mt-2 text-[10px] font-black text-stone-400 uppercase">Weight: 20%</div>
                                            </div>

                                            {/* Heatmap Chapters */}
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {pillar.chapters.map(ch => {
                                                    const status = (progress[`${ch}-0`] || 0);
                                                    return (
                                                        <div
                                                            key={ch}
                                                            title={`Chapter ${ch}: ${status}%`}
                                                            className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                                                                status >= 80 ? "bg-emerald-500 text-white shadow-lg" :
                                                                    status >= 40 ? "bg-amber-400 text-black shadow-md" :
                                                                        status > 0 ? "bg-amber-100 text-amber-700" :
                                                                            "bg-stone-200 text-stone-400 opacity-30"
                                                            )}
                                                        >
                                                            {ch}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Statistics Footer */}
                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-[32px] bg-black text-white flex flex-col justify-between h-40">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Aggregate Readiness</span>
                                    <div>
                                        <span className="text-5xl font-black tracking-tighter">74%</span>
                                        <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase">Ready for Assurance</p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[32px] bg-white border border-stone-100 flex flex-col justify-between h-40 shadow-minimal">
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Gaps Detected</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-black tracking-tighter text-amber-500">3</span>
                                        <span className="text-[10px] font-bold text-stone-500 uppercase leading-tight">Critical information<br />shortfalls (Data L0)</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-[32px] bg-primary-teal-start text-black flex flex-col justify-between h-40 shadow-xl">
                                    <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">ZKP Strength</span>
                                    <div>
                                        <span className="text-2xl font-black tracking-tighter">MIL-GRADE / AES</span>
                                        <div className="w-full h-1 bg-black/10 rounded-full mt-2 overflow-hidden">
                                            <div className="w-[98%] h-full bg-black rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-stone-100 flex justify-center bg-stone-50/50">
                            <button
                                onClick={onClose}
                                className="px-12 py-4 bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl hover:bg-stone-800 pointer-events-auto"
                            >
                                Close Matrix Inspector
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
