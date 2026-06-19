"use client";

import { useAppContext } from "@/lib/context/app-context";
import { ESG_DICTIONARY, ESGDictionary } from "@/lib/i18n/dictionary";

/**
 * Hook for professional ESG terminology (英標繁博).
 * Provides type-safe access to standardized labels.
 */
export function useProfessionalI18n() {
    const { lang } = useAppContext();

    const t = <K extends keyof ESGDictionary, S extends keyof ESGDictionary[K]>(
        category: K,
        item: S
    ): string => {
        const entry = (ESG_DICTIONARY[category] as any)?.[item];
        if (!entry) return String(item);
        return entry[lang] || entry["en"] || String(item);
    };

    return { t, lang };
}
