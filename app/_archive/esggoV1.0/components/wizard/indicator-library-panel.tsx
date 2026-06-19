"use client";

/**
 * IndicatorLibraryPanel — Full indicator browser
 * Filters by E/S/G/D category and subcategory.
 * Uses the typed useEsgIndicators hook for all data fetching.
 */

import { useState } from "react";
import { Loader2, Search, Filter } from "lucide-react";
import type { ESGCategory } from "@/lib/types/atomic-esg-types";
import { useEsgIndicators, useIndicatorValues } from "@/hooks/use-esg-indicators";
import { AtomicIndicatorCard } from "./atomic-indicator-card";

const CATEGORY_TABS: { id: ESGCategory; label: string; emoji: string }[] = [
    { id: "E", label: "環境", emoji: "🌿" },
    { id: "S", label: "社會", emoji: "🤝" },
    { id: "G", label: "治理", emoji: "⚖️" },
    { id: "D", label: "數位", emoji: "💡" },
];

export function IndicatorLibraryPanel() {
    const [activeCategory, setActiveCategory] = useState<ESGCategory>("E");
    const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>();
    const [search, setSearch] = useState("");

    const { indicators, subcategories, isLoading, error, byCategory } = useEsgIndicators({
        category: activeCategory,
        ...(activeSubcategory !== undefined ? { subcategory: activeSubcategory } : {}),
    });
    const { getValue, setValue, getFilledCount } = useIndicatorValues();

    const filtered = search.trim()
        ? indicators.filter(
            (i) =>
                i.title.includes(search) ||
                i.id.toLowerCase().includes(search.toLowerCase()) ||
                i.description.includes(search)
        )
        : indicators;

    const filledCount = getFilledCount(indicators.map((i) => i.id));

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-100 overflow-hidden">
            {/* Category Tabs */}
            <div className="flex border-b border-stone-100 bg-stone-50/50 px-4 pt-3 pb-0 gap-1">
                {CATEGORY_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveCategory(tab.id);
                            setActiveSubcategory(undefined);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold border border-b-0 transition-all ${activeCategory === tab.id
                            ? "bg-white border-stone-200 text-stone-800 shadow-sm"
                            : "bg-transparent border-transparent text-stone-400 hover:text-stone-600"
                            }`}
                    >
                        <span>{tab.emoji}</span>
                        <span>{tab.label}</span>
                        {byCategory && (
                            <span className={`text-[9px] rounded-full px-1.5 font-black ${activeCategory === tab.id ? "bg-stone-100 text-stone-500" : "text-stone-300"
                                }`}>
                                {byCategory[tab.id]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Subcategory Filter + Search */}
            <div className="px-4 py-3 border-b border-stone-100 space-y-2">
                {subcategories && subcategories[activeCategory]?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => setActiveSubcategory(undefined)}
                            className={`text-[10px] font-bold rounded-full px-2.5 py-1 border transition-all ${!activeSubcategory
                                ? "bg-stone-800 text-white border-stone-800"
                                : "text-stone-500 border-stone-200 hover:border-stone-400"
                                }`}
                        >
                            全部
                        </button>
                        {subcategories[activeCategory].map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setActiveSubcategory(sub === activeSubcategory ? undefined : sub)}
                                className={`text-[10px] font-bold rounded-full px-2.5 py-1 border transition-all ${activeSubcategory === sub
                                    ? "bg-stone-800 text-white border-stone-800"
                                    : "text-stone-500 border-stone-200 hover:border-stone-400"
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="搜尋指標名稱或 GRI 代碼..."
                        className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-stone-200 focus:outline-none focus:border-stone-400 bg-stone-50"
                    />
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-bold">
                        已填入 {filledCount} / {indicators.length} 項指標
                    </span>
                    <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${indicators.length ? (filledCount / indicators.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading && (
                    <div className="flex items-center justify-center py-12 text-stone-400 gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm font-bold">載入指標庫...</span>
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-sm text-rose-500 font-bold">
                        載入失敗：{error}
                    </div>
                )}
                {!isLoading && !error && filtered.length === 0 && (
                    <div className="text-center py-12 text-stone-400">
                        <Filter size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-bold">找不到符合條件的指標</p>
                    </div>
                )}
                {!isLoading &&
                    filtered.map((indicator) => {
                        const savedValue = getValue(indicator.id);
                        return (
                            <AtomicIndicatorCard
                                key={indicator.id}
                                indicator={indicator}
                                {...(savedValue !== undefined ? { value: savedValue } : {})}
                                onSave={setValue}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
