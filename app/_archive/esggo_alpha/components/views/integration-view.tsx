"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Link2,
  Database,
  Network,
  Upload,
  Download,
  CheckCircle2,
  Settings2,
  RefreshCw,
  FileSpreadsheet,
  Cpu,
  Code2,
  Zap,
  Plus,
  ArrowRight,
  ArrowRightLeft,
  Globe2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/context/app-context";

interface IntegrationSource {
  id: string;
  name: string;
  type: "erp" | "hr" | "api" | "excel";
  status: "connected" | "disconnected";
  lastSync?: string;
  icon: any;
}

const SOURCES: IntegrationSource[] = [
  { id: "sap-erp", name: "SAP ERP / ERP-Cloud", type: "erp", status: "disconnected", icon: Database },
  { id: "workday", name: "Workday HRIS", type: "hr", status: "connected", lastSync: "10小時前", icon: Network },
  { id: "esuite", name: "E-Suite / EIC 能源管理", type: "api", status: "connected", lastSync: "2小時前", icon: Zap },
  { id: "sap-co2", name: "SAP CO₂ 管理", type: "api", status: "disconnected", icon: Globe2 },
  { id: "iot", name: "IoT 感測器網路", type: "api", status: "connected", lastSync: "1小時前", icon: Cpu },
];

export function IntegrationView({ onBack }: { onBack: () => void }) {
  const { addNotification, addActivity, language } = useAppContext();
  const [activeTab, setActiveTab] = useState<"systems" | "etl" | "import">("systems");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());

  const isZh = language === "zh";

  const handleSync = (source: IntegrationSource) => {
    setSyncingId(source.id);
    setTimeout(() => {
      setSyncingId(null);
      setSyncedIds(prev => new Set(prev).add(source.id));
      addNotification({
        type: "success",
        title: isZh ? `同步成功：${source.name}` : `Sync Complete: ${source.name}`,
        message: isZh
          ? `${source.name} 數據已成功同步至 EvidenceVault`
          : `${source.name} data has been synced to EvidenceVault`,
      });
      addActivity(
        isZh ? `同步外部系統：${source.name}` : `Synced external system: ${source.name}`,
        { sourceId: source.id, sourceType: source.type }
      );
    }, 2000);
  };

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
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">系統串接與導入</h1>
            <p className="text-slate-500 font-medium text-sm">ERP/HR 數據對接、API 導出與 GRI 數據映射</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("systems")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2",
              activeTab === "systems" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Link2 className="w-4 h-4" />
            系統串接
          </button>
          <button
            onClick={() => setActiveTab("etl")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2",
              activeTab === "etl" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Settings2 className="w-4 h-4" />
            ETL 工作流
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2",
              activeTab === "import" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Upload className="w-4 h-4" />
            數據導入/映射
          </button>
        </div>
      </div>

      {activeTab === "systems" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOURCES.map((source) => (
            <GlassCard key={source.id} className="p-8 flex items-center justify-between group hover:border-[#009E9D]/30 transition-all">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                  source.status === "connected" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                )}>
                  <source.icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800">{source.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      source.status === "connected" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", source.status === "connected" ? "bg-emerald-600 animate-pulse" : "bg-slate-400")} />
                      {source.status === "connected"
                        ? (isZh ? "已連線" : "Connected")
                        : (isZh ? "未連線" : "Disconnected")}
                    </span>
                    {(source.lastSync || syncedIds.has(source.id)) && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {isZh ? "最後同步: " : "Last sync: "}
                        {syncedIds.has(source.id) ? (isZh ? "剛剛" : "Just now") : source.lastSync}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {source.status === "connected" ? (
                  <>
                    <button
                      onClick={() => handleSync(source)}
                      disabled={syncingId === source.id}
                      className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                      <RefreshCw className={cn("w-5 h-5", syncingId === source.id && "animate-spin")} />
                    </button>
                    <button className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-all">
                      <Settings2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg shadow-slate-200 hover:-translate-y-1 transition-all">
                    {isZh ? "配置連線" : "Configure"}
                  </button>
                )}
              </div>
            </GlassCard>
          ))}

          <GlassCard className="p-8 border-dashed border-2 border-slate-200 bg-slate-50/50 flex items-center justify-center gap-4 text-slate-400 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer">
            <Plus className="w-6 h-6" />
            <span className="font-black text-sm uppercase tracking-widest">新增外部系統連線 (API/Webhook)</span>
          </GlassCard>
        </div>
      ) : activeTab === "etl" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <GlassCard className="p-8">
            <h3 className="text-xl font-black text-slate-800 mb-2">輕量化 ETL 工作流</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">將原始數據透過清洗規則轉換為標準 ESG 永續指標</p>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Step 1 */}
              <div className="flex-1 bg-white border-2 border-slate-100 shadow-sm rounded-2xl p-6 relative group hover:border-[#009E9D]/30 transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-black text-slate-800 text-lg">1. 設定資料來源</h4>
                <p className="text-xs text-slate-500 mt-2 font-medium">支援 API、資料庫與外部系統直連 (ERP, HRIS, E-Suite)</p>
              </div>
              <ArrowRight className="w-8 h-8 text-slate-300 hidden md:block shrink-0" />
              {/* Step 2 */}
              <div className="flex-1 bg-white border-2 border-slate-100 shadow-sm rounded-2xl p-6 relative group hover:border-[#009E9D]/30 transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-black text-slate-800 text-lg">2. 自訂清洗規則</h4>
                <p className="text-xs text-slate-500 mt-2 font-medium">自動轉換單位（例如：度數轉碳排量）、過濾異常極端值</p>
              </div>
              <ArrowRight className="w-8 h-8 text-slate-300 hidden md:block shrink-0" />
              {/* Step 3 */}
              <div className="flex-1 bg-white border-2 border-slate-100 shadow-sm rounded-2xl p-6 relative group hover:border-[#009E9D]/30 transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-black text-slate-800 text-lg">3. 映射至永續指標</h4>
                <p className="text-xs text-slate-500 mt-2 font-medium">一鍵對應 GRI、SASB、TCFD 揭露準則條文</p>
              </div>
            </div>

            <div className="mt-10 flex border-t border-slate-100 pt-8">
              <button className="px-6 py-3 bg-slate-900 shadow-xl shadow-slate-200 text-white rounded-xl text-sm font-black flex items-center gap-2 hover:-translate-y-1 transition-transform">
                <Plus className="w-4 h-4" /> 新建 ETL 腳本
              </button>
            </div>
          </GlassCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-4 space-y-6">
            <GlassCard className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800">GRI 映射導入</h3>
                <p className="text-sm text-slate-500 font-medium">上傳 Excel 或 CSV 檔案，AI 將自動對應至 GRI 章節。</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div className="flex flex-col items-center p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-100 transition-colors cursor-pointer">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600 text-center">CSV / Excel</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 transition-colors cursor-pointer">
                    <Database className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600 text-center">SQL 直連</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-slate-50 hover:bg-purple-50 rounded-xl border border-slate-100 transition-colors cursor-pointer">
                    <Globe2 className="w-5 h-5 text-purple-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600 text-center">REST / GraphQL</span>
                  </div>
                </div>

                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-700">上傳檔案或設定端點</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">支援上述多種源格式</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <Globe2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-[11px] font-black text-amber-900 uppercase tracking-wide">智能轉碼防擾系統已啟動</p>
                    <p className="text-[10px] font-medium text-amber-700/80 leading-relaxed">偵測到 Big5/GBK 編碼時將自動轉換為 UTF-8，確保繁體中文不出現亂碼。</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all">
                  <Zap className="w-4 h-4" />
                  開始智能映射
                </button>
              </div>
            </GlassCard>

            <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-[#009E9D]" />
                <h4 className="font-black">API 端點</h4>
              </div>
              <p className="text-sm text-white/60 font-medium">企業可透過以下端點將永續數據導出至 BI 系統：</p>
              <code className="block bg-white/10 p-3 rounded-lg text-xs font-mono text-[#009E9D] break-all">
                GET https://api.sustainwrite.ai/v1/extract?report_id=2025_esg
              </code>
            </div>
          </div>

          <div className="md:col-span-8">
            <GlassCard className="h-full min-h-[500px]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  數據對應預覽
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Mapping Confidence: 99.4%
                </span>
              </div>
              <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-lg font-black text-slate-800">尚未上傳數據</p>
                <p className="max-w-xs text-sm text-slate-500 font-medium">
                  上傳 GRI 數據表後，此處將顯示自動映射後的欄位與各項數據之對應關係。
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
