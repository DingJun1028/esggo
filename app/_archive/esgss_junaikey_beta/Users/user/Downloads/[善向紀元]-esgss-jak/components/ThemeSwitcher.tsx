import React from 'react';
import { Sun, Moon, Sparkles, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';

interface ThemeSwitcherProps {
  language: Language;
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ language, className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isZh = language === 'zh-TW';

  const themeOptions = [
    {
      key: 'light' as const,
      icon: Sun,
      label: isZh ? '淺色' : 'Light',
      description: isZh ? '明亮主題' : 'Bright theme'
    },
    {
      key: 'dark' as const,
      icon: Moon,
      label: isZh ? '深色' : 'Dark',
      description: isZh ? '深色主題' : 'Dark theme'
    },
    {
      key: 'cosmic' as const,
      icon: Sparkles,
      label: isZh ? '宇宙' : 'Cosmic',
      description: isZh ? '宇宙主題' : 'Cosmic theme'
    },
    {
      key: 'system' as const,
      icon: Monitor,
      label: isZh ? '系統' : 'System',
      description: isZh ? '跟隨系統設定' : 'Follow system'
    }
  ];

  const getCurrentIcon = () => {
    const currentOption = themeOptions.find(option =>
      theme === 'system' ? option.key === 'system' : option.key === resolvedTheme
    );
    return currentOption?.icon || Sun;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <div className={`relative ${className}`}>
      {/* 快速切換按鈕 */}
      <button
        onClick={() => {
          const currentIndex = themeOptions.findIndex(option =>
            theme === 'system' ? option.key === 'system' : option.key === resolvedTheme
          );
          const nextIndex = (currentIndex + 1) % themeOptions.length;
          setTheme(themeOptions[nextIndex].key);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10"
        aria-label={isZh ? '切換主題' : 'Switch theme'}
        title={`${isZh ? '當前主題' : 'Current theme'}: ${themeOptions.find(option =>
          theme === 'system' ? option.key === 'system' : option.key === resolvedTheme
        )?.label}`}
      >
        <CurrentIcon className="w-4 h-4 text-current" />
        <span className="text-sm font-medium hidden sm:inline">
          {themeOptions.find(option =>
            theme === 'system' ? option.key === 'system' : option.key === resolvedTheme
          )?.label}
        </span>
      </button>

      {/* 詳細選項下拉選單 */}
      <div className="absolute top-full mt-2 right-0 z-50 w-64 bg-slate-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-3 hidden group-hover:block">
        <div className="text-xs text-gray-400 mb-2 px-2">
          {isZh ? '選擇主題' : 'Choose theme'}
        </div>
        <div className="space-y-1">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === 'system' ? option.key === 'system' : resolvedTheme === option.key;

            return (
              <button
                key={option.key}
                onClick={() => setTheme(option.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-current'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {option.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* 主題預覽指示器 */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{isZh ? '預覽' : 'Preview'}</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};