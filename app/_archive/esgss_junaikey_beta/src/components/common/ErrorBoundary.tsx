import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { omniLogger, LogCategory } from '@/services/omniLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 奧秘錯誤邊界組件 (Omni Error Boundary)
 *
 * 捕獲子組件樹中的 JavaScript 錯誤，記錄錯誤並展示降級 UI。
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    omniLogger.error(
      LogCategory.SYSTEM,
      `[ErrorBoundary] Error in ${this.props.componentName || 'Component'}`,
      { error, info: errorInfo }
    );
    // 這里可以添加錯誤上報邏輯
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-900/10 border border-red-500/30 rounded-lg text-center h-full min-h-[200px]">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-red-400 mb-2">
            {this.props.componentName ? `${this.props.componentName} 發生錯誤` : '組件發生錯誤'}
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">
            {this.state.error?.message || '發生了意外錯誤，請稍後重試。'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            重試
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
