import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 60;

// Static export mode - API routes disabled
export async function GET() {
  return NextResponse.json({
    status: 'evolution_paused',
    message: 'Static export mode - API routes disabled',
    analysis: {
      lastScan: new Date().toISOString(),
      growthSuggestion: '部署為靜態模式，API 路由暫停運作',
      impactScore: 0,
      focusAreas: ['Integrity']
    },
    auditCount: 0
  });
}
