import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
}

/**
 * 鍵盤導航 Hook
 * 提供快捷鍵支持以提升導航效率
 */
export function useKeyboardNavigation(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
        const metaMatch = shortcut.meta ? e.metaKey : !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (e.key === shortcut.key && (ctrlMatch || metaMatch) && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * 預定義的快捷鍵配置
 */
export const SIDEBAR_SHORTCUTS = {
  TOGGLE_SEARCH: { key: 'k', ctrl: true, meta: true },
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true, meta: true },
  NAVIGATE_UP: { key: 'ArrowUp' },
  NAVIGATE_DOWN: { key: 'ArrowDown' },
  SELECT: { key: 'Enter' },
  CLOSE: { key: 'Escape' },
} as const;
