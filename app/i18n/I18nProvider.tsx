'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  LOCALES,
  STORAGE_KEY,
  isLocale,
  type Locale,
} from './config';
import { createTranslator, type Translate } from './core';

interface I18nContextValue {
  locale: Locale;
  locales: readonly Locale[];
  t: Translate;
  setLocale: (locale: Locale) => void;
  /** 切換時是否同步 <html lang> 屬性（預設 true） */
  syncHtmlLang: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // 掛載後從 localStorage 還原使用者選擇（SSR 安全：首次渲染與 server 一致，避免 hydration mismatch）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved) && saved !== locale) {
      setLocaleState(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = LOCALE_META[next].htmlLang;
      }
    }
  }, []);

  const syncHtmlLang = useCallback((next: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = LOCALE_META[next].htmlLang;
    }
  }, []);

  // 當 locale 變化時即時同步 <html lang>
  useEffect(() => {
    syncHtmlLang(locale);
  }, [locale, syncHtmlLang]);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, locales: LOCALES, t, setLocale, syncHtmlLang }),
    [locale, t, setLocale, syncHtmlLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n 必須在 <I18nProvider> 內使用');
  }
  return ctx;
}
