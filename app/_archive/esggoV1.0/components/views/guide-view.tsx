"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ChevronRight,
  FileText,
  BarChart3,
  Layout,
  MessageSquare,
  Search,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Database,
  Image as ImageIcon,
  History,
  Send,
  Zap,
  ShieldCheck,
  TrendingUp,
  LineChart,
  Layers,
  Award
} from "lucide-react";

// --- Types ---
interface Chapter {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  progress: number;
  why: string;
  what: string;
  how: string;
  requirements: {
    type: "document" | "file";
    name: string;
    description: string;
  }[];
}

interface BenchmarkOption {
  id: string;
  version: string;
  title: string;
  description: string;
  highlights: string[];
  visualSpeed: "chart" | "image" | "icon";
  recommendation: string;
}

// --- Mock Data ---
const CHAPTERS: Chapter[] = [
  {
    id: "1-01",
    title: "1.01 經營者的話 (Letter from Header)",
    status: "completed",
    progress: 100,
    why: "經營者的話是整份報告書的靈魂，能展現企業由上而下推動 ESG 的決心，建立投資人與社會大眾的信任。",
    what: "向利害關係人傳達企業最高階層對永續發展的承諾與願景，總結過去一年的重大成就，並展望未來的永續目標。",
    how: "教學式解說：由董事長或執行長親自署名，內容需涵蓋策略遠景、重大進展與未來具體目標，建議搭配具備「數據真實性」的 5T 存證簽核。",
    requirements: [
      { type: "file", name: "國際講師的照片", description: "提交國際講師的照片以證明永續教育之真實性。" },
      { type: "document", name: "董事長簽名檔", description: "數位簽章或紙本掃描件。" }
    ]
  },
  {
    id: "1-02",
    title: "1.02 關於本公司 (Company Profile)",
    status: "in-progress",
    progress: 80,
    why: "向利害關係人清晰介紹企業的基本面與核心業務，是所有 ESG 分析的基礎。 (GRI 2-1)",
    what: "包含法律形式、總部所在地、主要業務地區、產業類別及服務特點。",
    how: "更新最新的企業簡報，並與 ERP 系統中的組織架構進行 5T 同步驗證。",
    requirements: [
      { type: "document", name: "最新組織架構圖", description: "需包含各事業部與分公司的持股比例。" }
    ]
  },
  {
    id: "1-04",
    title: "1.04 報告邊界與範疇 (Reporting Boundary)",
    status: "pending",
    progress: 15,
    why: "明確界定報告所涵蓋的實體範圍，確保數據的完整性與可比性。",
    what: "界定哪些子公司、廠區納入本次申報，哪些排除，並說明原因。",
    how: "列出所有控股實體，並根據營運控制權或財務控制權決定邊界。",
    requirements: [
      { type: "document", name: "實體清單彙整表", description: "包含對各實體之控制權百分比說明。" }
    ]
  },
  {
    id: "3-01",
    title: "3 利害關係人與重大議題 (Materiality)",
    status: "pending",
    progress: 0,
    why: "重大性分析是 ESG 報告的核心，決定了報告應聚焦哪些關鍵議題。",
    what: "利害關係人議合流程、重大議題矩陣、雙重重大性 (Double Materiality) 評估結果。",
    how: "彙整問卷結果，生成重大性矩陣圖，並由 AI 協助進行趨勢分析。",
    requirements: [
      { type: "document", name: "利害關係人問卷原始數據", description: "各群體之權重與原始評分表。" }
    ]
  },
  {
    id: "env-impact",
    title: "6 環境面 (Environmental)",
    status: "in-progress",
    progress: 45,
    why: "揭露企業對氣候變遷的應對措施，是投資人評估實體風險與轉型風險的關鍵指標。",
    what: "包含溫室氣體排放 (Scope 1-3)、能源管理、水資源耗用與廢棄物處理數據。",
    how: "1. 彙整各廠區電費與燃料單據 2. 使用 5T Protocol 進行係數轉換 3. 生成年度趨勢圖。",
    requirements: [
      { type: "document", name: "年度台電電費收據彙整表", description: "需包含 1-12 月各月份總用電量 (度)。" },
      { type: "file", name: "冷媒與發電機燃料清單", description: "包含 R410A, R134a 及柴油等數據。" },
      { type: "document", name: "水資源管理說明檔", description: "自來水、地下水及回收水的使用分配數據。" }
    ]
  },
  {
    id: "social-resp",
    title: "5 社會面 (Social Responsibility)",
    status: "pending",
    progress: 0,
    why: "展示企業對內部員工與外部社區的價值創造，體現組織韌性與吸引力。",
    what: "涵蓋勞資關係、職場安全、教育訓練、性別平權及社區參與計畫。",
    how: "1. 提取人事系統訓練數據 2. 彙整工安事故統計 3. 邀請 AI 進行員工滿意度摘要。",
    requirements: [
      { type: "document", name: "員工結構統計月報", description: "依性別、職級、年齡分類之員工總數表。" },
      { type: "file", name: "訓練課程實績照片", description: "職安及 ESG 相關培訓之現場存證相片。" }
    ]
  },
  {
    id: "governance",
    title: "4 治理面 (Governance & Ethics)",
    status: "completed",
    progress: 100,
    why: "良好的治理結構是永續經營的基石，能有效降低營運風險並提升利害關係人信任。",
    what: "董事會運作、風險控管機制、資訊透明度及反貪腐政策。",
    how: "1. 記錄董事會出席狀況 2. 揭露利害關係人溝通管道 3. 檢視供應鏈管理準則。",
    requirements: [
      { type: "document", name: "公司章程與內部管理規章", description: "需包含最新修訂日期之版本。" }
    ]
  }
];

const BENCHMARK_DATA = [
  { company: "台積電 (TSMC)", highlight: "再生能源佔比達 40%，且 Scope 2 排放數據最為詳實。" },
  { company: "台達電 (Delta)", highlight: "將碳費納入內部成本核算，顯著降低能源密集度。" },
  { company: "聯電 (UMC)", highlight: "在水資源循環利用率上達到 85% 以上，為產業標竿。" }
];

// --- Components ---

const OmniAssistant = ({ currentChapter }: { currentChapter?: Chapter | undefined }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsTyping(true);
    setResponse(null);

    try {
      const res = await fetch("/api/genkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowName: "omniFlow",
          input: {
            text: query,
            persona: {
              name: "透特博士",
              title: "Omni 首席數據官",
              description: "專精於 5T 協議下的全球 ESG 趨勢與數據深度分析。"
            }
          }
        }),
      });
      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error("AI Error:", error);
      setResponse("抱歉，目前 Omni 引擎暫時無法連線。");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative group">
      <div className="relative bg-white border border-stone-200 rounded-2xl p-6 shadow-minimal overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-stitch-teal-start flex items-center justify-center shadow-minimal">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-stitch-text mb-1">Omni 引導助理</h3>
            <p className="text-stitch-muted text-xs leading-relaxed">
              您好，我是 Omni 專業引導助理。當前章節：<span className="text-stitch-teal-start font-bold">{currentChapter?.title || "概覽面板"}</span>。
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="詢問透特博士專業建議..."
              className="w-full bg-stitch-shallow-gray border-none rounded-xl px-4 py-3 text-xs font-bold placeholder:text-stone-400 focus:ring-1 focus:ring-stitch-teal-start transition-all"
            />
            <button
              onClick={handleAsk}
              disabled={isTyping}
              className="absolute right-2 top-1.5 p-1.5 bg-stitch-teal-start text-white rounded-lg hover:bg-stitch-teal-end transition-all disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>

          {isTyping && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-1.5 h-1.5 bg-stitch-teal-start rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-stitch-teal-start rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-stitch-teal-start rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          {response && (
            <div className="p-4 bg-stitch-teal-start/5 border border-stitch-teal-start/10 rounded-xl">
              <p className="text-xs text-stitch-text leading-relaxed font-medium">
                {response}
              </p>
            </div>
          )}
        </div>

        {currentChapter && !response && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 space-y-4 border-t border-stitch-border pt-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="optimal" styleType="soft" className="bg-stitch-teal-start/10 text-stitch-teal-start uppercase tracking-widest text-[9px] font-black">
                  Professional Why
                </Badge>
              </div>
              <p className="text-sm text-stitch-text font-medium">{currentChapter.why}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="optimal" styleType="soft" className="bg-stitch-teal-end/10 text-stitch-teal-end uppercase tracking-widest text-[9px] font-black">
                  Data Scope
                </Badge>
              </div>
              <p className="text-sm text-stitch-text">{currentChapter.what}</p>
            </div>
            <div className="bg-stitch-shallow-gray/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-stitch-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-stitch-muted">
                  Implementation Guide
                </span>
              </div>
              <p className="text-xs text-stitch-muted whitespace-pre-line leading-relaxed">
                {currentChapter.how}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function GuideView() {
  const [selectedChapterId, setSelectedChapterId] = useState(CHAPTERS[0]?.id || "");
  const [activeStep, setActiveStep] = useState<"prep" | "synthesis" | "compare" | "finalize">("prep");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentChapter = CHAPTERS.find(c => c.id === selectedChapterId);

  const OPTIONS: BenchmarkOption[] = [
    {
      id: "v1",
      version: "Version A",
      title: "數據優先：透明揭露版",
      description: "以具體的量化圖表為主軸，強調 5T Protocol 驗證後的數據真實性，適合應對極其嚴苛的外部稽核。",
      highlights: ["自動生成 Scope 1-2 圓餅圖", "包含第三方查驗原始證明", "合規性得分：98%"],
      visualSpeed: "chart",
      recommendation: "強烈推薦：用於半導體/電子業，滿足供應鏈對透明度的最高要求。"
    },
    {
      id: "v2",
      version: "Version B",
      title: "願景敘事：轉型策略版",
      description: "將數據融入企業文化故事，著重於氣候風險對長期策略的靈感啟發與轉型路徑。",
      highlights: ["圖文並茂的轉型故事", "利害關係人訪談摘要", "專業品牌美感得分：95%"],
      visualSpeed: "image",
      recommendation: "建議：用於傳統產業或零售業，強化品牌商譽與客戶感知。"
    },
    {
      id: "v3",
      version: "Version C",
      title: "精簡極簡：關鍵指標版",
      description: "僅揭露核心 SASB/GRI 指標，去除冗贅文字，適合初次申報或快速合規需求。",
      highlights: ["單頁式重點面板", "極速生成流程", "維護成本：最低"],
      visualSpeed: "icon",
      recommendation: "推薦：用於新創或 SME 企業，著重效率與基本達標。"
    }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-stitch-teal-start/10 rounded-2xl">
            <BookOpen className="w-8 h-8 text-stitch-teal-start" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-stitch-text tracking-tight">
              永續報告數據驅動引擎 <span className="text-stitch-teal-start">Omni</span>
            </h1>
            <p className="text-stitch-muted text-sm mt-2 font-medium">
              透過專業數據助理協助，您可以從多種高品質合規範本中選取最合適的內容進行多維度合成。
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4 p-1 bg-stitch-shallow-gray rounded-2xl w-full md:w-fit">
          {["prep", "synthesis", "compare", "finalize"].map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step as "prep" | "synthesis" | "compare" | "finalize")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeStep === step
                ? "bg-white text-stitch-teal-start shadow-minimal"
                : "text-stitch-muted hover:text-stitch-text"
                }`}
            >
              {step === "prep" && "1. 數據採集準備"}
              {step === "synthesis" && "2. 專業初稿合成"}
              {step === "compare" && "3. 標竿差異分析"}
              {step === "finalize" && "4. 專業級終核"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar: Chapter List */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-4 bg-white/40 sticky top-8">
            <h3 className="text-xl font-black text-on-surface font-headline uppercase tracking-widest">Omni 專業引導引擎 v5.0</h3>
            <h4 className="text-xs font-black text-stitch-muted uppercase tracking-widest px-2 mb-4">
              報告章節結構 (Report Structure)
            </h4>
            <div className="space-y-2">
              {CHAPTERS.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapterId(chapter.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${selectedChapterId === chapter.id
                    ? "bg-white border-stitch-teal-start shadow-minimal ring-4 ring-stitch-teal-start/5"
                    : "bg-transparent border-transparent hover:bg-white/50 text-stitch-muted"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${selectedChapterId === chapter.id ? "text-stitch-teal-start" : ""}`}>
                      {chapter.title.split(" (")[0]}
                    </span>
                    <span>啟動專業精靈</span>
                    {chapter.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {chapter.status === "in-progress" && <div className="w-2 h-2 rounded-full bg-stitch-teal-start animate-pulse" />}
                  </div>
                  <div className="w-full h-1 bg-stitch-shallow-gray rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${chapter.status === "completed" ? "bg-green-500" : "bg-stitch-teal-start"
                        }`}
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-dashed border-stitch-border rounded-xl text-stitch-muted text-sm font-bold hover:border-stitch-teal-start hover:text-stitch-teal-start transition-all flex items-center justify-center gap-2">
              <Layers className="w-4 h-4" />
              新增自定義章節
            </button>
          </GlassCard>

          <GlassCard className="p-4 bg-gradient-to-br from-stitch-teal-start/5 to-stitch-teal-end/5 border-none">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-stitch-teal-start" />
              <span className="text-xs font-black text-stitch-text uppercase tracking-tight">Context Persistence</span>
            </div>
            <p className="text-[10px] text-stitch-muted leading-relaxed font-medium">
              系統正持續學習您的專業口吻與數據偏好。Omni 引擎將自動確保全篇文本在量化數據與質性描述上保持高度的一致性。
            </p>
          </GlassCard>
        </div>

        {/* Main Content: Step Logic */}
        <div className="lg:col-span-6 space-y-8">
          <AnimatePresence mode="wait">
            {activeStep === "prep" && (
              <motion.div
                key="prep"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-stitch-text flex items-center gap-3">
                    <Database className="w-6 h-6 text-stitch-teal-start" />
                    章節級數據來源 (Data Requirements)
                  </h2>
                  <Badge variant="optimal" className="bg-stitch-teal-start/10 text-stitch-teal-start border-none font-black text-[10px] uppercase tracking-widest px-4">
                    3 ITEMS PENDING
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentChapter?.requirements.map((req, idx) => (
                    <GlassCard key={idx} className="p-6 group hover:border-stitch-teal-start/30 transition-all shadow-minimal">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${req.type === 'document' ? 'bg-stitch-gold/10' : 'bg-stitch-teal-start/10'}`}>
                          {req.type === 'document' ? <FileText className="w-6 h-6 text-stitch-gold" /> : <ImageIcon className="w-6 h-6 text-stitch-teal-start" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-stitch-text group-hover:text-stitch-teal-start transition-colors">
                            {req.name}
                          </h4>
                          <p className="text-sm text-stitch-muted mt-1 font-medium">{req.description}</p>
                          <div className="mt-4 flex gap-2">
                            <button className="text-xs font-black text-stitch-teal-start bg-stitch-teal-start/10 px-4 py-2 rounded-lg hover:bg-stitch-teal-start/20 transition-colors uppercase tracking-widest">
                              連線原始數據 (Audit)
                            </button>
                            <button className="text-xs font-bold text-stitch-muted hover:text-stitch-text px-2">
                              查看範例
                            </button>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-stitch-border group-hover:text-green-500 transition-colors" />
                      </div>
                    </GlassCard>
                  ))}
                  <div className="p-6 border-2 border-dashed border-stitch-border rounded-3xl flex flex-col items-center justify-center text-stitch-muted hover:border-stitch-teal-start transition-all cursor-pointer group">
                    <Layers className="w-8 h-8 mb-2 opacity-30 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-black uppercase tracking-widest">Connect Data Sources</span>
                    <span className="text-[10px] mt-1 font-bold">ERP, MES OR CLOUD INTEGRATION</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === "synthesis" && (
              <motion.div
                key="synthesis"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-stitch-text flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-stitch-teal-start" />
                    Omni 多維度合成引擎 (Engine Genesis)
                  </h2>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-stitch-teal-start opacity-20 blur-[120px] -mr-48 -mt-48" />

                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 text-stitch-teal-start" />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-on-surface-variant font-bold opacity-60">搭載 5T 專業引擎與 ZKP 驗證，提供您從框架對標至憑證存證的全方位專業引導。</p>
                        <p className="text-stitch-teal-start font-black text-[10px] tracking-[0.3em] uppercase">
                          Context-Aware Analytical Synthesis Processing...
                        </p>
                        <h3 className="text-2xl font-black mt-1 tracking-tight">
                          請從以下三種專業策略中選擇初稿版本
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedOption(opt.id)}
                          className={`p-6 rounded-[24px] cursor-pointer transition-all border-2 ${selectedOption === opt.id
                            ? "bg-white/10 border-stitch-teal-start scale-[1.02] shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <Badge className="bg-stitch-teal-start text-white border-none font-black text-[9px] tracking-widest px-3">{opt.version}</Badge>
                            {opt.visualSpeed === 'chart' && <BarChart3 className="w-5 h-5 text-stitch-teal-start" />}
                            {opt.visualSpeed === 'image' && <ImageIcon className="w-5 h-5 text-stitch-teal-end" />}
                            {opt.visualSpeed === 'icon' && <Layout className="w-5 h-5 text-stitch-gold" />}
                          </div>
                          <h4 className="text-lg font-black mb-2 tracking-tight">{opt.title}</h4>
                          <p className="text-[11px] text-white/50 leading-relaxed mb-4 font-medium">{opt.description}</p>
                          <div className="space-y-2 mb-6">
                            {opt.highlights.map((h, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[10px] font-black text-white/80">
                                <CheckCircle2 className="w-3.5 h-3.5 text-stitch-teal-start" />
                                {h}
                              </div>
                            ))}
                          </div>
                          <div className="text-[9px] font-black text-stitch-gold p-3 bg-white/5 rounded-xl border border-white/10 uppercase tracking-tight leading-relaxed">
                            {opt.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 focus-within:border-stitch-teal-start/50 transition-all">
                      <div className="w-10 h-10 rounded-full bg-stitch-teal-start flex items-center justify-center flex-shrink-0 shadow-minimal">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="text"
                        placeholder="請輸入優化指令（例如：更換專業口吻、強化範疇三數據描述...）"
                        className="bg-transparent flex-1 text-sm border-none focus:ring-0 text-white placeholder:text-white/20 font-medium"
                      />
                      <button className="p-3 bg-stitch-teal-start rounded-xl hover:scale-105 active:scale-95 transition-all shadow-minimal">
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === "compare" && (
              <motion.div
                key="compare"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="p-8 space-y-6">
                    <h3 className="text-xl font-black flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-stitch-gold" />
                      產業標竿亮點分析 (Industry Analytics)
                    </h3>
                    <p className="text-lg text-on-surface-variant font-medium opacity-70">基於 5T 協議與 ZKP 驗證的專業報告精靈</p>
                    <p className="text-sm text-stitch-muted font-medium">
                      系統已從 Omni 圖書館中提取前三家領先企業的報告，針對本章節進行專業級對標：
                    </p>
                    <div className="space-y-4">
                      {BENCHMARK_DATA.map((data, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-stitch-shallow-gray/50 rounded-2xl group hover:bg-white transition-all border border-transparent hover:border-black/5 shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center font-black text-stitch-teal-start shadow-minimal flex-shrink-0 group-hover:scale-110 transition-transform">
                            {i + 1}
                          </div>
                          <div>
                            <h5 className="font-black text-stitch-text">{data.company}</h5>
                            <p className="text-xs text-stitch-muted mt-1 leading-relaxed font-medium">{data.highlight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8 space-y-6 bg-gradient-to-br from-stitch-teal-start/5 to-stitch-teal-end/5 border-none">
                    <h3 className="text-xl font-black flex items-center gap-3">
                      <LineChart className="w-6 h-6 text-stitch-teal-start" />
                      專業級建議：圖表化廣度評估
                    </h3>
                    <div className="space-y-6">
                      <div className="p-6 bg-white rounded-[24px] shadow-minimal border border-stitch-teal-start/10">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-stitch-teal-start" />
                          <span className="text-sm font-black uppercase tracking-tight text-stitch-teal-start">AIG Recommendation: Logic Enrichment</span>
                        </div>
                        <p className="text-xs text-stitch-muted leading-relaxed font-medium">
                          根據 AIG 邏輯分析，您當前的能源管理數據波動性較高。傳統文字描述可能導致信服力不足，建議採用「階梯式趨勢圖」並搭配「專業註解」以揭露 6 月份的異常是由於新增產線。
                        </p>
                        <div className="mt-6 flex gap-3">
                          <button className="flex-1 py-3 bg-stitch-teal-start text-white rounded-xl text-xs font-black shadow-minimal hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                            產出視覺化資產
                          </button>
                          <button className="px-5 py-3 bg-stitch-shallow-gray text-stitch-muted rounded-xl text-xs font-black hover:text-stitch-text transition-colors">
                            調整
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="aspect-video bg-white/50 border border-slate-100 rounded-xl flex items-center justify-center text-[9px] text-stitch-muted font-black text-center p-2 uppercase tracking-tighter">
                            PREVIEW {i}<br />{i === 1 ? 'PROFESSIONAL' : i === 2 ? 'DYNAMIC' : 'CORPORATE'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeStep === "finalize" && (
              <motion.div
                key="finalize"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-[32px] bg-green-50 flex items-center justify-center shadow-inner border border-green-100">
                  <ShieldCheck className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-stitch-text tracking-tight">本章節已達到專業級高品質標準</h2>
                  <p className="text-stitch-muted mt-3 max-w-lg font-medium leading-relaxed">
                    AIG 已完成與國際合規性指標 (GRI 305-1, 305-2) 的終極核驗。本章節內容不但具備 5T 數據證據鏈，其撰寫邏輯亦優於 85% 的同業申報資產。
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button className="px-10 py-4 bg-stitch-teal-start text-white rounded-2xl font-black shadow-minimal hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs">
                    完成存檔並前往下一章節
                  </button>
                  <button className="px-10 py-4 bg-white border border-stitch-border text-stitch-text rounded-2xl font-black hover:bg-stitch-shallow-gray transition-all uppercase tracking-widest text-xs">
                    導出 PDF 預覽資產
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar: Omni Assistant */}
        <div className="lg:col-span-3 w-full sticky top-8">
          <OmniAssistant currentChapter={currentChapter} />
        </div>
      </div>
    </div>
  );
}
