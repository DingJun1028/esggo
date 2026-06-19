/**
 * 🌿 SustainabilityReportCenter - 永續報告書智慧中心
 * 
 * 功能模組：
 * - 📄 OCR 智慧文件解析（繁體中文/英文精準對照）
 * - 📊 多種圖表高級繪製（碳排放趨勢、GRI對照、ESG評分等）
 * - 📁 多年範本參照與拆解分析
 * - 🔄 自動格式清洗與視覺化表格生成
 * - 🤖 AI 輔助內容生成與對照
 * 
 * @version 2.0.0
 * @date 2026-02-08
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, BarChart3, Globe, ArrowRight, Search, Plus, Lock, Cpu, Boxes,
    FileCheck, MoreVertical, DownloadCloud, Upload, Scan, FileImage,
    Table, TrendingUp, TrendingDown, Activity, Target, Award,
    ChevronDown, ChevronRight, Eye, Edit3, Trash2, Copy, RefreshCw,
    Zap, Brain, Sparkles, Layers, Grid, List, Filter, Download,
    Maximize2, Minimize2, X, Check, AlertCircle, Info, Camera,
    DocumentDuplicate, ChartLine, ChartBar, PieChart, RadarChart,
    Languages, Type, AlignLeft, Hash, Calendar, Building2,
    ExternalLink, Share2, Star, Crown, ZapFast
} from 'lucide-react';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';
import EsgServiceLayout from '../../components/shared/EsgServiceLayout';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

// ============== Type Definitions ==============

interface ReportSummary {
    id: string;
    title: string;
    year: number;
    framework: string;
    status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Trustworthy';
    completeness: number;
    score?: number;
}

interface OCRDocument {
    id: string;
    name: string;
    type: 'pdf' | 'image' | 'docx';
    uploadTime: string;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    extractedText?: string;
    extractedTables?: ExtractedTable[];
    zhEnAlignment?: AlignmentPair[];
}

interface ExtractedTable {
    id: string;
    headers: string[];
    rows: string[][];
    confidence: number;
    pageNumber?: number;
}

interface AlignmentPair {
    zh: string;
    en: string;
    confidence: number;
    context?: string;
}

interface ChartConfig {
    id: string;
    type: 'line' | 'bar' | 'pie' | 'radar' | 'area' | 'scatter' | 'heatmap';
    title: string;
    data: ChartDataPoint[];
    options?: ChartOptions;
}

interface ChartDataPoint {
    label: string;
    value: number;
    category?: string;
    year?: number;
    color?: string;
}

interface ChartOptions {
    showLegend: boolean;
    showGrid: boolean;
    animate: boolean;
    colors?: string[];
    yAxisLabel?: string;
    xAxisLabel?: string;
}

interface TemplateComparison {
    id: string;
    name: string;
    years: number[];
    frameworks: string[];
    completeness: number;
    score: number;
}

interface GapAnalysis {
    category: string;
    missingItems: string[];
    suggestions: string[];
    priority: 'high' | 'medium' | 'low';
}

// ============== Mock Data ==============

const MOCK_REPORTS: ReportSummary[] = [
    { id: 'rep-2024', title: '2024 Annual Sustainability Report', year: 2024, framework: 'GRI Standards', status: 'Trustworthy', completeness: 100, score: 95 },
    { id: 'rep-2023', title: '2023 ESG Impact Report', year: 2023, framework: 'GRI / TCFD', status: 'Published', completeness: 100, score: 92 },
    { id: 'rep-2022', title: '2022 Sustainability Report', year: 2022, framework: 'GRI 2021', status: 'Published', completeness: 100, score: 88 },
    { id: 'rep-current', title: '2025 Q1 Progress Update', year: 2025, framework: 'GRI Omni 2021', status: 'Draft', completeness: 45, score: 0 },
];

const MOCK_OCR_DOCUMENTS: OCRDocument[] = [
    { id: 'ocr-1', name: '2023年度碳盤查報告.pdf', type: 'pdf', uploadTime: '2026-02-07 10:30', status: 'completed', extractedText: '本公司2023年度範疇一排放量為12,500 tCO2e...', extractedTables: [{ id: 't1', headers: ['項目', '排放量', '單位'], rows: [['範疇一', '12,500', 'tCO2e'], ['範疇二', '8,200', 'tCO2e']], confidence: 0.98 }] },
    { id: 'ocr-2', name: 'GRI對照表.xlsx', type: 'docx', uploadTime: '2026-02-06 14:20', status: 'completed' },
    { id: 'ocr-3', name: '員工滿意度調查.pdf', type: 'pdf', uploadTime: '2026-02-05 09:15', status: 'processing' },
];

const MOCK_ALIGNMENT_PAIRS: AlignmentPair[] = [
    { zh: '永續發展', en: 'Sustainable Development', confidence: 0.98, context: '報告書第一頁' },
    { zh: '碳排放', en: 'Carbon Emissions', confidence: 0.97, context: '環境永續章節' },
    { zh: '利害關係人', en: 'Stakeholders', confidence: 0.96, context: '溝通策略' },
    { zh: '公司治理', en: 'Corporate Governance', confidence: 0.99, context: '治理架構' },
];

const MOCK_GAP_ANALYSIS: GapAnalysis[] = [
    { category: 'GRI 302 能源', missingItems: ['能源密度指標', '再生能源佔比'], suggestions: ['補充能源使用密度計算', '增加再生能源憑證說明'], priority: 'high' },
    { category: 'GRI 305 排放', missingItems: ['範疇三排放'], suggestions: ['建立範疇三盤查機制', '納入供應商排放'], priority: 'high' },
    { category: 'TCFD 風險', missingItems: ['實體風險評估'], suggestions: ['補充氣候情境分析', '增加實體風險鑑別'], priority: 'medium' },
];

// ============== Sub-Components ==============

// 📊 Chart Card Component
const ChartCard: React.FC<{ config: ChartConfig; onEdit?: () => void }> = ({ config, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getChartIcon = () => {
        switch (config.type) {
            case 'line': return <ChartLine className="w-5 h-5" />;
            case 'bar': return <BarChart3 className="w-5 h-5" />;
            case 'pie': return <PieChart className="w-5 h-5" />;
            case 'radar': return <RadarChart className="w-5 h-5" />;
            case 'area': return <TrendingUp className="w-5 h-5" />;
            default: return <ChartLine className="w-5 h-5" />;
        }
    };

    return (
        <motion.div
            layout
            className={`liquid-glass p-6 relative overflow-hidden ${isExpanded ? 'fixed inset-4 z-50' : ''}`}
            style={{ transition: 'all 0.3s ease' }}
        >
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#63a6b0]/20 rounded-xl text-[#63a6b0]">
                        {getChartIcon()}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">{config.title}</h4>
                        <p className="text-xs text-slate-500 uppercase">{config.type} Chart</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isExpanded ? <Minimize2 className="w-4 h-4 text-slate-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
                    </button>
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Edit3 className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Chart Visualization (Simplified) */}
            <div className="h-48 flex items-end gap-2">
                {config.data.map((point, index) => (
                    <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.value / 100) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-[#63a6b0] to-[#63a6b0]/50 rounded-t-lg relative group"
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                            {point.label}: {point.value}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            {config.options?.showLegend && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {config.data.slice(0, 4).map((point, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs text-slate-500">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: point.color || '#63a6b0' }} />
                            {point.label}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// 📄 OCR Document Card
const OCRDocumentCard: React.FC<{ doc: OCRDocument; onSelect: (doc: OCRDocument) => void }> = ({ doc, onSelect }) => {
    const getStatusColor = () => {
        switch (doc.status) {
            case 'completed': return 'text-emerald-500';
            case 'processing': return 'text-amber-500';
            case 'error': return 'text-red-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(doc)}
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#63a6b0]/30 cursor-pointer transition-all"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${doc.status === 'completed' ? 'bg-emerald-500/20' : doc.status === 'processing' ? 'bg-amber-500/20' : 'bg-slate-500/20'}`}>
                        <FileImage className={`w-5 h-5 ${getStatusColor()}`} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.uploadTime} • {doc.type.toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {doc.status === 'processing' && (
                        <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                    )}
                    {doc.status === 'completed' && (
                        <Check className="w-5 h-5 text-emerald-500" />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// 📋 Alignment Table
const AlignmentTable: React.FC<{ pairs: AlignmentPair[] }> = ({ pairs }) => (
    <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">中文</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">English</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Context</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Confidence</th>
                </tr>
            </thead>
            <tbody>
                {pairs.map((pair, index) => (
                    <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5"
                    >
                        <td className="py-3 px-4 text-sm text-white">{pair.zh}</td>
                        <td className="py-3 px-4 text-sm text-slate-300">{pair.en}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{pair.context}</td>
                        <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#63a6b0] rounded-full"
                                        style={{ width: `${pair.confidence * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-400">{(pair.confidence * 100).toFixed(0)}%</span>
                            </div>
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>
);

// 📊 Gap Analysis Card
const GapAnalysisCard: React.FC<{ gap: GapAnalysis }> = ({ gap }) => (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white">{gap.category}</h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gap.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    gap.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                }`}>
                {gap.priority.toUpperCase()}
            </span>
        </div>
        <div className="space-y-2">
            <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Missing Items</p>
                {gap.missingItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        {item}
                    </div>
                ))}
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Suggestions</p>
                {gap.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#63a6b0]">
                        <ZapFast className="w-3 h-3" />
                        {s}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// 📈 Template Comparison Row
const TemplateComparisonRow: React.FC<{ template: TemplateComparison; onSelect: () => void }> = ({ template, onSelect }) => (
    <motion.div
        whileHover={{ x: 4 }}
        onClick={onSelect}
        className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-all"
    >
        <div className="flex items-center gap-4">
            <div className="p-2 bg-[#63a6b0]/20 rounded-lg">
                <FileText className="w-5 h-5 text-[#63a6b0]" />
            </div>
            <div>
                <p className="text-sm font-bold text-white">{template.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{template.years.join(', ')}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{template.frameworks.join(', ')}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right">
                <p className="text-xs text-slate-500 uppercase">Completeness</p>
                <p className="text-lg font-bold text-white">{template.completeness}%</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-500 uppercase">Score</p>
                <p className="text-lg font-bold text-[#63a6b0]">{template.score}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>
    </motion.div>
);

// ============== Main Component ==============

/**
 * 🌿 SustainabilityReportCenter
 * 
 * 永續報告書智慧中心 - 整合 OCR、AI 分析、多圖表繪製、
 * 多年範本參照、缺口分析等進階功能
 */
const SustainabilityReportCenter: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() => ComponentCoreFactory.create('SustainabilityReportCenter'), []);

    // State Management
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [activeTab, setActiveTab] = useState<'reports' | 'ocr' | 'charts' | 'templates' | 'analysis'>('reports');
    const [reports, setReports] = useState<ReportSummary[]>(MOCK_REPORTS);
    const [ocrDocuments, setOcrDocuments] = useState<OCRDocument[]>(MOCK_OCR_DOCUMENTS);
    const [selectedDoc, setSelectedDoc] = useState<OCRDocument | null>(null);
    const [showAlignment, setShowAlignment] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Chart Configurations
    const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([
        {
            id: 'chart-1',
            type: 'line',
            title: '碳排放趨勢 (2022-2025)',
            data: [
                { label: '2022', value: 85, year: 2022, color: '#63a6b0' },
                { label: '2023', value: 78, year: 2023, color: '#63a6b0' },
                { label: '2024', value: 72, year: 2024, color: '#63a6b0' },
                { label: '2025 Q1', value: 68, year: 2025, color: '#63a6b0' },
            ],
            options: { showLegend: true, showGrid: true, animate: true }
        },
        {
            id: 'chart-2',
            type: 'bar',
            title: 'GRI 揭露完成度',
            data: [
                { label: '環境', value: 92, color: '#22c55e' },
                { label: '社會', value: 88, color: '#3b82f6' },
                { label: '治理', value: 95, color: '#8b5cf6' },
            ],
            options: { showLegend: true, showGrid: true, animate: true }
        },
        {
            id: 'chart-3',
            type: 'pie',
            title: '能源結構分佈',
            data: [
                { label: '再生能源', value: 35, color: '#22c55e' },
                { label: '天然氣', value: 40, color: '#3b82f6' },
                { label: '燃煤', value: 15, color: '#f59e0b' },
                { label: '其他', value: 10, color: '#6b7280' },
            ],
            options: { showLegend: true, showGrid: false, animate: true }
        },
        {
            id: 'chart-4',
            type: 'radar',
            title: 'ESG 綜合評分',
            data: [
                { label: '環境', value: 85, category: 'score' },
                { label: '社會', value: 78, category: 'score' },
                { label: '治理', value: 92, category: 'score' },
                { label: '透明度', value: 88, category: 'score' },
                { label: '創新', value: 75, category: 'score' },
            ],
            options: { showLegend: true, showGrid: true, animate: true }
        },
    ]);

    // Template Comparisons
    const [templates] = useState<TemplateComparison[]>([
        { id: 't1', name: 'GRI Standards 年度報告', years: [2022, 2023, 2024], frameworks: ['GRI 2021'], completeness: 100, score: 95 },
        { id: 't2', name: 'TCFD 氣候揭露報告', years: [2023, 2024], frameworks: ['TCFD'], completeness: 85, score: 88 },
        { id: 't3', name: 'SASB 行業別報告', years: [2024], frameworks: ['SASB'], completeness: 70, score: 82 },
    ]);

    // Initialize
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenReportCenterV2Onboarding');
        if (!hasSeen) setShowOnboarding(true);
        setTimeout(() => setLoading(false), 600);
    }, []);

    // Handlers
    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenReportCenterV2Onboarding', 'true');
        setShowOnboarding(false);
    };

    const handleFileUpload = () => {
        // Simulate file upload
        const newDoc: OCRDocument = {
            id: `ocr-${Date.now()}`,
            name: '新上傳文件.pdf',
            type: 'pdf',
            uploadTime: new Date().toLocaleString(),
            status: 'processing'
        };
        setOcrDocuments([newDoc, ...ocrDocuments]);

        // Simulate processing completion
        setTimeout(() => {
            setOcrDocuments(prev => prev.map(d =>
                d.id === newDoc.id ? { ...d, status: 'completed', extractedText: '解析完成...' } : d
            ));
        }, 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Trustworthy':
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#63a6b0]/20 border border-[#63a6b0]/40 rounded-full">
                        <Lock className="w-3 h-3 text-[#63a6b0]" />
                        <span className="text-[9px] font-bold text-[#63a6b0] uppercase tracking-wider">已鎖定</span>
                    </div>
                );
            case 'Published':
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                        <Globe className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">已發布</span>
                    </div>
                );
            case 'Approved':
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full">
                        <Check className="w-3 h-3 text-blue-500" />
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">已核准</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                        <Edit3 className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">草稿</span>
                    </div>
                );
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="text-center">
                    <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">載入永續報告書中心...</p>
                </div>
            </div>
        );
    }

    return (
        <EsgServiceLayout title="永續報告書智慧中心" activeId="report" progress={95}>
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="SustainabilityReportCenter"
                className="animate-fade-in"
            >
                {/* 🎯 Header Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as any)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#63a6b0]/50 outline-none"
                        >
                            <option value="reports">📄 報告書列表</option>
                            <option value="ocr">🔍 OCR 解析</option>
                            <option value="charts">📊 圖表中心</option>
                            <option value="templates">📁 範本庫</option>
                            <option value="analysis">🎯 缺口分析</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeTab === 'charts' && (
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#63a6b0]/20 text-[#63a6b0]' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#63a6b0]/20 text-[#63a6b0]' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleFileUpload}
                            className="flex items-center gap-2 px-6 py-3 bg-[#63a6b0] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,166,176,0.3)] border border-[#63a6b0]/50"
                        >
                            <Upload className="w-4 h-4" /> 上傳文件
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all border border-white/10">
                            <Plus className="w-4 h-4" /> 新建專案
                        </button>
                    </div>
                </div>

                {/* 📊 Tab Content */}
                <AnimatePresence mode="wait">
                    {/* 📄 Reports Tab */}
                    {activeTab === 'reports' && (
                        <motion.div
                            key="reports"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left: Statistics */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Stats Cards */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="liquid-glass p-8 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <BarChart3 size={120} className="text-white" />
                                        </div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-[#63a6b0]" /> 報告書統計
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 relative z-10">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">已發布</p>
                                                <p className="text-3xl font-light italic text-white">12 <span className="text-[10px] text-slate-600 not-italic">份</span></p>
                                            </div>
                                            <div className="p-4 bg-[#63a6b0]/10 rounded-2xl border border-[#63a6b0]/20">
                                                <p className="text-[10px] text-[#63a6b0]/70 font-bold uppercase mb-1">已錨定</p>
                                                <p className="text-3xl font-light italic text-[#63a6b0]">08 <span className="text-[10px] text-[#63a6b0]/50 not-italic">份</span></p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Supported Frameworks */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="liquid-glass p-8"
                                    >
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 italic">支援框架</h3>
                                        <div className="space-y-3">
                                            {['GRI Standards 2021', 'SASB Industry Specific', 'TCFD Climate Disclosure', 'ISSO 14064 GHG'].map((f, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-[#63a6b0]/10 hover:border-[#63a6b0]/30 transition-all cursor-pointer group">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">{f}</span>
                                                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#63a6b0] transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right: Reports List */}
                                <div className="lg:col-span-8 flex flex-col h-full">
                                    <div className="liquid-glass p-10 relative overflow-hidden flex-1">
                                        <div className="flex items-center justify-between mb-10">
                                            <h3 className="text-xl font-light text-white flex items-center gap-3">
                                                <FileText className="text-[#63a6b0]" /> 報告書總覽
                                            </h3>
                                            <div className="flex bg-black/20 border border-white/10 rounded-xl px-4 py-2 items-center gap-3 focus-within:border-[#63a6b0]/50 transition-colors">
                                                <Search className="w-4 h-4 text-slate-500" />
                                                <input type="text" placeholder="搜尋報告書..." className="bg-transparent border-none text-xs text-white outline-none placeholder:text-slate-600 w-48" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <AnimatePresence>
                                                {reports.map((r, i) => (
                                                    <motion.div
                                                        key={r.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="group flex flex-wrap items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-[#63a6b0]/5 hover:border-[#63a6b0]/30 transition-all cursor-pointer relative overflow-hidden"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#63a6b0]/10 group-hover:border-[#63a6b0]/30 transition-all shadow-inner">
                                                                <FileCheck className="text-slate-400 group-hover:text-[#63a6b0] w-7 h-7 transition-colors" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-bold italic uppercase tracking-tight text-white group-hover:text-[#63a6b0] transition-colors">{r.title}</h4>
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">{r.framework}</span>
                                                                    <span className="text-[10px] font-mono text-slate-600 border-l border-white/10 pl-3">{r.year}</span>
                                                                    <span className="text-[10px] font-bold text-[#63a6b0] border-l border-white/10 pl-3">{r.completeness}% 完成</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-8 mt-4 md:mt-0">
                                                            <div className="text-right">
                                                                <div className="flex items-center gap-2 justify-end mb-1">
                                                                    {getStatusBadge(r.status)}
                                                                </div>
                                                                <p className="text-[9px] font-mono text-slate-600 uppercase">更新: 2026-02-05</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button className="p-2 hover:bg-[#63a6b0]/20 hover:text-[#63a6b0] rounded-xl transition-all border border-transparent hover:border-[#63a6b0]/50">
                                                                    <Eye className="w-5 h-5 text-slate-500 hover:text-[#63a6b0]" />
                                                                </button>
                                                                <button className="p-2 hover:bg-[#63a6b0]/20 hover:text-[#63a6b0] rounded-xl transition-all border border-transparent hover:border-[#63a6b0]/50">
                                                                    <DownloadCloud className="w-5 h-5 text-slate-500 hover:text-[#63a6b0]" />
                                                                </button>
                                                                <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                                                    <MoreVertical className="w-5 h-5 text-slate-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 🔍 OCR Analysis Tab */}
                    {activeTab === 'ocr' && (
                        <motion.div
                            key="ocr"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Left: Document List */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="liquid-glass p-6">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Scan className="w-5 h-5 text-[#63a6b0]" /> 已上傳文件
                                    </h3>
                                    <div className="space-y-3">
                                        {ocrDocuments.map((doc) => (
                                            <OCRDocumentCard
                                                key={doc.id}
                                                doc={doc}
                                                onSelect={setSelectedDoc}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleFileUpload}
                                        className="w-full mt-4 p-4 border-2 border-dashed border-white/20 rounded-xl text-slate-500 hover:text-[#63a6b0] hover:border-[#63a6b0]/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-5 h-5" /> 上傳新文件
                                    </button>
                                </div>
                            </div>

                            {/* Right: Analysis Result */}
                            <div className="lg:col-span-8">
                                {selectedDoc ? (
                                    <div className="liquid-glass p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                <Brain className="w-6 h-6 text-[#63a6b0]" /> AI 解析結果
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setShowAlignment(!showAlignment)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showAlignment ? 'bg-[#63a6b0] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                                                >
                                                    <Languages className="w-4 h-4" /> 繁英對照
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tabs for content types */}
                                        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                                            {['文字萃取', '表格資料', '對照結果'].map((tab, i) => (
                                                <button
                                                    key={i}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${(tab === '文字萃取' && !showAlignment) ||
                                                            (tab === '表格資料' && selectedDoc.extractedTables) ||
                                                            (tab === '對照結果' && showAlignment)
                                                            ? 'bg-[#63a6b0]/20 text-[#63a6b0] border border-[#63a6b0]/50'
                                                            : 'text-slate-500 hover:text-white'
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        {showAlignment ? (
                                            /* 繁英對照模式 */
                                            <div className="bg-white/5 rounded-xl p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Languages className="w-5 h-5 text-[#63a6b0]" />
                                                    <h4 className="text-sm font-bold text-white">中英文精準對照</h4>
                                                </div>
                                                <AlignmentTable pairs={MOCK_ALIGNMENT_PAIRS} />
                                            </div>
                                        ) : (
                                            /* 文字萃取模式 */
                                            <div className="space-y-6">
                                                <div className="bg-white/5 rounded-xl p-6">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <FileText className="w-5 h-5 text-[#63a6b0]" />
                                                        <h4 className="text-sm font-bold text-white">萃取文字</h4>
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        {selectedDoc.extractedText || '正在處理文件，請稍候...'}
                                                    </p>
                                                </div>

                                                {selectedDoc.extractedTables && selectedDoc.extractedTables.length > 0 && (
                                                    <div className="bg-white/5 rounded-xl p-6">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <Table className="w-5 h-5 text-[#63a6b0]" />
                                                            <h4 className="text-sm font-bold text-white">萃取表格</h4>
                                                        </div>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className="border-b border-white/10">
                                                                        {selectedDoc.extractedTables[0].headers.map((h, i) => (
                                                                            <th key={i} className="text-left py-2 px-4 text-xs font-bold text-slate-500 uppercase">{h}</th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {selectedDoc.extractedTables[0].rows.map((row, i) => (
                                                                        <tr key={i} className="border-b border-white/5">
                                                                            {row.map((cell, j) => (
                                                                                <td key={j} className="py-2 px-4 text-sm text-slate-300">{cell}</td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#63a6b0]/20 text-[#63a6b0] rounded-xl hover:bg-[#63a6b0]/30 transition-all">
                                                <Download className="w-4 h-4" /> 匯出文字
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#63a6b0]/20 text-[#63a6b0] rounded-xl hover:bg-[#63a6b0]/30 transition-all">
                                                <Table className="w-4 h-4" /> 匯出表格
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#63a6b0] text-white rounded-xl hover:bg-[#63a6b0]/80 transition-all">
                                                <Sparkles className="w-4 h-4" /> AI 整理
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="liquid-glass p-12 text-center">
                                        <Scan className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-500">請選擇左側文件以查看解析結果</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 📊 Charts Tab */}
                    {activeTab === 'charts' && (
                        <motion.div
                            key="charts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Chart Grid */}
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'}`}>
                                {chartConfigs.map((config, index) => (
                                    <ChartCard
                                        key={config.id}
                                        config={config}
                                        onEdit={() => console.log('Edit chart:', config.id)}
                                    />
                                ))}
                            </div>

                            {/* Quick Add Chart */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['折線圖', '長條圖', '圓餅圖', '雷達圖', '面積圖', '散點圖', '熱力圖', '自定義'].map((type, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-[#63a6b0]/10 hover:border-[#63a6b0]/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {i === 0 && <ChartLine className="w-5 h-5 text-slate-400" />}
                                        {i === 1 && <BarChart3 className="w-5 h-5 text-slate-400" />}
                                        {i === 2 && <PieChart className="w-5 h-5 text-slate-400" />}
                                        {i === 3 && <RadarChart className="w-5 h-5 text-slate-400" />}
                                        {i >= 4 && <Activity className="w-5 h-5 text-slate-400" />}
                                        <span className="text-sm font-bold text-slate-300">{type}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 📁 Templates Tab */}
                    {activeTab === 'templates' && (
                        <motion.div
                            key="templates"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Year Filter */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-slate-400">年份：</span>
                                {[2025, 2024, 2023, 2022].map((year) => (
                                    <button
                                        key={year}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${year === 2024 ? 'bg-[#63a6b0] text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>

                            {/* Template List */}
                            <div className="space-y-4">
                                {templates.map((template) => (
                                    <TemplateComparisonRow
                                        key={template.id}
                                        template={template}
                                        onSelect={() => console.log('Select template:', template.id)}
                                    />
                                ))}
                            </div>

                            {/* Year-over-Year Comparison */}
                            <div className="liquid-glass p-8 mt-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-[#63a6b0]" /> 年度比較分析
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-2">報告書數量</p>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                                            <span className="text-2xl font-bold text-white">+25%</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-2">平均完整度</p>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                                            <span className="text-2xl font-bold text-white">85%</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase mb-2">GRI 揭露率</p>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                                            <span className="text-2xl font-bold text-white">92%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 🎯 Gap Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Analysis Header */}
                            <div className="liquid-glass p-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            <Target className="w-6 h-6 text-[#63a6b0]" /> 缺口分析與建議
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-2">基於 GRI Standards 2021 與 TCFD 框架的比對分析</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-[#63a6b0] text-white rounded-xl hover:bg-[#63a6b0]/80 transition-all">
                                        <Sparkles className="w-4 h-4" /> AI 自動分析
                                    </button>
                                </div>
                            </div>

                            {/* Gap Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {MOCK_GAP_ANALYSIS.map((gap, index) => (
                                    <GapAnalysisCard key={index} gap={gap} />
                                ))}
                            </div>

                            {/* Overall Score */}
                            <div className="liquid-glass p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <Award className="w-5 h-5 text-[#63a6b0]" /> 報告書完整度評分
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {[
                                        { label: '環境', score: 92, color: '#22c55e' },
                                        { label: '社會', score: 88, color: '#3b82f6' },
                                        { label: '治理', score: 95, color: '#8b5cf6' },
                                        { label: '透明度', score: 90, color: '#f59e0b' },
                                        { label: '創新', score: 75, color: '#ef4444' },
                                    ].map((item) => (
                                        <div key={item.label} className="p-4 bg-white/5 rounded-xl text-center">
                                            <div
                                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
                                                style={{ background: `${item.color}20`, border: `2px solid ${item.color}` }}
                                            >
                                                <span className="text-xl font-bold text-white">{item.score}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Onboarding Overlay */}
                <ServiceOnboardingOverlay
                    isOpen={showOnboarding}
                    onComplete={handleOnboardingComplete}
                    serviceName="永續報告書智慧中心"
                    serviceDesc="整合 OCR 解析、多圖表繪製、多年範本參照，讓報告書撰寫更智能高效"
                    steps={[
                        { id: 'ocr-upload', type: 'info', title: 'OCR 文件解析', description: '上傳掃描文件，AI 自動萃取文字與表格，支援繁體中文與英文精準對照', icon: <Scan /> },
                        { id: 'smart-charts', type: 'info', title: '智慧圖表繪製', description: '一鍵生成碳排放趨勢、GRI 揭露率、ESG 評分等多種專業圖表', icon: <ChartBar /> },
                        { id: 'template-reference', type: 'info', title: '多年範本參照', description: '比較歷年報告書，快速參照同業範本，確保資訊完整性', icon: <Copy /> },
                        { id: 'gap-analysis', type: 'info', title: '缺口分析', description: 'AI 自動比對 GRI/TCFD 框架，找出揭露缺口並提供改善建議', icon: <Target /> },
                        { id: 'ai-assist', type: 'info', title: 'AI 輔助生成', description: '結合 Gemini AI，快速生成報告書章節內容，格式自動清洗', icon: <Brain /> },
                    ]}
                />
            </div>
        </EsgServiceLayout>
    );
};

export default SustainabilityReportCenter;
