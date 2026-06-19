import { useState, useEffect, useCallback } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { View } from '@/types';

const FAVORITES_KEY = 'sidebar_favorites';

/**
 * 收藏功能 Hook
 * 允許用戶收藏/釘選常用導航項目
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<View[]>([]);

  // 從本地存儲加載收藏
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useFavorites] Failed to load favorites:', { error })
    }
  }, []);

  // 切換收藏狀態
  const toggleFavorite = useCallback((viewId: View) => {
    setFavorites(prev => {
      const isFavorited = prev.includes(viewId);
      const updated = isFavorited ? prev.filter(id => id !== viewId) : [...prev, viewId];

      // 保存到本地存儲
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '[useFavorites] Failed to save favorites:', { error })
      }

      return updated;
    });
  }, []);

  // 檢查是否已收藏
  const isFavorite = useCallback((viewId: View) => favorites.includes(viewId), [favorites]);

  // 清除所有收藏
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
