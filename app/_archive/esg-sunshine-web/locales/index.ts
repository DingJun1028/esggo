import { zhTW } from './zh-TW'
import { en } from './en'

export const locales = {
  'zh-TW': zhTW,
  'en': en,
} as const

export type Locale = keyof typeof locales

export const defaultLocale: Locale = 'zh-TW'

export function getTranslations(locale: Locale) {
  return locales[locale] || locales[defaultLocale]
}
