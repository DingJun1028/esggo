"use client";

/**
 * ReportReferencePanel
 * 標竿企業永續報告書 & 範本瀏覽panel
 */

import { useState } from "react";
import { ExternalLink, BookOpen, Star, FileText, ChevronRight, Trophy } from "lucide-react";
import {
    BENCHMARK_REPORTS,
    REPORT_TEMPLATES,
    getUniqueIndustries,
    type BenchmarkReport,
    type ReportTemplate,
    type ReportIndustry,
} from "@/lib/data/esg-report-references";

const TABS = [
    { id: "templates", label: "📋 撰寫範本", icon: FileText },
    { id: "benchmarks", label: "🏆 標竿企業報告書", icon: Trophy },
] as const;

type TabId = typeof TABS[number]["id"];

// ─────────────────────────────────────────────
// Template Card
// ─────────────────────────────────────────────
function TemplateCard({ template }: { template: ReportTemplate }) {
    const [expanded, setExpanded] = useState(false);

    const difficultyColor = {
        "入門": "bg-emerald-100 text-emerald-700",
        "標準": "bg-blue-100 text-blue-700",
        "進階": "bg-violet-100 text-violet-700",
    }[template.difficulty];

    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md transition-all">
            {/* Color stripe */}
            <div className="h-1.5 w-full" style={{ backgroundColor: template.color }} />
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-[10px] font-black rounded-full px-2.5 py-0.5 ${difficultyColor}`}>
                                {template.difficulty}
                            </span>
                            {template.frameworks.map((f) => (
                                <span key={f} className="text-[9px] font-bold bg-stone-100 text-stone-500 rounded-full px-2 py-0.5">
                                    {f}
                                </span>
                            ))}
                        </div>
                        <h3 className="text-sm font-bold text-stone-800">{template.name}</h3>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">{template.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-lg font-black text-stone-700">{(template.wordCountTarget / 1000).toFixed(0)}K</div>
                        <div className="text-[9px] text-stone-400 font-bold">建議字數</div>
                    </div>
                </div>

                {/* Chapter list */}
                <button
                    onClick={() => setExpanded((e) => !e)}
                    className="mt-3 text-[10px] font-bold text-stone-400 hover:text-stone-600 flex items-center gap-1 transition-colors"
                >
                    <span>{expanded ? "▲" : "▼"}</span>
                    {template.chapters.length} 個章節{expanded ? "（收起）" : "（展開）"}
                </button>
                {expanded && (
                    <div className="mt-2 space-y-1">
                        {template.chapters.map((ch, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                                <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-400 text-[9px] font-black flex items-center justify-center shrink-0">
                                    {i + 1}
                                </span>
                                {ch}
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: template.color }}
                >
                    以此範本開始撰寫 →
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Benchmark Report Card
// ─────────────────────────────────────────────
function BenchmarkCard({ report }: { report: BenchmarkReport }) {
    const langMap = { zh: "繁中", en: "英文", bilingual: "雙語" };

    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md transition-all group">
            {/* Color header */}
            <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ backgroundColor: report.thumbnailColor + "15" }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                        style={{ backgroundColor: report.thumbnailColor }}
                    >
                        {report.companyEn?.[0] || report.company[0]}
                    </div>
                    <div>
                        <div className="font-bold text-sm text-stone-800">
                            {report.companyEn || report.company}
                        </div>
                        <div className="text-[10px] text-stone-400 font-bold">{report.company} · {report.year}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {report.isGold && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-600 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Star size={9} fill="currentColor" /> 精選
                        </span>
                    )}
                    {report.rating && (
                        <span className="text-[10px] font-black bg-stone-800 text-white rounded-full px-2 py-0.5">
                            {report.rating}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5">
                {/* Meta */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[9px] font-bold bg-stone-100 text-stone-500 rounded-full px-2 py-0.5">
                        {report.industry}
                    </span>
                    {report.frameworks.map((f) => (
                        <span key={f} className="text-[9px] font-bold bg-stone-50 text-stone-400 rounded-full px-2 py-0.5 border border-stone-100">
                            {f}
                        </span>
                    ))}
                    <span className="text-[9px] font-bold bg-stone-50 text-stone-400 rounded-full px-2 py-0.5 border border-stone-100">
                        {langMap[report.language]}
                    </span>
                    {report.pages && (
                        <span className="text-[9px] font-bold text-stone-400">
                            {report.pages}頁
                        </span>
                    )}
                </div>

                {/* Highlights */}
                <div className="space-y-1.5">
                    {report.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <ChevronRight size={11} className="mt-0.5 shrink-0 text-stone-300" strokeWidth={3} />
                            <p className="text-[11px] text-stone-500 leading-relaxed font-medium">{h}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: report.thumbnailColor }}
                >
                    <BookOpen size={14} />
                    閱讀報告書
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────
export function ReportReferencePanel() {
    const [activeTab, setActiveTab] = useState<TabId>("templates");
    const [selectedIndustry, setSelectedIndustry] = useState<ReportIndustry | "全部">("全部");

    const industries = getUniqueIndustries();
    const filteredReports = selectedIndustry === "全部"
        ? BENCHMARK_REPORTS
        : BENCHMARK_REPORTS.filter((r) => r.industry === selectedIndustry);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h2 className="text-lg font-bold text-stone-800">📚 報告書參考資料庫</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                    精選標竿企業永續報告書與撰寫範本，一鍵開啟原始 PDF，對照學習
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                                ? "bg-white text-stone-800 shadow-sm"
                                : "text-stone-400 hover:text-stone-600"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Templates Tab */}
            {activeTab === "templates" && (
                <div className="space-y-4">
                    {REPORT_TEMPLATES.map((t) => (
                        <TemplateCard key={t.id} template={t} />
                    ))}
                </div>
            )}

            {/* Benchmarks Tab */}
            {activeTab === "benchmarks" && (
                <div className="space-y-4">
                    {/* Industry Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedIndustry("全部")}
                            className={`text-[10px] font-bold rounded-full px-3 py-1 border transition-all ${selectedIndustry === "全部"
                                    ? "bg-stone-800 text-white border-stone-800"
                                    : "text-stone-500 border-stone-200 hover:border-stone-400"
                                }`}
                        >
                            全部
                        </button>
                        {industries.map((ind) => (
                            <button
                                key={ind}
                                onClick={() => setSelectedIndustry(ind)}
                                className={`text-[10px] font-bold rounded-full px-3 py-1 border transition-all ${selectedIndustry === ind
                                        ? "bg-stone-800 text-white border-stone-800"
                                        : "text-stone-500 border-stone-200 hover:border-stone-400"
                                    }`}
                            >
                                {ind}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredReports.map((r) => (
                            <BenchmarkCard key={r.id} report={r} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
