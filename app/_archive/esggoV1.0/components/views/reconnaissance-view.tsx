"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Zap,
  Shield,
  Target,
  Trophy,
  Activity,
  BarChart3,
  ChevronRight,
  ZapOff,
  Crosshair,
  BadgeCheck,
  AlertCircle,
  Clock,
  LayoutDashboard,
  FileSearch,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { IIntelNode5T } from "@/lib/core/5t-protocol";
import { toast } from "sonner";
import { useEffect } from "react";
import { OmniTooltip } from "@/components/ui/omni-tooltip";
import { useProfessionalI18n } from "@/hooks/use-professional-i18n";
import { useAppContext } from "@/lib/context/app-context";

const S_LEVELS = [
  {
    id: "S1",
    name: "S1: 物件識別",
    phase: "探索階段 (Discovery)",
    desc: "自動識別企業邊界內之所有碳排源、水資源點及廢棄物產出位點。",
    status: "已完成",
    score: 98,
    details: "已識別 124 個排放源數據點"
  },
  {
    id: "S2",
    name: "S2: 數據溯源",
    phase: "認證階段 (Authentication)",
    desc: "通過 5T 協議對接原始收據與感測器數據，確保 0% 人為竄改可能。",
    status: "已完成",
    score: 100,
    details: "5T 憑證鏈結完整度 100%"
  },
  {
    id: "S3",
    name: "S3: 基準偏移",
    phase: "分析階段 (Analysis)",
    desc: "比對年度基準線與即時排放數據，自動偵測異常偏移並提供校正建議。",
    status: "進行中",
    score: 75,
    details: "偵測到 3 處能源效率偏移"
  },
  {
    id: "S4",
    name: "S4: 影響力評估",
    phase: "影響評估 (Impact)",
    desc: "結合 GRI/SASB 標準，量化數據對財務與社會面之實質影響力權重。",
    status: "待啟動",
    score: 0,
    details: "等待 S3 數據鎖定後啟動"
  },
  {
    id: "S5",
    name: "S5: 策略建模",
    phase: "戰略規劃 (Strategic)",
    desc: "基於 AI 模擬未來 5 年之減碳路徑，並產出企業永續競爭力評級。",
    status: "未開啟",
    score: 0,
    details: "最終階段評估預計在 Q4 開啟"
  }
];

const ANALYSES_DATA = [
  { name: "Jan", emissions: 400, baseline: 410 },
  { name: "Feb", emissions: 380, baseline: 405 },
  { name: "Mar", emissions: 420, baseline: 400 },
  { name: "Apr", emissions: 390, baseline: 395 },
  { name: "May", emissions: 350, baseline: 390 },
  { name: "Jun", emissions: 340, baseline: 385 },
];

export function ReconnaissanceView() {
  const { lang } = useAppContext();
  const { t } = useProfessionalI18n();
  const [activeLevel, setActiveLevel] = useState("S3");
  const [intelNodes, setIntelNodes] = useState<IIntelNode5T[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltipTheme, setTooltipTheme] = useState<"default" | "cream" | "minimal">("default");

  // Load initial data from API
  useEffect(() => {
    async function fetchIntel() {
      try {
        const res = await fetch("/api/reconnaissance/gateway");
        const data = await res.json();
        if (data.nodes) {
          setIntelNodes(data.nodes);
        }
      } catch (err) {
        console.error("Failed to fetch intel nodes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIntel();
  }, []);

  const handleCapture = async (category: string) => {
    try {
      const res = await fetch("/api/reconnaissance/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          rawData: {
            title: `Capture Event [${category}]`,
            insight: `Captured ${activeLevel} level ${category} intelligence for enterprise auditing.`,
            risk_score: Math.floor(Math.random() * 40) + 30, // Mock score for processing
            source_url: "OMNI_SYSTEM_AGENT"
          }
        })
      });
      const data = await res.json();
      if (data.data) {
        setIntelNodes(prev => [data.data, ...prev]);
        toast.success(`偵察情報已捕獲: ${category}`, {
          description: "數據已存入 5T Vault 並完成加密封裝。"
        });
      }
    } catch (err) {
      toast.error("情報捕獲失敗");
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-24">
      {/* Header Section - Perfectionist Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 p-12 rounded-3xl border border-outline-variant bg-white shadow-2xl relative overflow-hidden group">
        {/* Sentiment Aura Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-full md:w-[500px] h-[500px] bg-primary-teal-start rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-0 bg-transparent rounded-2xl overflow-hidden shadow-minimal flex items-center justify-center min-w-[80px] min-h-[80px]">
              <Image
                src="https://thumbs4.imagebam.com/e5/b8/6c/ME1B44KB_t.png"
                alt="ESGGo Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-stitch-text font-headline uppercase">
                偵情中心
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-primary-teal-start uppercase tracking-[0.3em]">RECONNAISSANCE_NEXUS</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary-teal-start animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
              </div>
            </div>
          </div>
          <p className="text-stitch-muted max-w-2xl font-bold text-sm leading-relaxed border-l-4 border-stone-100 pl-6 py-2">
            全域商業智慧與 ESG 偵察核心。通過 S1-S5 偵察協議，結合深層數據探測與競爭對手動態分析，揭示隱藏風險並掌握市場先機。
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Badge className="px-4 py-2 text-[10px] font-black flex items-center gap-2 bg-surface-container border-outline-variant text-primary-teal-start uppercase tracking-widest font-headline rounded-xl shadow-minimal">
              <Activity className="w-3.5 h-3.5" />
              S3 激活
            </Badge>
            <Badge className="px-4 py-2 text-[10px] font-black flex items-center gap-2 bg-primary-gold/5 border-primary-gold/20 text-primary-gold uppercase tracking-widest font-headline rounded-xl shadow-minimal">
              <Shield className="w-3.5 h-3.5" />
              5T 鎖定
            </Badge>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard variant="liquid" className="p-8 border-primary-teal-start/10 hover:border-primary-teal-start/30 transition-all duration-500 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-teal-start/10 flex items-center justify-center text-primary-teal-start shadow-inner group-hover:bg-primary-teal-start group-hover:text-white transition-all duration-500">
              <Zap className="w-6 h-6" />
            </div>
            <Badge className="bg-primary-teal-start/10 text-primary-teal-start border-none font-black text-[9px] uppercase tracking-widest">實時監控 (Real-time)</Badge>
          </div>
          <span className="text-[11px] font-black text-stitch-muted uppercase tracking-[0.2em] mb-2 block">碳排強度</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-stitch-text tracking-tighter">0.42</h4>
            <span className="text-xs font-black text-stitch-muted uppercase tracking-widest">tCO2e / MLN</span>
          </div>
          <div className="mt-6 h-1 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-full bg-primary-teal-start w-1/2 opacity-30 shadow-[0_0_10px_rgba(13,148,136,0.8)]"
            />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" className="p-8 border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-inner group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
              <Target className="w-6 h-6" />
            </div>
            <Badge className="bg-purple-500/10 text-purple-600 border-none font-black text-[9px] uppercase tracking-widest">SBTi 目標 (SBTi)</Badge>
          </div>
          <span className="text-[11px] font-black text-stitch-muted uppercase tracking-[0.2em] mb-2 block">目標達成率</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-stitch-text tracking-tighter">88.5</h4>
            <span className="text-xs font-black text-stitch-muted uppercase tracking-widest">%</span>
          </div>
          <div className="mt-6 w-full h-2 bg-stone-100/50 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "88.5%" }}
              className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
          </div>
        </GlassCard>

        <GlassCard variant="liquid" className="p-8 border-primary-gold/10 hover:border-primary-gold/30 transition-all duration-500 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-gold/10 flex items-center justify-center text-primary-gold shadow-inner group-hover:bg-primary-gold group-hover:text-white transition-all duration-500">
              <Shield className="w-6 h-6" />
            </div>
            <Badge className="bg-primary-gold/10 text-primary-gold border-none font-black text-[9px] uppercase tracking-widest">UCC 存證封裝</Badge>
          </div>
          <span className="text-[11px] font-black text-stitch-muted uppercase tracking-[0.2em] mb-2 block">數據完整性</span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-stitch-text tracking-tighter">100</h4>
            <span className="text-xs font-black text-stitch-muted uppercase tracking-widest">/ 100</span>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-primary-teal-start" />
            <span className="text-[10px] font-black text-primary-teal-start uppercase tracking-widest">5T 協議驗證通過 (Verified)</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <h3 className="text-[10px] font-black text-stitch-muted/40 uppercase tracking-[0.3em] px-1 font-headline">偵察層級 (S-LEVELS)</h3>
          {S_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setActiveLevel(level.id)}
              className={cn(
                "group flex flex-col gap-3 p-6 rounded-2xl border transition-all text-left relative overflow-hidden shadow-minimal",
                activeLevel === level.id
                  ? "bg-stitch-text text-white border-stitch-text scale-[1.02]"
                  : "bg-white border-outline-variant hover:border-primary-teal-start/50 text-stitch-text"
              )}
            >
              <div className="flex items-center justify-between relative z-10 w-full mb-1">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  activeLevel === level.id ? "text-primary-teal-start" : "text-primary-teal-start"
                )}>
                  {level.id} / {level.phase}
                </span>
                {level.status === "已完成" && (
                  <CheckCircle2 className="w-4 h-4 text-primary-teal-start" />
                )}
                {level.status === "進行中" && (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-xs font-black uppercase tracking-tight leading-tight">{level.name}</span>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full", activeLevel === level.id ? "bg-primary-teal-start shadow-[0_0_8px_rgba(13,148,136,0.6)]" : "bg-stone-200")}
                      initial={{ width: 0 }}
                      animate={{ width: `${level.score}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-black opacity-60 tracking-tighter">{level.score}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="xl:col-span-3">
          <GlassCard className="p-8 border-outline-variant bg-white flex flex-col gap-8 h-full shadow-2xl rounded-3xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <h3 className="text-xl font-black text-stitch-text flex items-center gap-3 font-headline uppercase tracking-tighter">
                  <BarChart3 className="w-6 h-6 text-primary-teal-start" />
                  數據趨勢監測
                </h3>
                <p className="text-[10px] text-stitch-muted font-black mt-2 uppercase tracking-widest opacity-60">
                  追蹤 {activeLevel} 偵察層級之核心指標與基準線之偏移狀況
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Tooltip Theme Selector */}
                <div className="hidden md:flex bg-stone-50 p-1 rounded-lg border border-stone-100">
                  {(["default", "cream", "minimal"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTooltipTheme(t)}
                      className={cn(
                        "px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                        tooltipTheme === t ? "bg-white shadow-sm text-primary-teal-start" : "text-stone-400 hover:text-stone-600"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {/* Existing Legend */}
                <div className="flex items-center gap-6 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-teal-start" />
                    <span className="text-[9px] font-black text-stitch-muted uppercase tracking-widest">實測數值</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span className="text-[9px] font-black text-stitch-muted uppercase tracking-widest">年度基準線</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full mt-4 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYSES_DATA}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }}
                  />
                  <Tooltip
                    content={<OmniTooltip variant={tooltipTheme} />}
                    cursor={{ stroke: 'rgba(13,148,136,0.15)', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="#0D9488"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorEmissions)"
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#CBD5E1"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-stone-100 relative z-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-stitch-muted/40 uppercase tracking-[0.2em] font-headline">{t("standards", "materiality")}</span>
                <div className="bg-stone-50/80 backdrop-blur-sm p-5 rounded-2xl space-y-4 border border-stone-100">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-stitch-text uppercase tracking-tight">{lang === 'zh' ? '範疇二電力穩定減排中' : 'Scope 2 Reduction Stabilizing'}</p>
                      <p className="text-[10px] text-stitch-muted font-bold mt-1">{lang === 'zh' ? '連續三個月排放低於年度基準線 5% 以上。' : 'Emissions below baseline for 3 consecutive months.'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-stitch-text uppercase tracking-tight">{lang === 'zh' ? '輔助數據源同步異常' : 'Auxiliary Data Source Sync Anomaly'}</p>
                      <p className="text-[10px] text-stitch-muted font-bold mt-1">{lang === 'zh' ? 'S3 層級部分感測器斷聯，已自動完成數據插補。' : 'S3 sensor disconnect detected; auto-interpolation active.'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-stitch-muted/40 uppercase tracking-[0.2em] font-headline">{t("matrix", "intel_nodes")}</span>
                <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {loading ? (
                    <div className="text-[10px] font-bold text-stitch-muted animate-pulse">正在同步 5T 數據鏈...</div>
                  ) : intelNodes.length === 0 ? (
                    <div className="text-[10px] font-bold text-stitch-muted opacity-40">尚無存證情報</div>
                  ) : (
                    intelNodes.slice(0, 5).map((node, i) => (
                      <div key={node.uuid || i} className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-col group transition-all duration-300 hover:shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-1.5 h-6 rounded-full", i === 0 ? "bg-primary-teal-start" : "bg-stone-300")} />
                            <div>
                              <p className="text-[10px] font-black text-stitch-text truncate max-w-full md:w-[150px] group-hover:text-primary-teal-start transition-colors">{node.category || "ESG_INTEL"}</p>
                              <p className="text-[8px] text-stitch-muted font-bold">
                                {new Date(node.timestamp * 1000).toISOString().split('T')[0]}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-white border-outline-variant text-[8px] font-black scale-90">Verified</Badge>
                        </div>

                        {/* Hover 展開詳細情報區塊 (CSS Grid 0fr 展開術) */}
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                          <div className="overflow-hidden">
                            <div className="pt-3 mt-2 border-t border-stone-200/50 flex flex-col gap-1.5">
                              <span className="text-[9px] text-stone-500 leading-relaxed font-bold break-words whitespace-pre-wrap">{node.payload.decision_ready_insight || "No detailed intelligence available."}</span>
                              <span className="text-[8px] font-black text-primary-teal-start/70 uppercase tracking-widest">Source: {node.protocol_5T.traceable || "SYSTEM_AGENT"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-stitch-muted/40 uppercase tracking-[0.2em] font-headline">戰略行動 (Strategic Actions)</span>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleCapture("MARKET_RECON")}
                    className="flex items-center justify-between p-4 bg-stitch-text text-white rounded-2xl hover:bg-stone-800 transition-all group shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary-teal-start" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">捕獲情報</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="flex items-center justify-between p-4 bg-white border border-outline-variant text-stitch-text rounded-2xl hover:border-primary-teal-start transition-all group shadow-minimal">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary-gold" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">鎖定基準線</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-stone-300 group-hover:text-primary-teal-start transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
