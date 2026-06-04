export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
export async function GET(req) {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_WORKSPACE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
        return NextResponse.json({ error: "Google Workspace Client ID is not configured." }, { status: 500 });
    }
    // Request offline access to obtain a refresh token
    const searchParams = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${req.nextUrl.origin}/api/hermes/google/callback`,
        response_type: "code",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/drive"
        ].join(" "),
        access_type: "offline",
        prompt: "consent", // Force consent screen to always get a refresh token
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${searchParams.toString()}`;
    return NextResponse.redirect(url);
}
//# sourceMappingURL=route.js.map