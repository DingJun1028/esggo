"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ShieldCheck,
    BarChart3,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ExternalLink,
    Target,
    Users,
    Trophy,
    Zap,
    Sparkles,
    FileText,
    Database,
    CheckCircle
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from "recharts";

// Import sub-views
import { AISkillTreeView } from "./ai-skill-tree-view";
import { ESGDatabaseView } from "./esg-database-view";
import { alignmentEngine } from "@/lib/core/alignment-engine";
import { EsgMetrics } from "@/lib/services/omni-service";
import { useTranslation } from "@/lib/hooks/use-translation";

const CERT_DATA = [
    { id: "gri", name: "GRI (全球永續報告準則)", status: "pending", score: 0, color: "#94A3B8", mapping: "GRI 305" },
    { id: "tcfd", name: "TCFD (氣候相關財務披露)", status: "pending", score: 0, color: "#94A3B8", mapping: "TCFD-Gov" },
    { id: "sasb", name: "SASB (永續會計準則委員會)", status: "pending", score: 0, color: "#94A3B8", mapping: "SASB-EM" },
    { id: "iso14064", name: "ISO 14064 (溫室氣體抵換)", status: "pending", score: 0, color: "#94A3B8", mapping: "ISO-14064-1" },
];

const BENCHMARK_DATA = [
    { subject: '環境 (E)', A: 120, B: 110, fullMark: 150 },
    { subject: '社會 (S)', A: 98, B: 130, fullMark: 150 },
    { subject: '治理 (G)', A: 86, B: 130, fullMark: 150 },
    { subject: '供應鏈管理', A: 99, B: 100, fullMark: 150 },
    { subject: '勞工人權', A: 85, B: 90, fullMark: 150 },
    { subject: '透明度', A: 65, B: 85, fullMark: 150 },
];

const INDUSTRY_TRENDS = [
    { year: '2022', company: 40, industry: 45 },
    { year: '2023', company: 65, industry: 55 },
    { year: '2024', company: 85, industry: 68 },
    { year: '2025(預估)', company: 95, industry: 75 },
];

export function CertificationAlignmentView() {
    const { t, lang } = useTranslation();
    const [activeTab, setActiveTab] = useState<'standards' | 'skills' | 'wizard' | 'databases'>('standards');
    const [certs, setCerts] = useState(CERT_DATA);
    const [selectedCert, setSelectedCert] = useState(certs[0]);
    const [wizardStep, setWizardStep] = useState(0);
    const [formData, setFormData] = useState<Partial<EsgMetrics>>({
        scope1Emissions: 0,
        scope2Emissions: 0,
        scope3Emissions: 0,
        energyConsumption: 0,
        waterUsage: 0,
        hazardousWaste: 0,
        nonHazardousWaste: 0,
        femaleManagementPct: 0,
    });

    const wizardSteps = [
        { id: "industry", q: t("alignment.q_industry"), type: "select", options: [t("alignment.opt_mfg"), t("alignment.opt_srv"), t("alignment.opt_tech"), t("alignment.opt_fin")] },
        { id: "scope1Emissions", q: `${t("standards.scope_1")} (tCO2e)`, type: "number" },
        { id: "scope2Emissions", q: `${t("standards.scope_2")} (tCO2e)`, type: "number" },
        { id: "energyConsumption", q: `年度總能源消耗量 (GJ)`, type: "number" },
        { id: "waterUsage", q: `年度總用水量 (m3)`, type: "number" },
        { id: "femaleManagementPct", q: `管理階層女性比例 (%)`, type: "number" },
    ];

    const currentStep = wizardSteps[wizardStep];

    const handleWizardComplete = async () => {
        if (!selectedCert) return;
        const analysis = await alignmentEngine.analyze(formData as EsgMetrics);
        const alignedCount = analysis.filter(a => a.status === "Aligned").length;
        const calculatedScore = Math.round((alignedCount / analysis.length) * 100);

        setCerts(prev => prev.map(c =>
            c.id === selectedCert.id ? { ...c, score: calculatedScore, status: 'completed' } : c
        ));
        setActiveTab('standards');
        setWizardStep(0);
    };

    const nextStep = () => {
        if (wizardStep < wizardSteps.length - 1) {
            setWizardStep(wizardStep + 1);
        } else {
            handleWizardComplete();
        }
    };

    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden p-10 rounded-lg bg-stitch-teal-dark text-white border border-white/5"
            >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight">
                                {t("alignment.view_title")}<br />
                                <span className="text-white/60 text-lg font-medium tracking-widest uppercase">Strategic Intelligence</span>
                            </h1>
                        </div>
                        <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                            {t("alignment.hero_description")}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setActiveTab('wizard')}
                            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-black text-sm font-black hover:bg-stitch-teal-light hover:text-white transition-all shadow-minimal"
                        >
                            <Zap className="w-4 h-4 text-stitch-teal-start" />
                            {t("alignment.launch_wizard")}
                        </button>
                        <div className="flex p-1 bg-white/10 backdrop-blur-md rounded-lg self-end">
                            {(['standards', 'skills', 'databases'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-stitch-teal-start shadow-minimal' : 'text-white/60 hover:text-white'}`}
                                >
                                    {tab === 'standards' ? t("alignment.tab_standards") : tab === 'skills' ? t("alignment.tab_skills") : t("alignment.tab_databases")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'wizard' ? (
                    <motion.div
                        key="wizard"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col gap-8 p-12 items-center justify-center text-center bg-white/80 backdrop-blur-2xl rounded-[48px] border border-white shadow-massive relative overflow-hidden min-h-[600px]"
                    >
                        {/* Premium Gradient Progress Header */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
                            <motion.div
                                className="h-full bg-gradient-to-r from-stitch-teal-start via-stitch-teal-light to-stitch-teal-start bg-[length:200%_auto]"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${((wizardStep + 1) / wizardSteps.length) * 100}%`,
                                    backgroundPosition: ["0% center", "200% center"]
                                }}
                                transition={{
                                    width: { duration: 0.8, ease: "circOut" },
                                    backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                                }}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-stitch-teal-start/20 rounded-full blur-2xl group-hover:bg-stitch-teal-start/40 transition-all duration-500" />
                            <div className="relative mb-8 inline-flex p-6 rounded-3xl bg-black text-white shadow-glow">
                                <Zap className="w-10 h-10 animate-pulse" />
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-black to-slate-600 tracking-tight">
                                {t("alignment.wizard_title")}
                            </h2>
                            <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                                {t("alignment.wizard_subtitle")}
                            </p>
                        </div>

                        <div className="space-y-10 mb-16 w-full max-w-lg">
                            <div className="flex flex-col items-center gap-2">
                                <span className="px-4 py-1.5 rounded-full bg-stitch-teal-start/10 text-stitch-teal-start text-[11px] font-black uppercase tracking-[0.2em]">
                                    {t("alignment.step")} {wizardStep + 1} / {wizardSteps.length}
                                </span>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 px-6">
                                {currentStep?.q || "..."}
                            </h3>

                            <div className="px-4">
                                {currentStep?.type === 'select' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentStep?.options?.map(opt => (
                                            <button
                                                key={opt}
                                                className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:border-stitch-teal-start hover:bg-white hover:shadow-xl font-bold transition-all duration-300 text-slate-700 hover:text-stitch-teal-start flex items-center justify-center gap-3 group"
                                            >
                                                {opt}
                                                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {currentStep?.type === 'number' && (
                                    <div className="relative group max-w-xs mx-auto">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full py-8 text-6xl font-black text-center border-b-4 border-slate-200 focus:border-stitch-teal-start focus:outline-none bg-transparent transition-colors peer"
                                            value={formData[currentStep.id as keyof EsgMetrics] || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, [currentStep.id]: parseFloat(e.target.value) }))}
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-stitch-teal-start scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 origin-center" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Centered Navigation */}
                        <div className="flex items-center gap-6 mt-auto">
                            <button
                                onClick={() => { if (wizardStep > 0) setWizardStep(wizardStep - 1); else setActiveTab('standards'); }}
                                className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                {t("alignment.return")}
                            </button>
                            <button
                                onClick={nextStep}
                                className="px-16 py-5 rounded-2xl bg-black text-white font-black hover:bg-stitch-teal-start transition-all shadow-glow hover:scale-[1.02] active:scale-95 flex items-center gap-3 text-lg"
                            >
                                {wizardStep === wizardSteps.length - 1 ? (
                                    <><CheckCircle className="w-6 h-6" /> {t("alignment.complete")}</>
                                ) : (
                                    <>{t("alignment.next")} <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left/Middle Content Area */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            {activeTab === 'skills' ? (
                                <AISkillTreeView />
                            ) : activeTab === 'databases' ? (
                                <ESGDatabaseView />
                            ) : (
                                <>
                                    <div className="p-8 rounded-lg bg-white border border-stitch-border shadow-minimal">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-2xl font-black flex items-center gap-3">
                                                <Target className="w-6 h-6 text-stitch-teal-start" />
                                                合規對標進度
                                            </h2>
                                            <button className="text-sm font-bold text-stitch-teal-start hover:underline flex items-center gap-1">
                                                查看所有標準 <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {certs.map((cert) => (
                                                <button
                                                    key={cert.id}
                                                    onClick={() => setSelectedCert(cert)}
                                                    className={`p-6 rounded-lg border transition-all text-left group ${selectedCert?.id === cert.id
                                                        ? 'border-stitch-teal-start bg-stitch-teal-start/5 shadow-minimal'
                                                        : 'border-stitch-border bg-stitch-shallow-gray/50 hover:bg-stitch-shallow-gray'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="p-2 rounded-lg bg-white shadow-sm">
                                                            <ShieldCheck className={`w-5 h-5 ${selectedCert?.id === cert.id ? 'text-stitch-teal-start' : 'text-stitch-muted'}`} />
                                                        </div>
                                                        {cert.score >= 80 ? (
                                                            <span className="px-2 py-1 rounded-full bg-stitch-success/10 text-stitch-success text-[10px] font-bold uppercase">Ready to Audit</span>
                                                        ) : cert.score === 0 ? (
                                                            <span className="px-2 py-1 rounded-full bg-stitch-critical/10 text-stitch-critical text-[10px] font-bold uppercase">High Gap</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full bg-stitch-teal-start/10 text-stitch-teal-start text-[10px] font-bold uppercase">In Progress</span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold mb-2 group-hover:text-stitch-teal-start transition-colors">{cert.name}</h3>
                                                    <div className="flex items-end justify-between">
                                                        <div className="flex-1 mr-4">
                                                            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${cert.score}%` }}
                                                                    transition={{ duration: 1 }}
                                                                    className="h-full rounded-full bg-stitch-teal-start"
                                                                />
                                                            </div>
                                                        </div>
                                                        <span className="text-lg font-black">{cert.score}%</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-lg bg-white border border-stitch-border shadow-minimal">
                                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                                            <BarChart3 className="w-6 h-6 text-orange-500" />
                                            產業基準對決 (Enterprise Benchmark)
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="h-[300px]">
                                                <div className="text-sm font-bold text-center mb-4 text-stitch-muted">ESG 競爭力百分位 (%)</div>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={BENCHMARK_DATA}>
                                                        <PolarGrid stroke="#e2e8f0" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                                        <Radar
                                                            name="ESG GO (本案公司)"
                                                            dataKey="A"
                                                            stroke="#0D9488"
                                                            fill="#0D9488"
                                                            fillOpacity={0.5}
                                                        />
                                                        <Radar
                                                            name="產業均值 (Industry)"
                                                            dataKey="B"
                                                            stroke="#94a3b8"
                                                            fill="#94a3b8"
                                                            fillOpacity={0.3}
                                                        />
                                                        <Legend verticalAlign="bottom" />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="h-[300px]">
                                                <div className="text-sm font-bold text-center mb-4 text-stitch-muted">各年度氣候成長趨勢</div>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={INDUSTRY_TRENDS}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                        />
                                                        <Legend verticalAlign="bottom" />
                                                        <Bar name="公司表現" dataKey="company" fill="#0D9488" radius={[4, 4, 0, 0]} />
                                                        <Bar name="產業均值" dataKey="industry" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Content Area: AI Diagonal Assistant */}
                        <div className="flex flex-col gap-8">
                            <div className="p-8 rounded-lg bg-black text-white shadow-minimal min-h-[500px] flex flex-col border border-white/10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-stitch-teal-start to-stitch-teal-light flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white " />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">AI 診斷助手</h3>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="p-5 rounded-lg bg-white/5 border border-white/10">
                                        <div className="flex items-start gap-3 mb-4">
                                            <CheckCircle2 className="w-4 h-4 text-stitch-teal-start shrink-0 mt-1" />
                                            <p className="text-sm text-white/90 leading-relaxed">
                                                {activeTab === 'databases' ? (
                                                    "當前氣候數據庫已成功串接，自動識別出 GRI 401 及 TCFD 治理指標。"
                                                ) : (
                                                    `診斷報告：${selectedCert?.name || "標準"} 對標進度已達 ${selectedCert?.score || 0}%，覆蓋 8 個核心指標。`
                                                )}
                                            </p>
                                        </div>
                                        {(selectedCert?.score || 0) < 50 ? (
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-4 h-4 text-stitch-critical shrink-0 mt-1" />
                                                <p className="text-xs text-stitch-critical leading-relaxed font-bold">
                                                    合規風險提示：氣候風險 Scope 3 數據收集完整度不足。建議通過「數據精靈」同步。
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-3">
                                                <Sparkles className="w-4 h-4 text-stitch-teal-start shrink-0 mt-1" />
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    表現優異：當前數據已通過 5T 完整性簽署。
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg group hover:bg-white/10 transition-all cursor-pointer">
                                            <div className="text-[10px] text-white/40 mb-2 uppercase tracking-widest">建議強化路徑</div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-white/80">治理架構完整度待提升</span>
                                                <button
                                                    onClick={() => { setActiveTab('wizard'); setWizardStep(1); }}
                                                    className="text-xs font-black text-stitch-teal-start hover:underline"
                                                >
                                                    立即優化
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                            <div className="text-[10px] text-white/40 mb-2 uppercase tracking-widest">5T 簽署狀態</div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-white/80">數據 SBTi 簽署準備</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stitch-teal-start/20 text-stitch-teal-start font-bold">已就緒</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <button className="w-full py-4 rounded-lg bg-white text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-stitch-teal-light hover:text-white transition-all">
                                        <FileText className="w-4 h-4" />
                                        生成的對標診斷清單 (6T)
                                    </button>
                                    <button className="w-full py-4 rounded-lg border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-colors">
                                        諮詢 OmniSphere
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-white/10 backdrop-blur-xl">
                                <h3 className="font-black text-white mb-6 flex items-center gap-2 text-lg">
                                    <Trophy className="w-6 h-6 text-yellow-500" />
                                    行業與區域排名
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: "環保效率指數", rank: "TOP 5%", color: "text-stitch-success" },
                                        { label: "性別多樣性", rank: "TOP 12%", color: "text-stitch-success" },
                                        { label: "供應鏈人權透明度", rank: "BOTTOM 30%", color: "text-stitch-critical" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                            <span className="text-sm font-bold text-white/70">{item.label}</span>
                                            <span className={`text-sm font-black ${item.color}`}>{item.rank}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-8 text-[10px] text-white/30 font-medium text-center uppercase tracking-widest">
                                    Deep Alignment Engine v2.6
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
