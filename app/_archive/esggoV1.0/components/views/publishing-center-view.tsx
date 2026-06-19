"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Share2,
    FileText,
    Lock,
    ShieldCheck,
    Download,
    Eye,
    EyeOff,
    CheckCircle2,
    QrCode,
    AlertTriangle,
    FileCheck,
    Link as LinkIcon,
    ArrowRight,
    Zap,
    RefreshCw,
    Database
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ZKPrivacyEngine } from "@/lib/services/zk-privacy-engine";
import ZKPAuditBadge from "@/components/ui/zkp-audit-badge";
import { cn } from "@/lib/utils";
import { getTrinityContext, createOmniHeart, IOmniHeart } from "@/lib/omni-heart";
import { OmniTrinityShield } from "@/components/ui/omni-trinity-shield";
import { TrinityBreakdown } from "@/components/ui/trinity-breakdown";

// --- Internal Component: Chain of Trust ---
const ChainOfTrust = ({ heart }: { heart: IOmniHeart }) => {
    const nodes = [
        { label: "API_Ingest", type: "EXTERNAL", status: "VERIFIED" },
        { label: "Evidence_Vault", type: "ROOT", status: "VERIFIED" },
        { label: "NCBDB_Anchor", type: "SYNC", status: "VERIFIED" },
        { label: "ZKP_Proof_Gen", type: "PRIVATE", status: "ACTIVE" },
        { label: "Final_Report", type: "EMISSION", status: "PENDING" },
    ];

    return (
        <div className="flex items-center justify-between gap-2 p-6 bg-stone-900 rounded-[32px] border border-white/10 relative overflow-hidden">
            {nodes.map((node, i) => (
                <div key={i} className="flex items-center gap-2 group flex-1">
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                            node.status === "VERIFIED" || node.status === "ACTIVE"
                                ? "bg-primary-teal-start/20 text-primary-teal-start border border-primary-teal-start/30 shadow-[0_0_15px_rgba(0,158,157,0.2)]"
                                : "bg-white/5 text-white/20 border border-white/5"
                        )}>
                            {node.type === "EXTERNAL" && <Database className="w-4 h-4" />}
                            {node.type === "ROOT" && <LinkIcon className="w-4 h-4" />}
                            {node.type === "SYNC" && <RefreshCw className="w-4 h-4" />}
                            {node.type === "PRIVATE" && <Lock className="w-4 h-4" />}
                            {node.type === "EMISSION" && <FileCheck className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            node.status === "VERIFIED" || node.status === "ACTIVE" ? "text-white" : "text-white/20"
                        )}>
                            {node.label}
                        </span>
                    </div>
                    {i < nodes.length - 1 && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className={cn(
                                "h-[1px] flex-1",
                                i < 2 ? "bg-primary-teal-start/40" : "bg-white/10"
                            )} />
                            <ArrowRight className={cn(
                                "w-3 h-3 mx-1",
                                i < 2 ? "text-primary-teal-start" : "text-white/10"
                            )} />
                        </div>
                    )}
                </div>
            ))}
            {/* Animated Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-teal-start/10 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};

export const PublishingCenterView = () => {
    const [isMaskingEnabled, setIsMaskingEnabled] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [sealingStep, setSealingStep] = useState(0);

    // Simulated heart for the report context
    const reportHeart = createOmniHeart("Environment", "Carbon", "Report_Engine_v3");
    const trinity = getTrinityContext(reportHeart);

    const sensitiveData = [
        { label: "供應商名稱 (Supplier)", value: "Precision Tech Corp", level: "L2" as const },
        { label: "溫室氣體精確排放值 (Exact Emissions)", value: 1254.32, level: "L1" as const },
        { label: "內部員工 ID (Employee ID)", value: "EMP-99283", level: "L3" as const },
    ];

    const handleExport = () => {
        setIsExporting(true);
        setSealingStep(1);

        // Step 1: Identification (800ms)
        setTimeout(() => {
            setSealingStep(2);
            // Step 2: Proof Gen (1200ms)
            setTimeout(() => {
                setSealingStep(3);
                // Step 3: Anchorage (1000ms)
                setTimeout(() => {
                    setSealingStep(4);
                    // Step 4: Sync (600ms)
                    setTimeout(() => {
                        setIsExporting(false);
                        setExportSuccess(true);
                        setSealingStep(0);
                    }, 600);
                }, 1000);
            }, 1200);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-8 p-10 max-w-6xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-primary-teal-start shadow-xl">
                            <Share2 className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="optimal" styleType="soft" className="bg-primary-teal-start/10 text-primary-teal-start border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                                    OMNI_PUBLISH_PROTOCOL
                                </Badge>
                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">v3.3 Stable</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-stitch-text uppercase font-headline">
                                Publishing_Center <span className="text-stone-300">/</span> <span className="text-primary-teal-start">發布金庫</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <GlassCard className="p-10 flex flex-col gap-8 border-stone-200/50 bg-white shadow-2xl rounded-[40px] overflow-hidden relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black text-stitch-text uppercase tracking-tighter mb-1 font-headline">
                                    Report_Payload <span className="text-stone-200">/</span> 待發布內容
                                </h2>
                                <p className="text-sm font-bold text-stone-500">2026 年度永續報告書 (企業永續發展章節)</p>
                            </div>
                            <Badge variant="optimal" styleType="soft" className="px-4 py-2 bg-stone-100 text-stone-600 font-black text-[10px] uppercase border-none">Draft v2.1</Badge>
                        </div>

                        <div className="p-8 bg-amber-50/30 rounded-[32px] border border-amber-200/50 flex flex-col gap-6 relative overflow-hidden group">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-black text-amber-900 block leading-none mb-1">零知識隱私設定 (ZKP Setting)</span>
                                        <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest">Active Privacy Masking</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMaskingEnabled(!isMaskingEnabled)}
                                    className={cn(
                                        "relative w-14 h-7 rounded-full transition-all duration-300",
                                        isMaskingEnabled ? 'bg-amber-600' : 'bg-stone-200'
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md",
                                        isMaskingEnabled ? 'left-8' : 'left-1'
                                    )} />
                                </button>
                            </div>
                            <p className="text-xs text-amber-900/70 font-bold leading-relaxed relative z-10">
                                開啟後，系統將根據 5T 協議自動去敏化供應商資訊與精確財務數據，並產生成對應的 ZK-Proofs 供第三方查驗。這確保了商業機密的安全性，同時保持數據的公信力。
                            </p>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl -translate-x-10 -translate-y-10 group-hover:bg-amber-500/10 transition-colors" />
                        </div>

                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1">
                                Sensitive_Data_Masking / 敏感數據去敏化預覽
                            </h3>
                            <div className="grid gap-4">
                                {sensitiveData.map((item, idx) => {
                                    const processed = ZKPrivacyEngine.process(item.value, item.level);
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center justify-between p-6 bg-stone-50 rounded-[24px] border border-stone-100 hover:border-primary-teal-start/20 transition-all group"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">{item.label}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "text-sm font-mono tracking-tight transition-all",
                                                        isMaskingEnabled ? 'text-primary-teal-start font-black' : 'text-stone-300 line-through'
                                                    )}>
                                                        {isMaskingEnabled ? String(processed.maskedValue) : String(item.value)}
                                                    </span>
                                                    {isMaskingEnabled && (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[8px] font-black text-emerald-700 uppercase tracking-tighter">ZK-Proof Valid</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant={item.level === 'L3' ? 'lethal' : item.level === 'L2' ? 'critical' : 'optimal'} styleType="soft" className="font-black text-[9px] uppercase border-none px-3 py-1">
                                                {item.level === 'L1' ? 'L1: 模糊化 (Fuzzy)' : item.level === 'L2' ? 'L2: 假名化 (Pseudo)' : 'L3: 不可逆 (Irreversible)'}
                                            </Badge>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Decorative Mesh */}
                        <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    </GlassCard>

                    <div className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-primary-teal-start" /> Chain_of_Trust / 5T 誠信鏈條
                        </h3>
                        <ChainOfTrust heart={reportHeart} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {[
                                { title: "真 (Truthful)", subtitle: "Traceable (可溯源)", desc: "確保每筆數據皆有清晰的原始起點與負責人。" },
                                { title: "善 (Thankful)", subtitle: "Transparent (可透明)", desc: "算法透明，符合 ISO-14064-1 等國際標準。" },
                                { title: "美 (Tasteful)", subtitle: "Tangible (可感知)", desc: "提供沉浸式的操作體驗，枯燥指標可視化。" },
                                { title: "通 (Transferful)", subtitle: "Trackable (可追蹤)", desc: "全程記錄數據在平台間的流轉與修改歷程。" },
                            ].map((t) => (
                                <div key={t.title} className="p-5 bg-white rounded-[24px] border border-stone-100 hover:border-primary-teal-start/10 transition-all shadow-sm">
                                    <span className="text-[11px] font-black text-stitch-text mb-1 block uppercase tracking-widest">{t.title}</span>
                                    <span className="text-[8px] font-black text-primary-teal-start uppercase tracking-widest block mb-2">{t.subtitle}</span>
                                    <p className="text-[10px] text-stone-500 font-bold leading-relaxed">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Export Side Section */}
                <div className="flex flex-col gap-8">
                    <GlassCard className="p-10 bg-stone-900 border-none text-white flex flex-col gap-10 shadow-minimal rounded-[40px] relative overflow-hidden">
                        <div className="flex flex-col gap-3 relative z-10">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none mb-1">Vault_Emission_Status</span>
                            <h3 className="text-3xl font-black tracking-tighter uppercase font-headline">Report_Sealing</h3>
                            <div className="h-1 w-12 bg-primary-teal-start rounded-full" />
                        </div>

                        <div className="flex flex-col gap-6 p-8 bg-white/5 rounded-[32px] border border-white/10 relative overflow-hidden group">
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-20 h-20 flex items-center justify-center relative bg-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                    <OmniTrinityShield heart={reportHeart} size="sm" className="scale-150" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Global Trinity Score</span>
                                    <span className="text-4xl font-black text-primary-teal-start tracking-tighter">{trinity.divinity}%</span>
                                    <Badge variant="optimal" styleType="soft" className="bg-primary-teal-start/20 text-primary-teal-start border-none font-black text-[8px] uppercase mt-2 self-start px-2 py-0.5">Supreme Integrity</Badge>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 relative z-10 border-t border-white/5 pt-6">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Protocol Status</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-white/70">TRUTHFUL: {trinity.truth.status}</span>
                                    <span className="text-[10px] font-mono text-white/70">THANKFUL: {trinity.order.status}</span>
                                    <span className="text-[10px] font-mono text-white/70">TRANSFERFUL: {trinity.flow.status}</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${trinity.divinity}%` }}
                                        transition={{ duration: 1.5 }}
                                        className="h-full bg-primary-teal-start"
                                    />
                                </div>
                            </div>
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-teal-start/10 rounded-full blur-[60px] translate-x-10 -translate-y-10 group-hover:bg-primary-teal-start/20 transition-all" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <button
                                onClick={handleExport}
                                disabled={isExporting || exportSuccess}
                                className={cn(
                                    "w-full py-6 rounded-[24px] font-black text-lg transition-all flex items-center justify-center gap-4 disabled:opacity-50 group relative overflow-hidden",
                                    exportSuccess ? "bg-emerald-500 text-white" : "bg-primary-teal-start text-black hover:scale-[1.02] active:scale-95 shadow-[0_15px_30px_rgba(0,158,157,0.3)]"
                                )}
                            >
                                {isExporting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />}
                                <span className="uppercase tracking-widest text-sm">
                                    {isExporting ? "執行 5T+ZKP 封裝中..." : exportSuccess ? "報告導出成功" : "執行封裝並導出 PDF"}
                                </span>
                                {isExporting && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                                    />
                                )}
                            </button>

                            <AnimatePresence>
                                {isExporting && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 pt-6 border-t border-white/5"
                                    >
                                        {[
                                            { id: 1, label: "敏感數據掃描 (PII Scanning)", icon: ShieldCheck },
                                            { id: 2, label: "零知識證明生成 (Proof Gen)", icon: Lock },
                                            { id: 3, label: "5T 數據錨定 (Anchoring)", icon: CheckCircle2 },
                                            { id: 4, label: "雲端金庫同步 (Vault Sync)", icon: FileCheck }
                                        ].map((step) => (
                                            <div key={step.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                                        sealingStep >= step.id ? "bg-primary-teal-start/20 text-primary-teal-start" : "bg-white/5 text-white/20"
                                                    )}>
                                                        <step.icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-black tracking-widest uppercase",
                                                        sealingStep >= step.id ? "text-white" : "text-white/30"
                                                    )}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                                {sealingStep === step.id && (
                                                    <motion.div
                                                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                        className="w-2 h-2 rounded-full bg-primary-teal-start shadow-[0_0_8px_rgba(0,158,157,0.8)]"
                                                    />
                                                )}
                                                {sealingStep > step.id && (
                                                    <CheckCircle2 className="w-4 h-4 text-primary-teal-start" />
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <p className="text-[10px] text-white/20 text-center leading-relaxed font-bold italic tracking-tighter">
                                * 點擊後將啟動 ZKP 邏輯並產出符合 5T 協議之具有防偽時戳的正式報告。
                            </p>
                        </div>
                    </GlassCard>

                    <AnimatePresence>
                        {exportSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", damping: 15 }}
                            >
                                <GlassCard className="p-8 bg-emerald-500/5 border-emerald-500/20 flex flex-col gap-6 rounded-[32px] overflow-hidden relative group">
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="font-black text-emerald-500 text-lg uppercase tracking-tighter block leading-none mb-1">Export_Success</span>
                                            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">5T + ZKP Compliant Report Generated</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-emerald-800/70 font-bold leading-relaxed relative z-10">
                                        帶有 ZKP 掩碼處理的加密 PDF 已經同步至您的雲端金庫。外部利害關係人可透過查驗碼驗證報告真實性。
                                    </p>
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[32px] flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">Protocol Caution / 存證合規警示</span>
                            <p className="text-[10px] text-amber-700/80 leading-relaxed font-bold">
                                注意：一旦執行「正式發布」，報告將被鎖定於鏈上。後續任何修訂皆需留下對應之修補痕跡，以確保誠信與合規要求。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
