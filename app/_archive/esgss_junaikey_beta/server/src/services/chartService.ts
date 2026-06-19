/**
 * 📊 Chart Service - 圖表生成與管理服務
 * 
 * 功能：
 * - 圖表配置管理
 * - 圖表資料處理
 * - 圖表匯出功能
 * 
 * @version 1.0.0
 * @date 2026-02-08
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export type ChartType = 'line' | 'bar' | 'pie' | 'radar' | 'area' | 'scatter' | 'heatmap';

export interface ChartDataPoint {
    label: string;
    value: number;
    category?: string;
    year?: number;
    color?: string;
    metadata?: Record<string, any>;
}

export interface ChartOptions {
    showLegend: boolean;
    showGrid: boolean;
    showTooltip: boolean;
    animate: boolean;
    colors?: string[];
    yAxisLabel?: string;
    xAxisLabel?: string;
    legendPosition?: 'top' | 'bottom' | 'left' | 'right';
    title?: string;
    subtitle?: string;
}

export interface ChartConfig {
    id: string;
    type: ChartType;
    title: string;
    description?: string;
    data: ChartDataPoint[];
    options: ChartOptions;
    source?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    reportId?: string;
}

export interface ChartCreateRequest {
    type: ChartType;
    title: string;
    description?: string;
    data: ChartDataPoint[];
    options?: Partial<ChartOptions>;
    source?: string;
    userId: string;
    reportId?: string;
}

// Mock chart storage
const chartStore = new Map<string, ChartConfig>();

// Default colors
const DEFAULT_COLORS = [
    '#63a6b0', '#22c55e', '#3b82f6', '#8b5cf6', 
    '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
];

/**
 * 建立新圖表
 */
export async function createChart(request: ChartCreateRequest): Promise<ChartConfig> {
    const chartId = uuidv4();
    const now = new Date().toISOString();
    
    const chart: ChartConfig = {
        id: chartId,
        type: request.type,
        title: request.title,
        description: request.description,
        data: request.data,
        options: {
            showLegend: true,
            showGrid: true,
            showTooltip: true,
            animate: true,
            colors: DEFAULT_COLORS,
            legendPosition: 'bottom',
            ...request.options,
        },
        source: request.source,
        createdAt: now,
        updatedAt: now,
        userId: request.userId,
        reportId: request.reportId,
    };
    
    chartStore.set(chartId, chart);
    return chart;
}

/**
 * 取得圖表
 */
export function getChart(chartId: string): ChartConfig | null {
    return chartStore.get(chartId) || null;
}

/**
 * 更新圖表
 */
export async function updateChart(chartId: string, updates: Partial<ChartConfig>): Promise<ChartConfig | null> {
    const chart = chartStore.get(chartId);
    if (!chart) return null;
    
    const updatedChart: ChartConfig = {
        ...chart,
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    
    chartStore.set(chartId, updatedChart);
    return updatedChart;
}

/**
 * 刪除圖表
 */
export function deleteChart(chartId: string): boolean {
    return chartStore.delete(chartId);
}

/**
 * 列出用戶圖表
 */
export function listUserCharts(userId: string, reportId?: string): ChartConfig[] {
    const charts: ChartConfig[] = [];
    chartStore.forEach((chart) => {
        if (chart.userId === userId && (!reportId || chart.reportId === reportId)) {
            charts.push(chart);
        }
    });
    return charts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 產生圖表 SVG
 */
export function generateChartSVG(chart: ChartConfig): string {
    switch (chart.type) {
        case 'line': return generateLineChartSVG(chart);
        case 'bar': return generateBarChartSVG(chart);
        case 'pie': return generatePieChartSVG(chart);
        case 'radar': return generateRadarChartSVG(chart);
        case 'area': return generateAreaChartSVG(chart);
        default: return generateBarChartSVG(chart);
    }
}

function generateLineChartSVG(chart: ChartConfig): string {
    const width = 600, height = 400, padding = 60;
    const maxValue = Math.max(...chart.data.map(d => d.value));
    const points = chart.data.map((d, i) => ({
        x: padding + (i / (chart.data.length - 1)) * (width - 2 * padding),
        y: height - padding - (d.value / maxValue) * (height - 2 * padding),
        ...d
    }));
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#0f172a" />
        <polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#63a6b0" stroke-width="2" />
        ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#63a6b0" />`).join('')}
    </svg>`;
}

function generateBarChartSVG(chart: ChartConfig): string {
    const width = 600, height = 400, padding = 60;
    const maxValue = Math.max(...chart.data.map(d => d.value));
    const barWidth = (width - 2 * padding) / chart.data.length * 0.6;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#0f172a" />
        ${chart.data.map((d, i) => {
            const h = (d.value / maxValue) * (height - 2 * padding);
            const x = padding + i * (width - 2 * padding) / chart.data.length + (width - 2 * padding) / chart.data.length * 0.2;
            const y = height - padding - h;
            return `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}" rx="4" />`;
        }).join('')}
    </svg>`;
}

function generatePieChartSVG(chart: ChartConfig): string {
    const width = 400, height = 400, cx = width / 2, cy = height / 2, radius = 150;
    const total = chart.data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90;
    
    const slices = chart.data.map((d, i) => {
        const angle = (d.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = (currentAngle += angle);
        const largeArc = angle > 180 ? 1 : 0;
        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;
        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);
        return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}" />`;
    }).join('');
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#0f172a" />
        ${slices}
    </svg>`;
}

function generateRadarChartSVG(chart: ChartConfig): string {
    const width = 400, height = 400, cx = width / 2, cy = height / 2, radius = 150;
    const levels = 5;
    const angleStep = (2 * Math.PI) / chart.data.length;
    
    const grids = [1, 2, 3, 4, 5].map(i => 
        `<circle cx="${cx}" cy="${cy}" r="${radius * i / levels}" fill="none" stroke="#334155" />`
    ).join('');
    
    const points = chart.data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (d.value / 100) * radius;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#0f172a" />
        ${grids}
        <polygon points="${points}" fill="rgba(99, 166, 176, 0.5)" stroke="#63a6b0" stroke-width="2" />
    </svg>`;
}

function generateAreaChartSVG(chart: ChartConfig): string {
    const width = 600, height = 400, padding = 60;
    const maxValue = Math.max(...chart.data.map(d => d.value));
    const points = chart.data.map((d, i) => ({
        x: padding + (i / (chart.data.length - 1)) * (width - 2 * padding),
        y: height - padding - (d.value / maxValue) * (height - 2 * padding)
    }));
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#0f172a" />
        <path d="M ${padding},${height - padding} ${points.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${width - padding},${height - padding} Z" fill="rgba(99, 166, 176, 0.3)" />
        <polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="#63a6b0" stroke-width="2" />
    </svg>`;
}

/**
 * 匯出圖表為 SVG
 */
export function exportChartAsSVG(chartId: string): string {
    const chart = chartStore.get(chartId);
    if (!chart) throw new Error('Chart not found');
    return generateChartSVG(chart);
}

/**
 * 取得預設圖表範本
 */
export function getDefaultChartTemplates(): ChartCreateRequest[] {
    return [
        {
            type: 'line', title: '碳排放趨勢',
            data: [{ label: '2020', value: 100 }, { label: '2021', value: 92 }, { label: '2022', value: 85 }, { label: '2023', value: 78 }, { label: '2024', value: 72 }],
            userId: 'system'
        },
        {
            type: 'bar', title: 'GRI 揭露完成度',
            data: [{ label: '環境', value: 92, color: '#22c55e' }, { label: '社會', value: 88, color: '#3b82f6' }, { label: '治理', value: 95, color: '#8b5cf6' }],
            userId: 'system'
        },
        {
            type: 'pie', title: '能源結構分佈',
            data: [{ label: '再生能源', value: 35, color: '#22c55e' }, { label: '天然氣', value: 40, color: '#3b82f6' }, { label: '燃煤', value: 15, color: '#f59e0b' }, { label: '其他', value: 10, color: '#6b7280' }],
            userId: 'system'
        },
        {
            type: 'radar', title: 'ESG 綜合評分',
            data: [{ label: '環境', value: 85 }, { label: '社會', value: 78 }, { label: '治理', value: 92 }, { label: '透明度', value: 88 }, { label: '創新', value: 75 }],
            userId: 'system'
        },
    ];
}

export default { createChart, getChart, updateChart, deleteChart, listUserCharts, generateChartSVG, exportChartAsSVG, getDefaultChartTemplates };
