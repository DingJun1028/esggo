'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Locale, getTranslations } from '@/locales'
import type { Translations } from '@/locales/zh-TW'

interface LanguageContextType {
  locale: Locale
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  locale: Locale
}

export function LanguageProvider({ children, locale }: LanguageProviderProps) {
  const t = getTranslations(locale)

  return (
    <LanguageContext.Provider value={{ locale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
