import React from 'react';

interface SyncStatusIndicatorProps {
    syncError: boolean;
    loading?: boolean;
    saved?: boolean;
    lastSaved?: Date | null;
}

export function SyncStatusIndicator({ syncError, loading, saved, lastSaved }: SyncStatusIndicatorProps) {
    // 狀態 1：離線或同步失敗
    if (syncError) {
        return (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">⚠️ 處於離線狀態，變更已暫存於本機</span>
            </div>
        );
    }

    // 狀態 2：正在儲存或載入中
    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 transition-all duration-300">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" />
                <span>正在儲存...</span>
            </div>
        );
    }

    // 狀態 3：初始狀態 (尚未有存檔紀錄)
    if (!lastSaved && !saved) {
        return null;
    }

    // 狀態 4：同步成功
    return (
        <div className="flex items-center gap-2 text-sm text-emerald-600 px-3 py-1.5 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
                已儲存 {lastSaved && (
                    <span className="text-emerald-500 text-xs ml-1">
                        ({lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </span>
                )}
            </span>
        </div>
    );
}