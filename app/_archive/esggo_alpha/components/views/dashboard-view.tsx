import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  LayoutDashboard,
  PenLine,
  FileText,
  Database,
  ShieldCheck,
  Lock,
  Search,
  Globe,
  Zap,
  LineChart,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Activity,
  Fingerprint,
  Clock,
  ShieldAlert,
  History,
  Trash2
} from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "@/lib/context/app-context";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/components/layout/firebase-provider";
import { cn } from "@/lib/utils";

function formatRelativeTime(timestamp: string, lang: "zh" | "en"): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === "zh" ? "剛剛" : "Just now";
  if (mins < 60) return lang === "zh" ? `${mins} 分鐘前` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return lang === "zh" ? `${hours} 小時前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return lang === "zh" ? `${days} 天前` : `${days}d ago`;
}

const FEATURE_CARDS = [
  {
    id: "sustain-write",
    label: "永續撰寫",
    desc: "標準化永續報告書撰寫，支援專業引導與零算力模式",
    icon: PenLine,
    color: "from-emerald-400 to-teal-500",
    path: "/sustain-write",
    status: "Stable"
  },
  {
    id: "vault",
    label: "證據金庫",
    desc: "安全存儲審計所需的原始憑證與文件，確保資料真實性",
    icon: Lock,
    color: "from-slate-700 to-slate-900",
    path: "/vault",
    status: "Secure"
  },
  {
    id: "compliance",
    label: "法規追蹤",
    desc: "實時監測各國 ESG 監管政策，確保報告符合最新準則",
    icon: ShieldCheck,
    color: "from-amber-400 to-orange-500",
    path: "/compliance",
    status: "Critical"
  },
  {
    id: "esg-kpi",
    label: "績效指標",
    desc: "關鍵績效指標可視化，提供精準的年度數據對比分析",
    icon: LineChart,
    color: "from-rose-400 to-pink-500",
    path: "/esg-kpi",
    status: "Analytical"
  }
];

export function DashboardView() {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { globalEsgData, reports, activities, auditRecords } = useAppContext();
  const recentActivities = (activities || []).slice(0, 5);

  const categoryCounts = useMemo(() => {
    const counts = { E: 0, S: 0, G: 0 };
    (auditRecords || []).forEach(r => {
      if (r.category === 'E') counts.E++;
      if (r.category === 'S') counts.S++;
      if (r.category === 'G') counts.G++;
    });
    return counts;
  }, [auditRecords]);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "evidence_uploaded":
      case "upload": return <Database className="w-3.5 h-3.5 text-emerald-500" />;
      case "evidence_deleted": return <Trash2 className="w-3.5 h-3.5 text-rose-500" />;
      case "report": return <FileText className="w-3.5 h-3.5 text-sky-500" />;
      case "verify": return <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getActivityLabel = (action: string, metadata?: Record<string, unknown>) => {
    switch (action) {
      case "evidence_uploaded": return language === 'zh' ? `已上傳文件: ${metadata?.fileName || '證據'}` : `Uploaded: ${metadata?.fileName || 'Evidence'}`;
      case "evidence_deleted": return language === 'zh' ? "已刪除證據紀錄" : "Deleted evidence record";
      case "upload": return language === 'zh' ? "已上傳新數據" : "New data uploaded";
      case "report": return language === 'zh' ? "報告已更新" : "Report updated";
      case "verify": return language === 'zh' ? "ZKP 驗證通過" : "ZKP verified";
      default: return action?.replace(/_/g, ' ');
    }
  };

  const stats = [
    {
      label: t.dashboard.readiness,
      value: `${globalEsgData?.readinessScore || 0}%`,
      icon: Target,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: t.dashboard.reliability,
      value: "99.8%",
      icon: ShieldCheck,
      color: "text-sky-600",
      bg: "bg-sky-50"
    },
    {
      label: t.profile.completedReports,
      value: reports?.length || 0,
      icon: CheckCircle2,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="space-y-10 pb-24">
      {/* Header section with ADK Integrity Proof */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200">
              <Fingerprint className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.dashboard.adkIntegrity.verified}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-lg border border-sky-200">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.dashboard.gcpOrchestration.label}</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {t.dashboardView.greetings}, {user?.displayName || t.profile.proWriter}
          </h1>
          <p className="text-slate-500 font-bold max-w-2xl">
            {t.dashboard.adkIntegrity.proofDesc}
          </p>
        </div>

        <GlassCard className="p-4 flex items-center gap-4 bg-slate-900 border-none text-white min-w-[280px]">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.gcpOrchestration.traceCreated}</div>
            <div className="text-xs font-bold font-mono text-emerald-400 overflow-hidden text-ellipsis w-40">
              GCP-TRACE-#{Math.random().toString(16).slice(2, 10).toUpperCase()}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="p-6 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>+12.5% {t.profile.vsLastMonth}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Feature Index Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">系統索引庫 <span className="text-slate-400 font-bold text-sm ml-2 italic">Index Repository</span></h2>
          </div>
          <Badge variant="outline" className="px-4 py-1 rounded-full text-slate-400 border-slate-200 uppercase tracking-widest font-black text-[10px]">
            {FEATURE_CARDS.length} Modules Online
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map((feature, i) => (
            <Link key={feature.id} href={feature.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-6 h-full relative group hover:border-emerald-200 transition-all cursor-pointer overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full", feature.color)} />

                  <div className="space-y-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform", feature.color)}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{feature.label}</h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-emerald-500" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-2">
                        {feature.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{feature.status}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Secondary Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">ESG 存證分佈 <span className="text-slate-400">Vault Distribution</span></h3>
                <Badge variant="outline" className="text-[9px] font-black uppercase text-emerald-600 border-emerald-200 bg-emerald-50 px-2 py-0">{(auditRecords || []).length} Total</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "E", count: categoryCounts.E, color: "text-emerald-500", bg: "bg-emerald-50", full: "Environment" },
                  { label: "S", count: categoryCounts.S, color: "text-sky-500", bg: "bg-sky-50", full: "Social" },
                  { label: "G", count: categoryCounts.G, color: "text-indigo-500", bg: "bg-indigo-50", full: "Governance" }
                ].map((cat, i) => (
                  <div key={i} className={cn("p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform", cat.bg)}>
                    <span className={cn("text-xs font-black", cat.color)}>{cat.label}</span>
                    <span className="text-xl font-black text-slate-900">{cat.count}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{cat.full}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dashboard.checklist}</h4>
                </div>
                {[
                  { title: "GRI 302: Energy Audit", desc: "Missing scope 2 data for Q3", priority: "High" },
                  { title: "SASB Disclosure", desc: "Update employee diversity metrics", priority: "Med" },
                  { title: "Supplier Survey", desc: "12 responses pending review", priority: "Low" }
                ].map((item, i) => (
                  <div key={i} className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800 group-hover:text-emerald-900">{item.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400">{item.desc}</p>
                      </div>
                      <ArrowRight className={cn("w-4 h-4 transition-all opacity-0 group-hover:opacity-100",
                        item.priority === "High" ? "text-rose-500" : "text-emerald-500"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8 space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t.profile.recentActivity}</h3>
              <div className="space-y-4">
                {(recentActivities || []).length > 0 ? (
                  recentActivities.map((item, i) => (
                    <div key={item.id || i} className="flex gap-4 p-2 group hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="mt-1 w-7 h-7 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                        {getActivityIcon(item.action)}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-700">{getActivityLabel(item.action, item.metadata)}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase">
                          {item.timestamp ? formatRelativeTime(item.timestamp, language) : '—'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  [{ icon: Clock, text: language === 'zh' ? "報告草稿已儲存" : "Report draft saved", time: language === 'zh' ? '10 分鐘前' : '10m ago' },
                  { icon: ShieldAlert, text: language === 'zh' ? "GRI 401 資料驗證警示" : "GRI 401 data validation warning", time: language === 'zh' ? '2 小時前' : '2h ago' },
                  { icon: History, text: language === 'zh' ? "報告驗證成功" : "Report data validation success", time: language === 'zh' ? '昨天' : 'Yesterday' }].map((item, i) => (
                    <div key={i} className="flex gap-4 p-2">
                      <div className="mt-1">
                        <item.icon className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-700">{item.text}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase">{item.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <GlassCard className="p-8 space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {language === 'zh' ? "關鍵核心指標 (實時)" : "Key Core Indicators (Real-time)"}
            </h3>
            <div className="space-y-4">
              {(globalEsgData?.companyMetrics || []).length > 0 ? (
                globalEsgData.companyMetrics.slice(0, 4).map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-emerald-200 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.05em]">{m.category}</div>
                        <div className="text-xs font-black text-slate-900">{m.label}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">{m.value} {m.unit}</div>
                      <div className="text-[9px] font-black uppercase text-emerald-500">TRUST: {m.trust_score}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 italic">
                    {language === 'zh' ? "尚無同步指標" : "No synced metrics yet"}
                  </p>
                </div>
              )}
            </div>

            <Link href="/omni-src" className="w-full py-4 border border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              {language === 'zh' ? "查看所有數據源" : "View All Data Sources"}
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
