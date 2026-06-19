"use client";

import { useState, useRef } from "react";
import {
  FileUp,
  ArrowLeft,
  FileText,
  Table as TableIcon,
  BarChart,
  Loader2,
  CheckCircle2,
  Scan,
  Globe2,
  AlertCircle,
  Copy,
  Download,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/context/app-context";

interface ExtractionResult {
  text: string;
  tables: any[];
  charts: string[];
}

const OCR_LABELS = {
  zh: {
    title: "AI OCR 文字擷取",
    subtitle: "支援 PDF、圖片之繁中/英文文字、表格與圖表擷取技術",
    clickUpload: "點擊或拖放檔案",
    uploadHint: "支援 PDF, PNG, JPG (最大 10MB)",
    extract: "開始 OCR 擷取",
    extracting: "AI 智能擷取中...",
    techSupport: "技術支援",
    bilingual: "繁/英雙語對應",
    tableMapping: "表格自動映射",
    chartSemantic: "圖表語意理解",
    waitTitle: "等待檔案上傳",
    waitDesc: "請在左側選擇要擷取的 ESG 報告或數據文件",
    processing: "Gemini V3 Pro 處理中",
    processingDesc: "正在進行深度語意識別與表格結構化...",
    error: "發生錯誤",
    retry: "重新嘗試",
    extractedText: "擷取文字",
    extractedTables: "擷取表格",
    saveToReport: "儲存至報告",
    saveSuccess: "已儲存至新報告",
    saveSuccessMsg: "OCR 擷取結果已建立為草稿報告",
    errNoFile: "請先選擇檔案。",
    errFormat: "不支援的檔案格式。請上傳 PDF, JPG, PNG 或 WEBP 檔案。",
    errSize: "檔案過大。請上傳小於 10MB 的檔案。",
    errNoKey: "無法取得 API 金鑰，請確定已設定 NEXT_PUBLIC_GEMINI_API_KEY。",
    errNoContent: "AI 未回傳任何內容。",
    errBadJson: "AI 回傳的資料格式錯誤 (非合法 JSON)。",
    errRead: "讀取檔案時發生系統錯誤。",
    errGeneric: "AI 擷取失敗，請檢查 API Key 或檔案格式",
    errInitFail: "讀取檔案或初始化 AI 失敗",
    emptyText: "擷取文字為空",
  },
  en: {
    title: "AI OCR Extraction",
    subtitle: "Extract bilingual (EN/ZH) text, tables, and charts from PDFs & images",
    clickUpload: "Click or drag & drop file",
    uploadHint: "Supports PDF, PNG, JPG (max 10MB)",
    extract: "Start OCR Extraction",
    extracting: "AI Extracting...",
    techSupport: "Tech Capabilities",
    bilingual: "Bilingual Mapping",
    tableMapping: "Auto Table Mapping",
    chartSemantic: "Chart Semantic Analysis",
    waitTitle: "Awaiting File Upload",
    waitDesc: "Select an ESG report or data document on the left",
    processing: "Gemini V3 Pro Processing",
    processingDesc: "Deep semantic recognition and table structuring in progress...",
    error: "An Error Occurred",
    retry: "Try Again",
    extractedText: "Extracted Text",
    extractedTables: "Extracted Tables",
    saveToReport: "Save to Report",
    saveSuccess: "Saved to New Report",
    saveSuccessMsg: "OCR extraction result has been created as a draft report",
    errNoFile: "Please select a file first.",
    errFormat: "Unsupported file format. Please upload PDF, JPG, PNG, or WEBP.",
    errSize: "File too large. Max 10MB.",
    errNoKey: "API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY.",
    errNoContent: "AI returned no content.",
    errBadJson: "AI response is not valid JSON.",
    errRead: "System error reading file.",
    errGeneric: "AI extraction failed. Check API Key or file format.",
    errInitFail: "Failed to read file or initialize AI.",
    emptyText: "No text extracted",
  },
};

export function OCRView({ onBack, onSync }: { onBack: () => void; onSync?: (data: any) => void }) {
  const { language, addReport, addNotification } = useAppContext();
  const t = OCR_LABELS[language];

  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError(t.errNoFile);
      return;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError(t.errFormat);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(t.errSize);
      return;
    }

    setIsExtracting(true);
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result?.toString().split(",")[1];
          if (!base64Data) throw new Error(t.errNoContent);

          const { extractOcrWithGemini } = await import("@/app/actions/gemini-ocr");
          const resultData = await extractOcrWithGemini(base64Data, file.type);

          if (!resultData.success) {
            throw new Error(resultData.error);
          }

          const data = resultData.data;

          const extracted: ExtractionResult = {
            text: data.text || t.emptyText,
            tables: Array.isArray(data.tables) ? data.tables : [],
            charts: Array.isArray(data.charts) ? data.charts : [],
          };
          setResult(extracted);
          if (onSync) onSync(extracted);
        } catch (err: any) {
          console.error("Extraction error inner:", err);
          setError(err.message || t.errGeneric);
        } finally {
          setIsExtracting(false);
        }
      };

      reader.onerror = () => {
        setError(t.errRead);
        setIsExtracting(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("Extraction error outer:", err);
      setError(err.message || t.errInitFail);
      setIsExtracting(false);
    }
  };

  const handleSaveToReport = () => {
    if (!result || !file) return;
    setIsSaving(true);
    const reportTitle =
      language === "zh"
        ? `OCR 擷取：${file.name.substring(0, 30)}`
        : `OCR Extract: ${file.name.substring(0, 30)}`;
    addReport({
      title: reportTitle,
      year: new Date().getFullYear(),
      chapters: 1,
      sections: result.tables.length + 1,
      completedSections: 0,
    });
    addNotification({
      type: "success",
      title: t.saveSuccess,
      message: t.saveSuccessMsg,
    });
    setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t.title}</h1>
          <p className="text-slate-500 font-medium text-sm">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <GlassCard
            className="p-8 border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,image/*"
            />
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-slate-800 line-clamp-1">{file.name}</p>
                  <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                  <FileUp className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-700">{t.clickUpload}</p>
                  <p className="text-xs text-slate-400 font-medium">{t.uploadHint}</p>
                </div>
              </>
            )}
          </GlassCard>

          <button
            disabled={!file || isExtracting}
            onClick={handleExtract}
            className={cn(
              "w-full py-4 rounded-[1.25rem] font-black text-white flex items-center justify-center gap-3 transition-all",
              !file || isExtracting
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200"
            )}
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.extracting}
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" />
                {t.extract}
              </>
            )}
          </button>

          {result && (
            <button
              disabled={isSaving}
              onClick={handleSaveToReport}
              className={cn(
                "w-full py-3.5 rounded-[1.25rem] font-black flex items-center justify-center gap-3 transition-all border-2",
                isSaving
                  ? "border-emerald-200 text-emerald-400 cursor-not-allowed"
                  : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              )}
            >
              {isSaving ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {t.saveSuccess}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t.saveToReport}
                </>
              )}
            </button>
          )}

          <div className="p-6 bg-slate-50 rounded-[1.5rem] space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.techSupport}</h4>
            <div className="space-y-3">
              {[
                { icon: Globe2, label: t.bilingual, status: "Active" },
                { icon: TableIcon, label: t.tableMapping, status: "Active" },
                { icon: BarChart, label: t.chartSemantic, status: "Stable" },
              ].map((tech) => (
                <div key={tech.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-black text-slate-600">
                    <tech.icon className="w-4 h-4" />
                    {tech.label}
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">
                    {tech.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <GlassCard className="h-full min-h-[500px] overflow-hidden flex flex-col">
            <div className="border-b border-slate-100 p-4 flex items-center justify-end bg-slate-50/50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (result?.text) navigator.clipboard.writeText(result.text);
                  }}
                  className="p-2 bg-white rounded-lg text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 transition-all"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (!result) return;
                    const blob = new Blob([result.text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "ocr-extract.txt";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-2 bg-white rounded-lg text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 transition-all"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-grow p-8 overflow-y-auto font-mono text-sm text-slate-600 leading-relaxed bg-white">
              {error && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-black text-slate-800">{t.error}</p>
                    <p className="text-sm font-medium text-rose-600 max-w-sm leading-relaxed">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    {t.retry}
                  </button>
                </div>
              )}

              {!result && !error && !isExtracting && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-6 bg-slate-100 rounded-full">
                    <Scan className="w-12 h-12 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-black text-slate-800">{t.waitTitle}</p>
                    <p className="text-slate-400 font-medium">{t.waitDesc}</p>
                  </div>
                </div>
              )}

              {isExtracting && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-black text-slate-800">{t.processing}</p>
                    <p className="text-slate-400 font-medium">{t.processingDesc}</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-8 animate-in fade-in duration-700">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t.extractedText}
                    </h4>
                    <p className="whitespace-pre-wrap py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl leading-loose">
                      {result.text}
                    </p>
                  </div>

                  {result.tables.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                        <TableIcon className="w-4 h-4" />
                        {t.extractedTables}
                      </h4>
                      {result.tables.map((table: any, idx: number) => (
                        <div key={idx} className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm">
                          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 font-black text-slate-700 text-xs uppercase tracking-wide">
                            {table.title || `Table ${idx + 1}`}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  {table.data[0]?.map((head: any, hIdx: number) => (
                                    <th key={hIdx} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                                      {head}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table.data.slice(1).map((row: any, rIdx: number) => (
                                  <tr key={rIdx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    {row.map((cell: any, cIdx: number) => (
                                      <td key={cIdx} className="px-6 py-4 font-medium text-slate-600">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
