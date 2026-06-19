"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ExternalLink,
  FileText,
  BookOpen,
  Shield,
  ArrowLeft,
  Filter,
  Bookmark,
  Share2
} from "lucide-react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface LibraryItem {
  id: string;
  title: string;
  type: "template" | "regulation" | "yearbook" | "gri";
  source: string;
  year?: number;
  downloadUrl?: string;
  sourceUrl: string;
  description: string;
}

const LIBRARY_DATA: LibraryItem[] = [
  {
    id: "gov-1",
    title: "上市上櫃公司永續報告書編製指南",
    type: "template",
    source: "金管會 (FSC)",
    year: 2024,
    sourceUrl: "https://www.sfb.gov.tw/ch/home.jsp?id=968&parentpath=0,2",
    downloadUrl: "https://www.sfb.gov.tw/ch/home.jsp?id=968&parentpath=0,2",
    description: "針對 2025 年新制，提供上市上櫃企業編製永續報告書之基準要求與規範。"
  },
  {
    id: "gov-2",
    title: "2024 臺灣永續年鑑",
    type: "yearbook",
    source: "證基會 / 交易所",
    year: 2024,
    sourceUrl: "https://isustain.tse.com.tw/ch/home.jsp",
    downloadUrl: "https://isustain.tse.com.tw/ch/home.jsp",
    description: "彙整臺灣企業 ESG 揭露現況、指標達成率及優良案例分析。"
  },
  {
    id: "is-1",
    title: "ISSA 5000 國際永續確信準則 (Draft)",
    type: "regulation",
    source: "IAASB",
    year: 2025,
    sourceUrl: "https://www.iaasb.org/projects/sustainability-assurance",
    downloadUrl: "https://www.iaasb.org/projects/sustainability-assurance",
    description: "全球統一的永續報告確信框架，ESG GO 核心確信引擎之基準準則。"
  },
  {
    id: "gri-1",
    title: "GRI 永續報告準則 2025 預覽",
    type: "gri",
    source: "GRI",
    year: 2025,
    sourceUrl: "https://www.globalreporting.org/standards/",
    downloadUrl: "https://www.globalreporting.org/standards/",
    description: "最新版的 GRI 指標系統，強化氣候風險與人權盡職調查之揭露指標。"
  }
];

export function SustainLibraryView({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<LibraryItem["type"] | "all">("all");
  const [search, setSearch] = useState("");

  const handleDownload = (item: LibraryItem) => {
    console.log(`Downloading ${item.title}...`);
    window.open(item.downloadUrl || item.sourceUrl, '_blank');
  };

  const filtered = LIBRARY_DATA.filter(item => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">永續報告圖書館</h1>
            <p className="text-slate-500 font-medium text-sm">官方模板、法規指引與企業年鑑快查</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋準則、年鑑或關鍵字..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: "全部", icon: BookOpen },
          { id: "template", label: "編製模板", icon: FileText },
          { id: "regulation", label: "相關法規", icon: Shield },
          { id: "yearbook", label: "ESG 年鑑", icon: Bookmark },
          { id: "gri", label: "GRI 詳解", icon: ExternalLink },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap",
              filter === t.id
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "bg-white border border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <GlassCard
            key={item.id}
            className="p-6 flex flex-col h-full hover:border-emerald-200 hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-2xl",
                item.type === "template" ? "bg-blue-50 text-blue-600" :
                  item.type === "regulation" ? "bg-amber-50 text-amber-600" :
                    item.type === "yearbook" ? "bg-emerald-50 text-emerald-600" :
                      "bg-violet-50 text-violet-600"
              )}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
              {item.title}
            </h3>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {item.source}
              </span>
              {item.year && (
                <span className="text-[10px] font-black uppercase tracking-widest text-[#009E9D] bg-[#009E9D]/10 px-2 py-0.5 rounded">
                  {item.year}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-6 flex-grow">
              {item.description}
            </p>

            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => handleDownload(item)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-200 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                下載文件
              </button>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-[#009E9D] hover:border-[#009E9D] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto" />
          <div className="space-y-1">
            <p className="text-xl font-black text-slate-800">查無相關文獻</p>
            <p className="text-slate-400 text-sm">請嘗試變更搜尋關鍵字或分類篩選</p>
          </div>
        </div>
      )}
    </div>
  );
}
