import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';

// Basic Localization Service Stub
export const localizationService = {
  t: (key: string) => key,
  setLanguage: (lang: string) => omniLogger.info(LogCategory.SYSTEM, `Language set to ${lang}`),
  currentLanguage: 'zh-TW',
};
