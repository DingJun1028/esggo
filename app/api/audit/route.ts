import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Server-side audit logging — would use supabaseAdmin in production
    console.log('[5T Audit]', JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ logs: [] });
}