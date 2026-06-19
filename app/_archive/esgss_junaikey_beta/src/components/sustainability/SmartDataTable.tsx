/**
 * 📊 Smart Data Table Generator
 * 
 * 永續報告書智能數據表格生成器
 * 
 * Features:
 * - Auto-generated from extracted data
 * - ESG-specific table templates
 * - Sort, filter, search
 * - Export to CSV/Excel
 * - Conditional formatting
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table as TableIcon,
    Download,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    ArrowUpDown,
    Eye,
    Edit3,
    MoreHorizontal,
    FileSpreadsheet,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

const ESG_COLORS = {
    environmental: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'], // Green
    social: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'], // Blue
    governance: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'], // Amber
    neutral: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'],
    risk: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
    positive: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
};

// ============================================
// Types & Interfaces
// ============================================

export type TableType =
    | 'gri-indicators'
    | 'environmental-metrics'
    | 'social-metrics'
    | 'governance-metrics'
    | 'financial-summary'
    | 'risk-matrix'
    | 'custom';

export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'number' | 'percentage' | 'currency' | 'date' | 'status' | 'trend';
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    format?: (value: any) => string;
    colorScheme?: (value: any) => string;
}

export interface TableRow {
    id: string;
    [key: string]: any;
}

export interface TableConfig {
    id: string;
    title: string;
    type: TableType;
    columns: TableColumn[];
    rows: TableRow[];
    showSearch?: boolean;
    showFilter?: boolean;
    showPagination?: boolean;
    pageSize?: number;
    exportable?: boolean;
    editable?: boolean;
}

interface SmartDataTableProps {
    config: TableConfig;
    onRowClick?: (row: TableRow) => void;
    onEdit?: (row: TableRow, field: string, value: any) => void;
    onExport?: (format: 'csv' | 'xlsx' | 'json') => void;
}

// ============================================
// Pre-configured Table Templates
// ============================================

export const GRITableTemplate: TableConfig = {
    id: 'gri-table',
    title: 'GRI 指標揭露對照表',
    type: 'gri-indicators',
    columns: [
        { key: 'code', label: 'GRI 指標', type: 'text', sortable: true, width: '120px' },
        { key: 'title', label: '指標名稱', type: 'text', sortable: true },
        { key: 'category', label: '類別', type: 'text', sortable: true, width: '120px' },
        { key: 'value', label: '2024 值', type: 'text', align: 'right' },
        { key: 'unit', label: '單位', type: 'text', width: '80px' },
        { key: 'trend', label: '趨勢', type: 'trend', sortable: true, width: '100px' },
        { key: 'status', label: '狀態', type: 'status', sortable: true, width: '100px' }
    ],
    rows: [
        { id: '1', code: 'GRI 302-1', title: '組織內部能源消耗', category: '環境', value: '125,000', unit: 'GJ', trend: 'down', status: 'compliant' },
        { id: '2', code: 'GRI 305-1', title: '直接溫室氣體排放', category: '環境', value: '12,500', unit: 'tCO2e', trend: 'down', status: 'compliant' },
        { id: '3', code: 'GRI 305-2', title: '能源間接排放', category: '環境', value: '45,000', unit: 'tCO2e', trend: 'down', status: 'compliant' },
        { id: '4', code: 'GRI 401-1', title: '新進與離職員工', category: '社會', value: '8.5%', unit: ' turnover', trend: 'stable', status: 'partial' },
        { id: '5', code: 'GRI 403-9', title: '工傷事故率', category: '社會', value: '0.12', unit: 'FAR', trend: 'down', status: 'compliant' },
        { id: '6', code: 'GRI 405-1', title: '多元化治理組織', category: '社會', value: '38%', unit: ' female', trend: 'up', status: 'compliant' },
        { id: '7', code: 'GRI 205-3', title: '貪污事件', category: '治理', value: '0', unit: 'cases', trend: 'stable', status: 'compliant' }
    ],
    showSearch: true,
    showFilter: true,
    showPagination: true,
    pageSize: 5,
    exportable: true
};

export const EnvironmentalTableTemplate: TableConfig = {
    id: 'env-table',
    title: '環境績效指標',
    type: 'environmental-metrics',
    columns: [
        { key: 'indicator', label: '指標項目', type: 'text', sortable: true },
        { key: 'baseline', label: '基準年', type: 'number', align: 'right' },
        { key: 'current', label: '2024', type: 'number', align: 'right' },
        { key: 'target', label: '2030目標', type: 'number', align: 'right' },
        { key: 'reduction', label: '減量幅度', type: 'percentage', align: 'right' },
        { key: 'sbti', label: 'SBTi 對齊', type: 'status', width: '80px' }
    ],
    rows: [
        { id: '1', indicator: '範疇一排放 (tCO2e)', baseline: 15000, current: 12500, target: 7500, reduction: '16.7%', sbti: 'aligned' },
        { id: '2', indicator: '範疇二排放 (tCO2e)', baseline: 55000, current: 45000, target: 27500, reduction: '18.2%', sbti: 'aligned' },
        { id: '3', indicator: '能源消耗 (MWh)', baseline: 100000, current: 85000, target: 50000, reduction: '15%', sbti: 'aligned' },
        { id: '4', indicator: '用水量 (立方公尺)', baseline: 500000, current: 480000, target: 400000, reduction: '4%', sbti: 'partial' },
        { id: '5', indicator: '廢棄物 (公噸)', baseline: 2500, current: 2100, target: 1250, reduction: '16%', sbti: 'aligned' }
    ],
    showSearch: true,
    showFilter: true,
    exportable: true
};

export const SocialMetricsTableTemplate: TableConfig = {
    id: 'social-table',
    title: '社會績效指標',
    type: 'social-metrics',
    columns: [
        { key: 'category', label: '類別', type: 'text', sortable: true, width: '100px' },
        { key: 'metric', label: '指標', type: 'text', sortable: true },
        { key: 'value', label: '2024 值', type: 'text', align: 'right' },
        { key: 'benchmark', label: '標竿', type: 'text', align: 'right' },
        { key: 'gap', label: '差距', type: 'percentage', align: 'right' },
        { key: 'status', label: '狀態', type: 'status', width: '90px' }
    ],
    rows: [
        { id: '1', category: '多元化', metric: '女性主管比例', value: '38%', benchmark: '30%', gap: '+8%', status: 'excellent' },
        { id: '2', category: '多元化', metric: '女性董事比例', value: '33%', benchmark: '33%', gap: '0%', status: 'compliant' },
        { id: '3', category: '安全', metric: '職災事故率', value: '0.12', benchmark: '<0.5', gap: '-0.38', status: 'excellent' },
        { id: '4', category: '培訓', metric: '人均培訓時數', value: '32', benchmark: '24', gap: '+8', status: 'excellent' },
        { id: '5', category: '滿意度', metric: '員工滿意度', value: '4.2/5.0', benchmark: '4.0', gap: '+0.2', status: 'good' },
        { id: '6', category: '社區', metric: '社區投資金額', value: 'NT$15M', benchmark: 'NT$10M', gap: '+50%', status: 'excellent' }
    ],
    showSearch: true,
    showFilter: true,
    exportable: true
};

// ============================================
// Main Component
// ============================================

export const SmartDataTable: React.FC<SmartDataTableProps> = ({
    config,
    onRowClick,
    onEdit,
    onExport
}) => {
    const core = useMemo(() =>
        ComponentCoreFactory.create('SmartDataTable'),
        []);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [filterConfig, setFilterConfig] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [editingCell, setEditingCell] = useState<{
        rowId: string;
        field: string;
    } | null>(null);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // ========================================
    // Data Processing
    // ========================================

    const filteredRows = useMemo(() => {
        let result = config.rows;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(row =>
                Object.values(row).some(value =>
                    String(value).toLowerCase().includes(query)
                )
            );
        }

        // Column filters
        if (Object.keys(filterConfig).length > 0) {
            result = result.filter(row =>
                Object.entries(filterConfig).every(([key, filterValue]) =>
                    String(row[key]).toLowerCase().includes(filterValue.toLowerCase())
                )
            );
        }

        // Sorting
        if (sortConfig) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [config.rows, searchQuery, filterConfig, sortConfig]);

    const paginatedRows = useMemo(() => {
        if (!config.showPagination) return filteredRows;

        const size = config.pageSize || 10;
        const start = (currentPage - 1) * size;
        return filteredRows.slice(start, start + size);
    }, [filteredRows, currentPage, config]);

    const totalPages = Math.ceil(filteredRows.length / (config.pageSize || 10));

    // ========================================
    // Handlers
    // ========================================

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleExport = (format: 'csv' | 'xlsx' | 'json') => {
        const headers = config.columns.map(c => c.label).join(',');
        const rows = filteredRows.map(row =>
            config.columns.map(c => row[c.key]).join(',')
        ).join('\n');

        const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.title.replace(/\s+/g, '_')}.csv`;
        a.click();

        onExport?.(format);
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'compliant':
            case 'excellent':
            case 'aligned':
            case 'good':
                return 'text-emerald-400 bg-emerald-400/20';
            case 'partial':
            case 'warning':
                return 'text-amber-400 bg-amber-400/20';
            case 'gap':
            case 'non-compliant':
                return 'text-red-400 bg-red-400/20';
            default:
                return 'text-slate-400 bg-slate-400/20';
        }
    };

    const getTrendIcon = (trend: string): React.ReactNode => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-3 h-3 text-emerald-400" />;
            case 'down':
                return <TrendingDown className="w-3 h-3 text-emerald-400" />;
            default:
                return <Minus className="w-3 h-3 text-slate-400" />;
        }
    };

    // ========================================
    // Render
    // ========================================

    return (
        <div
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
            data-component="SmartDataTable"
            className="w-full"
        >
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-[#63a6b0]" />
                    {config.title}
                </h3>

                <div className="flex items-center gap-2">
                    {/* Search */}
                    {config.showSearch && (
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="搜尋..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#63a6b0]/50"
                            />
                        </div>
                    )}

                    {/* Filter */}
                    {config.showFilter && (
                        <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                            <Filter className="w-4 h-4 text-slate-400" />
                        </button>
                    )}

                    {/* Export */}
                    {config.exportable && (
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/50 rounded-xl text-xs text-[#63a6b0] hover:bg-[#63a6b0]/30 transition-colors">
                                <Download className="w-4 h-4" />
                                匯出
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-28 bg-[#1a2332] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 first:rounded-t-xl"
                                >
                                    CSV
                                </button>
                                <button
                                    onClick={() => handleExport('xlsx')}
                                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10"
                                >
                                    Excel
                                </button>
                                <button
                                    onClick={() => handleExport('json')}
                                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/10 last:rounded-b-xl"
                                >
                                    JSON
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Table Container */}
            <div className="liquid-glass rounded-3xl overflow-hidden">
                {/* Table Header */}
                <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10">
                    {config.columns.map((column) => (
                        <div
                            key={column.key}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded cursor-pointer transition-colors"
                            style={{
                                width: column.width || 'auto',
                                flex: column.width ? '0 0 auto' : '1'
                            }}
                            onClick={() => column.sortable && handleSort(column.key)}
                        >
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {column.label}
                            </span>
                            {column.sortable && (
                                sortConfig?.key === column.key ? (
                                    sortConfig.direction === 'asc' ? (
                                        <ChevronUp className="w-3 h-3 text-[#63a6b0]" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3 text-[#63a6b0]" />
                                    )
                                ) : (
                                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                )
                            )}
                        </div>
                    ))}
                </div>

                {/* Table Body */}
                <div className="max-h-96 overflow-auto">
                    <AnimatePresence>
                        {paginatedRows.map((row) => (
                            <motion.div
                                key={row.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`
                                    flex items-center px-4 py-3 border-b border-white/5 hover:bg-[#63a6b0]/5 cursor-pointer transition-colors
                                    ${onRowClick ? '' : ''}
                                `}
                                onClick={() => onRowClick?.(row)}
                            >
                                {config.columns.map((column) => {
                                    const value = row[column.key];

                                    return (
                                        <div
                                            key={column.key}
                                            className="px-2 py-1"
                                            style={{
                                                width: column.width || 'auto',
                                                flex: column.width ? '0 0 auto' : '1',
                                                textAlign: column.align || 'left'
                                            }}
                                        >
                                            {column.type === 'status' ? (
                                                <span className={`
                                                    inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium
                                                    ${getStatusColor(String(value))}
                                                `}>
                                                    {value === 'compliant' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                    {value === 'gap' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                    {String(value).toUpperCase()}
                                                </span>
                                            ) : column.type === 'trend' ? (
                                                <div className="flex items-center gap-1">
                                                    {getTrendIcon(String(value))}
                                                    <span className={`
                                                        text-xs font-medium
                                                        ${value === 'up' ? 'text-emerald-400' : value === 'down' ? 'text-emerald-400' : 'text-slate-400'}
                                                    `}>
                                                        {value === 'up' ? '↑' : value === 'down' ? '↓' : '→'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300">
                                                    {column.format ? column.format(value) : String(value)}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {config.showPagination && totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                        <span className="text-[10px] text-slate-400">
                            顯示 {((currentPage - 1) * (config.pageSize || 10)) + 1} - {Math.min(currentPage * (config.pageSize || 10), filteredRows.length)} / 共 {filteredRows.length} 筆
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-2 py-1 bg-white/5 rounded-lg text-xs text-slate-400 disabled:opacity-50 hover:bg-white/10"
                            >
                                上一頁
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`
                                            w-7 h-7 rounded-lg text-xs font-medium transition-colors
                                            ${currentPage === page
                                                ? 'bg-[#63a6b0] text-white'
                                                : 'text-slate-400 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 bg-white/5 rounded-lg text-xs text-slate-400 disabled:opacity-50 hover:bg-white/10"
                            >
                                下一頁
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ComplianceGapTable: React.FC<{ gaps: any[] }> = ({ gaps }) => {
    const config: TableConfig = {
        id: 'compliance-gap-table',
        title: '合規差距分析',
        type: 'risk-matrix',
        columns: [
            { key: 'framework', label: '框架', type: 'text', sortable: true },
            { key: 'requirement', label: '要求項目', type: 'text' },
            { key: 'status', label: '目前狀態', type: 'status', sortable: true },
            { key: 'severity', label: '嚴重程度', type: 'status' }
        ],
        rows: gaps.map((g, i) => ({
            id: i.toString(),
            framework: g.framework,
            requirement: g.requirement,
            status: g.status,
            severity: g.severity
        }))
    };

    return <SmartDataTable config={config} />;
};

export default SmartDataTable;
