"use client";

/**
 * AtomicIndicatorCard — minimal, friendly display atom
 * Shows one ESG indicator with its input field and fill status.
 */

import { useState } from "react";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Info } from "lucide-react";
import type { AtomicESGIndicator, IndicatorValueEntry } from "@/lib/types/atomic-esg-types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = {
    E: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    S: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    G: { bg: "bg-violet-50", border: "border-violet-200", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
    D: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
} as const;

const CATEGORY_LABELS = { E: "環境", S: "社會", G: "治理", D: "數位" } as const;

interface AtomicIndicatorCardProps {
    indicator: AtomicESGIndicator;
    value?: IndicatorValueEntry | undefined;
    onSave: (entry: IndicatorValueEntry) => void;
    compact?: boolean;
}

export function AtomicIndicatorCard({
    indicator,
    value,
    onSave,
    compact = false,
}: AtomicIndicatorCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [localValue, setLocalValue] = useState<string>(
        value?.value !== undefined ? String(value.value) : ""
    );
    const [notes, setNotes] = useState(value?.notes ?? "");

    const colors = CATEGORY_COLORS[indicator.category];
    const isFilled = localValue.trim() !== "";

    const handleSave = () => {
        onSave({
            indicatorId: indicator.id,
            value: indicator.dataType === "number" || indicator.dataType === "percentage"
                ? Number(localValue) || localValue
                : localValue,
            notes,
        });
    };

    return (
        <div
            className={cn(
                "rounded-2xl border transition-all duration-200 overflow-hidden",
                colors.border,
                isFilled ? colors.bg : "bg-white",
                "hover:shadow-md"
            )}
        >
            {/* Header row */}
            <div
                className="flex items-start gap-3 p-4 cursor-pointer select-none"
                onClick={() => setExpanded((e) => !e)}
            >
                {/* Status dot */}
                <div className="mt-1 shrink-0">
                    {isFilled ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : indicator.validation.required ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                        <div className={cn("w-3.5 h-3.5 rounded-full border-2 border-stone-200 mt-0.5")} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-[10px] font-black rounded-full px-2 py-0.5", colors.badge)}>
                            {CATEGORY_LABELS[indicator.category]} · {indicator.gri || indicator.code}
                        </span>
                        {indicator.validation.required && (
                            <span className="text-[10px] font-black text-rose-500 bg-rose-50 rounded-full px-2 py-0.5">必填</span>
                        )}
                    </div>
                    <p className="text-sm font-bold text-stone-800 mt-1 leading-snug">{indicator.title}</p>
                    {isFilled && (
                        <p className="text-xs text-emerald-600 font-bold mt-0.5">
                            ✓ {localValue} {indicator.unit}
                        </p>
                    )}
                </div>

                <div className="shrink-0 text-stone-400">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {/* Expanded input area */}
            {expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
                    {/* Description */}
                    <div className="flex items-start gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                        <Info size={12} className="mt-0.5 shrink-0 text-stone-400" />
                        <p className="text-[11px] text-stone-500 leading-relaxed">{indicator.description}</p>
                    </div>

                    {/* SDG chips */}
                    {indicator.sdg && indicator.sdg.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {indicator.sdg.map((s) => (
                                <span key={s} className="text-[9px] font-black bg-stone-100 text-stone-500 rounded-full px-2 py-0.5 uppercase tracking-wider">
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div>
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider block mb-1.5">
                            填入數值
                            {indicator.unit && (
                                <span className="ml-2 normal-case font-bold text-stone-400">（單位：{indicator.unit}）</span>
                            )}
                        </label>

                        {indicator.dataType === "boolean" ? (
                            <div className="flex gap-2">
                                {["是", "否"].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setLocalValue(opt)}
                                        className={cn(
                                            "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all",
                                            localValue === opt
                                                ? "bg-stone-800 text-white border-stone-800"
                                                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : indicator.dataType === "multiline" ? (
                            <textarea
                                rows={4}
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                placeholder={indicator.hint || `請填寫${indicator.title}...`}
                                className="w-full px-3 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-stone-400 resize-none bg-white"
                            />
                        ) : (
                            <input
                                type={indicator.dataType === "number" || indicator.dataType === "percentage" ? "number" : "text"}
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                placeholder={indicator.hint || indicator.exampleValue || `請填寫...`}
                                min={indicator.validation.min}
                                max={indicator.validation.max}
                                className="w-full px-3 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-stone-400 bg-white"
                            />
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider block mb-1.5">
                            補充說明（選填）
                        </label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="資料來源、查證機構、備註..."
                            className="w-full px-3 py-2.5 rounded-xl text-sm border border-stone-200 focus:outline-none focus:border-stone-400 bg-white"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!localValue.trim()}
                        className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isFilled ? "✓ 更新" : "儲存填入值"}
                    </button>
                </div>
            )}
        </div>
    );
}
