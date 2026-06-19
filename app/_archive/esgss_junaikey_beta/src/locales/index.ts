/**
 * 🌍 翻譯資源統一導出
 * Unified Translation Resources Export
 * --------------------------------------------------
 */

import type { LanguageResources } from '@/types/i18n.types';
import { zhTW } from './zh-TW';
import { enUS } from './en-US';
import { koKR } from './ko-KR';

/**
 * 所有語言資源
 * All Language Resources
 */
export const resources: LanguageResources = {
  'zh-TW': zhTW,
  'en-US': enUS,
  'ko-KR': koKR,
};

/**
 * 預設語言
 * Default Language
 */
export const DEFAULT_LANGUAGE = 'zh-TW';

/**
 * 支援的語言列表
 * Supported Languages List
 */
export const SUPPORTED_LANGUAGES = ['zh-TW', 'en-US', 'ko-KR'] as const;
