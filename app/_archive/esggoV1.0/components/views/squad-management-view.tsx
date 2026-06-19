"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AGENT_SQUAD } from "@/lib/data/omni-data";
import { dispatchToOmniManager } from "@/lib/services/omni-service";
import { Send, Activity, BrainCircuit, ShieldCheck, Loader2, Zap, Network, Terminal } from "lucide-react";
import Markdown from "react-markdown";

export const SquadManagementView = () => {
    const [query, setQuery] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeAgent, setActiveAgent] = useState<string | null>(null);
    const [logs, setLogs] = useState<{ id: string; text: string; sender: 'user' | 'system' | 'agent'; agentName?: string }[]>([]);

    const handleDispatch = async () => {
        if (!query.trim() || isProcessing) return;

        const userMsg = query;
        setQuery("");
        setIsProcessing(true);
        setActiveAgent("Manager");

        setLogs(prev => [...prev, { id: Date.now().toString(), text: userMsg, sender: 'user' }]);

        try {
            // 1. 送出請求至 API 路由 (交由 OmniManager 進行意圖判斷與委派)
            const data = await dispatchToOmniManager(userMsg);
            const managerResponse = data.result;

            // 2. 顯示路由軌跡 (Highlight 指定 Agent)
            setActiveAgent(managerResponse.routedTo);

            setLogs(prev => [...prev, {
                id: Date.now().toString() + "-sys",
                text: `[OmniManager] 智慧路由判定: 導向 👉 ${managerResponse.routedTo}`,
                sender: 'system'
            }]);

            // 3. 延遲顯示 Agent 最終結果，創造「執行中」的感知體驗 (Tangible)
            setTimeout(() => {
                setLogs(prev => [...prev, {
                    id: Date.now().toString() + "-agent",
                    text: managerResponse.result.message || JSON.stringify(managerResponse.result),
                    sender: 'agent',
                    agentName: managerResponse.routedTo
                }]);
                setActiveAgent(null);
                setIsProcessing(false);
            }, 1200);

        } catch (error: any) {
            console.error(error);
            setLogs(prev => [...prev, { id: Date.now().toString() + "-err", text: `[系統錯誤] ${error.message}`, sender: 'system' }]);
            setActiveAgent(null);
            setIsProcessing(false);
        }
    };

    const getAgentIcon = (id: string) => {
        if (id === 'GRI_Agent') return <Activity className="w-6 h-6" />;
        if (id === 'ESRS_Agent') return <BrainCircuit className="w-6 h-6" />;
        if (id === 'Vault_Agent') return <ShieldCheck className="w-6 h-6" />;
        return <Network className="w-6 h-6" />;
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 min-h-[80vh] flex flex-col">
            <header className="mb-6 border-b border-stitch-border pb-6 px-4 pt-4">
                <h2 className="text-3xl font-black text-stitch-text tracking-tighter flex items-center gap-3 uppercase font-headline">
                    <Terminal className="w-8 h-8 text-stitch-teal-start" />
                    Squad Command Center
                </h2>
                <p className="text-xs text-stitch-muted font-bold mt-2 uppercase tracking-widest">
                    OmniManager Dynamic Routing • Active Agent Matrix
                </p>
            </header>

            {/* 節點母體矩陣 (Agent Matrix) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 px-4">
                {/* 統御樞紐節點 */}
                <motion.div
                    animate={{
                        borderColor: activeAgent === 'Manager' ? 'var(--color-stitch-teal-start)' : 'var(--color-stitch-border)',
                        boxShadow: activeAgent === 'Manager' ? '0 0 20px rgba(13,148,136,0.15)' : 'none'
                    }}
                    className="relative overflow-hidden rounded-[24px] bg-stitch-shallow-gray border p-8 transition-all duration-500 flex flex-col items-center justify-center text-center group shadow-minimal stitch-glass"
                >
                    <Network className={`w-12 h-12 mb-5 ${activeAgent === 'Manager' ? 'text-stitch-teal-start animate-pulse' : 'text-stitch-muted'}`} />
                    <h3 className="font-headline text-sm font-black text-stitch-text uppercase tracking-wider">Omni_Manager</h3>
                    <p className="text-[10px] text-stitch-teal-start/80 mt-2 uppercase font-bold tracking-widest">Root Orchestrator</p>
                </motion.div>

                {/* 子專家節點 */}
                {AGENT_SQUAD.map((agent) => {
                    const isActive = activeAgent === agent.id;
                    return (
                        <motion.div
                            key={agent.id}
                            animate={{
                                borderColor: isActive ? 'var(--color-stitch-teal-start)' : 'var(--color-stitch-border)',
                                boxShadow: isActive ? '0 0 20px rgba(13,148,136,0.15)' : 'none',
                                scale: isActive ? 1.03 : 1
                            }}
                            className="relative overflow-hidden rounded-[24px] bg-white border p-8 transition-all duration-500 flex flex-col items-center justify-center text-center shadow-minimal stitch-glass"
                        >
                            <div className={`p-4 rounded-2xl mb-5 transition-colors duration-500 ${isActive ? 'bg-stitch-teal-start/10 text-stitch-teal-start animate-pulse shadow-inner' : 'bg-stitch-shallow-gray text-stitch-muted'}`}>
                                {getAgentIcon(agent.id)}
                            </div>
                            <h3 className="font-headline text-xs font-black text-stitch-text uppercase tracking-wider">{agent.name}</h3>
                            <p className="text-[9px] text-stitch-muted mt-2 font-bold line-clamp-2 uppercase tracking-widest">{agent.role}</p>

                            {isActive && (
                                <motion.div layoutId="active-indicator" className="absolute top-3 right-3">
                                    <Zap className="w-4 h-4 text-stitch-teal-start fill-stitch-teal-start" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* 指令終端機與對話回饋 */}
            <div className="flex-1 relative overflow-hidden rounded-[32px] bg-stitch-shallow-gray/30 border border-stitch-border shadow-inner p-8 flex flex-col text-sm mx-4">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-4 min-h-[300px]">
                    {logs.length === 0 && (
                        <div className="text-stitch-muted/40 text-center mt-24 font-mono tracking-[0.3em] uppercase text-xs font-black">
                            [ AWAITING SQUAD DIRECTIVE ]
                        </div>
                    )}
                    <AnimatePresence>
                        {logs.map(log => (
                            <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${log.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className={`text-[9px] mb-1.5 font-black uppercase tracking-widest ${log.sender === 'user' ? 'text-stitch-text/40' : 'text-stitch-teal-start/60'}`}>
                                    {log.sender === 'user' ? 'DIRECTIVE_INPUT' : (log.agentName || 'SYSTEM')}
                                </span>
                                <div className={`px-6 py-4 rounded-2xl max-w-[85%] font-bold text-sm leading-relaxed ${log.sender === 'user' ? 'bg-stitch-text text-white rounded-tr-none shadow-minimal' : log.sender === 'system' ? 'bg-stitch-teal-start/10 border border-stitch-teal-start/20 text-stitch-teal-start text-xs rounded-tl-none font-mono shadow-sm' : 'bg-white border border-stitch-border text-stitch-text rounded-tl-none shadow-minimal'}`}>
                                    {log.sender === 'agent' ? (<div className="prose prose-sm prose-p:leading-relaxed"><Markdown>{log.text}</Markdown></div>) : log.text}
                                </div>
                            </motion.div>
                        ))}
                        {isProcessing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                                <div className="px-5 py-3 rounded-2xl bg-white border border-stitch-border text-stitch-muted flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-minimal">
                                    <Loader2 className="w-4 h-4 animate-spin text-stitch-teal-start" />
                                    {activeAgent === 'Manager' ? 'Routing intent via ADK Engine...' :
                                        activeAgent === 'Vault_Agent' ? 'Executing 5T+ZKP Forensic Audit...' :
                                            `Agent [${activeAgent}] is executing tool...`}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative flex items-center border border-stitch-border rounded-[24px] bg-white shadow-minimal focus-within:ring-4 focus-within:ring-stitch-teal-start/10 p-2 pl-5 transition-all">
                    <span className="text-stitch-teal-start mr-3 animate-pulse font-black text-lg">❯</span>
                    <input type="text" className="w-full bg-transparent text-stitch-text placeholder-stitch-muted/50 outline-none font-bold py-4" placeholder="下達代理小隊指令 (例: 我們一廠碳排是 1500、二廠 2500，請幫我結算總碳排)..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleDispatch()} disabled={isProcessing} />
                    <button onClick={handleDispatch} disabled={!query.trim() || isProcessing} className="px-6 py-4 text-white bg-stitch-text hover:bg-black rounded-2xl disabled:opacity-50 transition-all shadow-minimal flex-shrink-0 ml-2 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"><Send className="w-4 h-4" /> Execute</button>
                </div>
            </div>
        </div>
    );
};