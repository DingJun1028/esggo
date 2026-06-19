'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Clock, FileBarChart } from 'lucide-react';

export type ReportStatus = 'Active' | 'Draft' | 'Pending' | 'Archived' | 'Published' | 'Pending Review';

export interface ReportCardProps {
    uuid: string;
    title: string;
    subtitle?: string;
    version: string;
    status: ReportStatus;
    icon: React.ElementType;
    category: string;
    completionRate?: number;
    standardRef?: string;
    compact?: boolean;
    stitchId?: string;
    onClick?: () => void;
}

/**
 * 🃏 ReportCard (永續報告卡片)
 * 整合 IComponentCore 的顯示邏輯。
 * 支持 7 大主題在 hover 時呈現霓虹光暈與資料狀態燈號。
 */
export const ReportCard: React.FC<ReportCardProps> = ({
    uuid,
    title,
    subtitle,
    version,
    status,
    icon: Icon,
    category,
    completionRate,
    standardRef,
    compact,
    stitchId,
    onClick
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published':
            case 'Active': return 'text-green-500';
            case 'Pending Review':
            case 'Pending': return 'text-yellow-500';
            case 'Draft': return 'text-omni-text-muted';
            default: return 'text-omni-primary';
        }
    };

    if (compact) {
        return (
            <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={onClick}
                className="group cursor-pointer p-3 rounded-xl bg-white/5 border border-white/10 hover:border-omni-primary/30 hover:bg-white/10 transition-all flex items-center justify-between"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-lg bg-white/5 ${getStatusColor(status)}`}>
                        <Icon size={16} />
                    </div>
                    <div className="truncate pr-4">
                        <h3 className="text-sm font-bold text-white truncate">{title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/40 font-mono">
                            <span>{uuid}</span>
                            <span>·</span>
                            <span>v{version}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={onClick}
            className="omni-card group cursor-pointer relative overflow-hidden p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors flex flex-col h-full"
        >
            {/* 頂部帶狀識別面 (UUID 溯源標籤) */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center text-omni-primary">
                        <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-omni-primary uppercase tracking-widest bg-omni-primary/5 px-2 py-0.5 rounded">
                        {uuid}
                    </span>
                </div>
                <ArrowUpRight size={16} className="text-omni-text-muted group-hover:text-omni-primary transition-colors" />
            </div>

            <h3 className="text-lg font-black tracking-tight text-white mb-1 leading-tight">
                {title}
            </h3>
            {subtitle && (
                <p className="text-xs font-mono text-white/40 mb-3 truncate">
                    {subtitle}
                </p>
            )}

            {standardRef && (
                <p className="text-xs text-omni-text-sub line-clamp-2 mb-4 bg-white/5 p-2 rounded-lg border border-white/5">
                    {standardRef}
                </p>
            )}

            {/* 5T 屬性區域 */}
            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-omni-text-muted uppercase">
                    <Clock size={12} />
                    {category}
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${getStatusColor(status)}`}>
                    <ShieldCheck size={12} />
                    {status}
                </div>
            </div>

            {/* 底部分發層級裝飾 */}
            <div className="absolute bottom-0 right-0 p-3 opacity-5 group-hover:opacity-20 transition-opacity">
                <span className="text-3xl font-black italic">v{version}</span>
            </div>

            {/* Hover 霓虹光暈 */}
            <div className="absolute inset-0 border border-transparent group-hover:border-omni-primary/30 rounded-2xl transition-colors pointer-events-none" />
        </motion.div>
    );
};
