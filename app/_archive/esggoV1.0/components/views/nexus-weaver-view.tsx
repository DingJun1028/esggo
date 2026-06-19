"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ChevronRight,
    FileText,
    CheckCircle2,
    Circle,
    BookOpen,
    ShieldCheck,
    Zap,
    Sparkles,
    ArrowRight,
    Layers,
    Cpu,
    MousePointer2,
    RefreshCw,
    X
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/context/auth-context";
import { FirestoreService } from "@/lib/services/firestore-service";
import { AtomicNodeCard } from "@/components/ui/atomic-node-card";
import { RedundancyValidator } from "@/lib/services/redundancy-validator";

interface ProofAtom {
    id: string;
    title: string;
    value: string;
    unit: string;
    integrity: number;
    category: "Environment" | "Social" | "Governance";
}

const MOCK_ATOMS: ProofAtom[] = [
    { id: "NODE_C305_1", title: "Direct Carbon Emission", value: "450.2", unit: "MT CO2e", integrity: 99.8, category: "Environment" },
    { id: "NODE_W303_1", title: "Water Consumption", value: "12,400", unit: "m³", integrity: 98.4, category: "Environment" },
    { id: "NODE_E302_1", title: "Electricity Usage", value: "850,000", unit: "kWh", integrity: 99.1, category: "Environment" },
    { id: "NODE_S401_1", title: "Employee Turnover", value: "8.2", unit: "%", integrity: 95.0, category: "Social" },
    { id: "NODE_S405_1", title: "Gender Pay Gap", value: "2.1", unit: "%", integrity: 97.2, category: "Social" },
];

export function NexusWeaverView() {
    const { user } = useAuth();
    const [selectedChapterId, setSelectedChapterId] = useState("305-1");
    const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
    const [isWeaving, setIsWeaving] = useState(false);
    const [generatedNarrative, setGeneratedNarrative] = useState("");

    const toggleAtom = (id: string) => {
        if (selectedAtoms.includes(id)) {
            setSelectedAtoms(selectedAtoms.filter(a => a !== id));
        } else {
            setSelectedAtoms([...selectedAtoms, id]);
        }
    };

    const handleWeave = async () => {
        setIsWeaving(true);
        // Simulate AI weaving process
        await new Promise(resolve => setTimeout(resolve, 2500));

        const atomsData = MOCK_ATOMS.filter(a => selectedAtoms.includes(a.id));
        const narrative = `基於 5T 存證鏈路，本組織於本年度針對 [GRI ${selectedChapterId}] 進行了原子化披露。
主要數據如下：${atomsData.map(a => `${a.title} 為 ${a.value} ${a.unit}`).join("；")}。
上述披露內容已通過 ZKP 零知識檢測，並於跨鏈審計中顯示高達 ${Math.max(...atomsData.map(a => a.integrity), 0)}% 的誠信分值。`;

        setGeneratedNarrative(narrative);

        // Register usage in Redundancy Validator
        atomsData.forEach(a => {
            RedundancyValidator.registerUsage(a.id, {
                reportId: "REPORT_2026_V1",
                chapterId: selectedChapterId,
                timestamp: Date.now(),
                usageContext: narrative.slice(0, 50)
            });
        });

        setIsWeaving(false);
    };

    return (
        <div className="flex flex-1 w-full max-w-7xl mx-auto h-[calc(100vh-8rem)] overflow-hidden gap-6 p-6">
            {/* Left: Atomic Evidence Vault */}
            <GlassCard className="w-[400px] flex flex-col border-stone-200/50 bg-stone-50/50 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-stone-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-teal-start text-white rounded-xl">
                            <Layers size={18} />
                        </div>
                        <h2 className="text-xl font-black text-stitch-text uppercase tracking-tighter">Evidence Atoms</h2>
                    </div>
                    <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">原子化 5T 存證池</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {MOCK_ATOMS.map((atom) => (
                        <AtomicNodeCard
                            key={atom.id}
                            nodeId={atom.id}
                            {...atom}
                            chapterId={selectedChapterId}
                            isSelected={selectedAtoms.includes(atom.id)}
                            onClick={() => toggleAtom(atom.id)}
                        />
                    ))}
                </div>

                <div className="p-8 bg-white/80 backdrop-blur-md border-t border-stone-100 italic text-[10px] text-on-surface-variant/40 font-bold leading-relaxed">
                    * 系統自動過濾不可重複使用的具荷載數據。
                </div>
            </GlassCard>

            {/* Right: Nexus Composition Space */}
            <div className="flex-1 flex flex-col gap-6">
                <GlassCard className="flex-1 p-10 border-stone-200/50 rounded-[48px] bg-white shadow-2xl relative overflow-hidden flex flex-col">
                    {/* Scene Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase py-1 px-3 border-black/5 text-stone-400">
                                    NEXUS_MATRIX_V1
                                </Badge>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-teal-start animate-ping" />
                            </div>
                            <h3 className="text-3xl font-black text-stitch-text tracking-tighter uppercase font-headline">Editorial Board</h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Weaving Status</div>
                                <div className="text-sm font-black text-stitch-text">{selectedAtoms.length} Atoms Linked</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center border border-stone-200">
                                <Cpu className="w-6 h-6 text-stone-400" />
                            </div>
                        </div>
                    </div>

                    {/* Composition Canvas */}
                    <div className="flex-1 border-2 border-dashed border-stone-100 rounded-[40px] bg-stone-50/30 p-8 flex flex-col relative overflow-hidden group">
                        <AnimatePresence mode="wait">
                            {generatedNarrative ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col"
                                >
                                    <textarea
                                        value={generatedNarrative}
                                        onChange={(e) => setGeneratedNarrative(e.target.value)}
                                        className="flex-1 w-full bg-transparent text-lg font-bold text-stitch-text leading-relaxed focus:outline-none resize-none custom-scrollbar"
                                    />
                                    <div className="pt-6 border-t border-stone-100 flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} /> Narrative Consistency Pass
                                        </div>
                                        <button onClick={() => setGeneratedNarrative("")} className="text-stone-300 hover:text-red-500 transition-colors">
                                            Clear Synthesis
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                                >
                                    <div className="w-20 h-20 rounded-[32px] bg-white shadow-xl flex items-center justify-center text-stone-200 group-hover:text-primary-teal-start transition-colors">
                                        <MousePointer2 size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-stitch-text tracking-tight uppercase">Select Atoms to Weave</h4>
                                        <p className="text-xs font-bold text-on-surface-variant/40 max-w-xs">使用左側存證原子，啟動 Genkit 思考鏈進行多重比對與段落生成。</p>
                                    </div>
                                    <button
                                        onClick={handleWeave}
                                        disabled={selectedAtoms.length === 0 || isWeaving}
                                        className="px-10 py-5 rounded-[28px] bg-black text-white text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-zinc-800 transition-all disabled:opacity-20 flex items-center gap-3 overflow-hidden relative group"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {isWeaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary-teal-start group-hover:rotate-12 transition-transform" />}
                                            {isWeaving ? "WEAVING_STORY..." : "Analyze & Weave Narrative"}
                                        </span>
                                        {isWeaving && (
                                            <motion.div
                                                initial={{ left: "-100%" }}
                                                animate={{ left: "100%" }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"
                                            />
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Decorative Matrix Lines */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                            <div className="absolute top-8 right-8 w-px h-16 bg-black" />
                            <div className="absolute top-8 right-8 w-16 h-px bg-black" />
                        </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="mt-8 p-6 bg-stone-50 rounded-[28px] border border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary-teal-start" />
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Active Standard</span>
                                <Badge variant="optimal" className="text-[10px] font-black bg-white">GRI_{selectedChapterId}</Badge>
                            </div>
                            <div className="w-px h-4 bg-stone-200" />
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Anti-Redundancy</span>
                                <span className="text-[10px] font-black text-emerald-600">ACTIVE</span>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stitch-text hover:gap-3 transition-all">
                            Export Node <ArrowRight size={14} />
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

export default NexusWeaverView;
