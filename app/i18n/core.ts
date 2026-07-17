import zhTW from './dictionaries/zh-TW';
import en from './dictionaries/en';
import ja from './dictionaries/ja';
import { DEFAULT_LOCALE, LOCALES, type Dictionary, type Locale } from './config';

export const dictionaries: Record<Locale, Dictionary> = {
  'zh-TW': zhTW,
  en,
  ja,
};

export type Translate = (key: string, fallback?: string) => string;

// 取得某語言的翻譯函式。找不到 key 時：優先用 fallback，再退回預設語言，最後回傳 key 本身。
export function createTranslator(locale: Locale): Translate {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  return (key: string, fallback?: string): string => {
    const value = dict[key];
    if (value !== undefined) return value;
    if (fallback !== undefined) return fallback;
    const def = dictionaries[DEFAULT_LOCALE][key];
    if (def !== undefined) return def;
    return key;
  };
}

// 收集每個語言缺少的 key（開發期健全性檢查用）
export function findMissingKeys(): { locale: Locale; missing: string[] }[] {
  const baseKeys = Object.keys(dictionaries[DEFAULT_LOCALE]).sort();
  return LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((locale) => {
    const keys = Object.keys(dictionaries[locale]);
    const missing = baseKeys.filter((k) => !keys.includes(k));
    return { locale, missing };
  });
}

// 重新匯出 config 的成員，讓使用端可從 core / index 統一匯入
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_META,
  STORAGE_KEY,
  isLocale,
  resolveLocale,
  type Locale,
  type Dictionary,
} from './config';
