'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations } from '../i18n/translations';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('zh-TW');

    useEffect(() => {
        const savedLocale = localStorage.getItem('infone-locale') as Locale;
        const validLocales: Locale[] = ['en', 'zh-TW', 'ja', 'ko'];
        if (savedLocale && validLocales.includes(savedLocale)) {
            setLocaleState(savedLocale);
            document.documentElement.lang = savedLocale;
        } else {
            setLocaleState('zh-TW');
            document.documentElement.lang = 'zh-TW';
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('infone-locale', newLocale);
        document.documentElement.lang = newLocale;
    };

    const t = translations[locale];

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
