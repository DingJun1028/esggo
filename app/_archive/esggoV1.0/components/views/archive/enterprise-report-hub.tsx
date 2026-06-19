/**
 * EnterpriseReportHub
 * 永續報告企業級控制中心。整合標準概覽、數據項管理與審計準備狀態。
 */

"use client";

import { useState, useMemo } from "react";
import {
    Building2,
    FileCheck2,
    LayoutGrid,
    ListFilter,
    Search,
    BarChart3,
    ShieldCheck,
    Download,
    Plus
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ComplianceTable } from "@/components/ui/compliance-table";
import { ComplianceEngine, DisclosureNode } from "@/lib/services/compliance-engine";
import { cn } from "@/lib/utils";

const MOCK_NODES: DisclosureNode[] = [
    { id: "DISC_305_1", standardId: "GRI 305-1", title: "Direct (Scope 1) GHG Emissions", status: "Audited", completion: 100, lastUpdated: Date.now(), evidenceCount: 12 },
    { id: "DISC_305_2", standardId: "GRI 305-2", title: "Energy Indirect (Scope 2) GHG Emissions", status: "Draft", completion: 75, lastUpdated: Date.now(), evidenceCount: 5 },
    { id: "DISC_303_1", standardId: "GRI 303-1", title: "Interactions with Water as a Shared Resource", status: "Empty", completion: 0, lastUpdated: Date.now(), evidenceCount: 0 },
    { id: "DISC_S1_GOV", standardId: "ISSB S1", title: "Governance of Sustainability Risks", status: "Audited", completion: 100, lastUpdated: Date.now(), evidenceCount: 8 },
    { id: "DISC_S401", standardId: "GRI 401-1", title: "New Employee Hires and Turnover", status: "Draft", completion: 40, lastUpdated: Date.now(), evidenceCount: 3 },
];

export function EnterpriseReportHub() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filteredNodes = useMemo(() => {
        return MOCK_NODES.filter(node =>
            node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.standardId.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const coverage = useMemo(() => ComplianceEngine.calculateCoverage(MOCK_NODES), []);

    return (
        <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-2xl">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase">Enterprise Compliance</h1>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">GRI 2024 / ISSB S1 & S2 Regulatory Hub</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-white border border-stone-200 text-sm font-black text-stone-600 hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
                        <Download size={18} /> Export Audit Pack
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-primary-teal-start text-white text-sm font-black shadow-xl hover:shadow-primary-teal-start/20 transition-all flex items-center justify-center gap-2">
                        <Plus size={18} /> Add Disclosure
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-8 border-stone-200/50 flex items-center gap-6 bg-white shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Standard Coverage</div>
                        <div className="text-3xl font-black text-stone-900">{coverage}%</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 border-stone-200/50 flex items-center gap-6 bg-white shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileCheck2 size={32} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Audited Atoms</div>
                        <div className="text-3xl font-black text-stone-900">42 / 128</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 border-stone-200/50 flex items-center gap-6 bg-white shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Regulatory Score</div>
                        <div className="text-3xl font-black text-stone-900">High Reliability</div>
                    </div>
                </GlassCard>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {["All", "Environment", "Social", "Governance"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-black transition-all border",
                                    selectedCategory === cat
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-stone-400 border-stone-200 hover:border-stone-400"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary-teal-start transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search disclosures, standards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal-start/20 focus:border-primary-teal-start transition-all"
                        />
                    </div>
                </div>

                {/* Data Table */}
                <ComplianceTable
                    nodes={filteredNodes}
                    onSelectNode={(id) => console.log("Selecting node:", id)}
                />
            </div>

            {/* Footer Meta */}
            <div className="flex items-center justify-between text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] pt-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" /> Audit Trail Immutable V1.4
                </div>
                <div>Last Synchronized: {new Date().toLocaleTimeString()}</div>
            </div>
        </div>
    );
}

export default EnterpriseReportHub;
