"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
    Search,
    Globe,
    Zap,
    AlertTriangle,
    ShieldCheck,
    ChevronRight,
    Eye,
    BarChart3,
    Layers,
    Database,
    Terminal,
    Cpu,
    ExternalLink,
    Filter,
    ArrowUpRight,
    TrendingUp,
    Briefcase,
    Activity,
    FileText,
    Download,
    Share2,
    RefreshCw
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { getIntelligenceData, syncSourceToReadingRoom, publishWeeklyReportAction, generateAdvisoryReportAction, getReadingRoomItems } from "@/app/actions";
import { ReadingRoomView } from "./reading-room-view";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// --- Types ---
interface IntelModule {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    status: 'active' | 'warning' | 'alert' | 'optimizing';
    trend: 'up' | 'down' | 'stable';
    riskLevel: number; // 0-100
}

interface IntelSource {
    id: string;
    name: string;
    type: string;
    region: string;
    reliability: number;
    lastUpdated: string;
    url?: string;
}

// --- Constants ---
const colorMap: Record<string, { bg: string, text: string, border: string, accent: string, gradient: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', accent: 'bg-blue-500', gradient: 'from-blue-500' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', accent: 'bg-emerald-500', gradient: 'from-emerald-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', accent: 'bg-amber-500', gradient: 'from-amber-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', accent: 'bg-orange-500', gradient: 'from-orange-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', accent: 'bg-purple-500', gradient: 'from-purple-500' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200', accent: 'bg-cyan-500', gradient: 'from-cyan-500' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200', accent: 'bg-rose-500', gradient: 'from-rose-500' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', accent: 'bg-red-500', gradient: 'from-red-500' },
};

// --- Data ---
const intelligenceModules = (t: any): IntelModule[] => [
    { id: 'm1', title: t.intelligence.modules.m1, description: '多源數據融合，實現跨國市場准入與綠色貿易門檻實時監測。', icon: <Globe className="w-5 h-5" />, color: 'blue', status: 'active', trend: 'up', riskLevel: 35 },
    { id: 'm2', title: t.intelligence.modules.m2, description: '針對高風險實體、被制裁對象與負面聲譽供應商進行清單式監控。', icon: <Layers className="w-5 h-5" />, color: 'emerald', status: 'active', trend: 'stable', riskLevel: 12 },
    { id: 'm3', title: t.intelligence.modules.m3, description: '基於 5T 證據鏈與動態權重模型，量化特定事件對企業業務的財務衝擊。', icon: <Zap className="w-5 h-5" />, color: 'amber', status: 'warning', trend: 'up', riskLevel: 68 },
    { id: 'm4', title: t.intelligence.modules.m4, description: 'AI 自動識別異常交易、數據突變或政策急轉彎，提供首波預警信號。', icon: <Activity className="w-5 h-5" />, color: 'orange', status: 'active', trend: 'up', riskLevel: 42 },
    { id: 'm5', title: t.intelligence.modules.m5, description: '追蹤關鍵政策發布、司法解釋與部會指導文件，解析法規落地節點。', icon: <ShieldCheck className="w-5 h-5" />, color: 'purple', status: 'active', trend: 'stable', riskLevel: 25 },
    { id: 'm6', title: t.intelligence.modules.m6, description: '整合碳關稅路徑與供應鏈韌性，分析運輸中斷與碳稅轉嫁風險。', icon: <Database className="w-5 h-5" />, color: 'cyan', status: 'active', trend: 'up', riskLevel: 15 },
    { id: 'm7', title: t.intelligence.modules.m7, description: '偵測綠色金融激勵、轉型補貼與新興低碳市場的商業切入機會。', icon: <TrendingUp className="w-5 h-5" />, color: 'rose', status: 'active', trend: 'up', riskLevel: 8 },
    { id: 'm8', title: t.intelligence.modules.m8, description: '監測競品永續佈局與全球市場情緒波動，防止綠洗爭議擴散。', icon: <Briefcase className="w-5 h-5" />, color: 'cyan', status: 'active', trend: 'up', riskLevel: 15 },
    { id: 'm9', title: t.intelligence.modules.m9, description: '全天候掃描全球媒體、社交平台與智庫報告，即時偵測風險事件。', icon: <AlertTriangle className="w-5 h-5" />, color: 'red', status: 'alert', trend: 'up', riskLevel: 85 },
    { id: 'm10', title: t.intelligence.modules.m10, description: '將複雜情資轉化為具體可執行的 90 天減碳與合規落地行動包。', icon: <Terminal className="w-5 h-5" />, color: 'blue', status: 'active', trend: 'stable', riskLevel: 5 },
];

const sources: IntelSource[] = [
    { id: 's1', name: 'Policy & Bureau (A)', type: 'Regulation', region: 'Global', reliability: 99, lastUpdated: '1h ago' },
    { id: 's2', name: 'Market & Carbon (B/D)', type: 'News', region: 'Global', reliability: 85, lastUpdated: '15m ago' },
    { id: 's3', name: 'Finance & ESG (C)', type: 'Financial', region: 'Global', reliability: 95, lastUpdated: '5m ago' },
    { id: 's4', name: 'Supply Chain (E)', type: 'Standard', region: 'International', reliability: 98, lastUpdated: '1d ago' },
    { id: 's5', name: 'Competitor Intel (F)', type: 'Disclosure', region: 'Global', reliability: 92, lastUpdated: '3h ago' },
];

export function IntelligenceView() {
    const { t } = useTranslation();
    const [selectedModule, setSelectedModule] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [modules, setModules] = useState<any[]>([]);
    const [liveSignals, setLiveSignals] = useState<any[]>([]);
    const [activeSources, setActiveSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [advisoryReport, setAdvisoryReport] = useState<string | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showVaultModal, setShowVaultModal] = useState(false);
    const [readingRoomItems, setReadingRoomItems] = useState<any[]>([]);

    const fetchVaultItems = async () => {
        const res = await getReadingRoomItems();
        if (res.success) {
            setReadingRoomItems(res.items);
        }
    };

    // Live Signals Polling
    React.useEffect(() => {
        const pollSignals = async () => {
            try {
                const res = await fetch('/api/intelligence/signals');
                const data = await res.json();
                if (data.success) {
                    setLiveSignals(prev => {
                        const newSignals = [data.signal, ...prev];
                        return newSignals.slice(0, 10); // Keep last 10
                    });
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        const interval = setInterval(pollSignals, 15000); // Poll every 15s
        fetchVaultItems();
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            const res = await getIntelligenceData();
            if (res.success) {
                // If DB is empty, use mock fallbacks for UI richness
                setModules(res.modules.length > 0 ? res.modules : intelligenceModules(t).map(m => ({
                    ...m,
                    titleZh: m.title,
                    titleEn: m.id,
                    descriptionZh: m.description,
                    descriptionEn: m.id
                })));
                setLiveSignals(res.signals.length > 0 ? res.signals : [
                    { id: 'sig1', time: '10m ago', category: 'Regulation', title: 'US SEC Climate Disclosure Paused by Court Order', severity: 'serious' },
                    { id: 'sig2', time: '25m ago', category: 'Market', title: 'Carbon Credit Spot Price Drops 4% in EU ETS', severity: 'moderate' },
                    { id: 'sig3', time: '1h ago', category: 'Tech', title: 'New Direct Air Capture Facility Online in Iceland', severity: 'low' }
                ]);
                setActiveSources(res.sources.length > 0 ? res.sources : sources);
            }
            setLoading(false);
        };
        fetchData();
    }, [t]);

    const handleSync = async (source: any) => {
        const res = await syncSourceToReadingRoom(source);
        if (res.success) {
            toast.success(`Source ${source.name} synced to Reading Room with Audit Trail.`);
            fetchVaultItems(); // Refresh vault items
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        const res = await publishWeeklyReportAction(t.intelligence.weeklyReportTitle, []);
        if (res.success) {
            toast.success(`Report Published! 5T Seal: ${res.seal}`);
        }
        setPublishing(false);
    };

    const handleGenerateAdvisory = async () => {
        if (!selectedModule) return;
        setGeneratingReport(true);
        const res = await generateAdvisoryReportAction(selectedModule.id);
        if (res.success && res.report) {
            setAdvisoryReport(res.report);
            setShowReportModal(true);
        } else {
            toast.error("Failed to generate report.");
        }
        setGeneratingReport(false);
    };

    const filteredModules = modules.filter(m =>
        (m.titleZh || m.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden">
            {/* Header Area */}
            <div className="bg-white/40 backdrop-blur-md border-b border-slate-200/50 p-8 py-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-200">
                                    <Zap className="w-8 h-8 text-white animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-primary font-bold text-xs tracking-widest uppercase mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        ESG ACTIVE INTELLIGENCE
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                        {t.intelligence.title}
                                    </h1>
                                </div>
                            </div>
                            <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
                                {t.intelligence.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch gap-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={t.intelligence.searchSources}
                                    className="w-full sm:w-80 pl-12 pr-4 py-4 bg-white border border-slate-200/60 rounded-[2rem] focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 text-sm font-bold group">
                                <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                <span>{t.intelligence.categories}</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats / Global Status Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-1 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nodes Connected</div>
                                <div className="text-xl font-black text-slate-900">2,841</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signals / Hour</div>
                                <div className="text-xl font-black text-slate-900">482</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Integrity</div>
                                <div className="text-xl font-black text-slate-900">99.8%</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Decision Depth</div>
                                <div className="text-xl font-black text-slate-900">M10</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12">
                <div className="max-w-[1400px] mx-auto">

                    {/* Intelligence Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {filteredModules.map((module) => (
                            <GlassCard
                                key={module.id}
                                className={cn(
                                    "relative p-6 cursor-pointer group transition-all rounded-[2rem]",
                                    selectedModule?.id === module.id ? "ring-2 ring-primary border-transparent bg-primary/5 shadow-2xl shadow-primary/10" : "hover:shadow-xl hover:shadow-slate-200/50"
                                )}
                                onClick={() => setSelectedModule(module)}
                            >
                                <div className="flex flex-col h-full gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm group-hover:scale-110",
                                            colorMap[module.color || 'blue'].bg,
                                            colorMap[module.color || 'blue'].text
                                        )}>
                                            {module.icon || <Layers className="w-5 h-5" />}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-100 shadow-sm">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                                    (module.status || 'active') === 'active' ? "bg-emerald-500" :
                                                        module.status === 'warning' ? "bg-amber-500" :
                                                            module.status === 'alert' ? "bg-red-500" : "bg-slate-400"
                                                )} />
                                            </div>
                                            <div className="text-[10px] font-black text-slate-400 italic">#{module.id.toUpperCase()}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors mb-1">
                                            {module.titleZh || module.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                                            {module.descriptionZh || module.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact: {module.riskLevel || 0}%</div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12 pb-20">
                        {/* Sources Directory & Reading Room */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Sources */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2 p-1">
                                    <Database className="w-5 h-5 text-slate-900" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                        {t.intelligence.sources}
                                    </h2>
                                </div>
                                <div className="grid gap-3">
                                    {activeSources.map((source) => (
                                        <div key={source.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer" onClick={() => handleSync(source)}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 text-sm truncate">{source.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                                        <span className="text-[10px] font-medium text-slate-400 italic">Synced {source.lastUpdated || 'now'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reading Room Card */}
                            <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl shadow-slate-300">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Eye className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                    {t.intelligence.readingRoom}
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                                    Access exclusive analyst deep-dives and full regulatory source texts in our quantum-verified reading environment.
                                </p>
                                <button 
                                    onClick={() => setShowVaultModal(true)}
                                    className="w-full py-4 bg-white text-slate-900 rounded-[1.5rem] font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20"
                                >
                                    Enter Reading Room
                                </button>
                            </div>
                        </div>

                        {/* Middle: Weekly Report Area */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-900" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                        {t.intelligence.weeklyReport}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                                    <Activity className="w-3 h-3" />
                                    Updated 2h ago
                                </div>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] transition-all group-hover:w-40 group-hover:h-40" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-4">
                                        <div className="w-4 h-[1px] bg-primary" />
                                        Executive Intelligence Memo
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">
                                        {t.intelligence.weeklyReportTitle}
                                    </h3>

                                    <div className="space-y-6 mb-8">
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                本週核心監測：歐盟議會針對 CBAM 範疇擴大至有機化學品與塑料的最新動態。預計 2025Q3 將進入實質技術審查階段。
                                            </p>
                                        </div>
                                        <ul className="space-y-4">
                                            {[
                                                'Taiwan Steel Export Impact: +$12M Potential Duty',
                                                'Supply Chain Resilience Re-routing via Vietnam',
                                                'New Green Hydrogen Subsidy (DE/FR)'
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 group/item">
                                                    <div className="mt-1 w-5 h-5 rounded-md bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                                        <ChevronRight className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handlePublish}
                                            disabled={publishing}
                                            className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {publishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                            {publishing ? "Publishing..." : "Publish Weekly"}
                                        </button>
                                        <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                                            <Share2 className="w-4 h-4" />
                                            Share Report
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Intelligence Feed */}
                            <div className="pt-4">
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity className="w-5 h-5 text-slate-900" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Live Signals</h2>
                                </div>
                                <div className="space-y-4">
                                    {liveSignals.map((signal, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 hover:shadow-lg transition-all group cursor-pointer">
                                            <div className="text-[10px] font-black text-slate-400 rotate-180 [writing-mode:vertical-lr]">{signal.time || 'now'}</div>
                                            <div className={cn(
                                                "w-1 h-10 rounded-full",
                                                signal.severity === 'serious' ? "bg-red-500" :
                                                    signal.severity === 'moderate' ? "bg-amber-500" : "bg-emerald-400"
                                            )} />
                                            <div className="flex-1">
                                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">{signal.category || signal.type}</div>
                                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{signal.title}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/* Right Side: Selection Details / Analytics */}
                        <div className="lg:col-span-1 space-y-6">
                            <AnimatePresence mode="wait">
                                {selectedModule ? (
                                    <motion.div
                                        key={selectedModule.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <GlassCard className="overflow-hidden bg-white shadow-2xl shadow-slate-200" noHover>
                                            <div className={cn("h-2 w-full bg-gradient-to-r to-white/0", colorMap[selectedModule.color].gradient)} />
                                            <div className="p-8">
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "w-16 h-16 rounded-[1.75rem] flex items-center justify-center text-white shadow-lg",
                                                            colorMap[selectedModule.color].accent
                                                        )}>
                                                            {React.cloneElement(selectedModule.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-slate-900">{selectedModule.title}</h3>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                                    5T Proofed
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                <span className="text-sm font-bold text-primary">Priority Level 01</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-2xl flex items-center gap-2 border border-slate-100">
                                                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-900">
                                                            <Briefcase className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-900">
                                                            <ExternalLink className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Risk Assessment</div>
                                                        <div className="flex items-end gap-2">
                                                            <span className="text-3xl font-bold text-slate-900">{selectedModule.riskLevel}</span>
                                                            <span className="text-sm font-bold text-slate-500 mb-1">/ 100</span>
                                                        </div>
                                                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase">
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                            Elevated
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Projected Impact</div>
                                                        <div className="text-2xl font-bold text-slate-900">Moderate</div>
                                                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase">
                                                            $4.2M Risk Map
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">Evidence Links</div>
                                                        <div className="text-2xl font-bold text-slate-900">12 Nodes</div>
                                                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                                                            Validated
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                        <Terminal className="w-5 h-5 text-primary" />
                                                        {t.intelligence.decisionChain}
                                                    </h4>
                                                    <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 py-2">
                                                        <div className="relative">
                                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-white z-10" />
                                                            <div className="font-bold text-slate-900 mb-1 text-sm">EU Regulatory Scan (Source: s1)</div>
                                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                                偵測到關於「供應鏈碳定價」的新草案通過，預計將在未來 18 個月內影響製造業供應。
                                                            </p>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-slate-300 bg-white z-10" />
                                                            <div className="font-bold text-slate-900 mb-1 text-sm">Cross-Reference Context (Source: s3)</div>
                                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                                Bloomberg 情資顯示市場對於該法規的初期反應導致相關原物料價格波動約 4.5%。
                                                            </p>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-slate-300 bg-white z-10" />
                                                            <div className="font-bold text-slate-900 mb-1 text-sm">AI Impact Prediction</div>
                                                            <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                                                                「基於您的數據，建議優先針對供應商 A 與 B 進行排放效率評核，以降低潛在碳稅轉嫁風險。」
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-10 flex gap-4">
                                                    <button 
                                                        onClick={handleGenerateAdvisory}
                                                        disabled={generatingReport}
                                                        className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                                                    >
                                                        {generatingReport ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Generative Advisory Report</span>}
                                                        {!generatingReport && <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                                                    </button>
                                                    <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                                        Track Risk
                                                    </button>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-20 text-center px-6">
                                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                                            <Cpu className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Omni-Insight Engine Waiting</h3>
                                        <p className="text-slate-400 max-w-sm">
                                            Select an intelligence module to view real-time data chains, risk assessments, and proactive mitigation strategies.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReportModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">AI Generative Advisory</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini 1.5 Pro</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified Logic</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 prose prose-slate prose-sm max-w-none">
                                <div className="markdown-content">
                                    <ReactMarkdown>
                                        {advisoryReport || "No report generated."}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                                    Export PDF
                                </button>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                >
                                    Confirm & Archive
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reading Room Vault Modal */}
            <AnimatePresence>
                {showVaultModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowVaultModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl h-[80vh] bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-6 right-6 z-10">
                                <button 
                                    onClick={() => setShowVaultModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-8 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Reading Room Vault</h3>
                                </div>
                                <p className="text-slate-400 text-xs font-medium">Audit-trail verified intelligence sources and regulatory documents.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                {readingRoomItems.length > 0 ? (
                                    <div className="grid gap-4">
                                        {readingRoomItems.map((item, idx) => (
                                            <motion.div 
                                                key={item.id || idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                                            <FileText className="w-6 h-6 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-white font-bold text-sm mb-0.5">{item.name}</div>
                                                            <div className="text-[10px] text-slate-500 mt-0.5">Synced: {new Date(item.timestamp).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                                            Verified
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                            <Layers className="w-8 h-8 text-slate-700" />
                                        </div>
                                        <h4 className="text-white font-bold mb-2 text-lg">No Items Synced</h4>
                                        <p className="text-slate-500 max-w-xs text-sm">
                                            Sync sources from the directory to see them in the Reading Room Vault.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                                    Integrity Hash: 0x82...f92a
                                </div>
                                <button className="px-10 py-4 bg-emerald-500 text-black rounded-2xl font-black text-sm hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20">
                                    Download All (Archive)
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Legend / Overlay */}
            <div className="bg-slate-900 text-slate-400 px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold tracking-widest uppercase">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Real-time Sync Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Quantum-Verified Integrity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span>50+ Jurisdictions</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span>Cluster Status: ALPHA-CENTAURI-9</span>
                    <span className="text-slate-600">|</span>
                    <span>v4.1.2-PREMIUM</span>
                </div>
            </div>
        </div>
    );
}
