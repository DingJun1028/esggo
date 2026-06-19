"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import {
    TrendingDown,
    TrendingUp,
    Wind,
    Factory,
    Leaf,
    Droplets,
    Zap,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const emissionData = [
    { month: "Jan", emissions: 1240, target: 1300 },
    { month: "Feb", emissions: 1150, target: 1280 },
    { month: "Mar", emissions: 1180, target: 1250 },
    { month: "Apr", emissions: 1100, target: 1200 },
    { month: "May", emissions: 1050, target: 1180 },
    { month: "Jun", emissions: 1020, target: 1150 },
    { month: "Jul", emissions: 980, target: 1100 },
    { month: "Aug", emissions: 950, target: 1080 },
    { month: "Sep", emissions: 920, target: 1050 },
    { month: "Oct", emissions: 900, target: 1000 },
    { month: "Nov", emissions: 850, target: 980 },
    { month: "Dec", emissions: 820, target: 950 },
];

export function KpiDashboardView() {
    const { t, language } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-200px)]">

            <main className="py-2 space-y-8">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 h-40 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-4 w-20 mt-auto" />
                            </div>
                        ))
                    ) : (
                        <>
                            <KpiCard
                                title={language === 'zh' ? '總溫室氣體排放' : 'Total GHG Emissions'}
                                value="12,160"
                                unit="tCO2e"
                                icon={Factory}
                                trend="-8.4%"
                                trendUp={false}
                                trendLabel={language === 'zh' ? '較去年' : 'vs Last Year'}
                                delay={0.1}
                            />
                            <KpiCard
                                title={language === 'zh' ? '能源使用強度 (EUI)' : 'Energy Use Intensity'}
                                value="142.5"
                                unit="kWh/m²"
                                icon={Zap}
                                trend="-3.2%"
                                trendUp={false}
                                trendLabel={language === 'zh' ? '較去年' : 'vs Last Year'}
                                delay={0.2}
                            />
                            <KpiCard
                                title={language === 'zh' ? '減碳目標達成率' : 'Target Goal Reached'}
                                value="92"
                                unit="%"
                                icon={Target}
                                trend="+5.1%"
                                trendUp={true}
                                trendLabel={language === 'zh' ? '較上一季' : 'vs Last Quarter'}
                                delay={0.3}
                            />
                            <KpiCard
                                title={language === 'zh' ? '水資源回收率' : 'Water Recycling Rate'}
                                value="68.4"
                                unit="%"
                                icon={Droplets}
                                trend="+12%"
                                trendUp={true}
                                trendLabel={language === 'zh' ? '較去年' : 'vs Last Year'}
                                delay={0.4}
                            />
                        </>
                    )}
                </div>

                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xl shadow-slate-200/40"
                    aria-label={language === 'zh' ? '溫室氣體排放趨勢圖' : 'GHG Emissions Trend Chart'}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {language === 'zh' ? '溫室氣體排放趨勢 (範疇一與二)' : 'GHG Emissions Trend (Scope 1 & 2)'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                {language === 'zh' ? '每月實際排放 vs 年度設定目標' : 'Monthly Actual vs Annual Targeted Baseline'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-slate-600">{language === 'zh' ? '實際排放' : 'Actual Emissions'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <span className="text-slate-600">{language === 'zh' ? '目標基準線' : 'Target Baseline'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        {isLoading ? (
                            <Skeleton className="w-full h-full rounded-2xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={emissionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                            fontWeight: 'bold'
                                        }}
                                        itemStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="emissions"
                                        name={language === 'zh' ? '實際排放' : 'Actual Emissions'}
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorEmissions)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="target"
                                        name={language === 'zh' ? '目標基準線' : 'Target Baseline'}
                                        stroke="#94a3b8"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        activeDot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Small details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 lg:pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-center"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{language === 'zh' ? '範疇三監控' : 'Scope 3 Monitoring'}</h3>
                        </div>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                            {language === 'zh' ? '系統已透過 OmniSrc 導入供應鏈數據，目前範疇三溫室氣體盤查完成率達 85%，符合年度查證進度。' : 'The system has imported supply chain data via OmniSrc. Scope 3 GHG inventory completion rate has reached 85%, compliant with annual verification schedule.'}
                        </p>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mt-2">
                            <span>0%</span>
                            <span>85% {language === 'zh' ? '已完成' : 'Completed'}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-slate-900 rounded-3xl border border-white/10 p-6 flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <Wind className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{language === 'zh' ? '綠電採購達成' : 'Green Energy Adoption'}</h3>
                        </div>
                        <div className="relative z-10 mb-4">
                            <div className="text-4xl font-black text-white tracking-tighter">42.5<span className="text-xl text-emerald-400 opacity-80">%</span></div>
                            <p className="text-slate-400 font-medium text-sm">
                                {language === 'zh' ? '全行營運綠電使用百分比' : 'Percentage of Green Energy in Operations'}
                            </p>
                        </div>
                        <div className="relative z-10 flex items-center gap-2 mt-auto">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                                {language === 'zh' ? '達標優良' : 'ON TRACK'}
                            </span>
                        </div>
                    </motion.div>
                </div>

            </main>
        </div>
    );
}

function KpiCard({ title, value, unit, icon: Icon, trend, trendUp, trendLabel, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-lg shadow-slate-200/30"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500">{title}</h3>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-700" />
                </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
                <span className="text-sm font-bold text-slate-400">{unit}</span>
            </div>
            <div className="flex items-center gap-2 mt-auto">
                <div className={cn(
                    "flex items-center gap-1 font-bold text-xs px-2 py-1 rounded-md",
                    trendUp ? "bg-emerald-50 text-emerald-600" : "bg-emerald-50 text-emerald-600" // We'll make down-trend green if it's emissions
                )}>
                    {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend}
                </div>
                <span className="text-xs font-bold text-slate-400">{trendLabel}</span>
            </div>
        </motion.div>
    );
}
