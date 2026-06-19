"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    CheckCircle2,
    Upload,
    Clock,
    AlertCircle,
    Database,
    ArrowLeft
} from "lucide-react";

// Generate 70 Mock Documents
const CATEGORIES = [
    { id: "energy", name: "能源與溫室氣體 (Energy & GHG)", count: 14 },
    { id: "water", name: "水資源與廢棄物 (Water & Waste)", count: 14 },
    { id: "social", name: "社會與勞工人權 (Social)", count: 14 },
    { id: "gov", name: "公司治理與法規 (Governance)", count: 14 },
    { id: "supply", name: "供應鏈與永續採購 (Supply Chain)", count: 14 },
];

const MOCK_DOCUMENTS = CATEGORIES.flatMap((cat, catIndex) =>
    Array.from({ length: cat.count }).map((_, i) => ({
        id: `doc-${cat.id}-${i + 1}`,
        title: `${cat.name} - 證明文件 ${i + 1}`,
        category: cat.id,
        categoryName: cat.name,
        required: true,
    }))
);

export function DocumentTrackerView({ onBack }: { onBack?: () => void }) {
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});

    const handleUpload = (docId: string) => {
        // Simulate upload delay
        setTimeout(() => {
            setUploadedDocs(prev => ({ ...prev, [docId]: true }));
        }, 500);
    };

    const totalRequired = MOCK_DOCUMENTS.length;
    const totalUploaded = Object.values(uploadedDocs).filter(Boolean).length;
    const remaining = totalRequired - totalUploaded;
    const progressPercent = Math.round((totalUploaded / totalRequired) * 100);

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Info */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg text-white relative flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-300" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 text-white drop-shadow-lg">
                            ESG 文件上傳狀態中心
                        </h1>
                        <p className="text-white/90 text-sm font-medium leading-relaxed max-w-2xl bg-white/5 px-3 py-1 rounded backdrop-blur-sm border border-white/10">
                            系統已為您生成了 {totalRequired} 份必要文件清單，請上傳對應數據憑據以完成合規。
                        </p>
                    </div>
                </div>

                {/* Progress Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-4 rounded-lg flex flex-col gap-2 border border-white/10">
                        <span className="text-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">已上傳 (Uploaded)</span>
                        <div className="text-3xl font-bold text-emerald-400 drop-shadow-sm">{totalUploaded} <span className="text-sm text-slate-300 font-medium">/ {totalRequired}</span></div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg flex flex-col gap-2 border border-white/10">
                        <span className="text-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">待上傳 (Remaining)</span>
                        <div className="text-3xl font-bold text-amber-400 drop-shadow-sm">{remaining} <span className="text-sm text-slate-300 font-medium">份</span></div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg flex flex-col justify-center gap-3 border border-white/10">
                        <div className="flex justify-between items-end">
                            <span className="text-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">完成率 (Progress)</span>
                            <span className="text-2xl font-bold text-stitch-teal-start">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                            <motion.div
                                className="bg-stitch-teal-start h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Document List by Category */}
            <div className="space-y-12">
                {CATEGORIES.map((category) => {
                    const catDocs = MOCK_DOCUMENTS.filter(d => d.category === category.id);
                    const catUploaded = catDocs.filter(d => uploadedDocs[d.id]).length;

                    return (
                        <div key={category.id} className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                                <Database className="w-5 h-5 text-stitch-teal-start" />
                                <h2 className="text-lg font-bold text-slate-800">{category.name}</h2>
                                <Badge variant="optimal" styleType="soft" className="ml-auto">
                                    {catUploaded} / {catDocs.length}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {catDocs.map((doc) => {
                                    const isUploaded = uploadedDocs[doc.id];

                                    return (
                                        <GlassCard
                                            key={doc.id}
                                            className={`p-4 transition-all duration-300 border stitch-glass ${isUploaded
                                                ? 'border-emerald-200 bg-emerald-50/50'
                                                : 'border-slate-200 hover:border-stitch-teal-start hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <FileText className={`w-5 h-5 ${isUploaded ? 'text-emerald-500' : 'text-slate-400'}`} />
                                                {isUploaded ? (
                                                    <Badge variant="optimal" styleType="soft" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                                        已上傳
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="lethal" styleType="soft" className="bg-amber-100 text-amber-700 border-amber-200">
                                                        待上傳
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className={`text-sm font-bold mb-1 line-clamp-2 ${isUploaded ? 'text-slate-600' : 'text-slate-800'}`}>
                                                {doc.title}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 mb-4 uppercase tracking-widest">
                                                格式: PDF / JPG / Excel
                                            </p>

                                            {!isUploaded ? (
                                                <button
                                                    onClick={() => handleUpload(doc.id)}
                                                    className="w-full py-2 flex items-center justify-center gap-2 bg-stitch-teal-start text-white rounded-lg text-xs font-bold transition-transform active:scale-95 hover:bg-stitch-teal-start/90"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    <span>點擊上傳</span>
                                                </button>
                                            ) : (
                                                <div className="w-full py-2 flex items-center gap-2 text-emerald-600 text-xs font-bold justify-center bg-emerald-100/50 rounded-lg">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>存入 Vault</span>
                                                </div>
                                            )}
                                        </GlassCard>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
