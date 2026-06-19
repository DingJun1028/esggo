import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

// Basic Localization Service Stub
export const localizationService = {
  t: (key: string) => key,
  setLanguage: (lang: string) => omniLogger.info(LogCategory.SYSTEM, `Language set to ${lang}`),
  currentLanguage: 'zh-TW',
};
