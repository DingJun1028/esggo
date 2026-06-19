import { NextRequest, NextResponse } from "next/server";
import { omniNexus } from "@/core/omni-nexus";
import { OmniCache } from "@/lib/redis-cache";

export const runtime = 'edge';

/**
 * 🔮 API Route: OmniNexus Unified Gateway
 * ========================================
 * Single endpoint for all OmniNexus operations
 * 
 * Usage:
 * POST /api/nexus
 * Body: { operation: "manifest_asset", params: { intent: "...", payload: {...} } }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { operation, params = {} } = body;

        if (!operation) {
            return NextResponse.json(
                { error: "Missing 'operation' parameter" },
                { status: 400 }
            );
        }

        const cacheKey = OmniCache.generateKey("nexus", operation, (typeof params === 'string' ? { raw: params } : params) as Record<string, unknown>);

        const result = await OmniCache.wrap(cacheKey, async () => {
            return await omniNexus.dispatch(operation, params);
        }, 60);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("🔴 OmniNexus API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * Health check for OmniNexus
 */
export async function GET() {
    return NextResponse.json({
        status: "OPERATIONAL",
        version: "10.1.0",
        service: "OmniNexus Unified Gateway",
        timestamp: new Date().toISOString()
    }, {
        headers: {
            'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=59',
            'x-omni-edge': 'true'
        }
    });
}
