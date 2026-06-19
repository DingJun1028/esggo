
import { Router, Request, Response } from 'express';
import { getConfig, extractAuthCookies, transformSetCookieForLocalhost } from '../lib/ncb-utils.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = Router();

// Handle Sign Out specially
router.post('/auth/sign-out', async (req: Request, res: Response) => {
    const config = getConfig();
    const searchParams = new URLSearchParams();
    searchParams.set("Instance", config.instance);

    const url = `${config.authApiUrl}/sign-out?${searchParams.toString()}`;
    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const authCookies = extractAuthCookies(req.headers.cookie);

    try {
        const upstreamRes = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Database-Instance": config.instance,
                "Cookie": authCookies,
                "Origin": origin,
            },
            body: JSON.stringify({}),
        });

        // Forward Set-Cookie headers
        // Check if getSetCookie exists (Node 18+)
        if (typeof upstreamRes.headers.getSetCookie === 'function') {
            const cookies = upstreamRes.headers.getSetCookie();
            cookies.forEach(cookie => {
                res.append('Set-Cookie', transformSetCookieForLocalhost(cookie));
            });
        } else {
            // Fallback for older environments or polyfills
            const rawCookie = upstreamRes.headers.get('set-cookie');
            if (rawCookie) {
                res.append('Set-Cookie', transformSetCookieForLocalhost(rawCookie));
            }
        }
    } catch (err) {
        console.error('Sign out proxy error:', err);
    }

    // Always clear auth cookies on client to ensure logout locally
    const cookiesToClear = [
        "better-auth.session_token",
        "better-auth.session_data",
    ];

    cookiesToClear.forEach(cookieName => {
        res.append(
            "Set-Cookie",
            `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
        );
    });

    res.json({ success: true });
});

// Generic Proxy Handler
const handleProxy = async (req: Request, res: Response, targetBaseUrl: string, subPath: string) => {
    const config = getConfig();
    const searchParams = new URLSearchParams();

    // Forward existing query params
    for (const key in req.query) {
        const val = req.query[key];
        if (typeof val === 'string') {
            searchParams.append(key, val);
        } else if (Array.isArray(val)) {
            (val as string[]).forEach(v => searchParams.append(key, v));
        }
    }

    // Enforce Instance param
    searchParams.set("Instance", config.instance);

    const url = `${targetBaseUrl}/${subPath}?${searchParams.toString()}`;
    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const authCookies = extractAuthCookies(req.headers.cookie);

    // Prepare headers
    const headers: Record<string, string> = {
        "Content-Type": req.get('content-type') || "application/json",
        "X-Database-Instance": config.instance,
        "Cookie": authCookies,
        "Origin": origin
    };

    try {
        const upstreamRes = await fetch(url, {
            method: req.method,
            headers: headers,
            // If body is already parsed by express.json(), we need to stringify it. 
            // If it's GET/HEAD, body is undefined.
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
        });

        res.status(upstreamRes.status);

        // Forward Set-Cookie
        if (typeof upstreamRes.headers.getSetCookie === 'function') {
            const cookies = upstreamRes.headers.getSetCookie();
            cookies.forEach(cookie => {
                res.append('Set-Cookie', transformSetCookieForLocalhost(cookie));
            });
        } else {
            const rawCookie = upstreamRes.headers.get('set-cookie');
            if (rawCookie) {
                res.append('Set-Cookie', transformSetCookieForLocalhost(rawCookie));
            }
        }

        const responseData = await upstreamRes.text();
        // Try to parse as JSON to set content-type if possible, or just send valid content type
        try {
            const json = JSON.parse(responseData);
            res.json(json);
        } catch {
            res.send(responseData);
        }

    } catch (error) {
        console.error('NCB Proxy Error:', error);
        res.status(500).json({ error: 'Proxy Error' });
    }
};

// NCB Proxy Routes - Fixed for path-to-regexp v6+ compatibility
// Using Express 4.x compatible wildcard patterns

// Data API proxy - catches /ncb/data/* routes
router.all(/^\/data\/(.*)/, async (req: Request, res: Response) => {
    const config = getConfig();
    const pathMatch = req.params[0] || '';
    await handleProxy(req, res, config.dataApiUrl, pathMatch);
});

// Auth API proxy - catches /ncb/auth/* routes
router.all(/^\/auth\/(.*)/, async (req: Request, res: Response) => {
    const config = getConfig();
    const pathMatch = req.params[0] || '';
    await handleProxy(req, res, config.authApiUrl, pathMatch);
});

// Default catch-all for any other NCB routes
router.all(/(.*)/, async (req: Request, res: Response) => {
    const config = getConfig();
    const pathMatch = req.params[0] || '';
    await handleProxy(req, res, config.dataApiUrl, pathMatch);
});

export default router;
