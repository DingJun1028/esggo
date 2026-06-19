import { ImpactMatrix } from "@/lib/services/intelligence-orchestrator";
import { OmniCard } from "@/components/omni-terminal/omni-card";
import { motion } from "framer-motion";

export function ImpactVisualizer({ matrix, title }: { matrix: ImpactMatrix, title: string }) {
    const sectors = [
        { key: "finance", label: "財務影響", value: matrix.finance, color: "text-blue-400", bg: "bg-blue-500/20" },
        { key: "compliance", label: "合規影響", value: matrix.compliance, color: "text-purple-400", bg: "bg-purple-500/20" },
        { key: "supply", label: "供應影響", value: matrix.supply, color: "text-amber-400", bg: "bg-amber-500/20" },
        { key: "reputation", label: "聲譽影響", value: matrix.reputation, color: "text-red-400", bg: "bg-red-500/20" }
    ];

    return (
        <OmniCard title="Impact_Matrix_M3" subtitle={`QUANTITATIVE IMPACT: ${title}`} noPadding>
            <div className="grid grid-cols-2 gap-px bg-white/5 p-px">
                {sectors.map((s, idx) => (
                    <div key={s.key} className="bg-[#0a0a0a] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-2 text-[8px] font-mono opacity-20 uppercase group-hover:opacity-40 transition-opacity`}>SEC_{idx.toString().padStart(2, '0')}</div>
                        <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value}<span className="text-[10px] ml-0.5">%</span></div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">{s.label}</div>

                        <div className="w-full max-w-[100px] h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.value}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${s.bg.replace('/20', '')}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Aggregated_Impact_Confidence</div>
                <div className="text-xs font-bold text-teal-400">HIGH_CERTAINTY</div>
            </div>
        </OmniCard>
    );
}
