"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, ShieldCheck, Fingerprint, Lock, Shield, Eye, Flame, Target } from 'lucide-react';

// --- Types ---
interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: string;
    status: 'investigating' | 'resolved' | 'verified';
}

interface RiskIndicator {
    id: string;
    name: string;
    score: number; // 0-100
    category: 'data_anomaly' | 'unverified_source' | 'goal_deviation' | 'hallucination_risk';
    description: string;
}

// --- Mock Data ---
const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: "LOG-9921", timestamp: "2026-02-27 14:32:10", action: "Data Delta > 15%", actor: "System Agent", severity: "medium", details: "Scope 3 emissions dropped sharply without proportional policy change.", status: "investigating" },
    { id: "LOG-9920", timestamp: "2026-02-27 10:15:00", action: "Missing Evidence Signature", actor: "Sentinel Guard", severity: "high", details: "Uploaded HR diversity report lacks executive cryptographic signature.", status: "investigating" },
    { id: "LOG-9915", timestamp: "2026-02-26 09:00:22", action: "Formula Modification Attempt", actor: "User_djh", severity: "critical", details: "Attempted to modify locked carbon conversion formula. Access denied via Object.freeze.", status: "resolved" },
    { id: "LOG-9910", timestamp: "2026-02-25 16:40:00", action: "Voucher Verified", actor: "OcrVerifier_Agent", severity: "low", details: "Taiwan Water bill matched and verified.", status: "verified" }
];

const MOCK_RISK_INDICATORS: RiskIndicator[] = [
    { id: "RI-001", name: "Goal Ambiguity", score: 85, category: "goal_deviation", description: "Narrative text claims 'carbon neutral' but hard targets are missing from Genesis core." },
    { id: "RI-002", name: "Source Unverifiability", score: 42, category: "unverified_source", description: "Supplier emission data lacks secondary verification (third-party audit missing)." },
    { id: "RI-003", name: "AI Hallucination Trace", score: 15, category: "hallucination_risk", description: "Generated summary text differs slightly from hard numerical evidence. Flagged for review." }
];

export default function AntiGreenwashingPage() {
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/50';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/50';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/50';
            case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/50';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/50';
        }
    };

    return (
        <div className="min-h-screen bg-[#02080a] text-white p-6 pb-32 font-sans">

            {/* Header */}
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-light text-[#63a6b0] flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                        Anti-Greenwashing Sentinel <span className="text-sm border border-rose-500/30 px-2 py-1 rounded bg-rose-500/10 ml-2 text-rose-500">Truth Enforcement</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm tracking-wide">
                        Continuous Anomaly Detection & Immutable Integrity Logging (5T Protocol)
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl backdrop-blur-md">
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Overall Trust Score</p>
                        <p className="text-xl font-bold text-emerald-400">92.4 <span className="text-sm font-normal text-emerald-500/70">/ 100</span></p>
                    </div>
                    <div className="h-8 w-px bg-slate-700/50"></div>
                    <div className="text-right flex flex-col items-center">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Protection</p>
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center"><Lock className="w-3 h-3 text-emerald-500" /></div>
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center"><Fingerprint className="w-3 h-3 text-blue-500" /></div>
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center"><Eye className="w-3 h-3 text-purple-500" /></div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column: Risk Indicators */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-[#0a1114]/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                        <h2 className="text-[#63a6b0] text-sm font-semibold tracking-widest flex items-center gap-2 mb-6">
                            <Target className="w-4 h-4" />
                            ACTIVE RISK VECTORS
                        </h2>

                        <div className="space-y-4">
                            {MOCK_RISK_INDICATORS.map(indicator => (
                                <div key={indicator.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-slate-200">{indicator.name}</div>
                                        <div className={`px-2 py-1 rounded text-xs border ${indicator.score > 60 ? 'text-red-400 bg-red-400/10 border-red-400/30' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'}`}>
                                            Risk: {indicator.score}%
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">{indicator.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <h2 className="text-rose-400 text-sm font-semibold tracking-widest flex items-center gap-2 mb-4">
                            <Flame className="w-4 h-4" />
                            ZERO-TRUST ARCHITECTURE
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                            All entities passing through the OmniAPI are currently subjected to `<code className="text-rose-300">Object.freeze</code>` and cryptographic hashing upon sealing.
                        </p>
                        <div className="w-full bg-rose-900/40 rounded-full h-1.5 mb-2">
                            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <div className="text-xs text-rose-300/80 text-right">100% Core Objects Frozen</div>
                    </div>
                </div>

                {/* Right Column: Immutable Audit Ledger */}
                <div className="xl:col-span-2 bg-[#0a1114]/80 border border-slate-800 rounded-2xl backdrop-blur-xl flex flex-col h-[700px]">
                    <div className="p-6 border-b border-slate-800 bg-black/40 flex items-center justify-between">
                        <h2 className="text-[#63a6b0] text-sm font-semibold tracking-widest flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            IMMUTABLE AUDIT LEDGER (Lifecycle Events)
                        </h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Trace Event ID or Actor..."
                                className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#63a6b0] transition-colors w-64"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
                                    <th className="pb-3 font-medium">Event ID / Time</th>
                                    <th className="pb-3 font-medium">Actor</th>
                                    <th className="pb-3 font-medium">Action Triggered</th>
                                    <th className="pb-3 font-medium">Severity</th>
                                    <th className="pb-3 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {MOCK_AUDIT_LOGS.map(log => (
                                    <tr
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className={`hover:bg-slate-800/50 transition-colors cursor-pointer group ${selectedLog?.id === log.id ? 'bg-slate-800 border-l-2 border-[#63a6b0]' : 'border-l-2 border-transparent'}`}
                                    >
                                        <td className="py-4 pl-4 pr-2">
                                            <div className="text-sm font-mono text-slate-300">{log.id}</div>
                                            <div className="text-xs text-slate-500">{log.timestamp}</div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="text-sm text-slate-300 flex items-center gap-2">
                                                {log.actor.includes('System') || log.actor.includes('Agent') ? <Eye className="w-3 h-3 text-[#63a6b0]" /> : <Fingerprint className="w-3 h-3 text-slate-400" />}
                                                {log.actor}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="text-sm font-medium text-slate-200">{log.action}</div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${getSeverityColor(log.severity)}`}>
                                                {log.severity}
                                            </span>
                                        </td>
                                        <td className="py-4 pl-2 pr-4 text-right">
                                            {log.status === 'verified' && <CheckCircle className="w-4 h-4 text-emerald-500 inline-block" />}
                                            {log.status === 'investigating' && <AlertTriangle className="w-4 h-4 text-yellow-500 inline-block" />}
                                            {log.status === 'resolved' && <ShieldCheck className="w-4 h-4 text-[#63a6b0] inline-block" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Expandable Detail View */}
                    <AnimatePresence>
                        {selectedLog && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-800 bg-slate-900/80 overflow-hidden"
                            >
                                <div className="p-6">
                                    <h3 className="text-sm font-semibold text-[#63a6b0] mb-2 uppercase tracking-wide">Event Deep Dive: {selectedLog.id}</h3>
                                    <p className="text-slate-300 mb-4">{selectedLog.details}</p>

                                    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-slate-400 border border-slate-800">
                                        // Blockchain-inspired Trace (Simulated)<br />
                                        HASH: a8b2...f9e1<br />
                                        PREV_HASH: c4d3...e2a1<br />
                                        SIGNATURE: VERIFIED<br />
                                        STATE_CHANGE: {selectedLog.action === "Formula Modification Attempt" ? "BLOCKED" : "LOGGED"}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
