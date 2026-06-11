'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';
import { AppMode } from '../lib/theme-store';

export default function AppThemeSwitcher() {
  const { mode, setMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-[88px] h-[30px]" />;

  const modes: { id: AppMode; icon: React.ElementType; label: string }[] = [
    { id: 'light', icon: Sun, label: '淺色' },
    { id: 'dark', icon: Moon, label: '深色' },
    { id: 'system', icon: Laptop, label: '系統' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-inner">
      {modes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          title={label}
          onClick={() => setMode(id)}
          className={`flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${
            mode === id
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-sm'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}
