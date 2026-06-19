"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    ArrowRight,
    FileText,
    ShieldCheck,
    ExternalLink,
    Sparkles,
    Zap,
    Info
} from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import { searchEvidence } from "@/app/actions";

export function EvidenceSearchView() {
    const { language, setAssistantPersona, auditRecords } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchInsight, setSearchInsight] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchInsight(null);
        try {
            const response = await searchEvidence(searchQuery, language);
            if (response.success && response.result) {
                setSearchInsight(response.result.insight);

                // Enhanced client-side scoring logic based on keywords from AI and direct search query
                const keywords = response.result.keywords || [];
                const scoredResults = auditRecords.map((record: any) => {
                    let score = 0;
                    const content = `${record.title || ''} ${record.dataType || ''} ${record.standard || ''} ${record.description || ''}`.toLowerCase();
                    const query = searchQuery.toLowerCase();

                    // Direct match
                    if (content.includes(query)) score += 10;

                    // Priority parts match
                    if (record.title?.toLowerCase().includes(query)) score += 5;

                    // AI Keywords match
                    keywords.forEach((kw: string) => {
                        const kwLower = kw.toLowerCase();
                        if (content.includes(kwLower)) score += 3;
                        if (record.title?.toLowerCase().includes(kwLower)) score += 2;
                    });

                    return { ...record, searchScore: score };
                }).filter((r: any) => r.searchScore > 0)
                    .sort((a: any, b: any) => b.searchScore - a.searchScore);

                setSearchResults(scoredResults);

                // Map AI suggested spirit to our internal type
                const spirit = response.result.suggestedSpirit.toLowerCase() as "compliance" | "harmony" | "innovation";
                setAssistantPersona(spirit);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const getLocalizedText = () => {
        return language === 'zh'
            ? {
                title: "ESG Omni-Search",
                subtitle: "智慧搜尋全域證據與合規指標",
                placeholder: "搜尋例如：範疇一排放、供應商查核記錄...",
                insightTitle: "AI 智慧解讀",
                resultsTitle: "搜尋結果",
                noResults: "尚未找到匹配的證據，請嘗試更換關鍵字。",
                standard: "對應標準",
                status: "存證狀態",
                action: "查看詳情"
            }
            : {
                title: "ESG Omni-Search",
                subtitle: "Smart search for global evidence and compliance indicators",
                placeholder: "Search for: Scope 1 emissions, supplier audit records...",
                insightTitle: "AI Insight",
                resultsTitle: "Search Results",
                noResults: "No matching evidence found. Try different keywords.",
                standard: "Standard",
                status: "Status",
                action: "View Details"
            };
    };

    const t = getLocalizedText();

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-4">
            {/* Search Header */}
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    {t.title}
                </h1>
                <p className="text-slate-400">{t.subtitle}</p>
            </div>

            {/* Main Search Bar */}
            <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 text-slate-200 placeholder:text-slate-500 transition-all shadow-xl backdrop-blur-sm"
                />
                <div className="absolute inset-y-2 right-2 flex gap-2">
                    <button
                        type="button"
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isSearching ? <Zap className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </form>

            {/* AI Insight Section */}
            {searchInsight && (
                <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-20 h-20 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h3 className="font-semibold text-emerald-400">{t.insightTitle}</h3>
                        </div>
                        <p className="text-emerald-50/80 leading-relaxed italic">
                            "{searchInsight}"
                        </p>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-sm font-uppercase tracking-wider text-slate-500 font-bold">
                        {t.resultsTitle} {searchResults.length > 0 && `(${searchResults.length})`}
                    </h2>
                </div>

                {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((result, index) => (
                            <div
                                key={result.id}
                                className="group animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-900/40 border border-slate-800/50 hover:border-emerald-500/30 rounded-2xl p-5 hover:bg-slate-900/60 transition-all"
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
                                    </div>
                                    {result.zkpStatus === "verified" && (
                                        <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                            <ShieldCheck className="w-3 h-3" />
                                            ZKP VERIFIED
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-semibold text-slate-200 mb-1 group-hover:text-white transition-colors">{result.title}</h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{result.description || result.dataType}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{t.standard}</span>
                                        <span className="text-xs font-mono text-emerald-400/80">{result.standard || "N/A"}</span>
                                    </div>
                                    <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                                        {t.action} <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchQuery && !isSearching ? (
                    <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                        <Info className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">{t.noResults}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
