"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { OmniBadge } from "@/components/omni-terminal/omni-badge";
import { useAppContext } from "@/lib/context/app-context";
import {
    Network,
    CloudLightning,
    Bot,
    FileCheck,
    TableProperties,
    ArrowRight,
    Sparkles,
    FileText,
    Clock,
    Database,
    Activity
} from "lucide-react";
import { DocumentTrackerView } from "@/components/views/document-tracker-view";

const Omni_FUNCTIONS = [
    {
        id: "esg-report-template",
        title: "Omni_Template_Lib",
        desc: "Built-in professional templates compliant with GRI, SASB, TCFD, and FSC 97 standards. Supports automated 5T data mapping.",
        icon: FileText
    },
    {
        id: "gri-mapping",
        title: "GRI_Core_Mapping",
        desc: "Automated mapping of raw enterprise data to the latest GRI 2026 standards, ensuring absolute disclosure integrity.",
        icon: Network
    },
    {
        id: "ai-wizard",
        title: "Omni_Narrative_Engine",
        desc: "AI-assisted drafting engine that generates professional narratives based on core data telemetry and compliance goals.",
        icon: Bot
    },
    {
        id: "csv-import",
        title: "Enterprise_Ingestion_Engine",
        desc: "High-performance CSV/XLSX ingestion with automated error detection and mapping to the Omni Data Core.",
        icon: TableProperties
    },
    {
        id: "report-generation",
        title: "Protocol_Sealing",
        desc: "One-click generation of encrypted PDF reports with integrated ZKP certificates and SHA-256 hash anchoring.",
        icon: FileCheck
    },
    {
        id: "document-upload-tracker",
        title: "Evidence_Lifecycle",
        desc: "Lifecycle management for 70+ enterprise raw evidence sources, ensuring full compliance with the 5T protocol.",
        icon: Database
    }
];

export function OmniSrcView() {
    const { savedDrafts } = useAppContext();
    const [selectedFunc, setSelectedFunc] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importStep, setImportStep] = useState<"upload" | "mapping" | "processing" | "success">("upload");

    if (selectedFunc === "document-upload-tracker") {
        return <DocumentTrackerView onBack={() => setSelectedFunc(null)} />;
    }

    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-black flex items-center gap-4 uppercase leading-none">
                        Omni_Data_Lake
                        <OmniBadge label="OMNI_SRC_CORE" status="optimal" />
                    </h1>
                    <p className="text-stone-400 mt-2 max-w-2xl text-xs font-bold leading-relaxed opacity-60 uppercase">
                        AUTOMATED_FRAMEWORK_MAPPING_AND_PROFESSIONAL_NARRATIVE_ENGINE. SUPPORTING_GRI_2026_SASB_TCFD_CSRD.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition-all shadow-minimal">
                    <Sparkles className="w-4 h-4" />
                    <span>LAUNCH_NARRATIVE_ENGINE</span>
                </button>
            </div>

            {savedDrafts && Object.keys(savedDrafts).length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <Clock size={12} />
                        RECENT_DRAFT_TELEMETRY
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(savedDrafts)
                            .sort(([, a], [, b]) => b.lastModified - a.lastModified)
                            .slice(0, 3)
                            .map(([chapter, draft]) => (
                                <OmniCard
                                    key={chapter}
                                    title={chapter}
                                    subtitle={`MODIFIED_${new Date(draft.lastModified).toLocaleTimeString()}`}
                                    onClick={() => { }}
                                >
                                    <div className="text-[10px] text-stone-400 font-bold line-clamp-1 italic mb-3">
                                        &quot;{draft.content.substring(0, 50)}...&quot;
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="text-[9px] font-black hover:underline uppercase">RESUME_SESSION</button>
                                    </div>
                                </OmniCard>
                            ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Omni_FUNCTIONS.map((func, idx) => (
                    <motion.div
                        key={func.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <OmniCard
                            title={func.title}
                            subtitle="DIRECTIVE_EXECUTION_READY"
                            className="h-full"
                            onClick={() => {
                                if (func.id === "csv-import") {
                                    setImportStep("upload");
                                    setIsImportModalOpen(true);
                                } else {
                                    setSelectedFunc(func.id);
                                }
                            }}
                        >
                            <div className="w-10 h-10 rounded bg-matte-enterprise border border-stone-100 flex items-center justify-center mb-6 text-primary-teal group-hover:scale-110 transition-transform">
                                <func.icon size={20} />
                            </div>
                            <p className="text-[11px] text-stone-400 leading-relaxed font-bold mb-6">
                                {func.desc}
                            </p>
                            <div className="mt-auto flex items-center text-[9px] font-black text-stone-400 group-hover:text-black transition-colors uppercase tracking-widest">
                                <span>EXECUTE_DIRECTIVE</span>
                                <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </OmniCard>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isImportModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/10 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            className="w-full max-w-2xl"
                        >
                            <OmniCard
                                title="Data_Ingestion_System"
                                subtitle="HIGH_PERFORMANCE_CSV_PROTOCOL_INGESTION"
                                className="shadow-2xl"
                            >
                                <div className="p-4 bg-matte-enterprise rounded border border-stone-100 min-h-[300px] flex items-center justify-center">
                                    {importStep === "upload" && (
                                        <div
                                            className="w-full flex flex-col items-center justify-center space-y-6 cursor-pointer group"
                                            onClick={() => setImportStep("processing")}
                                        >
                                            <div className="w-16 h-16 rounded bg-stone-200 flex items-center justify-center text-primary-teal group-hover:bg-black group-hover:text-white transition-all">
                                                <CloudLightning size={32} />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-black uppercase">DROP_5T_PROTOCOL_FILE</div>
                                                <div className="text-[10px] text-stone-400 font-bold uppercase mt-2">SUPPORTED: .CSV .XLSX (MAX_50MB)</div>
                                            </div>
                                        </div>
                                    )}

                                    {importStep === "processing" && (
                                        <div className="flex flex-col items-center space-y-6">
                                            <Activity className="animate-spin text-primary-teal" size={32} />
                                            <div className="text-center">
                                                <div className="text-sm font-black uppercase">DECONSTRUCTING_DATA...</div>
                                                <div className="text-[10px] text-stone-400 font-bold uppercase mt-2">MAPPING_TO_GRI_302_CORE</div>
                                            </div>
                                            {/* Simulate transition */}
                                            {setTimeout(() => setImportStep("success"), 2000) && null}
                                        </div>
                                    )}

                                    {importStep === "success" && (
                                        <div className="flex flex-col items-center space-y-6 w-full">
                                            <div className="w-16 h-16 rounded bg-black flex items-center justify-center text-white">
                                                <FileCheck size={32} />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-black uppercase text-primary-teal">INGESTION_VALIDATED</div>
                                                <div className="text-[10px] text-stone-400 font-bold uppercase mt-2">1,248_NODES_ANCHORED_TO_SOUL</div>
                                            </div>
                                            <button
                                                onClick={() => setIsImportModalOpen(false)}
                                                className="w-full bg-black text-white py-3 rounded text-[10px] font-black uppercase hover:bg-stone-800 transition-all"
                                            >
                                                TERMINATE_PROCESS
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </OmniCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
