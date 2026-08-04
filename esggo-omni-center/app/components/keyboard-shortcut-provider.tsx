'use client';

import { useState, useCallback } from 'react';
import { useKeyboardShortcuts } from './keyboard-shortcuts';
import { GlobalSearchModal } from './global-search';

/**
 * KeyboardShortcutProvider — wraps the app to provide global shortcuts
 * Must be placed inside a client boundary (layout.tsx ThemeProvider)
 */
export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const onSearch = useCallback(() => setSearchOpen(true), []);
  const onEscape = useCallback(() => setSearchOpen(false), []);

  useKeyboardShortcuts({
    onSearch,
    onEscape,
  });

  return (
    <>
      {children}
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
