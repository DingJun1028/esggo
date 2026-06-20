import { NextResponse } from 'next/server';

// GET /api/omni-sync
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}