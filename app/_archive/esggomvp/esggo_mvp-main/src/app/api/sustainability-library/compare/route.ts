/**
 * 🌿 Sustainability Library — Compare Route
 * POST /api/sustainability-library/compare
 * Body: { ids: string[] }  (resource_id strings)
 */
import { NextRequest } from "next/server";
import type { ISustainabilityResource } from "@/data/sustainability-library-db";
import { withErrorHandler, successResponse } from "@/lib/api-response";
import { OmniError } from "@/core/errors/OmniError";

export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const ids: string[] = body.ids || [];

    if (ids.length < 2) {
        throw OmniError.badRequest("至少需要 2 項資源進行比較");
    }
    if (ids.length > 4) {
        throw OmniError.badRequest("最多比較 4 項資源");
    }

    // 優先嘗試從 NCBDB 取得資料
    let selected: ISustainabilityResource[] = [];

    try {
        const instance = process.env.NCB_INSTANCE;
        const dataApiUrl = process.env.NCB_DATA_API_URL;

        if (instance && dataApiUrl) {
            const url = `${dataApiUrl}/list/sustainability_resources?Instance=${instance}&limit=200`;
            const res = await fetch(url, {
                headers: { "Content-Type": "application/json", "X-Database-Instance": instance },
                cache: "no-store",
            });

            if (res.ok) {
                const json = await res.json();
                const rows = json.data || [];
                selected = ids
                    .map((id) => rows.find((r: { resource_id: string }) => r.resource_id === id))
                    .filter(Boolean)
                    .map((row: { resource_id: string; title: string; title_zh?: string; category: string; region: string; year: string; author: string; tags?: string; description_zh?: string; url?: string; is_featured: number | boolean; view_count: number; download_count: number; standard_ref?: string; esg_score?: number; hash_ref?: string; created_at?: string }) => ({
                        id: row.resource_id,
                        resource_id: row.resource_id,
                        title: row.title,
                        title_zh: row.title_zh || row.title,
                        category: row.category as ISustainabilityResource["category"],
                        region: row.region as ISustainabilityResource["region"],
                        year: row.year,
                        author: row.author,
                        tags: (row.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
                        description: row.title,
                        description_zh: row.description_zh || "",
                        url: row.url,
                        is_featured: Boolean(row.is_featured),
                        view_count: row.view_count || 0,
                        download_count: row.download_count || 0,
                        created_at: row.created_at || new Date().toISOString(),
                        standard: row.standard_ref,
                        esg_score: row.esg_score,
                        hash_ref: row.hash_ref,
                    }));
            }
        }
    } catch (error) {
        // NCBDB 發生異常時，回退至靜態資料庫
        console.warn("NCB API 遠端提取失敗，回退至本地靜態資料庫 (SUSTAINABILITY_LIBRARY_DB)", error);
    }

    // 若從上方 API 未拿到足夠資源，強制降級回本地端再次篩選
    if (selected.length < 2) {
        const { SUSTAINABILITY_LIBRARY_DB } = await import("@/data/sustainability-library-db");
        selected = ids
            .map((id) => SUSTAINABILITY_LIBRARY_DB.find((r) => r.id === id || r.resource_id === id))
            .filter(Boolean) as ISustainabilityResource[];
    }

    if (selected.length < 2) {
        throw OmniError.notFound("找不到指定的資源");
    }

    // --- 🧬 HEP Phase 11: Comparison Engine (Principle 6) ---
    const { ComparisonEngine } = await import("@/lib/ComparisonEngine");
    const result = ComparisonEngine.analyze(selected);

    return successResponse(result, {
        cache: "no-store",
        metadata: {
            ids,
            analyzed_at: Date.now(),
            logic: "Omni-HEP-V6"
        }
    });
});
