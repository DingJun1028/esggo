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
  Settings,
  Library,
  Globe,
  Compass,
  Quote
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
import { AITierSwitcher } from "@/components/ui/ai-tier-switcher";
import { useOmniSkills } from "@/hooks/use-omni-skills";
import { getRequiredDocs, RequiredDoc } from "@/lib/data/chapter-required-docs";
import { extractDocumentData, formatOcrItemsForEditor, OcrResult } from "@/lib/services/ocr-service";
import { ConfidenceHeatmap } from "@/components/wizard/confidence-heatmap";
import { runReportChainFlow, ThinkingNode, BENCHMARK_DATA, IndustryType } from "@/lib/services/report-chain-flow";
import { useWizardSession, WizardStep } from "@/hooks/use-wizard-session";
import { MECEMatrixOverlay } from "@/components/wizard/mece-matrix-overlay";
import { ImpactAnalysisSidebar, ImpactItem } from "@/components/wizard/impact-analysis-sidebar";
import { ExternalAdapter } from "@/lib/services/external-adapter";
import { AuditVaultView } from "@/components/views/audit-vault-view";
import { AuditVerificationPanel } from "@/components/wizard/audit-verification-panel";
import { traceImpacts } from "@/lib/services/impact-tracer-service";

import { EvidenceItem } from "@/lib/types/ncb-types";
import { AlignmentEngine } from "@/components/wizard/alignment-engine";
import { ChapterEditor } from "@/components/wizard/chapter-editor-panel";
import { IndicatorLibraryPanel } from "@/components/wizard/indicator-library-panel";
import { ScopePanel } from "@/components/wizard/scope-panel";
import { EvidenceUploadPanel } from "@/components/wizard/evidence-upload-panel";
import { useCreateEvidence } from "@dataconnect/generated/react";
import { EsgPdfDownloadButton } from "@/lib/services/esg-pdf-report";


interface ChapterAttachment {
  fileName: string;
  uploadedAt: string;
}

interface ChapterDocState {
  submitted: Record<string, boolean>; // docId -> submitted
  evidence?: ChapterAttachment | undefined;        // 佐證資料
  annotation?: ChapterAttachment | undefined;      // 附註說明
}

// --- Mock Data ---

const STEPS: { id: WizardStep; label: string; subLabel: string; icon: any }[] = [
  { id: "scope", label: "Discovery", subLabel: "Boundary & Disclosure Scope", icon: Compass },
  { id: "evidence", label: "Evidence", subLabel: "Diagnostic Proof Registry", icon: ShieldCheck },
  { id: "alignment", label: "Alignment", subLabel: "GRI 2024 Intelligent Mapping", icon: Layers },
  { id: "writing", label: "Studio", subLabel: "AI Collaborative Synthesis", icon: BookOpen },
  { id: "verification", label: "Seal", subLabel: "Final Audit & Manifest", icon: Lock },
  { id: "export", label: "Complete", subLabel: "Journey Finalized", icon: Download },
];

export const getChapterData = (chapter: string) => {
  const c = chapter.toLowerCase();

  if (c.includes("1.01") || c.includes("經營者")) {
    return {
      why: "這是 ESG 揭露的關鍵組成部分，向投資人展現企業由上而下的永續決心 (GRI 2-22)。",
      what: "包含高層對於氣候風險的承諾，及下一年度的核心永續發展戰略目標。",
      how: "第一人稱視角撰寫，語氣莊重且堅定。務必連結到最新的 TCFD 或實績數據。",
      sources: ["歷年致股東報告書", "董事會決議"],
    };
  }

  if (c.includes("環境面") || c.includes("溫室氣體") || c.includes("氣候")) {
    return {
      why: "符合 GRI 305/TCFD 規範，是機構投資人評估實體氣候風險與轉型風險的關鍵。",
      what: "具體涵蓋 Scope 1 (直接), Scope 2 (間接) 及 Scope 3 (價值鏈) 之碳排強度。",
      how: "1. 確保數字附有查證聲明或 5T 存證。\n2. 描繪減碳路徑與基準年比較。\n3. 使用 Omni AI 自動換算。",
      sources: ["ISO 14064 查證報告", "ERP 能源管理數據"],
    };
  }

  if (c.includes("治理") || c.includes("governance")) {
    return {
      why: "優良治理是企業韌性的最後防線，對應 GRI 2-9 至 2-21 治理結構揭露。",
      what: "揭露董事會多元性、獨立性、風險管理機制及反貪腐政策 (GRI 205)。",
      how: "1. 呈現董事長與 CEO 指標分離狀態。\n2. 列出風險委員會的開會次數與重點。",
      sources: ["公司章程", "風險管理辦法"],
    };
  }

  return {
    why: "滿足重大議題矩陣之要求，確保向關切此議題的利害關係人做出有效回應 (GRI 3-1)。",
    what: "描述管理方針 (GRI 3-3) 與對應的具體績效數據，並包含過往三年的趨勢變化。",
    how: "強烈建議利用 5T 協議存證功能，勾稽相關的 PDF 憑證或單據，以強化聲明可信度。",
    sources: ["NCBDB 存證資料庫", "利害關係人問卷分析"],
  };
};


;

const phaseShiftVariants = {
  initial: { opacity: 0, scale: 0.94, filter: "blur(15px)", y: 20 },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 },
  exit: { opacity: 0, scale: 1.06, filter: "blur(15px)", y: -20 }
};

const OperationalHUD = ({ exp, wordCount, impact }: { exp: number, wordCount: number, impact: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[400]"
  >
    <div className="editorial-glass rounded-[32px] p-2 pr-8 flex items-center gap-8 shadow-2xl">
      <div className="flex items-center gap-4 bg-primary/5 rounded-2xl p-2 pl-4 border border-primary/10">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg">
          <Trophy size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none">Global Rank</span>
          <span className="text-sm font-black text-primary tracking-tight">S-Class Author</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-stitch-muted uppercase tracking-[0.2em]">Total EXP</span>
          <span className="text-sm font-black text-primary-teal-start tabular-nums">{exp.toLocaleString()}</span>
        </div>
        <div className="w-px h-8 bg-outline-variant" />
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-stitch-muted uppercase tracking-[0.2em]">Live Words</span>
          <span className="text-sm font-black text-on-surface tabular-nums">{wordCount.toLocaleString()}</span>
        </div>
        <div className="w-px h-8 bg-outline-variant" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-stitch-muted uppercase tracking-[0.2em] mb-1">Impact Factor</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={cn("w-1.5 h-3 rounded-full", i <= Math.ceil(impact / 20) ? "bg-primary shadow-[0_0_8px_rgba(0,51,37,0.3)]" : "bg-outline-variant/30")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

function ESGReportWizardComponent() {
  const { savedDrafts, setSavedDrafts, setActiveTab } = useAppContext();
  const [briefingStatus, setBriefingStatus] = useState("AI 引擎待命中。準備整合您的永續實績數據。");
  const { gainExp } = useOmniSkills();

  // Wizard Session (Firestore Persistence) - Source of truth
  const {
    session: wizardSession,
    updateStep,
    updateActiveChapter,
    updateChapterWordCount,
    updateEvidenceList,
    logChapterExit,
    resetSession
  } = useWizardSession();

  // Map session state to local variables for easier use
  const currentStep = (wizardSession.currentStep || "scope") as WizardStep;
  const activeNote = wizardSession.activeChapter || ESG_STRUCTURE[0]?.items?.[0]?.title || "未命名章節";

  const [activeNoteContent, setActiveNoteContent] = useState("");
  const [showBriefing, setShowBriefing] = useState(false);
  const [showDrThoth, setShowDrThoth] = useState(false);
  const [materialityIssues, setMaterialityIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const evidenceList = wizardSession.evidenceList || [];
  const setEvidenceList = updateEvidenceList;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  // --- Keyboard UX Navigation --- //
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Right Arrow -> Next Phase
      if ((e.metaKey || e.ctrlKey) && e.key === "ArrowRight") {
        e.preventDefault();
        const idx = STEPS.findIndex(s => s.id === currentStep);
        if (idx < STEPS.length - 1) updateStep(STEPS[idx + 1]?.id || "export");
      }
      // Cmd/Ctrl + Left Arrow -> Previous Phase
      if ((e.metaKey || e.ctrlKey) && e.key === "ArrowLeft") {
        e.preventDefault();
        const idx = STEPS.findIndex(s => s.id === currentStep);
        if (idx > 0) updateStep(STEPS[idx - 1]?.id || "scope");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, updateStep]);

  // --- Impacts State ---
  const [isImpactSidebarOpen, setIsImpactSidebarOpen] = useState(false);
  const [impacts, setImpacts] = useState<ImpactItem[]>([]);

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const CurrentStepIcon = STEPS[currentStepIndex]?.icon || Layers;

  // Firebase Data Connect Mutation
  const { mutateAsync: createEvidence } = useCreateEvidence();

  // Real-time Impact Tracing (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const detected = traceImpacts(savedDrafts as Record<string, { content: string; lastModified: number; status?: string }>);
      setImpacts(detected);
    }, 1000); // 1s debounce
    return () => clearTimeout(timer);
  }, [savedDrafts]);

  // --- HUD Analytics ---
  const totalWordCount = wizardSession.totalWordCount || 0;
  const totalChapters = ESG_STRUCTURE.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedChapters = Object.values(wizardSession.chapterProgress || {}).filter(p => (p as any).status === 'completed' || (p as any).status === 'drafting').length;
  const pct = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  // Load Initial Data
  useEffect(() => {
    async function init() {
      try {
        const issues = await fetchMaterialityIssues();
        setMaterialityIssues(issues);

        let hasSavedIssues = false;
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("esggo_wizardProgress");
          if (saved) {
            try {
              const progress = JSON.parse(saved);
              if ((progress?.selectedIssues?.length || 0) > 0) hasSavedIssues = true;
            } catch (e) { }
          }
        }

        // Only set default if no issues selected
        if ((issues?.length || 0) > 0 && !(selectedIssues?.length || 0)) {
          setSelectedIssues([issues[0]?.id || "default"]);
        }
      } catch (err) {
        console.error("Failed to fetch issues", err);
      }
    }
    init();
  }, [selectedIssues?.length]);

  const handleSaveNote = useCallback((chapter: string, content: string) => {
    setSavedDrafts((prev: any) => ({
      ...prev,
      [chapter]: {
        content: content,
        lastUpdated: new Date().toISOString(),
        status: "modified"
      }
    }));
  }, [setSavedDrafts]);

  const memoizedSetBriefingStatus = useCallback((status: string) => {
    setBriefingStatus(status);
    setShowBriefing(true);
  }, []);
  const memoizedOnWordCountChange = useCallback((id: string, count: number) => updateChapterWordCount(id, count), [updateChapterWordCount]);
  const memoizedOnChapterExit = useCallback((id: string, dur: number, bef: number, aft: number) => logChapterExit(id, dur, bef, aft), [logChapterExit]);

  const triggerFileUpload = (id: string) => {
    setActiveUploadId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      // Set status to scanning
      setEvidenceList((prev: EvidenceItem[]) => prev.map(item =>
        item.id === activeUploadId ? {
          ...item,
          status: "scanning",
          explanation: `正在掃描「${file.name}」，透過 5T 協議進行 ZKP 封裝...`,
        } : item
      ));

      try {
        const { extractDocumentData, formatOcrItemsForEditor } = await import('@/lib/services/ocr-service');
        const result = await extractDocumentData(file);

        if (result.success) {
          setEvidenceList((prev: EvidenceItem[]) => prev.map(item =>
            item.id === activeUploadId ? {
              ...item,
              status: "uploaded",
              file: file.name,
              explanation: `AI 已完成「${file.name}」核對。信心指數：${result.extractedItems.some(i => i.confidence === 'low') ? '⚠️ 部分區域低信心' : '✅ 高度可信'}`,
            } : item
          ));

          // If there's a chart, suggest it
          if (result.chartStructure) {
            setBriefingStatus(`📊 偵測到圖表結構：${result.chartStructure.insight}。建議將其轉化為數據圖。`);
          }

          // Auto-insert summary into active chapter if it's high confidence
          if (result.summary && currentStep === 'writing') {
            const ocrText = formatOcrItemsForEditor(result.extractedItems);
            // We could setContent here, but usually safer to notify
            setBriefingStatus(`已於「${file.name}」成功提取數據：${result.summary}`);
          }

          // --- FDC Database Insert Trigger --- //
          try {
            await createEvidence({
              title: file.name,
              content: result.summary || "No summary extracted.",
              source: "OCR Upload",
              confidenceScore: result.extractedItems.some(i => i.confidence === 'low') ? 0.6 : 0.95
            });
            toast.success("證據已安全存入 PostgreSQL");
          } catch (dbError) {
            console.error("Data Connect SDK Execution Error:", dbError);
          }

        } else {
          throw new Error(result.error);
        }
      } catch (err: any) {
        setBriefingStatus(`❗ OCR 擷取失敗: ${err.message}`);
        setEvidenceList((prev: EvidenceItem[]) => prev.map(item =>
          item.id === activeUploadId ? { ...item, status: "pending", explanation: "掃描失敗，請重試" } : item
        ));
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setActiveUploadId(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "alignment":
        return <AlignmentEngine />;

      case "scope":
        return (
          <ScopePanel
            materialityIssues={materialityIssues}
            selectedIssues={selectedIssues}
            setSelectedIssues={setSelectedIssues}
          />
        );

      case "evidence":
        return <EvidenceUploadPanel />;

      case "writing": {
        const draftedChapterCount = Object.values(savedDrafts || {}).filter(d => ((d as any)?.content?.trim()?.length || 0) > 0).length;
        const totalChapterCount = (ESG_STRUCTURE || []).reduce((acc, g) => acc + (g?.items?.length || 0), 0);
        const pct = Math.round((draftedChapterCount / totalChapterCount) * 100);

        const FRAMEWORKS = [
          { id: "gri", icon: <Library size={20} />, label: "GRI Universal" },
          { id: "sasb", icon: <Database size={20} />, label: "SASB Index" },
          { id: "tcfd", icon: <Globe size={20} />, label: "TCFD Climate" },
          { id: "csrd", icon: <Layers size={20} />, label: "CSRD/ESRS" },
          { id: "5t", icon: <ShieldCheck size={20} />, label: "5T Audit Vault" },
        ];

        return (
          <div className="flex h-[calc(100vh-16rem)] min-h-[700px] bg-white border border-outline-variant rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5">
            {/* Pane 1: Framework Sidebar (Icons) */}
            <div className="w-[72px] bg-white border-r border-outline-variant/30 flex flex-col items-center py-6 gap-6 shrink-0 z-20">
              {FRAMEWORKS.map(fw => (
                <button
                  key={fw.id}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative",
                    fw.id === "gri"
                      ? "bg-primary-teal-start text-white shadow-[0_8px_20px_rgba(45,212,191,0.3)] hover:scale-105"
                      : "bg-surface-container-lowest text-on-surface-variant/60 border border-outline-variant/30 hover:bg-surface-container-low hover:text-primary transition-all"
                  )}
                >
                  {fw.icon}
                  <div className="absolute left-14 px-2 py-1 bg-on-surface text-surface text-[9px] font-black rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 uppercase tracking-widest shadow-lg">
                    {fw.label}
                  </div>
                </button>
              ))}
              <div className="mt-auto">
                <button className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-on-surface-variant/60 border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-low hover:text-primary transition-all">
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Pane 2: Chapter Tree - Premium Editorial Feel */}
            <div className="w-[340px] border-r border-outline-variant/30 flex flex-col bg-white overflow-hidden shrink-0">
              <div className="p-8 border-b border-outline-variant/20 bg-stone-50/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.3em] flex items-center gap-2 font-label">
                    <Layers size={18} className="text-primary-teal-start" />
                    核對進度 Registry
                  </h3>
                  <Badge className="bg-primary-teal-start/10 text-primary-teal-start border-primary-teal-start/20 text-[10px] font-black font-label px-3 py-1">
                    {pct}% 完稿
                  </Badge>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className="h-full bg-primary-teal-start shadow-[0_0_12px_rgba(45,212,191,0.4)]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                {ESG_STRUCTURE.map(group => (
                  <div key={group.category} className="space-y-4">
                    <h5 className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 px-2 flex items-center gap-2">
                      <div className="w-1 h-1 bg-stone-300 rounded-full" />
                      {group.category}
                    </h5>
                    <div className="space-y-1 relative">
                      {group.items.map(chapter => {
                        const hasDraft = !!(savedDrafts as any)[chapter.title]?.content?.trim();
                        const isActive = activeNote === chapter.title;
                        return (
                          <button
                            key={chapter.id}
                            onClick={() => updateActiveChapter(chapter.title)}
                            className={cn(
                              "w-full text-left px-4 py-3.5 rounded-2xl text-[11px] transition-all font-black flex items-center justify-between gap-3 relative z-10 group",
                              isActive
                                ? "bg-stone-900 text-white shadow-massive scale-[1.02]"
                                : "text-stone-500 hover:bg-stone-100"
                            )}
                          >
                            <div className="flex items-center gap-3 truncate">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0 transition-opacity",
                                hasDraft ? "bg-primary-teal-start opacity-100" : "bg-stone-300 opacity-30"
                              )} />
                              <span className="truncate uppercase tracking-tight">{chapter.title}</span>
                            </div>
                            {isActive && (
                              <Sparkles size={12} className="text-primary-teal-start animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pane 3: Content Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-stone-50/10 h-full">
              <ChapterEditor
                key={activeNote}
                chapter={activeNote}
                initialContent={(savedDrafts as any)[activeNote]?.content || ""}
                onSave={(content) => handleSaveNote(activeNote, content)}
                setBriefingStatus={memoizedSetBriefingStatus}
                onWordCountChange={memoizedOnWordCountChange}
                onChapterExit={memoizedOnChapterExit}
              />
            </div>
          </div>
        );
      }

      case "export": {
        return (
          <div className="flex-1 overflow-y-auto bg-stone-50/30 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
            </motion.div>
            <AuditVaultView
              reportData={wizardSession}
              onExport={() => {
                gainExp(200, "Report Exported and Locked");
                toast.success("獲得 200 點 Omnic經驗值！記憶庫擴展！");
              }}
            />
          </div>
        );
      }

      case "verification": {
        const fullReportContent = Object.entries((savedDrafts || {}) as Record<string, any>)
          .map(([title, data]) => `## ${title}\n\n${data.content || ""}`)
          .join("\n\n");

        return (
          <div className="space-y-8">
            <AuditVerificationPanel
              reportId={`wizard-session-${wizardSession.userId}`}
              reportTitle={`${wizardSession.activeChapter || "企業永續報告"} - 2026`}
              reportContent={fullReportContent}
            />
            <div className="flex justify-center pt-12 border-t border-outline-variant/30">
              <div className="bg-white p-12 rounded-[48px] border border-outline-variant shadow-2xl text-center max-w-2xl relative overflow-hidden group">
                {/* Subtle success background */}
                <div className="absolute inset-0 bg-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100">
                    <Download className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-black text-on-surface mb-4 font-headline uppercase leading-none">報告已就緒 Ready to Lock</h3>
                  <p className="text-base text-on-surface-variant mb-10 font-bold leading-relaxed font-body">
                    您已完成所有的核閱步驟。現在可以下載最終版的永續報告書 PDF，或將其存回存證金庫以獲取 ZKP 數位證書。
                  </p>
                  <EsgPdfDownloadButton
                    title={`${wizardSession.activeChapter || "企業永續報告"} - 2026`}
                    metrics={{
                      totalEmissions: 2090.7,
                      scope1Emissions: 1250.5,
                      scope2Emissions: 840.2,
                      energyConsumption: 56000,
                      waterUsage: 1200,
                      scope3Emissions: 0,
                      hazardousWaste: 0,
                      nonHazardousWaste: 0,
                      femaleManagementPct: 0,
                      trainingHoursPerEmployee: 0
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };
  return (
    <div className="max-w-[1600px] mx-auto px-10 py-12 space-y-16 pb-48 relative min-h-screen bg-background selection:bg-primary/20">
      <MECEMatrixOverlay
        isOpen={showMatrix}
        onClose={() => setShowMatrix(false)}
        progress={Object.fromEntries(
          Object.entries(savedDrafts || {}).map(([id, d]) => [id, (d as any)?.content?.length ? 100 : 0])
        )}
      />

      {/* 1. Progress Ribbon */}
      <div className="fixed top-0 left-0 w-full h-[6px] z-[300] bg-surface-container overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          className="h-full bg-primary shadow-[0_0_20px_rgba(0,51,37,0.3)]"
        />
        {/* Prismatic Shimmer Overlay */}
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-on-primary/10 to-transparent w-1/2"
        />
      </div>

      {/* 2. Elegant Header */}
      <header className="flex flex-col gap-12 border-b border-outline-variant/30 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg">
                <CurrentStepIcon size={24} />
              </div>
              <div className="flex flex-col -gap-1">
                <span className="text-[11px] font-black text-primary/40 uppercase tracking-[0.4em] font-sans">Step {(currentStepIndex + 1).toString().padStart(2, '0')} of {STEPS.length.toString().padStart(2, '0')}</span>
                <h1 className="text-6xl font-headline font-black text-primary tracking-tighter uppercase leading-[0.8]">
                  {STEPS[currentStepIndex]?.label}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-6 border-l-2 border-stone-200 pl-8">
              <p className="text-xl font-bold text-stone-500 max-w-xl leading-snug font-body italic">
                {STEPS[currentStepIndex]?.subLabel} — 為組織引領下一個永續披露高峰
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentStepIndex < 3 && (
              <button
                onClick={() => {
                  toast.success("🚀 Auto-Pilot 啟動！已自動為您配置最佳框架與雙重重大性議題，直接進入撰寫工作站！", { duration: 4000 });
                  updateStep("studio");
                }}
                className="px-6 py-4 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 font-black text-[11px] uppercase tracking-widest hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm flex items-center gap-2"
              >
                <Zap size={14} /> 一鍵快進至 Studio
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {STEPS.map((s, idx) => {
            const isActive = s.id === currentStep;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={s.id}
                onClick={() => updateStep(s.id)}
                className="group relative flex flex-col gap-3 text-left w-full focus:outline-none"
              >
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-700 w-full",
                  isActive ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]" :
                    isCompleted ? "bg-emerald-500/40" : "bg-outline-variant/30"
                )} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                  isActive ? "text-primary" : "text-on-surface-variant/40 group-hover:text-on-surface-variant"
                )}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      {/* 3. Operational Insights & Telemetry */}
      <div className="flex flex-wrap items-center gap-6">
        <Badge className="px-6 py-3 text-[10px] font-black flex items-center gap-3 bg-white border-outline-variant/30 text-on-surface-variant uppercase tracking-[0.2em] rounded-2xl shadow-minimal">
          <BookOpen className="w-4 h-4 text-primary" />
          章節統計: {(ESG_STRUCTURE || []).reduce((acc, g) => acc + (g?.items?.length || 0), 0)} 個
        </Badge>
        <Badge className="px-6 py-3 text-[10px] font-black flex items-center gap-3 bg-white border-outline-variant/30 text-on-surface-variant uppercase tracking-[0.2em] rounded-2xl shadow-minimal">
          <History className="w-4 h-4 text-primary" />
          目前進度: {Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}% 完成
        </Badge>
        <div className="flex-1" />
        <button
          onClick={() => setShowMatrix(true)}
          className="px-6 py-3 bg-white text-on-surface-variant border border-outline-variant/30 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-primary hover:text-on-primary hover:border-primary shadow-minimal"
        >
          <LayoutGrid size={16} /> Matrix Overview
        </button>
      </div>

      {/* 4. Journey Phase Progress Indicator */}
      <div className="space-y-8 bg-white/50 p-10 rounded-[40px] border border-outline-variant/20 backdrop-blur-sm">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-xs font-black text-primary/60 uppercase tracking-[0.3em] font-sans">Current Phase</h2>
            <p className="text-4xl font-headline font-black text-on-surface tracking-tighter uppercase">
              Phase {currentStepIndex + 1}: {STEPS[currentStepIndex]?.label}
            </p>
          </div>
          <div className="text-right">
            <div className="text-7xl font-headline font-black text-primary/10 tracking-tighter leading-none mb-2">
              {((currentStepIndex + 1) / STEPS.length * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-primary font-black uppercase tracking-widest font-sans">
              System Sync: Live
            </div>
          </div>
        </div>

        <div className="relative h-2 bg-outline-variant/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
          />
        </div>
      </div>

      {/* 5. Fixed Navigation Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full p-8 bg-white/80 backdrop-blur-xl border-t border-outline-variant/30 z-[150] flex justify-center pointer-events-none">
        <div className="max-w-7xl w-full flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4 text-on-surface-variant/40">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Session: Live</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                const prevStep = STEPS[currentStepIndex - 1]?.id;
                if (prevStep) updateStep(prevStep);
              }}
              disabled={currentStepIndex === 0}
              className="px-10 py-5 rounded-3xl border border-outline-variant font-black text-xs uppercase tracking-widest text-on-surface-variant hover:bg-white hover:text-on-surface transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Previous Phase
            </button>
            <button
              onClick={() => {
                const nextStep = STEPS[currentStepIndex + 1]?.id;
                if (nextStep) updateStep(nextStep);
              }}
              disabled={currentStepIndex === STEPS.length - 1}
              className="px-12 py-5 rounded-3xl bg-black text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-stone-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed group flex items-center gap-3 active:scale-95 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] rounded-3xl" />
              Advance Phase
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Main Content Area */}
      <div className="min-h-[600px] max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start transition-all duration-500">
          <div className={cn(
            "transition-all duration-500",
            showDrThoth ? "lg:col-span-8" : "lg:col-span-12"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={phaseShiftVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showDrThoth && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className="lg:col-span-4 sticky top-8"
              >
                <div className="bg-surface-container-low rounded-[48px] shadow-massive overflow-hidden border border-outline-variant/30 ring-1 ring-black/5 relative group">
                  {/* Subtle Grain Background */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

                  <div className="p-10 bg-primary border-b border-primary/10 flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-3xl bg-surface-container flex items-center justify-center text-primary shadow-glass">
                        <BrainCircuit size={36} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-on-primary tracking-[0.3em] uppercase font-label">ESG_AI_ORACLE</h4>
                        <p className="text-[10px] font-black text-on-primary/40 uppercase tracking-widest mt-1">Intelligence Protocol v4.0</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-on-primary/10 rounded-full border border-on-primary/10 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-on-primary animate-ping" />
                      <span className="text-[10px] font-black text-on-primary uppercase tracking-widest font-label">Ready</span>
                    </div>
                  </div>

                  <div className="p-10 space-y-10 relative z-10">
                    <div className="bg-surface-container-highest/50 rounded-[40px] p-8 border border-outline-variant/30 space-y-6 relative overflow-hidden">
                      <Quote className="absolute top-4 right-4 text-primary/5 w-16 h-16 pointer-events-none" />
                      <p className="text-base font-medium text-on-surface leading-relaxed font-body italic relative z-10">
                        &ldquo;{({
                          scope: '我正在監測您的進度。建議優先盤點高價值重大性議題，再尋找其底層的 ESG 數據支撐。',
                          evidence: '存證模組正在運行中。請確保每份文件均已經過第三方核驗，並符合 GRI 2-5 第三方確信標準。',
                          alignment: '對標分析中。正在檢查您的報告架構是否符合選定的披露框架。',
                          writing: `目前您正在撰寫「${activeNote}」。請注意新版 GRI 3-3 對於重大議題管理方針的具體檢測指標要求。`,
                          export: '報告草稿封裝階段。請確認所有章節均已有內容，否則下載的 PDF 將包含空白項目。',
                          verification: '進入最終審核階段。正在執行數位指紋驗證與鏈上存證核對。'
                        } as Record<WizardStep, string>)[currentStep]}&rdquo;
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h5 className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em] font-label px-4 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,51,37,0.5)]" />
                        Strategic Protocols
                      </h5>
                      <div className="grid grid-cols-1 gap-4">
                        {(({
                          scope: ["優先選擇 7-10 個前瞻重大性議題", "確認報告邊界符合 GRI 2-3 定義", "SDGs 對標表建議涵蓋至少 5 項"],
                          evidence: ["按 E/S/G/D 分類檢查存證完整性", "溫室氣體清冊需第三方查證聲明書", "上傳文件建議保留原始檔來源驗證"],
                          alignment: ["確認重大議題與證據庫的一致性", "GRI 指標對標建議達成率 > 80%", "檢查是否有矛盾的數據聲明"],
                          writing: ["每章動詞使用第一人稱主詞", "包含定量 KPI 使內容更具說服力", "完成章節後請上傳必要單據"],
                          export: ["下載前提醒修改公司名稱及年度", "第三方確信意見書建議隨同附上", "PDF 檔建議使用 Acrobat DC 瀏覽"],
                          verification: ["確認所有數位簽章均為最新狀態", "檢查 ZKP 驗證鏈是否完整", "核對最後的審計日誌軌跡"]
                        } as Record<WizardStep, string[]>)[currentStep] || []).map((tip: string, i: number) => (
                          <button key={i} className="flex items-center gap-6 p-6 bg-surface-container-low border border-outline-variant/30 rounded-[32px] hover:bg-surface-container transition-all text-left group">
                            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors">
                              <ChevronRight size={18} />
                            </div>
                            <div>
                              <p className="text-on-surface font-black text-[13px] tracking-tight">{tip}</p>
                              <p className="text-[10px] font-black text-outline uppercase tracking-widest">Protocol Enforced</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Footer (Relative Flow) */}
      <div className="mt-8 max-w-7xl mx-auto flex justify-between items-center">
        <Button
          variant="wireframe"
          disabled={currentStep === "scope"}
          onClick={() => {
            const idx = STEPS.findIndex(s => s.id === currentStep);
            if (idx > 0) updateStep(STEPS[idx - 1]?.id || "scope");
          }}
          className="w-16 h-16 rounded-3xl bg-white border border-outline-variant shadow-lg flex items-center justify-center disabled:opacity-0 hover:border-primary transition-all p-0"
        >
          <ChevronLeft size={32} strokeWidth={3} className="text-on-surface" />
        </Button>
        <Button
          disabled={currentStep === "export"}
          onClick={() => {
            const idx = STEPS.findIndex(s => s.id === currentStep);
            if (idx < STEPS.length - 1) updateStep(STEPS[idx + 1]?.id || "export");
          }}
          className="px-12 py-6 bg-stitch-text hover:bg-stone-800 text-white rounded-3xl font-black text-xl uppercase shadow-2xl disabled:opacity-0 active:scale-95 transition-all flex items-center gap-4 border border-outline-variant/30"
        >
          下一步 <ChevronRight size={24} strokeWidth={4} />
        </Button>
      </div>

      <DrThothBriefing
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        chapterTitle={activeNote}
        summary={briefingStatus}
        currentInsights={["數據準確度 99.9%", "建議參考領先同業之 5T 存證比例"]}
      />

      {/* Impact Analysis Sidebar */}
      <ImpactAnalysisSidebar
        isOpen={isImpactSidebarOpen}
        onClose={() => setIsImpactSidebarOpen(false)}
        impacts={impacts}
        onConfirm={(id: string) => {
          setImpacts((prev: ImpactItem[]) => prev.map((i: ImpactItem) => i.id === id ? { ...i, status: 'confirmed' } : i));
          setBriefingStatus("✅ 已採納聯動建議，數據同步完成。");
        }}
        onIgnore={(id: string) => {
          setImpacts((prev: ImpactItem[]) => prev.map((i: ImpactItem) => i.id === id ? { ...i, status: 'ignored' } : i));
        }}
        onSyncAll={() => {
          setImpacts((prev: ImpactItem[]) => prev.map((i: ImpactItem) => i.status === 'pending' ? { ...i, status: 'confirmed' } : i));
          setBriefingStatus("🚀 已批量同步所有關聯影響建議。");
        }}
      />

      {/* Floating Impact Reminder Ball - Enterprise Matte Edition */}
      <div className="fixed bottom-10 right-10 z-[55] flex flex-col items-end gap-4">
        <AnimatePresence>
          {(impacts || []).some((i: ImpactItem) => i.status === 'pending') && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="relative group cursor-pointer"
              onClick={() => setIsImpactSidebarOpen(true)}
            >
              <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-4 pl-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-4 transition-all hover:bg-white/60">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Impact_Alert</span>
                  <span className="text-xs font-black text-stitch-text">發現 {(impacts || []).filter((i: ImpactItem) => i.status === 'pending').length} 項數據連動建議</span>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary-gold/20 rounded-xl animate-pulse" />
                  <Zap size={20} className="text-primary-gold fill-primary-gold relative z-10" />
                </div>
              </div>
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-gold/40 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsImpactSidebarOpen(true)}
          className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl border transition-all relative overflow-hidden group",
            (impacts || []).some((i: ImpactItem) => i.status === 'pending')
              ? "bg-primary-gold border-primary-gold/20 text-white"
              : "bg-white border-stone-100 text-stone-300"
          )}
        >
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={80} className="absolute -bottom-4 -right-4 rotate-12" />
          </div>
          <Zap size={32} className={cn("relative z-10", (impacts || []).some((i: ImpactItem) => i.status === 'pending') && "animate-pulse")} />
          {(impacts || []).some((i: ImpactItem) => i.status === 'pending') && (
            <span className="absolute top-4 right-4 w-6 h-6 bg-white text-primary-gold text-[10px] font-black rounded-lg flex items-center justify-center shadow-xl">
              {(impacts || []).filter((i: ImpactItem) => i.status === 'pending').length}
            </span>
          )}
        </motion.button>
      </div>

      {currentStep === 'writing' && <OperationalHUD exp={12450} wordCount={totalWordCount} impact={pct} />}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
      />
    </div >
  );
};

export default ESGReportWizardComponent;
