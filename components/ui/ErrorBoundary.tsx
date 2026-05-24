'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { BrandButton, BrandCard } from '../brand';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center p-6">
          <BrandCard padding="lg" className="max-w-md w-full text-center space-y-6 shadow-extreme border-white/60 bg-white/80 backdrop-blur-xl rounded-[3rem]">
            <div className="w-20 h-20 rounded-[32px] bg-rose-50 flex items-center justify-center mx-auto text-rose-500 shadow-inner">
               <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl font-black text-[#003262] uppercase tracking-tight">系統異常中斷</h2>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  偵測到未預期的程式錯誤。這可能是由於組件渲染失敗或數據同步異常。
               </p>
            </div>
            
            <div className="p-4 bg-slate-900/5 rounded-2xl text-[10px] font-mono text-slate-400 break-all text-left">
               Error: {this.state.error?.message || 'Unknown Runtime Exception'}
            </div>

            <div className="flex flex-col gap-3">
               <BrandButton variant="primary" fullWidth className="h-14 rounded-2xl font-black shadow-xl" onClick={() => window.location.reload()}>
                  <RefreshCw size={18} className="mr-2" /> 重新啟動介面
               </BrandButton>
               <BrandButton variant="ghost" fullWidth onClick={() => window.location.href = '/'}>
                  <Home size={18} className="mr-2" /> 回到安全首頁
               </BrandButton>
            </div>
          </BrandCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
