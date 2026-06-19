"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Edit2, ShieldAlert, ShieldCheck, AlertCircle, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListOcrReviewItems, useUpdateOcrReviewItem } from "@dataconnect/generated/react";
import { toast } from "sonner";

// ==========================================
// 全端雙向 TypeScript：定義 OCR 審核資料型別
// ==========================================
export type ReviewStatus = "pending" | "approved" | "rejected" | "edited";

export interface OcrReviewItem {
    id: string;
    fieldLabel: string;      // 欄位名稱 (如: 總用電量)
    extractedValue: string;  // 萃取數值
    unit: string;            // 單位 (如: kWh)
    confidenceScore: number; // 信心水準 0.0 ~ 1.0
    status: ReviewStatus;    // 審核狀態
    originalSource?: string; // 來源文件標籤
}

// 模擬從 Gemini Vision OCR 獲取的初始數據
const INITIAL_OCR_DATA: OcrReviewItem[] = [
    { id: "ocr-1", fieldLabel: "第一廠區總用電量", extractedValue: "145,200", unit: "kWh", confidenceScore: 0.98, status: "pending", originalSource: "2024_Jan_Bill.pdf" },
    { id: "ocr-2", fieldLabel: "製程用水回收量", extractedValue: "8,500", unit: "m³", confidenceScore: 0.85, status: "pending", originalSource: "Water_Log_Q1.png" },
    { id: "ocr-3", fieldLabel: "有害廢棄物產出", extractedValue: "12.4", unit: "噸", confidenceScore: 0.65, status: "pending", originalSource: "Waste_Manifest.pdf" },
];

export const DataReviewView = () => {
    const { data: fdcData, isLoading, refetch } = useListOcrReviewItems();
    const { mutateAsync: updateItem } = useUpdateOcrReviewItem();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    // Use FDC data or fallback to initial (for new users or empty DB)
    const reviewItems = useMemo(() => {
        if (!fdcData?.ocrReviewItems?.length) return INITIAL_OCR_DATA;
        return fdcData.ocrReviewItems as unknown as OcrReviewItem[];
    }, [fdcData]);

    // 計算進度
    const progressStats = useMemo(() => {
        const total = (reviewItems || []).length;
        const completed = (reviewItems || []).filter(item => item.status !== "pending").length;
        return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [reviewItems]);

    const handleStatusChange = async (id: string, newStatus: ReviewStatus) => {
        try {
            await updateItem({ id, status: newStatus });
            toast.success(`狀態已更新為 ${newStatus}`);
            refetch();
        } catch (err) {
            toast.error("更新失敗");
            console.error(err);
        }
    };

    const saveEdit = async (id: string) => {
        try {
            await updateItem({ id, extractedValue: editValue, status: "edited" });
            toast.success("數值已更新");
            setEditingId(null);
            refetch();
        } catch (err) {
            toast.error("儲存失敗");
            console.error(err);
        }
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 0.9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (score >= 0.7) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header & Progress */}
            {isLoading && (
                <div className="flex items-center justify-center p-4 text-stitch-text-muted">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> 載入實時數據中...
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white border border-stitch-border rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-stitch-text tracking-tight flex items-center gap-2">
                        <ShieldCheck className="text-stitch-primary w-6 h-6" />
                        OCR 數據審核中心
                    </h2>
                    <p className="text-sm font-bold text-stitch-text-muted mt-1 uppercase tracking-widest">Data Verification Grid</p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-64">
                    <div className="flex justify-between text-xs font-bold text-stitch-text-muted">
                        <span>審核進度 (Progress)</span>
                        <span className="text-stitch-primary">{progressStats.completed} / {progressStats.total}</span>
                    </div>
                    <div className="h-2 w-full bg-stitch-shallow-gray rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-stitch-primary transition-all duration-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressStats.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Data Grid */}
            <div className="space-y-4">
                {reviewItems.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-5 bg-white border rounded-2xl shadow-minimal flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-300",
                            item.status === "approved" ? "border-emerald-200 bg-emerald-50/30" :
                                item.status === "rejected" ? "border-red-200 bg-red-50/30" :
                                    item.status === "edited" ? "border-blue-200 bg-blue-50/30" : "border-stitch-border hover:border-stitch-primary/40"
                        )}
                    >
                        <div className="flex-1 flex flex-col gap-1">
                            <span className="text-[10px] font-black text-stitch-text-muted uppercase tracking-widest">{item.originalSource}</span>
                            <span className="text-lg font-bold text-stitch-text">{item.fieldLabel}</span>
                        </div>

                        <div className="flex-1 flex items-center gap-3">
                            {editingId === item.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-32 px-3 py-1.5 border border-stitch-primary rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-stitch-primary/20"
                                    />
                                    <span className="text-sm font-bold text-stitch-text-muted">{item.unit}</span>
                                    <button onClick={() => saveEdit(item.id)} className="p-1.5 bg-stitch-primary text-white rounded-lg hover:bg-stitch-primary/90">
                                        <Save className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-1.5 group cursor-pointer" onClick={() => { setEditingId(item.id); setEditValue(item.extractedValue); }}>
                                    <span className="text-2xl font-black text-stitch-text tracking-tighter border-b border-dashed border-transparent group-hover:border-stitch-primary">{item.extractedValue}</span>
                                    <span className="text-sm font-bold text-stitch-text-muted">{item.unit}</span>
                                    <Edit2 className="w-3 h-3 text-stitch-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border", getConfidenceColor(item.confidenceScore))}>
                                {item.confidenceScore >= 0.9 ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                AI 信心: {Math.round(item.confidenceScore * 100)}%
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleStatusChange(item.id, "rejected")} className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors" title="退回 (Reject)">
                                    <X className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleStatusChange(item.id, "approved")} className="p-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors" title="核准 (Approve)">
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};