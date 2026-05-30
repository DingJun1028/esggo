import { NextRequest, NextResponse } from "next/server";
import { saveHermesCredentials } from "@/lib/agent/hermes-store";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  const baseUrl = req.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(`${baseUrl}/omni-skills?hermes_error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/omni-skills?hermes_error=missing_code`);
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_WORKSPACE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_WORKSPACE_CLIENT_SECRET;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${baseUrl}/omni-skills?hermes_error=missing_config`);
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${baseUrl}/api/hermes/google/callback`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Token exchange failed:", data);
      return NextResponse.redirect(`${baseUrl}/omni-skills?hermes_error=token_exchange_failed`);
    }

    // Securely store the credentials to Supabase Vault
    await saveHermesCredentials('system_default', {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      scope: data.scope,
    });
    
    return NextResponse.redirect(`${baseUrl}/omni-skills?hermes_success=google_workspace_connected`);
  } catch (err) {
    console.error("OAuth Callback error:", err);
    return NextResponse.redirect(`${baseUrl}/omni-skills?hermes_error=internal_server_error`);
  }
}
