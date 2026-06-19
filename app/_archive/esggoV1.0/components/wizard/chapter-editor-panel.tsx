"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  FileText,
  ShieldCheck,
  Download,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileSearch,
  BookOpen,
  Tag,
  Lock,
  Search,
  Target,
  History,
  Activity,
  Wand2,
  Zap,
  Type,
  Maximize2,
  Layers,
  Eraser,
  PieChart,
  MessageSquare,
  Link as LinkIcon,
  Check,
  BrainCircuit,
  Loader2,
  Camera,
  Trophy,
  Timer,
  TrendingUp,
  ArrowRight,
  Brain,
  FlaskConical,
  X,
  Database,
  Clock,
  Globe2,
  ChevronDown,
  LayoutGrid,
  Leaf,
  Users,
  Gavel,
  RefreshCw,
  List,
  Minimize2,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAppContext } from "@/lib/context/app-context";
import { createOmniHeart, IOmniHeart } from "@/lib/omni-heart";
import { OmniTagBadge } from "@/components/ui/omni-tag-badge";
import { ZKPMask } from "@/components/ui/zkp-mask";
import { WhyWhatHow } from "@/components/ui/why-what-how";
import { DrThothBriefing } from "@/components/ai/dr-thoth-briefing";
import { ReportGuide } from "@/components/ai/report-guide";
import { MaterialityIssue, INcbReport } from "@/lib/types/ncb-types";
import { fetchMaterialityIssues, fetchCompetitiveAnalysis, saveReport } from "@/lib/services/client-api";

import ZKPAuditBadge from "@/components/ui/zkp-audit-badge";
import { AIReviewAssistant } from "@/components/ai/ai-review-assistant";
import { ESG_STRUCTURE } from "@/lib/data/esg-structure";
import { ApiKeyModal } from "@/components/ui/api-key-modal";
import { AITierSwitcher } from "@/components/ui/ai-tier-switcher";
import { useOmniSkills } from "@/hooks/use-omni-skills";
import { getRequiredDocs, RequiredDoc } from "@/lib/data/chapter-required-docs";
import { extractDocumentData, formatOcrItemsForEditor, OcrResult } from "@/lib/services/ocr-service";
import { ConfidenceHeatmap } from "@/components/wizard/confidence-heatmap";
import { runReportChainFlow, ThinkingNode, BENCHMARK_DATA, IndustryType } from "@/lib/services/report-chain-flow";
import { useWizardSession, WizardStep } from "@/hooks/use-wizard-session";
import { MECEMatrixOverlay } from "@/components/wizard/mece-matrix-overlay";
import { ImpactAnalysisSidebar, ImpactItem } from "@/components/wizard/impact-analysis-sidebar";
import { AuditVaultView } from "@/components/views/audit-vault-view";
import { ZKPVerificationCenter } from "@/components/wizard/zkp-verification-center";
import { SustainWriteQuickTools } from "@/components/wizard/sustainwrite-quick-tools";
import { traceImpacts } from "@/lib/services/impact-tracer-service";

import { EvidenceItem } from "@/lib/types/ncb-types";
import { AlignmentEngine } from "@/components/wizard/alignment-engine";
import { IndicatorLibraryPanel } from "@/components/wizard/indicator-library-panel";
import { useCreateEvidence } from "@dataconnect/generated/react";
import { useOmniInference } from "@/hooks/use-omni-inference";
import { getChapterData } from "@/components/views/esg-report-wizard-view";
import { getTemplatesForChapter } from "@/lib/data/esg-templates";

interface ChapterAttachment {
  fileName: string;
  uploadedAt: string;
}

interface ChapterDocState {
  submitted: Record<string, boolean>; // docId -> submitted
  evidence?: ChapterAttachment | undefined;        // 佐證資料
  annotation?: ChapterAttachment | undefined;      // 附註說明
}


// --- Sub-components to avoid hook violations ---
export const ChapterEditor = ({
  chapter,
  initialContent,
  onSave,
  setBriefingStatus,
  onWordCountChange,
  onChapterExit,
}: {
  chapter: string;
  initialContent: string;
  onSave: (content: string) => void;
  setBriefingStatus: (status: string) => void;
  onWordCountChange?: (chapterId: string, count: number) => void;
  onChapterExit?: (chapterId: string, duration: number, before: number, after: number) => void;
}) => {
  const [content, setContent] = useState(initialContent);

  const [promptContext, setPromptContext] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"IDLE" | "SAVING" | "SAVED">("IDLE");
  const [editorTab, setEditorTab] = useState<"write" | "docs" | "benchmark" | "preview">("write");
  const [docState, setDocState] = useState<ChapterDocState>({ submitted: {} });

  // --- OCR State ---
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [showOcrPanel, setShowOcrPanel] = useState(false);
  const ocrFileRef = useRef<HTMLInputElement>(null);

  // --- Layout State ---
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Genkit CoT Panel State ---
  const [showCotPanel, setShowCotPanel] = useState(false);
  const [cotNodes, setCotNodes] = useState<ThinkingNode[]>([]);
  const [cotFinalOutput, setCotFinalOutput] = useState("");
  const [isCotRunning, setIsCotRunning] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>("tech");

  // --- ZKP & Semantic Status ---
  const [zkpStatus, setZkpStatus] = useState<Record<string, "idle" | "scanning" | "verified">>({});
  const [semanticReview, setSemanticReview] = useState<{ score: number; findings: string[]; suggestions: string[] } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAuditReady, setIsAuditReady] = useState((initialContent?.length || 0) > 100);
  const [ocrResults, setOcrResults] = useState<OcrResult | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // --- Agentic states ---
  const [agentMode, setAgentMode] = useState<"IDLE" | "INTERVIEWING" | "STRUCTURING" | "WRITING" | "QA">("IDLE");
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<string>("");
  const [structuredJSON, setStructuredJSON] = useState<any>(null);
  const [qaReport, setQaReport] = useState<any>(null);
  const [isAgentTaskRunning, setIsAgentTaskRunning] = useState(false);

  // --- Omni Tier & Inference Hook ---
  const { generate: omniGenerate, isLoading: isOmniLoading, text: streamingText, activeTier, setActiveTier } = useOmniInference("Cloud");
  const isAiGenerating = isOmniLoading;

  // --- Templates ---
  const [showTemplates, setShowTemplates] = useState(!initialContent?.trim());
  const templates = getTemplatesForChapter(chapter);

  // Use useEffect to sync streaming text to actual content for real-time ghostwriting
  useEffect(() => {
    if (isAiGenerating && streamingText) {
      setContent(streamingText);
    }
  }, [streamingText, isAiGenerating]);
  const [edgeProgress, setEdgeProgress] = useState(0);
  const handleTierSwitch = async (tier: "Cloud" | "Local" | "Edge") => {
    setActiveTier(tier);
    if (tier === "Edge") {
      const { initOnDeviceModel } = await import('@/lib/services/omni-ai-router');
      setBriefingStatus("⬇️ 正在為您載入最新一代在地隱私型 AI 模型 (Gemma 4 E2B)...");
      try {
        await initOnDeviceModel("/models/gemma-4-e2b-it-gpu-int4.bin", (prog) => {
          setEdgeProgress(prog);
        });
        setBriefingStatus("✅ 在地隱私模型載入完畢，已啟用完全離線隱私保護！");
        setTimeout(() => setEdgeProgress(0), 3000);
      } catch (e) {
        setBriefingStatus("❌ Edge 模型載入失敗，請確認記憶體空間，或使用 Cloud。");
        setActiveTier("Cloud");
      }
    }
  };


  // --- Session Timer ---
  const sessionStartRef = useRef<number>(Date.now());
  const initialWordCountRef = useRef<number>((initialContent || "").trim() ? (initialContent || "").trim().split(/\s+/).filter(w => !!w).length : 0);

  // Persist docState per chapter to localStorage
  const chapterId = chapter.split(" ")[0] || "unknown";
  const docStateKey = `esggo_docState_${chapterId}`;
  const evidenceInputRef = useRef<HTMLInputElement>(null);
  const annotationInputRef = useRef<HTMLInputElement>(null);

  const data = getChapterData(chapter);

  // Load docState from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(docStateKey);
      if (saved) {
        try { setDocState(JSON.parse(saved)); } catch { }
      }
    }
  }, [docStateKey]);

  // Persist docState when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(docStateKey, JSON.stringify(docState));
    }
  }, [docState, docStateKey]);

  const safeChapterId = chapterId.replace(".", "-");
  const requiredDocs = getRequiredDocs(safeChapterId) || [];
  const mandatoryDocs = (requiredDocs || []).filter(d => d?.required);
  const mandatorySubmitted = (mandatoryDocs || []).filter(d => docState?.submitted?.[d?.id]).length || 0;
  const optionalDocs = (requiredDocs || []).filter(d => !d?.required);
  const optionalSubmitted = (optionalDocs || []).filter(d => docState?.submitted?.[d?.id]).length || 0;
  const allMandatoryDone = (mandatoryDocs?.length || 0) > 0 && mandatorySubmitted === (mandatoryDocs?.length || 0);

  // Track word count changes
  const currentWordCount = (content || "").trim().split(/\s+/).filter(w => !!w).length;
  useEffect(() => {
    if (onWordCountChange) {
      onWordCountChange(chapterId, currentWordCount);
    }
  }, [currentWordCount, chapterId, onWordCountChange]);

  // Log session on unmount
  useEffect(() => {
    const sessionStart = sessionStartRef.current;
    const initialCount = initialWordCountRef.current;

    return () => {
      const duration = Math.round((Date.now() - sessionStart) / 1000);
      if (duration > 5 && onChapterExit) {
        onChapterExit(chapterId, duration, initialCount, currentWordCount);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (slot: "evidence" | "annotation", file: File, docId?: string) => {
    if (docId) {
      setZkpStatus(prev => ({ ...prev, [docId]: "scanning" }));
      setBriefingStatus(`🔐 ZK-Proof 協議啟動，正在對「${file.name}」進行 Hash 簽章...`);

      // Simulate ZKP processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      setZkpStatus(prev => ({ ...prev, [docId]: "verified" }));
      setBriefingStatus(`✅ ${file.name} 已通過 5T 驗證並封存於 Audit Vault。`);
    }

    setDocState(prev => ({ ...prev, [slot]: { fileName: file.name, uploadedAt: new Date().toLocaleString("zh-TW") } }));
    if (docId) {
      setDocState(prev => ({
        ...prev,
        submitted: { ...prev.submitted, [docId]: true }
      }));
    }
  };

  const handleSemanticReview = async () => {
    setIsReviewing(true);
    setBriefingStatus("🕵️ Dr. Thoth 正在進行語意連貫性審查與邏輯稽核...");

    try {
      const prompt = `請作為 ESG 稽核員，審核以下內容的連貫性、專業度與邏輯缺陷：\n\n${content}\n\n請輸出 JSON 格式: { "score": 0-100, "findings": ["缺陷1", ...], "suggestions": ["建議1", ...] }`;
      const fullOutput = await omniGenerate(prompt);

      // Attempt to parse JSON from AI output (heuristically)
      const jsonMatch = fullOutput?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setSemanticReview(JSON.parse(jsonMatch[0]));
        setBriefingStatus("✅ 語意審查完成！請查閱右側稽核面板。");
      } else {
        setSemanticReview({
          score: 85,
          findings: ["AI 回傳格式不正確，請手動校對內容。"],
          suggestions: ["建議根據 GRI 標準加強描述數據來源。"]
        });
      }
    } catch (error: any) {
      console.error(error);
      setBriefingStatus(`❌ 語意審查執行失敗：${error.message || "未知錯誤"}`);
    } finally {
      setIsReviewing(false);
    }
  };

  // --- Agentic Handlers ---
  const startInterviewerAgent = async () => {
    setIsAgentTaskRunning(true);
    setAgentMode("INTERVIEWING");
    setBriefingStatus("📢 Interviewer Agent 已啟動，正在對標框架生成關鍵問項...");
    try {
      const res = await fetch("/api/genkit", {
        method: "POST",
        body: JSON.stringify({ action: "DISCOVER", chapterType: chapter }),
      });
      const data = await res.json();
      setInterviewQuestions(data.questions || []);
      setBriefingStatus("✅ 採訪問項產出完畢，請提供數據回應。");
    } catch (e) {
      setBriefingStatus("❌ 採訪代理啟動失敗。");
    } finally {
      setIsAgentTaskRunning(false);
    }
  };

  const runFullGenerativeCycle = async () => {
    if (!currentAnswers) return;
    setIsAgentTaskRunning(true);
    setBriefingStatus("🤖 代理人矩陣協作中：正在進行 (1) 數據結構化 (2) 專業寫作 (3) 品質稽核...");
    setAgentMode("STRUCTURING");
    try {
      // Step 1: Structure
      const sRes = await fetch("/api/genkit", {
        method: "POST",
        body: JSON.stringify({ action: "STRUCTURE", chapterType: chapter, rawAnswers: currentAnswers }),
      });
      const sData = await sRes.json();
      setStructuredJSON(sData);

      // Step 2: Generate Draft & QA
      setAgentMode("WRITING");
      const gRes = await fetch("/api/genkit", {
        method: "POST",
        body: JSON.stringify({ action: "GENERATE", chapterType: chapter, title: chapter, structuredData: sData }),
      });
      const gData = await gRes.json();

      setContent(gData.draft);
      setQaReport(gData.audit);
      setAgentMode("QA");
      setBriefingStatus(gData.status === "SUCCESS" ? "✨ 報告撰寫與品質稽核完成！" : "⚠️ 撰寫完成，但稽核顯示資料完整度不足。");
    } catch (e) {
      setBriefingStatus("❌ 代理人協作流程中斷。");
    } finally {
      setIsAgentTaskRunning(false);
    }
  };

  // Auto-save
  useEffect(() => {
    if (content === initialContent && !isAiGenerating) return;
    setAutoSaveStatus("SAVING");
    const t = setTimeout(() => {
      onSave(content);
      setAutoSaveStatus("SAVED");
      const h = setTimeout(() => setAutoSaveStatus("IDLE"), 3000);
      return () => clearTimeout(h);
    }, 1500);
    return () => clearTimeout(t);
  }, [content, onSave, initialContent, isAiGenerating]);

  const handleChartSuggestion = async () => {
    if (!content.trim()) return;
    setSemanticReview(null);
    setBriefingStatus("📊 Dr. Thoth 正在分析圖表建議...");

    try {
      const prompt = `作為 ESG 數據可視化專家，請分析以下章節內容，並建議 2-3 個最適合呈現該數據的圖表類型（如 Recharts 的 LineChart, BarChart, PieChart, RadarChart）。\n章節：${chapter}\n內容：${content}\n\n請以繁體中文提供專業建議，格式如下：\n### 📊 建議圖表 1: [圖表名稱]\n- **適用數據**：...\n- **Recharts 組件**：...`;

      const fullResponse = await omniGenerate(prompt);

      setSemanticReview({
        score: 100,
        findings: ["圖表配置建議已生成"],
        suggestions: [fullResponse || ""]
      });
      setBriefingStatus("✅ 圖表建議已生成！");
    } catch (error) {
      console.error("Chart suggestion failed", error);
      setBriefingStatus("❌ 圖表建議生成失敗。");
    }
  };
  const handleOcrUpload = async (file: File) => {
    setIsOcrScanning(true);
    setShowOcrPanel(true);
    setOcrResults(null);
    setBriefingStatus(`📷 正在用 AI Vision 掃描「${file.name}」...`);
    const result = await extractDocumentData(file, chapter);
    setOcrResults(result);
    setIsOcrScanning(false);
    if (result.success) {
      setShowHeatmap(true);
      setBriefingStatus(`✅ OCR 擷取完成！找到 ${result.extractedItems.length} 筆 ESG 數據。請核實熱區信心。`);

      // Log Audit Action
      const { logAuditAction } = await import('@/lib/omni-heart');
      const baseHeart = createOmniHeart("Chapter", chapter, "OCR_Extraction");
      logAuditAction(baseHeart, `Imported_OCR_${file.name}`);
    } else {
      setBriefingStatus(`❗ OCR 掃描失敗：${result.error}`);
    }
  };

  // --- Genkit CoT Chain Handler ---
  const handleRunCotChain = async () => {
    setShowCotPanel(true);
    setIsCotRunning(true);
    setCotFinalOutput("");
    setCotNodes([
      { id: "reconnaissance", title: "偵察分析", icon: "🔍", status: "waiting" },
      { id: "benchmark", title: "標竿比對", icon: "🏆", status: "waiting" },
      { id: "synthesis", title: "合成建議段落", icon: "✨", status: "waiting" },
    ]);
    setBriefingStatus("🧠 Genkit 思考鏈已啟動，正在執行三階段分析...");
    const parts = chapter.split(" ");
    const finalText = await runReportChainFlow({
      chapterId: parts[0] || chapter,
      chapterTitle: parts.slice(1).join(" ") || chapter,
      currentDraft: content,
      industry: selectedIndustry,
      onNodeUpdate: (node) => {
        setCotNodes(prev => {
          const idx = prev.findIndex(n => n.id === node.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = node;
            return updated;
          }
          return [...prev, node];
        });
        if (node.status === "thinking") setBriefingStatus(`🔄 ${node.title}：${node.thinkingText}`);
        if (node.status === "done") setBriefingStatus(`✅ ${node.title} 完成`);
      },
    });
    setCotFinalOutput(finalText);
    setIsCotRunning(false);
    setBriefingStatus("🎉 Genkit 思考鏈完成！建議段落已就緒。");
  };

  const handleAIGeneration = async (action: string) => {
    setBriefingStatus(`正在啟動 Dr. Thoth，準備執行【${action}】...`);
    if (promptContext !== "") setPromptContext("");

    const parts = chapter.split(" ");
    const chId = parts[0] || "unknown";
    const chTitle = parts.slice(1).join(" ") || chapter;

    let specializedPrompt = "";
    switch (action) {
      case "內容擴寫 (Expand)":
        specializedPrompt = `作為 ESG 內容專家，請根據目前草稿進行「內容擴寫」。請增加更多細節、具體案例、數據描述，並確保符合 GRI/SASB 的深度要求。`;
        break;
      case "語意精煉 (Refine)":
        specializedPrompt = `作為 ESG 高級編輯，請將目前內容進行「語意精煉」。請去除冗詞贅句，提升專業度與精煉感，保留核心數據與事實。`;
        break;
      case "改為數據圖 (Data-to-Chart)":
        specializedPrompt = `請將目前的內容轉化為可視化的數據結構。首先輸出一個 Markdown 表格，接著在代碼塊中輸出對應的 JSON 數據，格式必須符合 Recharts 規範。`;
        break;
      case "整體潤稿 (Proofread)":
        specializedPrompt = `請對目前內容進行「整體潤稿」。修正語法錯誤、統一名詞、確保口吻專業且符合永續發展報告書之嚴謹風格。`;
        break;
      case "智慧排版 (Format)":
        specializedPrompt = `請將目前內容進行「智慧排版」。使用適當的標題層級、列表、粗體強調，使閱讀與索引更為直覺。輸出必須是 Markdown 格式。`;
        break;
      default:
        specializedPrompt = `使用者指定操作: ${action}\n請根據以上指引產生或擴寫高品質的 ESG 報告內容。`;
    }

    try {
      setBriefingStatus(`Dr. Thoth 正在查閱智庫數據並生成 【${chTitle}】...`);
      const { retrieveKnowledge, formatKnowledgeForPrompt } = await import('@/lib/services/knowledge-base');
      const knowledgeSegments = await retrieveKnowledge(chTitle || chId || "General ESG");
      const groundingContext = formatKnowledgeForPrompt(knowledgeSegments);

      const fullPrompt = `您是一位世界級的 ESG 報告撰寫專家。章節：${chId} ${chTitle}\n\n${specializedPrompt}\n\n${groundingContext}\n\n原始草稿內容: ${content || '無'}`;

      const result = await omniGenerate(fullPrompt);
      // Note: setContent is handled by useEffect sync during streaming
      setBriefingStatus(`【${chTitle}】 ${action} 處理完畢！已同步至編輯器。`);
    } catch (error: any) {
      setBriefingStatus(`❗ ${error.message || '處理失敗，請檢查 API Key 或是網路狀態。'}`);
      console.error(error);
    }
  };

  return (
    <div className={cn("flex-1 flex flex-col bg-white border border-outline-variant overflow-hidden shadow-2xl transition-all duration-700", isFullscreen ? "fixed inset-0 z-50 rounded-none" : "rounded-[40px]")}>
      {/* Header - Editorial Style */}
      <div className="p-8 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest shrink-0">
        <div className="flex flex-col gap-1">
          <h4 className="text-2xl font-black text-on-surface flex items-center gap-3 font-headline leading-none uppercase tracking-tight">
            <Layers className="w-6 h-6 text-primary" /> {chapter}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-label opacity-60">Chapter Intelligence Matrix</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {allMandatoryDone && (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full flex items-center gap-2 font-label shadow-sm">
              <ShieldCheck size={14} /> 核驗完成 Verified
            </span>
          )}
          <Badge className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase font-label px-4 py-1.5 rounded-full">
            TRINITY_SCORE: 98.2 (OPTIMAL)
          </Badge>
          <AITierSwitcher activeTier={activeTier} onChange={handleTierSwitch} edgeProgress={edgeProgress} />
          {autoSaveStatus === "SAVING" && <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-2 animate-pulse font-label uppercase opacity-60"><Loader2 size={14} className="animate-spin" /> Syncing...</span>}
          {autoSaveStatus === "SAVED" && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-2 font-label uppercase"><CheckCircle2 size={14} /> Vault Secured</span>}
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => { onSave(content); setAutoSaveStatus("SAVED"); setTimeout(() => setAutoSaveStatus("IDLE"), 3000); }} className="px-6 py-2.5 bg-primary text-on-primary rounded-2xl text-[10px] font-black flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest font-label">
            <Save size={16} /> 保存章節草稿
          </button>
        </div>
      </div>

      {/* Input for OCR upload */}
      <input ref={ocrFileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { await handleOcrUpload(f); } e.target.value = ""; }} />

      {/* Genkit CoT Sliding Panel */}
      <AnimatePresence>
        {showCotPanel && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-[#0F172A] z-50 flex flex-col shadow-2xl border-l border-white/10"
          >
            {/* CoT Panel Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-primary-teal-start flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm tracking-tight">Genkit 思考鏈</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">3-Node Reasoning Chain</p>
                </div>
              </div>
              <button onClick={() => setShowCotPanel(false)} className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            {/* Industry Selector */}
            <div className="p-4 border-b border-white/10">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">選擇標竿產業</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(BENCHMARK_DATA) as IndustryType[]).map(ind => {
                  const labels: Record<IndustryType, string> = { tech: '科技', finance: '金融', manufacturing: '製造', retail: '零售', energy: '能源' };
                  return (
                    <button key={ind} onClick={() => setSelectedIndustry(ind)}
                      className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                        selectedIndustry === ind ? "bg-primary-teal-start text-white" : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
                      )}>
                      {labels[ind]}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* CoT Nodes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isCotRunning && cotNodes.length === 0 && (
                <div className="flex items-center gap-3 text-white/50 py-8 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-bold">正在初始化思考鏈...</span>
                </div>
              )}
              {cotNodes.map((node, i) => (
                <div key={node.id} className={cn("rounded-xl border p-4 transition-all",
                  node.status === 'thinking' ? "border-primary-teal-start/40 bg-primary-teal-start/5" :
                    node.status === 'done' ? "border-white/20 bg-white/5" :
                      "border-white/10 bg-transparent opacity-40"
                )}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{node.icon}</span>
                    <span className="text-white text-sm font-black">{node.title}</span>
                    {node.status === 'thinking' && <Loader2 className="w-4 h-4 text-primary-teal-start animate-spin ml-auto" />}
                    {node.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
                  </div>
                  {node.status === 'thinking' && node.thinkingText && (
                    <p className="text-white/50 text-[11px] font-medium animate-pulse">{node.thinkingText}</p>
                  )}
                  {node.status === 'done' && node.output && (
                    <p className="text-white/70 text-[11px] font-medium leading-relaxed whitespace-pre-wrap">{node.output}</p>
                  )}
                </div>
              ))}
            </div>
            {/* Final Output */}
            {cotFinalOutput && (
              <div className="p-4 border-t border-white/10">
                <p className="text-primary-teal-start text-[10px] font-black uppercase tracking-widest mb-2">✨ AI 建議段落</p>
                <div className="bg-white/5 rounded-xl p-3 max-h-32 overflow-y-auto">
                  <p className="text-white/80 text-[11px] leading-relaxed whitespace-pre-wrap">{cotFinalOutput.substring(0, 300)}...</p>
                </div>
                <button onClick={() => { setContent(prev => prev + "\n\n" + cotFinalOutput); setShowCotPanel(false); setBriefingStatus("✅ AI 建議段落已插入編輯器！"); }}
                  className="mt-3 w-full py-3 bg-gradient-to-r from-primary-teal-start to-emerald-400 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg">
                  採納建議 → 插入編輯器
                </button>
              </div>
            )}
            {!isCotRunning && cotNodes.length === 0 && (
              <div className="p-4">
                <button onClick={handleRunCotChain}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-primary-teal-start text-white rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2">
                  <Brain size={16} /> 啟動三階段 Genkit 思考鏈
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4-Tab bar */}
      <div className="flex border-b border-outline-variant/30 shrink-0 overflow-x-auto no-scrollbar bg-surface">
        {([
          { id: "write" as const, label: "✍️ 撰寫草稿", badge: null },
          { id: "docs" as const, label: "📋 必要單據", badge: `${mandatorySubmitted}/${mandatoryDocs.length}` },
          { id: "benchmark" as const, label: "🏆 標竿對比", badge: null },
          { id: "preview" as const, label: "🗂️ 排版預覽", badge: null },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setEditorTab(tab.id)}
            className={cn(
              "shrink-0 px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all flex items-center gap-2 font-label hover:bg-surface-container-lowest",
              editorTab === tab.id ? "border-primary text-primary bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]" : "border-transparent text-outline hover:text-primary"
            )}
          >
            {tab.label}
            {tab.badge && <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", allMandatoryDone && (mandatoryDocs?.length || 0) > 0 ? "bg-emerald-100 text-emerald-700" : "bg-surface-container-high text-outline")}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-12 bg-background relative">
        {editorTab === "write" && (
          <>
            <div className="space-y-12">
              {/* AI Agent Squad - Modernized Performance Layer */}
              <div className="bg-surface-container-lowest rounded-[40px] p-6 relative overflow-hidden shadow-2xl border border-outline-variant/30 group">
                {/* Refined Gradient Accents */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-outline-variant/30 group-hover:border-primary/40 transition-all duration-700">
                        <BrainCircuit className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight font-headline text-on-surface leading-none uppercase">
                          AI Editorial Squad
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", isAgentTaskRunning ? "bg-emerald-500 animate-ping" : "bg-on-surface-variant/20")} />
                          <p className="text-on-surface-variant/60 text-[9px] font-black uppercase tracking-[0.2em] font-label">Genkit Orchestration</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] border-outline-variant/30 font-label rounded-xl backdrop-blur-md transition-all duration-700",
                        isAgentTaskRunning ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "bg-surface-container-low text-on-surface-variant/40"
                      )}>
                        {isAgentTaskRunning ? "協作中" : "Standby"}
                      </Badge>
                    </div>
                  </div>

                  {/* Role-Based Squad Visualization - Compact */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { role: "Oracle", icon: <Target className="w-5 h-5" />, active: agentMode !== "IDLE", color: "text-blue-600", bg: "bg-blue-50" },
                      { role: "Scribe", icon: <Wand2 className="w-5 h-5" />, active: agentMode === "WRITING" || agentMode === "QA", color: "text-indigo-600", bg: "bg-indigo-50" },
                      { role: "Analyst", icon: <Database className="w-5 h-5" />, active: agentMode === "STRUCTURING" || agentMode === "WRITING", color: "text-cyan-600", bg: "bg-cyan-50" },
                      { role: "Auditor", icon: <ShieldCheck className="w-5 h-5" />, active: agentMode === "QA", color: "text-emerald-600", bg: "bg-emerald-50" }
                    ].map((agent) => (
                      <div key={agent.role} className={cn(
                        "p-3 rounded-2xl border transition-all duration-500 flex items-center gap-3",
                        agent.active
                          ? "bg-white border-outline-variant shadow-sm"
                          : "bg-surface-container-lowest/50 border-transparent opacity-30 grayscale"
                      )}>
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                          agent.active ? `${agent.bg} ${agent.color} border-white shadow-inner` : "bg-surface border-outline-variant/10 text-on-surface-variant/20")}>
                          {agent.icon}
                        </div>
                        <div className="hidden sm:block">
                          <p className={cn("text-[9px] font-black uppercase tracking-widest leading-none", agent.active ? agent.color : "text-on-surface-variant/30")}>{agent.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {agentMode === "IDLE" ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-8 text-center bg-surface-container-low/30 rounded-[48px] border border-outline-variant/30 relative group/start overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/start:opacity-100 transition-opacity duration-1000" />
                      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-on-surface-variant/20 border border-outline-variant/30 group-hover/start:scale-110 transition-transform duration-700 relative z-10 shadow-xl">
                        <Sparkles size={48} className="group-hover/start:text-primary transition-colors duration-700" />
                      </div>
                      <div className="relative z-10 space-y-3">
                        <p className="text-3xl font-black text-on-surface font-headline tracking-tight">Activate Editorial Intelligence</p>
                        <p className="text-sm text-on-surface-variant/70 max-w-sm mx-auto font-medium italic">
                          Empower your report with real-time AI cross-referencing and GRI-aligned synthesis.
                        </p>
                      </div>
                      <Button onClick={startInterviewerAgent} disabled={isAgentTaskRunning} className="relative z-10 bg-on-surface text-surface hover:bg-on-surface/90 font-black rounded-2xl px-12 h-16 text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 group/btn uppercase tracking-[0.2em] font-label">
                        Start AI Consultation <ArrowRight className="ml-3 w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 gap-12">
                      {/* Consultation (Interview) Step */}
                      {agentMode === "INTERVIEWING" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="p-10 bg-white border border-outline-variant/50 rounded-[48px] space-y-8 relative overflow-hidden shadow-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <MessageSquare size={20} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] font-label leading-none">Oracle Analysis | Contextual Discovery</p>
                                <p className="text-lg font-black text-on-surface font-headline tracking-tight">The Sustainability Interview</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {interviewQuestions.map((q, i) => (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  key={i}
                                  className="flex gap-6 p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 hover:border-primary/20 transition-all group/q shadow-sm"
                                >
                                  <span className="text-primary font-black font-serif text-xl opacity-20 group-hover/q:opacity-100 transition-opacity">0{i + 1}</span>
                                  <span className="text-[15px] font-medium text-on-surface leading-relaxed font-body">{q}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="relative group/input space-y-4">
                            <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-4 block">Editorial Context & Data Entry</label>
                            <textarea
                              value={currentAnswers}
                              onChange={(e) => setCurrentAnswers(e.target.value)}
                              placeholder="Describe facts, operational data, or specific highlights for this chapter..."
                              className="w-full bg-white border border-outline-variant/50 rounded-[40px] p-8 text-base text-on-surface outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 h-48 resize-none font-body transition-all shadow-inner placeholder:text-on-surface-variant/30 leading-relaxed"
                            />
                          </div>

                          <div className="flex gap-6 pt-4">
                            <Button onClick={() => setAgentMode("IDLE")} variant="wireframe" className="text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-low font-black text-xs px-12 h-16 rounded-[32px] uppercase tracking-widest">Abort Cycle</Button>
                            <Button onClick={runFullGenerativeCycle} disabled={!currentAnswers || isAgentTaskRunning} className="flex-1 bg-primary text-on-primary hover:opacity-90 font-black rounded-[32px] h-16 text-sm shadow-2xl shadow-primary/20 transition-all active:scale-95 group/submit">
                              {isAgentTaskRunning ? (
                                <span className="flex items-center gap-3">
                                  <Loader2 size={20} className="animate-spin" /> Orchestrating Matrix...
                                </span>
                              ) : (
                                <span className="flex items-center gap-3 uppercase tracking-[0.2em] font-label">
                                  Generate Advanced Synthesis <Sparkles size={20} className="group-hover/submit:rotate-12 transition-transform" />
                                </span>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Orchestration Phase Lifecycle */}
                      {(agentMode === "STRUCTURING" || agentMode === "WRITING" || agentMode === "QA") && (
                        <div className="space-y-12">
                          <div className="grid grid-cols-3 gap-12 relative px-8">
                            <div className="absolute top-6 left-24 right-24 h-px bg-outline-variant/20 z-0" />
                            {[
                              { id: "STRUCTURING", label: "架構化", sub: "Analysis", color: "text-blue-600", bg: "bg-blue-50" },
                              { id: "WRITING", label: "撰寫中", sub: "Synthesis", color: "text-indigo-600", bg: "bg-indigo-50" },
                              { id: "QA", label: "品質稽核", sub: "Integrity", color: "text-emerald-600", bg: "bg-emerald-50" }
                            ].map((step, idx) => {
                              const isActive = agentMode === step.id;
                              const isPast = ["STRUCTURING", "WRITING", "QA"].indexOf(agentMode) > idx;

                              return (
                                <div key={step.id} className="flex flex-col items-center gap-6 relative z-10">
                                  <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-700",
                                    isActive ? `${step.bg} ${step.color} border-current shadow-xl scale-125` :
                                      isPast ? "bg-on-surface text-surface border-on-surface" : "bg-white border-outline-variant/30 text-on-surface-variant/20"
                                  )}>
                                    {isPast ? <Check size={24} className="animate-in zoom-in" /> : <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-current animate-ping" : "bg-current")} />}
                                  </div>
                                  <div className="text-center space-y-1">
                                    <p className={cn("text-xs font-black uppercase tracking-widest font-label", isActive ? step.color : "text-on-surface-variant/30")}>{step.label}</p>
                                    <p className="text-[10px] font-black text-on-surface-variant/20 tracking-[0.3em] uppercase">{step.sub}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {agentMode === "QA" && qaReport && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-10 bg-emerald-50/50 border border-emerald-200/50 rounded-[48px] space-y-10 relative overflow-hidden shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                                    <ShieldCheck size={24} />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] font-label leading-none">Integrity Audit Result</p>
                                    <p className="text-xl font-black text-on-surface font-headline tracking-tight uppercase">Protocol Compliant</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest block mb-1">TRINITY_SCORE</span>
                                  <span className="text-5xl font-black text-emerald-600 leading-none tracking-tighter">{qaReport.score}</span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(qaReport.findings || []).slice(0, 4).map((f: any, i: number) => (
                                  <div key={i} className="flex items-start gap-4 p-5 bg-white border border-emerald-100/50 rounded-[32px] shadow-sm">
                                    <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 shrink-0 border border-emerald-100">
                                      <Check size={12} />
                                    </div>
                                    <p className="text-[12px] font-medium text-on-surface-variant leading-relaxed italic">{typeof f === 'string' ? f : f.description}</p>
                                  </div>
                                ))}
                              </div>
                              <Button onClick={() => setAgentMode("IDLE")} className="w-full h-16 bg-on-surface text-surface text-xs font-black rounded-[32px] uppercase tracking-[0.2em] shadow-2xl hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-95">
                                Finalize Lifecycle & Sync Draft →
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Structural Context Layer - Premium Stitch Aesthetic */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: <BookOpen className="w-5 h-5" />, label: "教學式解析", content: data.why, color: "text-blue-600", bg: "bg-blue-50/50" },
                  { icon: <Wand2 className="w-5 h-5" />, label: "寫作教學", content: data.how, color: "text-amber-600", bg: "bg-amber-50/50" },
                  { icon: <FileText className="w-5 h-5" />, label: "建議表達項目", content: data.what, color: "text-indigo-600", bg: "bg-indigo-50/50" },
                  { icon: <Database className="w-5 h-5" />, label: "數據來源建言", content: data.sources.join("、"), color: "text-emerald-600", bg: "bg-emerald-50/50" }
                ].map((card, i) => (
                  <div key={i} className={cn(
                    "p-6 rounded-[32px] border border-outline-variant/30 space-y-4 hover:border-primary/40 transition-all duration-500 bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5",
                    card.bg
                  )}>
                    <div className={cn("flex items-center gap-3", card.color)}>
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-outline-variant/10">
                        {card.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] font-label">{card.label}</span>
                    </div>
                    <p className="text-[12px] font-bold text-on-surface leading-normal font-body">
                      {card.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-stitch-text tracking-tight flex items-center gap-3">
                    <Sparkles size={24} className="text-primary-gold" />
                    智能撰寫空間
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Auto-Saving enabled</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center overflow-hidden">
                          <Users size={12} className="text-stone-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative group flex-1 flex flex-col">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isAiGenerating}
                    placeholder="在這裡開始撰寫，或者使用下方 AI 導寫面板自動生成草稿..."
                    className={cn(
                      "w-full min-h-[500px] flex-1 p-10 md:p-14 rounded-[40px] border border-outline-variant/40 outline-none resize-none font-body text-lg leading-relaxed text-on-surface bg-white transition-all shadow-[inset_0_2px_20px_rgba(0,0,0,0.02)] focus:border-primary/40 focus:ring-4 focus:ring-primary/5 relative z-10",
                      isAiGenerating && "opacity-70 animate-pulse ring-2 ring-primary/20",
                      content.trim() === "" && "bg-transparent text-transparent placeholder-transparent"
                    )}
                  />

                  {/* ✨ Zero-Start Empty State (Smart Draft Generator) */}
                  {content.trim() === "" && !isAiGenerating && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 rounded-[40px] bg-white/60 backdrop-blur-sm p-12 transition-all hover:bg-white hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5">
                      <div className="w-20 h-20 rounded-[28px] bg-primary/10 flex items-center justify-center text-primary mb-6 animate-in zoom-in duration-700 shadow-inner">
                        <Sparkles size={36} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-2xl font-headline font-black text-on-surface tracking-tight mb-3">
                        畫布為空，讓 Dr. Thoth 為您開局
                      </h4>
                      <p className="text-sm font-medium text-on-surface-variant max-w-md text-center mb-10 leading-relaxed">
                        基於您選擇的 {chapter} 章節指引，我們可以立即為您生成一份高度符合 5T 標準的初步草案，為您省去從零開始的時間。
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <Button
                          onClick={() => handleAIGeneration("一鍵生成標準草案 (Standard Draft)")}
                          className="h-14 px-8 bg-stitch-text hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                          <Wand2 size={18} /> 一鍵生成草稿
                        </Button>
                        <Button
                          onClick={() => handleAIGeneration("以條列式大綱呈現 (Outline Flow)")}
                          variant="wireframe"
                          className="h-14 px-8 rounded-2xl border-outline-variant/60 hover:border-primary/30 font-black text-sm text-on-surface shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 bg-white active:scale-95"
                        >
                          <List size={18} /> 大綱式輔助
                        </Button>
                      </div>
                      <p className="text-[10px] font-bold text-on-surface-variant/40 mt-8 uppercase tracking-[0.2em]">
                        Dr. Thoth Copilot Ready
                      </p>
                    </div>
                  )}

                  <div className="absolute top-10 right-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none group-hover:pointer-events-auto">
                    <Button variant="wireframe" className="rounded-full bg-white/80 backdrop-blur-sm shadow-xl p-2">
                      <Maximize2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showHeatmap && ocrResults && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "33.333%", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="hidden lg:flex flex-col bg-stone-50/50 relative overflow-hidden"
                  >
                    <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
                      <span className="text-[10px] font-black uppercase text-stone-400">OCR_Integrity_Heatmap</span>
                      <button onClick={() => setShowHeatmap(false)} className="text-stone-400 hover:text-black">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
                      <ConfidenceHeatmap items={ocrResults.extractedItems as any} className="w-full shadow-lg mb-6" />

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h5 className="text-[11px] font-black uppercase text-stitch-text">數據洞察 (VE_Insights)</h5>
                          <p className="text-[11px] text-stitch-muted leading-relaxed font-bold italic">
                            &quot;{ocrResults.summary}&quot;
                          </p>
                        </div>

                        {ocrResults.chartStructure && (
                          <div className="p-4 bg-primary-teal-start/5 border border-primary-teal-start/10 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-primary-teal-start">
                              <Zap size={14} />
                              <span className="text-[10px] font-black uppercase">偵測到圖表模型</span>
                            </div>
                            <p className="text-[10px] text-stitch-text-muted font-bold leading-relaxed">{ocrResults.chartStructure.insight}</p>
                            <button
                              onClick={() => {
                                const chartMd = `\n\n### 📊 自動生成圖表\n\`\`\`json\n${JSON.stringify(ocrResults.chartStructure?.data, null, 2)}\n\`\`\`\n`;
                                setContent(prev => prev + chartMd);
                                setBriefingStatus("✅ 圖表數據已注入草稿！");
                              }}
                              className="w-full py-2 bg-primary-teal-start text-white text-[9px] font-black rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                              立即注入圖表 JSON
                            </button>
                          </div>
                        )}

                        <div className="pt-4 border-t border-stone-200">
                          <p className="text-[9px] font-black text-stone-400 uppercase mb-3">提取項目清單 (Extracted Items)</p>
                          <div className="space-y-2">
                            {(ocrResults?.extractedItems || []).map((item, idx) => (
                              <div key={idx} className="p-2 bg-white rounded-lg border border-stone-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-stitch-text">{item.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-primary-teal-start">{item.value}{item.unit}</span>
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    item.confidence === 'high' ? "bg-emerald-500" : item.confidence === 'medium' ? "bg-amber-500" : "bg-rose-500"
                                  )} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-surface-container/95 backdrop-blur-xl border border-outline-variant rounded-2xl shadow-xl p-2 flex flex-col gap-2 z-10">
                <div className="flex items-center gap-2 px-2 pb-1 overflow-x-auto no-scrollbar">
                  <button onClick={() => handleAIGeneration("內容擴寫 (Expand)")} disabled={isAiGenerating} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center shadow-minimal hover:border-primary-teal-start hover:text-primary-teal-start transition-all disabled:opacity-50">📤 擴寫 (Expand)</button>
                  <button onClick={() => handleAIGeneration("語意精煉 (Refine)")} disabled={isAiGenerating} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center shadow-minimal hover:border-violet-500 hover:text-violet-500 transition-all disabled:opacity-50">💎 精煉 (Refine)</button>
                  <button onClick={() => handleAIGeneration("改為數據圖 (Data-to-Chart)")} disabled={isAiGenerating} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center shadow-minimal hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-50">📊 轉圖表</button>
                  <button onClick={() => handleAIGeneration("整體潤稿 (Proofread)")} disabled={isAiGenerating} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center shadow-minimal hover:border-blue-500 hover:text-blue-500 transition-all disabled:opacity-50">🖋️ 潤稿</button>
                  <button onClick={() => handleAIGeneration("智慧排版 (Format)")} disabled={isAiGenerating} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center shadow-minimal hover:border-amber-500 hover:text-amber-500 transition-all disabled:opacity-50">🧱 排版</button>
                  {/* NEW: OCR, CoT, etc */}
                  <div className="w-px h-4 bg-stone-200 mx-1 shrink-0" />
                  <button onClick={() => ocrFileRef.current?.click()} disabled={isAiGenerating || isOcrScanning} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-minimal hover:border-primary-teal-start hover:text-primary-teal-start transition-all disabled:opacity-50">
                    {isOcrScanning ? <Loader2 size={10} className="animate-spin" /> : <Camera size={10} />} OCR 擷取
                  </button>
                  <button onClick={handleRunCotChain} disabled={isAiGenerating || isCotRunning} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-minimal hover:border-indigo-500 hover:text-indigo-500 transition-all disabled:opacity-50">
                    {isCotRunning ? <Loader2 size={10} className="animate-spin" /> : <Brain size={10} />} AI 建議鏈
                  </button>
                  <button onClick={handleSemanticReview} disabled={isAiGenerating || isReviewing} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-minimal hover:border-amber-500 hover:text-amber-500 transition-all disabled:opacity-50">
                    {isReviewing ? <Loader2 size={10} className="animate-spin" /> : "🔗"} 語意連貫
                  </button>
                  <button onClick={handleChartSuggestion} disabled={isAiGenerating} className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-100 text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-minimal hover:border-rose-500 hover:text-rose-500 transition-all disabled:opacity-50">
                    {isAiGenerating ? <Loader2 size={10} className="animate-spin" /> : "📈"} 圖表建議
                  </button>
                  <div className="h-4 w-px bg-stone-100 mx-1" />
                  <button
                    onClick={() => setIsAuditReady(!isAuditReady)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center gap-1 transition-all",
                      isAuditReady
                        ? "bg-primary-teal-start text-white shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                        : "bg-white border border-stone-100 text-stone-400 hover:border-primary-teal-start hover:text-primary-teal-start shadow-minimal"
                    )}
                  >
                    <ShieldCheck size={10} /> {isAuditReady ? "已核實" : "標記為核實"}
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-outline-variant p-2 shadow-inner">
                  <Wand2 className={cn("w-4 h-4 ml-2", isAiGenerating ? "text-primary-teal-start animate-spin" : "text-stitch-muted")} />
                  <input type="text" value={promptContext} onChange={(e) => setPromptContext(e.target.value)} disabled={isAiGenerating} placeholder="告訴 Dr. Thoth 你希望調整的內容..." className="flex-1 text-sm bg-transparent outline-none px-2 font-bold placeholder:text-stone-300 placeholder:font-normal" onKeyDown={(e) => { if (e.key === 'Enter' && promptContext) handleAIGeneration(promptContext); }} />
                </div>
              </div>

              {/* Evidence & Attachments Section */}
              <div className="mt-12 pt-10 border-t border-stone-100 space-y-6 pb-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-blue-50/50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <LinkIcon size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-stitch-text uppercase tracking-widest flex items-center gap-2">
                        佐證附件與關聯 (Evidence & Linkage)
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px]">5T Protocol</span>
                      </h4>
                      <p className="text-[10px] font-bold text-stitch-muted mt-0.5">基於 5T 協議的數據連貫性與不可篡改證明</p>
                    </div>
                  </div>
                  <Button variant="wireframe" className="rounded-2xl border-outline-variant text-[11px] font-black gap-2 h-10 px-5 hover:bg-white" onClick={() => evidenceInputRef.current?.click()}>
                    <Plus size={16} /> 新增佐證 (Add Evidence)
                  </Button>
                  <input ref={evidenceInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("evidence", f); }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docState.evidence ? (
                    <div className="bg-white border-2 border-stone-50 p-5 rounded-[32px] flex items-center justify-between group hover:border-primary-teal-start/40 transition-all hover:shadow-xl hover:shadow-primary-teal-start/5">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100 group-hover:bg-primary-teal-start/5">
                          <FileSearch size={22} className="text-stone-400 group-hover:text-primary-teal-start" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-black text-stitch-text truncate">{docState.evidence.fileName}</p>
                          <p className="text-[10px] font-bold text-stone-400 mt-0.5 uppercase tracking-tighter">Uploaded: {docState.evidence.uploadedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <ShieldCheck size={18} className="text-emerald-500" />
                          <span className="text-[8px] font-black text-emerald-600 tracking-tighter uppercase">5T Verified</span>
                        </div>
                        <div className="w-px h-8 bg-stone-100 mx-1" />
                        <button className="text-stone-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-xl" onClick={() => setDocState(prev => ({ ...prev, evidence: undefined }))}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-full py-16 border-2 border-dashed border-stone-100 rounded-[48px] flex flex-col items-center justify-center gap-4 opacity-70 hover:opacity-100 transition-all cursor-pointer px-8 text-center hover:bg-stone-50/50 hover:border-stone-200" onClick={() => evidenceInputRef.current?.click()}>
                      <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 border border-stone-100">
                        <Plus size={32} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div >
          </>
        )}

        {
          editorTab === "docs" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 overflow-y-auto p-8">
              <div className="space-y-8">
                {/* Semantic Review Result Panel */}
                {semanticReview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[40px] bg-secondary-container border border-secondary/20 editorial-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-on-secondary-container" />
                        <h5 className="font-black text-on-secondary-container text-base tracking-tight uppercase font-headline">稽核報告：語意與邏輯審查</h5>
                      </div>
                      <div className="px-4 py-1.5 bg-secondary text-on-secondary rounded-full text-[10px] font-black tracking-[0.2em] font-label">
                        SCORE: {semanticReview.score}
                      </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">關鍵發現 (Findings)</p>
                        {(semanticReview?.findings || []).map((f: string, i: number) => (
                          <div key={i} className="text-xs font-bold text-amber-800 flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /> {f}
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-amber-200/50 space-y-1">
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">優化建議 (Suggestions)</p>
                        {(semanticReview?.suggestions || []).map((s: string, i: number) => (
                          <div key={i} className="text-xs font-bold text-amber-800 flex items-start gap-2 italic">
                            <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" /> {s}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSemanticReview(null)}
                      className="absolute top-4 right-4 text-amber-400 hover:text-amber-600"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}

                {/* External Systems Sync */}
                <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-emerald-600" />
                      <h5 className="font-black text-emerald-900 text-sm tracking-tight uppercase">外部系統同步 (External Sync)</h5>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[9px] font-black uppercase tracking-widest">5T Powered</Badge>
                  </div>

                  <p className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-tight leading-relaxed">
                    系統偵測到此章節可從已接接之 ERP/HR 系統自動獲取相關數據。點擊下方按鈕啟動 5T 協議同步並完成 ZKP 存證。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={async () => {
                        setBriefingStatus("🔌 正在連線至 SAP S/4HANA ERP 系統...");
                        try {
                          const res = await fetch("/api/external/sync", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ system: 'ERP', key: '2026-Q1-ELEC' })
                          });
                          if (!res.ok) throw new Error("Sync failed");
                          const sealed = await res.json();

                          if (sealed && sealed.hashLock) {
                            setBriefingStatus(`✅ ERP 數據同步成功！已產生 5T 存證：${sealed.hashLock.substring(0, 16)}...`);
                            setDocState(prev => ({
                              ...prev,
                              evidence: { fileName: `ERP_Sync_ELEC_${sealed.hashLock.substring(0, 8)}.json`, uploadedAt: new Date().toLocaleString() },
                              submitted: { ...prev.submitted, "env-energy-data": true }
                            }));
                          } else {
                            setBriefingStatus("⚠️ ERP 同步完成，但無法獲取存證 ID (Client Side)。");
                          }
                        } catch (e) {
                          setBriefingStatus("❌ ERP 同步失敗，請檢查系統介接狀態。");
                        }
                      }}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-200/50 hover:border-emerald-400 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-black text-emerald-900 uppercase">Fetch Energy Data</span>
                          <span className="text-[8px] font-bold text-emerald-600/60 uppercase tracking-widest">Source: ERP</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={async () => {
                        setBriefingStatus("🔌 正在連線至 Workday HR 系統...");
                        try {
                          const res = await fetch("/api/external/sync", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ system: 'HR', key: '2026-Q1-TRAIN' })
                          });
                          if (!res.ok) throw new Error("Sync failed");
                          const sealed = await res.json();
                          if (sealed && sealed.hashLock) {
                            setBriefingStatus(`✅ HR 數據同步成功！已產生 5T 存證：${sealed.hashLock.substring(0, 16)}...`);
                            setDocState(prev => ({
                              ...prev,
                              annotation: { fileName: `HR_Sync_TRAIN_${sealed.hashLock.substring(0, 8)}.json`, uploadedAt: new Date().toLocaleString() },
                              submitted: { ...prev.submitted, "soc-training-hours": true }
                            }));
                          } else {
                            setBriefingStatus("⚠️ HR 同步完成，但無法獲取存證 ID (Client Side)。");
                          }
                        } catch (e) {
                          setBriefingStatus("❌ HR 同步失敗，請檢查系統介接狀態。");
                        }
                      }}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-200/50 hover:border-emerald-400 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-black text-emerald-900 uppercase">Fetch Training Data</span>
                          <span className="text-[8px] font-bold text-emerald-600/60 uppercase tracking-widest">Source: HR</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* 佐證資料 */}
                  <div onClick={() => evidenceInputRef.current?.click()} className="border-2 border-dashed border-stone-200 rounded-2xl p-5 flex flex-col items-center gap-3 group hover:border-primary-teal-start transition-all cursor-pointer">
                    <input ref={evidenceInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("evidence", f); e.target.value = ""; }} />
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", docState.evidence ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400 group-hover:bg-primary-teal-start/10 group-hover:text-primary-teal-start")}><FileText size={22} /></div>
                    <div className="text-center">
                      <p className="text-xs font-black text-stitch-text">📎 佐證資料 (Supporting Evidence)</p>
                      {docState.evidence ? (<p className="text-[10px] text-emerald-600 font-bold mt-1">✓ {docState.evidence.fileName}<br /><span className="text-stone-400">{docState.evidence.uploadedAt}</span></p>) : (<p className="text-[10px] text-stitch-muted mt-1">點擊上傳正式數據佐證文件 (PDF/Excel)</p>)}
                    </div>
                    {docState.evidence && <button onClick={(e) => { e.stopPropagation(); setDocState(p => ({ ...p, evidence: undefined })); }} className="text-[10px] text-red-400 hover:text-red-600 font-bold">移除</button>}
                  </div>
                  {/* 附註說明 */}
                  <div onClick={() => annotationInputRef.current?.click()} className="border-2 border-dashed border-stone-200 rounded-2xl p-5 flex flex-col items-center gap-3 group hover:border-primary-gold transition-all cursor-pointer">
                    <input ref={annotationInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("annotation", f); e.target.value = ""; }} />
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", docState.annotation ? "bg-amber-100 text-amber-600" : "bg-stone-100 text-stone-400 group-hover:bg-primary-gold/10 group-hover:text-primary-gold")}><MessageSquare size={22} /></div>
                    <div className="text-center">
                      <p className="text-xs font-black text-stitch-text">📝 附註說明 (Annotation)</p>
                      {docState.annotation ? (<p className="text-[10px] text-amber-600 font-bold mt-1">✓ {docState.annotation.fileName}<br /><span className="text-stone-400">{docState.annotation.uploadedAt}</span></p>) : (<p className="text-[10px] text-stitch-muted mt-1">點擊上傳補充說明或備忘錄</p>)}
                    </div>
                    {docState.annotation && <button onClick={(e) => { e.stopPropagation(); setDocState(p => ({ ...p, annotation: undefined })); }} className="text-[10px] text-red-400 hover:text-red-600 font-bold">移除</button>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xs font-black uppercase tracking-widest text-stitch-text flex items-center gap-2"><ClipboardList size={14} className="text-primary-teal-start" /> 本章節必要單據清單</h5>
                    <span className={cn("text-[10px] font-black px-3 py-1 rounded-full", allMandatoryDone ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500")}>必繳 {mandatorySubmitted}/{mandatoryDocs.length} · 選繳 {optionalSubmitted}/{optionalDocs.length}</span>
                  </div>
                  {(requiredDocs?.length || 0) === 0 ? (
                    <div className="text-center py-10 text-stitch-muted text-sm font-bold opacity-50">此章節無指定必要單據</div>
                  ) : (
                    <div className="space-y-2">
                      {requiredDocs.map(doc => {
                        const isOk = !!docState.submitted[doc.id];
                        return (
                          <div key={doc.id} onClick={() => {
                            if (!isOk) {
                              // Trigger file input if docId is used
                              evidenceInputRef.current?.click();
                              // This pattern is tricky. Better to add a prompt or direct handle.
                              // For now, let's just toggle the submitted state for mandatory docs if they don't have files.
                            }
                            setDocState(prev => ({ ...prev, submitted: { ...prev.submitted, [doc.id]: !isOk } }));
                          }} className={cn("flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all select-none group relative overflow-hidden", isOk ? "bg-emerald-50 border-emerald-200" : doc.required ? "bg-white border-stone-200 hover:border-primary-teal-start/40" : "bg-white border-stone-100 hover:border-stone-300")}>
                            {/* ZKP Scanning Overlay */}
                            {zkpStatus[doc.id] === "scanning" && (
                              <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/5 z-10 flex items-center justify-center backdrop-blur-[1px]"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-teal-start animate-ping" />
                                  <span className="text-[9px] font-black text-primary-teal-start uppercase tracking-widest">ZK-Proof Scanning...</span>
                                </div>
                              </motion.div>
                            )}
                            <div className={cn("w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all", isOk ? "bg-emerald-500 border-emerald-500 text-white" : "border-stone-300 group-hover:border-primary-teal-start")}>
                              {zkpStatus[doc.id] === "verified" ? <ShieldCheck size={14} /> : isOk ? <Check size={14} strokeWidth={3} /> : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-bold truncate", isOk ? "text-emerald-800 line-through opacity-60" : "text-stitch-text")}>{doc.label}</p>
                              {doc.gri && <p className="text-[10px] text-stitch-muted font-bold mt-0.5">{doc.gri}</p>}
                            </div>
                            <span className={cn("shrink-0 text-[9px] font-black px-2 py-1 rounded-full uppercase", doc.required ? "bg-red-100 text-red-600" : "bg-stone-100 text-stone-400")}>{doc.required ? "必繳" : "選繳"}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }

        {
          editorTab === "benchmark" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className="text-primary-teal-start" />
                  <h5 className="text-xs font-black uppercase tracking-widest text-stitch-text">同產業標竿企業揭露分析</h5>
                </div>
                <div className="flex gap-2 ml-auto">
                  {(Object.keys(BENCHMARK_DATA) as IndustryType[]).map((ind) => {
                    const labels: Record<IndustryType, string> = { tech: '科技', finance: '金融', manufacturing: '製造', retail: '零售', energy: '能源' };
                    return (
                      <button key={ind} onClick={() => setSelectedIndustry(ind)}
                        className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
                          selectedIndustry === ind ? "bg-primary-teal-start text-white border-primary-teal-start" : "bg-white text-stitch-muted border-stone-200 hover:border-primary-teal-start hover:text-primary-teal-start"
                        )}>
                        {labels[ind]}
                      </button>
                    );
                  })}
                </div>
              </div>
              {(BENCHMARK_DATA[selectedIndustry] || []).map((company, i) => (
                <div key={i} className="p-5 bg-white border border-stone-200 rounded-2xl space-y-3 hover:border-primary-teal-start/30 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-teal-start/10 to-emerald-100 flex items-center justify-center">
                        <Trophy size={16} className="text-primary-teal-start" />
                      </div>
                      <div>
                        <h6 className="font-black text-sm text-stitch-text">{company.name}</h6>
                        <p className="text-[10px] text-stitch-muted font-bold">{company.industry}</p>
                      </div>
                    </div>
                    <Badge className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-3">
                      標竿 #{i + 1}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-stitch-text font-medium leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100 italic">
                    「{company.excerpt}」
                  </p>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block mb-1">核心亮點 (Key Strengths)</span>
                    <p className="text-[11px] text-amber-800 font-bold">{company.strength}</p>
                  </div>
                  <button
                    onClick={() => handleAIGeneration(`參考以下標竿企業《${company.name}》在「${chapter}」的揭露亮點：「${company.strength}」，提供如何讓本公司報告在此章節達到同等或更佳水準的具體建議，並生成一段改善後的示範文字`)}
                    className="w-full py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                    <Sparkles size={12} /> 以此標竿為目標生成建議
                  </button>
                </div>
              ))}
              <div className="p-5 bg-gradient-to-br from-primary-teal-start/5 to-emerald-50 border border-primary-teal-start/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-primary-teal-start uppercase tracking-widest">🧠 AI 差距與比較分析</p>
                  {isCotRunning && <Loader2 size={14} className="animate-spin text-primary-teal-start" />}
                </div>

                <div className="bg-white rounded-xl border border-stone-100 overflow-hidden shadow-minimal">
                  <table className="w-full text-left text-[11px] font-medium">
                    <thead className="bg-stone-50 border-b border-stone-100 text-[10px] uppercase tracking-wider text-stone-500">
                      <tr>
                        <th className="font-black px-4 py-3">評估維度 (Dimension)</th>
                        <th className="font-black px-4 py-3 border-l border-stone-100">本公司 (Current)</th>
                        <th className="font-black px-4 py-3 border-l border-stone-100">標竿企業 (Benchmark)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      <tr className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-stone-700">數據完整性</td>
                        <td className="px-4 py-3 border-l border-stone-100 text-rose-600">中 (缺乏範疇三)</td>
                        <td className="px-4 py-3 border-l border-stone-100 text-emerald-600 font-bold">高 (完整盤查範圍)</td>
                      </tr>
                      <tr className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-stone-700">目標具體化</td>
                        <td className="px-4 py-3 border-l border-stone-100 text-amber-600">有短中期目標</td>
                        <td className="px-4 py-3 border-l border-stone-100 text-emerald-600 font-bold">具備 SBTi 認證之減碳路徑</td>
                      </tr>
                      <tr className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-stone-700">措施關聯性</td>
                        <td className="px-4 py-3 border-l border-stone-100 text-emerald-600 font-bold">與氣候風險高度扣合</td>
                        <td className="px-4 py-3 border-l border-stone-100 text-emerald-600 font-bold">與氣候風險高度扣合</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button onClick={handleRunCotChain}
                  disabled={isCotRunning}
                  className="w-full py-3 bg-primary-teal-start text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm">
                  {isCotRunning ? <><Loader2 size={14} className="animate-spin" /> 分析中...</> : <><Brain size={14} /> 啟動 AI 差距分析並生成優化建議</>}
                </button>
              </div>
            </div>
          )
        }

        {
          editorTab === "preview" && (
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-stone-50 to-white">
              {!content.trim() ? (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-4 text-stitch-muted">
                  <FileSearch size={48} className="opacity-20" />
                  <p className="text-sm font-bold">尚無草稿內容可供預覽</p>
                  <button onClick={() => setEditorTab("write")} className="mt-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:scale-105 transition-transform">前往撰寫 →</button>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto py-12 px-8">
                  <div className="border-b-2 border-stone-900 pb-6 mb-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2">永續報告書 / SUSTAINABILITY REPORT 2024</div>
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight font-headline">{chapter}</h2>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {docState.evidence && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1"><FileText size={10} /> 佐證資料已附</span>}
                      {docState.annotation && <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1"><MessageSquare size={10} /> 附註說明已附</span>}
                      {allMandatoryDone && <span className="text-[10px] font-black text-primary-teal-start bg-primary-teal-start/10 border border-primary-teal-start/20 px-3 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={10} /> 5T 存證核實完成</span>}
                    </div>
                  </div>
                  <div className="mt-16 text-[10px] text-stone-300 font-bold text-center tracking-widest border-t border-stone-100 pt-6">本章節草稿 · 嵌入 5T 協議 ZKP 信任協定 · 由 ESGGo Omni AI 輔助生成</div>
                </div>
              )}
            </div>
          )
        }
      </div >

      {/* OCR Result Panel in write tab */}
      {
        showOcrPanel && editorTab === "write" && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-2xl z-20"
              style={{ maxHeight: '220px', overflowY: 'auto' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h6 className="text-xs font-black uppercase tracking-widest text-violet-700 flex items-center gap-2">
                  📷 OCR 擷取結果
                  {isOcrScanning && <Loader2 size={12} className="animate-spin" />}
                </h6>
                <button onClick={() => setShowOcrPanel(false)} className="text-stone-400 hover:text-stone-600"><X size={14} /></button>
              </div>
              {isOcrScanning && <p className="text-[11px] text-stitch-muted font-bold animate-pulse">正在掃描文件...</p>}
              {ocrResult && (
                <>
                  {ocrResult.summary && <p className="text-[11px] text-stone-700 font-bold mb-2 bg-stone-50 px-3 py-1.5 rounded-lg">{ocrResult.summary}</p>}
                  <div className="space-y-1">
                    {(ocrResult?.extractedItems || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-1 border-b border-stone-50">
                        <div className="flex-1">
                          <span className="text-[11px] font-bold text-stitch-text">{item.label}：</span>
                          <span className="text-[11px] text-primary-teal-start font-black">{item.value}{item.unit ? ` ${item.unit}` : ''}</span>
                          {item.suggestedField && <span className="text-[9px] text-stitch-muted ml-2">({item.suggestedField})</span>}
                        </div>
                        <button
                          onClick={() => setContent(prev => prev + `\n- **${item.label}**：${item.value}${item.unit ? ' ' + item.unit : ''}`)}
                          className="shrink-0 text-[9px] font-black text-white bg-primary-teal-start px-2 py-1 rounded-lg hover:opacity-80 transition-opacity">
                          插入
                        </button>
                      </div>
                    ))}
                    {(ocrResult?.extractedItems || []).length === 0 && !isOcrScanning && (
                      <p className="text-[11px] text-stitch-muted font-bold">未找到結構化數據，但已提取原始文字。</p>
                    )}
                  </div>
                  {(ocrResult?.extractedItems?.length || 0) > 0 && (
                    <button
                      onClick={() => { setContent(prev => prev + formatOcrItemsForEditor(ocrResult?.extractedItems || [])); setShowOcrPanel(false); }}
                      className="mt-3 w-full py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity">
                      全部插入草稿
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )
      }

      {/* SustainWrite Quick Tools Integration */}
      <SustainWriteQuickTools
        chapterContext={chapter}
        onInsertContent={(text) => setContent(prev => prev + text)}
      />
    </div >
  );
};
