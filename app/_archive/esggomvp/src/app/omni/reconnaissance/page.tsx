"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IntelCard5T, IntelCard5TCompact } from "@/components/omni/reconnaissance/IntelCard5T";
import { IIntelNode5T, IntelCategory, INTEL_CATEGORY_LABELS } from "@/core/5t-protocol/intel-node";
import { SOURCE_INSTITUTIONS } from "@/services/reconnaissance/intel-aggregator";
import {
    Search,
    Filter,
    Plus,
    RefreshCw,
    Globe,
    Database,
    Shield,
    TrendingUp,
    Factory,
    Banknote,
    BookOpen,
    X,
    Loader2,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 消毒用戶輸入，防止 XSS 攻擊
 */
function sanitizeInput(input: string): string {
    return input.replace(/[<>\"'`()]/g, '');
}

/** 模擬情報資料 - 當 API 請求失敗時的備用 */
const mockIntelFallback: IIntelNode5T[] = [
    {
        uuid: "INTEL-S1-20260308-001",
        version: "2.0.0",
        timestamp: Date.now() - 3600000,
        category: "S1",
        impact_level: 5,
        evidence: { source: "UNFCCC" },
        protocol_5T: {
            tangible: true,
            traceable: "https://unfccc.int",
            trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"],
            transparent: "ISO-14064-1 | GHG Protocol",
            trustworthy: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
        },
        payload: {
            title: "COP29 碳市場協議突破",
            decision_ready_insight: "各國同意建立新的碳信用額度機制，建议在 90 天內評估對供應鏈的影響並調整碳定價策略。",
            target_entities: ["台積電", "鴻海", "友達"]
        }
    },
    {
        uuid: "INTEL-S2-20260308-002",
        version: "2.0.0",
        timestamp: Date.now() - 7200000,
        category: "S2",
        impact_level: 4,
        evidence: { source: "ISSB" },
        protocol_5T: {
            tangible: true,
            traceable: "https://www.ifrs.org/groups/international-sustainability-standards-board",
            trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"],
            transparent: "ISSB S1 | ISSB S2",
            trustworthy: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
        },
        payload: {
            title: "ISSB 準則強制化時程確認",
            decision_ready_insight: "2026 年起主要市場將強制採用 ISSB 準則，建議立即啟動差距分析以確保合規。",
            target_entities: ["上市櫃公司", "金融機構"]
        }
    },
    {
        uuid: "INTEL-S4-20260308-003",
        version: "2.0.0",
        timestamp: Date.now() - 10800000,
        category: "S4",
        impact_level: 5,
        evidence: { source: "NGFS" },
        protocol_5T: {
            tangible: true,
            traceable: "https://www.ngfs.net",
            trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"],
            transparent: "NGFS Climate Scenarios | ECB Stress Test",
            trustworthy: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5"
        },
        payload: {
            title: "央行氣候壓力測試新規範",
            decision_ready_insight: "歐洲央行將於 2026 年實施更嚴格的氣候壓力測試，金融機構需提前 6 個月準備。",
            target_entities: ["中信金", "玉山金", "富邦金"]
        }
    },
    {
        uuid: "INTEL-S5-20260308-004",
        version: "2.0.0",
        timestamp: Date.now() - 14400000,
        category: "S5",
        impact_level: 3,
        evidence: { source: "SEMI" },
        protocol_5T: {
            tangible: true,
            traceable: "https://www.semi.org",
            trackable: ["CREATED_AT_GATEWAY", "MAPPED_TO_EXPOSURE"],
            transparent: "SEMI ESG Standards | ISO 14001",
            trustworthy: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5"
        },
        payload: {
            title: "半導體業碳中和路線圖更新",
            decision_ready_insight: "主要半導體製造商承諾 2050 年前達成範疇一至三碳中和，建議同步調整供應商審核標準。",
            target_entities: ["半導體供應鏈"]
        }
    }
];

const categoryIcons: Record<IntelCategory, React.ReactNode> = {
    S1: <Globe className="w-4 h-4" />,
    S2: <BookOpen className="w-4 h-4" />,
    S3: <TrendingUp className="w-4 h-4" />,
    S4: <Banknote className="w-4 h-4" />,
    S5: <Factory className="w-4 h-4" />
};

const categoryColors: Record<IntelCategory, string> = {
    S1: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    S2: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    S3: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    S4: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    S5: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400"
};

/**
 * 🏛️ 商業偵情中心頁面
 * Business Reconnaissance Center
 */
export default function ReconnaissancePage() {
    const [selectedCategory, setSelectedCategory] = useState<IntelCategory | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState("");
    const [intels, setIntels] = useState<IIntelNode5T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 從 API 獲取情報資料
    const fetchIntelData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/reconnaissance');
            if (!response.ok) {
                if (response.status === 401) {
                    setError('請先登入以訪問情報資料');
                    setIntels(mockIntelFallback);
                } else {
                    throw new Error('Failed to fetch intel');
                }
            } else {
                const data = await response.json();
                // 使用 API 回應資料，若無則使用 fallback
                if (data && data.categories) {
                    setIntels(mockIntelFallback);
                } else if (data && data.intels) {
                    setIntels(data.intels);
                } else {
                    setIntels(mockIntelFallback);
                }
            }
        } catch (err) {
            console.error('Error fetching intel:', err);
            setError('載入情報失敗，使用備用資料');
            setIntels(mockIntelFallback);
        } finally {
            setIsLoading(false);
        }
    };

    // 頁面載入時獲取資料
    useEffect(() => {
        fetchIntelData();
    }, []);

    // 過濾情報（使用消毒後的輸入）
    const sanitizedQuery = sanitizeInput(searchQuery);
    const filteredIntels = intels.filter((intel) => {
        const matchesCategory = selectedCategory === 'ALL' || intel.category === selectedCategory;
        const matchesSearch = !sanitizedQuery || 
            intel.payload.title.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
            intel.payload.decision_ready_insight.toLowerCase().includes(sanitizedQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // 獲取情報統計
    const stats = {
        total: intels.length,
        S1: intels.filter(i => i.category === 'S1').length,
        S2: intels.filter(i => i.category === 'S2').length,
        S3: intels.filter(i => i.category === 'S3').length,
        S4: intels.filter(i => i.category === 'S4').length,
        S5: intels.filter(i => i.category === 'S5').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            {/* 頁面標題 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                {/* 錯誤提示 */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-amber-400" />
                            商業偵情中心
                            <span className="text-sm font-normal text-slate-400 ml-2">
                                Business Reconnaissance Center
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-2">
                            30+ 源頭機構 · 5T 協議門 · 決策可用內容
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => fetchIntelData()}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="重新整理"
                        >
                            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
                        </button>
                        <button
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    const res = await fetch('/api/reconnaissance', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ action: 'crawl' })
                                    });
                                    const data = await res.json();
                                    if (data.intels) {
                                        setIntels(data.intels);
                                    }
                                    setError(null);
                                } catch (err) {
                                    setError('爬蟲執行失敗');
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
                            title="執行爬蟲掃描"
                        >
                            <Globe className="w-4 h-4" />
                            爬蟲掃描
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            新增情報
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* 統計卡片 */}
            <div className="grid grid-cols-6 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">總情報</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                </motion.div>

                {(Object.keys(INTEL_CATEGORY_LABELS) as IntelCategory[]).map((cat, idx) => (
                    <motion.button
                        key={cat}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
                        className={cn(
                            "col-span-1 p-4 rounded-2xl border transition-all",
                            selectedCategory === cat
                                ? `bg-gradient-to-br ${categoryColors[cat]} border-white/30`
                                : "bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20"
                        )}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className={selectedCategory === cat ? "text-white" : "text-slate-400"}>
                                {categoryIcons[cat]}
                            </span>
                            <span className={cn("text-xs", selectedCategory === cat ? "text-white" : "text-slate-400")}>
                                {cat}
                            </span>
                        </div>
                        <div className={cn("text-2xl font-bold", selectedCategory === cat ? "text-white" : "text-slate-300")}>
                            {stats[cat]}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                            {INTEL_CATEGORY_LABELS[cat].zh}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* 搜尋與篩選 */}
            <LiquidGlassContainer className="p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="搜尋情報標題或內容..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as IntelCategory | 'ALL')}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
                        >
                            <option value="ALL">全部分類</option>
                            <option value="S1">S1 全球治理</option>
                            <option value="S2">S2 揭露框架</option>
                            <option value="S3">S3 全球智庫</option>
                            <option value="S4">S4 資本金融</option>
                            <option value="S5">S5 產業技術</option>
                        </select>
                    </div>
                </div>
            </LiquidGlassContainer>

            {/* 情报列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredIntels.map((intel, idx) => (
                        <motion.div
                            key={intel.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <IntelCard5T intel={intel} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredIntels.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-400">沒有找到相符的情報</p>
                </div>
            )}

            {/* 新增情報 Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddIntelModal 
                        onClose={() => setShowAddModal(false)} 
                        onSuccess={(newIntel) => {
                            setIntels([newIntel, ...intels]);
                            setShowAddModal(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * 新增情報表單 Modal 元件
 */
function AddIntelModal({ 
    onClose, 
    onSuccess 
}: { 
    onClose: () => void; 
    onSuccess: (intel: IIntelNode5T) => void;
}) {
    const [formData, setFormData] = useState({
        source_url: '',
        title: '',
        insight: '',
        risk_score: 50,
        category: 'S3' as IntelCategory,
        affected_supply_chain: '',
        iso_tags: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/reconnaissance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    affected_supply_chain: formData.affected_supply_chain 
                        ? formData.affected_supply_chain.split(',').map(s => s.trim())
                        : [],
                    iso_tags: formData.iso_tags 
                        ? formData.iso_tags.split(',').map(s => s.trim())
                        : []
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to create intel');
            }

            const data = await response.json();
            if (data.intel) {
                onSuccess(data.intel);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '提交失敗');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg p-6 rounded-3xl bg-slate-800 border border-white/10 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">新增情報</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">來源 URL *</label>
                        <input
                            type="url"
                            required
                            value={formData.source_url}
                            onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">情報標題 *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                            placeholder="輸入情報標題"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">情報內容 *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.insight}
                            onChange={(e) => setFormData({ ...formData, insight: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                            placeholder="輸入90天行動建議..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">分類</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as IntelCategory })}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
                            >
                                <option value="S1">S1 全球治理</option>
                                <option value="S2">S2 揭露框架</option>
                                <option value="S3">S3 全球智庫</option>
                                <option value="S4">S4 資本金融</option>
                                <option value="S5">S5 產業技術</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                風險分數: {formData.risk_score}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.risk_score}
                                onChange={(e) => setFormData({ ...formData, risk_score: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">受影響供應鏈</label>
                        <input
                            type="text"
                            value={formData.affected_supply_chain}
                            onChange={(e) => setFormData({ ...formData, affected_supply_chain: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                            placeholder="用逗號分隔，如: 台積電，鴻海"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">ISO 標籤</label>
                        <input
                            type="text"
                            value={formData.iso_tags}
                            onChange={(e) => setFormData({ ...formData, iso_tags: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                            placeholder="用逗號分隔，如: ISO-14064, GHG Protocol"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    提交中...
                                </span>
                            ) : '提交情報'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}