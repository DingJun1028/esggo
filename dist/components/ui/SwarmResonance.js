'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Shield, Zap, Activity, Info } from 'lucide-react';
import { omniAgentBus } from '@/lib/agents/omni-agent-bus';
export function SwarmResonance() {
    const [logs, setLogs] = useState([]);
    const scrollRef = useRef(null);
    useEffect(() => {
        const handleEvent = (event, payload) => {
            const newLog = {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString(),
                event,
                payload,
                agent: payload?.agent || (event.startsWith('AGENT_') ? payload?.agent : 'System')
            };
            setLogs(prev => [newLog, ...prev].slice(0, 50));
        };
        // Subscribe to all known events
        const unsubscribes = [
            omniAgentBus.subscribe('SIMULATION_START', (p) => handleEvent('SIMULATION_START', p)),
            omniAgentBus.subscribe('SIMULATION_COMPLETE', (p) => handleEvent('SIMULATION_COMPLETE', p)),
            omniAgentBus.subscribe('AGENT_TASK', (p) => handleEvent('AGENT_TASK', p)),
            omniAgentBus.subscribe('COMMAND_ISSUED', (p) => handleEvent('COMMAND_ISSUED', p)),
            omniAgentBus.subscribe('5T_SEAL', (p) => handleEvent('5T_SEAL', p)),
            omniAgentBus.subscribe('MISSION_START', (p) => handleEvent('MISSION_START', p)),
            omniAgentBus.subscribe('MISSION_COMPLETE', (p) => handleEvent('MISSION_COMPLETE', p)),
        ];
        return () => unsubscribes.forEach(unsub => unsub());
    }, []);
    const getAgentIcon = (agent) => {
        switch (agent) {
            case 'ESG_Auditor': return _jsx(Shield, { className: "text-emerald-400", size: 14 });
            case 'Agent0': return _jsx(Cpu, { className: "text-cyan-400", size: 14 });
            case 'OmniAgent': return _jsx(Zap, { className: "text-amber-400", size: 14 });
            default: return _jsx(Activity, { className: "text-blue-400", size: 14 });
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Terminal, { size: 16, className: "text-cyan-400" }), _jsx("span", { className: "text-xs font-black tracking-widest uppercase text-white/90", children: "Swarm Resonance Monitor" })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-red-500/50" }), _jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500/50" }), _jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500/50" })] })] }), _jsx("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-3 custom-scrollbar", children: _jsx(AnimatePresence, { initial: false, children: logs.length === 0 ? (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-white/20 italic", children: [_jsx(Info, { size: 24, className: "mb-2 opacity-20" }), _jsx("p", { children: "Waiting for intent resonance..." })] })) : (logs.map((log) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "group border-l-2 border-white/5 pl-3 py-1 hover:border-cyan-500/50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("span", { className: "text-white/30", children: ["[", log.timestamp, "]"] }), _jsx("span", { className: "px-1.5 py-0.5 rounded bg-white/5 text-cyan-400 font-bold border border-white/5", children: log.event }), _jsxs("div", { className: "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-white/60 text-[9px]", children: [getAgentIcon(log.agent), log.agent] })] }), _jsx("div", { className: "text-white/50 break-all leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all", children: typeof log.payload === 'string' ? log.payload : JSON.stringify(log.payload) })] }, log.id)))) }) }), _jsxs("div", { className: "px-4 py-2 bg-black/20 border-t border-white/5 flex items-center justify-between", children: [_jsx("span", { className: "text-[9px] text-white/30 font-bold uppercase tracking-tighter", children: "Connection: Active (5T Secure)" }), _jsx("span", { className: "text-[9px] text-cyan-500/50 font-mono animate-pulse", children: "\u25CF LIVE" })] })] }));
}
//# sourceMappingURL=SwarmResonance.js.map