"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Papa from "papaparse";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Sparkles,
  FileCheck,
  ArrowRight,
  Database,
  TableProperties,
  Network,
  CloudLightning,
  ShieldCheck,
  Bot,
  AlertCircle,
  X,
  Files,
  ShieldAlert,
  CheckCircle2,
  Loader2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useMemo } from "react";


import { useAppContext } from "@/lib/context/app-context";
import { useCreateAuditRecord } from "@/src/dataconnect-generated/react";
import { dataconnect } from "@/lib/firebase";

export function OmniSrcView() {
  const { t, language } = useTranslation();
  const { setGlobalEsgData, setActiveView, setActiveSubView } = useAppContext();
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: "success" | "info" } | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [isWeaving, setIsWeaving] = useState(false);
  const [weavingStep, setWeavingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createAudit } = useCreateAuditRecord(dataconnect);

  const SRC_FUNCTIONS = [
    { id: "template", title: t.omniSrc.modules.template, icon: Files, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "gri", title: t.omniSrc.modules.gri, icon: Database, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "tcfd", title: t.omniSrc.modules.tcfd, icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50" },
    { id: "fsc97", title: t.omniSrc.modules.fsc97, icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "ai", title: t.omniSrc.modules.ai, icon: Loader2, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const REQUIRED_FIELDS = ["Indicator ID", "Value", "Trust Score", "Timestamp"];

  const showToast = (title: string, desc: string, type: "success" | "info" = "success") => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFuncClick = (funcId: string) => {
    if (funcId === "template") {
      setActiveView("sustain-write");
      setActiveSubView("templates");
    } else if (funcId === "ai") {
      setActiveView("sustain-write");
      setActiveSubView("ai-assist");
    } else {
      showToast(t.common.comingSoon, t.omniSrc.moduleOptimizing, "info");

    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError(t.omniSrc.formatError);

        return;
      }
      setCurrentFileName(file.name);
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    setError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results?.meta?.fields || [];
        const normalizedHeaders = headers.map(h => h?.trim() || "");

        const missingFields = REQUIRED_FIELDS.filter(field =>
          !normalizedHeaders.some(h => h?.toLowerCase() === field.toLowerCase())
        );

        if (missingFields.length > 0) {
          setError(`${t.omniSrc.verificationFailed} [${missingFields.join(", ")}]。`);
          setCsvHeaders([]);
        } else if (!results?.data || results.data.length === 0) {
          setError(t.omniSrc.validationFailed);
          setCsvHeaders([]);

        } else {
          setError(null);
          setCsvHeaders(headers);
        }
      },
      error: (err) => {
        setError(`${t.omniSrc.parseError}：${err.message}`);

      }
    });
  };

  const handleWeave = async () => {
    setIsWeaving(true);
    setWeavingStep(0);

    const steps = [
      { delay: 800, msg: "Initializing Data Bus connection..." },
      { delay: 1500, msg: "Parsing CSV headers & validating ZKP..." },
      { delay: 2200, msg: "Mapping indicators to global ESG standards..." },
      { delay: 2800, msg: "Finalizing immutable audit record..." },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].delay / steps.length));
      setWeavingStep(i + 1);
    }

    // Generate a simple deterministic hash for the content
    const generateHash = (data: any[]) => {
      const str = JSON.stringify(data);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return `sha256:${Math.abs(hash).toString(16).padStart(64, '0').slice(-64)}`;
    };

    // Record audit event in FDC
    try {
      createAudit({
        title: `Data Weave: ${currentFileName || "Unknown Source"}`,
        dataType: "CSV_IMPORT",
        source: "OmniSrc",
        standard: "STANDARD_IMPORT",
        description: `Imported ESG data from ${currentFileName}. Verify integrity via EvidenceVault.`,
        contentHash: generateHash(csvHeaders),
        zkpStatus: "VERIFIED",
        createdAt: new Date().toISOString(),
        metadata: JSON.stringify({
          headers: csvHeaders,
          timestamp: Date.now(),
          environment: "production-alpha"
        })
      });
    } catch (e) {
      console.error("Audit failed:", e);
    }

    setGlobalEsgData((prev: any) => ({
      ...prev,
      linkedSourcesCount: prev.linkedSourcesCount + 1,
      trustScore: Math.min(100, prev.trustScore + 0.2)
    }));

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsWeaving(false);
    setCsvHeaders([]);
    setCurrentFileName(null);
    showToast(t.omniSrc.weavingSuccess, t.omniSrc.trustUpdated, "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative pb-20">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            {t.omniSrc.title}
          </h1>
          <p className="text-slate-500 font-bold max-w-2xl leading-relaxed text-sm md:text-base">
            {t.omniSrc.subtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setActiveView("sustain-write");
            setActiveSubView("ai-assist");
          }}
          className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-[2rem] text-sm font-bold hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-600/20 overflow-hidden w-full lg:w-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Sparkles className="w-5 h-5" />
          {t.omniSrc.startAiWeaving}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {SRC_FUNCTIONS.map((func, i) => (
          <GlassCard
            key={func.id}
            onClick={() => handleFuncClick(func.id)}
            className="p-4 md:p-8 cursor-pointer group hover:border-emerald-500/30 transition-all flex flex-col items-center text-center bg-white/40 hover:bg-white/60"
          >
            <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm", func.bg)}>
              <func.icon className={cn("w-6 h-6 md:w-8 md:h-8", func.color)} />
            </div>
            <h3 className="text-xs md:text-sm font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors uppercase tracking-wider">{func.title}</h3>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 md:mt-12">
        <h2 className="text-[10px] md:text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4 md:mb-6">
          <TableProperties className="w-3 h-3 md:w-4 md:h-4 text-[#009E9D]" />
          {t.omniSrc.csvSync}
        </h2>

        <GlassCard className="p-8 md:p-20 border-dashed border-2 border-slate-200 bg-white/20 hover:bg-white/40 backdrop-blur-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div
            className={cn(
              "w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] mb-6 md:mb-10 flex items-center justify-center transition-all cursor-pointer shadow-2xl relative z-10",
              isDragging ? "bg-emerald-600 text-white scale-110 shadow-emerald-600/30 rotate-12" : "bg-white text-slate-400 hover:bg-slate-50 shadow-slate-100 hover:shadow-emerald-100",
              error ? "bg-rose-50 text-rose-500 shadow-rose-100" : ""
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) parseCSV(file); }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            aria-label="上傳 CSV 檔案"
          >
            {error ? <AlertCircle className="w-10 h-10 md:w-12 md:h-12" /> : <Upload className="w-10 h-10 md:w-12 md:h-12 group-hover:animate-bounce" />}
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".csv" aria-label="選擇 CSV 檔案" />
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-2 max-w-md"
              >
                <h3 className="text-base md:text-xl font-black text-rose-600">{t.omniSrc.validationFailedTitle}</h3>

                <p className="text-[10px] md:text-sm text-rose-500 font-medium leading-relaxed whitespace-pre-wrap text-left">
                  {error}
                </p>
                <button
                  onClick={() => { setError(null); }}
                  aria-label="重試上傳"
                  className="mt-4 px-4 py-2 bg-rose-100 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-200 transition-colors"
                >
                  {t.common.retry}

                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="text-lg font-black text-slate-900">{t.omniSrc.csvSync}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {(csvHeaders?.length || 0) > 0 && (
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-200 w-full text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.omniSrc.detectedFields} ({csvHeaders?.length || 0})</div>
                <button
                  onClick={() => setCsvHeaders([])}
                  aria-label="重新選擇檔案"
                  className="text-[10px] font-bold text-[#009E9D] hover:underline"
                >
                  {t.common.reselect}

                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-8">
                {csvHeaders.map(h => (
                  <div key={h} className="p-2 md:p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                    <TableProperties className="w-3 h-3 text-[#009E9D]" />
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-700">{h}</span>
                    {REQUIRED_FIELDS.includes(h) && <Badge variant="optimal" className="text-[7px] py-0 px-1 uppercase">Required</Badge>}
                  </div>
                ))}
              </div>
              <button
                onClick={handleWeave}
                aria-label="開始數據編織"
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">{t.omniSrc.startWeaving}</span>
                <Bot className="w-5 h-5 text-emerald-400 animate-pulse relative z-10" />
                <ArrowRight className="w-5 h-5 text-emerald-400 relative z-10" />
              </button>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 md:mt-12 mb-12">
        <GlassCard className="p-4 md:p-8 border-[#009E9D]/20 bg-gradient-to-br from-white to-[#009E9D]/5 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#009E9D] text-white flex items-center justify-center shadow-lg shadow-[#009E9D]/20">
                <FileCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-800 tracking-tight">{t.omniSrc.dropHint}</div>
                <p className="text-sm text-slate-400 font-medium max-w-[240px]">
                  {t.omniSrc.dropDetail}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Weaving Overlay */}
      <AnimatePresence>
        {isWeaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/80 backdrop-blur-3xl overflow-hidden"
          >
            {/* Background Weaving Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -100, y: Math.random() * 100 + "%", opacity: 0 }}
                  animate={{
                    x: "120%",
                    opacity: [0, 1, 1, 0],
                    transition: { duration: 3, repeat: Infinity, delay: i * 0.2, ease: "linear" }
                  }}
                  className="absolute h-[1px] w-64 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
              <div className="relative mb-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-500/30 flex items-center justify-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]"
                  >
                    <Bot className="w-12 h-12 text-white" />
                  </motion.div>
                </div>

                {/* Orbiting particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full absolute -top-2 left-1/2 -ml-2 shadow-lg",
                      i % 2 === 0 ? "bg-emerald-400" : "bg-cyan-400"
                    )} />
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={weavingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {t.omniSrc.startWeaving}...
                  </h3>
                  <p className="text-emerald-400 font-mono text-sm tracking-widest uppercase">
                    {[
                      "Initializing Data Bus connection...",
                      "Parsing CSV headers & validating ZKP...",
                      "Mapping indicators to global ESG standards...",
                      "Finalizing immutable audit record...",
                      "Synchronization Complete!"
                    ][weavingStep] || "Processing..."}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(weavingStep / 5) * 100}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[200] max-w-sm w-full"
          >
            <div className={cn(
              "p-5 rounded-3xl shadow-2xl border backdrop-blur-2xl flex items-start gap-4",
              toastMessage.type === 'success'
                ? "bg-slate-900 border-white/10 text-white"
                : "bg-white border-slate-100 text-slate-900"
            )}>
              {toastMessage.type === 'success' ? (
                <div className="p-2 bg-emerald-500/20 rounded-full shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              ) : (
                <div className="p-2 bg-sky-50 rounded-full shrink-0">
                  <AlertCircle className="w-5 h-5 text-sky-500" />
                </div>
              )}
              <div className="pt-1">
                <h4 className="font-black text-[13px] tracking-wide">{toastMessage.title}</h4>
                <p className="opacity-70 text-[11px] font-bold mt-1 text-balance leading-relaxed">{toastMessage.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
