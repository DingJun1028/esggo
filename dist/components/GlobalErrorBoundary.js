'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { useServices } from '../contexts/ServiceContext';
class ErrorBoundaryClass extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_) {
        // 更新 state 以便下一次渲染時顯示 Fallback UI
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // 利用注入的 loggerService 發送錯誤到遠端
        this.props.loggerService.error('React 組件渲染崩潰 (UI Crash)', error, {
            componentStack: errorInfo.componentStack
        });
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] p-8 bg-slate-50 rounded-xl border border-slate-200 m-4 shadow-sm", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6", children: _jsx("svg", { className: "w-8 h-8", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsx("h2", { className: "text-2xl font-bold text-slate-800 mb-3", children: "\u7CFB\u7D71\u906D\u9047\u672A\u9810\u671F\u7684\u932F\u8AA4" }), _jsx("p", { className: "text-slate-500 mb-8 text-center max-w-md leading-relaxed", children: "\u6211\u5011\u5DF2\u7D93\u8A18\u9304\u4E0B\u6B64\u932F\u8AA4\uFF0C\u4E26\u81EA\u52D5\u901A\u77E5\u7CFB\u7D71\u4E2D\u6A1E (OmniAgent) \u9032\u884C\u6392\u67E5\u3002\u82E5\u554F\u984C\u6301\u7E8C\u767C\u751F\uFF0C\u8ACB\u5617\u8A66\u91CD\u65B0\u6574\u7406\u9801\u9762\u3002" }), _jsx("button", { onClick: () => window.location.reload(), className: "px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm", children: "\u91CD\u65B0\u6574\u7406\u9801\u9762" })] }));
        }
        return this.props.children;
    }
}
// 透過 HOC (高階元件) 模式，將 Hook 取出的 LoggerService 注入給 Class Component
export function GlobalErrorBoundary({ children }) {
    const { loggerService } = useServices();
    return _jsx(ErrorBoundaryClass, { loggerService: loggerService, children: children });
}
//# sourceMappingURL=GlobalErrorBoundary.js.map