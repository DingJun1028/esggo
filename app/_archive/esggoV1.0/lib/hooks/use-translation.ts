"use client";

import { useAppContext } from "@/lib/context/app-context";
import { ESG_DICTIONARY, ESGDictionary } from "@/lib/i18n/dictionary";

type DictionaryPath = keyof ESGDictionary;

export function useTranslation() {
    const { lang } = useAppContext();

    /**
     * Translate a key from the dictionary.
     * Format: t("matrix.title")
     */
    const t = (path: string): string => {
        const keys = path.split(".");
        let current: any = ESG_DICTIONARY;

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation key not found: ${path}`);
                return path;
            }
            current = current[key];
        }

        // Now current should be the { zh: "...", en: "...", ja: "..." } object
        if (typeof current === "object" && current !== null) {
            // Map "zh" to dictionary's "zh"
            const targetLang = lang === "zh" ? "zh" : lang;
            return current[targetLang] || current["en"] || path;
        }

        return String(current);
    };

    return { t, lang };
}
