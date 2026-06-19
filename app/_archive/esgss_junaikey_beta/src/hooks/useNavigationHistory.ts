import { useState, useEffect, useCallback } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { View } from '@/types';

interface NavigationHistoryItem {
  id: View;
  timestamp: number;
  count: number;
}

const HISTORY_KEY = 'sidebar_navigation_history';
const MAX_HISTORY = 10;

/**
 * 導航歷史 Hook
 * 追蹤用戶訪問歷史並提供智能推薦
 */
export function useNavigationHistory() {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);

  // 從本地存儲加載歷史
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useNavigationHistory] Failed to load navigation history:', { error })
    }
  }, []);

  // 添加訪問記錄
  const addToHistory = useCallback((viewId: View) => {
    setHistory(prev => {
      const existing = prev.find(item => item.id === viewId);

      let updated: NavigationHistoryItem[];
      if (existing) {
        // 更新現有記錄
        updated = prev.map(item =>
          item.id === viewId ? { ...item, timestamp: Date.now(), count: item.count + 1 } : item
        );
      } else {
        // 添加新記錄
        updated = [{ id: viewId, timestamp: Date.now(), count: 1 }, ...prev].slice(0, MAX_HISTORY);
      }

      // 保存到本地存儲
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[useNavigationHistory] Failed to save navigation history:', { error })
      }

      return updated;
    });
  }, []);

  // 獲取最近訪問
  const getRecentItems = useCallback(
    (limit = 5) => {
      return [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    },
    [history]
  );

  // 獲取最常訪問
  const getFrequentItems = useCallback(
    (limit = 5) => {
      return [...history].sort((a, b) => b.count - a.count).slice(0, limit);
    },
    [history]
  );

  // 清除歷史
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return {
    history,
    addToHistory,
    getRecentItems,
    getFrequentItems,
    clearHistory,
  };
}
