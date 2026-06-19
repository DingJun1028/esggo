import { NextRequest, NextResponse } from "next/server";
import { NCB_CONFIG, extractAuthCookies } from "@/lib/ncb-utils";

/**
 * Auth Proxy Route: app/api/auth-old/route.ts
 * Legacy proxy - redirects to new auth or returns 404
 */

export async function GET(req: NextRequest) {
    return NextResponse.json({ 
        error: "Use /api/auth/[...nextauth] instead" 
    }, { status: 404 });
}

export async function POST(req: NextRequest) {
    return NextResponse.json({ 
        error: "Use /api/auth/[...nextauth] instead" 
    }, { status: 404 });
}

/**
 * Transform Set-Cookie headers from NCB for localhost compatibility.
 */
function transformSetCookieForLocalhost(cookie: string): string {
    const parts = cookie.split(";");
    const nameValue = parts[0].trim();

    let cleanedNameValue = nameValue;
    if (nameValue.startsWith("__Secure-better-auth.")) {
        cleanedNameValue = nameValue.replace("__Secure-", "");
    } else if (nameValue.startsWith("__Host-better-auth.")) {
        cleanedNameValue = nameValue.replace("__Host-", "");
    }

    const otherAttributes = parts.slice(1)
        .map(attr => attr.trim())
        .filter(attr => {
            const lower = attr.toLowerCase();
            return !lower.startsWith("domain=") &&
                !lower.startsWith("secure") &&
                !lower.startsWith("samesite=");
        });

    otherAttributes.push("SameSite=Lax");
    return [cleanedNameValue, ...otherAttributes].join("; ");
}

async function handleSignOut(req: NextRequest) {
    const response = new NextResponse(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );

    try {
        const searchParams = new URLSearchParams();
        searchParams.set("instance", NCB_CONFIG.userdbInstance);
        const url = `${NCB_CONFIG.authApiUrl}/sign-out?${searchParams.toString()}`;
        const origin = req.headers.get("origin") || req.nextUrl.origin;
        const authCookies = extractAuthCookies(req.headers.get("cookie") || "");

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.userdbInstance,
                "Cookie": authCookies,
                "Origin": origin,
            },
            body: "{}",
        });

        const cookies = res.headers.getSetCookie?.() || [];
        for (const cookie of cookies) {
            response.headers.append("Set-Cookie", transformSetCookieForLocalhost(cookie));
        }
    } catch {
        // Ignore upstream errors
    }

    const cookiesToClear = ["better-auth.session_token", "better-auth.session_data"];
    for (const cookieName of cookiesToClear) {
        response.headers.append(
            "Set-Cookie",
            `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
        );
    }

    return response;
}

async function proxy(req: NextRequest, path: string, body?: string) {
    const searchParams = new URLSearchParams();
    searchParams.set("instance", NCB_CONFIG.userdbInstance);
    req.nextUrl.searchParams.forEach((val, key) => {
        if (key.toLowerCase() !== "instance") searchParams.append(key, val);
    });
    const url = `${NCB_CONFIG.authApiUrl}/${path}?${searchParams.toString()}`;
    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const authCookies = extractAuthCookies(req.headers.get("cookie") || "");

    const res = await fetch(url, {
        method: req.method,
        headers: {
            "Content-Type": "application/json",
            "X-Database-Instance": NCB_CONFIG.userdbInstance,
            "Cookie": authCookies,
            "Origin": origin,
            "Host": new URL(NCB_CONFIG.authApiUrl).host,
            "X-Forwarded-Host": req.headers.get("host") || "",
        },
        body: body || undefined,
        redirect: 'manual', // 處理 OAuth Redirect
    });

    const isRedirect = res.status >= 300 && res.status < 400;

    // 如果是 Redirect，建立跳轉的 NextResponse，而不是單純的回傳 JSON
    let response: NextResponse;
    if (isRedirect) {
        const location = res.headers.get("Location") || "";
        response = NextResponse.redirect(location, res.status);
    } else {
        const data = await res.text();
        response = new NextResponse(data, {
            status: res.status,
            headers: { "Content-Type": "application/json" }
        });
    }

    const cookies = res.headers.getSetCookie?.() || [];
    for (const cookie of cookies) {
        response.headers.append("Set-Cookie", transformSetCookieForLocalhost(cookie));
    }

    return response;
}
