/**
 * 📄 ESG GO - Ultimate Sustainability Report Platform
 * 
 * 永續報告書智能增強平台 - 終極版
 * 
 * Core Pillars:
 * 1. AI Report Factory (AI 報告工廠)
 * 2. Compliance Governance Central (法遵治理中控)
 * 3. Knowledge-to-Action Engine (知識到行動引擎)
 * 4. Evidence Vault (雲端證據庫)
 * 5. Board Copilot (委員會副駕)
 * 
 * 5T Protocol: Traceable · Trackable · Trustworthy
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, BarChart3, Globe, Search, Plus, Lock, Cpu, Boxes,
    FileCheck, MoreVertical, DownloadCloud, ScanLine, Sparkles,
    Table as TableIcon, History, TrendingUp, Settings, ChevronRight,
    Layers, Target, CheckCircle, AlertTriangle, Bot, Upload, Eye,
    RefreshCw, Shield, Zap, Workflow, Users, Building2, Scale,
    FileBarChart, Clock, CheckSquare, AlertOctagon, BookOpen, Rocket,
    Award, Folder, File, Database, Brain, MessageSquare, BarChart,
    PieChart, Activity, Zap as ZapIcon, Grid, List, Filter, Download,
    Share2, EyeOff, Bell, User, Calendar, ChevronDown, MoreHorizontal,
    ArrowUp, ArrowDown, Minus,
    TrendingDown,
    StickyNote
} from 'lucide-react';
import ServiceOnboardingOverlay from '@/components/common/ServiceOnboardingOverlay';
import EsgServiceLayout, { ESG_THEME } from '../../components/shared/EsgServiceLayout';
import { useI18n } from '@/utils/i18n';
import { useStitchTheme } from '@/contexts/StitchThemeContext';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { OCRDocumentScanner } from '@/components/sustainability/OCRDocumentScanner';
import {
    SustainabilityChartLibrary,
    ESGPerformanceChart,
    GRIComplianceChart,
    CarbonReductionChart,
    SustainabilityFunnel,
    ESGYearTrendChart,
    MaterialTopicChart
} from '@/components/sustainability/SustainabilityChartLibrary';
import {
    SmartDataTable,
    GRITableTemplate,
    EnvironmentalTableTemplate,
    SocialMetricsTableTemplate,
    ComplianceGapTable
} from '@/components/sustainability/SmartDataTable';
import { AIAnalysisAssistant } from '@/components/sustainability/AIAnalysisAssistant';
import {
    SustainabilityDocumentIntelligence,
    DocumentIntelligenceFactory
} from '@/services/sustainability/SustainabilityDocumentIntelligence';
import {
    MultiYearTemplateAnalyzer,
    MultiYearAnalyzerFactory
} from '@/services/sustainability/MultiYearTemplateAnalyzer';

// ============================================
// Types & Interfaces
// ============================================

interface ReportSummary {
    id: string;
    title: string;
    year: number;
    framework: string;
    status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Trustworthy';
    completeness: number;
    t5Status?: 'traceable' | 'trackable' | 'trustworthy';
    qaScore?: number;
    author?: string;
    updatedAt?: string;
}

interface TabItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    pillar?: 'dashboard' | 'ai-factory' | 'compliance' | 'action' | 'evidence' | 'board';
}

interface ComplianceMilestone {
    id: string;
    name: string;
    deadline: string;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    category: 'tw-re份' | 'gri' | 'tcfd' | 'sasb' | 'cdp' | 'issb';
    progress: number;
    responsible?: string;
    reminderDays?: number;
}

interface TaskAction {
    id: string;
    title: string;
    source: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    dueDate: string;
    assignee?: string;
    status: 'todo' | 'doing' | 'done';
    estimatedHours?: number;
    dependencies?: string[];
}

interface EvidenceFile {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'xlsx' | 'image' | 'other';
    size: number;
    uploadedAt: string;
    uploadedBy: string;
    relatedIndicator?: string;
    verified: boolean;
    tags: string[];
}

interface BoardQuestion {
    id: string;
    question: string;
    answer?: string;
    status: 'pending' | 'draft' | 'ready';
    category: 'financial' | 'environmental' | 'social' | 'governance';
    suggestedBy?: string;
    createdAt: string;
    lastUpdated?: string;
}

interface QACheckItem {
    id: string;
    category: string;
    item: string;
    status: 'passed' | 'warning' | 'failed' | 'pending';
    score: number;
    details: string;
    suggestions: string[];
}

interface DashboardMetric {
    id: string;
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    color: string;
    pillar: string;
    icon?: React.ReactNode;
}

// ============================================
// Ultimate Sustainability Report Page
// ============================================

const EnhancedSustainabilityReportPage: React.FC = () => {
    // 5T Protocol: Core Identity
    const core = useMemo(() =>
        ComponentCoreFactory.create('UltimateSustainabilityReportPage'),
        []);

    const { t, language } = useI18n();
    const { mode, resolvedMode } = useStitchTheme();

    const docIntelligence = useMemo(() => DocumentIntelligenceFactory.create(), []);
    const yearAnalyzer = useMemo(() => MultiYearAnalyzerFactory.create(), []);

    // State Management
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [activePillar, setActivePillar] = useState<'dashboard' | 'ai-factory' | 'compliance' | 'action' | 'evidence' | 'board'>('dashboard');
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedReport, setSelectedReport] = useState<ReportSummary | null>(null);
    const [ocrResults, setOcrResults] = useState<any[]>([]);
    const [documentCore, setDocumentCore] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [isAutoFilling, setIsAutoFilling] = useState(false);

    // Document Collection Checklist (單據收集清單)
    const checklistItems = useMemo(() => [
        { id: 'ev-1', title: '電力費單據 (範疇二)', required: true, status: 'collected', icon: <Zap /> },
        { id: 'ev-2', title: '廢棄物處理合約 (環境)', required: true, status: 'pending', icon: <Database /> },
        { id: 'ev-3', title: '員工培訓紀錄 (社會)', required: false, status: 'collected', icon: <Users /> },
        { id: 'ev-4', title: '董事會會議紀錄 (治理)', required: true, status: 'pending', icon: <MessageSquare /> },
        { id: 'ev-5', title: '供應商評估表 (供應鏈)', required: true, status: 'pending', icon: <Building2 /> },
    ], []);

    // Complete Pillars Navigation (六大核心)
    const pillars: TabItem[] = useMemo(() => [
        { id: 'dashboard', label: t('sustainability.pillars.dashboard'), icon: <BarChart3 className="w-4 h-4" />, pillar: 'dashboard' },
        { id: 'ai-factory', label: t('sustainability.pillars.factory'), icon: <Cpu className="w-4 h-4" />, pillar: 'ai-factory', badge: ocrResults.length },
        { id: 'compliance', label: t('sustainability.pillars.compliance'), icon: <Shield className="w-4 h-4" />, pillar: 'compliance' },
        { id: 'action', label: t('sustainability.pillars.action'), icon: <Rocket className="w-4 h-4" />, pillar: 'action' },
        { id: 'evidence', label: t('sustainability.pillars.evidence'), icon: <Database className="w-4 h-4" />, pillar: 'evidence' },
        { id: 'board', label: t('sustainability.pillars.board'), icon: <MessageSquare className="w-4 h-4" />, pillar: 'board' },
    ], [t, ocrResults.length]);

    // AI Factory Tabs
    const aiFactoryTabs = useMemo(() => [
        { id: 'overview', label: t('sustainability.factory.overview' as any) || '專案總覽' },
        { id: 'scan', label: t('sustainability.factory.scan') },
        { id: 'templates', label: t('sustainability.factory.templates') },
        { id: 'tables', label: t('sustainability.factory.tables' as any) || '數據表格' },
        { id: 'qa', label: t('sustainability.factory.qaScore') },
    ], [t]);

    // Extended Compliance Milestones
    const complianceMilestones: ComplianceMilestone[] = [
        { id: 'tw-2025', name: '2025 ESG Report 申報', deadline: '2025-07-31', status: 'in-progress', category: 'tw-re份', progress: 65, responsible: 'ESG Team', reminderDays: 14 },
        { id: 'cdp-2025', name: 'CDP Climate 2025', deadline: '2025-07-24', status: 'pending', category: 'cdp', progress: 30, responsible: 'Sustainability' },
        { id: 'gri-2025', name: 'GRI Standards 2025', deadline: '2025-12-31', status: 'pending', category: 'gri', progress: 45 },
        { id: 'tcfd-2025', name: 'TCFD Disclosure', deadline: '2025-12-31', status: 'in-progress', category: 'tcfd', progress: 55, responsible: 'Risk Team' },
        { id: 'issb-2025', name: 'ISSB Standards', deadline: '2025-12-31', status: 'pending', category: 'issb', progress: 20 },
    ];

    // Extended Action Tasks
    const actionTasks: TaskAction[] = [
        { id: '1', title: '完成範疇三排放盤查', source: 'AI 洞察分析', priority: 'high', dueDate: '2025-03-15', status: 'doing', estimatedHours: 40, dependencies: ['2'] },
        { id: '2', title: '更新供應商永續評估', source: '合規缺口', priority: 'medium', dueDate: '2025-03-30', status: 'todo', estimatedHours: 24 },
        { id: '3', title: '建立碳成本預算', source: '風險評估', priority: 'critical', dueDate: '2025-02-28', status: 'todo', estimatedHours: 16 },
        { id: '4', title: '制定再生能源路徑圖', source: '最佳實踐', priority: 'high', dueDate: '2025-04-15', status: 'todo', estimatedHours: 32 },
        { id: '5', title: '完成 TCFD 情境分析', source: '法遵要求', priority: 'critical', dueDate: '2025-05-30', status: 'todo', estimatedHours: 80, dependencies: ['1', '3'] },
    ];

    // Evidence Files
    const evidenceFiles: EvidenceFile[] = [
        { id: '1', name: '2024_GHG_Inventory.xlsx', type: 'xlsx', size: 2456000, uploadedAt: '2025-01-15', uploadedBy: 'Carbon Team', relatedIndicator: 'GRI 305-1', verified: true, tags: ['碳排放', '範疇一', '驗證'] },
        { id: '2', name: 'Supplier_Assessment_2024.pdf', type: 'pdf', size: 8542000, uploadedAt: '2025-01-10', uploadedBy: 'Procurement', relatedIndicator: 'GRI 308-1', verified: true, tags: ['供應商', '評估'] },
        { id: '3', name: 'Social_Impact_Report_Q4.pdf', type: 'pdf', size: 12340000, uploadedAt: '2025-01-20', uploadedBy: 'HR Team', verified: false, tags: ['社會影響', '第四季'] },
        { id: '4', name: 'Energy_Consumption_Data.csv', type: 'other', size: 456000, uploadedAt: '2025-01-22', uploadedBy: 'Facilities', relatedIndicator: 'GRI 302-1', verified: true, tags: ['能源', '用電'] },
    ];

    // Board Questions
    const boardQuestions: BoardQuestion[] = [
        { id: '1', question: '2024 年碳排放較基準年減少多少百分比？', answer: '減少 15%，從 15,000 降至 12,500 tCO2e', status: 'ready', category: 'environmental', suggestedBy: '董事長', createdAt: '2025-01-25', lastUpdated: '2025-01-28' },
        { id: '2', question: '女性主管比例的長期目標為何？', answer: '2030 年達到 45%', status: 'ready', category: 'social', createdAt: '2025-01-26' },
        { id: '3', question: '碳費開徵後對公司的財務影響評估？', status: 'pending', category: 'financial', createdAt: '2025-01-27' },
        { id: '4', question: '供應商永續管理的具體措施？', status: 'draft', category: 'governance', createdAt: '2025-01-28' },
    ];

    // QA Check Items
    const qaCheckItems: QACheckItem[] = [
        { id: '1', category: '完整性', item: 'GRI 指標揭露完整性', status: 'passed', score: 95, details: '65 項指標中揭露 52 項', suggestions: ['補充 GRI 308-1', '完善 GRI 414-1'] },
        { id: '2', category: '一致性', item: '數據前後一致性', status: 'warning', score: 78, details: '發現 3 處不一致', suggestions: ['核對碳排放數據'] },
        { id: '3', category: '可驗證性', item: '證據資料完整性', status: 'passed', score: 88, details: '85% 指標有對應證據', suggestions: ['強化範疇三證據'] },
        { id: '4', category: '時效性', item: '揭露時效符合規範', status: 'passed', score: 100, details: '所有時程符合要求', suggestions: [] },
        { id: '5', category: '透明度', item: '揭露內容透明度', status: 'warning', score: 72, details: '部分敏感議題揭露不足', suggestions: ['增加風險說明'] },
    ];

    // Comprehensive Dashboard Metrics
    const dashboardMetrics: DashboardMetric[] = [
        { id: 'gri-coverage', label: 'GRI 指標覆蓋率', value: '92%', change: 5, trend: 'up', color: '#63a6b0', pillar: 'dashboard' },
        { id: 'carbon-reduction', label: '碳排放減量', value: '-15%', change: 3, trend: 'up', color: '#10B981', pillar: 'ai-factory' },
        { id: 'compliance-score', label: '合規得分', value: '88/100', change: 1, trend: 'stable', color: '#8B5CF6', pillar: 'compliance' },
        { id: 'task-completion', label: '任務完成率', value: '72%', change: 8, trend: 'up', color: '#F59E0B', pillar: 'action' },
        { id: 'evidence-ready', label: '證據就緒率', value: '85%', change: 5, trend: 'up', color: '#14B8A6', pillar: 'evidence' },
        { id: 'qa-score', label: 'QA 評分', value: '86/100', change: 3, trend: 'up', color: '#EC4899', pillar: 'ai-factory' },
        { id: 'diversity', label: '女性主管比例', value: '38%', change: 2, trend: 'up', color: '#EC4899', pillar: 'ai-factory' },
        { id: 'board-ready', label: '董座問答就緒', value: '75%', change: 10, trend: 'up', color: '#06B6D4', pillar: 'board' },
    ];

    // Mock Reports
    const [reports, setReports] = useState<ReportSummary[]>([
        { id: 'rep-2024', title: '2024 Annual Sustainability Report', year: 2024, framework: 'GRI Standards 2021', status: 'Trustworthy', completeness: 100, t5Status: 'trustworthy', qaScore: 92, author: 'ESG Team', updatedAt: '2025-01-15' },
        { id: 'rep-2023', title: '2023 ESG Impact Report', year: 2023, framework: 'GRI / TCFD', status: 'Published', completeness: 100, t5Status: 'trackable', qaScore: 88, author: 'Sustainability Dept', updatedAt: '2024-03-20' },
        { id: 'rep-2022', title: '2022 ESG Disclosure', year: 2022, framework: 'GRI Standards', status: 'Published', completeness: 95, t5Status: 'traceable', qaScore: 82, updatedAt: '2023-03-15' },
        { id: 'rep-current', title: '2025 Q1 Progress Update', year: 2025, framework: 'GRI Omni 2021', status: 'Draft', completeness: 45, t5Status: 'traceable', qaScore: 72, author: 'ESG Team', updatedAt: '2025-01-28' },
    ]);

    // ========================================
    // Effects
    // ========================================
    useEffect(() => {
        const hasSeen = localStorage.getItem('hasSeenUltimateReportOnboarding');
        if (!hasSeen) setShowOnboarding(true);
        setTimeout(() => setLoading(false), 800);
    }, []);

    // ========================================
    // Handlers
    // ========================================
    const handleOnboardingComplete = () => {
        localStorage.setItem('hasSeenUltimateReportOnboarding', 'true');
        setShowOnboarding(false);
    };

    const handleOCRScanComplete = async (result: any) => {
        setOcrResults(prev => [...prev, result]);
        try {
            const processedDoc = await docIntelligence.initializeDocument(result.text || "dummy contents");
            setDocumentCore(processedDoc);
        } catch (error) {
            console.error('Document processing error:', error);
        }
    };

    const handleOCRError = (error: string) => {
        console.error('OCR Error:', error);
    };

    const handleAutoFill = async () => {
        if (!documentCore) return;
        setIsAutoFilling(true);
        // Simulate AI mapping logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Auto-fill completed using intelligence mapping");
        setIsAutoFilling(false);
    };

    const enterVaultFrom5T = (protocol: string) => {
        setActivePillar('evidence');
        setSearchQuery(protocol); // Auto-filter vault
    };

    const getPillarColor = (pillar: string): string => {
        const colors: Record<string, string> = {
            dashboard: '#63a6b0', ai_factory: '#10B981', compliance: '#8B5CF6',
            action: '#F59E0B', evidence: '#14B8A6', board: '#06B6D4'
        };
        return colors[pillar.replace('-', '_')] || '#63a6b0';
    };

    const getPillarBg = (pillar: string): string => {
        const colors: Record<string, string> = {
            dashboard: 'bg-[#63a6b0]', ai_factory: 'bg-[#10B981]', compliance: 'bg-[#8B5CF6]',
            action: 'bg-[#F59E0B]', evidence: 'bg-[#14B8A6]', board: 'bg-[#06B6D4]'
        };
        return colors[pillar.replace('-', '_')] || 'bg-slate-500';
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            completed: 'text-emerald-400 bg-emerald-400/20',
            in_progress: 'text-amber-400 bg-amber-400/20',
            pending: 'text-slate-400 bg-slate-400/20',
            overdue: 'text-red-400 bg-red-400/20',
            passed: 'text-emerald-400 bg-emerald-400/20',
            warning: 'text-amber-400 bg-amber-400/20',
            failed: 'text-red-400 bg-red-400/20',
            ready: 'text-emerald-400 bg-emerald-400/20',
            draft: 'text-amber-400 bg-amber-400/20',
        };
        return colors[status] || 'text-slate-400 bg-slate-400/20';
    };

    const getPriorityIcon = (priority: string): React.ReactNode => {
        switch (priority) {
            case 'critical': return <AlertOctagon className="w-3 h-3 text-red-400" />;
            case 'high': return <AlertTriangle className="w-3 h-3 text-amber-400" />;
            case 'medium': return <Activity className="w-3 h-3 text-blue-400" />;
            default: return <Minus className="w-3 h-3 text-slate-400" />;
        }
    };

    // ========================================
    // Render Functions
    // ========================================

    const renderPillarNavigation = () => (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {pillars.map((pillar) => (
                <motion.button
                    key={pillar.id}
                    onClick={() => { setActivePillar(pillar.pillar as any); setActiveTab('overview'); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all whitespace-nowrap ${activePillar === pillar.pillar
                        ? `${getPillarBg(pillar.pillar || '')} text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]`
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                >
                    {pillar.icon}
                    {pillar.label}
                    {pillar.badge !== undefined && pillar.badge > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px]">{pillar.badge}</span>
                    )}
                </motion.button>
            ))}
        </div>
    );

    const renderDashboardPillar = () => (
        <div className="space-y-6">
            {/* 5T Protocol Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass rounded-2xl p-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase">{t('sustainability.evidence.vault')} 5T Protocol Status</h3>
                        {[
                            { t: 'Traceable', desc: '可溯源', status: true, color: '#10B981' },
                            { t: 'Trackable', desc: '可追蹤', status: true, color: '#F59E0B' },
                            { t: 'Trustworthy', desc: '可信賴', status: true, color: '#8B5CF6' },
                            { t: 'Transparent', desc: '透明公開', status: true, color: '#06B6D4' },
                            { t: 'Timely', desc: '即時更新', status: true, color: '#EC4899' },
                        ].map((item) => (
                            <div key={item.t} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status ? `bg-[${item.color}]/20` : 'bg-slate-500/20'
                                    }`}>
                                    <CheckCircle className={`w-4 h-4 ${item.status ? 'text-emerald-400' : 'text-slate-500'}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white">{item.t}</p>
                                    <p className="text-[9px] text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                            <Bell className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-300">3 個待處理事項</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-300">ESG Team</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
                {dashboardMetrics.map((metric, i) => (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="liquid-glass rounded-2xl p-6 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-xl ${metric.pillar === 'dashboard' ? 'bg-[#63a6b0]/20' :
                                metric.pillar === 'ai-factory' ? 'bg-[#10B981]/20' :
                                    metric.pillar === 'compliance' ? 'bg-[#8B5CF6]/20' :
                                        metric.pillar === 'action' ? 'bg-[#F59E0B]/20' :
                                            metric.pillar === 'evidence' ? 'bg-[#14B8A6]/20' :
                                                'bg-[#06B6D4]/20'
                                }`}>
                                {metric.icon || <BarChart className="w-5 h-5" style={{ color: metric.color }} />}
                            </div>
                            {metric.change !== undefined && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${metric.change > 0 ? 'bg-emerald-500/20 text-emerald-400' :
                                    metric.change < 0 ? 'bg-red-500/20 text-red-400' :
                                        'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {metric.change > 0 ? '+' : ''}{metric.change}%
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-light text-white">{metric.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{metric.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left: Reports & Frameworks */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Reports List */}
                    <div className="liquid-glass rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-light text-white flex items-center gap-3">
                                <FileText className="text-[#63a6b0]" /> 報告書總覽
                            </h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#63a6b0]/20' : 'bg-white/5'}`}>
                                    <Grid className="w-4 h-4 text-slate-400" />
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#63a6b0]/20' : 'bg-white/5'}`}>
                                    <List className="w-4 h-4 text-slate-400" />
                                </button>
                                <div className="relative ml-2">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="搜尋報告書..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}`}>
                            {reports.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map((r, i) => (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, scale: viewMode === 'grid' ? 0.95 : 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`${viewMode === 'grid' ? 'p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10' : 'flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-[#63a6b0]/5'} cursor-pointer transition-all`}
                                    onClick={() => setSelectedReport(r)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <FileCheck className="text-slate-400 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white">{r.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-slate-500">{r.framework}</span>
                                                <span className="text-[10px] text-slate-600">|</span>
                                                <span className="text-[10px] text-slate-500">{r.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {r.qaScore && (
                                            <div className="text-center">
                                                <p className="text-lg font-light text-white">{r.qaScore}</p>
                                                <p className="text-[9px] text-slate-500">QA Score</p>
                                            </div>
                                        )}
                                        <span className={`text-xs px-3 py-1 rounded-full ${r.status === 'Trustworthy' ? 'bg-emerald-500/20 text-emerald-400' :
                                            r.status === 'Published' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-white/10 text-slate-400'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <GRIComplianceChart disclosed={45} partial={12} gap={8} />
                        <ESGPerformanceChart scores={{ e: 78, s: 82, g: 88 }} />
                    </div>
                </div>

                {/* Right: Quick Actions & Framework Status */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Quick Actions */}
                    <div className="liquid-glass rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">{t('sustainability.pillars.action')}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: <ScanLine />, label: 'OCR 掃描', pillar: 'ai-factory', color: '#10B981' },
                                { icon: <Shield />, label: '合規檢查', pillar: 'compliance', color: '#8B5CF6' },
                                { icon: <Rocket />, label: '行動任務', pillar: 'action', color: '#F59E0B' },
                                { icon: <Database />, label: '證據管理', pillar: 'evidence', color: '#14B8A6' },
                            ].map((action) => (
                                <motion.button
                                    key={action.label}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActivePillar(action.pillar as any)}
                                    className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-2xl liquid-glass border border-white/20" style={{ color: action.color }}>
                                            {React.isValidElement(action.icon) ? React.cloneElement(action.icon as React.ReactElement<any>, { size: 20 }) : null}
                                        </div>
                                    </div>
                                    <span className="text-xs text-white">{action.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Framework Support */}
                    <div className="liquid-glass rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">{t('sustainability.compliance.frameworks')}</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'GRI Standards 2021', status: 'active', score: 92 },
                                { name: 'TCFD Climate Disclosure', status: 'active', score: 78 },
                                { name: 'SASB Industry Specific', status: 'beta', score: 65 },
                                { name: 'CDP Climate/Water', status: 'active', score: 72 },
                                { name: 'ISSB Standards', status: 'coming', score: 45 },
                            ].map((f, i) => (
                                <motion.div
                                    key={f.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                                >
                                    <span className="text-xs text-slate-300 flex-1">{f.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${f.score}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: f.status === 'coming' ? '#6B7280' : '#63a6b0' }}
                                            />
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${f.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                            f.status === 'beta' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {f.status === 'active' ? '啟用' : f.status === 'beta' ? 'Beta' : '即將'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAIFactoryPillar = () => (
        <div className="space-y-6">
            {/* AI Factory Tabs */}
            <div className="flex items-center gap-2 mb-6">
                {aiFactoryTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'scan' && (
                    <motion.div key="scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
                        <OCRDocumentScanner onScanComplete={handleOCRScanComplete} onError={handleOCRError} />
                    </motion.div>
                )}

                {activeTab === 'templates' && (
                    <motion.div key="templates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <MaterialTopicChart topics={[
                                    { name: '能源管理', impact: 95, color: '#10B981' },
                                    { name: '勞資關係', impact: 85, color: '#3B82F6' },
                                    { name: '供應鏈管理', impact: 90, color: '#F59E0B' },
                                    { name: '產品安全', impact: 80, color: '#8B5CF6' },
                                    { name: '公司治理', impact: 75, color: '#63a6b0' }
                                ]} />
                            </div>
                            <CarbonReductionChart years={[2021, 2022, 2023, 2024]} values={[15000, 13500, 12500, 11000]} targets={[15000, 14000, 13000, 10000]} />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'tables' && (
                    <motion.div key="tables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <SmartDataTable config={GRITableTemplate} onRowClick={(row) => console.log('Row clicked:', row)} onExport={(format) => console.log('Export:', format)} />
                    </motion.div>
                )}

                {activeTab === 'qa' && (
                    <motion.div key="qa" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                        {/* QA Score Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <ESGYearTrendChart data={[
                                { year: 2021, e: 65, s: 70, g: 75, total: 70 },
                                { year: 2022, e: 72, s: 75, g: 78, total: 75 },
                                { year: 2023, e: 80, s: 82, g: 85, total: 82 },
                                { year: 2024, e: 88, s: 90, g: 92, total: 90 }
                            ]} />
                            <div className="liquid-glass rounded-3xl p-6 text-center">
                                <div className="relative inline-block mb-4">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                        <motion.circle cx="64" cy="64" r="56" fill="none" stroke="#EC4899" strokeWidth="8" strokeLinecap="round" initial={{ strokeDasharray: '0 352' }} animate={{ strokeDasharray: '301 352' }} transition={{ duration: 2 }} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-light text-white">86</span>
                                        <span className="text-[10px] text-slate-400 uppercase">QA Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            <h4 className="text-sm font-bold text-white">QA 檢查結果</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {qaCheckItems.map((item) => (
                                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-white">{item.item}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                                                {item.status === 'passed' ? '通過' : item.status === 'warning' ? '警告' : '失敗'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                            </div>
                                            <span className="text-xs text-slate-400">{item.score}分</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">{item.details}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-3 gap-6">
                        <div className="liquid-glass rounded-3xl p-8">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-[#10B981]" /> AI 生成統計
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: '已處理文檔', value: '156' },
                                    { label: '提取指標', value: '2,847' },
                                    { label: '識別趨勢', value: '89' },
                                    { label: '生成洞察', value: '234' },
                                ].map((item) => (
                                    <div key={item.label} className="p-4 bg-white/5 rounded-xl text-center">
                                        <p className="text-2xl font-light text-white">{item.value}</p>
                                        <p className="text-[10px] text-slate-500">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <MaterialTopicChart topics={[
                            { name: '環境效益', impact: 90, color: '#10B981' },
                            { name: '社會責任', impact: 80, color: '#3B82F6' },
                            { name: '公司治理', impact: 70, color: '#F59E0B' },
                            { name: '技術創新', impact: 95, color: '#8B5CF6' },
                        ]} />
                        <div className="liquid-glass rounded-3xl p-8">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#F59E0B]" /> 最佳實踐識別
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { year: '2024', practice: 'TCFD 氣候情境分析', impact: '高' },
                                    { year: '2023', practice: '範疇三排放盤查', impact: '高' },
                                    { year: '2023', practice: '供應商永續評估', impact: '中' },
                                ].map((item, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <span className="text-xs font-bold text-[#10B981]">{item.year}</span>
                                        <span className="text-xs text-slate-300 flex-1 mx-3">{item.practice}</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">{item.impact}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderCompliancePillar = () => (
        <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: '待辦里程碑', value: '5', icon: <Clock />, color: '#F59E0B' },
                    { label: '進行中', value: '2', icon: <Activity />, color: '#3B82F6' },
                    { label: '已完成', value: '12', icon: <CheckCircle />, color: '#10B981' },
                    { label: '逾期', value: '0', icon: <AlertOctagon />, color: '#EF4444' },
                ].map((stat) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-2xl p-6 text-center">
                        <div className={`inline-flex p-3 rounded-xl mb-3`} style={{ backgroundColor: `${stat.color}20` }}>
                            {React.cloneElement(stat.icon as React.ReactElement, { size: 24, style: { color: stat.color } })}
                        </div>
                        <p className="text-2xl font-light text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Compliance Timeline */}
            <div className="liquid-glass rounded-3xl p-8">
                <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8B5CF6]" /> 法遵時程總覽
                </h4>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                    <div className="space-y-4">
                        {complianceMilestones.map((milestone, i) => (
                            <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative flex items-center gap-4 pl-12"
                            >
                                <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${milestone.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                                    milestone.status === 'in-progress' ? 'bg-amber-500 border-amber-500' :
                                        milestone.status === 'overdue' ? 'bg-red-500 border-red-500' :
                                            'bg-slate-700 border-slate-500'
                                    }`} />
                                <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-white">{milestone.name}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${milestone.category === 'tw-re份' ? 'bg-blue-500/20 text-blue-400' :
                                            milestone.category === 'cdp' ? 'bg-green-500/20 text-green-400' :
                                                milestone.category === 'tcfd' ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {milestone.category === 'tw-re份' ? '台灣' : milestone.category.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 截止: {milestone.deadline}</span>
                                        {milestone.responsible && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {milestone.responsible}</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${milestone.progress}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className={`h-full rounded-full ${milestone.status === 'completed' ? 'bg-emerald-500' :
                                                    milestone.status === 'overdue' ? 'bg-red-500' :
                                                        'bg-[#8B5CF6]'
                                                    }`}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 w-12">{milestone.progress}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEvidencePillar = () => (
        <div className="space-y-6">
            {/* Evidence Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: '總檔案數', value: '1,247', icon: <Folder />, color: '#14B8A6' },
                    { label: '已驗證', value: '1,058', icon: <CheckCircle />, color: '#10B981' },
                    { label: '待驗證', value: '189', icon: <Clock />, color: '#F59E0B' },
                    { label: '總容量', value: '2.4 GB', icon: <Database />, color: '#8B5CF6' },
                ].map((stat) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-2xl p-6 text-center">
                        <div className={`inline-flex p-3 rounded-xl mb-3`} style={{ backgroundColor: `${stat.color}20` }}>
                            {React.cloneElement(stat.icon as React.ReactElement, { size: 24, style: { color: stat.color } })}
                        </div>
                        <p className="text-2xl font-light text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Evidence Files */}
            <div className="liquid-glass rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Database className="w-5 h-5 text-[#14B8A6]" /> 證據庫檔案
                    </h4>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#14B8A6]/20 border border-[#14B8A6]/50 rounded-xl text-xs text-[#14B8A6] hover:bg-[#14B8A6]/30">
                            <Upload className="w-4 h-4" /> 上傳證據
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 hover:bg-white/10">
                            <Download className="w-4 h-4" /> 匯出清單
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] text-slate-500 uppercase tracking-wider border-b border-white/10">
                                <th className="pb-3 pl-2">檔案名稱</th>
                                <th className="pb-3">類型</th>
                                <th className="pb-3">大小</th>
                                <th className="pb-3">上傳者</th>
                                <th className="pb-3">相關指標</th>
                                <th className="pb-3">狀態</th>
                                <th className="pb-3">標籤</th>
                                <th className="pb-3 pr-2">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evidenceFiles.map((file, i) => (
                                <motion.tr
                                    key={file.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-3 pl-2">
                                        <div className="flex items-center gap-2">
                                            <File className="w-4 h-4 text-[#14B8A6]" />
                                            <span className="text-xs text-white">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs text-slate-400 uppercase">{file.type}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs text-slate-400">{file.uploadedBy}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs text-[#14B8A6]">{file.relatedIndicator || '-'}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${file.verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {file.verified ? '已驗證' : '待驗證'}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex gap-1">
                                            {file.tags.slice(0, 2).map((tag, j) => (
                                                <span key={j} className="text-[10px] px-1.5 py-0.5 bg-white/10 text-slate-400 rounded">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 pr-2">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                                <Eye className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                                <Download className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-3 h-3 text-slate-400" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderBoardPillar = () => (
        <div className="space-y-6">
            {/* Board Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: '待回答', value: '2', icon: <MessageSquare />, color: '#F59E0B' },
                    { label: '草稿中', value: '1', icon: <FileText />, color: '#3B82F6' },
                    { label: '已準備', value: '12', icon: <CheckCircle />, color: '#10B981' },
                    { label: '本月會議', value: '2/1', icon: <Calendar />, color: '#8B5CF6' },
                ].map((stat) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-2xl p-6 text-center">
                        <div className={`inline-flex p-3 rounded-xl mb-3`} style={{ backgroundColor: `${stat.color}20` }}>
                            {React.cloneElement(stat.icon as React.ReactElement, { size: 24, style: { color: stat.color } })}
                        </div>
                        <p className="text-2xl font-light text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Board Questions */}
            <div className="liquid-glass rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#06B6D4]" /> 董座問答準備
                    </h4>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#06B6D4]/20 border border-[#06B6D4]/50 rounded-xl text-xs text-[#06B6D4] hover:bg-[#06B6D4]/30">
                        <Plus className="w-4 h-4" /> 新增問題
                    </button>
                </div>

                <div className="space-y-4">
                    {boardQuestions.map((q, i) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${q.category === 'environmental' ? 'bg-emerald-500' :
                                        q.category === 'social' ? 'bg-blue-500' :
                                            q.category === 'governance' ? 'bg-purple-500' :
                                                'bg-amber-500'
                                        }`} />
                                    <span className="text-xs font-medium text-white">{q.question}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusColor(q.status)}`}>
                                    {q.status === 'ready' ? '已準備' : q.status === 'draft' ? '草稿' : '待處理'}
                                </span>
                            </div>
                            {q.answer && (
                                <div className="pl-5 mt-3 p-3 bg-white/5 rounded-xl border-l-2 border-[#06B6D4]">
                                    <p className="text-xs text-slate-300">{q.answer}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    {q.suggestedBy && <span>提問者: {q.suggestedBy}</span>}
                                    <span>建立: {q.createdAt}</span>
                                    {q.lastUpdated && <span>更新: {q.lastUpdated}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="text-xs text-[#06B6D4] hover:underline">{q.answer ? '編輯答案' : '撰寫答案'}</button>
                                    <button className="text-xs text-slate-400 hover:text-white">複製</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderActionPillar = () => (
        <div className="space-y-6">
            {/* Task Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: '待辦任務', value: '12', color: '#F59E0B' },
                    { label: '進行中', value: '5', color: '#3B82F6' },
                    { label: '已完成', value: '28', color: '#10B981' },
                    { label: '完成率', value: '72%', color: '#8B5CF6' },
                ].map((stat) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-2xl p-6 text-center">
                        <p className="text-2xl font-light text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Task Board */}
            <div className="liquid-glass rounded-3xl p-8">
                <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-[#F59E0B]" /> 知識轉行動工作板
                </h4>
                <div className="space-y-4">
                    {actionTasks.map((task, i) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {getPriorityIcon(task.priority)}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{task.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                        <span>來源: {task.source}</span>
                                        <span>|</span>
                                        <span>截止: {task.dueDate}</span>
                                        {task.estimatedHours && (
                                            <>
                                                <span>|</span>
                                                <span>預估: {task.estimatedHours}h</span>
                                            </>
                                        )}
                                        {task.dependencies && task.dependencies.length > 0 && (
                                            <>
                                                <span>|</span>
                                                <span className="text-[#06B6D4]">依賴: {task.dependencies.join(', ')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] px-3 py-1 rounded-full ${task.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                                    task.status === 'doing' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {task.status === 'done' ? '已完成' : task.status === 'doing' ? '進行中' : '待辦'}
                                </span>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ========================================
    // Main Render
    // ========================================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050c14] flex items-center justify-center">
                <div className="size-16 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <EsgServiceLayout
            title={t('sustainability.pageTitle')}
            activeId="report"
            progress={95}
        >
            <div
                data-uuid={core.uuid}
                data-timestamp={core.timestamp}
                data-component="UltimateSustainabilityReportPage"
                className="animate-fade-in"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-light text-white mb-1">
                            ESG GO <span className="text-[#63a6b0]">{t('sustainability.pageTitle')}</span>
                        </h1>
                        <p className="text-sm text-slate-400">
                            {t('sustainability.pageSubtitle')}
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#63a6b0] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,166,176,0.3)]">
                        <Plus className="w-4 h-4" /> {t('reportCenter.wizard.startBtn')}
                    </button>
                </div>

                {/* Pillar Navigation */}
                {renderPillarNavigation()}

                {/* Pillar Content */}
                <AnimatePresence mode="wait">
                    <motion.div key={activePillar} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                        {activePillar === 'dashboard' && renderDashboardPillar()}
                        {activePillar === 'ai-factory' && renderAIFactoryPillar()}
                        {activePillar === 'compliance' && renderCompliancePillar()}
                        {activePillar === 'action' && renderActionPillar()}
                        {activePillar === 'evidence' && renderEvidencePillar()}
                        {activePillar === 'board' && renderBoardPillar()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Enhanced Onboarding Overlay */}
            <ServiceOnboardingOverlay
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
                serviceName={t('sustainability.pageTitle')}
                serviceDesc={t('sustainability.pageSubtitle')}
                steps={[
                    { id: 'ai-factory', type: 'info', title: t('sustainability.pillars.factory'), description: 'OCR 識別、GRI 指標提取、多年範本對照、QA 評分系統', icon: <Cpu /> },
                    { id: 'compliance', type: 'info', title: t('sustainability.pillars.compliance'), description: '台灣申報時程、GRI/SASB/TCFD/ISSB 合規管理', icon: <Shield /> },
                    { id: 'action', type: 'info', title: t('sustainability.pillars.action'), description: '洞察轉任務、優先級排序、進度追蹤', icon: <Rocket /> },
                    { id: 'evidence', type: 'info', title: t('sustainability.pillars.evidence'), description: '證據管理、標籤分類、驗證狀態、秒級取證', icon: <Database /> },
                    { id: 'board', type: 'info', title: t('sustainability.pillars.board'), description: '董座問答準備、情境模擬、Q&A 講稿生成', icon: <MessageSquare /> },
                ]}
            />
        </EsgServiceLayout>
    );
};

export default EnhancedSustainabilityReportPage;
