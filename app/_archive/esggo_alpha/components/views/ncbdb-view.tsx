"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Search,
  Plus,
  Filter,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Lock
} from "lucide-react";
import { motion } from "motion/react";

import { useAppContext } from "@/lib/context/app-context";
import { useTranslation } from "@/lib/i18n";

const DATA_NODES = [
  { id: "NODE-8801", name: "員工多樣性比例 (DEI)", category: "Social", trust: 99.4, status: "Locked" },
  { id: "NODE-8802", name: "供應鏈人權政策審核", category: "Social", trust: 98.2, status: "Locked" },
  { id: "NODE-8803", name: "董事會獨立董事比例", category: "Governance", trust: 100, status: "Locked" },
  { id: "NODE-8804", name: "職業安全訓練時數", category: "Social", trust: 96.5, status: "In-Progress" },
  { id: "NODE-8805", name: "反貪腐政策宣導覆蓋率", category: "Governance", trust: 99.8, status: "Locked" },
];

export function NCBDBView() {
  const { globalEsgData } = useAppContext();
  const { t, language } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            {t.ncbdb.title}
            <Badge variant="optimal" styleType="soft" className="text-[10px]">5T + ZKP {language === 'zh' ? '啟用' : 'Active'}</Badge>
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-slate-500 max-w-2xl leading-relaxed">
            {language === 'zh' ? '管理非碳節點。寫入均通過 Hash Lock 與 ZKP 處理。' : 'Manage non-carbon nodes. Writes secured via Hash Lock and ZKP.'}
            <br />
            {language === 'zh' ? '目前已存證' : 'Proofed'} <span className="text-emerald-600 font-bold">{globalEsgData.linkedSourcesCount}</span> {language === 'zh' ? '個關鍵指標' : 'metrics'}.
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
          <button
            aria-label="篩選節點"
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-[0.98]">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            {language === 'zh' ? "篩選" : "Filter"}
          </button>
          <button
            aria-label="建立新節點"
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#009E9D] text-white rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#009E9D]/20">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            {language === 'zh' ? "建立節點" : "New Node"}
          </button>
        </div>
      </div>

      <GlassCard className="p-1 px-4 bg-white/50 border-slate-100" role="search">
        <div className="relative">
          <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="搜尋節點、Hash 或編號..."
            aria-label="搜尋數據節點"
            className="w-full bg-transparent border-none focus:ring-0 pl-7 pr-2 py-3 text-xs md:text-sm font-medium placeholder:text-slate-400"
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {DATA_NODES.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <GlassCard className="p-4 md:p-6 hover:border-[#009E9D]/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#009E9D]/5 transition-colors shadow-inner">
                    <Database className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-[#009E9D]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] md:text-[10px] font-black text-[#009E9D] uppercase tracking-widest">{node.id}</span>
                      <Badge variant="outline" className="text-[8px] uppercase tracking-tighter py-0 px-1 whitespace-nowrap">{node.category}</Badge>
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-slate-800 truncate">{node.name}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100/50">
                  <div className="text-right">
                    <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Trust</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-black text-slate-900 tabular-nums">{node.trust}%</span>
                      <div className="w-12 md:w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#009E9D] to-[#219EBC]" style={{ width: `${node.trust}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-slate-100 bg-slate-50/50">
                    {node.status === 'Locked' ? (
                      <Lock className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#009E9D]" />
                    ) : (
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                    <span className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest">{node.status}</span>
                  </div>

                  <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 active:scale-90 transition-transform">
                    <Tag className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 md:mt-12 space-y-4 md:space-y-6 mb-20 md:mb-12">
        <h2 className="text-[10px] md:text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#009E9D]" />
          5T + ZKP 完整性校驗
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {[
            { label: "Traceable", desc: "數據鏈結完整率 100%", status: "Optimal" },
            { label: "Trustworthy", desc: "Hash Lock 無偏移", status: "Active" },
            { label: "Privacy", desc: "ZKP 脫敏校核完成", status: "Verified" }
          ].map((check, i) => (
            <GlassCard key={i} className="p-5 md:p-6 border-[#009E9D]/10 hover:border-[#009E9D]/20 transition-all">
              <div className="flex items-center gap-3 mb-2 md:mb-3">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#009E9D]" />
                <h4 className="text-sm md:text-base font-bold text-slate-800">{check.label}</h4>
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 mb-4 md:mb-4 font-medium">{check.desc}</p>
              <Badge variant="optimal" styleType="soft" className="text-[8px] md:text-[10px] uppercase tracking-wider">{check.status}</Badge>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
