/**
 * ⛪ HolySustainabilityHub - InfoOne 永續報告中心
 * 
 * 基於「高對比企業深色風格」視覺規範實作的永續報告中心。
 * 
 * 核心功能：
 * 1. 永續報告管理中心 - 視覺化儀表板、圓形進度環、關鍵指標卡片
 * 2. OCR 處理中心 - 即時顯示文件掃描進度、置信度與 5T 驗證狀態
 * 3. AI 洞察側欄 - 右側即時分析情緒趨勢、關鍵主題提及與減碳建議
 * 
 * 5T Protocol: Traceable · Trackable · Transparent · Tangible · Trustworthy
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, Leaf, Scan, BarChart4, FolderClosed,
    Settings as SettingsIcon, Bell, Search as SearchIcon, ShieldCheck, Terminal as TerminalIcon,
    Zap, Eye, FileEdit, Droplets, Users, Cloud, ArrowUpRight, Sparkles,
    FileCode, FileImage, TrendingUp, LayoutGrid as Grid, ShieldAlert, BadgeCheck,
    CheckCircle, AlertTriangle, Clock, Target, Activity, Cpu, Database, Brain,
    MessageSquare, FileBarChart, Award, Folder, Loader2, Upload, X, EyeOff,
    TrendingDown, Lock, Unlock, RefreshCw, Download, Filter, ChevronRight,
    BarChart3, BarChart2, PieChart, LineChart, Hexagon, Circle, Square
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';
import { TrustworthyLock } from '@/utils/TrustworthyLock';

// ============================================
// 類型定義
// ============================================

interface OCRProcessingItem {
    id: string;
    fileName: string;
    status: 'pending' | 'scanning' | 'processing' | 'completed' | 'verified';
    progress: number;
    confidence: number;
    t5Status: 'pending' | 'traceable' | 'trackable' | 'trustworthy';
    scannedAt?: number;
    hashLock?: string;
}

interface DashboardMetric {
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    change?: number;
    trend: 'up' | 'down' | 'stable';
    color: string;
    icon: React.ReactNode;
}

interface AIInsight {
    id: string;
    type: 'sentiment' | 'topic' | 'recommendation' | 'alert';
    title: string;
    description: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidence: number;
}

interface ComplianceMilestone {
    id: string;
    name: string;
    framework: string;
    deadline: string;
    status: 'pending' | 'in-progress' | 'completed' | 'overdue';
    progress: number;
    color: string;
}

// ============================================
// 進度環組件 - Progress Ring Component
// ============================================

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    showPercentage?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 80,
    strokeWidth = 6,
    color = '#00ffff',
    showPercentage = true
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                className="progress-ring-holy"
                width={size}
                height={size}
            >
                {/* 背景圈 */}
                <circle
                    stroke="rgba(0, 255, 255, 0.1)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* 進度圈 */}
                <circle
                    className="progress-ring-holy__circle"
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        filter: `drop-shadow(0 0 4px ${color}50)`
                    }}
                />
            </svg>
            {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white" style={{ textShadow: `0 0 10px ${color}` }}>
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
        </div>
    );
};

// ============================================
// 主組件 - Main Component
// ============================================

const HolySustainabilityHub: React.FC = () => {
    const { t } = useTranslation();
    // 5T Protocol: Core Identity
    const core = useMemo(() =>
        ComponentCoreFactory.create('HolySustainabilityHub'),
        []);

    // 狀態管理
    const [activeTab, setActiveTab] = useState<'dashboard' | 'ocr' | 'reports' | 'compliance'>('dashboard');
    const [activeTheme, setActiveTheme] = useState<'liquid' | 'solar' | 'night'>('liquid');
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [ocrItems, setOcrItems] = useState<OCRProcessingItem[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    // 模擬 OCR 掃描
    const simulateOCR = useCallback(async () => {
        const newItem: OCRProcessingItem = {
            id: `ocr-${Date.now()}`,
            fileName: `ESG_Report_2024_${Math.floor(Math.random() * 1000)}.pdf`,
            status: 'scanning',
            progress: 0,
            confidence: 0,
            t5Status: 'pending'
        };

        setOcrItems(prev => [...prev, newItem]);
        setIsScanning(true);

        // 模擬掃描過程
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setOcrItems(prev => prev.map(item =>
                item.id === newItem.id
                    ? { ...item, progress: i, status: i < 100 ? 'scanning' : 'processing' }
                    : item
            ));
        }

        // 模擬處理完成並添加 5T 驗證
        const confidence = 0.85 + Math.random() * 0.14;
        const hashLock = await TrustworthyLock.generateHash({
            document: newItem.fileName,
            timestamp: Date.now()
        });

        setOcrItems(prev => prev.map(item =>
            item.id === newItem.id
                ? {
                    ...item,
                    status: 'completed',
                    confidence,
                    t5Status: 'trustworthy',
                    scannedAt: Date.now(),
                    hashLock
                }
                : item
        ));
        setIsScanning(false);
    }, []);

    // 儀表板指標數據
    const dashboardMetrics: DashboardMetric[] = useMemo(() => [
        {
            id: 'gri-coverage',
            label: t('holyHub.metrics.griCoverage'),
            value: 92,
            unit: '%',
            change: 5,
            trend: 'up',
            color: '#00ffff',
            icon: <BarChart3 className="w-5 h-5" />
        },
        {
            id: 'carbon-reduction',
            label: t('holyHub.metrics.carbonReduction'),
            value: -15,
            unit: '%',
            change: 3,
            trend: 'up',
            color: '#10B981',
            icon: <Leaf className="w-5 h-5" />
        },
        {
            id: 'compliance-score',
            label: t('holyHub.metrics.complianceScore'),
            value: 88,
            unit: '/100',
            change: 1,
            trend: 'stable',
            color: '#8B5CF6',
            icon: <ShieldCheck className="w-5 h-5" />
        },
        {
            id: 'evidence-ready',
            label: t('holyHub.metrics.evidenceReady'),
            value: 85,
            unit: '%',
            change: 5,
            trend: 'up',
            color: '#14B8A6',
            icon: <Database className="w-5 h-5" />
        },
        {
            id: 'ai-score',
            label: t('holyHub.metrics.aiScore'),
            value: 86,
            unit: '/100',
            change: 3,
            trend: 'up',
            color: '#F59E0B',
            icon: <Brain className="w-5 h-5" />
        },
        {
            id: 'diversity',
            label: t('holyHub.metrics.diversity'),
            value: 38,
            unit: '%',
            change: 2,
            trend: 'up',
            color: '#EC4899',
            icon: <Users className="w-5 h-5" />
        },
    ], [t]);

    // AI 洞察數據
    const aiInsights: AIInsight[] = useMemo(() => [
        {
            id: 'insight-1',
            type: 'sentiment',
            title: '整體情緒趨勢',
            description: '投資者對公司 ESG 表現呈正向態度',
            sentiment: 'positive',
            confidence: 0.92
        },
        {
            id: 'insight-2',
            type: 'topic',
            title: '關鍵主題',
            description: '碳排放減量、再生能源採購為熱門議題',
            confidence: 0.88
        },
        {
            id: 'insight-3',
            type: 'recommendation',
            title: '減碳建議',
            description: '建議加速 PPA 協議以達成 2030 減碳目標',
            confidence: 0.85
        },
        {
            id: 'insight-4',
            type: 'alert',
            title: '法規提醒',
            description: '2025 年碳費申報截止日期接近',
            confidence: 0.95
        }
    ], []);

    // 合規里程碑
    const milestones: ComplianceMilestone[] = useMemo(() => [
        { id: 'tw-2025', name: '2025 ESG 申報', framework: 'TW-ESG', deadline: '2025-07-31', status: 'in-progress', progress: 65, color: '#00ffff' },
        { id: 'cdp-2025', name: 'CDP Climate', framework: 'CDP', deadline: '2025-07-24', status: 'pending', progress: 30, color: '#10B981' },
        { id: 'gri-2025', name: 'GRI Standards', framework: 'GRI', deadline: '2025-12-31', status: 'pending', progress: 45, color: '#8B5CF6' },
        { id: 'tcfd-2025', name: 'TCFD Disclosure', framework: 'TCFD', deadline: '2025-12-31', status: 'in-progress', progress: 55, color: '#F59E0B' },
    ], []);

    // 渲染標籤導航
    const renderTabNavigation = () => (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {[
                { id: 'dashboard', label: t('holyHub.tabs.dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
                { id: 'ocr', label: t('holyHub.tabs.ocr'), icon: <Scan className="w-4 h-4" /> },
                { id: 'reports', label: t('holyHub.tabs.reports'), icon: <FileText className="w-4 h-4" /> },
                { id: 'compliance', label: t('holyHub.tabs.compliance'), icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((tab) => (
                <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap
                        ${activeTab === tab.id
                            ? 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
                        }
                    `}
                >
                    {tab.icon}
                    {tab.label}
                </motion.button>
            ))}
        </div>
    );

    // 渲染儀表板視圖
    const renderDashboardView = () => (
        <div className="space-y-6">
            {/* 5T 協議狀態列 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass-holy rounded-2xl p-5"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#00ffff]" />
                        <span className="text-sm font-bold text-white">5T Protocol Status</span>
                    </div>
                    <div className="flex items-center gap-6 flex-wrap">
                        {[
                            { t: 'Traceable', desc: t('holyHub.status.traceable'), status: true, color: '#10B981' },
                            { t: 'Trackable', desc: t('holyHub.status.trackable'), status: true, color: '#F59E0B' },
                            { t: 'Trustworthy', desc: t('holyHub.status.trustworthy'), status: true, color: '#8B5CF6' },
                            { t: 'Transparent', desc: t('holyHub.status.transparent'), status: true, color: '#00ffff' },
                            { t: 'Tangible', desc: t('holyHub.status.tangible'), status: true, color: '#EC4899' },
                        ].map((item) => (
                            <div key={item.t} className="flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${item.color}20` }}
                                >
                                    {item.status ? (
                                        <CheckCircle className="w-4 h-4" style={{ color: item.color }} />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-slate-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">{item.t}</p>
                                    <p className="text-[9px] text-slate-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* 指標卡片網格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {dashboardMetrics.map((metric, index) => (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="liquid-glass-holy rounded-2xl p-5 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div
                                className="p-2 rounded-xl"
                                style={{ backgroundColor: `${metric.color}20` }}
                            >
                                <span style={{ color: metric.color }}>{metric.icon}</span>
                            </div>
                            {metric.change !== undefined && (
                                <span className={`
                                    text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1
                                    ${metric.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                                        metric.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                                            'bg-slate-500/20 text-slate-400'}
                                `}>
                                    {metric.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> :
                                        metric.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" /> : null}
                                    {metric.change > 0 ? '+' : ''}{metric.change}%
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-light text-white">
                            {metric.value}
                            <span className="text-sm text-slate-400 ml-0.5">{metric.unit}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{metric.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* 主內容區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左側：合規里程碑 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="liquid-glass-holy rounded-2xl p-6">
                        <h3 className="text-lg font-light text-white flex items-center gap-3 mb-6">
                            <Target className="text-[#00ffff]" />
                            {t('holyHub.milestones.title')}
                        </h3>
                        <div className="space-y-4">
                            {milestones.map((milestone) => (
                                <div key={milestone.id} className="flex items-center gap-4">
                                    <ProgressRing
                                        progress={milestone.progress}
                                        size={50}
                                        strokeWidth={4}
                                        color={milestone.color}
                                        showPercentage={false}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-white">{milestone.name}</span>
                                            <span className={`
                                                text-[10px] px-2 py-0.5 rounded-full
                                                ${milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    milestone.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                                                        milestone.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-slate-500/20 text-slate-400'}
                                            `}>
                                                {milestone.status === 'in-progress' ? t('holyHub.milestones.inProgress') :
                                                    milestone.status === 'completed' ? t('holyHub.milestones.completed') :
                                                        milestone.status === 'overdue' ? t('holyHub.milestones.overdue') : t('holyHub.milestones.pending')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>{milestone.framework}</span>
                                            <span>截止: {milestone.deadline}</span>
                                        </div>
                                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${milestone.progress}%` }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: milestone.color }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 右側：AI 洞察 */}
                <div className="space-y-6">
                    <div className="liquid-glass-holy rounded-2xl p-6">
                        <h3 className="text-lg font-light text-white flex items-center gap-3 mb-6">
                            <Brain className="text-[#00ffff]" />
                            {t('holyHub.aiInsights.title')}
                        </h3>
                        <div className="space-y-4">
                            {aiInsights.map((insight) => (
                                <motion.div
                                    key={insight.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#00ffff]/30 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`
                                            text-[10px] font-bold uppercase px-2 py-0.5 rounded
                                            ${insight.type === 'sentiment' ? 'bg-blue-500/20 text-blue-400' :
                                                insight.type === 'topic' ? 'bg-purple-500/20 text-purple-400' :
                                                    insight.type === 'recommendation' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        'bg-amber-500/20 text-amber-400'}
                                        `}>
                                            {insight.type === 'sentiment' ? t('holyHub.aiInsights.types.sentiment') :
                                                insight.type === 'topic' ? t('holyHub.aiInsights.types.topic') :
                                                    insight.type === 'recommendation' ? t('holyHub.aiInsights.types.recommendation') : t('holyHub.aiInsights.types.alert')}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            {Math.round(insight.confidence * 100)}% {t('holyHub.aiInsights.confidence')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-white mb-1">{insight.title}</p>
                                    <p className="text-xs text-slate-400">{insight.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // 渲染 OCR 處理中心視圖
    const renderOCRView = () => (
        <div className="space-y-6">
            {/* OCR 掃描控制 */}
            <div className="liquid-glass-holy rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-light text-white flex items-center gap-3">
                        <Scan className="text-[#00ffff]" />
                        {t('holyHub.ocr.title')}
                    </h3>
                    <button
                        onClick={simulateOCR}
                        disabled={isScanning}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                            ${isScanning
                                ? 'bg-slate-500/20 text-slate-400 cursor-not-allowed'
                                : 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30 hover:bg-[#00ffff]/30'
                            }
                        `}
                    >
                        {isScanning ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> {t('holyHub.ocr.scanning')}...</>
                        ) : (
                            <><Upload className="w-4 h-4" /> {t('holyHub.ocr.addScan')}</>
                        )}
                    </button>
                </div>

                {/* 掃描說明 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        { icon: <Scan className="w-5 h-5" />, title: t('holyHub.ocr.features.smart'), desc: t('holyHub.ocr.features.smartDesc') },
                        { icon: <Activity className="w-5 h-5" />, title: t('holyHub.ocr.features.realtime'), desc: t('holyHub.ocr.features.realtimeDesc') },
                        { icon: <Lock className="w-5 h-5" />, title: t('holyHub.ocr.features.trust'), desc: t('holyHub.ocr.features.trustDesc') },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <div className="p-2 bg-[#00ffff]/10 rounded-lg text-[#00ffff]">
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{item.title}</p>
                                <p className="text-[10px] text-slate-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* OCR 處理列表 */}
                <div className="space-y-3">
                    {ocrItems.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <Scan className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>{t('holyHub.ocr.noItems')}</p>
                            <p className="text-xs mt-1">{t('holyHub.ocr.startPrompt')}</p>
                        </div>
                    ) : (
                        ocrItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative p-4 bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                            >
                                {/* 掃描線動畫 */}
                                {(item.status === 'scanning' || item.status === 'processing') && (
                                    <div className="absolute inset-0 scan-line-overlay">
                                        <div className="scan-line animate-scan-horizontal" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        {/* 狀態圖標 */}
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center
                                            ${item.status === 'completed' ? 'bg-emerald-500/20' :
                                                item.status === 'scanning' || item.status === 'processing' ? 'bg-[#00ffff]/20' :
                                                    'bg-slate-500/20'}
                                        `}>
                                            {item.status === 'completed' ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            ) : item.status === 'scanning' || item.status === 'processing' ? (
                                                <Loader2 className="w-5 h-5 text-[#00ffff] animate-spin" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>

                                        {/* 文件資訊 */}
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.fileName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.status === 'scanning' && (
                                                    <span className="text-[10px] text-[#00ffff]">
                                                        {t('holyHub.ocr.scanning')}... {item.progress}%
                                                    </span>
                                                )}
                                                {item.status === 'processing' && (
                                                    <span className="text-[10px] text-amber-400">
                                                        {t('holyHub.ocr.processing')}...
                                                    </span>
                                                )}
                                                {item.status === 'completed' && item.confidence > 0 && (
                                                    <span className="text-[10px] text-emerald-400">
                                                        {t('holyHub.aiInsights.confidence')}: {Math.round(item.confidence * 100)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5T 狀態 */}
                                    <div className="flex items-center gap-3">
                                        {item.t5Status === 'trustworthy' && item.hashLock && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-[#8B5CF6]/20 rounded-lg">
                                                <Lock className="w-3 h-3 text-[#8B5CF6]" />
                                                <span className="text-[10px] text-[#8B5CF6]">Trustworthy</span>
                                            </div>
                                        )}
                                        {item.t5Status === 'trackable' && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-[#F59E0B]/20 rounded-lg">
                                                <Activity className="w-3 h-3 text-[#F59E0B]" />
                                                <span className="text-[10px] text-[#F59E0B]">Trackable</span>
                                            </div>
                                        )}
                                        {item.t5Status === 'traceable' && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-[#10B981]/20 rounded-lg">
                                                <Eye className="w-3 h-3 text-[#10B981]" />
                                                <span className="text-[10px] text-[#10B981]">Traceable</span>
                                            </div>
                                        )}
                                        {item.t5Status === 'pending' && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-slate-500/20 rounded-lg">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] text-slate-400">Pending</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 進度條 */}
                                {(item.status === 'scanning' || item.status === 'processing') && (
                                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.progress}%` }}
                                            className="h-full bg-gradient-to-r from-[#00ffff] to-[#00cccc]"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    // 渲染主視圖
    const renderMainView = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboardView();
            case 'ocr':
                return renderOCRView();
            case 'reports':
                return (
                    <div className="liquid-glass-holy rounded-2xl p-12 text-center text-slate-500">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">{t('holyHub.tabs.reports')}</p>
                        <p className="text-xs mt-2">Coming soon...</p>
                    </div>
                );
            case 'compliance':
                return (
                    <div className="liquid-glass-holy rounded-2xl p-12 text-center text-slate-500">
                        <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">{t('holyHub.tabs.compliance')}</p>
                        <p className="text-xs mt-2">Coming soon...</p>
                    </div>
                );
            default:
                console.warn(`[HolySustainabilityHub] Unexpected activeTab: ${activeTab}`);
                return (
                    <div className="flex flex-col items-center justify-center p-20 text-white/40">
                        <p>No content available for this section.</p>
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className="mt-4 px-4 py-2 bg-[#00ffff]/20 border border-[#00ffff]/40 rounded-lg text-[#00ffff] hover:bg-[#00ffff]/30 transition-all"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                );
        }
    };

    // Visibility Trigger
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        console.info('[HolySustainabilityHub] Component Mounted', { core });
        return () => {
            clearTimeout(timer);
            console.info('[HolySustainabilityHub] Component Unmounted');
        };
    }, [core]);

    // ========================================
    // 渲染
    // ========================================

    return (
        <div
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
            data-component="HolySustainabilityHub"
            className={`min-h-screen p-6 custom-scrollbar-holy transition-all duration-1000 ${isLoaded ? 'is-loaded' : 'not-loaded'} ${activeTheme === 'solar' ? 'theme-solar-glass bg-white text-slate-900' :
                activeTheme === 'night' ? 'theme-night-glow bg-black text-cyan-400' :
                    'theme-liquid-glass bg-[#050c14] text-white'
                }`}
        >
            {/* 頁面標題區域 */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-light text-white flex items-center gap-3">
                        <Hexagon className="w-7 h-7 text-[#00ffff] icon-bloom" />
                        {t('holyHub.title')}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {t('holyHub.subtitle')}
                    </p>
                </div>

                {/* 搜尋與通知 */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={t('ui.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="liquid-input-holy pl-9 pr-4 py-2 rounded-xl text-sm w-64"
                        />
                    </div>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <Bell className="w-5 h-5 text-slate-400" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ffff] rounded-full text-[10px] text-[#050a0a] flex items-center justify-center font-bold">
                            3
                        </span>
                    </button>
                </div>
            </div>

            {/* 裝飾線 */}
            <div className="refraction-line mb-6" />

            {/* 標籤與主題切換 */}
            <div className="flex items-center justify-between mb-2">
                {renderTabNavigation()}
                <div className="flex items-center gap-2 p-1 bg-black/20 rounded-lg backdrop-blur-sm border border-white/5">
                    <button
                        onClick={() => setActiveTheme('liquid')}
                        className={`px-3 py-1 text-[10px] rounded transition-all ${activeTheme === 'liquid' ? 'bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]/30' : 'text-white/40 hover:text-white'}`}
                    >
                        Liquid
                    </button>
                    <button
                        onClick={() => setActiveTheme('solar')}
                        className={`px-3 py-1 text-[10px] rounded transition-all ${activeTheme === 'solar' ? 'bg-teal-600/20 text-teal-600 border border-teal-600/30' : 'text-white/40 hover:text-white'}`}
                    >
                        Solar
                    </button>
                    <button
                        onClick={() => setActiveTheme('night')}
                        className={`px-3 py-1 text-[10px] rounded transition-all ${activeTheme === 'night' ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'text-white/40 hover:text-white'}`}
                    >
                        Night
                    </button>
                </div>
            </div>

            {/* 主內容 */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderMainView()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default HolySustainabilityHub;
