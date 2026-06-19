"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Search,
  Layers,
  Brain,
  Users,
  Shield,
  ChevronRight,
  Lightbulb,
  Code,
  Database,
  Lock,
  Activity,
  Zap,
  Network,
  Share2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/context/app-context";
import { Button } from "@/components/ui/button";

const MECE_FRAMEWORK = [
  {
    title: "一、內文與數據基礎輸入層",
    items: [
      { id: "structured", name: "結構化數據導入", desc: "將非格式化文本轉換為可維護的結構化數據點，確保數據溯源性。", tech: "NLP 分詞、數據特徵提取、正則清洗", scenario: "掃描供應商報表時，AI 自動識別並提取『碳排放量』至數據庫。" },
      { id: "unstructured", name: "非結構化內容輸入", desc: "支持隨選隨寫、跨媒體素材的快速記錄與儲存。", tech: "Transformer 雙向編碼器、多模態索引", scenario: "錄入會議紀錄草稿，AI 自動分析其與現有 ESG 政策的關聯度。" },
      { id: "multimodal", name: "多模態感官整合", desc: "整合影像、語音與異質來源的憑證內容。", tech: "視覺識別 (OCR)、語意相似度檢索", scenario: "拍攝廢棄物聯單，自動關聯至 GitHub 異動紀錄並生成審核日誌。" }
    ]
  },
  {
    title: "二、知識連結與分類管理層",
    items: [
      { id: "taxonomy", name: "分類與標籤體系", desc: "基於行業標準的多維度標籤與層級化管理。", tech: "動態樹狀結構、元數據管理器", scenario: "將專案標記為『GRI 準則 305』，系統自動關聯相關的所有排放源清單。" },
      { id: "graph", name: "語意地圖連結", desc: "建立不同知識點之間的深層關聯圖譜。", tech: "圖形數據庫 (Neo4j)", scenario: "點擊『溫室氣體』節點，展開與其相關的供應鏈、政策及驗證徽章地圖。" },
      { id: "search", name: "智慧搜尋與探索", desc: "基於全文檢索與向量偏移的智慧查詢。", tech: "Elasticsearch + Pinecone 向量檢索", scenario: "搜尋『如何減碳』時，系統自動推薦最匹配的內部成功案例與行業對標報告。" }
    ]
  },
  {
    title: "三、智慧推論與價值增值層",
    items: [
      { id: "generation", name: "報告生成與摘要", desc: "基於現有知識點進行生成式內容輸出。", tech: "RAG (Retrieval-Augmented Generation)", scenario: "指令：『彙整本年度廢棄物減量成效』，AI 根據筆記內容生成 5T 報告初稿。" },
      { id: "reasoning", name: "策略推論與建議", desc: "基於數據趨勢的深度邏輯分析與優化路徑。", tech: "邏輯推導引擎、因果分析算法", scenario: "AI 偵測到數據偏移，自動推論：『由於電力係數更新，建議優先調整範疇二運算策略』。" },
      { id: "agent", name: "自動化助理代理", desc: "主動式的 AI 作業導航與任務自動化。", tech: "動態任務規劃 + 工具調用鏈", scenario: "設置『合規監控』，系統自動檢查資料完整性並在發現缺漏時發送提醒通知。" }
    ]
  }
];

export function OmniNoteView() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { savedDrafts } = useAppContext();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-stitch-text tracking-tighter">
              永續筆記 (Omni-Note)
            </h1>
            <Badge
              variant="optimal"
              styleType="soft"
              className="bg-stitch-teal-start/10 text-stitch-teal-start border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest"
            >
              WuzuoNote - 5T 智慧永續鏈
            </Badge>
          </div>
          <p className="text-stitch-muted font-medium text-lg">
            數據來源的守護者 (The Source) — 記錄、鏈接、推論，讓每一筆數據都具備生命力。
          </p>
        </div>
      </div>

      {/* Omni-Core Section */}
      <GlassCard className="p-10 border-black/5 stitch-glass overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#8B5CF6]/5 to-transparent pointer-events-none" />

        <div className="flex items-center gap-6 mb-10 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-[#8B5CF6]/10 flex items-center justify-center">
            <Brain className="w-9 h-9 text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stitch-text tracking-tight">
              永續核心 (Omni-Core)
            </h2>
            <p className="text-stitch-muted font-bold text-sm uppercase tracking-widest mt-1">
              由 JunAiKey 驅動的數據聯網與跨視圖存取中心
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-white/50 p-8 rounded-[2rem] border border-black/5 shadow-minimal hover:shadow-minimal transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="text-xl font-black text-stitch-text mb-3">共享語意存儲 (Shared Memory)</h4>
            <p className="text-sm text-stitch-muted leading-relaxed font-medium">
              打破視圖間的數據孤島，使『筆記內容』、『報告草稿』與『5T 憑證』在底層實現語意互通。一次錄入，全平台智慧引用。
            </p>
          </div>

          <div className="bg-white/50 p-8 rounded-[2rem] border border-black/5 shadow-minimal hover:shadow-minimal transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-black text-stitch-text mb-3">協同推理引擎 (Synergistic Reasoning)</h4>
            <p className="text-sm text-stitch-muted leading-relaxed font-medium">
              整合多元數據維度，透過 RAG 技術進行實時關聯分析。當您錄入新的碳排數據，系統將自動推算其對整體減碳目標的貢獻度。
            </p>
          </div>
        </div>
      </GlassCard>

      {/* MECE Framework Layout */}
      <GlassCard className="p-10 border-black/5 stitch-glass">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-3xl bg-stitch-teal-start/10 flex items-center justify-center">
            <Layers className="w-9 h-9 text-stitch-teal-start" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stitch-text tracking-tight">
              MECE 指導框架矩陣
            </h2>
            <p className="text-stitch-muted font-bold text-sm uppercase tracking-widest mt-1">
              不重複、不遺漏 (Mutually Exclusive, Collectively Exhaustive) 的永續知識體系
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {MECE_FRAMEWORK.map((layer, idx) => (
            <div key={idx} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-stitch-text text-white flex items-center justify-center text-sm font-black italic">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-black text-stitch-text tracking-tight">{layer.title}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {layer.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white/40 p-8 rounded-[2rem] border border-black/5 shadow-minimal hover:border-stitch-teal-start/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-stitch-shallow-gray flex items-center justify-center group-hover:bg-stitch-teal-start/10 transition-colors">
                        <Activity className="w-6 h-6 text-stitch-muted group-hover:text-stitch-teal-start" />
                      </div>
                      <Badge variant="optimal" styleType="soft" className="px-2 py-0 text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        View Detail
                      </Badge>
                    </div>
                    <h4 className="text-xl font-black text-stitch-text mb-3 group-hover:text-stitch-teal-start transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-sm text-stitch-muted font-bold leading-relaxed mb-8">
                      {item.desc}
                    </p>
                    <div className="flex items-center text-[10px] font-black text-stitch-teal-start uppercase tracking-widest">
                      Explore Framework <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Saved Drafts Integration */}
      {savedDrafts && Object.keys(savedDrafts).length > 0 && (
        <GlassCard className="p-10 border-black/5 stitch-glass bg-gradient-to-br from-amber-50/30 to-white">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center">
              <FileText className="w-9 h-9 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-stitch-text tracking-tight">
                嚮導保存之草稿 (Shared Drafts)
              </h2>
              <p className="text-stitch-muted font-bold text-sm uppercase tracking-widest mt-1">
                這些是您在『指南流程』中暫存的關鍵數據筆記
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(savedDrafts).map(([chapter, draft]: [string, any], idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-minimal flex flex-col group transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-black text-stitch-text flex items-center gap-3">
                    <Book className="w-5 h-5 text-amber-500" />
                    {chapter}
                  </h4>
                  <Badge variant="optimal" styleType="soft" className="text-[9px] font-black uppercase bg-stone-100 border-none">
                    Modified: {new Date(draft.lastModified).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="text-sm text-stitch-muted font-medium whitespace-pre-wrap max-h-[160px] overflow-y-auto bg-stone-50/50 p-5 rounded-2xl border border-dotted border-stone-200 font-mono flex-1 leading-relaxed">
                  {draft.content}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stitch-text/60 backdrop-blur-xl"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-minimal overflow-hidden flex flex-col border border-black/5"
            >
              <div className="p-10 border-b border-black/5 flex items-center justify-between bg-stitch-shallow-gray/30">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-stitch-teal-start text-white flex items-center justify-center">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-stitch-text tracking-tight">
                      {selectedItem.name}
                    </h2>
                    <p className="text-[10px] font-black text-stitch-muted uppercase tracking-[0.2em] mt-1">結構化技術規格與應用實務</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-3 bg-white rounded-full shadow-minimal text-stitch-muted hover:text-stitch-text transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="relative">
                  <label className="text-[10px] font-black text-stitch-muted uppercase tracking-widest px-1 block mb-3">
                    底層技術棧 (Underlying Tech)
                  </label>
                  <div className="p-6 rounded-2xl bg-stitch-teal-start/5 border border-stitch-teal-start/10 text-stitch-teal-start font-black text-sm tracking-tight">
                    {selectedItem.tech}
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black text-stitch-muted uppercase tracking-widest px-1 block mb-3">
                    實戰應用場景 (Scenario)
                  </label>
                  <div className="p-8 rounded-3xl bg-stitch-shallow-gray border border-black/5 text-stitch-text leading-relaxed font-bold italic text-lg shadow-inner">
                    &quot;{selectedItem.scenario}&quot;
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={() => setSelectedItem(null)}
                    className="px-10 py-5 h-auto rounded-2xl bg-stitch-text text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                  >
                    確認並關閉詳情
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
