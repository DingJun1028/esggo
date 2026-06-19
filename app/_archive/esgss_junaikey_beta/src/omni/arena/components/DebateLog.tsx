import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface DebateLogProps {
    logs: string[];
}

export const DebateLog: React.FC<DebateLogProps> = ({ logs }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="bg-black/80 rounded-lg border border-slate-700 p-4 h-full flex flex-col font-mono text-xs shadow-inner">
            <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-800 pb-2">
                <Terminal size={14} />
                <span>COMBAT LOG</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {logs.length === 0 && <div className="text-slate-600 italic">Waiting for turn data...</div>}

                {logs.map((log, i) => {
                    const isHallucination = log.includes('Hallucination');
                    const isValid = log.includes('Valid');
                    const isCritical = log.includes('CRITICAL');

                    return (
                        <div key={i} className={`
                            ${isHallucination ? 'text-red-400 bg-red-900/10 px-1' : ''}
                            ${isValid ? 'text-cyan-300' : 'text-slate-400'}
                            ${isCritical ? 'font-bold text-yellow-400' : ''}
                        `}>
                            <span className="text-slate-600 mr-2">[{i + 1}]</span>
                            {log}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
