"use client";

import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2, Database, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { griImportService, GriIndicator } from "../../lib/services/gri-import-service";
import { motion, AnimatePresence } from "framer-motion";

export const GriImportView: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [indicators, setIndicators] = useState<GriIndicator[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isSealing, setIsSealing] = useState(false);
    const [isCommitted, setIsCommitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
            toast.error("請上傳有效的 Excel 檔案 (.xlsx 或 .xls)");
            return;
        }

        setFileName(file.name);
        setIsParsing(true);

        try {
            const buffer = await file.arrayBuffer();
            const parsed = await griImportService.parseGriExcel(buffer);
            setIndicators(parsed);
            toast.success(`解析完成：共載入 ${parsed.length} 項 GRI 指標`);
        } catch (error) {
            console.error("Excel Parsing Error:", error);
            toast.error("檔案解析失敗，請檢查格式是否正確");
        } finally {
            setIsParsing(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleCommit = async () => {
        if (indicators.length === 0) return;

        setIsSealing(true);
        const toastId = toast.loading("🔐 正在執行 5T+ZKP 存證封裝...");

        try {
            const { batchId, metadata } = await griImportService.commitToVault(indicators);

            // Artificial delay to show sealing process
            await new Promise(r => setTimeout(r, 2000));

            toast.success(`✅ 數據已成功同步至 Vault！批次 ID: ${batchId}`, { id: toastId });
            setIsCommitted(true);

            // Optional: reset after showing success for a while
            setTimeout(() => {
                setIndicators([]);
                setFileName(null);
                setIsCommitted(false);
                setIsSealing(false);
            }, 3000);

        } catch (error) {
            console.error("Commit Error:", error);
            toast.error("同步失敗，請檢查網路連線或系統權限", { id: toastId });
            setIsSealing(false);
        }
    };

    const grouped = griImportService.groupByCategory(indicators);

    return (
        <div className="max-w-6xl mx-auto p-10 space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stitch-border pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-stitch-teal-start/10 rounded-2xl">
                            <FileSpreadsheet className="w-8 h-8 text-stitch-teal-start" />
                        </div>
                        <h1 className="text-4xl font-black text-stitch-text tracking-tighter uppercase font-headline">GRI 指標快速匯入</h1>
                    </div>
                    <p className="text-stitch-muted font-bold text-lg max-w-xl">
                        將現有的永續揭露清單從 Excel 轉換為數位架構，自動對應環境、社會及治理數據軌跡。
                    </p>
                </div>

                {indicators.length > 0 && !isCommitted && (
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleCommit}
                        disabled={isSealing}
                        className={`group relative px-8 py-4 ${isSealing ? 'bg-stitch-muted' : 'bg-stitch-text'} text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all`}
                    >
                        {isSealing ? (
                            <ShieldCheck className="w-5 h-5 animate-pulse" />
                        ) : (
                            <Database className="w-5 h-5 group-hover:animate-bounce" />
                        )}
                        {isSealing ? "執行 5T 封裝中..." : "確認同步至 Vault"}
                    </motion.button>
                )}

                {isCommitted && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-8 py-4 bg-stitch-optimal text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        同步完成
                    </motion.div>
                )}
            </div>

            {/* Drop Zone */}
            {indicators.length === 0 ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative group border-4 border-dashed rounded-[40px] p-24 text-center cursor-pointer transition-all duration-500
                        ${isDragging ? 'border-stitch-teal-start bg-stitch-teal-start/5 scale-[0.98]' : 'border-stitch-border hover:border-stitch-teal-start/50 bg-stitch-shallow-gray/30'}
                    `}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        className="hidden"
                        accept=".xlsx, .xls"
                    />

                    <div className="flex flex-col items-center gap-6">
                        <div className={`
                            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500
                            ${isDragging ? 'bg-stitch-teal-start text-white rotate-12 scale-110' : 'bg-white text-stitch-muted group-hover:scale-110 group-hover:text-stitch-teal-start shadow-minimal'}
                        `}>
                            <Upload className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-stitch-text uppercase tracking-tight">拖放 Excel 檔案至此</h3>
                            <p className="text-stitch-muted font-bold uppercase tracking-widest text-xs italic">支援 .XLSX 與 .XLS 格式</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Context */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-stitch-border shadow-minimal sticky top-8">
                            <h4 className="text-xs font-black text-stitch-muted uppercase tracking-[0.2em] mb-4">檔案概覽</h4>
                            <div className="flex items-center gap-3 p-4 bg-stitch-shallow-gray/50 rounded-2xl border border-stitch-border">
                                <FileSpreadsheet className="w-5 h-5 text-stitch-teal-start" />
                                <span className="text-sm font-bold text-stitch-text truncate">{fileName}</span>
                            </div>

                            <div className="mt-8 space-y-4">
                                {Object.entries(grouped).map(([category, items]) => (
                                    <div key={category} className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                        <span className="text-stitch-muted">{category}</span>
                                        <span className="px-2 py-1 bg-stitch-text text-white rounded-lg">{items.length}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => { setIndicators([]); setFileName(null); }}
                                className="w-full mt-10 p-4 border border-stitch-critical/20 text-stitch-critical rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stitch-critical/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> 移除當前檔案
                            </button>
                        </div>
                    </div>

                    {/* Main Preview Table */}
                    <div className="md:col-span-3 space-y-8">
                        {Object.entries(grouped).map(([category, items]) => (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-6 rounded-full ${category === 'Environment' ? 'bg-stitch-optimal' :
                                        category === 'Social' ? 'bg-stitch-teal-start' : 'bg-stitch-text'
                                        }`} />
                                    <h3 className="text-xl font-black text-stitch-text uppercase tracking-tight">{category} 指標</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={item.code + idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex items-center justify-between p-5 bg-white border border-stitch-border rounded-2xl shadow-minimal hover:border-stitch-teal-start/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 font-black text-stitch-teal-start text-xs shrink-0">{item.code}</div>
                                                <div>
                                                    <div className="text-sm font-black text-stitch-text group-hover:text-stitch-teal-start transition-colors">{item.name}</div>
                                                    <div className="text-[10px] font-bold text-stitch-muted uppercase tracking-widest mt-0.5">{item.description || "尚無詳細說明"}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {item.unit && (
                                                    <span className="text-[10px] font-black bg-stitch-shallow-gray px-3 py-1 rounded-full text-stitch-text">
                                                        {item.unit}
                                                    </span>
                                                )}
                                                <CheckCircle2 className="w-5 h-5 text-stitch-optimal opacity-50" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
