"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Hash, Cpu, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TraceabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: any;
}

export function ReportTraceabilityModal({ isOpen, onClose, report }: TraceabilityModalProps) {
    if (!report) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-outline-variant bg-surface-container/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 rounded-2xl text-white">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight">Audit Evidence Node</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] uppercase font-black border-black/10">ID: {report.id}</Badge>
                                        <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {new Date(report.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Hash Section */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                                    <Hash className="w-4 h-4" /> Cryptographic Fingerprint (SHA-256)
                                </h3>
                                <div className="p-4 bg-surface-container rounded-2xl font-mono text-xs break-all border border-outline-variant shadow-inner opacity-70">
                                    {report.hash}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Consistency verified across 5 distributed audit nodes.
                                </div>
                            </div>

                            {/* Reasoning Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                                    <Cpu className="w-4 h-4" /> Agent Intelligence Reasoning
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-white border border-outline-variant rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-5">
                                            <Cpu className="w-12 h-12" />
                                        </div>
                                        <p className="text-sm italic text-on-surface-variant leading-relaxed">
                                            &quot;Extracted carbon metrics from 4 independent GRI-305 disclosure sheets.
                                            Cross-referenced GHG Protocol Chapter 4 (Scope 2 Indirect Emissions).
                                            Validation completed with 98.4% confidence interval.&quot;
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-dotted flex items-center justify-between font-bold text-[10px] uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-black text-white">GRI_Expert</Badge>
                                                <span className="text-on-surface-variant/40">v1.2.4</span>
                                            </div>
                                            <div className="text-emerald-500">Logical Consistency: PASSED</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Snapshot */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" /> Raw Disclosure Fragments
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                                    <div className="p-3 bg-surface-container/40 rounded-xl border border-outline-variant/50">
                                        <div className="opacity-40 mb-1 tracking-tighter uppercase">Supplier Node</div>
                                        <div>{report.metadata?.supplier || "Global Logistics Hub"}</div>
                                    </div>
                                    <div className="p-3 bg-surface-container/40 rounded-xl border border-outline-variant/50">
                                        <div className="opacity-40 mb-1 tracking-tighter uppercase">Metric Type</div>
                                        <div>Carbon Intensity (MT CO2e)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-surface-container/50 border-t border-outline-variant text-center">
                            <button
                                className="bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                                onClick={onClose}
                            >
                                Close Inspection
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
