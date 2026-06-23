import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    gitSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_GIT_SHA || 'unknown',
    vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || 'unknown',
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || 'unknown',
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
    timestamp: new Date().toISOString(),
  });
}
