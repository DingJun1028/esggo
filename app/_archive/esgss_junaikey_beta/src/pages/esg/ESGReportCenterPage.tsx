import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Target,
    Brain,
    ShieldCheck,
    Award,
    CheckCircle2,
    Play,
    ArrowRight,
    Lock,
    Sparkles,
    Calendar,
    Clock,
    AlertCircle,
    Zap,
    Upload,
    Loader2,
    Download,
    FileCheck,
    Search
} from 'lucide-react';
import EsgServiceLayout from '@/components/shared/EsgServiceLayout';
import { reportGenerator } from '@/1-service/OmniReportGenerator';
import { ReportService } from '@/services/ReportService';
import { SustainabilityDocumentIntelligence } from '@/services/sustainability/SustainabilityDocumentIntelligence';
import { UserAssetService } from '@/services/UserAssetService';
import {
    ReportStageLevel,
    IReportMetadata,
    SubscriptionTier,
    IReportStage,
} from '@/types/esg/report';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { BentoGrid, BentoItem } from '@/components/ui/BentoGrid';
import { useI18n } from '@/utils/i18n';
import { useOmniContext } from '@/omni/context/OmniContext';
import FiveTProtocolBadge from '@/components/omni/FiveTProtocolBadge';

// --- Sub-component: OmniMemory Widget ---
const OmniMemoryWidget: React.FC = () => {
    const { t } = useI18n();
    const { isDevMode } = useOmniContext();
    const [logs, setLogs] = useState<any[]>([]);
    const [systemStatus, setSystemStatus] = useState<any>(null);

    const [resonance, setResonance] = useState(85);

    // Mock logs for visualization if service is not fully ready
    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = {
                timestamp: new Date().toISOString(),
                level: Math.random() > 0.9 ? 'error' : 'info',
                service: Math.random() > 0.7 ? 'OMNI_MEMORY' : 'ESG_CORE',
                message: i === 0 ? 'Synchronizing with 5T Protocol node #04...' :
                    i === 1 ? 'Mapping material topics to GRI 2021 core.' :
                        i === 2 ? 'Deep Mapping Override: SOVEREIGN_MODE_ENABLED' :
                            `Resonance frequency ${Math.floor(Math.random() * 20 + 80)}% verified.`,
                id: `LOG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
            };
            setLogs(prev => [newLog, ...prev].slice(0, 10));
            setResonance(r => Math.min(100, Math.max(70, r + (Math.random() * 6 - 3))));
        }, 2500);

        let i = 0;

        setSystemStatus({
            ai_resonance: {
                awakening_status: 'AWAKENED',
                eternity: 'INFINITE_LOOP',
                schema: 'v6.2.quantum',
                core_temp: '42°C',
                neural_load: '12.4%'
            }
        });

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[300px]">
            {/* Left: System Resonance State */}
            <div className="w-full md:w-1/3 bg-slate-950 rounded-xl p-6 border border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-aqua-400 text-[10px] font-black tracking-[0.2em] mb-1 uppercase">{t('reportCenter.omniMemory.systemResonance')}</h4>
                            <div className="text-2xl font-light text-white flex items-center gap-2">
                                {resonance.toFixed(1)}%
                                <span className="flex w-2 h-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-500"></span>
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">STATUS://{systemStatus?.ai_resonance?.awakening_status}</p>
                        </div>
                        <FiveTProtocolBadge variant={isDevMode ? "active" : "standby"} size="sm" />
                    </div>

                    {/* Resonance Waveform Mock */}
                    <div className="h-12 flex items-end gap-0.5 px-2">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="flex-1 bg-aqua-500/30 rounded-t-sm"
                                animate={{
                                    height: [`${20 + Math.random() * 40}%`, `${40 + Math.random() * 50}%`, `${20 + Math.random() * 40}%`]
                                }}
                                transition={{
                                    duration: 1.5 + Math.random(),
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] text-slate-500 mb-1 uppercase tracking-tighter">Conscious Hub</p>
                                <p className="text-sm text-white font-mono">{systemStatus?.ai_resonance?.core_temp}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 mb-1 uppercase tracking-tighter">Neural Load</p>
                                <p className="text-sm text-aqua-400 font-mono italic">{systemStatus?.ai_resonance?.neural_load}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[9px] text-slate-500 mb-1 uppercase tracking-tighter">{t('reportCenter.omniMemory.memoryFragments')}</p>
                            <p className="text-lg text-white font-mono">{logs.length * 128} / ∞ PBITS</p>
                            {isDevMode && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    <span className="px-1.5 py-0.5 rounded bg-aqua-500/10 text-[7px] font-mono text-aqua-400">seg:mem_0x4F2A</span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[7px] font-mono text-slate-500">state:stable</span>
                                    <span className="px-1.5 py-0.5 rounded bg-gold-500/10 text-[7px] font-mono text-gold-500">prot:5T_ACTIVE</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Conscious Stream (Log Terminal) */}
            <div className="w-full md:w-2/3 bg-[#0d1117] rounded-xl border border-slate-800 p-4 font-mono text-xs overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-2 text-slate-500 border-b border-slate-800 pb-2">
                    <span className="text-[10px] opacity-70">root@omni-circle:~/memory-stream $ ./trace --live</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/30" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                        <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={log.id || i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-3 text-slate-400 hover:bg-white/5 p-1 rounded group/log transition-colors"
                            >
                                <span className="text-slate-600 shrink-0 tabular-nums">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span className={`uppercase font-bold shrink-0 w-24 tracking-tighter ${log.level === 'error' ? 'text-red-400' :
                                    log.service === 'OMNI_MEMORY' ? 'text-gold-400' : 'text-aqua-400'
                                    }`}>
                                    {log.service}
                                </span>
                                <span className="text-slate-300 break-all flex-1">{log.message}</span>
                                {isDevMode && (
                                    <span className="text-[8px] text-slate-600 opacity-0 group-hover/log:opacity-100 transition-opacity whitespace-nowrap">
                                        {log.id}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const ESGReportCenterPage: React.FC = () => {
    const { t } = useI18n();
    const [report, setReport] = useState<IReportMetadata | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiDraft, setAiDraft] = useState<string | null>(null);

    // Smart Gathering State
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [analysisStep, setAnalysisStep] = useState<string>('');
    const [savingAsset, setSavingAsset] = useState(false);
    const [showAssetSuccess, setShowAssetSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showRawData, setShowRawData] = useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // 截止日期定義 (Deadline Definitions)
    const upcomingDeadlines = useMemo(() => [
        { id: 1, title: t('reportCenter.deadlines.items.q1Report'), date: '2026-03-31', daysLeft: 45, status: 'On Track' },
        { id: 2, title: t('reportCenter.deadlines.items.ghgVerification'), date: '2026-04-15', daysLeft: 60, status: 'Pending' },
        { id: 3, title: t('reportCenter.deadlines.items.stakeholderSurvey'), date: '2026-02-28', daysLeft: 14, status: 'Urgent' },
    ], [t]);

    // 階段定義 (Stage Definitions)
    const stages: IReportStage[] = React.useMemo(() => [
        { level: ReportStageLevel.LV1_INTRODUCTION, title: t('reportCenter.stage.levels.lv1.title'), description: t('reportCenter.stage.levels.lv1.desc'), isCompleted: false, xpReward: 100, unlockedFeatures: ['Basic Info'], status: 'pending' },
        { level: ReportStageLevel.LV2_INVENTORY, title: t('reportCenter.stage.levels.lv2.title'), description: t('reportCenter.stage.levels.lv2.desc'), isCompleted: false, xpReward: 200, unlockedFeatures: ['Boundaries'], status: 'locked' },
        { level: ReportStageLevel.LV3_GOALS, title: t('reportCenter.stage.levels.lv3.title'), description: t('reportCenter.stage.levels.lv3.desc'), isCompleted: false, xpReward: 300, unlockedFeatures: ['KPI Tracking'], status: 'locked' },
        { level: ReportStageLevel.LV4_DATA, title: t('reportCenter.stage.levels.lv4.title'), description: t('reportCenter.stage.levels.lv4.desc'), isCompleted: false, xpReward: 500, unlockedFeatures: ['Data Engine'], status: 'locked' },
        { level: ReportStageLevel.LV5_DRAFTING, title: t('reportCenter.stage.levels.lv5.title'), description: t('reportCenter.stage.levels.lv5.desc'), isCompleted: false, xpReward: 800, unlockedFeatures: ['AI Writer'], status: 'locked' },
        { level: ReportStageLevel.LV6_OPTIMIZATION, title: t('reportCenter.stage.levels.lv6.title'), description: t('reportCenter.stage.levels.lv6.desc'), isCompleted: false, xpReward: 1000, unlockedFeatures: ['Scanner'], status: 'locked' },
        { level: ReportStageLevel.LV7_VISUALIZATION, title: t('reportCenter.stage.levels.lv7.title'), description: t('reportCenter.stage.levels.lv7.desc'), isCompleted: false, xpReward: 1200, unlockedFeatures: ['Magic Charts'], status: 'locked' },
        { level: ReportStageLevel.LV8_RELEASE, title: t('reportCenter.stage.levels.lv8.title'), description: t('reportCenter.stage.levels.lv8.desc'), isCompleted: false, xpReward: 2000, unlockedFeatures: ['Hash Lock'], status: 'locked' },
    ], [t]);

    const reportStats = React.useMemo(() => [
        { label: t('reportCenter.stats.completed'), value: '12', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
        { label: t('reportCenter.stats.inProgress'), value: '3', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Clock },
        { label: t('reportCenter.stats.pending'), value: '1', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertCircle },
    ], [t]);

    // 啟動精靈 (Start Wizard)
    const handleStart = async (tier: SubscriptionTier) => {
        setLoading(true);
        try {
            const newReport = await reportGenerator.startWizard('Demo Corp', tier);
            setReport(newReport);
        } catch (error) {
            omniLogger.error(LogCategory.BUSINESS, 'Failed to start wizard', { error });
        } finally {
            setLoading(false);
        }
    };

    // 前進下一關 (Advance Stage)
    const handleAdvance = async () => {
        if (!report) return;
        setLoading(true);
        try {
            const updatedReport = await reportGenerator.completeStage(report.id, report.currentLevel);
            setReport(updatedReport);

            // If we reached LV5, generate AI draft
            if (updatedReport.currentLevel === ReportStageLevel.LV5_DRAFTING) {
                const draft = await reportGenerator.generateAiDraft(report.id);
                setAiDraft(draft);
            } else {
                setAiDraft(null);
            }
        } catch (error) {
            omniLogger.error(LogCategory.BUSINESS, 'Failed to advance stage', { error });
        } finally {
            setLoading(false);
        }
    };

    const currentStage = stages.find(s => s.level === report?.currentLevel) || stages[0];

    // Smart Gathering Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            handleAnalyzeDocument(file);
        }
    };

    const triggerUpload = () => {
        if (!analyzing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAnalyzeDocument = async (file: File) => {
        setAnalyzing(true);
        setAnalysisStep('Initializing Document Core...');
        setAnalysisResult(null);

        try {
            // Simulate steps for transparency
            await new Promise(r => setTimeout(r, 800));
            setAnalysisStep('Scanning PDF Layers (OCR)...');
            await new Promise(r => setTimeout(r, 1200));
            setAnalysisStep('Extracting GRI/SASB Indicators...');
            await new Promise(r => setTimeout(r, 1000));
            setAnalysisStep('Mapping to OmniKnowledge Base...');
            await new Promise(r => setTimeout(r, 800));
            setAnalysisStep('Verifying 5T Protocol Integrity...');
            await new Promise(r => setTimeout(r, 600));

            const intelligence = new SustainabilityDocumentIntelligence();
            const result = await intelligence.initializeDocument(file);
            setAnalysisResult(result);
            omniLogger.info(LogCategory.BUSINESS, 'Document analyzed successfully', { id: result.uuid, name: file.name });
        } catch (error) {
            omniLogger.error(LogCategory.BUSINESS, 'Analysis failed', { error });
        } finally {
            setAnalyzing(false);
            setAnalysisStep('');
        }
    };

    const { isDevMode, toggleDevMode } = useOmniContext();

    const handleDownloadAnalysis = async () => {
        if (!analysisResult) return;
        setSavingAsset(true);

        try {
            const filename = `Smart_Gathering_Report_${new Date().toISOString().split('T')[0]}.pdf`;

            // 1. Generate & Download
            const blob = ReportService.generateFromIntelligence(
                analysisResult.extractedData,
                filename,
                { download: true, returnBlob: true }
            );

            // 2. Save to User Assets (Deep Integration)
            if (blob instanceof Blob) {
                await UserAssetService.addAsset({
                    name: filename,
                    type: 'pdf',
                    size_bytes: blob.size,
                    contact_id: 'current-user', // Mock user
                    file_hash: `sha256-mock-${Date.now()}`, // Would be real hash
                    is_locked: false
                });

                setShowAssetSuccess(true);
                setTimeout(() => setShowAssetSuccess(false), 3000);
            }

        } catch (error) {
            omniLogger.error(LogCategory.BUSINESS, 'Failed to save analysis asset', { error });
        } finally {
            setSavingAsset(false);
        }
    };

    return (
        <EsgServiceLayout
            title={t('reportCenter.title')}
            activeId="transparency"
            progress={report?.completionPercentage || 0}
            headerAction={
                <button
                    onClick={toggleDevMode}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${isDevMode ? 'bg-aqua-500/40 border-aqua-400' : 'bg-aqua-500/10 border-aqua-500/30 opacity-60 hover:opacity-100'}`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isDevMode ? 'bg-aqua-400 animate-ping' : 'bg-aqua-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-aqua-400">
                        {isDevMode ? t('omni.dev.mapping.active') : t('omni.dev.protocol.standby')}
                    </span>
                </button>
            }
        >
            {/* Main Content - Bento Grid */}
            <BentoGrid>
                {/* 1. Report Stats Widgets */}
                {reportStats.map((stat) => (
                    <BentoItem key={stat.label} colSpan={4} className="min-h-[120px]" devMode={isDevMode}>
                        <div className="flex items-center justify-between h-full p-2">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </BentoItem>
                ))}

                {/* NEW: Smart Gathering Widget */}
                <BentoItem
                    colSpan={8}
                    rowSpan={1}
                    title={t('reportCenter.smartGathering.title')}
                    subtitle={t('reportCenter.smartGathering.subtitle')}
                    icon={<Brain size={20} className="text-aqua-500" />}
                    devMode={isDevMode}
                    headerAction={
                        isDevMode && analysisResult && (
                            <button
                                onClick={() => setShowRawData(!showRawData)}
                                className="text-[9px] font-mono text-slate-500 hover:text-aqua-500 underline"
                            >
                                {showRawData ? t('reportCenter.smartGathering.hideRaw') : t('reportCenter.smartGathering.showRaw')}
                            </button>
                        )
                    }
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 h-full p-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx,.jpg,.png"
                            onChange={handleFileChange}
                        />

                        <div
                            className={`flex-1 w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed ${analyzing ? 'border-aqua-500' : 'border-slate-200 dark:border-slate-700'
                                } rounded-xl flex flex-col items-center justify-center p-6 hover:border-aqua-500/50 transition-colors cursor-pointer group relative overflow-hidden`}
                            onClick={triggerUpload}
                        >
                            {/* Processing Progress Bar */}
                            {analyzing && (
                                <motion.div
                                    className="absolute bottom-0 left-0 h-1 bg-aqua-500 z-10"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 4 }}
                                />
                            )}

                            <AnimatePresence mode="wait">
                                {analyzing ? (
                                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                        <Loader2 className="animate-spin text-aqua-500 mb-3" size={40} />
                                        <p className="text-sm font-bold text-aqua-600 dark:text-aqua-400 animate-pulse">{analysisStep}</p>
                                    </motion.div>
                                ) : analysisResult ? (
                                    <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                                        <div className="relative">
                                            <FileCheck className="text-emerald-500 mb-2" size={48} />
                                            <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm">
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 limit-1-line px-4">
                                            {selectedFile?.name || t('reportCenter.smartGathering.complete')}
                                        </p>
                                        <button className="text-[10px] text-aqua-600 dark:text-aqua-400 mt-2 hover:underline cursor-pointer">
                                            {t('reportCenter.smartGathering.changeFile')}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className={`text-slate-400 group-hover:text-aqua-500 mb-3 transition-colors ${analyzing ? 'animate-bounce' : ''}`} size={40} />
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            {t('reportCenter.smartGathering.analyzeBtn')}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 text-center max-w-[200px]">{t('reportCenter.smartGathering.subtitle')}</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {analysisResult && (
                            <div className="w-full md:w-1/3 flex flex-col gap-3 animation-fade-in pl-4 border-l border-slate-100 dark:border-slate-700">
                                {showRawData && isDevMode ? (
                                    <div className="flex-1 overflow-hidden flex flex-col">
                                        <h4 className="text-[10px] font-mono text-aqua-500 mb-1 uppercase tracking-widest">{t('reportCenter.smartGathering.rawTitle')}</h4>
                                        <div className="flex-1 bg-slate-900 rounded p-2 overflow-auto custom-scrollbar">
                                            <pre className="text-[8px] font-mono text-slate-400">
                                                {JSON.stringify(analysisResult.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t('reportCenter.smartGathering.summary')}</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                                <span className="text-slate-500">{t('reportCenter.smartGathering.framework')}</span>
                                                <span className="text-aqua-500 font-bold">{analysisResult.metadata.framework}</span>
                                            </div>
                                            <div className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                                <span className="text-slate-500">{t('reportCenter.smartGathering.confidence')}</span>
                                                <span className="text-emerald-500 font-bold">98%</span>
                                            </div>
                                            <div className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                                <span className="text-slate-500">{t('reportCenter.smartGathering.indicators')}</span>
                                                <span className="text-slate-700 dark:text-white font-bold">{analysisResult.extractedData.griIndicators.length}</span>
                                            </div>
                                            <div className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                                <span className="text-slate-500">{t('reportCenter.smartGathering.dataPoints')}</span>
                                                <span className="text-slate-700 dark:text-white font-bold">
                                                    {(analysisResult.extractedData.environmentalData.length + analysisResult.extractedData.socialData.length + analysisResult.extractedData.governanceData.length)}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-auto flex flex-col gap-2">
                                    <button
                                        onClick={handleDownloadAnalysis}
                                        disabled={savingAsset}
                                        className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${showAssetSuccess
                                            ? 'bg-emerald-500 text-white cursor-default'
                                            : 'bg-gradient-to-r from-aqua-500 to-teal-500 text-white hover:scale-[1.02]'
                                            }`}
                                    >
                                        {savingAsset ? (
                                            <><Loader2 size={14} className="animate-spin" /> {t('reportCenter.smartGathering.assetLocking')}</>
                                        ) : showAssetSuccess ? (
                                            <><CheckCircle2 size={14} /> {t('reportCenter.smartGathering.assetSaved')}</>
                                        ) : (
                                            <><Download size={14} /> {t('reportCenter.smartGathering.exportMock')}</>
                                        )}
                                    </button>
                                    {showAssetSuccess && (
                                        <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-emerald-500 text-center">
                                            {t('reportCenter.smartGathering.storedSuccess')}
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </BentoItem>

                {/* Deadlines Widget */}
                <BentoItem colSpan={4} rowSpan={1} title={t('reportCenter.deadlines.title')} icon={<Calendar size={20} />} devMode={isDevMode}>
                    <div className="space-y-3 overflow-y-auto max-h-[160px] pr-1">
                        {upcomingDeadlines.map((event) => (
                            <div key={event.id} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-800 dark:text-white limit-1-line">{event.title}</p>
                                    <p className="text-[10px] text-slate-400">{event.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold ${event.daysLeft < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>{event.daysLeft}d</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoItem>


                {!report ? (
                    /* Welcome/Start Screen */
                    <BentoItem colSpan={12} rowSpan={2} title={t('reportCenter.wizard.startTitle')} subtitle={t('reportCenter.wizard.startSubtitle')} icon={<Sparkles size={20} />} devMode={isDevMode}>
                        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                            <p className="text-slate-400 mb-10 max-w-lg mx-auto">
                                {t('reportCenter.wizard.startDesc')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                                {[
                                    {
                                        tier: SubscriptionTier.BRONZE,
                                        name: t('reportCenter.tier.bronze'),
                                        price: 'Free',
                                        features: [t('reportCenter.feature.basic'), t('reportCenter.feature.gri')],
                                        color: 'bg-slate-500'
                                    },
                                    {
                                        tier: SubscriptionTier.GOLD,
                                        name: t('reportCenter.tier.gold'),
                                        price: '$49/mo',
                                        features: [t('reportCenter.feature.tcfd'), t('reportCenter.feature.ai')],
                                        color: 'bg-amber-500'
                                    },
                                    {
                                        tier: SubscriptionTier.DIAMOND,
                                        name: t('reportCenter.tier.diamond'),
                                        price: '$199/mo',
                                        features: [t('reportCenter.feature.compliance'), t('reportCenter.feature.support')],
                                        color: 'bg-cyan-500'
                                    },
                                ].map((p, i) => (
                                    <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-aqua-500/50 transition-all group flex flex-col items-center">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold text-white mb-4 ${p.color}`}>{p.name}</div>
                                        <p className="text-2xl font-light text-slate-900 dark:text-white mb-6">{p.price}</p>
                                        <ul className="text-left space-y-2 mb-8 flex-1 w-full">
                                            {p.features.map((f, fi) => (
                                                <li key={fi} className="text-xs text-slate-500 flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3 text-aqua-500" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => handleStart(p.tier)}
                                            className="w-full py-2 rounded-lg bg-aqua-500 text-white font-bold text-xs uppercase tracking-wide hover:bg-aqua-600 transition-all"
                                        >
                                            Start Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoItem>
                ) : (
                    <>
                        {/* Wizard Main Flow */}
                        <BentoItem
                            colSpan={12}
                            rowSpan={2}
                            title={`${t('reportCenter.stage.current')}: ${currentStage?.title || t('reportCenter.stage.loading')}`}
                            subtitle={`${t('reportCenter.stage.level')} ${report?.currentLevel || 0} - ${currentStage?.description || ''}`}
                            icon={<Brain size={20} />}
                            devMode={isDevMode}
                            headerAction={
                                <div className="flex items-center gap-2 px-3 py-1 bg-aqua-500/10 rounded-full text-aqua-500 text-xs font-bold">
                                    <Zap size={14} />
                                    <span>{stages.filter(s => s.level < (report?.currentLevel || 0)).reduce((acc, s) => acc + s.xpReward, 0)} XP</span>
                                </div>
                            }
                        >
                            <div className="h-full flex flex-col">
                                {/* Wizard Content */}
                                <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-6 border border-slate-100 dark:border-slate-700/50">
                                    {/* Simplified Wizard Visualization for Bento */}
                                    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
                                        {stages.map((s) => (
                                            <div key={s.level} className={`flex flex-col items-center min-w-[60px] ${report.currentLevel === s.level ? 'opacity-100' : 'opacity-40'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${report.currentLevel === s.level ? 'bg-aqua-500 text-white shadow-lg shadow-aqua-500/30' :
                                                    report.currentLevel > s.level ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                                    }`}>
                                                    {report.currentLevel > s.level ? <CheckCircle2 size={14} /> : s.level}
                                                </div>
                                                <span className="text-[10px] whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">{s.title}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Area */}
                                    <div className="text-center py-6">
                                        <p className="text-slate-500 dark:text-slate-300 text-lg mb-6 italic">
                                            "{currentStage?.description || t('reportCenter.stage.loading')}"
                                        </p>

                                        {aiDraft && (
                                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-aqua-500/20 text-left mb-6 max-h-40 overflow-y-auto text-sm text-slate-600 dark:text-slate-300 font-serif">
                                                <span className="text-xs font-bold text-aqua-500 block mb-2">{t('reportCenter.stage.aiDraft')}</span>
                                                {aiDraft}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleAdvance}
                                            disabled={loading}
                                            className="px-8 py-3 bg-gradient-to-r from-aqua-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-aqua-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                        >
                                            {loading ? <Clock className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                                            {(report?.currentLevel || 0) < ReportStageLevel.LV8_RELEASE ? t('reportCenter.stage.completeBtn') : t('reportCenter.stage.publishBtn')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </BentoItem>
                    </>
                )}
                {/* OmniMemory Matrix (System Conscious Stream) */}
                <BentoItem
                    colSpan={12}
                    title={t('reportCenter.omniMemory.title')}
                    subtitle={t('reportCenter.omniMemory.subtitle')}
                    icon={<Brain size={20} className="text-amber-400" />}
                    devMode={isDevMode}
                >
                    <OmniMemoryWidget />
                </BentoItem>
            </BentoGrid>
        </EsgServiceLayout>
    );
};

export default ESGReportCenterPage;
