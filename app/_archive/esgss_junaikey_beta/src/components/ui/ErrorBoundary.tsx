/**
 * ErrorBoundary - 統一錯誤邊界組件
 * 用於捕獲和處理 React 組件樹中的 JavaScript 錯誤
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, X } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isCopied: boolean;
}

/**
 * 全域錯誤邊界組件
 * 捕獲子組件中的錯誤並顯示友好的錯誤頁面
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isCopied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary 捕獲到錯誤:', error);
    console.error('📍 組件堆疊:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    // 調用錯誤回調
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 發送到錯誤追蹤服務
    this.reportError(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    // 可以整合 Sentry、LogRocket 等錯誤追蹤服務
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // 本地存儲錯誤以便調試
      const existingErrors = JSON.parse(
        localStorage.getItem('error_reports') || '[]'
      );
      existingErrors.push(errorReport);

      // 保留最近 50 條錯誤記錄
      if (existingErrors.length > 50) {
        existingErrors.shift();
      }

      localStorage.setItem('error_reports', JSON.stringify(existingErrors));
      console.log('📝 錯誤報告已保存:', errorReport);
    } catch (e) {
      console.error('❗ 保存錯誤報告失敗:', e);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleCopyError = async () => {
    if (this.state.error) {
      try {
        await navigator.clipboard.writeText(
          `${this.state.error.message}\n\n${this.state.error.stack || ''}`
        );
        this.setState({ isCopied: true });
        setTimeout(() => this.setState({ isCopied: false }), 2000);
      } catch (e) {
        console.error('❗ 複製錯誤資訊失敗:', e);
      }
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      // 如果有自定義 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorDisplay
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        isCopied={this.state.isCopied}
        onRetry={this.handleRetry}
        onCopy={this.handleCopyError}
        onReload={this.handleReload}
        showDetails={this.props.showDetails}
      />;
    }

    return this.props.children;
  }
}

/**
 * 錯誤顯示組件
 */
interface ErrorDisplayProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isCopied: boolean;
  onRetry: () => void;
  onCopy: () => void;
  onReload: () => void;
  showDetails?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorInfo,
  isCopied,
  onRetry,
  onCopy,
  onReload,
  showDetails = false,
}) => {
  const [showStack, setShowStack] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* 錯誤標題區域 */}
        <div className="bg-red-500/20 border-b border-red-500/30 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">發生錯誤</h1>
              <p className="text-red-200 mt-1">
                系統遇到了一個未預期的問題
              </p>
            </div>
          </div>
        </div>

        {/* 錯誤內容區域 */}
        <div className="p-6 space-y-4">
          {showDetails && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                錯誤訊息
              </h3>
              <p className="text-white font-mono text-sm break-words">
                {error?.message || '未知的錯誤'}
              </p>
            </div>
          )}

          {/* 錯誤堆疊（可選顯示） */}
          {showDetails && showStack && error?.stack && (
            <div className="bg-black/30 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                錯誤堆疊
              </h3>
              <pre className="text-xs text-gray-300 overflow-auto max-h-48">
                {error.stack}
              </pre>
            </div>
          )}

          {/* 組件堆疊 */}
          {showDetails && errorInfo?.componentStack && (
            <div className="bg-black/30 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                組件堆疊
              </h3>
              <pre className="text-xs text-gray-300 overflow-auto max-h-48">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>

        {/* 操作按鈕區域 */}
        <div className="bg-white/5 border-t border-white/10 p-6">
          <div className="flex flex-wrap gap-3 justify-end">
            {/* 展開堆疊追蹤按鈕 */}
            {showDetails && (
              <button
                onClick={() => setShowStack(!showStack)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                {showStack ? '隱藏堆疊' : '顯示堆疊'}
              </button>
            )}

            {/* 複製錯誤按鈕 */}
            {showDetails && (
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                <Copy size={16} />
                {isCopied ? '已複製!' : '複製錯誤'}
              </button>
            )}

            {/* 重試按鈕 */}
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
            >
              <RefreshCw size={18} />
              重試
            </button>

            {/* 重新載入按鈕 */}
            <button
              onClick={onReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
            >
              <X size={18} />
              重新載入頁面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Async Error Boundary - 處理異步操作中的錯誤
 */
interface AsyncErrorState {
  hasError: boolean;
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  AsyncErrorState
> {
  public override state: AsyncErrorState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): AsyncErrorState {
    return { hasError: true, error };
  }

  public override componentDidMount() {
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  public override componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  private handlePromiseRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    console.error('🌊 AsyncErrorBoundary 捕獲到異步錯誤:', event.reason);
    this.setState({
      hasError: true,
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    });
  };

  public override componentDidCatch(error: Error): void {
    console.error('Async ErrorBoundary 捕獲到錯誤:', error);
  }

  public resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50/10 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span className="text-red-400 font-medium">載入失敗</span>
          </div>
          <p className="text-gray-400 mb-4">
            {this.state.error?.message || '發生錯誤'}
          </p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            重試
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 簡化版錯誤邊界鉤子
 * 用於函數式組件
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      console.error('useErrorBoundary 捕獲到錯誤:', error);
    }
  }, [error]);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((err: Error) => {
    setError(err);
  }, []);

  return { error, resetError, captureError };
}

export default ErrorBoundary;
