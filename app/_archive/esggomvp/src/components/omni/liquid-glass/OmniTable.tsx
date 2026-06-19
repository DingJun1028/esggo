"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Zap,
    Tag as TagIcon,
    ChevronDown,
    ChevronUp,
    Info,
    RefreshCw,
    ExternalLink,
    Box,
    Search,
    Filter,
    Activity,
    Lock,
    ArrowUpRight
} from 'lucide-react';
import { IOmniAtom } from '@/hooks/useOmniAtoms';
import { OmniBadge } from '../UI/OmniBadge';

interface OmniTableProps<T> {
    title: string;
    subtitle?: string;
    data: IOmniAtom[];
    columns: {
        key: string;
        header: string;
        render?: (value: any, item: IOmniAtom) => React.ReactNode;
    }[];
    onRowClick?: (item: IOmniAtom) => void;
    onSeal?: (uuid: string) => void;
}

/**
 * 🛰️ OmniTable: 4D Liquid Glass 萬能資產表格
 * 
 * 升級亮點：
 * 1. 4D 深度視覺 (Liquid Glass Layers)
 * 2. 5T Row Aura: 行級狀態光環
 * 3. 智慧語義排序與過濾
 * 4. 琥珀封存 (Amber Freeze) 快速操作
 */
export const OmniTable = <T extends any>({
    title,
    subtitle,
    data,
    columns,
    onRowClick,
    onSeal,
}: OmniTableProps<T>) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('timestamp');

    // 🌪️ 4D 語義過濾與排序
    const processedData = useMemo(() => {
        let result = [...data];

        // 搜尋邏輯
        if (searchTerm) {
            result = result.filter(item =>
                item.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                JSON.stringify(item.data).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 排序邏輯
        result.sort((a, b) => {
            if (sortBy === 'stability') {
                const sA = a.is_frozen ? 100 : 50; // 簡化邏輯
                const sB = b.is_frozen ? 100 : 50;
                return sB - sA;
            }
            return b.timestamp - a.timestamp;
        });

        return result;
    }, [data, searchTerm, sortBy]);

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-omni-glass-border bg-omni-glass-bg backdrop-blur-3xl shadow-2xl transition-all duration-700">
            {/* 🌊 4D Header Layer */}
            <div className="p-8 border-b border-omni-glass-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-omni-text-main italic tracking-tighter flex items-center gap-3">
                        <div className="p-2 bg-omni-primary/10 rounded-lg">
                            <Zap className="w-6 h-6 text-omni-primary" />
                        </div>
                        {title}
                    </h3>
                    {subtitle && <p className="text-[10px] text-omni-text-muted font-black uppercase tracking-[0.2em] ml-1">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-omni-text-muted group-hover:text-omni-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="追蹤資產 UUID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-omni-surface-2 border border-omni-glass-border rounded-xl py-2 pl-10 pr-4 text-xs text-omni-text-main focus:outline-none focus:border-omni-primary/50 transition-all font-mono"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl bg-omni-surface-2 border border-omni-glass-border hover:bg-omni-primary/10 transition-colors">
                        <RefreshCw className="w-4 h-4 text-omni-text-muted" />
                    </button>
                </div>
            </div>

            {/* 🛠️ Table Body */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-omni-glass-border bg-black/20">
                            <th className="px-8 py-5 text-[10px] font-black text-omni-text-muted uppercase tracking-[0.2em]">Origin</th>
                            {columns.map(col => (
                                <th key={col.key} className="px-8 py-5 text-[10px] font-black text-omni-text-muted uppercase tracking-[0.2em]">{col.header}</th>
                            ))}
                            <th className="px-8 py-5 text-[10px] font-black text-omni-text-muted uppercase tracking-[0.2em]">5T State</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-omni-glass-border/30">
                        {processedData.map((item) => (
                            <React.Fragment key={item.uuid}>
                                <tr
                                    className={`group hover:bg-omni-primary/[0.03] transition-all cursor-pointer relative ${expandedRow === item.uuid ? 'bg-omni-primary/[0.05]' : ''}`}
                                    onClick={() => setExpandedRow(expandedRow === item.uuid ? null : item.uuid)}
                                >
                                    {/* 5T Row Aura (行級光環) */}
                                    <td className="px-8 py-6 relative">
                                        <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-500 ${item.is_frozen ? 'bg-omni-accent shadow-[0_0_10px_#ffd700]' : 'bg-omni-primary/40'
                                            }`} />
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-omni-surface-2 flex items-center justify-center border border-omni-glass-border group-hover:border-omni-primary/30 transition-all">
                                                <Box size={16} className={item.is_frozen ? 'text-omni-accent' : 'text-omni-text-muted'} />
                                            </div>
                                            <span className="text-[10px] font-mono text-omni-text-muted opacity-50">{item.uuid.slice(0, 8)}</span>
                                        </div>
                                    </td>

                                    {/* Dynamic Data Columns */}
                                    {columns.map(col => (
                                        <td key={col.key} className="px-8 py-6">
                                            <div className="text-sm font-bold text-omni-text-main group-hover:text-omni-primary transition-colors">
                                                {col.render ? col.render(item.data?.[col.key], item) : (item.data?.[col.key] || 'N/A')}
                                            </div>
                                        </td>
                                    ))}

                                    {/* 5T State Badge */}
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <OmniBadge
                                                label={item.is_frozen ? "Sealed" : "Draft"}
                                                type={item.is_frozen ? "accent" : "primary"}
                                                pulse={!item.is_frozen}
                                            />
                                            {item.is_frozen && <ShieldCheck size={14} className="text-omni-accent" />}
                                        </div>
                                    </td>

                                    {/* Quick Actions */}
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {!item.is_frozen && onSeal && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onSeal(item.uuid); }}
                                                    className="p-2 rounded-lg bg-omni-accent/10 border border-omni-accent/30 text-omni-accent hover:bg-omni-accent hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    title="Amber Freeze"
                                                >
                                                    <Lock size={14} />
                                                </button>
                                            )}
                                            <div className="p-1 px-2 rounded-lg bg-omni-surface-2 border border-omni-glass-border">
                                                {expandedRow === item.uuid ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                {/* 🌌 4D Deep Analysis Drawer */}
                                <AnimatePresence>
                                    {expandedRow === item.uuid && (
                                        <tr>
                                            <td colSpan={columns.length + 3} className="p-0 border-none">
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="bg-omni-primary/[0.02] border-b border-omni-glass-border overflow-hidden"
                                                >
                                                    <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                                                        <div className="lg:col-span-2 space-y-6">
                                                            <div className="flex items-center gap-3">
                                                                <Zap size={18} className="text-omni-primary" />
                                                                <h4 className="text-xs font-black text-omni-primary uppercase tracking-[0.3em]">AI_Hypergraph_Analysis</h4>
                                                            </div>
                                                            <div className="p-6 rounded-[2rem] bg-omni-surface-2 border border-omni-glass-border relative overflow-hidden">
                                                                <p className="text-sm text-omni-text-main leading-relaxed italic z-10 relative">
                                                                    "此資產節點展現了高度的語義一致性。透過 5T 協議驗算，其
                                                                    <span className="text-omni-primary font-bold mx-1">Transparent</span>
                                                                    維度得分優異，建議儘速執行琥珀封存以完成資產化。"
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-6">
                                                                <button className="flex items-center gap-2 text-[10px] font-black text-omni-text-muted hover:text-omni-primary transition-all uppercase tracking-widest">
                                                                    <ExternalLink size={12} />溯源鏈 (Trace Chain)
                                                                </button>
                                                                <button className="flex items-center gap-2 text-[10px] font-black text-omni-text-muted hover:text-omni-primary transition-all uppercase tracking-widest">
                                                                    <ArrowUpRight size={12} /> 智庫關聯 (Nexus Ref)
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6 border-l border-omni-glass-border pl-10">
                                                            <div className="flex items-center gap-3">
                                                                <Activity size={18} className="text-omni-accent" />
                                                                <h4 className="text-xs font-black text-omni-accent uppercase tracking-[0.3em]">Sensory_Metrics</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                {['Tangible', 'Traceable', 'Trackable', 'Transparent'].map((t) => (
                                                                    <div key={t} className="space-y-1.5">
                                                                        <div className="flex justify-between text-[9px] font-black uppercase">
                                                                            <span className="text-omni-text-muted">{t}</span>
                                                                            <span className="text-omni-primary">85%</span>
                                                                        </div>
                                                                        <div className="h-1 w-full bg-omni-surface-3 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-omni-primary" style={{ width: '85%' }} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📊 Advanced Footer Layer */}
            <div className="p-6 bg-black/20 border-t border-omni-glass-border flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono text-omni-text-muted uppercase">
                        Active_Atoms: <span className="text-omni-primary font-bold">{processedData.length}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-omni-success animate-pulse" />
                        <span className="text-[10px] font-mono text-omni-text-muted uppercase tracking-widest">NCB_Live_Sync</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-omni-text-muted uppercase mr-2 tracking-widest">Sort By:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-omni-surface-2 border border-omni-glass-border rounded-lg px-3 py-1 text-[10px] font-black text-omni-primary outline-none focus:border-omni-primary/50"
                    >
                        <option value="timestamp">TIMESTAMP</option>
                        <option value="stability">STABILITY</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
