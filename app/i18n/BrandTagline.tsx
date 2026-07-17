'use client';

import type { JSX } from 'react';
import { useI18n } from './I18nProvider';

interface BrandTaglineProps {
  /** 顯示 key，預設為品牌標語「深貫廣通 無縫接軌」 */
  i18nKey?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// 可複用品牌標語元件：任何頁面都能引用多語系標語。
// 預設渲染 i18n key 'brand.tagline'（= 深貫廣通 無縫接軌 / Deep Integration, Seamless Connection / 深貫広通、継ぎ目なく接続）。
export function BrandTagline({
  i18nKey = 'brand.tagline',
  className,
  as = 'span',
}: BrandTaglineProps) {
  const { t } = useI18n();
  const Tag = as as 'span';
  return <Tag className={className}>{t(i18nKey)}</Tag>;
}
