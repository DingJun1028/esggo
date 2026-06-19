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
    Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AGENT_SQUAD } from "@/lib/data/omni-data";
import { OmniManagerAgent } from "@/omni-manager";

export function SquadCommandCenter() {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [squad, setSquad] = useState(AGENT_SQUAD);
    const [isForensicMode, setIsForensicMode] = useState(false);
    const agentRef = useRef<OmniManagerAgent | null>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!agentRef.current) {
            agentRef.current = new OmniManagerAgent();
        }
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
            const result = await agentRef.current?.orchestrate(command, {
                sessionId: "session_" + Date.now(),
                state: { uid: "user_tactical_01" },
                history: [],
            });

            if (!result) return;

            setLogs((prev) => [
                ...prev,
                {
                    type: "system",
                    agent: result.routedTo || "Omni",
                    content: typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2),
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
        <div className="flex flex-col h-full bg-surface-container/20 rounded-[40px] border border-outline-variant overflow-hidden">
            {/* Squad Header */}
            <div className="p-8 border-b border-outline-variant bg-white/50 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-black rounded-xl text-white">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter font-headline">Tactical Squad Command</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Multi-Agent Orchestration Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center bg-surface-container/50 rounded-full p-1 border border-outline-variant">
                        <button
                            onClick={() => setIsForensicMode(false)}
                            className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all", !isForensicMode ? "bg-black text-white" : "text-on-surface-variant hover:text-black")}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setIsForensicMode(true)}
                            className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2", isForensicMode ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-on-surface-variant hover:text-amber-600")}
                        >
                            <Shield className="w-3 h-3" /> Forensic
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {squad.map((member) => (
                            <div
                                key={member.id}
                                className={cn(
                                    "px-4 py-2 rounded-2xl border transition-all flex items-center gap-3",
                                    member.status === "ACTIVE" ? "bg-black text-white border-black" : "bg-white border-outline-variant text-on-surface-variant"
                                )}
                            >
                                <member.icon className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-wider">{member.name}</span>
                                {member.status === "ACTIVE" && (
                                    <motion.div
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Tactical Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Log Terminal */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
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
                                    "p-5 rounded-3xl max-w-[80%]",
                                    log.type === "user" ? "bg-black text-white rounded-tr-none" : log.type === "error" ? "bg-error/10 border border-error/20 text-error rounded-tl-none font-bold" : "bg-white border border-outline-variant text-on-surface rounded-tl-none"
                                )}>
                                    {log.type === "system" && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-[9px] font-black border-black/10 uppercase tracking-widest">Agent: {log.agent}</Badge>
                                            {log.metadata?.zkpProofs?.[log.metadata.currentTask] && (
                                                <Badge className="text-[9px] bg-emerald-500 text-white border-none uppercase flex items-center gap-1">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> ZKP Verified
                                                </Badge>
                                            )}
                                            <span className="text-[9px] text-on-surface-variant font-bold">{log.timestamp.toLocaleTimeString()}</span>
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{log.content}</p>

                                    {log.routing && log.routing.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-outline-variant space-y-3">
                                            <p className="text-[9px] font-black uppercase text-on-surface-variant tracking-[0.2em] mb-2">Routing State Chain</p>
                                            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                                                {log.routing.map((step: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                                                        <div className="flex flex-col gap-1 items-center">
                                                            <div className="px-3 py-1.5 rounded-lg bg-surface-container text-[9px] font-black border border-outline-variant uppercase">
                                                                {step.agent}
                                                            </div>
                                                            {step.toolUsed && (
                                                                <div className="flex items-center gap-1 text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
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
                <div className="w-80 border-l border-outline-variant bg-surface-container/30 p-8 space-y-8 hidden xl:block overflow-y-auto no-scrollbar">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <Cpu className="w-4 h-4" /> Squad Load Metrics
                        </h3>
                        <div className="space-y-6">
                            {squad.map((member) => (
                                <div key={member.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase">{member.name}</span>
                                        <span className="text-[10px] font-headline font-black">{member.load}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${member.load}%` }}
                                            className={cn("h-full rounded-full bg-gradient-to-r", member.gradient)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-outline-variant">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <Wrench className="w-4 h-4" /> Tactical Weaponry
                        </h3>
                        <div className="space-y-4">
                            {squad.map((member) => (
                                <div key={member.id} className="p-4 rounded-2xl bg-white border border-outline-variant">
                                    <div className="flex items-center gap-2 mb-3">
                                        <member.icon className="w-3 h-3 text-on-surface-variant/50" />
                                        <span className="text-[9px] font-black uppercase text-on-surface-variant/70">{member.name}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {(member as any).weapons?.map((weapon: any) => (
                                            <div key={weapon.id} className="flex items-center justify-between p-2 rounded bg-surface-container/50 border border-outline-variant/50">
                                                <span className="text-[8px] font-bold">{weapon.name}</span>
                                                <Badge className="text-[7px] px-1.5 py-0 h-4 bg-black text-white">READY</Badge>
                                            </div>
                                        )) || <span className="text-[8px] text-on-surface-variant/30 italic">No assigned tools</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-outline-variant">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-6 flex items-center gap-3">
                            <Database className="w-4 h-4" /> 5T Protocol Active
                        </h3>
                        <div className="p-4 rounded-2xl bg-white border border-outline-variant space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-on-surface-variant">Traceability Hash</span>
                                <Badge className="bg-emerald-100 text-emerald-800 text-[8px] border-emerald-200">VERIFIED</Badge>
                            </div>
                            <div className="font-mono text-[9px] bg-surface-container p-2 rounded break-all opacity-50">
                                0x7d21a83c442345e89fbd7578e86e0aed
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-on-surface-variant">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span>Real-time Consensus Locking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Command Input Area */}
            <div className="p-8 bg-white border-t border-outline-variant">
                <div className="max-w-4xl mx-auto flex items-center gap-4 relative">
                    <div className="absolute left-6 text-on-surface-variant/30">
                        {isForensicMode ? <Search className="w-5 h-5 text-amber-500" /> : <Send className="w-5 h-5" />}
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCommand()}
                        placeholder={isForensicMode ? "輸入稽核哈希進行鑑識分析..." : "下達專家小隊指令 (例如: 比對 GRI 305-1 並封存審記定錨)..."}
                        className={cn(
                            "w-full pl-16 pr-24 py-6 bg-surface-container/50 border rounded-full text-lg font-black focus:outline-none focus:ring-4 transition-all",
                            isForensicMode ? "border-amber-500/50 focus:ring-amber-500/5 focus:bg-amber-50/10" : "border-outline-variant focus:ring-black/5 focus:bg-white"
                        )}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleCommand}
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "absolute right-3 px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50",
                            isForensicMode ? "bg-amber-500 text-white" : "bg-black text-white"
                        )}
                    >
                        {isLoading ? <Zap className="w-4 h-4 animate-spin" /> : "EXECUTE"}
                    </button>
                </div>
                <p className="text-center text-[9px] font-bold text-on-surface-variant/40 mt-4 uppercase tracking-[0.2em]">
                    Omni Manager Orchestration Oracle v2.1 // 5T Compliant
                </p>
            </div>
        </div>
    );
}
