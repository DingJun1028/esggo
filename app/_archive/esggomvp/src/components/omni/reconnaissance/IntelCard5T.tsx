/**
 * 💡 UI 組件：商業偵情中心 - 5T 戰略情報卡 (Bento Box 佈局)
 * 
 * 視覺：高密度、零幻覺、毛玻璃質感
 * 將抽象的 S1-S5 數據，轉化為具備「液態玻璃」質感的戰略面板
 */

'use client';

import React from 'react';
import { IIntelNode5T, IntelCategory, INTEL_CATEGORY_LABELS } from '@/core/5t-protocol/intel-node';

// ============== 5T 狀態指示燈 ==============
const StatusIndicator = ({
    status,
    label,
    color
}: {
    status: boolean | 'partial';
    label: string;
    color: 'green' | 'blue' | 'orange' | 'red';
}) => {
    const colorClasses = {
        green: 'bg-green-500 shadow-[0_0_8px_#22c55e]',
        blue: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]',
        orange: 'bg-orange-500 shadow-[0_0_8px_#f97316]',
        red: 'bg-red-600 shadow-[0_0_10px_#dc2626]'
    };

    const isActive = status === true;
    const isPartial = status === 'partial';

    return (
        <div className="flex items-center gap-1.5" title={label}>
            <div className={`w-2 h-2 rounded-full ${colorClasses[color]} ${isActive ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] text-slate-400">{label}</span>
        </div>
    );
};

// ============== 分類標籤 ==============
const CategoryBadge = ({ category }: { category: IntelCategory }) => {
    const labels = INTEL_CATEGORY_LABELS[category];
    const categoryColors: Record<IntelCategory, string> = {
        S1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        S2: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        S3: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        S4: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        S5: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    };

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded border ${categoryColors[category]}`}>
            {category} · {labels.zh}
        </span>
    );
};

// ============== 衝擊等級星級 ==============
const ImpactStars = ({ level }: { level: 1 | 2 | 3 | 4 | 5 }) => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`text-xs ${star <= level ? 'text-amber-400' : 'text-slate-600'}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

// ============== 主要組件 ==============
export const IntelCard5T = ({ intel }: { intel: IIntelNode5T }) => {
    const timestamp = new Date(intel.timestamp).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        // 液態玻璃 (Liquid Glass) 底層：半透明背景 + 深度模糊 + 光影邊框
        <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] font-mono overflow-hidden group hover:bg-white/10 transition-all">

            {/* 頂部：S1-S5 分類與 5T 狀態燈號 */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                    <CategoryBadge category={intel.category} />
                    <span className="text-xs text-slate-400">Decision-Ready Content</span>
                </div>

                {/* 4可 1不可 狀態指示燈 */}
                <div className="flex gap-3">
                    <StatusIndicator status={intel.protocol_5T.tangible} label="可感知" color="green" />
                    <StatusIndicator status={true} label="可溯源" color="green" />
                    <StatusIndicator status="partial" label="可追蹤" color="blue" />
                    <StatusIndicator status="partial" label="可透明" color="orange" />
                    <StatusIndicator status={true} label="不可篡改" color="red" />
                </div>
            </div>

            {/* 核心情報內容 */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{intel.payload.title}</h3>
                    <ImpactStars level={intel.impact_level} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-amber-400 pl-3">
                    {intel.payload.decision_ready_insight}
                </p>
            </div>

            {/* 目標實體標籤 */}
            {intel.payload.target_entities.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                    {intel.payload.target_entities.map((entity, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-700/50 text-slate-300 rounded">
                            {entity}
                        </span>
                    ))}
                </div>
            )}

            {/* 底部：驗算標籤與溯源證明 */}
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest space-y-1">
                    <p>TRACE: {intel.protocol_5T.traceable}</p>
                    <p>CALC: {intel.protocol_5T.transparent}</p>
                    <p>ID: {intel.uuid}</p>
                </div>
                <div className="text-right space-y-1">
                    <span className="text-[9px] text-red-400/80 font-mono block">
                        HASH_LOCK: {intel.protocol_5T.trustworthy.substring(0, 12)}...
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono block">
                        {timestamp}
                    </span>
                </div>
            </div>

            {/* 浮動邊框效果 */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/5 group-hover:border-white/20 transition-colors" />
        </div>
    );
};

// ============== 組件變體：簡化版本 ==============
export const IntelCard5TCompact = ({ intel }: { intel: IIntelNode5T }) => {
    const labels = INTEL_CATEGORY_LABELS[intel.category];

    const categoryColors: Record<IntelCategory, string> = {
        S1: 'from-blue-500/20 to-blue-600/10',
        S2: 'from-purple-500/20 to-purple-600/10',
        S3: 'from-amber-500/20 to-amber-600/10',
        S4: 'from-emerald-500/20 to-emerald-600/10',
        S5: 'from-rose-500/20 to-rose-600/10'
    };

    return (
        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${categoryColors[intel.category]} backdrop-blur-md border border-white/10 group hover:border-white/30 transition-all`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{intel.category}</span>
                    <span className="text-xs text-slate-400">{labels.zh}</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-[8px] ${star <= intel.impact_level ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                    ))}
                </div>
            </div>

            <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{intel.payload.title}</h4>
            <p className="text-[10px] text-slate-400 line-clamp-2">{intel.payload.decision_ready_insight}</p>

            <div className="mt-2 flex justify-between items-center">
                <span className="text-[8px] text-slate-500 font-mono">
                    {intel.protocol_5T.trustworthy.substring(0, 8)}...
                </span>
            </div>
        </div>
    );
};

export default IntelCard5T;
