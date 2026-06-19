"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  ArrowRight,
  Clock,
  ExternalLink,
  Lock
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { translations, type TranslationKey } from "@/lib/i18n";
import type { ComplianceIndicator } from "@/types";
import { getComplianceIndicators } from "@/lib/compliance-engine";

const CATEGORY_MAP: Record<string, keyof TranslationKey['compliance']['category']> = {
  'E': 'env',
  'S': 'soc',
  'G': 'gov'
};

export function ComplianceTrackerView() {
  const { globalEsgData, setActiveView, setActiveSubView, language, auditRecords } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const T = translations[language].compliance;
  const Tcommon = translations[language].common;

  // Dynamic indicators based on 5T Audit Records
  const dynamicIndicators = useMemo(() => {
    // We treat 'Verified' records as verified nodes
    const verifiedNodes = auditRecords
      .filter(r => r.zkpStatus === "Verified" || r.zkpStatus === "Synced")
      .map(r => r.category || 'ALL');

    if (auditRecords.length > 0) {
      verifiedNodes.push('ALL');
    }

    return getComplianceIndicators(verifiedNodes as string[], 'TaiwanFSC');
  }, [auditRecords]);

  const getIndicatorDetail = (id: string) => {
    const detailsZh: Record<string, { title: string, req: string, desc: string }> = {
      "E1-1": { title: "碳盤查與溫室氣體排放量", req: "金管會強制揭露", desc: "須依據 ISO 14064-1 或 GHG Protocol 進行盤查。" },
      "E1-2": { title: "能源消耗與能源效率", req: "金管會強制揭露", desc: "包含用電量、燃料使用量等數據，並揭露節能目標。" },
      "S2-1": { title: "員工教育訓練與發展", req: "指標查驗", desc: "揭露整體員工教育訓練時數、訓練類型及覆蓋率。" },
      "G3-1": { title: "董事會多元化與獨立性", req: "法律合規", desc: "獨立董事席次須達一定比例，且具備多元背景。" },
      "E2-4": { title: "廢棄物集體管理", req: "產業標準", desc: "統計有害及無害廢棄物產生量，並敘明減量計畫。" },
      "S1-5": { title: "職業安全與健康規範", req: "標準查核", desc: "揭露職安衛管理系統涵蓋率及職業災害相關數據。" },
    };
    const detailsEn: Record<string, { title: string, req: string, desc: string }> = {
      "E1-1": { title: "GHG Emissions & Carbon Inventory", req: "FSC Mandatory", desc: "Inventory per ISO 14064-1/GHG Protocol." },
      "E1-2": { title: "Energy Consumption & Efficiency", req: "FSC Mandatory", desc: "Electricity/fuel usage with saving targets." },
      "S2-1": { title: "Employee Training & Development", req: "Verification", desc: "Training hours, types, and coverage rate." },
      "G3-1": { title: "Board Diversity & Independence", req: "Legal Compliance", desc: "Required independent director ratio." },
      "E2-4": { title: "Waste Management", req: "Industry Standard", desc: "Waste generation and reduction plans." },
      "S1-5": { title: "Occupational Health & Safety", req: "Audit", desc: "OHS coverage and accident data." },
    };
    return language === 'zh' ? detailsZh[id] : detailsEn[id];
  };

  const filteredIndicators = useMemo(() =>
    dynamicIndicators.filter(item => {
      const detail = getIndicatorDetail(item.id);
      const matchesSearch =
        detail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "all" || item.category === filter;
      return matchesSearch && matchesFilter;
    }),
    [searchQuery, filter, language, dynamicIndicators]);

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      "completed": T.completed,
      "inProgress": T.inProgress,
      "missing": T.missing,
      "notStarted": T.notStarted,
    };
    return map[status] ?? status;
  };

  const badgeVariant = (status: string) => {
    if (status === "completed") return "optimal" as const;
    if (status === "missing") return "danger" as const;
    return "warning" as const;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 min-h-[calc(100vh-200px)]">
      {/* Search and Filters moved to dynamic area or PageHeader actions if needed, but for now we keep it simple */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full justify-end">
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={T.searchPlaceholder}
            className="w-full md:w-56 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#009E9D]/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shrink-0">
          {["all", "E", "S", "G"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 md:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                filter === f ? "bg-[#009E9D] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {f === "all" ? T.allFilter : f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <GlassCard className="p-4 md:p-6 bg-emerald-50/30 border-emerald-100 flex items-center gap-3 md:gap-4 transition-transform active:scale-95 cursor-default">
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">
              {Math.round((globalEsgData.complianceRate / 100) * 97)} / 97
            </div>
            <div className="text-[9px] md:text-xs text-slate-500 font-medium mt-1">{T.completedCount}</div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 md:p-6 bg-rose-50/30 border-rose-100 flex items-center gap-3 md:gap-4 transition-transform active:scale-95 cursor-default">
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">4 {translations[language].common.items}</div>
            <div className="text-[9px] md:text-xs text-slate-500 font-medium mt-1">{T.gapCount}</div>
          </div>

        </GlassCard>

        <GlassCard className="p-4 md:p-6 bg-[#009E9D]/5 border-[#009E9D]/10 flex items-center gap-3 md:gap-4 col-span-2 md:col-span-1 transition-transform active:scale-95 cursor-default">
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#009E9D]/10 flex items-center justify-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#009E9D]" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">{globalEsgData.complianceRate}%</div>
            <div className="text-[9px] md:text-xs text-slate-500 font-medium mt-1">{T.overallCompliance}</div>
          </div>
        </GlassCard>
      </div>

      {/* Indicator List */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {filteredIndicators.map((item, idx) => {
          const detail = getIndicatorDetail(item.id);
          const categoryKey = CATEGORY_MAP[item.category];
          const categoryLabel = T.category[categoryKey];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="relative z-10 hover:z-50"
            >
              <GlassCard className="p-4 md:p-5 hover:border-[#009E9D]/30 transition-all group overflow-visible">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-xs md:text-sm shadow-xl ring-1 ring-inset",
                      item.category === 'E' ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" :
                        item.category === 'S' ? "bg-blue-500/10 text-blue-600 ring-blue-500/20" :
                          "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                    )}>
                      {item.id}
                    </div>
                    <div className="space-y-1.5 md:space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base md:text-xl font-black text-slate-900 tracking-tight leading-none">{detail.title}</h3>
                        <Badge variant={badgeVariant(item.status)} styleType="solid" className="text-[9px] uppercase tracking-[0.15em] font-black px-2 py-0.5">
                          {statusLabel(item.status)}
                        </Badge>
                        <div className="relative group/tooltip">
                          <Badge variant="outline" className="text-[8px] md:text-[10px] font-bold text-slate-400 whitespace-nowrap cursor-help bg-slate-50/50">
                            {detail.req}
                          </Badge>
                          {detail.desc && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover/tooltip:translate-y-0 bg-slate-900 text-white text-[10px] font-bold rounded-xl p-3 z-[100] w-56 text-center shadow-2xl ring-1 ring-white/10">
                              {detail.desc}
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-slate-900 border-r-[6px] border-r-transparent"></div>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-[8px] md:text-[10px] font-black text-emerald-600 border-emerald-500/20 bg-emerald-50/50 uppercase tracking-widest">
                          {categoryLabel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          {T.locked5T}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="truncate">2026-03-10 {Tcommon.edit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex-1 lg:flex-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase lg:hidden">Progress</span>
                        <span className="text-[10px] md:text-sm font-bold text-slate-700 tabular-nums">{item.progress}%</span>
                      </div>
                      <div className="w-full lg:w-24 h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all duration-700", item.progress === 100 ? "bg-[#009E9D]" : item.progress < 50 ? "bg-rose-500" : "bg-[#009E9D]/60")}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className={cn(
                      "px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap",
                      item.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                        item.status === 'missing' ? "bg-rose-100 text-rose-600 animate-pulse border border-rose-200" : "bg-slate-100 text-slate-500"
                    )}>
                      {statusLabel(item.status)}
                    </div>

                    <button
                      onClick={() => {
                        setActiveView("sustain-write");
                        setActiveSubView("editor");
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 group-hover:text-[#009E9D] transition-all active:scale-95"
                    >
                      <ArrowRight className="w-5 h-5 md:hidden" />
                      <span className="hidden md:inline font-bold text-xs uppercase tracking-widest mr-1">
                        {translations[language].common.edit}
                      </span>
                      <ArrowRight className="w-5 h-5 hidden md:block" />
                    </button>

                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* AI Diagnosis Card */}
      <div className="mt-8 md:mt-12 mb-20 md:mb-12">
        <GlassCard className="p-6 md:p-8 bg-slate-900 text-white border-none overflow-hidden relative shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-24 h-24 md:w-32 md:h-32" />
          </div>
          <div className="relative z-10 space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-1.5 h-4 md:w-2 md:h-6 bg-[#009E9D] rounded-full" />
              <h2 className="text-base md:text-xl font-bold italic tracking-tight">{T.aiDiagnosis}</h2>
            </div>
            <p className="text-xs md:text-base text-white/70 max-w-2xl leading-relaxed">
              {T.aiDiagnosisDetail}
            </p>

            <button
              onClick={() => {
                setActiveView("sustain-write");
                setActiveSubView("ai-assist");
              }}
              className="flex items-center justify-center gap-2 text-xs md:text-sm text-[#009E9D] font-bold group bg-white/5 py-2.5 px-6 rounded-xl w-full md:w-auto hover:bg-white/10 active:scale-[0.98] transition-all"
            >
              {T.viewPlan} <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
