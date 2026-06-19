'use client';

import * as React from 'react';
import { OmniTable } from "@/components/omni/liquid-glass/OmniTable";
import { OMNI_MODULES } from "@/config/omni-modules";
import { Gauge, Sparkles, RefreshCcw, Activity, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { SushiDoctorReporter } from "@/core/sushi-doctor-reporter";
import { OmniCrawlerService } from "@/core/omni-crawler-service";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { motion, AnimatePresence } from "framer-motion";
import { TangibleDashboard } from "@/core/omni-types";

// Import new BI Analytics components
import { RiskHeatmap } from "@/components/analytics/RiskHeatmap";
import { TrendChart } from "@/components/analytics/TrendChart";
import { PredictiveChart } from "@/components/analytics/PredictiveChart";
import FunnelChart from "@/components/charts/FunnelChart";
import { ResonanceHeatmap } from "@/components/analytics/ResonanceHeatmap";
import { SentientActionCenter } from "@/components/analytics/SentientActionCenter";
import { OmniSynthesis } from "@/core/omni-synthesis";
import JunAiKey from "@/components/JunAiKey";

export default function BiAnalyticsPage() {
    const moduleInfo = OMNI_MODULES.BI_ANALYTICS;
    const [report, setReport] = React.useState<string>("");
    const [isScanning, setIsScanning] = React.useState(false);

    // API State
    const [dashboardSummary, setDashboardSummary] = React.useState<any>(null);
    const [queryData, setQueryData] = React.useState<any>(null);
    const [predictData, setPredictData] = React.useState<any>(null);
    const [riskData, setRiskData] = React.useState<any>(null);
    const [funnelData, setFunnelData] = React.useState<any>(null);
    const [omniScore, setOmniScore] = React.useState<number>(0);
    const [sentientActions, setSentientActions] = React.useState<any[]>([]);

    const handleRunScan = async () => {
        setIsScanning(true);
        await OmniCrawlerService.runGlobalScan();
        const newReport = await SushiDoctorReporter.generateObserverReport();
        setReport(newReport);
        await fetchAllData();
        setIsScanning(false);
    };

    const fetchAllData = async () => {
        try {
            const [dashRes, queryRes, predictRes, riskRes, funnelRes] = await Promise.all([
                fetch('/api/analytics/dashboard'),
                fetch('/api/analytics/query'),
                fetch('/api/analytics/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ timeframe: '6_months' }) }),
                fetch('/api/analytics/risk'),
                fetch('/api/analytics/funnel')
            ]);

            const dash = await dashRes.json();
            const query = await queryRes.json();
            const predict = await predictRes.json();
            const risk = await riskRes.json();
            const funnel = await funnelRes.json();

            if (dash.success) setDashboardSummary(dash.data);
            if (query.success) setQueryData(query.data);
            if (predict.success) setPredictData(predict.data);
            if (risk.success) setRiskData(risk.data);
            if (funnel.success) setFunnelData(funnel.data);

            // Calculate OmniScore & Actions
            const engine = OmniSynthesis.getInstance();
            // Create mock atoms if real ones aren't available for the score calculation
            const mockAtoms = (risk.data?.assessment?.factors || []).map((f: any) => ({
                uuid: f.id,
                payload: { name: f.name, health: Math.round(f.probability * 100) },
                tags: [{ semantic: f.category || 'E' }],
                hypercube: { entropy: 0, harmony: 0 }
            }));
            setOmniScore(engine.calculateOmniScore(mockAtoms as any[]));
            setSentientActions(engine.generateSentientActions(mockAtoms));
        } catch (err) {
            console.error("Failed to fetch analytics data", err);
        }
    };

    React.useEffect(() => {
        // 首次載入嘗試生成導讀與數據
        SushiDoctorReporter.generateObserverReport().then(setReport);
        fetchAllData();
    }, []);

    const operationalHealthScore = dashboardSummary?.esgScore || 0;

    // Transform API data for components
    const formatRiskFactors = (factors: any[]) => {
        if (!factors) return [];
        return factors.map(f => ({
            id: f.id,
            name: f.name,
            probability: f.probability * 100,
            impact: f.impact * 10,
            level: f.impact >= 8.5 && f.probability >= 0.7 ? 'critical' : f.impact >= 7.5 ? 'high' : f.impact >= 6 ? 'medium' : 'low' as any
        }));
    };

    const formatTrendData = (trends: any[]) => {
        if (!trends) return [];
        return trends.map(t => ({
            label: t.period.substring(5), // Keep only month
            value: Math.round(t.metrics.overall)
        }));
    };

    // Mock predictive graph data based on prediction score
    const generatePredictiveData = (prediction: any) => {
        if (!prediction) return [];
        const base = dashboardSummary?.esgScore || 70;
        const target = prediction.predictedRiskLevel === 'critical' ? base - 20 : prediction.predictedRiskLevel === 'high' ? base - 10 : base + 10;

        return [
            { month: 'Now', actual: base, predicted: base, upperBound: base + 2, lowerBound: base - 2 },
            { month: '+1M', actual: base + (target - base) * 0.2, predicted: base + (target - base) * 0.2, upperBound: base + (target - base) * 0.2 + 4, lowerBound: base + (target - base) * 0.2 - 4 },
            { month: '+2M', actual: base + (target - base) * 0.4, predicted: base + (target - base) * 0.4, upperBound: base + (target - base) * 0.4 + 6, lowerBound: base + (target - base) * 0.4 - 6 },
            { month: '+3M', predicted: base + (target - base) * 0.6, upperBound: base + (target - base) * 0.6 + 8, lowerBound: base + (target - base) * 0.6 - 8 },
            { month: '+4M', predicted: base + (target - base) * 0.8, upperBound: base + (target - base) * 0.8 + 10, lowerBound: base + (target - base) * 0.8 - 10 },
            { month: '+5M', predicted: base + (target - base) * 0.9, upperBound: base + (target - base) * 0.9 + 12, lowerBound: base + (target - base) * 0.9 - 12 },
            { month: '+6M', predicted: target, upperBound: target + 15, lowerBound: target - 15 }
        ];
    };

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 relative">

            {/* Background Aurora Effect */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black tracking-[0.3em] uppercase text-amber-400 w-fit shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <Gauge size={10} className="animate-pulse" />
                        {moduleInfo.domain} Adv · {moduleInfo.uuid}
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic text-omni-text-main uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Excellence</span> Hub
                    </h1>
                    <p className="text-omni-text-muted text-sm font-medium max-w-2xl font-['Outfit']">
                        {moduleInfo.description} — 高階商業智慧與營運中樞，整合全局情報掃描與 OKR/KPI 目標追蹤。
                    </p>
                </div>

                <button
                    onClick={handleRunScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all text-sm font-bold text-white group disabled:opacity-50 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <RefreshCcw size={16} className={`group-hover:rotate-180 transition-transform duration-700 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? '正在深層掃描市場...' : '啟動全局偵情掃描'}
                </button>
            </div>

            {/* 🎯 Top Section: Operational Health & Sushi Doctor */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">

                {/* Operational Health Ring (Aurora) */}
                <div className="xl:col-span-1">
                    <LiquidGlassContainer glowColor="emerald" intensity="medium" className="h-full flex flex-col items-center justify-center p-8 relative">
                        <h3 className="text-sm font-black tracking-[0.3em] text-omni-text-muted uppercase mb-4 absolute top-6 left-6 flex items-center gap-2">
                            <Activity size={14} className="text-emerald-400" />
                            營運健康度 (Health)
                        </h3>

                        <div className="relative flex items-center justify-center w-56 h-56 mt-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-[1px] border-dashed border-emerald-500/30"
                            />

                            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                <circle
                                    cx="112" cy="112" r="96"
                                    className="stroke-black/40 fill-none"
                                    strokeWidth="16"
                                />
                                <motion.circle
                                    cx="112" cy="112" r="96"
                                    className="stroke-emerald-400 fill-none"
                                    strokeWidth="16"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0 1000" }}
                                    animate={{ strokeDasharray: `${(operationalHealthScore / 100) * 603} 1000` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>

                            <div className="flex flex-col items-center justify-center gap-1 z-10">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="sentient-eye mb-2"
                                >
                                    <span className="text-4xl font-black text-white z-10 drop-shadow-lg">
                                        {omniScore}
                                    </span>
                                </motion.div>
                                <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">OmniScore Index</span>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4 mt-8">
                            <KPIIndicator icon={<TrendingUp size={14} />} label="Trend" value={`+${dashboardSummary?.trendIndicator || 0}%`} status="good" />
                            <KPIIndicator icon={<ShieldCheck size={14} />} label="Risk Level" value={(dashboardSummary?.riskLevel || 'UNKNOWN').toUpperCase()} status={dashboardSummary?.riskLevel === 'low' ? 'good' : 'warning'} />
                            <KPIIndicator icon={<Activity size={14} />} label="Compliance" value={(dashboardSummary?.complianceStatus || 'UNKNOWN').toUpperCase()} status={dashboardSummary?.complianceStatus === 'compliant' ? 'good' : 'warning'} />
                            <KPIIndicator icon={<AlertTriangle size={14} />} label="Open Alerts" value={riskData?.alerts?.length?.toString() || "0"} status={riskData?.alerts?.length > 0 ? 'warning' : 'good'} />
                        </div>
                    </LiquidGlassContainer>
                </div>

                {/* 🍱 Sushi Doctor Report */}
                <div className="xl:col-span-1">
                    <SentientActionCenter
                        actions={sentientActions}
                        onExecute={(id) => {
                            console.log("Executing Action:", id);
                            setSentientActions(prev => prev.filter(a => a.id !== id));
                        }}
                    />
                </div>

                <div className="xl:col-span-1">
                    <AnimatePresence mode="wait">
                        <LiquidGlassContainer glowColor="amber" intensity="medium" className="h-full">
                            <div className="flex flex-col gap-6 p-6 h-full">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                        <Sparkles size={24} className="text-amber-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight text-white uppercase italic">Sushi Doctor</h3>
                                        <p className="text-xs text-amber-500/80 font-mono tracking-widest mt-1">SENTIENT INTELLIGENCE</p>
                                    </div>
                                </div>
                                <div className="prose prose-invert max-w-none prose-sm leading-relaxed text-omni-text-main flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <motion.div
                                        key={report}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 rounded-xl bg-black/20 border border-white/5 font-medium whitespace-pre-wrap leading-relaxed text-xs"
                                    >
                                        {report ? report : "Initializing neural distillation..."}
                                    </motion.div>
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </AnimatePresence>
                </div>
            </div>

            {/* 📈 Middle Section: Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-4">
                <div className="md:col-span-1">
                    <RiskHeatmap risks={formatRiskFactors(riskData?.assessment?.factors)} />
                </div>
                <div className="md:col-span-1">
                    <TrendChart
                        title="Overall ESG Trend"
                        data={formatTrendData(queryData?.trends)}
                        color="emerald"
                    />
                </div>
                <div className="md:col-span-1">
                    <PredictiveChart
                        title="6-Month Forecast"
                        data={generatePredictiveData(predictData)}
                    />
                </div>
            </div>

            {/* 🔽 New Section: Impact Retention Funnel */}
            {funnelData && (
                <div className="relative z-10">
                    <FunnelChart
                        title="Impact Retention & Resonance Funnel"
                        data={funnelData}
                    />
                </div>
            )}

            {/* 🔽 New Section: Resonance & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-2">
                    <ResonanceHeatmap
                        services={[
                            // E - Environmental (8)
                            { id: 'e1', name: 'Personal ESG Dashboard', category: 'E', status: 'ACTIVE', health: 95 },
                            { id: 'e2', name: 'Carbon Auditing', category: 'E', status: 'ACTIVE', health: 88 },
                            { id: 'e3', name: 'Energy Optimization', category: 'E', status: 'ACTIVE', health: 72 },
                            { id: 'e4', name: 'Water Security', category: 'E', status: 'DEVELOPMENT', health: 45 },
                            { id: 'e5', name: 'Waste Management', category: 'E', status: 'PLANNED', health: 10 },
                            { id: 'e6', name: 'Biodiversity Log', category: 'E', status: 'ACTIVE', health: 82 },
                            { id: 'e7', name: 'Circular Economy', category: 'E', status: 'ACTIVE', health: 91 },
                            { id: 'e8', name: 'Climate Risk', category: 'E', status: 'ACTIVE', health: 79 },
                            // S - Social (8)
                            { id: 's1', name: 'DEI Analytics', category: 'S', status: 'ACTIVE', health: 98 },
                            { id: 's2', name: 'Human Rights Monitor', category: 'S', status: 'DEVELOPMENT', health: 54 },
                            { id: 's3', name: 'Talent Growth', category: 'S', status: 'ACTIVE', health: 86 },
                            { id: 's4', name: 'Community Impact', category: 'S', status: 'ACTIVE', health: 92 },
                            { id: 's5', name: 'Safety Shield', category: 'S', status: 'ACTIVE', health: 85 },
                            { id: 's6', name: 'Product Integrity', category: 'S', status: 'ACTIVE', health: 77 },
                            { id: 's7', name: 'Social Alchemy', category: 'S', status: 'PLANNED', health: 5 },
                            { id: 's8', name: 'Wellness Pulse', category: 'S', status: 'ACTIVE', health: 80 },
                            // G - Governance (8)
                            { id: 'g1', name: 'Board Transparency', category: 'G', status: 'ACTIVE', health: 94 },
                            { id: 'g2', name: 'Ethics Guardian', category: 'G', status: 'ACTIVE', health: 89 },
                            { id: 'g3', name: 'Regulatory Radar', category: 'G', status: 'ACTIVE', health: 91 },
                            { id: 'g4', name: 'Data Privacy', category: 'G', status: 'ACTIVE', health: 99 },
                            { id: 'g5', name: 'Internal Control', category: 'G', status: 'ACTIVE', health: 84 },
                            { id: 'g6', name: 'Tax Strategy', category: 'G', status: 'DEVELOPMENT', health: 32 },
                            { id: 'g7', name: 'Shareholder Voice', category: 'G', status: 'ACTIVE', health: 76 },
                            { id: 'g8', name: 'Crisis Resilience', category: 'G', status: 'ACTIVE', health: 81 },
                        ]}
                    />
                </div>
                <div className="lg:col-span-1">
                    <LiquidGlassContainer glowColor="amber" className="h-full p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-amber-400" size={20} />
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white">AI Strategy Insight</h4>
                        </div>
                        <div className="flex-1 flex flex-col gap-4 text-sm text-omni-text-main/80 font-medium leading-relaxed italic">
                            <p>「監測到『碳排放強度』與『供應商參與度』之間存在因果耦合失調。」</p>
                            <p>建議啟動「G3: Regulatory Radar」對接最新歐盟供應鏈指令，並透過「E2: Carbon Auditing」進行回溯驗算。</p>
                            <p className="text-[#63a6b0] font-black not-italic text-xs">—— Dr. Thoth Neural Advice</p>
                        </div>
                        <button className="w-full py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[10px] font-black text-amber-500 uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">
                            應用戰略建議
                        </button>
                    </LiquidGlassContainer>
                </div>
            </div>

            {/* 📊 Bottom Section: Data Matrices */}
            <div className="grid grid-cols-1 gap-8 relative z-10 pt-4">
                {riskData?.alerts && riskData.alerts.length > 0 && (
                    <OmniTable
                        title="Active Risk Alerts"
                        subtitle="OmniRiskPredictor 即時風險警告"
                        data={riskData.alerts}
                        columns={[
                            { key: 'title', header: '風險標題' },
                            { key: 'category', header: '類別', render: (val: any) => <span className="text-[10px] uppercase text-white/50 tracking-wider font-bold">{val}</span> },
                            {
                                key: 'severity',
                                header: '嚴重程度',
                                render: (val: any) => (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${val === 'critical' ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400' :
                                        val === 'warning' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400' :
                                            'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                                        }`}>
                                        {val}
                                    </span>
                                )
                            },
                            { key: 'description', header: '描述', render: (val: any) => <span className="text-xs text-omni-text-main/80 truncate block max-w-xs">{val}</span> }
                        ]}
                    />
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}

// 🎛️ Small KPI Indicator Component
function KPIIndicator({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: 'good' | 'warning' | 'danger' }) {
    const colorMap = {
        good: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
        warning: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
        danger: 'text-rose-400 border-rose-500/20 bg-rose-500/10'
    };

    return (
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-black/40 border border-white/5 justify-center">
            <span className="text-[10px] font-bold text-omni-text-muted uppercase tracking-wider flex items-center gap-1.5">
                {icon} {label}
            </span>
            <span className={`text-lg font-black font-['Outfit'] border px-2 py-0.5 rounded-md w-fit ${colorMap[status]}`}>
                {value}
            </span>
        </div>
    );
}