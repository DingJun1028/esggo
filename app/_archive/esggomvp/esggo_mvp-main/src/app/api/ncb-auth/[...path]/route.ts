import { NextRequest, NextResponse } from 'next/server';

/**
 * 🛰️ NCB Auth Proxy (Refactored)
 * Path: /api/ncb-auth/[...path]
 * This route proxies authentication requests to NoCodeBackend, 
 * moved from /api/auth/ to avoid collision with NextAuth.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const targetPath = resolvedParams.path.join('/');
  const instance = process.env.NCB_INSTANCE || '54686_esg_go_ncb';
  const token = process.env.NCB_API_TOKEN;

  const url = `${process.env.NCB_AUTH_API_URL || 'https://nocodebackend.com/api/auth'}/${targetPath}?Instance=${instance}`;

  try {
    const body = await request.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-NCB-API-Token': token || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Auth Proxy Error', details: error }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    const targetPath = resolvedParams.path.join('/');
  const instance = process.env.NCB_INSTANCE || '54686_esg_go_ncb';
  const token = process.env.NCB_API_TOKEN;

  const url = `${process.env.NCB_AUTH_API_URL || 'https://nocodebackend.com/api/auth'}/${targetPath}?Instance=${instance}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-NCB-API-Token': token || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Auth Proxy Error', details: error }, { status: 500 });
  }
}
