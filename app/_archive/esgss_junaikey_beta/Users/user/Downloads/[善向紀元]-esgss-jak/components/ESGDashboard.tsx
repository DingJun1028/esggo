// ESG儀表板元件
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import {
    Leaf, Users, Shield, TrendingUp, Target,
    Award, AlertTriangle, CheckCircle, BarChart3,
    Globe, Heart, Scale, Download, RefreshCw,
    Calendar, Activity, PieChart, X, FileText,
    Droplets, Bot, MessageCircle, Sparkles,
    Send, Minimize2, Maximize2, User
} from 'lucide-react';
import {
    esgCalculator,
    esgValidator,
    ESGReportGenerator,
    type ESGReport,
    type CarbonEmission,
    type SocialImpact,
    type GovernanceScore
} from '../services/esg';
import { useResponsive } from '../hooks/useResponsive';
import { esgAiService, type ESGAiAnalysis } from '../services/esgAiService';

export interface ESGDashboardProps {
    language: Language;
    companyId?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ESGDashboard: React.FC<ESGDashboardProps> = ({
    language,
    companyId = 'default_company',
    isOpen,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'environmental' | 'social' | 'governance' | 'reports' | 'ai-insights'>('overview');
    const [esgReport, setEsgReport] = useState<ESGReport | null>(null);
    const [carbonData, setCarbonData] = useState<CarbonEmission[]>([]);
    const [socialData, setSocialData] = useState<SocialImpact[]>([]);
    const [governanceData, setGovernanceData] = useState<GovernanceScore | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<ESGAiAnalysis | null>(null);
    const [showAiAssistant, setShowAiAssistant] = useState(false);
    const { isMobile } = useResponsive();

    const isZh = language === 'zh-TW';

    useEffect(() => {
        if (!isOpen) return;

        loadESGData();
    }, [isOpen, companyId]);

    const loadESGData = async () => {
        setLoading(true);
        try {
            // 模擬數據載入 (實際應用中會從API獲取)
            const mockCarbonData: CarbonEmission[] = [
                {
                    id: '1',
                    companyId,
                    year: 2023,
                    scope1: 1500,
                    scope2: 2500,
                    scope3: 8000,
                    total: 12000,
                    reductionTarget: 1500,
                    reductionAchieved: 800,
                    verificationStatus: 'verified',
                    dataSource: 'SBTi',
                    lastUpdated: Date.now()
                }
            ];

            const mockSocialData: SocialImpact[] = [
                {
                    id: '1',
                    companyId,
                    category: 'employees',
                    metric: 'employee_satisfaction',
                    value: 85,
                    target: 90,
                    unit: '%',
                    year: 2023,
                    verified: true,
                    stakeholders: ['employees', 'management']
                },
                {
                    id: '2',
                    companyId,
                    category: 'diversity',
                    metric: 'diversity_index',
                    value: 78,
                    target: 85,
                    unit: '%',
                    year: 2023,
                    verified: true,
                    stakeholders: ['hr', 'board']
                }
            ];

            const mockGovernanceData: GovernanceScore = {
                id: '1',
                companyId,
                year: 2023,
                boardComposition: 88,
                executiveCompensation: 92,
                shareholderRights: 85,
                auditQuality: 90,
                riskManagement: 87,
                overallScore: 88,
                rating: 'AA',
                lastAssessed: Date.now()
            };

            setCarbonData(mockCarbonData);
            setSocialData(mockSocialData);
            setGovernanceData(mockGovernanceData);

            // 生成ESG報告
            const report = ESGReportGenerator.generateAnnualReport(companyId, 2023, {
                carbonData: mockCarbonData,
                socialData: mockSocialData,
                governanceData: mockGovernanceData
            });
            setEsgReport(report);

            // 生成AI分析
            const companyInfo = { companyId, name: '示例公司', industry: '科技' };
            const analysis = await esgAiService.analyzeESGData(
                companyInfo,
                mockCarbonData,
                mockSocialData,
                mockGovernanceData
            );
            setAiAnalysis(analysis);

        } catch (error) {
            console.error('Failed to load ESG data:', error);
        } finally {
            setLoading(false);
        }
    };

    const ScoreCard: React.FC<{
        title: string;
        score: number;
        maxScore?: number;
        icon: React.ElementType;
        color: string;
        subtitle?: string;
    }> = ({ title, score, maxScore = 100, icon: Icon, color, subtitle }) => (
        <div className={`bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {score.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        /{maxScore}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}

                {/* 進度條 */}
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${color.replace('bg-', 'bg-')}`}
                        style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );

    if (!isOpen || !esgReport) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className={`${isMobile ? 'w-full h-full' : 'max-w-7xl w-full max-h-[95vh]'} bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col`}>
                    {/* 標題欄 */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isZh ? 'ESG永續儀表板' : 'ESG Sustainability Dashboard'}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isZh ? '環境、社會、治理綜合評估' : 'Environmental, Social, Governance Assessment'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <div className={`w-2 h-2 rounded-full ${esgReport.rating === 'A+' || esgReport.rating === 'A' ? 'bg-green-500' :
                                    esgReport.rating === 'B+' || esgReport.rating === 'B' ? 'bg-yellow-500' :
                                        'bg-red-500'
                                    }`} />
                                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                    {esgReport.rating} 評級
                                </span>
                            </div>

                            {/* AI助手按鈕 */}
                            <button
                                onClick={() => setShowAiAssistant(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                            >
                                <Bot className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {isZh ? 'AI助手' : 'AI Assistant'}
                                </span>
                            </button>

                            <button
                                onClick={loadESGData}
                                disabled={loading}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* 標籤頁 */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        {[
                            { id: 'overview', label: isZh ? '總覽' : 'Overview', icon: BarChart3 },
                            { id: 'environmental', label: isZh ? '環境' : 'Environmental', icon: Leaf },
                            { id: 'social', label: isZh ? '社會' : 'Social', icon: Users },
                            { id: 'governance', label: isZh ? '治理' : 'Governance', icon: Shield },
                            { id: 'ai-insights', label: isZh ? 'AI洞見' : 'AI Insights', icon: Sparkles },
                            { id: 'reports', label: isZh ? '報告' : 'Reports', icon: FileText }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 內容區域 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* 整體評分卡片 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <ScoreCard
                                        title={isZh ? '整體ESG評分' : 'Overall ESG Score'}
                                        score={esgReport.overallScore}
                                        icon={Award}
                                        color="bg-blue-500"
                                        subtitle={`${esgReport.rating} 評級`}
                                    />

                                    <ScoreCard
                                        title={isZh ? '環境評分' : 'Environmental Score'}
                                        score={esgReport.environmental.carbonFootprint > 0 ?
                                            Math.max(0, 100 - (esgReport.environmental.carbonFootprint / 10000) * 100) : 85}
                                        icon={Leaf}
                                        color="bg-green-500"
                                    />

                                    <ScoreCard
                                        title={isZh ? '社會評分' : 'Social Score'}
                                        score={(esgReport.social.employeeSatisfaction + esgReport.social.diversityIndex) / 2}
                                        icon={Heart}
                                        color="bg-pink-500"
                                    />

                                    <ScoreCard
                                        title={isZh ? '治理評分' : 'Governance Score'}
                                        score={governanceData?.overallScore || 0}
                                        icon={Shield}
                                        color="bg-purple-500"
                                    />
                                </div>

                                {/* 關鍵指標 */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 碳排放概覽 */}
                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Leaf className="w-5 h-5 text-green-500" />
                                            {isZh ? '碳排放概覽' : 'Carbon Emissions Overview'}
                                        </h3>

                                        {carbonData.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {isZh ? '總排放量' : 'Total Emissions'}
                                                    </span>
                                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {carbonData[0]?.total.toLocaleString()} 噸 CO₂e
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Scope 1</span>
                                                        <span>{carbonData[0]?.scope1.toLocaleString()} 噸</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Scope 2</span>
                                                        <span>{carbonData[0]?.scope2.toLocaleString()} 噸</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Scope 3</span>
                                                        <span>{carbonData[0]?.scope3.toLocaleString()} 噸</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {isZh ? '減排進度' : 'Reduction Progress'}
                                                        </span>
                                                        <span className="text-sm font-medium text-green-600">
                                                            {carbonData[0] ? ((carbonData[0].reductionAchieved / carbonData[0].reductionTarget) * 100).toFixed(1) : 0}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                                                        <div
                                                            className="bg-green-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${carbonData[0] ? Math.min(100, (carbonData[0].reductionAchieved / carbonData[0].reductionTarget) * 100) : 0}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SDGs貢獻 */}
                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-blue-500" />
                                            {isZh ? 'SDGs永續發展目標' : 'SDGs Contribution'}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { goal: 3, name: isZh ? '良好健康' : 'Good Health', progress: 85 },
                                                { goal: 7, name: isZh ? '乾淨能源' : 'Clean Energy', progress: 78 },
                                                { goal: 8, name: isZh ? '體面工作' : 'Decent Work', progress: 82 },
                                                { goal: 12, name: isZh ? '責任消費' : 'Responsible Consumption', progress: 75 },
                                                { goal: 13, name: isZh ? '氣候行動' : 'Climate Action', progress: 88 },
                                                { goal: 16, name: isZh ? '和平正義' : 'Peace & Justice', progress: 70 }
                                            ].map(sdg => (
                                                <div key={sdg.goal} className="text-center">
                                                    <div className="text-lg font-bold text-blue-600 mb-1">
                                                        SDG {sdg.goal}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                        {sdg.name}
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${sdg.progress}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                        {sdg.progress}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'environmental' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isZh ? '環境表現指標' : 'Environmental Performance Metrics'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                    <Leaf className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {isZh ? '碳足跡' : 'Carbon Footprint'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Scope 1+2+3
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {esgReport.environmental.carbonFootprint.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    噸 CO₂e
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                    <Activity className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {isZh ? '能源消耗' : 'Energy Consumption'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        MWh/年
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {esgReport.environmental.energyConsumption.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    MWh
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                                                    <Droplets className="w-5 h-5 text-cyan-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                                        {isZh ? '水資源使用' : 'Water Usage'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        立方米
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {esgReport.environmental.waterUsage.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    m³
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 氣候風險評估 */}
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                                        {isZh ? '氣候變遷風險評估' : 'Climate Change Risk Assessment'}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600 mb-2">高風險</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '轉型風險評估' : 'Transition Risk'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600 mb-2">中風險</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '物理風險評估' : 'Physical Risk'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600 mb-2">高機會</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '市場機會' : 'Market Opportunities'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isZh ? '社會影響指標' : 'Social Impact Metrics'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {socialData.map(metric => (
                                        <div key={metric.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
                                                        <Heart className="w-5 h-5 text-pink-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                                                            {metric.metric.replace('_', ' ')}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {metric.category}
                                                        </p>
                                                    </div>
                                                </div>
                                                {metric.verified && (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {isZh ? '目前值' : 'Current'}
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {metric.value}{metric.unit}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {isZh ? '目標' : 'Target'}
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {metric.target}{metric.unit}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div
                                                        className="bg-pink-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${Math.min(100, (metric.value / metric.target) * 100)}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 利益相關者參與 */}
                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-purple-600" />
                                        {isZh ? '利益相關者參與度' : 'Stakeholder Engagement'}
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h5 className="font-medium text-gray-900 dark:text-white">
                                                {isZh ? '參與評分' : 'Engagement Scores'}
                                            </h5>
                                            {[
                                                { name: isZh ? '員工' : 'Employees', score: 85 },
                                                { name: isZh ? '投資者' : 'Investors', score: 78 },
                                                { name: isZh ? '客戶' : 'Customers', score: 82 },
                                                { name: isZh ? '供應商' : 'Suppliers', score: 75 }
                                            ].map(stakeholder => (
                                                <div key={stakeholder.name} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {stakeholder.name}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                            <div
                                                                className="bg-purple-600 h-2 rounded-full"
                                                                style={{ width: `${stakeholder.score}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                                                            {stakeholder.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-purple-600 mb-2">
                                                    80%
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {isZh ? '整體參與度' : 'Overall Engagement'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'governance' && governanceData && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {isZh ? '治理評分詳情' : 'Governance Score Details'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            {isZh ? '治理指標' : 'Governance Metrics'}
                                        </h4>

                                        <div className="space-y-4">
                                            {[
                                                { label: isZh ? '董事會組成' : 'Board Composition', value: governanceData.boardComposition },
                                                { label: isZh ? '經理人薪酬透明度' : 'Executive Compensation', value: governanceData.executiveCompensation },
                                                { label: isZh ? '股東權益' : 'Shareholder Rights', value: governanceData.shareholderRights },
                                                { label: isZh ? '審計品質' : 'Audit Quality', value: governanceData.auditQuality },
                                                { label: isZh ? '風險管理' : 'Risk Management', value: governanceData.riskManagement }
                                            ].map(metric => (
                                                <div key={metric.label} className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{metric.value}/100</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                        <div
                                                            className="bg-purple-600 h-2 rounded-full"
                                                            style={{ width: `${metric.value}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                {isZh ? '整體評分' : 'Overall Rating'}
                                            </h4>

                                            <div className="text-center">
                                                <div className="text-6xl font-bold text-purple-600 mb-2">
                                                    {governanceData.rating}
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {governanceData.overallScore}/100
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {isZh ? '治理評分等級' : 'Governance Rating'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                {isZh ? '合規狀態' : 'Compliance Status'}
                                            </h4>

                                            <div className="space-y-3">
                                                {[
                                                    { label: isZh ? '監管合規' : 'Regulatory Compliance', status: 'compliant' },
                                                    { label: isZh ? '道德準則' : 'Ethical Standards', status: 'compliant' },
                                                    { label: isZh ? '風險管理' : 'Risk Management', status: 'good' },
                                                    { label: isZh ? '資訊透明度' : 'Information Transparency', status: 'excellent' }
                                                ].map(item => (
                                                    <div key={item.label} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            {item.label}
                                                        </span>
                                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                            item.status === 'good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                                item.status === 'compliant' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            }`}>
                                                            {item.status === 'excellent' ? (isZh ? '優秀' : 'Excellent') :
                                                                item.status === 'good' ? (isZh ? '良好' : 'Good') :
                                                                    item.status === 'compliant' ? (isZh ? '合規' : 'Compliant') :
                                                                        (isZh ? '需要改進' : 'Needs Improvement')}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {isZh ? 'ESG報告' : 'ESG Reports'}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            {isZh ? '生成新報告' : 'Generate New Report'}
                                        </button>
                                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            <Download className="w-4 h-4 inline mr-2" />
                                            {isZh ? '下載PDF' : 'Download PDF'}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {esgReport.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? `報告狀態：${esgReport.status}` : `Status: ${esgReport.status}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {esgReport.rating}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {esgReport.overallScore.toFixed(1)} 分
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600 mb-1">
                                                {Math.max(0, 100 - (esgReport.environmental.carbonFootprint / 10000) * 100).toFixed(1)}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '環境評分' : 'Environmental'}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-pink-600 mb-1">
                                                {((esgReport.social.employeeSatisfaction + esgReport.social.diversityIndex) / 2).toFixed(1)}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '社會評分' : 'Social'}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                                {governanceData?.overallScore.toFixed(1) || '0'}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '治理評分' : 'Governance'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {isZh ? '報告日期：' : 'Report Date: '}
                                            {new Date().toLocaleDateString()}
                                        </div>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            {isZh ? '查看完整報告' : 'View Full Report'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 底部操作欄 */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {isZh ? '最後更新：' : 'Last updated: '}
                            {new Date().toLocaleString()}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={loadESGData}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                {isZh ? '重新整理' : 'Refresh'}
                            </button>

                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {isZh ? '關閉' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ESG AI助手 */}
            <ESGAiAssistant
                language={language}
                esgData={{
                    carbonData,
                    socialData,
                    governanceData,
                    report: esgReport
                }}
                isOpen={showAiAssistant}
                onClose={() => setShowAiAssistant(false)}
            />
        </>
    );
};

// AI助手組件
const ESGAiAssistant: React.FC<{
    language: Language;
    esgData?: any;
    isOpen: boolean;
    onClose: () => void;
}> = ({ language, esgData, isOpen, onClose }) => {
    const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number }>>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isZh = language === 'zh-TW';

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            initializeChat();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeChat = () => {
        const welcomeMessage = {
            id: 'welcome',
            role: 'assistant' as const,
            content: isZh
                ? `您好！我是ESG智慧助手JunAiKey。我可以幫助您：

• 📊 分析ESG數據表現
• 💡 提供永續發展建議
• 🔍 識別風險和機會
• 📈 生成ESG策略建議
• 🤖 回答ESG相關問題

請告訴我您需要什麼幫助？`
                : `Hello! I'm the ESG AI Assistant JunAiKey. I can help you with:

• 📊 ESG data analysis
• 💡 Sustainability recommendations
• 🔍 Risk and opportunity identification
• 📈 ESG strategy suggestions
• 🤖 Answer ESG-related questions

What can I help you with?`,
            timestamp: Date.now()
        };

        setMessages([welcomeMessage]);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!currentMessage.trim() || isLoading) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user' as const,
            content: currentMessage.trim(),
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);

        try {
            // 增強用戶問題，加入ESG上下文
            const enhancedMessage = esgData
                ? `基於以下ESG數據上下文回答用戶問題：\n\n${JSON.stringify(esgData, null, 2)}\n\n用戶問題：${currentMessage}`
                : currentMessage;

            const response = await fetch('http://localhost:3000/api/interact?message=' + encodeURIComponent(enhancedMessage) + '&sessionId=esg-session-' + Date.now(), {
                headers: {
                    'x-celestial-token': process.env.ADMIN_SECRET || 'celestial-access-2024'
                }
            });

            if (!response.ok) {
                throw new Error(`對話失敗: ${response.status}`);
            }

            let fullResponse = '';
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'text') {
                                    fullResponse += data.content;
                                }
                            } catch (e) {
                                // 忽略解析錯誤
                            }
                        }
                    }
                }
            }

            const assistantMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant' as const,
                content: fullResponse || (isZh ? '抱歉，我無法處理您的請求。' : 'Sorry, I cannot process your request.'),
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('AI對話失敗:', error);
            const errorMessage = {
                id: `error-${Date.now()}`,
                role: 'assistant' as const,
                content: isZh
                    ? '抱歉，我現在無法處理您的請求。請稍後再試。'
                    : 'Sorry, I cannot process your request right now. Please try again later.',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
            }`}>
            {/* 聊天窗口 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">

                {/* 標題欄 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                ESG AI助手
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                JunAiKey 萬能智庫
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* 消息區域 */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg h-fit">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] p-3 rounded-lg ${message.role === 'user'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        }`}>
                                        <div className="whitespace-pre-wrap text-sm">
                                            {message.content}
                                        </div>
                                        <div className={`text-xs mt-2 ${message.role === 'user'
                                            ? 'text-blue-100'
                                            : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="p-2 bg-blue-500 rounded-lg h-fit">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {isZh ? '思考中...' : 'Thinking...'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* 輸入區域 */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={isZh ? '輸入您的ESG問題...' : 'Ask your ESG question...'}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={!currentMessage.trim() || isLoading}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ESGDashboard;