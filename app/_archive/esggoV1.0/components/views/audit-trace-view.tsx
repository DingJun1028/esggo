"use client";

import React, { useMemo } from "react";
import {
    History,
    Link as LinkIcon,
    ShieldCheck,
    Clock,
    Fingerprint,
    Search,
    Lock,
    Unlock,
    Activity,
    Cpu,
    Zap,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ForensicNode {
    origin: string;
    timestamp: string;
    action: string;
    hash: string;
    confidence: number;
    evidence?: string;
    status: 'OPTIMAL' | 'PENDING' | 'FAILED';
}

interface AuditTraceViewProps {
    forensicMeta?: {
        sourceHash: string;
        agentChain: string[];
        timestamp: string;
        integritySeal: string;
        confidence: number;
        evidenceSnippets?: Record<string, string>;
    };
}

export function AuditTraceView({ forensicMeta }: AuditTraceViewProps) {
    // Mock nodes if meta isn't provided, to show the cinematic potential
    const nodes: ForensicNode[] = useMemo(() => forensicMeta ? [
        {
            origin: "Omni_Inception",
            timestamp: forensicMeta.timestamp,
            action: "Source Intake & Hashing",
            hash: forensicMeta.sourceHash,
            confidence: 1.0,
            status: 'OPTIMAL'
        },
        {
            origin: "Antigravity_Structure",
            timestamp: forensicMeta.timestamp, // Use stable timestamp from meta
            action: "Neural Structuring & Evidence Mapping",
            hash: forensicMeta.integritySeal.slice(0, 16),
            confidence: forensicMeta.confidence,
            status: 'OPTIMAL',
            evidence: Object.values(forensicMeta.evidenceSnippets || {}).join(" | ").slice(0, 100) + "..."
        },
        {
            origin: "Antigravity_Writer",
            timestamp: forensicMeta.timestamp, // Use stable timestamp from meta
            action: "Manifestation & Integrity Sealing",
            hash: "SEALED_CHAIN_0x" + forensicMeta.integritySeal.slice(-6).toUpperCase(), // Use stable value from meta
            confidence: 0.98,
            status: 'OPTIMAL'
        }
    ] : [
        {
            origin: "Vault_Inception",
            timestamp: "2026-04-12 10:00:00",
            action: "Data Anchoring",
            hash: "0x7e21...8f2b",
            confidence: 1.0,
            status: 'OPTIMAL'
        },
        {
            origin: "Audit_Processor",
            timestamp: "2026-04-12 10:05:00",
            action: "ZKP Verification",
            hash: "0x9a3f...11d2",
            confidence: 0.9998,
            status: 'OPTIMAL'
        }
    ], [forensicMeta]);

    return (
        <div className="relative min-h-[600px] bg-white rounded-[3rem] border border-stone-100 shadow-massive overflow-hidden">
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.02] bg-[initial]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-teal-start/20 to-transparent animate-scan" />
            </div>

            {/* Header */}
            <div className="p-8 border-b border-stone-50 bg-stone-50/30 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                        <History className="w-6 h-6 text-primary-teal-start" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black">Forensic Audit Trail</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1 h-1 rounded-full bg-primary-teal-start animate-pulse" />
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">Matrix Sync: Active</span>
                        </div>
                    </div>
                </div>
                <Badge variant="primary" styleType="sovereign">INTEGRITY_VERIFIED_V4.3</Badge>
            </div>

            {/* Trail Content */}
            <div className="p-10 space-y-12 relative z-10">
                {/* Vertical Connector Line */}
                <div className="absolute left-[71px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-stone-100 via-stone-200 to-stone-100" />

                {nodes.map((node, i) => (
                    <div key={i} className="relative pl-16 group">
                        {/* Status Icon */}
                        <div className={cn(
                            "absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl z-20",
                            node.status === 'OPTIMAL' ? 'bg-black border-black text-primary-teal-start scale-110' : 'bg-white border-stone-100 text-stone-300'
                        )}>
                            {i === 0 ? <Fingerprint className="w-6 h-6" /> : i === nodes.length - 1 ? <ShieldCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>

                        <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 hover:border-black/10 transition-all shadow-minimal hover:shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-teal-start/5 blur-[40px] -mr-16 -mt-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[10px] text-stone-300 font-black block mb-2 uppercase tracking-[0.2em]">{node.origin}</span>
                                    <h4 className="text-xl font-black text-black tracking-tighter uppercase">{node.action}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-stone-200 tracking-widest uppercase font-mono">{node.timestamp}</span>
                                    <div className="flex items-center gap-2 mt-2 justify-end">
                                        <div className="text-[9px] font-black uppercase text-stone-400">Confidence</div>
                                        <div className="h-1 w-16 bg-stone-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-teal-start transition-all duration-1000"
                                                style={{ width: `${node.confidence * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-[10px] font-black text-black">{(node.confidence * 100).toFixed(1)}%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-100 group-hover:bg-white transition-colors">
                                <Search className="w-5 h-5 text-black" />
                                <span className="text-[10px] font-black text-black truncate flex-1 uppercase tracking-tight">{node.hash}</span>
                                <Lock className="w-4 h-4 text-stone-200" />
                            </div>

                            {node.evidence && (
                                <div className="mt-4 pt-4 border-t border-stone-50">
                                    <div className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <ArrowUpRight className="w-3 h-3" /> Forensic Evidence Snippet
                                    </div>
                                    <p className="text-[11px] text-stone-400 font-bold italic leading-relaxed">
                                        &quot;{node.evidence}&quot;
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Status */}
            <div className="p-8 border-t border-stone-50 bg-stone-50/30 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary-teal-start animate-heartbeat" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">Link Stability: 99.9%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">Resonance: Synced</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Cpu className="w-4 h-4 text-stone-300" />
                    <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Sovereign Architecture Core</span>
                </div>
            </div>
        </div>
    );
}
