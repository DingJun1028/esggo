'use client';

import { LOCALE_META } from './config';
import { useI18n } from './I18nProvider';

// 語言切換器：可內嵌於 Header / Hero。無障礙：aria-label + 鍵盤可操作。
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, locales, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t('lang.switchAria')}
      title={t('lang.switchAria')}
      className={
        'inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5 backdrop-blur ' +
        (className ?? '')
      }
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            title={LOCALE_META[l].native}
            className={
              'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ' +
              (active
                ? 'bg-accentTeal text-black'
                : 'text-textSecondary hover:text-accentTeal hover:bg-white/10')
            }
          >
            {LOCALE_META[l].native}
          </button>
        );
      })}
    </div>
  );
}
