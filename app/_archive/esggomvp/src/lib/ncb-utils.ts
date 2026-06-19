import { NextRequest, NextResponse } from "next/server";
/**
 * 🛠️ ncb-utils.ts
 * Shared utilities for NoCodeBackend integration.
 */

export const NCB_CONFIG = {
    instance: process.env.NCB_INSTANCE || '54686_esg_go_ncb',
    userdbInstance: process.env.NCB_USERDB_INSTANCE || '54686_esg_go_users',
    authApiUrl: process.env.NCB_AUTH_API_URL || 'https://app.nocodebackend.com/api/user-auth',
    dataApiUrl: process.env.NCB_DATA_API_URL || 'https://app.nocodebackend.com/api/data',
    appUrl: process.env.NCB_APP_URL || 'https://app.nocodebackend.com',
};

/**
 * Extract auth cookies for forwarding to NCB.
 */
export function extractAuthCookies(cookieHeader: string | null): string {
    if (!cookieHeader) return "";

    const cookies = cookieHeader.split(";");
    const authCookies: string[] = [];

    for (const cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith("better-auth.session_token=") ||
            trimmed.startsWith("better-auth.session_data=")) {
            authCookies.push(trimmed);
        }
    }

    return authCookies.join("; ");
}

/**
 * Get current session user from NCB.
 */
export async function getSessionUser(cookieHeader: string | null): Promise<{ id: string, email: string } | null> {
    const authCookies = extractAuthCookies(cookieHeader);
    if (!authCookies) return null;

    const url = `${NCB_CONFIG.authApiUrl}/get-session?Instance=${NCB_CONFIG.instance}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.instance,
                "Cookie": authCookies,
            },
        });

        if (res.ok) {
            const data = await res.json();
            return data.user || null;
        }
    } catch (error) {
        console.error("Session Check Error:", error);
    }
    return null;
}
/**
 * 🛠️ ncbFetch
 * Standardized fetch wrapper for NoCodeBackend calls with error handling and type safety.
 */
export async function ncbFetch<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T | null; error: string | null }> {
    const url = endpoint.startsWith('http') ? endpoint : `${NCB_CONFIG.dataApiUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.instance,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { data: null, error: `NCB Fetch Error (${response.status}): ${errorText}` };
        }

        const data = await response.json();
        return { data: data.data !== undefined ? data.data : data, error: null };
    } catch (error) {
        console.error("NCB Fetch Exception:", error);
        return { data: null, error: error instanceof Error ? error.message : String(error) };
    }
}

/**
 * 🛠️ extractTableFromPath
 */
export function extractTableFromPath(pathStr: string): string | null {
    const parts = pathStr.split("/");
    return parts[0] || null;
}

/**
 * 🛠️ resolveInstance
 */
export function resolveInstance(table: string): string {
    return NCB_CONFIG.instance;
}

/**
 * 🛠️ getRlsPolicies
 */
export async function getRlsPolicies(instance: string): Promise<Record<string, any>> {
    // 這裡應該從資料庫或設定檔讀取，目前先提供基本對照
    return {
        "suppliers": { public_read: true, public_write: false },
        "village_supply": { public_read: true, public_write: false },
        "carbon_data": { public_read: true, public_write: true, owner_scoped: true },
        "test_table": { public_read: true, public_write: true }
    };
}

/**
 * 🛠️ allowsPublicRead
 */
export function allowsPublicRead(policy: any): boolean {
    return policy?.public_read === true;
}

/**
 * 🛠️ allowsPublicWrite
 */
export function allowsPublicWrite(policy: any): boolean {
    return policy?.public_write === true;
}

/**
 * 🛠️ requiresOwnerScope
 */
export function requiresOwnerScope(policy: any): boolean {
    return policy?.owner_scoped === true;
}

/**
 * 🛠️ proxyToNCBPublic
 */
export async function proxyToNCBPublic(req: NextRequest, pathStr: string, body?: string): Promise<NextResponse> {
    const url = `${NCB_CONFIG.dataApiUrl}/${pathStr}?Instance=${NCB_CONFIG.instance}`;
    const method = req.method;
    
    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": NCB_CONFIG.instance
            },
            body: body || undefined
        });
        
        const data = await res.json();
        return new NextResponse(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}


