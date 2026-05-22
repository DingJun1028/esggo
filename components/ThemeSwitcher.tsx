'use client';

import { useThemeStore } from '../lib/theme-store';

export default function ThemeSwitcher() {
  const { sidebarTheme, setSidebarTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-100">
      <span className="text-xs text-gray-500 font-medium flex-shrink-0">主題</span>
      <div className="flex gap-1.5 flex-1">
        {/* Light Theme Button */}
        <button
          onClick={() => setSidebarTheme('light')}
          title="白底藍字主題"
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            sidebarTheme === 'light'
              ? 'border-[#003262] bg-[#003262] text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <span className="w-3 h-3 rounded-sm border border-gray-300 bg-white inline-block flex-shrink-0" />
          淺色
        </button>

        {/* Dark Theme Button */}
        <button
          onClick={() => setSidebarTheme('dark')}
          title="深藍底黃字主題"
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            sidebarTheme === 'dark'
              ? 'border-[#FDB515] bg-[#003262] text-[#FDB515] shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <span className="w-3 h-3 rounded-sm border border-blue-800 bg-[#003262] inline-block flex-shrink-0" />
          深色
        </button>
      </div>
    </div>
  );
}