'use client';

import { useEffect, useCallback } from 'react';

/**
 * Global Keyboard Shortcuts
 * - Cmd/Ctrl + K: Open search
 * - Cmd/Ctrl + N: New task
 * - Cmd/Ctrl + /: Show shortcuts help
 * - Escape: Close modals/panels
 */

export interface ShortcutHandlers {
  onSearch?: () => void;
  onNewTask?: () => void;
  onHelp?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMeta = e.metaKey || e.ctrlKey;
    const isInput = (e.target as HTMLElement)?.tagName === 'INPUT' ||
                    (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
                    (e.target as HTMLElement)?.isContentEditable;

    // Cmd/Ctrl + K: Search
    if (isMeta && e.key === 'k') {
      e.preventDefault();
      handlers.onSearch?.();
      return;
    }

    // Cmd/Ctrl + N: New task (skip if in input)
    if (isMeta && e.key === 'n' && !isInput) {
      e.preventDefault();
      handlers.onNewTask?.();
      return;
    }

    // Cmd/Ctrl + /: Help
    if (isMeta && e.key === '/') {
      e.preventDefault();
      handlers.onHelp?.();
      return;
    }

    // Escape: Close
    if (e.key === 'Escape') {
      handlers.onEscape?.();
      return;
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Keyboard shortcut display for UI
 */
export function ShortcutHint({ keys, action }: { keys: string[]; action: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-textSecondary">
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="px-1.5 py-0.5 bg-primary border border-borderColor rounded text-[10px] font-mono"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span>{action}</span>
    </div>
  );
}
