// @ts-nocheck
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { firebaseAdmin } from '@/lib/firebase-admin';

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
    if (!firebaseAdmin) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ user: null }, { status: 500 });
    }

    const decodedClaims = await firebaseAdmin.auth().verifySessionCookie(sessionToken, true);
    
    // Map Firebase claims to our user object structure
    const user = {
      id: decodedClaims.uid,
      email: decodedClaims.email,
      name: decodedClaims.name || decodedClaims.email?.split('@')[0],
      picture: decodedClaims.picture,
    };

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Session verification failed:', err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
