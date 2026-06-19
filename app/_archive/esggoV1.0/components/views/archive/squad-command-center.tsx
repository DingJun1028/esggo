"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Terminal,
    Cpu,
    Zap,
    Lock,
    ChevronRight,
    Database,
    Wrench,
    ShieldCheck,
    Search,
    Send,
    Shield,
    Activity,
    BrainCircuit,
    ShieldAlert,
    Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { omniManager } from "@/omni-manager";
import dynamic from "next/dynamic";
import { AuditPdfReport } from "@/lib/services/audit-pdf-report";
import { RefreshCw } from "lucide-react";

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const ICON_MAP: Record<string, any> = {
    Activity,
    BrainCircuit,
    ShieldCheck,
    Zap,
    ShieldAlert,
    Database,
    Bot
};

export function SquadCommandCenter() {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [squad, setSquad] = useState<any[]>([]);
    const [isForensicMode, setIsForensicMode] = useState(false);
    const [compliance, setCompliance] = useState<any>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/omni');
            const data = await res.json();
            setCompliance(data);
            if (data.tasks) {
                // Merge tasks into logs or a separate stream if needed
            }
        } catch (e) {
            console.error("Failed to fetch omni status", e);
        }
    };

    useEffect(() => {
        const initialSquad = omniManager.getSquadMembers();
        setSquad(initialSquad);
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleCommand = async () => {
        if (!input.trim() || isLoading) return;

        const command = isForensicMode ? `INVESTIGATE: ${input.trim()}` : input.trim();
        setInput("");
        setIsLoading(true);
        setLogs((prev) => [...prev, { type: "user", content: command, timestamp: new Date() }]);

        try {
            // Call Agent Zero (Single Point of Entry)
            const result = await omniManager.orchestrate(command, {
                sessionId: "session_" + Date.now(),
                state: { uid: "user_tactical_01" },
                history: [],
            });

            if (!result) return;

            setLogs((prev) => [
                ...prev,
                {
                    type: "system",
                    agent: result.routedTo || "Omni Manager",
                    content: typeof result.result === 'string' ? result.result : (result.result.message || JSON.stringify(result.result, null, 2)),
                    routing: (result.sessionState as any).trace || [{ agent: result.routedTo }],
                    metadata: result.sessionState,
                    timestamp: new Date(),
                },
            ]);

            if (result.routedTo) {
                setSquad(prev => prev.map(m => m.id === result.routedTo ? { ...m, status: "ACTIVE", load: 100 } : { ...m, status: "IDLE", load: 0 }));
                setTimeout(() => {
                    setSquad(prev => prev.map(m => ({ ...m, status: "IDLE", load: 0 })));
                }, 3000);
            }

        } catch (error: any) {
            setLogs((prev) => [
                ...prev,
                { type: "error", content: `Orchestration Error: ${error.message}`, timestamp: new Date() },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-full bg-surface-container/20 sm:rounded-[20px] lg:rounded-[40px] border border-outline-variant overflow-hidden relative",
            isForensicMode && "ring-2 ring-amber-500/20"
        )}>
            {/* Forensic Scan Line */}
            <AnimatePresence>
                {isForensicMode && (
                    <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent z-[60] shadow-[0_0_15px_rgba(245,158,11,0.5)] opacity-50"
                    />
                )}
            </AnimatePresence>

            {/* Squad Header */}
            <div className="p-4 md:p-6 lg:p-8 border-b border-outline-variant bg-white/50 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
                <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 bg-black rounded-lg lg:rounded-xl text-white">
                        <Terminal className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg lg:text-xl font-black uppercase tracking-tighter font-headline">Tactical Squad Command</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn("w-2 h-2 rounded-full animate-pulse", compliance?.status === 'operational' ? "bg-emerald-500" : "bg-amber-500")} />
                            <span className="text-[9px] lg:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                {compliance?.status === 'operational' ? "Orchestration Active" : "Initializing Squad..."}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 w-full md:w-auto">
                    {/* Compliance Indicator */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">Audit Readiness</span>
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-black font-headline tabular-nums">{compliance?.auditReadiness || "--"}%</div>
                            <div className="h-2 w-16 bg-black/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${compliance?.auditReadiness || 0}%` }} className="h-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    const res = await fetch('/api/orchestrate', {
                                        method: 'POST',
                                        body: JSON.stringify({ cycleId: `CYC-${Date.now()}`, scope: 'FULL' })
                                    });
                                    const result = await res.json();
                                    setLogs(prev => [...prev, {
                                        type: 'system',
                                        agent: 'Orchestrator',
                                        content: `Autonomous cycle initialized. Result: ${result.status}`,
                                        timestamp: new Date()
                                    }]);
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            <Zap className="w-3 h-3 fill-current" /> Power Cycle
                        </button>
                    </div>

                    <div className="flex items-center bg-surface-container/50 rounded-full p-1 border border-outline-variant shrink-0">
                        <button
                            onClick={() => setIsForensicMode(false)}
                            className={cn("px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all", !isForensicMode ? "bg-black text-white" : "text-on-surface-variant hover:text-black")}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setIsForensicMode(true)}
                            className={cn("px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase transition-all flex items-center gap-2", isForensicMode ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-on-surface-variant hover:text-amber-600")}
                        >
                            <Shield className="w-3 h-3 md:w-3.5 md:h-3.5" /> Forensic
                        </button>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto w-full pb-2 md:pb-0 no-scrollbar">
                        {squad.map((member) => {
                            const Icon = ICON_MAP[member.iconName || "Bot"] || Bot;
                            return (
                                <div
                                    key={member.id}
                                    className={cn(
                                        "px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl lg:rounded-2xl border transition-all flex items-center gap-2 lg:gap-3 flex-shrink-0",
                                        member.status === "ACTIVE" ? "bg-black text-white border-black" : "bg-white border-outline-variant text-on-surface-variant"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-wider whitespace-nowrap">{member.name}</span>
                                    {member.status === "ACTIVE" && (
                                        <motion.div
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Tactical Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Log Terminal */}
                <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar space-y-4 lg:space-y-6">
                    <AnimatePresence mode="popLayout">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "flex flex-col gap-2",
                                    log.type === "user" ? "items-end" : "items-start"
                                )}
                            >
                                <div className={cn(
                                    "p-4 lg:p-5 rounded-2xl lg:rounded-3xl max-w-[95%] lg:max-w-[80%]",
                                    log.type === "user" ? "bg-black text-white rounded-tr-none" : log.type === "error" ? "bg-error/10 border border-error/20 text-error rounded-tl-none font-bold" : "bg-white border border-outline-variant text-on-surface rounded-tl-none"
                                )}>
                                    {log.type === "system" && (
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-[8px] lg:text-[9px] font-black border-black/10 uppercase tracking-widest">Agent: {log.agent}</Badge>
                                            {log.metadata?.zkpProofs?.[log.metadata.currentTask] && (
                                                <Badge className="text-[8px] lg:text-[9px] bg-emerald-500 text-white border-none uppercase flex items-center gap-1">
                                                    <ShieldCheck className="w-2.5 h-2.5 lg:w-3 lg:h-3" /> ZKP Verified
                                                </Badge>
                                            )}
                                            <span className="text-[8px] lg:text-[9px] text-on-surface-variant font-bold">{log.timestamp.toLocaleTimeString()}</span>
                                        </div>
                                    )}
                                    <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-wrap">{log.content}</p>

                                    {log.metadata?.pdfData && (
                                        <div className="mt-4 p-4 rounded-xl bg-black text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 shadow-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg">
                                                    <Database className="w-5 h-5 text-emerald-400" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Audit Report Ready</div>
                                                    <div className="text-xs font-bold leading-tight">精裝版合規稽核報表</div>
                                                </div>
                                            </div>
                                            <PDFDownloadLink
                                                document={<AuditPdfReport data={log.metadata.pdfData} />}
                                                fileName={`ESG_Squad_Audit_${log.metadata.pdfData.auditId}.pdf`}
                                                className="w-full md:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                            >
                                                {/* @ts-ignore */}
                                                {({ loading }) => (loading ? "正在編製..." : "📥 下載精裝報表")}
                                            </PDFDownloadLink>
                                        </div>
                                    )}

                                    {log.routing && log.routing.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-outline-variant space-y-3">
                                            <p className="text-[8px] lg:text-[9px] font-black uppercase text-on-surface-variant tracking-[0.2em] mb-2">Routing State Chain</p>
                                            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                                                {log.routing.map((step: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                                                        <div className="flex flex-col gap-1 items-center">
                                                            <div className="px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg bg-surface-container text-[8px] lg:text-[9px] font-black border border-outline-variant uppercase">
                                                                {step.agent}
                                                            </div>
                                                            {step.toolUsed && (
                                                                <div className="flex items-center gap-1 text-[7px] lg:text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                                                                    <Wrench className="w-2.5 h-2.5" />
                                                                    {step.toolUsed}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {idx < log.routing.length - 1 && <ChevronRight className="w-3 h-3 text-on-surface-variant/30" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={logsEndRef} />
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-outline-variant bg-surface-container/30 p-6 lg:p-8 space-y-8 flex-none max-h-[400px] lg:max-h-none overflow-y-auto no-scrollbar order-last lg:order-none">
                    <div>
                        <h3 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4" /> Compliance Markers
                        </h3>
                        <div className="space-y-4">
                            {compliance?.indicators?.map((indicator: any) => (
                                <div key={indicator.id} className="p-3 bg-white border border-outline-variant rounded-xl group hover:border-black transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] font-black uppercase text-on-surface-variant/40">{indicator.id}</span>
                                        <Badge variant={indicator.status === 'complete' ? 'optimal' : 'outline'} className={cn(
                                            "text-[7px] uppercase px-1.5",
                                            indicator.status === 'complete' ? "bg-emerald-500 text-white border-none" : "border-amber-500 text-amber-500"
                                        )}>
                                            {indicator.status}
                                        </Badge>
                                    </div>
                                    <div className="text-[10px] font-black">{indicator.label}</div>
                                    <div className="text-[8px] text-on-surface-variant/60 mt-1 line-clamp-2">{indicator.reasoning}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <Cpu className="w-4 h-4" /> Squad Load Metrics
                        </h3>
                        <div className="space-y-6">
                            {squad.map((member) => (
                                <div key={member.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] lg:text-[10px] font-black uppercase">{member.name}</span>
                                        <span className="text-[9px] lg:text-[10px] font-headline font-black">
                                            {member.status === 'ACTIVE' ? "100%" : (compliance?.squad?.find((s: any) => s.id === member.id)?.load || "0") + "%"}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: member.status === 'ACTIVE' ? '100%' : `${compliance?.squad?.find((s: any) => s.id === member.id)?.load || 0}%` }}
                                            className={cn("h-full rounded-full bg-gradient-to-r", member.gradient)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-outline-variant">
                        <h3 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <Wrench className="w-4 h-4" /> Tactical Weaponry
                        </h3>
                        <div className="space-y-4">
                            {squad.map((member) => {
                                const Icon = ICON_MAP[member.iconName || "Bot"] || Bot;
                                return (
                                    <div key={member.id} className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white border border-outline-variant">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Icon className="w-3 h-3 text-on-surface-variant/50" />
                                            <span className="text-[8px] lg:text-[9px] font-black uppercase text-on-surface-variant/70">{member.name}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {member.weapons?.map((weapon: any) => (
                                                <div key={weapon.id} className="flex items-center justify-between p-1.5 lg:p-2 rounded bg-surface-container/50 border border-outline-variant/50">
                                                    <span className="text-[7px] lg:text-[8px] font-bold">{weapon.name}</span>
                                                    <Badge className="text-[6px] lg:text-[7px] px-1.5 py-0 h-3 lg:h-4 bg-black text-white">{weapon.status || "READY"}</Badge>
                                                </div>
                                            )) || <span className="text-[7px] lg:text-[8px] text-on-surface-variant/30 italic">No assigned tools</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-outline-variant">
                        <h3 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <Database className="w-4 h-4" /> 5T Protocol Active
                        </h3>
                        <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white border border-outline-variant space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] lg:text-[9px] font-bold text-on-surface-variant">Traceability Hash</span>
                                <Badge className="bg-emerald-100 text-emerald-800 text-[7px] lg:text-[8px] border-emerald-200">VERIFIED</Badge>
                            </div>
                            <div className="font-mono text-[8px] lg:text-[9px] bg-surface-container p-2 rounded break-all opacity-50">
                                0x7d21a83c442345e89fbd7578e86e0aed
                            </div>
                            <div className="flex items-center gap-2 text-[8px] lg:text-[9px] font-bold text-on-surface-variant">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span>Real-time Consensus Locking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Command Input Area */}
            <div className="p-4 md:p-6 lg:p-8 bg-white border-t border-outline-variant">
                <div className="max-w-4xl mx-auto flex items-center relative gap-2 md:gap-4">
                    <div className="absolute left-3 md:left-6 text-on-surface-variant/30 flex items-center justify-center">
                        {isForensicMode ? <Search className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> : <Send className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                        placeholder={isForensicMode ? "輸入稽核哈希進行鑑識分析..." : "下達專家小隊指令..."}
                        className={cn(
                            "w-full pl-10 md:pl-16 pr-14 md:pr-32 py-4 md:py-6 bg-surface-container/50 border rounded-2xl md:rounded-full text-sm md:text-lg font-black focus:outline-none focus:ring-4 transition-all",
                            isForensicMode ? "border-amber-500/50 focus:ring-amber-500/5 focus:bg-amber-50/10" : "border-outline-variant focus:ring-black/5 focus:bg-white"
                        )}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleCommand}
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "absolute right-2 md:right-3 p-2.5 md:px-8 md:py-3 rounded-xl md:rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg",
                            isForensicMode ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-black text-white shadow-black/20"
                        )}
                    >
                        {isLoading ? <RefreshCw className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : (
                            <>
                                <span className="hidden md:inline">EXECUTE COMMAND</span>
                                <Send className="w-4 h-4 md:hidden" />
                            </>
                        )}
                    </button>
                </div>
                <p className="text-center text-[7.5px] md:text-[9px] font-bold text-on-surface-variant/40 mt-3 md:mt-4 uppercase tracking-[0.2em]">
                    Omni Manager Orchestration Oracle v2.1 // 5T Compliant
                </p>
            </div>
        </div>
    );
}
