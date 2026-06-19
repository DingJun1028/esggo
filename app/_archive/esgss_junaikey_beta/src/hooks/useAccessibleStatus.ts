// src/hooks/useAccessibleStatus.ts
import { useState, useEffect } from 'react';

export interface AccessibleStatusOptions {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  customMessage?: string;
}

/**
 * Hook to manage accessible status announcements for async operations.
 * Automatically updates status messages based on operation state.
 *
 * @example
 * const { statusMessage, announceStatus } = useAccessibleStatus({
 *   isLoading: isAnalyzing,
 *   loadingMessage: "正在分析...",
 *   successMessage: "分析完成"
 * });
 */
export const useAccessibleStatus = ({
  isLoading = false,
  isSuccess = false,
  isError = false,
  loadingMessage = '處理中...',
  successMessage = '完成',
  errorMessage = '發生錯誤',
  customMessage,
}: AccessibleStatusOptions = {}) => {
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (customMessage) {
      setStatusMessage(customMessage);
    } else if (isLoading) {
      setStatusMessage(loadingMessage);
    } else if (isSuccess) {
      setStatusMessage(successMessage);
    } else if (isError) {
      setStatusMessage(errorMessage);
    } else {
      setStatusMessage('');
    }
  }, [isLoading, isSuccess, isError, loadingMessage, successMessage, errorMessage, customMessage]);

  const announceStatus = (message: string) => {
    setStatusMessage(message);
  };

  return { statusMessage, announceStatus };
};
