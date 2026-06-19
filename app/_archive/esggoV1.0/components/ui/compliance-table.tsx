/**
 * ComplianceTable
 * 提供企業級的高密度合規數據視圖。支援排序、狀態標籤與審計追蹤路徑。
 */

"use client";

import { CheckCircle2, Circle, Clock, FileText, ArrowRight, ShieldCheck, AlertTriangle, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { DisclosureNode } from "@/lib/services/compliance-engine";

interface ComplianceTableProps {
    nodes: DisclosureNode[];
    onSelectNode: (nodeId: string) => void;
}

export function ComplianceTable({ nodes, onSelectNode }: ComplianceTableProps) {
    return (
        <div className="w-full bg-white/40 backdrop-blur-md border border-stone-200/60 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50/80 border-b border-stone-200/50">
                    <tr>
                        <th className="px-6 py-5 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Status_Code</th>
                        <th className="px-6 py-5 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Disclosure_Artifact</th>
                        <th className="px-6 py-5 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Protocol_ID</th>
                        <th className="px-6 py-5 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Neural_Strength</th>
                        <th className="px-6 py-5 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Evidence_Pool</th>
                        <th className="px-6 py-5 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] text-right">Access</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100/50">
                    {nodes.map((node) => (
                        <tr key={node.id} className="hover:bg-white/60 transition-all duration-300 group">
                            <td className="px-6 py-5">
                                {node.status === "Audited" ? (
                                    <motion.div initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
                                        <Badge variant="optimal" className="flex items-center gap-1.5 py-1 px-3 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 shadow-sm">
                                            <ShieldCheck size={12} className="text-emerald-500" /> SECURED
                                        </Badge>
                                    </motion.div>
                                ) : node.status === "Draft" ? (
                                    <motion.div
                                        animate={{ opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Badge variant="primary" className="flex items-center gap-1.5 py-1 px-3 border-sky-500/20 bg-sky-500/10 text-sky-700">
                                            <Clock size={12} className="text-sky-500" /> CALIBRATING
                                        </Badge>
                                    </motion.div>
                                ) : (
                                    <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3 text-stone-400 border-stone-200">
                                        <Circle size={12} className="opacity-20" /> VOID
                                    </Badge>
                                )}
                            </td>
                            <td className="px-6 py-5">
                                <div className="text-[13px] font-black text-stone-800 tracking-tight group-hover:text-primary-teal-end transition-colors">{node.title}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Fingerprint size={10} className="text-stone-300" />
                                    <div className="text-[9px] text-stone-400 font-mono uppercase tracking-tighter">TRC-{node.id.slice(0, 12)}</div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <code className="text-[10px] font-black bg-stone-900/5 px-2.5 py-1 rounded-full text-stone-600 border border-stone-200/50">
                                    {node.standardId}
                                </code>
                            </td>
                            <td className="px-6 py-5 min-w-[160px]">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[9px] font-black">
                                        <span className={cn(node.completion > 80 ? "text-emerald-600" : "text-stone-400")}>DENSITY</span>
                                        <span className="text-stone-800">{node.completion}%</span>
                                    </div>
                                    <div className="h-1 bg-stone-200/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${node.completion}%` }}
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                node.completion > 80 ? "bg-emerald-500" : "bg-sky-500"
                                            )}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-stone-500 bg-stone-100/50 w-fit px-3 py-1 rounded-lg border border-stone-200/30">
                                    <FileText size={12} className="text-stone-400" />
                                    <span className="text-[11px] font-bold tracking-tight">{node.evidenceCount} EVIDENCE</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <motion.button
                                    whileHover={{ scale: 1.1, x: 4 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onSelectNode(node.id)}
                                    className="p-2.5 bg-white shadow-sm border border-stone-200 rounded-xl transition-all text-stone-400 hover:text-black hover:border-black/20"
                                >
                                    <ArrowRight size={18} />
                                </motion.button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {nodes.length === 0 && (
                <div className="p-20 text-center text-stone-400 italic text-sm">
                    No disclosure items found for the selected framework.
                </div>
            )}
        </div>
    );
}
