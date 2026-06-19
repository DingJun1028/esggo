import { NextRequest, NextResponse } from "next/server";
import { NCB_CONFIG, extractAuthCookies, getSessionUser } from "@/lib/ncb-utils";

/**
 * 📊 Data Proxy
 * Handles authenticated data requests, enforcing RLS via session forwarding.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return proxyData(req, resolvedParams.path.join("/"));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return proxyData(req, resolvedParams.path.join("/"));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return proxyData(req, resolvedParams.path.join("/"));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const resolvedParams = await params;
    return proxyData(req, resolvedParams.path.join("/"));
}

async function proxyData(req: NextRequest, path: string) {
    const cookieHeader = req.headers.get("cookie");
    const authCookies = extractAuthCookies(cookieHeader);

    if (!authCookies) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = `${NCB_CONFIG.dataApiUrl}/${path}?Instance=${NCB_CONFIG.instance}`;

    let body: any = undefined;
    if (req.method !== "GET" && req.method !== "DELETE") {
        const json = await req.json();

        // Inject user_id on CREATE
        if (path.startsWith("create/")) {
            const user = await getSessionUser(cookieHeader);
            if (user) {
                json.user_id = user.id;
            }
        }

        body = JSON.stringify(json);
    }

    const res = await fetch(url, {
        method: req.method,
        headers: {
            "Content-Type": "application/json",
            "X-Database-Instance": NCB_CONFIG.instance,
            "Cookie": authCookies,
        },
        body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
