/**
 * 🌿 Sustainability Library — Stats Route
 * GET /api/sustainability-library/stats
 */
import { NextResponse } from "next/server";
import { OmniCache } from "@/lib/redis-cache";
import type { ILibraryStats } from "@/data/sustainability-library-db";

export async function GET() {
    try {
        const rows = await OmniCache.wrap(
            "api:sustainability-library:stats:v2",
            async () => {
                const instance = process.env.NCB_INSTANCE;
                const dataApiUrl = process.env.NCB_DATA_API_URL;

                if (!instance || !dataApiUrl) throw new Error("NCB env vars not configured");

                const url = `${dataApiUrl}/list/sustainability_resources?Instance=${instance}&limit=200`;
                const res = await fetch(url, {
                    headers: { "Content-Type": "application/json", "X-Database-Instance": instance },
                    cache: "no-store",
                });

                if (!res.ok) throw new Error(`NCBDB error: ${res.status}`);
                const json = await res.json();
                return json.data || [];
            },
            3600000 // 1 hour TTL
        );

        const stats: ILibraryStats = {
            total: rows.length,
            byCategory: {
                Yearbook: rows.filter((r: { category: string }) => r.category === "Yearbook").length,
                Report: rows.filter((r: { category: string }) => r.category === "Report").length,
                Regulation: rows.filter((r: { category: string }) => r.category === "Regulation").length,
                Template: rows.filter((r: { category: string }) => r.category === "Template").length,
                CaseStudy: rows.filter((r: { category: string }) => r.category === "CaseStudy").length,
            },
            byRegion: {
                Global: rows.filter((r: { region: string }) => r.region === "Global").length,
                Taiwan: rows.filter((r: { region: string }) => r.region === "Taiwan").length,
                USA: rows.filter((r: { region: string }) => r.region === "USA").length,
                EU: rows.filter((r: { region: string }) => r.region === "EU").length,
            },
            totalDownloads: rows.reduce((s: number, r: { download_count: number }) => s + (r.download_count || 0), 0),
            totalViews: rows.reduce((s: number, r: { view_count: number }) => s + (r.view_count || 0), 0),
            yearsSpanned: 10,
        };

        return NextResponse.json({ success: true, data: stats, source: "ncbdb" });
    } catch (err) {
        console.warn("[SustainabilityLib/stats] NCBDB unavailable, using static fallback:", err);
        const { getLibraryStats } = await import("@/data/sustainability-library-db");
        const stats = getLibraryStats();
        return NextResponse.json({ success: true, data: stats, source: "static_fallback" });
    }
}
