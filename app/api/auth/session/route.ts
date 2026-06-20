import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 401 });
    }

    if (!firebaseAdmin) {
      return NextResponse.json({ error: "Firebase Admin not initialized" }, { status: 500 });
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create the session cookie
    const sessionCookie = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Set cookie policy for session cookie
    const options = {
      name: "omni_session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    const response = NextResponse.json({ status: "success" }, { status: 200 });

    response.cookies.set(options);

    return response;
  } catch (error: any) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Internal session error" }, { status: 401 });
  }
}
