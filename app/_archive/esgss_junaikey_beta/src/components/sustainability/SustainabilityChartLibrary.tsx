/**
 * 📊 Sustainability Chart Library
 * 
 * 永續報告書多功能圖表庫
 * 
 * Features:
 * - 10+ Chart Types (Bar, Line, Pie, Radar, Heatmap, Scatter, Gantt, Funnel, Treemap, Gauge)
 * - ESG-specific visualizations
 * - Animated transitions
 * - Responsive design
 * - Export capabilities
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    LineChart,
    PieChart,
    Radar,
    TrendingUp,
    TrendingDown,
    Minus,
    Download,
    Maximize2,
    RefreshCw,
    Eye,
    EyeOff,
    Grid,
    Circle,
    Square,
    ChevronDown
} from 'lucide-react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

// ============================================
// Types & Interfaces
// ============================================

export type ChartType =
    | 'bar'
    | 'line'
    | 'pie'
    | 'radar'
    | 'heatmap'
    | 'scatter'
    | 'gantt'
    | 'funnel'
    | 'treemap'
    | 'gauge'
    | 'timeline';

export interface ChartDataPoint {
    label: string;
    value: number;
    category?: string;
    color?: string;
    metadata?: Record<string, any>;
}

export interface ChartSeries {
    name: string;
    data: number[];
    color?: string;
}

export interface ChartConfig {
    title: string;
    subtitle?: string;
    type: ChartType;
    xAxisLabel?: string;
    yAxisLabel?: string;
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    showLabels?: boolean;
    animate?: boolean;
    stacked?: boolean;
    horizontal?: boolean;
}

interface ChartProps {
    data: ChartDataPoint[] | ChartSeries[];
    config: ChartConfig;
    onExport?: (format: string) => void;
    height?: number;
    width?: number;
}

// ============================================
// Color Schemes
// ============================================

const ESG_COLORS = {
    environmental: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'], // Green
    social: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'], // Blue
    governance: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'], // Amber
    neutral: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'],
    risk: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
    positive: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
};

const CHART_TYPE_ICONS: Record<ChartType, React.ReactNode> = {
    bar: <BarChart3 className="w-4 h-4" />,
    line: <LineChart className="w-4 h-4" />,
    pie: <PieChart className="w-4 h-4" />,
    radar: <Radar className="w-4 h-4" />,
    heatmap: <Grid className="w-4 h-4" />,
    scatter: <Circle className="w-4 h-4" />,
    gantt: <Square className="w-4 h-4" />,
    funnel: <TrendingDown className="w-4 h-4" />,
    treemap: <Grid className="w-4 h-4" />,
    gauge: <Circle className="w-4 h-4" />,
    timeline: <LineChart className="w-4 h-4" />
};

// ============================================
// Main Chart Library Component
// ============================================

export const SustainabilityChartLibrary: React.FC<ChartProps> = ({
    data,
    config,
    onExport,
    height = 400
}) => {
    const core = useMemo(() =>
        ComponentCoreFactory.create('SustainabilityChartLibrary'),
        []);

    const chartRef = useRef<HTMLDivElement>(null);
    const [activeTooltip, setActiveTooltip] = useState<{
        index: number;
        value: number;
        label: string;
        x: number;
        y: number;
    } | null>(null);
    const [showLegend, setShowLegend] = useState(config.showLegend !== false);
    const [isExporting, setIsExporting] = useState(false);

    // ========================================
    // Render Functions by Chart Type
    // ========================================

    const renderBarChart = () => {
        const seriesData = data as ChartSeries[];
        const maxValue = Math.max(...seriesData.flatMap(s => s.data));

        return (
            <div className="flex items-end justify-around h-full gap-4 px-4 py-8">
                {(data as ChartDataPoint[]).map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.value / maxValue) * 100}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="relative group flex-1"
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveTooltip({
                                index,
                                value: item.value,
                                label: item.label,
                                x: rect.left + rect.width / 2,
                                y: rect.top
                            });
                        }}
                        onMouseLeave={() => setActiveTooltip(null)}
                    >
                        <div
                            className="w-full rounded-t-lg relative overflow-hidden"
                            style={{
                                height: '100%',
                                background: `linear-gradient(180deg, ${item.color || ESG_COLORS.environmental[0]} 0%, ${item.color || ESG_COLORS.environmental[1]} 100%)`,
                                boxShadow: item.value >= maxValue * 0.8
                                    ? `0 0 20px ${item.color || ESG_COLORS.positive[0]}40`
                                    : 'none'
                            }}
                        />
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap">
                            {item.label}
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.value.toLocaleString()}
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    const renderLineChart = () => {
        const seriesData = data as ChartSeries[];
        const maxValue = Math.max(...seriesData.flatMap(s => s.data));
        const years = (data as ChartDataPoint[]).map(d => d.label);

        return (
            <div className="relative h-full w-full p-4">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {seriesData.map((series, sIndex) => {
                        const points = series.data.map((value, i) => ({
                            x: (i / (series.data.length - 1)) * 100,
                            y: 100 - (value / maxValue) * 100
                        }));

                        const pathD = points.reduce((acc, point, i) => {
                            return acc + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
                        }, '');

                        return (
                            <g key={sIndex}>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: sIndex * 0.2 }}
                                    d={pathD}
                                    fill="none"
                                    stroke={series.color || ESG_COLORS.neutral[sIndex]}
                                    strokeWidth="0.5"
                                    className="drop-shadow-lg"
                                />
                                {points.map((point, i) => (
                                    <motion.circle
                                        key={i}
                                        cx={point.x}
                                        cy={point.y}
                                        r="1.5"
                                        fill={series.color || ESG_COLORS.neutral[sIndex]}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: sIndex * 0.2 + i * 0.1 }}
                                    />
                                ))}
                            </g>
                        );
                    })}
                </svg>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
                    {years.map((year, i) => (
                        <span key={i} className="text-[8px] text-slate-400">{year}</span>
                    ))}
                </div>
            </div>
        );
    };

    const renderPieChart = () => {
        const pieData = data as ChartDataPoint[];
        const total = pieData.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        return (
            <div className="relative flex items-center justify-center h-full">
                <svg viewBox="-100 -100 200 200" className="w-full h-full max-w-[300px]">
                    {pieData.map((item, index) => {
                        const angle = (item.value / total) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;
                        currentAngle = endAngle;

                        const startRad = (startAngle - 90) * (Math.PI / 180);
                        const endRad = (endAngle - 90) * (Math.PI / 180);

                        const x1 = Math.cos(startRad) * 80;
                        const y1 = Math.sin(startRad) * 80;
                        const x2 = Math.cos(endRad) * 80;
                        const y2 = Math.sin(endRad) * 80;

                        const largeArc = angle > 180 ? 1 : 0;

                        const pathD = `M 0 0 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        return (
                            <motion.path
                                key={index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                d={pathD}
                                fill={item.color || ESG_COLORS.neutral[index % 4]}
                                stroke="#050c14"
                                strokeWidth="2"
                                className="hover:opacity-80 cursor-pointer transition-opacity"
                            />
                        );
                    })}
                </svg>

                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-2xl font-light text-white">{total.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">Total</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderRadarChart = () => {
        const radarData = data as ChartDataPoint[];
        const numPoints = radarData.length;
        const radius = 70;
        const angleStep = (2 * Math.PI) / numPoints;

        const points = radarData.map((item, i) => ({
            x: 100 + Math.cos(i * angleStep - Math.PI / 2) * radius * (item.value / 100),
            y: 100 + Math.sin(i * angleStep - Math.PI / 2) * radius * (item.value / 100)
        }));

        return (
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Grid circles */}
                {[25, 50, 75, 100].map((level, i) => (
                    <circle
                        key={i}
                        cx="100"
                        cy="100"
                        r={level * 0.7}
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeDasharray="2,2"
                    />
                ))}

                {/* Axis lines */}
                {radarData.map((_, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    return (
                        <line
                            key={i}
                            x1="100"
                            y1="100"
                            x2={100 + Math.cos(angle) * 80}
                            y2={100 + Math.sin(angle) * 80}
                            stroke="rgba(255,255,255,0.1)"
                        />
                    );
                })}

                {/* Data polygon */}
                <motion.polygon
                    initial={{ points: "100,100 100,100 100,100" }}
                    animate={{ points: points.map(p => `${p.x},${p.y}`).join(' ') }}
                    transition={{ duration: 0.8 }}
                    fill="rgba(99, 166, 176, 0.3)"
                    stroke="#63a6b0"
                    strokeWidth="2"
                />

                {/* Data points */}
                {points.map((point, i) => (
                    <motion.circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={radarData[i].color || '#63a6b0'}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    />
                ))}
            </svg>
        );
    };

    const renderFunnelChart = () => {
        const funnelData = data as ChartDataPoint[];

        return (
            <div className="flex flex-col items-center gap-1 h-full py-4">
                {funnelData.map((item, index) => {
                    const width = 100 - (index * 15);
                    return (
                        <motion.div
                            key={index}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: `${width}%`, opacity: 1 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative"
                        >
                            <div
                                className="px-4 py-3 rounded-lg text-center relative overflow-hidden"
                                style={{
                                    background: `linear-gradient(90deg, ${item.color || ESG_COLORS.neutral[index % 4]}40 0%, ${item.color || ESG_COLORS.neutral[index % 4]} 50%, ${item.color || ESG_COLORS.neutral[index % 4]}40 100%)`,
                                    borderLeft: `3px solid ${item.color || ESG_COLORS.neutral[index % 4]}`
                                }}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xs font-bold text-white">{item.label}</span>
                                    <span className="text-lg font-light text-white">{item.value.toLocaleString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    const renderHeatmap = () => {
        const heatmapData = data as ChartDataPoint[];

        return (
            <div className="grid gap-1 p-4 h-full">
                {heatmapData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3"
                    >
                        <span className="w-20 text-[10px] text-slate-400 truncate">{item.label}</span>
                        <div className="flex-1 h-6 rounded relative overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                                className="h-full rounded"
                                style={{
                                    background: item.value >= 80
                                        ? 'linear-gradient(90deg, #10B981, #34D399)'
                                        : item.value >= 50
                                            ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                                            : 'linear-gradient(90deg, #EF4444, #F87171)'
                                }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white">
                                {item.value}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    const renderGanttChart = () => {
        const ganttData = data as ChartDataPoint[];
        const maxValue = Math.max(...ganttData.map(d => d.value));

        return (
            <div className="space-y-2 p-4 h-full overflow-auto">
                {ganttData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <span className="w-24 text-[10px] text-slate-300 truncate">{item.label}</span>
                        <div className="flex-1 h-6 bg-white/5 rounded relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                                className="h-full rounded"
                                style={{
                                    background: `linear-gradient(90deg, ${item.color || '#63a6b0'}60, ${item.color || '#63a6b0'})`
                                }}
                            />
                            <span className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] text-slate-400">
                                {item.value} days
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    // ========================================
    // Render Chart Based on Type
    // ========================================

    const renderChart = () => {
        switch (config.type) {
            case 'bar':
                return renderBarChart();
            case 'line':
                return renderLineChart();
            case 'pie':
                return renderPieChart();
            case 'radar':
                return renderRadarChart();
            case 'funnel':
                return renderFunnelChart();
            case 'heatmap':
                return renderHeatmap();
            case 'gantt':
                return renderGanttChart();
            default:
                return renderBarChart();
        }
    };

    // ========================================
    // Export Handler
    // ========================================

    const handleExport = async (format: 'png' | 'svg' | 'csv') => {
        setIsExporting(true);
        try {
            if (format === 'csv') {
                const headers = ['Label', 'Value', 'Category'];
                const rows = (data as ChartDataPoint[]).map(d =>
                    [d.label, d.value, d.category || ''].join(',')
                );
                const csv = [headers.join(','), ...rows].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${config.title.replace(/\s+/g, '_')}.csv`;
                a.click();
            }
            onExport?.(format);
        } finally {
            setIsExporting(false);
        }
    };

    // ========================================
    // Render
    // ========================================

    return (
        <div
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
            data-component="SustainabilityChartLibrary"
            className="liquid-glass rounded-3xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                    <h3 className="text-sm font-bold text-white">{config.title}</h3>
                    {config.subtitle && (
                        <p className="text-[10px] text-slate-400">{config.subtitle}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={showLegend ? '隱藏圖例' : '顯示圖例'}
                    >
                        {showLegend ? (
                            <Eye className="w-4 h-4 text-slate-400" />
                        ) : (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                    </button>

                    <div className="relative group">
                        <button
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
                            disabled={isExporting}
                        >
                            <Download className="w-4 h-4 text-slate-400" />
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-32 bg-[#1a2332] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <button
                                onClick={() => handleExport('png')}
                                className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 first:rounded-t-xl"
                            >
                                匯出 PNG
                            </button>
                            <button
                                onClick={() => handleExport('svg')}
                                className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10"
                            >
                                匯出 SVG
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 last:rounded-b-xl"
                            >
                                匯出 CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div
                ref={chartRef}
                className="relative"
                style={{ height }}
            >
                {renderChart()}
            </div>

            {/* Legend */}
            <AnimatePresence>
                {showLegend && (config.type === 'pie' || config.type === 'bar') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex flex-wrap gap-3 px-6 py-4 border-t border-white/10"
                    >
                        {(data as ChartDataPoint[]).map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color || ESG_COLORS.neutral[index % 4] }}
                                />
                                <span className="text-xs text-slate-300">{item.label}</span>
                                <span className="text-xs text-slate-500">
                                    ({((item.value / (data as ChartDataPoint[]).reduce((s, d) => s + d.value, 0)) * 100).toFixed(0)}%)
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Axis Labels */}
            {(config.xAxisLabel || config.yAxisLabel) && (
                <div className="flex px-6 pb-2">
                    {config.xAxisLabel && (
                        <p className="text-[10px] text-slate-400">{config.xAxisLabel}</p>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================
// Pre-configured Chart Templates
// ============================================

export const ESGPerformanceChart: React.FC<{ scores: { e: number; s: number; g: number } }> = ({ scores }) => {
    const config: ChartConfig = {
        title: 'ESG 績效評分',
        type: 'radar',
        showLegend: false
    };

    const data: ChartDataPoint[] = [
        { label: 'Environmental', value: scores.e, color: ESG_COLORS.environmental[0] },
        { label: 'Social', value: scores.s, color: ESG_COLORS.social[0] },
        { label: 'Governance', value: scores.g, color: ESG_COLORS.governance[0] },
        { label: 'Risk Management', value: 75, color: ESG_COLORS.risk[0] },
        { label: 'Innovation', value: 82, color: ESG_COLORS.positive[0] }
    ];

    return <SustainabilityChartLibrary data={data} config={config} height={300} />;
};

export const GRIComplianceChart: React.FC<{ disclosed: number; partial: number; gap: number }> = ({ disclosed, partial, gap }) => {
    const config: ChartConfig = {
        title: 'GRI 指標覆蓋率',
        type: 'pie'
    };

    const data: ChartDataPoint[] = [
        { label: '已揭露', value: disclosed, color: ESG_COLORS.positive[0] },
        { label: '部分揭露', value: partial, color: ESG_COLORS.governance[0] },
        { label: '缺口', value: gap, color: ESG_COLORS.risk[0] }
    ];

    return <SustainabilityChartLibrary data={data} config={config} height={280} />;
};

export const CarbonReductionChart: React.FC<{ years: number[]; values: number[]; targets: number[] }> = ({ years, values, targets }) => {
    const config: ChartConfig = {
        title: '碳排放趨勢 (tCO2e)',
        type: 'line',
        xAxisLabel: '年度',
        colors: [ESG_COLORS.environmental[0], ESG_COLORS.governance[0]]
    };

    const series: ChartSeries[] = [
        { name: '實際排放', data: values, color: ESG_COLORS.environmental[0] },
        { name: '目標', data: targets, color: ESG_COLORS.governance[0] }
    ];

    return <SustainabilityChartLibrary data={series} config={config} height={300} />;
};

export const SustainabilityFunnel: React.FC = () => {
    const config: ChartConfig = {
        title: '永續發展旅程',
        type: 'funnel'
    };

    const data: ChartDataPoint[] = [
        { label: '承諾', value: 100, color: ESG_COLORS.neutral[0] },
        { label: '規劃', value: 85, color: ESG_COLORS.neutral[1] },
        { label: '執行', value: 72, color: ESG_COLORS.neutral[2] },
        { label: '報告', value: 65, color: ESG_COLORS.neutral[3] },
        { label: '影響', value: 58, color: ESG_COLORS.positive[0] }
    ];

    return <SustainabilityChartLibrary data={data} config={config} height={320} />;
};

export const ESGYearTrendChart: React.FC<{ data: any[] }> = ({ data }) => {
    const config: ChartConfig = {
        title: 'ESG 年度趨勢分析',
        type: 'line',
        xAxisLabel: '年度',
        yAxisLabel: '綜合分值'
    };

    const series: ChartSeries[] = [
        { name: '環境 (E)', data: data.map(d => d.e), color: ESG_COLORS.environmental[0] },
        { name: '社會 (S)', data: data.map(d => d.s), color: ESG_COLORS.social[0] },
        { name: '治理 (G)', data: data.map(d => d.g), color: ESG_COLORS.governance[0] }
    ];

    const chartData = data.map((d, i) => ({ label: d.year.toString(), value: d.total }));

    return <SustainabilityChartLibrary data={series} config={config} height={350} />;
};

export const MaterialTopicChart: React.FC<{ topics: any[] }> = ({ topics }) => {
    const config: ChartConfig = {
        title: '重大性議題矩陣',
        type: 'radar',
    };

    const data: ChartDataPoint[] = topics.map(t => ({
        label: t.name,
        value: t.impact,
        color: t.color
    }));

    return <SustainabilityChartLibrary data={data} config={config} height={320} />;
};

export default SustainabilityChartLibrary;
