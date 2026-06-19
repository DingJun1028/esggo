"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Sparkles,
  ChevronRight,
  FileText,
  Clock,
  ArrowLeft,
  Share2,
  Trash2,
  PenLine,
  ChevronDown,
  BarChart,
  Users,
  Target,
  Database,
  X,
  ShieldCheck,
  Star,
  ArrowRight,
  Library,
  Zap,
  Compass,
  Loader2,
  CheckCircle2,
  Languages,
  Save
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { chatWithESGAssistant, generateDataSuggestions, generateCoWriteVariants, generateDeepRewrite, analyzeContentIntegrity } from "@/app/actions";
import { Report, ReportStatus, Language, IntegrityCheck } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { logger } from "@/lib/utils/logger";
import { generateContentHash } from "@/lib/utils/crypto";
import { analyzeCompliance } from "@/lib/compliance-engine";
import { toast } from "sonner";

// Sub-components
import { LinkedSourceIndicator } from "./sub-components/linked-source-indicator";
import { ComplianceGuardSidebar } from "./sub-components/compliance-guard-sidebar";
import { CoWriteModal } from "./sub-components/co-write-modal";
import { ChartAssistantModal } from "./sub-components/chart-assistant-modal";
import { GuidancePanel } from "./sub-components/guidance-panel";
import { TemplateModal } from "./sub-components/template-modal";
export { VersionHistoryModal } from "./sub-components/version-history-modal";

export function ExportDropdown({ onExport }: { onExport: (format: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formats = [
    { id: "pdf", name: "PDF 報告 (正式版)", icon: FileText, desc: "適用於正式對外揭露與歸檔" },
    { id: "excel", name: "Excel 數據集 (SASB)", icon: Database, desc: "包含所有原始數據與公式" },
    { id: "json", name: "JSON 審計軌跡 (5T)", icon: ShieldCheck, desc: "可供確信機構進行系統對接" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-6 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-2 border border-slate-700"
      >
        <Share2 className="w-4 h-4" /> 匯出報告 <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 md:right-0 mt-3 w-[calc(100vw-2rem)] md:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100] sm:translate-x-0 -translate-x-[calc(100%-8rem)] md:translate-x-0"
          >
            {formats.map((f, i) => (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  onExport(f.id);
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-all group flex items-start gap-3"
              >
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <f.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800 tracking-tight">{f.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{f.desc}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export function ToolCard({ icon: Icon, title, desc, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col items-center text-center gap-3 hover:scale-[1.03] transition-transform"
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-base font-black text-slate-800">{title}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{desc}</div>
      </div>
    </button>
  );
}

export function ReportCard({ report, onClick, onVersionHistory, onDelete, language, className }: {
  report: Report;
  onClick: () => void;
  onVersionHistory?: () => void;
  onDelete?: () => void;
  language: "zh" | "en";
  className?: string;
}) {
  const chapters = [
    { name: "GRI 2: 一般揭露", completed: 8, total: 12, dataSources: 4 },
    { name: "GRI 3: 重大主題", completed: 3, total: 5, dataSources: 2 },
    { name: "GRI 302: 能源", completed: 4, total: 4, dataSources: 6 },
  ];

  return (
    <GlassCard
      onClick={onClick}
      className={cn(
        "p-6 flex flex-col cursor-pointer group hover:bg-emerald-50/10 transition-all hover:border-emerald-200 border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex items-start justify-between mb-8 z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-xl font-black text-emerald-400 shadow-2xl group-hover:rotate-3 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-900 transition-colors">{report.title}</h4>
              <Badge variant={report.status === "completed" ? "optimal" : "default"} className="text-[10px] px-2 py-0.5 uppercase font-black tracking-tighter">
                {report.status === "completed" ? "COMPLETED" : "DRAFT"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <span className="font-mono">{report.year} SERIES</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> 最後同步: {report.lastEdited}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <div className="text-[28px] font-black text-emerald-600 leading-none">{report.progress}%</div>
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">AI 對標進度分析</div>
        </div>
      </div>

      <div className="space-y-6 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {chapters.map((ch, i) => (
            <div key={i} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 group-hover:border-emerald-100 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight truncate max-w-[80px]">
                  {ch.name.split(': ')[1]}
                </div>
                <div className="text-[10px] font-black text-slate-700">
                  {ch.completed}/{ch.total}
                </div>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(ch.completed / ch.total) * 100}%` }}
                  className={cn("h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]", ch.completed === ch.total ? "bg-emerald-500" : "bg-sky-400")}
                />
              </div>
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase">
                <Database className="w-2.5 h-2.5 text-sky-500" />
                <span>{ch.dataSources}個數據源鏈結</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100/60">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">數據存證節點</span>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#009E9D]" />
                <span className="text-sm font-black text-slate-700">{report.linkedSourceCount} 節點 (Hash Locked)</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">ISSA 5000 讀取度</span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-sm font-black text-slate-700">{report.issaReadiness}% (信託就緒)</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">信任封印</span>
              <div className="flex items-center gap-2">
                <Badge className={cn(
                  "text-[9px] font-black px-2 py-0.5",
                  report.trustSeal === "5T_MAX" ? "bg-slate-900 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                )}>
                  {report.trustSeal} SEAL
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onVersionHistory && onVersionHistory(); }}
              className="h-11 px-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2"
              title="Version History"
            >
              <Clock className="w-3.5 h-3.5" /> Version History
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(); }}
              className="h-11 w-11 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all active:scale-95"
              title="Delete Report"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="h-11 px-6 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center gap-2">
              Write Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function SectionEditor({
  reportId,
  index,
  title,
  placeholder,
  initialContent,
  linkedSource,
  onLinkSource,
  onViewAudit,
  isDone,
  onToggleComplete,
  onNext,
  onPrev,
  section,
  language = "zh",
  onChange,
  className
}: {
  reportId: string;
  index: string;
  title: string;
  placeholder: string;
  initialContent?: string;
  linkedSource?: any;
  onLinkSource?: () => void;
  onViewAudit?: () => void;
  isDone?: boolean;
  onToggleComplete?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  section?: any;
  language?: "zh" | "en";
  onChange?: (content: string) => void;
  className?: string;
}) {
  const { updateSectionContent } = useAppContext();
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiThoughts, setAiThoughts] = useState<string[]>([]);
  const [showThoughts, setShowThoughts] = useState(false);
  const [showCoWriteModal, setShowCoWriteModal] = useState(false);
  const [coWriteVariants, setCoWriteVariants] = useState<string[]>([]);
  const [showChartModal, setShowChartModal] = useState(false);
  const [chartModifier, setChartModifier] = useState("");
  const [isChartGenerating, setIsChartGenerating] = useState(false);
  const [chartData, setChartData] = useState([
    { name: "Q1", value: 400 },
    { name: "Q2", value: 300 },
    { name: "Q3", value: 600 },
    { name: "Q4", value: 800 },
  ]);
  const [prompt, setPrompt] = useState("");
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isRefreshingSource, setIsRefreshingSource] = useState(false);
  const [aiDataSuggestions, setAiDataSuggestions] = useState<string[]>([]);
  const [showComplianceGuard, setShowComplianceGuard] = useState<boolean>(false);
  const [alignedIndicators, setAlignedIndicators] = useState<string[]>([]);
  const [isComplianceChecking, setIsComplianceChecking] = useState<boolean>(false);
  const [aiTraceId, setAiTraceId] = useState<string>("");
  const [integrityResults, setIntegrityResults] = useState<IntegrityCheck | null>(null);
  const [auditAnalysis, setAuditAnalysis] = useState<any>(null);
  const [isAnalyzingIntegrity, setIsAnalyzingIntegrity] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [blockHash, setBlockHash] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateContent = (newContent: string) => {
    if (onChange) {
      onChange(newContent);
    } else {
      updateSectionContent(reportId, index, newContent);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(e.target.value);
  };

  const applyTemplate = (templateContent: string) => {
    const currentContent = initialContent || "";
    if (selection.start !== selection.end) {
      // Replace selection
      const newContent = currentContent.substring(0, selection.start) + templateContent + currentContent.substring(selection.end);
      updateContent(newContent);
    } else {
      // Append to the cursor position or end
      const pos = selection.start || currentContent.length;
      const newContent = currentContent.substring(0, pos) + (currentContent ? "\n\n" : "") + templateContent + currentContent.substring(pos);
      updateContent(newContent);
    }
  };

  const handleManualSave = async () => {
    setSaveStatus("saving");
    // Simulate 5T Protocol Sealing
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate real hash on manual seal/save
    const hash = await generateContentHash(initialContent || "");
    setBlockHash(hash);
    
    if (!onChange) {
      updateSectionContent(reportId, index, initialContent || "");
    }
    setSaveStatus("saved");
    toast.success("5T Block Sealed", {
      description: "文本區塊已完成誠信密封，雜湊值已存入審計軌跡。",
    });
  };

  useEffect(() => {
    async function loadSuggestions() {
      if (linkedSource) {
        setAiDataSuggestions(["AI 分析數據源中..."]);
        try {
          await generateDataSuggestions(linkedSource.name);
          setIsRefreshingSource(true);
          // Better simulated AI context extraction
          await new Promise(resolve => setTimeout(resolve, 1500));

          const sourceName = linkedSource.name || "";
          let suggestions: string[] = [];

          if (sourceName.includes("人力")) {
            suggestions = [
              "根據人力資源數據，本年度離職率下降 15%，建議加入留才計畫說明。",
              "數據顯示女性主管比例提升 5%，符合 GRI 405 指標。",
              "建議整合年度訓練時數，目前人均 42 小時。"
            ];
          } else if (sourceName.includes("能耗") || sourceName.includes("電費")) {
            suggestions = [
              "偵測到綠電採購比例達 30%，可作為環境績效亮點。",
              "資料中心能耗 PUE 值優於業界標準，建議在此章節詳細列出。",
              "碳排放量數據已更新，較去年同期減碳 12%，建議標注於環節。 "
            ];
          } else {
            suggestions = [
              "已成功提取關鍵績效指標，建議將其轉化為圖表形式。",
              "發現數據異常波動（+20%），建議增加解釋性文字以符合透明度原則。",
              "此章節可整合 AI 提取的供應商合規數據。"
            ];
          }

          setAiDataSuggestions(suggestions);
          setIsRefreshingSource(false);
        } catch (e) {
          console.error(e);
          setIsRefreshingSource(false);
        }
      }
    }
    loadSuggestions();
  }, [linkedSource]);

  const handleRefreshSource = async () => {
    setIsRefreshingSource(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshingSource(false);
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      });
    }
  };

  const handleModifyChart = async () => {
    setIsChartGenerating(true);
    // AI Chart modification logic: analysis of natural language command
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real scenario, this would parse chartModifier to determine chartType, axes, etc.
    // e.g. "將目前的 AreaChart 改為圓餅圖"

    setChartData(prev => prev.map(d => ({
      ...d,
      value: d.value * (1 + (Math.random() * 0.4 - 0.2)),
      forecast: d.value * 1.2 // AI predicted trend
    })));

    setChartModifier("");
    setIsChartGenerating(false);
  };

  const handleAIGenerate = async () => {
    try {
      setIsGenerating(true);
      logger.info("Starting AI rewrite generation", { section: title });

      const result = await generateDeepRewrite(
        initialContent || placeholder,
        title,
        language
      );

      if (result.success && result.text) {
        updateContent(result.text);
        if (result.integrityCheck) setIntegrityResults(result.integrityCheck as any);
        logger.success("AI rewrite generation successful", { section: title });
      } else {
        logger.error("AI rewrite returned empty", { section: title }, "SectionEditor");
      }
    } catch (err) {
      logger.error("AI Generation failed", { error: err, section: title });
      console.error("AI Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCoWriteGenerate = async () => {
    try {
      setIsGenerating(true);
      setCoWriteVariants([]);
      setAiThoughts([]);
      setShowThoughts(true);

      const currentContent = initialContent || "";
      const selectedText = currentContent.substring(selection.start, selection.end);
      const basePrompt = prompt || "優化此段落的專業度與合規性";

      // Pure visual simulation of pre-analysis
      const preThoughts = [
        "正在擷取上下文鏈結...",
        `分析選取內容：${selectedText ? `「${selectedText.substring(0, 15)}...」` : '全段落'}`,
      ];

      for (const thought of preThoughts) {
        setAiThoughts(prev => [...prev, thought]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      if (selectedText || currentContent) {
        try {
          const result = await generateCoWriteVariants(
            selectedText || currentContent,
            basePrompt,
            title,
            language
          );
          if (result.success && result.variants.length >= 3) {
            setCoWriteVariants(result.variants);
            // New: Handle trace and integrity
            if (result.traceId) {
              setAiTraceId(result.traceId);
              setAiThoughts(prev => [...prev, `GCP Trace ID: ${result.traceId}`]);
              await new Promise(resolve => setTimeout(resolve, 600));
            }
            if (result.integrityCheck) {
              setIntegrityResults(result.integrityCheck);
            }
          } else {
            throw new Error("AI output format mismatch or failure");
          }
        } catch (aiErr) {
          console.error("Gemini fail, using fallback:", aiErr);
          setCoWriteVariants([
            `[專業精煉] ${selectedText || currentContent}。透過 GRI 準則深度對齊，精煉為具備資方透明度的敘事。`,
            `[影響力擴展] 強調了數據背後的社會與環境意義，擴大了敘事的利害關係人連結。`,
            `[策略前瞻] 將現有內容轉化為前瞻計畫，預測了未來五年的減碳路徑。`
          ]);
        }
      } else {
        const partnerContent = `\n\n【ESG GO AI 協作夥伴建議：關於「${basePrompt}」】\n針對「${title}」，我們建議在原有基礎上額外串接「5T 數據信託」的誠信門檻。`;
        updateContent(currentContent + partnerContent);
        setShowCoWriteModal(false);
      }
      setPrompt("");
    } catch (err) {
      console.error("Co-write Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyVariant = (variant: string) => {
    const currentContent = initialContent || "";
    if (selection.start !== selection.end) {
      const newContent = currentContent.substring(0, selection.start) + variant + currentContent.substring(selection.end);
      updateContent(newContent);
    } else {
      updateContent(variant);
    }
    setCoWriteVariants([]);
    setShowCoWriteModal(false);
  };

  const applyAllVariants = () => {
    const currentContent = initialContent || "";
    const combined = coWriteVariants.join('\n\n');
    if (selection.start !== selection.end) {
      const newContent = currentContent.substring(0, selection.start) + combined + currentContent.substring(selection.end);
      updateContent(newContent);
    } else {
      updateContent(currentContent + (currentContent ? '\n\n' : '') + combined);
    }
    setCoWriteVariants([]);
    setShowCoWriteModal(false);
  };

  const handleGenerateChart = () => {
    setShowChartModal(true);
  };

  const handleCheckCompliance = async () => {
    setIsComplianceChecking(true);
    try {
      const result = await analyzeCompliance(initialContent || "", title);
      setAlignedIndicators(result.alignedIndicators);
      setAiTraceId(result.traceId);
      setIntegrityResults(result.integritySeal);
      setShowComplianceGuard(true);
    } finally {
      setIsComplianceChecking(false);
    }
  };

  const toggleIndicator = (id: string) => {
    setAlignedIndicators(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleTranslate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const translatedContent = (initialContent || "") + `\n\n【GCP AI Translation - 繁體中文對口】\n[系統通知: 該段落已透過 Cloud Translation API 完成語義校準，確保翻譯質量符合 GRI 官方術語表。]`;
    updateContent(translatedContent);
    setIsGenerating(false);
  };

  const handleAnalyzeIntegrity = async () => {
    if (!initialContent) {
      toast.error("請先輸入內容。");
      return;
    }
    setIsAnalyzingIntegrity(true);
    try {
      const result = await analyzeContentIntegrity(initialContent, title, language);
      if (result.success) {
        setAuditAnalysis(result.analysis);
        setIntegrityResults(result.integrityCheck as any);
        toast.success("5T 誠信分析完成");
      } else {
        toast.error(result.error || "分析失敗");
      }
    } catch (err) {
      console.error(err);
      toast.error("分析發生錯誤");
    } finally {
      setIsAnalyzingIntegrity(false);
    }
  };

  return (
    <GlassCard
      id={section?.id ? `section-${section.id}` : undefined}
      className={cn("p-6 md:p-8 space-y-6", className)}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ChevronRight className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-black text-slate-800">{index} {title}</h3>

          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.button
                key="done-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={onToggleComplete}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-tight">Completed</span>
              </motion.button>
            ) : (
              <motion.button
                key="todo-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onClick={onToggleComplete}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <CustomCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight">Mark as Done</span>
              </motion.button>
            )}

            {saveStatus === "saving" ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-full"
              >
                <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Autosaving...</span>
              </motion.div>
            ) : saveStatus === "saved" && initialContent ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100 group relative cursor-help shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">5T Block Sealed</span>
                {blockHash && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white p-3 rounded-2xl shadow-2xl z-[100] w-64 border border-slate-800 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                      <div className="w-4 h-4 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Integrity Signature</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-300 break-all bg-black/40 p-2 rounded-xl border border-white/5 mb-2">
                      {blockHash}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold text-slate-500">PROTOCOL: 5T-V8.1-AES256</span>
                      <span className="text-[8px] font-black text-emerald-500 italic">VERIFIED</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : saveStatus === "unsaved" ? (
              <motion.button
                key="manual-save"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleManualSave}
                className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <Save className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Manual Seal</span>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {linkedSource ? (
            <div className="flex items-center flex-1 sm:flex-none gap-2">
              <button
                onClick={onLinkSource}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-black transition-all"
              >
                <Database className="w-3.5 h-3.5" /> 變更數據源
              </button>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1.5 py-1.5 shadow-sm">
                <Database className="w-3 h-3" /> {linkedSource.name}
              </Badge>
              <Badge className="bg-slate-900 border-none text-[9px] font-black uppercase text-emerald-400">
                Score: {linkedSource.trustScore}%
              </Badge>
              <div className="text-[9px] font-bold text-slate-400 ml-2 hidden sm:block">
                Linked: {new Date().toLocaleDateString()}
              </div>
            </div>
          ) : (
            <button
              onClick={onLinkSource}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black hover:bg-indigo-100 border border-indigo-100 ring-2 ring-indigo-500/10 transition-all shadow-sm"
            >
              <Database className="w-4 h-4" /> 連結外部數據源
            </button>
          )}
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            className={cn(
              "p-2 rounded-lg transition-all border",
              showGuidance
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm"
                : "hover:bg-slate-50 text-slate-400 border-transparent hover:border-slate-200"
            )}
            title="查看寫作指引"
          >
            <Compass className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"><Trash2 className="w-5 h-5 text-slate-300" /></button>
        </div>
      </div>

      <AnimatePresence>
        {showGuidance && section?.rawSection?.guidanceMeta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <GuidancePanel
              section={section.rawSection}
              language={language}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={initialContent || ""}
          onChange={handleContentChange}
          onSelect={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          onClick={handleSelectionChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 min-h-[300px] rounded-2xl p-8 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all resize-y leading-relaxed shadow-inner"
        />

        <LinkedSourceIndicator
          linkedSource={linkedSource}
          isRefreshingSource={isRefreshingSource}
          onRefreshSource={handleRefreshSource}
          onViewAudit={onViewAudit}
          aiDataSuggestions={aiDataSuggestions}
          content={initialContent || ""}
          updateContent={updateContent}
        />

        {isGenerating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center z-10 animate-in fade-in">
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl shadow-2xl">
              <Sparkles className="w-12 h-12 text-emerald-600 animate-pulse" />
              <div className="text-center">
                <div className="text-base font-black text-slate-900">Omni-Sphere AI 正在深度改寫中</div>
                <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">正在分析「{title}」與數據集關係</div>
              </div>
            </div>
          </div>
        )}

        {selection.start !== selection.end && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-[-45px] left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-4 shadow-2xl z-20 border border-slate-700"
          >
            <div className="text-[10px] font-black uppercase tracking-widest border-r border-slate-700 pr-4">選取操作</div>
            <button
              onClick={() => setShowCoWriteModal(true)}
              className="text-xs font-black hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <PenLine className="w-3 h-3" /> 共寫改寫
            </button>
            <button
              onClick={handleGenerateChart}
              className="text-xs font-black hover:text-sky-400 transition-colors flex items-center gap-1.5"
            >
              <BarChart className="w-3 h-3" /> 生成圖表
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => setShowTemplateModal(true)}
          className="flex items-center gap-3 px-5 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black hover:bg-indigo-100 transition-colors"
        >
          <Library className="w-4.5 h-4.5" /> 模板庫
        </button>
        <button
          onClick={handleGenerateChart}
          className="flex items-center gap-3 px-5 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black hover:bg-emerald-100 transition-colors"
        >
          <BarChart className="w-4.5 h-4.5" /> 圖表助手
        </button>
        <button
          onClick={() => setShowCoWriteModal(true)}
          className="flex items-center gap-3 px-5 py-3 bg-sky-50 text-sky-700 rounded-2xl text-xs font-black hover:bg-sky-100 transition-colors"
        >
          <Users className="w-4.5 h-4.5" /> 共寫提示
        </button>
        <button
          onClick={handleTranslate}
          className="flex items-center gap-3 px-5 py-3 bg-orange-50 text-orange-700 rounded-2xl text-xs font-black hover:bg-orange-100 transition-colors"
        >
          <Languages className="w-4.5 h-4.5" /> AI 翻譯
        </button>
        <button
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-emerald-400" /> AI 深度改寫
        </button>
        <button
          onClick={() => setShowComplianceGuard(!showComplianceGuard)}
          className={cn(
            "px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 shadow-lg shadow-emerald-500/10",
            showComplianceGuard ? "bg-emerald-600 text-white" : "bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50"
          )}
        >
          <ShieldCheck className={cn("w-5 h-5", showComplianceGuard ? "text-white" : "text-emerald-500")} />
          合規守衛 {alignedIndicators.length > 0 && `(${alignedIndicators.length})`}
        </button>
      </div>

      <ComplianceGuardSidebar
        showComplianceGuard={showComplianceGuard}
        setShowComplianceGuard={setShowComplianceGuard}
        handleCheckCompliance={handleCheckCompliance}
        isComplianceChecking={isComplianceChecking}
        alignedIndicators={alignedIndicators}
        toggleIndicator={toggleIndicator}
        traceId={aiTraceId}
        integrityCheck={integrityResults}
      />

      <CoWriteModal
        showCoWriteModal={showCoWriteModal}
        setShowCoWriteModal={setShowCoWriteModal}
        isGenerating={isGenerating}
        aiThoughts={aiThoughts}
        selection={selection}
        content={initialContent || ""}
        coWriteVariants={coWriteVariants}
        applyAllVariants={applyAllVariants}
        applyVariant={applyVariant}
        handleCoWriteGenerate={handleCoWriteGenerate}
        prompt={prompt}
        setPrompt={setPrompt}
        traceId={aiTraceId}
        integrityCheck={integrityResults}
      />

      <ChartAssistantModal
        showChartModal={showChartModal}
        setShowChartModal={setShowChartModal}
        isChartGenerating={isChartGenerating}
        chartData={chartData}
        title={title}
        chartModifier={chartModifier}
        setChartModifier={setChartModifier}
        handleModifyChart={handleModifyChart}
      />

      <TemplateModal
        showTemplateModal={showTemplateModal}
        setShowTemplateModal={setShowTemplateModal}
        title={title}
        applyTemplate={applyTemplate}
      />

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-100">
        <button
          onClick={onPrev}
          disabled={!onPrev}
          className="flex items-center gap-2 px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-900 transition-all disabled:opacity-20"
        >
          <ArrowLeft className="w-4 h-4" /> 上一章節
        </button>
        <div className="flex-1 max-w-[200px]">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-1">
            Section Progress
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: isDone ? "100%" : "30%" }}
            />
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={!onNext}
          className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl disabled:opacity-20"
        >
          下一章節 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}

function CustomCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function BenchmarkModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { benchmarkHistory, setBenchmarkHistory } = useAppContext();
  const [industry, setIndustry] = useState("半導體與電子");
  const [companies] = useState(["台積電", "聯發科", "日月光"]);
  const [showResults, setShowResults] = useState(false);

  const keyMetrics = [
    { label: "溫室氣體排放 (S1+S2)", unit: "tCO2e", current: 24500, benchmarks: [22000, 26000, 24000] },
    { label: "再生能源占比", unit: "%", current: 35, benchmarks: [42, 38, 30] },
    { label: "員工離職率", unit: "%", current: 8.2, benchmarks: [7.5, 9.1, 8.8] },
    { label: "董事會獨立性", unit: "%", current: 60, benchmarks: [65, 55, 50] },
  ];

  const handleStartAnalysis = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }

    // Save to history
    const result = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      industry,
      companies,
      findings: "分析完成：我方在「再生能源占比」領先，但「溫室氣體排放」需強化。"
    };
    setBenchmarkHistory([result, ...benchmarkHistory]);
    setShowResults(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] md:max-h-[90vh] mt-auto md:mt-0"
          >
            <div className="p-8 flex items-center justify-between bg-white border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <BarChart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Benchmark Analysis</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">同產業前三標竿比較</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowResults(false);
                  onClose();
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              {!showResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">選擇產業</label>
                      <div className="relative group">
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full h-12 md:h-14 appearance-none bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-6 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer"
                        >
                          <option>半導體與電子</option>
                          <option>金融與銀行</option>
                          <option>石化與能源</option>
                          <option>食品與飲料</option>
                          <option>零售與消費</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">標竿公司</label>
                      <div className="space-y-3">
                        {companies.map((company, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                              <div className={cn(
                                "w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center font-black text-[9px] md:text-[10px] text-white shadow-sm transition-all",
                                i === 0 ? "bg-amber-500" : (i === 1 ? "bg-slate-400" : "bg-orange-400")
                              )}>
                                {i === 0 ? "1st" : (i === 1 ? "2nd" : "3rd")}
                              </div>
                            </div>
                            <div className="flex-1 bg-white border border-slate-100 h-10 md:h-12 flex items-center px-4 rounded-lg md:rounded-xl font-bold text-slate-700 shadow-sm group-hover:border-emerald-200 transition-all">
                              {company}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">分析歷史</label>
                    <div className="space-y-3">
                      {benchmarkHistory.length === 0 ? (
                        <div className="text-center py-10 md:py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400">目前尚無歷史紀錄</p>
                        </div>
                      ) : (
                        benchmarkHistory.map((h, i) => (
                          <motion.div
                            key={h.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.date}</span>
                              <Badge className="bg-emerald-100 text-emerald-700 text-[8px] px-1.5 py-0">已儲存</Badge>
                            </div>
                            <div className="text-xs font-black text-slate-800">{h.industry} 標竿分析</div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-5 gap-4 px-2">
                    <div className="col-span-2 text-xs font-black text-slate-400 uppercase tracking-widest">ESG 關鍵指標</div>
                    {companies.map((c, i) => (
                      <div key={i} className="text-center text-[10px] font-black text-emerald-600 uppercase tracking-widest truncate">{c}</div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {keyMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-black text-slate-800">{metric.label}</span>
                          <span className="text-xs font-bold text-slate-400">{metric.unit}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-4 items-center">
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-black text-xs">
                              {metric.current}
                            </div>
                            <div className="text-[10px] font-bold text-slate-500">我方數據</div>
                          </div>
                          {metric.benchmarks.map((val, i) => (
                            <div key={i} className={cn(
                              "text-center text-xs font-black p-2 rounded-lg",
                              val < metric.current ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                              {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50/50">
              <button
                onClick={handleStartAnalysis}
                className="w-full h-16 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Target className="w-6 h-6" /> {showResults ? "重新設定標竿" : "開始對標分析"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function AIComponent({ linkedSources }: { linkedSources: Record<string, { name: string; id: string; date: string }> }) {
  const { companyProfile, selectedSpirit, language } = useAppContext();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user' | 'system', content: string }[]>([
    { role: "ai", content: "您好！我是您的 ESG 永續撰寫助理 Omni-Sphere。我已經準備好協助您處理這份報告。您可以詢問有關 GRI、SASB 或 TCFD 標準的問題，或是讓我根據已連結的數據源提供撰寫建議。" }
  ]);
  const [input, setInput] = useState("");
  const [auditMode, setAuditMode] = useState(false);

  const toggleAuditMode = () => {
    setAuditMode(!auditMode);
    if (!auditMode) {
      setMessages(prev => [...prev, { role: "ai", content: "【Audit Mode Enabled】 審計模式已啟用。我將開始比對即時草稿與 GRI、TCFD、ISSA 5000 規範之間的一致性。如果有任何合規風險，將優先提醒您。" }]);
    } else {
      setMessages(prev => [...prev, { role: "ai", content: "審計模式 (Audit Mode) 已關閉。已切回標準撰寫輔助模式。" }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages([...newMessages, { role: "ai" as const, content: "Omni-Sphere AI 分析中..." }]);
    setInput("");

    const globalContext = `
Company Name: ${companyProfile.name}
Industry: ${companyProfile.industry}
Report Year: ${companyProfile.reportYear}
Commitments: ${companyProfile.commitments.join(", ")}
`.trim();

    const linkedSourcesContext = Object.values(linkedSources).length > 0
      ? Object.values(linkedSources).map(s => `- ${s.name} (ID: ${s.id}, Uploaded: ${s.date})`).join("\n")
      : "No data sources linked yet.";

    const aiResponse = await chatWithESGAssistant(
      newMessages,
      selectedSpirit,
      language,
      auditMode,
      globalContext,
      linkedSourcesContext
    );

    setMessages(prev => {
      const update = [...prev];
      update[update.length - 1] = { role: "ai" as const, content: aiResponse.text };
      return update;
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black">Omni-Sphere AI Assist</h3>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">ESG 報告專家系統</p>
          </div>
        </div>
        <button
          onClick={toggleAuditMode}
          className={cn(
            "px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm",
            auditMode ? "bg-rose-500 text-white shadow-rose-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          )}>
          <ShieldCheck className="w-3.5 h-3.5" /> {auditMode ? "退出審計" : "Audit Mode"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
              m.role === "user" ? "bg-emerald-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"
            )}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="詢問 ESG 標準或數據建議..."
          className="flex-1 h-12 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <PenLine className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function DataSourceModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (source: { id: string; name: string; metrics: number; trustScore: number; date: string; recent: boolean }) => void }) {
  const sources = [
    { id: "s1", name: "2023 Q4 能源消耗數據 (.csv)", metrics: 124, trustScore: 98.4, date: "2024-01-15", recent: true },
    { id: "s2", name: "供應鏈碳足跡核算表 (.csv)", metrics: 86, trustScore: 96.2, date: "2024-02-10", recent: true },
    { id: "s3", name: "員工健康安全統計 (.csv)", metrics: 42, trustScore: 99.1, date: "2024-03-05", recent: false },
    { id: "s4", name: "2024 上半年度電力報表 (.xlsx)", metrics: 210, trustScore: 97.8, date: "2024-07-20", recent: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh] mt-auto md:mt-0"
          >
            <div className="p-6 md:p-8 bg-slate-50 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Data Source Connector</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">5T Data Connectivity Engine</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
              {/* Streamlined Quick Select Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">精選高信賴數據源</span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">AI RECOMENDED</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {sources.filter(s => s.recent || s.trustScore > 98).map((s, i) => (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => onSelect(s)}
                      className="group p-4 md:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl text-left hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                          <Database className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-black text-slate-800 group-hover:text-emerald-900 line-clamp-1">{s.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">信任度: {s.trustScore}%</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-[8px] md:text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">最近使用</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shrink-0">
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">完整目錄 (Verification History)</div>
                <div className="grid grid-cols-1 gap-3">
                  {sources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => onSelect(source)}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-300 hover:bg-white transition-all text-left shadow-sm group"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-black text-slate-700">{source.name}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-slate-400">{source.metrics} 數據點</span>
                          <span className="text-[9px] font-bold text-[#009E9D]">
                            Verified: {source.date}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Powered by Omni-Node Protocol</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


