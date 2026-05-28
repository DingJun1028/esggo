import { NextRequest, NextResponse } from "next/server";

const CONFIG = {
  instance: process.env.NCB_INSTANCE!,
  apiUrl: process.env.NCB_AUTH_API_URL!,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(req, path.join("/"));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  
  // Special handling for sign-out
  if (pathStr === "sign-out") {
    return handleSignOut(req);
  }
  
  return proxy(req, pathStr, await req.text());
}

/**
 * Extract only better-auth cookies from the request.
 * NCB accepts cookies as-is (with or without __Secure- prefix).
 */
function extractAuthCookies(cookieHeader: string): string {
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
function transformSetCookieForLocalhost(cookie: string): string {
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
      return !lower.startsWith("domain=") && 
             !lower.startsWith("secure") &&
             !lower.startsWith("samesite=");
    });
  
  // Add SameSite=Lax for localhost
  otherAttributes.push("SameSite=Lax");
  
  return [cleanedNameValue, ...otherAttributes].join("; ");
}

// Sign-out handler that always returns 200 and clears cookies
async function handleSignOut(req: NextRequest) {
  const response = new NextResponse(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );

  // Try to call upstream sign-out
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("Instance", CONFIG.instance);
    const url = `${CONFIG.apiUrl}/sign-out?${searchParams.toString()}`;
    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const authCookies = extractAuthCookies(req.headers.get("cookie") || "");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Database-Instance": CONFIG.instance,
        "Cookie": authCookies,
        "Origin": origin,
      },
      body: "{}",
    });

    // Forward any Set-Cookie headers from upstream
    const cookies = res.headers.getSetCookie?.() || [];
    for (const cookie of cookies) {
      response.headers.append("Set-Cookie", transformSetCookieForLocalhost(cookie));
    }
  } catch {
    // Ignore upstream errors
  }

  // Always clear auth cookies
  const cookiesToClear = [
    "better-auth.session_token",
    "better-auth.session_data",
  ];
  
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
  searchParams.set("Instance", CONFIG.instance);
  const url = `${CONFIG.apiUrl}/${path}?${searchParams.toString()}`;
  const origin = req.headers.get("origin") || req.nextUrl.origin;

  const authCookies = extractAuthCookies(req.headers.get("cookie") || "");

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "X-Database-Instance": CONFIG.instance,
      "Cookie": authCookies,
      "Origin": origin,
    },
    body: body || undefined,
  });

  const data = await res.text();
  const response = new NextResponse(data, { 
    status: res.status, 
    headers: { "Content-Type": "application/json" } 
  });

  // Transform Set-Cookie headers for localhost compatibility
  const cookies = res.headers.getSetCookie?.() || [];
  for (const cookie of cookies) {
    response.headers.append("Set-Cookie", transformSetCookieForLocalhost(cookie));
  }
  
  return response;
}
