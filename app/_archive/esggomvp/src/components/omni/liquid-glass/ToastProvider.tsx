'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    toast: (opts: Omit<Toast, 'id'>) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_CFG: Record<ToastType, {
    border: string;
    glow: string;
    icon: React.ElementType;
    iconColor: string;
    bar: string;
}> = {
    success: { border: 'border-emerald-500/30', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.12)]', icon: CheckCircle2, iconColor: 'text-emerald-400', bar: 'bg-emerald-500' },
    error: { border: 'border-rose-500/30', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.12)]', icon: XCircle, iconColor: 'text-rose-400', bar: 'bg-rose-500' },
    warning: { border: 'border-amber-500/30', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.12)]', icon: AlertTriangle, iconColor: 'text-amber-400', bar: 'bg-amber-500' },
    info: { border: 'border-sky-500/30', glow: 'shadow-[0_0_30px_rgba(56,189,248,0.12)]', icon: Info, iconColor: 'text-sky-400', bar: 'bg-sky-500' },
};

function ToastItem({ t, onDismiss }: { t: Toast; onDismiss: (id: string) => void }) {
    const cfg = TOAST_CFG[t.type];
    const Icon = cfg.icon;
    const dur = t.duration ?? 4000;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className={`relative w-[340px] flex gap-3 items-start bg-black/85 backdrop-blur-2xl border ${cfg.border} rounded-2xl p-4 ${cfg.glow}`}
        >
            <div className={`mt-0.5 ${cfg.iconColor} flex-shrink-0`}><Icon size={18} /></div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{t.title}</p>
                {t.message && <p className="text-[11px] text-white/40 mt-0.5 font-mono leading-relaxed break-all">{t.message}</p>}
            </div>
            <button onClick={() => onDismiss(t.id)} className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5">
                <X size={14} />
            </button>
            <motion.div
                className={`absolute bottom-0 left-0 h-0.5 rounded-b-2xl ${cfg.bar}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: dur / 1000, ease: 'linear' }}
            />
        </motion.div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((opts: Omit<Toast, 'id'>) => {
        // [萬能優化] 重複過濾機制：避免重複彈出相同標題與內容
        setToasts(prev => {
            const isDuplicate = prev.some(t => t.title === opts.title && t.message === opts.message);
            if (isDuplicate) return prev;

            const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const dur = opts.duration ?? 4000;
            const newToasts = [...prev.slice(-3), { ...opts, id, duration: dur }]; // 減少視野內最多 Toast 數為 4

            timers.current.set(id, setTimeout(() => dismiss(id), dur));
            return newToasts;
        });
    }, [dismiss]);

    const success = useCallback((title: string, msg?: string) => toast({ type: 'success', title, message: msg }), [toast]);
    const error = useCallback((title: string, msg?: string) => toast({ type: 'error', title, message: msg }), [toast]);
    const warning = useCallback((title: string, msg?: string) => toast({ type: 'warning', title, message: msg }), [toast]);
    const info = useCallback((title: string, msg?: string) => toast({ type: 'info', title, message: msg }), [toast]);

    return (
        <ToastContext.Provider value={{ toast, success, error, warning, info }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[99999] flex flex-col gap-3 pointer-events-none perspective-1000">
                <AnimatePresence mode="popLayout" initial={false}>
                    {toasts.map(t => (
                        <div key={t.id} className="pointer-events-auto origin-right">
                            <ToastItem t={t} onDismiss={dismiss} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('[ToastProvider] useToast must be used within <ToastProvider>');
    return ctx;
}
