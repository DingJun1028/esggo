import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { firebaseAdmin } from '@/lib/firebase-admin';
import { AuthUser, AuthUserSchema } from '@esggo/types';

type MeResponseData = {
  user: AuthUser | null;
};

export async function GET(): Promise<NextResponse<MeResponseData>> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('omni_session')?.value;

  if (!sessionToken) {
    // Fallback for demo bypass
    const isBypass = cookieStore.get('omni_user_bypass')?.value === 'true';
    if (isBypass) {
      const demoUser = AuthUserSchema.parse({ id: 'demo', name: 'Demo User (Bypass)' });
      return NextResponse.json({ user: demoUser });
    }
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    if (!firebaseAdmin) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ user: null }, { status: 500 });
    }

    const decodedClaims = await firebaseAdmin.auth().verifySessionCookie(sessionToken, true);
    
    // Map Firebase claims to our user object structure and validate via Zod
    const user = AuthUserSchema.parse({
      id: decodedClaims.uid,
      email: decodedClaims.email,
      name: decodedClaims.name || decodedClaims.email?.split('@')[0],
      picture: decodedClaims.picture,
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Session verification failed:', err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
