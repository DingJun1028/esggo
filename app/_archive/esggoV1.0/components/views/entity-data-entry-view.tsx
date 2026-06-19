"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Database,
    ShieldCheck,
    Send,
    Globe,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Building2,
    AlertCircle,
    Info,
    FileUp,
    Link
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { MPCAggregator } from "@/lib/services/mpc-aggregator";
import { ZKPrivacyEngine } from "@/lib/services/zk-privacy-engine";
import ZKPAuditBadge from "@/components/ui/zkp-audit-badge";
import { IScoreBreakdown } from "@/lib/types/ncb-types";
import { MetricBreakdownPanel } from "@/components/ui/metric-breakdown-panel";

const ENTITIES: { id: string; name: string; level: 'L1' | 'L2' | 'L3' }[] = [
    { id: 'ent_tpe', name: 'ESG GO 台北總部 (HQ)', level: 'L1' },
    { id: 'ent_ldn', name: 'ESG GO 倫敦分部 (Branch)', level: 'L2' },
    { id: 'ent_sha', name: 'ESG GO 上海工廠 (Plant)', level: 'L3' }
];

export const EntityDataEntryView = () => {
    const [selectedEntity, setSelectedEntity] = useState(ENTITIES[0]);
    const [value, setValue] = useState(selectedEntity ? MPCAggregator.getEntityValue(selectedEntity.id).toString() : "0");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<{ value: number; proof: string; hasBackup: boolean } | null>(null);
    const [selectedBreakdown, setSelectedBreakdown] = useState<IScoreBreakdown | null>(null);
    const [hasBackupFile, setHasBackupFile] = useState(false);

    // Submission Steps for Sidebar
    const [submissionStep, setSubmissionStep] = useState<number>(0);

    const handleShowAnalysis = () => {
        const numValue = parseFloat(value) || 0;
        setSelectedBreakdown({
            metricId: "GHG-S1-ANALYSIS",
            score: Math.min(100, Math.round(numValue / 10)),
            maxScore: 100,
            weightedFormula: "Sum(DailyLogs) * EmissionFactor * GWP_100",
            subMetrics: [
                { name: "固定燃燒源 (Stationary)", value: numValue * 0.6, weight: 0.6, source: "天然氣/燃料帳單" },
                { name: "移動燃燒源 (Mobile)", value: numValue * 0.3, weight: 0.3, source: "公務車加油卡" },
                { name: "逸散排放源 (Fugitive)", value: numValue * 0.1, weight: 0.1, source: "冷媒填充紀錄" }
            ],
            approverPath: [
                { role: "Site Manager", name: (selectedEntity?.name || "System") + " Lead", timestamp: Date.now(), zkpLevel: selectedEntity?.level || "L1" }
            ]
        });
    };

    const handleUpdate = async () => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        setIsSubmitting(true);
        setSubmissionStep(1); // Encrypting

        await new Promise(r => setTimeout(r, 800));
        setSubmissionStep(2); // Generating Proof

        await new Promise(r => setTimeout(r, 800));
        setSubmissionStep(3); // Anchoring

        await new Promise(r => setTimeout(r, 600));

        MPCAggregator.updateEntityValue(selectedEntity?.id || "", numValue);
        setLastSubmission({
            value: numValue,
            proof: `ZKPROOF_${(selectedEntity?.id || "NULL").toUpperCase()}_v${numValue}_t${Date.now()}`,
            hasBackup: hasBackupFile
        });
        setIsSubmitting(false);
        setSubmissionStep(4); // Completed
        setShowPreview(false);
    };

    // Calculate masked preview
    const maskedValue = ZKPrivacyEngine.process(parseFloat(value) || 0, selectedEntity?.level || "L1").maskedValue;

    return (
        <div className="relative flex flex-col gap-8 p-10 max-w-7xl mx-auto min-h-screen">
            {/* Background Decorative Mesh */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-stitch-teal-start/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-stitch-primary/5 blur-[120px] rounded-full" />

            {/* Header */}
            <div className="flex flex-col gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="p-4 bg-white shadow-soft rounded-[20px] border border-stitch-border/50">
                        <Building2 className="w-10 h-10 text-stitch-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-stitch-text bg-gradient-to-r from-stitch-text to-stitch-text/60 bg-clip-text text-transparent">
                            實體數據接入中心
                        </h1>
                        <p className="text-stitch-text-muted font-bold flex items-center gap-2 mt-1">
                            <ShieldCheck className="w-4 h-4 text-stitch-teal-start" />
                            5T + ZKP Protocol: Secure Data Entry & Privacy-at-Source
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Left Sidebar: Entity Selection */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-[11px] font-black text-stitch-text-muted uppercase tracking-[0.25em] px-2 mb-2">
                            Select Current Entity
                        </h2>
                        <div className="flex flex-col gap-3">
                            {ENTITIES.map((ent, idx) => (
                                <motion.button
                                    key={ent.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => {
                                        setSelectedEntity(ent);
                                        setValue(MPCAggregator.getEntityValue(ent.id).toString());
                                        setLastSubmission(null);
                                        setSubmissionStep(0);
                                    }}
                                    className={`group relative p-5 rounded-[20px] text-left transition-all overflow-hidden border-2 hover:shadow-lifted hover:-translate-y-1 ${selectedEntity?.id === ent.id
                                        ? 'bg-white border-stitch-teal-start shadow-glass ring-1 ring-stitch-teal-start/20'
                                        : 'bg-white/40 backdrop-blur-md border-transparent hover:border-stitch-teal-start/30'
                                        }`}
                                >
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-colors ${selectedEntity?.id === ent.id ? 'bg-stitch-teal-start text-white shadow-lifted' : 'bg-stitch-shallow-gray text-stitch-muted group-hover:bg-stitch-teal-start/10'}`}>
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-black transition-colors ${selectedEntity?.id === ent.id ? 'text-stitch-text' : 'text-stitch-text-muted group-hover:text-stitch-text'}`}>
                                                {ent.name}
                                            </span>
                                            <Badge variant="optimal" styleType="soft" className="w-fit scale-75 -ml-4 mt-1">
                                                Level: {ent.level}
                                            </Badge>
                                        </div>
                                    </div>
                                    {selectedEntity?.id === ent.id && (
                                        <motion.div
                                            layoutId="active-bg"
                                            className="absolute inset-0 bg-gradient-to-br from-stitch-teal-start/10 to-transparent pointer-events-none"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Help Section */}
                    <GlassCard className="p-6 bg-yellow-400/10 border-yellow-200/50">
                        <div className="flex gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-black text-yellow-800 uppercase tracking-widest">Protocol Notice</span>
                                <p className="text-[11px] text-yellow-700/80 leading-relaxed font-bold">
                                    此頁面模擬邊緣端 (Edge) 接入流程。原始數據經由 ZK 脫敏後，僅傳輸證明至集團節點。
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Main Content: Data Entry */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <GlassCard className="p-10 flex flex-col gap-10 border-t-[6px] border-t-stitch-teal-start relative overflow-hidden group/card shadow-massive">
                        {/* Prism Shimmer Overlays */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 pointer-events-none transition-opacity duration-1000">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-stitch-teal-start via-purple-500 to-primary-gold blur-[100px] animate-pulse" />
                        </div>
                        {/* Decorative Gradient Line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-black flex items-center gap-3 text-stitch-text">
                                    <div className="p-2 bg-stitch-teal-start/10 rounded-lg">
                                        <Database className="w-6 h-6 text-stitch-teal-start" />
                                    </div>
                                    範疇一數據錄入
                                </h2>
                                <p className="text-xs font-bold text-stitch-muted uppercase tracking-[0.1em] ml-11">
                                    Scope 1: Direct Emissions Inventory
                                </p>
                            </div>
                            <Badge variant="critical" styleType="soft" className="font-black px-4 py-2">
                                單位: tCO2e
                            </Badge>
                        </div>

                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-stitch-text-muted uppercase tracking-[0.2em]">
                                        當月總累計排放量 (Monthly Cumulative)
                                    </label>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShowAnalysis}
                                        className="text-[10px] font-black text-stitch-teal-start bg-stitch-teal-start/5 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all uppercase tracking-widest border border-stitch-teal-start/10"
                                    >
                                        <Info className="w-3.5 h-3.5" />
                                        查看計算依據
                                    </motion.button>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="w-full text-6xl font-black p-10 bg-stitch-bg/50 backdrop-blur-xl rounded-[32px] border-2 border-stitch-border/50 focus:border-stitch-teal-start focus:bg-white outline-none transition-all placeholder:text-stitch-text-muted/20 text-stitch-text text-center shadow-minimal"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute inset-0 rounded-[32px] pointer-events-none border-2 border-transparent group-focus-within:border-stitch-teal-start/20 transition-all scale-[1.02]" />
                                    {/* Real-time Impact Indicator */}
                                    <AnimatePresence>
                                        {value && value !== "0" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white shadow-lifted border border-stitch-border/50 px-4 py-2 rounded-full whitespace-nowrap z-20"
                                            >
                                                <div className="flex items-center gap-1.5 border-r border-stitch-border pr-3">
                                                    <div className={`w-2 h-2 rounded-full ${parseFloat(value) < 500 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                                    <span className="text-[10px] font-black text-stitch-text uppercase tracking-widest">
                                                        {parseFloat(value) < 500 ? 'Consistent' : 'Outlier Detected'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 pl-1">
                                                    <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(100, (parseFloat(value) / 1000) * 100)}%` }}
                                                            className="h-full bg-stitch-teal-start"
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-stitch-muted">Impact: {parseFloat((Math.min(100, (parseFloat(value) / 10))).toFixed(1))}%</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Privacy Preview Card */}
                            <motion.div
                                className="relative p-8 bg-stitch-text rounded-[24px] shadow-lifted overflow-hidden group"
                                whileHover={{ scale: 1.01 }}
                            >
                                {/* Mesh Effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-stitch-teal-start/20 blur-3xl rounded-full" />

                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
                                                <Lock className="w-4 h-4 text-stitch-teal-start" />
                                            </div>
                                            <span className="text-sm font-black text-white/90 tracking-widest uppercase">
                                                ZK-Privacy 隱私盾
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black text-stitch-teal-start flex items-center gap-2 transition-all"
                                        >
                                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            {showPreview ? "MASK DATA" : "VIEW PROXY"}
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-16 flex items-center justify-center bg-black/20 rounded-xl border border-white/5 relative overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                <motion.span
                                                    key={showPreview ? 'preview' : 'masked'}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 1.1 }}
                                                    className="text-3xl font-mono font-black text-white tracking-[0.2em]"
                                                >
                                                    {showPreview ? maskedValue : "************"}
                                                </motion.span>
                                            </AnimatePresence>
                                            {/* Security Pulse Animation */}
                                            <motion.div
                                                animate={{ opacity: [0, 0.5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-stitch-teal-start/10"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-2 px-1">
                                            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
                                                Hash Architecture: SHA-256 + Pedersen
                                            </span>
                                            <Badge variant="optimal" styleType="soft" className="text-[9px]">
                                                LVL {selectedEntity?.level || "L1"} SECURE
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex flex-col gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleUpdate}
                                    disabled={isSubmitting || !value || value === "0"}
                                    className="w-full py-7 bg-gradient-to-r from-stitch-teal-start to-stitch-teal-start/80 text-white rounded-[24px] font-black text-2xl hover:shadow-glass active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-40 shadow-minimal group"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <Globe className="w-8 h-8" />
                                        </motion.div>
                                    ) : (
                                        <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                                            <Send className="w-6 h-6" />
                                        </div>
                                    )}
                                    <span className="tracking-tight">
                                        {isSubmitting ? "正在執行 ZK-Proofs 證存..." : "安全遞交 5T 存證"}
                                    </span>
                                </motion.button>

                                {/* File Attachment Section */}
                                <div className="p-6 bg-white/40 backdrop-blur-md rounded-[24px] border-2 border-dashed border-stitch-border hover:border-stitch-teal-start/50 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white shadow-soft rounded-xl text-stitch-primary">
                                                <FileUp className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-stitch-text uppercase tracking-widest">補充佐證文件</span>
                                                <span className="text-[10px] text-stitch-muted font-bold opacity-60 uppercase">Evidence Linkage</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setHasBackupFile(!hasBackupFile)}
                                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${hasBackupFile ? 'bg-stitch-critical/10 text-stitch-critical border border-stitch-critical/20' : 'bg-stitch-text text-white shadow-lifted'}`}
                                            >
                                                {hasBackupFile ? "REMOVE" : "UPLOAD EVIDENCE"}
                                            </button>
                                        </div>
                                    </div>
                                    {hasBackupFile && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-4 pt-4 border-t border-stitch-border/50"
                                        >
                                            <div className="flex items-center gap-2 text-stitch-teal-start font-black text-[11px]">
                                                <ShieldCheck className="w-3 h-3" />
                                                已鏈結佐證: GHG_EVIDENCE_2024_04.PDF
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Success Message */}
                    <AnimatePresence>
                        {lastSubmission && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <GlassCard className="p-8 bg-green-500/5 border-green-200 shadow-glass overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-500/10 to-transparent" />
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="p-4 bg-green-500 rounded-2xl text-white shadow-lifted">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <div className="flex flex-col flex-grow gap-1">
                                            <h3 className="text-xl font-black text-green-900 uppercase tracking-tight">存證歸檔成功</h3>
                                            <p className="text-xs text-green-700 font-bold">
                                                累計值 <span className="text-lg font-black">{lastSubmission.value}</span> 已完成 ZKP 簽章封印。
                                            </p>
                                        </div>
                                        <ZKPAuditBadge zkProof={lastSubmission.proof} level={selectedEntity?.level || "L1"} />
                                    </div>
                                    <div className="mt-6 p-4 bg-white/60 rounded-[16px] border border-green-200 flex flex-col gap-2">
                                        <span className="text-[10px] font-black text-green-800 uppercase tracking-[0.3em]">Block Anchor Hash</span>
                                        <code className="text-[10px] break-all font-mono text-green-600 font-bold opacity-80">
                                            {lastSubmission.proof}
                                        </code>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar: Integrity Tracker */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[11px] font-black text-stitch-text flex items-center gap-2 uppercase tracking-[0.25em] px-2">
                            Integrity Tracker
                        </h3>

                        <div className="bg-white/60 backdrop-blur-xl border border-stitch-border/50 rounded-[24px] p-6 space-y-8 shadow-minimal relative overflow-hidden">
                            {/* Network Topology SVG Overlay */}
                            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                                <path d="M 12 40 L 12 100 M 12 140 L 12 200 M 12 240 L 12 300" stroke="currentColor" className="text-stitch-teal-start" strokeWidth="1" strokeDasharray="4 4" />
                                <circle cx="30" cy="50" r="1" fill="currentColor" className="text-stitch-teal-start" />
                                <circle cx="50" cy="120" r="1.5" fill="currentColor" className="text-stitch-teal-start" />
                                <circle cx="40" cy="220" r="1" fill="currentColor" className="text-stitch-teal-start" />
                                <path d="M 12 50 Q 40 80 12 110" fill="none" stroke="currentColor" className="text-stitch-teal-start/20" strokeWidth="0.5" />
                                <path d="M 12 150 Q 50 180 12 210" fill="none" stroke="currentColor" className="text-stitch-teal-start/20" strokeWidth="0.5" />
                            </svg>
                            {[
                                { step: 1, label: "Data Source Validation", status: submissionStep >= 1 ? "完成" : "等待中", active: submissionStep === 1 },
                                { step: 2, label: "ZK-Proof Generation", status: submissionStep >= 2 ? "完成" : "等待中", active: submissionStep === 2 },
                                { step: 3, label: "Blockchain Anchoring", status: submissionStep >= 3 ? "完成" : "等待中", active: submissionStep === 3 },
                                { step: 4, label: "Audit Trail Finalized", status: submissionStep >= 4 ? "完成" : "等待中", active: submissionStep === 4 }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i < 3 && (
                                        <div className={`absolute left-[11px] top-6 w-[2px] h-10 ${submissionStep > s.step ? 'bg-stitch-teal-start' : 'bg-stitch-border'}`} />
                                    )}
                                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${submissionStep > s.step ? 'bg-stitch-teal-start border-stitch-teal-start' :
                                        s.active ? 'border-stitch-teal-start shadow-[0_0_15px_rgba(4,191,191,0.5)]' : 'border-stitch-border bg-white'
                                        }`}>
                                        {submissionStep > s.step ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                        ) : s.active ? (
                                            <div className="w-2 h-2 bg-stitch-teal-start rounded-full animate-pulse" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 bg-stitch-border rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-black transition-colors ${s.active ? 'text-stitch-teal-start' : 'text-stitch-text'}`}>
                                            {s.label}
                                        </span>
                                        <span className="text-[9px] font-bold text-stitch-muted uppercase tracking-widest mt-0.5">
                                            {s.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <h3 className="text-[11px] font-black text-stitch-text flex items-center gap-2 uppercase tracking-[0.25em] px-2">
                            5T Trust Pillars
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { icon: Link, title: "Traceable", color: "text-blue-500" },
                                { icon: ShieldCheck, title: "Trustworthy", color: "text-green-500" }
                            ].map((pill, i) => (
                                <div key={i} className="p-4 bg-white/40 rounded-2xl border border-stitch-border/50 flex items-center gap-3">
                                    <pill.icon className={`w-5 h-5 ${pill.color}`} />
                                    <span className="text-[10px] font-black uppercase text-stitch-text tracking-widest">{pill.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Breakdown Modal */}
            <AnimatePresence>
                {selectedBreakdown && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBreakdown(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-10"
                        >
                            <MetricBreakdownPanel
                                data={selectedBreakdown}
                                onClose={() => setSelectedBreakdown(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Premium Floating Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[24px] shadow-minimal mx-auto w-full max-w-4xl"
            >
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-stitch-teal-start rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-stitch-text uppercase tracking-widest opacity-60">Global Node: ESG-EDGE-092</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-stitch-text uppercase tracking-widest opacity-60">Data Latency: 42ms</span>
                    <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-stitch-teal-start" />
                        <span className="text-[10px] font-black text-stitch-teal-start uppercase tracking-widest">Post-Quantum Ready</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
