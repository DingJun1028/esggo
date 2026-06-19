'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ShieldAlert, Sparkles, Activity, X, Check,
    ChevronRight, AlertTriangle, Info, TrendingUp, Zap,
    Hash, FileText, Globe, Circle
} from 'lucide-react';

// ─── 類型定義 ───────────────────────────────────────────────────────
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
    badge?: string;   // GRI-305-1 / TCFD / etc.
    autoRepair?: boolean; // 是否觸發 Auto-Karma-Repair
}

// ─── 靜態通知資料 (實際應用中可接入 API) ────────────────────────────
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
    {
        id: 'n4', title: 'TCFD Climate Risk Alert', titleZh: 'TCFD 氣候風險警示',
        description: '台灣水資源短缺指數上升 12%。建議更新財務重大性評評估矩陣，並檢視供水風險敞口。',
        category: 'esg', priority: 'high', timestamp: new Date(Date.now() - 2 * 3600000),
        read: true, actionLabel: '執行 TCFD 評估', actionUrl: '/omni/carbon', badge: 'TCFD'
    },
    {
        id: 'n5', title: 'Alchemy Level Up!', titleZh: '學習等級提升！',
        description: '恭喜！您已完成「碳盤查方法學」學習，成功晉升至 Level 7「永續策略師」。',
        category: 'milestone', priority: 'medium', timestamp: new Date(Date.now() - 5 * 3600000),
        read: true, badge: 'Lv.7'
    },
    {
        id: 'n6', title: 'System Hardening Complete', titleZh: '系統安全強化完成',
        description: 'API Rate Limiting 與 Redis 分布式防護機制已全數完成部署。系統安全等級：A+',
        category: 'system', priority: 'low', timestamp: new Date(Date.now() - 24 * 3600000),
        read: true, badge: 'Security A+'
    },
];

// ─── 設定參數 ────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; icon: typeof Bell; color: string; bg: string }> = {
    security: { label: '安全防護', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/30' },
    ai: { label: 'AI 代理', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
    esg: { label: 'ESG 指標', icon: Globe, color: 'text-omni-primary', bg: 'bg-omni-primary/10 border-omni-primary/30' },
    system: { label: '系統', icon: Activity, color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/30' },
    milestone: { label: '里程碑', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
};

const PRIORITY_CONFIG: Record<NotificationPriority, { label: string; dot: string }> = {
    critical: { label: '緊急', dot: 'bg-rose-500 animate-ping' },
    high: { label: '高', dot: 'bg-amber-400' },
    medium: { label: '中', dot: 'bg-omni-primary' },
    low: { label: '低', dot: 'bg-slate-500' },
};

function formatRelativeTime(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}秒前`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分鐘前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小時前`;
    return `${Math.floor(diff / 86400)}天前`;
}

// ─── 單一通知卡片 ────────────────────────────────────────────────────
function NotificationCard({
    notif,
    onRead,
    onDismiss,
}: {
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`relative p-4 rounded-2xl border transition-all group ${notif.read ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
            onClick={() => !notif.read && onRead(notif.id)}
        >
            {/* Unread indicator */}
            {!notif.read && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="text-[9px] text-omni-text-muted font-mono uppercase tracking-widest">{pri.label}</span>
                    <div className={`w-2 h-2 rounded-full ${pri.dot}`} />
                </div>
            )}

            <div className="flex gap-4">
                {/* Icon */}
                <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center ${cat.bg}`}>
                    <Icon size={18} className={cat.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm font-black leading-tight tracking-tight ${notif.read ? 'text-omni-text-muted' : 'text-omni-text-main'}`}>
                            {notif.read ? notif.titleZh : notif.titleZh}
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-white/10 shrink-0 mt-0.5"
                        >
                            <X size={10} className="text-white/40" />
                        </button>
                    </div>

                    <p className="text-[10px] text-white/40 leading-relaxed mb-2">{notif.description}</p>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            {notif.badge && (
                                <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color}`}>
                                    {notif.badge}
                                </span>
                            )}
                            <span className="text-[9px] text-white/25 font-mono">{formatRelativeTime(notif.timestamp)}</span>
                        </div>
                        {notif.actionLabel && notif.actionUrl && (
                            <a
                                href={notif.actionUrl}
                                onClick={(e) => e.stopPropagation()}
                                className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity ${cat.color}`}
                            >
                                {notif.actionLabel} <ChevronRight size={10} />
                            </a>
                        )}
                    </div>

                    {/* Auto-Karma-Repair badge */}
                    {notif.autoRepair && (
                        <div className="mt-2 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl px-2 py-1">
                            <Zap size={10} className="text-rose-400" />
                            <span className="text-[9px] font-black text-rose-400 tracking-widest uppercase">Auto-Karma-Repair 已啟動</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ─── 主組件 (智能通知中心) ──────────────────────────────────────────
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

    const handleMarkAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const filtered = activeCategory === 'all'
        ? notifications
        : notifications.filter(n => n.category === activeCategory);

    return (
        <div className="relative">
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 transition-colors text-[var(--sidebar-text)] hover:text-[var(--primary)] relative"
                aria-label="通知中心"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black border-2 border-[var(--bg-base)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-20 md:top-full mt-2 md:w-[380px] max-h-[75vh] md:max-h-[600px] rounded-[2rem] bg-omni-surface/90 backdrop-blur-3xl border border-omni-glass-border p-0 z-50 shadow-2xl flex flex-col overflow-hidden"
                            style={{ minHeight: 350 }}
                        >
                            {/* ── 頭部 ── */}
                            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10">
                                <div>
                                    <h4 className="text-sm font-black text-omni-text-main tracking-tight flex items-center gap-2">
                                        <Bell size={14} className="text-omni-primary" />
                                        通知中心 (Alert Hub)
                                    </h4>
                                    <p className="text-[10px] text-omni-text-muted font-bold uppercase tracking-widest mt-0.5">
                                        {unreadCount > 0 ? `${unreadCount} New Signals` : 'System Synchronized'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-[9px] font-black uppercase tracking-widest text-omni-primary/70 hover:text-omni-primary transition-colors flex items-center gap-1"
                                        >
                                            <Check size={10} /> 全讀
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl hover:bg-white/10 transition-colors">
                                        <X size={14} className="text-white/40" />
                                    </button>
                                </div>
                            </div>

                            {/* ── 分類篩選 ── */}
                            <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-none border-b border-white/5">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeCategory === 'all' ? 'bg-omni-primary text-black' : 'text-white/40 hover:text-white bg-white/5'}`}
                                >
                                    全部 ({notifications.length})
                                </button>
                                {(Object.entries(CATEGORY_CONFIG) as [NotificationCategory, typeof CATEGORY_CONFIG[NotificationCategory]][]).map(([key, cfg]) => {
                                    const count = notifications.filter(n => n.category === key).length;
                                    if (count === 0) return null;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setActiveCategory(key)}
                                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${activeCategory === key ? `${cfg.bg} ${cfg.color} border-current` : 'text-white/40 hover:text-white bg-white/5 border-white/10'}`}
                                        >
                                            <cfg.icon size={10} /> {cfg.label} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── 通知列表 ── */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                <AnimatePresence>
                                    {filtered.length > 0 ? filtered.map(n => (
                                        <NotificationCard
                                            key={n.id}
                                            notif={n}
                                            onRead={handleRead}
                                            onDismiss={handleDismiss}
                                        />
                                    )) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-16 gap-3"
                                        >
                                            <Circle size={32} className="text-white/10" />
                                            <p className="text-xs text-white/20">此類別暫無通知</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ── 底部狀態 ── */}
                            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    SENTIENT ALERT HUB · ACTIVE
                                </div>
                                <a href="/omni/actions" className="text-[9px] text-omni-primary/60 hover:text-omni-primary transition-colors font-mono uppercase tracking-widest">
                                    全部動作紀錄 →
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
