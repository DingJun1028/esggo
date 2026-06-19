/**
 * React 錯誤邊界組件 (Error Boundary) v2.0
 * 
 * 符合「上善若水」開發哲學：
 * - Graceful (優雅降級): 錯誤不會導致整個應用崩潰
 * - User-Friendly (用戶友善): 顯示友好的錯誤UI
 * - Traceable (可追溯): 記錄完整的錯誤信息
 * - Journey Recovery (旅程恢復): 支援客戶旅程中斷恢復
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, Home, ArrowLeft, Mail } from 'lucide-react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  journeyId?: string;
  onJourneyRecover?: (journeyId: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recoveryOptions: RecoveryOption[];
}

interface RecoveryOption {
  id: string;
  label: string;
  icon: ReactNode;
  action: () => void;
  primary?: boolean;
}

interface ErrorReport {
  id: string;
  timestamp: Date;
  journeyId?: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  userAgent: string;
  url: string;
}

/**
 * 錯誤邊界組件 v2.0
 * 支援旅程恢復和智能錯誤報告
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    recoveryOptions: []
  };

  private errorId: string;

  constructor(props: Props) {
    super(props);
    this.errorId = `ERR-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 生成錯誤報告
    const errorReport: ErrorReport = {
      id: this.errorId,
      timestamp: new Date(),
      journeyId: this.props.journeyId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // 記錄錯誤到日誌系統
    omniLogger.error(LogCategory.SYSTEM, `[ErrorBoundary] React Error Caught: ${this.errorId}`, {
      errorReport,
      errorInfo: {
        componentStack: errorInfo.componentStack
      }
    });

    // 調用自定義錯誤處理器
    this.props.onError?.(error, errorInfo);

    // 生成恢復選項
    this.setState({
      errorInfo,
      recoveryOptions: this.generateRecoveryOptions(error, errorInfo)
    });

    // 在開發環境中顯示詳細信息
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Error caught:', error);
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    }
  }

  private generateRecoveryOptions(error: Error, errorInfo: ErrorInfo): RecoveryOption[] {
    const options: RecoveryOption[] = [
      {
        id: 'retry',
        label: '重試操作',
        icon: <RefreshCw size={18} />,
        action: () => this.handleReset(),
        primary: true
      },
      {
        id: 'go-back',
        label: '返回上一頁',
        icon: <ArrowLeft size={18} />,
        action: () => {
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        }
      },
      {
        id: 'go-home',
        label: '返回首頁',
        icon: <Home size={18} />,
        action: () => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      }
    ];

    // 如果有旅程 ID，添加旅程恢復選項
    if (this.props.journeyId) {
      options.unshift({
        id: 'recover-journey',
        label: '恢復旅程',
        icon: <RefreshCw size={18} />,
        action: () => {
          this.props.onJourneyRecover?.(this.props.journeyId!);
          this.handleReset();
        },
        primary: true
      });
    }

    return options;
  }

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
      recoveryOptions: []
    });
  };

  private handleReportError = async () => {
    if (!this.state.error) return;

    const report: ErrorReport = {
      id: this.errorId,
      timestamp: new Date(),
      journeyId: this.props.journeyId,
      error: {
        name: this.state.error.name,
        message: this.state.error.message,
        stack: this.state.error.stack
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // 發送錯誤報告
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      
      omniLogger.info(LogCategory.SYSTEM, `[ErrorBoundary] Error report sent: ${this.errorId}`);
      alert('錯誤報告已發送，感謝您的反饋！');
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[ErrorBoundary] Failed to send error report', e);
      // 複製到剪貼簿
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(report, null, 2));
        alert('錯誤 ID 已複製到剪貼簿：' + this.errorId);
      }
    }
  };

  public override render() {
    if (this.state.hasError) {
      // 使用自定義 fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 預設錯誤 UI v2.0
      return (
        <div className="error-boundary-container">
          <motion.div 
            className="error-boundary-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* 錯誤圖標動畫 */}
            <motion.div 
              className="error-icon-wrapper"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="error-icon" size={64} />
            </motion.div>

            {/* 旅程中斷提示 */}
            {this.props.journeyId && (
              <motion.div 
                className="journey-interrupted"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="journey-badge">旅程 ID: {this.props.journeyId}</span>
                <span className="journey-status">⚠️ 已中斷</span>
              </motion.div>
            )}

            <h2 className="error-title">
              {this.props.journeyId ? '旅程中斷' : '系統發生錯誤'}
            </h2>
            
            <p className="error-message">
              {this.props.journeyId 
                ? '您的旅程遇到了一些問題。請選擇以下選項繼續。'
                : '抱歉，應用程式遇到了一個未預期的錯誤。'}
            </p>

            {/* 錯誤 ID 顯示 */}
            <div className="error-id">
              錯誤 ID: <code>{this.errorId}</code>
            </div>

            {/* 恢復選項 */}
            <div className="recovery-options">
              {this.state.recoveryOptions.map((option) => (
                <motion.button
                  key={option.id}
                  className={`recovery-button ${option.primary ? 'primary' : ''}`}
                  onClick={option.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </div>

            {/* 技術詳情（開發環境） */}
            <AnimatePresence>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.details 
                  className="error-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <summary>技術詳情</summary>
                  <pre className="error-stack">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </motion.details>
              )}
            </AnimatePresence>

            {/* 錯誤報告按鈕 */}
            <motion.button 
              className="report-button"
              onClick={this.handleReportError}
              whileHover={{ scale: 1.02 }}
            >
              <Mail size={16} />
              報告錯誤
            </motion.button>
          </motion.div>

          {/* 內聯樣式 */}
          <style>{`
            .error-boundary-container {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 24px;
              background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
            }

            .error-boundary-card {
              max-width: 500px;
              width: 100%;
              padding: 48px 40px;
              text-align: center;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 24px;
              backdrop-filter: blur(20px);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }

            .error-icon-wrapper {
              display: inline-flex;
              padding: 20px;
              background: rgba(239, 68, 68, 0.1);
              border-radius: 50%;
              margin-bottom: 24px;
            }

            .error-icon {
              color: #ef4444;
            }

            .journey-interrupted {
              display: inline-flex;
              gap: 12px;
              margin-bottom: 16px;
              padding: 8px 16px;
              background: rgba(251, 191, 36, 0.1);
              border: 1px solid rgba(251, 191, 36, 0.3);
              border-radius: 20px;
            }

            .journey-badge {
              font-size: 12px;
              font-family: monospace;
              color: #fbbf24;
            }

            .journey-status {
              font-size: 12px;
              color: #fbbf24;
            }

            .error-title {
              font-size: 28px;
              font-weight: 700;
              color: white;
              margin-bottom: 16px;
            }

            .error-message {
              font-size: 16px;
              color: rgba(255, 255, 255, 0.7);
              margin-bottom: 24px;
              line-height: 1.6;
            }

            .error-id {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.4);
              margin-bottom: 32px;
            }

            .error-id code {
              background: rgba(255, 255, 255, 0.1);
              padding: 4px 8px;
              border-radius: 4px;
              color: #fbbf24;
            }

            .recovery-options {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 24px;
            }

            .recovery-button {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 14px 24px;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              color: white;
              font-size: 15px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }

            .recovery-button:hover {
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.2);
            }

            .recovery-button.primary {
              background: linear-gradient(135deg, #0df2df 0%, #06b6d4 100%);
              border: none;
              color: #0f172a;
            }

            .recovery-button.primary:hover {
              opacity: 0.9;
              transform: translateY(-1px);
            }

            .error-details {
              text-align: left;
              margin: 24px 0;
              padding: 16px;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 12px;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 600;
              color: rgba(255, 255, 255, 0.7);
              margin-bottom: 8px;
            }

            .error-stack {
              overflow-x: auto;
              font-family: 'JetBrains Mono', 'Courier New', monospace;
              font-size: 12px;
              color: #ef4444;
              white-space: pre-wrap;
              margin: 0;
              padding: 12px;
              background: rgba(0, 0, 0, 0.2);
              border-radius: 8px;
            }

            .report-button {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 20px;
              background: transparent;
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 8px;
              color: rgba(255, 255, 255, 0.6);
              font-size: 13px;
              cursor: pointer;
              transition: all 0.2s;
            }

            .report-button:hover {
              background: rgba(255, 255, 255, 0.05);
              color: white;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 簡化的錯誤邊界 Hook 使用方式
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Hook 版本的錯誤邊界
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = React.useState<ErrorInfo | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useErrorBoundary] Error caught', {
        error: error.message,
        stack: error.stack
      });
    }
  }, [error]);

  const captureError = React.useCallback((err: Error, info?: ErrorInfo) => {
    setError(err);
    setErrorInfo(info || null);
  }, []);

  return { error, errorInfo, resetError, captureError };
}
