/**
 * 🎪 AtomicLibraryShowcase - Demonstration of Atomic Atoms
 * v1.0 | #AtomicShowcase #UniversalThemes
 */

'use client';

import React from 'react';
import { AtomicButton } from './AtomicButton';
import { AtomicInput } from './AtomicInput';
import { useAtomicLibrary } from './AtomicLibraryProvider';
import { UniversalThemeId, ModeLayer } from './atomic-core';

export const AtomicLibraryShowcase: React.FC = () => {
  const { theme, mode, setTheme, setMode } = useAtomicLibrary();

  const themes: { id: UniversalThemeId; label: string }[] = [
    { id: 'benevolent-classic', label: '善向永續經典款' },
    { id: 'berkeley-academy', label: '柏克萊學院風' },
    { id: 'extreme-minimalist', label: '極致簡約款' },
    { id: 'best-practice', label: '最佳實踐款' }
  ];

  const modes: { id: ModeLayer; label: string }[] = [
    { id: 'light', label: '淺色模式' },
    { id: 'dark', label: '深色模式' },
    { id: 'system', label: '系統模式' }
  ];

  return (
    <div className="p-10 space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">萬能元件原子庫 (Atomic Library)</h1>
        <p className="text-[var(--at-text-sub)]">遵循「參照原則」與「觀因循果」律法，實現 T3 Tangible 可感知之美。</p>
      </section>

      {/* 控制面板 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-[var(--at-bg-card)] rounded-xl border border-[var(--at-border)] shadow-[var(--at-shadow)]">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider">主題選擇 (Themes)</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map(t => (
              <AtomicButton 
                key={t.id} 
                variant={theme === t.id ? 'primary' : 'secondary'}
                onClick={() => setTheme(t.id)}
                size="s"
              >
                {t.label}
              </AtomicButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider">模式分層 (Modes)</h2>
          <div className="flex flex-wrap gap-2">
            {modes.map(m => (
              <AtomicButton 
                key={m.id} 
                variant={mode === m.id ? 'primary' : 'secondary'}
                onClick={() => setMode(m.id)}
                size="s"
              >
                {m.label}
              </AtomicButton>
            ))}
          </div>
        </div>
      </section>

      {/* 原子組件展示 */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 按鈕原子 */}
          <div className="p-6 bg-[var(--at-bg-card)] rounded-xl border border-[var(--at-border)] space-y-6">
            <h3 className="text-lg font-medium">按鈕原子 (Button Atom)</h3>
            <div className="flex flex-col gap-4">
              <AtomicButton variant="primary">主要按鈕</AtomicButton>
              <AtomicButton variant="secondary">次要按鈕</AtomicButton>
              <AtomicButton variant="ghost">幽靈按鈕</AtomicButton>
            </div>
          </div>

          {/* 輸入原子 */}
          <div className="p-6 bg-[var(--at-bg-card)] rounded-xl border border-[var(--at-border)] space-y-6 col-span-2">
            <h3 className="text-lg font-medium">輸入原子 (Input Atom)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AtomicInput label="使用者名稱" placeholder="請輸入姓名" />
              <AtomicInput label="電子郵件" placeholder="example@esggo.com" type="email" />
              <AtomicInput label="誠信代碼" placeholder="T4-HASH-LOCK" error="代碼格式錯誤，請執行萬能修復" />
              <div className="flex items-end">
                <AtomicButton className="w-full">提交驗證</AtomicButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-8 border-t border-[var(--at-border)] text-center text-xs text-[var(--at-text-sub)]">
        © 2026 ESG GO Atomic Library. Powered by OmniCore P0.
      </footer>
    </div>
  );
};
