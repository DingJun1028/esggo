"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // Here you would typically send to an error tracking service like Sentry
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">系統遇到預期外的問題</h1>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            我們在處理您的請求時遇到了一些技術困難。別擔心，您的數據通常是安全的。
                        </p>

                        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left overflow-auto max-h-32">
                            <code className="text-[10px] text-slate-400 font-mono break-all italic">
                                {this.state.error?.message || "未知系統錯誤"}
                            </code>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                重新整理
                            </button>
                            <Link
                                href="/dashboard"
                                onClick={() => this.setState({ hasError: false })}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
                            >
                                <Home className="w-4 h-4" />
                                回到首頁
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
