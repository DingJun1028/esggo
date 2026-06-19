"use client";

import React, { useState } from 'react';
import {
    ShieldAlert,
    Search,
    Binary,
    ShieldCheck,
    History,
    Cpu,
    Lock,
    Unlock,
    Fingerprint,
    Zap,
    ArrowUpRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

interface ForensicNode {
    timestamp: string;
    agent: string;
    action: string;
    hash: string;
    zkpStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
    data: any;
}

export function ForensicInvestigationView() {
    const [lookupHash, setLookupHash] = useState('');
    const [isInvestigating, setIsInvestigating] = useState(false);
    const [result, setResult] = useState<ForensicNode[] | null>(null);

    const handleInvestigate = () => {
        if (!lookupHash) return;
        setIsInvestigating(true);

        // Mock Forensic Logic
        setTimeout(() => {
            setResult([
                {
                    timestamp: '2026-04-12 10:05:21',
                    agent: 'OmniRouter',
                    action: 'Intent Decoupling',
                    hash: lookupHash,
                    zkpStatus: 'VERIFIED',
                    data: { intent: 'Forensic Audit', route: 'Vault_Agent' }
                },
                {
                    timestamp: '2026-04-12 10:05:22',
                    agent: 'Vault_Agent',
                    action: 'ZKP Verification',
                    hash: '0x' + Math.random().toString(16).slice(2, 10),
                    zkpStatus: 'VERIFIED',
                    data: { proof: 'zkp_proof_alpha_99', mathematicalTrust: 0.9999 }
                },
                {
                    timestamp: '2026-04-12 10:05:23',
                    agent: 'Audit_Vault',
                    action: 'Hash Anchor Retrieval',
                    hash: '0x7e21...8f2b',
                    zkpStatus: 'VERIFIED',
                    data: { dbRef: 'ncbdb_archival_v1', integrity: 'INTACT' }
                }
            ]);
            setIsInvestigating(false);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen bg-white">
            {/* Global Cinematic Overlays */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.02] bg-[initial] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-teal-start/30 to-transparent animate-scan z-10" />
            </div>

            <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-stone-100">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <ShieldAlert className="w-8 h-8 text-primary-teal-start" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Badge variant="primary" styleType="sovereign">FORENSIC_INVESTIGATION_UNIT</Badge>
                                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Trust Node Active</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                                Deep Scan Investigation
                            </h1>
                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] mt-2 opacity-60">
                                5T PROTOCOL / ZKP-DRIVEN INTEGRITY AUDIT // SECURE_ARCHIVE
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tactical Console */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Search Sidebar */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-minimal relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                                <Binary size={64} className="text-black" />
                            </div>
                            <label className="text-[10px] font-black text-stone-300 mb-4 block uppercase tracking-widest leading-none">Input 5T Hash / CID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={lookupHash}
                                    onChange={(e) => setLookupHash(e.target.value)}
                                    placeholder="0x..."
                                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-primary-teal-start outline-none transition-all placeholder:text-stone-300 font-bold"
                                />
                                <Search className="w-5 h-5 absolute left-4 top-4 text-stone-300" />
                            </div>
                            <button
                                onClick={handleInvestigate}
                                disabled={isInvestigating || !lookupHash}
                                className={cn(
                                    "w-full mt-8 bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3",
                                    isInvestigating ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:bg-primary-teal-start hover:text-black"
                                )}
                            >
                                {isInvestigating ? <Cpu className="w-5 h-5 animate-spin" /> : <Binary className="w-5 h-5" />}
                                {isInvestigating ? "Executing..." : "Execute Deep Scan"}
                            </button>
                        </div>

                        {/* Telemetry Card */}
                        <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-minimal">
                            <h3 className="text-[10px] font-black text-stone-300 mb-8 flex items-center gap-2 uppercase tracking-widest">
                                <Zap className="w-4 h-4 text-primary-teal-start" /> SYSTEM TELEMETRY
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'ZKP Node Latency', value: '42ms', status: 'optimal' },
                                    { label: 'Anchor Redundancy', value: '3/3', status: 'optimal' },
                                    { label: 'Forensic Precision', value: '99.98%', status: 'optimal' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-stone-50 pb-4">
                                        <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{stat.label}</span>
                                        <span className="text-sm font-black text-black">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Investigation Trail */}
                    <div className="md:col-span-8 bg-white border border-stone-100 rounded-[3rem] shadow-massive overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-8 border-b border-stone-50 bg-stone-50/30 flex justify-between items-center relative z-10">
                            <h2 className="text-[10px] font-black text-stone-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                                <History className="w-5 h-5 text-black" /> Investigation Sequence
                            </h2>
                            {result && (
                                <Badge variant="primary" styleType="sovereign">INTEGRITY_CONFIRMED</Badge>
                            )}
                        </div>

                        <div className="p-10 overflow-y-auto flex-1 space-y-12 relative z-10 custom-scrollbar">
                            {isInvestigating ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-8 opacity-60">
                                    <div className="relative">
                                        <Cpu className="w-20 h-20 animate-spin text-black" />
                                        <div className="absolute inset-0 bg-primary-teal-start/20 blur-2xl rounded-full animate-pulse" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">RECONSTRUCTING TRACELOG FROM 5T ANCHORS...</p>
                                </div>
                            ) : result ? (
                                result.map((node, i) => (
                                    <div key={i} className="relative pl-16 pb-2">
                                        {/* Timeline Dot & Line */}
                                        {i < result.length - 1 && (
                                            <div className="absolute left-[23px] top-10 bottom-[-24px] w-[2px] bg-stone-100" />
                                        )}
                                        <div className={cn(
                                            "absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 shadow-xl",
                                            node.zkpStatus === 'VERIFIED' ? 'bg-black border-black text-primary-teal-start scale-110' : 'bg-white border-stone-100 text-stone-300'
                                        )}>
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>

                                        <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 hover:border-black/10 transition-all group shadow-minimal relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-teal-start/5 blur-[40px] -mr-16 -mt-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex justify-between items-start mb-6 relative z-10">
                                                <div>
                                                    <span className="text-[10px] text-stone-300 font-black block mb-2 uppercase tracking-[0.2em]">{node.agent}</span>
                                                    <h4 className="text-xl font-black text-black tracking-tighter uppercase">{node.action}</h4>
                                                </div>
                                                <span className="text-[10px] font-black text-stone-200 tracking-widest uppercase font-mono">{node.timestamp}</span>
                                            </div>

                                            <div className="flex items-center gap-4 mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-100 group-hover:bg-white transition-colors relative z-10">
                                                <Fingerprint className="w-5 h-5 text-black" />
                                                <span className="text-[10px] font-black text-black truncate flex-1 uppercase tracking-tight">{node.hash}</span>
                                                <Lock className="w-4 h-4 text-stone-200" />
                                            </div>

                                            <pre className="text-[11px] text-stone-400 font-mono bg-stone-50/50 p-6 rounded-2xl border border-stone-50 shadow-inner overflow-x-auto relative z-10">
                                                {JSON.stringify(node.data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-stone-200 gap-6 text-center">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-stone-50 flex items-center justify-center border border-stone-100">
                                        <Search className="w-10 h-10 opacity-20" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest">Awaiting Target Hash</p>
                                        <p className="text-[10px] font-bold opacity-60 uppercase mt-1">Input a valid audit hash to begin forensic reconstruction</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
