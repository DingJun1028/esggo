import { Request, Response } from 'express';

interface NcbConfig {
    instance: string;
    authApiUrl: string;
    dataApiUrl: string;
}

export const getConfig = (): NcbConfig => {
    if (!process.env.NCB_INSTANCE) throw new Error('NCB_INSTANCE is not defined');
    if (!process.env.NCB_AUTH_API_URL) throw new Error('NCB_AUTH_API_URL is not defined');
    // Use auth URL as base for data if not specified, or throw
    const dataUrl = process.env.NCB_DATA_API_URL || process.env.NCB_AUTH_API_URL.replace('/user-auth', '/data');

    return {
        instance: process.env.NCB_INSTANCE,
        authApiUrl: process.env.NCB_AUTH_API_URL,
        dataApiUrl: dataUrl
    };
};

/**
 * Extract only better-auth cookies from the request.
 * NCB accepts cookies as-is (with or without __Secure- prefix).
 */
export function extractAuthCookies(cookieHeader: string | undefined): string {
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
 * Transform Set-Cookie headers from NCB for localhost compatibility.
 * NCB sends cookies with __Secure- prefix which browsers reject on localhost.
 */
export function transformSetCookieForLocalhost(cookie: string): string {
    const parts = cookie.split(";");
    const nameValue = parts[0].trim();

    // Strip __Secure- or __Host- prefix from cookie name
    let cleanedNameValue = nameValue;
    if (nameValue.startsWith("__Secure-better-auth.")) {
        cleanedNameValue = nameValue.replace("__Secure-", "");
    } else if (nameValue.startsWith("__Host-better-auth.")) {
        cleanedNameValue = nameValue.replace("__Host-", "");
    }

    // Filter out attributes that don't work on localhost
    const otherAttributes = parts.slice(1)
        .map(attr => attr.trim())
        .filter(attr => {
            const lower = attr.toLowerCase();
            // We might want to keep SameSite=None if we were cross-site, but for localhost proxying, Lax is better.
            // The Next.js example filters out domain, secure, samesite.
            return !lower.startsWith("domain=") &&
                !lower.startsWith("secure") &&
                !lower.startsWith("samesite=");
        });

    // Add SameSite=Lax for localhost
    otherAttributes.push("SameSite=Lax");

    // Re-add Path=/ if it was missing or filtered out (though we didn't filter it)
    // The original example didn't explicitly add Path unless it was preserved.
    // Usually the upstream cookie has Path=/.

    return [cleanedNameValue, ...otherAttributes].join("; ");
}
