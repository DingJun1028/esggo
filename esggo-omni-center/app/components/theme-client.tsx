'use client';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setTheme = () => {
      try {
        const savedTheme = localStorage.getItem('esggo-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldAddDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        const html = document.documentElement;
        if (shouldAddDark) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      } catch (e) {
        console.error('Theme error', e);
      }
    };
    setTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', setTheme);
    return () => mediaQuery.removeEventListener('change', setTheme);
  }, []);
  return <>{children}</>;
}