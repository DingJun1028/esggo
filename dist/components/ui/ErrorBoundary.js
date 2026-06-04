'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { BrandButton, BrandCard } from '../brand';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
            error: null,
            retryCount: 0
        };
        this.handleReset = () => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error, retryCount: 0 };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState(prev => ({ retryCount: prev.retryCount + 1 }));
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-[#F8FAFD] flex items-center justify-center p-6", children: _jsxs(BrandCard, { padding: "lg", className: "max-w-md w-full text-center space-y-6 shadow-extreme border-white/60 bg-white/80 backdrop-blur-xl rounded-[3rem]", children: [_jsx("div", { className: "w-20 h-20 rounded-[32px] bg-rose-50 flex items-center justify-center mx-auto text-rose-500 shadow-inner", children: _jsx(AlertTriangle, { size: 40 }) }), _jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-black text-[#003262] uppercase tracking-tight", children: "\u7CFB\u7D71\u7570\u5E38\u4E2D\u65B7" }), _jsx("p", { className: "text-slate-500 text-sm font-medium leading-relaxed", children: this.state.retryCount > 2
                                        ? "偵測到連續崩潰，建議清除快取並完全重置系統。"
                                        : "偵測到未預期的程式錯誤。這可能是由於數據同步異常。" })] }), _jsxs("div", { className: "p-4 bg-slate-900/5 rounded-2xl text-[10px] font-mono text-slate-400 break-all text-left", children: ["Error: ", this.state.error?.message || 'Unknown Runtime Exception'] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs(BrandButton, { variant: "primary", fullWidth: true, className: "h-14 rounded-2xl font-black shadow-xl", onClick: () => window.location.reload(), children: [_jsx(RefreshCw, { size: 18, className: "mr-2" }), " \u5617\u8A66\u91CD\u65B0\u555F\u52D5"] }), this.state.retryCount > 2 && (_jsxs(BrandButton, { variant: "ghost", className: "text-rose-600 hover:bg-rose-50 border-rose-100", fullWidth: true, onClick: this.handleReset, children: [_jsx(RefreshCw, { size: 18, className: "mr-2" }), " \u6E05\u9664\u5FEB\u53D6\u4E26\u5F37\u5236\u91CD\u7F6E"] })), _jsxs(BrandButton, { variant: "ghost", fullWidth: true, onClick: () => window.location.href = '/', children: [_jsx(Home, { size: 18, className: "mr-2" }), " \u56DE\u5230\u5B89\u5168\u9996\u9801"] })] })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map