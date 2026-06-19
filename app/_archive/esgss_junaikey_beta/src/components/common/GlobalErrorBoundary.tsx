import React, { Component, ErrorInfo, ReactNode } from 'react';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { SystemError } from '../../omni/infrastructure/errors/SystemError';
import { APIError } from '../../services/api/errors';

import { AlertTriangle, RefreshCw, ShieldAlert, Home, Copy } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId?: string;
}

/**
 * 錯誤分類
 */
type ErrorCategory = 'SYSTEM' | 'API' | 'VALIDATION' | 'AUTH' | 'BUSINESS' | 'UNKNOWN';

/**
 * [SHAN_XIANG_HARDENING] Global Error Boundary
 * Catches unhandled exceptions in the component tree and displays a
 * high-resilience "Liquid Glass" fallback UI instead of crashing the app.
 * 
 * Theme: Aqua Cyan (#00FFFF)
 */
export class GlobalErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR_${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, error, errorInfo: null, errorId };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 記錄錯誤到 Logger
    omniLogger.error(LogCategory.SYSTEM, '[GlobalErrorBoundary] Uncaught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });

    this.setState({ errorInfo });
  }

  /**
   * 判斷錯誤類型
   */
  private categorizeError(error: Error | null): ErrorCategory {
    if (!error) return 'UNKNOWN';
    if (SystemError.isSystemError(error) || error instanceof APIError) {
      const code = (error as any).code || '';

      // OMNI_ERR_ Standard Mapping
      if (code.startsWith('OMNI_ERR_1')) return 'VALIDATION';
      if (code.startsWith('OMNI_ERR_2')) return 'AUTH';
      if (code.startsWith('OMNI_ERR_3')) return 'API';
      if (code.startsWith('OMNI_ERR_4')) return 'BUSINESS';
      if (code.startsWith('OMNI_ERR_0')) return 'SYSTEM';

      // Legacy/Fallback mapping
      if (code.startsWith('API_') || code.startsWith('ESG-API')) return 'API';
      if (code.startsWith('AUTH_') || code.startsWith('ESG-AUTH')) return 'AUTH';
      if (code.startsWith('VAL_') || code.startsWith('ESG-DATA')) return 'VALIDATION';
      if (code.startsWith('BUS_') || code.startsWith('ESG-BUS')) return 'BUSINESS';
      if (code.startsWith('ESG-SYS')) return 'SYSTEM';

      return 'SYSTEM';
    }
    return 'UNKNOWN';
  }

  /**
   * 獲取錯誤代碼顯示
   */
  private getErrorCodeDisplay(error: Error | null): string {
    if (!error) return 'UNKNOWN';
    if (SystemError.isSystemError(error)) {
      return error.code;
    }
    return this.state.errorId || 'UNKNOWN';
  }

  /**
   * 處理重新載入
   */
  private handleReload = () => {
    window.location.reload();
  };

  /**
   * 處理回到首頁
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * 複製錯誤資訊
   */
  private handleCopyError = () => {
    if (this.state.error) {
      const errorInfo = {
        message: this.state.error.message,
        stack: this.state.error.stack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
      };
      navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
    }
  };

  public override render() {
    if (this.state.hasError) {
      const errorCategory = this.categorizeError(this.state.error);
      const errorCodeDisplay = this.getErrorCodeDisplay(this.state.error);

      // Aqua Cyan 主題色
      const themeColors = {
        primary: '#00FFFF',
        primaryLight: 'rgba(0,255,255, 0.2)',
        primaryGlow: 'rgba(0,255,255, 0.4)',
      };

      return (
        <div className="h-screen w-screen bg-[#050a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
          {/* Background Ambience - Depth Layers */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0d1f1f] via-[#050a0a] to-[#020505]" />

          {/* Animated Glow Orbs */}
          <div
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 animate-pulse"
            style={{ backgroundColor: themeColors.primary }}
          />
          <div
            className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-10"
            style={{ backgroundColor: '#0df2df' }}
          />

          {/* Glass Container - Ultra Premium */}
          <div
            className="relative z-10 max-w-xl w-full bg-black/40 backdrop-blur-2xl border rounded-3xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center animate-in fade-in zoom-in duration-500"
            style={{ borderColor: `${themeColors.primary}40` }}
          >
            {/* Fail-Safe Icon with Pulsing Glow */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8 border border-white/10 relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${themeColors.primary}20, transparent)`,
                boxShadow: `0 0 40px ${themeColors.primary}30`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
              <ShieldAlert size={48} className="relative z-10 animate-pulse" style={{ color: themeColors.primary }} />
            </div>

            {/* Neural Header */}
            <h1
              className="text-3xl font-extrabold mb-3 tracking-tighter uppercase italic"
              style={{
                color: themeColors.primary,
                textShadow: `0 0 25px ${themeColors.primaryGlow}`
              }}
            >
              System Interruption
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <span className="h-[1px] w-8 bg-white/20" />
              <div
                className="px-4 py-1 rounded-sm text-[10px] font-mono tracking-widest uppercase border"
                style={{
                  backgroundColor: `${themeColors.primary}10`,
                  color: themeColors.primary,
                  borderColor: `${themeColors.primary}30`
                }}
              >
                Category: {errorCategory}
              </div>
              <span className="h-[1px] w-8 bg-white/20" />
            </div>

            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-sm">
              The Neural Core has encountered an unhandled exception.
              The current session has been isolated to maintain data integrity.
            </p>

            {/* Structured Error Insight (5T Transparent) */}
            <div
              className="w-full rounded-xl p-6 mb-8 border text-left overflow-auto max-h-56 custom-scrollbar group relative transition-all duration-300 hover:bg-black/60"
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderColor: `${themeColors.primary}20`,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-mono tracking-tight opacity-70" style={{ color: themeColors.primary }}>
                    ERR_TRACE_ID: {errorCodeDisplay}
                  </span>
                </div>
                <button
                  onClick={this.handleCopyError}
                  className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-all transform active:scale-90"
                  title="Copy signature"
                >
                  <Copy size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium leading-snug" style={{ color: '#ff7a7a' }}>
                  {this.state.error?.message || 'Cognitive sync failure detected.'}
                </p>

                {this.state.errorInfo && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[9px] text-gray-500 uppercase font-mono mb-1 block">Contextual Stack</span>
                    <pre className="text-[9px] text-gray-400/60 leading-tight whitespace-pre-wrap font-mono">
                      {this.state.errorInfo?.componentStack?.split('\n').slice(0, 5).join('\n')}...
                    </pre>
                  </div>
                )}
              </div>

              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,255,0,.02),rgba(0,0,255,.06))] bg-[length:100%_2px,3px_100%]" />
            </div>

            {/* Action Matrix */}
            <div className="flex gap-4 w-full">
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-white/5 border border-white/10 group active:scale-95"
              >
                <Home size={18} className="opacity-60 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                <span className="text-sm font-semibold tracking-wide text-gray-300">Return Home</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex-[1.4] flex items-center justify-center gap-2 px-6 py-4 rounded-xl transition-all duration-500 text-[#050a0a] font-bold group overflow-hidden relative active:scale-95"
                style={{
                  backgroundColor: themeColors.primary,
                  boxShadow: `0 0 30px ${themeColors.primary}50`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <RefreshCw size={18} className={`transition-transform duration-700 ${this.state.hasError ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                <span className="text-sm tracking-widest uppercase">Restore Session</span>
              </button>
            </div>

            {/* 5T Protocol Status */}
            <div className="mt-10 flex items-center gap-4 opacity-40">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                <span className="text-[8px] font-mono tracking-widest uppercase">Safe_Mode</span>
              </div>
              <div className="w-[1px] h-3 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                <span className="text-[8px] font-mono tracking-widest uppercase">Fault_Iso</span>
              </div>
              <div className="w-[1px] h-3 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                <span className="text-[8px] font-mono tracking-widest uppercase">v8.2.5_Sentient</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<Props>
): React.ComponentType<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <GlobalErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </GlobalErrorBoundary>
    );
  };
}
