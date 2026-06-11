'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { useServices } from '../contexts/ServiceContext';
import { ILoggerService } from '../lib/logger/ILoggerService';

interface ErrorBoundaryProps {
    loggerService: ILoggerService;
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        // 更新 state 以便下一次渲染時顯示 Fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 利用注入的 loggerService 發送錯誤到遠端
        this.props.loggerService.error('React 組件渲染崩潰 (UI Crash)', error, {
            componentStack: errorInfo.componentStack
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-slate-50 rounded-xl border border-slate-200 m-4 shadow-sm">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">系統遭遇未預期的錯誤</h2>
                    <p className="text-slate-500 mb-8 text-center max-w-md leading-relaxed">
                        我們已經記錄下此錯誤，並自動通知系統中樞 (OmniAgent) 進行排查。若問題持續發生，請嘗試重新整理頁面。
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        重新整理頁面
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// 透過 HOC (高階元件) 模式，將 Hook 取出的 LoggerService 注入給 Class Component
export function GlobalErrorBoundary({ children }: { children: ReactNode }) {
    const { loggerService } = useServices();
    return <ErrorBoundaryClass loggerService={loggerService}>{children}</ErrorBoundaryClass>;
}