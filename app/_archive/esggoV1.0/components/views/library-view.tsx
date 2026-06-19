"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/lib/context/app-context";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import {
  BookOpen,
  Search,
  FileText,
  ChevronRight,
  Download,
  Eye,
  TrendingUp,
  ShieldCheck,
  Scale,
  Lightbulb,
  X,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = [
  { id: "all", label: "全部資源" },
  { id: "current", label: "當前永續報告書草稿" },
  { id: "reports", label: "台灣前 30 大永續報告書" },
  { id: "global", label: "全球標竿報告 (美/歐)" },
];

const TOP_30_REPORTS = [
  { id: 1, company: "台積電 (TSMC)", years: ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"], sector: "半導體業", score: "AAA" },
  { id: 2, company: "台達電 (Delta)", years: ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"], sector: "電子零組件", score: "AAA" },
  { id: 3, company: "玉山金控 (E.SUN)", years: ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"], sector: "金融保險業", score: "AA" },
  { id: 4, company: "中華電信 (CHT)", years: ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"], sector: "通信網路業", score: "AA" },
];

const GLOBAL_REPORTS = [
  { id: 1, company: "Apple (美國)", year: "2023", sector: "科技硬體", score: "AAA" },
  { id: 2, company: "Microsoft (美國)", year: "2023", sector: "軟體服務", score: "AAA" },
  { id: 3, company: "Unilever (英國/荷蘭)", year: "2023", sector: "民生消費", score: "AAA" },
  { id: 4, company: "Schneider Electric (法國)", year: "2023", sector: "工業設備", score: "AAA" },
];

const YEARBOOKS = ["2023", "2022", "2021", "2020"];

export function LibraryView() {
  const { setComplianceTokens } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [readProgress, setReadProgress] = useState<Record<string, number>>({});

  const handleReadArticle = (articleId: string) => {
    setSelectedArticle(articleId);
    setReadProgress((prev) => ({ ...prev, [articleId]: Math.max(prev[articleId] || 0, 10) }));
    // Simulate rewarding coins after a short delay
    setTimeout(() => {
      setComplianceTokens((prev: number) => prev + 10);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }, 1500);
  };

  const handleArticleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!selectedArticle) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = Math.min(100, Math.max(10, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)));

    setReadProgress((prev) => {
      const current = prev[selectedArticle] || 0;
      if (progress > current) {
        return { ...prev, [selectedArticle]: progress };
      }
      return prev;
    });
  };

  const handleDownload = async (id: string, title: string) => {
    try {
      const response = await fetch('/api/library/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: `This is the full content of ${title}. In a real application, this would be the actual article text.`,
          articleId: id
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handlePreview = async (id: string, title: string) => {
    try {
      const response = await fetch('/api/library/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: `Preview of ${title}. This content is generated and stored in Google Drive via NCBDB.`,
          articleId: id
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-stitch-text tracking-tight">
              永續報告圖書館 (ESG Library)
            </h1>
            <Badge
              variant="optimal"
              styleType="soft"
              className="bg-stitch-teal-start/10 text-stitch-teal-start border-stitch-teal-start/20"
            >
              資料庫連線中：NCBDB (分散式雲端資料庫) 安全加密
            </Badge>
          </div>
          <p className="text-stitch-muted text-lg">
            探索全球頂尖企業的永續實踐與最新趨勢指標，為您的報告提供專業洞察。
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stitch-muted" />
            <input
              type="text"
              placeholder="搜尋標竿報告或趨勢文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stitch-border rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-stitch-teal-start focus:ring-4 focus:ring-stitch-teal-start/10 transition-all shadow-minimal"
            />
          </div>
          {readProgress && Object.keys(readProgress || {}).length > 0 && (
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-stitch-teal-start/20 shadow-minimal">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider font-bold text-stitch-muted">累計閱讀成長進度</span>
                <span className="text-sm font-bold text-stitch-teal-start">
                  {Math.round(Object.values(readProgress || {}).reduce((a, b) => (a || 0) + (b || 0), 0) / 100)} 篇研究報告已讀完
                </span>
              </div>
              <div className="w-16 h-1.5 bg-stitch-shallow-gray rounded-full overflow-hidden">
                <div
                  className="h-full bg-stitch-teal-start"
                  style={{ width: `${Math.min(100, (Object.keys(readProgress || {}).length / 5) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-[20px] text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id
              ? "bg-stitch-teal-start text-white"
              : "bg-white border border-stitch-border text-stitch-muted hover:bg-stitch-shallow-gray"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current ESG Report Overview (Only show when 'all' or 'current' is selected) */}
          {(activeCategory === "all" || activeCategory === "current") && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlassCard
                  title="Report Progress"
                  value="68"
                  unit="%"
                  status="validated"
                  source="5T Engine"
                />
                <LiquidGlassCard
                  title="Evidence Collected"
                  value="12"
                  unit="/ 45"
                  status="validated"
                  source="SRC Vault"
                />
                <LiquidGlassCard
                  title="AI Audit Status"
                  value="Active"
                  status="validated"
                  source="Omni One"
                />
              </div>

              <GlassCard className="p-8 border-l-4 border-l-stitch-teal-end">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-stitch-text flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-stitch-teal-end" />
                    當前永續報告書草稿 (5T Protocol 生成)
                  </h3>
                  <Badge variant="optimal" styleType="soft">
                    2024 年度
                  </Badge>
                </div>
                <p className="text-stitch-muted leading-relaxed mb-6">
                  您的 2024 年度永續報告書草稿正同步於「雲端金庫」Omni
                  Engine 並加密存儲於 NCBDB (分散式雲端資料庫) 中。請注意，此資料庫具備多層級權限控管，僅限具備對應鑰匙的合作者閱覽。所有數據更動皆受 5T Protocol 追蹤驗證其真實性。
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-stitch-teal-end text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors">
                    繼續編輯草稿
                  </button>
                  <button className="px-4 py-2 bg-stitch-teal-start text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors">
                    導出 5T 報告
                  </button>
                  <button className="px-4 py-2 bg-stitch-shallow-gray text-stitch-muted rounded-lg text-sm font-medium hover:bg-stitch-border transition-colors">
                    查看 5T 證據
                  </button>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Featured Article: What is ESG Report */}
          {(activeCategory === "all" || activeCategory === "cases") && (
            <GlassCard
              className="p-8 md:p-10 border-l-4 border-l-stitch-teal-start cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              onClick={() => handleReadArticle("what-is-esg")}
            >
              {/* Reward Animation Overlay */}
              <AnimatePresence>
                {showReward && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 right-4 bg-amber-100 border border-amber-200 text-amber-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-minimal z-10"
                  >
                    <Coins className="w-4 h-4" />
                    <span className="text-sm font-bold">+10 合規代幣 (Tokens)</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-stitch-teal-start/10 text-stitch-teal-start hover:bg-stitch-teal-start/20 border-none px-3 py-1 text-sm">
                  精選文章
                </Badge>
                <span className="text-sm text-stitch-muted font-medium">
                  5 分鐘閱讀
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stitch-text mb-4 group-hover:text-stitch-teal-start transition-colors font-serif leading-snug">
                ESG 報告書究竟是什麼？企業與利害關係人溝通的核心橋樑
              </h2>
              <p className="text-stitch-muted line-clamp-3 leading-relaxed text-lg">
                ESG報告書全稱為永續報告書（ESG Sustainability Report），是用來記錄企業在ESG（環境保護、社會責任及公司治理）三個面向的表現情狀，讓利害關係人（如投資者、員工、消費者等）更了解企業在永續經營上所做的努力。
              </p>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center text-stitch-teal-start text-base font-semibold">
                  點擊閱讀完整內容 <ChevronRight className="w-5 h-5 ml-1" />
                </div>
                {readProgress?.["what-is-esg"] !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stitch-muted">
                      閱讀進度: {readProgress["what-is-esg"]}%
                    </span>
                    <div className="w-24 h-2 bg-stitch-shallow-gray rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stitch-teal-start transition-all duration-300"
                        style={{ width: `${readProgress["what-is-esg"]}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Top 30 Reports List */}
          {(activeCategory === "all" || activeCategory === "reports") && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-stitch-text flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-stitch-teal-end" />
                  台灣前 30 大優良企業永續報告書 (近 10 載)
                </h3>
                <select className="bg-stitch-shallow-gray border border-stitch-border text-stitch-text text-sm rounded-lg focus:ring-stitch-teal-start focus:border-stitch-teal-start block p-2">
                  {YEARBOOKS.map(year => (
                    <option key={year} value={year}>{year} 年度</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                {TOP_30_REPORTS.map((report, i) => (
                  <div
                    key={report.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-[8px] border border-stitch-border hover:border-stitch-teal-end hover:bg-stitch-shallow-gray transition-all group cursor-pointer gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-stitch-shallow-gray text-stitch-muted flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-stitch-text group-hover:text-stitch-teal-end transition-colors">
                          {report.company}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stitch-muted mt-1">
                          <span>{report.sector}</span>
                          <span>•</span>
                          <span>收錄 {report.years.length} 年份永續報告</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                      <Badge className="bg-stitch-gold/10 text-stitch-gold border-none">
                        MSCI {report.score}
                      </Badge>
                      <div className="flex gap-1">
                        <button
                          className="p-2 text-stitch-muted hover:text-stitch-teal-start hover:bg-stitch-teal-start/10 rounded-full transition-colors flex items-center gap-1"
                          title="預覽正式文檔"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(report.company, report.company);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-xs hidden md:inline">預覽</span>
                        </button>
                        <button
                          className="p-2 text-stitch-muted hover:text-stitch-teal-start hover:bg-stitch-teal-start/10 rounded-full transition-colors flex items-center gap-1"
                          title="下載正式文件"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(report.company, report.company);
                          }}
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-xs hidden md:inline">下載</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {activeCategory === "reports" && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-stitch-teal-start hover:underline font-medium">
                    載入更多企業...
                  </button>
                </div>
              )}
            </GlassCard>
          )}

          {/* Taiwan Yearbook */}
          {(activeCategory === "all" || activeCategory === "yearbook") && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-stitch-text flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-stitch-gold" />
                  台灣永續企業年報 (近 10 載)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-5 gap-4">
                {YEARBOOKS.map((year) => (
                  <div key={year} className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 cursor-pointer transition-all group">
                    <FileText className="w-8 h-8 text-slate-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                    <span className="font-bold text-slate-700">{year}</span>
                    <span className="text-xs text-slate-500 mt-1">完整年報</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Global Top 10 */}
          {(activeCategory === "all" || activeCategory === "global") && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-stitch-text flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-stitch-teal-start" />
                  全球前 10 大永續報告 (美/歐標竿)
                </h3>
              </div>
              <div className="space-y-3">
                {GLOBAL_REPORTS.map((report, i) => (
                  <div
                    key={report.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-[8px] border border-stone-200 hover:border-primary-teal-start hover:bg-surface-container transition-all group cursor-pointer gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#F1F3F5] text-[#666666] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-stitch-text group-hover:text-stitch-teal-start transition-colors">
                          {report.company}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stitch-muted mt-1">
                          <span>{report.sector}</span>
                          <span>•</span>
                          <span>{report.year} 年度</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                      <Badge className="bg-stitch-teal-start/10 text-stitch-teal-start border-none">
                        MSCI {report.score}
                      </Badge>
                      <div className="flex gap-1">
                        <button
                          className="p-2 text-stitch-muted hover:text-stitch-teal-start hover:bg-stitch-teal-start/10 rounded-full transition-colors"
                          title="預覽"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(report.company, report.company);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-stitch-muted hover:text-stitch-teal-start hover:bg-stitch-teal-start/10 rounded-full transition-colors"
                          title="下載 PDF"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(report.company, report.company);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Insights */}
          {(activeCategory === "all" || activeCategory === "insights") && (
            <GlassCard className="p-6 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-stitch-text flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-stitch-gold" />
                  趨勢分析與洞察文章
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-minimal transition-shadow cursor-pointer"
                  onClick={() => handleReadArticle("disclosure-standards")}
                >
                  <h4 className="font-bold text-slate-800 mb-2">最新歐盟 ESG 資訊揭露指標指南</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">深入剖析歐盟與台灣永續路徑落差及美國 SEC、歐盟 CSRD 的關鍵要點對產業的影響...</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-xs text-stitch-teal-start font-medium">
                      繼續閱讀本文 <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                    {readProgress["disclosure-standards"] !== undefined && (
                      <span className="text-[10px] font-bold text-stitch-teal-start bg-stitch-teal-start/10 px-1.5 py-0.5 rounded">
                        {readProgress["disclosure-standards"]}%
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-minimal transition-shadow cursor-pointer"
                  onClick={() => handleReadArticle("decarbonization-pathways")}
                >
                  <h4 className="font-bold text-slate-800 mb-2">半導體產業脫碳路徑之研究報告</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">分析台積電、Intel、Samsung 的 Scope 1-3 排放量數據及減碳具體策略...</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-xs text-stitch-teal-start font-medium">
                      繼續閱讀本文 <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                    {readProgress["decarbonization-pathways"] !== undefined && (
                      <span className="text-[10px] font-bold text-stitch-teal-start bg-stitch-teal-start/10 px-1.5 py-0.5 rounded">
                        {readProgress["decarbonization-pathways"]}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Guidelines & Laws */}
          {(activeCategory === "all" || activeCategory === "laws") && (
            <GlassCard className="p-6 bg-gradient-to-br from-[#F8F9FA] to-white">
              <h3 className="text-lg font-bold text-stitch-text mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-stitch-gold" />
                專業準則與法規庫
              </h3>
              <div className="space-y-4">
                <div
                  className="group cursor-pointer"
                  onClick={() => handleReadArticle("gri-standards")}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stitch-text group-hover:text-stitch-gold transition-colors">
                      GRI 準則 (2021年)
                    </h4>
                    {readProgress["gri-standards"] !== undefined && (
                      <span className="text-[10px] font-bold text-stitch-gold bg-stitch-gold/10 px-1.5 py-0.5 rounded">
                        {readProgress["gri-standards"]}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stitch-muted mt-1 line-clamp-2">
                    目前最全球最通用的準則，涵蓋經濟、環境及社會 34 個議題模組供企業選擇。
                  </p>
                </div>
                <div className="h-px bg-stitch-border" />
                <div
                  className="group cursor-pointer"
                  onClick={() => handleReadArticle("sasb-standards")}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stitch-text group-hover:text-stitch-gold transition-colors">
                      SASB 準則
                    </h4>
                    {readProgress["sasb-standards"] !== undefined && (
                      <span className="text-[10px] font-bold text-stitch-gold bg-stitch-gold/10 px-1.5 py-0.5 rounded">
                        {readProgress["sasb-standards"]}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stitch-muted mt-1 line-clamp-2">
                    重點在於投資人溝通，涵蓋 11 個產業類別 77 個行業細項，著重財務重大性。
                  </p>
                </div>
                <div className="h-px bg-stitch-border" />
                <div
                  className="group cursor-pointer"
                  onClick={() => handleReadArticle("tcfd-standards")}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stitch-text group-hover:text-stitch-gold transition-colors">
                      TCFD 氣候相關財務揭露
                    </h4>
                    {readProgress["tcfd-standards"] !== undefined && (
                      <span className="text-[10px] font-bold text-stitch-gold bg-stitch-gold/10 px-1.5 py-0.5 rounded">
                        {readProgress["tcfd-standards"]}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stitch-muted mt-1 line-clamp-2">
                    專注氣候風險揭露，包含公司治理、策略、風險管理、指標及目標 4 個核心要素。
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Good Copywriting Examples */}
          {(activeCategory === "all" || activeCategory === "copywriting") && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-stitch-text mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-stitch-gold" />
                優質文案範例參考
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-[8px] bg-stitch-shallow-gray hover:bg-stitch-gold/10 hover:text-stitch-gold transition-colors group">
                  <span className="text-sm font-bold text-stitch-text group-hover:text-stitch-gold block mb-1">
                    報告引言撰寫 (範例)
                  </span>
                  <span className="text-xs text-stitch-muted line-clamp-1">
                    展示企業對永續轉型的承諾與具體遠景。
                  </span>
                </button>
                <button className="w-full text-left p-3 rounded-[8px] bg-stitch-shallow-gray hover:bg-stitch-gold/10 hover:text-stitch-gold transition-colors group">
                  <span className="text-sm font-bold text-stitch-text group-hover:text-stitch-gold block mb-1">
                    重大性分析結果說明
                  </span>
                  <span className="text-xs text-stitch-muted line-clamp-1">
                    如何清楚溝通雙重重大性的評估標準與過程。
                  </span>
                </button>
                <button className="w-full text-left p-3 rounded-[8px] bg-stitch-shallow-gray hover:bg-stitch-gold/10 hover:text-stitch-gold transition-colors group">
                  <span className="text-sm font-bold text-stitch-text group-hover:text-stitch-gold block mb-1">
                    溫室氣體排減量聲明
                  </span>
                  <span className="text-xs text-stitch-muted line-clamp-1">
                    符合 SBTi 目標的具體表述方式。
                  </span>
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedArticle(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[24px] shadow-minimal overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 md:p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-stitch-teal-start/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-stitch-teal-start" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-stitch-text">
                      {selectedArticle === "what-is-esg" ? "ESG 報告書究竟是什麼？" :
                        selectedArticle.includes("standards") ? "專業準則與法規解讀" : "趨勢專題洞察"}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 bg-stitch-shallow-gray px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-stitch-muted">閱讀進度</span>
                    <div className="w-20 h-1.5 bg-stitch-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-stitch-teal-start"
                        style={{ width: `${readProgress[selectedArticle] || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-stitch-teal-start w-8">{readProgress[selectedArticle] || 0}%</span>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 hover:bg-stitch-shallow-gray rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-stitch-muted" />
                  </button>
                </div>
              </div>

              <div
                className="p-6 md:p-12 overflow-y-auto bg-white flex-1"
                onScroll={handleArticleScroll}
              >
                {selectedArticle === "what-is-esg" ? (
                  <article className="prose prose-slate max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold text-stitch-text mb-8 font-serif leading-tight">
                      ESG 報告書究竟是什麼？企業與利害關係人溝通的核心橋樑
                    </h1>

                    <p className="text-xl text-stitch-muted leading-relaxed mb-10 font-serif">
                      ESG報告書全稱為永續報告書（ESG Sustainability Report），是用來記錄企業在ESG（環境保護、社會責任及公司治理）三個面向的表現情狀，讓利害關係人（如投資者、員工、消費者等）更了解企業在永續經營上所做的努力。這不僅僅是一份報告，更是企業對外展示長期價值、內部管控風險能力，以及對社會貢獻的正式文件。
                    </p>

                    <div className="bg-stitch-shallow-gray p-6 rounded-[12px] border-l-4 border-stitch-gold mb-8">
                      <h3 className="text-xl font-bold text-stitch-text mb-4">
                        為什麼現在必須寫？
                      </h3>
                      <ul className="space-y-3 text-stitch-muted">
                        <li>
                          <strong className="text-stitch-text">
                            金管會新制規定：
                          </strong>
                          實收資本額 20 億元以下的上市櫃公司，自 2025 年起也須編製 ESG 報告書。
                        </li>
                        <li>
                          <strong className="text-stitch-text">
                            供應鏈要求：
                          </strong>
                          如蘋果、台積電等大廠，皆要求供應商提供具體的減碳數據與永續承諾。
                        </li>
                        <li>
                          <strong className="text-stitch-text">
                            獲取投資：
                          </strong>
                          銀行與投資法人逐漸將 ESG 表現納入融資評估與投資組合的核心指標。
                        </li>
                        <li>
                          <strong className="text-stitch-text">
                            品牌商譽：
                          </strong>
                          展現企業社會責任，吸引優秀人才與認可企業價值的消費者。
                        </li>
                      </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-stitch-text mt-10 mb-6">
                      主要的揭露準則
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div className="p-5 rounded-[12px] border border-stitch-border bg-white">
                        <h4 className="text-lg font-bold text-stitch-teal-start mb-2">
                          GRI 準則
                        </h4>
                        <p className="text-sm text-stitch-muted">
                          由全球永續報告協會發布，是目前最通用的框架，著重於對環境及社會的影響。
                        </p>
                      </div>
                      <div className="p-5 rounded-[12px] border border-stitch-border bg-white">
                        <h4 className="text-lg font-bold text-stitch-teal-end mb-2">
                          SASB 準則
                        </h4>
                        <p className="text-sm text-stitch-muted">
                          著重於對投資人有意義的財務重大性議題，針對不同行業別有特製指標。
                        </p>
                      </div>
                      <div className="p-5 rounded-[12px] border border-stitch-border bg-white">
                        <h4 className="text-lg font-bold text-stitch-gold mb-2">
                          TCFD 準則
                        </h4>
                        <p className="text-sm text-stitch-muted">
                          專注於「氣候變遷」對企業財務產生的風險與機會，包括實體風險與轉型風險。
                        </p>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-stitch-text mt-10 mb-6">
                      撰寫重點
                    </h2>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-stitch-teal-start text-white flex items-center justify-center font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <h4 className="font-bold text-stitch-text text-lg">
                            重大性議題評估
                          </h4>
                          <p className="text-stitch-muted">
                            企業須列出對其業務及利害關係人最重要的議題，這也是報告的核心骨幹。
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-stitch-teal-start text-white flex items-center justify-center font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h4 className="font-bold text-stitch-text text-lg">
                            具體的量化數據
                          </h4>
                          <p className="text-stitch-muted">
                            如溫室氣體排放量、用水量、員工流動率 or 管理層性別比例等數據揭露。
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-stitch-teal-start text-white flex items-center justify-center font-bold flex-shrink-0">
                          3
                        </div>
                        <div>
                          <h4 className="font-bold text-stitch-text text-lg">
                            治理與策略落實
                          </h4>
                          <p className="text-stitch-muted">
                            說明公司最高治理單位（如董事會）如何參與ESG決策及其具體目標進程。
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary-teal-start text-white flex items-center justify-center font-bold flex-shrink-0">
                          4
                        </div>
                        <div>
                          <h4 className="font-bold text-[#333333] text-lg">
                            第三方查驗與保證
                          </h4>
                          <p className="text-[#666666]">
                            經由會計師或獨立查驗機構核閱，增強數據的可信度與法律遵循力。
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ) : (
                  <article className="prose prose-slate max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 font-serif leading-tight">
                      {selectedArticle === "disclosure-standards" ? "最新歐盟 ESG 揭露指標指南解析" :
                        selectedArticle === "decarbonization-pathways" ? "半導體產業脫碳路徑深度研究" :
                          selectedArticle === "gri-standards" ? "GRI 準則 (2021年) 指導手冊" :
                            selectedArticle === "sasb-standards" ? "SASB 準則財務重大性指標說明" :
                              "TCFD 氣候風險財務分析指南"}
                    </h1>

                    <p className="text-xl text-slate-600 leading-relaxed mb-10 font-serif">
                      企業在面對多元的ESG指標時，往往面臨收據收集困難與報告邏輯不清等挑戰。本研究針對該主題，透過分析國際成功與失敗案例，為企業指出最有效率的執行路徑。
                    </p>

                    <div className="grid grid-cols-1 gap-8">
                      <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">核心洞察</h3>
                        <p className="text-slate-600 leading-relaxed">
                          市場正逐漸轉向雙向重大性（Double Materiality）的觀點：除了考慮環境對公司財務的影響，也同步考慮公司對環境與社會的影響力。
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800">重要建議</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                          <li>建立跨部門的 ESG 資料自動收集機制，以確數據真實性與即時性。</li>
                          <li>優先處理利害關係人最在意的議題，避免偏離重大性核心。</li>
                          <li>將永續發展目標整合進企業長期績效指標與薪酬系統。</li>
                          <li>尋求第三方保證以降低法律風險並提升國際競爭力。</li>
                        </ul>
                      </div>
                    </div>

                    <div className="h-64" /> {/* Spacer for demo */}
                  </article>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

