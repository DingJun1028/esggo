// 無障礙功能hooks
import { useEffect, useCallback, useState } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
  });

  // 從localStorage加載設定
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // 檢查系統偏好設定
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    setSettings(prev => ({
      ...prev,
      reduceMotion: prev.reduceMotion || prefersReducedMotion,
      highContrast: prev.highContrast || prefersHighContrast,
    }));
  }, []);

  // 儲存設定
  const saveSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('accessibility-settings', JSON.stringify(updated));
  }, [settings]);

  // 切換設定
  const toggleSetting = useCallback((key: keyof AccessibilitySettings) => {
    saveSettings({ [key]: !settings[key] });
  }, [settings, saveSettings]);

  // 應用無障礙設定到DOM
  useEffect(() => {
    const root = document.documentElement;

    // 高對比度
    if (settings.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

    // 大文字
    if (settings.largeText) {
      root.setAttribute('data-large-text', 'true');
    } else {
      root.removeAttribute('data-large-text');
    }

    // 減少動畫
    if (settings.reduceMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }

    // 螢幕閱讀器優化
    if (settings.screenReader) {
      root.setAttribute('data-screen-reader', 'true');
    } else {
      root.removeAttribute('data-screen-reader');
    }
  }, [settings]);

  // 鍵盤導航處理
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab鍵導航
      if (event.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }

      // Escape鍵關閉模態框
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (modal) {
          const closeButton = modal.querySelector('[aria-label*="關閉" i], [aria-label*="close" i], .close-button') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation]);

  return {
    settings,
    saveSettings,
    toggleSetting,
  };
};

// 焦點管理hook
export const useFocusManagement = () => {
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([]);

  const pushFocus = useCallback((element: HTMLElement) => {
    setFocusHistory(prev => [...prev, element]);
    element.focus();
  }, []);

  const popFocus = useCallback(() => {
    setFocusHistory(prev => {
      const newHistory = [...prev];
      newHistory.pop();
      const previousElement = newHistory[newHistory.length - 1];
      if (previousElement) {
        previousElement.focus();
      }
      return newHistory;
    });
  }, []);

  const clearFocusHistory = useCallback(() => {
    setFocusHistory([]);
  }, []);

  return {
    pushFocus,
    popFocus,
    clearFocusHistory,
    currentFocus: focusHistory[focusHistory.length - 1],
  };
};

// 宣告式螢幕閱讀器支援
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    // 清理
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const announceError = useCallback((message: string) => {
    announce(`錯誤：${message}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`成功：${message}`, 'polite');
  }, [announce]);

  return {
    announce,
    announceError,
    announceSuccess,
  };
};