"use client";

import React, { useState } from "react";
import {
    UploadCloud,
    CheckCircle2,
    AlertCircle,
    XOctagon,
    FileText,
    Search,
    Bot,
    BellRing,
    ShieldCheck,
    ChevronDown
} from "lucide-react";

/**
 * Omni-Dropzone & X-Ray Gap Matrix
 * 核心視角：將供應鏈與各部門「應交未交」的單據，以「X光」般的矩陣透視呈現。
 */
export default function OmniDropzonePage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // 模擬 X-Ray Matrix 的資料結構 (廠區/部門 x 月份)
    // status: 'uploaded' | 'missing' | 'exempt'
    const matrixData = [
        {
            id: "dept-mfg-kh",
            name: "高雄第一製造廠",
            type: "Scope 1&2",
            months: [
                { month: "1月", req: "電費單, 水費單", status: "uploaded", hash: "0x8F2A...3B1C" },
                { month: "2月", req: "電費單, 水費單", status: "uploaded", hash: "0x9C4B...7E2A" },
                { month: "3月", req: "電費單, 水費單", status: "missing" },
                { month: "4月", req: "冷媒逸散記錄", status: "missing" },
            ]
        },
        {
            id: "dept-hr-tp",
            name: "台北人資總部",
            type: "GRI 400 社會",
            months: [
                { month: "1月", req: "薪資與福利清冊", status: "uploaded", hash: "0x1A2B...3C4D" },
                { month: "2月", req: "教育訓練時數", status: "missing" },
                { month: "3月", req: "勞資會議紀錄", status: "exempt", reason: "依規不需召開" },
                { month: "4月", req: "員工健康檢查報告", status: "missing" },
            ]
        },
        {
            id: "supplier-tw-01",
            name: "[供應商] 宏碁電子",
            type: "Scope 3",
            months: [
                { month: "1月", req: "產品碳足跡聲明", status: "uploaded", hash: "0x5E6F...7G8H" },
                { month: "2月", req: "供應商行為準則簽回", status: "missing" },
                { month: "3月", req: "綠電憑證", status: "missing" },
                { month: "4月", req: "原物料追溯證明", status: "missing" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            {/* 頂部標題與狀態列 */}
            <header className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <UploadCloud className="w-8 h-8 text-[#63a6b0]" />
                        無有遺漏上傳區 & X光缺口矩陣
                    </h1>
                    <p className="text-slate-500 mt-1">Omni-Dropzone & X-Ray Gap Matrix</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#63a6b0]/10 text-[#63a6b0] px-4 py-2 rounded-xl flex items-center gap-2 font-medium">
                        <ShieldCheck className="w-5 h-5" />
                        已防禦 14 筆缺口
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 font-medium">
                        <UploadCloud className="w-5 h-5" />
                        全域上傳 (Omni-Upload)
                    </button>
                </div>
            </header>

            {/* 數據洞察卡片 (Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="整體應收單據" value="156" trend="+12 本月新增" />
                <StatCard title="已上傳 (Aqua 驗證)" value="98" trend="完成率 62%" type="success" />
                <StatCard title="紅色缺口 (Missing)" value="45" trend="需立即催辦" type="danger" />
                <StatCard title="豁免/特殊狀態" value="13" trend="已人工覆核" type="warning" />
            </div>

            {/* X光矩陣主介面 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* 工具列 */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex gap-2">
                        {["all", "missing", "uploaded"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                    : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                {tab === "all" && "全視圖 (Omni-View)"}
                                {tab === "missing" && "僅顯示缺口 (Gaps Only)"}
                                {tab === "uploaded" && "已入庫 (Vaulted)"}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="搜尋部門、廠區或供應商..."
                                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#63a6b0] text-sm md:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 text-sm text-[#63a6b0] bg-[#63a6b0]/10 font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-[#63a6b0]/20 transition-all">
                            <Bot className="w-4 h-4" />
                            Sentient Auto-Chase
                        </button>
                    </div>
                </div>

                {/* 矩陣網格 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 font-semibold text-slate-700 w-64">單位 / 供應商</th>
                                <th className="p-4 font-semibold text-slate-700 min-w-[120px]">Q1 (1月)</th>
                                <th className="p-4 font-semibold text-slate-700 min-w-[120px]">Q1 (2月)</th>
                                <th className="p-4 font-semibold text-slate-700 min-w-[120px]">Q1 (3月)</th>
                                <th className="p-4 font-semibold text-slate-700 min-w-[120px]">Q2 (4月)</th>
                                <th className="p-4 font-semibold text-slate-700 w-32 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matrixData.map((row) => (
                                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{row.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">{row.type}</div>
                                    </td>
                                    {row.months.map((m, idx) => (
                                        <td key={idx} className="p-4">
                                            <MatrixCell data={m} />
                                        </td>
                                    ))}
                                    <td className="p-4 text-center">
                                        <button className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-lg hover:bg-slate-100">
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Stats Card Component
function StatCard({ title, value, trend, type = "default" }: { title: string, value: string, trend: string, type?: "default" | "success" | "danger" | "warning" }) {
    const colors = {
        default: "text-slate-900",
        success: "text-[#63a6b0]",
        danger: "text-rose-600",
        warning: "text-amber-500"
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-sm font-medium text-slate-500 mb-2">{title}</div>
            <div className={`text-3xl font-bold mb-2 ${colors[type]}`}>{value}</div>
            <div className="text-xs font-medium text-slate-400">{trend}</div>
        </div>
    );
}

// Matrix Cell Component (X-Ray Cell)
function MatrixCell({ data }: { data: any }) {
    if (data.status === "uploaded") {
        return (
            <div className="relative group cursor-pointer">
                {/* Solid Aqua block for uploaded */}
                <div className="w-full h-12 bg-[#63a6b0]/10 border border-[#63a6b0]/30 rounded-lg flex items-center justify-center transition-all group-hover:bg-[#63a6b0]/20">
                    <CheckCircle2 className="w-5 h-5 text-[#63a6b0]" />
                </div>
                {/* Hover tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-slate-900 text-white rounded-2xl p-4 z-50 shadow-2xl pointer-events-none border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-aqua/20 rounded-lg text-aqua">
                            <ShieldCheck size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-aqua">Evidence Sealed</span>
                    </div>
                    <div className="font-bold text-xs mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gray-400" /> {data.req}</div>
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-[9px]">
                            <span className="text-gray-500">Hash ID:</span>
                            <span className="font-mono text-aqua-bright">{data.hash}</span>
                        </div>
                        <div className="flex justify-between text-[9px]">
                            <span className="text-gray-500">Golden Thread:</span>
                            <span className="text-emerald-400 font-bold">VERIFIED</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (data.status === "missing") {
        return (
            <div className="relative group cursor-pointer">
                {/* Hollow Red block for missing (X-Ray Gap) */}
                <div className="w-full h-12 border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center bg-rose-50/30 transition-all hover:bg-rose-50 hover:border-rose-300">
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                {/* Hover action card */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-white border border-slate-200 rounded-xl p-2 z-10 shadow-xl flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors">
                        <BellRing className="w-3 h-3" />
                        催辦
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors">
                        <UploadCloud className="w-3 h-3" />
                        上傳
                    </button>
                </div>
            </div>
        );
    }

    if (data.status === "exempt") {
        return (
            <div className="relative group">
                <div className="w-full h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
                    <XOctagon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-slate-800 text-white text-xs rounded-lg p-2 z-10 shadow-xl">
                    {data.reason}
                </div>
            </div>
        );
    }

    return null;
}
