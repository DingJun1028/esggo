import { handlers } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server";
import { NCB_CONFIG } from "@/lib/ncb-utils";

/**
 * 🔐 Integrated Auth Router
 * Handles both NextAuth and Legacy NCB Proxy
 */
export async function GET(req: NextRequest, { params }: { params: { nextauth: string[] } }) {
    const path = params.nextauth.join("/");
    // If it's not a standard NextAuth path, proxy it
    if (!['signin', 'signout', 'session', 'callback', 'csrf', 'providers'].includes(params.nextauth[0])) {
        return proxyAuth(req, path);
    }
    return handlers.GET(req);
}

export async function POST(req: NextRequest, { params }: { params: { nextauth: string[] } }) {
    const path = params.nextauth.join("/");
    if (!['signin', 'signout', 'session', 'callback', 'csrf', 'providers'].includes(params.nextauth[0])) {
        return proxyAuth(req, path);
    }
    return handlers.POST(req);
}

async function proxyAuth(req: NextRequest, path: string) {
    const url = `${NCB_CONFIG.authApiUrl}/${path}?Instance=${NCB_CONFIG.instance}`;
    const body = req.method === "POST" ? await req.text() : undefined;

    const forwardHeaders = new Headers(req.headers);
    forwardHeaders.set("X-Database-Instance", NCB_CONFIG.instance);

    const res = await fetch(url, {
        method: req.method,
        headers: forwardHeaders,
        body,
        redirect: "manual",
    });

    const responseHeaders = new Headers(res.headers);

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
        const transformedCookies = setCookie.split(", ").map(cookie => {
            return cookie
                .replace(/__Secure-/g, "")
                .replace(/__Host-/g, "")
                .replace(/Domain=[^;]+;?\s*/g, "")
                .replace(/Secure;?\s*/g, "")
                + "; SameSite=Lax";
        });
        responseHeaders.delete("set-cookie");
        transformedCookies.forEach(c => responseHeaders.append("set-cookie", c));
    }

    return new NextResponse(res.body, {
        status: res.status,
        headers: responseHeaders,
    });
}
