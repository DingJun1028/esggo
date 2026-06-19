"use client";

import React, { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { NAVIGATION } from "@/lib/config/navigation";
import { useAppContext } from "@/lib/context/app-context";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  LayoutGrid,
  List as ListIcon,
  X
} from "lucide-react";

export function FeatureMapView() {
  const { lang } = useAppContext();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out features with less than 80% completion as requested
  const visibleFeatures = useMemo(() => {
    return NAVIGATION.filter(item => {
      const label = item.label[lang] || item.label.en || item.label.zh;
      const matchesSearch = label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return item.completion >= 80 && matchesSearch;
    });
  }, [lang, searchQuery]);

  const [selectedFeature, setSelectedFeature] = useState<typeof NAVIGATION[0] | null>(null);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-stitch-text tracking-tight mb-2 uppercase">
            平台導航 <span className="text-stitch-muted font-normal">/ Feature Map</span>
          </h1>
          <p className="text-stitch-muted font-medium">
            全平台功能地圖，直觀顯示模組完成度與狀態。
            <span className="text-stitch-critical ml-2 font-bold uppercase tracking-widest text-[10px]">
              (完成度需達 80% 以上)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stitch-muted" />
            <input
              type="text"
              placeholder="搜尋功能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-black/5 rounded-lg text-xs font-bold text-stitch-text focus:outline-none focus:border-stitch-teal-start transition-all uppercase tracking-widest shadow-minimal"
            />
          </div>
          <div className="flex bg-white rounded-lg border border-black/5 p-1 shadow-minimal">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-stitch-teal-start text-white shadow-sm" : "text-stitch-muted hover:bg-stitch-shallow-gray"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List View"
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-stitch-teal-start text-white shadow-sm" : "text-stitch-muted hover:bg-stitch-shallow-gray"}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFeatures.map((item, index) => {
            const Icon = item.icon;
            const isReady = item.completion === 100;
            const version = isReady ? `v1.1.${index + 1}` : `v0.9.${index + 1}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedFeature(item)}
              >
                <GlassCard className={cn(
                  "p-6 h-full flex flex-col hover:border-stitch-teal-start/30 transition-all group cursor-pointer relative overflow-hidden",
                  isReady && "after:absolute after:inset-0 after:bg-stitch-teal-start/[0.02] after:pointer-events-none"
                )}>
                  {isReady && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-stitch-teal-start/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-stitch-teal-start/10 flex items-center justify-center text-stitch-teal-start group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest mb-1">Completion</p>
                      <p className={`text-xl font-black ${isReady ? "text-stitch-optimal" : "text-stitch-teal-start"}`}>
                        {item.completion}%
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-stitch-text mb-1 uppercase tracking-tight">
                      {item.label[lang] || item.label.en || item.label.zh}
                    </h3>
                    <p className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest mb-4">
                      ID: {item.id}
                    </p>

                    <div className="w-full bg-stitch-shallow-gray rounded-full h-1.5 mb-6">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.completion}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-1.5 rounded-full ${isReady ? "bg-stitch-optimal" : "bg-gradient-to-r from-stitch-teal-start to-stitch-teal-end"}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/5">
                    <Badge
                      variant={isReady ? "optimal" : "critical"}
                      styleType="soft"
                      className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5"
                    >
                      {isReady ? (
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Ready</span>
                      ) : (
                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> In Development</span>
                      )}
                    </Badge>
                    <span className="text-[8px] font-bold text-stitch-muted uppercase tracking-widest">
                      {version}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-stitch-shallow-gray/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-stitch-muted uppercase tracking-widest">Feature</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stitch-muted uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stitch-muted uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stitch-muted uppercase tracking-widest">Completion</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stitch-muted uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {visibleFeatures.map((item, index) => {
                  const Icon = item.icon;
                  const isReady = item.completion === 100;
                  return (
                    <tr key={item.id} className="hover:bg-stitch-bg transition-colors group cursor-pointer" onClick={() => setSelectedFeature(item)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-stitch-teal-start/10 flex items-center justify-center text-stitch-teal-start">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-stitch-text uppercase tracking-tight">
                            {item.label[lang] || item.label.en || item.label.zh}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[10px] font-bold text-stitch-muted bg-stitch-shallow-gray px-2 py-1 rounded">
                          {item.id}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={isReady ? "optimal" : "critical"}
                          styleType="soft"
                          className="text-[8px] font-bold uppercase tracking-widest"
                        >
                          {isReady ? "Ready" : "In Dev"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-stitch-shallow-gray rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${isReady ? "bg-stitch-optimal" : "bg-stitch-teal-start"}`}
                              style={{ width: `${item.completion}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-stitch-text">{item.completion}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] font-bold text-stitch-teal-start hover:underline uppercase tracking-widest">
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Hidden Features Summary */}
      <div className="p-6 rounded-lg border border-dashed border-black/10 bg-stitch-shallow-gray/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-stitch-muted" />
          <p className="text-xs font-bold text-stitch-muted uppercase tracking-widest">
            {NAVIGATION.length - visibleFeatures.length} 個隱藏模組（完成度未達 80%），已根據安全過濾機制隱藏。
          </p>
        </div>
        <Badge variant="critical" styleType="soft" className="text-[8px] font-bold uppercase tracking-widest">
          Security Filter Active
        </Badge>
      </div>

      {/* Feature Details Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedFeature(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-stitch-teal-start/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 p-2 text-stitch-muted hover:text-stitch-text hover:bg-stitch-shallow-gray rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-stitch-teal-start/10 flex items-center justify-center text-stitch-teal-start shadow-inner">
                  {React.createElement(selectedFeature.icon, { className: "w-10 h-10" })}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={selectedFeature.completion === 100 ? "optimal" : "critical"} className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1">
                      {selectedFeature.category || "General"}
                    </Badge>
                    <span className="text-[10px] text-stitch-muted font-bold uppercase tracking-widest">ID: {selectedFeature.id}</span>
                  </div>
                  <h2 className="text-3xl font-black text-stitch-text tracking-tighter uppercase">
                    {selectedFeature.label[lang] || selectedFeature.label.en || selectedFeature.label.zh}
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-stitch-muted uppercase tracking-[0.3em] mb-3 px-1">Functional Impact / 功能影響力</h4>
                  <p className="text-sm font-medium text-stitch-text leading-relaxed bg-stitch-shallow-gray/30 p-6 rounded-2xl border border-black/5 italic">
                    &quot;此模組旨在優化企業在永續發展路徑中的數據精準度與決策透明度。透過 5T 誠信協議，確保每一筆 ESG 數據均具備可追溯性與國際合規標準。&quot;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-stitch-bg rounded-2xl border border-black/5">
                    <p className="text-[8px] font-black text-stitch-muted uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-stitch-text">{selectedFeature.completion === 100 ? "Ready for Production" : "Active Development"}</p>
                  </div>
                  <div className="p-5 bg-stitch-bg rounded-2xl border border-black/5">
                    <p className="text-[8px] font-black text-stitch-muted uppercase tracking-widest mb-1">Architecture</p>
                    <p className="text-sm font-bold text-stitch-text">Matrix Architecture v1.0</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFeature(null)}
                  className="w-full py-4 bg-stitch-text text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  Confirm & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
