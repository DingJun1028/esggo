import { NextRequest, NextResponse } from "next/server";
import {
    proxyToNCBPublic,
    getRlsPolicies,
    extractTableFromPath,
    resolveInstance,
    allowsPublicRead,
    allowsPublicWrite,
    requiresOwnerScope,
} from "@/lib/ncb-utils";

/**
 * Public Data Proxy: app/api/public-data/[...path]/route.ts
 * Handles anonymous access for tables with public_* policies.
 */

const json = (body: object, status = 200) =>
    new NextResponse(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const pathStr = path.join("/");
    const table = extractTableFromPath(pathStr);
    if (!table) return json({ error: "Invalid path" }, 400);

    const instance = resolveInstance(table);
    const policies = await getRlsPolicies(instance);
    const policy = policies[table];

    if (!allowsPublicRead(policy)) {
        return json({ error: `Table "${table}" does not allow public read access` }, 403);
    }

    if (requiresOwnerScope(policy)) {
        const ownerId = req.nextUrl.searchParams.get("owner_id");
        if (!ownerId) return json({ error: "owner_id query parameter is required for scoped access" }, 400);
    }

    return proxyToNCBPublic(req, pathStr);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const pathStr = path.join("/");
    const table = extractTableFromPath(pathStr);

    const instance = resolveInstance(table);
    const policies = await getRlsPolicies(instance);
    const policy = policies[table];

    if (!allowsPublicWrite(policy)) {
        return json({ error: `Table "${table}" does not allow public write access` }, 403);
    }

    const body = await req.text();
    if (requiresOwnerScope(policy)) {
        try {
            const parsed = JSON.parse(body);
            if (!parsed.owner_id) return json({ error: "owner_id is required in body for scoped write" }, 400);
        } catch {
            return json({ error: "Invalid JSON body" }, 400);
        }
    }

    return proxyToNCBPublic(req, pathStr, body);
}
