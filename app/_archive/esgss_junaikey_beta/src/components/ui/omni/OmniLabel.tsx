import React from 'react';
import { OmniI18nEngine } from '@/omni/core/OmniI18nEngine';

/**
 * 🏷️ 奧秘標籤 / Omni Label
 * --------------------------------------------------
 * [TC] 使用 OmniI18nEngine 自動格式化展示領域術語（繁中 (EN)）。
 * [EN] Automatically formats domain terms using OmniI18nEngine (TC (EN)).
 */
export const OmniLabel: React.FC<{
  term: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}> = ({ term, className, size = 'md' }) => {
  const formatted = OmniI18nEngine.formatLabel(term);

  const sizeClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  return (
    <span className={`font-bold tracking-tight text-white/90 ${sizeClasses} ${className}`}>
      {formatted}
    </span>
  );
};
