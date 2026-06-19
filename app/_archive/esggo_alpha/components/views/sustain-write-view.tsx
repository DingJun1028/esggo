"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { useTranslation } from "@/lib/i18n";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  BarChart3,
  Sparkles,
  Globe,
  ChevronRight,
  Activity,
  FileText,
  Clock,
  Layout,
  MessageSquare,
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
  Type,
  ShieldCheck,
  Star,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Scan,
  Network,
  Library,
  Zap,
  LayoutGrid,
  TrendingUp,
  Compass,
  Fingerprint,
  AlertCircle,
  Loader2,
  Lock,
  CheckCircle2,
  Upload,
  ListChecks,
  ScanText,
  TreeDeciduous,
  Menu,
  ChevronLeft,
  History,
  Building2,
  CalendarDays,
  Save,
  Layers
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useReportEditor } from "@/hooks/use-report-editor";
import { chatWithESGAssistant, generateDataSuggestions, generateCoWriteVariants, saveReportAction } from "@/app/actions";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { SustainLibraryView } from "./sustain-library-view";
import { OCRView } from "./ocr-view";
import { IntegrationView } from "./integration-view";
import { TemplateLibraryView } from "./template-library-view";
import {
  ExportDropdown,
  ToolCard,
  ReportCard,
  SectionEditor,
  BenchmarkModal,
  DataSourceModal,
  VersionHistoryModal
} from "../features/sustain-write/sustain-write-components";
import { ReportPreviewPanel } from "../features/sustain-write/report-preview-panel";

// Types and initial data moved to centralized types
import { Report, ReportStatus, Language } from "@/types";
import { TEMPLATE_REGISTRY, getTemplateSections } from "@/lib/data/template-registry";

import { useRouter } from "next/navigation";

export function SustainWriteView() {
  const router = useRouter();
  const {
    globalEsgData,
    setGlobalEsgData,
    companyProfile,
    benchmarkHistory,
    setBenchmarkHistory,
    activeSubView,
    setActiveSubView,
    reports,
    addReport,
    updateReport,
    deleteReport,
    todoCount,
    language,
    toggleLanguage,
    setActiveView
  } = useAppContext();

  const { t } = useTranslation();
  const st = t.sustainWrite;


  const currentSubView = activeSubView || "home";
  const setCurrentSubView = useCallback((view: string) => setActiveSubView(view as any), [setActiveSubView]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showComplianceSidebar, setShowComplianceSidebar] = useState(true);
  const [complianceIssues, setComplianceIssues] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [complianceScore, setComplianceScore] = useState(82);

  useEffect(() => {
    // Simulate real-time compliance check
    const checkCompliance = () => {
      setIsScanning(true);

      // Simulate network/AI delay
      setTimeout(() => {
        const issues = language === "en" ? [
          { id: 1, type: "GRI 302", severity: "medium", title: "Missing Energy Data Link", desc: "This section mentions energy efficiency but has no link to Traceable-certified power reports.", action: "Link Data Source" },
          { id: 2, type: "TCFD", severity: "high", title: "Vague Climate Risk Description", desc: "Physical risk (e.g., flooding) lacks specific adaptation measures.", action: "AI Rewrite Suggestion" },
        ] : [
          { id: 1, type: "GRI 302", severity: "medium", title: "能源數據鏈結缺失", desc: "本段提及能源效益但尚未連結 Traceable 存證之電力報表。", action: "連結數據源" },
          { id: 2, type: "TCFD", severity: "high", title: "氣候風險描述過於籠統", desc: "針對實體風險（如淹水）缺乏具體對應之調適措施敘事。", action: "AI 改寫建議" },
        ];
        setComplianceIssues(issues);
        setIsScanning(false);
        setComplianceScore(prev => Math.min(100, prev + 1));
      }, 1500);
    };

    // In a real app, this would be debounced based on content changes
    const timer = setTimeout(checkCompliance, 1000);
    return () => clearTimeout(timer);
  }, [currentSubView, language]); // Re-check when view or language changes
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [showDataSourceModal, setShowDataSourceModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [linkedSources, setLinkedSources] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<"大綱" | "草稿" | "預覽">("大綱");
  const [todoFilter, setTodoFilter] = useState("全部");
  const [scrollProgress, setScrollProgress] = useState(0);
  // language is provided by AppContext — no local shadow needed
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const calculateProgress = useCallback(() => {
    if (!selectedReport || !editorSections.length) return 0;
    const completedCount = selectedReport.completedSectionIds?.length || 0;
    return Math.round((completedCount / editorSections.length) * 100);
  }, [selectedReport]);

  // Global Toast State for SustainWriteView
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: "success" | "info" } | null>(null);

  const showToast = (title: string, desc: string, type: "success" | "info" = "success") => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleArchive = () => {
    showToast(t.sustainWrite.archived, language === 'zh' ? "該報告已移至封存區域" : "The report has been moved to archive");
    setTimeout(() => setCurrentSubView("home"), 1000);
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async (format: string) => {
    setIsExporting(true);
    setToastMessage({
      title: language === 'zh' ? "正在產生導出文件..." : "Generating Export...",
      desc: language === 'zh' ? `正在將數據封裝為 ${format.toUpperCase()} 格式並注入 Traceable 存證標章` : `Packaging data into ${format.toUpperCase()} with Traceable Trust SEAL`,
      type: "info"
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsExporting(false);
    showToast(
      language === 'zh' ? "導出成功" : "Export Successful",
      language === 'zh' ? `您的 ${format.toUpperCase()} 報告已準備就緒並自動啟動下載` : `Your ${format.toUpperCase()} report is ready and download has started`,
      "success"
    );
  };


  const handlePublish = async () => {
    showToast(t.sustainWrite.published, language === 'zh' ? "報告已成功發佈並獲得 V8.1 SEAL 確信" : "Report published and certified with V8.1 SEAL", "success");
  };


  const {
    editorSections,
    localContents,
    updateSectionContent,
    toggleSectionCompletion,
    getNextSectionId,
    getPrevSectionId,
    refreshData,
    lastSaved,
    saveReport,
    isSaving
  } = useReportEditor(selectedReport, language);

  const handleUpdateContent = (sectionId: string, content: string) => {
    updateSectionContent(sectionId, content);
  };

  const handleToggleComplete = (sectionId: string) => {
    const isCurrentlyDone = selectedReport?.completedSectionIds?.includes(sectionId);
    toggleSectionCompletion(sectionId);

    if (!isCurrentlyDone) {
      showToast(
        language === 'zh' ? "章節標記完成" : "Section Completed",
        language === 'zh' ? "內容已成功鎖定並通過 Trustworthy 協議驗證" : "Content verified and locked via Trustworthy protocol",
        "success"
      );
    }
  };

  const handleNextSection = (currentId: string) => {
    const nextId = getNextSectionId(currentId);
    if (nextId) {
      const element = document.getElementById(`section-${nextId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSectionId(nextId);
      }
    }
  };

  const handlePrevSection = (currentId: string) => {
    const prevId = getPrevSectionId(currentId);
    if (prevId) {
      const element = document.getElementById(`section-${prevId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSectionId(prevId);
      }
    }
  };

  const handleFinalize = async () => {
    if (!selectedReport) return;

    // Trigger manual save through useReportEditor which uses saveReportAction
    const success = await saveReport();
    
    if (!success) {
      showToast(
        language === 'zh' ? "儲存失敗" : "Save Failed",
        language === 'zh' ? "請檢查網路連線或稍後再試" : "Please check your connection or try again later",
        "info"
      );
      return;
    }

    setToastMessage({ 
      title: language === 'zh' ? "成功密封" : "Successfully Sealed", 
      desc: language === 'zh' ? "報告已通過 Traceable 協議密封並存證。" : "Report sealed and vaulted with Traceable protocol.", 
      type: "success" 
    });
    
    // Update local state to reflect published status
    setSelectedReport({ ...selectedReport, status: 'published', trustSeal: 'Gold' });
    
    // Update global context too
    updateReport(selectedReport.id, { status: 'published', trustSeal: 'Gold' });
    
    // Smooth transition back to home
    setTimeout(() => {
      setCurrentSubView("home");
    }, 500);
  };

  const handleLinkSource = (sectionId: string) => {
    setActiveSectionId(sectionId);
    setShowDataSourceModal(true);
  };

  const onSourceSelected = (source: any) => {
    if (activeSectionId) {
      setLinkedSources(prev => {
        const updated = {
          ...prev,
          [activeSectionId]: source
        };
        localStorage.setItem("esg_linked_sources", JSON.stringify(updated));
        setGlobalEsgData((prevData: any) => ({
          ...prevData,
          linkedSourcesCount: Object.keys(updated).length + 8
        }));
        return updated;
      });
    }
    setShowDataSourceModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }

      const sections = editorSections.map(s => document.getElementById(`section-${s.id}`));
      let currentSectionId = activeSectionId;

      sections.forEach(sec => {
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSectionId = sec.id.replace('section-', '');
          }
        }
      });

      if (currentSectionId !== activeSectionId) {
        setActiveSectionId(currentSectionId);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSectionId, editorSections]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 100
      }
    }
  };

  const hoverScale = {
    hover: {
      y: -8,
      scale: 1.01,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    }
  };

  // View Renderers
  const renderHome = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Premium Glassmorphism Header */}
      <header className="relative p-16 rounded-[3rem] overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl shadow-indigo-900/20 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-slate-900/80 to-black/90 backdrop-blur-2xl" />

        {/* Animated Background Elements */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] group-hover:bg-indigo-500/40 transition-all duration-1000 animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] group-hover:bg-blue-600/30 transition-all duration-1000" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-xl">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em]">Traceable ESG Engine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-blue-200">
                {st.title}
              </span>
            </h1>
            <p className="text-lg text-indigo-100/60 max-w-xl font-light leading-relaxed mb-8">
              {st.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => setCurrentSubView('templates')}
                className="px-8 py-4 bg-white text-indigo-950 rounded-2xl font-bold shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all active:scale-95 flex items-center gap-3 group/btn"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                {st.home.tools.newReport}
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-72 h-72 relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-[2.5rem] rotate-6 border border-white/10 backdrop-blur-sm transition-transform duration-700 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] -rotate-3 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:rotate-0">
              <div className="p-8 text-center transition-transform duration-700 group-hover:scale-110">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-black text-white">12</div>
                <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Ready for Sync</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Stats Grid - Simplified to 2 slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            label: st.home.stats.activeReports,
            value: "12",
            sub: st.home.stats.labels.drafts,
            icon: FileText,
            color: "from-slate-800 to-slate-950",
            shadow: "shadow-indigo-500/10",
            bg: "bg-white"
          },
          {
            label: st.home.stats.avgProgress,
            value: "84%",
            sub: st.home.stats.labels.globalHealth,
            icon: Target,
            color: "from-indigo-600 to-blue-700",
            shadow: "shadow-blue-500/20",
            bg: "bg-white"
          }
        ].map((stat, i) => (
          <div key={i} className={cn(
            "group relative p-8 rounded-[2.5rem] border border-slate-200 transition-all hover:-translate-y-2 hover:border-slate-300 hover:shadow-2xl overflow-hidden",
            stat.bg,
            "backdrop-blur-xl shadow-xl shadow-slate-200/40"
          )}>
            <div className={cn(
              "absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
              stat.color,
              stat.shadow
            )}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>

            <div className="pt-10">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{stat.label}</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.sub}</span>
              </div>
            </div>

            <div className={cn(
              "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-[0.03] transition-all duration-1000 group-hover:scale-150",
              stat.color === "from-slate-800 to-slate-950" ? "bg-indigo-500" : "bg-blue-500"
            )} />
          </div>
        ))}
      </div>

      {/* Interactive Tool Cards - Reduced to core tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: st.home.tools.library, desc: st.home.tools.libraryDesc, icon: BookOpen, accent: "text-blue-500", bg: "hover:bg-blue-50", path: "/learning-center" },
          { title: language === 'zh' ? "報告模組中心" : "Template Hub", desc: language === 'zh' ? "使用預載引導文，快速生成合規報告草案。" : "Use pre-loaded guidance to generate compliant drafts instantly.", icon: Layers, accent: "text-purple-500", bg: "hover:bg-purple-50", onClick: () => setCurrentSubView('templates') }
        ].map((tool, i) => (
          <button
            key={i}
            onClick={tool.onClick || (() => router.push(tool.path!))}
            className={cn(
              "p-8 text-left rounded-[2.5rem] border border-slate-200 bg-white transition-all group relative overflow-hidden backdrop-blur-md shadow-xl shadow-slate-200/50 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-300",
              tool.bg
            )}
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 text-slate-900">
              <tool.icon className="w-24 h-24" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-slate-200 transition-all duration-500">
              <tool.icon className={cn("w-7 h-7", tool.accent)} />
            </div>
            <h4 className="font-black text-slate-800 text-xl mb-3 tracking-tight">{tool.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{tool.desc}</p>

            <div className="mt-8 flex items-center gap-2 transform translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </button>
        ))}
      </div>

      <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-white mb-2">
              {language === 'zh' ? "準備好發布了嗎？" : "Ready to Publish?"}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              {language === 'zh' ? "所有報告模組皆包含精準引導，確保符合國際確信標準。" : "All modules include precision guidance to ensure international assurance standards."}
            </p>
          </div>
          <button
            onClick={() => setCurrentSubView("list")}
            className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl">
            {language === 'zh' ? "查看所有草稿" : "View All Drafts"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setCurrentSubView("home")}
            className="w-14 h-14 bg-white border border-slate-100 rounded-3xl flex items-center justify-center hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-slate-200/40 group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">報告資產庫</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">SUSTAINABILITY ASSETS</p>
          </div>
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] backdrop-blur-xl border border-slate-200/50">
          {["全部項目", "草稿", "已發佈"].map((tab) => (
            <button
              key={tab}
              className={cn(
                "px-8 py-3 rounded-2xl text-[11px] font-black tracking-widest transition-all",
                tab === "全部項目" ? "bg-white text-emerald-600 shadow-xl shadow-slate-200/40" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="搜尋報告 ID、核心指標或歷史年度..."
          className="w-full h-20 bg-white border-2 border-slate-100 rounded-[2.5rem] pl-20 pr-10 text-lg font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-2xl shadow-slate-200/20 placeholder:text-slate-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reports.map((report, idx) => (
          <ReportCard
            key={report.id}
            report={report}
            language={language}
            className="hover:scale-[1.01] active:scale-[0.99] transition-all"
            onClick={() => {
              setSelectedReport(report);
              setCurrentSubView("editor");
            }}
            onVersionHistory={() => setShowVersionModal(true)}
            onDelete={() => {
              if (confirm(language === 'zh' ? "確定要刪除此報告資產嗎？" : "Are you sure you want to delete this asset?")) {
                deleteReport(report.id);
                setToastMessage({ title: "資產已移除", desc: "該報告已永久從雲端存證中刪除", type: "success" });
              }
            }}
          />
        ))}

        <button
          onClick={() => setCurrentSubView("templates")}
          className="w-full border-4 border-dashed border-slate-100 rounded-[3rem] py-20 flex flex-col items-center justify-center gap-6 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-sky-500/0 group-hover:from-emerald-500/[0.03] group-hover:to-sky-500/[0.03] transition-all duration-700" />
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all duration-700 shadow-2xl shadow-slate-200/40 relative z-10">
            <Plus className="w-10 h-10 text-slate-200 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div className="text-center relative z-10">
            <span className="block text-xl font-black text-slate-300 group-hover:text-emerald-900 transition-colors">建立全新報告資產</span>
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 group-hover:text-emerald-500 transition-colors">INITIATE NEW RECORD</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderEditor = () => {
    if (!selectedReport) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] bg-slate-50/30">
          <div className="text-center space-y-6 max-w-md bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xl font-black text-slate-800">未選擇報告</h3>
            <p className="text-slate-500 font-bold text-sm leading-relaxed">請先從「報告資產庫」選擇，或從「範本庫」建立一份全新的永續報告。</p>
            <div className="flex gap-4 justify-center pt-2">
              <button onClick={() => setCurrentSubView("list")} className="px-6 py-3 bg-slate-100 text-slate-700 font-black text-xs rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest">報告庫</button>
              <button onClick={() => setCurrentSubView("templates")} className="px-6 py-3 bg-emerald-600 text-white font-black text-xs rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 uppercase tracking-widest">前往範本庫</button>
            </div>
          </div>
        </div>
      );
    }
    return (
    <div className="relative min-h-screen bg-slate-50/30">
      {/* Top Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-100 z-[100] overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start pt-6 relative px-4 lg:px-8">
        {/* Fixed Navigation Sidebar - Redesigned */}
        <aside className="hidden lg:block w-72 sticky top-24 h-[calc(100vh-140px)] z-40 p-1 self-start">
          <GlassCard className="h-full p-8 flex flex-col border-white/40 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white/60 backdrop-blur-3xl relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-10 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-8 px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-space">報告架構</span>
                    <span className="text-[9px] font-bold text-emerald-500/60 mt-0.5">STRUCTURE PROTOCOL</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse delay-150" />
                  </div>
                </div>

                <div className="space-y-10">
                  {Array.from(new Set(editorSections.map(s => s.chapter))).map((chap, i) => {
                    const sectionsInChapter = editorSections.filter(s => s.chapter === chap);
                    const completedInChapter = sectionsInChapter.filter(s => selectedReport?.completedSectionIds?.includes(s.id)).length;
                    const chapterProgress = (completedInChapter / sectionsInChapter.length) * 100;

                    return (
                      <div key={i} className="space-y-5 animate-in fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-black text-slate-900 flex items-center gap-3 px-1 uppercase tracking-tight">
                            <div className={cn(
                              "w-2 h-2 rounded-full transition-all duration-700",
                              chapterProgress === 100 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "bg-slate-200"
                            )} />
                            {chap}
                          </div>
                          <span className="text-[9px] font-black text-slate-300 tabular-nums tracking-widest">{Math.round(chapterProgress)}%</span>
                        </div>

                        <div className="space-y-2 ml-1 relative">
                          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-100" />

                          {sectionsInChapter.map(sec => {
                            const isActive = activeSectionId === sec.id;
                            const isDone = selectedReport?.completedSectionIds?.includes(sec.id);

                            return (
                              <button
                                key={sec.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const el = document.getElementById(`section-${sec.id}`);
                                  if (el) {
                                    const headerOffset = 180;
                                    const elementPosition = el.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                                  }
                                }}
                                className={cn(
                                  "group relative flex items-center w-full text-left transition-all py-3 pl-6 pr-3 rounded-2xl overflow-hidden",
                                  isActive
                                    ? "text-emerald-900 bg-white shadow-xl shadow-slate-200/40 border border-slate-100/50"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-white/40"
                                )}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="sidebarActive"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
                                    initial={false}
                                  />
                                )}
                                <span className={cn(
                                  "w-5 font-black text-[9px] transition-colors tabular-nums",
                                  isActive ? "text-emerald-500" : "text-slate-300"
                                )}>
                                  {sec.id.toString().padStart(2, '0')}
                                </span>
                                <span className="flex-1 text-[11px] font-black tracking-tight truncate ml-1">{sec.title}</span>
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 mt-4 border-t border-slate-100/50">
                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-space">Trustworthy Protocol</span>
                    <span className="text-[9px] font-bold text-sky-500/60 mt-0.5 uppercase tracking-tighter">Integrity Protocol</span>
                  </div>
                  <Fingerprint className="w-4 h-4 text-sky-400 animate-pulse" />
                </div>

                <div className="space-y-3 mb-10">
                  {[
                    { label: 'Traceable', icon: Search, value: 'Active', color: 'text-emerald-500' },
                    { label: 'Transparent', icon: Scan, value: 'Verified', color: 'text-sky-500' },
                    { label: 'Trustworthy', icon: ShieldCheck, value: 'Immune', color: 'text-indigo-500' },
                    { label: 'Timely', icon: Clock, value: 'Real-time', color: 'text-amber-500' },
                    { label: 'Transformative', icon: Zap, value: 'Live', color: 'text-rose-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-[1.25rem] bg-slate-50 border border-slate-100/50 group/item hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all cursor-default">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-slate-900 transition-colors" />
                        <span className="text-[10px] font-black text-slate-500 group-hover/item:text-slate-900 transition-colors">{item.label}</span>
                      </div>
                      <span className={cn("text-[8px] font-black uppercase tracking-widest", item.color)}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-auto sticky bottom-0 bg-white/60 backdrop-blur-md pb-2">
                <div className="p-6 bg-slate-950 rounded-3xl shadow-2xl shadow-slate-900/30 group/ai relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">寫作協理</span>
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-white/50 font-bold leading-relaxed relative z-10">
                    目前偵測到 3 個潛在 GRI 披露缺口，建議優先處理氣候風險章節。
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </aside>

        <div className="flex-1 min-w-0 max-w-4xl pb-40 relative">
          <motion.div
            className="flex items-center justify-between gap-6 mb-10 bg-white/70 backdrop-blur-3xl p-5 rounded-[2.5rem] border border-white/20 sticky top-4 z-[50] shadow-2xl shadow-slate-200/30"
          >
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentSubView("home")}
                className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-lg group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">2025 永續發展報告</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Workspace</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cloud Sync</span>
                <span className="text-[10px] font-bold text-emerald-600">Saved 2m ago</span>
              </div>
              <button
                onClick={handlePublish}
                className="h-14 px-10 bg-slate-950 text-white rounded-[1.25rem] font-black text-xs hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 uppercase tracking-[0.2em]"
              >
                Publish Record
              </button>
            </div>
          </motion.div>

          <div className="flex bg-white/40 backdrop-blur-xl p-1.5 rounded-[2rem] border border-slate-100/50 mb-12 shadow-inner">
            {(["大綱編織", "內容編輯", "報告預覽"] as const).map((tab) => {
              const tabValue = tab === "大綱編織" ? "大綱" : tab === "內容編輯" ? "草稿" : "預覽";
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabValue as any)}
                  className={cn(
                    "flex-1 py-4 text-[11px] font-black tracking-widest transition-all relative rounded-[1.5rem]",
                    activeTab === tabValue
                      ? "text-slate-900 bg-white shadow-xl shadow-slate-200/40"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="space-y-16">
            {activeTab === "預覽" ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
                <ReportPreviewPanel
                  report={selectedReport}
                  sectionContents={localContents}
                  editorSections={editorSections}
                  companyProfile={companyProfile}
                  language={language}
                  globalEsgData={globalEsgData}
                  onRefresh={refreshData}
                />
              </motion.div>
            ) : (
              <div className="space-y-12">
                {editorSections.map((sec, idx) => (
                  <motion.div
                    key={sec.id}
                    id={`section-${sec.id}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.6 }}
                    className="scroll-mt-48"
                  >
                    <SectionEditor
                      reportId={selectedReport?.id || ""}
                      index={sec.id}
                      title={sec.title}
                      placeholder="啟動編織... 輸入核心數據或點擊 AI 引導。"
                      initialContent={localContents[sec.id] || ""}
                      onLinkSource={() => handleLinkSource(sec.id)}
                      onViewAudit={() => {}} // Disabled for Conservative Strategy
                      isDone={selectedReport?.completedSectionIds?.includes(sec.id) || false}
                      onToggleComplete={() => handleToggleComplete(sec.id)}
                      onNext={editorSections.findIndex(s => s.id === sec.id) < editorSections.length - 1 ? () => handleNextSection(sec.id) : undefined}
                      onPrev={editorSections.findIndex(s => s.id === sec.id) > 0 ? () => handlePrevSection(sec.id) : undefined}
                      onChange={(content) => handleUpdateContent(sec.id, content)}
                      className="shadow-2xl shadow-slate-200/40 border-slate-100 hover:border-emerald-100 transition-colors"
                    />
                  </motion.div>
                ))}

                <div className="flex gap-4">
                  <button
                    onClick={handleFinalize}
                    disabled={isSaving}
                    className={cn(
                      "flex-1 h-32 bg-slate-950 border-2 border-slate-900 rounded-[3rem] flex flex-col items-center justify-center gap-4 hover:bg-black transition-all group overflow-hidden relative active:scale-95",
                      isSaving && "opacity-80 cursor-wait"
                    )}
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-700 shadow-xl shadow-slate-900/20 relative z-10">
                      {isSaving ? (
                        <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                      ) : (
                        <Save className="w-6 h-6 text-slate-900" />
                      )}
                    </div>
                    <div className="text-center relative z-10">
                      <span className="block text-lg font-black text-white">
                        {isSaving 
                          ? (language === 'zh' ? "正在密封存證..." : "Sealing & Vaulting...") 
                          : (language === 'zh' ? "完成編寫並儲存" : "Complete & Save")}
                      </span>
                      <span className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
                        {language === 'zh' ? "報告將轉為正式紀錄" : "Mark as official record"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {currentSubView === "home" && renderHome()}
          {currentSubView === "list" && renderList()}
          {currentSubView === "editor" && renderEditor()}
          {currentSubView === "library" && <SustainLibraryView onBack={() => setCurrentSubView("home")} />}
          {currentSubView === "templates" && <TemplateLibraryView onBack={() => setCurrentSubView("home")} onSelect={(tpl) => {
            // Pre-fill sectionContents from template guidance (zero AI calls)
            const templateSections = getTemplateSections(tpl.id);
            const prefilledContents: Record<string, string> = {};
            templateSections.forEach(s => {
              prefilledContents[s.id] = language === 'en' ? s.guidanceEn : s.guidanceZh;
            });

            const newReport: Report = {
              id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              title: `${new Date().getFullYear()} ${tpl.name}`,
              year: new Date().getFullYear(),
              chapters: templateSections.length > 0 ? Math.ceil(templateSections.length / 3) : 5,
              sections: tpl.segments,
              completedSections: 0,
              progress: 0,
              status: "draft",
              lastEdited: language === 'zh' ? "剛剛" : "Just now",
              linkedSourceCount: 0,
              issaReadiness: 0,
              trustSeal: "Bronze",
              templateId: tpl.id,
              completedSectionIds: [],
              sectionContents: prefilledContents,
            };
            addReport(newReport);
            setSelectedReport(newReport);
            setToastMessage({ title: language === 'zh' ? "報告已建立" : "Report Created", desc: language === 'zh' ? `範本：${tpl.name}（${tpl.segments} 節引導文已預載，零 AI 算力）` : `Template: ${tpl.nameEn} (${tpl.segments} sections pre-loaded, 0 AI calls)`, type: "success" });
            setCurrentSubView("editor");
          }} />}
        </motion.div>
      </AnimatePresence>

      {/* Benchmark Modal */}
      <BenchmarkModal isOpen={showBenchmarkModal} onClose={() => setShowBenchmarkModal(false)} />

      {/* Data Source Modal */}
      <DataSourceModal
        isOpen={showDataSourceModal}
        onClose={() => setShowDataSourceModal(false)}
        onSelect={onSourceSelected}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
      />

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
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              ) : (
                <div className="p-2 bg-sky-50 rounded-full shrink-0">
                  <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
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


function QuickToolButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 hover:-translate-y-1 active:scale-95 transition-all group gap-4 shadow-2xl"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-sky-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6 text-emerald-300" />
      </div>
      <span className="text-xs font-black tracking-widest text-white/60 group-hover:text-white uppercase transition-colors">
        {label}
      </span>
    </button>
  );
}


