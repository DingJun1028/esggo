'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, 
    X, 
    Check, 
    ShieldAlert, 
    Sparkles, 
    Activity, 
    ChevronRight, 
    TrendingUp, 
    Zap, 
    Globe, 
    Circle,
    Settings
} from 'lucide-react';

/**
 * 🔔 NotificationCenter - Sentient Alert Hub
 * Refined for Solid Backgrounds and Theme Integration.
 * Resolves "Layout Breaking" and "Problematic Transparency" issues.
 */

export type NotificationCategory = 'security' | 'ai' | 'esg' | 'system' | 'milestone';
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface SmartNotification {
    id: string;
    title: string;
    titleZh: string;
    description: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    timestamp: Date;
    read: boolean;
    actionLabel?: string;
    actionUrl?: string;
    badge?: string;
    autoRepair?: boolean;
}

const INITIAL_NOTIFICATIONS: SmartNotification[] = [
    {
        id: 'n1', title: 'Auto-Karma-Repair Triggered', titleZh: '自動果因修復已啟動',
        description: '偵測到 Scope 3 供應鏈數據異常。系統已自動啟動 Jules 九步驟因果協議進行根源修復。',
        category: 'security', priority: 'critical', timestamp: new Date(Date.now() - 2 * 60000),
        read: false, actionLabel: '查看修復進度', actionUrl: '/omni/jules', autoRepair: true, badge: 'Auto-Repair'
    },
    {
        id: 'n2', title: 'GRI 305-1 Verification Complete', titleZh: 'GRI 305-1 驗算完成',
        description: '溫室氣體 Scope 1 直接排放指標已通過 5T 零幻覺驗算，並完成 Hash Lock 不可篡改封印。',
        category: 'esg', priority: 'high', timestamp: new Date(Date.now() - 15 * 60000),
        read: false, actionLabel: '查看證明', actionUrl: '/omni/reports', badge: 'GRI-305-1'
    },
    {
        id: 'n3', title: 'JunAiKey Gnosis Update', titleZh: 'JunAiKey 知識更新',
        description: '萬能精靈已分析 2026 Q1 最新永續揭露準則，新增 4 個知識點至「知識聖殿」。',
        category: 'ai', priority: 'medium', timestamp: new Date(Date.now() - 35 * 60000),
        read: false, actionLabel: '探索知識殿', actionUrl: '/knowledge', badge: '+4 知識點'
    },
];

const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; icon: typeof Bell; color: string; bg: string }> = {
    security: { label: '安全防護', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
    ai: { label: 'AI 代理', icon: Sparkles, color: 'text-aqua', bg: 'bg-aqua/10 border-aqua/20' },
    esg: { label: 'ESG 指標', icon: Globe, color: 'text-[var(--theme-primary)]', bg: 'bg-[var(--theme-primary-muted)] border-[var(--theme-primary)]/20' },
    system: { label: '系統', icon: Activity, color: 'text-slate-500', bg: 'bg-slate-500/10 border-slate-500/20' },
    milestone: { label: '里程碑', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
};

const PRIORITY_CONFIG: Record<NotificationPriority, { label: string; dot: string }> = {
    critical: { label: '緊急', dot: 'bg-rose-500 animate-ping' },
    high: { label: '高', dot: 'bg-amber-500' },
    medium: { label: '中', dot: 'bg-[var(--theme-primary)]' },
    low: { label: '低', dot: 'bg-slate-400' },
};

function formatRelativeTime(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分鐘前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小時前`;
    return `${Math.floor(diff / 86400)}天前`;
}

function NotificationCard({ notif, onRead, onDismiss }: {
    notif: SmartNotification;
    onRead: (id: string) => void;
    onDismiss: (id: string) => void;
}) {
    const cat = CATEGORY_CONFIG[notif.category];
    const pri = PRIORITY_CONFIG[notif.priority];
    const Icon = cat.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-4 rounded-3xl border transition-all ${notif.read ? 'bg-[var(--theme-surface-2)] border-[var(--theme-glass-border)]' : 'bg-[var(--theme-surface)] border-aqua/30 shadow-lg'}`}
            onClick={() => !notif.read && onRead(notif.id)}
        >
            <div className="flex gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center ${cat.bg}`}>
                    <Icon size={18} className={cat.color} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-bold ${notif.read ? 'text-[var(--theme-text-sub)]' : 'text-[var(--theme-text-main)]'}`}>
                            {notif.titleZh}
                        </h4>
                        <button onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }} className="text-[var(--theme-text-muted)] hover:text-rose-500 p-1">
                            <X size={14} />
                        </button>
                    </div>
                    <p className="text-xs text-[var(--theme-text-sub)] mt-1 line-clamp-2">{notif.description}</p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--theme-text-muted)] font-mono">{formatRelativeTime(notif.timestamp)}</span>
                            {notif.badge && <span className={`text-[9px] px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color} font-black uppercase tracking-tighter`}>{notif.badge}</span>}
                        </div>
                        {notif.actionLabel && (
                            <a href={notif.actionUrl} className="text-[10px] font-black text-aqua hover:underline flex items-center gap-1">
                                {notif.actionLabel} <ChevronRight size={12} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<SmartNotification[]>(INITIAL_NOTIFICATIONS);
    const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const handleDismiss = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const filtered = activeCategory === 'all' ? notifications : notifications.filter(n => n.category === activeCategory);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl hover:bg-[var(--theme-surface-2)] transition-all relative text-[var(--theme-text-main)]"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[var(--theme-bg)]">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsOpen(false)} 
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute -right-2 sm:right-0 top-full mt-4 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] bg-[var(--theme-surface)] border border-[var(--theme-glass-border)] rounded-[2.5rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[600px] origin-top-right"
                        >
                            <div className="p-6 border-b border-[var(--theme-glass-border)] flex items-center justify-between bg-[var(--theme-surface-2)]">
                                <div>
                                    <h3 className="text-lg font-black text-[var(--theme-text-main)] tracking-tight">Alert Hub</h3>
                                    <p className="text-[10px] text-aqua font-black uppercase tracking-[0.2em]">{unreadCount} Pending Signals</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-[var(--theme-surface-3)]">
                                    <Settings size={18} className="text-[var(--theme-text-muted)]" />
                                </button>
                            </div>

                            <div className="p-4 flex gap-2 overflow-x-auto scrollbar-none border-b border-[var(--theme-glass-border)]">
                                <button 
                                    onClick={() => setActiveCategory('all')} 
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-aqua text-black' : 'bg-[var(--theme-surface-2)] text-[var(--theme-text-muted)] hover:text-aqua'}`}
                                >
                                    All
                                </button>
                                {Object.keys(CATEGORY_CONFIG).map((c) => (
                                    <button 
                                        key={c}
                                        onClick={() => setActiveCategory(c as any)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c ? 'bg-[var(--theme-primary)] text-white' : 'bg-[var(--theme-surface-2)] text-[var(--theme-text-muted)]'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {filtered.length > 0 ? filtered.map(n => (
                                    <NotificationCard key={n.id} notif={n} onRead={handleRead} onDismiss={handleDismiss} />
                                )) : (
                                    <div className="py-20 text-center text-[var(--theme-text-muted)]">
                                        <Circle className="mx-auto mb-4 opacity-20" size={32} />
                                        <p className="text-xs">No active signals in this spectrum.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-[var(--theme-glass-border)] bg-[var(--theme-surface-2)] flex justify-between items-center">
                                <span className="text-[9px] font-mono text-[var(--theme-text-muted)] uppercase tracking-widest">Sentient Terminal v1.1</span>
                                <button onClick={() => setNotifications([])} className="text-[9px] font-black text-rose-500 hover:underline uppercase tracking-widest">Clear All</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
