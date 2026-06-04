import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SyncStatusIndicator({ syncError, loading, saved, lastSaved }) {
    // 狀態 1：離線或同步失敗
    if (syncError) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm transition-all duration-300", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("span", { className: "font-medium", children: "\u26A0\uFE0F \u8655\u65BC\u96E2\u7DDA\u72C0\u614B\uFF0C\u8B8A\u66F4\u5DF2\u66AB\u5B58\u65BC\u672C\u6A5F" })] }));
    }
    // 狀態 2：正在儲存或載入中
    if (loading) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 transition-all duration-300", children: [_jsx("div", { className: "w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" }), _jsx("span", { children: "\u6B63\u5728\u5132\u5B58..." })] }));
    }
    // 狀態 3：初始狀態 (尚未有存檔紀錄)
    if (!lastSaved && !saved) {
        return null;
    }
    // 狀態 4：同步成功
    return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-emerald-600 px-3 py-1.5 transition-all duration-300", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), _jsxs("span", { children: ["\u5DF2\u5132\u5B58 ", lastSaved && (_jsxs("span", { className: "text-emerald-500 text-xs ml-1", children: ["(", lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ")"] }))] })] }));
}
//# sourceMappingURL=SyncStatusIndicator.js.map