"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileCheck, AlertCircle, Loader2 } from "lucide-react";

/**
 * 🏛️ EvidenceDropzone - Universal SRC Component
 * 
 * High-precision upload area with Mobile-First design.
 * Features: Drag & Drop, Camera Support, OCR status, 5T Validation.
 */
export const EvidenceDropzone: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [evidenceData, setEvidenceData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/src/evidence", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setEvidenceData(result.evidence);
            } else {
                setError(result.error || "Processing failed");
            }
        } catch (err) {
            setError("Network error or server unavailable");
        } finally {
            setIsUploading(false);
        }
    }, []);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
            {/* 5T Protocol Status Header */}
            <div className="flex justify-between items-center bg-[#63a6b0]/10 p-3 rounded-lg border border-[#63a6b0]/20">
                <span className="text-[#63a6b0] font-semibold text-sm">5T Protocol: TRACEABLE</span>
                <div className="flex gap-2">
                    {["T1", "T2", "T3", "T4", "T5"].map((t) => (
                        <div key={t} className={`w-3 h-3 rounded-full ${evidenceData ? "bg-[#63a6b0]" : "bg-gray-300"}`} title={t} />
                    ))}
                </div>
            </div>

            {/* Main Dropzone */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4
          ${isUploading ? "border-[#63a6b0] bg-[#63a6b0]/5" : "border-gray-300 hover:border-[#63a6b0] hover:bg-[#63a6b0]/5"}
          active:scale-95`}
            >
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    disabled={isUploading}
                    accept="image/*,application/pdf"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                        <Loader2 className="w-12 h-12 text-[#63a6b0] animate-spin" />
                        <p className="text-sm font-medium text-gray-600">正在進行 OCR 高精準掃描...</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-[#63a6b0]/10 rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-[#63a6b0]" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">點擊或拖放單據</p>
                            <p className="text-sm text-gray-500">支援 PDF, PNG, JPG (手機拍攝即時辨識)</p>
                        </div>
                    </>
                )}
            </div>

            {/* X-Ray Gap Matrix / Result Section */}
            {evidenceData && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-[#63a6b0] px-4 py-2 flex justify-between items-center">
                        <h3 className="text-white font-medium flex items-center gap-2 text-sm">
                            <FileCheck className="w-4 h-4" /> 辨識結果與 5T 驗證
                        </h3>
                        <span className="text-white/80 text-xs font-mono">HASH: {evidenceData.origin_hash.substring(0, 12)}...</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <p className="text-gray-500 uppercase text-[10px] font-bold">供應商</p>
                            <p className="font-semibold text-gray-800">{evidenceData.metadata.extractedFields.vendor}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500 uppercase text-[10px] font-bold">期間</p>
                            <p className="font-semibold text-gray-800">{evidenceData.metadata.extractedFields.period}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500 uppercase text-[10px] font-bold">數據項目</p>
                            <p className="font-semibold text-gray-800">{evidenceData.metadata.extractedFields.metric}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500 uppercase text-[10px] font-bold">數值</p>
                            <p className="font-semibold text-blue-600">{evidenceData.metadata.extractedFields.value} {evidenceData.metadata.extractedFields.unit}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-700 font-medium">高信度自動對齊已完成 (Confidence: {(evidenceData.quality_score * 100).toFixed(1)}%)</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
