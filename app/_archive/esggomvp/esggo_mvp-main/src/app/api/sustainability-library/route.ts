/**
 * 🌿 Sustainability Library — List Route
 * GET /api/sustainability-library
 * 從 NCBDB `sustainability_resources` 表取得資源列表（有回退至靜態資料）
 */
import { NextRequest, NextResponse } from "next/server";
import type { ISustainabilityResource } from "@/data/sustainability-library-db";

interface NcbRow {
    id: number;
    resource_id: string;
    title: string;
    title_zh?: string;
    category: string;
    region: string;
    year: string;
    author: string;
    tags?: string;
    description_zh?: string;
    url?: string;
    is_featured: number | boolean;
    view_count: number;
    download_count: number;
    standard_ref?: string;
    esg_score?: number;
    hash_ref?: string;
    created_at?: string;
}

/** 將 NCBDB 行轉換為頁面所需的 ISustainabilityResource 格式 */
function transformRow(row: NcbRow): ISustainabilityResource {
    return {
        id: row.resource_id,
        resource_id: row.resource_id,
        title: row.title,
        title_zh: row.title_zh || row.title,
        category: row.category as ISustainabilityResource["category"],
        region: row.region as ISustainabilityResource["region"],
        year: row.year,
        author: row.author,
        tags: (row.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
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
    };
}

import { OmniCache } from "@/lib/redis-cache";

/** Server-side fetch to NCBDB public data endpoint */
async function fetchNcbList(): Promise<{ data: ISustainabilityResource[]; source: string }> {
    return OmniCache.wrap(
        "api:sustainability-library:list:v2",
        async () => {
            const instance = process.env.NCB_INSTANCE;
            const dataApiUrl = process.env.NCB_DATA_API_URL;

            if (!instance || !dataApiUrl) {
                throw new Error("NCB_INSTANCE or NCB_DATA_API_URL not configured");
            }

            const url = `${dataApiUrl}/list/sustainability_resources?Instance=${instance}&sort=year&order=desc&limit=200`;
            const res = await fetch(url, {
                headers: { "Content-Type": "application/json", "X-Database-Instance": instance },
                cache: "no-store",
            });

            if (!res.ok) throw new Error(`NCBDB error: ${res.status}`);

            const json = await res.json();
            const rows: NcbRow[] = json.data || [];
            return { data: rows.map(transformRow), source: "ncbdb_cached" };
        },
        3600000 // 1 hour TTL
    );
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || "";
    const region = searchParams.get("region") || "";
    const search = (searchParams.get("q") || searchParams.get("search") || "").toLowerCase();
    const featuredOnly = searchParams.get("featured") === "true";

    try {
        const { data, source } = await fetchNcbList();

        let filtered = data;
        if (category) filtered = filtered.filter((r) => r.category === category);
        if (region) filtered = filtered.filter((r) => r.region === region);
        if (featuredOnly) filtered = filtered.filter((r) => r.is_featured);
        if (search) {
            filtered = filtered.filter(
                (r) =>
                    r.title.toLowerCase().includes(search) ||
                    r.title_zh.toLowerCase().includes(search) ||
                    r.author.toLowerCase().includes(search) ||
                    r.tags.some((t) => t.toLowerCase().includes(search)) ||
                    r.description_zh.toLowerCase().includes(search)
            );
        }

        return NextResponse.json({ success: true, data: filtered, total: filtered.length, source });
    } catch (err) {
        // 回退至靜態資料
        console.warn("[SustainabilityLib] NCBDB unavailable, falling back to static data:", err);
        const { SUSTAINABILITY_LIBRARY_DB } = await import("@/data/sustainability-library-db");
        let data = SUSTAINABILITY_LIBRARY_DB;
        if (category) data = data.filter((r) => r.category === category);
        if (region) data = data.filter((r) => r.region === region);
        if (featuredOnly) data = data.filter((r) => r.is_featured);
        if (search) {
            data = data.filter(
                (r) =>
                    r.title.toLowerCase().includes(search) ||
                    r.title_zh.toLowerCase().includes(search) ||
                    r.author.toLowerCase().includes(search) ||
                    r.tags.some((t) => t.toLowerCase().includes(search)) ||
                    r.description_zh.toLowerCase().includes(search)
            );
        }
        return NextResponse.json({ success: true, data, total: data.length, source: "static_fallback" });
    }
}
