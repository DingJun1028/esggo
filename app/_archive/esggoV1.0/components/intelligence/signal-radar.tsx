import { IntelligenceSignal } from "@/lib/services/intelligence-orchestrator";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { motion } from "framer-motion";

export function SignalRadar({ signals }: { signals: IntelligenceSignal[] }) {
    return (
        <OmniCard title="Signal_Radar_M1" subtitle="MULTI-SOURCE GLOBAL INTELLIGENCE FEED" noPadding>
            <div className="divide-y divide-white/5">
                {signals.map((signal, idx) => (
                    <motion.div
                        key={signal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${signal.type === 'RISK' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-blue-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{signal.type} // {signal.sourceId}</span>
                            </div>
                            <div className="text-[10px] font-mono text-white/20">{new Date(signal.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors mb-1">{signal.title}</h4>
                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-3">{signal.summary}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase text-white/30 font-bold">Impact</span>
                                <div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${signal.impactScore}%` }}
                                        className="h-full bg-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase text-white/30 font-bold">Confidence</span>
                                <span className="text-[10px] font-mono mt-1 text-teal-400/80">{signal.confidence}%</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </OmniCard>
    );
}
