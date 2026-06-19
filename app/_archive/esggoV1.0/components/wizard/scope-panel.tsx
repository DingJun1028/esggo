"use client";

import { Target, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { MaterialityIssue } from "@/lib/types/ncb-types";

interface ScopePanelProps {
    materialityIssues: MaterialityIssue[];
    selectedIssues: string[];
    setSelectedIssues: (setter: (prev: string[]) => string[]) => void;
}

export const ScopePanel = ({
    materialityIssues,
    selectedIssues,
    setSelectedIssues,
}: ScopePanelProps) => {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-stitch-text">揭露範圍設定</h3>
                    <p className="text-xs text-stitch-muted mt-1">定義報告邊界，納入關鍵議題。</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-8 space-y-6 shadow-minimal border-stitch-border">
                    <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Target size={16} /> 重大性議題
                    </h4>
                    <div className="space-y-2">
                        {materialityIssues.map((issue) => (
                            <div
                                key={issue.id}
                                onClick={() =>
                                    setSelectedIssues((prev) =>
                                        prev.includes(issue.id)
                                            ? prev.filter((id) => id !== issue.id)
                                            : [...prev, issue.id]
                                    )
                                }
                                className={cn(
                                    "p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between",
                                    selectedIssues.includes(issue.id)
                                        ? "border-primary-teal-start bg-primary-teal-start/5"
                                        : "border-outline-variant"
                                )}
                            >
                                <span className="text-xs font-bold text-stitch-text">{issue.topic}</span>
                                {selectedIssues.includes(issue.id) && (
                                    <CheckCircle2 size={16} className="text-primary-teal-start" />
                                )}
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
