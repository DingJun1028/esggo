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
            case 'Active': return 'text-[var(--theme-primary)]';
            case 'Pending Review':
            case 'Pending': return 'text-[var(--color-critical)]';
            case 'Draft': return 'text-slate-400';
            default: return 'text-[var(--theme-primary)]';
        }
    };

    if (compact) {
        return (
            <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
                onClick={onClick}
                className="group cursor-pointer p-3 rounded-md bg-[var(--theme-surface-2)] border border-[var(--theme-glass-border)] hover:border-[var(--theme-primary)]/30 transition-all flex items-center justify-between shadow-sm"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-md bg-[var(--theme-bg)] ${getStatusColor(status)}`}>
                        <Icon size={16} />
                    </div>
                    <div className="truncate pr-4">
                        <h3 className="text-sm font-bold text-[var(--theme-text-main)] truncate">{title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--theme-text-muted)] font-mono">
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
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            onClick={onClick}
            className="group cursor-pointer relative overflow-hidden p-6 bg-[var(--theme-surface-2)] rounded-md border border-[var(--theme-glass-border)] hover:border-[var(--theme-primary)]/30 transition-all flex flex-col h-full shadow-sm"
        >
            {/* UUID 溯源標籤 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-md bg-[var(--theme-primary-muted)] flex items-center justify-center text-[var(--theme-primary)]">
                        <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[var(--theme-primary)] uppercase tracking-widest bg-[var(--theme-primary)]/5 px-2 py-0.5 rounded-sm">
                        {uuid}
                    </span>
                </div>
                <ArrowUpRight size={16} className="text-[var(--theme-text-muted)] group-hover:text-[var(--theme-primary)] transition-colors" />
            </div>

            <h3 className="text-lg font-black tracking-tight text-[var(--theme-text-main)] mb-1 leading-tight">
                {title}
            </h3>
            {subtitle && (
                <p className="text-xs font-mono text-[var(--theme-text-muted)] mb-3 truncate">
                    {subtitle}
                </p>
            )}

            {standardRef && (
                <div className="text-[10px] font-bold text-[var(--theme-primary)] mb-4 bg-[var(--theme-primary)]/5 p-2 rounded-md border border-[var(--theme-primary)]/10 flex items-center gap-2">
                    <FileBarChart size={12} />
                    {standardRef}
                </div>
            )}

            {/* 5T 屬性區域 */}
            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[var(--theme-glass-border)]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--theme-text-muted)] uppercase">
                    <Clock size={12} />
                    {category}
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${getStatusColor(status)}`}>
                    <ShieldCheck size={12} />
                    {status}
                </div>
            </div>

            {/* 版本識別 */}
            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                <span className="text-[10px] font-black italic">V{version}</span>
            </div>
            
            {/* 微弱的數據感顆粒紋理 */}
            <div className="absolute inset-0 pointer-events-none data-matrix-grain opacity-[0.02]" />
        </motion.div>
    );
};
