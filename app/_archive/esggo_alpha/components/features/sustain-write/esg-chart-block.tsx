"use client";

import {
    useRef, useState, useMemo, useCallback, useId, useEffect,
} from "react";
import {
    ResponsiveContainer,
    BarChart, Bar,
    LineChart, Line,
    AreaChart, Area,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    Brush, ReferenceLine,
    type TooltipProps,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import {
    BarChart3, LineChart as LineIcon, PieChart as PieIcon, Activity,
    Download, ImageDown, Filter, X, ChevronDown, Plus, Trash2,
    ZoomIn, ZoomOut, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChartType = "bar" | "line" | "area" | "pie" | "radar";

export interface ChartMetric {
    key: string;
    label: string;
    color: string;
    unit?: string;
}

export interface ChartPreset {
    id: string;
    titleZh: string;
    type: ChartType;
    unit: string;
    metrics: ChartMetric[];
    data: Record<string, string | number>[];
    targetLine?: number;
    targetLabel?: string;
}

export interface ChartConfig {
    presetId: string;
    activeMetrics: string[];   // keys of enabled metrics
    chartType: ChartType;
}

// ─── Chart Presets ────────────────────────────────────────────────────────────

export const CHART_PRESETS: ChartPreset[] = [
    {
        id: "ghg_overview",
        titleZh: "溫室氣體排放概覽",
        type: "bar",
        unit: "公噸 CO₂e",
        metrics: [
            { key: "scope1", label: "範疇一 (直接)", color: "#065f46" },
            { key: "scope2", label: "範疇二 (間接)", color: "#059669" },
            { key: "scope3", label: "範疇三 (供應鏈)", color: "#34d399" },
        ],
        data: [
            { label: "2021", scope1: 142, scope2: 428, scope3: 1120 },
            { label: "2022", scope1: 136, scope2: 412, scope3: 1089 },
            { label: "2023", scope1: 125, scope2: 390, scope3: 980 },
            { label: "2024", scope1: 118, scope2: 374, scope3: 872 },
            { label: "2025", scope1: 110, scope2: 352, scope3: 798 },
        ],
        targetLine: 800,
        targetLabel: "2026 目標",
    },
    {
        id: "energy_trend",
        titleZh: "能源使用趨勢",
        type: "area",
        unit: "MWh",
        metrics: [
            { key: "renewable", label: "再生能源", color: "#10b981" },
            { key: "nonRenewable", label: "非再生能源", color: "#f59e0b" },
        ],
        data: [
            { label: "1月", renewable: 320, nonRenewable: 980 },
            { label: "2月", renewable: 380, nonRenewable: 940 },
            { label: "3月", renewable: 420, nonRenewable: 900 },
            { label: "4月", renewable: 460, nonRenewable: 860 },
            { label: "5月", renewable: 510, nonRenewable: 820 },
            { label: "6月", renewable: 560, nonRenewable: 790 },
            { label: "7月", renewable: 600, nonRenewable: 760 },
            { label: "8月", renewable: 640, nonRenewable: 730 },
            { label: "9月", renewable: 680, nonRenewable: 700 },
            { label: "10月", renewable: 720, nonRenewable: 670 },
            { label: "11月", renewable: 760, nonRenewable: 640 },
            { label: "12月", renewable: 810, nonRenewable: 610 },
        ],
    },
    {
        id: "water_usage",
        titleZh: "水資源消耗",
        type: "line",
        unit: "千公升",
        metrics: [
            { key: "consumed", label: "實際消耗", color: "#3b82f6" },
            { key: "recycled", label: "回收再利用", color: "#06b6d4" },
        ],
        data: [
            { label: "Q1 2023", consumed: 1240, recycled: 320 },
            { label: "Q2 2023", consumed: 1180, recycled: 360 },
            { label: "Q3 2023", consumed: 1310, recycled: 400 },
            { label: "Q4 2023", consumed: 1100, recycled: 440 },
            { label: "Q1 2024", consumed: 1050, recycled: 490 },
            { label: "Q2 2024", consumed: 980, recycled: 530 },
            { label: "Q3 2024", consumed: 1020, recycled: 580 },
            { label: "Q4 2024", consumed: 940, recycled: 620 },
        ],
        targetLine: 900,
        targetLabel: "耗水目標",
    },
    {
        id: "social_kpi",
        titleZh: "社會 KPI 雷達",
        type: "radar",
        unit: "分 / 100",
        metrics: [
            { key: "score", label: "ESG 評分", color: "#8b5cf6" },
        ],
        data: [
            { label: "多元共融", score: 82 },
            { label: "員工培訓", score: 91 },
            { label: "安全健康", score: 88 },
            { label: "社區投資", score: 76 },
            { label: "供應商稽核", score: 85 },
            { label: "薪酬公平", score: 79 },
        ],
    },
    {
        id: "scope_distribution",
        titleZh: "排放源結構分析",
        type: "pie",
        unit: "%",
        metrics: [
            { key: "scope1", label: "範疇一", color: "#065f46" },
            { key: "scope2", label: "範疇二", color: "#059669" },
            { key: "scope3", label: "範疇三", color: "#34d399" },
        ],
        data: [
            { label: "範疇一", value: 8.7 },
            { label: "範疇二", value: 27.5 },
            { label: "範疇三", value: 63.8 },
        ],
    },
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, unit }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 text-white rounded-xl shadow-2xl px-4 py-3 min-w-[140px] pointer-events-none">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey as string} className="flex items-center justify-between gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                        {p.name}
                    </span>
                    <span className="text-white font-black">{(p.value as number).toLocaleString()} <span className="text-slate-400 font-medium text-[9px]">{unit}</span></span>
                </div>
            ))}
        </div>
    );
}

// ─── Chart Type Icons ─────────────────────────────────────────────────────────
const CHART_TYPE_OPTIONS: { type: ChartType; Icon: any; label: string }[] = [
    { type: "bar", Icon: BarChart3, label: "柱狀圖" },
    { type: "line", Icon: LineIcon, label: "折線圖" },
    { type: "area", Icon: Activity, label: "面積圖" },
    { type: "pie", Icon: PieIcon, label: "圓餅圖" },
];

// ─── SVG / PNG Download ───────────────────────────────────────────────────────
function downloadSvg(containerRef: React.RefObject<HTMLDivElement | null>, filename: string) {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob([clone.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.svg`; a.click();
    URL.revokeObjectURL(url);
}

function downloadPng(containerRef: React.RefObject<HTMLDivElement | null>, filename: string) {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    const bbox = svg.getBoundingClientRect();
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = bbox.width * 2;
        canvas.height = bbox.height * 2;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(2, 2);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, bbox.width, bbox.height);
        ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(blob => {
            if (!blob) return;
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = pngUrl; a.download = `${filename}.png`; a.click();
            URL.revokeObjectURL(pngUrl);
        }, "image/png");
    };
    img.src = url;
}

// ─── Chart Renderer ───────────────────────────────────────────────────────────
function ChartRenderer({ preset, config, height }: {
    preset: ChartPreset;
    config: ChartConfig;
    height: number;
}) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const activeMetrics = preset.metrics.filter(m => config.activeMetrics.includes(m.key));
    const unit = preset.unit;

    const tooltipNode = (props: any) => <CustomTooltip {...props} unit={unit} />;

    if (!isMounted) {
        return <div style={{ width: "100%", height }} className="bg-slate-50/50 rounded-xl animate-pulse flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-slate-200" />
        </div>;
    }

    const commonProps = {
        data: preset.data,
        margin: { top: 8, right: 20, left: 0, bottom: 0 },
    };

    const axisProps = {
        tick: { fontSize: 10, fontWeight: 700, fill: "#64748b" },
        axisLine: { stroke: "#e2e8f0" },
        tickLine: false,
    };

    // Pie/Donut ignores chartType toggle
    if (config.chartType === "pie" || preset.type === "pie") {
        const pieData = preset.data.map((d, i) => ({
            name: d.label as string,
            value: d.value as number,
            color: preset.metrics[i % preset.metrics.length]?.color ?? "#64748b",
        }));
        return (
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={height / 2 - 30}
                        innerRadius={height / 4 - 10}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={{ stroke: "#94a3b8" }}
                    >
                        {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip
                        content={<CustomTooltip unit={unit} />}
                        cursor={{ fill: "transparent" }}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{v}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    // Radar
    if (config.chartType === "radar" || preset.type === "radar") {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <RadarChart data={preset.data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid gridType="polygon" stroke="#e2e8f0" />
                    <PolarAngleAxis
                        dataKey="label"
                        tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                    />
                    {activeMetrics.map(m => (
                        <Radar
                            key={m.key}
                            name={m.label}
                            dataKey={m.key}
                            stroke={m.color}
                            fill={m.color}
                            fillOpacity={0.18}
                            strokeWidth={2}
                        />
                    ))}
                    <Tooltip content={tooltipNode} />
                    <Legend
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{v}</span>}
                    />
                </RadarChart>
            </ResponsiveContainer>
        );
    }

    // Bar
    if (config.chartType === "bar") {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" {...axisProps} />
                    <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                    <Tooltip content={tooltipNode} cursor={{ fill: "#f8fafc" }} />
                    <Legend iconSize={8} formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{v}</span>} />
                    {preset.targetLine !== undefined && (
                        <ReferenceLine y={preset.targetLine} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1.5}
                            label={{ value: preset.targetLabel, position: "right", fontSize: 9, fontWeight: 700, fill: "#ef4444" }} />
                    )}
                    {activeMetrics.map(m => (
                        <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} radius={[3, 3, 0, 0]} maxBarSize={36} />
                    ))}
                    <Brush dataKey="label" height={22} travellerWidth={8}
                        fill="#f8fafc" stroke="#e2e8f0"
                    />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    // Line
    if (config.chartType === "line") {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <LineChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" {...axisProps} />
                    <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                    <Tooltip content={tooltipNode} />
                    <Legend iconSize={8} formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{v}</span>} />
                    {preset.targetLine !== undefined && (
                        <ReferenceLine y={preset.targetLine} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1.5}
                            label={{ value: preset.targetLabel, position: "right", fontSize: 9, fontWeight: 700, fill: "#ef4444" }} />
                    )}
                    {activeMetrics.map(m => (
                        <Line key={m.key} dataKey={m.key} name={m.label} stroke={m.color} strokeWidth={2.5}
                            dot={{ r: 3, fill: m.color, strokeWidth: 0 }}
                            activeDot={{ r: 5, strokeWidth: 0 }} type="monotone" />
                    ))}
                    <Brush dataKey="label" height={22} travellerWidth={8}
                        fill="#f8fafc" stroke="#e2e8f0" />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    // Area (default)
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
                <defs>
                    {activeMetrics.map(m => (
                        <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={m.color} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={m.color} stopOpacity={0.03} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                <Tooltip content={tooltipNode} />
                <Legend iconSize={8} formatter={(v) => <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{v}</span>} />
                {activeMetrics.map(m => (
                    <Area key={m.key} dataKey={m.key} name={m.label} stroke={m.color} strokeWidth={2.5}
                        fill={`url(#grad-${m.key})`} type="monotone" />
                ))}
                <Brush dataKey="label" height={22} travellerWidth={8}
                    fill="#f8fafc" stroke="#e2e8f0" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface EsgChartBlockProps {
    initialConfig?: ChartConfig;
    onRemove?: () => void;
    primaryColor?: string;
    accentColor?: string;
}

export function EsgChartBlock({
    initialConfig,
    onRemove,
    primaryColor = "#065f46",
    accentColor = "#10b981",
}: EsgChartBlockProps) {
    const uid = useId();
    const chartRef = useRef<HTMLDivElement>(null);

    const defaultPreset = CHART_PRESETS[0];
    const [selectedPresetId, setSelectedPresetId] = useState(initialConfig?.presetId ?? defaultPreset.id);
    const [showPresetMenu, setShowPresetMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [chartHeight, setChartHeight] = useState(300);
    const [zoomLevel, setZoomLevel] = useState(1);

    const preset = useMemo(() => CHART_PRESETS.find(p => p.id === selectedPresetId) ?? defaultPreset, [selectedPresetId]);

    const [activeMetrics, setActiveMetrics] = useState<string[]>(
        initialConfig?.activeMetrics ?? preset.metrics.map(m => m.key)
    );
    const [chartType, setChartType] = useState<ChartType>(initialConfig?.chartType ?? preset.type);

    // Reset metrics when preset changes
    const handleSelectPreset = useCallback((id: string) => {
        const p = CHART_PRESETS.find(x => x.id === id);
        if (!p) return;
        setSelectedPresetId(id);
        setActiveMetrics(p.metrics.map(m => m.key));
        setChartType(p.type);
        setShowPresetMenu(false);
    }, []);

    const toggleMetric = useCallback((key: string) => {
        setActiveMetrics(prev =>
            prev.includes(key)
                ? prev.length > 1 ? prev.filter(k => k !== key) : prev   // keep at least 1
                : [...prev, key]
        );
    }, []);

    const config: ChartConfig = useMemo(() => ({
        presetId: selectedPresetId,
        activeMetrics,
        chartType,
    }), [selectedPresetId, activeMetrics, chartType]);

    const isPieOrRadar = chartType === "pie" || chartType === "radar" || preset.type === "pie" || preset.type === "radar";
    const availableTypeOptions = isPieOrRadar
        ? CHART_TYPE_OPTIONS.filter(o => o.type === preset.type)
        : CHART_TYPE_OPTIONS.filter(o => o.type !== "pie" && o.type !== "radar");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/60 overflow-hidden"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
        >
            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-50 bg-slate-50/60">
                {/* Preset Selector */}
                <div className="relative">
                    <button
                        onClick={() => { setShowPresetMenu(v => !v); setShowFilterMenu(false); }}
                        className="flex items-center gap-2 h-8 px-3 rounded-xl bg-white border border-slate-100 text-xs font-black text-slate-700 hover:border-slate-200 shadow-sm transition-all"
                    >
                        <BarChart3 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        {preset.titleZh}
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    <AnimatePresence>
                        {showPresetMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                className="absolute top-10 left-0 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 p-2 min-w-[200px]"
                            >
                                {CHART_PRESETS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSelectPreset(p.id)}
                                        className={cn(
                                            "flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                                            p.id === selectedPresetId
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {p.titleZh}
                                        <span className="ml-auto text-[9px] font-black opacity-50 uppercase">{p.type}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Chart Type Toggle (not for pie/radar) */}
                    {!isPieOrRadar && (
                        <div className="flex items-center gap-0.5 p-0.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                            {availableTypeOptions.map(({ type, Icon, label }) => (
                                <button
                                    key={type}
                                    onClick={() => setChartType(type)}
                                    title={label}
                                    className={cn(
                                        "p-1.5 rounded-lg transition-all",
                                        chartType === type ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Metric Filter */}
                    {preset.metrics.length > 1 && (
                        <div className="relative">
                            <button
                                onClick={() => { setShowFilterMenu(v => !v); setShowPresetMenu(false); }}
                                className={cn(
                                    "flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-black border transition-all",
                                    showFilterMenu
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-600 border-slate-100 hover:border-slate-200 shadow-sm"
                                )}
                            >
                                <Filter className="w-3 h-3" />
                                篩選
                                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-black flex items-center justify-center">
                                    {activeMetrics.length}
                                </span>
                            </button>
                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                        className="absolute top-10 right-0 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl p-3 min-w-[180px]"
                                    >
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">顯示指標</div>
                                        {preset.metrics.map(m => {
                                            const isOn = activeMetrics.includes(m.key);
                                            return (
                                                <button
                                                    key={m.key}
                                                    onClick={() => toggleMetric(m.key)}
                                                    className={cn(
                                                        "flex items-center gap-2.5 w-full px-2 py-2 rounded-xl text-xs font-bold transition-all",
                                                        isOn ? "text-slate-800" : "text-slate-300 line-through"
                                                    )}
                                                >
                                                    <span className={cn("w-3 h-3 rounded-full transition-opacity", !isOn && "opacity-30")}
                                                        style={{ background: m.color }} />
                                                    {m.label}
                                                    {isOn && <span className="ml-auto text-slate-300">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Zoom */}
                    <div className="flex items-center gap-0.5 p-0.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.5))} title="放大"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setZoomLevel(1)} title="重置"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
                            <RotateCcw className="w-3 h-3" />
                        </button>
                        <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.6))} title="縮小"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Downloads */}
                    <button
                        onClick={() => downloadSvg(chartRef, `${preset.titleZh}`)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white border border-slate-100 text-xs font-black text-slate-600 hover:border-slate-200 shadow-sm transition-all"
                        title="下載 SVG"
                    >
                        <Download className="w-3.5 h-3.5" />
                        SVG
                    </button>
                    <button
                        onClick={() => downloadPng(chartRef, `${preset.titleZh}`)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-black shadow-sm transition-all"
                        title="下載 PNG"
                    >
                        <ImageDown className="w-3.5 h-3.5" />
                        PNG
                    </button>

                    {/* Height control */}
                    <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">高度</span>
                        <select
                            value={chartHeight}
                            onChange={e => setChartHeight(Number(e.target.value))}
                            className="h-8 text-xs font-black text-slate-700 bg-white border border-slate-100 rounded-xl px-2 cursor-pointer shadow-sm"
                        >
                            {[220, 280, 340, 420, 500].map(h => (
                                <option key={h} value={h}>{h}px</option>
                            ))}
                        </select>
                    </div>

                    {/* Remove */}
                    {onRemove && (
                        <button onClick={onRemove}
                            className="p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                            title="移除圖表"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Chart Body ── */}
            <div ref={chartRef} className="p-4 bg-white">
                {/* Unit Badge */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {preset.titleZh}
                    </div>
                    <div className="text-[9px] font-bold text-slate-300 uppercase">
                        單位：{preset.unit}
                    </div>
                </div>

                {/* Metric Filter Pills (visible inline too) */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {preset.metrics.map(m => {
                        const isOn = activeMetrics.includes(m.key);
                        return (
                            <button
                                key={m.key}
                                onClick={() => toggleMetric(m.key)}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all",
                                    isOn
                                        ? "border-transparent text-white"
                                        : "border-slate-100 text-slate-300 bg-white"
                                )}
                                style={isOn ? { background: m.color } : {}}
                            >
                                {m.label}
                            </button>
                        );
                    })}
                </div>

                {/* Chart */}
                <ChartRenderer preset={preset} config={config} height={chartHeight} />

                {/* Brush hint */}
                {!isPieOrRadar && (
                    <p className="text-[9px] text-slate-300 font-bold text-center mt-2 uppercase tracking-widest">
                        拖曳底部滑軌以縮放時間範圍
                    </p>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-2.5 bg-slate-50/60 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    ESG GO · 5T 存證數據 · {new Date().getFullYear()}
                </span>
                <span className="text-[9px] font-bold text-slate-300">
                    {activeMetrics.length}/{preset.metrics.length} 指標顯示中
                </span>
            </div>
        </motion.div>
    );
}

// ─── Chart Selector (inline add button) ──────────────────────────────────────

interface ChartSelectorProps {
    onAdd: (presetId: string) => void;
    primaryColor?: string;
}

export function ChartSelector({ onAdd, primaryColor = "#065f46" }: ChartSelectorProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl border border-dashed border-slate-200 text-xs font-black text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all bg-white"
            >
                <Plus className="w-3.5 h-3.5" />
                插入圖表
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        className="absolute bottom-11 left-0 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 min-w-[220px]"
                    >
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">選擇圖表類型</div>
                        {CHART_PRESETS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => { onAdd(p.id); setOpen(false); }}
                                className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <span className="w-2 h-2 rounded-full" style={{ background: p.metrics[0]?.color }} />
                                {p.titleZh}
                                <span className="ml-auto text-[9px] text-slate-300 font-black uppercase">{p.type}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
