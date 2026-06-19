import { useState, useEffect, useCallback } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { View } from '@/types';

interface NotificationBadge {
  viewId: View;
  count: number;
  type: 'info' | 'warning' | 'error' | 'success';
}

const BADGES_STORAGE_KEY = 'sidebar_notification_badges';

/**
 * 通知徽章 Hook
 * 管理側邊欄項目的通知徽章
 */
export function useNotificationBadges() {
  const [badges, setBadges] = useState<NotificationBadge[]>([]);

  // 從本地存儲加載徽章
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BADGES_STORAGE_KEY);
      if (stored) {
        setBadges(JSON.parse(stored));
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useNotificationBadges] Failed to load notification badges:', { error })
    }
  }, []);

  // 保存徽章到本地存儲
  const saveBadges = useCallback((newBadges: NotificationBadge[]) => {
    setBadges(newBadges);
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(newBadges));
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[useNotificationBadges] Failed to save notification badges:', { error })
    }
  }, []);

  // 設置徽章
  const setBadge = useCallback(
    (viewId: View, count: number, type: NotificationBadge['type'] = 'info') => {
      const existing = badges.find(b => b.viewId === viewId);

      if (existing) {
        const updated = badges.map(b => (b.viewId === viewId ? { ...b, count, type } : b));
        saveBadges(updated);
      } else {
        saveBadges([...badges, { viewId, count, type }]);
      }
    },
    [badges, saveBadges]
  );

  // 增加徽章計數
  const incrementBadge = useCallback(
    (viewId: View, increment = 1) => {
      const existing = badges.find(b => b.viewId === viewId);

      if (existing) {
        setBadge(viewId, existing.count + increment, existing.type);
      } else {
        setBadge(viewId, increment);
      }
    },
    [badges, setBadge]
  );

  // 清除徽章
  const clearBadge = useCallback(
    (viewId: View) => {
      const updated = badges.filter(b => b.viewId !== viewId);
      saveBadges(updated);
    },
    [badges, saveBadges]
  );

  // 獲取徽章
  const getBadge = useCallback(
    (viewId: View) => {
      return badges.find(b => b.viewId === viewId);
    },
    [badges]
  );

  // 清除所有徽章
  const clearAllBadges = useCallback(() => {
    saveBadges([]);
  }, [saveBadges]);

  return {
    badges,
    setBadge,
    incrementBadge,
    clearBadge,
    getBadge,
    clearAllBadges,
  };
}
