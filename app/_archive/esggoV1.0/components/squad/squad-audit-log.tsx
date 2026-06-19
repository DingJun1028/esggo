"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Hash, User, ChevronRight } from "lucide-react";
import { SquadAuditRecord } from "@/lib/services/squad-audit";

export function SquadAuditLog() {
    const [logs, setLogs] = useState<SquadAuditRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/squad/audit");
                const data = await res.json();
                if (data.success) {
                    setLogs(data.logs.reverse()); // Show latest first
                }
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 10000); // Polling for live audit updates
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8 text-center text-zinc-500 animate-pulse font-mono">ACCESSING IMMUTABLE VAULT...</div>;

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg font-bold tracking-tighter text-zinc-100 uppercase">Ancestral Audit Vault</h2>
                </div>
                <div className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
                    5T COMPLIANT HASH-LINKED
                </div>
            </div>

            <div className="space-y-3">
                {logs.map((log, index) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all overflow-hidden"
                    >
                        {/* Hash Link Indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-hover:bg-emerald-500 transition-colors" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div className="md:col-span-1 space-y-1">
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                    <Clock className="w-3 h-3" />
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </div>
                                <div className="text-sm font-bold text-zinc-200">{log.action}</div>
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                    <User className="w-3 h-3" />
                                    {log.actor}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <div className="text-[11px] text-zinc-400 mb-1 font-mono uppercase tracking-widest">Payload Details</div>
                                <div className="p-2 rounded bg-black/40 border border-zinc-800/50 text-[10px] font-mono text-emerald-400/80 break-all leading-relaxed">
                                    {JSON.stringify(log.details)}
                                </div>
                            </div>

                            <div className="md:col-span-1 space-y-2">
                                <div>
                                    <div className="text-[9px] text-zinc-600 uppercase font-mono">Block Hash</div>
                                    <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 truncate">
                                        <Hash className="w-2 h-2" />
                                        {log.hash.substring(7, 24)}...
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] text-zinc-600 uppercase font-mono">Parent Hash</div>
                                    <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-600/70 truncate">
                                        <Hash className="w-2 h-2" />
                                        {log.parentHash ? log.parentHash.substring(7, 24) + "..." : "GENESIS_BLOCK"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {logs.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 font-mono text-sm">VAULT IS EMPTY. NO ANCESTRAL RECORDS FOUND.</p>
                </div>
            )}
        </div>
    );
}
