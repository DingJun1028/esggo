import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, NCB_CONFIG } from "@/lib/ncb-utils";
import { UCCEngine } from "@/core/ucc-engine";
import { writeLimiter } from "@/lib/rate-limit";

const ucc = new UCCEngine();

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';

    // 1. Rate Limit Check
    const limit = await writeLimiter.limit(ip);
    if (!limit.success) {
        return NextResponse.json({ error: "Rate limit exceeded (Write)" }, { status: 429 });
    }

    const user = await getSessionUser(req.headers.get("cookie") || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 1. Seal Evidence via UCC Engine
        const sealed = await ucc.sealEvidence({
            formula: body.formula,
            impactMetric: body.impactMetric,
            sourceOrigin: body.sourceOrigin || "EvidenceVault_API",
            lifecycleStage: body.lifecycleStage || "verified",
            metadata: body.metadata
        });

        // 2. Save to NCB
        const searchParams = new URLSearchParams();
        searchParams.set("Instance", NCB_CONFIG.instance);
        const url = `${NCB_CONFIG.dataApiUrl}/create/evidence_vault?${searchParams.toString()}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.instance,
                "Cookie": req.headers.get("cookie") || "",
            },
            body: JSON.stringify({
                ...sealed,
                impact_metric: JSON.stringify(sealed.impactMetric),
                metadata: JSON.stringify(sealed.metadata || {}),
                timestamp: sealed.timestamp.toString(), // Store as string for BIGINT safety
                user_id: user.id
            })
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const user = await getSessionUser(req.headers.get("cookie") || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = new URLSearchParams();
    searchParams.set("Instance", NCB_CONFIG.instance);
    // Forward query params (limit, offset, order, etc)
    req.nextUrl.searchParams.forEach((val, key) => {
        if (key !== "Instance") searchParams.append(key, val);
    });

    const url = `${NCB_CONFIG.dataApiUrl}/list/evidence_vault?${searchParams.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Database-Instance": NCB_CONFIG.instance,
            "Cookie": req.headers.get("cookie") || "",
        }
    });

    const data = await res.json();

    // Integrity check for each record
    if (Array.isArray(data.records)) {
        data.records = data.records.map((r: any) => ({
            ...r,
            verified: ucc.verifyIntegrity(r)
        }));
    }

    return NextResponse.json(data, { status: res.status });
}
