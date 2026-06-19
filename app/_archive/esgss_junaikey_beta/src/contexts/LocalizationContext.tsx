import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh-TW' | 'en';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  'zh-TW': {
    'nav.dashboard': '主權終端',
    'nav.all_pillars': '全體一致 (All Pillars)',
    'nav.cognitive': '認知智能 Cognitive Intel',
    'nav.excellence': '卓越永續 Excellence',
    'nav.governance': '治理合規 Governance',
    'nav.agency': '智能代理 Agency',
    'nav.ecosystem': '生態協作 Ecosystem',
    'portal.title': '主權大師 24 根支柱 (Sovereign Master Pillars)',
    'portal.subtitle': 'MECE 分類的 ESGss 生態系服務',
    'status.trustworthy': '可信賴 (Trustworthy)',
    'status.validating': '驗證中 (Validating)',
    'status.pending': '待處理 (Pending)',
    'theme.switch_to_sun': '切換至日光模式',
    'theme.switch_to_moon': '切換至夜光模式',
  },
  en: {
    'nav.dashboard': 'Sovereignty Terminal',
    'nav.all_pillars': 'All Pillars',
    'nav.cognitive': 'Cognitive Intel',
    'nav.excellence': 'Excellence',
    'nav.governance': 'Governance',
    'nav.agency': 'Agency',
    'nav.ecosystem': 'Ecosystem',
    'portal.title': 'Sovereign Master 24 Pillars',
    'portal.subtitle': 'MECE Categorized ESGss Ecosystem Services',
    'status.trustworthy': 'Trustworthy',
    'status.validating': 'Validating',
    'status.pending': 'Pending',
    'theme.switch_to_sun': 'Switch to Sun Mode',
    'theme.switch_to_moon': 'Switch to Moon Mode',
  },
};

interface LocalizationContextType {
  lang: Language;
  isZh: boolean;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('omni-lang');
    return (saved as Language) || 'zh-TW';
  });

  const isZh = lang === 'zh-TW';

  useEffect(() => {
    localStorage.setItem('omni-lang', lang);
  }, [lang]);

  const t = (key: string) => {
    return TRANSLATIONS[lang][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ lang, isZh, setLang: setLangState, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
