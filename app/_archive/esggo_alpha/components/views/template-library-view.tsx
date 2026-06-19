"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Layers,
  Layout,
  Plus,
  Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useState, useMemo, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Template {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  standard: string;
  segments: number;
}

export function TemplateLibraryView({ onBack, onSelect }: { onBack: () => void; onSelect: (tpl: Template) => void }) {
  const { t, language } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ESG_TEMPLATES: Template[] = [
    {
      id: "twse-2024",
      name: language === 'zh' ? "TWSE 2024 官方中小企業範本" : "TWSE 2024 Official SME Template",
      nameEn: "TWSE 2024 Official SME Template",
      description: language === 'zh' ? "對標金管會與證交所最新發布之『上市上櫃公司永續報告書編製指南』。" : "Compliance with TWSE ESG reporting guidelines for SMEs.",
      standard: "TWSE",
      segments: 42
    },
    {
      id: "taipei-pilot-2025",
      name: language === 'zh' ? "臺北市中小企業試點專用範本" : "Taipei SME Pilot Template",
      nameEn: "Taipei SME Pilot Template",
      description: language === 'zh' ? "整合 5T 誠信協議與 ZKP 隱私技術，專為臺北市設創基地輔導企業打造。" : "Integrating 5T protocol and ZKP for Taipei-based SMEs.",
      standard: "TAIPEI-PILOT",
      segments: 42
    },
    {
      id: "gri-2025",
      name: language === 'zh' ? "GRI 國際標準官方範本" : "GRI Official Template",
      nameEn: "GRI Official Template",
      description: language === 'zh' ? "採用 2025 最新修訂版 GRI 通用準則與重大主題披露。" : "Latest 2025 GRI standards with material topic disclosures.",
      standard: "GRI",
      segments: 42
    },
    {
      id: "tcfd-2025",
      name: language === 'zh' ? "TCFD 氣候風險財務披露" : "TCFD Climate Disclosure",
      nameEn: "TCFD Climate Disclosure",
      description: language === 'zh' ? "專注於治理、策略、風險管理及指標與目標四大面向。" : "Focusing on governance, strategy, risk management, and metrics.",
      standard: "TCFD",
      segments: 15
    },
    {
      id: "sasb-technology",
      name: language === 'zh' ? "SASB 技術與通訊範本" : "SASB Tech & Communications",
      nameEn: "SASB Tech & Communications",
      description: language === 'zh' ? "針對軟體、硬體與半導體產業優化的 SASB 披露架構。" : "Optimized SASB framework for software, hardware, and semiconductors.",
      standard: "SASB",
      segments: 22
    },
    {
      id: "sasb-manufacturing",
      name: language === 'zh' ? "SASB 工業及製程範本" : "SASB Manufacturing",
      nameEn: "SASB Manufacturing",
      description: language === 'zh' ? "專為工業機器人及其它重工業製程量身打造的重大性披露。" : "Tailored materiality disclosures for industrial and heavy manufacturing.",
      standard: "SASB",
      segments: 24
    },
    {
      id: "issa-5000",
      name: language === 'zh' ? "ISSA 5000 確信就緒範本" : "ISSA 5000 Ready Template",
      nameEn: "ISSA 5000 Ready Template",
      description: language === 'zh' ? "以外部查核為導向的揭露架構，強化數據存證與反欺詐邏輯。" : "Assurance-oriented framework enhancing data attestation.",
      standard: "ISSA-5000",
      segments: 28
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return ESG_TEMPLATES.filter(tpl =>
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.standard.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, ESG_TEMPLATES]);

  const handleComingSoon = () => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2000);
  };

  const handleCustomTemplate = () => {
    setIsCustomModalOpen(true);
  };

  const handleFileSelect = () => {
    // Simulate file upload and template creation
    const customTpl: Template = {
      id: `custom-${Date.now()}`,
      name: language === 'zh' ? "企業自定義報表 (已匯入)" : "Custom Corporate Report (Imported)",
      description: language === 'zh' ? "基於上傳文件自動生成的客製化披露架構。" : "Customized disclosure framework based on uploaded document.",
      standard: "CUSTOM",
      segments: 24
    };
    onSelect(customTpl);
    setIsCustomModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Coming Soon Notification */}
      {showComingSoon && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="px-6 py-3 bg-slate-900 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight text-white">
              {language === 'zh' ? "功能開發中，敬請期待！" : "Feature coming soon! Stay tuned."}
            </span>
          </div>
        </motion.div>
      )}

      {/* Custom Template Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsCustomModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -translate-y-20 translate-x-10" />

            <div className="relative z-10 space-y-8">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                  <Plus className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.templates.customTitle}</h2>
                <p className="text-slate-500 font-medium">{t.templates.customDesc}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center"
                >
                  <FileText className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-2" />
                  <span className="font-black text-slate-700">{t.templates.uploadPdf}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">PDF, DOCX, XLSX</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.xlsx"
                  />
                </button>

                <button
                  onClick={() => {
                    onSelect({
                      id: "custom-blank",
                      name: language === 'zh' ? "全新空白模板" : "New Blank Template",
                      description: language === 'zh' ? "手動定義章節架構，完全自主的報表設計。" : "Manually define chapters for full control over report design.",
                      standard: "CUSTOM",
                      segments: 0
                    });
                    setIsCustomModalOpen(false);
                  }}
                  className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Layout className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-slate-800">{language === 'zh' ? "從零開始" : "Start from Scratch"}</div>
                    <div className="text-xs text-slate-400 font-medium">{language === 'zh' ? "自主定義結構" : "Fully manual structure"}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-slate-900 text-emerald-400 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 shadow-xl">
                {t.templates.officialHub}
              </Badge>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">{t.templates.title}</h1>
            <p className="text-sm font-medium text-slate-400 mt-1">{t.templates.subtitle}</p>
          </div>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'zh' ? "搜尋範本或標準..." : "Search templates or standards..."}
            className="pl-11 h-12 bg-white/50 backdrop-blur-sm border-slate-200 rounded-2xl font-bold focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((tpl, idx) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              onClick={() => onSelect(tpl)}
              className="p-8 group cursor-pointer hover:border-emerald-200 transition-all shadow-xl shadow-slate-200/40 flex flex-col h-full gap-6 relative overflow-hidden"
            >
              {tpl.id === "twse-2024" && (
                <div className="absolute top-0 right-0 py-1.5 px-6 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rotate-45 translate-x-12 translate-y-4 shadow-lg">
                  Recommended
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                  <Layout className="w-7 h-7" />
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">
                  {tpl.standard}
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">{tpl.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">{tpl.description}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.templates.chapterSegment}</span>
                    <span className="text-sm font-black text-slate-700">{tpl.segments} {t.templates.segments}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-100" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.templates.protocol}</span>
                    <span className="text-xs font-bold text-emerald-600">5T Active</span>
                  </div>
                </div>
                <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg transition-all active:scale-95">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
              <FileText className="w-10 h-10" />
            </div>
            <p className="text-slate-400 font-bold">
              {language === 'zh' ? "找不到符合條件的範本" : "No templates found matching your search"}
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">
            {language === 'zh' ? "自定義範本" : "Custom Template"}
          </div>
          <h2 className="text-3xl font-black tracking-tight">{t.templates.customTitle}</h2>
          <p className="text-white/60 max-w-md font-medium">{t.templates.customDesc}</p>
          <button
            onClick={handleCustomTemplate}
            className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10"
          >
            {t.templates.uploadPdf} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
