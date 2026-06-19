"use client";

/**
 * useEsgIndicators — Full-stack typed client hook
 * Fetches from /api/esg-indicators with the exact same types as the server.
 * No type casting. Import IndicatorLibraryResponse from the API route directly.
 */

import { useState, useEffect, useCallback } from "react";
import type {
    IndicatorLibraryResponse,
    AtomicESGIndicator,
    ESGCategory,
    IndicatorValueEntry,
} from "@/lib/types/atomic-esg-types";

interface UseEsgIndicatorsOptions {
    category?: ESGCategory;
    subcategory?: string;
    requiredOnly?: boolean;
    framework?: string;
}

interface UseEsgIndicatorsReturn {
    indicators: AtomicESGIndicator[];
    total: number;
    byCategory: IndicatorLibraryResponse["byCategory"] | null;
    subcategories: IndicatorLibraryResponse["subcategories"] | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useEsgIndicators(
    options: UseEsgIndicatorsOptions = {}
): UseEsgIndicatorsReturn {
    const [data, setData] = useState<IndicatorLibraryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { category, subcategory, requiredOnly, framework } = options;

    const fetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (subcategory) params.set("subcategory", subcategory);
        if (requiredOnly) params.set("required", "true");
        if (framework) params.set("framework", framework);

        try {
            const res = await globalThis.fetch(`/api/esg-indicators?${params.toString()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json: IndicatorLibraryResponse = await res.json();
            setData(json);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load indicators");
        } finally {
            setIsLoading(false);
        }
    }, [category, subcategory, requiredOnly, framework]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        indicators: data?.indicators ?? [],
        total: data?.total ?? 0,
        byCategory: data?.byCategory ?? null,
        subcategories: data?.subcategories ?? null,
        isLoading,
        error,
        refetch: fetch,
    };
}

// ─────────────────────────────────────────────
// Local value store hook (per session)
// ─────────────────────────────────────────────

const STORAGE_KEY = "esggo_indicator_values_v1";

export function useIndicatorValues() {
    const [values, setValues] = useState<Record<string, IndicatorValueEntry>>({});

    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Ensure state update happens after initial mount to avoid sync cascading
                requestAnimationFrame(() => setValues(data));
            } catch { /* ignore */ }
        }
    }, []);

    const setValue = useCallback((entry: IndicatorValueEntry) => {
        setValues((prev) => {
            const updated = { ...prev, [entry.indicatorId]: entry };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const getValue = useCallback(
        (id: string): IndicatorValueEntry | undefined => values[id],
        [values]
    );

    const getFilledCount = useCallback(
        (ids: string[]) => ids.filter((id) => !!values[id]?.value).length,
        [values]
    );

    const exportValues = useCallback(
        (): IndicatorValueEntry[] => Object.values(values),
        [values]
    );

    return { values, setValue, getValue, getFilledCount, exportValues };
}
