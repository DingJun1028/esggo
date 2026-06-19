import { NextRequest, NextResponse } from "next/server";
import { ExternalAdapter } from "@/lib/services/external-adapter";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { system, key, privacyLevel } = await req.json();

        if (!system || !key) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const sealed = await ExternalAdapter.syncAndSeal(system, key, privacyLevel || "L2");
        return NextResponse.json(sealed);
    } catch (error: any) {
        console.error("External Sync API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to sync external data" }, { status: 500 });
    }
}
