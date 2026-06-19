// Localization service for multi-language support
export interface TranslationMap {
  [key: string]: {
    [locale: string]: string;
  };
}

// Default translations
export const translations: TranslationMap = {
  welcome: {
    'en': 'Welcome to ESG Dashboard',
    'zh-TW': '歡迎使用ESG儀表板',
    'zh-CN': '欢迎使用ESG仪表板',
    'ja': 'ESGダッシュボードへようこそ',
  },
  dashboard: {
    'en': 'Dashboard',
    'zh-TW': '儀表板',
    'zh-CN': '仪表板',
    'ja': 'ダッシュボード',
  },
  analytics: {
    'en': 'Analytics',
    'zh-TW': '分析',
    'zh-CN': '分析',
    'ja': '分析',
  },
  sustainability: {
    'en': 'Sustainability',
    'zh-TW': '永續性',
    'zh-CN': '可持续性',
    'ja': '持続可能性',
  },
  carbonFootprint: {
    'en': 'Carbon Footprint',
    'zh-TW': '碳足跡',
    'zh-CN': '碳足迹',
    'ja': '炭素フットプリント',
  },
  esgScore: {
    'en': 'ESG Score',
    'zh-TW': 'ESG評分',
    'zh-CN': 'ESG评分',
    'ja': 'ESGスコア',
  },
};

export class LocalizationService {
  private currentLocale: string = 'zh-TW'; // Default to Traditional Chinese

  setLocale(locale: string): void {
    this.currentLocale = locale;
    localStorage.setItem('esg-locale', locale);
  }

  getLocale(): string {
    return this.currentLocale;
  }

  translate(key: string, fallback?: string): string {
    const translation = translations[key]?.[this.currentLocale];
    return translation || fallback || key;
  }

  getAvailableLocales(): string[] {
    return ['en', 'zh-TW', 'zh-CN', 'ja'];
  }

  getLocaleName(locale: string): string {
    const names = {
      'en': 'English',
      'zh-TW': '繁體中文',
      'zh-CN': '简体中文',
      'ja': '日本語',
    };
    return names[locale as keyof typeof names] || locale;
  }

  // Load locale from storage
  loadFromStorage(): void {
    const stored = localStorage.getItem('esg-locale');
    if (stored && this.getAvailableLocales().includes(stored)) {
      this.currentLocale = stored;
    }
  }
}

export const localizationService = new LocalizationService();

// React hook for translations
export const useTranslation = () => {
  const t = (key: string, fallback?: string) => {
    return localizationService.translate(key, fallback);
  };

  const setLocale = (locale: string) => {
    localizationService.setLocale(locale);
    // Force re-render by triggering state update
    window.location.reload(); // Simple way to refresh translations
  };

  const currentLocale = localizationService.getLocale();
  const availableLocales = localizationService.getAvailableLocales();

  return {
    t,
    setLocale,
    currentLocale,
    availableLocales,
    getLocaleName: localizationService.getLocaleName.bind(localizationService),
  };
};