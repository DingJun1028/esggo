import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Activity, Brain } from 'lucide-react';
import { AgentDiagnostics } from '@/core/evolution/AgentSelfDiagnosis';
import { motion, AnimatePresence } from 'framer-motion';

export const EvolutionDiagnosticsLog: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchInitialLogs = async () => {
            const report = await AgentDiagnostics.getInstance().generateEvolutionReport();
            setLogs([report]);
        };
        fetchInitialLogs();

        const interval = setInterval(async () => {
            const report = await AgentDiagnostics.getInstance().generateEvolutionReport();
            setLogs(prev => [...prev.slice(-19), report]); // Keep last 20 logs
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-black/40 rounded-xl border border-[#0df2df]/20 overflow-hidden font-mono text-[10px]">
            <div className="flex items-center gap-2 p-2 bg-[#0df2df]/10 border-b border-[#0df2df]/20">
                <Terminal className="w-3 h-3 text-[#0df2df]" />
                <span className="text-[#0df2df] font-bold tracking-tight">EVOLUTION_STREAM.LOG</span>
                <div className="ml-auto flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0df2df] animate-pulse" />
                    <span className="text-[8px] text-[#0df2df]/60 uppercase">Live Feed</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 p-3 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-[#0df2df]/20"
            >
                <AnimatePresence initial={false}>
                    {logs.map((log, i) => (
                        <motion.div
                            key={`${i}-${log.substring(0, 10)}`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-2 text-white/70"
                        >
                            <span className="text-[#0df2df]/40">[{new Date().toLocaleTimeString()}]</span>
                            <span className={log.includes('TRANSCENDENT') ? 'text-[#ffd700]' : ''}>
                                {log}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-2 border-t border-[#0df2df]/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-[#0df2df]/60" />
                        <span className="text-[8px] text-[#0df2df]/40 uppercase tracking-widest">Diagnostics: Nominal</span>
                    </div>
                </div>
                <Brain className="w-3 h-3 text-[#0df2df]/20" />
            </div>
        </div>
    );
};
