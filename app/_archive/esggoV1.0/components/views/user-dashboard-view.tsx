"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthSimulationView } from "@/components/views/auth-simulation-view";
import { EsgMetricCard, EsgMetricData } from "@/components/ui/esg-metric-card";
import { DataReviewView } from "@/components/views/data-review-view";
import { ReportExportView } from "@/components/views/report-export-view";
import { LogOut, LayoutDashboard, FileScan, Sparkles, RefreshCw, BarChart3, FileText } from "lucide-react";
import { useAuth } from "@/components/context/auth-context";
import { useListDashboardMetrics, useListOcrReviewItems } from "@dataconnect/generated/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";

// ==========================================
// 全端雙向 TypeScript：定義儀表板狀態型別
// ==========================================
interface UserProfile {
    name: string;
    role: string;
    lastLogin: string;
}

// 模擬歷史趨勢數據
const MOCK_TREND_DATA = [
    { name: "1月", value: 45000 },
    { name: "2月", value: 44200 },
    { name: "3月", value: 43500 },
    { name: "4月", value: 42560 },
];

const MOCK_METRICS: EsgMetricData[] = [
    { id: "m1", title: "年度溫室氣體總排量 (Scope 1+2)", value: 42560, unit: "tCO2e", trend: "down", percentageChange: 5.2 },
    { id: "m2", title: "整體製程水資源回收率", value: 82.4, unit: "%", trend: "up", percentageChange: 2.1 },
    { id: "m3", title: "再生能源使用佔比", value: 35.8, unit: "%", trend: "up", percentageChange: 12.5 }
];

export const UserDashboardView = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<"dashboard" | "data-review" | "export">("dashboard");

    // Fetch metrics from Data Connect
    const { data: fdcMetrics, isLoading: metricsLoading } = useListDashboardMetrics();
    const { data: fdcOcrItems } = useListOcrReviewItems();

    // Map FDC data to EsgMetricData format
    const metrics: EsgMetricData[] = fdcMetrics?.dashboardMetrics?.map(m => ({
        id: m.id,
        title: m.title,
        value: m.value,
        unit: m.unit,
        trend: m.trend as "up" | "down" | "stable",
        percentageChange: m.percentageChange
    })) || (metricsLoading ? [] : MOCK_METRICS); // Fallback to mocks if loading or empty for demo

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stitch-bg text-stitch-text-muted">
                <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    // 如果尚未登入，渲染 AuthSimulationView
    if (!user) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AuthSimulationView onLogin={() => { }} />
            </motion.div>
        );
    }

    // 登入後的使用者儀表板
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-stitch-bg p-6 md:p-10"
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-stitch-border shadow-minimal">
                    <div>
                        <h1 className="text-2xl font-black text-stitch-text tracking-tight">
                            歡迎回來，{user?.displayName || user?.email?.split('@')[0]}
                        </h1>
                        <p className="text-xs font-bold text-stitch-text-muted mt-1 uppercase tracking-widest">
                            Sustainability Manager • 系統連線中
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-stitch-shallow-gray p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${activeTab === "dashboard" ? "bg-white text-stitch-text shadow-sm" : "text-stitch-text-muted hover:text-stitch-text"}`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> 總覽
                            </button>
                            <button
                                onClick={() => setActiveTab("data-review")}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all ${activeTab === "data-review" ? "bg-stitch-text text-white shadow-md scale-105" : "text-stitch-text-muted hover:bg-stitch-bg"}`}
                            >
                                <FileScan className="w-4 h-4" /> OCR 審核
                            </button>
                            <button
                                onClick={() => setActiveTab("export")}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all ${activeTab === "export" ? "bg-stitch-text text-white shadow-md scale-105" : "text-stitch-text-muted hover:bg-stitch-bg"}`}
                            >
                                <FileText className="w-4 h-4" /> 產出報告
                            </button>
                        </div>
                        <button onClick={logout} className="p-2.5 text-stitch-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="登出">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Content Area Based on Active Tab */}
                {activeTab === "dashboard" ? (
                    <div className="space-y-6">
                        {/* Trend Chart Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-2xl border border-stitch-border shadow-minimal"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-stitch-primary" />
                                    <h2 className="text-sm font-black text-stitch-text-muted uppercase tracking-widest">排碳趨勢分析 (Carbon Footprint Trend)</h2>
                                </div>
                                <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    LIVE SYNCED
                                </div>
                            </div>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MOCK_TREND_DATA}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#999' }} dy={10} />
                                        <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 900 }}
                                            cursor={{ stroke: '#1a1a1a', strokeWidth: 1 }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#1a1a1a" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-2 mb-4 pt-4">
                            <Sparkles className="w-5 h-5 text-stitch-primary" />
                            <h2 className="text-sm font-black text-stitch-text-muted uppercase tracking-widest">核心指標摘要 (Core Metrics)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {metrics.map(metric => (
                                <EsgMetricCard key={metric.id} metric={metric} />
                            ))}
                        </div>
                    </div>
                ) : activeTab === "data-review" ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <DataReviewView />
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <ReportExportView
                            metrics={fdcMetrics?.dashboardMetrics || []}
                            evidence={fdcOcrItems?.ocrReviewItems || []}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};