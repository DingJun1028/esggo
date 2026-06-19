/**
 * GET /api/esg-indicators
 * Full-stack type-safe API route for the Atomic ESG Indicator Library.
 * Shares AtomicESGIndicator types with the frontend — zero casting.
 */

import { NextRequest, NextResponse } from "next/server";
import {
    ATOMIC_ESG_INDICATORS,
    getIndicatorsByCategory,
    getSubcategories,
} from "@/lib/data/atomic-esg-library";
import {
    AtomicESGIndicator,
    ESGCategory,
    IndicatorLibraryResponse,
    IndicatorErrorResponse,
} from "@/lib/types/atomic-esg-types";

// Shared response types are defined in @/lib/types/atomic-esg-types
// and re-exported here for convenience
export type { IndicatorLibraryResponse, IndicatorErrorResponse } from "@/lib/types/atomic-esg-types";

// ─────────────────────────────────────────────
// GET handler
// ─────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") as ESGCategory | null;
        const subcategory = searchParams.get("subcategory");
        const requiredOnly = searchParams.get("required") === "true";
        const framework = searchParams.get("framework");

        let indicators = ATOMIC_ESG_INDICATORS;

        if (category) {
            indicators = getIndicatorsByCategory(category);
        }
        if (subcategory) {
            indicators = indicators.filter((i) => i.subcategory === subcategory);
        }
        if (requiredOnly) {
            indicators = indicators.filter((i) => i.validation.required);
        }
        if (framework) {
            indicators = indicators.filter((i) => i.framework === framework);
        }

        const categories: ESGCategory[] = ["E", "S", "G", "D"];
        const byCategory = Object.fromEntries(
            categories.map((c) => [c, getIndicatorsByCategory(c).length])
        ) as Record<ESGCategory, number>;

        const subcategories = Object.fromEntries(
            categories.map((c) => [c, getSubcategories(c)])
        ) as Record<ESGCategory, string[]>;

        const response: IndicatorLibraryResponse = {
            indicators,
            total: indicators.length,
            byCategory,
            subcategories,
        };

        return NextResponse.json(response, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (err) {
        const error: IndicatorErrorResponse = {
            error: "Failed to fetch ESG indicators",
            code: 500,
        };
        return NextResponse.json(error, { status: 500 });
    }
}
