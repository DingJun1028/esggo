import { describe, it, expect } from 'vitest';
import {
  dictionaries,
  createTranslator,
  findMissingKeys,
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  resolveLocale,
} from '../core';
import zhTW from '../dictionaries/zh-TW';

describe('i18n dictionaries', () => {
  it('所有語言都包含相同的 key 集合（以 zh-TW 為基準）', () => {
    const base = Object.keys(zhTW).sort();
    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;
      const keys = Object.keys(dictionaries[locale]).sort();
      expect(keys).toEqual(base);
    }
  });

  it('findMissingKeys 對完整字典回傳空陣列', () => {
    const missing = findMissingKeys();
    for (const m of missing) {
      expect(m.missing).toEqual([]);
    }
  });

  it('brand.tagline 在各語言都有值', () => {
    for (const locale of LOCALES) {
      expect(dictionaries[locale]['brand.tagline']).toBeTruthy();
    }
  });

  it('繁中品牌標語為「深貫廣通 無縫接軌」', () => {
    expect(zhTW['brand.tagline']).toBe('深貫廣通 無縫接軌');
  });
});

describe('createTranslator', () => {
  it('回傳對應語言的翻譯', () => {
    const t = createTranslator('en');
    expect(t('brand.tagline')).toBe('Deep Integration, Seamless Connection');
  });

  it('找不到 key 時回退預設語言', () => {
    const t = createTranslator('en');
    expect(t('hero.enterModule')).toBe('Enter Module');
  });

  it('預設語言也找不到 key 時回傳 key 本身', () => {
    const t = createTranslator('zh-TW');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('提供 fallback 參數時優先使用 fallback', () => {
    const t = createTranslator('ja');
    expect(t('nonexistent.key', '自訂後備')).toBe('自訂後備');
  });
});

describe('locale helpers', () => {
  it('isLocale 正確判斷', () => {
    expect(isLocale('zh-TW')).toBe(true);
    expect(isLocale('xx')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it('resolveLocale 從 Accept-Language 推斷', () => {
    expect(resolveLocale('ja-JP')).toBe('ja');
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('zh-TW')).toBe('zh-TW');
    expect(resolveLocale('zh-Hant')).toBe('zh-TW');
    expect(resolveLocale(null)).toBe(DEFAULT_LOCALE);
  });
});
