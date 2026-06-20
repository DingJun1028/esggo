import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'omnicore_default_secret_key_please_change'
);

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('omni_session')?.value;

  if (!sessionToken) {
    // Fallback for demo bypass
    const isBypass = cookieStore.get('omni_user_bypass')?.value === 'true';
    if (isBypass) {
      return NextResponse.json({ user: { name: 'Demo User (Bypass)' } });
    }
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    return NextResponse.json({ user: payload });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
