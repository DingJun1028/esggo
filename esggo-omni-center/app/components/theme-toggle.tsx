'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

function getInitialTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('esggo-theme') as 'dark' | 'light' | null;
    if (saved) return saved;
  }
  return 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('esggo-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-borderColor bg-transparent text-textPrimary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      title={theme === 'dark' ? '切換至淺色主題' : '切換至深色主題'}
      aria-label={theme === 'dark' ? '切換至淺色主題' : '切換至深色主題'}
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-accentGold" />
      ) : (
        <Moon size={16} className="text-accentBlue" />
      )}
    </button>
  );
}
