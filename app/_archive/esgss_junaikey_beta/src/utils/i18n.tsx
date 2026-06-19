/**
 * 🌍 統一國際化系統 (Unified Internationalization System)
 * --------------------------------------------------
 * [功能] 類型安全的繁體中文 / 英文雙向切換系統
 * [特性] 自動補全、嵌套鍵值、localStorage 持久化
 * [標準] 代碼標識符符合 AI Affinity (英文)，註釋文件符合主權標準 (繁中)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language, TranslationKey, TranslationDictionary } from '../types/i18n.types';
import { resources, DEFAULT_LANGUAGE } from '../locales';

/**
 * i18n Context 類型定義
 * i18n Context Type Definition
 */
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

/**
 * i18n Context
 */
const I18nContext = createContext<I18nContextType | null>(null);

/**
 * 從嵌套物件中獲取值
 * Get value from nested object
 */
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // 找不到時返回原始鍵值
    }
  }

  return typeof current === 'string' ? current : path;
}

/**
 * i18n Provider 組件
 * i18n Provider Component
 */
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 從 localStorage 讀取語言設定，若無則使用預設值
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app-language');
      if (stored === 'zh-TW' || stored === 'en-US' || stored === 'ko-KR') {
        return stored as Language;
      }
    }
    return DEFAULT_LANGUAGE;
  });

  /**
   * 設定語言並持久化
   * Set language and persist to localStorage
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-language', lang);
    }
  };

  /**
   * 翻譯函數（支援嵌套鍵值）
   * Translation function (supports nested keys)
   * @example t('system.title') => '企業永續與 AI 覺醒管理平台'
   * @example t('cyber.principles.trace') => '可溯源'
   */
  const t = (key: TranslationKey): string => {
    const translations = resources[language];
    return getNestedValue(translations, key);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
  );
};

/**
 * i18n Hook
 * 使用方式 Usage:
 * ```tsx
 * const { t, language, setLanguage } = useI18n();
 * return <h1>{t('system.title')}</h1>;
 * ```
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

/**
 * 向後兼容：導出 Language 類型
 * Backward compatibility: export Language type
 */
export type { Language };
