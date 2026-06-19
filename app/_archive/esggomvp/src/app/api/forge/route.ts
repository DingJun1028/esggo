import { NextRequest, NextResponse } from "next/server";
import { OmniAPI } from "@/core/omni-api";

/**
 * 🛰️ API Route: Forge GRI Report
 * Runs on the server to avoid client-side Node.js module dependency issues (like ioredis/dns).
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, indicators } = body;

        const api = OmniAPI.getInstance();
        const reportResult = await api.forgeGRIReport(title, indicators);

        return NextResponse.json(reportResult);
    } catch (error: any) {
        console.error("Forge Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
