export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getHermesCredentials } from '@/lib/agent/hermes-store';

export async function GET() {
  try {
    const creds = await getHermesCredentials('system_default');
    
    if (!creds || !creds.access_token) {
      return NextResponse.json({ connected: false });
    }

    // Optionally, we could verify the token by fetching user info from Google
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
        }
      });
      
      if (response.ok) {
        const userInfo = await response.json();
        return NextResponse.json({
          connected: true,
          email: userInfo.email,
        });
      } else {
        // Token might be expired, requires refresh
        // For simplicity in this demo, we'll just say connected but unverified
        return NextResponse.json({
          connected: true,
          verified: false,
          message: 'Token exists but might be expired'
        });
      }
    } catch (e) {
      return NextResponse.json({ connected: true, verified: false });
    }
    
  } catch (err: unknown) {
    return NextResponse.json({ connected: false, error: err.message }, { status: 500 });
  }
}
