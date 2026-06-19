import { NextResponse } from "next/server";
import { NCB_CONFIG } from "@/lib/ncb-utils";

/**
 * Auth Providers Route: app/api/auth-providers/route.ts
 * Fetches enabled authentication providers from NCB.
 */

export async function GET() {
    const url = `${NCB_CONFIG.authApiUrl}/providers?Instance=${NCB_CONFIG.instance}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch auth providers:", error);
        return NextResponse.json({ providers: { email: true } }, { status: 500 });
    }
}
