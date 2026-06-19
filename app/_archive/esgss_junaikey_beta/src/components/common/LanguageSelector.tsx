import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

/**
 * 🌍 Language Selector Component
 * 語言選擇器
 */
export const LanguageSelector: React.FC = () => {
    const { locale, locales, setLocale } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    // Safely find current locale, handle case where locales might not be loaded yet
    const currentLocale = locales?.find((l) => l.code === locale) || { nativeName: locale };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors border border-white/10 bg-slate-900/50 backdrop-blur-sm"
            >
                <Globe size={18} className="text-[#0ABAB5]" />
                <span className="text-sm font-medium text-slate-200">{currentLocale.nativeName}</span>
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-[#0ABAB5]/20 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                        {locales?.map((l) => (
                            <button
                                key={l.code}
                                type="button"
                                onClick={() => {
                                    setLocale(l.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#0ABAB5]/10 transition-colors ${locale === l.code ? 'bg-[#0ABAB5]/20 text-[#0ABAB5]' : 'text-slate-300'
                                    }`}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <Globe size={16} className={locale === l.code ? 'text-[#0ABAB5]' : 'text-slate-500'} />
                                    {l.nativeName}
                                </span>
                                {locale === l.code && <Check size={16} className="text-[#0ABAB5]" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
