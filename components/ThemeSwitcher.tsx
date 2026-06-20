'use client';

import { useState } from 'react';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('light');

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100">
      <button
        onClick={() => setTheme('light')}
        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
          theme === 'light' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
        }`}
      >
        淺色
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
          theme === 'dark' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500'
        }`}
      >
        深色
      </button>
    </div>
  );
}
